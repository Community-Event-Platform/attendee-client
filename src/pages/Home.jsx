import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/home/SearchBar';
import EventCard from '../components/home/EventCard';
import CategoryCard from '../components/home/CategoryCard';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/events');
        const data = await response.json();
        setEvents(data.data || []);
        setFilteredEvents(data.data || []);
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
    filterEvents(term, selectedCategory);
  };

  const handleCategoryFilter = (categoryId) => {
    const category = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(category);
    filterEvents(searchTerm, category);
  };

  const filterEvents = (search, categoryId) => {
    let result = events;

    if (search) {
      result = result.filter(
        (event) =>
          event.name.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase()) ||
          event.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      result = result.filter((event) => event.category === category.name);
    }

    setFilteredEvents(result);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Khám phá sự kiện</h1>
          <p className="hero-subtitle">Tìm kiếm và tham gia những sự kiện hợp với bạn</p>
          <SearchBar onSearch={handleSearch} />
          <div className="hero-filters">
            <button className="filter-btn">
              <i className="bi bi-funnel"></i> Danh mục
            </button>
            <button className="filter-btn">
              <i className="bi bi-calendar3"></i> Ngày
            </button>
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
            <h2 className="section-title">Sự kiện hàng đầu</h2>
            <p className="section-subtitle">Các sự kiện nổi bật nhất tuần này</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredEvents.slice(0, 4).map((event) => (
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
            <h2 className="section-title">Duyệt theo Danh mục</h2>
            <p className="section-subtitle">Tìm các sự kiện phù hợp với sở thích của bạn</p>
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
            <h2 className="section-title">Tất cả sự kiện</h2>
            {selectedCategory && (
              <p className="section-subtitle">
                Đang lọc: {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  className="btn-clear-filter ms-3"
                  onClick={() => handleCategoryFilter(null)}
                >
                  Xóa bộ lọc
                </button>
              </p>
            )}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <p className="text-muted fs-5">Không tìm thấy sự kiện nào</p>
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
              <div className="text-center mt-5">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/events')}
                >
                  Xem Tất Cả Sự Kiện
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works py-5">
        <div className="container-fluid px-4 px-lg-5">
          <div className="section-header mb-5 text-center">
            <h2 className="section-title">Cách Thức Hoạt Động</h2>
            <p className="section-subtitle">Tham gia sự kiện trong 3 bước đơn giản</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">1</div>
                <i className="bi bi-search step-icon"></i>
                <h4 className="step-title">Tìm Kiếm Sự Kiện</h4>
                <p className="step-description">Tìm kiếm và tìm thấy các sự kiện mà bạn quan tâm nhất</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">2</div>
                <i className="bi bi-pencil-square step-icon"></i>
                <h4 className="step-title">Đăng Ký Dễ Dàng</h4>
                <p className="step-description">Đăng ký dễ dàng và lưu lại thông tin tài khoản của bạn</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">3</div>
                <i className="bi bi-calendar-check step-icon"></i>
                <h4 className="step-title">Tham Dự Sự Kiện</h4>
                <p className="step-description">Hiển thị vé của bạn và tham gia một trải nghiệm tuyệt vời</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container-fluid px-4 px-lg-5">
          <div className="cta-content text-center">
            <h2 className="cta-title">Tham gia cộng đồng ngay hôm nay</h2>
            <button className="btn btn-warning btn-lg cta-button">
              Đăng Ký Ngay
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
