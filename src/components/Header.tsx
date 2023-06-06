import React from 'react';
import '../w3.css';

const Header: React.FC = () => {
  return (
    <header className="w3-container w3-header w3-dark-grey w3-margin-bottom">
      <div className="w3-bar">
        <button className="w3-bar-item w3-button w3-left">Main Menu</button>
        <div className="w3-right">
          <button className="w3-bar-item w3-button">Courses</button>
          <button className="w3-bar-item w3-button">Live Lectures</button>
          <button className="w3-bar-item w3-button">Profile</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
