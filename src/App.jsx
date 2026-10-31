import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./Components/AdminLayout/AdminLayout.jsx";
import { hasAdminSession } from "./utils/auth.js";

const Dashboard = lazy(() => import("./Pages/Admin/Dashboard/Dashboard.jsx"));
const School = lazy(() => import("./Pages/Admin/School/School.jsx"));
const Teacher = lazy(() => import("./Pages/Admin/Teacher/Teacher.jsx"));
const Driver = lazy(() => import("./Pages/Admin/Driver/Driver.jsx"));
const Login = lazy(() => import("./Pages/Auth/Login.jsx"));
const Signup = lazy(() => import("./Pages/Auth/Signup.jsx"));

function RequireAuth({ children }) {
  return hasAdminSession() ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  return hasAdminSession() ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <Suspense fallback={<div className="route-loading" role="status">Loading workspace…</div>}>
      <Routes>
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/sign-up" element={<GuestOnly><Signup /></GuestOnly>} />
        <Route path="/" element={<Navigate to={hasAdminSession() ? "/dashboard" : "/login"} replace />} />
        <Route path="/" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="schools" element={<School />} />
          <Route path="teachers" element={<Teacher />} />
          <Route path="drivers" element={<Driver />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
