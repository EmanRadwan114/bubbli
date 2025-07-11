import React from "react";
import { Gift, Heart, Star } from "lucide-react";

const AboutComponent = () => {
  return (
    <main className="light-main-bg dark-main-bg min-h-screen px-6 py-12 md:px-16 relative">
      {/* Header Section */}
      <section className="text-center mb-12 mx-2">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-dark mb-4">About Our Gift Shop</h1>
        <p className="text-gray-600 dark:text-light max-w-2xl mx-auto">
          At our gift shop, we believe that the perfect gift tells a story. Whether you're celebrating a birthday, an anniversary, or just want to
          surprise someone, we've got you covered.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid gap-10 md:grid-cols-3 text-center mb-10 pb-10 relative">
        <div className="p-6 bg-secondary dark:bg-gray-900 rounded-xl shadow transition-transform duration-300 ease-in-out hover:scale-105 relative top-0">
          <Gift className="mx-auto text-primary dark:text-primary-dark mb-4" size={40} />
          <h3 className="font-semibold text-xl mb-2">Curated Gifts</h3>
          <p className="text-sm text-gray-700 dark:text-light">
            Our collection is handpicked to bring you the most thoughtful and meaningful gift ideas.
          </p>
        </div>
        <div className="p-6 bg-secondary dark:bg-gray-900 rounded-xl shadow transition-transform duration-300 ease-in-out hover:scale-105 relative md:top-10">
          <Heart className="mx-auto text-primary dark:text-primary-dark mb-4" size={40} />
          <h3 className="font-semibold text-xl mb-2">Made with Love</h3>
          <p className="text-sm text-gray-700 dark:text-light">Every item is crafted or selected with love to ensure it brings a smile.</p>
        </div>
        <div className="p-6 bg-secondary dark:bg-gray-900 rounded-xl shadow transition-transform duration-300 ease-in-out hover:scale-105 relative md:top-30">
          <Star className="mx-auto text-primary dark:text-primary-dark mb-4" size={40} />
          <h3 className="font-semibold text-xl mb-2">Customer Favorites</h3>
          <p className="text-sm text-gray-700 dark:text-light">Discover our best-selling gifts loved by customers across the country.</p>
        </div>
      </section>

      <section className="flex flex-col items-center gap-10 mb-10 justify-center mt-10 px-4  pb-10 border-b-2 border-accent dark:border-accent-dark">
        <div className="w-full max-w-6xl mt-15 pt-15 border-t-2 border-accent">
          <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-6 text-center lg:text-left">What We Value Most</h2>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="flex flex-col gap-4 w-full lg:w-1/2 pl-2">
              {[
                {
                  title: "Quality First",
                  description: "We ensure every gift meets high standards.",
                  icon: <Star className="text-primary dark:text-primary-dark" size={24} />,
                },
                {
                  title: "Customer Joy",
                  description: "Seeing our customers happy is our biggest reward.",
                  icon: <Heart className="text-primary dark:text-primary-dark" size={24} />,
                },
                {
                  title: "Creativity",
                  description: "We embrace imagination in how we design and present every gift.",
                  icon: <Gift className="text-primary dark:text-primary-dark" size={24} />,
                },
                {
                  title: "Trust",
                  description: "Our customers count on us for reliable and thoughtful service.",
                  icon: <Star className="text-primary dark:text-primary-dark" size={24} />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-secondary dark:bg-gray-900 p-4 rounded-lg shadow transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-md mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-light">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Column */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="https://img.freepik.com/free-photo/christmas-shopping-concept-with-cart-bag_23-2147719636.jpg?uid=R122390214&ga=GA1.1.1139909252.1747612214&semt=ais_hybrid&w=740"
                alt="Our Values"
                className="w-full max-w-md rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Section: Why Choose Us */}
      <section className="text-center mb-10 mt-5 relative">
        <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-4">Why Choose Us</h2>
        <p className="text-gray-600 dark:text-light max-w-xl mx-auto mb-10">
          We’re more than just a gift shop. Here’s what makes us your go-to choice for every occasion.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 relative">
          <div className="bg-secondary p-6 rounded-xl shadow transition-transform duration-300 ease-in-out hover:scale-105 dark:bg-gray-900">
            <h4 className="font-semibold text-lg mb-2">Fast & Reliable Delivery</h4>
            <p className="text-sm text-gray-600 dark:text-light">Get your gifts delivered on time, every time, with our trusted shipping partners.</p>
          </div>
          <div className="bg-secondary dark:bg-gray-900 p-6 rounded-xl shadow transition-transform duration-300 ease-in-out hover:scale-105 relative md:top-5">
            <h4 className="font-semibold text-lg mb-2">Unique Customization</h4>
            <p className="text-sm text-gray-600 dark:text-light">Personalize your gifts with names, messages, and creative touches that stand out.</p>
          </div>
          <div className="bg-secondary dark:bg-gray-900 p-6 rounded-xl shadow transition-transform duration-300 ease-in-out hover:scale-105">
            <h4 className="font-semibold text-lg mb-2">24/7 Support</h4>
            <p className="text-sm text-gray-600 dark:text-light">We’re here to help you with any questions or issues, anytime you need us.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutComponent;
