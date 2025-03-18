import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link } from "react-router-dom";

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_SERVER_URL || "";
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the recipes for the user
    fetch(`${API_URL}/recipe/recipes/${user._id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data); // Set recipes data from the API
      })
      .catch((err) => {
        setError(err.message); // Set error message if fetch fails
      });
  }, [user._id, API_URL]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Your Recipes</h1>

      {error && (
        <div className="alert alert-error text-center mb-4">
          <p>{error}</p>
        </div>
      )}

      {recipes.length === 0 ? (
        <p className="text-center">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="card bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={recipe.image || "https://via.placeholder.com/150"}
                alt={recipe.title}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <p className="text-gray-500 mb-4">{recipe.cuisine || "Cuisine info not available"}</p>
              
              <div className="flex justify-between w-full">
                <Link
                  to={`/recipes/edit/${recipe._id}`}
                  className="btn btn-primary px-4 py-2 rounded-md text-white font-semibold"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeListPage;
