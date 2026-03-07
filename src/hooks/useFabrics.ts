import { useEffect, useState } from 'react';
import { Fabric, fetchFabrics } from '../data/fabrics';

export function useFabrics() {
  const [data, setData] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFabrics()
      .then(setData)
      .catch(() => setError('Falha ao carregar os dados dos tecidos.'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
