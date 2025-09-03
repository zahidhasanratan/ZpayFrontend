import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store"; // ✅ type-only

export default function Protected() {
  const token = useSelector((s: RootState) => s.auth.token);
  const loc = useLocation();
  if (!token)
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <Outlet />;
}
