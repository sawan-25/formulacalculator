import React from 'react';
import logo from '../assets/formulaCalcLogo1.png'; 

function Header() {
  return (
    <div className="header bg-white-100 py-1 shadow-md flex-col sm:flex-row">
      <div className="container mx-auto flex justify-center">
        <img src={logo} alt="Logo" className="h-28" />
      </div>
    </div>
  );
}

export default Header;
