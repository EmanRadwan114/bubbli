import React, { useRef, useState } from "react";
import { Gift, Heart, ChevronUp, ChevronDown, Star } from "lucide-react";

const ProductDetailsCard = () => {
  const images = [
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/w/h/whatsapp_image_2025-05-29_at_10.24.38_am_4_.jpeg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/w/h/whatsapp_image_2025-05-29_at_8.32.06_am_2_.jpeg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/p/i/pin_artjurnal3feb.jpg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/w/h/whatsapp_image_2025-05-29_at_10.24.38_am_4_.jpeg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/w/h/whatsapp_image_2025-05-29_at_8.32.06_am_2_.jpeg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/p/i/pin_artjurnal3feb.jpg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/w/h/whatsapp_image_2025-05-29_at_10.24.38_am_4_.jpeg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/w/h/whatsapp_image_2025-05-29_at_8.32.06_am_2_.jpeg",
    "https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/p/i/pin_artjurnal3feb.jpg",
  ];

  const [mainImage, setMainImage] = useState(images[0]);
  const thumbRef = useRef();

  const scrollThumbnails = (direction) => {
    if (!thumbRef.current) return;
    const scrollAmount = 100;
    thumbRef.current.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6">
      {/* Left Section - Images */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnails with arrows */}
        <div className="flex items-center sm:flex-col sm:max-h-[480px] max-w-full overflow-x-auto sm:overflow-y-auto scrollbar-hide h-full">
          {/* Up Arrow */}
          {images.length > 5 && (
            <button
              onClick={() => scrollThumbnails("up")}
              className="hidden sm:block mb-2 p-1 light-primary-btn dark:dark-primary-btn rounded shadow"
            >
              <ChevronUp size={18} />
            </button>
          )}

          <div
            ref={thumbRef}
            className="flex sm:flex-col justify-between gap-2 max-w-full h-full overflow-x-auto sm:overflow-y-hidden scrollbar-hide"
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 rounded-md border-2 object-cover cursor-pointer mx-1 sm:mx-0 sm:my-1 ${
                  mainImage === img ? "border-amber-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Down Arrow */}
          {images.length > 5 && (
            <button
              onClick={() => scrollThumbnails("down")}
              className="hidden sm:block mt-2 p-1 light-primary-btn dark:dark-primary-btn rounded shadow"
            >
              <ChevronDown size={18} />
            </button>
          )}
        </div>

        {/* Main Image */}
        <div className="relative w-full">
          <img
            src={mainImage}
            alt="Main product"
            className="w-full max-h-[480px] object-cover rounded-lg shadow"
          />
          <span className="absolute text-lg top-2 right-2 bg-[#5ad980] text-white px-4 py-1 rounded-full shadow">
            Deal
          </span>
        </div>
      </div>

      {/* Right Section - Info */}
      <div className="flex flex-col justify-between px-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl md:text-4xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            Eid Said Stand
          </h2>
          <button className="border border-gray-300 rounded-lg hover:bg-primary hover:text-white p-2 transition">
            <Heart className="w-7 h-7" />
          </button>
        </div>
        {/* Rating */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start">
            {[...Array(5)].map((_, i) => {
              const isFull = i + 1 <= 3.5;
              const isHalf = i + 0.5 === 3.5;

              return (
                <div key={i} className="relative w-7 h-7 mr-1">
                  {/* Empty Star Outline */}
                  <Star className="w-7 h-7 text-yellow-500 fill-none" />

                  {/* Full or Half Star Fill */}
                  {(isFull || isHalf) && (
                    <Star
                      className={`w-7 h-7 text-yellow-500 fill-yellow-500 absolute top-0 left-0 ${
                        isHalf ? "clip-half" : ""
                      }`}
                    />
                  )}
                </div>
              );
            })}
            <p className="text-gray-400 text-lg mx-2 ">3.5</p>
            <p className="ms-1 text-lg  hidden sm:inline">( 34 Reviews )</p>
          </div>
        </div>
        <p className="text-xl font-semibold text-[var(--color-dark)] dark:text-[var(--color-light)] mb-1">
          LE 249.00
        </p>
        <p className="text-green-600 mb-3">
          In stock: <span className="font-medium">5</span>
        </p>

        <hr className="my-4 border-gray-300" />

        <p className="text-gray-700 mb-1 dark:text-gray-400">
          Category:{" "}
          <span className="font-medium text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            Stationery
          </span>
        </p>
        <p className="text-gray-700 mb-1 dark:text-gray-400">
          Material:{" "}
          <span className="font-medium text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            Ceramic
          </span>
        </p>
        <p className="text-gray-700 dark:text-gray-400 mb-4 flex items-center gap-2">
          Color:{" "}
          <span className="w-5 h-5 rounded-full bg-[var(--color-accent-dark)] inline-block " />
        </p>

        <p className="text-gray-800 dark:text-gray-100 leading-relaxed mb-6">
          Celebrate Eid al-Adha with our festive Eid Said Stand! A joyful
          centerpiece for your feast table or gift.
        </p>

        <button className="flex items-center justify-center gap-3 w-full py-2 text-lg font-medium rounded-lg light-primary-btn dark:dark-primary-btn">
          <Gift />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
