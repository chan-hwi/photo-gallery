import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
import LandingPage from './components/LandingPage';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import NotFound from "./components/NotFound";
import useUser from './hooks/useUser';

function App() {
  const { user } = useUser();

  return (
    <Container>
      <Routes>
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/*" element={<LandingPage />} />
              <Route path="/login" element={!user ? <LoginForm /> : <Navigate to='/' />} />
              <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to='/' /> }/>
            </Routes>
          </>
        } />
        <Route path="/notfound" element={<NotFound />} />
      </Routes>
    </Container>
  );
}

export default App;
