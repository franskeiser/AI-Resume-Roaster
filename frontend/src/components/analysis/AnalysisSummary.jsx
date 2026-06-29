import React from 'react';
import Card from '../common/Card';

const AnalysisSummary = ({ summary, sections }) => {
    return (
        <Card className="p-8 bg-white/90 backdrop-blur-sm">
            <div className="flex items-start mb-8">
                <div className="bg-yellow-100 rounded-2xl p-4 mr-5 text-3xl">
                    🔥
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">AI&apos;s Honest Take</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                        {summary}
                    </p>
                </div>
            </div>

            <div className="space-y-8 mt-10">
                <h4 className="text-xl font-bold text-gray-900 border-b pb-2">Section Breakdown</h4>

                {sections.map((section, index) => (
                    <div key={index} className="relative pl-6 border-l-4 border-blue-500 bg-gray-50 p-6 rounded-r-xl">
                        <h5 className="font-bold text-gray-900 text-lg mb-2">
                            {section.title}
                        </h5>
                        <p className="text-gray-600 leading-relaxed">
                            {section.feedback}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AnalysisSummary;
