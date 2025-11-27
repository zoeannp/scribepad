import React from 'react';
import logo from './images/logo.png';

function Header() {
  return (
    <header className="navbar shadow-sm" style={{ backgroundColor: '#3d2f24' }}>
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center text-light" href="/">
          {/* Logo */}
          <img 
            src={logo} 
            alt="ScribePad Logo" 
            height="40" 
            className="me-2"
          />
          <span className="fw-bold" style={{ color: '#e8dcc8' }}>ScribePad</span>
        </a>
        
        {/* Settings button - commented out for now */}
        {/* <div className="d-flex align-items-center">
          <button className="btn btn-outline-light btn-sm">
            <i className="bi bi-gear"></i>
          </button>
        </div> */}
      </div>
    </header>
  );
}

export default Header;