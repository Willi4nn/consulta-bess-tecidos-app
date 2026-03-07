import Papa from 'papaparse';

export interface Fabric {
  id: string;
  code: string;
  origin: string;
  description: string;
  price: number;
  status: string;
  width: number;
  unit: string;
  grammage: number;
  ncm: string;
  catalog: string;
  finish: string;
}

interface CsvRow {
  Código: string;
  'Orig.': string;
  Descrição: string;
  R$: string;
  'Sit.': string;
  'Larg.': string;
  'Und.': string;
  'G/ml': string;
  NCM: string;
  Catálogo: string;
  Acabamento: string;
}

// ── Parsers ───────────────────────────────────────────────────────────────────

const parsePrice = (raw: string) =>
  parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;

const parseWidth = (raw: string) => parseFloat(raw.replace(',', '.')) || 0;

const parseGrammage = (raw: string) => parseInt(raw, 10) || 0;

const isValidRow = (row: CsvRow) =>
  !!row['Código'] && row['Código'] !== 'Código' && !!row['R$'];

// ── Fetcher ───────────────────────────────────────────────────────────────────

export async function fetchFabrics(): Promise<Fabric[]> {
  const response = await fetch('/tecidos.csv');
  const csvText = await response.text();

  const headerIndex = csvText.indexOf('Código,Orig.');
  if (headerIndex === -1) throw new Error('Invalid CSV format: Header not found');

  const cleanCsv = csvText.slice(headerIndex);

  return new Promise((resolve, reject) => {
    Papa.parse(cleanCsv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let idCounter = 1;
        const fabrics = (results.data as CsvRow[])
          .filter(isValidRow)
          .map((row): Fabric => ({
            id: String(idCounter++),
            code: row['Código'] || '',
            origin: row['Orig.'] || '',
            description: row['Descrição'] || '',
            price: parsePrice(row['R$'] || '0'),
            status: row['Sit.'] || '',
            width: parseWidth(row['Larg.'] || '0'),
            unit: row['Und.'] || '',
            grammage: parseGrammage(row['G/ml'] || '0'),
            ncm: row['NCM'] || '',
            catalog: row['Catálogo'] || '',
            finish: row['Acabamento'] || '',
          }));
        resolve(fabrics);
      },
      error: reject,
    });
  });
}

export const fabrics: Fabric[] = [];
