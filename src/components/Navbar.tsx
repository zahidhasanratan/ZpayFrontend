import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import cn from "classnames";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  const base = (active: boolean) =>
    cn("px-3 py-2 text-sm transition-colors", {
      "text-indigo-700 font-semibold": active,
      "text-gray-700 hover:text-indigo-700": !active,
    });

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-indigo-700">
          ZPay
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => base(isActive)}>
            Home
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
          >
            <button className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-700">
              Solutions
            </button>
            {mega && (
              <div className="absolute left-0 mt-2 w-[560px] bg-white shadow-xl rounded-xl border border-gray-100 p-6 grid grid-cols-3 gap-4">
                {[
                  { t: "Wallet App", d: "P2P, bills, QR", to: "/features" },
                  { t: "Agent Portal", d: "Cash-in/out", to: "/about" },
                  { t: "Merchant Tools", d: "POS & QR", to: "/pricing" },
                  { t: "Security", d: "2FA, alerts", to: "/features" },
                  { t: "Analytics", d: "Spend trends", to: "/features" },
                  { t: "Support", d: "Help center", to: "/contact" },
                ].map((i) => (
                  <Link
                    key={i.t}
                    to={i.to}
                    className="rounded-lg p-3 hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{i.t}</div>
                    <div className="text-xs text-gray-600">{i.d}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
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

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/features"
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile */}
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
            <Link
              to="/features"
              className="mt-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
