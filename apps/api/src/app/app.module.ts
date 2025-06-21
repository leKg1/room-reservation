import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';
import { RoomsModule } from '../modules/rooms/rooms.module';
import { ClientsModule } from '../modules/clients/clients.module';
import { BookingsModule } from '../modules/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    RoomsModule,
    ClientsModule,
    BookingsModule,
  ],
})
export class AppModule {} 