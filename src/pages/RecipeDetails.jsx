// RecipeDetails.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from "../context/auth.context";
import axios from 'axios';

const API_URL = process.env.REACT_APP_SERVER_URL || "";

function RecipeDetails() {
  const { user } = useContext(AuthContext);
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


   // Make sure we have the base URL for API requests

  // console.log("API_URL:", API_URL);

  

  useEffect(() => {
    axios
    .get(`${API_URL}/recipe/recipes/byRecipe/${recipeId}`)
      .then(response => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching recipe:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [recipeId]); // ✅ Added API_URL & getAuthConfig

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card w-full bg-base-100 shadow-xl">
       
        <div className="card-body">
          <h2 className="card-title">{recipe.title}</h2>
          <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
          <p><strong>Dish Type:</strong> {recipe.dishType}</p>
          <p><strong>Level:</strong> {recipe.level}</p>
          <p><strong>Duration:</strong> {recipe.duration} minutes</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
          <p><strong>Author:</strong> {recipe.author.name}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Instructions:</h3>
            <ol>
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
