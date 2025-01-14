import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Spinner, Modal, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import { createCollectionAPI } from '../Services/allAPIs';
import Swal from 'sweetalert2'; // Import SweetAlert2

function CreateCollectionPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState('');
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const navigate = useNavigate();

  const API_KEY = '7ddd915f06da4977bc43c51b058980fd';
  const API_URL = `https://api.spoonacular.com/recipes/complexSearch`;
  const RECIPE_DETAIL_URL = `https://api.spoonacular.com/recipes/${'{id}'}/information`;

  useEffect(() => {
    const userIdFromStorage = sessionStorage.getItem('userID');
    setUserID(userIdFromStorage || ''); // Ensure userID is set correctly
  }, []);

  const fetchRecipes = async () => {
    if (!searchTerm.trim()) return; // Don't fetch if search term is empty
  
    setLoading(true);
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
      console.error('Error fetching recipes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch recipes. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecipes();
  };

  const handleSelectRecipe = (recipe) => {
    if (!selectedRecipes.some((r) => r.id === recipe.id)) {
      setSelectedRecipes([...selectedRecipes, { id: recipe.id, title: recipe.title, image: recipe.image }]);
    }
  };

  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await axios.get(RECIPE_DETAIL_URL.replace('{id}', recipeId), {
        params: { apiKey: API_KEY },
      });
      setRecipeDetails(response.data);
      setShowRecipeModal(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch recipe details.',
      });
    }
  };

  const handleCreateCollection = async () => {
    if (selectedRecipes.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Recipes Selected',
        text: 'Please select at least one recipe.',
      });
      return;
    }

    // Use the title of the first selected recipe as the collection name
    const collectionName = selectedRecipes[0].title;

    try {
      const collectionData = {
        name: collectionName, // Using recipe title as collection name
        userID: sessionStorage.getItem('userID'),
        recipes: selectedRecipes.map((r) => r.id), // Ensure recipes array contains valid recipe IDs
      };

      const result = await createCollectionAPI(collectionData);

      Swal.fire({
        icon: 'success',
        title: 'Collection Created!',
        text: 'Your collection has been created successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating collection:', error);
      const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 mb-4 shadow-sm">
        <h2 className="text-center mb-4 text-uppercase">Search and Create Collection</h2>
        <Form.Group controlId="formRecipeSearch" className="mb-3">
          <div className="d-flex" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Form.Control
              type="text"
              placeholder="Search for recipes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch} className="ms-2">
              <CiSearch />
            </Button>
          </div>
        </Form.Group>
      </Card>

      {loading && <Spinner animation="border" className="d-block mx-auto my-3" />}

      {recipes.length > 0 && (
        <Row className="mb-4">
          {recipes.map((recipe) => (
            <Col md={6} lg={4} key={recipe.id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-primary" onClick={() => handleSelectRecipe(recipe)}>
                      Add to Collection
                    </Button>
                    <Button variant="outline-secondary" onClick={() => fetchRecipeDetails(recipe.id)}>
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedRecipes.length > 0 && (
        <Card className="p-3 mb-4 shadow-sm">
          <h4 className="text-center text-uppercase">Selected Recipes</h4>
          <Row>
            {selectedRecipes.map((recipe) => (
              <Col md={6} lg={4} key={recipe.id} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      <div className="text-center">
        <Button size="lg" onClick={handleCreateCollection}>
          Create Collection
        </Button>
      </div>

      {recipeDetails && (
        <Modal show={showRecipeModal} onHide={() => setShowRecipeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{recipeDetails.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={recipeDetails.image} alt={recipeDetails.title} className="img-fluid mb-3" />
            <h5>Instructions:</h5>
            <p>{recipeDetails.instructions}</p>
            <h5>Ingredients:</h5>
            <ul>
              {recipeDetails.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRecipeModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default CreateCollectionPage;
