import React, { useState } from "react";
import { Lightbulb, Sparkles, Heart, Award } from "lucide-react";

const GiftTipsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: <Lightbulb className="w-5 h-5" />,
      label: "Personalization",
      title: "Make It Meaningful",
      content:
        "Personalized gifts create stronger emotional connections. Adding names, dates, or custom messages transforms ordinary items into cherished keepsakes.",
      color: "border-primary dark:border-primary-dark",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: "Presentation",
      title: "Elevate with Packaging",
      content:
        "Beautiful wrapping makes gifts feel more special. Our signature gift wrapping adds luxury to any present.",
      color: "border-accent dark:border-accent-dark",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Relevance",
      title: "Match Their Passions",
      content:
        "Gifts aligned with hobbies show you care. Consider their favorite activities, collections, or personal style for maximum impact.",
      color: "border-[#d99a5a] dark:border-[#c76a7f]",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Quality",
      title: "Invest in Lasting Value",
      content:
        "Quality items become family treasures. Premium materials and craftsmanship ensure your gift will be appreciated for years.",
      color: "border-[#4b9cad] dark:border-[#8a6bac]",
    },
  ];

  return (
    <section className="light-main-bg dark-main-bg py-16 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-3">
            Gift Guidance
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Extra and working tips to elevate your gift-giving
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center px-4 py-2 rounded-full border-2 transition-all ${
                activeTab === index
                  ? "border-primary dark:border-primary-dark bg-secondary dark:bg-secondary-dark font-medium"
                  : "border-transparent hover:bg-secondary dark:hover:bg-secondary-dark"
              }`}
            >
              <span className="mr-2">
                {React.cloneElement(tab.icon, {
                  className: `w-4 h-4 ${
                    activeTab === index
                      ? "text-primary dark:text-primary-dark"
                      : "text-gray-600 dark:text-gray-300"
                  }`,
                })}
              </span>
              <span
                className={
                  activeTab === index
                    ? "text-dark dark:text-light"
                    : "text-gray-600 dark:text-gray-300"
                }
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div
          className={`light-secondary-bg dark-secondary-bg rounded-xl p-8 border-t-4 ${tabs[activeTab].color} shadow-md`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-lg mr-4 ${
                activeTab === 0
                  ? "bg-[#FFF2E5] dark:bg-[#3A2C1A]"
                  : activeTab === 1
                  ? "bg-[#F0F7FF] dark:bg-[#1A283A]"
                  : activeTab === 2
                  ? "bg-[#FFF0F5] dark:bg-[#3A1A2C]"
                  : "bg-[#F0FFF4] dark:bg-[#1A3A2C]"
              }`}
            >
              {React.cloneElement(tabs[activeTab].icon, {
                className: "w-6 h-6 text-primary dark:text-primary-dark",
              })}
            </div>
            <h3 className="text-2xl font-bold text-dark dark:text-light">
              {tabs[activeTab].title}
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 pl-16">
            {tabs[activeTab].content}
          </p>
        </div>

        {/* Pro Tip */}
        <div className="light-secondary-bg dark-secondary-bg rounded-lg p-4 mt-6 text-center border border-cardAlt dark:border-secondary-dark">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-dark dark:text-light">
              Pro Tip:
            </span>{" "}
            {activeTab === 0
              ? "Add a handwritten note for extra personal touch"
              : activeTab === 1
              ? "Trust in our gift wrapping choice"
              : activeTab === 2
              ? "Note their favorite colors when selecting gifts"
              : "Look for artisan-made items with unique character"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GiftTipsSection;
