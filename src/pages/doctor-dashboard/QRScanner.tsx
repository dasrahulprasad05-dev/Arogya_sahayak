import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, ScanLine, CheckCircle, XCircle, Camera, AlertTriangle
} from 'lucide-react';

interface ScanResult {
  success: boolean;
  message: string;
  patientName?: string;
  tokenNumber?: number;
}

const QRScanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>('qr-reader-' + Date.now());

  const startScanner = async () => {
    setResult(null);
    setError(null);
    setScanning(true);

    try {
      const scanner = new Html5Qrcode(containerRef.current);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Stop scanner after successful scan
          await scanner.stop();
          setScanning(false);

          // Process QR data
          await processQRCode(decodedText);
        },
        () => { /* ignore scan failures */ }
      );
    } catch (err: any) {
      setError('Camera access denied. Please allow camera permissions and try again.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current = null;
      }
    } catch { }
    setScanning(false);
  };

  const processQRCode = async (rawData: string) => {
    try {
      const data = JSON.parse(rawData);
      const ticketId = data.t;
      const doctorId = data.d;

      if (!ticketId) {
        setResult({ success: false, message: 'Invalid QR code — no ticket ID found.' });
        return;
      }

      // Verify the ticket belongs to this doctor
      if (user && doctorId !== user.id) {
        setResult({ success: false, message: 'This ticket is for a different doctor.' });
        return;
      }

      // Fetch and validate ticket
      const { data: apt, error: fetchErr } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (fetchErr || !apt) {
        setResult({ success: false, message: 'Ticket not found in the system.' });
        return;
      }

      if (apt.status === 'scanned' || apt.status === 'completed') {
        setResult({ success: false, message: `This ticket has already been scanned.`, patientName: apt.patient_name, tokenNumber: apt.token_number });
        return;
      }

      if (apt.status !== 'approved') {
        setResult({ success: false, message: `Cannot scan — ticket status is "${apt.status}".`, patientName: apt.patient_name, tokenNumber: apt.token_number });
        return;
      }

      // Check date
      const todayStr = new Date().toISOString().split('T')[0];
      if (apt.appointment_date !== todayStr) {
        setResult({ success: false, message: `This ticket is for ${apt.appointment_date}, not today.`, patientName: apt.patient_name, tokenNumber: apt.token_number });
        return;
      }

      // Mark as scanned
      const { error: updateErr } = await supabase
        .from('appointments')
        .update({ status: 'scanned', updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (updateErr) {
        setResult({ success: false, message: 'Failed to update ticket status.' });
        return;
      }

      setResult({
        success: true,
        message: 'Ticket verified and scanned successfully!',
        patientName: apt.patient_name,
        tokenNumber: apt.token_number,
      });

    } catch {
      setResult({ success: false, message: 'Invalid QR code format.' });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/doctor-dashboard')} className="p-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-heading font-bold text-base flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-primary" /> QR Scanner
            </h1>
            <p className="text-[10px] text-muted-foreground">Scan patient tickets at reception</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Scanner area */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div id={containerRef.current} className="w-full aspect-square bg-black" style={{ display: scanning ? 'block' : 'none' }} />

          {!scanning && !result && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Ready to Scan</h3>
              <p className="text-sm text-muted-foreground mb-6">Point your camera at the patient's QR code on their ticket</p>
              <button onClick={startScanner}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/15 transition-all">
                <ScanLine className="w-5 h-5" /> Start Scanning
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-start gap-2 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border text-center ${
              result.success
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/20'
            }`}>
            {result.success ? (
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
            ) : (
              <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-3" />
            )}

            {result.tokenNumber && (
              <p className="text-3xl font-mono font-bold text-primary mb-1">#{result.tokenNumber}</p>
            )}
            {result.patientName && (
              <p className="text-lg font-semibold mb-2">{result.patientName}</p>
            )}
            <p className={`text-sm font-medium ${result.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {result.message}
            </p>

            <button onClick={() => { setResult(null); startScanner(); }}
              className="mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all">
              Scan Another
            </button>
          </motion.div>
        )}

        {/* Stop button while scanning */}
        {scanning && (
          <button onClick={stopScanner} className="w-full bg-muted hover:bg-muted/80 font-semibold py-3 rounded-xl text-sm transition-all">
            Stop Scanner
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
