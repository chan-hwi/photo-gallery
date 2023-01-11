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
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useQueryClient, useMutation, useInfiniteQuery } from "react-query";
import { axiosInstance as api } from "../apis";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useUser from "../hooks/useUser";
import CommentForm from "./CommentForm";

function Comment({ comment, style, sx }) {
  const { postId } = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showUpdateCommentInput, setShowUpdateCommentInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [updateCommentInput, setUpdateCommentInput] = useState("");

  const {
    isLoading,
    data: replies,
    fetchNextPage,
  } = useInfiniteQuery(
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
        `/comments/${postId}/replies/${comment.parent || comment._id}`,
        commentData
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["infiniteComments", postId]);
        queryClient.invalidateQueries([
          "infiniteReplies",
          comment.parent || comment._id,
        ]);
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
        queryClient.invalidateQueries([
          "infiniteReplies",
          comment.parent || comment._id,
        ]);
      },
    }
  );

  const likeCommentMutation = useMutation(
    async () => {
      const res = await authApi.patch(`/comments/${comment._id}/likes`);
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (comment.parent)
          queryClient.invalidateQueries(["infiniteReplies", comment.parent]);
        else queryClient.invalidateQueries(["infiniteComments", postId]);
      },
    }
  );

  const updateCommentMutation = useMutation(
    async (commentData) => {
      const res = await authApi.patch(`/comments/${comment._id}`, commentData);
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (comment.parent)
          queryClient.invalidateQueries(["infiniteReplies", comment.parent]);
        else queryClient.invalidateQueries(["infiniteComments", postId]);
      },
    }
  );

  const handleChange = useCallback((e) => setCommentInput(e.target.value), []);
  const handleSubmit = () => {
    createReplyMutation.mutate(
      { comment: { description: commentInput } },
      {
        onSuccess: (res) => {
          setCommentInput("");
          setShowCommentInput(false);
          setShowReplies(true);
        },
      }
    );
  };
  const handleShowReplyForm = useCallback(() => {
    setShowCommentInput((showCommentInput) => {
      if (!showCommentInput) setCommentInput(`@${comment.authorName} `);
      return !showCommentInput;
    });
  }, [comment.authorName]);

  const handleDelete = () => {
    deleteCommentMutation.mutate();
  };

  const handleLike = () => {
    likeCommentMutation.mutate();
  };

  const handleChangeUpdateCommentInput = useCallback((e) => {
    setUpdateCommentInput(e.target.value);
  }, []);

  const handleShowUpdateCommentInput = () => {
    setUpdateCommentInput(comment.description);
    setShowUpdateCommentInput((show) => !show);
  };

  const handleSubmitUpdateComment = () => {
    updateCommentMutation.mutate(
      { comment: { description: updateCommentInput } },
      {
        onSuccess: (res) => {
          setUpdateCommentInput("");
          setShowUpdateCommentInput(false);
        },
      }
    );
  };

  return (
    <Card sx={{ mt: 2, ...sx }} {...style} raised>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>{comment.authorName.toUpperCase()[0]}</Avatar>
        </ListItemAvatar>
        <Stack sx={{ width: "100%", wordBreak: "break-word" }}>
          {showUpdateCommentInput ? (
            <CommentForm
              value={updateCommentInput}
              onChange={handleChangeUpdateCommentInput}
              onSubmit={handleSubmitUpdateComment}
            />
          ) : (
            <>
              <ListItemText
                primary={comment.authorName}
                secondary={moment(comment.createdAt).fromNow()}
              />
              <Typography variant="body2">{comment.description}</Typography>
            </>
          )}
          <Box
            display="flex"
            flexDirection="column-reverse"
            justifyContent="center"
            alignItems="flex-start"
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
            <Stack direction="row" justifyContent="flex-start" sx={{ mt: 2 }}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
                mr={2}
              >
                <Tooltip title="Like this comment">
                  <IconButton onClick={handleLike}>
                    {comment.likes.includes(user?.profile?.id) ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Tooltip>
                <Typography variant="body2">{comment.likesCount}</Typography>
              </Box>
              <Tooltip title="Reply">
                <IconButton onClick={handleShowReplyForm}>
                  <Reply />
                </IconButton>
              </Tooltip>
              {user?.profile?.id === comment?.author && (
                <>
                  <Tooltip title="Edit">
                    <IconButton onClick={handleShowUpdateCommentInput}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </>
              )}
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
        {!isLoading ? (
          <>
            <List sx={{ ml: 4 }}>
              {replies?.pages?.map((page) =>
                page?.replies?.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    style={{ elevation: 1 }}
                  />
                ))
              )}
            </List>
            {replies?.pages?.at(-1).hasNext && (
              <Button sx={{ mb: 2 }} onClick={() => fetchNextPage()} fullWidth>
                View more comments
              </Button>
            )}
          </>
        ) : (
          <CircularProgress />
        )}
      </Collapse>
    </Card>
  );
}

export default Comment;
