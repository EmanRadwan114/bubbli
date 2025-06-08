import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex text-gray-700 text-sm mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-700 hover:text-orange-600">
            Home
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M12.293 9.293a1 1 0 011.414 0l4.243 4.243a1 1 0 01-1.414 1.414L13 11.414V17a1 1 0 11-2 0v-5.586l-3.536 3.536a1 1 0 11-1.414-1.414l4.243-4.243z" />
              </svg>

              {isLast ? (
                <span className="text-gray-500 capitalize">
                  {decodeURIComponent(name)}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-gray-700 hover:text-orange-600 capitalize">
                  {decodeURIComponent(name)}
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
