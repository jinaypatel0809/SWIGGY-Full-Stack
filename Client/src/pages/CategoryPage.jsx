import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCart } from "../utils/cart";

const categoryMeta = {
  "north-indian":  { name: "North Indian",  color: "from-orange-400 to-red-500",    image: "https://eastindianrecipes.net/wp-content/uploads/2022/09/How-to-Make-North-Indian-Thali-Vegetarian-7.jpg" },
  "south-indian":  { name: "South Indian",  color: "from-green-400 to-teal-500",    image: "https://blog.bigbasket.com/wp-content/uploads/2023/04/South-Indian-main_584509564.jpeg" },
  chinese:         { name: "Chinese",       color: "from-red-400 to-rose-600",      image: "https://images.unsplash.com/photo-1635685296916-95acaf58471f?w=600" },
  pizza:           { name: "Pizza",         color: "from-red-400 to-pink-500",      image: "https://i.pinimg.com/736x/ab/e6/57/abe65721a6d06545c99230151aab0177.jpg" },
  burger:          { name: "Burger",        color: "from-yellow-400 to-orange-500", image: "https://img.freepik.com/premium-photo/burger-food-photography_398492-6506.jpg" },
  biryani:         { name: "Biryani",       color: "from-amber-400 to-yellow-600",  image: "https://img.freepik.com/premium-photo/hyderabadi-chicken-biryani-food-photos_410516-42775.jpg" },
  desserts:        { name: "Desserts",      color: "from-pink-400 to-purple-500",   image: "https://img.freepik.com/premium-photo/dessert-ice-cream_948265-23145.jpg" },
  rolls:           { name: "Rolls",         color: "from-lime-400 to-green-500",    image: "https://www.heanorfastfood.com/wp-content/uploads/2022/10/60f2ea67b471327a1d82959b_chicken-roll_1500-x-1200.jpg" },
  dosa:            { name: "Dosa",          color: "from-yellow-300 to-amber-500",  image: "https://www.kannammacooks.com/wp-content/uploads/tomato-dosai-1-4.jpg" },
  pasta:           { name: "Pasta",         color: "from-orange-300 to-red-400",    image: "https://www.aheadofthyme.com/wp-content/uploads/2023/02/creamy-tomato-pasta.jpg" },
  noodles:         { name: "Noodles",       color: "from-yellow-400 to-orange-400", image: "https://tse4.mm.bing.net/th/id/OIP.bAi4BAmtk6OyVLcGA1fu0wHaHa?pid=Api" },
  shake:           { name: "Shake",         color: "from-blue-400 to-cyan-500",     image: "https://img.freepik.com/premium-photo/strawberry-shake-food-photography_943281-104017.jpg" },
  coffee:          { name: "Coffee",        color: "from-amber-700 to-yellow-600",  image: "https://static.vecteezy.com/system/resources/previews/025/282/026/large_2x/stock-of-mix-a-cup-coffee-latte-more-motive-top-view-foodgraphy-generative-ai-photo.jpg" },
  lassi:           { name: "Lassi",         color: "from-yellow-200 to-amber-400",  image: "https://img.freepik.com/premium-photo/indian-special-traditional-restaurant-food-lassi-rabri-dahivada_926199-1902273.jpg" },
  "ice-cream":     { name: "Ice Cream",     color: "from-sky-300 to-blue-400",      image: "https://images3.alphacoders.com/128/1288017.jpg" },
  salad:           { name: "Salad",         color: "from-green-400 to-emerald-500", image: "https://i.pinimg.com/originals/d9/29/e3/d929e3aa5de97cc2e413006b84f82f8d.jpg" },
  paratha:         { name: "Paratha",       color: "from-orange-300 to-yellow-400", image: "https://static.india.com/wp-content/uploads/2025/02/FEATURE-IMAGE-2025-02-05T171733.721.jpg" },
  vadapav:         { name: "Vadapav",       color: "from-orange-400 to-red-500",    image: "https://static.vecteezy.com/system/resources/previews/035/225/684/large_2x/indian-famous-street-food-vada-pav-is-a-vegetarian-fast-food-dish-from-maharashtra-photo.JPG" },
  cake:            { name: "Cake",          color: "from-pink-300 to-rose-500",     image: "https://tastysoulkitchen.com/wp-content/uploads/2025/10/devil-s-food-cake.png" },
  khichdi:         { name: "Khichdi",       color: "from-yellow-300 to-amber-500",  image: "https://www.funfoodfrolic.com/wp-content/uploads/2021/05/Dalia-Khichdi-Blog-Thumbnail.jpg" },
};

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null); // modal food
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const meta = categoryMeta[categoryName] || {
    name: categoryName?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Food",
    color: "from-orange-400 to-red-500",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  };

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      setVisibleCount(8);
      try {
        const res = await fetch(`http://localhost:5000/api/food/category/${encodeURIComponent(meta.name)}`);
        const data = await res.json();
        setFoods(data.foods || []);
      } catch {
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [categoryName]);

  // Modal open karo
  const openModal = (food) => {
    setSelectedFood(food);
    setQty(1);
    setAddedToCart(false);
    document.body.style.overflow = "hidden";
  };

  // Modal band karo
  const closeModal = () => {
    setSelectedFood(null);
    document.body.style.overflow = "auto";
  };

  // Add to Cart — localStorage ma save karo
  const handleAddToCart = () => {
    addToCart(selectedFood, qty);
    setAddedToCart(true);
    setTimeout(() => {
      closeModal();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${meta.color} py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-white mb-6 hover:opacity-80 transition flex items-center gap-1 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg flex-shrink-0">
              <img src={meta.image} alt={meta.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white">{meta.name}</h1>
              <p className="text-white/80 mt-2 text-lg">
                {loading ? "Loading..." : `${foods.length} item${foods.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Food Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{meta.name} Items</h2>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4 mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Cards */}
        {!loading && foods.length > 0 && (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {foods.slice(0, visibleCount).map((food) => (
              <div
                key={food._id}
                onClick={() => openModal(food)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {food.image ? (
                    <img src={food.image} alt={food.name} className="w-full h-1250px object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-orange-50">🍽️</div>
                  )}
                  {/* Veg/NonVeg */}
                  <div className={`absolute top-3 left-3 w-5 h-5 rounded-sm border-2 bg-white flex items-center justify-center shadow ${food.isVeg ? "border-green-600" : "border-red-600"}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? "bg-green-600" : "bg-red-600"}`}></span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-all bg-white text-orange-500 text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      View Details
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{food.name}</h3>
                  {food.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{food.description}</p>
                  )}
                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                    <span className="text-base font-extrabold text-orange-500">₹{food.price}</span>
                    <span className="text-xs font-bold text-orange-500 border border-orange-400 px-3 py-1.5 rounded-xl">
                      Add +
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {visibleCount < foods.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount(v => v + 8)}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all flex items-center gap-2 text-sm"
              >
                <span>Show More ({foods.length - visibleCount} remaining)</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
          </>
        )}

        {/* Empty State */}
        {!loading && foods.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-5">
              <svg className="w-12 h-12 text-orange-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700">{meta.name} items coming soon!</h3>
            <p className="text-gray-400 mt-2 text-sm">Admin is adding items for this category.</p>
            <button onClick={() => navigate("/")} className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all">
              ← Back to Home
            </button>
          </div>
        )}
      </div>

      {/* ===================== FOOD DETAIL MODAL ===================== */}
      {selectedFood && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeInUp_0.25s_ease]">

              {/* Food Image */}
              <div className="relative h-64 bg-gray-100">
                {selectedFood.image ? (
                  <img
                    src={selectedFood.image}
                    alt={selectedFood.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl bg-orange-50">🍽️</div>
                )}

                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Veg/NonVeg badge */}
                <div className={`absolute top-4 left-4 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow ${selectedFood.isVeg ? "text-green-600" : "text-red-600"}`}>
                  <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${selectedFood.isVeg ? "border-green-600" : "border-red-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedFood.isVeg ? "bg-green-600" : "bg-red-600"}`}></span>
                  </span>
                  <span className="text-xs font-bold">{selectedFood.isVeg ? "Veg" : "Non-Veg"}</span>
                </div>
              </div>

              {/* Food Details */}
              <div className="p-6">
                {/* Name & Price */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{selectedFood.name}</h2>
                  <span className="text-xl font-extrabold text-orange-500 flex-shrink-0">₹{selectedFood.price}</span>
                </div>

                {/* Category tag */}
                <span className="inline-block bg-orange-50 text-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {meta.name}
                </span>

                {/* Description */}
                {selectedFood.description ? (
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{selectedFood.description}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic mb-5">No description available.</p>
                )}

                {/* Quantity + Total */}
                <div className="flex items-center justify-between mb-5 bg-gray-50 rounded-2xl px-4 py-3">
                  <span className="text-sm font-semibold text-gray-600">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full border-2 border-orange-200 text-orange-500 font-bold flex items-center justify-center hover:bg-orange-50 transition-all text-lg"
                    >−</button>
                    <span className="text-base font-extrabold text-gray-900 w-6 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center hover:bg-orange-600 transition-all text-lg"
                    >+</button>
                  </div>
                  <span className="text-sm font-extrabold text-orange-500">₹{selectedFood.price * qty}</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-lg shadow-orange-100"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      Add to Cart — ₹{selectedFood.price * qty}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}