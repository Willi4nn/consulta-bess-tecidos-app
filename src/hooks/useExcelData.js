import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

// Configuração do Worker do PDF.js (necessário para rodar no navegador)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const FRETE_POR_ORIGEM = {
  'Nac.': 8.04,
  'Imp.': 18.17,
  default: 8.04,
};

// --- Funções de Cálculo ---
export function getFretePorKg(origem) {
  if (!origem) return FRETE_POR_ORIGEM.default;
  const key = Object.keys(FRETE_POR_ORIGEM).find(
    (k) => k !== 'default' && origem.toLowerCase().includes(k.toLowerCase())
  );
  return key ? FRETE_POR_ORIGEM[key] : FRETE_POR_ORIGEM.default;
}

export function formatarLinhaFabric(row) {
  // Padronização de nomes de colunas para aceitar variações de Excel/PDF
  const preco =
    parseFloat(String(row['R$'] || row['Preço'] || 0).replace(',', '.')) || 0;
  const gramatura = parseInt(row['G/ml'] || row['Gramatura'] || 0) || 0;
  const origem = row['Orig.'] || row['Origem'] || '';

  const fretePorKg = getFretePorKg(origem);
  const pesoPorMetro = gramatura / 1000;
  const fretePorMetro = pesoPorMetro * fretePorKg;

  return {
    Código: row['Código'] || row['Codigo'] || '',
    Origem: origem,
    Descrição: row['Descrição'] || row['Descricao'] || '',
    Preço: preco,
    PreçoComFrete: parseFloat((preco + fretePorMetro).toFixed(2)),
    FretePorMetro: parseFloat(fretePorMetro.toFixed(2)),
    PesoPorMetro: parseFloat(pesoPorMetro.toFixed(4)),
    FretePorKg: fretePorKg,
    Largura: row['Larg.'] || row['Largura'] || '',
    Unidade: row['Und.'] || row['Unidade'] || 'MET',
    Gramatura: gramatura,
    NCM: row['NCM'] || '',
    Catálogo: row['Catálogo'] || row['Catalogo'] || '',
    Acabamento: row['Acabamento'] || '',
  };
}

// --- Parsers ---

// 1. Parser de Excel
export async function parseExcel(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName =
    workbook.SheetNames.find((n) => n.toLowerCase().includes('tabela')) ||
    workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  return data.map(formatarLinhaFabric);
}

// 2. Parser de PDF (A mágica acontece aqui)
export async function parsePDF(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Agrupa o texto por linhas
    const strings = content.items.map((item) => item.str);
    fullText += strings.join(' ') + '\n';
  }

  // Regex para capturar linhas de tecido baseado no padrão: Código | Origem | Descrição | Preço ...
  // Exemplo de linha: 01021 Nac. VEDA LUZ 28,69 1,4 MET 290 56031490
  const lines = fullText.split('\n');
  const fabrics = [];

  lines.forEach((line) => {
    // Procura por códigos (geralmente 5 dígitos ou algo como 01021-001)
    const match = line.match(
      /^(\d{5}[-\w]*)\s+(Nac\.|Imp\.)\s+(.*?)\s+(\d+[\d,.]*)\s+(\d+[\d,.]*)\s+(\w{3})\s+(\d+)/
    );

    if (match) {
      fabrics.push(
        formatarLinhaFabric({
          Código: match[1],
          'Orig.': match[2],
          Descrição: match[3],
          R$: match[4],
          'Larg.': match[5],
          'Und.': match[6],
          'G/ml': match[7],
        })
      );
    }
  });

  return fabrics;
}

// --- Recalculo de frete (para rates configuráveis pelo usuário) ---
export function recalcularFrete(fabric, freteKg) {
  const fretePorMetro = parseFloat((fabric.PesoPorMetro * freteKg).toFixed(2));
  return {
    ...fabric,
    FretePorKg: freteKg,
    FretePorMetro: fretePorMetro,
    PreçoComFrete: parseFloat((fabric.Preço + fretePorMetro).toFixed(2)),
  };
}

// --- Hook principal: tenta PDF, depois Excel ---
const FILE_CANDIDATES = ['/fabrics.pdf', '/fabrics.xlsx', '/fabrics.xls'];

export function useExcelData() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      for (const url of FILE_CANDIDATES) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;

          const buffer = await response.arrayBuffer();
          const data = url.endsWith('.pdf')
            ? await parsePDF(buffer)
            : await parseExcel(buffer);

          if (data.length > 0) {
            if (!cancelled) {
              setFabrics(data);
              setLoading(false);
            }
            return;
          }
        } catch {
          // tenta o próximo candidato
        }
      }

      if (!cancelled) {
        setError('Nenhum arquivo encontrado (fabrics.pdf, fabrics.xlsx)');
        setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { fabrics, loading, error };
}
