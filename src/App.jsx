import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";
import { getToken } from "./auth";
import "./index.css";
const ProtectedRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" />;
};
const GuestOnlyRoute = ({ children }) => {
  return getToken() ? <Navigate to="/todos" /> : children;
};
export default function App() {
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
