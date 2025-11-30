import React from 'react';

export default function AttendanceIcon({ size = 20, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="10" r="3.2" />
      <path d="M4.5 20c0-3.6 3.9-6.5 7.5-6.5s7.5 2.9 7.5 6.5" />
      <path d="M16.2 8.2l1.8 1.8 3-3" />
      <path d="M19 7c0 .6-.2 1.1-.6 1.6" opacity="0.0" />
    </svg>
  );
}
