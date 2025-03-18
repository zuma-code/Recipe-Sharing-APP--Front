import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_SERVER_URL || "";
  console.log("API_URL:", API_URL);

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
  }, [user._id]);

  return (
    <div>
      <h1>Your Recipes</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe._id}>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <p>{recipe.createdAt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeListPage;
