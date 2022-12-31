import { ImageList } from '@mui/material'
import Post from './Post';

function PostsLayout({ posts }) {
    console.log(posts);
  return (
    <ImageList variant='masonry' cols={3} gap={8}>
        {posts?.map(post => (
            <Post key={post._id} post={post}/>
        ))}
    </ImageList>
  )
}

export default PostsLayout