// Icono personalizado para menú tipo RYA Cobranzas
import React from 'react';

const RyaMenuIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="32" height="32" rx="8" fill="#4e7fa6"/>
    <rect x="10" y="11" width="20" height="5" rx="2" fill="#7eb6d9"/>
    <rect x="10" y="19" width="10" height="4" rx="2" fill="#7eb6d9"/>
    <rect x="22" y="25" width="8" height="3" rx="1.5" fill="#ffe082"/>
    <rect x="10" y="25" width="8" height="3" rx="1.5" fill="#ffe082"/>
  </svg>
);

export default RyaMenuIcon;
