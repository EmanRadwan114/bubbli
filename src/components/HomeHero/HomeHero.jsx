import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Images
import Mug1 from "../../assets/images/mug1.png";
import Mug2 from "../../assets/images/mug2.jpg";
import Mug3 from "../../assets/images/mug3.jpg";
import Vase1 from "../../assets/images/vase1.jpg";
import Vase2 from "../../assets/images/vase2.jpg";
import Orange from "../../assets/images/orange.png";
import Notes from "../../assets/images/notes.png";
import Notes1 from "../../assets/images/notes1.jpg";
import Notes2 from "../../assets/images/notes2.jpg";
import Cactus from "../../assets/images/cactus.png";
import Leaves from "../../assets/images/leaves.png";
import OrangeLeaf from "../../assets/images/orang.png";
import Purple from "../../assets/images/purple.png";
import Flowers from "../../assets/images/flowers.png";
import Petals from "../../assets/images/petals.png";

// Banner Data
const banners = [
  {
    headline: "Get Notebooks",
    artisticText: "CREATIVE STATIONERY",
    formatText: "SHOP NOTEBOOKS",
    bgColor: "bg-red-100",
    circleColor: "bg-pink-200",
    tlImage: Petals,
    leftImage: Notes,
    rightImages: [
      { src: Notes1, border: "border-red-400" },
      { src: Notes2, border: "border-blue-400" },
    ],
    flower: Flowers,
  },
  {
    headline: "Buy Mugs",
    artisticText: "BESPOKE DRINKWARE",
    formatText: "SHOP MUGS",
    bgColor: "bg-orange-100",
    circleColor: "bg-yellow-200",
    tlImage: OrangeLeaf,
    leftImage: Mug1,
    rightImages: [
      { src: Mug2, border: "border-orange-400" },
      { src: Mug3, border: "border-green-400" },
    ],
    flower: Leaves,
  },
  {
    headline: "Acquire Decor",
    artisticText: "BEAUTIFUL DECOR",
    formatText: "SHOP HOME DECOR",
    bgColor: "bg-purple-100",
    circleColor: "bg-purple-200",
    tlImage: Orange,
    leftImage: Cactus,
    rightImages: [
      { src: Vase1, border: "border-purple-400" },
      { src: Vase2, border: "border-yellow-400" },
    ],
    flower: Purple,
  },
];

const HomeHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const banner = useMemo(() => banners[currentIndex], [currentIndex]);

  return (
    <div
      className={`relative flex items-center justify-center w-full h-[calc(100vh-64px)] overflow-hidden transition-colors duration-1000 ${banner.bgColor}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.headline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="contents">
          {/* Top left image */}
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 25,
              delay: 0.1,
            }}
            className="absolute top-10 right-2 lg:left-0">
            <img
              src={banner.tlImage}
              alt="flower"
              className="w-32 sm:w-36 lg:w-40 h-auto m-6"
            />
          </motion.div>

          {/* Quarter Circle + Cactus */}
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 25,
              delay: 0.2,
            }}
            className="absolute bottom-0 left-0">
            <div
              className={`w-48 sm:w-56 md:w-72 lg:w-88 h-48 sm:h-56 md:h-72 ${banner.circleColor} rounded-tr-full`}
            />
            <img
              src={banner.leftImage}
              alt="left art"
              className="absolute bottom-4 left-5 w-24 sm:w-32 md:w-40 h-auto"
            />
          </motion.div>

          {/* Text Center */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 20,
              delay: 0.3,
            }}
            className="flex flex-col space-y-6 text-center items-center justify-center z-40 px-6">
            <div className="text-sm sm:text-md tracking-widest text-gray-500">
              {banner.artisticText}
            </div>

            <h1 className="text-4xl md:text-5xl text-dark font-bold leading-tight flex flex-wrap justify-center">
              {banner.headline.split(/(\s)/).map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className={`letter-appear ${
                    letter === " " ? "inline-block w-2" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}>
                  {letter}
                </span>
              ))}
            </h1>

            <div className="text-sm sm:text-md text-gray-500 tracking-wide">
              {banner.formatText}
            </div>

            <button
              onClick={() => navigate("/gifts")}
              className="px-18 py-3 text-white rounded-full shadow-lg border-4 border-dashed border-orange-600 text-md md:text-lg font-bold light-primary-btn dark-primary-btn">
              Shop Now
            </button>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 25,
              delay: 0.4,
            }}
            className="hidden lg:block absolute right-0 top-0 w-1/2 h-full">
            <img
              src={banner.flower}
              alt="Flower"
              className="absolute lg:top-1/6 xl:top-1/12 lg:right-12 xl:right-28 lg:w-28 xl:w-40 lg:h-28 xl:h-40 z-20"
            />

            <img
              src={banner.rightImages[0].src}
              alt="Right Img 1"
              className={`absolute lg:top-1/4 xl:top-1/6 lg:right-30 xl:right-56 lg:w-48 lg:h-48 xl:w-60 xl:h-60 border-2 border-dashed ${banner.rightImages[0].border} p-0 z-10`}
            />

            <img
              src={banner.rightImages[1].src}
              alt="Right Img 2"
              className={`absolute lg:bottom-1/5 xl:bottom-1/7 lg:right-10 xl:right-16 lg:w-48 lg:h-48 xl:w-60 xl:h-60 border-2 border-dashed ${banner.rightImages[1].border} p-0 z-10`}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HomeHero;
