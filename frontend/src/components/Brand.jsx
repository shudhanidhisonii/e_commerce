import React from "react";

export default function ImpactSection() {
  return (
    <div className=" py-16 px-6 flex justify-center">
      <div className="max-w-6xl w-full">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Check Brand Contribution towards <br />
          sustainability
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT BIG CARD */}
          <div className="relative md:col-span-2 h-[320px] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="absolute bottom-6 left-6 text-white max-w-md">
              <h3 className="text-2xl font-semibold mb-2">
                Know Our Impact
              </h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Our commitment to sustainability goes beyond recycling – it's about
                creating real impact. From reducing waste to supporting eco-friendly
                practices, we're dedicated to building a cleaner, more sustainable
                future.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">

            {/* TOP SMALL CARDS */}
            <div className="grid grid-cols-2 gap-6">

              {/* Card 1 */}
              <div className="relative h-[150px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                  <h3 className="text-xl font-bold">312,000</h3>
                  <p className="text-xs">CO2 KG Offsets/Year</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative h-[150px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                  <h3 className="text-xl font-bold">12,000+</h3>
                  <p className="text-xs text-center">
                    Trees planted by <br /> Team EcoMart
                  </p>
                </div>
              </div>
            </div>

            {/* BOTTOM WIDE CARD */}
            <div className="relative h-[150px] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>

              <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                <h3 className="text-2xl font-bold">10,000+</h3>
                <p className="text-sm">Jobs created in India</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}