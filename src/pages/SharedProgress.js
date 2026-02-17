import React from 'react';
import { useParams } from 'react-router-dom';

const SharedProgress = () => {
  const { shareId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Shared Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Shared progress feature is under development.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Share ID: {shareId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedProgress;