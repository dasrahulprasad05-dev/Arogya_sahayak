import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Info, Shield, CheckSquare, Square, Search } from 'lucide-react';
import { showToast } from '../../utils/toast';

interface Vaccine {
  id: string;
  ageGroup: string;
  name: string;
  prevents: string;
}

const nationalSchedule: Vaccine[] = [
  { id: 'bcg', ageGroup: 'Birth', name: 'BCG', prevents: 'Tuberculosis' },
  { id: 'opv0', ageGroup: 'Birth', name: 'OPV 0', prevents: 'Polio' },
  { id: 'hepb0', ageGroup: 'Birth', name: 'Hep B 0', prevents: 'Hepatitis B' },
  { id: 'opv1', ageGroup: '6 Weeks', name: 'OPV 1', prevents: 'Polio' },
  { id: 'penta1', ageGroup: '6 Weeks', name: 'Pentavalent 1', prevents: 'Diphtheria, Pertussis, Tetanus, Hep B, Hib' },
  { id: 'rotav1', ageGroup: '6 Weeks', name: 'Rotavirus 1', prevents: 'Rotavirus diarrhea' },
  { id: 'opv2', ageGroup: '10 Weeks', name: 'OPV 2', prevents: 'Polio' },
  { id: 'penta2', ageGroup: '10 Weeks', name: 'Pentavalent 2', prevents: 'Diphtheria, Pertussis, Tetanus, Hep B, Hib' },
  { id: 'rotav2', ageGroup: '10 Weeks', name: 'Rotavirus 2', prevents: 'Rotavirus diarrhea' },
  { id: 'opv3', ageGroup: '14 Weeks', name: 'OPV 3', prevents: 'Polio' },
  { id: 'penta3', ageGroup: '14 Weeks', name: 'Pentavalent 3', prevents: 'Diphtheria, Pertussis, Tetanus, Hep B, Hib' },
  { id: 'mr1', ageGroup: '9 Months', name: 'MR 1 (Measles & Rubella)', prevents: 'Measles, Rubella' },
  { id: 'dpt1', ageGroup: '16-24 Months', name: 'DPT Booster 1', prevents: 'Diphtheria, Pertussis, Tetanus' },
  { id: 'mr2', ageGroup: '16-24 Months', name: 'MR 2 (Booster)', prevents: 'Measles, Rubella' }
];

const VaccinationTracker: React.FC = () => {
  const { t } = useLanguage();
  const { logs } = useHealthRead();
  const { logVaccine } = useHealthDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState<string>('All');

  // Convert logs to local checked vaccine state map
  const checkedVaccines = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    logs.forEach(log => {
      if (log.type === 'vaccine') {
        map[log.value.vaccineId] = !!log.value.checked;
      }
    });
    return map;
  }, [logs]);

  const totalCount = nationalSchedule.length;
  const completedCount = nationalSchedule.filter(v => checkedVaccines[v.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (vaccineId: string) => {
    const isCurrentlyChecked = !!checkedVaccines[vaccineId];
    logVaccine(vaccineId, !isCurrentlyChecked);
    
    const vaccineName = nationalSchedule.find(v => v.id === vaccineId)?.name || 'Vaccine';
    showToast(
      navigator.onLine 
        ? `${vaccineName} immunization status updated!`
        : `${vaccineName} logged locally. Will sync online soon!`,
      'success'
    );
  };

  const ageGroups = ['All', 'Birth', '6 Weeks', '10 Weeks', '14 Weeks', '9 Months', '16-24 Months'];

  const filteredVaccines = nationalSchedule.filter(vac => {
    const matchSearch = vac.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        vac.prevents.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAge = selectedAge === 'All' || vac.ageGroup === selectedAge;
    return matchSearch && matchAge;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.vaccine.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track India National Immunization Schedule guidelines and completed shots.
        </p>
      </div>

      {/* Overarching Progress Bar Card */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm glass space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <span>Immunization Progress</span>
          <span className="font-number">{completedCount} of {totalCount} Completed ({progressPercent}%)</span>
        </div>
        <div className="w-full h-3 bg-muted/40 rounded-full overflow-hidden border border-border/15">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filters and search Row */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-card border border-border p-4 rounded-2xl shadow-sm glass">
        
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs input-accent-glow"
            placeholder="Search vaccines..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Age Filter */}
        <div className="flex gap-2 flex-wrap items-center text-xs">
          <span className="font-semibold text-muted-foreground">Filter by Age:</span>
          {ageGroups.map(age => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`px-3 py-1.5 rounded-lg border font-semibold touch-target btn-elastic ${
                selectedAge === age
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background/50 hover:bg-muted/50'
              }`}
            >
              {age}
            </button>
          ))}
        </div>

      </div>

      {/* Schedule Table Checklist as a Vertical Timeline */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm glass p-6">
        <div className="border-b border-border/40 pb-4 mb-6">
          <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Immunization Checklist Timeline</span>
          </h3>
        </div>

        {filteredVaccines.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm font-semibold">
            No vaccines found. Change filter parameters.
          </div>
        ) : (
          <div className="relative border-l-2 border-border/60 pl-8 ml-4 space-y-6 py-2">
            {filteredVaccines.map(vac => {
              const isChecked = !!checkedVaccines[vac.id];
              return (
                <div key={vac.id} className="relative group transition-all duration-300">
                  
                  {/* Animated dot indicator */}
                  <div className="absolute -left-[41px] top-2 flex items-center justify-center">
                    {isChecked ? (
                      <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-card flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm">✓</span>
                      </span>
                    ) : (
                      <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 border-2 border-card shadow-sm"></span>
                      </span>
                    )}
                  </div>

                  {/* Timeline Card */}
                  <div className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 bg-card/60 backdrop-blur-sm shadow-sm ${
                    isChecked ? 'border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5' : 'border-border/80 hover:border-primary/20 hover:scale-[1.01]'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-extrabold text-foreground">{vac.name}</span>
                        <span className="text-[9px] bg-primary/10 text-primary font-extrabold px-2 py-0.5 rounded-full font-number">
                          {vac.ageGroup}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Prevents: {vac.prevents}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggle(vac.id)}
                      className={`py-2 px-4 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all touch-target btn-elastic shrink-0 ${
                        isChecked
                          ? 'border-emerald-500/30 bg-emerald-500 text-white shadow-sm'
                          : 'border-border bg-background hover:bg-muted/50 text-muted-foreground'
                      }`}
                      aria-label={`Toggle vaccination ${vac.name}`}
                    >
                      {isChecked ? (
                        <>
                          <CheckSquare className="w-4 h-4 fill-current text-white" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">National Immunization Schedule:</span>
          Vaccination is the most cost-effective preventive health intervention. The Government of India provides free vaccinations under the Universal Immunization Programme (UIP) to protect infants and child populations against 12 life-threatening vaccine-preventable diseases. Ensure booster doses are logged on time.
        </div>
      </div>
    </div>
  );
};

export default VaccinationTracker;
