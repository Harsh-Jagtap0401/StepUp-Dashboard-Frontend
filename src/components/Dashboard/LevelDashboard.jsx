import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import './LevelDashboard.css'; // Ensure you have appropriate CSS for styling
import Footer from '../Footer/Footer'; // Import the Footer component

const LevelDashboard = () => {
  const [data, setData] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { batch, level } = state || {};

  useEffect(() => {
    if (batch && level) {
      fetchData(batch, level);
    }
  }, [batch, level]);

  const fetchData = async (batch, level) => {
    try {
      const response = await axios.get('http://localhost:5000/level-details', {
        params: {
          batch,
          level,
        },
      });
      const transformedData = transformData(response.data);
      setData(transformedData.data);
      setAttempts(transformedData.attempts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const transformData = (data) => {
    const subjects = {};
    const attempts = new Set();

    data.forEach((item) => {
      attempts.add(item.AttemptNo);
      if (!subjects[item.SubjectName]) {
        subjects[item.SubjectName] = {};
      }
      subjects[item.SubjectName][item.AttemptNo] = {
        TotalInvites: item.TotalInvites,
        ClearedCutoffCount: item.ClearedCutoffCount,
        FailedCutoffCount: item.FailedCutoffCount,
        InProgressCount: item.InProgressCount,
      };
    });

    return {
      data: subjects,
      attempts: Array.from(attempts).sort((a, b) => {
        const numA = parseInt(a.replace('Attempt', ''), 10);
        const numB = parseInt(b.replace('Attempt', ''), 10);
        return numA - numB;
      }),
    };
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" className="level-dashboard" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Button onClick={handleLogout} variant="contained" color="secondary" style={{ float: 'right' }}>
          Logout
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Level Details
        </Typography>
        <Typography variant="h6" component="h2">
          Batch: {batch}
        </Typography>
        <Typography variant="h6" component="h2">
          Level: {level}
        </Typography>
      </Paper>
      <TableContainer component={Paper} className="table-container" style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow className="table-header-row" style={{ fontWeight: 'bold', fontSize: '1em' }} >
              <TableCell style={{ fontWeight: 'bold', fontSize: '1em', borderTop: '1px solid black',borderBottom: '1px solid black', borderLeft: '1px solid black'}} rowSpan={2}>Subject Name</TableCell>
              {attempts.map((attempt, index) => (
                <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em', borderBottom: '1px solid black'}} key={index} colSpan={4} align="center">
                  {attempt}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="table-header-row"  >
              {attempts.map((attempt, index) => (
                <React.Fragment key={index}>
                  <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Total Invites</TableCell>
                  <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Cleared Cutoff</TableCell>
                  <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>Failed Cutoff</TableCell>
                  <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>In Progress</TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(data)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subject, index) => (
                <TableRow
                  className='table-row'
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#FFF3F3' : 'offwhite',
                  }}
                >
                  <TableCell className="table-cell" style={{ fontWeight: 'bold', fontSize: '1em' }}>{subject}</TableCell>
                  {attempts.map((attempt, subIndex) => (
                    <React.Fragment key={subIndex}>
                      <TableCell className="table-cell">
                        {data[subject][attempt] ? data[subject][attempt].TotalInvites : 'N/A'}
                      </TableCell>
                      <TableCell className="table-cell">
                        {data[subject][attempt] ? data[subject][attempt].ClearedCutoffCount : 'N/A'}
                      </TableCell>
                      <TableCell className="table-cell">
                        {data[subject][attempt] ? data[subject][attempt].FailedCutoffCount : 'N/A'}
                      </TableCell>
                      <TableCell className="table-cell">
                        {data[subject][attempt] ? data[subject][attempt].InProgressCount : 'N/A'}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Object.keys(data).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
    </Container>
  );
};

export default LevelDashboard;