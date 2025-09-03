import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/auth/authSlice";
import { fakeRegister } from "../features/auth/fakeAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"user" | "agent">("user");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const redirectByRole = (r: string) =>
    r === "agent" ? "/agent" : "/dashboard";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fakeRegister({
        name,
        email: email.trim(),
        password,
        role,
        phone,
      });
      dispatch(setAuth(res));
      toast.success("Welcome to ZPay!");
      nav(redirectByRole(res.user.role), { replace: true });
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-extrabold mb-6">Create your account</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6"
      >
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone (optional)</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <button
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="text-indigo-700 hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
