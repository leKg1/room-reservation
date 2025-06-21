# Hotel Reservation Frontend

A React TypeScript frontend for the Hotel Room Reservation System.

## Features

- **Beautiful UI**: Modern Material-UI design with responsive layout
- **Room Browsing**: View all rooms or search available rooms by dates
- **Easy Booking**: Intuitive booking form with client and room selection
- **Booking Management**: View all bookings and cancel active ones
- **Client Management**: Create new clients with automatic VIP checking
- **Real-time Updates**: Live data from the backend API

## Quick Start

### Prerequisites
Make sure the backend API is running first:
```bash
# In the root directory
docker-compose up -d
docker-compose exec api yarn seed
```

### Start Frontend
```bash
# In the frontend directory
docker-compose up -d
```

The frontend will be available at: **http://localhost:3001**

### Alternative: Local Development
```bash
# Install dependencies (if not already done)
yarn install

# Start development server
yarn start
```

The frontend will be available at: **http://localhost:3000**

## URLs

- **Frontend**: http://localhost:3001 (Docker) or http://localhost:3000 (Local)
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api
- **Database Admin**: http://localhost:8080

## Pages & Features

### 1. Rooms Page (`/rooms`)
- **Grid Layout**: Beautiful card-based room display
- **Room Details**: Type, price, capacity, amenities
- **Search Mode**: Toggle between "All Rooms" and "Available Rooms"
- **Date Search**: Find available rooms for specific check-in/check-out dates
- **Real-time Availability**: Live data from the booking system

### 2. Book Room (`/book`)
- **Smart Form**: Dropdowns populated with real rooms and clients
- **Room Selection**: Shows room number, type, and price
- **Client Selection**: Displays client name, email, and VIP status
- **Date Validation**: Prevents invalid date selections
- **Booking Conflicts**: Backend prevents double bookings
- **Success Feedback**: Clear confirmation messages

### 3. Bookings List (`/bookings`)
- **All Bookings**: View complete booking history
- **Status Indicators**: Active (green), Completed (blue), Cancelled (red)
- **Booking Details**: Dates, prices, VIP status, notes
- **Cancel Function**: One-click cancellation with reason dialog
- **Real-time Updates**: Automatic refresh after actions

### 4. New Client (`/clients/new`)
- **Simple Form**: First name, last name, email, phone
- **VIP Integration**: Automatic VIP status checking
- **Form Validation**: Required field validation
- **Success Feedback**: Confirmation with VIP status result

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for beautiful components
- **React Router** for navigation
- **Axios** for API communication
- **Docker** for containerization

## Configuration

### Environment Variables
The frontend automatically connects to the backend. For custom configuration, create a `.env` file:
```bash
REACT_APP_API_URL=http://localhost:3000
```

### Docker Network
The frontend automatically connects to the backend through Docker's shared network (`room-reservation_hotel-network`).

## API Integration

The frontend seamlessly integrates with all backend features:

- **Room Management**: View all rooms and check availability
- **Booking System**: Create bookings with conflict prevention
- **VIP Integration**: Automatic VIP status checking and display
- **Booking Cancellation**: Cancel active bookings with reasons
- **Client Management**: Create and manage client records
- **Real-time Data**: All data is live from the API

## Troubleshooting

**Frontend not loading?**
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs frontend

# Restart if needed
docker-compose restart frontend
```

**API connection issues?**
```bash
# Test backend connectivity
curl http://localhost:3000/rooms

# Check if both containers are on the same network
docker network inspect room-reservation_hotel-network
```

**Build issues?**
```bash
# Clean rebuild
docker-compose down
docker-compose up --build
```

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build

# Run tests
yarn test
```