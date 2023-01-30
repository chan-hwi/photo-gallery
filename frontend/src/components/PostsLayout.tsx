import { ImageList } from '@mui/material'
import Post from './Post';
import type { PostType, PostPageType } from '../types/models';
import { InfiniteData } from 'react-query';

interface paramType {
  posts: InfiniteData<PostPageType> | undefined;
};

function PostsLayout({ posts } : paramType) {
  if (!posts) return null;

  return (
    <ImageList cols={4} gap={8}>
        {posts?.pages?.map((page: PostPageType) => (
          page?.posts?.map((post: PostType) => <Post key={post._id} post={post}/>)
        ))}
    </ImageList>
  )
}

export default PostsLayout;