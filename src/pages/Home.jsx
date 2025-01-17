import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="home-container" maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to Test Management System
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={() => navigate('/user')}>
              <CardContent>
                <Typography variant="h5" component="h2" align="center">
                  User
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={() => navigate('/admin')}>
              <CardContent>
                <Typography variant="h5" component="h2" align="center">
                  Admin
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;