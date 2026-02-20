import React from 'react';

const StyledTextField = ({ label, className = '', ...props }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="block text-sm text-gray-500 mb-1">{label}</label>}
            <input
                className="w-full bg-transparent border border-gray-500 hover:border-white text-white rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                {...props}
            />
        </div>
    );
};

export default StyledTextField;
