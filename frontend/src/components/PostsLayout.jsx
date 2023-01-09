import { ImageList } from '@mui/material'
import Post from './Post';

function PostsLayout({ posts }) {
    console.log(posts);
  return (
    <ImageList cols={4} gap={8}>
        {posts?.map(post => (
            <Post key={post._id} post={post}/>
        ))}
    </ImageList>
  )
}

export default PostsLayout