
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  console.log("isLoggedIn:", isLoggedIn);
  console.log("user:", user);

  return (
    <nav>
      <div className="navbar shadow-lg px-6" style={{ backgroundColor: "#E1AD01" }}>
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-white hover:opacity-80 transition duration-300">
            🍽️ Recipe Sharing
          </Link>
        </div>

        <div className="flex items-center">
          <ul className="menu menu-horizontal px-1 mr-4">
            <li>
              <Link to="/" className="text-white font-medium hover:opacity-80 transition duration-300">Home</Link>
            </li>
          </ul>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">{user && user.name}</span>

              {user && user.role === 'admin' && (
                <Link to="/adminDashboard" className="btn btn-sm bg-white text-yellow-700 border-none hover:bg-gray-200 transition duration-300">
                  Admin Dashboard
                </Link>
              )}

              <Link to="/profile" className="btn btn-sm bg-white text-yellow-700 border-none hover:bg-gray-200 transition duration-300">
                Profile
              </Link>

              <button
                onClick={logOutUser}
                className="btn btn-sm bg-white text-yellow-700 border-none hover:bg-gray-200 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-white font-medium hover:opacity-80 transition duration-300">
                Login
              </Link>

              <Link to="/signup" className="text-white font-medium hover:opacity-80 transition duration-300">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
