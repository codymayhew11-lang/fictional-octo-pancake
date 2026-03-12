import { generatePlanPdf, planFileName } from './generatePdf';
import { formatDisplayDate } from './dateHelpers';
import { getCompanyName } from './storage';

function buildTextSummary(plan) {
  const company = getCompanyName();
  const lines = [];

  if (company) lines.push(company);
  lines.push('PLAN OF THE DAY');
  if (plan.date) lines.push(formatDisplayDate(plan.date));
  lines.push('');

  if (plan.projectName || plan.projectNumber) {
    lines.push(`Project: ${[plan.projectNumber, plan.projectName].filter(Boolean).join(' — ')}`);
  }
  if (plan.location)     lines.push(`Location: ${plan.location}`);
  if (plan.weather)      lines.push(`Weather: ${plan.weather}`);
  if (plan.safetyTopic)  lines.push(`Safety Topic: ${plan.safetyTopic}`);

  const performed = plan.workPerformed?.filter(e => e.description);
  if (performed?.length) {
    lines.push('');
    lines.push('Work Performed (Previous Day):');
    performed.forEach((e, i) => {
      lines.push(`  ${i + 1}. ${e.description}${e.location ? ` [${e.location}]` : ''}`);
    });
  }

  const planned = plan.workPlanned?.filter(e => e.description);
  if (planned?.length) {
    lines.push('');
    lines.push('Work Planned (Today):');
    planned.forEach((e, i) => {
      lines.push(`  ${i + 1}. ${e.description}${e.location ? ` [${e.location}]` : ''}`);
    });
  }

  const equip = plan.equipment?.filter(e => e.value).map(e => e.value);
  if (equip?.length) {
    lines.push('');
    lines.push(`Equipment: ${equip.join(', ')}`);
  }

  const crew = plan.crew?.filter(c => c.value).map(c => c.value);
  if (crew?.length) {
    lines.push('');
    lines.push(`Crew: ${crew.join(', ')}`);
  }

  if (plan.outOfScope) {
    lines.push('');
    lines.push(`Out of Scope: ${plan.outOfScope}`);
  }
  if (plan.notes) {
    lines.push('');
    lines.push(`Notes: ${plan.notes}`);
  }

  return lines.join('\n');
}

export async function sharePlan(plan) {
  const title = `Plan of the Day${plan.date ? ` — ${plan.date}` : ''}`;
  const text  = buildTextSummary(plan);

  // Generate PDF blob
  let pdfFile = null;
  try {
    const doc = await generatePlanPdf(plan);
    const blob = doc.output('blob');
    pdfFile = new File([blob], planFileName(plan), { type: 'application/pdf' });
  } catch (err) {
    console.warn('PDF generation failed, falling back to text share:', err);
  }

  // Try sharing PDF file (iOS 15+, Android Chrome)
  if (pdfFile && navigator.canShare?.({ files: [pdfFile] })) {
    await navigator.share({ title, text, files: [pdfFile] });
    return;
  }

  // Try sharing text only (most mobile browsers)
  if (navigator.share) {
    await navigator.share({ title, text });
    return;
  }

  // Desktop fallback — download the PDF directly
  if (pdfFile) {
    const url = URL.createObjectURL(pdfFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = planFileName(plan);
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  // Last resort — copy text to clipboard
  await navigator.clipboard.writeText(text);
  throw new Error('copied');  // signal to caller to show "Copied!" toast
}

export async function downloadPlan(plan) {
  const doc = await generatePlanPdf(plan);
  doc.save(planFileName(plan));
}
