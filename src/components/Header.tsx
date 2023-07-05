import React from 'react';
import '../w3.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handlelogout = () => {
    //set localsorage to null
    localStorage.setItem('token', null);


    navigate('/');
  };

  const handleMain = () => {
    navigate('/join');
  };
  const handleCourses = () => {
    navigate('/courses');
  };

  return (
    <header className="w3-container w3-header w3-dark-grey w3-margin-bottom">
      <div className="w3-bar">
        <button className="w3-bar-item w3-button w3-left" onClick={handleMain}>Main Menu</button>
        <div className="w3-right">
          <button className="w3-bar-item w3-button" onClick={handleCourses}>Courses</button>
          <button className="w3-bar-item w3-button" onClick={handlelogout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
