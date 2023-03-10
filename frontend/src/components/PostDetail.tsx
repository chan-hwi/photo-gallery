import {
  Box,
  Paper,
  Stack,
  Container,
  Typography,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Chip
} from "@mui/material";
import { Favorite, FavoriteBorder, Star, StarBorder } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import useLikePostMutation from "../hooks/useLikePostMutation";
import useFavoritePostMutation from '../hooks/useFavoritePostMutation';
import usePost from "../hooks/usePost";
import useUser from '../hooks/useUser';
import PostDetailNav from "./PostDetailNav";
import Comments from './Comments';

function PostDetail() {
  const { postId } = useParams();
  const { post, queryParams } = usePost(postId);
  const { user } = useUser();
  const likePostMutation = useLikePostMutation(postId);
  const favoritePostMutation = useFavoritePostMutation(postId);

    const toggleLikePost = async () => {
        likePostMutation.mutate(postId, {
            onError: console.log
        });
    }

    const toggleFavoritePost = async () => {
        favoritePostMutation.mutate(postId, {
            onError: console.log
        });
    }

  if (queryParams.isLoading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  console.log(post);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <PostDetailNav post={post}/>
      <Paper sx={{ mt: 2 }}>
        <Card>
          <CardMedia>
            <Stack sx={{ p: 0, bgcolor: 'black', textAlign: "center" }}>
              <img
                src={post?.src}
                alt={post?.title}
                width="100%"
                style={{ objectFit: "contain" , height: "450px", margin: "0 auto" }}
              />
            </Stack>
          </CardMedia>
          <CardContent>
            <Typography variant="h4">{post?.title}</Typography>
            <Typography variant="subtitle2" color="text.secondary">Posted by {post?.authorName} | {post && new Date(post.createdAt).toLocaleString()}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>{post?.description}</Typography>
          </CardContent>
          <CardContent>
            <Stack direction='row' spacing={1}>
              {post?.tags?.map(tag => <Chip label={tag?.title} key={tag?._id}/>)}
            </Stack>
          </CardContent>
          <CardActions>
            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton onClick={toggleLikePost}>
                        {user && post?.likes.includes(user.profile.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    {post?.likes.length}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton onClick={toggleFavoritePost}>
                        {user && post?.favorites.includes(user.profile.id) ? <Star /> : <StarBorder/>}
                    </IconButton>
                    {post?.favorites.length}
                </Stack>
            </Stack>
          </CardActions>
          <Divider />
        </Card>
      </Paper>
      <Comments />
    </Container>
  );
}

export default PostDetail;
