import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function Edit({ show, onClose, recipe, onUpdate }) {
  const [recipeDetails, setRecipeDetails] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    recipeImg: "",
  });

  // Update local state whenever a new recipe is passed
  useEffect(() => {
    if (recipe) {
      setRecipeDetails(recipe);
    }
  }, [recipe]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeDetails({ ...recipeDetails, [name]: value });
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setRecipeDetails({ ...recipeDetails, recipeImg: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = () => {
    const isChanged =
      recipe.name !== recipeDetails.name ||
      recipe.ingredients !== recipeDetails.ingredients ||
      recipe.instructions !== recipeDetails.instructions ||
      recipe.recipeImg !== recipeDetails.recipeImg;

    if (isChanged) {
      onUpdate(recipeDetails);
      alert("Recipe updated successfully!");
    } else {
      alert("No changes made!");
    }

    // Close the modal after submission
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={recipeDetails.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="ingredients"
              value={recipeDetails.ingredients}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="instructions"
              value={recipeDetails.instructions}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Recipe Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              name="recipeImg"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Update Recipe
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Edit;
