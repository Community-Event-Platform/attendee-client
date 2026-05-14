import { useEffect, useState } from "react";
import { getEvents } from "../api/eventApi";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError("Không tải được danh sách sự kiện.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <main className="container py-5 text-start">
      <section className="mb-5">
        <h1 className="fw-bold mb-3">Sự kiện cộng đồng</h1>
        <p className="text-secondary">
          Danh sách sự kiện đang lấy trực tiếp từ Laravel API và MySQL.
        </p>
      </section>

      {loading && <p>Đang tải sự kiện...</p>}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-4">
          {events.map((event) => (
            <div className="col-md-6" key={event.id}>
              <article className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <h2 className="h4 card-title mb-0">{event.name}</h2>
                    <span className="badge text-bg-primary">
                      {event.category?.name || "Event"}
                    </span>
                  </div>

                  <p className="card-text text-secondary mb-4">
                    {event.description}
                  </p>

                  <div className="d-grid gap-2 text-secondary small">
                    <span>
                      <i className="bi bi-geo-alt me-2"></i>
                      {event.location}
                    </span>
                    <span>
                      <i className="bi bi-calendar-event me-2"></i>
                      {new Date(event.event_date).toLocaleString("vi-VN")}
                    </span>
                    <span>
                      <i className="bi bi-people me-2"></i>
                      Sức chứa: {event.capacity}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Home;
