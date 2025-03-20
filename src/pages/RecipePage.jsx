import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_SERVER_URL; // Use environment variable for API URL



function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    fetch(`${API_URL}/recipe/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  return (
   

    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Recipe Sharing App</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="card bg-base-100 shadow-xl">
            <figure>
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{recipe.title}</h2>
              <p>{recipe.cuisine}</p>
              <div className="card-actions justify-end">
                <a href={`/recipe/${recipe._id}`} className="btn btn-primary">View Recipe</a>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default RecipePage;




