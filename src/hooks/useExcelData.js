import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function parseExcelToFabrics(sheetData) {
  return sheetData.map(row => ({
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
}

export default function useExcelData(excelUrl) {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchExcel() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(excelUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Em vez de pegar a primeira aba, especifique o nome da aba "Tabela".
        const sheetName = 'Tabela'; 
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
          throw new Error('A aba "Tabela" não foi encontrada no arquivo Excel.');
        }
        
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        const parsedFabrics = parseExcelToFabrics(sheetData);
        if (isMounted) setFabrics(parsedFabrics);
      } catch (err) {
        if (isMounted) setError(err.message || 'Erro ao processar Excel');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchExcel();
    return () => { isMounted = false; };
  }, [excelUrl]);

  return { fabrics, loading, error };
}