import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFeed, createPost, likePost, addComment, editPost, deletePost } from '../store/postsSlice';
import { logout } from '../store/authSlice';

const Feed = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { posts, isLoading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchFeed());
  }, [dispatch, token, navigate]);

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.size);
      try {
        const compressedImage = await compressImage(file);
        console.log('Image compressed, new length:', compressedImage.length);
        setSelectedImage(compressedImage);
        setImagePreview(compressedImage);
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('Failed to process image. Please try a smaller image.');
      }
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPost.trim() || selectedImage) {
      const postData = {
        content: newPost.trim() || '' // Allow empty content if image exists
      };
      if (selectedImage) {
        postData.image = selectedImage;
      }
      
      const result = await dispatch(createPost(postData));
      if (result.type === 'posts/create/fulfilled') {
        setNewPost('');
        setSelectedImage(null);
        setImagePreview(null);
        dispatch(fetchFeed()); // Refresh feed
      }
    }
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleComment = (postId) => {
    const text = commentTexts[postId];
    if (text?.trim()) {
      dispatch(addComment({ postId, text: text.trim() }));
      setCommentTexts({ ...commentTexts, [postId]: '' });
    }
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const startEdit = (post) => {
    setEditingPost(post._id);
    setEditContent(post.content);
    setEditImage(post.image);
  };

  const handleEdit = async (postId) => {
    await dispatch(editPost({ postId, content: editContent, image: editImage }));
    setEditingPost(null);
    setEditContent('');
    setEditImage(null);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await dispatch(deletePost(postId));
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <h1 className="navbar-brand">🎵 JamSync</h1>
            <div className="navbar-user">
              <button onClick={() => navigate('/discover')} className="btn btn-secondary">
                🔍 Discover
              </button>
              <button onClick={() => navigate('/bandmates')} className="btn btn-secondary">
                🎸 Bandmates
              </button>
              <button onClick={() => navigate('/profile')} className="btn btn-secondary">
                👤 Profile
              </button>
              <button onClick={() => dispatch(logout())} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem', maxWidth: '600px' }}>
        {/* Create Post */}
        <form onSubmit={handleCreatePost} className="post-form">
          <textarea
            placeholder="🎵 Share your musical journey... (optional)"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="post-textarea"
            rows="3"
          />
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" className="preview-img" />
              <button 
                type="button" 
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="remove-image"
              >
                ❌
              </button>
            </div>
          )}
          
          <div className="post-actions-form">
            <label className="photo-upload">
              📷 Photo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!newPost.trim() && !selectedImage}
            >
              📝 Post
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="error-message">❌ {error}</div>
        )}

        {/* Feed */}
        {isLoading ? (
          <div className="loading">🎶 Loading feed...</div>
        ) : (
          <div className="posts-container">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">
                      {post.author.profilePicture ? (
                        <img src={post.author.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        '🎤'
                      )}
                    </div>
                    <div>
                      <div className="author-name">{post.author.name}</div>
                      <div className="author-location">📍 {post.author.city}</div>
                    </div>
                  </div>
                  <div className="post-time">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {editingPost === post._id ? (
                  <div className="edit-post">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-textarea"
                      rows="3"
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleEdit(post._id)} className="btn btn-primary">
                        Save
                      </button>
                      <button onClick={() => setEditingPost(null)} className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {post.content && (
                      <div className="post-content">
                        {post.content}
                      </div>
                    )}
                    
                    {post.image && (
                      <div className="post-image">
                        <img src={post.image} alt="Post" className="post-img" />
                      </div>
                    )}
                  </>
                )}
                
                <div className="post-actions">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className="action-btn"
                  >
                    ❤️ {post.likes.length}
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="action-btn"
                  >
                    💬 {post.comments.length}
                  </button>
                  {post.author._id !== user.id && (
                    <button 
                      onClick={() => navigate(`/chat/${post.author._id}`)}
                      className="action-btn"
                    >
                      📩 Message
                    </button>
                  )}
                  {post.author._id === user.id && (
                    <>
                      <button 
                        onClick={() => startEdit(post)}
                        className="action-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(post._id)}
                        className="action-btn delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
                
                {showComments[post._id] && (
                  <div className="comments-section">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <span className="comment-author">{comment.user.name}:</span>
                        <span className="comment-text">{comment.text}</span>
                      </div>
                    ))}
                    
                    <div className="add-comment">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentTexts[post._id] || ''}
                        onChange={(e) => setCommentTexts({
                          ...commentTexts,
                          [post._id]: e.target.value
                        })}
                        className="comment-input"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post._id);
                          }
                        }}
                      />
                      <button 
                        onClick={() => handleComment(post._id)}
                        className="comment-btn"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;