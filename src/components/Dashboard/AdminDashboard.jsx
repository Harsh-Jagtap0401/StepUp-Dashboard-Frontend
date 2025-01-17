import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';
import UploadData from './UploadData';
import './AdminDashboard.css'; // Ensure you have appropriate CSS for styling
import Footer from '../Footer/Footer'; // Import the Footer component

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <Container maxWidth="lg" className="admin-dashboard">
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Button onClick={handleLogout} variant="contained" color="secondary" style={{ float: 'right' }}>
          Logout
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
      </Paper>
      <Grid container spacing={3} direction="column" alignItems="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Dashboard
            </Typography>
            <Button
              onClick={() => navigate('/admin/view-dashboard')}
              variant="contained"
              color="primary"
              fullWidth
            >
              View
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Upload Data
            </Typography>
            <UploadData />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;