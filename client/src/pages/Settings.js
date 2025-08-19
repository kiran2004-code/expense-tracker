// src/pages/Settings.js
import React from 'react';
import { Sun, Moon, SunMoon, ArrowLeft } from 'lucide-react';

function Settings({ onBack, onToggleDarkMode, currentTheme }) {
  const isDark = currentTheme === 'dark';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mt-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <SunMoon size={22} /> Settings
        </h2>
        <button
          onClick={onBack}
          className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-base font-medium flex items-center gap-2">
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
          Dark Mode
        </span>

        <div
          onClick={onToggleDarkMode}
          className="w-14 h-8 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full px-1 cursor-pointer transition-colors duration-300"
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
              isDark ? 'translate-x-6' : ''
            }`}
          ></div>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
        {isDark ? 'Dark Mode On' : 'Light Mode On'}
      </p>
    </div>
  );
}

export default Settings;
