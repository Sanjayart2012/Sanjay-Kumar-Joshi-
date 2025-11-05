
import React from 'react';
export const MotherboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="12" x2="12" y2="12"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="16" x2="6" y2="16"></line>
    <line x1="18" y1="16" x2="22" y2="16"></line>
    <line x1="2" y1="8" x2="6" y2="8"></line>
    <line x1="18" y1="8" x2="22" y2="8"></line>
    <rect x="10" y="10" width="4" height="4"></rect>
  </svg>
);
