import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';
import { RoomType } from '../../../database/entities/room.entity';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room number', example: '101' })
  @IsString()
  number: string;

  @ApiProperty({ enum: RoomType, description: 'Type of room' })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({ description: 'Price per night', example: 150.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerNight: number;

  @ApiProperty({ description: 'Room capacity', example: 2, default: 2 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({ description: 'Room description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Room amenities', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({ description: 'Is room active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 