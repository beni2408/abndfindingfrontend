import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../store/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    instruments: '',
    genres: '',
    city: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      instruments: formData.instruments.split(',').map(i => i.trim()),
      genres: formData.genres.split(',').map(g => g.trim()),
    };
    
    const result = await dispatch(register(userData));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/feed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">🌟 Join the Band</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="name"
              type="text"
              required
              className="form-input"
              placeholder="🎤 Your stage name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="✉️ Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="🔒 Create password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="city"
              type="text"
              required
              className="form-input"
              placeholder="📍 Your city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="instruments"
              type="text"
              className="form-input"
              placeholder="🎸 Instruments (guitar, drums, piano...)"
              value={formData.instruments}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="genres"
              type="text"
              className="form-input"
              placeholder="🎵 Genres (rock, jazz, pop...)"
              value={formData.genres}
              onChange={handleChange}
            />
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? '🎶 Creating your profile...' : '🚀 Start Jamming!'}
          </button>

          <Link to="/login" className="link">
            🎵 Already rocking? Sign in here!
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;