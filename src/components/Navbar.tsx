import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store"; // ✅ type-only import
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // profile dropdown
  const navRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((s: RootState) => s.auth);
  const isAuthed = Boolean(auth.token);
  const role = auth.user?.role;

  const base = (active: boolean) =>
    cn("px-3 py-2 text-sm transition-colors", {
      "text-indigo-700 font-semibold": active,
      "text-gray-700 hover:text-indigo-700": !active,
    });

  const roleHome =
    role === "admin" ? "/admin" : role === "agent" ? "/agent" : "/dashboard";

  // close dropdowns on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div
        ref={navRef}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        {/* Brand */}
        <Link to="/" className="font-bold text-xl text-indigo-700">
          ZPay
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => base(isActive)}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => base(isActive)}>
            About
          </NavLink>
          <NavLink to="/features" className={({ isActive }) => base(isActive)}>
            Features
          </NavLink>
          <NavLink to="/pricing" className={({ isActive }) => base(isActive)}>
            Pricing
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => base(isActive)}>
            Contact
          </NavLink>
          <NavLink to="/faq" className={({ isActive }) => base(isActive)}>
            FAQ
          </NavLink>
        </nav>

        {/* Right side (auth-aware) */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthed ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:border-indigo-700"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-gray-300"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-white text-xs font-semibold">
                  {auth.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden sm:block text-gray-700">
                  {auth.user?.name ?? "Account"}
                </span>
                <svg
                  className={cn("h-4 w-4 text-gray-500 transition", {
                    "rotate-180": profileOpen,
                  })}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 011.04 1.08l-4.24 3.835a.75.75 0 01-1.02 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-xl"
                >
                  <Link
                    to={roleHome}
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    {role === "admin"
                      ? "Admin"
                      : role === "agent"
                      ? "Agent"
                      : "Dashboard"}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle Menu"
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-6 h-0.5 bg-gray-900 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-900 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-900"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/features", label: "Features" },
              { to: "/pricing", label: "Pricing" },
              { to: "/contact", label: "Contact" },
              { to: "/faq", label: "FAQ" },
            ].map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => base(isActive)}
              >
                {i.label}
              </NavLink>
            ))}

            {!isAuthed ? (
              <div className="mt-3 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 text-center"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white text-center"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Link
                  to={roleHome}
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 text-sm rounded-lg bg-gray-900 text-white text-center"
                >
                  {role === "admin"
                    ? "Admin"
                    : role === "agent"
                    ? "Agent"
                    : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 text-center"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
