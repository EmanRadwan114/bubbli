import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
const Footer = () => {
  return (
    <footer className="text-dark bg-secondary px-6 py-10 dark:text-light dark:bg-gray-900 border border-t-2 border-t-primary">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <aside className="flex flex-col gap-2">
          <Link to="/" className="text-2xl font-bold text-primary">
            Bubbli
          </Link>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 w-4/5 text-lg">
            From birthdays to just-because moments, find the perfect gift that
            says it all. <br></br> Wrapped with joy, sent with heart.
          </p>

          <div className="flex gap-3 mt-4 text-dark dark:text-light">
            <Instagram className="w-5 h-5 hover:text-primary cursor-pointer" />
            <Facebook className="w-5 h-5 hover:text-primary cursor-pointer" />
            <Youtube className="w-5 h-5 hover:text-primary cursor-pointer" />
          </div>
        </aside>

        {/* Hot Categories */}
        <nav>
          <h6 className="text-lg mb-4 font-semibold">Hot Categories</h6>
          <Link
            to="/gifts/accessories"
            className="block mb-2 hover:text-primary transition-colors"
          >
            Accessories
          </Link>
          <Link
            to="/gifts/toys"
            className="block mb-2 hover:text-primary transition-colors"
          >
            Toys
          </Link>
          <Link
            to="/gifts/mugs"
            className="block mb-2 hover:text-primary transition-colors"
          >
            Mugs
          </Link>
          <Link
            to="/gifts/decor"
            className="block mb-2 hover:text-primary transition-colors"
          >
            Decor
          </Link>
        </nav>

        {/* Support */}
        <nav>
          <h6 className="text-lg mb-4 font-semibold">Support</h6>
          <Link
            to="/about"
            className="block mb-4 hover:text-primary transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/refundPolicy"
            className="block hover:text-primary transition-colors  mb-4"
          >
            Refund Policy
          </Link>
          <Link
            to="/contacts"
            className="block hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Newsletter */}
        <nav>
          <h6 className="text-lg mb-4 font-semibold">
            Subscribe For Newsletter
          </h6>
          <form className="max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fa-solid fa-envelope text-gray-400"></i>
              </div>
              <input
                type="email"
                className="block w-full p-4  text-sm text-gray-900 border border-gray-300 bg-gray-50"
                placeholder="example@gmail.com"
                required
              />
              <button
                type="submit"
                className="light-primary-btn absolute right-2.5 bottom-2.5 text-sm px-4 py-2 rounded"
              >
                Subscribe
              </button>
            </div>
          </form>
        </nav>
      </div>

      {/* Copyright */}
      <div className="text-center mt-10 text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 Bubbli. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
