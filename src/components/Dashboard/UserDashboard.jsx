import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import './UserDashboard.css'; // Ensure you have appropriate CSS for styling

const UserDashboard = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [startDate, setStartDate] = useState('');
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
        setTestResults(response.data.details);

        // Assuming start date is part of the user data
        const startDate = response.data.details.Level1[0].StartDate;
        if (startDate) {
          const date = new Date(startDate);
          const formattedDate = date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          setStartDate(formattedDate);
        }
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

  const renderTable = (level, subjects) => {
    return (
      <TableContainer component={Paper} className="table-container" style={{ marginBottom: '20px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {`Level ${level}`}
        </Typography>
        <Table>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Subject</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Status</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Total Invites</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Last Invited</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={index} className="table-row">
                <TableCell className="table-cell">{subject.SubjectName}</TableCell>
                <TableCell className="table-cell" style={getStatusStyle(subject.TestStatus)}>
                  {subject.TestStatus || 'N/A'}
                </TableCell>
                <TableCell className="table-cell">{subject.TotalInvites}</TableCell>
                <TableCell className="table-cell">{subject.LastInvited}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="lg" className="user-dashboard" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Button onClick={handleLogout} variant="contained" color="secondary" style={{ float: 'right' }}>
          Logout
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          StepUp Program Summary
        </Typography>
        {userData && userData.user ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography variant="h6" component="h2">
                  Welcome, {userData.user.name.charAt(0).toUpperCase() + userData.user.name.slice(1)}
                </Typography>
                <Typography variant="body1">
                  Email: {userData.user.email}
                </Typography>
              </div>
              {startDate && (
                <Typography variant="body1" style={{ textAlign: 'right' }}>
                  Start Date: {startDate}
                </Typography>
              )}
            </div>
          </>
        ) : (
          <Typography variant="body1">No user data available.</Typography>
        )}
      </Paper>
      <Grid container spacing={3}>
        {Object.keys(testResults).map((level) => (
          <Grid item xs={12} key={level}>
            {renderTable(level, testResults[level])}
          </Grid>
        ))}
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