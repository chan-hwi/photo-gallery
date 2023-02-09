'use client';

import React, { useState, useCallback } from "react";
import {
  Box,
  Stack,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from '@/hooks/useAuth';
import axios, { isAxiosError } from "axios";

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const { login } = useAuth();
  const router = useRouter();

  const handleUsernameChange = useCallback(
    (e : React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
    []
  );
  const handlePasswordChange = useCallback(
    (e : React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    []
  );

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(username, password);
      // const userData = await axios.post('http://localhost:3000/api/login', { username, password });
      // console.log(userData);
      router.replace('/posts');
    } catch (err) {
      if (isAxiosError(err) && err?.response?.status === 403) setErrMsg("Invalid username or password");
      else setErrMsg("Internal Server Error");
    }
  };

  return (
    <Box mt={4} maxWidth="sm" mx="auto">
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 6 }}>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              helperText={errMsg}
              error={!!errMsg}
              autoComplete="off"
              fullWidth
              required
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              fullWidth
            >
              Submit
            </Button>
            <Box display='flex' justifyContent='space-between'>
              <Button component={Link} href='/register' variant='text'>Don&apos;t have an account?</Button>
              <Button component={Link} href='/find-password' variant='text'>Forget your password?</Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginForm;
