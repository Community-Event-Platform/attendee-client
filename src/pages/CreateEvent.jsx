import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    event_date: '',
    capacity: '',
    status: 'published',
    category_id: ''
  });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Load categories once
  React.useEffect(() => {
    axiosClient.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosClient.post('/events', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tạo sự kiện');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tạo Sự Kiện</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <input name="name" placeholder="Tên sự kiện" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} rows={4} />
        <input name="location" placeholder="Địa điểm" value={form.location} onChange={handleChange} required />
        <input type="datetime-local" name="event_date" value={form.event_date} onChange={handleChange} required />
        <input type="number" name="capacity" placeholder="Số chỗ" value={form.capacity} onChange={handleChange} min={1} required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select name="category_id" value={form.category_id} onChange={handleChange} required>
          <option value="">-- Chọn danh mục --</option>
          {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
        </select>
        <button type="submit" style={{ marginTop: '10px', padding: '8px' }}>Tạo</button>
      </form>
    </div>
  );
}

export default CreateEvent;
