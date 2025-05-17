import React from 'react';
import logo from './logo.png'; // Make sure your logo image is in src/logo.png

function LogoOverlay({ show, mode = 'transition' }) {
  const isSplash = mode === 'splash';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isSplash ? 'bg-[#f7f7f7]' : 'bg-white'
      } ${show ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Logo with shimmer animation over the image (splash only) */}
        <div className={isSplash ? 'relative w-96 h-96' : 'w-28 h-28'}>
          <img
            src={logo}
            alt="Expense Tracker Logo"
           className={`object-contain w-full h-full`}

          />

          {/* White shimmer ON the logo during splash */}
          {isSplash && (
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute w-1/3 h-full bg-white opacity-20 animate-slide-glow" />
            </div>
          )}
        </div>

        {/* Transition animation bar only during page changes */}
        {!isSplash && (
          <div className="w-24 h-1 bg-gray-300 overflow-hidden relative rounded">
            <div className="absolute inset-0 bg-blue-600 animate-slide" />
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoOverlay;
