import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // State to track if dark mode is active
    const [isDarkMode, setIsDarkMode] = useState(false);

    // When the Navbar first loads, check if the user previously selected dark mode
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        }
    }, []);

    // Function to toggle between light and dark themes
    const toggleTheme = () => {
        if (isDarkMode) {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    // Handle user logout and redirect them to the login page
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Inline styles for the Navbar layout, utilizing our CSS variables for the glass effect
    const navStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '60px',
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        zIndex: 1000,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
    };

    const linkContainerStyle = {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
    };

    const themeButtonStyle = {
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        color: 'var(--text-color)'
    };

    return (
        <nav style={navStyle}>
            {/* Logo / Brand Name */}
            <div>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', textDecoration: 'none' }}>
                    SecureAuth
                </Link>
            </div>

            {/* Navigation Links */}
            <div style={linkContainerStyle}>
                {/* Dark Mode Toggle Button */}
                <button onClick={toggleTheme} style={themeButtonStyle} aria-label="Toggle Dark Mode">
                    {isDarkMode ? '☀️' : '🌙'}
                </button>

                {/* Conditional Rendering based on Authentication State */}
                {user ? (
                    <>
                        <Link to="/dashboard" className="link">Dashboard</Link>
                        <Link to="/profile" className="link">Profile</Link>
                        
                        {/* Only show Admin Panel link if the user has the 'Admin' role */}
                        {user.role === 'Admin' && (
                            <Link to="/admin" className="link" style={{ color: 'var(--danger-color)' }}>
                                Admin Panel
                            </Link>
                        )}
                        
                        <button onClick={handleLogout} className="btn-animated btn-danger" style={{ padding: '0.4rem 1rem', width: 'auto' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="link">Login</Link>
                        <Link to="/register" className="btn-animated" style={{ textDecoration: 'none', padding: '0.4rem 1rem', display: 'inline-block' }}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;