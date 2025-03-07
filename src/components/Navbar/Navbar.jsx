import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav>
      <div className="navbar bg-primary text-white shadow-lg px-6">
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold hover:text-gray-200">
            🍽️ Recipe Sharing
          </Link>
        </div>
     {/* <Link to="/" className="hover:text-gray-200">Home</Link>*/}


      <div className="flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="hover:text-gray-200">Home</Link>
          </li>
          <li>
            <Link to="/create" className="hover:text-gray-200">Add Recipe</Link>
          </li>
        </ul>
      </div>




      {isLoggedIn && (
        <>
          <button onClick={logOutUser}>Logout</button>

          <Link to="/profile">
            <button>Profile</button>
            {/* <img src="https://picsum.photos/id/402/200/300" style={{ width: 50, height: 50, borderRadius: 25}} alt="profile" /> */}
          </Link>

          <span>{user && user.name}</span>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/signup"className="hover:text-gray-200">
            {" "}
            <button>Sign Up</button>{" "}
          </Link>
          <Link to="/login"className="hover:text-gray-200">
            {" "}
            <button>Login</button>{" "}
          </Link>
          
        </>
        




        
      )}
        </div>
    </nav>
  );
}

export default Navbar;
