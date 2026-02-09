import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const ScoreDisplay = ({ score, onExport, analysisId }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Pretty solid ngl';
        if (score >= 60) return 'Mid but fixable';
        return 'Needs serious work fr';
    };

    return (
        <Card className="text-center p-8 bg-white/90 backdrop-blur-sm relative">
            <div className={`text-6xl font-black mb-2 tracking-tighter ${getScoreColor(score)}`}>
                {score}%
            </div>
            <div className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-2">
                Resume Match Score
            </div>
            <div className="text-xl font-medium text-gray-800 mb-6">
                {getScoreLabel(score)}
            </div>

            {onExport && (
                <div className="flex justify-center">
                    <Button onClick={() => onExport(analysisId)} variant="outline" className="text-sm px-4 py-1 flex items-center gap-2">
                        <span>📄</span> Download Report (PDF)
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default ScoreDisplay;
