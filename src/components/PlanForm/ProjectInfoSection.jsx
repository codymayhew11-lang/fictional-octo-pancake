import SectionHeader from './SectionHeader';
import Input from '../ui/Input';

export default function ProjectInfoSection({ plan, setField }) {
  return (
    <div className="plan-section mb-6">
      <SectionHeader>Project Information</SectionHeader>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project #"
            id="project-number"
            value={plan.projectNumber}
            onChange={v => setField('projectNumber', v)}
            placeholder="e.g. 2024-0145"
          />
          <Input
            label="Project Name"
            id="project-name"
            value={plan.projectName}
            onChange={v => setField('projectName', v)}
            placeholder="e.g. Substation Upgrade"
            required
          />
        </div>
        <Input
          label="Location"
          id="project-location"
          value={plan.location}
          onChange={v => setField('location', v)}
          placeholder="e.g. 1234 Main St, Anytown — or — Feeder 7, Section 3"
        />
      </div>
    </div>
  );
}
