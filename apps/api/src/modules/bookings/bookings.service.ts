import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../../database/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Room } from '../../database/entities/room.entity';
import { Client } from '../../database/entities/client.entity';


@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    return await this.dataSource.transaction(async (manager) => {
      const { roomId, clientId, checkInDate, checkOutDate, notes } = createBookingDto;

      // Validate dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkIn >= checkOut) {
        throw new BadRequestException('Check-out date must be after check-in date');
      }

      if (checkIn < new Date()) {
        throw new BadRequestException('Check-in date cannot be in the past');
      }

      // Verify room and client exist (use manager for transactional context)
      const room = await manager.getRepository(Room).findOne({ where: { id: roomId } });
      if (!room) throw new NotFoundException('Room not found');
      const client = await manager.getRepository(Client).findOne({ where: { id: clientId } });
      if (!client) throw new NotFoundException('Client not found');

      // Lock all bookings for this room (pessimistic write lock)
      await manager.getRepository(Booking).createQueryBuilder('booking')
        .setLock('pessimistic_write')
        .where('booking.roomId = :roomId', { roomId })
        .getMany();

      // Check for conflicting bookings (again, inside transaction)
      const conflictingBooking = await manager.getRepository(Booking)
        .createQueryBuilder('booking')
        .where('booking.roomId = :roomId', { roomId })
        .andWhere('booking.status = :status', { status: BookingStatus.ACTIVE })
        .andWhere(
          '(booking.checkInDate < :checkOut AND booking.checkOutDate > :checkIn)',
          { checkIn: checkInDate, checkOut: checkOutDate }
        )
        .getOne();

      if (conflictingBooking) {
        throw new ConflictException('Room is already booked for the selected dates');
      }

      // Calculate total price
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * parseFloat(room['pricePerNight'].toString());

      // Create booking
      const booking = manager.getRepository(Booking).create({
        roomId,
        clientId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
        clientWasVip: client['isVip'],
        notes,
        status: BookingStatus.ACTIVE,
      });

      return await manager.getRepository(Booking).save(booking);
    });
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['room', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['room', 'client'],
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  async findByClient(clientId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { clientId },
      relations: ['room', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRoom(roomId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { roomId },
      relations: ['room', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot update cancelled booking');
    }

    // If dates are being updated, check for conflicts
    if (updateBookingDto.checkInDate || updateBookingDto.checkOutDate) {
      const newCheckIn = updateBookingDto.checkInDate ? 
        new Date(updateBookingDto.checkInDate) : booking.checkInDate;
      const newCheckOut = updateBookingDto.checkOutDate ? 
        new Date(updateBookingDto.checkOutDate) : booking.checkOutDate;

      if (newCheckIn >= newCheckOut) {
        throw new BadRequestException('Check-out date must be after check-in date');
      }

      // Check for conflicts (excluding current booking)
      const conflictingBooking = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.roomId = :roomId', { roomId: booking.roomId })
        .andWhere('booking.id != :bookingId', { bookingId: id })
        .andWhere('booking.status = :status', { status: BookingStatus.ACTIVE })
        .andWhere(
          '(booking.checkInDate < :checkOut AND booking.checkOutDate > :checkIn)',
          { checkIn: newCheckIn, checkOut: newCheckOut }
        )
        .getOne();

      if (conflictingBooking) {
        throw new ConflictException('Room is already booked for the selected dates');
      }

      // Recalculate total price if dates changed
      if (updateBookingDto.checkInDate || updateBookingDto.checkOutDate) {
        const nights = Math.ceil((newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * parseFloat(booking.room.pricePerNight.toString());
        booking.totalPrice = totalPrice;
      }
    }

    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);
    
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    return await this.bookingRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
} 