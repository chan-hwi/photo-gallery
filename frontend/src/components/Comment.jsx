import { useState, useCallback } from "react";
import moment from "moment";
import {
  Card,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
} from "@mui/material";
import { Reply, Edit, Delete } from "@mui/icons-material";
import CommentForm from "./CommentForm";

function Comment({ comment }) {
  const [show, setShow] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  return (
    <Card elevation={1} sx={{ mt: 1 }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>{comment.authorName.toUpperCase()[0]}</Avatar>
        </ListItemAvatar>
        <Stack sx={{ width: "100%", wordBreak: "break-word" }}>
          <ListItemText
            primary={comment.authorName}
            secondary={moment(comment.createdAt).fromNow()}
          />
          <Typography variant="body2">{comment.description}</Typography>
          <Stack mt={2} direction="row" justifyContent="flex-end">
            <Tooltip title="Reply">
              <IconButton onClick={() => setShow((show) => !show)}>
                <Reply />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton>
                <Delete />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </ListItem>
      <Collapse in={show}>
        <Divider />
        <CommentForm style={{ elevation: 0 }} />
      </Collapse>
    </Card>
  );
}

export default Comment;
