import { useState } from "react";
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
  IconButton,
  Collapse
} from "@mui/material";
import { Search, Image, Star, Upload, CloudUpload, FilterAlt } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
  import DetailedSearchForm from './DetailedSearchForm';
import useUser from "../hooks/useUser";
import { useCallback } from "react";

function Sidebar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [showSearchForm, setShowSearchForm] = useState(false);

  const handleChange = useCallback(e => setSearchInput(e.target.value), []);

  const handleSubmit = useCallback(e => {
    if(e.code !== 'Enter' || searchInput === '') return;
    
    navigate(`/posts?keyword=${searchInput.trim()}`);
    setSearchInput("");
  }, [navigate, searchInput]);
  return (
    <List>
      <ListItem sx={{ pb: 2 }}
        secondaryAction={
          <IconButton 
            onClick={() => setShowSearchForm(show => !show)}
            sx={{ transform: 'translate(50%)' }} >
            <FilterAlt />
          </IconButton>
        }
      >
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
            value={searchInput}
            onChange={handleChange}
            onKeyUp={handleSubmit}
          />
      </ListItem>
      <Collapse in={showSearchForm}>
        <ListItem disablePadding sx={{ py: 2 }}>
          <DetailedSearchForm />
        </ListItem>
        <Divider />
      </Collapse>
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
      <ListItem disablePadding>
        <ListItemButton component={Link} to={`/posts?author=${user?.profile?.id}`}>
          <ListItemIcon>
            <CloudUpload />
          </ListItemIcon>
          <ListItemText>업로드한 이미지</ListItemText>
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
