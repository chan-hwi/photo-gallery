import { CircularProgress, ImageList, Box } from '@mui/material'
import Post from './Post';
import usePosts from '../hooks/usePosts';

function Posts() {
  const { posts, queryParams } = usePosts();

  if (queryParams?.isLoading) return (
    <Box display='flex' justifyContent='center' alignItems='center' mt={6}>
      <CircularProgress />
    </Box>
  );

  return (
    <ImageList variant='masonry' cols={3} gap={8}>
        {posts?.map(post => (
            <Post key={post._id} post={post}/>
        ))}
    </ImageList>
  )
}

export default Posts