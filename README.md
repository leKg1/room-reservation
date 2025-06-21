# Hotel Room Reservation System

A complete hotel room reservation system built with NestJS, PostgreSQL, and Docker.

## Quick Start

### Option 1: Docker (Recommended)
```bash
# Start everything
docker-compose up -d

# Seed the database with sample data
docker-compose exec api yarn seed

# Check if it's working
curl http://localhost:3000/rooms
```

### Option 2: Local Development
```bash
# Install dependencies
yarn install

# Set up environment variables
cp env.example .env
# Edit .env with your local database credentials:
# DB_HOST=localhost
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
# DB_NAME=hotel_db

# Start PostgreSQL and create database
createdb hotel_db

# Start development server
yarn dev
```

## What's Included

- **API Server**: NestJS REST API on port 3000
- **Database**: PostgreSQL with TypeORM
- **Documentation**: Swagger UI at http://localhost:3000/api
- **Database UI**: Adminer at http://localhost:8080
- **Sample Data**: Rooms, clients, and bookings for testing

## Features

### Core Functionality
- View all hotel rooms
- Search available rooms by date range
- Book rooms for specific dates
- Cancel bookings
- VIP client checking via external API
- Prevent double booking conflicts

### API Endpoints
- `GET /rooms` - List all rooms
- `GET /rooms/available` - Find available rooms by dates
- `POST /rooms` - Create new room
- `GET /clients` - List all clients
- `POST /clients` - Create new client
- `PATCH /clients/:id/refresh-vip` - Check VIP status
- `GET /bookings` - List all bookings
- `POST /bookings` - Create new booking
- `PATCH /bookings/:id/cancel` - Cancel booking

## Commands

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server

# Database
yarn seed         # Add sample data
yarn migrate      # Run database migrations

# Docker
docker-compose up -d              # Start all services
docker-compose logs -f api        # View API logs
docker-compose exec api yarn seed # Seed database
docker-compose down               # Stop all services

# Quick Testing
curl http://localhost:3000/rooms                    # Get all rooms
curl http://localhost:3000/api                      # Swagger docs
curl "http://localhost:3000/rooms/available?checkInDate=2025-07-01&checkOutDate=2025-07-05"  # Available rooms
```

## Testing

For comprehensive testing of all business requirements, see **[TESTING_GUIDE.md](TESTING_GUIDE.md)**

**Quick Test URLs:**
- **API Documentation**: http://localhost:3000/api (Swagger UI)
- **Database Admin**: http://localhost:8080 (Adminer)
- **All Rooms**: http://localhost:3000/rooms
- **Available Rooms**: http://localhost:3000/rooms/available?checkInDate=2025-07-01&checkOutDate=2025-07-05

## Database Schema

- **Rooms**: id, number, type, pricePerNight, capacity, description, amenities
- **Clients**: id, firstName, lastName, email, phone, isVip, vipCheckDate
- **Bookings**: id, roomId, clientId, checkInDate, checkOutDate, totalPrice, status

## URLs

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **Database Admin**: http://localhost:8080 (user: `hotel_user`, password: `hotel_password`)
- **Frontend**: http://localhost:3001 (see Frontend section below)

## Tech Stack

- **Backend**: Node.js, NestJS, TypeScript
- **Frontend**: React 18, TypeScript, Material-UI
- **Database**: PostgreSQL, TypeORM
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker, Docker Compose
- **Build Tool**: NX Monorepo

## Business Rules

- No double booking for the same room and overlapping dates
- VIP status is checked via external API with fallback mock
- Room prices are calculated automatically based on nights
- Bookings can be active, completed, or cancelled
- All data is validated using class-validator

## Environment Variables

Copy `env.example` to `.env` and adjust as needed:

```bash
# For Docker (default values)
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=hotel_user
DB_PASSWORD=hotel_password
DB_NAME=hotel_db

# For Local Development
DB_HOST=localhost
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=hotel_db

# Application
NODE_ENV=development
PORT=3000

# External VIP API (optional)
VIP_API_URL=https://api.example.com/vip/check
VIP_API_TOKEN=your-api-token
```

**Note**: The `.env` file is gitignored for security. Always use `env.example` as a template.

## Troubleshooting

**Docker not starting?**
```bash
docker-compose logs api     # Check API logs
docker-compose ps           # Check container status
```

**Database connection issues?**
```bash
docker-compose exec postgres psql -U hotel_user -d hotel_db
```

**API not responding?**
```bash
curl http://localhost:3000/rooms
# Should return JSON array
```

---

## Project Structure

```
room-reservation/
├── apps/api/src/           # NestJS application source
├── database/               # Database initialization
├── docker-compose.yml      # Docker services configuration
├── Dockerfile             # API container definition
├── env.example            # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## Frontend (React UI)

For a beautiful, modern web interface:

### Quick Start
```bash
# Start the backend first
docker-compose up -d
docker-compose exec api yarn seed

# Then start the frontend
cd frontend
docker-compose up -d
```

### Features
- **Rooms Page**: Browse all rooms or search available ones by dates
- **Booking Form**: Easy booking creation with dropdowns and validation
- **Bookings List**: View all bookings with cancel functionality
- **Client Form**: Register new clients with automatic VIP checking
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data from the backend API

### URLs
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

See `frontend/README.md` for detailed frontend documentation.

---