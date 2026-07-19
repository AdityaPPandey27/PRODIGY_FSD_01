import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    // 1. Component State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, confirmPassword } = formData;
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // 2. Handle Input Changes
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // 3. Handle Form Submission
    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation: Password match check
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Attempt to register
            await register(name, email, password, confirmPassword);
            // On success, redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            // Extract backend error message
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card">
            <h2>Create Account</h2>
            
            {error && (
                <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name" 
                        className="input-field" 
                        value={name} 
                        onChange={onChange} 
                        required 
                        placeholder="John Doe"
                    />
                </div>

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
                        placeholder="john@example.com"
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
                        placeholder="Min 8 characters"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword"
                        name="confirmPassword" 
                        className="input-field" 
                        value={confirmPassword} 
                        onChange={onChange} 
                        required 
                        placeholder="Repeat password"
                    />
                </div>

                <button type="submit" className="btn-animated mt-4" disabled={loading}>
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <div className="text-center mt-4">
                <p>Already have an account? <Link to="/login" className="link">Login here</Link></p>
            </div>
        </div>
    );
};

export default Register;