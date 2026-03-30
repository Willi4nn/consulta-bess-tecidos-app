import { DollarSign, Package, Ruler, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { FabricTable } from './components/FabricTable';
import { ErrorScreen } from './components/ui/ErrorScreen';
import { Header } from './components/ui/Header';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { StatsCard } from './components/ui/StatsCard';
import { useFabrics } from './hooks/useFabrics';

export default function App() {
  const { data: fabrics, loading, error } = useFabrics();

  const stats = useMemo(() => {
    const totalFabrics = fabrics.length;
    const averagePrice =
      totalFabrics > 0
        ? fabrics.reduce((acc, f) => acc + f.price, 0) / totalFabrics
        : 0;
    const nationalCount = fabrics.filter((f) => f.origin === 'Nac.').length;
    const importedCount = fabrics.filter((f) => f.origin === 'Imp.').length;

    return { totalFabrics, averagePrice, nationalCount, importedCount };
  }, [fabrics]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-emerald-200 antialiased relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Header />

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total de Tecidos"
            value={stats.totalFabrics.toString()}
            icon={Package}
            gradient="from-blue-500 to-blue-600"
            shadow="shadow-blue-200 shadow-md"
          />
          <StatsCard
            title="Preço Médio (Metro)"
            value={`R$ ${stats.averagePrice.toFixed(2)}`}
            icon={DollarSign}
            gradient="from-emerald-500 to-teal-600"
            shadow="shadow-emerald-200 shadow-md"
          />
          <StatsCard
            title="Tecidos Nacionais"
            value={stats.nationalCount.toString()}
            icon={Tag}
            gradient="from-violet-500 to-purple-600"
            shadow="shadow-violet-200 shadow-md"
          />
          <StatsCard
            title="Tecidos Importados"
            value={stats.importedCount.toString()}
            icon={Ruler}
            gradient="from-orange-400 to-orange-600"
            shadow="shadow-orange-200 shadow-md"
          />
        </div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FabricTable data={fabrics} />
        </motion.main>

        <footer className="mt-12 text-center text-sm text-gray-400 pb-8">
          <p>
            © 2026{' '}
            <span className="font-medium text-gray-500">Bess Tecidos</span>.
            Todos os direitos reservados.
          </p>
          <p className="mt-1">Desenvolvido com React & Vite</p>
        </footer>
      </div>
    </div>
  );
}
