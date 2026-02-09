import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const UploadCard = ({ onUpload, isLoading }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndUpload(e.target.files[0]);
        }
    };

    const validateAndUpload = (file) => {
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'application/rtf',
            'application/vnd.oasis.opendocument.text',
            'image/png',
            'image/jpeg',
            'image/jpg'
        ];

        // 10MB limit
        const maxSize = 10 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            alert('Supported formats: PDF, DOCX, TXT, RTF, ODT, PNG, JPG');
            return;
        }

        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return;
        }

        onUpload(file);
    };

    return (
        <Card className="max-w-xl mx-auto">
            <div
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Drop your resume here</h3>
                    <p className="text-gray-500 mb-6">PDF, DOCX, TXT, or Image (Max 10MB)</p>
                </div>

                <label className="relative inline-block">
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.doc,.txt,.rtf,.odt,.png,.jpg,.jpeg"
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Button variant="primary" as="span" className="cursor-pointer">
                        Select File
                    </Button>
                </label>

                {dragActive && (
                    <div className="absolute inset-0 w-full h-full bg-blue-50 opacity-50 rounded-xl pointer-events-none"></div>
                )}
            </div>
        </Card>
    );
};

export default UploadCard;
