import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import custom styles for the dashboard

function AdminDashboard() {
  const [recipes, setRecipes] = useState([]); // Store the list of recipes (with user info)

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin");
    if (!isAdmin) {
      window.location.href = "/admin-login"; // Redirect to login if not an admin
    }

    fetchRecipesWithUsers(); // Fetch recipes with user details
  }, []);

  // Fetch recipes along with user data
  const fetchRecipesWithUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/recipes-with-users");
      
      // Filter out recipes that don't have a valid userID
      const validRecipes = response.data.filter(
        (recipe) => recipe.userID && recipe.userID.username && recipe.userID.email
      );
      
      setRecipes(validRecipes); // Store only valid recipes
    } catch (error) {
      console.error("Error fetching recipes with users", error);
      setRecipes([]); // In case of error, set an empty array
    }
  };

  const deleteUser = async (userID, token) => {
    try {
      // Make DELETE request to the backend with Authorization token
      const response = await axios.delete(`http://localhost:4001/api/deleteUser/${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the state by filtering out the deleted user's recipes
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.userID?._id !== userID) // Ensure userID is not null or undefined
      );

      return response.data; // Return the response data after successful deletion
    } catch (error) {
      console.error("Error deleting user", error);
      return null; // Return null or handle the error accordingly
    }
  };

  const deleteUserHandler = (recipe) => {
    const userID = recipe.userID?._id; // Extract userID from the recipe

    if (userID) {
      const token = sessionStorage.getItem("token"); // Get the token from session storage (or wherever it's stored)
      deleteUser(userID, token);
    } else {
      console.error("UserID is missing for recipe ID:", recipe._id); // Log error if userID is missing
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-card p-4">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <h4 className="dashboard-subtitle">Recipes and Users</h4>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Recipe Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th> {/* Add a column for actions */}
              </tr>
            </thead>
            <tbody>
              {recipes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">No valid recipes found</td>
                </tr>
              ) : (
                recipes.map((recipe, index) => (
                  <tr key={recipe._id}>
                    <td>{index + 1}</td>
                    <td>{recipe.name}</td>
                    <td>{recipe.userID?.username}</td>
                    <td>{recipe.userID?.email}</td>
                    <td>
                      {/* Button to delete the user associated with this recipe */}
                      <button className="btn btn-danger" onClick={() => deleteUserHandler(recipe)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
