import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const ErrorDisplay = ({ error, onRetry }) => {
    const getErrorMessage = (errorName) => {
        // Simple error mapping
        return {
            title: 'Something went wrong',
            message: errorName || 'Unknown error occurred',
            suggestions: ['Try again later', 'Check your file format']
        };
    };

    const errorInfo = getErrorMessage(error); // rudimentary for now

    return (
        <Card className="max-w-xl mx-auto border-red-100 bg-red-50">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">❌</span>
                </div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">
                    {errorInfo.title}
                </h2>
                <p className="text-red-600">{errorInfo.message}</p>
            </div>

            <div className="bg-white p-6 rounded-xl mb-8">
                <p className="font-bold text-gray-700 mb-3 flex items-center">
                    💡 Suggestions:
                </p>
                <ul className="space-y-2 text-gray-600">
                    {errorInfo.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-center">
                <Button onClick={onRetry} variant="primary">
                    Try Another File
                </Button>
            </div>
        </Card>
    );
};

export default ErrorDisplay;
