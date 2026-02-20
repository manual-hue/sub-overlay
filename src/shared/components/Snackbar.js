import React, { useEffect } from 'react';

const Snackbar = ({ open, message, severity, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (open && duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration, onClose]);

    if (!open) return null;

    const colorMap = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
        warning: 'bg-yellow-600',
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
            <div className={`${colorMap[severity] || colorMap.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[280px]`}>
                <span className="flex-1">{message}</span>
                <button onClick={onClose} className="text-white/80 hover:text-white ml-2 text-lg leading-none">&times;</button>
            </div>
        </div>
    );
};

export default Snackbar;
