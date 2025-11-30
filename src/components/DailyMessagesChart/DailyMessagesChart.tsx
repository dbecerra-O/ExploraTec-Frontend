import React from 'react';

interface DailyMessage {
    date: string;
    count: number;
}

interface DailyMessagesChartProps {
    data: DailyMessage[];
}

export const DailyMessagesChart: React.FC<DailyMessagesChartProps> = ({ data }) => {
    const maxCount = Math.max(...data.map(item => item.count));

    return (
        <div className="space-y-4">
            {data.map((item) => {
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                return (
                    <div key={item.date} className="flex items-center gap-4">
                        <div className="w-20 sm:w-24 text-sm text-gray-600">
                            {(() => {
                                // Parse date string directly to avoid timezone issues
                                const [year, month, day] = item.date.split('-');
                                const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                                return `${day} ${monthNames[parseInt(month) - 1]}`;
                            })()}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{item.count} mensajes</span>
                                <span className="text-gray-500">{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-sky-400 to-sky-600 h-3 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};