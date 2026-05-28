import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "North Indian",
    slug: "north-indian",
    emoji: "🍛",
    color: "from-orange-400 to-red-500",
    image: "https://eastindianrecipes.net/wp-content/uploads/2022/09/How-to-Make-North-Indian-Thali-Vegetarian-7.jpg",
  },
  {
    id: 2,
    name: "South Indian",
    slug: "south-indian",
    emoji: "🥘",
    color: "from-green-400 to-teal-500",
    image: "https://blog.bigbasket.com/wp-content/uploads/2023/04/South-Indian-main_584509564.jpeg",
  },
  {
    id: 3,
    name: "Chinese",
    slug: "chinese",
    emoji: "🍜",
    color: "from-red-400 to-rose-600",
    image: "https://images.unsplash.com/photo-1635685296916-95acaf58471f?w=600",
  },
  {
    id: 4,
    name: "Pizza",
    slug: "pizza",
    emoji: "🍕",
    color: "from-red-400 to-pink-500",
    image: "https://i.pinimg.com/736x/ab/e6/57/abe65721a6d06545c99230151aab0177.jpg",
  },
  {
    id: 5,
    name: "Burger",
    slug: "burger",
    emoji: "🍔",
    color: "from-yellow-400 to-orange-500",
    image: "https://img.freepik.com/premium-photo/burger-food-photography_398492-6506.jpg",
  },
  {
    id: 6,
    name: "Biryani",
    slug: "biryani",
    emoji: "🍚",
    color: "from-amber-400 to-yellow-600",
    image: "https://img.freepik.com/premium-photo/hyderabadi-chicken-biryani-food-photos_410516-42775.jpg",
  },
  {
    id: 7,
    name: "Desserts",
    slug: "desserts",
    emoji: "🍰",
    color: "from-pink-400 to-purple-500",
    image: "https://img.freepik.com/premium-photo/dessert-ice-cream_948265-23145.jpg",
  },
  {
    id: 8,
    name: "Rolls",
    slug: "rolls",
    emoji: "🌯",
    color: "from-lime-400 to-green-500",
    image: "https://www.heanorfastfood.com/wp-content/uploads/2022/10/60f2ea67b471327a1d82959b_chicken-roll_1500-x-1200.jpg",
  },
  {
    id: 9,
    name: "Dosa",
    slug: "dosa",
    emoji: "🫓",
    color: "from-yellow-300 to-amber-500",
    image: "https://www.kannammacooks.com/wp-content/uploads/tomato-dosai-1-4.jpg",
  },
  {
    id: 10,
    name: "Pasta",
    slug: "pasta",
    emoji: "🍝",
    color: "from-orange-300 to-red-400",
    image: "https://www.aheadofthyme.com/wp-content/uploads/2023/02/creamy-tomato-pasta.jpg",
  },
  {
    id: 11,
    name: "Noodles",
    slug: "noodles",
    emoji: "🍜",
    color: "from-yellow-400 to-orange-400",
    image: "https://tse4.mm.bing.net/th/id/OIP.bAi4BAmtk6OyVLcGA1fu0wHaHa?pid=Api",
  },
  {
    id: 12,
    name: "Shake",
    slug: "shake",
    emoji: "🥤",
    color: "from-blue-400 to-cyan-500",
    image: "https://img.freepik.com/premium-photo/strawberry-shake-food-photography_943281-104017.jpg",
  },
  {
    id: 13,
    name: "Coffee",
    slug: "coffee",
    emoji: "☕",
    color: "from-amber-700 to-yellow-600",
    image: "https://static.vecteezy.com/system/resources/previews/025/282/026/large_2x/stock-of-mix-a-cup-coffee-latte-more-motive-top-view-foodgraphy-generative-ai-photo.jpg",
  },
  {
    id: 14,
    name: "Lassi",
    slug: "lassi",
    emoji: "🥛",
    color: "from-yellow-200 to-amber-400",
    image: "https://img.freepik.com/premium-photo/indian-special-traditional-restaurant-food-lassi-rabri-dahivada_926199-1902273.jpg",
  },
  {
    id: 15,
    name: "Ice Cream",
    slug: "ice-cream",
    emoji: "🍦",
    color: "from-sky-300 to-blue-400",
    image: "https://images3.alphacoders.com/128/1288017.jpg",
  },
  {
    id: 16,
    name: "Salad",
    slug: "salad",
    emoji: "🥗",
    color: "from-green-400 to-emerald-500",
    image: "https://i.pinimg.com/originals/d9/29/e3/d929e3aa5de97cc2e413006b84f82f8d.jpg",
  },
  {
    id: 17,
    name: "Paratha",
    slug: "paratha",
    emoji: "🫓",
    color: "from-orange-300 to-yellow-400",
    image: "https://static.india.com/wp-content/uploads/2025/02/FEATURE-IMAGE-2025-02-05T171733.721.jpg",
  },
  {
    id: 18,
    name: "Vadapav",
    slug: "vadapav",
    emoji: "🍔",
    color: "from-orange-400 to-red-500",
    image: "https://static.vecteezy.com/system/resources/previews/035/225/684/large_2x/indian-famous-street-food-vada-pav-is-a-vegetarian-fast-food-dish-from-maharashtra-photo.JPG",
  },
  {
    id: 19,
    name: "Cake",
    slug: "cake",
    emoji: "🎂",
    color: "from-pink-300 to-rose-500",
    image: "https://tastysoulkitchen.com/wp-content/uploads/2025/10/devil-s-food-cake.png",
  },
  {
    id: 20,
    name: "Khichdi",
    slug: "khichdi",
    emoji: "🍲",
    color: "from-yellow-300 to-amber-500",
    image: "https://www.funfoodfrolic.com/wp-content/uploads/2021/05/Dalia-Khichdi-Blog-Thumbnail.jpg",
  },
];

export default function FoodCategories() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
        What's on your mind?
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="flex flex-col items-center cursor-pointer group"
          >
            {/* Image Circle */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl bg-orange-50">${cat.emoji}</div>`;
                }}
              />
            </div>
            {/* Name */}
            <p className="mt-2 text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-orange-500 transition-colors">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}