import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function AdminDashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (isLoggedIn && user.role === "admin") {
      fetchUsers();
      fetchRecipes();
    }
  }, [isLoggedIn, user]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5005/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5005/recipes");
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/admin/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/admin/recipes/${id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== id));
    } catch (error) {
      console.error("Error deleting recipe", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="border-b py-2 flex justify-between">
              {user.username} ({user.email})
              <button onClick={() => deleteUser(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recipes</h3>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe._id} className="border-b py-2 flex justify-between">
              {recipe.name}
              <button onClick={() => deleteRecipe(recipe._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
