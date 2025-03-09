import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);
  
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };
    
    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold text-center text-primary mb-6">Login</h1>
          
          <form onSubmit={handleLoginSubmit} className="form-control gap-4">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={handleEmail} 
                className="input input-bordered w-full focus:ring focus:ring-primary" 
                required
              />
            </div>
            
            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
                className="input input-bordered w-full focus:ring focus:ring-primary"
                required
              />
            </div>
            
            {/* Login Button */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full hover:scale-105 transition">
                Login
              </button>
            </div>
          </form>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="alert alert-error mt-4 rounded-lg shadow-md">
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}
          
          {/* Divider */}
          <div className="divider my-4">OR</div>
          
          {/* Sign-Up Link */}
          <div className="text-center">
            <p className="mb-2 text-sm">Don't have an account yet?</p>
            <Link to="/signup" className="btn btn-accent btn-sm hover:scale-105 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
