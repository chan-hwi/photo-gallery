'use client';

import {
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { AccountCircle, Image as ImageIcon, Logout } from "@mui/icons-material";
import useAuth from '@/hooks/useAuth';

interface paramType {
  anchorEl: HTMLElement | null;
  onClose: () => void
};

function ProfileMenu({ anchorEl, onClose } : paramType) {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    onClose();
    await logout();
    router.replace('/posts');
  }

  return (
    <Paper>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={onClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText>Your Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText>Your Posts</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>
            <Typography color='error'>Log out</Typography>
        </ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}

export default ProfileMenu;
