import { todayISO } from './dateHelpers';

export function createDefaultPlan() {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: todayISO(),
    weather: '',
    projectNumber: '',
    projectName: '',
    location: '',
    safetyTopic: '',
    workPerformed: [{ id: crypto.randomUUID(), description: '', location: '' }],
    workPlanned: [{ id: crypto.randomUUID(), description: '', location: '' }],
    equipment: [{ id: crypto.randomUUID(), value: '' }],
    crew: [{ id: crypto.randomUUID(), value: '' }],
    outOfScope: '',
    notes: '',
  };
}
