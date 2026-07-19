import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
    // Bring in the user context to know if someone is already logged in
    const { user } = useContext(AuthContext);

    return (
        <div className="glass-card text-center" style={{ maxWidth: '800px', padding: '3rem 2rem', width: '100%' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Welcome to SecureAuth
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', opacity: 0.8, lineHeight: '1.6' }}>
                A production-ready, full-stack authentication system built with the MERN stack. 
                Featuring Role-Based Access Control, JWT security, and a modern glassmorphism UI.
            </p>

            {/* Dynamic Call to Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {user ? (
                    <Link to="/dashboard" className="btn-animated" style={{ textDecoration: 'none', padding: '0.75rem 2.5rem', width: 'auto' }}>
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="btn-animated" style={{ textDecoration: 'none', padding: '0.75rem 2.5rem', width: 'auto' }}>
                            Login
                        </Link>
                        <Link to="/register" className="btn-animated" style={{ textDecoration: 'none', padding: '0.75rem 2.5rem', width: 'auto', backgroundColor: 'var(--input-border)', color: 'var(--text-color)' }}>
                            Create Account
                        </Link>
                    </>
                )}
            </div>

            {/* Feature Highlights Grid */}
            <div style={{ 
                marginTop: '3.5rem', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem', 
                textAlign: 'left' 
            }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>🔐 Secure</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Advanced JWT authentication and safely encrypted passwords.</p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>👥 Roles</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Granular permissions with built-in Admin and User tiers.</p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>✨ Modern</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Responsive glassmorphism design with Dark Mode support.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;