import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useDashboardMetric } from "../../hooks/useAdmins";
import { formatChartData } from "../../utils/formatChartData";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useBestSellingProducts, useLeastOrderedProducts } from "../../hooks/useProducts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const metricOptions = [
  { label: "Top Products", type: "products", metric: "top-ordered" },
  { label: "Least Products", type: "products", metric: "least-ordered" },
  { label: "Total Orders", type: "orders", metric: "total" },
  { label: "Orders Per Month", type: "orders", metric: "monthly" },
  { label: "Revenue Per Month", type: "orders", metric: "revenue" },
];

export default function DashboardHome() {
  const [selectedOption, setSelectedOption] = useState(metricOptions[0]);
  const [year, setYear] = useState(new Date().getFullYear());

  const showYear = ["monthly", "revenue"].includes(selectedOption.metric);

  const { data, isLoading } = useDashboardMetric({
    type: selectedOption.type,
    metric: selectedOption.metric,
    year: showYear ? year : undefined,
  });

  const chartData = formatChartData(selectedOption.metric, data);
  const user = localStorage.getItem("user");

  // Best Selling Prds
  const { data: bestSelling, loadingBest } = useBestSellingProducts();

  // Least Ordered Prds
  const { data: leastOrdered, loadingLeast } = useLeastOrderedProducts();

  return (
    <div className="space-y-8">
      {/* Analytics Progress Section */}
      <div className="border border-cardAlt dark:border-secondary-dark rounded-xl shadow-sm overflow-hidden">
        <div className="light-main-bg dark-secondary-bg text-center p-8 border-b border-cardAlt dark:border-secondary-dark">
          <h2 className="text-4xl  font-bold  text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            Track Your Website Analytics Progress
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Visualize your monthly orders and revenue growth to make data-driven
            decisions
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3 className="font-semibold text-dark dark:text-light">
                {selectedOption.label}
              </h3>
              {showYear && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Year: {year}
                </p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <select
                className="border border-cardAlt dark:border-secondary-dark rounded-lg px-3 py-2 bg-white dark:bg-secondary-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark text-sm"
                value={selectedOption.label}
                onChange={(e) =>
                  setSelectedOption(
                    metricOptions.find((opt) => opt.label === e.target.value)
                  )
                }
              >
                {metricOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {showYear && (
                <select
                  className="border border-cardAlt dark:border-secondary-dark rounded-lg px-3 py-2 bg-white dark:bg-secondary-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark text-sm"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {[2025, 2024, 2023].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 border border-dashed border-cardAlt dark:border-secondary-dark rounded-lg">
              <p className="text-center text-gray-500 dark:text-gray-400">
                <LoadingSpinner />
              </p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex justify-center items-center h-64 border border-dashed border-cardAlt dark:border-secondary-dark rounded-lg">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No financial data available
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-secondary-dark p-4 rounded-lg border border-cardAlt dark:border-secondary-dark">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    strokeWidth={0.5}
                    tickMargin={10}
                  />
                  <YAxis stroke="#6b7280" strokeWidth={0.5} tickMargin={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-white)",
                      borderColor: "var(--color-cardAlt)",
                      borderRadius: "0.375rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      color: "var(--color-dark)",
                    }}
                    itemStyle={{
                      color: "var(--color-primary)",
                      fontWeight: "500",
                    }}
                    formatter={(value) => {
                      if (selectedOption.metric === "revenue") {
                        return [
                          `$${value.toLocaleString()}`,
                          selectedOption.label,
                        ];
                      }
                      return [value, selectedOption.label];
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                    className="hover:fill-primary-dark dark:hover:fill-accent-dark transition-colors"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Best Selling Products Section */}
      <div className="border border-cardAlt dark:border-secondary-dark rounded-xl shadow-sm overflow-hidden">
        <div className="light-main-bg dark-secondary-bg text-center p-8 border-b border-cardAlt dark:border-secondary-dark">
          <h2 className="text-4xl  font-bold  text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            Best Selling Products
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Analyze your best selling products and inventory performance
          </p>
        </div>

        <div className="p-5">
          {loadingBest ? (
            <div className="flex justify-center items-center h-40 border border-dashed border-cardAlt dark:border-secondary-dark rounded-lg">
              <p className="text-center text-gray-500 dark:text-gray-400">
                <LoadingSpinner />
              </p>
            </div>
          ) : bestSelling?.length === 0 ? (
            <div className="flex justify-center items-center h-40 border border-dashed border-cardAlt dark:border-secondary-dark rounded-lg">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No product data available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {bestSelling?.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistArr={[]}
                  onAddToCart={() => {}}
                  onAddToWishlist={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Best Least Ordered Products Section */}
      <div className="border border-cardAlt dark:border-secondary-dark rounded-xl shadow-sm overflow-hidden">
        <div className="light-main-bg dark-secondary-bg text-center p-8 border-b border-cardAlt dark:border-secondary-dark">
          <h2 className="text-4xl  font-bold  text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            Least Ordered Products
          </h2>
        </div>

        <div className="p-5">
          {loadingLeast ? (
            <div className="flex justify-center items-center h-40 border border-dashed border-cardAlt dark:border-secondary-dark rounded-lg">
              <p className="text-center text-gray-500 dark:text-gray-400">
                <LoadingSpinner />
              </p>
            </div>
          ) : bestSelling?.length === 0 ? (
            <div className="flex justify-center items-center h-40 border border-dashed border-cardAlt dark:border-secondary-dark rounded-lg">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No product data available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {leastOrdered?.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistArr={[]}
                  onAddToCart={() => {}}
                  onAddToWishlist={() => {}}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
