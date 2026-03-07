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

export async function fetchFabrics(): Promise<Fabric[]> {
  try {
    const response = await fetch('/tecidos.csv');
    const csvText = await response.text();

    // Find the line starting with "Código" to identify the header
    const headerIndex = csvText.indexOf('Código,Orig.');
    if (headerIndex === -1) {
      throw new Error('Invalid CSV format: Header not found');
    }

    // Slice the text from the header onwards
    const cleanCsv = csvText.slice(headerIndex);

    return new Promise((resolve, reject) => {
      Papa.parse(cleanCsv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const fabrics: Fabric[] = [];
          let idCounter = 1;

          // Filter out rows that are actually headers or invalid data
          const validRows = (results.data as CsvRow[]).filter((row) => {
            return row['Código'] && row['Código'] !== 'Código' && row['R$'];
          });

          validRows.forEach((row) => {
            try {
              // Parse price: replace comma with dot
              const priceStr =
                row['R$']?.replace(/\./g, '').replace(',', '.') || '0';
              const price = parseFloat(priceStr);

              // Parse width: replace comma with dot
              const widthStr = row['Larg.']?.replace(',', '.') || '0';
              const width = parseFloat(widthStr);

              // Parse grammage
              const grammage = parseInt(row['G/ml'] || '0', 10);

              fabrics.push({
                id: String(idCounter++),
                code: row['Código'] || '',
                origin: row['Orig.'] || '',
                description: row['Descrição'] || '',
                price: isNaN(price) ? 0 : price,
                status: row['Sit.'] || '',
                width: isNaN(width) ? 0 : width,
                unit: row['Und.'] || '',
                grammage: isNaN(grammage) ? 0 : grammage,
                ncm: row['NCM'] || '',
                catalog: row['Catálogo'] || '',
                finish: row['Acabamento'] || '',
              });
            } catch (e) {
              console.warn('Error parsing row:', row, e);
            }
          });

          resolve(fabrics);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    return [];
  }
}

// Keep the empty array as a fallback or initial state if needed,
// but the app should primarily use the fetch function.
export const fabrics: Fabric[] = [];
