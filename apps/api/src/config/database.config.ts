import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Room } from '../database/entities/room.entity';
import { Client } from '../database/entities/client.entity';
import { Booking } from '../database/entities/booking.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432'),
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'password',
  database: process.env['DB_NAME'] || 'hotel_reservation',
  entities: [Room, Client, Booking],
  synchronize: process.env['NODE_ENV'] !== 'production',
  logging: process.env['NODE_ENV'] === 'development',
}; 