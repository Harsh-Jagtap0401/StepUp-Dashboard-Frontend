import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import './UserDashboard.css'; // Ensure you have appropriate CSS for styling

const UserDashboard = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userData } = state || {};
  const [testResults, setTestResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('User data:', userData);
    if (userData && userData.user && userData.user.email) {
      fetchUserDetails(userData.user.email);
    }
  }, [userData]);

  const fetchUserDetails = async (email) => {
    try {
      console.log('Fetching details for email:', email);
      const response = await axios.get('http://localhost:5000/user/details', {
        params: { email },
      });
      if (response.status === 200) {
        console.log('Fetched user details:', response.data);
        setTestResults(response.data.test_results);
      } else {
        console.error('Failed to fetch user details:', response);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/');
  };

  const handleQuerySubmit = () => {
    // Handle query submission logic here
    console.log('Query submitted:', query);
    setQuery('');
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Failed CutOff':
        return { backgroundColor: '#ff8383', color: 'black' };
      case 'Cleared CutOff':
        return { backgroundColor: '#90EE90', color: 'black' };
      case 'InProgress':
        return { backgroundColor: 'skyblue', color: 'black' };
      default:
        return {};
    }
  };

  return (
    <Container maxWidth="lg" className="user-dashboard" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Button onClick={handleLogout} variant="contained" color="secondary" style={{ float: 'right' }}>
          Logout
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          StepUp Program
        </Typography>
        {userData && userData.user ? (
          <>
            <Typography variant="h6" component="h2">
              Welcome, {userData.user.name.charAt(0).toUpperCase() + userData.user.name.slice(1)}
            </Typography>
            <Typography variant="body1">
              Email: {userData.user.email}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">No user data available.</Typography>
        )}
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Test Summary
            </Typography>
            <TableContainer component={Paper} className="table-container">

      <Table>
        <TableHead>
        <TableRow className="table-header-row">
                    <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Batch No</TableCell>
                    <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em'}}>Level No</TableCell>
                    <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Subject Name</TableCell>
                    <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Attempt No</TableCell>
                    <TableCell className="table-cell-no-border" style={{ fontWeight: 'bold', fontSize: '1em' }}>Test Status</TableCell>
                  </TableRow>
        </TableHead>
        <TableBody>
          {testResults.map((result, index) => (
            <TableRow key={index} className="table-row">
              <TableCell className="table-cell">{result.BatchNo}</TableCell>
              <TableCell className="table-cell">{result.LevelNo}</TableCell>
              <TableCell className="table-cell">{result.SubjectName}</TableCell>
              <TableCell className="table-cell">{result.AttemptNo}</TableCell>
              <TableCell className="table-cell-no-border" style={getStatusStyle(result.TestStatus)}>
                        {result.TestStatus}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              For Queries
            </Typography>
            <TextField
              label="Your Query"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <Button variant="contained" color="primary" onClick={handleQuerySubmit}>
              Submit
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard;