import { AlertCircle, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import FabricDetail from './components/FabricDetail';
import FabricList from './components/FabricList';
import SearchBar from './components/SearchBar';
import useExcelData from './hooks/useExcelData';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFabric, setSelectedFabric] = useState(null);
  const { fabrics: allFabrics, loading, error } = useExcelData('/fabrics.xlsx');
  const [localFabrics, setLocalFabrics] = useState([]);
  const [localError, setLocalError] = useState(null);

  // Carrega do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('bessFabrics');
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length > 0) setLocalFabrics(arr);
      } catch (err) {
        console.error('Erro ao ler dados do localStorage:', err);
      }
    }
  }, []);

  const fabricsToUse = localFabrics.length > 0 ? localFabrics : allFabrics;
  const filteredFabrics = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return fabricsToUse;
    const normalizedCodeQuery = cleanQuery.replace(/[\s-]+/g, '');
    return fabricsToUse.filter(item => {
      const itemCode = String(item['Código'] || '').toLowerCase().replace(/[\s-]+/g, '');
      const itemDesc = String(item['Descrição'] || '').toLowerCase();
      return itemCode.includes(normalizedCodeQuery) || itemDesc.includes(cleanQuery);
    });
  }, [searchQuery, fabricsToUse]);

  const handleSelectFabric = (fabric) => setSelectedFabric(fabric);
  const handleBackToList = () => setSelectedFabric(null);

  // Função para processar upload do Excel e salvar no localStorage
  const handleExcelUpload = async (e) => {
    setLocalError(null);
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[1] || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      const parsedFabrics = sheetData.map(row => ({
        "Código": row["Código"] || '',
        "Origem": row["Orig."] || '',
        "Descrição": row["Descrição"] || '',
        "Preço": parseFloat(row["R$"] || 0),
        "Largura": row["Larg."] || '',
        "Unidade": row["Und."] || '',
        "Gramatura": parseInt(row["G/ml"] || 0),
        "NCM": row["NCM"] || '',
        "Catálogo": row["Catálogo"] || '',
        "Acabamento": row["Acabamento"] || '',
      }));
      setLocalFabrics(parsedFabrics);
      localStorage.setItem('bessFabrics', JSON.stringify(parsedFabrics));
    } catch (err) {
      setLocalError('Erro ao processar Excel: ' + (err.message || 'Formato inválido'));
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('bessFabrics');
    setLocalFabrics([]);
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      {/* Botão de limpar cache */}
      {localFabrics.length > 0 && (
        <button
          title="Apagar cache do Excel"
          onClick={handleClearCache}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: '7px 10px',
            boxShadow: '0 2px 8px var(--shadow-color)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 10
          }}
        >
          <Trash2 size={20} color="#d32f2f" />
          {window.innerWidth > 480 && (
            <span style={{ color: '#d32f2f', fontWeight: 500, fontSize: '0.95em' }}>Limpar cache</span>
          )}
        </button>
      )}
      <header className="header">
        <h1>Bess Tecidos</h1>
        <p>Tabela de Preços Digital</p>
      </header>

      {loading ? (
        <div className="loading">Carregando dados do Excel...</div>
      ) : (error && localFabrics.length === 0) ? (
        <div className="error" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', textAlign: 'center', background: 'var(--light-gray)', borderRadius: 12, boxShadow: '0 2px 12px var(--shadow-color)', padding: '2rem'
        }}>
          <AlertCircle size={48} strokeWidth={2.5} color="#007BFF" style={{ marginBottom: 16 }} />
          <h2 style={{ color: '#007BFF', marginBottom: 8 }}>Não foi possível carregar a tabela</h2>
          <div style={{ color: '#555', marginBottom: 16 }}>Erro: <span style={{ color: '#d32f2f' }}>{error}</span></div>
          <div style={{ fontSize: '1.1em', marginBottom: 18 }}>Para usar offline, envie um arquivo Excel (.xlsx ou .xls):</div>
          <label htmlFor="excelUpload" style={{
            display: 'inline-block', background: 'var(--primary-color)', color: '#fff', padding: '0.7em 1.5em', borderRadius: 8, cursor: 'pointer', fontWeight: 500, marginBottom: 10, boxShadow: '0 2px 8px var(--shadow-color)'
          }}>
            Selecionar arquivo Excel
            <input
              id="excelUpload"
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={handleExcelUpload}
            />
          </label>
          {localError && <div style={{ color: '#d32f2f', marginTop: 8, fontWeight: 500 }}>{localError}</div>}
          <div style={{ color: '#888', fontSize: '0.95em', marginTop: 12 }}>
            O arquivo não é enviado para nenhum servidor, apenas processado localmente no seu dispositivo.
          </div>
        </div>
      ) : fabricsToUse.length === 0 ? (
        <div className="not-found">Nenhum dado encontrado.<br />Verifique se o arquivo está acessível e se o parser está correto.</div>
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