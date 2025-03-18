import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";

// Admin Dashboard for managing  recipes
function ManageRecipesPage() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get auth token
  const getAuthToken = () => localStorage.getItem("authToken");

  // Fetch recipess from API with useCallback to avoid unnecessary re-renders
  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/recipe/recipes", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: currentPage,
          limit: 10
        }
      });
      
      console.log("API Response: ", res); // Log the response to check the data
      // setUsers(res.data)
      // Ensure res.data exists and is an array
      if (res.data && Array.isArray(res.data)) {
        setRecipes(res.data);
        setTotalPages(res.data.totalPages);
      } else {
        setRecipes([]);  // Fallback to an empty array if no recipes are returned
      }
      setError(null);
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        setError(`Error: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        // Request was made but no response
        setError("Network error. Please check your connection.");
      } else {
        // Something went wrong in setting up the request
        setError("Error fetching recipes. Please try again.");
      }
      console.error("Error fetching recipes", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);
  
  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      fetchRecipes();
    }
  }, [isLoggedIn, user, currentPage, fetchRecipes]);


  // Delete recipe by ID
  const deleteRecipe = useCallback(async (id) => {
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:5005/recipe/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipes(recipes.filter((recipe) => recipe._id !== id)); // Optimistically update UI
    } catch (error) {
      console.error("Error deleting recipe", error.message);
    }
  }, [recipes]);

  // Change page
  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Recipes</h2>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Recipes</h3>
        {isLoading ? (
  <div className="flex justify-center py-4">
      <span className="loading loading-spinner loading-lg"></span>
  </div>
      ) : recipes && recipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <ul className="space-y-2">
          {recipes.map((recipe) => (
            <li key={recipe._id} className="border-b py-2 flex justify-between">
              <span>{recipe.title} ({recipe.author})</span>
              <button
                onClick={() => deleteRecipe(recipe._id)}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-primary"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0 || isLoading}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ManageRecipesPage;
