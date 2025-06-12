import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex text-gray-700 text-sm mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center ml-2">
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
              <span className="mx-2 text-gray-400 font-semibold">→</span>

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
