import PostDetailNav from "./PostDetailNav";
import type { PostType } from '@/types/models';

type Props = {
    post: PostType;
}

function PostDetailNavServerWrapper({ post } : Props) {
  fetch("http://localhost:5000", { cache: "no-store" });

  return <PostDetailNav post={post}/>;
}

export default PostDetailNavServerWrapper;
