import React from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PasswordStrengthIndicatorProps {
  password?: string;
  onValidationChange?: (isValid: boolean) => void;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password = '',
  onValidationChange
}) => {
  const { t } = useLanguage();

  const requirements = [
    { id: 'length', text: 'At least 8 characters', met: password.length >= 8 },
    { id: 'upper', text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'number', text: 'One number', met: /[0-9]/.test(password) },
    { id: 'special', text: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = requirements.filter(req => req.met).length;
  
  // Calculate strength percentage and color
  const strengthPercentage = (metCount / requirements.length) * 100;
  
  let color = 'bg-slate-200 dark:bg-slate-700'; // empty
  let text = 'Too weak';
  let textColor = 'text-slate-500';

  if (password.length > 0) {
    if (metCount === 1) {
      color = 'bg-rose-500';
      text = 'Weak';
      textColor = 'text-rose-500';
    } else if (metCount === 2) {
      color = 'bg-amber-500';
      text = 'Fair';
      textColor = 'text-amber-500';
    } else if (metCount === 3) {
      color = 'bg-blue-500';
      text = 'Good';
      textColor = 'text-blue-500';
    } else if (metCount === 4) {
      color = 'bg-emerald-500';
      text = 'Strong';
      textColor = 'text-emerald-500';
    }
  }

  // Notify parent of validity changes
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(metCount === requirements.length);
    }
  }, [metCount, onValidationChange]);

  if (password.length === 0) return null;

  return (
    <div className="space-y-3 mt-3 bg-slate-900/5 dark:bg-white/5 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500 dark:text-slate-400">Password Strength</span>
        <span className={textColor}>{text}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${step <= metCount ? color : 'bg-transparent'}`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 gap-1.5 pt-1">
        {requirements.map(req => (
          <div key={req.id} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            )}
            <span className={req.met ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-slate-400"}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
