"use client";

import React from "react";
import { axiosInstance as api } from "@/apis";
import Link from "next/link";
import { Paper, Container, Grid, Box, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useQueryParams from "@/hooks/useQueryParams";
import type { PostPageType, PostType } from "@/types/models";

interface paramType {
  post: PostType | undefined;
}

function PostDetailNav({ post }: paramType) {
  const authApi = useAxiosPrivate();
  const params = useQueryParams();

  const nextPostsParams = { ...params, id_gt: post?._id, cnt: 3 };
  const { isLoading: isLoadingNextPosts, data: nextPosts } =
    useQuery<PostPageType>(["posts", nextPostsParams], async () => {
      const res = await authApi.get(`/posts`, { params: nextPostsParams });
      return res.data;
    });

  const prevPostsParams = {
    ...params,
    id_lt: post?._id,
    ord: params.ord ? params.ord * -1 : -1,
    cnt: 3,
  };
  const { isLoading: isLoadingPrevPosts, data: prevPosts } =
    useQuery<PostPageType>(["posts", prevPostsParams], async () => {
      const res = await authApi.get<PostPageType>(`/posts`, {
        params: prevPostsParams,
      });
      return res.data;
    });

  if (isLoadingNextPosts || isLoadingPrevPosts) {
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>;
  }

  return (
    <Paper sx={{ py: 1 }}>
      <Container>
        <Grid container spacing={2} columns={7}>
          {prevPosts && prevPosts.posts.length < 3 && (
            <Grid item xs={3 - prevPosts.posts.length}></Grid>
          )}
          {prevPosts &&
            [...prevPosts.posts].reverse().map((post) => (
              <Grid
                item
                xs={1}
                key={post._id}
                component={Link}
                href={{
                  pathname: `/posts/${post._id}`,
                  search: "?" + new URLSearchParams(params as any).toString(),
                }}
              >
                <Paper elevation={3}>
                  <img
                    src={post.src}
                    alt={post._id}
                    height="70px"
                    width="100%"
                    style={{ objectFit: "contain", backgroundColor: "black" }}
                  />
                </Paper>
              </Grid>
            ))}
          <Grid
            item
            xs={1}
            display="flex"
            justifyContent="center"
            sx={{ filter: "brightness(70%)" }}
          >
            <Paper elevation={6}>
              <img
                src={post?.src}
                alt={post?._id}
                height="70px"
                width="100%"
                style={{ objectFit: "contain", backgroundColor: "black" }}
              />
            </Paper>
          </Grid>
          {nextPosts?.posts?.map((post) => (
            <Grid
              item
              xs={1}
              key={post._id}
              component={Link}
              href={{
                pathname: `/posts/${post._id}`,
                search: "?" + new URLSearchParams(params as any).toString(),
              }}
            >
              <Paper elevation={3}>
                <img
                  src={post.src}
                  alt={post._id}
                  height="70px"
                  width="100%"
                  style={{ objectFit: "contain", backgroundColor: "black" }}
                />
              </Paper>
            </Grid>
          ))}
          {nextPosts && nextPosts.posts.length < 3 && (
            <Grid item xs={3 - nextPosts.posts.length}></Grid>
          )}
        </Grid>
      </Container>
    </Paper>
  );
}

export default PostDetailNav;
