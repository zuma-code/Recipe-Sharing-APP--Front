import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";

import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import RecipeDetails from "./pages/RecipeDetails";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/profile"
          element={
            <IsPrivate>
              <ProfilePage />
            </IsPrivate>
          }
        />

        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
                
        />
         <Route path="/" element={<HomePage />} />
         <Route path="/recipe/:id" element={<RecipeDetails />} />
         {/* <Route path="/create" element={<CreateRecipe />} />
          <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
    </div>
  );
}

export default App;

