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

  const renderTable = (batch, level, attempts, subjects) => {
    const sortedAttempts = attempts.sort((a, b) => {
      const numA = parseInt(a.replace('Attempt', ''), 10);
      const numB = parseInt(b.replace('Attempt', ''), 10);
      return numA - numB;
    });

    return (
      <TableContainer component={Paper} className="table-container" style={{ marginBottom: '20px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {` ${batch} -  ${level}`}
        </Typography>
        <Table>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Subject</TableCell>
              {sortedAttempts.map((attempt, index) => (
                <TableCell key={index} className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>{attempt}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={index} className="table-row">
                <TableCell className="table-cell">{subject.name}</TableCell>
                {sortedAttempts.map((attempt, subIndex) => (
                  <TableCell key={subIndex} className="table-cell" style={getStatusStyle(subject[attempt])}>
                    {subject[attempt] || 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const levels = testResults.reduce((acc, result) => {
    const key = `${result.BatchNo}-${result.LevelNo}`;
    if (!acc[key]) {
      acc[key] = { attempts: new Set(), subjects: {} };
    }
    acc[key].attempts.add(result.AttemptNo);
    if (!acc[key].subjects[result.SubjectName]) {
      acc[key].subjects[result.SubjectName] = { name: result.SubjectName };
    }
    acc[key].subjects[result.SubjectName][result.AttemptNo] = result.TestStatus;
    return acc;
  }, {});

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
        {Object.keys(levels).map((key) => {
          const [batch, level] = key.split('-');
          return (
            <Grid item xs={12} key={key}>
              {renderTable(batch, level, Array.from(levels[key].attempts), Object.values(levels[key].subjects))}
            </Grid>
          );
        })}
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