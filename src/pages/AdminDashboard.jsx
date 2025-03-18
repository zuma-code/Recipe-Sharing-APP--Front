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

  // Helper function to get auth token
  const getAuthToken = () => localStorage.getItem("authToken");

  // Fetch users from API with useCallback to avoid unnecessary re-renders
  const fetchUsers = useCallback(async () => {
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
      
      console.log("API Response: ", res); // Log the response to check the data
      // setUsers(res.data)
      // Ensure res.data.users exists and is an array
      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalPages(res.data.totalPages);
      } else {
        setUsers([]);  // Fallback to an empty array if no users are returned
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
        setError("Error fetching users. Please try again.");
      }
      console.error("Error fetching users", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);
  
  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      fetchUsers();
    }
  }, [isLoggedIn, user, currentPage, fetchUsers]);


  // Delete user by ID
  const deleteUser = useCallback(async (id) => {
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:5005/user/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== id)); // Optimistically update UI
    } catch (error) {
      console.error("Error deleting user", error.message);
    }
  }, [users]);

  // Change page
  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        {isLoading ? (
  <div className="flex justify-center py-4">
      <span className="loading loading-spinner loading-lg"></span>
  </div>
      ) : users && users.length === 0 ? (
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

export default AdminDashboard;
