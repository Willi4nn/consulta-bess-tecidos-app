import { motion } from 'motion/react';

export function Header() {
  return (
    <header className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white border border-gray-100 rounded-3xl px-8 py-7 shadow-sm overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-linear-to-br from-emerald-100 to-teal-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-linear-to-br from-gray-100 to-gray-50 rounded-full opacity-80 pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-2"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Bess Tecidos
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Catálogo Digital
              </span>
              <span className="text-sm text-gray-400">Fevereiro 2026</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
            <span className="text-2xl">🧵</span>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
