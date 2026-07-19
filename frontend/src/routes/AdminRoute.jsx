import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = () => {
    // Access the global user state from our AuthContext
    const { user } = useContext(AuthContext);

    // Scenario 1: The user isn't logged in at all. 
    // Redirect them to the login page immediately.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Scenario 2: The user IS logged in, but they are just a regular 'User'.
    // We redirect them to their standard dashboard so they don't see a blank page or an error.
    if (user.role !== 'Admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // Scenario 3: The user is logged in AND is an 'Admin'.
    // Grant them access to the requested admin page.
    return <Outlet />;
};

export default AdminRoute;