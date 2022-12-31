import { CircularProgress, Box } from '@mui/material'
import PostsLayout from './PostsLayout';
import usePosts from '../hooks/usePosts';

function Posts() {
  const { posts, queryParams } = usePosts();

  if (queryParams?.isLoading) return (
    <Box display='flex' justifyContent='center' alignItems='center' mt={6}>
      <CircularProgress />
    </Box>
  );

  return (
    <PostsLayout posts={posts}/>
  )
}

export default Posts