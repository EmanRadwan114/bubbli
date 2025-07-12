import { useState, useEffect } from "react";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingCart,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const favorites = [];
  const totalCartItems = 0;
  const user = localStorage.getItem("user");
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Menu", to: "/gifts" },
    { label: "About", to: "/about" },
    { label: "Contact Us", to: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    localStorage.setItem("theme", theme);
    body.setAttribute("data-theme", theme);

    // Apply dark class for Tailwind
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const body = document.body;

    // Set data-theme attribute
    body.setAttribute("data-theme", theme);

    // Update localStorage
    localStorage.setItem("theme", theme);

    // Optional: Add/remove dark class for Tailwind
    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <header
        className={`
        fixed w-full z-50 transition-all duration-300
        ${
          scrolled || !isHomePage
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }
      `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <RouterLink to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary dark:text-primary-light">
                  Bubbli
                </span>
              </RouterLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-8">
              {navLinks.map(({ label, to }) => (
                <RouterLink
                  key={to}
                  to={to}
                  className={`
                    font-medium transition-colors
                    ${
                      location.pathname === to
                        ? "text-primary dark:text-primary-light"
                        : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                    }
                  `}
                >
                  {label}
                </RouterLink>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search Bar - Desktop */}
              <form
                onSubmit={handleSubmit}
                className="hidden md:flex items-center border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1"
              >
                <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 bg-transparent outline-none text-gray-700 dark:text-gray-200  md:w-30 lg:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="hidden md:block p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Current mode: ${theme}. Switch to ${
                  theme === "dark" ? "light" : "dark"
                } mode`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </button>

              {/* User Icon */}
              <RouterLink
                to={user.role == "user" ? "/profile" : "/login"}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <User
                  className={`
                  h-5 w-5 
                  ${
                    location.pathname === "/profile"
                      ? "text-primary dark:text-primary-light"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
                />
              </RouterLink>

              {/* Favorites */}
              <RouterLink
                to="/wishlist"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
              >
                <Heart
                  className={`
                  h-5 w-5 
                  ${
                    location.pathname === "/favorites"
                      ? "text-primary dark:text-primary-light"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
                />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </RouterLink>

              {/* Cart */}
              <RouterLink
                to="/cart"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
              >
                <ShoppingCart
                  className={`
                  h-5 w-5 
                  ${
                    location.pathname === "/cart"
                      ? "text-primary dark:text-primary-light"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
                />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </RouterLink>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`
        fixed inset-0 z-50 transform transition-all duration-300 ease-in-out
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        md:hidden bg-white dark:bg-gray-900 w-64
      `}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-primary dark:text-primary-light">
              Bubbli
            </span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Current mode: ${theme}. Switch to ${
              theme === "dark" ? "light" : "dark"
            } mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {/* Search Bar - Mobile */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex items-center border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 mb-4"
          >
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 bg-transparent outline-none text-gray-700 dark:text-gray-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Mobile Navigation Links */}
          <nav className="space-y-2">
            {navLinks.map(({ label, to }) => (
              <RouterLink
                key={to}
                to={to}
                className={`
                  block px-4 py-2 rounded-lg font-medium transition-colors
                  ${
                    location.pathname === to
                      ? "bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }
                `}
                onClick={() => setDrawerOpen(false)}
              >
                {label}
              </RouterLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
