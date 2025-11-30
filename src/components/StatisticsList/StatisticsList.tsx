import React from 'react';

interface StatItem {
    scene?: string;
    intent?: string;
    count: number;
    percentage?: number;
    avgConfidence?: number;
}

interface StatisticsListProps {
    title: string;
    data: StatItem[];
    type: 'scene' | 'intent';
}

export const StatisticsList: React.FC<StatisticsListProps> = ({
    title,
    data,
    type
}) => {
    return (
        <div>
            <h2 className="text-lg sm:text-xl font-semibold text-sky-900 mb-4">
                {title}
            </h2>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div
                        key={type === 'scene' ? item.scene : item.intent}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {type === 'scene' ? item.scene : item.intent}
                                </p>
                                {item.percentage && (
                                    <p className="text-xs text-gray-500">
                                        {item.percentage.toFixed(1)}%
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-sky-700">
                                {item.count}
                            </p>
                            <p className="text-xs text-gray-500">mensajes</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};