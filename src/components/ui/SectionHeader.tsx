import React from 'react';
import type { LucideIcon } from 'lucide-react';

const SectionHeader: React.FC<{ icon: LucideIcon; title: string; count?: number }> = ({ icon: Icon, title, count }) => (
  <div className="relative pl-4 flex items-center justify-between">
    <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full" />
    <div className="flex items-center gap-2.5">
      <Icon className="w-5 h-5 text-primary shrink-0" />
      <h2 className="text-xl font-bold font-heading text-foreground">{title}</h2>
    </div>
    {count !== undefined && (
      <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-full">
        {count} items
      </span>
    )}
  </div>
);

export default React.memo(SectionHeader);
