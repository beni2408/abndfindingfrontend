import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProfile, updateProfile } from '../store/profileSlice';

const Profile = () => {
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser, token } = useSelector((state) => state.auth);
  const { user, posts, postsCount, bandmatesCount, isLoading } = useSelector((state) => state.profile);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchProfile(userId));
  }, [dispatch, userId, token, navigate]);

  useEffect(() => {
    if (user && isOwnProfile) {
      setEditData({
        name: user.name || '',
        bio: user.bio || '',
        city: user.city || '',
        instruments: user.instruments?.join(', ') || '',
        genres: user.genres?.join(', ') || ''
      });
    }
  }, [user, isOwnProfile]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Profile picture selected:', file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Profile picture converted to base64');
        setProfilePicPreview(reader.result);
        setEditData({ ...editData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const updateData = {
      ...editData,
      instruments: editData.instruments.split(',').map(i => i.trim()).filter(i => i),
      genres: editData.genres.split(',').map(g => g.trim()).filter(g => g)
    };
    
    const result = await dispatch(updateProfile(updateData));
    if (result.type === 'profile/update/fulfilled') {
      setIsEditing(false);
      setProfilePicPreview(null);
      // Refresh profile data
      dispatch(fetchProfile(userId));
    }
  };

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <button onClick={() => navigate('/feed')} className="btn btn-secondary">
              ← Feed
            </button>
            <h1 className="navbar-brand">👤 Profile</h1>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem', maxWidth: '600px' }}>
        <div className="profile-header">
          <div className="profile-pic-container">
            {isEditing ? (
              <label className="profile-pic-upload">
                <div className="profile-pic">
                  {profilePicPreview || user.profilePicture ? (
                    <img 
                      src={profilePicPreview || user.profilePicture} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>
                      🎤
                    </div>
                  )}
                </div>
                <div className="upload-overlay">📷</div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div className="profile-pic">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>
                    🎤
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="edit-input"
                  placeholder="Name"
                />
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="edit-textarea"
                  placeholder="Bio"
                  rows="2"
                />
                <input
                  type="text"
                  value={editData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  className="edit-input"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={editData.instruments}
                  onChange={(e) => setEditData({ ...editData, instruments: e.target.value })}
                  className="edit-input"
                  placeholder="Instruments (comma separated)"
                />
                <input
                  type="text"
                  value={editData.genres}
                  onChange={(e) => setEditData({ ...editData, genres: e.target.value })}
                  className="edit-input"
                  placeholder="Genres (comma separated)"
                />
                <div className="edit-buttons">
                  <button onClick={handleSave} className="btn btn-primary">Save</button>
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="profile-name">{user.name}</h2>
                {user.bio && <p className="profile-bio">{user.bio}</p>}
                <p className="profile-location">📍 {user.city}</p>
                
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{postsCount}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{bandmatesCount}</span>
                    <span className="stat-label">Bandmates</span>
                  </div>
                </div>

                {user.instruments?.length > 0 && (
                  <div className="profile-tags">
                    <span className="tag-label">🎸 Instruments:</span>
                    {user.instruments.map((instrument, index) => (
                      <span key={index} className="tag">{instrument}</span>
                    ))}
                  </div>
                )}

                {user.genres?.length > 0 && (
                  <div className="profile-tags">
                    <span className="tag-label">🎵 Genres:</span>
                    {user.genres.map((genre, index) => (
                      <span key={index} className="tag">{genre}</span>
                    ))}
                  </div>
                )}

                {isOwnProfile && (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="profile-posts">
          <div className="posts-section-header">
            <h3 className="posts-section-title">📸 Posts</h3>
            <span className="posts-count">{postsCount} posts</span>
          </div>
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-thumbnail">
                {post.image ? (
                  <>
                    <img src={post.image} alt="Post" className="post-thumb-img" />
                    <div className="post-overlay">
                      <div className="post-stats">
                        <span>❤️ {post.likes?.length || 0}</span>
                      </div>
                      <div className="post-stats">
                        <span>💬 {post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="post-thumb-text">{post.content.substring(0, 80)}...</div>
                    <div className="post-overlay">
                      <div className="post-stats">
                        <span>❤️ {post.likes?.length || 0}</span>
                      </div>
                      <div className="post-stats">
                        <span>💬 {post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;