const INDEX_KEY = 'potd_index';
const PLAN_PREFIX = 'potd_plan_';
const COMPANY_KEY = 'potd_company_name';

function getIndex() {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  } catch {
    return [];
  }
}

function setIndex(index) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function savePlan(plan) {
  const updated = { ...plan, updatedAt: new Date().toISOString() };
  localStorage.setItem(PLAN_PREFIX + updated.id, JSON.stringify(updated));

  const index = getIndex();
  const entry = {
    id: updated.id,
    date: updated.date,
    projectName: updated.projectName,
    projectNumber: updated.projectNumber,
    updatedAt: updated.updatedAt,
  };
  const existing = index.findIndex(i => i.id === updated.id);
  if (existing >= 0) {
    index[existing] = entry;
  } else {
    index.push(entry);
  }
  setIndex(index);
  return updated;
}

export function loadPlan(id) {
  try {
    return JSON.parse(localStorage.getItem(PLAN_PREFIX + id));
  } catch {
    return null;
  }
}

export function deletePlan(id) {
  localStorage.removeItem(PLAN_PREFIX + id);
  const index = getIndex().filter(i => i.id !== id);
  setIndex(index);
}

export function listPlans() {
  return getIndex().sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function getCompanyName() {
  return localStorage.getItem(COMPANY_KEY) || '';
}

export function setCompanyName(name) {
  localStorage.setItem(COMPANY_KEY, name);
}
