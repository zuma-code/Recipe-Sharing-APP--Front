
import { Routes, Route, Navigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./context/auth.context";

import { AuthProviderWrapper } from "./context/auth.context";
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
import EditRecipe from "./pages/EditRecipePage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProviderWrapper>
      <div className="App" data-theme="bumblebee">
        <div className="min-h-screen flex flex-col bg-base-200">
          <Navbar />
          <div className="container mx-auto p-4 flex-grow">
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </div>
    </AuthProviderWrapper>
  );
}

function AppRoutes() {
 const { user, isLoggedIn } = useContext(AuthContext);

  return (
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

      <Route path="/recipe/:id" element={<RecipeDetails />} />
      <Route path="/recipes/create" element={<CreateRecipe />} />
      <Route path="/recipe/:id/edit" element={<EditRecipe />} />

      {/* Admin Protected Route */}
      <Route
        path="/admin"
        element={isLoggedIn && user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
