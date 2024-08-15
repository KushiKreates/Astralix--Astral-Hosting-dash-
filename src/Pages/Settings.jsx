import React from 'react';
import Header from './Header';
import SideBar from './SideBar';
import ProfileSettings from '../Comps/Settings/ProfileSettings';
import NotificationSettings from '../Comps/Settings/NotificationSettings';
import PrivacySettings from '../Comps/Settings/PrivacySettings';

const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <SideBar />
      <main className="flex-1 p-8 bg-gray-800 rounded-tl-lg overflow-y-auto">
        <div className="container mx-auto p-4">
          <Header />
          <div className="bg-gray-900 shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Settings</h2>
            <div className="settings-panel mb-4">
            <ProfileSettings />
            </div>
            <div className="settings-panel mb-4">
            <NotificationSettings />
            </div>
            <div className="settings-panel mb-4">
            <PrivacySettings />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
