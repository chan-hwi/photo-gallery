import React from "react";
import PostDetail from "@/components/Posts/PostDetail/PostDetail";
import PostDetailNavServerWrapper from "@/components/Posts/PostDetail/PostDetailNavServerWrapper";
import type { PostType } from "@/types/models";

async function fetchPost(postId: string): Promise<PostType> {
  const res = await fetch(`http://localhost:5000/posts/${postId}`, {
    method: "GET",
  });
  return await res.json();
}

async function page(ctx: { params: { postId: string } }) {
  const postData = await fetchPost(ctx.params.postId);

  return (
    <PostDetail postId={ctx.params.postId} initialPostData={postData}>
      <PostDetailNavServerWrapper post={postData} />
    </PostDetail>
  );
}

export default page;
