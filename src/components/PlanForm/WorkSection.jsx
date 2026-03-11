import SectionHeader from './SectionHeader';
import WorkEntry from './WorkEntry';
import Button from '../ui/Button';

export default function WorkSection({ title, entries, handlers }) {
  return (
    <div className="plan-section mb-6">
      <SectionHeader>{title}</SectionHeader>
      <div className="flex flex-col gap-3">
        <div className="hidden print:grid print:grid-cols-2 print:gap-1 print:text-xs print:font-semibold print:text-gray-500 print:border-b print:pb-1">
          <span>Description</span><span>Location</span>
        </div>
        {entries.map(entry => (
          <WorkEntry
            key={entry.id}
            entry={entry}
            onChange={(field, value) => handlers.update(entry.id, field, value)}
            onRemove={() => handlers.remove(entry.id)}
            showRemove={entries.length > 1}
          />
        ))}
        <div className="no-print">
          <Button variant="secondary" onClick={handlers.add} className="mt-1">
            + Add Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
