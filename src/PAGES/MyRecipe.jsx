import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Pagination } from 'react-bootstrap';
import { getAllRecipeAPI, generatePdfAPI, deleteRecipeAPI } from '../Services/allAPIs';
import { FaEdit, FaTrash, FaFileDownload, FaWhatsapp } from 'react-icons/fa';
import { WhatsappShareButton } from 'react-share';
import Swal from 'sweetalert2';
import EditRecipe from '../COMPONENTS/Edit';

function MyRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const data = await getAllRecipeAPI(token);

        const validRecipes = data.filter(
          (recipe) =>
            recipe.name &&
            recipe.ingredients &&
            recipe.instructions &&
            recipe.recipeImg
        );
        setRecipes(validRecipes);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        Swal.fire('Error', 'Failed to fetch recipes. Please try again.', 'error');
      }
    };

    fetchRecipes();
  }, []);

  // Handle PDF Download
  const handleDownload = async (recipe) => {
    try {
      const blob = await generatePdfAPI(recipe);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${recipe.name.replace(/\s+/g, '_')}.pdf`;
      link.click();

      Swal.fire('Success', 'PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('Error during PDF download:', err);
      Swal.fire('Error', 'Failed to download PDF. Please try again.', 'error');
    }
  };

  // Handle Recipe Delete
  const handleDelete = async (recipeId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this recipe?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const token = sessionStorage.getItem('token');
        await deleteRecipeAPI(recipeId, token);

        const updatedRecipes = recipes.filter((recipe) => recipe._id !== recipeId);
        setRecipes(updatedRecipes);

        Swal.fire('Deleted!', 'Your recipe has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        Swal.fire('Error', 'Failed to delete recipe. Please try again.', 'error');
      }
    }
  };

  // Handle View Recipe
  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  // Handle Edit Icon Click
  const handleEditClick = (recipe) => {
    setRecipeToEdit(recipe);
    setShowEditModal(true);
  };

  // Handle Update
  const handleUpdate = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
    setShowEditModal(false);
    Swal.fire('Updated!', 'Your recipe has been updated.', 'success');
  };

  // Pagination Logic
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">My Recipes</h2>
      <div className="row">
        {currentRecipes.length > 0 ? (
          currentRecipes.map((recipe) => (
            <div className="col-md-4 mb-4" key={recipe._id}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  
                  <Button variant="primary" onClick={() => handleViewRecipe(recipe)}>
                    Get Recipe
                  </Button>
                  <div className="d-flex justify-content-around mt-3">
                    <FaEdit
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClick(recipe)}
                    />
                    <FaTrash
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(recipe._id)}
                    />
                    <WhatsappShareButton
                      url={`http://localhost:4001/api/share-recipe/${recipe._id}`}
                    >
                      <FaWhatsapp style={{ cursor: 'pointer' }} />
                    </WhatsappShareButton>
                    <FaFileDownload
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDownload(recipe)}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center">No recipes available</p>
        )}
      </div>

      {recipes.length > 0 && (
        <Pagination className="justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Ingredients:</h5>
          <ul>
            {(Array.isArray(selectedRecipe?.ingredients)
              ? selectedRecipe.ingredients
              : selectedRecipe?.ingredients?.split(',') || []
            ).map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h5>Instructions:</h5>
          <p>{selectedRecipe?.instructions}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <EditRecipe
        show={showEditModal}
        recipe={recipeToEdit}
        onHide={() => setShowEditModal(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default MyRecipe;
