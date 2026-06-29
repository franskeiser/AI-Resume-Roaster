import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadCard from './components/upload/UploadCard';
import ScoreDisplay from './components/analysis/ScoreDisplay';
import AnalysisSummary from './components/analysis/AnalysisSummary';
import ActionableList from './components/analysis/ActionableList';
import ErrorDisplay from './components/common/ErrorDisplay';
import Loader from './components/common/Loader';
import { analyzeResume, exportAnalysisPdf } from './services/api';

function HomePage() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeResume(file);
            setAnalysis(result);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to analyze resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (analysis && analysis.id) {
            try {
                await exportAnalysisPdf(analysis.id);
            } catch (e) {
                alert("Failed to download PDF");
            }
        }
    };

    const handleRetry = () => {
        setAnalysis(null);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">
                    Resume Roaster
                </h1>
                <p className="text-xl text-gray-600 font-light">
                    AI-powered, no-BS resume feedback for tech professionals.
                </p>
            </header>

            <main>
                {loading ? (
                    <Loader text="Roasting your resume..." />
                ) : error ? (
                    <ErrorDisplay error={error} onRetry={handleRetry} />
                ) : analysis ? (
                    <div className="space-y-8 animate-fade-in-up">
                        <ScoreDisplay
                            score={analysis.overallScore}
                            onExport={handleExport}
                            analysisId={analysis.id}
                        />
                        <AnalysisSummary
                            summary={analysis.summary}
                            sections={analysis.sectionFeedback}
                        />
                        <ActionableList fixes={analysis.actionableItems} />
                        <div className="text-center mt-12">
                            <button
                                onClick={handleRetry}
                                className="text-gray-500 hover:text-gray-800 underline text-sm transition-colors"
                            >
                                Roast another resume
                            </button>
                        </div>
                    </div>
                ) : (
                    <UploadCard onUpload={handleUpload} isLoading={loading} />
                )}
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 font-sans">
                <nav className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link to="/" className="font-black text-2xl tracking-tighter">Resume Roaster</Link>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                                        Roast New
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="py-12 px-4 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
