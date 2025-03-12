import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        const response = await fetch(`/recipes/${id}`);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch recipe (Status: ${response.status})`);
        }
  
        // Ensure the response is valid JSON
        const text = await response.text();  // Read response as text first
        if (!text.trim()) {
          throw new Error("Empty response from server.");
        }
  
        // Attempt to parse JSON safely
        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          throw new Error("Invalid JSON format received from server.");
        }
  
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRecipe();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }
      
      // Navigate back to the recipes list or details page on success
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Edit Recipe</h2>
          <Link to="/" className="btn btn-sm">Back to Recipes</Link>
        </div>

        {error && (
          <div className="alert alert-error m-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Recipe Title*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter recipe title"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Cuisine</span>
              </label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                placeholder="E.g., Italian, Mexican, etc."
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Duration (minutes)</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Cooking time"
                className="input input-bordered w-full"
                min="1"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Vegetarian</span>
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="URL to recipe image"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Description*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the recipe"
              className="textarea textarea-bordered h-24"
              required
            ></textarea>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Link to="/" className="btn">Cancel</Link>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                'Update Recipe'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;