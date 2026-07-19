import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    // 1. Access the global user state
    const { user, setUser } = useContext(AuthContext);

    // 2. State for the Profile Update Form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [profileStatus, setProfileStatus] = useState({ error: '', success: '', loading: false });

    // 3. State for the Password Change Form
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '', loading: false });

    // 4. Handle Input Changes
    const onProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const onPasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    // 5. Submit Profile Update
    const onProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileStatus({ error: '', success: '', loading: true });

        try {
            // Because AuthContext automatically sets the Authorization header, we don't need to manually pass the token here
            const response = await axios.put('http://localhost:5000/api/user/profile', profileData);
            
            // The backend returns the updated user data (but no new token is needed)
            // We must merge this new data with our existing token in state and localStorage
            const updatedUser = { ...user, name: response.data.name, email: response.data.email };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setProfileStatus({ error: '', success: 'Profile updated successfully!', loading: false });
        } catch (err) {
            setProfileStatus({ 
                error: err.response?.data?.message || 'Failed to update profile', 
                success: '', 
                loading: false 
            });
        }
    };

    // 6. Submit Password Change
    const onPasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordStatus({ error: '', success: '', loading: true });

        // Client-side validation: Check if new passwords match
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordStatus({ error: 'New passwords do not match', success: '', loading: false });
            return;
        }

        try {
            await axios.put('http://localhost:5000/api/user/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            
            setPasswordStatus({ error: '', success: 'Password changed successfully!', loading: false });
            // Clear the password form for security after a successful change
            setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); 
        } catch (err) {
            setPasswordStatus({ 
                error: err.response?.data?.message || 'Failed to change password', 
                success: '', 
                loading: false 
            });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '500px' }}>
            
            {/* --- PROFILE UPDATE SECTION --- */}
            <div className="glass-card" style={{ maxWidth: '100%' }}>
                <h2 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    Update Profile
                </h2>

                {profileStatus.error && <div className="error-text" style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', marginBottom: '1rem' }}>{profileStatus.error}</div>}
                {profileStatus.success && <div style={{ color: '#10b981', padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', marginBottom: '1rem' }}>{profileStatus.success}</div>}

                <form onSubmit={onProfileSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" className="input-field" value={profileData.name} onChange={onProfileChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" className="input-field" value={profileData.email} onChange={onProfileChange} required />
                    </div>
                    <button type="submit" className="btn-animated mt-4" disabled={profileStatus.loading}>
                        {profileStatus.loading ? 'Updating...' : 'Save Profile Changes'}
                    </button>
                </form>
            </div>

            {/* --- PASSWORD CHANGE SECTION --- */}
            <div className="glass-card" style={{ maxWidth: '100%' }}>
                <h2 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    Change Password
                </h2>

                {passwordStatus.error && <div className="error-text" style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', marginBottom: '1rem' }}>{passwordStatus.error}</div>}
                {passwordStatus.success && <div style={{ color: '#10b981', padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', marginBottom: '1rem' }}>{passwordStatus.success}</div>}

                <form onSubmit={onPasswordSubmit}>
                    <div className="form-group">
                        <label htmlFor="oldPassword">Current Password</label>
                        <input type="password" id="oldPassword" name="oldPassword" className="input-field" value={passwordData.oldPassword} onChange={onPasswordChange} required placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input type="password" id="newPassword" name="newPassword" className="input-field" value={passwordData.newPassword} onChange={onPasswordChange} required placeholder="Min 8 characters" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input type="password" id="confirmNewPassword" name="confirmNewPassword" className="input-field" value={passwordData.confirmNewPassword} onChange={onPasswordChange} required placeholder="Repeat new password" />
                    </div>
                    <button type="submit" className="btn-animated mt-4" style={{ backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }} disabled={passwordStatus.loading}>
                        {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default Profile;