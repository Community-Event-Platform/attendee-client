import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/api";
import EventCard from "../components/home/EventCard";
import eventImage from "../assets/event.png";
import "./style/Event.css";

function Event({ addToast }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data || []);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Unable to load the events list.");
        if (addToast) addToast("Unable to load the events list.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [addToast]);

  const categories = useMemo(() => {
    const names = events.map((event) => event.category).filter(Boolean);
    return ["All categories", ...new Set(names)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return events
      .filter((event) => {
        if (selectedCategory === "All categories") return true;
        return event.category === selectedCategory;
      })
      .filter((event) => {
        if (!normalizedSearch) return true;

        return [event.name, event.location, event.description, event.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
      })
      .filter((event) => {
        if (!selectedDate) return true;
        return event.date_time?.slice(0, 10) === selectedDate;
      })
      .sort((first, second) => {
        const firstTime = new Date(first.date_time || 0).getTime();
        const secondTime = new Date(second.date_time || 0).getTime();
        return sortOrder === "newest" ? secondTime - firstTime : firstTime - secondTime;
      });
  }, [events, searchTerm, selectedCategory, selectedDate, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredEvents.length / pageSize));

  const visibleEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDate, sortOrder]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
  };

  return (
    <main className="event-page-shell">
      <section className="event-hero">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="event-hero-copy">
                <h1>Discover Events</h1>
                <p>Search and join events that are right for you</p>

                <form className="event-search-form" onSubmit={handleSearch}>
                  <label className="event-search-field event-search-text">
                    <i className="bi bi-search"></i>
                    <input
                      type="search"
                      placeholder="Search by name, location..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </label>

                  <label className="event-search-field">
                    <select
                      value={selectedCategory}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down"></i>
                  </label>

                  <label className="event-search-field">
                    <i className="bi bi-calendar3"></i>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(event) => setSelectedDate(event.target.value)}
                    />
                  </label>
                </form>
              </div>
            </div>

            <div className="col-lg-5">
              <img
                src={eventImage}
                alt="Community event illustration"
                className="event-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="event-content">
        <div className="event-category-bar">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="event-list-header">
          <div>
            <h2>All Events</h2>
            <span>{loading ? "Loading..." : `${filteredEvents.length} events`}</span>
          </div>

          <label className="event-sort">
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
            <i className="bi bi-chevron-down"></i>
          </label>
        </div>

        {loading && (
          <div className="event-state-card">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p>Loading events...</p>
          </div>
        )}

        {!loading && error && (
          <div className="event-state-card error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && visibleEvents.length === 0 && (
          <div className="event-state-card">
            <i className="bi bi-calendar-x"></i>
            <p>No events available.</p>
          </div>
        )}

        {!loading && !error && visibleEvents.length > 0 && (
          <div className="event-grid">
            {visibleEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                navigate={navigate} 
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredEvents.length > pageSize && (
          <nav className="event-pagination" aria-label="Event pagination">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            {[1, 2, 3].filter((page) => page <= pageCount).map((page) => (
              <button
                key={page}
                type="button"
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {pageCount > 4 && <span>...</span>}

            {pageCount > 3 && (
              <button
                type="button"
                className={currentPage === pageCount ? "active" : ""}
                onClick={() => setCurrentPage(pageCount)}
              >
                {pageCount}
              </button>
            )}

            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

export default Event;