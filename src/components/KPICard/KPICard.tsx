import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  gradient
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm sm:text-base font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};