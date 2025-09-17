import { AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
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

  // Função para processar upload do Excel
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
    } catch (err) {
      setLocalError('Erro ao processar Excel: ' + (err.message || 'Formato inválido'));
    }
  };

  return (
    <div className="container">
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