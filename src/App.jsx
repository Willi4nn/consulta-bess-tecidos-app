import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import FabricDetail from './components/FabricDetail';
import FabricList from './components/FabricList';
import SearchBar from './components/SearchBar';
import SkeletonLoader from './components/SkeletonLoader';
import { STORAGE_KEY } from './constants';
import { useExcelData } from './hooks/useExcelData';
import { parseExcel, parsePDF } from './services/fabricService';

const SEARCH_DEBOUNCE_MS = 300;

const toastIcons = {
  success: <CheckCircle2 size={20} aria-hidden="true" />,
  error: <AlertCircle size={20} aria-hidden="true" />,
};

const FILE_ACCEPT = '.xlsx, .xls, .pdf';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedFabric, setSelectedFabric] = useState(null);
  const { fabrics: allFabrics, loading, error } = useExcelData();
  const [localFabrics, setLocalFabrics] = useState([]);
  const [localError, setLocalError] = useState(null);
  const [toast, setToast] = useState(null);

  // Debounce para search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Carrega do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length > 0) setLocalFabrics(arr);
      } catch (err) {
        console.error('Erro ao ler dados do localStorage:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Salva os dados do Excel no localStorage após o fetch online
  useEffect(() => {
    if (allFabrics && allFabrics.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allFabrics));
      setLocalFabrics(allFabrics);
    }
  }, [allFabrics]);

  const fabricsToUse = localFabrics.length ? localFabrics : allFabrics;

  const filteredFabrics = useMemo(() => {
    const cleanQuery = debouncedQuery.trim().toLowerCase();
    if (!cleanQuery) return fabricsToUse;

    const normalizedCodeQuery = cleanQuery.replace(/[\s-]+/g, '');
    return fabricsToUse.filter(({ Código = '', Descrição = '' }) => {
      const sanitizedCode = Código.toLowerCase().replace(/[\s-]+/g, '');
      return (
        sanitizedCode.includes(normalizedCodeQuery) ||
        Descrição.toLowerCase().includes(cleanQuery)
      );
    });
  }, [debouncedQuery, fabricsToUse]);

  // Função para processar upload do Excel e salvar no localStorage
  const handleFileUpload = async ({ target }) => {
    setLocalError(null);
    const file = target.files?.[0];
    if (!file) return;

    const isPDF = file.name.toLowerCase().endsWith('.pdf');

    try {
      const buffer = await file.arrayBuffer();
      let parsedFabrics = [];

      if (isPDF) {
        parsedFabrics = await parsePDF(buffer);
      } else {
        parsedFabrics = parseExcel(buffer);
      }

      if (parsedFabrics.length === 0)
        throw new Error('Nenhum dado encontrado no arquivo.');

      setLocalFabrics(parsedFabrics);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedFabrics));

      setToast({
        type: 'success',
        message: `${parsedFabrics.length} tecidos carregados do ${isPDF ? 'PDF' : 'Excel'}!`,
      });
      target.value = '';
    } catch (err) {
      const errorMsg = `Erro ao processar ${isPDF ? 'PDF' : 'Excel'}: ${err.message}`;
      setLocalError(errorMsg);
      setToast({ type: 'error', message: errorMsg });
    }
  };

  // No seu JSX, atualize os botões e labels:
  return (
    <div className="container">
      <header className="header" role="banner">
        <div className="header-top">
          <div className="header-title">
            <h1>Bess Tecidos</h1>
            <p>Tabela de Preços Digital</p>
          </div>
          <label htmlFor="fileUploadBtn" className="btn upload-excel-btn">
            <Upload size={22} aria-hidden="true" />
            <span className="upload-excel-label">
              Substituir Arquivo (PDF/Excel)
            </span>
            <input
              id="fileUploadBtn"
              type="file"
              accept={FILE_ACCEPT} // Use a nova constante aqui
              className="file-input"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          role="alert"
          aria-live="assertive"
        >
          {toastIcons[toast.type] ?? toastIcons.error}
          <span>{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <SkeletonLoader />
        </div>
      ) : fabricsToUse.length === 0 ? (
        error ? (
          <div className="error" role="alert">
            <AlertCircle
              className="error-icon"
              size={48}
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <h2>Não foi possível carregar a tabela</h2>
            <p className="error-message">
              Erro: <span>{error}</span>
            </p>
            <p>Para usar offline, envie um arquivo Excel ou PDF:</p>
            <div className="error-actions">
              <label htmlFor="excelUpload" className="btn upload-excel-btn">
                Selecionar arquivo (PDF/Excel)
                <input
                  id="excelUpload"
                  type="file"
                  accept={FILE_ACCEPT}
                  className="file-input"
                  onChange={handleFileUpload}
                  aria-label="Selecionar arquivo PDF ou Excel para upload"
                />
              </label>
              {localError && <p className="error-message">{localError}</p>}
              <p className="error-note">
                O arquivo não é enviado para nenhum servidor, apenas processado
                localmente no seu dispositivo.
              </p>
            </div>
          </div>
        ) : (
          <div className="not-found">
            Nenhum dado encontrado.
            <br />
            Verifique se o arquivo está acessível e se o parser está correto.
          </div>
        )
      ) : (
        <>
          {!selectedFabric && (
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
          )}
          <main className="results-area">
            {selectedFabric ? (
              <FabricDetail
                fabric={selectedFabric}
                onBack={() => setSelectedFabric(null)}
              />
            ) : (
              <FabricList
                fabrics={filteredFabrics}
                onSelectFabric={setSelectedFabric}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
