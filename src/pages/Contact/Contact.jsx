import React from "react";
import { Phone, Mail, MapPin, Gift, Heart, Sparkles } from "lucide-react";
import flowers from "../../assets/images/flowers.png";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="text-primary dark:text-primary-dark" size={36} />,
      title: "Phone",
      description: "+20 1123 523 055",
    },
    {
      icon: <Mail className="text-primary dark:text-primary-dark" size={36} />,
      title: "Email",
      description: "Bubbli_smart@gmail.com",
    },
    {
      icon: <MapPin className="text-primary dark:text-primary-dark" size={36} />,
      title: "Address",
      description: "890 Street Smart Village, Egypt.",
    },
  ];

  return (
    <main 
      className="min-h-screen px-6 py-12 md:px-16 relative overflow-hidden bg-gradient-to-b from-white/90 to-white/70 dark:from-gray-900/95 dark:to-gray-800/95"
      style={{
        backgroundImage: `url(${flowers})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 opacity-20 dark:opacity-10 animate-float">
        <Gift size={60} className="text-primary dark:text-primary-dark" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 dark:opacity-10 animate-float-delay">
        <Heart size={60} className="text-pink-500 dark:text-pink-400" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-20 dark:opacity-10 animate-pulse">
        <Sparkles size={50} className="text-yellow-400 dark:text-yellow-300" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary dark:text-primary-dark mb-6">
            Let's Connect!
          </h1>
          
          {/* Divider with gift icon */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-20 h-1 bg-primary dark:bg-primary-dark rounded-full"></div>
            <Gift className="text-primary dark:text-primary-dark text-4xl animate-bounce" />
            <div className="w-20 h-1 bg-primary dark:bg-primary-dark rounded-full"></div>
          </div>
          
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions about our gifts? Need help with an order? Or maybe you just want to share your gift ideas with us?
          </p>
        </section>

        {/* Contact Info Cards */}
        <section className="grid gap-10 md:grid-cols-3 mb-20">
          {contactInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg dark:shadow-gray-700/30 text-center transition-all duration-300 hover:scale-105"
            >
              <div className="flex justify-center mb-6">
                {info.icon}
              </div>
              <h3 className="text-2xl font-bold text-primary dark:text-primary-dark mb-3">
                {info.title}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {info.description}
              </p>
            </div>
          ))}
        </section>

        {/* Contact Form Section - No animations */}
        <section className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/30 p-10 mb-20">
          <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-8 text-center">
            Send Us a Message
          </h2>
          
          <form className="grid gap-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-5 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-5 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-5 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark dark:bg-gray-700 dark:text-white"
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-5 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark dark:bg-gray-700 dark:text-white"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-primary dark:bg-primary-dark text-white text-xl py-4 px-8 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300 flex items-center justify-center gap-3"
            >
              <Sparkles size={20} />
              Send Message
              <Sparkles size={20} />
            </button>
          </form>
        </section>

        {/* Map Section */}
        <section className="rounded-xl overflow-hidden shadow-lg dark:shadow-gray-700/30 mb-20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.269033427007!2d31.02098231511592!3d30.07277498187038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585b977a5c432f%3A0x2e5d742b25405395!2sSmart%20Village!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-xl"
          ></iframe>
        </section>

        {/* Store Hours Section */}
        <section className="bg-primary dark:bg-primary-dark text-white rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-8">Store Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
              { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
              { day: "Sunday", hours: "11:00 AM - 5:00 PM" },
              { day: "Holidays", hours: "Special Hours" },
            ].map((item, index) => (
              <div key={index} className="bg-white/20 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">{item.day}</h3>
                <p className="text-lg">{item.hours}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CSS Animations (only for decorative elements) */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
};

export default Contact;