import { motion } from 'motion/react';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  shadow: string; // Podemos ignorar a prop shadow antiga e forçar uma mais moderna
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-white/70 backdrop-blur-xl p-5 sm:p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 ring-1 ring-zinc-200/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden group"
    >
      <div
        className={`p-3.5 rounded-2xl bg-linear-to-br ${gradient} shadow-lg shrink-0 transition-transform group-hover:scale-110 duration-300`}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <div className="relative">
        <p className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}
