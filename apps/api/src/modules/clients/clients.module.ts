import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../database/entities/client.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { VipCheckService } from './vip-check.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService, VipCheckService],
  exports: [ClientsService, VipCheckService],
})
export class ClientsModule {} 