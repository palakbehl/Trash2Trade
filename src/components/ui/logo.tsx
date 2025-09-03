import React from 'react';
import { ArrowRightLeft, Recycle } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-10 w-10', 
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon with Enhanced Trade Vectors */}
      <div className="relative group">
        {/* Glowing background effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-br from-primary/20 to-success/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300`}></div>
        
        {/* Main recycling symbol with enhanced styling */}
        <Recycle className={`${sizeClasses[size]} text-primary relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300`} />
        
        {/* Trade arrows overlay with better positioning */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <ArrowRightLeft className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-8 w-8'} text-success opacity-90 transform rotate-12 drop-shadow-sm group-hover:rotate-45 transition-transform duration-500`} />
        </div>
        
        {/* Enhanced trade indicators */}
        <div className="absolute -top-1 -right-1 z-30">
          <div className="w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse shadow-lg"></div>
        </div>
        <div className="absolute -bottom-1 -left-1 z-30">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-secondary to-success rounded-full animate-ping shadow-md"></div>
        </div>
        
        {/* Additional sparkle effects */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></div>
        </div>
        <div className="absolute bottom-0 right-0">
          <div className="w-1 h-1 bg-success rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
      
      {/* Enhanced Text with better styling */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-primary via-success to-secondary bg-clip-text text-transparent drop-shadow-sm tracking-tight`}>
            Trash2Trade
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;