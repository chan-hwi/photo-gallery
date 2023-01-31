import React, { useState, useCallback } from "react";
import { CircularProgress, Stack, List, Typography, Button } from "@mui/material";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { axiosInstance as api } from "../apis";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import type { CommentType, CommentPageType } from '../types/models';

interface CommentFormType {
  comment: Pick<CommentType, "description">;
}

function Comments() {
  const { postId } = useParams();
  const authApi = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState<string>("");

  const createCommentMutation = useMutation(
    async (commentData : CommentFormType) => {
      const res = await authApi.post(`/comments/${postId}`, commentData);
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["infiniteComments", postId]);
      },
    }
  );

  const handleChange = useCallback((e : React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  }, []);
  const handleSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
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
  const { isLoading, data: comments, fetchNextPage } = useInfiniteQuery<CommentPageType>(
    ["infiniteComments", postId],
    async ({ pageParam = 1 }) => {
      const res = await api.get<CommentPageType>("/comments", {
        params: {
          pid: postId,
          page: pageParam,
          sort: "id",
          ord: -1,
        },
      });
      return res.data;
    },
    {
      onSuccess: console.log,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNext ? allPages.length + 1 : undefined
      }
    }
  );

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <Stack mt={6}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {comments?.pages?.at(-1)?.totalCnt || 0} comment(s)
      </Typography>
      <CommentForm
        value={commentInput}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <List sx={{ whiteSpace: "pre-wrap" }}>
        {comments?.pages?.map((page) =>
          page?.comments?.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              style={{ elevation: 1 }}
            />
          ))
        )}
      </List>
      {comments?.pages?.at(-1)?.hasNext &&
        <Button sx={{ mb: 2 }} onClick={() => fetchNextPage()}>View more comments</Button>
      }
    </Stack>
  );
}

export default Comments;
