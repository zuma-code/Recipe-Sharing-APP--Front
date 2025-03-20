import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

function CreateRecipe() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the logged-in user
  
  const API_URL = process.env.REACT_APP_SERVER_URL;

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    cuisine: "",
    dishType: "",
    level: "",
    duration: "",
    servings: "",
    ingredients: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);

  const dishTypeOptions = ["Vegetarian", "Vegan", "Meat", "Fish", "Seafood", "Dessert", "Other"];
  const levelOptions = ["Easy Peasy", "Amateur Chef", "UltraPro Chef"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to validate if an image URL is valid
  const validateImageUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      alert("You must be logged in to create a recipe.");
      return;
    }

    // Validate form fields
    if (!formData.title || !formData.cuisine || !formData.dishType || !formData.level) {
      alert("Please fill out all required fields.");
      return;
    }

    if (formData.duration <= 0 || formData.servings <= 0) {
      alert("Duration and servings must be positive numbers.");
      return;
    }

    // Validate image URL if provided
    if (formData.image && !validateImageUrl(formData.image)) {
      alert("Please provide a valid image URL.");
      return;
    }

    // Validate ingredients and instructions are not empty
    if (!formData.ingredients.trim()) {
      alert("Please add ingredients.");
      return;
    }

    if (!formData.instructions.trim()) {
      alert("Please add instructions.");
      return;
    }

    const token = localStorage.getItem("authToken"); // Get token for authentication

    const requestBody = {
      ...formData,
      ingredients: formData.ingredients.split("\n").map((ingredient) => ingredient.trim()).filter(Boolean),
      instructions: formData.instructions.split("\n").map((step) => step.trim()).filter(Boolean),
      author: { _id: user._id, name: user.name, email: user.email }, // Add author details
    };

    console.log("Sending data:", requestBody);

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/recipe/recipes`, { 
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error Response:", errorText); // Log the error response
        throw new Error(`Server responded with an error: ${errorText}`);
      }


      const contentType = response.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); // Handle non-JSON responses if needed
      }
      
      console.log("Success:", data);
      navigate(`/recipes/${data._id}`);

   
    } catch (error) {
      console.error("Error creating recipe:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Set loading state to false when the request is done
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Recipe</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />
        
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
        
        <input
          type="number"
          name="duration"
          placeholder="Duration (min)"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="servings"
          placeholder="Servings"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />
        <textarea
          name="ingredients"
          placeholder="List the ingredients in columns."
          className="textarea textarea-bordered w-full mb-3"
          onChange={handleChange}
          required
        />
        <textarea
          name="instructions"
          placeholder="Provide the cooking steps in sequential order (1, 2, 3, etc.)."
          className="textarea textarea-bordered w-full mb-3"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}

export default CreateRecipe;
