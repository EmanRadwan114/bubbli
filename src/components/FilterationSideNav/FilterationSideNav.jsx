// FilterationSideNav.jsx
import { memo, useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

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
      category: e.target.value,
    };
    setLocalFilters(newFilters);
    buildAndSendQuery(newFilters);
  };

  const buildAndSendQuery = (currentFilters) => {
    const selectedCategories = [];

    // Collect all selected categories
    if (currentFilters.decor) selectedCategories.push("dec");
    if (currentFilters.accessories) selectedCategories.push("accessor");
    if (currentFilters.stationary) selectedCategories.push("stati");
    if (currentFilters.toys) selectedCategories.push("toy");
    if (currentFilters.notebook) selectedCategories.push("notebook");
    if (currentFilters.mugs) selectedCategories.push("mug");

    // Send both price and categories to parent
    console.log({
      price: currentFilters.price,
      title: selectedCategories.join(", "),
    });

    onFilterChange({
      price: currentFilters.price,
      title: selectedCategories.join(", "),
    });
  };

  return (
    <div className="flex">
      {/* Mobile filter button */}
      <div className="md:hidden fixed bottom-8 right-8 z-50">
        <button
          onClick={handleDrawerToggle}
          className="light-primary-btn dark-primary-btn rounded-full p-3 shadow-lg transition-all hover:scale-110"
        >
          <Filter className="h-6 w-6" />
        </button>
      </div>

      {/* The actual drawer */}
      <div
        className={`fixed md:static z-40 h-full w-80 bg-light-bg dark:bg-secondary-dark transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-dark dark:text-light">
              Filter Menu
            </h3>
            <button
              onClick={handleDrawerToggle}
              className="md:hidden text-dark dark:text-light"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="border-b border-cardAlt dark:border-secondary-dark mb-4"></div>

          {/* Price Filter */}
          <div className="mb-6 px-2">
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">
              Maximum Price: {localFilters.price} EGP
            </label>
            <input
              type="range"
              min="25"
              max="600"
              step="10"
              value={localFilters.price}
              onChange={handlePriceChange}
              className="w-full h-2 bg-cardAlt dark:bg-secondary-dark rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-dark"
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
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
                  className="h-4 w-4 rounded border-gray-300 text-primary dark:text-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                />
                <label
                  htmlFor={category}
                  className="ml-3 text-sm text-dark dark:text-light capitalize"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={handleDrawerToggle}
        ></div>
      )}
    </div>
  );
};

export default memo(FilterationSideNav);
