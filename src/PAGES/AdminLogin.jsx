// AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { adminLoginAPI } from "../Services/allAPIs"; // Import the function from api.js
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.css"; // Include a custom CSS file for additional styling

function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async () => {
    const { username, password } = credentials;
    console.log(credentials);
    
    // Send credentials as a JSON object
    const reqBody = { username, password };
    const { response, data, error } = await adminLoginAPI(reqBody);
    
    console.log(response, data, error);
    
    if (response && data && data.token) {
      toast.success("Login Successful!");
      sessionStorage.setItem("token", data.token); // Store token in sessionStorage
      sessionStorage.setItem("admin", "true"); // Store admin login status
  
      // Delay the navigation to ensure the session is set properly
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 500);
    } else {
      toast.error(error || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="card p-4 shadow-lg login-card">
        <h2 className="text-center text-uppercase">Admin Login</h2>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="form-control input-field"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control input-field"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary w-100 submit-btn" onClick={handleLogin}>
          Login
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminLogin;
