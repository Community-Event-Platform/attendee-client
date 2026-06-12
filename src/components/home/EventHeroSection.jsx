import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import './style/Home.css';
import eventImage from '../../assets/event.png';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Music', icon: 'bi-music-note-beamed' },
  { id: 2, name: 'Sports', icon: 'bi-activity' },
  { id: 3, name: 'Food', icon: 'bi-cup-hot' },
  { id: 4, name: 'Education', icon: 'bi-mortarboard' },
  { id: 5, name: 'Community', icon: 'bi-people' },
];

function EventHeroSection({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDate,
  onDateChange,
  onClearDate,
  availableCategories = []
}) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Use available categories from parent or fallback to defaults
  const displayCategories = availableCategories && availableCategories.length > 0 
    ? availableCategories 
    : DEFAULT_CATEGORIES;

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    const found = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
    return found ? found.icon : 'bi-tag';
  };

  const handleSearchChange = (term) => {
    onSearchChange(term);
  };

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setShowCategoryDropdown(false);
  };

  const handleDateSelect = (date) => {
    onDateChange(date);
    setShowDatePicker(false);
  };

  const handleClearDate = () => {
    onClearDate();
    setShowDatePicker(false);
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Discover Events</h1>
        <p className="hero-subtitle">Search and join events that are right for you</p>
        
        <SearchBar onSearch={handleSearchChange} />
        
        <div className="hero-filters">
          {/* Category Filter */}
          <div className="filter-wrapper">
            <button 
              className={`filter-btn ${selectedCategory && selectedCategory !== 'All categories' ? 'active' : ''}`}
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              disabled={loadingCategories}
            >
              <i className="bi bi-funnel"></i> 
              {loadingCategories ? 'Loading...' : 'Category'}
              {selectedCategory && selectedCategory !== 'All categories' && (
                <span className="filter-badge">1</span>
              )}
            </button>
            
            {showCategoryDropdown && (
              <div className="filter-dropdown">
                <div 
                  className="dropdown-item" 
                  onClick={() => handleCategorySelect('All categories')}
                >
                  All Categories
                </div>
                
                {displayCategories.map((cat) => {
                  const categoryName = typeof cat === 'string' ? cat : cat.name;
                  const isActive = selectedCategory === categoryName;
                  
                  return (
                    <div 
                      key={categoryName}
                      className={`dropdown-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(categoryName)}
                    >
                      <i className={`bi ${getCategoryIcon(categoryName)}`}></i>
                      {categoryName}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date Filter */}
          <div className="filter-wrapper">
            <button 
              className={`filter-btn ${selectedDate ? 'active' : ''}`}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <i className="bi bi-calendar3"></i> Date
              {selectedDate && <span className="filter-badge">1</span>}
            </button>
            
            {showDatePicker && (
              <div className="filter-dropdown date-picker">
                <input 
                  type="date" 
                  className="date-input"
                  onChange={(e) => handleDateSelect(e.target.value)}
                  value={selectedDate || ''}
                />
                {selectedDate && (
                  <button 
                    className="clear-date-btn"
                    onClick={handleClearDate}
                  >
                    Clear date
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="hero-image">
        <img 
          src={eventImage}
          alt="Events"
          className="hero-img"
        />
      </div>
    </section>
  );
}

export default EventHeroSection;
