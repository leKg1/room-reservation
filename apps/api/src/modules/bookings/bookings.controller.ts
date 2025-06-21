import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from '../../database/entities/booking.entity';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: Booking })
  @ApiResponse({ status: 400, description: 'Invalid booking data or dates' })
  @ApiResponse({ status: 404, description: 'Room or client not found' })
  @ApiResponse({ status: 409, description: 'Room already booked for selected dates' })
  create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'List of all bookings', type: [Booking] })
  findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get bookings by client ID' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiResponse({ status: 200, description: 'List of client bookings', type: [Booking] })
  findByClient(@Param('clientId') clientId: string): Promise<Booking[]> {
    return this.bookingsService.findByClient(clientId);
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get bookings by room ID' })
  @ApiParam({ name: 'roomId', description: 'Room UUID' })
  @ApiResponse({ status: 200, description: 'List of room bookings', type: [Booking] })
  findByRoom(@Param('roomId') roomId: string): Promise<Booking[]> {
    return this.bookingsService.findByRoom(roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully', type: Booking })
  @ApiResponse({ status: 400, description: 'Invalid booking data or cannot update cancelled booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 409, description: 'Room already booked for selected dates' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<Booking> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully', type: Booking })
  @ApiResponse({ status: 400, description: 'Booking is already cancelled' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  cancel(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.cancel(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
} 