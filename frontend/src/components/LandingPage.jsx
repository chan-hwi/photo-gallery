import { Grid } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import Sidebar from './Sidebar';
import Posts from "./Posts";
import FavoritePosts from './FavoritePosts';
import PostDetail from './PostDetail';
import UploadForm from "./UploadForm";

function LandingPage() {
  const { user } = useUser();

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9}>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/favorites" element={<FavoritePosts />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/upload" element={user ? <UploadForm /> : <Navigate to='/login' replace />} />
          <Route path='*' element={<Navigate to="/notfound" replace />} />
        </Routes>
      </Grid>
    </Grid>
  );
}

export default LandingPage;
