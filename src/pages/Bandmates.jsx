import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBandmates, fetchPendingRequests, respondToRequest } from '../store/connectionsSlice';

const Bandmates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { bandmates, pendingRequests } = useSelector((state) => state.connections);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchBandmates());
    dispatch(fetchPendingRequests());
  }, [dispatch, token, navigate]);

  const handleAccept = async (id) => {
    const result = await dispatch(respondToRequest({ id, status: 'accepted' }));
    if (result.type === 'connections/respond/fulfilled') {
      dispatch(fetchBandmates());
      dispatch(fetchPendingRequests());
    }
  };

  const handleReject = async (id) => {
    const result = await dispatch(respondToRequest({ id, status: 'rejected' }));
    if (result.type === 'connections/respond/fulfilled') {
      dispatch(fetchPendingRequests());
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
            <h1 className="navbar-brand">🎸 My Bandmates</h1>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        {pendingRequests.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>🔔 Pending Requests</h2>
            <div className="cards-grid">
              {pendingRequests.map((request) => (
                <div key={request._id} className="card">
                  <h3 className="card-title">🎤 {request.requester.name}</h3>
                  <p className="card-location">📍 {request.requester.city}</p>
                  <p className="card-email">✉️ {request.requester.email}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => handleAccept(request._id)}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      ✅ Accept
                    </button>
                    <button 
                      onClick={() => handleReject(request._id)}
                      className="btn btn-danger"
                      style={{ flex: 1 }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 style={{ color: 'white', marginBottom: '1rem' }}>🎵 My Bandmates</h2>
        {bandmates.length === 0 ? (
          <div className="no-results">
            🎯 No bandmates yet! Connect with musicians to start jamming! 🌟
          </div>
        ) : (
          <div className="cards-grid">
            {bandmates.map((connection) => {
              const bandmate = connection.requester._id === user.id ? connection.recipient : connection.requester;
              return (
                <div key={connection._id} className="card">
                  <h3 className="card-title">🎤 {bandmate.name}</h3>
                  <p className="card-location">📍 {bandmate.city}</p>
                  <p className="card-email">✉️ {bandmate.email}</p>
                  <button 
                    onClick={() => navigate(`/chat/${bandmate._id}`)}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    💬 Message
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bandmates;