import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store"; // ✅ type-only
import type { Role } from "../features/auth/authSlice";

export default function RoleGuard({ allow }: { allow: Role[] }) {
  const user = useSelector((s: RootState) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return allow.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
}
