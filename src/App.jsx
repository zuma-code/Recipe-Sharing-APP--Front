import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import RecipeDetails from "./pages/RecipeDetails";
import CreateRecipe from "./pages/CreateRecipe";
import NotFound from "./pages/NotFoundPage/NotFoundPage";

function App() {
  return (
    <div className="App" data-theme="bumblebee">
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
         <Route path="/recipes" element={<CreateRecipe />} />
          <Route path="*" element={<NotFound/>} />
         
      </Routes>
    </div>
    <Footer />
    </div>
    </div>
  );
}

export default App;

