import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';
import Notification from "../components/Notification";
import { useSignUp } from "../hooks/api_hooks/user";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'green'
  });
  const { mutate: signUp, isLoading, isError, error } = useSignUp();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get('email');
    let fullName = data.get('fullName');
    let password = data.get('password');

    let emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

    if (!emailValidation.test(email)) {
      setNotification({
        message: "Email must be in the format abc@sample.com...",
        visible: true,
        bgColor: 'red'
      });
      return;
    }

    if (!passwordValidation.test(password)) {
      setNotification({
        message: "Password must include at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and be between 8 - 15 characters",
        visible: true,
        bgColor: 'red',
      });
      return;
    }

    // Gọi API đăng ký
    signUp({ fullName, email, password }, {
      onSuccess: (data) => {
        if (data.success || data.code === 200) {
          setNotification({
            message: data.message,
            visible: true,
            bgColor: 'green'
          });
          setTimeout(() => {
            navigate("/sign-in");
          }, 2000); 
        } else {
          setNotification({
            message: data.message,
            visible: true,
            bgColor: 'red',
          });
        }
      },
    });
  };


  return <SignUpWrapper>
    <Notification message={notification.message} visible={notification.visible} bgColor={notification.bgColor} onClose={() => setNotification({ ...notification, visible: false })} />
    <img src="assets/logo.png" alt="LOGO" />
    <SignUpForm elevation={6} style={{ padding: '16px', marginTop: '20px' }}>
      <Typography variant="h5" align="center">
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="fullName"
          label="Your fullname"
          name="fullName"
          autoComplete="fullName"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Sign Up
        </Button>
        <Grid container style={{ marginTop: "10px" }}>
          <Grid item>
            <Link to="/sign-in" variant="body2">
              Have an account? Sign In
            </Link>
          </Grid>
        </Grid>
      </form>
    </SignUpForm>
  </SignUpWrapper>
}

const SignUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Đảm bảo các nội dung con được căn giữa theo chiều dọc */
  position: relative;
  top: 10vh;
  font-weight: bold;
`

const SignUpForm = styled(Paper)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 20px;
    width: 100%; 
    max-width: 500px;
    height: auto;
    margin: auto;
  }
`
