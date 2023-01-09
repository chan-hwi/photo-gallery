import { useState, useCallback } from "react";
import moment from "moment";
import {
  Card,
  List,
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
  Box,
  Button,
} from "@mui/material";
import { Reply, Edit, Delete, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { axiosInstance as api } from "../apis";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CommentForm from "./CommentForm";

function Comment({ comment, style, sx }) {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const { data: replies } = useQuery(["comments", comment._id, "replies"], async () => {
    const res = await api.get(`/comments/${comment._id}/replies`);
    return res.data;
  }, {
    onSuccess: console.log,
    enabled: showReplies
  });

  const authApi = useAxiosPrivate();
  const createReplyMutation = useMutation(
    async (commentData) => {
      const res = await authApi.post(
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
      const res = await authApi.delete(`/comments/${comment._id}`);
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
          setShowCommentInput(false);
          setShowReplies(true);
        },
      }
    );
  };
  const handleDelete = () => {
    deleteCommentMutation.mutate();
  };

  return (
    <Card sx={{ mt: 2, ...sx }} {...style} raised >
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
          <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' mt={2}>
            {!comment.isReply && replies?.length > 0 &&
              <Button startIcon={showReplies ? <ArrowDropUp /> : <ArrowDropDown />} onClick={() => setShowReplies(show => !show)}>
                {showReplies ? `Hide ${comment.replies.length === 1 ? "reply" : "replies"}` : `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
              </Button>
            }
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" justifyContent="flex-end">
              <Tooltip title="Reply">
                <IconButton onClick={() => setShowCommentInput((show) => !show)}>
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
          </Box>
        </Stack>
      </ListItem>
      <Collapse in={showCommentInput}>
        <Divider />
        <CommentForm
          value={commentInput}
          onChange={handleChange}
          onSubmit={handleSubmit}
          style={{ elevation: 0 }}
        />
      </Collapse>
      <Collapse in={showReplies}>
        <List sx={{ ml: 4 }}>
          {replies?.map((comment) => (
            <Comment key={comment._id} comment={comment} style={{ elevation: 1 }} />
          ))}
        </List>
      </Collapse>
    </Card>
  );
}

export default Comment;
