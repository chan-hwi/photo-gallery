import { CircularProgress, Box } from '@mui/material'
import PostsLayout from './PostsLayout';
import useFavoritePosts from '../hooks/useFavoritePosts';

function FavoritePosts() {
  const { posts, queryParams } = useFavoritePosts();

  if (queryParams?.isLoading) return (
    <Box display='flex' justifyContent='center' alignItems='center' mt={6}>
      <CircularProgress />
    </Box>
  );

  return (
    <PostsLayout posts={posts}/>
  )
}

export default FavoritePosts;