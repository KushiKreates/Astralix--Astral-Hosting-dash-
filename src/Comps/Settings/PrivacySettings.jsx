
import React, { useState } from 'react';

const PrivacySettings = () => {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [searchEngineIndexing, setSearchEngineIndexing] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [adPersonalization, setAdPersonalization] = useState(true);

  return (
    <div className="settings-panel bg-gray-900 shadow-md rounded-md p-4 mb-4 border border-gray-700">
      <h3 className="text-md font-semibold mb-2">Privacy Settings</h3>
      <p>Manage your privacy preferences here.</p>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Profile Visibility</label>
        <input type="checkbox" checked={profileVisibility} onChange={() => setProfileVisibility(!profileVisibility)} />
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Search Engine Indexing</label>
        <input type="checkbox" checked={searchEngineIndexing} onChange={() => setSearchEngineIndexing(!searchEngineIndexing)} />
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Data Sharing with Third Parties</label>
        <input type="checkbox" checked={dataSharing} onChange={() => setDataSharing(!dataSharing)} />
      </div>
      
      <div className="settings-panel mb-4">
        <label className="block text-sm font-medium mb-1">Ad Personalization</label>
        <input type="checkbox" checked={adPersonalization} onChange={() => setAdPersonalization(!adPersonalization)} />
      </div>
    </div>
  );
};

export default PrivacySettings;
