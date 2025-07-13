import { useEffect, useState } from "react";

const FilterSidebar = ({ filters, onFilterChange }) => {
  // ✅ Static categories
  const categories = [
    { _id: "6844ab560e3f78e6d871245e", name: "decor" },
    { _id: "6844a9b40e3f78e6d8712458", name: "accessories" },
    { _id: "6844a6140e3f78e6d8712454", name: "stationary" },
    { _id: "6844a5490e3f78e6d871244c", name: "toys" },
    { _id: "6844a46d0e3f78e6d8712446", name: "notebook" },
    { _id: "6844a3af0e3f78e6d8712442", name: "mugs" },
  ];

  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handlePriceChange = (e) => {
    const updated = {
      ...localFilters,
      price: Number(e.target.value),
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleCategoryChange = (e) => {
    const updated = {
      ...localFilters,
      category: e.target.value,
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow w-full max-w-xs">
      <h2 className="text-xl font-bold mb-4">Filter Products</h2>

      <div className="mb-6">
        <label className="block font-medium mb-2">
          Max Price: {localFilters.price} EGP
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={localFilters.price}
          onChange={handlePriceChange}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Category</label>
        <select
          value={localFilters.category || ""}
          onChange={handleCategoryChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name.toLocaleLowerCase()}>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
