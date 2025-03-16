import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

// Admin Dashboard for managing users, recipes, and comments
function AdminDashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 // const [recipes, setRecipes] = useState([]);
  //const [comments, setComments] = useState([]);



  // Fetch users from API with useCallback to avoid unnecessary re-renders
  const fetchUsers = useCallback (async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/user/users", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        
        params: {
          page: currentPage,
          limit: 10
        }
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (error) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users", error);
    } finally{
      setIsLoading(false);
    }
  },[currentPage]);

    // Fetch data when admin logs in
    useEffect(() => {
      if (isLoggedIn && user?.role === "admin") {
        fetchUsers();
       // fetchRecipes();
       // fetchComments();
      }
    }, [isLoggedIn, user, currentPage, fetchUsers]);

  // Fetch recipes from API
  /*const fetchRecipes = async (token) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/recipes/recipes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };*/

  // Fetch comments from API
  /*const fetchComments = async (token) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/comments/comments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };*/

  // Delete user by ID
  const deleteUser = useCallback  (async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5005/user/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refetch users after deletion to keep UI updated
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error.message);
    }
  },[fetchUsers]);

  // Change page
  const changePage = (page) => {
    setCurrentPage(page);
  };



  // Delete recipe by ID
 /* const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/recipes/recipes/${id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== id));
    } catch (error) {
      console.error("Error deleting recipe", error);
    }
  };*/

  // Delete comment by ID
  /*const deleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/comments/comments/${id}`);
      setComments(comments.filter(comment => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };*/

   return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {/* Error display */}
      {error && (
      <div className="alert alert-error mb-4">
        <span>{error}</span>
      </div>
      )}
      {/* Users Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Users</h3>


      {isLoading ? (
    <div className="flex justify-center py-4">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ) : users.length === 0 ? (
    <p className="text-gray-500">No users found.</p>
  ) : (
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user._id} className="border-b py-2 flex justify-between">
          <span>{user.name} ({user.email})</span>
          <button
            onClick={() => deleteUser(user._id)}
            className="btn btn-error btn-sm"
          >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Controls */}
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
          disabled={currentPage === totalPages}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}


export default AdminDashboard;
