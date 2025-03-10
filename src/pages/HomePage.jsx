import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/recipes");
        if (!response.ok) throw new Error("Failed to fetch recipes");

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error.message);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (recipe.title?.toLowerCase() || "").includes(search.toLowerCase()) &&
      (filter === "" || recipe.dishType === filter)
  );

  return (
    <div className="min-h-screen bg-base-100" data-theme="bumblebee">
      {/* Hero Section */}
      <div
        className="hero min-h-[500px] bg-cover bg-center text-white"
        style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/03/32/75/39/360_F_332753934_tBacXEgxnVplFBRyKbCif49jh0Wz89ns.jpg')" }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center">
          <div>
            <h1 className="text-5xl font-bold drop-shadow-lg">
              Discover & Share Amazing Recipes
            </h1>
            <p className="mt-4 text-lg drop-shadow-sm">
              Find inspiration for your next meal and share your own delicious recipes!
            </p>
            <Link to="/recipes" className="btn btn-secondary
             btn-wide mt-2 shadow-lg">
              Share a Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search recipes..."
            className="input input-bordered w-full md:w-1/2 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered w-full md:w-1/4 shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Meat">Meat</option>
            <option value="Fish">Fish</option>
            <option value="Seafood">Seafood</option>
            <option value="Dessert">Dessert</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">No recipes found</p>
          ) : (
            filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="card bg-base-100 shadow-lg hover:scale-105 transition-transform duration-300">
                <figure>
                  <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg font-bold">{recipe.title}</h2>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className="badge badge-primary">{recipe.cuisine}</span>
                    <span className="badge badge-secondary">{recipe.dishType}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ⏳ {recipe.duration} min • 🍽 {recipe.servings} servings
                  </p>
                  <div className="card-actions mt-4">
                    <Link to={`/recipe/${recipe._id}`} className="btn btn-accent btn-sm shadow-md">
                      View Recipe
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
