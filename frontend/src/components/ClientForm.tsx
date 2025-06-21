import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Box,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { CreateClientDto } from '../types';
import { clientsApi } from '../services/api';

const ClientForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateClientDto>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const client = await clientsApi.createClient(formData);
      
      setSuccess(`Client created successfully! ${client.isVip ? 'VIP status detected.' : ''}`);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateClientDto) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Create New Client
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  fullWidth
                  required
                  placeholder="+1-555-0123"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddIcon />}
                  fullWidth
                  disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                >
                  {loading ? 'Creating Client...' : 'Create Client'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Alert severity="info" sx={{ mt: 3 }}>
            VIP status will be automatically checked when creating the client.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientForm; 