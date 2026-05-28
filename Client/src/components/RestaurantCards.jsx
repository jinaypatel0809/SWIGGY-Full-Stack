import { useRef } from "react";

const restaurants = [
  {
    id: 1,
    name: "Shararat Restaurant",
    rating: "4.0",
    cuisine: "North Indian • Asian",
    price: "₹1000 for two",
    location: "Shilp Epitome, Bodakdev, Ahmedabad",
    distance: "10.2 km",
    offers: ["Flat 30% off on pre-booking", "+ 4 more"],
    bankOffer: "Up to 10% off with bank offers",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    name: "Rupali Restaurant",
    rating: "3.6",
    cuisine: "North Indian",
    price: "₹500 for two",
    location: "Lal Darwaja, Ahmedabad",
    distance: "0.8 km",
    offers: ["Flat 15% off on pre-booking", "+ 2 more"],
    bankOffer: "Up to 10% off with bank offers",
    img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    name: "Al Baik Fast Food",
    rating: "4.1",
    cuisine: "Fast Food • Burger",
    price: "₹600 for two",
    location: "Lal Darwaja, Ahmedabad",
    distance: "0.6 km",
    offers: [],
    bankOffer: "Up to 10% off with bank offers",
    img: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    name: "Kabhi B",
    rating: "4.3",
    cuisine: "Desserts • Fast Food",
    price: "₹400 for two",
    location: "Shilp Corner, Memnagar, Ahmedabad",
    distance: "5.1 km",
    offers: ["Flat 25% off on pre-booking"],
    bankOffer: "Up to 10% off with bank offers",
    img: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    name: "The Green Bowl",
    rating: "4.5",
    cuisine: "Healthy • Salads",
    price: "₹350 for two",
    location: "SG Highway, Ahmedabad",
    distance: "3.2 km",
    offers: ["Flat 20% off on pre-booking"],
    bankOffer: "Up to 10% off with bank offers",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
  },
];

export default function RestaurantCards() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 380, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Discover best restaurants on Dineout</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
          {restaurants.map(rest => (
            <div key={rest.id}
              className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">

              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img src={rest.img} alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                <div className="hidden w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 items-center justify-center text-5xl">🍽️</div>

                {/* Name + Rating overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                  <div className="flex items-end justify-between">
                    <h3 className="text-white font-bold text-base leading-tight">{rest.name}</h3>
                    <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {rest.rating}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-4 pt-3 pb-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{rest.cuisine}</span>
                  <span className="font-medium">{rest.price}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span className="truncate flex-1">{rest.location}</span>
                  <span className="flex-shrink-0 ml-2 font-medium">{rest.distance}</span>
                </div>
              </div>

              {/* Offers */}
              <div className="px-4 pb-4 pt-2 space-y-2">
                {rest.offers.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="truncate">{rest.offers[0]}</span>
                    {rest.offers[1] && <span className="flex-shrink-0 font-bold">{rest.offers[1]}</span>}
                  </div>
                )}
                <div className="bg-green-50 border border-green-100 text-green-700 text-xs font-medium px-3 py-2 rounded-lg">
                  {rest.bankOffer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-b border-gray-100" />
      </div>
    </section>
  );
}
