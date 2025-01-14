import React, { useState } from 'react';
import { Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap'; // Import Row and Col
import { addRecipeAPI } from '../Services/allAPIs'; // Ensure this is correct


function Add() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    recipeImg: null, // Add a field for the image file
  });
  const [alert, setAlert] = useState({ type: '', message: '' }); // State for success/error alerts

  const showModalHandler = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAlert({ type: '', message: '' }); // Reset alert when modal is closed
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, recipeImg: e.target.files[0] }); // Handle file input for the image
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = sessionStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('ingredients', formData.ingredients);
      data.append('instructions', formData.instructions);
      if (formData.recipeImg) data.append('recipeImg', formData.recipeImg);
  
      console.log('Submitting data:', data);
  
      const response = await addRecipeAPI(data, token);
  
      console.log('Response received:', response);
  
      setAlert({ type: 'success', message: 'Recipe added successfully!' });
      setFormData({ name: '', ingredients: '', instructions: '', recipeImg: null });
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      console.error('Error adding recipe:', err);
  
      if (err.response && err.response.status === 409) {
        setAlert({
          type: 'danger',
          message: 'A recipe with this name already exists. Please try a different name.',
        });
      } else {
        setAlert({
          type: 'danger',
          message: err.message || 'Failed to add recipe. Please try again.',
        });
      }
    }
  };
  

  return (
    <div>
      <Button variant="primary" onClick={showModalHandler}>
        Add Recipe
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Your Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert.message && (
            <Alert variant={alert.type} onClose={() => setAlert({ type: '', message: '' })} dismissible>
              {alert.message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Left Column: Form */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formRecipeName">
                  <Form.Label>Recipe Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter recipe name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIngredients">
                  <Form.Label>Ingredients</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="List ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formInstructions">
                  <Form.Label>How to Prepare</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Right Column: Image Upload */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formRecipeImage">
                  <Form.Label>Upload Recipe Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
                {formData.recipeImg && (
  <div>
    <img
      src={URL.createObjectURL(formData.recipeImg)}
      alt="Preview"
      style={{ width: '100%', height: 'auto', marginTop: '10px', borderRadius: '8px' }}
    />
  </div>
)}


              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Add;
