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
      const response = await axios.get('http://localhost:5000/api/dashboard1', {
        params: {
          batch: batch || null,
          level: level || null,
        },
      });
      console.log('Response data:', response.data); // Log the response data
      const formattedData = formatData(response.data);
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatData = (data) => {
    const formattedData = [];
    
    // Process Level 1 data
    const level1Data = data.level1;
    if (level1Data) {
      level1Data.invite_count_lvl1.forEach((invite) => {
        const batchNo = invite.BatchNo;
        const levelNo = invite.LevelNo;
        const invitedCount = invite.InviteCount;
        const passedCount = level1Data.passed_count_lvl1.find((item) => item.BatchNo === batchNo)?.ParticipantCount || 0;
        const failedCount = level1Data.failed_count_lvl1.find((item) => item.BatchNo === batchNo)?.ParticipantCount || 0;
        const inProgressCount = level1Data.in_progress_count_lvl1.find((item) => item.BatchNo === batchNo)?.InProgressCount || 0;
        formattedData.push({
          BatchNo: batchNo,
          LevelNo: levelNo,
          InvitedCount: invitedCount,
          ClearedCutoffCount: passedCount,
          FailedCutoffCount: failedCount,
          InProgressCount: inProgressCount,
        });
      });
    }

    // Process Level 2 data
    const level2Data = data.level2;
    if (level2Data) {
      console.log('Level 2 In Progress Data:', level2Data.in_progress_count_lvl2);
      level2Data.invite_count_lvl2.forEach((invite) => {
        const batchNo = invite.BatchNo;
        const levelNo = invite.LevelNo;
        const invitedCount = invite.InviteCount;
        const passedCount = level2Data.passed_count_lvl2.find((item) => item.BatchNo === batchNo)?.ParticipantCount || 0;
        const failedCount = level2Data.failed_count_lvl2.find((item) => item.BatchNo === batchNo)?.ParticipantCount || 0;
        const inProgressCount = level2Data.in_progress_count_lvl2.find((item) => item.BatchNo === batchNo)?.ParticipantCount || 0; // Use ParticipantCount for Level 2
        console.log(`Batch: ${batchNo}, In Progress Count: ${inProgressCount}`);
        formattedData.push({
          BatchNo: batchNo,
          LevelNo: levelNo,
          InvitedCount: invitedCount,
          ClearedCutoffCount: passedCount,
          FailedCutoffCount: failedCount,
          InProgressCount: inProgressCount,
        });
      });
    }

    return formattedData;
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
            label=" All Batch"
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
            label=" All Level"
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
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Batch No</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Level No</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Total Invites</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em', padding: '0px 40px 0px 40px' }}>Pass</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em', padding: '0px 40px 0px 40px' }}>Fail</TableCell>
              <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>In Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow className="table-row" key={index} onClick={() => handleRowClick(row.BatchNo, row.LevelNo)} style={{ cursor: 'pointer' }}>
                <TableCell className="table-cell">{row.BatchNo}</TableCell>
                <TableCell className="table-cell">{row.LevelNo}</TableCell>
                <TableCell className="table-cell">{row.InvitedCount}</TableCell>
                <TableCell className="table-cell" style={{ backgroundColor: '#90EE90' }}>{row.ClearedCutoffCount}</TableCell>
                <TableCell className="table-cell" style={{ backgroundColor: '#ff8383' }}>{row.FailedCutoffCount}</TableCell>
                <TableCell className="table-cell" style={{ backgroundColor: '#F7E7CE' }}>{row.InProgressCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ViewDashboard;