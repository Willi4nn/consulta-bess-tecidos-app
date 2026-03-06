import { useEffect, useState } from 'react';
import { parseExcel, parsePDF } from './fabricService';

export default function useFabricData(fileUrl) {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileUrl) return;

    async function loadData() {
      setLoading(true);
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();

        let data;
        if (fileUrl.toLowerCase().endsWith('.pdf')) {
          data = await parsePDF(arrayBuffer);
        } else {
          data = await parseExcel(arrayBuffer);
        }

        setFabrics(data);
      } catch (err) {
        setError('Falha ao processar arquivo: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [fileUrl]);

  return { fabrics, loading, error };
}
