import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../features/auth/authSlice";
import { fakeLogin } from "../features/auth/fakeAuth";
import type { RootState } from "../store";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = useSelector((s: RootState) => s.auth.token);
  const nav = useNavigate();
  const loc = useLocation() as any;
  const dispatch = useDispatch();

  const redirectByRole = (role: string) => {
    if (role === "agent") return "/agent";
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fakeLogin(email.trim(), password);
      dispatch(setAuth(res));
      toast.success("Welcome back!");
      nav(loc.state?.from || redirectByRole(res.user.role), { replace: true });
    } catch (e) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  if (token) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-extrabold mb-6">Log in</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6"
      >
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        <button
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-sm text-gray-600">
          No account?{" "}
          <Link className="text-indigo-700 hover:underline" to="/register">
            Create one
          </Link>
        </p>
      </form>
      <div className="mt-4 text-xs text-gray-500">
        Tip: use <code>admin@zpay.com</code>, <code>agent@zpay.com</code> or any
        other email to simulate roles.
      </div>
    </div>
  );
}
