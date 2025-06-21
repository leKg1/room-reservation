import { DataSource } from 'typeorm';
import { Room } from './entities/room.entity';
import { Client } from './entities/client.entity';
import { Booking } from './entities/booking.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432'),
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'password',
  database: process.env['DB_NAME'] || 'hotel_reservation',
  synchronize: process.env['NODE_ENV'] !== 'production', // Don't use in production
  logging: process.env['NODE_ENV'] === 'development',
  entities: [Room, Client, Booking],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
}); 