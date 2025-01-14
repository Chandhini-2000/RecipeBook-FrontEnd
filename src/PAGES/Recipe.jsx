import React, { useState } from 'react';
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import CommentSection from '../COMPONENTS/CommentSection';
function Recipe() {
  const [token, setToken] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const API_KEY = '7ddd915f06da4977bc43c51b058980fd';
  const API_URL = `https://api.spoonacular.com/recipes/complexSearch`;
  const RECIPE_DETAILS_URL = `https://api.spoonacular.com/recipes`; // Base URL for recipe details
  const [recipeDetails, setRecipeDetails] = useState("");
  const [userID, setUserId] = useState('');
  const fetchRecipes = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const response = await axios.get(API_URL, {
        params: {
          query: searchTerm,
          number: 10,
          apiKey: API_KEY,
        },
      });

      setRecipes(response.data.results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (id) => {
    setModalLoading(true);
    try {
      const response = await axios.get(`${RECIPE_DETAILS_URL}/${id}/information`, {
        params: { apiKey: API_KEY },
      });
      setSelectedRecipe(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setError('Failed to fetch recipe details. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center mt-5">All Recipes</h1>

      <div className="container d-flex justify-content-center">
        <div className="w-50 mb-5 d-flex">
          <input
            type="text"
            placeholder="Search By Category"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CiSearch
            className="fs-2 fw-bolder mt-1"
            style={{ marginLeft: '-50px', cursor: 'pointer' }}
            onClick={fetchRecipes}
          />
        </div>
      </div>

      {loading && <div className="text-center">Loading recipes...</div>}
      {error && <div className="text-center text-danger">{error}</div>}

      <div className="container">
        <div className="row">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchRecipeDetails(recipe.id)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     {/* Modal for displaying recipe details */}
{modalVisible && selectedRecipe && (
  <div
    className="modal show"
    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{selectedRecipe.title}</h5>
          <button
            className="btn-close"
            onClick={() => setModalVisible(false)}
          ></button>
        </div>
        <div className="modal-body">
          {modalLoading ? (
            <div className="text-center">Loading recipe details...</div>
          ) : (
            <>
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="img-fluid mb-3"
              />
              <h6>Ingredients:</h6>
              <ul>
                {selectedRecipe.extendedIngredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>
              <h6>Instructions:</h6>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedRecipe.instructions,
                }}
              ></div>
              
            </>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setModalVisible(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Recipe;
