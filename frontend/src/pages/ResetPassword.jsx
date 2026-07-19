import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    // 1. Extract the token from the URL parameters
    const { token } = useParams();
    const navigate = useNavigate();

    // 2. Component State
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { password, confirmPassword } = formData;

    // Handle Input Changes
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // Handle Form Submission
    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            // Send the token (from URL) and the new password to the backend
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                resetToken: token,
                newPassword: password
            });
            
            setMessage(response.data.message);
            
            // Clear the form for security
            setFormData({ password: '', confirmPassword: '' });

            // Automatically redirect the user to login after 3 seconds so they can use their new password
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card">
            <h2 style={{ marginBottom: '0.5rem' }}>Set New Password</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
                Please enter your new password below.
            </p>
            
            {/* Display Error Message */}
            {error && (
                <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            {/* Display Success Message */}
            {message && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid #10b981' }}>
                    {message}
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-color)' }}>
                        Redirecting to login...
                    </p>
                </div>
            )}

            {/* Hide the form if the reset was successful */}
            {!message && (
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password" 
                            className="input-field" 
                            value={password} 
                            onChange={onChange} 
                            required 
                            placeholder="Min 8 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword"
                            name="confirmPassword" 
                            className="input-field" 
                            value={confirmPassword} 
                            onChange={onChange} 
                            required 
                            placeholder="Repeat new password"
                        />
                    </div>

                    <button type="submit" className="btn-animated mt-4" disabled={loading}>
                        {loading ? 'Updating Password...' : 'Reset Password'}
                    </button>
                </form>
            )}

            <div className="text-center mt-4">
                <Link to="/login" className="link">Back to Login</Link>
            </div>
        </div>
    );
};

export default ResetPassword;