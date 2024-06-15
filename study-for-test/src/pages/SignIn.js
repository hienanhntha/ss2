import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';
import Notification from "../components/Notification";
import { useSignIn } from "../hooks/api_hooks/user";
import { signInWithGoogle } from "../apis/user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'var(--color-success-darker)'
  });
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const {mutate: signIn, isLoading, isError, error } = useSignIn();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    // let passwordValidation = /^(?=.*[az])(?=.*[AZ])(?=.*\d)(?=.*[@.#$!%*?&^])[ A-Za-z\d@.#$!%*?&]{8,15}$/;

    if (!emailValidation.test(data.get('email'))) {
      setNotification({
        message: "Email must have in format abc@sample.com ...",
        visible: true,
        bgColor: 'red'
      })
      return;
    }

    if (data.get('password').length < 8) {
      setNotification({
        message: "Password must be at least 8 characters",
        visible: true,
        bgColor: 'red'
      })
      return;
    }
    signIn({email: data.get('email'), password: data.get('password')}, {
      onSuccess: (data) => {
        if (data.success) {
          localStorage.setItem('token', data.metadata.token);
          setIsAuthenticated(true);
          navigate("/dashboard");
        } 
        setNotification({
          message: data.message,
          visible: true,
          bgColor: 'red'
        })
      },
    })
  };

  async function signInGoogle() {
    await signInWithGoogle();
  } 

  return <SignInWrapper>
    <Notification message={notification.message} visible={notification.visible} bgColor={notification.bgColor} onClose={() => {setNotification({...notification, visible: false})}}/>
    <img src="assets/logo.png" alt="LOGO" />
    <SignInForm elevation={6} style={{ padding: '16px', marginTop: '20px' }}>
      <Typography variant="h5" align="center">
        Sign In
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
          Sign In
        </Button>
        <GoogleButton
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          onClick={signInGoogle}
        >
          <img src="assets/google.png" alt="google" style={{width: "30px"}}/><div>Sign In with Google Account</div>
        </GoogleButton>
        <Grid container>
          <Grid item>
            <Link to="/sign-up" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </form>
    </SignInForm>
  </SignInWrapper>
}

const SignInWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Đảm bảo các nội dung con được căn giữa theo chiều dọc */
  position: relative;
  top: 10vh;
  font-weight: bold;
`

const SignInForm = styled(Paper)`
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
const GoogleButton = styled(Button)`
  display: flex;
  gap: 20px;
  background-color: transparent !important;
  color: black !important;
`