// src/pages/Profile.js
import React from 'react';
import { ArrowLeft, User, Mail } from 'lucide-react';

function Profile({ onBack }) {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-white flex items-center gap-2">
          <User size={20} /> Profile
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="text-gray-500 dark:text-gray-300" size={18} />
          <p className="font-medium text-lg text-gray-900 dark:text-white">{user?.name || 'N/A'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="text-gray-500 dark:text-gray-300" size={18} />
          <p className="font-medium text-lg text-gray-900 dark:text-white">{user?.email || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
