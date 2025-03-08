
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const navigate = useNavigate();
  
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name };
    
    // Send a request using authService
    authService
      .signup(requestBody)
      .then((response) => {
        // If the POST request is successful redirect to the login page
        navigate("/login");
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
          <h1 className="card-title text-2xl font-bold text-center mb-6">Sign Up</h1>
          
          <form onSubmit={handleSignupSubmit} className="form-control gap-4">
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
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input 
                type="text" 
                name="name" 
                value={name} 
                onChange={handleName} 
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>
          </form>
          
          {errorMessage && (
            <div className="alert alert-error mt-4">
              <span>{errorMessage}</span>
            </div>
          )}
          
          <div className="divider my-4">OR</div>
          
          <div className="text-center">
            <p className="mb-2">Already have an account?</p>
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;