import { useState, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAuth } from "../features/auth/authSlice";

// optional: your fake auth helper; or inline a stub
// import { fakeLogin } from "../features/auth/fakeAuth";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loc = useLocation();
  const token = useAppSelector((s) => s.auth.token);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const role = String(fd.get("role") || "user") as "user" | "agent" | "admin";

    if (!email || !password) return toast.error("Enter email and password");

    setLoading(true);
    // simulate login
    setTimeout(() => {
      setLoading(false);
      dispatch(
        setAuth({
          token: "demo_jwt_" + Date.now(),
          user: {
            id: "u_1",
            name: email.split("@")[0].replace(/\W+/g, "") || "User",
            email,
            role,
          },
        })
      );
      toast.success("Welcome back!");

      const to =
        role === "admin"
          ? "/admin"
          : role === "agent"
          ? "/agent"
          : "/dashboard";
      navigate((loc.state as any)?.from || to, { replace: true });
    }, 600);
  };

  if (token) {
    // already logged in
    return null;
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold mb-6">Log in to ZPay</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6"
      >
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            defaultValue="user"
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-700 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
