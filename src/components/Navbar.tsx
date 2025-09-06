import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";

/** Theme helpers */
type Theme = "light" | "dark";
const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const navRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth = useAppSelector((s) => s.auth);
  const isAuthed = Boolean(auth.token);
  const role = auth.user?.role;

  /** Apply theme to <html class="dark"> and persist */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  /** Close profile dropdown on outside click */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setProfileOpen(false);
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

  const roleHome =
    role === "admin" ? "/admin" : role === "agent" ? "/agent" : "/dashboard";

  const base = (active: boolean) =>
    cn(
      "px-3 py-2 text-sm transition-colors rounded-lg",
      active
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
    );

  /** Theme toggle button */
  const ThemeToggleBtn = (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? (
        // Sun icon
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon icon
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div
        ref={navRef}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <Link
          to="/"
          className="font-bold text-xl text-blue-600 dark:text-blue-400"
        >
          ZPay
        </Link>

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

        <div className="hidden md:flex items-center gap-3">
          {ThemeToggleBtn}

          {!isAuthed ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gray-500 text-white text-xs font-semibold">
                  {auth.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden sm:block">
                  {auth.user?.name ?? "Account"}
                </span>
                <svg
                  className={cn("h-4 w-4 opacity-60 transition", {
                    "rotate-180": profileOpen,
                  })}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
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
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
                >
                  <Link
                    to={roleHome}
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* mobile burger */}
        <button
          aria-label="Toggle Menu"
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-6 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-900 dark:bg-gray-100"></div>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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

            <div className="mt-3 flex items-center gap-2">
              {ThemeToggleBtn}

              {!isAuthed ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-center"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 text-center"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={roleHome}
                    onClick={() => setOpen(false)}
                    className="flex-1 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm text-center"
                  >
                    {role === "admin"
                      ? "Admin"
                      : role === "agent"
                      ? "Agent"
                      : "Dashboard"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-center"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
