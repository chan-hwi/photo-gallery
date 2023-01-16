import { useState } from "react";
import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { MoreHoriz, Edit, Delete, Download } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import useDeletePostMutation from "../hooks/useDeletePostMutation";
import moment from "moment";
import useQueryParams from "../hooks/useQueryParams";

function Post({ post }) {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const params = useQueryParams();
  const deletePostMutation = useDeletePostMutation();
  const navigate = useNavigate();

  const handleOpenMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    handleClose(e);
    navigate("/upload", { state: { post } });
  };

  const handleDelete = (e) => {
    handleClose(e);
    deletePostMutation.mutate(post._id);
  };

  const handleDownload = (e) => {
    handleClose(e);

    const elt = document.createElement("a");
    elt.href = post.src;
    const imgType = post.src.match(/\/(.*);/)[1];
    elt.download = `${post._id}.${imgType}`;
    elt.click();
  };

  return (
    <ImageListItem component={Link} to={{ pathname: `/posts/${post._id}`, search: '?' + new URLSearchParams(params).toString() }}>
      <img src={post.src} alt={post.title} />
      <ImageListItemBar
        title={post.title}
        subtitle={`${post.authorName} | ${moment(post.createdAt).fromNow()}`}
        actionIcon={
          <>
            <IconButton sx={{ color: "white" }} onClick={handleOpenMenu}>
              <MoreHoriz />
            </IconButton>
          </>
        }
      />
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose}>
        {user?.profile?.id === post?.author && ([
            <MenuItem onClick={handleEdit} sx={{ display: "flex", gap: 1 }} key='Edit'>
              <Edit />
              Edit Post
            </MenuItem>,
            <MenuItem onClick={handleDelete} sx={{ display: "flex", gap: 1 }} key='Delete'>
              <Delete />
              Delete Post
            </MenuItem>,
            <Divider key='Divider' />
        ])}
        <MenuItem onClick={handleDownload} sx={{ display: "flex", gap: 1 }}>
          <Download />
          Download Image
        </MenuItem>
      </Menu>
    </ImageListItem>
  );
}

export default Post;
