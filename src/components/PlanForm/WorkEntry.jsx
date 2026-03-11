import Button from '../ui/Button';

export default function WorkEntry({ entry, onChange, onRemove, showRemove }) {
  return (
    <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <textarea
          value={entry.description}
          onChange={e => onChange('description', e.target.value)}
          placeholder="Describe the work..."
          rows={2}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white resize-y"
        />
        <input
          type="text"
          value={entry.location}
          onChange={e => onChange('location', e.target.value)}
          placeholder="Location / span / structure"
          className="sm:w-48 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
        />
      </div>
      {showRemove && (
        <div className="flex justify-end no-print">
          <Button variant="danger" onClick={onRemove} className="text-xs px-2 py-1">
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
