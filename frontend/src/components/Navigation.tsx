import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ListIcon from '@mui/icons-material/List';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
      <Tabs 
        value={location.pathname} 
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 2 }}
      >
        <Tab 
          icon={<HomeIcon />} 
          label="Rooms" 
          value="/rooms" 
          iconPosition="start"
        />
        <Tab 
          icon={<BookIcon />} 
          label="Book Room" 
          value="/book" 
          iconPosition="start"
        />
        <Tab 
          icon={<ListIcon />} 
          label="Bookings" 
          value="/bookings" 
          iconPosition="start"
        />
        <Tab 
          icon={<PersonAddIcon />} 
          label="New Client" 
          value="/clients/new" 
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );
};

export default Navigation; 