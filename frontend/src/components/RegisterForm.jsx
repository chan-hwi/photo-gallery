import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Paper,
  TextField,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import FileUpload from './FileUpload';
import useAuth from '../hooks/useAuth';

const initialUser = {
    username: "",
    password: "",
    nickname: "",
    email: "",
    profilesrc: ""
};

function RegisterForm() {
  const [user, setUser] = useState(initialUser);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usrErrMsg, setUsrErrMsg] = useState("");
  const [pwErrMsg, setPwErrMsg] = useState("");
  const [cpErrMsg, setCpErrMsg] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
    
  const handleChange = (e) => {
    setUser(user => ({ ...user, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password.length < 6) {
      setPwErrMsg("The password should be at least 6 characters");
      return;
    }
    if (user.password !== confirmPassword) return;

    try {
      await register(user);
      navigate('/');
    } catch (err) {
      if (err?.response?.status === 403) setUsrErrMsg(err?.response?.data?.message);
      else setUsrErrMsg("Internal Server Error");
    }
  };

  useEffect(() => {
    if (user.password.length >= 6) setPwErrMsg("");
  }, [user.password]);

  useEffect(() => {
    if (user.password !== confirmPassword) setCpErrMsg("Please confirm your password");
    else setCpErrMsg("");
  }, [user.password, confirmPassword]);

  return (
    <Box mt={4} maxWidth="sm" mx="auto">
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 6 }}>
          Sign up
        </Typography>
        <form onSubmit={handleSubmit}>
            {/* <FileUpload>
                
            </FileUpload> */}
          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              value={user.username}
              onChange={handleChange}
              error={!!usrErrMsg}
              helperText={usrErrMsg}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={user.password}
              onChange={handleChange}
              autoComplete="off"
              error={!!pwErrMsg}
              helperText={pwErrMsg}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="off"
              error={!!cpErrMsg}
              helperText={cpErrMsg}
              fullWidth
              required
            />
            <Divider />
            <TextField
              label="nickname"
              name="nickname"
              value={user.nickname}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="email address"
              name="email"
              type="email"
              placeholder="example@domain.com"
              value={user.email}
              onChange={handleChange}
              fullWidth
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
              <Button component={Link} to='/login' variant='text'>Already have an account?</Button>
              <Button component={Link} to='/' variant='text'>Cancel</Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default RegisterForm;
