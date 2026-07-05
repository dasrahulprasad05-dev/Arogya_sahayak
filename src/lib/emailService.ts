import { supabase } from '../integrations/supabase/client';

// ==========================================
// AAROGYA SAHAYAK — FRONTEND EMAIL SERVICE
// Wraps supabase.functions.invoke('send-email')
// All calls are non-blocking (fire-and-forget safe)
// ==========================================

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send a branded welcome email after registration.
 * Non-blocking — will not throw if email fails.
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  language: string = 'en'
): Promise<EmailResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'welcome',
        to: email,
        data: { name, language },
      },
    });

    if (error) {
      console.warn('Welcome email failed (non-blocking):', error.message);
      return { success: false, error: error.message };
    }

    return data as EmailResponse;
  } catch (err: any) {
    console.warn('Welcome email exception (non-blocking):', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send a custom password reset notification email.
 * This is sent alongside Supabase's built-in reset flow.
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'password-reset',
        to: email,
        data: { name, resetLink },
      },
    });

    if (error) {
      console.warn('Password reset email failed (non-blocking):', error.message);
      return { success: false, error: error.message };
    }

    return data as EmailResponse;
  } catch (err: any) {
    console.warn('Password reset email exception (non-blocking):', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send a prediction report summary via email.
 */
export async function sendPredictionReportEmail(
  email: string,
  name: string,
  predictionData: {
    predictorName: string;
    risk: string;
    confidence: number;
    reasoning: string[];
    recommendations: string[];
    urgency: string;
    disclaimer: string;
  }
): Promise<EmailResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'prediction-report',
        to: email,
        data: {
          name,
          ...predictionData,
        },
      },
    });

    if (error) {
      console.warn('Prediction report email failed (non-blocking):', error.message);
      return { success: false, error: error.message };
    }

    return data as EmailResponse;
  } catch (err: any) {
    console.warn('Prediction report email exception (non-blocking):', err.message);
    return { success: false, error: err.message };
  }
}
