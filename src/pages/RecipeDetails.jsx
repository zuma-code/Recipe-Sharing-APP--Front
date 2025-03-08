import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetch(`http://localhost:5005/api/recipes/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setRecipe(data);
          setLoading(false);
        })
        .catch((error) => console.error("Error fetching recipe:", error));
    }, [id]);
    
    const handleDelete = () => {
      fetch(`http://localhost:5005/api/recipes/${id}`, {
        method: "DELETE",
      })
        .then(() => navigate("/"))
        .catch((error) => console.error("Error deleting recipe:", error));
    };
  
    if (loading) return <p className="text-center">Loading...</p>;
    if (!recipe) return <p className="text-center">Recipe not found.</p>;
  
    return (
      <div className="container mx-auto p-4">
        <div className="card bg-base-100 shadow-xl p-6">
          <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-4" />
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <p className="text-lg">Cuisine: {recipe.cuisine}</p>
          <p className="text-lg">Dish Type: {recipe.dishType}</p>
          <p className="text-lg">Level: {recipe.level}</p>
          <p className="text-lg">Duration: {recipe.duration} min</p>
          <p className="text-lg">Servings: {recipe.servings}</p>
          <h2 className="text-xl font-semibold mt-4">Ingredients</h2>
          <ul className="list-disc pl-6">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mt-4">Instructions</h2>
          <ol className="list-decimal pl-6">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <div className="mt-6 flex gap-4">
            <button onClick={() => navigate(`/edit/${id}`)} className="btn btn-warning">Edit</button>
            <button onClick={handleDelete} className="btn btn-error">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  export default RecipeDetails;