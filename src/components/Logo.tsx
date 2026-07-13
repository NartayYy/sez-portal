import React, { useState } from 'react';

export const MinistryLogo = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 select-none cursor-pointer group">
      {!imageError ? (
        <img 
          src="/2.4.png" 
          alt="Логотип Министерства" 
          className="h-9 w-auto object-contain drop-shadow-sm"
          onError={(e) => {
            if (e.currentTarget.src.includes('2.4.png')) {
              e.currentTarget.src = '/2,4.png';
            } else {
              setImageError(true);
            }
          }}
        />
      ) : (
        <div className="relative flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-br from-blue-600 to-indigo-500 shadow-[0_4px_14px_rgba(37,99,235,0.3)] shrink-0">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.9" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};
