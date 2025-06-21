import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Room ID', example: 'uuid-string' })
  @IsUUID()
  roomId: string;

  @ApiProperty({ description: 'Client ID', example: 'uuid-string' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ description: 'Check-in date', example: '2024-01-15' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-01-20' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
} 