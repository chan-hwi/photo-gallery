import React from 'react'
import { axiosInstance as api } from '../apis'; 
import { Link } from 'react-router-dom';
import { Paper, Container, Grid, Stack } from '@mui/material';
import { useQuery } from 'react-query';

function PostDetailNav({ post }) {
    const { data: nextPosts } = useQuery(["posts", post._id, "next", 3], async () => {
        const res = await api.get(`/posts/${post._id}/next/3`);
        return res.data;
    });
    const { data: prevPosts } = useQuery(["posts", post._id, "prev", 3], async () => {
        const res = await api.get(`/posts/${post._id}/prev/3`);
        return res.data;
    });

  return (
    <Paper sx={{ py: 1 }}>
        <Container>
            <Grid container spacing={2} columns={7}>
                {prevPosts?.length < 3 && <Grid item xs={3 - prevPosts.length}></Grid>}
                {prevPosts && [...prevPosts].reverse().map(post => 
                    <Grid item xs={1} key={post._id} component={Link} to={`/posts/${post._id}`}>
                        {post._id !== -1 ?
                            <Paper elevation={3}>
                                <img src={post.src} alt={post._id} height="70px" width="100%" style={{ objectFit: "contain", backgroundColor: "black" }}/>
                            </Paper>
                        :
                            <div></div>
                        }
                    </Grid>
                )}
                <Grid item xs={1} display="flex" justifyContent="center">
                    <Paper elevation={6}>
                        <img src={post.src} alt={post._id} height="70px" width="100%" style={{ objectFit: "contain", backgroundColor: "black" }} />
                    </Paper>
                </Grid>
                {nextPosts?.map(post => 
                    <Grid item xs={1} key={post._id} component={Link} to={`/posts/${post._id}`}>
                        {post._id !== -1 ?
                            <Paper elevation={3}>
                                <img src={post.src} alt={post._id} height="70px" width="100%" style={{ objectFit: "contain", backgroundColor: "black" }}/>
                            </Paper>
                        :
                            <div></div>
                        }
                    </Grid>
                )}
                {nextPosts?.length < 3 && <Grid item xs={3 - nextPosts.length}></Grid>}
            </Grid>
        </Container>
    </Paper>
  )
}

export default PostDetailNav