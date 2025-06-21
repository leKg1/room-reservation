import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'Client first name', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Client last name', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Client email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Client phone number', example: '+1234567890' })
  @IsString()
  phone: string;
} 