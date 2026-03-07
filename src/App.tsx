/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DollarSign, Loader2, Package, Ruler, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FabricTable } from './components/FabricTable';
import { Fabric, fetchFabrics } from './data/fabrics';

function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
}: {
  title: string;
  value: string;
  icon: any;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4"
    >
      <div className={`p-3 rounded-xl ${bgColor} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFabrics();
        setFabrics(data);
      } catch (err) {
        console.error('Failed to load fabrics:', err);
        setError('Falha ao carregar os dados dos tecidos.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalFabrics = fabrics.length;
  const averagePrice =
    totalFabrics > 0
      ? fabrics.reduce((acc, curr) => acc + curr.price, 0) / totalFabrics
      : 0;
  const nationalCount = fabrics.filter((f) => f.origin === 'Nac.').length;
  const importedCount = fabrics.filter((f) => f.origin === 'Imp.').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-100">
          <p className="text-red-500 font-medium mb-2">Erro</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-2"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Bess Tecidos
            </h1>
            <p className="text-lg text-gray-500">
              Catálogo digital de tecidos e preços - Fevereiro 2026
            </p>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatsCard
            title="Total de Tecidos"
            value={totalFabrics.toString()}
            icon={Package}
            iconColor="text-blue-600"
            bgColor="bg-blue-600"
          />
          <StatsCard
            title="Preço Médio"
            value={`R$ ${averagePrice.toFixed(2)}`}
            icon={DollarSign}
            iconColor="text-emerald-600"
            bgColor="bg-emerald-600"
          />
          <StatsCard
            title="Nacionais"
            value={nationalCount.toString()}
            icon={Tag}
            iconColor="text-purple-600"
            bgColor="bg-purple-600"
          />
          <StatsCard
            title="Importados"
            value={importedCount.toString()}
            icon={Ruler}
            iconColor="text-orange-600"
            bgColor="bg-orange-600"
          />
        </div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FabricTable data={fabrics} />
        </motion.main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400 pb-8">
          <p>© 2026 Bess Tecidos. Todos os direitos reservados.</p>
          <p className="mt-1">Desenvolvido com React & Vite</p>
        </footer>
      </div>
    </div>
  );
}
