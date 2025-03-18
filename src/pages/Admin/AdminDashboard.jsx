// AdminDashboard.js
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

function AdminDashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {isLoggedIn && user?.role === "admin" ? (
        <div>
          <div className="flex gap-4">
            <Link to="/admin/users" className="btn btn-info">Manage Users</Link>
            <Link to="/admin/recipes" className="btn btn-info">Manage Recipes</Link>
            {/* <Link to="/admin/comments" className="btn btn-info">Manage Comments</Link> */}
          </div>
        </div>
      ) : (
        <p>You do not have the necessary permissions to view this page.</p>
      )}
    </div>
  );
}

export default AdminDashboard;
