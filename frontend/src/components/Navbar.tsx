import React, { useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Login } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import useUser from '../hooks/useUser';

const btnLink = {
  component: Link,
  to: "/login",
};

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { user } = useUser();
  const profile = user?.profile;

  const handleOpenMenu = useCallback((e : React.MouseEvent<HTMLButtonElement>) => {
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
            Photo gallery
          </Typography>
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        
        {/* <Stack direction="row" spacing={2}>
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
        </Stack> */}
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
