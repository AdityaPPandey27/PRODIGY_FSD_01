import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="glass-card text-center" style={{ maxWidth: '500px' }}>
            {/* Massive 404 text to make it obvious */}
            <h1 style={{ 
                fontSize: '5rem', 
                fontWeight: 'bold', 
                color: 'var(--primary-color)', 
                lineHeight: '1',
                marginBottom: '0.5rem' 
            }}>
                404
            </h1>
            
            <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
            
            <p style={{ marginBottom: '2rem', opacity: 0.8, fontSize: '1.1rem' }}>
                Oops! It looks like you've wandered off the map. The page you are looking for doesn't exist or has been moved.
            </p>
            
            {/* Guide them back to the root of the app */}
            <Link 
                to="/" 
                className="btn-animated" 
                style={{ 
                    textDecoration: 'none', 
                    display: 'inline-block', 
                    width: 'auto', 
                    padding: '0.75rem 2rem' 
                }}
            >
                Return to Home
            </Link>
        </div>
    );
};

export default NotFound;