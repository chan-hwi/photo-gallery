import { useState, useCallback } from "react";
import {
  Box,
  Stack,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleUsernameChange = useCallback(
    (e) => setUsername(e.target.value),
    []
  );
  const handlePasswordChange = useCallback(
    (e) => setPassword(e.target.value),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      if (err?.response?.status === 403) setErrMsg("Invalid username or password");
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
              <Button component={Link} to='/register' variant='text'>Don't have an account?</Button>
              <Button component={Link} to='/find-password' variant='text'>Forget your password?</Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginForm;
