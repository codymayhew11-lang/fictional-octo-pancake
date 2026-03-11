// jsPDF is loaded lazily (dynamic import) so it doesn't bloat the main bundle.
// This module is only evaluated when generatePlanPdf() is first called.
import { formatDisplayDate } from './dateHelpers';
import { getCompanyName } from './storage';

const MARGIN = 18;        // mm from left edge
const RIGHT  = 192;       // mm right content boundary
const LINE_H = 6;         // normal line height mm
const SECTION_GAP = 5;    // extra gap before section headers

function addPageIfNeeded(doc, y, needed = 12) {
  if (y + needed > 272) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function sectionHeader(doc, text, y) {
  y = addPageIfNeeded(doc, y, 14);
  y += SECTION_GAP;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);           // brand navy
  doc.text(text.toUpperCase(), MARGIN, y);
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y + 1.5, RIGHT, y + 1.5);
  doc.setTextColor(0, 0, 0);
  return y + LINE_H + 1;
}

function labeledField(doc, label, value, y) {
  if (!value) return y;
  y = addPageIfNeeded(doc, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(label, MARGIN, y);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(value, RIGHT - MARGIN - 2);
  doc.text(lines, MARGIN + 38, y);
  return y + Math.max(LINE_H, lines.length * LINE_H);
}

function bodyText(doc, text, y, indent = 0) {
  const lines = doc.splitTextToSize(text, RIGHT - MARGIN - indent);
  lines.forEach(line => {
    y = addPageIfNeeded(doc, y);
    doc.text(line, MARGIN + indent, y);
    y += LINE_H;
  });
  return y;
}

export async function generatePlanPdf(plan) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const company = getCompanyName();
  let y = MARGIN;

  // ── Cover / Header ────────────────────────────────────────
  if (company) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(company.toUpperCase(), MARGIN, y);
    y += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 95);
  doc.text('Plan of the Day', MARGIN, y);
  y += 8;

  if (plan.date) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(formatDisplayDate(plan.date), MARGIN, y);
    y += 5;
  }

  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, RIGHT, y);
  y += 6;
  doc.setTextColor(0, 0, 0);

  // ── Project Info ─────────────────────────────────────────
  y = sectionHeader(doc, 'Project Information', y);
  doc.setFontSize(9);
  y = labeledField(doc, 'Project #:', plan.projectNumber, y);
  y = labeledField(doc, 'Project Name:', plan.projectName, y);
  y = labeledField(doc, 'Location:', plan.location, y);
  if (plan.weather) {
    y = labeledField(doc, 'Weather:', plan.weather, y);
  }

  // ── Safety ───────────────────────────────────────────────
  if (plan.safetyTopic) {
    y = sectionHeader(doc, 'Safety Talk Topic', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y = bodyText(doc, plan.safetyTopic, y);
  }

  // ── Work Performed ───────────────────────────────────────
  const performed = plan.workPerformed?.filter(e => e.description || e.location);
  if (performed?.length) {
    y = sectionHeader(doc, 'Work Performed — Previous Day', y);
    doc.setFontSize(9);
    performed.forEach((entry, i) => {
      y = addPageIfNeeded(doc, y, 10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}.`, MARGIN, y);
      doc.setFont('helvetica', 'normal');
      if (entry.description) y = bodyText(doc, entry.description, y, 5);
      if (entry.location) {
        doc.setFont('helvetica', 'italic');
        y = bodyText(doc, `Location: ${entry.location}`, y, 5);
        doc.setFont('helvetica', 'normal');
      }
      y += 1;
    });
  }

  // ── Work Planned ─────────────────────────────────────────
  const planned = plan.workPlanned?.filter(e => e.description || e.location);
  if (planned?.length) {
    y = sectionHeader(doc, 'Work Planned — Today', y);
    doc.setFontSize(9);
    planned.forEach((entry, i) => {
      y = addPageIfNeeded(doc, y, 10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}.`, MARGIN, y);
      doc.setFont('helvetica', 'normal');
      if (entry.description) y = bodyText(doc, entry.description, y, 5);
      if (entry.location) {
        doc.setFont('helvetica', 'italic');
        y = bodyText(doc, `Location: ${entry.location}`, y, 5);
        doc.setFont('helvetica', 'normal');
      }
      y += 1;
    });
  }

  // ── Equipment ────────────────────────────────────────────
  const equip = plan.equipment?.filter(e => e.value);
  if (equip?.length) {
    y = sectionHeader(doc, 'Equipment', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    equip.forEach(item => {
      y = addPageIfNeeded(doc, y);
      y = bodyText(doc, `• ${item.value}`, y, 2);
    });
  }

  // ── Crew ─────────────────────────────────────────────────
  const crewList = plan.crew?.filter(c => c.value);
  if (crewList?.length) {
    y = sectionHeader(doc, 'Crew', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    crewList.forEach(item => {
      y = addPageIfNeeded(doc, y);
      y = bodyText(doc, `• ${item.value}`, y, 2);
    });
  }

  // ── Out of Scope ─────────────────────────────────────────
  if (plan.outOfScope) {
    y = sectionHeader(doc, 'Out of Scope Work Identified', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y = bodyText(doc, plan.outOfScope, y);
  }

  // ── Notes ────────────────────────────────────────────────
  if (plan.notes) {
    y = sectionHeader(doc, 'Notes', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y = bodyText(doc, plan.notes, y);
  }

  // ── Footer on every page ─────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, RIGHT, 277, { align: 'right' });
    if (company) doc.text(company, MARGIN, 277);
  }

  return doc;
}

export function planFileName(plan) {
  const date = plan.date || new Date().toISOString().slice(0, 10);
  const proj = plan.projectName
    ? plan.projectName.replace(/[^a-z0-9]/gi, '_').slice(0, 30)
    : 'Plan';
  return `POTD_${date}_${proj}.pdf`;
}
