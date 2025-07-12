import {
  Gift,
  Heart,
  Sparkles,
  Award,
  Shield,
  Palette,
  Repeat,
} from "lucide-react";
import { Link } from "react-router";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8 text-primary dark:text-primary-dark" />,
      title: "Handcrafted Quality",
      description: "Each gift is artisan-crafted with premium materials",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary dark:text-primary-dark" />,
      title: "14-Day Easy Returns",
      description: "No-questions-asked refund policy",
    },
    {
      icon: <Palette className="w-8 h-8 text-primary dark:text-primary-dark" />,
      title: "Customization Options",
      description: "Personalize gifts with names, dates, or messages",
    },
    {
      icon: (
        <Sparkles className="w-8 h-8 text-primary dark:text-primary-dark" />
      ),
      title: "Exclusive Designs",
      description: "Unique items you won't find elsewhere",
    },
  ];

  return (
    <section className="light-main-bg dark-main-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Gift className="text-primary dark:text-primary-dark w-8 h-8 mr-3" />
            <h2 className="text-3xl font-bold text-dark dark:text-light">
              The Giftology Difference
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            What makes our gifts extra special
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-row items-center justify-center gap-10 sm:gap-20 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="light-secondary-bg dark-secondary-bg rounded-xl p-6 text-center hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <div className="bg-card dark:bg-cardAlt p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="light-secondary-bg dark-secondary-bg rounded-xl p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-dark dark:text-light mb-4">
            Our Gift Guarantee
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Every purchase comes with our promise of exceptional quality and
            heartfelt service.
          </p>
          <button className="light-primary-btn dark-primary-btn px-6 py-3 rounded-md font-medium">
            <Link to={"/about"}>Discover Our Story</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
