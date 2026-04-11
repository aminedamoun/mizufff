import React from 'react';

interface AppLogoProps {
  src?: string;
  text?: string;
  iconName?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const AppLogo: React.FC<AppLogoProps> = ({
  size = 64,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`flex items-center cursor-pointer select-none ${className}`}
      onClick={onClick}
      style={{ height: size }}
    >
      <img
        src="/assets/images/website_logo-1771574741130.webp"
        alt="Mizu Restaurant Logo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
};

export default AppLogo;
