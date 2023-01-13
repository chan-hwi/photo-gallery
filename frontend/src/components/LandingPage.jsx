import { Grid } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Sidebar from './Sidebar';
import Posts from "./Posts";
import FavoritePosts from './FavoritePosts';
import PostDetail from './PostDetail';
import UploadForm from "./UploadForm";

function LandingPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9}>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route element={<PrivateRoute />}>
            <Route path="/upload" element={<UploadForm />}/>
            <Route path="/posts/favorites" element={<FavoritePosts />} />
          </Route>
          <Route path='*' element={<Navigate to="/notfound" replace />} />
        </Routes>
      </Grid>
    </Grid>
  );
}

export default LandingPage;
