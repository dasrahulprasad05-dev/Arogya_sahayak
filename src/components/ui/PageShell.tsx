import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from './motion';

interface Props {
  title: React.ReactNode;
  subtitle?: string;
  gradient?: string;
  children: React.ReactNode;
}

const PageShell: React.FC<Props> = ({ title, subtitle, gradient = 'from-cyan-500 via-primary to-purple-500', children }) => (
  <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"
    className="space-y-10 relative pb-12">
    {/* ambient blobs */}
    <div className="pointer-events-none absolute -z-10 inset-0 overflow-visible">
      <div className="absolute -top-[10%] -left-[15%] w-[450px] h-[450px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] animate-mesh-move" />
      <div className="absolute top-[35%] -right-[10%] w-[550px] h-[550px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }} />
    </div>

    <div className="space-y-2">
      <h1 className={`text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
        {title}
      </h1>
      {subtitle && <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
    
    {children}
  </motion.div>
);

export default PageShell;
