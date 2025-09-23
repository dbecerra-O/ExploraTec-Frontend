import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./public/Login";
import { Register } from "./public/Register";
import { Main } from "./public/Main";
import { Dashboard } from "./private/Dashboard";
import { PublicRoute } from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Público (solo si no está logeado) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protegidos */}
        <Route
          path="/main"
          element={
            <ProtectedRoute roles={["USER", "ADMIN"]}>
              <Main />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirección default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
