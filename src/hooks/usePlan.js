import { useState } from 'react';
import { createDefaultPlan } from '../utils/defaultPlan';

export function usePlan(initialPlan) {
  const [plan, setPlan] = useState(initialPlan || createDefaultPlan);

  // Top-level field update
  const setField = (field, value) =>
    setPlan(p => ({ ...p, [field]: value }));

  // --- workPerformed ---
  const addWorkPerformed = () =>
    setPlan(p => ({
      ...p,
      workPerformed: [...p.workPerformed, { id: crypto.randomUUID(), description: '', location: '' }],
    }));

  const updateWorkPerformed = (id, field, value) =>
    setPlan(p => ({
      ...p,
      workPerformed: p.workPerformed.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));

  const removeWorkPerformed = (id) =>
    setPlan(p => ({
      ...p,
      workPerformed: p.workPerformed.filter(e => e.id !== id),
    }));

  // --- workPlanned ---
  const addWorkPlanned = () =>
    setPlan(p => ({
      ...p,
      workPlanned: [...p.workPlanned, { id: crypto.randomUUID(), description: '', location: '' }],
    }));

  const updateWorkPlanned = (id, field, value) =>
    setPlan(p => ({
      ...p,
      workPlanned: p.workPlanned.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));

  const removeWorkPlanned = (id) =>
    setPlan(p => ({
      ...p,
      workPlanned: p.workPlanned.filter(e => e.id !== id),
    }));

  // --- equipment ---
  const addEquipment = () =>
    setPlan(p => ({
      ...p,
      equipment: [...p.equipment, { id: crypto.randomUUID(), value: '' }],
    }));

  const updateEquipment = (id, value) =>
    setPlan(p => ({
      ...p,
      equipment: p.equipment.map(i => i.id === id ? { ...i, value } : i),
    }));

  const removeEquipment = (id) =>
    setPlan(p => ({
      ...p,
      equipment: p.equipment.filter(i => i.id !== id),
    }));

  // --- crew ---
  const addCrew = () =>
    setPlan(p => ({
      ...p,
      crew: [...p.crew, { id: crypto.randomUUID(), value: '' }],
    }));

  const updateCrew = (id, value) =>
    setPlan(p => ({
      ...p,
      crew: p.crew.map(i => i.id === id ? { ...i, value } : i),
    }));

  const removeCrew = (id) =>
    setPlan(p => ({
      ...p,
      crew: p.crew.filter(i => i.id !== id),
    }));

  const resetPlan = (newPlan) => setPlan(newPlan || createDefaultPlan());

  return {
    plan,
    setField,
    workPerformed: { add: addWorkPerformed, update: updateWorkPerformed, remove: removeWorkPerformed },
    workPlanned: { add: addWorkPlanned, update: updateWorkPlanned, remove: removeWorkPlanned },
    equipment: { add: addEquipment, update: updateEquipment, remove: removeEquipment },
    crew: { add: addCrew, update: updateCrew, remove: removeCrew },
    resetPlan,
  };
}
