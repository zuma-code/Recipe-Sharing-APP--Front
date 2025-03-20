import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";


// Admin Dashboard for managing comments
function ManageCommentsPage() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_SERVER_URL;
  // Helper function to get auth token
  const getAuthToken = () => localStorage.getItem("authToken");

  // Fetch comments from API with useCallback to avoid unnecessary re-renders
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/comment/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: currentPage,
          limit: 10
        }
      });
      
      // console.log("API Response: ", res); // Log the response to check the data
      // setComments(res.data)
      // Ensure res.data exists and is an array
      if (res.data && Array.isArray(res.data)) {
        setComments(res.data);
        setTotalPages(res.data.totalPages);
      } else {
        setComments([]);  // Fallback to an empty array if no comments are returned
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
        setError("Error fetching comments. Please try again.");
      }
      console.error("Error fetching comments", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);
  
  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      fetchComments();
    }
  }, [isLoggedIn, user, currentPage, fetchComments]);


  // Delete comment by ID
  const deleteComment = useCallback(async (id) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/comment/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment._id !== id)); // Optimistically update UI
    } catch (error) {
      console.error("Error deleting comment", error.message);
    }
  }, [comments]);

  // Change page
  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Comments</h2>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        {isLoading ? (
  <div className="flex justify-center py-4">
      <span className="loading loading-spinner loading-lg"></span>
  </div>
      ) : comments && comments.lenght === 0 ? (
        <p className="text-gray-500">No comments found.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li key={comment._id} className="border-b py-2 flex justify-between">
              <span>{comment.recipe} ({comment.text})</span>
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

export default ManageCommentsPage;
