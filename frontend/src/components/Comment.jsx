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
  CircularProgress,
} from "@mui/material";
import {
  Reply,
  Edit,
  Delete,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "react-query";
import { axiosInstance as api } from "../apis";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CommentForm from "./CommentForm";

function Comment({ comment, style, sx }) {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const { isLoading, data: replies, fetchNextPage } = useInfiniteQuery(
    ["infiniteReplies", comment._id],
    async ({ pageParam = 1 }) => {
      const res = await api.get(`/comments/${comment._id}/replies`, {
        params: {
          page: pageParam,
        },
      });
      return res.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage?.hasNext ? allPages.length + 1 : null;
      },
    }
  );

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
        queryClient.invalidateQueries(["infiniteComments", postId]);
        queryClient.invalidateQueries(["infiniteReplies", comment._id]);
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
        queryClient.invalidateQueries(["infiniteComments", postId]);
        queryClient.invalidateQueries(["infiniteReplies", comment._id]);
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
    <Card sx={{ mt: 2, ...sx }} {...style} raised>
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
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            {!comment.parent && comment.replyCount > 0 && (
              <Button
                startIcon={showReplies ? <ArrowDropUp /> : <ArrowDropDown />}
                onClick={() => setShowReplies((show) => !show)}
              >
                {showReplies
                  ? `Hide ${comment.replyCount === 1 ? "reply" : "replies"}`
                  : `${comment.replyCount} ${
                      comment.replyCount === 1 ? "reply" : "replies"
                    }`}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" justifyContent="flex-end">
              <Tooltip title="Reply">
                <IconButton
                  onClick={() => setShowCommentInput((show) => !show)}
                >
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
        {!isLoading ?
        <>
          <List sx={{ ml: 4 }}>
            {replies?.pages?.map(page => 
              page?.replies?.map(comment =>
                <Comment
                  key={comment._id}
                  comment={comment}
                  style={{ elevation: 1 }}
                />
              )
            )}
          </List>
          {replies?.pages?.at(-1).hasNext &&
            <Button sx={{ mb: 2 }} onClick={() => fetchNextPage()} fullWidth>View more comments</Button>
          }
        </>
        :
        <CircularProgress />
        }
      </Collapse>
    </Card>
  );
}

export default Comment;
