import { CircularProgress, Box } from '@mui/material'
import { useInfiniteQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { axiosInstance as api } from '../apis';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import PostsLayout from './PostsLayout';

function Posts() {
  const [searchParams] = useSearchParams();
  const authApi = useAxiosPrivate();
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  const { isLoading, data: posts } = useInfiniteQuery(["infinitePosts", params], ({ pageParam = 1 }) => {
    return (searchParams?.get('category') === 'favorites' ? authApi : api).get('/posts', { params });
  }, {
    onSuccess: console.log,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length + 1 : null;
    }
  });

  if (isLoading) return (
    <Box display='flex' justifyContent='center' alignItems='center' mt={6}>
      <CircularProgress />
    </Box>
  );
  
  console.log(posts);
  return (
    <PostsLayout posts={posts}/>
  )
}

export default Posts