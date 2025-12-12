import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    const result = await dispatch(login(formData));
    if (result.type === 'auth/login/fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">🎵 Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="✉️ Your email"
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
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? '🎶 Signing in...' : '🚀 Let\'s Jam!'}
          </button>

          <Link to="/register" className="link">
            🌟 New here? Join the band!
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;