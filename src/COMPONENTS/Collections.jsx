import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Pagination } from 'react-bootstrap';
import { FaTrashAlt, FaWhatsapp } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { WhatsappShareButton } from 'react-share';
import Swal from 'sweetalert2';
import { fetchUserCollection, deleteCollection } from '../Services/allAPIs';

const Collections = () => {
  const [collection, setCollection] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetchUserCollection();

        const collectionWithImages = await Promise.all(
          response.map(async (item) => {
            const searchResponse = await fetch(
              `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
                item.name
              )}&apiKey=7ddd915f06da4977bc43c51b058980fd`
            );
            const searchData = await searchResponse.json();

            if (searchData.results && searchData.results.length > 0) {
              item.image = searchData.results[0].image;
            }

            return item;
          })
        );

        setCollection(collectionWithImages || []);
      } catch (error) {
        console.error('Error fetching collection:', error);
        Swal.fire(
          'Error',
          'Failed to fetch your collections. Please try again later.',
          'error'
        );
        setCollection([]);
      }
    };

    fetchCollection();
  }, []);

  const handleGetRecipe = async (recipeName) => {
    try {
      const searchResponse = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
          recipeName
        )}&apiKey=7ddd915f06da4977bc43c51b058980fd`
      );

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        Swal.fire(
          'Error',
          `Error fetching recipes: ${errorData.message || 'Unknown error'}`,
          'error'
        );
        return;
      }

      const searchData = await searchResponse.json();

      if (!searchData.results || searchData.results.length === 0) {
        Swal.fire('No Results', 'No recipes found for this name.', 'info');
        return;
      }

      const recipe = searchData.results[0];
      const detailsResponse = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=7ddd915f06da4977bc43c51b058980fd`
      );

      if (!detailsResponse.ok) {
        Swal.fire('Error', 'Failed to fetch recipe details.', 'error');
        return;
      }

      const detailsData = await detailsResponse.json();

      setRecipeDetails({
        name: detailsData.title,
        image: detailsData.image,
        instructions: detailsData.instructions || 'No instructions available.',
        ingredients: detailsData.extendedIngredients?.map((ing) => ing.original) || [],
      });

      setShowRecipeModal(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      Swal.fire('Error', 'An unexpected error occurred. Please try again.', 'error');
    }
  };

  const handleDownloadPdf = async (recipeName) => {
    try {
      const searchResponse = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
          recipeName
        )}&apiKey=7ddd915f06da4977bc43c51b058980fd`
      );

      if (!searchResponse.ok) {
        Swal.fire('Error', 'Failed to fetch recipe details for PDF.', 'error');
        return;
      }

      const searchData = await searchResponse.json();

      if (!searchData.results || searchData.results.length === 0) {
        Swal.fire('Error', 'No recipe details found for PDF.', 'info');
        return;
      }

      const recipe = searchData.results[0];
      const detailsResponse = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=7ddd915f06da4977bc43c51b058980fd`
      );

      if (!detailsResponse.ok) {
        Swal.fire('Error', 'Failed to fetch recipe details.', 'error');
        return;
      }

      const detailsData = await detailsResponse.json();

      const recipeForPdf = {
        name: detailsData.title,
        ingredients: detailsData.extendedIngredients?.map((ing) => ing.original) || [],
        instructions: detailsData.instructions || 'No instructions available.',
      };

      const body = JSON.stringify(recipeForPdf);
      const response = await fetch('http://localhost:4001/api/generate-Cpdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${recipeForPdf.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire('Success', 'PDF downloaded successfully.', 'success');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Swal.fire('Error', 'Failed to download PDF.', 'error');
    }
  };

  const handleDelete = async (collectionId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this collection!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteCollection(collectionId);

          if (response.message === 'Collection deleted successfully.') {
            setCollection((prevCollection) =>
              prevCollection.filter((item) => item._id !== collectionId)
            );
            Swal.fire('Deleted!', 'Your collection has been deleted.', 'success');
          }
        } catch (error) {
          console.error('Error deleting collection:', error);
          Swal.fire('Error', 'Failed to delete the collection. Please try again.', 'error');
        }
      }
    });
  };

  const handleCloseModal = () => {
    setShowRecipeModal(false);
  };

  const totalPages = Math.ceil(collection.length / recipesPerPage);
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = collection.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="collection-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="collection">
        <h3 className="text-center">Your Recipe Collection</h3>
        <div className="collection-list">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {currentRecipes.map((recipe) => (
              <div key={recipe._id} className="col mb-4">
                <Card className="h-100 text-center card-custom">
                  <Card.Img variant="top" src={recipe.image} alt={recipe.name} />
                  <Card.Body>
                    <Card.Title>{recipe.name}</Card.Title>
                    <Button variant="primary" onClick={() => handleGetRecipe(recipe.name)}>
                      Get Recipe
                    </Button>
                    <div className="d-flex justify-content-around mt-3">
                      <AiOutlineFilePdf
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDownloadPdf(recipe.name)}
                        color="#007bff"
                      />
                      <WhatsappShareButton
  url={`${recipe._id}`} // Use your app's domain and route
  title={`Check out this recipe: ${recipe.name}`}
  separator=" - "
>
                        <FaWhatsapp style={{ cursor: 'pointer', color: '#25D366' }} />
                      </WhatsappShareButton>
                      <FaTrashAlt
                        style={{ cursor: 'pointer' }}
                        className="text-danger"
                        onClick={() => handleDelete(recipe._id)}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {collection.length > 0 && (
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
      </div>

      {recipeDetails && (
        <Modal show={showRecipeModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{recipeDetails.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={recipeDetails.image}
              alt={recipeDetails.name}
              style={{ width: '100%', marginBottom: '15px' }}
            />
            <h5>Ingredients:</h5>
            <p>
              {recipeDetails.ingredients.length > 0
                ? recipeDetails.ingredients.join(', ')
                : 'No ingredients available.'}
            </p>
            <h5>Instructions:</h5>
            <p>{recipeDetails.instructions || 'No instructions available.'}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Collections;
