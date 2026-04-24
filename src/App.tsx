import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useTheme } from "./hooks/useTheme";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

function AppRoutes() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage theme={theme} setTheme={setTheme} />}
      />
      <Route
        path="/"
        element={user ? <DashboardPage theme={theme} setTheme={setTheme} /> : <Navigate to="/auth" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
