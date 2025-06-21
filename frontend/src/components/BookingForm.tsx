import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import { Room, Client, CreateBookingDto } from '../types';
import { roomsApi, clientsApi, bookingsApi } from '../services/api';

const BookingForm: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateBookingDto>({
    roomId: '',
    clientId: '',
    checkInDate: '',
    checkOutDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsData, clientsData] = await Promise.all([
        roomsApi.getAllRooms(),
        clientsApi.getAllClients(),
      ]);
      setRooms(roomsData);
      setClients(clientsData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitLoading(true);
      setError(null);
      setSuccess(null);

      await bookingsApi.createBooking(formData);
      
      setSuccess('Booking created successfully!');
      setFormData({
        roomId: '',
        clientId: '',
        checkInDate: '',
        checkOutDate: '',
        notes: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (field: keyof CreateBookingDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
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
        Book a Room
      </Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={formData.roomId}
                    label="Room"
                    onChange={handleChange('roomId')}
                  >
                    {rooms.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        Room {room.number} - {room.type} (${room.pricePerNight}/night)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={formData.clientId}
                    label="Client"
                    onChange={handleChange('clientId')}
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName} ({client.email})
                        {client.isVip && ' - VIP'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check-in Date"
                  type="date"
                  value={formData.checkInDate}
                  onChange={handleChange('checkInDate')}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check-out Date"
                  type="date"
                  value={formData.checkOutDate}
                  onChange={handleChange('checkOutDate')}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Notes (Optional)"
                  value={formData.notes}
                  onChange={handleChange('notes')}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Any special requests or notes..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<BookIcon />}
                  fullWidth
                  disabled={submitLoading || !formData.roomId || !formData.clientId || !formData.checkInDate || !formData.checkOutDate}
                >
                  {submitLoading ? 'Creating Booking...' : 'Create Booking'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookingForm; 