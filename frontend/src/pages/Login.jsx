import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    // 1. Component State
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Destructure for easier use in the form
    const { email, password } = formData;

    // Bring in the login function from our global AuthContext and navigation hook
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 2. Handle Input Changes
    // This dynamically updates the correct state piece based on the input's "name" attribute
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // 3. Handle Form Submission
    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent the default HTML form submission (page refresh)
        setError('');       // Clear any previous errors
        setLoading(true);   // Start the loading spinner/text

        try {
            // Attempt to log the user in using the context function
            await login(email, password);
            
            // If successful, redirect them to the dashboard
            navigate('/dashboard');
        } catch (err) {
            // If it fails, extract the error message sent from our Node.js backend
            const message = err.response?.data?.message || 'Failed to login. Please try again.';
            setError(message);
        } finally {
            // Whether it succeeded or failed, stop the loading state
            setLoading(false);
        }
    };

    return (
        <div className="glass-card">
            <h2>Welcome Back</h2>
            
            {/* Display error message conditionally */}
            {error && (
                <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {error}
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
                        onChange={onChange} 
                        required 
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password" 
                        className="input-field" 
                        value={password} 
                        onChange={onChange} 
                        required 
                        placeholder="Enter your password"
                    />
                </div>

                {/* Disable the button while loading to prevent multiple API calls */}
                <button type="submit" className="btn-animated mt-4" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="text-center mt-4">
                <p>Don't have an account? <Link to="/register" className="link">Register here</Link></p>
                <p style={{ marginTop: '0.5rem' }}>
                    <Link to="/forgot-password" className="link">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;