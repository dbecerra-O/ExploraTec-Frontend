import React from 'react';

interface FeedbackData {
    scene_id: number;
    scene_key: string;
    scene_name: string;
    total_feedbacks: number;
    positive_feedbacks: number;
    positive_rate_percent: number;
}

interface FeedbackChartProps {
    data: FeedbackData[];
}

export const FeedbackChart: React.FC<FeedbackChartProps> = ({ data }) => {
    // Sort by total feedbacks desc
    const sortedData = [...data].sort((a, b) => b.total_feedbacks - a.total_feedbacks).slice(0, 5);
    const maxTotal = Math.max(...sortedData.map(item => item.total_feedbacks), 1);

    return (
        <div className="space-y-4">
            {sortedData.map((item) => {
                const totalPercentage = (item.total_feedbacks / maxTotal) * 100;

                return (
                    <div key={item.scene_id} className="flex items-center gap-4">
                        <div className="w-24 sm:w-32 text-sm text-gray-600 truncate" title={item.scene_name || item.scene_key}>
                            {item.scene_name || item.scene_key}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">
                                    {item.positive_feedbacks} / {item.total_feedbacks} positivos
                                </span>
                                <span className={`font-medium ${item.positive_rate_percent >= 70 ? 'text-green-600' :
                                        item.positive_rate_percent >= 40 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {item.positive_rate_percent}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                {/* Background bar for total volume relative to max */}
                                <div
                                    className="absolute top-0 left-0 h-full bg-gray-300 rounded-full"
                                    style={{ width: `${totalPercentage}%` }}
                                ></div>

                                {/* Foreground bar for positive rate within that volume */}
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${item.positive_rate_percent >= 70 ? 'bg-green-500' :
                                            item.positive_rate_percent >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${(item.positive_feedbacks / maxTotal) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            })}
            {data.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    No hay datos de feedback disponibles
                </div>
            )}
        </div>
    );
};
