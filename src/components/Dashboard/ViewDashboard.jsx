import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ViewDashboard.css'; // Ensure you have appropriate CSS for styling
import Footer from '../Footer/Footer'; // Import the Footer component

const ViewDashboard = () => {
  const [batch, setBatch] = useState('');
  const [level, setLevel] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [batch, level]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard', {
        params: {
          batch: batch || null,
          level: level || null,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/');
  };

  const handleRowClick = (batch, level) => {
    navigate('/admin/level-dashboard', { state: { batch, level } });
  };

  return (
    <Container maxWidth="lg" className="view-dashboard" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Button onClick={handleLogout} variant="contained" color="secondary" style={{ float: 'right' }}>
          Logout
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
      </Paper>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Batch"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Batch1">Batch1</MenuItem>
            <MenuItem value="Batch2">Batch2</MenuItem>
            {/* Add more batch options here */}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Level1">Level1</MenuItem>
            <MenuItem value="Level2">Level2</MenuItem>
            {/* Add more level options here */}
          </TextField>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell className="table-cell"  style={{ fontWeight: 'bold', fontSize: '1em' }}>Batch No</TableCell>
              <TableCell className="table-cell"  style={{ fontWeight: 'bold', fontSize: '1em' }}>Level No</TableCell>
              <TableCell className="table-cell"  style={{ fontWeight: 'bold', fontSize: '1em' }}>Total Invites</TableCell>
              <TableCell className="table-cell"  style={{ fontWeight: 'bold', fontSize: '1em', padding: '0px 40px 0px 40px'}}>Pass</TableCell>
              <TableCell className="table-cell"  style={{ fontWeight: 'bold', fontSize: '1em', padding: '0px 40px 0px 40px'}}>Fail</TableCell>
              <TableCell className="table-cell"  style={{ fontWeight: 'bold', fontSize: '1em' }}>In Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow className="table-row" key={index} onClick={() => handleRowClick(row.BatchNo, row.LevelNo)} style={{ cursor: 'pointer' }}>
                <TableCell className="table-cell"  >{row.BatchNo}</TableCell>
                <TableCell className="table-cell" >{row.LevelNo}</TableCell>
                <TableCell className="table-cell" >{row.InvitedCount}</TableCell>
                <TableCell className="table-cell" style={{backgroundColor: '#90EE90'}} >{row.ClearedCutoffCount}</TableCell>
                <TableCell className="table-cell" style={{backgroundColor: '#ff8383'}} >{row.FailedCutoffCount}</TableCell>
                <TableCell className="table-cell" style={{backgroundColor: '#F7E7CE'}}  >{row.InProgressCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </Container>
  );
};

export default ViewDashboard;