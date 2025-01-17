import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/api';
import Swal from 'sweetalert2';
import './Auth.css';
import Footer from '../Footer/Footer'; // Import the Footer component

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      navigate('/user/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      if (email === 'admin@example.com' && password === 'admin123') {
        sessionStorage.setItem('userData', JSON.stringify({ email }));
        navigate('/admin/dashboard');
      } else {
        if (!email.endsWith('@harbingergroup.com')) {
          setErrorMessage('Email must contain "@harbingergroup.com"');
          return;
        }
        const response = await axios.post('/user/login', { email, password });
        if (response.status === 200) {
          const userData = response.data;
          sessionStorage.setItem('userData', JSON.stringify(userData));
          navigate('/user/dashboard', { state: { userData } });
        } else {
          setErrorMessage('Invalid credentials');
        }
      }
    } catch (error) {
      setErrorMessage('Invalid credentials');
      console.error('Login error', error);
    }
  };
  const handleRegister = async () => {
    try {
      if (!email.endsWith('@harbingergroup.com')) {
        setErrorMessage('Email must contain "@harbingergroup.com"');
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Email must contain "@harbingergroup.com"',
        });
        return;
      }
      const response = await axios.post('/user/signup', { name, email, password });
      if (response.status === 201) {
        Swal.fire({
          title: 'Registered successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          setIsLogin(true);
        });
      } else {
        setErrorMessage('Registration error');
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Registration error',
        });
      }
    } catch (error) {
      setErrorMessage('Registration error');
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: 'Registration error',
      });
      console.error('Registration error', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="auth-container">
      {sessionStorage.getItem('userData') && (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      )}
      <h1>StepUp Program</h1>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {isLogin ? (
        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            Don't have an existing account?{' '}
            <span onClick={() => setIsLogin(false)} style={{ color: 'blue', cursor: 'pointer' }}>
              Register
            </span>
          </p>
        </div>
      ) : (
        <div className="register-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
          <p>
            Already have an account?{' '}
            <span onClick={() => setIsLogin(true)} style={{ color: 'blue', cursor: 'pointer' }}>
              Login
            </span>
          </p>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
     
    </div>

     
  );
};

export default UserLogin;