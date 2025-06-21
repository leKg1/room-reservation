import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';
import { BookingStatus } from '../../../database/entities/booking.entity';

export class UpdateBookingDto {
  @ApiProperty({ description: 'Check-in date', example: '2024-01-15', required: false })
  @IsDateString()
  @IsOptional()
  checkInDate?: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-01-20', required: false })
  @IsDateString()
  @IsOptional()
  checkOutDate?: string;

  @ApiProperty({ enum: BookingStatus, description: 'Booking status', required: false })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
} 