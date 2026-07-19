import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
    // Access the global user state from our AuthContext
    const { user } = useContext(AuthContext);

    // If the user exists (is logged in), render the child components using <Outlet />
    // If the user is null, immediately redirect them to the /login page
    // We use "replace" to overwrite the current history entry so they can't click "Back" to bypass it
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;