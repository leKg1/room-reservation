import { AppDataSource } from './data-source';
import { Room, RoomType } from './entities/room.entity';
import { Client } from './entities/client.entity';
import { Booking, BookingStatus } from './entities/booking.entity';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source initialized');

    // Clean existing data
    await AppDataSource.query('DELETE FROM bookings');
    await AppDataSource.query('DELETE FROM clients');
    await AppDataSource.query('DELETE FROM rooms');

    const roomRepository = AppDataSource.getRepository(Room);
    const clientRepository = AppDataSource.getRepository(Client);
    const bookingRepository = AppDataSource.getRepository(Booking);

    // Create rooms
    const rooms = [
      {
        number: '101',
        type: RoomType.STANDARD,
        pricePerNight: 100,
        capacity: 2,
        description: 'Comfortable standard room with city view',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
      },
      {
        number: '102',
        type: RoomType.STANDARD,
        pricePerNight: 100,
        capacity: 2,
        description: 'Standard room with garden view',
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
      },
      {
        number: '201',
        type: RoomType.DELUXE,
        pricePerNight: 200,
        capacity: 3,
        description: 'Spacious deluxe room with balcony',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Safe'],
      },
      {
        number: '202',
        type: RoomType.DELUXE,
        pricePerNight: 200,
        capacity: 3,
        description: 'Deluxe room with ocean view',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Ocean View'],
      },
      {
        number: '301',
        type: RoomType.SUITE,
        pricePerNight: 400,
        capacity: 4,
        description: 'Luxury suite with separate living area',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Area', 'Jacuzzi', 'Safe'],
      },
      {
        number: '401',
        type: RoomType.PRESIDENTIAL,
        pricePerNight: 800,
        capacity: 6,
        description: 'Presidential suite with panoramic city view',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Full Kitchen', 'Living Area', 'Jacuzzi', 'Safe', 'Butler Service'],
      },
    ];

    const savedRooms = await roomRepository.save(rooms);
    console.log(`Created ${savedRooms.length} rooms`);

    // Create clients
    const clients = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0101',
        isVip: false,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@vip.com',
        phone: '+1-555-0102',
        isVip: true,
        vipCheckDate: new Date(),
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@premium.com',
        phone: '+1-555-0103',
        isVip: true,
        vipCheckDate: new Date(),
      },
      {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob.wilson@gmail.com',
        phone: '+1-555-0104',
        isVip: false,
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@gold.com',
        phone: '+1-555-0105',
        isVip: true,
        vipCheckDate: new Date(),
      },
    ];

    const savedClients = await clientRepository.save(clients);
    console.log(`Created ${savedClients.length} clients`);

    // Create bookings (some future, some past)
    const today = new Date();
    const bookings = [
      {
        roomId: savedRooms[0].id,
        clientId: savedClients[0].id,
        checkInDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        checkOutDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        totalPrice: 300,
        status: BookingStatus.ACTIVE,
        clientWasVip: savedClients[0].isVip,
        notes: 'Early check-in requested',
      },
      {
        roomId: savedRooms[2].id,
        clientId: savedClients[1].id,
        checkInDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        checkOutDate: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
        totalPrice: 600,
        status: BookingStatus.ACTIVE,
        clientWasVip: savedClients[1].isVip,
        notes: 'VIP amenities requested',
      },
      {
        roomId: savedRooms[4].id,
        clientId: savedClients[2].id,
        checkInDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        checkOutDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        totalPrice: 1200,
        status: BookingStatus.COMPLETED,
        clientWasVip: savedClients[2].isVip,
        notes: 'Excellent stay, frequent customer',
      },
      {
        roomId: savedRooms[1].id,
        clientId: savedClients[3].id,
        checkInDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        checkOutDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        totalPrice: 400,
        status: BookingStatus.ACTIVE,
        clientWasVip: savedClients[3].isVip,
        notes: 'Business trip',
      },
    ];

    const savedBookings = await bookingRepository.save(bookings);
    console.log(`Created ${savedBookings.length} bookings`);

    console.log('Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Rooms: ${savedRooms.length}`);
    console.log(`- Clients: ${savedClients.length} (${savedClients.filter(c => c.isVip).length} VIP)`);
    console.log(`- Bookings: ${savedBookings.length}`);
    
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed(); 