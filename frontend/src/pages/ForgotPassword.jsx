import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    // Component State
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // For testing purposes: we will store the generated token here to show it on screen
    const [resetToken, setResetToken] = useState('');

    // Handle Form Submission
    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setResetToken('');
        setLoading(true);

        try {
            // Send the email to our backend to request a password reset
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            
            // Set the success message
            setMessage(response.data.message);
            
            // For testing: capture the token returned by the backend
            if (response.data.resetToken) {
                setResetToken(response.data.resetToken);
            }
            
            // Clear the input field
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card">
            <h2 style={{ marginBottom: '0.5rem' }}>Forgot Password</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
                Enter your email address and we will generate a password reset token for you.
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
                </div>
            )}

            {/* Display the Token (For development testing only!) */}
            {resetToken && (
                <div style={{ backgroundColor: 'var(--input-bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', wordBreak: 'break-all', border: '1px dashed var(--primary-color)' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-color)', fontSize: '0.85rem' }}>TESTING ONLY - YOUR RESET TOKEN:</p>
                    <code style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>{resetToken}</code>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                        Copy this token and go to the <Link to={`/reset-password/${resetToken}`} className="link">Reset Password Page</Link>
                    </p>
                </div>
            )}

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email" 
                        className="input-field" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="Enter your registered email"
                    />
                </div>

                <button type="submit" className="btn-animated mt-4" disabled={loading}>
                    {loading ? 'Sending Request...' : 'Get Reset Token'}
                </button>
            </form>

            <div className="text-center mt-4">
                <p>Remember your password? <Link to="/login" className="link">Back to Login</Link></p>
            </div>
        </div>
    );
};

export default ForgotPassword;