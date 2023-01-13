import { useEffect, useRef } from 'react';
import { CircularProgress, Box } from '@mui/material'
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { axiosInstance as api } from '../apis';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import PostsLayout from './PostsLayout';

function Posts() {
  const queryClient = useQueryClient();
  const { ref: pageEndRef, inView } = useInView();
  const [searchParams] = useSearchParams();
  const authApi = useAxiosPrivate();
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  const { isLoading, isFetchingNextPage, fetchNextPage, data: posts } = useInfiniteQuery(["infinitePosts", params], async ({ pageParam = 1 }) => {
    const res = await (searchParams?.get('category') === 'favorites' ? authApi : api).get('/posts', { params: {
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
  
  console.log(posts);
  return (
  <>
    {!isLoading && <PostsLayout posts={posts}/>}
    {(isLoading || isFetchingNextPage) &&
    <Box display='flex' justifyContent='center' alignItems='center' mt={6}>
      <CircularProgress />
    </Box>
    }
    <div ref={pageEndRef} sx={{ width: '100%', height: '50px' }}></div>
  </>
  )
}

export default Posts