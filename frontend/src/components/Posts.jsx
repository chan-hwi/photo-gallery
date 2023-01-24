import { useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material'
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import useQueryParams from '../hooks/useQueryParams';
import { axiosInstance as api } from '../apis';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import PostsLayout from './PostsLayout';

function Posts() {
  const { ref: pageEndRef, inView } = useInView();
  const params = useQueryParams();
  const authApi = useAxiosPrivate();

  const { isLoading, isFetchingNextPage, fetchNextPage, data: posts } = useInfiniteQuery(["infinitePosts", params], async ({ pageParam = 1 }) => {
    const res = await (params?.category === 'favorites' ? authApi : api).get('/posts', { params: {
      ...params,
      page: pageParam,
      sort: 'id',
      ord: -1
    }});
    return res.data;
  }, {
    onSuccess: console.log,
    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage);
      return lastPage.hasNext ? allPages.length + 1 : undefined;
    }
  });

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);
  
  return (
  <>
    {!isLoading && <PostsLayout posts={posts}/>}
    {(isLoading || isFetchingNextPage) &&
    <Box display='flex' justifyContent='center' alignItems='center' mt={6}>
      <CircularProgress />
    </Box>
    }
    {!isLoading && posts?.pages[0]?.totalCnt === 0 && 
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Typography variant='h6' color='text.secondary'>No posts to show</Typography>
      </Box>  
    }
    <div ref={pageEndRef} sx={{ width: '100%', height: '50px' }}></div>
  </>
  )
}

export default Posts;