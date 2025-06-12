import { HeartHandshake, PencilRuler, Headset, Leaf, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import img from "../../assets/images/faq.jpg";
const whyChooseUs = [
  {
    title: "Quality Craftsmanship",
    description: "Built with care using premium materials and detailed finishes.",
    icon: <PencilRuler className="w-6 h-6 text-yellow-400" />, // Lucide
  },
  {
    title: "Customize Options",
    description: "Design pieces your way with custom finishes and fabrics.",
    icon: <HeartHandshake className="w-6 h-6 text-yellow-400" />,
  },
  {
    title: "Exceptional Service",
    description: "Enjoy smooth service from purchase to delivery and beyond.",
    icon: <Headset className="w-6 h-6 text-yellow-400" />,
  },
  {
    title: "Sustainable Practices",
    description: "Committed to eco-friendly materials and responsible sourcing.",
    icon: <Leaf className="w-6 h-6 text-yellow-400" />,
  },
];

const FAQ = [
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 5-7 business days. Custom gifts require 2-3 weeks for production plus delivery time.",
  },
  {
    question: "Do you offer in-store pickup?",
    answer: "Yes, you can select free in-store pickup during checkout at our flagship locations in Cairo and Alexandria.",
  },
  {
    question: "What if my gift arrives damaged?",
    answer: "Contact us within 48 hours with photos. We will replace it or provide a refund at no cost.",
  },
  {
    question: "Can I request a personalized design?",
    answer: "Absolutely! You can personalize gifts directly from our website or contact support for help.",
  },
  {
    question: "Do you match competitor prices?",
    answer: "Yes, we match competitor prices within 14 days of purchase. Submit proof to our support team.",
  },
];

export default function AboutUs() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[640px] mb-12 border-2">
        <img src="/images/about2.jpg" className="scale-x-[-1] object-cover h-full w-full brightness-60" alt="Bubbli Hero" />
        <div className="absolute top-6 sm:top-10 left-1/2 transform -translate-x-1/2 z-50">
          <Link to="/" className="text-white text-2xl font-bold">
            Bubbli
          </Link>
        </div>
        <div className="absolute top-36 sm:top-1/3 md:top-[38%] lg:top-2/5 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/2 bg-white/40 backdrop-blur-lg p-4 sm:p-6 text-white rounded-sm shadow-lg text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Bringing Joy, One Gift at a Time</h2>
          <p className="mt-2 text-sm sm:text-base">At Bubbli, each gift is a story, crafted with heart to celebrate your special moments.</p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="relative h-[640px] mb-12">
        <img src="/images/why.jpg" className="scale-x-[-1] object-cover h-full w-full brightness-60" alt="Why Choose Us" />
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Why Choose Us</h2>
          <div className="space-y-4">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-gray-500/50 p-4 rounded shadow-md">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">{item.icon}</div>
                  <h4 className="text-md font-bold">{item.title}</h4>
                </div>
                <p className="text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="flex flex-wrap items-center justify-center">
        <img src={img} alt="FAQ" className="sm:w-1/3 md:w-1/4" />
        <div className="basis-3/5 p-6 py-24">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Popular FAQs</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Get answers to common questions about our gifts and service.</p>
          {FAQ.map((item, index) => (
            <div
              key={index}
              tabIndex={0}
              className="my-4 collapse collapse-plus bg-base-100 border-base-300 border focus:ring-1 focus:ring-teal-600 transition-all duration-400 ease-in-out"
            >
              {/* <div className="collapse-title font-semibold text-gray-800 dark:text-white">{item.question}</div>
              <div className="collapse-content text-sm text-gray-600 dark:text-gray-300">{item.answer}</div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
