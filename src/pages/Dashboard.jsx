import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, searchUsers } from '../store/usersSlice';
import { logout } from '../store/authSlice';
import { sendConnectionRequest, fetchBandmates, fetchSentRequests } from '../store/connectionsSlice';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    city: '',
    instrument: '',
    genre: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { users, isLoading, error } = useSelector((state) => state.users);
  const { bandmates, sentRequests, isLoading: connectLoading } = useSelector((state) => state.connections);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchUsers());
    dispatch(fetchBandmates());
    dispatch(fetchSentRequests());
  }, [dispatch, token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim())
    );
    
    if (Object.keys(activeFilters).length > 0) {
      dispatch(searchUsers(activeFilters));
    } else {
      dispatch(fetchUsers());
    }
  };

  const clearFilters = () => {
    setFilters({ city: '', instrument: '', genre: '' });
    dispatch(fetchUsers());
  };

  const getConnectionStatus = (musicianId) => {
    // Check if already connected
    const isConnected = bandmates.some(conn => 
      conn.requester._id === musicianId || conn.recipient._id === musicianId
    );
    if (isConnected) return 'connected';
    
    // Check if request already sent
    const requestSent = sentRequests.some(req => req.recipient._id === musicianId);
    if (requestSent) return 'sent';
    
    return 'none';
  };

  const handleConnect = async (musicianId) => {
    const result = await dispatch(sendConnectionRequest(musicianId));
    if (result.type === 'connections/sendRequest/fulfilled') {
      dispatch(fetchSentRequests());
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <button onClick={() => navigate('/feed')} className="btn btn-secondary">
              ← Feed
            </button>
            <h1 className="navbar-brand">🔍 Discover</h1>
            <div className="navbar-user">
              <span>Hey, {user.name}! 👋</span>
              <button onClick={() => navigate('/bandmates')} className="btn btn-secondary">
                🎸 Bandmates
              </button>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="city"
            placeholder="🔍 City"
            value={filters.city}
            onChange={handleFilterChange}
            className="search-input"
          />
          <input
            type="text"
            name="instrument"
            placeholder="🎸 Instrument"
            value={filters.instrument}
            onChange={handleFilterChange}
            className="search-input"
          />
          <input
            type="text"
            name="genre"
            placeholder="🎵 Genre"
            value={filters.genre}
            onChange={handleFilterChange}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" onClick={clearFilters} className="btn btn-secondary">
            Clear
          </button>
        </form>

        {error && (
          <div className="error-message">❌ {error}</div>
        )}

        {isLoading ? (
          <div className="loading">🎶 Finding amazing musicians...</div>
        ) : (
          <div className="cards-grid">
            {users.map((musician) => (
              <div key={musician._id} className="card">
                <h3 className="card-title">🎤 {musician.name}</h3>
                <p className="card-location">
                  <span className="emoji">📍</span> {musician.city}
                </p>
                {musician.instruments.length > 0 && (
                  <div className="card-info">
                    <span className="card-label">🎸 Instruments: </span>
                    {musician.instruments.join(', ')}
                  </div>
                )}
                {musician.genres.length > 0 && (
                  <div className="card-info">
                    <span className="card-label">🎵 Genres: </span>
                    {musician.genres.join(', ')}
                  </div>
                )}
                <p className="card-email">✉️ {musician.email}</p>
                {musician._id !== user.id && (() => {
                  const status = getConnectionStatus(musician._id);
                  return (
                    <button 
                      onClick={() => handleConnect(musician._id)}
                      className={`btn ${status === 'connected' ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ marginTop: '1rem', width: '100%' }}
                      disabled={status !== 'none' || connectLoading}
                    >
                      {connectLoading ? '⏳ Connecting...' : 
                       status === 'connected' ? '✅ Bandmates' :
                       status === 'sent' ? '📫 Request Sent' : '🤝 Connect'}
                    </button>
                  );
                })()}
              </div>
            ))}
          </div>
        )}

        {!isLoading && users.length === 0 && !error && (
          <div className="no-results">
            🎯 No musicians found with those filters! Try different search terms 🌟
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;