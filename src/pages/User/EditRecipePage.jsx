import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/auth.context";

const apiUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5005";

const EditRecipe = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Function to get auth token from localStorage or context
  const getAuthConfig = () => {
    const token = localStorage.getItem('authToken') || (user && user.token);
    if (!token) {
      throw new Error("Authentication token not found");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

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
      .get(`${apiUrl}/recipe/recipes/${id}`)
      .then((response) => {
        setFormData(response.data);
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
  }, [id]);

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
      const config = getAuthConfig();

      // Update the recipe on the server
      const response = await axios.put(
        `${apiUrl}/recipe/recipes/${id}`,
        formData,
        config
      );

      if (!response.data) {
        throw new Error('Failed to update the recipe');
      }

      navigate(`/recipes/${user._id}`); // Redirect after successful save
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
          {/* Form inputs (title, description, etc.) */}
          {/* Similar to your existing code, with validation where necessary */}
          
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
