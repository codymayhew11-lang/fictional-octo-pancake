import Button from '../ui/Button';
import { formatShortDate } from '../../utils/dateHelpers';
import { loadPlan, deletePlan } from '../../utils/storage';
import { todayISO } from '../../utils/dateHelpers';
import { createDefaultPlan } from '../../utils/defaultPlan';

export default function PlanCard({ entry, onLoad, onDelete }) {
  const handleLoad = () => {
    const plan = loadPlan(entry.id);
    if (plan) onLoad(plan);
  };

  const handleCopy = () => {
    const plan = loadPlan(entry.id);
    if (!plan) return;
    const copied = {
      ...plan,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: todayISO(),
    };
    onLoad(copied);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete plan for ${formatShortDate(entry.date)}${entry.projectName ? ` — ${entry.projectName}` : ''}?`)) {
      deletePlan(entry.id);
      onDelete(entry.id);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col gap-3">
      <div>
        <p className="font-bold text-gray-900 text-base">
          {formatShortDate(entry.date) || 'No date'}
        </p>
        <p className="text-gray-700 text-sm mt-0.5">
          {entry.projectName || <span className="italic text-gray-400">No project name</span>}
          {entry.projectNumber && <span className="text-gray-500 ml-2">#{entry.projectNumber}</span>}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Last saved: {new Date(entry.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="primary" onClick={handleLoad} className="text-sm">
          Load
        </Button>
        <Button variant="ghost" onClick={handleCopy} className="text-sm">
          Copy to New Plan
        </Button>
        <Button variant="danger" onClick={handleDelete} className="text-sm">
          Delete
        </Button>
      </div>
    </div>
  );
}
