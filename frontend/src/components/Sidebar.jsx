import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, Image, Star, Upload } from "@mui/icons-material";
import useUser from "../hooks/useUser";

function Sidebar() {
  const { user } = useUser();

  return (
    <List>
      <ListItem sx={{ pb: 2 }}>
        <TextField
          label="검색"
          variant="standard"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        ></TextField>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/posts">
          <ListItemIcon>
            <Image />
          </ListItemIcon>
          <ListItemText>전체 이미지</ListItemText>
        </ListItemButton>
      </ListItem>
      {user && 
      <>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/posts?category=favorites">
          <ListItemIcon>
            <Star />
          </ListItemIcon>
          <ListItemText>즐겨 찾기한 이미지</ListItemText>
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/upload">
          <ListItemIcon>
            <Upload />
          </ListItemIcon>
          <ListItemText>업로드</ListItemText>
        </ListItemButton>
      </ListItem>
      </>
      }
    </List>
  );
}

export default Sidebar;
