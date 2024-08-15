
import React, { useState } from 'react';

const ProfileSettings = () => {
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState('');

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="bg-gray-900 shadow-md rounded-md p-4 mb-4 border border-gray-700">
      <h3 className="text-md font-semibold mb-2">Profile Settings</h3>
      <p>Manage your profile information here.</p>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Username: </label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="w-full p-2 rounded-md bg-gray-800 text-white"
        />
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Email: </label>
        <label className="block text-sm font-medium mb-1">{email}</label>
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Profile Picture: </label>
        <input 
          type="file" 
          onChange={handleProfilePictureChange} 
          className="w-full p-2 rounded-md bg-gray-800 text-white"
        />
        {profilePicture && (
          <img src={profilePicture} alt="Profile" className="mt-2 w-24 h-24 rounded-full object-cover" />
        )}
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Bio: </label>
        <textarea 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
          className="w-full p-2 rounded-md bg-gray-800 text-white"
        />
      </div>

      <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Save Changes</button>
    </div>
  );
};

export default ProfileSettings;
