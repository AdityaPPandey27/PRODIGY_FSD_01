import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
    const { user: currentUser } = useContext(AuthContext);
    
    // State management for users and UI feedback
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch users when the component loads or when the search query changes
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to fetch users from the backend
    const fetchUsers = async (search = '') => {
        try {
            setLoading(true);
            setError('');
            // Append the search keyword to the URL if one exists
            const response = await axios.get(`http://localhost:5000/api/admin/users?search=${search}`);
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Handle the search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(searchQuery);
    };

    // Function to delete a user
    const handleDelete = async (id) => {
        // Prevent admins from accidentally deleting their own account
        if (id === currentUser._id) {
            setError('You cannot delete your own account.');
            return;
        }

        // Standard browser confirmation dialog to prevent accidental clicks
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            setSuccessMessage('User deleted successfully');
            
            // Remove the deleted user from the local state so the UI updates instantly
            setUsers(users.filter((u) => u._id !== id));
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Function to change a user's role
    const handleRoleChange = async (id, currentRole) => {
        if (id === currentUser._id && currentRole === 'Admin') {
            setError('You cannot downgrade your own admin account.');
            return;
        }

        const newRole = currentRole === 'Admin' ? 'User' : 'Admin';

        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole });
            setSuccessMessage(`User role updated to ${newRole}`);
            
            // Update the user's role in local state to refresh the UI instantly
            setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update role');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Styles for the table layout
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem',
        textAlign: 'left'
    };

    const thStyle = {
        borderBottom: '2px solid var(--card-border)',
        padding: '1rem',
        color: 'var(--primary-color)',
        fontWeight: '600'
    };

    const tdStyle = {
        padding: '1rem',
        borderBottom: '1px solid var(--card-border)'
    };

    return (
        <div className="glass-card" style={{ maxWidth: '900px', width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Admin Dashboard - User Management
            </h2>

            {/* Error and Success Notifications */}
            {error && <div className="error-text" style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
            {successMessage && <div style={{ color: '#10b981', padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>{successMessage}</div>}

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                    type="text" 
                    placeholder="Search users by name or email..." 
                    className="input-field" 
                    style={{ flex: 1 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn-animated" style={{ width: '120px', padding: '0' }}>
                    Search
                </button>
            </form>

            {/* Users Table */}
            {loading ? (
                <div className="text-center" style={{ padding: '2rem' }}>Loading users...</div>
            ) : users.length === 0 ? (
                <div className="text-center" style={{ padding: '2rem', opacity: 0.7 }}>No users found matching your search.</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Role</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td style={tdStyle}>{u.name}</td>
                                    <td style={tdStyle}>{u.email}</td>
                                    <td style={tdStyle}>
                                        <span style={{ 
                                            padding: '0.25rem 0.75rem', 
                                            borderRadius: '50px', 
                                            fontSize: '0.85rem',
                                            backgroundColor: u.role === 'Admin' ? 'rgba(99, 102, 241, 0.2)' : 'var(--input-bg)',
                                            color: u.role === 'Admin' ? 'var(--primary-hover)' : 'var(--text-color)'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => handleRoleChange(u._id, u.role)}
                                                className="btn-animated"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
                                            >
                                                Make {u.role === 'Admin' ? 'User' : 'Admin'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u._id)}
                                                className="btn-animated btn-danger"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
                                                disabled={u._id === currentUser._id} // Disable delete button for self
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;