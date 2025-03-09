import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    favoriteFood: "",
    avatarUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const profileResponse = await axios.get(`/api/users/${user._id}`);
        const recipesResponse = await axios.get(`/api/recipes/user/${user._id}`);
        
        setProfile(profileResponse.data);
        setUserRecipes(recipesResponse.data);
        
        // Initialize form data with current profile info
        setFormData({
          name: profileResponse.data.name,
          bio: profileResponse.data.bio || "",
          favoriteFood: profileResponse.data.favoriteFood || "",
          avatarUrl: profileResponse.data.avatarUrl || ""
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data. Please try again later.");
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put(`/api/users/${user._id}`, formData);
      setProfile(response.data);
      setIsEditing(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0 min-h-screen" data-theme="bumblebee">
      {/* Profile Header */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="card-title text-2xl mb-6">Edit Profile</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Favorite Food</span>
                </label>
                <input
                  type="text"
                  name="favoriteFood"
                  value={formData.favoriteFood}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="What's your favorite dish?"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Avatar URL</span>
                </label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="https://example.com/your-avatar.jpg"
                />
              </div>
              
              <div className="card-actions justify-end mt-6">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div className="avatar">
                  <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img 
                      src={profile?.avatarUrl || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} 
                      alt={profile?.name} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <h2 className="text-3xl font-bold mb-4">{profile?.name}</h2>
                
                {profile?.bio && (
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">About Me</h3>
                    <p className="text-base-content/80">{profile.bio}</p>
                  </div>
                )}
                
                <div className="stats bg-base-200 shadow mb-6">
                  <div className="stat">
                    <div className="stat-title">Recipes</div>
                    <div className="stat-value text-primary">{userRecipes.length}</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-title">Member Since</div>
                    <div className="stat-value text-secondary text-lg">
                      {new Date(profile?.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {profile?.favoriteFood && (
                    <div className="stat">
                      <div className="stat-title">Favorite Food</div>
                      <div className="stat-value text-accent text-lg">{profile.favoriteFood}</div>
                    </div>
                  )}
                </div>
                
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User's Recipes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Recipes</h2>
          <a href="/recipes/new" className="btn btn-primary btn-sm">
            Add New Recipe
          </a>
        </div>
        
        {userRecipes.length === 0 ? (
          <div className="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>You haven't added any recipes yet. Click "Add New Recipe" to get started!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRecipes.map((recipe) => (
              <div className="card bg-base-100 shadow-xl" key={recipe._id}>
                <figure>
                  <img 
                    src={recipe.imageUrl || "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} 
                    alt={recipe.title} 
                    className="h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {recipe.title}
                    {recipe.isVegetarian && <div className="badge badge-secondary">Vegetarian</div>}
                  </h2>
                  <p className="line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="badge badge-outline">{recipe.cuisine}</div>
                    <div className="badge badge-outline">{recipe.cookingTime} mins</div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <a href={`/recipes/${recipe._id}`} className="btn btn-sm">View</a>
                    <a href={`/recipes/${recipe._id}/edit`} className="btn btn-sm btn-primary">Edit</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Activity Feed */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              <li>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <time className="font-mono italic">Just now</time>
                  <div className="text-lg font-black">Profile Updated</div>
                  You've updated your profile information.
                </div>
                <hr className="bg-primary" />
              </li>
              <li>
                <hr className="bg-primary" />
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-end mb-10">
                  <time className="font-mono italic">2 days ago</time>
                  <div className="text-lg font-black">Added New Recipe</div>
                  You shared your famous banana bread recipe.
                </div>
                <hr className="bg-primary" />
              </li>
              <li>
                <hr className="bg-primary" />
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <time className="font-mono italic">1 week ago</time>
                  <div className="text-lg font-black">Account Created</div>
                  Welcome to Recipe Sharing! We're excited to have you.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;