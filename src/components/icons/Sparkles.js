import React from 'react';

const Sparkles = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l1.5 1.5L5 6M19 3l-1.5 1.5L19 6M12 1v6M7 7l5 5 5-5" />
  </svg>
);

export default Sparkles;
