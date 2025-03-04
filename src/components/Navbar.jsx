import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-base-200 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Recipe Share
        </Link>
        <div className="space-x-4">
          <Link to="/" className="btn btn-ghost">Home</Link>
          <Link to="/recipes" className="btn btn-ghost">Recipes</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
