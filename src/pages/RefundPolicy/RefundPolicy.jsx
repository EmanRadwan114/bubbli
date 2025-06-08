import {useState } from "react";

const RefundPolicy = () => {
  const [activeTab, setActiveTab] = useState("returns");

  // Policy content
  const policySections = {
    returns: {
      title: "Exchanges & Returns",
      content: [
        "You have up to 14 days after receiving your order to inform us about any defects.",
        "To ensure fast processing:",
        [
          "Return the product in its original state",
          "Keep all labels and tags attached",
          "Items must be unused and not washed",
        ],
        "Following these guidelines helps expedite your exchange and avoids potential compensation fees.",
      ],
    },
    refunds: {
      title: "Money Refunds",
      content: [
        "For eligible returns shipped back to us:",
        [
          "We'll refund the purchase price within 14 days after inspection",
          "Refund will be issued to your original payment method",
          "Please allow additional processing time for your bank",
        ],
        "For faster processing, include your order number with the return.",
      ],
    },
  };

  const renderContent = (content) => {
    return content.map((item, index) => {
      if (Array.isArray(item)) {
        return (
          <ul
            key={`list-${index}`}
            className="list-disc pl-6 my-3 marker:text-accent dark:marker:text-accent-dark"
          >
            {item.map((point, i) => (
              <li key={`point-${i}`} className="mb-1">
                {point}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={`para-${index}`} className="mb-4">
          {item}
        </p>
      );
    });
  };

  return (
    <section className="light-secondary-bg dark-secondary-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="group flex flex-col gap-4 justify-center items-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Return & Refund Policy
          </h2>
          <hr className="w-[40%] md:w-[25%] lg:w-[15%] sm:group-hover:w-[25%] transition-all duration-500 ease-in-out h-1 bg-accent dark:bg-accent-dark border-0 rounded" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          {Object.entries(policySections).map(([key, section]) => (
            <button
              key={key}
              className={`py-3 px-6 font-medium text-lg ${
                activeTab === key
                  ? "text-primary dark:text-primary-dark border-b-2 border-primary dark:border-primary-dark"
                  : "text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-dark"
              }`}
              onClick={() => setActiveTab(key)}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="text-dark dark:text-light">
          {policySections[activeTab] &&
            renderContent(policySections[activeTab].content)}
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;


