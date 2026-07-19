import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    // Access the global user state from our context
    const { user } = useContext(AuthContext);

    return (
        <div className="glass-card" style={{ maxWidth: '600px' }}>
            <h2 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                Dashboard
            </h2>
            
            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                    {/* We use the ? (optional chaining) to prevent crashes if user is momentarily undefined */}
                    Welcome back, {user?.name}!
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', opacity: 0.8 }}>
                    You are currently logged in with <strong>{user?.role}</strong> privileges.
                </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <Link to="/profile" className="btn-animated" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
                    View Profile
                </Link>
                <Link to="/settings" className="btn-animated" style={{ textDecoration: 'none', textAlign: 'center', flex: 1, backgroundColor: 'var(--input-border)', color: 'var(--text-color)' }}>
                    Account Settings
                </Link>
            </div>

            {/* Conditional Admin Panel Banner */}
            {/* If the user is an Admin, we display an extra section guiding them to their specialized tools */}
            {user?.role === 'Admin' && (
                <div style={{ 
                    marginTop: '2rem', 
                    padding: '1.5rem', 
                    border: '1px dashed var(--danger-color)', 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(239, 68, 68, 0.05)' 
                }}>
                    <h4 style={{ color: 'var(--danger-color)', marginBottom: '0.5rem' }}>
                        👑 Admin Privileges Active
                    </h4>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        You have full access to view, edit, and manage all users on the platform.
                    </p>
                    <Link to="/admin" className="btn-animated btn-danger" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                        Open Admin Control Panel
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;