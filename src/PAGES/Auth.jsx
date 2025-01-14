import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI, loginAPI } from '../Services/allAPIs'; // Ensure loginAPI is imported
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Auth({ register }) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value
    });
  };

  const handleRegister = async () => {
    const { username, email, password } = userDetails;
  
    if (!username || !email || !password) {
      toast.warn("Please fill the form", { /* options */ });
      return;
    }
  
    try {
      const result = await registerAPI(userDetails);
      console.log(result);
  
      if (result.status >= 200 && result.status < 300) {
        toast.success("Registration Success!", { /* options */ });
        setTimeout(() => navigate('/login'), 6000);
      } else if (result.status === 409) { // Check for conflict status
        toast.error("User already exists. Please log in.", { /* options */ });
      } else {
        toast.error(result.response.data, { /* options */ });
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("User already exists. Please log in.", { /* options */ });
      } else {
        toast.error("Error: " + err.message, { /* options */ });
      }
    }
  };
  

  const handleLogin = async () => {
    const { email, password } = userDetails;
  
    // Validate form fields
    if (!email || !password) {
      toast.warn("Please fill the form", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return; // Prevent further execution
    }
  
    try {
      const result = await loginAPI(userDetails);
      console.log(result);
  
      if (result.status >= 200 && result.status < 300) {
        toast.success("Login Success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
       sessionStorage.setItem("token", result.data.token);
      sessionStorage.setItem("username",result.data.user.username)
        // Set a timeout before redirecting
        setTimeout(() => navigate('/'), 6000); // Redirect after 6 seconds
      } else {
        toast.error(result.response.data, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      toast.error("Error: " + err.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row shadow-lg p-4 rounded w-75">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5ZoKNF1p7PRnwoW7oIoJdN5yHajLbFP-5OQ&s" 
            alt="Auth Illustration" 
            className="img-fluid"
          />
        </div>

        <div className="col-md-6">
          <h1 className="text-center mb-4">
            Sign {register ? 'Up' : 'In'}
          </h1>
          <form>
            {register && (
              <div className="mb-3">
                <input 
                  type="text" 
                  name="username"
                  value={userDetails.username}
                  onChange={handleChange}
                  placeholder="Username" 
                  className="form-control" 
                />
              </div>
            )}

            <div className="mb-3">
              <input 
                type="email" 
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                placeholder="Email" 
                className="form-control" 
              />
            </div>

            <div className="mb-3">
              <input 
                type="password" 
                name="password"
                value={userDetails.password}
                onChange={handleChange}
                placeholder="Password" 
                className="form-control" 
              />
            </div>

            <div className="text-center">
              <button 
                type="button" 
                onClick={register ? handleRegister : handleLogin}  
                className="btn btn-primary w-100 mb-3"
              >
                {register ? 'Sign Up' : 'Sign In'}
              </button>

              {register ? (
                <p>
                  Already registered?{' '}
                  <Link to="/login">Please login from here</Link>
                </p>
              ) : (
                <p>
                  New here?{' '}
                  <Link to="/register">Please register from here</Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Auth;
