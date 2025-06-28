import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";
import { getToken, isTokenExpired } from "./auth";
import "./index.css";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return children;
};

const GuestOnlyRoute = ({ children }) => {
  const token = getToken();
  if (token && !isTokenExpired(token)) {
    return <Navigate to="/todos" />;
  }

  if (token && isTokenExpired(token)) {
    localStorage.clear();
  }

  return children;
};

export default function App() {
  useEffect(() => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      localStorage.clear();
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <Register />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/todos" />} />
      </Routes>
    </Router>
  );
}
