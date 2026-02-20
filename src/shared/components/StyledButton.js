import React from 'react';

const StyledButton = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`w-full bg-[#333] hover:bg-[#444] text-white py-3 px-4 rounded transition-colors ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default StyledButton;
