import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Bandmates from './pages/Bandmates';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Navigate to="/feed" />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/discover" element={<Dashboard />} />
            <Route path="/profile/:userId?" element={<Profile />} />
            <Route path="/bandmates" element={<Bandmates />} />
            <Route path="/chat/:userId" element={<Chat />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;