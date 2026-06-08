import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Brain, Info, CheckCircle, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { showToast } from '../../utils/toast';

interface Question {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

const stressQuestions: Question[] = [
  {
    id: 1,
    text: "How well did you sleep last night?",
    options: [
      { label: "Very Well", value: 0 },
      { label: "Okay", value: 1 },
      { label: "Poorly", value: 2 },
      { label: "Did Not Sleep", value: 3 }
    ]
  },
  {
    id: 2,
    text: "In the past week, how often did you feel nervous and stressed?",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Fairly Often", value: 2 },
      { label: "Very Often", value: 3 }
    ]
  },
  {
    id: 3,
    text: "How confident have you felt handling your personal problems?",
    options: [
      { label: "Very Confident", value: 0 },
      { label: "Confident", value: 1 },
      { label: "Slightly Confident", value: 2 },
      { label: "Not Confident", value: 3 }
    ]
  },
  {
    id: 4,
    text: "How often have you felt that things were going outside your control?",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Fairly Often", value: 2 },
      { label: "Very Often", value: 3 }
    ]
  },
  {
    id: 5,
    text: "How often did you feel unable to cope with all the tasks you had to do?",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Fairly Often", value: 2 },
      { label: "Very Often", value: 3 }
    ]
  }
];

const StressChecker: React.FC = () => {
  const { formatDate, formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logStress } = useHealthDispatch();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>(Array(5).fill(-1));
  const [result, setResult] = useState<number | null>(null);

  const stressLogs = logs.filter(log => log.type === 'stress');

  const progressPercent = useMemo(() => {
    return Math.round(((currentQuestionIndex + 1) / 5) * 100);
  }, [currentQuestionIndex]);

  const handleSelectOption = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);

    // Auto-advance after selection with a slight delay
    setTimeout(() => {
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handleEvaluate = () => {
    if (answers.includes(-1)) return;

    const sum = answers.reduce((acc, curr) => acc + curr, 0);
    const scaledScore = Math.round((sum / 15) * 40);

    logStress(scaledScore, answers);
    setResult(scaledScore);
    showToast(
      navigator.onLine 
        ? `Stress evaluation submitted successfully!`
        : `Stress score logged locally. Will sync online soon!`,
      'success'
    );
  };

  const getStressStatus = (score: number) => {
    if (score <= 13) {
      return {
        label: 'Low Stress',
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        desc: 'Your stress levels are standard (0–13). Maintain healthy habits.'
      };
    } else if (score <= 26) {
      return {
        label: 'Moderate Stress',
        color: 'text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20',
        desc: 'Elevated stress index (14–26). Consider breathing exercises and rest.'
      };
    } else {
      return {
        label: 'High Stress',
        color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
        desc: 'High stress alerts (> 26). Try taking box breathing breaks or seek relaxation tips.'
      };
    }
  };

  const getResultStyles = (score: number) => {
    if (score <= 13) return {
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      circle: 'stroke-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
    };
    if (score <= 26) return {
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      circle: 'stroke-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    };
    return {
      border: 'border-rose-500/50',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.35)]',
      circle: 'stroke-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse'
    };
  };

  const activeQuestion = stressQuestions[currentQuestionIndex];
  const isAllAnswered = !answers.includes(-1);

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-up-staggered relative">
      {/* Background atmospheric blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500/20 via-primary/10 to-transparent p-6 rounded-2xl border border-purple-500/20 flex items-center justify-between shadow-lg shadow-purple-950/20 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground drop-shadow-sm">Stress Checker</h1>
          <p className="text-muted-foreground text-sm mt-1">Answer 5 quick questions to evaluate and monitor your perceived stress index.</p>
        </div>
        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl animate-float border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <Brain className="w-6 h-6" />
        </div>
      </div>

      {result !== null ? (
        // RESULTS VIEW
        <div className="bg-card border border-border rounded-2xl p-6 shadow-md glass space-y-6 animate-slide-up relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
          {/* Corner overlay accents */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-purple-500 rounded-tl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500 rounded-br-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <div className="text-center border-b border-border/40 pb-4">
            <h3 className="font-heading font-bold text-lg text-foreground mb-1">Evaluation Result</h3>
            <p className="text-xs text-muted-foreground">Standardized perceived stress score</p>
          </div>

          {(() => {
            const styles = getResultStyles(result);
            return (
              <div className="flex flex-col items-center py-4">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full border-2 ${styles.border} ${styles.bg} ${styles.glow} animate-pulse-slow`}></div>
                  
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-muted/10 dark:stroke-muted/20"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className={`transition-all duration-1000 ease-out ${styles.circle}`}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * result) / 40}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-extrabold font-number ${styles.text} drop-shadow-md`}>
                      {formatNumber(result)}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">/40</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-4">Perceived Stress Index</span>
              </div>
            );
          })()}

          <div className={`p-4 border rounded-xl flex items-start gap-2.5 ${getStressStatus(result).color} backdrop-blur-sm shadow-sm`}>
            {result <= 13 ? (
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold text-xs block mb-1 uppercase tracking-wide">
                {getStressStatus(result).label}
              </span>
              <p className="text-[11px] leading-relaxed opacity-90">
                {getStressStatus(result).desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setAnswers(Array(5).fill(-1));
              setCurrentQuestionIndex(0);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-primary hover:from-purple-500 hover:to-primary/95 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-purple-500/25 hover:shadow-purple-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all touch-target btn-elastic btn-pulse-glow"
            style={{ '--btn-glow-color': '168, 85, 247' } as React.CSSProperties}
          >
            Retake Test
          </button>
        </div>
      ) : (
        // QUESTIONNAIRE VIEW (re-keyed with currentQuestionIndex to trigger slide-in transition on change)
        <div 
          key={currentQuestionIndex}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6 animate-slide-in-question relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300"
        >
          {/* Corner overlay accents */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-purple-500 rounded-tl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500 rounded-br-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

          {/* Progress Header */}
          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground border-b border-border/40 pb-3">
            <span className="tracking-wide">Question {currentQuestionIndex + 1} of 5</span>
            <span className="font-number">{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden border border-border/15">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-primary transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-4 text-center">
            <span className="text-3xl block mb-3 animate-float">🧠</span>
            <h3 className="text-xl font-bold font-heading text-foreground leading-snug tracking-tight">
              {activeQuestion.text}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {activeQuestion.options.map(opt => {
              const selected = answers[currentQuestionIndex] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full p-4 border rounded-2xl text-left text-sm font-semibold transition-all touch-target flex justify-between items-center hover:scale-[1.01] active:scale-[0.99] btn-elastic ${
                    selected
                      ? 'border-purple-500 bg-purple-500/15 text-purple-300 font-bold shadow-[0_0_18px_rgba(168,85,247,0.4)] ring-2 ring-purple-500/30'
                      : 'border-border bg-background/30 text-foreground hover:border-purple-500/20 hover:shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                  }`}
                >
                  <span className="tracking-wide">{opt.label}</span>
                  {selected && <CheckCircle className="w-5 h-5 text-purple-400 animate-pulse" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-border/40">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="p-2.5 border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50 transition-all touch-target flex items-center gap-1 text-xs font-bold btn-elastic"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentQuestionIndex < 4 ? (
              <button
                disabled={answers[currentQuestionIndex] === -1}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="p-2.5 bg-muted/30 border border-border hover:bg-muted/50 text-foreground rounded-xl disabled:opacity-50 transition-all touch-target flex items-center gap-1 text-xs font-bold btn-elastic"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={!isAllAnswered}
                onClick={handleEvaluate}
                className="p-3 bg-gradient-to-r from-purple-600 to-primary hover:from-purple-500 hover:to-primary/95 text-white font-bold rounded-xl transition-all touch-target text-xs shadow-md shadow-purple-500/20 btn-elastic btn-pulse-glow"
                style={{ '--btn-glow-color': '168, 85, 247' } as React.CSSProperties}
              >
                Evaluate Score
              </button>
            )}
          </div>

        </div>
      )}

      {/* History Log List */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
        {/* Corner overlay accents */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-tr-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-purple-500 rounded-bl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <h3 className="font-heading font-bold text-lg text-foreground mb-4">Past Stress Indices</h3>
        
        {stressLogs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm font-medium">
            No evaluations taken yet.
          </div>
        ) : (
          <div className="space-y-3">
            {stressLogs.map(log => {
              const status = getStressStatus(Number(log.value.score));
              return (
                <div key={log.id} className="p-3 border border-border/50 bg-muted/10 hover:border-purple-500/30 rounded-xl flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
                  <div>
                    <time className="text-[10px] text-muted-foreground font-semibold block">
                      {formatDate(log.created_at, { dateStyle: 'medium' })}
                    </time>
                    <span className="text-sm font-bold text-foreground font-number">
                      Score: {formatNumber(log.value.score)} / 40
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${status.color.split(' ')[0]} ${status.color.split(' ')[2]}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guidelines Banner */}
      <div className="p-5 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-2xl flex gap-3 text-xs leading-relaxed text-muted-foreground relative overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-transparent"></div>
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1 tracking-wide">Standardized Stress Evaluation:</span>
          The perceived stress scale tracks psychological indices. Scores between 0-13 indicate low stress; 14-26 represent moderate stress; and 27-40 denote high stress. Managing stress regularly with paced box breathing regulates cardiovascular and sympathetic tone.
        </div>
      </div>

    </div>
  );
};

export default StressChecker;
