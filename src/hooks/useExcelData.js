import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export function parseExcelToFabrics(sheetData) {
  return sheetData.map((row = {}) => ({
    Código: row['Código'] ?? '',
    Origem: row['Orig.'] ?? '',
    Descrição: row['Descrição'] ?? '',
    Preço: parseFloat(row['R$'] ?? 0) || 0,
    Largura: row['Larg.'] ?? '',
    Unidade: row['Und.'] ?? '',
    Gramatura: parseInt(row['G/ml'] ?? 0) || 0,
    NCM: row['NCM'] ?? '',
    Catálogo: row['Catálogo'] ?? '',
    Acabamento: row['Acabamento'] ?? '',
  }));
}

export default function useExcelData(excelUrl) {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchExcel() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(excelUrl, { signal: controller.signal });
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[1] || workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        const parsedFabrics = parseExcelToFabrics(sheetData);
        if (isMounted) setFabrics(parsedFabrics);
      } catch (err) {
        if (isMounted && err.name !== 'AbortError')
          setError(err.message || 'Erro ao processar Excel');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchExcel();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [excelUrl]);

  return { fabrics, loading, error };
}
