import axios from 'axios';
import { Room, Client, Booking, CreateBookingDto, CreateClientDto, AvailableRoomsQuery } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomsApi = {
  getAllRooms: async (): Promise<Room[]> => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getAvailableRooms: async (query: AvailableRoomsQuery): Promise<Room[]> => {
    const response = await api.get('/rooms/available', { params: query });
    return response.data;
  },

  getRoomById: async (id: string): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
};

export const clientsApi = {
  getAllClients: async (): Promise<Client[]> => {
    const response = await api.get('/clients');
    return response.data;
  },

  getClientById: async (id: string): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (clientData: CreateClientDto): Promise<Client> => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  refreshVipStatus: async (id: string): Promise<Client> => {
    const response = await api.patch(`/clients/${id}/refresh-vip`);
    return response.data;
  },
};

export const bookingsApi = {
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (bookingData: CreateBookingDto): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  cancelBooking: async (id: string, reason?: string): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  getClientBookings: async (clientId: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/client/${clientId}`);
    return response.data;
  },

  getRoomBookings: async (roomId: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/room/${roomId}`);
    return response.data;
  },
};

export default api; 