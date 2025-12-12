import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { sendMessage, fetchMessages } from '../store/messagesSlice';

const Chat = () => {
  const [messageText, setMessageText] = useState('');
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { messages, isLoading } = useSelector((state) => state.messages);
  const { users } = useSelector((state) => state.users);

  const chatUser = users.find(u => u._id === userId);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (userId) {
      dispatch(fetchMessages(userId));
    }
  }, [dispatch, userId, token, navigate]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      dispatch(sendMessage({ receiver: userId, content: messageText.trim() }));
      setMessageText('');
    }
  };

  if (!user || !chatUser) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <button onClick={() => navigate('/feed')} className="btn btn-secondary">
              ← Feed
            </button>
            <h1 className="navbar-brand">💬 Chat with {chatUser.name}</h1>
          </div>
        </div>
      </nav>

      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
        <div className="chat-messages" style={{ flex: 1, marginBottom: '2rem' }}>
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message ${message.sender._id === user.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            placeholder="💬 Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="message-input"
          />
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;