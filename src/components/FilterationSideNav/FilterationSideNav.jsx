// FilterationSideNav.jsx
import { memo, useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { useParams, useSearchParams } from "react-router";

const FilterationSideNav = ({ onFilterChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    decor: false,
    accessories: false,
    stationary: false,
    toys: false,
    notebook: false,
    mugs: false,
    price: 150, // Changed to match Products component
  });

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { categoryName } = useParams();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFilterChange = (filterName) => (event) => {
    const newFilters = {
      ...localFilters,
      [filterName]: event.target.checked,
    };

    setLocalFilters(newFilters);
    buildAndSendQuery(newFilters);
  };

  const handlePriceChange = (event) => {
    const newValue = parseInt(event.target.value);
    const newFilters = {
      ...localFilters,
      price: newValue,
    };
    setLocalFilters(newFilters);
    buildAndSendQuery(newFilters);
  };

  const buildAndSendQuery = (currentFilters) => {
    const selectedCategories = [];

    categoryName
      ? selectedCategories.push(categoryName.toLowerCase().slice(0, 3))
      : query
      ? selectedCategories.push(query)
      : "";

    // Collect all selected categories
    if (currentFilters.decor) selectedCategories.push("dec");
    if (currentFilters.accessories) selectedCategories.push("access");
    if (currentFilters.stationary) selectedCategories.push("st");
    if (currentFilters.toys) selectedCategories.push("toy");
    if (currentFilters.notebook) selectedCategories.push("note");
    if (currentFilters.mugs) selectedCategories.push("mug");

    // Send both price and categories to parent

    onFilterChange({
      price: currentFilters.price,
      title: selectedCategories.join(", "),
    });
  };

  return (
    <div className="flex">
      {/* Mobile filter button */}
      <div className="md:hidden fixed bottom-24 right-6 z-50">
        <button
          onClick={handleDrawerToggle}
          className="bg-accent dark:bg-accent text-white rounded-full p-3 shadow-lg shadow-gray-400/30 dark:shadow-gray-900/50 transition-all hover:scale-105 active:scale-95"
          aria-label="Open filters"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* The actual drawer */}
      <div
        className={`fixed md:static z-40 w-72 bg-white dark:bg-gray-800 shadow-xl md:shadow-none transition-transform duration-300 ease-in-out py-10 ${
          mobileOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-5">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filter Products
            </h3>
            <button
              onClick={handleDrawerToggle}
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-5"></div>

          {/* Price Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range
              </label>
              <span className="text-sm font-medium text-primary dark:text-primary-dark">
                {localFilters.price} EGP
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="600"
              step="10"
              value={localFilters.price}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary dark:accent-primary-dark"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>25 EGP</span>
              <span>600 EGP</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Categories
            </h4>
            <div className="space-y-3">
              {[
                "decor",
                "accessories",
                "stationary",
                "toys",
                "notebook",
                "mugs",
              ].map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={localFilters[category]}
                    onChange={handleFilterChange(category)}
                    className="h-4 w-4 rounded border-gray-300 text-primary dark:text-primary-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50"
                  />
                  <label
                    htmlFor={category}
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={handleDrawerToggle}
        ></div>
      )}
    </div>
  );
};

export default memo(FilterationSideNav);
