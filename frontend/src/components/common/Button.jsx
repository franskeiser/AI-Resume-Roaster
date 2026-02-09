import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) => {
    const baseStyles = "px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
        outline: "border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
