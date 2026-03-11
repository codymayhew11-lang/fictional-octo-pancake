import SectionHeader from './SectionHeader';
import Textarea from '../ui/Textarea';

export default function NotesSection({ outOfScope, notes, setField }) {
  return (
    <div className="plan-section mb-6">
      <SectionHeader>Additional Information</SectionHeader>
      <div className="flex flex-col gap-4">
        <Textarea
          label="Out of Scope Work Identified"
          id="out-of-scope"
          value={outOfScope}
          onChange={v => setField('outOfScope', v)}
          placeholder="Any work identified that is outside this project's scope..."
          rows={3}
        />
        <Textarea
          label="Notes"
          id="notes"
          value={notes}
          onChange={v => setField('notes', v)}
          placeholder="Any additional notes, concerns, or follow-up items..."
          rows={4}
        />
      </div>
    </div>
  );
}
