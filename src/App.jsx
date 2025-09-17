import { useMemo, useState } from 'react';
import './App.css';
import FabricDetail from './components/FabricDetail';
import FabricList from './components/FabricList';
import SearchBar from './components/SearchBar';
import useExcelData from './hooks/useExcelData';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFabric, setSelectedFabric] = useState(null);
  const { fabrics: allFabrics, loading, error } = useExcelData('/fabrics.xlsx');

  const filteredFabrics = useMemo(() => {
    // 1. Limpa o texto da busca: remove espaços no início/fim e converte para minúsculas.
    const cleanQuery = searchQuery.trim().toLowerCase();

    if (!cleanQuery) {
      return allFabrics; // Se a busca estiver vazia, retorna tudo.
    }

    // 2. Cria uma versão da busca normalizada para o CÓDIGO (sem espaços ou hífens).
    const normalizedCodeQuery = cleanQuery.replace(/[\s-]+/g, '');

    return allFabrics.filter(item => {
      // Normaliza o código do item da mesma forma que a busca.
      const itemCode = String(item['Código'] || '').toLowerCase().replace(/[\s-]+/g, '');

      // Converte a descrição do item para minúsculas.
      const itemDesc = String(item['Descrição'] || '').toLowerCase();

      // 3. Compara:
      // - O código do item inclui a busca normalizada?
      // - OU a descrição do item inclui a busca limpa?
      return itemCode.includes(normalizedCodeQuery) || itemDesc.includes(cleanQuery);
    });
  }, [searchQuery, allFabrics]);

  const handleSelectFabric = (fabric) => {
    setSelectedFabric(fabric);
  };

  const handleBackToList = () => {
    setSelectedFabric(null);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Bess Tecidos</h1>
        <p>Tabela de Preços Digital</p>
      </header>

      {loading ? (
        <div className="loading">Carregando dados do Excel...</div>
      ) : error ? (
        <div className="error">Erro ao carregar Excel: {error}</div>
      ) : allFabrics.length === 0 ? (
        <div className="not-found">Nenhum dado encontrado no Excel.<br />Verifique se o arquivo está acessível e se o parser está correto.</div>
      ) : (
        <>
          {!selectedFabric && (
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
          )}
          <main className="results-area">
            {selectedFabric ? (
              <FabricDetail fabric={selectedFabric} onBack={handleBackToList} />
            ) : (
              <FabricList fabrics={filteredFabrics} onSelectFabric={handleSelectFabric} />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;