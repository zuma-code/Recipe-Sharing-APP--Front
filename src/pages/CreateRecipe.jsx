import React, { useState} from "react";
import { useNavigate } from "react-router-dom";

function CreateRecipe()  {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    cuisine: "",
    dishType: "",    
    level:"",
    duration: "",
    servings: "",
    ingredients: "",
    instructions: "",
  });

  // Define enum options from the schema
  const dishTypeOptions =  ["Vegetarian", "Vegan", "Meat", "Fish", "Seafood", "Dessert", "Other"];
  const levelOptions = ["Easy Peasy", "Amateur Chef", "UltraPro Chef"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5005/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        ingredients: formData.ingredients.split("\n"), // Split by line
        instructions: formData.instructions.split("\n").map((step) => step.trim()), // Trim whitespace
      }),
    })
      .then(() => navigate("/"))
      .catch((error) => console.error("Error creating recipe:", error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Recipe</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6">
        <input type="text" name="title" placeholder="Title" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL" className="input input-bordered w-full mb-3" onChange={handleChange} required/>
        <input type="text" name="cuisine" placeholder="Cuisine" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        
        {/* Dish Type Dropdown (enum) */}
        <select 
          name="dishType" 
          className="select select-bordered w-full mb-3" 
          onChange={handleChange} 
          value={formData.dishType}
          required
        >
          <option value="" disabled>Select Dish Type</option>
          {dishTypeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        {/* Level Dropdown (enum) */}
        <select 
          name="level" 
          className="select select-bordered w-full mb-3" 
          onChange={handleChange} 
          value={formData.level}
          required
        >
          <option value="" disabled>Select Difficulty Level</option>
          {levelOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        <input type="number" name="duration" placeholder="Duration (min)" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        <input type="number" name="servings" placeholder="Servings" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        <textarea name="ingredients" placeholder="List the ingredients in columns." className="textarea textarea-bordered w-full mb-3" onChange={handleChange} required />
        <textarea name="instructions" placeholder="Provide the cooking steps in sequential order (1, 2, 3, etc.)." className="textarea textarea-bordered w-full mb-3" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary w-full">Create Recipe</button>
      </form>
    </div>
  );
};

export default CreateRecipe;