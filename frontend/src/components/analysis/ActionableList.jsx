import React from 'react';
import Card from '../common/Card';

const ActionableList = ({ fixes }) => {
    return (
        <Card className="p-8 bg-white/90 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 text-xl">🎯</span>
                Action Items
            </h3>
            <p className="text-gray-500 mb-8 font-medium">
                Here's what you actually need to fix (no cap):
            </p>

            <div className="space-y-6">
                {fixes.map((fix, index) => (
                    <div key={index} className="flex group">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-4 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                            {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="text-gray-800 font-medium text-lg mb-1">{fix.description}</p>
                            {fix.example && (
                                <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 italic text-gray-600 text-sm">
                                    <span className="font-bold text-gray-400 not-italic mr-2">Ex:</span> {fix.example}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ActionableList;
