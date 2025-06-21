import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';

import { Room } from '../types';
import { roomsApi } from '../services/api';

const RoomsList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'all' | 'available'>('all');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let roomsData: Room[];
      
      if (searchMode === 'available' && checkInDate && checkOutDate) {
        roomsData = await roomsApi.getAvailableRooms({
          checkInDate,
          checkOutDate,
        });
      } else {
        roomsData = await roomsApi.getAllRooms();
      }
      
      setRooms(roomsData);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);
  console.log("rooms", rooms);

  const handleSearch = () => {
    fetchRooms();
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'default';
      case 'deluxe': return 'primary';
      case 'suite': return 'secondary';
      case 'presidential': return 'error';
      default: return 'default';
    }
  };

  const getRoomTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Hotel Rooms
      </Typography>

      {/* Search Controls */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Search Mode</InputLabel>
              <Select
                value={searchMode}
                label="Search Mode"
                onChange={(e) => setSearchMode(e.target.value as 'all' | 'available')}
              >
                <MenuItem value="all">All Rooms</MenuItem>
                <MenuItem value="available">Available Rooms</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {searchMode === 'available' && (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Check-in Date"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Check-out Date"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              fullWidth
              disabled={searchMode === 'available' && (!checkInDate || !checkOutDate)}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {rooms.length === 0 ? (
        <Alert severity="info">
          {searchMode === 'available' 
            ? 'No rooms available for the selected dates.' 
            : 'No rooms found.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                      Room {room.number}
                    </Typography>
                    <Chip 
                      label={getRoomTypeLabel(room.type)} 
                      color={getRoomTypeColor(room.type) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {room.description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2} my={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AttachMoneyIcon fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight="medium">
                        ${room.pricePerNight}/night
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <PeopleIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        {room.capacity} guests
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Amenities:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {room.amenities.map((amenity, index) => (
                        <Chip 
                          key={index} 
                          label={amenity} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RoomsList; 