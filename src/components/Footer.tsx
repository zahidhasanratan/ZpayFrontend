import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-top border-gray-100 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="font-bold text-xl text-indigo-700 mb-2">ZPay</div>
          <p className="text-sm text-gray-600">
            A smarter way to move money — fast, secure, and everywhere you need
            it.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-indigo-700">
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-indigo-700">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-indigo-700">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-700">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Legal</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-indigo-700">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-700">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-700">
                Fees
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Get the app</div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-gray-900 text-white grid place-items-center text-xs rounded">
              App Store
            </div>
            <div className="h-10 w-28 bg-gray-900 text-white grid place-items-center text-xs rounded">
              Play Store
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-6">
        © {new Date().getFullYear()} ZPay. All rights reserved.
      </div>
    </footer>
  );
}
