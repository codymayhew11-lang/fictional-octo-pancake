import SectionHeader from './SectionHeader';
import Input from '../ui/Input';

export default function SafetySection({ safetyTopic, setField }) {
  return (
    <div className="plan-section mb-6">
      <SectionHeader>Safety</SectionHeader>
      <Input
        label="Safety Talk Topic"
        id="safety-topic"
        value={safetyTopic}
        onChange={v => setField('safetyTopic', v)}
        placeholder="e.g. PPE inspection, Overhead line awareness, Lockout/Tagout"
      />
    </div>
  );
}
