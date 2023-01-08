import { useState, useCallback } from "react";
import { CircularProgress, Stack, List, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { axiosInstance as api } from "../apis";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

function Comments() {
  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState("");
  const createCommentMutation = useMutation(
    async (commentData) => {
      const res = await authApi.post(`/comments/${postId}`, commentData);
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const { postId } = useParams();
  const authApi = useAxiosPrivate();
  const handleChange = useCallback((e) => {
    setCommentInput(e.target.value);
  }, []);
  const handleSubmit = (e) => {
    createCommentMutation.mutate(
      {
        comment: { description: commentInput },
      },
      {
        onSuccess: (data) => {
          console.log(data);
          setCommentInput("");
        },
      }
    );
  };
  const { isLoading, data: comments } = useQuery(
    ["comments", postId],
    async () => {
      const res = await api.get(`/comments?pid=${postId}`);
      return res.data;
    },
    {
      select: (comments) =>
        [...comments].sort((a, b) =>
          a._id < b._id ? 1 : a._id > b._id ? -1 : 0
        ),
      onSuccess: console.log,
    }
  );

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <Stack mt={6}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {comments?.length} comment(s)
      </Typography>
      <CommentForm
        value={commentInput}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <List sx={{ whiteSpace: "pre-wrap" }}>
        {comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </List>
    </Stack>
  );
}

export default Comments;
