import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import About from "../pages/About";
import Features from "../pages/Features";
import Pricing from "../pages/Pricing";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Protected from "./Protected";
import RoleGuard from "./RoleGuard";
import UserDashboard from "../pages/user/Dashboard";
import AgentDashboard from "../pages/agent/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

function Layout() {
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loc.pathname]);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* public */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="features" element={<Features />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* protected */}
        <Route element={<Protected />}>
          <Route element={<RoleGuard allow={["user"]} />}>
            <Route path="dashboard" element={<UserDashboard />} />
          </Route>
          <Route element={<RoleGuard allow={["agent"]} />}>
            <Route path="agent" element={<AgentDashboard />} />
          </Route>
          <Route element={<RoleGuard allow={["admin"]} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
