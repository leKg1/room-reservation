export interface Room {
  id: string;
  number: string;
  type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  pricePerNight: string;
  capacity: number;
  description: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookings?: Booking[];
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVip: boolean;
  vipCheckDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  roomId: string;
  clientId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
  clientWasVip: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  room?: Room;
  client?: Client;
}

export interface CreateBookingDto {
  roomId: string;
  clientId: string;
  checkInDate: string;
  checkOutDate: string;
  notes?: string;
}

export interface CreateClientDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AvailableRoomsQuery {
  checkInDate: string;
  checkOutDate: string;
} 