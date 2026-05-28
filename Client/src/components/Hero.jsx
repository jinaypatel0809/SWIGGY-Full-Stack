import { useState } from "react";

const services = [
  {
    id: 1,
    title: "FOOD DELIVERY",
    subtitle: "FROM RESTAURANTS",
    discount: "UPTO 60% OFF",
    emoji: "🍳",
    bg: "from-orange-50 to-orange-100",
  },
  {
    id: 2,
    title: "INSTAMART",
    subtitle: "INSTANT GROCERY",
    discount: "UPTO 60% OFF",
    emoji: "🧺",
    bg: "from-green-50 to-green-100",
  },
  {
    id: 3,
    title: "DINEOUT",
    subtitle: "EAT OUT & SAVE MORE",
    discount: "UPTO 50% OFF",
    emoji: "🍽️",
    bg: "from-purple-50 to-purple-100",
  },
];

// Food illustrations using emoji as placeholders (replace with real images)
const foodImages = {
  1: "🍳",
  2: "🧺",
  3: "🍽️",
};

export default function Hero() {
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [search, setSearch] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);

  const cities = ["Ahmedabad", "Mumbai", "Delhi", "Bangalore", "Pune", "Surat", "Hyderabad", "Chennai"];

  return (
    <section className="bg-orange-500 relative overflow-hidden">
      {/* Decorative food images - left */}
      <div className="absolute left-0 top-0 h-full w-40 pointer-events-none select-none hidden lg:flex flex-col justify-center items-start pl-4 gap-2 opacity-90">
        <div className="text-7xl rotate-[-10deg] translate-y-4">🥦</div>
        <div className="text-5xl rotate-[5deg] translate-x-4">🌽</div>
        <div className="text-6xl rotate-[-5deg]">🌶️</div>
        <div className="text-5xl rotate-[8deg] translate-x-2">🧅</div>
        <div className="text-4xl rotate-[-8deg] translate-x-6">🥕</div>
      </div>

      {/* Decorative food images - right */}
      <div className="absolute right-0 top-0 h-full w-40 pointer-events-none select-none hidden lg:flex flex-col justify-center items-end pr-4 gap-2 opacity-90">
        <div className="text-5xl rotate-[15deg]">🍣</div>
        <div className="text-4xl rotate-[-10deg]">🥢</div>
        <div className="text-6xl rotate-[5deg]">🍱</div>
        <div className="text-5xl rotate-[-8deg]">🍤</div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-0 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-8">
          Order food &amp; groceries. Discover<br />best restaurants. Swiggy it!
        </h1>

        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12">
          {/* Location Picker */}
          <div className="relative">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-2 bg-white rounded-full px-5 py-3.5 text-sm text-gray-500 font-medium shadow hover:shadow-md transition-shadow w-full sm:w-auto min-w-[220px]"
            >
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className={deliveryLocation ? "text-gray-800 font-semibold" : "text-gray-400"}>
                {deliveryLocation || "Enter your delivery location"}
              </span>
              <svg className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${locationOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {locationOpen && (
              <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden py-2">
                {cities.map(city => (
                  <button key={city} onClick={() => { setDeliveryLocation(city); setLocationOpen(false); }}
                    className="w-full text-left px-5 py-3 text-sm hover:bg-orange-50 hover:text-orange-600 font-medium text-gray-700 transition-colors flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for restaurant, item or more"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white rounded-full px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 shadow hover:shadow-md transition-shadow outline-none focus:ring-2 focus:ring-white/50 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {services.map(service => (
            <div key={service.id}
              className="bg-white rounded-3xl p-5 text-left relative overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group">
              <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{service.title}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wide">{service.subtitle}</p>
              <span className="inline-block mt-2 text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {service.discount}
              </span>

              {/* Arrow button */}
              <div className="absolute bottom-4 left-5">
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Food emoji illustration */}
              <div className="absolute bottom-0 right-2 text-7xl opacity-90 group-hover:scale-110 transition-transform duration-300 pb-2">
                {foodImages[service.id]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
