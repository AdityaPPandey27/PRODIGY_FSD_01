import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    // Initialize user state by checking if there's a saved user in localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Automatically attach the JWT token to all Axios requests if the user is logged in
    useEffect(() => {
        if (user && user.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [user]);

    // Login Function
    const login = async (email, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { 
            email, 
            password 
        });
        
        // Save to state and localStorage
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
    };

    // Register Function
    const register = async (name, email, password, confirmPassword) => {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name, 
            email, 
            password, 
            confirmPassword
        });
        
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
    };

    // Logout Function
    const logout = async () => {
        try {
            // Tell the backend we are logging out (optional but good practice)
            await axios.post('http://localhost:5000/api/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Regardless of backend response, clear the frontend state
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    // The Provider component wraps around our app and passes these values down
    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;