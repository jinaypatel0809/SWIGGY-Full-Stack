import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCart } from "../utils/cart";

// ================= API BASE =================

const API_BASE = "https://swiggy-full-stack.onrender.com";

// ================= CATEGORY META =================

const categoryMeta = {
  "north-indian": {
    name: "North Indian",
    color: "from-orange-400 to-red-500",
    image:
      "https://eastindianrecipes.net/wp-content/uploads/2022/09/How-to-Make-North-Indian-Thali-Vegetarian-7.jpg",
  },

  "south-indian": {
    name: "South Indian",
    color: "from-green-400 to-teal-500",
    image:
      "https://blog.bigbasket.com/wp-content/uploads/2023/04/South-Indian-main_584509564.jpeg",
  },

  chinese: {
    name: "Chinese",
    color: "from-red-400 to-rose-600",
    image:
      "https://images.unsplash.com/photo-1635685296916-95acaf58471f?w=600",
  },

  pizza: {
    name: "Pizza",
    color: "from-red-400 to-pink-500",
    image:
      "https://i.pinimg.com/736x/ab/e6/57/abe65721a6d06545c99230151aab0177.jpg",
  },

  burger: {
    name: "Burger",
    color: "from-yellow-400 to-orange-500",
    image:
      "https://img.freepik.com/premium-photo/burger-food-photography_398492-6506.jpg",
  },

  biryani: {
    name: "Biryani",
    color: "from-amber-400 to-yellow-600",
    image:
      "https://img.freepik.com/premium-photo/hyderabadi-chicken-biryani-food-photos_410516-42775.jpg",
  },

  desserts: {
    name: "Desserts",
    color: "from-pink-400 to-purple-500",
    image:
      "https://img.freepik.com/premium-photo/dessert-ice-cream_948265-23145.jpg",
  },

  rolls: {
    name: "Rolls",
    color: "from-lime-400 to-green-500",
    image:
      "https://www.heanorfastfood.com/wp-content/uploads/2022/10/60f2ea67b471327a1d82959b_chicken-roll_1500-x-1200.jpg",
  },

  dosa: {
    name: "Dosa",
    color: "from-yellow-300 to-amber-500",
    image:
      "https://www.kannammacooks.com/wp-content/uploads/tomato-dosai-1-4.jpg",
  },

  pasta: {
    name: "Pasta",
    color: "from-orange-300 to-red-400",
    image:
      "https://www.aheadofthyme.com/wp-content/uploads/2023/02/creamy-tomato-pasta.jpg",
  },

  noodles: {
    name: "Noodles",
    color: "from-yellow-400 to-orange-400",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.bAi4BAmtk6OyVLcGA1fu0wHaHa?pid=Api",
  },

  shake: {
    name: "Shake",
    color: "from-blue-400 to-cyan-500",
    image:
      "https://img.freepik.com/premium-photo/strawberry-shake-food-photography_943281-104017.jpg",
  },

  coffee: {
    name: "Coffee",
    color: "from-amber-700 to-yellow-600",
    image:
      "https://static.vecteezy.com/system/resources/previews/025/282/026/large_2x/stock-of-mix-a-cup-coffee-latte-more-motive-top-view-foodgraphy-generative-ai-photo.jpg",
  },

  lassi: {
    name: "Lassi",
    color: "from-yellow-200 to-amber-400",
    image:
      "https://img.freepik.com/premium-photo/indian-special-traditional-restaurant-food-lassi-rabri-dahivada_926199-1902273.jpg",
  },

  "ice-cream": {
    name: "Ice Cream",
    color: "from-sky-300 to-blue-400",
    image:
      "https://images3.alphacoders.com/128/1288017.jpg",
  },

  salad: {
    name: "Salad",
    color: "from-green-400 to-emerald-500",
    image:
      "https://i.pinimg.com/originals/d9/29/e3/d929e3aa5de97cc2e413006b84f82f8d.jpg",
  },

  paratha: {
    name: "Paratha",
    color: "from-orange-300 to-yellow-400",
    image:
      "https://static.india.com/wp-content/uploads/2025/02/FEATURE-IMAGE-2025-02-05T171733.721.jpg",
  },

  vadapav: {
    name: "Vadapav",
    color: "from-orange-400 to-red-500",
    image:
      "https://static.vecteezy.com/system/resources/previews/035/225/684/large_2x/indian-famous-street-food-vada-pav-is-a-vegetarian-fast-food-dish-from-maharashtra-photo.JPG",
  },

  cake: {
    name: "Cake",
    color: "from-pink-300 to-rose-500",
    image:
      "https://tastysoulkitchen.com/wp-content/uploads/2025/10/devil-s-food-cake.png",
  },

  khichdi: {
    name: "Khichdi",
    color: "from-yellow-300 to-amber-500",
    image:
      "https://www.funfoodfrolic.com/wp-content/uploads/2021/05/Dalia-Khichdi-Blog-Thumbnail.jpg",
  },
};

