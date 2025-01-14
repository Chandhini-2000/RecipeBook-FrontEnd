// Import necessary modules
import commonAPI from "./commonAPI";
import { serverUrl } from "./serverUrl";
import axios from 'axios'; // Import axios at the top
// Register API function
export const registerAPI = async (reqBody) => {
    return await commonAPI('post', `${serverUrl}/api/register`, reqBody, "");
};

// Login API function
export const loginAPI = async (reqBody) => {
    return await commonAPI('post', `${serverUrl}/api/login`, reqBody, "");
};


export const fetchRecipeDetails = async (query) => {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=1&apiKey=ce1c20aa64ae41d5bbdfcfed99959c98`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recipe details');
  }

  return response.json();
};



export const addRecipeAPI = async (data, token) => {
  try {
    const response = await axios.post('http://localhost:4001/api/addRecipe', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error('API call error:', error.response || error.message);
    throw error; // Rethrow error for further handling
  }
};


export const getAllRecipeAPI = async (token) => {
  try {
    const response = await axios.get('http://localhost:4001/api/getAllRecipes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Ensure this matches the backend response format
  } catch (error) {
    console.error('API call failed:', error);
    throw error; // Rethrow to handle it in the component
  }
};

export const generatePdfAPI = async (recipe) => {
  try {
    const response = await fetch('http://localhost:4001/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error response
      console.error('Backend error:', errorText);
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    return blob;
  } catch (err) {
    console.error('Error during PDF download:', err);
    throw err;
  }
};

// Assuming generateShareableLinkAPI looks something like this
export const generateShareableLinkAPI = async (recipeId, token) => {
  try {
    const response = await axios.post(
      `http://localhost:4001/api/recipes/${recipeId}/share`, 
      {recipeId},  // Include the necessary request body (empty or as per your API requirements)
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data.link;  // Assuming the API returns the shareable link in 'link'
  } catch (error) {
    console.error('Error sharing recipe:', error);
    throw error; // Propagate the error to the caller
  }
};


export const deleteRecipeAPI = async (recipeId, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:4001/api/deleteRecipe/${recipeId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};



// Update a recipe
export const editRecipeAPI = async (recipeId, data, token) => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.put(`http://localhost:4001/api/editRecipe/${recipeId}`, data, {
      headers, // Correctly pass headers
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error; // Throw error for handling in the caller
  }
};




//admin login
export const adminLoginAPI = async (reqBody) => {
  try {
    const response = await commonAPI('post', `${serverUrl}/api/admin/login`, reqBody);
    if (response.status === 200 && response.data) {
      return { response: response, data: response.data, error: null }; // Ensure correct data structure
    } else {
      return { response: null, data: null, error: "Login failed" }; // Handle API error
    }
  } catch (error) {
    return { response: null, data: null, error: error.message || "An error occurred" };
  }
};

export const createCollectionAPI = async (collectionData) => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    const response = await axios.post('http://localhost:4001/api/collections', collectionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating collection:', error.response || error.message);
    if (error.response) {
      console.error('Backend Response:', error.response.data);  // Log backend validation errors
    }
    throw error.response?.data || { message: 'Error creating collection' };
  }
};



export const fetchUserCollection = async () => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error('No token found, please log in.');
  }

  try {
    const response = await axios.get('http://localhost:4001/api/get-collections', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user collection:', error);
    throw error;
  }
};


export const deleteCollection = async (collectionId) => {
  const token = sessionStorage.getItem('token'); // Ensure you're sending the token if required
  const response = await fetch(`http://localhost:4001/api/collections/${collectionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  // Log the response to debug
  console.log('Raw response:', response);

  if (!response.ok) {
    throw new Error(`Failed to delete collection: ${response.statusText}`);
  }

  // Only parse JSON if a response body exists
  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return await response.json();
  }
  return {}; // Return an empty object if no JSON body
};
