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
        // If the POST request is successful store the authentication token,
        // after the token is stored authenticate the user
        // and at last navigate to the home page
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold text-center mb-6">Login</h1>
          
          <form onSubmit={handleLoginSubmit} className="form-control gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={handleEmail} 
                className="input input-bordered w-full" 
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
          
          {errorMessage && (
            <div className="alert alert-error mt-4">
              <span>{errorMessage}</span>
            </div>
          )}
          
          <div className="divider my-4">OR</div>
          
          <div className="text-center">
            <p className="mb-2">Don't have an account yet?</p>
            <Link to="/signup" className="btn btn-outline btn-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;