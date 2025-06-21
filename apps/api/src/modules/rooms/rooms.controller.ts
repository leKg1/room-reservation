import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetAvailableRoomsDto } from './dto/get-available-rooms.dto';
import { Room } from '../../database/entities/room.entity';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully', type: Room })
  create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'List of all rooms', type: [Room] })
  findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available rooms for specific dates' })
  @ApiResponse({ status: 200, description: 'List of available rooms', type: [Room] })
  findAvailable(@Query() dto: GetAvailableRoomsDto): Promise<Room[]> {
    return this.roomsService.findAvailable(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Room details', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findOne(@Param('id') id: string): Promise<Room> {
    return this.roomsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ status: 200, description: 'Room updated successfully', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  update(@Param('id') id: string, @Body() updateRoomDto: Partial<CreateRoomDto>): Promise<Room> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room (soft delete)' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.roomsService.remove(id);
  }
} 