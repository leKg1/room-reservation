import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../database/entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetAvailableRoomsDto } from './dto/get-available-rooms.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find({
      where: { isActive: true },
      relations: ['bookings'],
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id, isActive: true },
      relations: ['bookings'],
    });
    
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    
    return room;
  }

  async findAvailable(dto: GetAvailableRoomsDto): Promise<Room[]> {
    const { checkInDate, checkOutDate, roomType } = dto;
    
    const query = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.bookings', 'booking')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere(
        '(booking.id IS NULL OR ' +
        '(booking.status != :activeStatus OR ' +
        '(booking.checkOutDate <= :checkIn OR booking.checkInDate >= :checkOut)))',
        {
          activeStatus: 'active',
          checkIn: checkInDate,
          checkOut: checkOutDate,
        }
      );

    if (roomType) {
      query.andWhere('room.type = :roomType', { roomType });
    }

    return await query.getMany();
  }

  async update(id: string, updateRoomDto: Partial<CreateRoomDto>): Promise<Room> {
    const room = await this.findOne(id);
    Object.assign(room, updateRoomDto);
    return await this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    room.isActive = false;
    await this.roomRepository.save(room);
  }
} 