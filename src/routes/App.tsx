import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ✅ real page components
import Home from "../pages/Home";
import About from "../pages/About";
import Features from "../pages/Features";
import Pricing from "../pages/Pricing";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";

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
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="features" element={<Features />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
      </Route>
    </Routes>
  );
}
