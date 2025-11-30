import React from 'react';

export default function TopToggleIcon({ open = false, size = 24, className = '' }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9L9 15" />
        <path d="M9 9l6 6" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="6" rx="2" />
      <rect x="7" y="13" width="10" height="6" rx="2" />
      <circle cx="18.5" cy="8.5" r="1.2" />
    </svg>
  );
}
