-- Hotel Room Reservation Database Schema
-- This file is used by Docker to initialize the PostgreSQL database

-- Create database if it doesn't exist (this runs automatically in Docker)
-- The database name is set via environment variables in docker-compose.yml

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any additional database setup here
-- The actual tables will be created by TypeORM synchronization

-- Create indexes for better performance (will be created after TypeORM sync)
-- These are examples and TypeORM will handle most of the schema creation

-- Example: Create function to prevent overlapping bookings (PostgreSQL specific)
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there are any overlapping active bookings for the same room
    IF EXISTS (
        SELECT 1 FROM bookings 
        WHERE room_id = NEW.room_id 
        AND id != COALESCE(NEW.id, uuid_generate_v4())
        AND status = 'active'
        AND (
            (check_in_date < NEW.check_out_date AND check_out_date > NEW.check_in_date)
        )
    ) THEN
        RAISE EXCEPTION 'Room is already booked for overlapping dates';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: The trigger will be created after TypeORM creates the tables
-- You can manually create it after the application starts:
-- CREATE TRIGGER booking_overlap_check
--     BEFORE INSERT OR UPDATE ON bookings
--     FOR EACH ROW EXECUTE FUNCTION check_booking_overlap(); 