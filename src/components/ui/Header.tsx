import { motion } from 'motion/react';

export function Header() {
  return (
    <header className="mb-4 sm:mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white border border-gray-100 rounded-2xl sm:rounded-3xl px-5 py-5 sm:px-10 sm:py-10 shadow-sm overflow-hidden text-center sm:text-left"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-linear-to-br from-emerald-100 to-teal-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-linear-to-br from-gray-100 to-gray-50 rounded-full opacity-80 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-1 sm:mb-3">
              Catálogo Bess Tecidos
            </h1>
            <p className="hidden sm:block text-base sm:text-lg text-gray-500 max-w-xl">
              Busque por código ou nome. Clique em um tecido para ver mais
              detalhes e calcular valores.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200 shrink-0">
            <span className="text-3xl">🔍</span>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
