import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { RoomType } from '../../../database/entities/room.entity';

export class GetAvailableRoomsDto {
  @ApiProperty({ description: 'Check-in date', example: '2024-01-15' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-01-20' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ enum: RoomType, description: 'Room type filter', required: false })
  @IsEnum(RoomType)
  @IsOptional()
  roomType?: RoomType;
} 