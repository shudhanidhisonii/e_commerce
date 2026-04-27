
import React, { useState, useEffect } from "react";

const images = [
  "pottery.png", // Pottery
  "candles.png", // Candles
  "carpet.png", // Textiles
  "packaging.png", // Packaging
  "Butonical.jpg"  // Botanicals
];
const categories = ["Pottery", "Candles", "Textiles", "Packaging", "Botanicals"];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">

      {/* 🔥 HERO CAROUSEL */}
      <div className="w-full h-[60vh] relative overflow-hidden">
        
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="slide"
              className="w-full h-[65vh] object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 w-full flex justify-center gap-3">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full cursor-pointer ${
                current === index ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* 🔥 BELOW SECTION */}
      <div className="bg-white py-10 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mt- mb-9">Find the right product for you</h1>

        {/* 5 Circles */}
        <div className="flex gap-6 mb-8 flex-wrap justify-center">
          {categories.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              
              <div className="h-[130px] w-[130px] rounded-full overflow-hidden shadow-md">
                <img
                  src={images[i]}
                  alt={item}
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="text-sm mt-2 font-medium">{item}</p>
            </div>
          ))}
        </div>

        {/* Banner Image */}
      

      

      </div>

    </div>
  );
};

export default Hero;