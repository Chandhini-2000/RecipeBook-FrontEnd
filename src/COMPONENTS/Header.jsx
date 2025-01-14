import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarBrand, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

function Header({ theme, toggleTheme }) {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setToken(sessionStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    // Clear session and local storage
    sessionStorage.clear();
    localStorage.clear();

    // Optionally reset any other relevant state here, if needed
    // For example, you could reset user state in the parent component

    // Redirect user to the login page or home page
    navigate('/login');  // or navigate('/') to go back to the home page
  };

  return (
    <div className={theme}>
      <MDBNavbar light={theme === 'light'} dark={theme === 'dark'} bgColor={theme}>
        <MDBContainer fluid>
          <MDBNavbarBrand>
            <Link to="/" className="header-title text-decoration-none">
              <h2 style={{ color: theme === 'light' ? 'rgb(218, 31, 31)' : '#fff' }}>
                <MDBIcon fas icon="utensils" className="me-2 width-20px p-2" />
                RECIPE BOOK
              </h2>
            </Link>
          </MDBNavbarBrand>
          <div className="header-actions">
            {!token ? (
              <button className="auth-btn" onClick={() => navigate('/login')}>
                <MDBIcon fas icon="user-plus" className="me-1" />
                Register/Login
              </button>
            ) : (
              <button className="auth-btn" onClick={handleLogout}>
                <MDBIcon fas icon="sign-out-alt" className="me-1" />
                Logout
              </button>
            )}
            <button className="mode-switch" onClick={toggleTheme}>
              <MDBIcon fas icon={theme === 'light' ? 'moon' : 'sun'} />
            </button>
          </div>
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
}

export default Header;
