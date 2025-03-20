import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_SERVER_URL;

const EditRecipe = () => {
  const { id } = useParams(); // Get the recipe id from the URL
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    cuisine: '',
    dishType: '',
    level: '',
    duration: '',
    servings: '',
    ingredients: '',
    instructions: '',
  });

  // Fetch the recipe when the component loads
  const fetchRecipe = () => {
    setIsLoading(true);
    setError(null);

    axios
      .get(`${apiUrl}/recipe/recipes/byRecipe/${id}`) // Use the id from URL
      .then((response) => {
        setFormData(response.data); // Set the data from the API response
  //  console.log(config)
      })
      .catch((err) => {
        console.error('Error fetching recipe:', err.message);
        setError('Failed to load recipe. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]); // Dependency array to re-fetch if id changes

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSaving(true);

      // Update the recipe on the server
      const response = await axios.put(
        `${apiUrl}/recipe/recipes/${id}`, // Use the id from URL
        formData,config
      );

      if (!response.data) {
        throw new Error('Failed to update the recipe');
      }
      
      const userId = response.data.author;
      navigate(`/recipe/recipes/${userId}`); // Redirect after successful save (or a custom route)
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update the recipe. Please try again.'
      );
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
          <Link to="/" className="btn btn-sm">
            Back to Recipes
          </Link>
        </div>

        {error && (
          <div className="alert alert-error m-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-lg font-medium">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cuisine" className="block text-lg font-medium">
              Cuisine
            </label>
            <input
              type="text"
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dishType" className="block text-lg font-medium">
             DishType
            </label>
            <input
              type="text"
              id="dishType"
              name="dishType"
              value={formData.dishType}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="level" className="block text-lg font-medium">
            Level
            </label>
            <input
              type="text"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-lg font-medium">
            Duration
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="servings" className="block text-lg font-medium">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="ingredients" className="block text-lg font-medium">
              Ingredients
            </label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={(e) => {
                const value = e.target.value.split(','); // Split ingredients by commas
                setFormData((prevData) => ({
                  ...prevData,
                  ingredients: value,
                }));
              }}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="instructions" className="block text-lg font-medium">
              Instructions
            </label>
            <input
              type="text"
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={(e) => {
      const value = e.target.value.split(','); // Split instructions by commas
      setFormData((prevData) => ({
        ...prevData,
        instructions: value,
      }));
    }}
    className="input input-bordered w-full"
  />
</div>


          <div className="mt-8 flex justify-end gap-4">
            <Link to="/" className="btn">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
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
