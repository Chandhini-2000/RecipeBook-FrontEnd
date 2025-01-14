import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import MyRecipe from './MyRecipe';
import Add from '../COMPONENTS/Add';
import Collections from '../COMPONENTS/Collections';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username and userID from session storage
    const storedUsername = sessionStorage.getItem('username');
    const storedUserID = sessionStorage.getItem('userID');

    if (storedUsername) setUsername(storedUsername);
    if (storedUserID) setUserID(storedUserID);
  }, []);

  const handleCreateCollection = () => {
    navigate('/create-collection'); // Redirect to the create collection page
  };

  return (
    <div className="container p-4">
      <div className="mb-4 text-center">
        <h2>Welcome {username}</h2>
      </div>

      {/* Add Recipe Section */}
      <div className="row mb-4">
        <div className="col-12 d-flex flex-column align-items-center">
          <div className="mb-3">
            <Add />
          </div>
          <div className="mt-3 w-100">
            <MyRecipe />
          </div>
        </div>
      </div>

      {/* Add Collection Section */}
      <div className="row mb-4">
        <div className="col-12 d-flex flex-column align-items-center">
          <div className="mb-3">
            <Button onClick={handleCreateCollection}>Add Collection</Button>
          </div>
          <div className="mt-3 w-100 d-flex justify-content-center">
          <Collections userID={userID} />


          </div>
        </div>
      </div>

      {/* Explore More Section */}
      <div className="text-center mt-4">
        <Link to="/recipe">
          <Button variant="primary">Explore More</Button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
