import React from 'react';

const Loader = ({ text = 'Analyzing...' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium animate-pulse">{text}</p>
        </div>
    );
};

export default Loader;
