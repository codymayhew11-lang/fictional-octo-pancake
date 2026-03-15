import { useState } from 'react';
import DateWeatherRow from './DateWeatherRow';
import ProjectInfoSection from './ProjectInfoSection';
import SafetySection from './SafetySection';
import WorkSection from './WorkSection';
import ListSection from './ListSection';
import NotesSection from './NotesSection';
import ScanNotesSection from './ScanNotesSection';
import DocumentIntelligenceSection from './DocumentIntelligenceSection';
import Button from '../ui/Button';
import { savePlan } from '../../utils/storage';
import { formatTime } from '../../utils/dateHelpers';

export default function PlanForm({ plan, setField, workPerformed, workPlanned, equipment, crew }) {
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!plan.date) {
      setError('Please enter a date before saving.');
      return;
    }
    if (!plan.projectName.trim()) {
      setError('Please enter a project name before saving.');
      return;
    }
    setError('');
    savePlan(plan);
    setSavedAt(new Date().toISOString());
    setTimeout(() => setSavedAt(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <DateWeatherRow date={plan.date} weather={plan.weather} setField={setField} />
      <ProjectInfoSection plan={plan} setField={setField} />
      <SafetySection safetyTopic={plan.safetyTopic} setField={setField} />
      <WorkSection
        title="Work Performed — Previous Day"
        entries={plan.workPerformed}
        handlers={workPerformed}
      />
      <WorkSection
        title="Work Planned — Today"
        entries={plan.workPlanned}
        handlers={workPlanned}
      />
      <ListSection
        title="Equipment"
        items={plan.equipment}
        handlers={equipment}
        placeholder="e.g. Bucket Truck #4, Digger Derrick, Hot Stick"
      />
      <ListSection
        title="Crew"
        items={plan.crew}
        handlers={crew}
        placeholder="e.g. J. Smith — Journeyman Lineman"
      />
      <ScanNotesSection
        onAppendToNotes={(text) => setField('notes', plan.notes ? plan.notes + '\n\n' + text : text)}
      />
      <DocumentIntelligenceSection
        onAppendToNotes={(text) => setField('notes', plan.notes ? plan.notes + '\n\n' + text : text)}
      />
      <NotesSection outOfScope={plan.outOfScope} notes={plan.notes} setField={setField} />

      <div className="no-print border-t border-gray-200 pt-4 mt-2 flex flex-col gap-2">
        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="primary" onClick={handleSave} className="px-6 py-2.5 text-base">
            Save Plan
          </Button>
          {savedAt && (
            <span className="text-green-700 text-sm font-semibold">
              ✓ Saved at {formatTime(savedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
