import React from "react";

export default function PromoCards() {
  const cards = [
    {
      tag: "BEST DEALS",
      title: "Sale of the Month",
      desc: "",
      price: "",
      image:
        "image7.png",
      extra: "timer",
    },
    {
      tag: "FULLY ECO-FRIENDLY",
      title: "Pure Honey Tea",
      desc: "Started at ",
      price: "₹79.99",
      image:
        "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
    },
    {
      tag: "SUMMER SALE",
      title: "100% Recyclable",
      desc: "Up to ",
      price: "15% OFF",
      image:
        "image9.png",
    },
  ];

  return (
    <div className="py-20 flex justify-center">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full px-6">

        {cards.map((card, i) => (
          <div
            key={i}
            className="relative h-[500px] rounded overflow-hidden"
          >
            {/* BACKGROUND IMAGE */}
            <img
              src={card.image}
              alt=""
              className="absolute w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* CONTENT */}
            <div className="relative z-10 text-white p-8 flex flex-col justify-between h-full">

              <div>
                <p className="text-xs tracking-widest opacity-80 mb-2">
                  {card.tag}
                </p>

                <h2 className="text-2xl font-semibold mb-4">
                  {card.title}
                </h2>

                {/* TIMER (only first card) */}
                {card.extra === "timer" && (
                  <div className="flex gap-6">
                    {[
                      { num: "39", label: "DAYS" },
                      { num: "23", label: "HOURS" },
                      { num: "53", label: "MINS" },
                      { num: "54", label: "SECS" },
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-lg font-semibold">
                          {item.num}
                        </p>
                        <p className="text-[10px] opacity-70">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* PRICE / OFFER */}
                {card.price && (
                  <p className="text-sm mt-2">
                    {card.desc}
                    <span className="text-yellow-400 font-semibold ml-1">
                      {card.price}
                    </span>
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <button className="bg-white text-black px-5 py-2 rounded-full w-fit text-sm font-medium hover:scale-105 transition">
                Shop Now →
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}