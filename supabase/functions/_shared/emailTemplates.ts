// ==========================================
// AAROGYA SAHAYAK — TRANSACTIONAL EMAIL TEMPLATES
// Powered by Resend via Supabase Edge Functions
// ==========================================

/**
 * Shared base wrapper for all email templates.
 * Provides responsive layout, brand header, and footer.
 */
function baseLayout(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    /* Reset */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0f1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f1117;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #1a1d29; border-radius: 16px; overflow: hidden; border: 1px solid #2a2d3a;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); padding: 32px 40px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 12px; display: inline-block; line-height: 48px; font-size: 24px;">
                      🩺
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      Aarogya Sahayak
                    </h1>
                    <p style="margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.75); font-weight: 500; letter-spacing: 0.5px;">
                      YOUR AI HEALTH COMPANION
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 40px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; border-top: 1px solid #2a2d3a;">
              <p style="margin: 0; font-size: 11px; color: #64748b; text-align: center; line-height: 1.6;">
                This is an automated email from Aarogya Sahayak.<br/>
                If you did not expect this email, you can safely ignore it.<br/><br/>
                © ${new Date().getFullYear()} Aarogya Sahayak · Built with ❤️ for India's health
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ==========================================
// 1. WELCOME EMAIL
// ==========================================
export function welcomeEmail(name: string, _language: string = 'en'): { subject: string; html: string } {
  const displayName = name || 'Health Champion';

  const body = `
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #f1f5f9;">
      Welcome, ${displayName}! 🎉
    </h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.7;">
      Your health journey starts now. Aarogya Sahayak is your AI-powered preventive health companion — built to help you track, predict, and take control of your well-being.
    </p>

    <!-- Feature Cards -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding: 12px; background-color: #0f1117; border-radius: 12px; border: 1px solid #2a2d3a; margin-bottom: 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="40" valign="top" style="padding-right: 12px;">
                <div style="width: 36px; height: 36px; background-color: rgba(16,185,129,0.15); border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">🔮</div>
              </td>
              <td valign="top">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #e2e8f0;">AI Health Predictors</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">Screen for diabetes, heart disease, thyroid issues, and more with AI-powered risk assessment.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height: 8px;"></td></tr>
      <tr>
        <td style="padding: 12px; background-color: #0f1117; border-radius: 12px; border: 1px solid #2a2d3a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="40" valign="top" style="padding-right: 12px;">
                <div style="width: 36px; height: 36px; background-color: rgba(59,130,246,0.15); border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">📊</div>
              </td>
              <td valign="top">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #e2e8f0;">Wellness Trackers</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">Log sleep, water, mood, symptoms, temperature, and more — all in one place.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height: 8px;"></td></tr>
      <tr>
        <td style="padding: 12px; background-color: #0f1117; border-radius: 12px; border: 1px solid #2a2d3a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="40" valign="top" style="padding-right: 12px;">
                <div style="width: 36px; height: 36px; background-color: rgba(168,85,247,0.15); border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">🧠</div>
              </td>
              <td valign="top">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #e2e8f0;">On-Device ML Scans</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">Use your camera for image-based health screening powered by TensorFlow — right on your device.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px;">
      <tr>
        <td align="center">
          <a href="https://arogyasahayak.in/dashboard" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; letter-spacing: 0.3px;">
            Go to Dashboard →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 24px 0 0; font-size: 12px; color: #475569; text-align: center; line-height: 1.6;">
      Stay healthy, stay informed. We're glad to have you! 💚
    </p>
  `;

  return {
    subject: `Welcome to Aarogya Sahayak, ${displayName}! 🩺`,
    html: baseLayout('Welcome to Aarogya Sahayak', body),
  };
}


// ==========================================
// 2. PASSWORD RESET EMAIL
// ==========================================
export function passwordResetEmail(name: string, resetLink: string): { subject: string; html: string } {
  const displayName = name || 'User';

  const body = `
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #f1f5f9;">
      Password Reset Request 🔐
    </h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.7;">
      Hi ${displayName}, we received a request to reset your Aarogya Sahayak password. Click the button below to set a new password.
    </p>

    <!-- Reset Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <a href="${resetLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; letter-spacing: 0.3px;">
            Reset My Password →
          </a>
        </td>
      </tr>
    </table>

    <!-- Security Notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px;">
      <tr>
        <td style="padding: 16px; background-color: rgba(245,158,11,0.08); border-radius: 12px; border: 1px solid rgba(245,158,11,0.2);">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="28" valign="top" style="padding-right: 10px;">
                <span style="font-size: 16px;">⚠️</span>
              </td>
              <td valign="top">
                <p style="margin: 0; font-size: 12px; color: #f59e0b; font-weight: 600;">Security Notice</p>
                <p style="margin: 4px 0 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                  This link expires in <strong style="color: #e2e8f0;">60 minutes</strong>. If you did not request a password reset, please ignore this email — your account remains secure.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Fallback Link -->
    <p style="margin: 20px 0 0; font-size: 11px; color: #475569; line-height: 1.6;">
      If the button doesn't work, copy and paste this link into your browser:<br/>
      <a href="${resetLink}" style="color: #3b82f6; word-break: break-all; text-decoration: underline;">${resetLink}</a>
    </p>
  `;

  return {
    subject: 'Reset Your Aarogya Sahayak Password 🔐',
    html: baseLayout('Password Reset', body),
  };
}


// ==========================================
// 3. PREDICTION REPORT EMAIL
// ==========================================
interface PredictionReportData {
  predictorName: string;
  risk: string;
  confidence: number;
  reasoning: string[];
  recommendations: string[];
  urgency: string;
  disclaimer: string;
}

export function predictionReportEmail(name: string, data: PredictionReportData): { subject: string; html: string } {
  const displayName = name || 'User';

  // Risk badge color mapping
  const riskColors: Record<string, { bg: string; text: string; border: string }> = {
    'Low':                { bg: '#064e3b', text: '#34d399', border: '#059669' },
    'Moderate':           { bg: '#78350f', text: '#fbbf24', border: '#d97706' },
    'High':               { bg: '#7f1d1d', text: '#f87171', border: '#dc2626' },
    'Critical':           { bg: '#7f1d1d', text: '#fca5a5', border: '#ef4444' },
    'Insufficient Data':  { bg: '#1e293b', text: '#94a3b8', border: '#475569' },
  };
  const riskStyle = riskColors[data.risk] || riskColors['Insufficient Data'];

  // Build reasoning list
  const reasoningHtml = data.reasoning
    .map(r => `<li style="margin-bottom: 6px; font-size: 12px; color: #cbd5e1; line-height: 1.5;">${r}</li>`)
    .join('');

  // Build recommendations list
  const recsHtml = data.recommendations
    .map(r => `<li style="margin-bottom: 6px; font-size: 12px; color: #cbd5e1; line-height: 1.5;">${r}</li>`)
    .join('');

  const body = `
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #f1f5f9;">
      Your Health Prediction Report 📋
    </h2>
    <p style="margin: 0 0 20px; font-size: 14px; color: #94a3b8; line-height: 1.7;">
      Hi ${displayName}, here are the results of your <strong style="color: #e2e8f0;">${data.predictorName}</strong> health assessment.
    </p>

    <!-- Risk Badge + Confidence -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
      <tr>
        <td style="padding: 20px; background-color: #0f1117; border-radius: 12px; border: 1px solid #2a2d3a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <p style="margin: 0 0 4px; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Risk Level</p>
                <span style="display: inline-block; padding: 6px 16px; background-color: ${riskStyle.bg}; color: ${riskStyle.text}; border: 1px solid ${riskStyle.border}; border-radius: 8px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${data.risk}
                </span>
              </td>
              <td align="right">
                <p style="margin: 0 0 4px; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Confidence</p>
                <span style="font-size: 24px; font-weight: 800; color: #e2e8f0; font-family: 'Courier New', monospace;">${data.confidence}%</span>
              </td>
            </tr>
          </table>

          <!-- Confidence Bar -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
            <tr>
              <td style="padding: 0;">
                <div style="width: 100%; height: 8px; background-color: #1e293b; border-radius: 4px; overflow: hidden;">
                  <div style="width: ${data.confidence}%; height: 100%; background-color: ${riskStyle.border}; border-radius: 4px;"></div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Reasoning -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
      <tr>
        <td style="padding: 16px; background-color: #0f1117; border-radius: 12px; border: 1px solid #2a2d3a;">
          <p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px;">
            🔍 Analysis Reasoning
          </p>
          <ul style="margin: 0; padding-left: 18px;">
            ${reasoningHtml}
          </ul>
        </td>
      </tr>
    </table>

    <!-- Recommendations -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
      <tr>
        <td style="padding: 16px; background-color: #0f1117; border-radius: 12px; border: 1px solid #2a2d3a;">
          <p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px;">
            ✨ Recommendations
          </p>
          <ul style="margin: 0; padding-left: 18px;">
            ${recsHtml}
          </ul>
        </td>
      </tr>
    </table>

    <!-- Urgency -->
    <p style="margin: 0 0 20px; font-size: 12px; color: #94a3b8;">
      <strong style="color: #e2e8f0;">Urgency Level:</strong> 
      <span style="text-transform: capitalize; font-weight: 600;">${data.urgency}</span>
    </p>

    <!-- Disclaimer -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding: 14px 16px; background-color: rgba(239,68,68,0.06); border-radius: 12px; border: 1px solid rgba(239,68,68,0.15);">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="padding-right: 10px;">
                <span style="font-size: 14px;">🛡️</span>
              </td>
              <td valign="top">
                <p style="margin: 0; font-size: 10px; color: #f87171; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Disclaimer</p>
                <p style="margin: 4px 0 0; font-size: 11px; color: #94a3b8; line-height: 1.6;">
                  ${data.disclaimer || 'This is a screening risk index, not a diagnosis. Consult a doctor.'}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px;">
      <tr>
        <td align="center">
          <a href="https://arogyasahayak.in/dashboard" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none;">
            View on Dashboard →
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: `🩺 ${data.predictorName} Report — ${data.risk} Risk | Aarogya Sahayak`,
    html: baseLayout('Health Prediction Report', body),
  };
}
