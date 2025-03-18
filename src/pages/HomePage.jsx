import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [firstLetter, setFirstLetter] = useState("");

  const [loading, setLoading] = useState(true); // Single loading state
  const [error, setError] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  const apiUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5005"; // Use environment variable for API URL

  const initialize = () => {
    setLoading(true); // Asegura que el estado de carga se active antes de la solicitud

    axios
      .get(`${apiUrl}/recipe/recipes`)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error.message);
        setError("Failed to load recipes. Please try again later.");
      })
      .finally(() => {
        setLoading(false); // Asegura que el estado de carga se desactive al finalizar
      });
  };

  useEffect(() => {
    initialize();
  }, []);

  // If we are still determining if the user is logged in or loading the recipes, show a loading spinner
  if (isLoggedIn === null || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Handle errors during recipe fetch
  if (error) {
    return (
      <div className="alert alert-error m-4">
        <span>{error}</span>
      </div>
    );
  }

  // Filter recipes based on search, first letter, and dishType filter

  const filteredRecipes = recipes.filter((recipe) => {
    const titleMatch = recipe.title?.toLowerCase().includes(search.toLowerCase().trim());
    const firstLetterMatch =
      firstLetter === "" || recipe.title?.trim().toLowerCase().startsWith(firstLetter.toLowerCase());
    const dishTypeMatch = filter === "" || recipe.dishType?.toLowerCase() === filter.toLowerCase();

    return titleMatch && firstLetterMatch && dishTypeMatch;
  });


  return (
    <div className="min-h-screen bg-base-100" data-theme="bumblebee">
      {/* Login Alert */}
      {showLoginAlert && !isLoggedIn && (
        <div className="alert alert-warning shadow-lg fixed top-4 right-4 z-50 w-auto max-w-md">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <span className="font-medium">Login Required!</span>
              <p className="text-sm">
                You must be logged in to share a recipe.
              </p>
            </div>
            <Link to="/login" className="btn btn-xs btn-primary ml-2">
              Login
            </Link>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => setShowLoginAlert(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div
        className="hero min-h-[500px] bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://t4.ftcdn.net/jpg/03/32/75/39/360_F_332753934_tBacXEgxnVplFBRyKbCif49jh0Wz89ns.jpg')",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center">
          <div>
            <h1 className="text-5xl font-bold drop-shadow-lg">
              Discover & Share Amazing Recipes
            </h1>
            <p className="mt-4 text-lg drop-shadow-sm">
              Find inspiration for your next meal and share your own delicious
              recipes!
            </p>

            {isLoggedIn ? (
              <Link
                to="/recipes/create"
                className="btn bg-black text-white hover:bg-gray-800 btn-sm mt-2 shadow-lg"
              >
                Share a Recipe
              </Link>
            ) : (
              <button
                onClick={() => setShowLoginAlert(true)}
                className="btn bg-black text-white hover:bg-gray-800 btn-sm mt-2 shadow-lg"
              >
                Share a Recipe
              </button>
            )}
          </div>
        </div>
      </div>

     {/* Search & Filter Section */}
     <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          

          {/* Dish Type Filter */}
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
            <p className="text-center text-gray-500 col-span-3">
              No recipes found
            </p>
          ) : (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="card bg-base-100 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <figure>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg font-bold">
                    {recipe.title}
                  </h2>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className="badge badge-primary">
                      {recipe.cuisine}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ⏳ {recipe.duration} min
                  </p>
                  <div className="card-actions mt-4">
                    {isLoggedIn ? (
                      <Link
                        to={`/recipes/${recipe._id}`}
                        className="btn btn-accent btn-sm shadow-md"
                      >
                        View Recipe
                      </Link>
                    ) : (
                      <div className="w-full">
                        {/* <div className="alert alert-warning shadow-lg mb-2 py-2">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="stroke-current flex-shrink-0 h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span className="text-xs">Login required to view</span>
                          </div>
                        </div> */}
                        <Link
                          to="/login"
                          className="btn btn-accent btn-sm shadow-md w-full"
                        >
                          Login to View
                        </Link>
                      </div>
                    )}
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
