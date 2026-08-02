// ──────────────────────────────────────────
// QR Code Generator Utility
// Uses qrcode library for client-side QR generation
// ──────────────────────────────────────────

import QRCode from 'qrcode';

export interface QRTicketData {
  ticketId: string;
  tokenNumber: number;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  timestamp: string;
}

/**
 * Generate a QR code as a data URL (base64 PNG)
 */
export const generateQRDataUrl = async (data: QRTicketData): Promise<string> => {
  const payload = JSON.stringify({
    t: data.ticketId,
    n: data.tokenNumber,
    d: data.doctorId,
    p: data.patientId,
    dt: data.appointmentDate,
    ts: data.timestamp,
    v: 1, // version for future compatibility
  });

  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#1a1a2e',
      light: '#ffffff',
    },
  });
};

/**
 * Generate QR code as an SVG string (for embedding in HTML/PDF)
 */
export const generateQRSvg = async (data: QRTicketData): Promise<string> => {
  const payload = JSON.stringify({
    t: data.ticketId,
    n: data.tokenNumber,
    d: data.doctorId,
    p: data.patientId,
    dt: data.appointmentDate,
    ts: data.timestamp,
    v: 1,
  });

  return QRCode.toString(payload, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    width: 200,
    margin: 1,
  });
};
