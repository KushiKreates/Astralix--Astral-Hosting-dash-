
import React, { useState } from 'react';

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationVolume, setNotificationVolume] = useState(50);

  return (
    <div className="settings-panel bg-gray-900 shadow-md rounded-md p-4 mb-4 border border-gray-700">
      <h3 className="text-md font-semibold mb-2">Notification Settings</h3>
      <p>Manage your notification preferences here.</p>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Email Notifications</label>
        <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">SMS Notifications</label>
        <input type="checkbox" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Push Notifications</label>
        <input type="checkbox" checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Notification Volume</label>
        <input type="range" min="0" max="100" value={notificationVolume} onChange={(e) => setNotificationVolume(e.target.value)} />
        <span className="block text-sm mt-1">{notificationVolume}%</span>
      </div>
    </div>
  );
};

export default NotificationSettings;
