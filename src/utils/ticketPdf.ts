// ──────────────────────────────────────────
// PDF Ticket Generator using jsPDF
// ──────────────────────────────────────────

import jsPDF from 'jspdf';

export interface TicketPdfData {
  ticketId: string;
  tokenNumber: number;
  patientName: string;
  patientMobile: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  appointmentDate: string;
  timeSlot: string;
  qrDataUrl: string; // base64 PNG from qrGenerator
}

export const generateTicketPdf = async (data: TicketPdfData): Promise<void> => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 12;
  let y = margin;

  // ── Header bar ──
  doc.setFillColor(99, 57, 249); // primary purple
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AAROGYA SAHAYAK', pageW / 2, 12, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Appointment Ticket', pageW / 2, 20, { align: 'center' });

  y = 38;

  // ── Token Number (large, centered) ──
  doc.setTextColor(99, 57, 249);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(`#${data.tokenNumber}`, pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('TOKEN NUMBER', pageW / 2, y, { align: 'center' });
  y += 10;

  // ── Divider ──
  doc.setDrawColor(220, 220, 220);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin, y, pageW - margin, y);
  doc.setLineDashPattern([], 0);
  y += 8;

  // ── Details ──
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);

  const addRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 120, 120);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(value, margin + 40, y);
    y += 7;
  };

  addRow('Patient:', data.patientName);
  addRow('Mobile:', data.patientMobile);
  addRow('Doctor:', data.doctorName);
  addRow('Specialty:', data.doctorSpecialty);
  addRow('Hospital:', data.hospitalName);
  addRow('Date:', new Date(data.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  addRow('Time Slot:', data.timeSlot);
  addRow('Ticket ID:', data.ticketId.slice(0, 8).toUpperCase());

  y += 4;

  // ── Divider ──
  doc.setDrawColor(220, 220, 220);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin, y, pageW - margin, y);
  doc.setLineDashPattern([], 0);
  y += 6;

  // ── QR Code (centered) ──
  if (data.qrDataUrl) {
    const qrSize = 40;
    const qrX = (pageW - qrSize) / 2;
    doc.addImage(data.qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);
    y += qrSize + 4;

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.text('Show this QR code at the doctor\'s reception', pageW / 2, y, { align: 'center' });
    y += 8;
  }

  // ── Footer ──
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(6);
  doc.text('This is a computer-generated ticket. No signature required.', pageW / 2, y, { align: 'center' });
  y += 4;
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageW / 2, y, { align: 'center' });

  // Save
  doc.save(`ArogyaSahayak_Ticket_${data.tokenNumber}.pdf`);
};
