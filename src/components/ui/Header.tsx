import { Search } from 'lucide-react';
import { motion } from 'motion/react';

export function Header() {
  return (
    <header className="mb-8 sm:mb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-zinc-900 mb-2">
            Catálogo Bess.
          </h1>
          <p className="text-base sm:text-lg text-zinc-500 font-medium max-w-xl">
            Gerencie o estoque de tecidos com precisão. Busque, consulte valores
            e calcule metragens em tempo real.
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 shrink-0 hover:scale-105 transition-transform cursor-default">
          <Search className="h-6 w-6" />
        </div>
      </motion.div>
    </header>
  );
}
