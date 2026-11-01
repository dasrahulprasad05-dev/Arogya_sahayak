/**
 * Authentication Guards & Administrative Email Restrictions
 * Prevents administrator credentials from being used on Patient or Doctor portals.
 */

export const ADMIN_EMAILS: string[] = [
  'rahulprasadcoding01@gmail.com',
  'admin@arogyasahayak.in'
];

/**
 * Checks if a given email is a designated administrator email.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export const ADMIN_PATIENT_LOGIN_ERROR = 
  'Access Restricted: This email is registered as an Administrator account. Patient login is not permitted with admin credentials. Please use the Admin Portal at /admin-login.';

export const ADMIN_DOCTOR_LOGIN_ERROR = 
  'Access Restricted: This email is registered as an Administrator account. Doctor login is not permitted with admin credentials. Please use the Admin Portal at /admin-login.';

export const ADMIN_REGISTER_ERROR = 
  'This email is reserved for Administrator access and cannot be registered as a patient or doctor.';
