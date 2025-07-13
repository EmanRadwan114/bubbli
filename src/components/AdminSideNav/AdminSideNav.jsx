import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Boxes, Users, Lock, ClipboardCheck, Ticket, LogOut, Grid3x3, Sun, Moon } from "lucide-react";
import { logout } from "../../services/userService";
import { toast } from "react-toastify";

export default function () {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged Out Successfully");
    navigate(`/`);
  };

  const linkBase = "text-sm font-medium py-2 px-2 rounded-md transition duration-150 ease-in-out flex items-center";
  const hoverLight = "hover:bg-primary hover:text-white hover:scale-105";
  const hoverDark = "dark:hover:bg-primary-dark dark:hover:text-light";
  const activeLight = "bg-primary text-white";
  const activeDark = "dark:bg-primary-dark dark:text-light";

  const getClass = ({ isActive }) =>
    `${linkBase} ${isActive ? `${activeLight} ${activeDark}` : "text-dark dark:text-light"} ${hoverLight} ${hoverDark}`;
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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

    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-dvh w-full font-poppins antialiased overflow-y-auto px-3 bg-gray-100 dark:bg-gray-900 pt-20">
      {user && (
        <div id="profile" className="">
          <img src={user.image || "/default-avatar.png"} alt="User avatar" className="w-10 md:w-16 rounded-full mx-auto" />
          <div>
            <h2 className="font-medium text-xs md:text-sm text-center text-primary">{user.name}</h2>
            <p className="text-xs text-dark dark:text-light text-center">{user.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300 text-center mt-2">Administrator</p>
          </div>
        </div>
      )}
      <button
        onClick={toggleTheme}
        className="inline p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mt-3"
        aria-label={`Current mode: ${theme}. Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <>
            <Sun className="h-5 w-5 text-yellow-400 inline" /> <span className="text-sm px-2 text-yellow-400">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-5 w-5 text-gray-700 inline" /> <span className="text-sm px-2 text-gray-700">Dark Mode</span>
          </>
        )}
      </button>

      <div id="menu" className="flex flex-col space-y-2 mt-2">
        <NavLink to="/dashboard" className={getClass} end>
          <LayoutDashboard className="w-5 h-5 mr-2" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/dashboard/categories" className={getClass} end>
          <Grid3x3 className="w-5 h-5 mr-2" />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/dashboard/gifts" className={getClass} end>
          <Boxes className="w-5 h-5 mr-2" />
          <span>Products</span>
        </NavLink>

        <NavLink to="/dashboard/admins" className={getClass} end>
          <Lock className="w-5 h-5 mr-2" />
          <span>Admins</span>
        </NavLink>

        <NavLink to="/dashboard/orders" className={getClass} end>
          <ClipboardCheck className="w-5 h-5 mr-2" />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/dashboard/coupons" className={getClass} end>
          <Ticket className="w-5 h-5 mr-2" />
          <span>Coupons</span>
        </NavLink>

        <button onClick={handleLogout} className={`${linkBase} text-dark dark:text-light ${hoverLight} ${hoverDark}`}>
          <LogOut className="w-5 h-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
