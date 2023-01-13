import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
import LandingPage from './components/LandingPage';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Container>
      <Routes>
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/*" element={<LandingPage />} />
              <Route element={<PrivateRoute noAuth />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
              </Route>
            </Routes>
          </>
        } />
        <Route path="/notfound" element={<NotFound />} />
      </Routes>
    </Container>
  );
}

export default App;
