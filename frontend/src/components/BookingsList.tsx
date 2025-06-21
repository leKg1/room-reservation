import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Booking } from '../types';
import { bookingsApi } from '../services/api';

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    bookingId: string;
    reason: string;
  }>({
    open: false,
    bookingId: '',
    reason: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const bookingsData = await bookingsApi.getAllBookings();
      setBookings(bookingsData);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await bookingsApi.cancelBooking(cancelDialog.bookingId, cancelDialog.reason);
      setCancelDialog({ open: false, bookingId: '', reason: '' });
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Alert severity="info">
          No bookings found.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Booking #{booking.id.slice(-8)}
                    </Typography>
                    <Chip 
                      label={booking.status.toUpperCase()} 
                      color={getStatusColor(booking.status) as any}
                      size="small"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Check-in
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(booking.checkInDate)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Check-out
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(booking.checkOutDate)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Price
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" color="primary">
                        ${booking.totalPrice}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        VIP Status
                      </Typography>
                      <Typography variant="body1">
                        {booking.clientWasVip ? 'VIP' : 'Regular'}
                      </Typography>
                    </Grid>

                    {booking.notes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body2">
                          {booking.notes}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {booking.status === 'active' && (
                    <Box mt={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => setCancelDialog({
                          open: true,
                          bookingId: booking.id,
                          reason: '',
                        })}
                        size="small"
                      >
                        Cancel Booking
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, bookingId: '', reason: '' })}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? Please provide a reason.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Cancellation Reason"
            fullWidth
            variant="outlined"
            value={cancelDialog.reason}
            onChange={(e) => setCancelDialog(prev => ({ ...prev, reason: e.target.value }))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, bookingId: '', reason: '' })}>
            Keep Booking
          </Button>
          <Button 
            onClick={handleCancelBooking} 
            color="error" 
            variant="contained"
            disabled={!cancelDialog.reason.trim()}
          >
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingsList; 