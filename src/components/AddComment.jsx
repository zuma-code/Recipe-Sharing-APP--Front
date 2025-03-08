import { useState } from "react";

const AddComment = ({ recipeId, userId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5005/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId, recipe: recipeId, text }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const newComment = await response.json();
      setText(""); // Clear input after success
      onCommentAdded(newComment); // Call the parent function to update comments
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Write your comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <button
        className="btn btn-primary mt-3 w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Adding..." : "Post Comment"}
      </button>
    </div>
  );
};

export default AddComment;
