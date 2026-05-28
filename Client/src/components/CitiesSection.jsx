import { useState } from "react";

const foodCities = [
  "Bangalore", "Gurgaon", "Hyderabad", "Delhi",
  "Mumbai", "Pune", "Kolkata", "Chennai",
  "Ahmedabad", "Chandigarh", "Jaipur", "Surat",
  "Vadodara", "Lucknow", "Indore", "Bhopal",
];

const groceryCities = [
  "Bangalore", "Gurgaon", "Hyderabad", "Delhi",
  "Mumbai", "Pune", "Kolkata", "Chennai",
  "Ahmedabad", "Chandigarh", "Jaipur", "Surat",
  "Vadodara", "Lucknow", "Indore", "Bhopal",
];

function CityGrid({ prefix, cities }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? cities : cities.slice(0, 11);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {visible.map((city) => (
        <button
          key={city}
          className="text-sm text-gray-600 font-medium border border-gray-200 rounded-xl px-4 py-3 hover:border-orange-400 hover:text-orange-500 transition-colors text-center bg-white hover:bg-orange-50"
        >
          {prefix} {city}
        </button>
      ))}
      <button
        onClick={() => setShowAll(!showAll)}
        className="text-sm font-bold text-orange-500 border border-gray-200 rounded-xl px-4 py-3 hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5"
      >
        {showAll ? "Show Less" : "Show More"}
        <svg
          className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

export default function CitiesSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Food Delivery Cities */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Cities with food delivery</h2>
          <CityGrid prefix="Order food online in" cities={foodCities} />
        </div>

        {/* Grocery Delivery Cities */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Cities with grocery delivery</h2>
          <CityGrid prefix="Order grocery delivery in" cities={groceryCities} />
        </div>
      </div>
    </section>
  );
}
