/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Arogya Sahayak — Medical Image AI Diagnostic PDF Report Generator
 * ═══════════════════════════════════════════════════════════════════════════
 *  Generates an A4 clinical triage summary document containing:
 *  • Original scan & Grad-CAM Heatmap overlay
 *  • Risk classification & calibrated confidence index
 *  • Visual reasoning points & clinical recommendations (cleanly sanitized)
 *  • Quality gate metrics (sharpness, illumination)
 *  • Medical disclaimer & doctor referral details
 */

import jsPDF from 'jspdf';
import type { PredictionData } from '../lib/types/prediction';

export interface ScanPdfData {
  toolName: string;
  category: string;
  patientName?: string;
  result: PredictionData;
  originalImage?: string; // base64 or DataURL
  heatmapImage?: string;  // base64 or DataURL
  timestamp?: string;
}

/**
 * Strips raw emojis, surrogate pairs, and markdown wrappers that cause
 * corrupted character artifacts in jsPDF standard Helvetica font rendering.
 */
export function sanitizePdfText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove emojis, symbols, and non-printable surrogate pairs
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{2300}-\u{23FF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{200B}-\u{200D}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{E000}-\u{F8FF}]/gu, '')
    .replace(/[\u{203C}-\u{3299}]/gu, '')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const generateScanReportPdf = async (data: ScanPdfData): Promise<void> => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // ── 1. Header Bar ──
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageW, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AROGYA SAHAYAK', margin, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('AI-Assisted Diagnostic Triage & Explainability Report', margin, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`DATE: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageW - margin, 14, { align: 'right' });

  y = 34;

  // ── 2. Scan Title & Risk Badge Banner ──
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(sanitizePdfText(data.toolName).toUpperCase(), margin, y);

  // Risk Badge Color Coding
  const risk = data.result.risk || 'Insufficient Data';
  let badgeColor: [number, number, number] = [100, 116, 139]; // slate
  if (risk === 'Low') badgeColor = [16, 185, 129]; // emerald
  else if (risk === 'Moderate') badgeColor = [245, 158, 11]; // amber
  else if (risk === 'High') badgeColor = [244, 63, 94]; // rose
  else if (risk === 'Critical') badgeColor = [220, 38, 38]; // red

  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.roundedRect(pageW - margin - 45, y - 5, 45, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`${risk.toUpperCase()} RISK`, pageW - margin - 22.5, y, { align: 'center' });

  y += 10;

  // ── 3. Confidence & Safety Gate Overview Box ──
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageW - 2 * margin, 18, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CALIBRATED CONFIDENCE INDEX', margin + 4, y + 6);
  doc.text('SAFETY GATE STATUS', margin + 70, y + 6);
  doc.text('INSPECTION QUALITY', margin + 130, y + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.result.confidence}%`, margin + 4, y + 13);

  const safety = data.result.safetyGateStatus === 'uncertain_further_evaluation'
    ? 'Uncertain (Ref. Further Eval)'
    : 'Usable Screening Result';
  doc.text(safety, margin + 70, y + 13);

  const qStatus = data.result.qualityMetrics?.status || 'Good';
  doc.text(qStatus.toUpperCase(), margin + 130, y + 13);

  y += 24;

  // ── 4. Side-by-Side Images (Original Scan + Grad-CAM Heatmap) ──
  const imgW = (pageW - 2 * margin - 8) / 2;
  const imgH = 48;

  if (data.originalImage) {
    try {
      doc.addImage(data.originalImage, 'JPEG', margin, y, imgW, imgH);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('ORIGINAL CAPTURED SCAN', margin, y + imgH + 4);
    } catch {
      doc.rect(margin, y, imgW, imgH, 'S');
      doc.text('Original Scan Image', margin + 10, y + 25);
    }
  }

  if (data.heatmapImage) {
    try {
      doc.addImage(data.heatmapImage, 'PNG', margin + imgW + 8, y, imgW, imgH);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('GRAD-CAM ACTIVATION HEATMAP', margin + imgW + 8, y + imgH + 4);
    } catch {
      doc.rect(margin + imgW + 8, y, imgW, imgH, 'S');
      doc.text('Grad-CAM Heatmap', margin + imgW + 18, y + 25);
    }
  }

  y += imgH + 9;

  // ── 5. Clinical Findings & Reasoning ──
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CLINICAL OBSERVATIONS & REASONING', margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  data.result.reasoning.forEach((point) => {
    const cleanPoint = sanitizePdfText(point);
    if (!cleanPoint) return;

    // Bullet circle
    doc.setFillColor(100, 116, 139);
    doc.circle(margin + 1.5, y - 1, 0.7, 'F');

    const lines = doc.splitTextToSize(cleanPoint, pageW - 2 * margin - 5);
    doc.text(lines, margin + 4, y);
    y += lines.length * 4.2;
  });

  y += 3;

  // ── 6. Actionable Clinical Recommendations ──
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('ACTIONABLE HEALTH RECOMMENDATIONS', margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  data.result.recommendations.forEach((rec) => {
    const cleanRec = sanitizePdfText(rec);
    if (!cleanRec) return;

    // Bullet circle
    doc.setFillColor(16, 185, 129); // emerald bullet
    doc.circle(margin + 1.5, y - 1, 0.8, 'F');

    const lines = doc.splitTextToSize(cleanRec, pageW - 2 * margin - 5);
    doc.text(lines, margin + 4, y);
    y += lines.length * 4.2;
  });

  y += 4;

  // ── 7. Disclaimer & Legal Footer ──
  const footerY = Math.max(y, pageH - 22);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY, pageW - margin, footerY);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  const disclaimerRaw = data.result.disclaimer || 'MEDICAL DISCLAIMER: This is an automated AI triage screening tool, not a definitive clinical diagnosis. Always consult a licensed medical doctor or Primary Health Centre (PHC) specialist for diagnosis and treatment.';
  const cleanDisclaimer = sanitizePdfText(disclaimerRaw);
  const discLines = doc.splitTextToSize(`DISCLAIMER: ${cleanDisclaimer}`, pageW - 2 * margin);
  doc.text(discLines, margin, footerY + 4);

  doc.save(`Arogya_ScanReport_${data.toolName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};
