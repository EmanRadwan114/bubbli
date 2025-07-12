import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"; // or any other icon library

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Truncate long text for mobile
  const truncate = (str) => {
    if (window.innerWidth < 640 && str.length > 10) {
      return str.substring(0, 8) + "...";
    }
    return str;
  };

  return (
    <nav className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg mb-4">
      <ol className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap justify-center">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 transition-colors duration-200 text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          const decodedName = decodeURIComponent(name);

          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400 dark:text-gray-500" />
              {isLast ? (
                <span className="text-orange-500 dark:text-orange-400 font-medium capitalize">
                  {truncate(decodedName)}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 transition-colors duration-200 text-sm font-medium capitalize"
                >
                  {truncate(decodedName)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
