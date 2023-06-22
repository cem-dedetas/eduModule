import React, { useState } from 'react';

const SearchBar = ({ options, selectedOptions, setSelectedOptions }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    setShowDropdown(value !== ''); // Show dropdown only if there is a search query
  };

  const handleOptionClick = (option) => {
    setSelectedOptions([...selectedOptions, option]);
    setSearchValue(''); // Clear the search input
    setShowDropdown(false); // Hide the dropdown
  };

  return (
    <div className="w3-dropdown-hover">
      <input
        className="w3-input w3-border"
        type="text"
        placeholder="Add tags"
        value={searchValue}
        onChange={handleInputChange}
      />
      {showDropdown && (
        <div className="w3-dropdown-content w3-bar-block">
          {options
            .filter((option) => option.tag_name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((option) => (
              <button
                key={option.id}
                className="w3-bar-item w3-button"
                onClick={() => handleOptionClick(option)}
              >
                {option.tag_name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
