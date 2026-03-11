import { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import { listPlans } from '../../utils/storage';

export default function PlansList({ onLoad, onBack }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    setPlans(listPlans());
  }, []);

  const handleDelete = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleLoad = (plan) => {
    onLoad(plan);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-900">Saved Plans</h2>
        <button
          onClick={onBack}
          className="text-sm text-blue-800 font-semibold underline hover:no-underline"
        >
          ← Back to Form
        </button>
      </div>
      {plans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No saved plans yet.</p>
          <p className="text-sm mt-1">Fill out a plan and tap Save Plan to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {plans.map(entry => (
            <PlanCard
              key={entry.id}
              entry={entry}
              onLoad={handleLoad}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
