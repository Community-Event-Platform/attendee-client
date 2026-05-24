import { useState } from 'react';
import './style/SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-container">
        <i className="bi bi-search search-icon"></i>
        <input
          type="text"
          placeholder="Search by name, location, category..."
          className="search-input"
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className="search-btn">
          <i className="bi bi-search"></i> Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
