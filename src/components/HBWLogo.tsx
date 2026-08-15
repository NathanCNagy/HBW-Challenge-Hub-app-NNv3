import React from 'react';

interface HBWLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

export default function HBWLogo({ className = '', size = 'md', theme = 'light' }: HBWLogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-4 h-4', text: 'text-sm' },
    md: { icon: 'w-5 h-5', text: 'text-base' },
    lg: { icon: 'w-7 h-7', text: 'text-xl' }
  }[size];

  const textColor = theme === 'light' ? 'text-[#1C1C1E]' : 'text-white';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Circle divided down the middle */}
      <svg 
        className={`${sizeClasses.icon} shrink-0`} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left semi-circle: vibrant blue */}
        <path 
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22V2Z" 
          fill="#0080FF" 
        />
        {/* Right semi-circle: light blue */}
        <path 
          d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22V2Z" 
          fill="#3892FF" 
        />
      </svg>
      <span className={`font-sans font-extrabold tracking-tight ${sizeClasses.text} ${textColor}`}>
        HBW
      </span>
    </div>
  );
}
