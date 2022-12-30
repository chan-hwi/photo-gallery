import { useState, useCallback, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Login } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import ProfileMenu from "./ProfileMenu";
import useUser from '../hooks/useUser';

const btnLink = {
  component: Link,
  to: "/login",
};

function Navbar() {
  // const { state } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useUser();
  const profile = user?.profile;

  const handleOpenMenu = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          variant="text"
          color="inherit"
          component={Link}
          to="/"
          disableRipple
        >
          <Typography variant="h4" sx={{ mr: 4 }}>
            웹 저장소
          </Typography>
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="text">
            <Typography variant="subtitle1" color="white">
              이미지
            </Typography>
          </Button>
          <Button variant="text">
            <Typography variant="subtitle1" color="white">
              비디오
            </Typography>
          </Button>
          <Button variant="text">
            <Typography variant="subtitle1" color="white">
              토픽
            </Typography>
          </Button>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="text"
          color="inherit"
          startIcon={
            !profile ? (
              <Login />
            ) : profile?.profilesrc ? (
              <Avatar src={profile?.profilesrc} />
            ) : (
              <Avatar>{profile?.nickname[0]}</Avatar>
            )
          }
          onClick={profile && handleOpenMenu}
          size="large"
          {...(!profile && btnLink)}
          disableRipple
        >
          <Typography variant="body1">
            {profile ? profile?.nickname : "Sign in"}
          </Typography>
        </Button>
        <ProfileMenu anchorEl={anchorEl} onClose={handleCloseMenu} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
