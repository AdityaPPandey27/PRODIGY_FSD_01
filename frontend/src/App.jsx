import { Routes, Route } from 'react-router-dom';

// ==========================================
// Component Imports
// (We will create all of these in the upcoming steps)
// ==========================================
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// ==========================================
// Page Imports
// ==========================================
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    // The wrapper div provides the base styling for dark mode and light mode
    <div className="app-container">
      {/* Navbar sits outside the Routes so it always displays on every page */}
      <Navbar />
      
      {/* The main container holds the changing page content */}
      <main className="main-content">
        <Routes>
          {/* Public Routes - Anyone can access these */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Note the :token parameter in the URL. This allows us to grab the JWT from the URL string */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes - Only logged-in users can access these */}
          {/* We wrap these inside a ProtectedRoute component that will check AuthContext first */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Admin Routes - Only logged-in Admins can access these */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all Route - If the user types a URL that doesn't exist, show the 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;