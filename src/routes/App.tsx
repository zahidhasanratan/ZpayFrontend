import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import { useEffect } from "react";

// For now, we’ll stub these routes until you add pages:
const About = () => (
  <div className="mx-auto max-w-7xl px-4 py-14">
    <h1 className="text-3xl font-extrabold">About</h1>
  </div>
);
const Features = () => (
  <div className="mx-auto max-w-7xl px-4 py-14">
    <h1 className="text-3xl font-extrabold">Features</h1>
  </div>
);
const Pricing = () => (
  <div className="mx-auto max-w-7xl px-4 py-14">
    <h1 className="text-3xl font-extrabold">Pricing</h1>
  </div>
);
const Contact = () => (
  <div className="mx-auto max-w-7xl px-4 py-14">
    <h1 className="text-3xl font-extrabold">Contact</h1>
  </div>
);
const FAQ = () => (
  <div className="mx-auto max-w-7xl px-4 py-14">
    <h1 className="text-3xl font-extrabold">FAQ</h1>
  </div>
);

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
