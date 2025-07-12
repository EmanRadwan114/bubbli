import { useState, useEffect } from "react";
// import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

import {
  Filter as FiFilter,
  X as FiX,
  ChevronDown as FiChevronDown,
  ChevronUp as FiChevronUp,
} from "lucide-react";
const FilterSidebar = ({ filters, onFilterChange, initialCategory }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    decor: false,
    accessories: false,
    stationary: false,
    toys: false,
    notebook: false,
    mugs: false,
    price: filters.price || 1000,
  });

  const categories = [
    { id: "decor", name: "Decor" },
    { id: "accessories", name: "Accessories" },
    { id: "stationary", name: "Stationary" },
    { id: "toys", name: "Toys" },
    { id: "notebook", name: "Notebook" },
    { id: "mugs", name: "Mugs" },
  ];

  // Initialize filters based on URL category
  useEffect(() => {
    if (initialCategory) {
      const categoryFilter = categories.find(cat => 
        cat.name.toLowerCase() === initialCategory.toLowerCase()
      );
      
      if (categoryFilter) {
        setLocalFilters(prev => ({
          ...prev,
          [categoryFilter.id]: true
        }));
      }
    }
  }, [initialCategory]);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleCategoryToggle = (categoryId) => (e) => {
    const newFilters = {
      ...localFilters,
      [categoryId]: e.target.checked,
    };
    setLocalFilters(newFilters);
    
    // Build the categories filter string
    const selectedCategories = categories
      .filter(cat => newFilters[cat.id])
      .map(cat => cat.name.toLowerCase());
    
    onFilterChange({
      price: newFilters.price,
      categories: selectedCategories.join(",")
    });
  };

  const handlePriceChange = (e) => {
    const newValue = Number(e.target.value);
    const newFilters = {
      ...localFilters,
      price: newValue,
    };
    setLocalFilters(newFilters);
    onFilterChange({
      price: newValue,
      categories: categories
        .filter(cat => newFilters[cat.id])
        .map(cat => cat.name.toLowerCase())
        .join(",")
    });
  };

  return (
    <div className="relative">
      {/* Mobile filter button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-primary dark:bg-primary-dark text-white dark:text-light p-3 rounded-full shadow-lg hover:bg-accent dark:hover:bg-accent-dark transition-colors"
      >
        <FiFilter className="text-xl" />
      </button>

      {/* Desktop/Mobile Sidebar */}
      <div
        className={`fixed md:static z-30 top-0 left-0 h-full w-64 md:w-72 bg-white dark:bg-gray-800 shadow-lg md:shadow-none transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-dark dark:text-light">
              Filter Products
            </h2>
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-light"
            >
              <FiX className="text-xl" />
            </button>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>

          {/* Price Filter */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-dark dark:text-light">
              Max Price: {localFilters.price} EGP
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={localFilters.price}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-dark"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>50</span>
              <span>1000</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h3 className="font-semibold text-dark dark:text-light mb-2">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full p-2 text-left text-dark dark:text-light hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <span>{category.name}</span>
                    {expandedCategory === category.id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>
                  {expandedCategory === category.id && (
                    <div className="pl-4 py-1">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={localFilters[category.id]}
                          onChange={handleCategoryToggle(category.id)}
                          className="rounded text-primary dark:text-primary-dark border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary-dark"
                        />
                        <span className="text-dark dark:text-light">
                          {category.name}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;