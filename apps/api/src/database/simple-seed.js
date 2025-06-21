const { Client } = require('pg');

async function seed() {
  const client = new Client({
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    user: process.env['DB_USERNAME'] || 'hotel_user',
    password: process.env['DB_PASSWORD'] || 'hotel_password',
    database: process.env['DB_NAME'] || 'hotel_db',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Clean existing data
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM clients');
    await client.query('DELETE FROM rooms');
    console.log('Cleaned existing data');

    // Create rooms
    const rooms = [
      ['101', 'standard', 100, 2, 'Comfortable standard room with city view', JSON.stringify(['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'])],
      ['102', 'standard', 100, 2, 'Standard room with garden view', JSON.stringify(['WiFi', 'TV', 'Air Conditioning'])],
      ['201', 'deluxe', 200, 3, 'Spacious deluxe room with balcony', JSON.stringify(['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Safe'])],
      ['301', 'suite', 400, 4, 'Luxury suite with separate living area', JSON.stringify(['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Area', 'Jacuzzi', 'Safe'])],
      ['401', 'presidential', 800, 6, 'Presidential suite with panoramic city view', JSON.stringify(['WiFi', 'TV', 'Air Conditioning', 'Full Kitchen', 'Living Area', 'Jacuzzi', 'Safe', 'Butler Service'])],
    ];

    const roomIds = [];
    for (const [number, type, price, capacity, description, amenities] of rooms) {
      const result = await client.query(
        `INSERT INTO rooms (id, number, type, "pricePerNight", capacity, description, amenities, "isActive", "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6::jsonb, true, NOW(), NOW()) RETURNING id`,
        [number, type, price, capacity, description, amenities]
      );
      roomIds.push(result.rows[0].id);
    }
    console.log(`✅ Created ${roomIds.length} rooms`);

    // Create clients
    const clients = [
      ['John', 'Doe', 'john.doe@example.com', '+1-555-0101', false, null],
      ['Jane', 'Smith', 'jane.smith@vip.com', '+1-555-0102', true, new Date()],
      ['Alice', 'Johnson', 'alice.johnson@premium.com', '+1-555-0103', true, new Date()],
      ['Bob', 'Wilson', 'bob.wilson@gmail.com', '+1-555-0104', false, null],
      ['Charlie', 'Brown', 'charlie.brown@gold.com', '+1-555-0105', true, new Date()],
    ];

    const clientIds = [];
    for (const [firstName, lastName, email, phone, isVip, vipCheckDate] of clients) {
      const result = await client.query(
        `INSERT INTO clients (id, "firstName", "lastName", email, phone, "isVip", "vipCheckDate", "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
        [firstName, lastName, email, phone, isVip, vipCheckDate]
      );
      clientIds.push(result.rows[0].id);
    }
    console.log(`✅ Created ${clientIds.length} clients`);

    // Create bookings
    const today = new Date();
    const bookings = [
      [
        roomIds[0], 
        clientIds[0], 
        new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), 
        new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), 
        300, 
        'active', 
        false, 
        'Early check-in requested'
      ],
      [
        roomIds[2], 
        clientIds[1], 
        new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), 
        new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000), 
        600, 
        'active', 
        true, 
        'VIP amenities requested'
      ],
      [
        roomIds[4], 
        clientIds[2], 
        new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), 
        new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), 
        1200, 
        'completed', 
        true, 
        'Excellent stay, frequent customer'
      ],
    ];

    let bookingCount = 0;
    for (const [roomId, clientId, checkIn, checkOut, totalPrice, status, clientWasVip, notes] of bookings) {
      await client.query(
        `INSERT INTO bookings (id, "roomId", "clientId", "checkInDate", "checkOutDate", "totalPrice", status, "clientWasVip", notes, "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [roomId, clientId, checkIn, checkOut, totalPrice, status, clientWasVip, notes]
      );
      bookingCount++;
    }
    console.log(`✅ Created ${bookingCount} bookings`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Rooms: ${roomIds.length}`);
    console.log(`- Clients: ${clientIds.length}`);
    console.log(`- Bookings: ${bookingCount}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed(); 