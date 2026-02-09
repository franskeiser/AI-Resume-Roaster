import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';

import { getAllResumes } from '../services/api';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllResumes()
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loader text="Loading history..." />;
    if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Past Roasts</h1>
            {history.length === 0 ? (
                <div className="text-center text-gray-500">
                    No roasts yet. Go roast some resumes!
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {history.map(item => (
                        <Link key={item.id} to={`/roast/${item.id}`} className="block group">
                            <Card className="h-full p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {item.overallScore ? item.overallScore + '%' : 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(item.uploadedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 truncate" title={item.originalFilename}>
                                    {item.originalFilename}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {item.summaryPreview}
                                </p>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
