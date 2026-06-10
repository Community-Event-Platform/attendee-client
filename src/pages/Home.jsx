import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/home/SearchBar';
import EventCard from '../components/home/EventCard';
import CategoryCard from '../components/home/CategoryCard';
import { getEvents } from '../services/api';
import '../components/home/style/Home.css';
import HeroImage from '../assets/homepage.png';

const categories = [
  { id: 1, name: 'Music', icon: 'bi-music-note-beamed', color: '#E8D5F2' },
  { id: 2, name: 'Sports', icon: 'bi-activity', color: '#D5E8D5' },
  { id: 3, name: 'Food', icon: 'bi-cup-hot', color: '#FFE5CC' },
  { id: 4, name: 'Education', icon: 'bi-mortarboard', color: '#E5D5F2' },
  { id: 5, name: 'Community', icon: 'bi-people', color: '#FFD5E5' },
];

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getEvents();
        const validEvents = (eventsData || []).filter((event) => {
          const eventDate = new Date(event.date_time || event.date);
          return eventDate > new Date();
        });
        setEvents(validEvents);
        setFilteredEvents(validEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterEvents(term, selectedCategory, selectedDate);
  };

  const handleCategoryFilter = (categoryId) => {
    const category = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(category);
    filterEvents(searchTerm, category, selectedDate);
  };

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    filterEvents(searchTerm, selectedCategory, date);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    filterEvents(searchTerm, selectedCategory, null);
  };

  const filterEvents = (search, categoryId, dateFilter) => {
    let result = events;

    // Filter out expired events
    result = result.filter((event) => isEventValid(event));

    if (search) {
      result = result.filter(
        (event) =>
          event.name?.toLowerCase().includes(search.toLowerCase()) ||
          event.description?.toLowerCase().includes(search.toLowerCase()) ||
          event.location?.toLowerCase().includes(search.toLowerCase()) ||
          (event.category?.name || event.category)?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      result = result.filter((event) => {
        const categoryName = event.category?.name || event.category;
        return categoryName === category.name;
      });
    }

    if (dateFilter) {
      result = result.filter((event) => {
        if (!event.date_time && !event.date) return false;
        const eventDate = new Date(event.date_time || event.date).toDateString();
        const filterDate = new Date(dateFilter).toDateString();
        return eventDate === filterDate;
      });
    }

    setFilteredEvents(result);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter((event) => {
        const eventDate = new Date(event.date_time || event.date);
        return eventDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date_time || a.date);
        const dateB = new Date(b.date_time || b.date);
        return dateA - dateB;
      });
  };

  const isEventValid = (event) => {
    const eventDate = new Date(event.date_time || event.date);
    return eventDate > new Date();
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Events</h1>
          <p className="hero-subtitle">Search and join events that are right for you</p>
          <SearchBar onSearch={handleSearch} />
          <div className="hero-filters">
            <div className="filter-wrapper">
              <button 
                className={`filter-btn ${selectedCategory ? 'active' : ''}`}
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <i className="bi bi-funnel"></i> Category
                {selectedCategory && <span className="filter-badge">1</span>}
              </button>
              {showCategoryDropdown && (
                <div className="filter-dropdown">
                  <div className="dropdown-item" onClick={() => handleCategoryFilter(null)}>
                    All Categories
                  </div>
                  {categories.map((cat) => (
                    <div 
                      key={cat.id}
                      className={`dropdown-item ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        handleCategoryFilter(cat.id);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <i className={`bi ${cat.icon}`}></i> {cat.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                    onChange={(e) => handleDateFilter(e.target.value)}
                    value={selectedDate || ''}
                  />
                  {selectedDate && (
                    <button 
                      className="clear-date-btn"
                      onClick={clearDateFilter}
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
              src={HeroImage}
              alt="Events"
              className="hero-img"
            />
          </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-section py-5">
        <div className="container-fluid px-4 px-lg-5">
          <div className="section-header mb-5">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">The most popular events this week</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {getUpcomingEvents().slice(0, 4).map((event) => (
                <div key={event.id} className="col-12 col-md-6 col-lg-3">
                  <EventCard event={event} navigate={navigate} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="category-section py-5">
        <div className="container-fluid px-4 px-lg-5">
          <div className="section-header mb-5 text-center">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find events that match your interests</p>
          </div>

          <div className="row g-3 justify-content-center">
            {categories.map((category) => (
              <div key={category.id} className="col-auto">
                <CategoryCard
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onSelect={() => handleCategoryFilter(category.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Events Section */}
      <section className="all-events-section py-5 bg-light">
        <div className="container-fluid px-4 px-lg-5">
          <div className="section-header mb-5">
            <h2 className="section-title">All Events</h2>
            {(selectedCategory || selectedDate) && (
              <p className="section-subtitle">
                {selectedCategory && `Category: ${categories.find((c) => c.id === selectedCategory)?.name}`}
                {selectedCategory && selectedDate && ' • '}
                {selectedDate && `Date: ${new Date(selectedDate).toLocaleDateString()}`}
                <button
                  className="btn-clear-filter ms-3"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedDate(null);
                    filterEvents(searchTerm, null, null);
                  }}
                >
                  Clear all filters
                </button>
              </p>
            )}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <p className="text-muted fs-5">No events found</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {filteredEvents.slice(0, 6).map((event) => (
                  <div key={event.id} className="col-12 col-md-6 col-lg-4">
                    <EventCard event={event} navigate={navigate} />
                  </div>
                ))}
              </div>
              {filteredEvents.length > 6 && (
                <div className="text-center mt-5">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate('/events')}
                  >
                    View All Events
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works py-5">
        <div className="container-fluid px-4 px-lg-5">
          <div className="section-header mb-5 text-center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Join events in 3 simple steps</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">1</div>
                <i className="bi bi-search step-icon"></i>
                <h4 className="step-title">Search Events</h4>
                <p className="step-description">Search and discover events that interest you</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">2</div>
                <i className="bi bi-pencil-square step-icon"></i>
                <h4 className="step-title">Easy Registration</h4>
                <p className="step-description">Register quickly and save your details</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">3</div>
                <i className="bi bi-calendar-check step-icon"></i>
                <h4 className="step-title">Attend the Event</h4>
                <p className="step-description">Show your ticket and enjoy the experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container-fluid px-4 px-lg-5">
          <div className="cta-content text-center">
            <h2 className="cta-title">Join the community today</h2>
            <button className="btn btn-warning btn-lg cta-button">
              Register Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;