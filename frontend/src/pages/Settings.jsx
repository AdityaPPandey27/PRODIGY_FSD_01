import { useState, useEffect } from 'react';

const Settings = () => {
    // 1. Component State for Preferences
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);

    // 2. Load preferences on initial render
    useEffect(() => {
        // Check theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }

        // Check notification preferences (default to true if not set)
        const savedNotifications = localStorage.getItem('emailNotifications');
        if (savedNotifications !== null) {
            setEmailNotifications(JSON.parse(savedNotifications));
        }
    }, []);

    // 3. Toggle Handlers
    const handleThemeToggle = () => {
        if (isDarkMode) {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const handleNotificationToggle = () => {
        const newValue = !emailNotifications;
        setEmailNotifications(newValue);
        localStorage.setItem('emailNotifications', JSON.stringify(newValue));
    };

    // Helper style for the modern toggle switches
    const getToggleStyle = (isActive) => ({
        width: '50px',
        height: '26px',
        backgroundColor: isActive ? 'var(--primary-color)' : 'var(--input-border)',
        borderRadius: '50px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        border: 'none',
        outline: 'none'
    });

    const getToggleCircleStyle = (isActive) => ({
        width: '20px',
        height: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        position: 'absolute',
        top: '3px',
        left: isActive ? '27px' : '3px',
        transition: 'left 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    });

    return (
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                Application Settings
            </h2>

            {/* Theme Preference Setting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Appearance</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Toggle between Light and Dark mode.</p>
                </div>
                <button onClick={handleThemeToggle} style={getToggleStyle(isDarkMode)} aria-label="Toggle Theme">
                    <div style={getToggleCircleStyle(isDarkMode)}></div>
                </button>
            </div>

            {/* Notification Preference Setting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Notifications</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Receive security alerts and updates.</p>
                </div>
                <button onClick={handleNotificationToggle} style={getToggleStyle(emailNotifications)} aria-label="Toggle Notifications">
                    <div style={getToggleCircleStyle(emailNotifications)}></div>
                </button>
            </div>

            {/* Information Section */}
            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                    <strong>Note:</strong> These preferences are currently saved locally in your browser. 
                    If you log in from a different device, you may need to set them again.
                </p>
            </div>
        </div>
    );
};

export default Settings;