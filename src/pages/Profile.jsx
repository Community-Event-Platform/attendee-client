import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import './style/Profile.css';

function Profile({ addToast }) {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState({
    confirmed: [],
    pending: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('confirmed');
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/profile');
      const data = response.data;
      setProfile(data.user);
      
      const grouped = {
        confirmed: [],
        pending: [],
        rejected: []
      };

      data.registrations?.forEach(reg => {
        if (reg.status === 'Confirmed') {
          grouped.confirmed.push(reg);
        } else if (reg.status === 'Pending') {
          grouped.pending.push(reg);
        } else if (reg.status === 'Rejected') {
          grouped.rejected.push(reg);
        }
      });

      setRegistrations(grouped);
    } catch (error) {
      console.error('Error fetching profile:', error);
      addToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      setCancelingId(registrationId);
      await api.post(`/registrations/${registrationId}/cancel`);
      addToast('Registration cancelled successfully', 'success');
      fetchProfile();
    } catch (error) {
      console.error('Error cancelling registration:', error);
      addToast('Failed to cancel registration', 'error');
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error-message">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-bg"></div>
        <div className="profile-header-content">
          <div className="profile-avatar">
            <span>{profile.name?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{profile.name || 'User'}</h1>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-role">Attendee</p>
          </div>
        </div>
      </div>

      <div className="profile-main">
        <div className="profile-section info-section">
          <h2 className="section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{profile.name}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>{new Date(profile.created_at).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </div>

        <div className="profile-section events-section">
          <h2 className="section-title">My Events</h2>
          
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              <i className="bi bi-check-circle"></i>
              Participated ({registrations.confirmed.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <i className="bi bi-hourglass-split"></i>
              Pending ({registrations.pending.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              <i className="bi bi-x-circle"></i>
              Rejected ({registrations.rejected.length})
            </button>
          </div>

          <div className="events-list">
            {activeTab === 'confirmed' && (
              <>
                {registrations.confirmed.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-calendar-x"></i>
                    <p>No participated events yet</p>
                  </div>
                ) : (
                  registrations.confirmed.map(reg => (
                    <EventCard 
                      key={reg.id} 
                      registration={reg} 
                      status="confirmed"
                      onCancel={() => handleCancelRegistration(reg.id)}
                      isCanceling={cancelingId === reg.id}
                    />
                  ))
                )}
              </>
            )}
            {activeTab === 'pending' && (
              <>
                {registrations.pending.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-calendar-x"></i>
                    <p>No pending registrations</p>
                  </div>
                ) : (
                  registrations.pending.map(reg => (
                    <EventCard 
                      key={reg.id} 
                      registration={reg} 
                      status="pending"
                      onCancel={() => handleCancelRegistration(reg.id)}
                      isCanceling={cancelingId === reg.id}
                    />
                  ))
                )}
              </>
            )}
            {activeTab === 'rejected' && (
              <>
                {registrations.rejected.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-calendar-x"></i>
                    <p>No rejected registrations</p>
                  </div>
                ) : (
                  registrations.rejected.map(reg => (
                    <EventCard 
                      key={reg.id} 
                      registration={reg} 
                      status="rejected"
                      onCancel={() => handleCancelRegistration(reg.id)}
                      isCanceling={cancelingId === reg.id}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;