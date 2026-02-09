import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScoreDisplay from '../components/analysis/ScoreDisplay';
import AnalysisSummary from '../components/analysis/AnalysisSummary';
import ActionableList from '../components/analysis/ActionableList';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { exportAnalysisPdf, getAnalysis } from '../services/api';

const RoastPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAnalysis(id)
            .then(data => {
                setAnalysis(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleExport = async () => {
        if (analysis && analysis.id) {
            try {
                await exportAnalysisPdf(analysis.id);
            } catch (e) {
                alert("Failed to download PDF");
            }
        }
    };

    if (loading) return <Loader text="Loading roast..." />;
    if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
    if (!analysis) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in-up">
            <button onClick={() => navigate('/history')} className="text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-2">
                ← Back to History
            </button>
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
        </div>
    );
};

export default RoastPage;