export default function CategoryPage() {

  const { categoryName } = useParams();

  const navigate = useNavigate();

  // ================= STATES =================

  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedFood, setSelectedFood] = useState(null);

  const [qty, setQty] = useState(1);

  const [addedToCart, setAddedToCart] = useState(false);

  const [visibleCount, setVisibleCount] = useState(8);

  // ================= CATEGORY DATA =================

  const meta = categoryMeta[categoryName] || {
    name:
      categoryName
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "Food",

    color: "from-orange-400 to-red-500",

    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  };

  // ================= FETCH FOODS =================

  useEffect(() => {

    const fetchFoods = async () => {

      setLoading(true);

      setVisibleCount(8);

      try {

        console.log("Fetching category:", meta.name);

        const res = await fetch(
          `${API_BASE}/api/food/category/${encodeURIComponent(
            meta.name
          )}`
        );

        const data = await res.json();

        console.log("Foods Response:", data);

        if (res.ok) {

          setFoods(data.foods || []);

        } else {

          setFoods([]);
        }

      } catch (error) {

        console.log("Fetch Error:", error);

        setFoods([]);

      } finally {

        setLoading(false);
      }
    };

    fetchFoods();

  }, [categoryName]);

  // ================= OPEN MODAL =================

  const openModal = (food) => {

    setSelectedFood(food);

    setQty(1);

    setAddedToCart(false);

    document.body.style.overflow = "hidden";
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {

    setSelectedFood(null);

    document.body.style.overflow = "auto";
  };

  // ================= ADD TO CART =================

  const handleAddToCart = () => {

    addToCart(selectedFood, qty);

    setAddedToCart(true);

    setTimeout(() => {

      closeModal();

    }, 1200);
  };

  // ================= RETURN =================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}

      <div className={`bg-gradient-to-r ${meta.color} py-12 px-4`}>

        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => navigate(-1)}
            className="text-white mb-6 hover:opacity-80 transition flex items-center gap-1 text-sm font-semibold"
          >
            ← Back
          </button>

          <div className="flex items-center gap-6">

            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg flex-shrink-0">

              <img
                src={meta.image}
                alt={meta.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>

              <h1 className="text-4xl font-extrabold text-white">
                {meta.name}
              </h1>

              <p className="text-white/80 mt-2 text-lg">
                {loading
                  ? "Loading..."
                  : `${foods.length} items available`}
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* FOOD GRID */}

      <div className="max-w-7xl mx-auto px-4 py-10">

        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {meta.name} Items
        </h2>

        {/* LOADING */}

        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading foods...
          </div>
        )}

        {/* FOODS */}

        {!loading && foods.length > 0 && (

          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

              {foods.slice(0, visibleCount).map((food) => (

                <div
                  key={food._id}
                  onClick={() => openModal(food)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >

                  {/* IMAGE */}

                  <div className="relative h-44 overflow-hidden bg-gray-100">

                    {food.image ? (

                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center text-5xl bg-orange-50">
                        🍽️
                      </div>
                    )}

                    {/* VEG */}

                    <div
                      className={`absolute top-3 left-3 w-5 h-5 rounded-sm border-2 bg-white flex items-center justify-center ${
                        food.isVeg
                          ? "border-green-600"
                          : "border-red-600"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          food.isVeg
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      ></span>
                    </div>
                  </div>

                  {/* INFO */}

                  <div className="p-4">

                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {food.name}
                    </h3>

                    {food.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {food.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-base font-extrabold text-orange-500">
                        ₹{food.price}
                      </span>

                      <span className="text-xs font-bold text-orange-500 border border-orange-400 px-3 py-1 rounded-xl">
                        Add +
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SHOW MORE */}

            {visibleCount < foods.length && (

              <div className="flex justify-center mt-10">

                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + 8)
                  }
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}

        {/* EMPTY */}

        {!loading && foods.length === 0 && (

          <div className="flex flex-col items-center justify-center py-24 text-center">

            <div className="text-6xl mb-4">🍽️</div>

            <h3 className="text-xl font-bold text-gray-700">
              {meta.name} items coming soon!
            </h3>

            <p className="text-gray-400 mt-2 text-sm">
              Admin is adding items for this category.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}

      {selectedFood && (

        <>
          {/* BACKDROP */}

          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={closeModal}
          />

          {/* MODAL */}

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

              {/* IMAGE */}

              <div className="relative h-64 bg-gray-100">

                {selectedFood.image ? (

                  <img
                    src={selectedFood.image}
                    alt={selectedFood.name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-7xl bg-orange-50">
                    🍽️
                  </div>
                )}

                {/* CLOSE */}

                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  ✕
                </button>
              </div>

              {/* DETAILS */}

              <div className="p-6">

                <div className="flex items-start justify-between mb-4">

                  <h2 className="text-xl font-extrabold text-gray-900">
                    {selectedFood.name}
                  </h2>

                  <span className="text-xl font-extrabold text-orange-500">
                    ₹{selectedFood.price}
                  </span>
                </div>

                {selectedFood.description ? (

                  <p className="text-sm text-gray-500 mb-5">
                    {selectedFood.description}
                  </p>

                ) : (

                  <p className="text-sm text-gray-400 italic mb-5">
                    No description available.
                  </p>
                )}

                {/* QTY */}

                <div className="flex items-center justify-between mb-5">

                  <button
                    onClick={() =>
                      setQty((q) => Math.max(1, q - 1))
                    }
                    className="w-8 h-8 rounded-full border"
                  >
                    -
                  </button>

                  <span className="font-bold text-lg">
                    {qty}
                  </span>

                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white"
                  >
                    +
                  </button>
                </div>

                {/* ADD TO CART */}

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-2xl font-bold text-white ${
                    addedToCart
                      ? "bg-green-500"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {addedToCart
                    ? "Added to Cart!"
                    : `Add to Cart — ₹${selectedFood.price * qty}`}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}