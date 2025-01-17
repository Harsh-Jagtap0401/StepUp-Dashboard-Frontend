import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, TextField, CircularProgress } from '@mui/material';
import './UploadData.css'; // Ensure you have appropriate CSS for styling

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred during file upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} className="upload-data-container">
      <Typography variant="h5" component="h3" gutterBottom>
        Upload Excel File
      </Typography>
      <form onSubmit={handleUpload} className="upload-form">
        <TextField
          type="file"
          accept=".xls, .xlsx"
          onChange={handleFileChange}
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </form>
      {message && (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default UploadData;