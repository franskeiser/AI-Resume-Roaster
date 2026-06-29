import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

// Turn a raw error (string or Error) into a friendly, actionable message
// while keeping the original text available under "Technical details".
const getErrorInfo = (raw) => {
    const message = typeof raw === 'string' ? raw : (raw && raw.message) || '';
    const lower = message.toLowerCase();

    if (lower.includes('429') || lower.includes('quota') || lower.includes('resource_exhausted') || lower.includes('rate limit')) {
        return {
            title: 'AI usage limit reached',
            message: 'The AI service has hit its usage limit for now.',
            suggestions: ['Wait a minute and try again', 'This is a temporary limit, not your file'],
        };
    }
    if (lower.includes('503') || lower.includes('high demand') || lower.includes('unavailable') || lower.includes('overload')) {
        return {
            title: 'The AI is a bit busy right now',
            message: 'Our AI model is experiencing high demand. This is usually temporary.',
            suggestions: ['Wait a few seconds and try again', 'Your file was fine — no changes needed'],
        };
    }
    if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('load failed') || lower.includes('cors')) {
        return {
            title: 'Could not reach the server',
            message: 'We were unable to connect to the Resume Roaster service.',
            suggestions: ['Check your internet connection', 'The server may be waking up — try again in a moment'],
        };
    }
    if (lower.includes('413') || lower.includes('too large') || lower.includes('maximum upload size') || lower.includes('exceeds')) {
        return {
            title: 'That file is too large',
            message: 'Your resume exceeds the 10MB upload limit.',
            suggestions: ['Compress the file or export a smaller PDF', 'Remove large embedded images'],
        };
    }
    if (lower.includes('unsupported') || lower.includes('unreadable') || lower.includes('extract') || lower.includes('empty')) {
        return {
            title: 'We could not read that file',
            message: 'The file could not be processed. It may be empty, corrupted, or an unsupported format.',
            suggestions: ['Use a text-based PDF, DOCX, or TXT', 'Avoid scanned images where possible', 'Make sure the file is not empty'],
        };
    }
    return {
        title: 'Something went wrong',
        message: 'We hit an unexpected error while roasting your resume.',
        suggestions: ['Try again', 'Try a different file format'],
    };
};

const ErrorDisplay = ({ error, onRetry }) => {
    const info = getErrorInfo(error);

    return (
        <Card className="max-w-xl mx-auto border-red-100 bg-red-50">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">❌</span>
                </div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">
                    {info.title}
                </h2>
                <p className="text-red-600">{info.message}</p>
            </div>

            <div className="bg-white p-6 rounded-xl mb-6">
                <p className="font-bold text-gray-700 mb-3 flex items-center">
                    💡 Suggestions:
                </p>
                <ul className="space-y-2 text-gray-600">
                    {info.suggestions.map((suggestion, index) => (
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
