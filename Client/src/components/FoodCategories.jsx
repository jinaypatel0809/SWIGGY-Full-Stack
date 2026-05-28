import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCart } from "../utils/cart";

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
};

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const [visibleCount, setVisibleCount] = useState(8);

  const meta = categoryMeta[categoryName] || {
    name:
      categoryName
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "Food",

    color: "from-orange-400 to-red-500",

    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  };

  // ================= FETCH API =================

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      setVisibleCount(8);

      try {
        const res = await fetch(
          `https://swiggy-full-stack.onrender.com/api/food/category/${encodeURIComponent(
            categoryName
          )}`
        );

        const data = await res.json();

        console.log(data);

        setFoods(data.foods || []);
      } catch (error) {
        console.log("Fetch Error:", error);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [categoryName]);

  // ================= MODAL =================

  const openModal = (food) => {
    setSelectedFood(food);
    setQty(1);
    setAddedToCart(false);

    document.body.style.overflow = "hidden";
  };

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}

      <div className={`bg-gradient-to-r ${meta.color} py-12 px-4`}>
        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => navigate(-1)}
            className="text-white mb-6 hover:opacity-80 transition flex items-center gap-1 text-sm font-semibold"
          >
            ← Back
          </button>

          <div className="flex items-center gap-6">

            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg">
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
                  : `${foods.length} item${
                      foods.length !== 1 ? "s" : ""
                    } available`}
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
          <div className="text-center py-20 text-gray-500">
            Loading Foods...
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
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >

                  {/* IMAGE */}

                  <div className="relative h-52 overflow-hidden bg-gray-100">

                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        🍽️
                      </div>
                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="p-4">

                    <h3 className="text-lg font-bold text-gray-900">
                      {food.name}
                    </h3>

                    {food.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {food.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-orange-500 font-bold text-lg">
                        ₹{food.price}
                      </span>

                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600">
                        Add +
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* SHOW MORE */}

            {visibleCount < foods.length && (
              <div className="flex justify-center mt-10">

                <button
                  onClick={() => setVisibleCount((v) => v + 8)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600"
                >
                  Show More
                </button>

              </div>
            )}
          </>
        )}

        {/* EMPTY */}

        {!loading && foods.length === 0 && (
          <div className="text-center py-20">

            <h3 className="text-2xl font-bold text-gray-700">
              No Items Found
            </h3>

            <p className="text-gray-400 mt-2">
              Admin is adding items soon.
            </p>

          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}

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

                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
                >
                  ✕
                </button>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <div className="flex items-center justify-between">

                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedFood.name}
                  </h2>

                  <span className="text-orange-500 text-2xl font-bold">
                    ₹{selectedFood.price}
                  </span>

                </div>

                <p className="text-gray-500 mt-3">
                  {selectedFood.description}
                </p>

                {/* QUANTITY */}

                <div className="flex items-center justify-between mt-6 bg-gray-100 rounded-2xl p-4">

                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full bg-white shadow"
                  >
                    -
                  </button>

                  <span className="text-xl font-bold">{qty}</span>

                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 rounded-full bg-orange-500 text-white"
                  >
                    +
                  </button>

                </div>

                {/* BUTTON */}

                <button
                  onClick={handleAddToCart}
                  className={`w-full mt-6 py-4 rounded-2xl font-bold transition-all ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {addedToCart
                    ? "Added To Cart!"
                    : `Add To Cart — ₹${selectedFood.price * qty}`}
                </button>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}