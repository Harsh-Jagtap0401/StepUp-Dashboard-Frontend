import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box, TablePagination, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import './ViewDashboard.css'; // Ensure you have appropriate CSS for styling
import Footer from '../Footer/Footer'; // Import the Footer component
 
const ViewDashboard = () => {
  const [batch, setBatch] = useState('');
  const [level, setLevel] = useState('');
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [isFailModal, setIsFailModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
 
  const handleCellClick = async (field, batch, level) => {
    console.log(`handleCellClick called with field: ${field}, batch: ${batch}, level: ${level}`);
    try {
      let response;
      if (field === 'pass') {
        response = await axios.get('http://localhost:5000/api/candidates/pass', {
          params: {
            batch_no: batch,
            level_no: level,
          },
        });
        setIsFailModal(false);
      } else if (field === 'fail') {
        response = await axios.get('http://localhost:5000/api/candidates/fail', {
          params: {
            batch_no: batch,
            level_no: level,
          },
        });
        setIsFailModal(true);
      } else {
        response = await axios.get('http://localhost:5000/api/participant-name-details', {
          params: {
            batch_id: batch,
            level_id: level,
            status: field.toLowerCase().replace(' ', '_'),
          },
        });
        setIsFailModal(false);
      }
      console.log('API response:', response.data); // Log the API response
      setModalContent(response.data);
      setModalTitle(field);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching participant details:', error);
    }
  };
 
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent([]);
  };
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleTotalInvitesClick = async () => {
    // Fetch the data for the modal
    const response = await fetch('/api/total-invites');
    const data = await response.json();
    setModalContent(data);
    setModalTitle('Total Invites Details');
    setModalOpen(true);
  };
  return (
    <Container maxWidth="lg" className="view-dashboard" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" component="h2" style={{ float: 'right', marginRight: '10px' }}>
          Admin
        </Typography>
        </div>
        <Button onClick={handleLogout} variant="contained" color="secondary" style={{ float: 'right' }}>
          Logout
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          StepUp Dashboard
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
              <TableRow className="table-row" key={index}>
                <TableCell className="table-cell" onClick={() => handleRowClick(row.BatchNo, row.LevelNo)} style={{ cursor: 'pointer' }}>{row.BatchNo}</TableCell>
                <TableCell className="table-cell" onClick={() => handleRowClick(row.BatchNo, row.LevelNo)} style={{ cursor: 'pointer' }}>{row.LevelNo}</TableCell>
                <TableCell className="table-cell" onClick={() => handleCellClick('total_invites', row.BatchNo, row.LevelNo)}>{row.InvitedCount}</TableCell>
                <TableCell className="table-cell" style={{ backgroundColor: '#90EE90' }} onClick={() => handleCellClick('pass', row.BatchNo, row.LevelNo)}>{row.ClearedCutoffCount}</TableCell>
                <TableCell className="table-cell" style={{ backgroundColor: '#ff8383' }} onClick={() => handleCellClick('fail', row.BatchNo, row.LevelNo)}>{row.FailedCutoffCount}</TableCell>
                <TableCell className="table-cell" style={{ backgroundColor: '#F7E7CE' }} onClick={() => handleCellClick('in_progress', row.BatchNo, row.LevelNo)}>{row.InProgressCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography id="modal-title" variant="h6" component="h2">
              {modalTitle}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalContent.length > 0 ? (
              isFailModal ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Email</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Subjects</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Status</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Total Passed Subjects</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modalContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((participant, index) => (
                        <React.Fragment key={index}>
                          {participant.Subjects && participant.Subjects.length > 0 ? (
                            participant.Subjects.map((subject, subIndex) => (
                              <TableRow key={subIndex} style={{ backgroundColor: subIndex % 2 === 0 ? '#f0f8ff' : 'white' }}>
                                {subIndex === 0 && (
                                  <>
                                    <TableCell rowSpan={participant.Subjects.length} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.Name}</TableCell>
                                    <TableCell rowSpan={participant.Subjects.length} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.Email}</TableCell>
                                  </>
                                )}
                                <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{subject.SubjectName}</TableCell>
                                <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{subject.Status}</TableCell>
                                {subIndex === 0 && (
                                  <TableCell rowSpan={participant.Subjects.length} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.Subjects.filter(s => s.Status === 'pass').length}</TableCell>
                                )}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f8ff' : 'white' }}>
                              <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.Name}</TableCell>
                              <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.Email}</TableCell>
                              <TableCell colSpan={3} align="center" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>No subjects found</TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={modalContent.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Email</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Invite for Next Level</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd' }}>Primary Tech Stack</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modalContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((participant, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f8ff' : 'white' }}>
                          <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.Name}</TableCell>
                          <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.Email}</TableCell>
                          <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.InvitedForNextLevel}</TableCell>
                          <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{participant.PrimarySkill}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={modalContent.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              )
            ) : (
              <Typography align="center">No participants found.</Typography>
            )}
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};
 
export default ViewDashboard;