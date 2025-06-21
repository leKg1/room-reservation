import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

export enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  PRESIDENTIAL = 'presidential'
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  number: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.STANDARD
  })
  type: RoomType;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ default: 2 })
  capacity: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  amenities: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Booking, booking => booking.room)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 