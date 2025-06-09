import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mug from "../../assets/mug.png";
import Orange from "../../assets/orange.png";
import Flowers from "../../assets/flowers.png";
import Notes from "../../assets/notes.png";
import Cactus from "../../assets/cactus.png";

const banners = [
  {
    headline: "decorate notebooks",
    artisticText: "CREATIVE STATIONERY",
    formatText: "NOTEBOOK DESIGN",
    bgColor: "bg-red-100",
    circleColor: "bg-pink-200",
    leftImage: Cactus,
    rightImages: [
      { src: Mug, border: "border-red-400" },
      { src: Notes, border: "border-blue-400" },
    ],
    flower: Flowers,
  },
  {
    headline: "create mugs",
    artisticText: "BESPOKE DRINKWARE",
    formatText: "MUG PRINTING",
    bgColor: "bg-orange-100",
    circleColor: "bg-yellow-200",
    leftImage: Cactus,
    rightImages: [
      { src: Orange, border: "border-orange-400" },
      { src: Mug, border: "border-green-400" },
    ],
    flower: Flowers,
  },
  {
    headline: "design stickers",
    artisticText: "VIBRANT DECALS",
    formatText: "STICKER ART",
    bgColor: "bg-purple-100",
    circleColor: "bg-purple-200",
    leftImage: Cactus,
    rightImages: [
      { src: Notes, border: "border-purple-400" },
      { src: Orange, border: "border-yellow-400" },
    ],
    flower: Flowers,
  },
];

const HomeHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const banner = banners[currentIndex];

  return (
    <div
      className={`relative flex items-center justify-center w-full h-screen overflow-hidden transition-colors duration-1000 ${banner.bgColor}`}>
      {/* Quarter Circle and Cactus animated together */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.headline + "-circle-group"}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 17 }}
          className="absolute top-0 left-0 w-[450px] h-[450px] z-0">
          {/* Cactus above the circle */}
          <img
            src={banner.flower}
            alt="flower"
            className="absolute top-8 left-8 w-40 h-40 z-10"
          />
        </motion.div>
        <motion.div
          key={banner.headline + "-circle-group"}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 17 }}
          className="absolute bottom-0 left-0 w-[450px] h-[450px] z-0">
          {/* Quarter Circle */}
          <div
            className={`w-full h-full ${banner.circleColor} rounded-tr-full`}
          />

          {/* Cactus above the circle */}
          <img
            src={banner.leftImage}
            alt="Cactus"
            className="absolute bottom-14 left-8 w-60 h-60 z-10"
          />
        </motion.div>
      </AnimatePresence>

      {/* Left Side (Centered) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.headline + "-left"}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="flex flex-col space-y-6 text-center items-center justify-center relative z-10 px-6">
          {/* Dynamic Artistic Images */}
          <div className="text-md tracking-widest text-gray-500">
            {banner.artisticText}
          </div>

          {/* Letter Animation */}
          <h1 className="text-5xl font-bold leading-tight flex flex-wrap justify-center">
            {banner.headline.split("").map((letter, index) => (
              <span
                key={index}
                className="letter-appear"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}>
                {letter}
              </span>
            ))}
          </h1>

          {/* Dynamic Artwork Format */}
          <div className="text-md text-gray-500 tracking-wide">
            {banner.formatText}
          </div>

          {/* Button */}
          <button className="px-18 py-3 bg-orange-400 text-white rounded-full shadow-lg border-4 border-dashed border-orange-500 text-lg font-bold hover:bg-orange-500 transition">
            Shop Now
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Right Side - hidden on small screens */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.headline + "-right"}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
            delay: 0.2,
          }}
          className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
          {/* Flower */}
          <img
            src={banner.flower}
            alt="Flower"
            className="absolute top-4 right-28 w-40 h-40 z-20"
          />

          {/* Square 1 */}
          <img
            src={banner.rightImages[0].src}
            alt="Right Img 1"
            className={`absolute top-1/9 right-52 w-72 h-72 border-2 border-dashed ${banner.rightImages[0].border} p-2 z-10`}
          />

          {/* Square 2 */}
          <img
            src={banner.rightImages[1].src}
            alt="Right Img 2"
            className={`absolute bottom-1/9 right-16 w-72 h-72 border-2 border-dashed ${banner.rightImages[1].border} p-2 z-10`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HomeHero;
