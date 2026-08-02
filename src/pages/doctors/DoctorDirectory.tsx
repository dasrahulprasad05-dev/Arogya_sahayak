import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import type { Doctor } from '../../lib/types/doctor';
import DoctorCard from '../../components/doctors/DoctorCard';
import {
  Search, Stethoscope, SlidersHorizontal,
  Users, X
} from 'lucide-react';

const SPECIALTIES = [
  { id: 'cardiologist', name: 'Cardiologist' },
  { id: 'diabetologist', name: 'Diabetologist' },
  { id: 'nephrologist', name: 'Nephrologist' },
  { id: 'hepatologist', name: 'Hepatologist' },
  { id: 'hematologist', name: 'Hematologist' },
  { id: 'endocrinologist', name: 'Endocrinologist' },
  { id: 'oncologist', name: 'Oncologist' },
  { id: 'neurologist', name: 'Neurologist' },
  { id: 'pulmonologist', name: 'Pulmonologist' },
  { id: 'dermatologist', name: 'Dermatologist' },
  { id: 'gynecologist', name: 'Gynecologist' },
  { id: 'psychiatrist', name: 'Psychiatrist' },
  { id: 'orthopedic', name: 'Orthopedic' },
  { id: 'general_physician', name: 'General Physician' },
  { id: 'pediatrician', name: 'Pediatrician' },
  { id: 'ophthalmologist', name: 'Ophthalmologist' },
  { id: 'dentist', name: 'Dentist' },
  { id: 'ent', name: 'ENT Specialist' },
];

type SortOption = 'rating' | 'experience' | 'fee_low' | 'fee_high' | 'name';

const DoctorDirectory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(searchParams.get('specialty') || '');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('doctors')
          .select('*')
          .eq('status', 'approved');

        if (selectedSpecialty) {
          query = query.eq('specialty_id', selectedSpecialty);
        }

        const { data, error } = await query.order('average_rating', { ascending: false });
        if (error) throw error;
        setDoctors((data || []) as Doctor[]);
      } catch {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty]);

  // Update URL params when specialty changes
  useEffect(() => {
    if (selectedSpecialty) {
      setSearchParams({ specialty: selectedSpecialty });
    } else {
      setSearchParams({});
    }
  }, [selectedSpecialty, setSearchParams]);

  // Check URL for specialty param on mount (from predictor redirect)
  useEffect(() => {
    const sp = searchParams.get('specialty');
    if (sp && sp !== selectedSpecialty) {
      setSelectedSpecialty(sp);
    }
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...doctors];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.full_name.toLowerCase().includes(q) ||
        d.hospital_name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'experience':
        result.sort((a, b) => b.experience_years - a.experience_years);
        break;
      case 'fee_low':
        result.sort((a, b) => a.consultation_fee - b.consultation_fee);
        break;
      case 'fee_high':
        result.sort((a, b) => b.consultation_fee - a.consultation_fee);
        break;
      case 'name':
        result.sort((a, b) => a.full_name.localeCompare(b.full_name));
        break;
    }

    return result;
  }, [doctors, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-primary" />
          Find a Doctor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Browse verified doctors and book appointments</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by name, hospital, city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all ${
              showFilters || selectedSpecialty ? 'bg-primary text-white border-primary' : 'bg-card border-border hover:bg-muted'
            }`}>
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {selectedSpecialty && <span className="w-2 h-2 rounded-full bg-white/80" />}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-xl p-4 space-y-4">

            {/* Specialty filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Specialty</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedSpecialty('')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedSpecialty ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}>
                  All
                </button>
                {SPECIALTIES.map(s => (
                  <button key={s.id} onClick={() => setSelectedSpecialty(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSpecialty === s.id ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Sort By</label>
              <div className="flex flex-wrap gap-2">
                {([
                  { id: 'rating', label: '⭐ Rating' },
                  { id: 'experience', label: '📋 Experience' },
                  { id: 'fee_low', label: '₹ Fee (Low→High)' },
                  { id: 'fee_high', label: '₹ Fee (High→Low)' },
                  { id: 'name', label: '🔤 Name' },
                ] as { id: SortOption; label: string }[]).map(s => (
                  <button key={s.id} onClick={() => setSortBy(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === s.id ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedSpecialty && (
              <button onClick={() => setSelectedSpecialty('')} className="text-xs text-primary hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* Active filter indicator */}
        {selectedSpecialty && !showFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Showing:</span>
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-medium">
              {SPECIALTIES.find(s => s.id === selectedSpecialty)?.name || selectedSpecialty}
              <button onClick={() => setSelectedSpecialty('')}><X className="w-3 h-3" /></button>
            </span>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No doctors found</h3>
          <p className="text-sm text-muted-foreground">
            {selectedSpecialty ? 'Try clearing your filters or check back later.' : 'No doctors have been registered yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">{filteredAndSorted.length} doctor{filteredAndSorted.length !== 1 ? 's' : ''} found</p>
          {filteredAndSorted.map((doctor, idx) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDirectory;
