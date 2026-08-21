import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Pill,
  Search,
  Calculator,
  Plus,
  Trash2,
  Building,
  PhoneCall,
  FileText,
  ArrowLeft,
  Info,
  Download,
  Layers
} from 'lucide-react';
import { JAN_AUSHADHI_DATABASE } from '../../data/janAushadhiDatabase';
import type { MedicineItem } from '../../data/janAushadhiDatabase';

const JanAushadhiSwitcher: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [basket, setBasket] = useState<MedicineItem[]>([]);
  const [showDoctorSlip, setShowDoctorSlip] = useState(false);

  const categories = ['All', 'Antibiotic', 'Gastro / Acidity', 'Blood Pressure', 'Diabetes', 'Pain & Swelling', 'Bone & Joints', 'Allergy & Asthma', 'Cholesterol / Heart', 'Thyroid', 'Cardiology'];

  const filteredMedicines = useMemo(() => {
    return JAN_AUSHADHI_DATABASE.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.brandName.toLowerCase().includes(q) ||
        m.genericSalt.toLowerCase().includes(q) ||
        m.usage.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Basket math
  const totalBranded = basket.reduce((acc, item) => acc + item.brandedPrice, 0);
  const totalGeneric = basket.reduce((acc, item) => acc + item.genericPrice, 0);
  const monthlySavings = totalBranded - totalGeneric;
  const annualSavings = monthlySavings * 12;

  const addToBasket = (item: MedicineItem) => {
    if (!basket.some(b => b.id === item.id)) {
      setBasket([...basket, item]);
    }
  };

  const removeFromBasket = (id: string) => {
    setBasket(basket.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/trackers')}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground flex items-center gap-2">
              <span>PM Jan Aushadhi Generic Medicine Switcher</span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Save Up to 85%
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compare expensive branded medicine MRP against Pradhan Mantri Jan Aushadhi generic salts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" /> 10,000+ Kendras in India
          </span>
        </div>
      </div>

      {/* Main Grid: Search Directory & Savings Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Medicine Search Directory */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search bar & Category filters */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 500+ Indian branded medicines (e.g. Augmentin, Cyra-D, Pan-D, Glycomet, Telma, Allegra)..."
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono font-bold bg-muted/60 px-3 py-2 rounded-xl shrink-0">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>{filteredMedicines.length} Medicines</span>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Comparison Cards */}
          <div className="space-y-3">
            {filteredMedicines.map(med => {
              const savingsPct = Math.round(((med.brandedPrice - med.genericPrice) / med.brandedPrice) * 100);
              const isAdded = basket.some(b => b.id === med.id);

              return (
                <motion.div
                  key={med.id}
                  layout
                  className="bg-card border border-border hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {med.category}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        Save {savingsPct}% (₹{med.brandedPrice - med.genericPrice})
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <h3 className="font-heading font-extrabold text-base text-foreground">{med.brandName}</h3>
                      <span className="text-xs text-muted-foreground font-mono">({med.packSize})</span>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <span className="text-primary font-bold">Generic Salt:</span>
                      <span>{med.genericSalt}</span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {med.usage}
                    </p>
                  </div>

                  {/* Price Comparison Block */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-border pt-3 sm:pt-0 gap-2 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-muted-foreground line-through">
                        Branded MRP: ₹{med.brandedPrice}
                      </div>
                      <div className="font-heading font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                        Jan Aushadhi: ₹{med.genericPrice}
                      </div>
                    </div>

                    <button
                      onClick={() => (isAdded ? removeFromBasket(med.id) : addToBasket(med))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isAdded
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-500 hover:to-teal-500'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add to Calculator
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Family Monthly Savings Calculator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-500" /> Family Savings Calculator
              </h3>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                {basket.length} Selected
              </span>
            </div>

            {/* Empty or Populated Basket */}
            {basket.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-muted-foreground text-xs">
                <Pill className="w-8 h-8 mx-auto opacity-40 text-emerald-500" />
                <p>Add your monthly medicines from the left to calculate your family's annual savings.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* List of items */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {basket.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-muted/40 p-2 rounded-lg">
                      <div className="truncate pr-2">
                        <span className="font-bold text-foreground block truncate">{item.brandName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">₹{item.genericPrice} (vs ₹{item.brandedPrice})</span>
                      </div>
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        className="text-rose-500 hover:text-rose-600 p-1"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Calculation Summary Tile */}
                <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/15 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Monthly Branded Bill:</span>
                    <span className="line-through">₹{totalBranded}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>Monthly Generic Bill:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">₹{totalGeneric}</span>
                  </div>
                  <div className="border-t border-emerald-500/20 pt-2 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-foreground">Annual Savings:</span>
                    <span className="font-heading font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                      ₹{annualSavings.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                </div>

                {/* Doctor Substitute Note Generator */}
                <button
                  onClick={() => setShowDoctorSlip(true)}
                  className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4" /> Download Doctor Generic Slip
                </button>
              </div>
            )}

            {/* Official Jan Aushadhi Scheme Details */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-border rounded-xl p-3 text-xs space-y-2 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <Info className="w-4 h-4 text-emerald-500" /> What is PMBJP?
              </div>
              <p className="text-[11px] leading-relaxed">
                Pradhan Mantri Bhartiya Janaushadhi Pariyojana provides WHO-GMP certified generic medicines at 50% to 90% cheaper prices than market brands.
              </p>
              <div className="pt-1 text-[11px] text-foreground font-medium flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>National Helpline: 1800-180-8080</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Printable Doctor Generic Slip */}
      <AnimatePresence>
        {showDoctorSlip && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-foreground">
                    Doctor Generic Prescription Request Slip
                  </h3>
                  <p className="text-xs text-muted-foreground">Show this slip to your doctor or pharmacist</p>
                </div>
                <button
                  onClick={() => setShowDoctorSlip(false)}
                  className="p-1 text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-foreground">
                <p className="italic text-muted-foreground">
                  "Dear Doctor, please consider prescribing generic salt equivalents for the following medicines to help reduce monthly medication costs under PM Jan Aushadhi guidelines:"
                </p>

                <div className="border border-border rounded-xl divide-y divide-border">
                  {basket.map((b, idx) => (
                    <div key={b.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-foreground">{idx + 1}. {b.brandName}</span>
                        <p className="text-[11px] text-primary font-mono">{b.genericSalt}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{b.dosage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-primary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setShowDoctorSlip(false)}
                  className="px-4 py-2.5 bg-muted text-foreground font-semibold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JanAushadhiSwitcher;
