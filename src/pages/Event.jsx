import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/api";
import eventImage from "../assets/event.png";
import eventCard01 from "../assets/events/event-01.jpg";
import eventCard02 from "../assets/events/event-02.jpg";
import eventCard03 from "../assets/events/event-03.jpg";
import eventCard04 from "../assets/events/event-04.jpg";
import eventCard05 from "../assets/events/event-05.jpg";
import eventCard06 from "../assets/events/event-06.jpg";
import eventCard07 from "../assets/events/event-07.jpg";
import eventCard08 from "../assets/events/event-08.jpg";
import eventCard09 from "../assets/events/event-09.jpg";
import eventCard10 from "../assets/events/event-10.jpg";
import eventCard11 from "../assets/events/event-11.jpg";
import eventCard12 from "../assets/events/event-12.jpg";
import eventCard13 from "../assets/events/event-13.jpg";
import eventCard14 from "../assets/events/event-14.jpg";
import eventCard15 from "../assets/events/event-15.jpg";
import eventCard16 from "../assets/events/event-16.jpg";
import eventCard17 from "../assets/events/event-17.jpg";
import eventCard18 from "../assets/events/event-18.jpg";
import eventCard19 from "../assets/events/event-19.jpg";
import eventCard20 from "../assets/events/event-20.jpg";
import "./style/Event.css";

const eventImages = {
  1: eventCard01,
  2: eventCard02,
  3: eventCard03,
  4: eventCard04,
  5: eventCard05,
  6: eventCard06,
  7: eventCard07,
  8: eventCard08,
  9: eventCard09,
  10: eventCard10,
  11: eventCard11,
  12: eventCard12,
  13: eventCard13,
  14: eventCard14,
  15: eventCard15,
  16: eventCard16,
  17: eventCard17,
  18: eventCard18,
  19: eventCard19,
  20: eventCard20,
};

function Event({ addToast }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả danh mục");
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
        setError("Không thể tải danh sách sự kiện.");
        if (addToast) addToast("Không thể tải danh sách sự kiện.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [addToast]);

  const categories = useMemo(() => {
    const names = events.map((event) => event.category).filter(Boolean);
    return ["Tất cả danh mục", ...new Set(names)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return events
      .filter((event) => {
        if (selectedCategory === "Tất cả danh mục") return true;
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

  const formatDateTime = (value) => {
    if (!value) return "Chưa cập nhật";

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  const getShortDate = (value) => {
    if (!value) return "Chưa cập nhật";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

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
                <h1>Khám phá sự kiện</h1>
                <p>Tìm kiếm và tham gia những sự kiện phù hợp với bạn</p>

                <form className="event-search-form" onSubmit={handleSearch}>
                  <label className="event-search-field event-search-text">
                    <i className="bi bi-search"></i>
                    <input
                      type="search"
                      placeholder="Tìm kiếm tên, địa điểm ..."
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
            <h2>Tất cả sự kiện</h2>
            <span>{loading ? "Đang tải..." : `${filteredEvents.length} sự kiện`}</span>
          </div>

          <label className="event-sort">
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="newest">Sắp xếp mới nhất</option>
              <option value="oldest">Sắp xếp cũ nhất</option>
            </select>
            <i className="bi bi-chevron-down"></i>
          </label>
        </div>

        {loading && (
          <div className="event-state-card">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p>Đang tải sự kiện...</p>
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
            <p>Không có sự kiện nào.</p>
          </div>
        )}

        {!loading && !error && visibleEvents.length > 0 && (
          <div className="event-grid">
            {visibleEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <div className="event-card-image">
                  <img
                    src={eventImages[event.id] || eventImage}
                    alt={event.name}
                    loading="lazy"
                  />
                  <span>{event.category}</span>
                </div>

                <div className="event-card-body">
                  <h3>{event.name}</h3>

                  <div className="event-card-meta">
                    <span>
                      <i className="bi bi-calendar-event"></i>
                      {getShortDate(event.date_time)}
                    </span>
                    <span>
                      <i className="bi bi-geo-alt"></i>
                      {event.location}
                    </span>
                    <span>
                      <i className="bi bi-people"></i>
                      {Math.max(event.capacity - 5, 0)} spots left
                    </span>
                  </div>

                  <div className="event-card-footer">
                    <small>{formatDateTime(event.date_time)}</small>
                  </div>

                  <button type="button" onClick={() => navigate(`/events/${event.id}`)}>View Details</button>
                </div>
              </article>
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
