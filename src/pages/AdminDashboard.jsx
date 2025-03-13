import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

// Admin Dashboard for managing users, recipes, and comments
function AdminDashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);

  // Fetch data when admin logs in
  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      fetchUsers();
      fetchRecipes();
      fetchComments();
    }
  }, [isLoggedIn, user]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Fetch recipes from API
  const fetchRecipes = async (token) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/recipes/recipes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  // Fetch comments from API
  const fetchComments = async (token) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/comments/comments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  // Delete user by ID
  const deleteUser = async (id) => {
    try {
   
      await axios.delete(`http://localhost:5005/users/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // Delete recipe by ID
  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/admin/recipes/${id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== id));
    } catch (error) {
      console.error("Error deleting recipe", error);
    }
  };

  // Delete comment by ID
  const deleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/comments/comments/${id}`);
      setComments(comments.filter(comment => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Users Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <ul className="space-y-2">
            {users?.users?.map((user) => (
              <li key={user._id} className="border-b py-2 flex justify-between">
                <span>{user.username} ({user.email})</span>
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

      {/* Recipes Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Recipes</h3>
        {recipes.length === 0 ? (
          <p className="text-gray-500">No recipes found.</p>
        ) : (
          <ul className="space-y-2">
            {recipes?.recipes?.map((recipe) => (
              <li key={recipe._id} className="border-b py-2 flex justify-between">
                <span>{recipe.name}</span>
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

      {/* Comments Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments found.</p>
        ) : (
          <ul className="space-y-2">
            {comments?.comments?.map((comment) => (
              <li key={comment._id} className="border-b py-2 flex justify-between">
                <span>{comment.text}</span>
                <button
                  onClick={() => deleteComment(comment._id)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
