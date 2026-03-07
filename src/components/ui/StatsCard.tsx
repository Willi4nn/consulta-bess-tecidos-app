import { motion } from 'motion/react';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  shadow: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  shadow,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/80 flex items-center gap-4 overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-linear-to-br from-gray-50/50 to-transparent pointer-events-none" />
      <div
        className={`p-3 rounded-xl bg-linear-to-br ${gradient} ${shadow} shrink-0`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="relative">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}
