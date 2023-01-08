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
import { useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CommentForm from "./CommentForm";

function Comment({ comment }) {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const api = useAxiosPrivate();
  const createReplyMutation = useMutation(
    async (commentData) => {
      const res = await api.post(
        `/comments/${postId}/replies/${comment._id}`,
        commentData
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );
  const deleteCommentMutation = useMutation(
    async () => {
      const res = await api.delete(`/comments/${comment._id}`);
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );
  const handleChange = useCallback((e) => setCommentInput(e.target.value), []);
  const handleSubmit = () => {
    createReplyMutation.mutate(
      { comment: { description: commentInput } },
      {
        onSuccess: (res) => {
          console.log(res);
          setCommentInput("");
        },
      }
    );
  };
  const handleDelete = () => {
    deleteCommentMutation.mutate();
  };

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
              <IconButton onClick={handleDelete}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </ListItem>
      <Collapse in={show}>
        <Divider />
        <CommentForm
          value={commentInput}
          onChange={handleChange}
          onSubmit={handleSubmit}
          style={{ elevation: 0 }}
        />
      </Collapse>
    </Card>
  );
}

export default Comment;
