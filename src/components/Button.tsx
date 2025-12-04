import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  title?: string;
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  title,
  className = ''
}: ButtonProps) {
  const variantClass = `button-${variant}`;
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`button ${variantClass} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}
