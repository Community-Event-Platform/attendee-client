// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { getEvents, getProfileApi } from "../services/api";

function Home({ addToast }) {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadEvents = async () => {

      try {

        const data = await getEvents();

        setEvents(data);

      } catch {

        setError("Failed to load events list.");

      } finally {

        setLoading(false);

      }
    };

    const getProfile = async () => {

      try {

        const response = await getProfileApi();

        console.log("PROFILE:", response.data);

      } catch (error) {

        console.log(error);

      }
    };

    // Check if user just logged in via Google OAuth
    const googleLogin = sessionStorage.getItem("googleLogin");
    if (googleLogin) {
      sessionStorage.removeItem("googleLogin");
      if (addToast) addToast("Google login successful!", "success");
    }

    // Check if user just logged in via regular login
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    if (justLoggedIn) {
      sessionStorage.removeItem("justLoggedIn");
      if (addToast) addToast("Login successful!", "success");
    }

    loadEvents();

    getProfile();

  }, []);

  return (

    <main className="container-fluid py-5 text-start">

      <section className="mb-5">

        <h1 className="fw-bold mb-3">
          Community Events
        </h1>

        <p className="text-secondary">
          Browse events from our API.
        </p>

      </section>

      {loading && <p>Loading events...</p>}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && (

        <div className="row g-4">

          {events.map((event) => (

            <div className="col-md-6" key={event.id}>

              <article className="card h-100 shadow-sm">

                <div className="card-body">

                  <div className="d-flex justify-content-between mb-3">

                    <h2 className="h4">
                      {event.name}
                    </h2>

                    <span className="badge text-bg-primary">
                      {event.category?.name || "Event"}
                    </span>

                  </div>

                  <p className="text-secondary">
                    {event.description}
                  </p>

                  <div className="small text-secondary d-grid gap-2">

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
                      Capacity: {event.capacity}
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
