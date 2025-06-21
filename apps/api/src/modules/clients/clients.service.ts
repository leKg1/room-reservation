import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../database/entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { VipCheckService } from './vip-check.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private vipCheckService: VipCheckService,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Check if client with email already exists
    const existingClient = await this.clientRepository.findOne({
      where: { email: createClientDto.email }
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    // Check VIP status
    const vipStatus = await this.vipCheckService.checkVipStatus(createClientDto.email);
    
    const client = this.clientRepository.create({
      ...createClientDto,
      isVip: vipStatus.isVip,
      vipCheckDate: vipStatus.isVip ? new Date() : undefined,
    });

    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({
      relations: ['bookings'],
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });
    
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    return client;
  }

  async findByEmail(email: string): Promise<Client | undefined> {
    const client = await this.clientRepository.findOne({
      where: { email },
      relations: ['bookings'],
    });
    return client || undefined;
  }

  async update(id: string, updateClientDto: Partial<CreateClientDto>): Promise<Client> {
    const client = await this.findOne(id);
    
         // If email is being updated, check VIP status again
     if (updateClientDto.email && updateClientDto.email !== client.email) {
       const vipStatus = await this.vipCheckService.checkVipStatus(updateClientDto.email);
       client.isVip = vipStatus.isVip;
       if (vipStatus.isVip) {
         client.vipCheckDate = new Date();
       }
     }
    
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }

  async refreshVipStatus(id: string): Promise<Client> {
    const client = await this.findOne(id);
    const vipStatus = await this.vipCheckService.checkVipStatus(client.email);
    
    client.isVip = vipStatus.isVip;
    client.vipCheckDate = new Date();
    
    return await this.clientRepository.save(client);
  }
} 