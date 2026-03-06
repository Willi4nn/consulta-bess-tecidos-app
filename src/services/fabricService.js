// src/services/fabricService.js
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Mesma lógica de frete que você já usa
export const getFretePorKg = (origem) => {
  const FRETE = { 'Nac.': 8.04, 'Imp.': 18.17, default: 8.04 };
  if (!origem) return FRETE.default;
  const key = Object.keys(FRETE).find(
    (k) => k !== 'default' && origem.toLowerCase().includes(k.toLowerCase())
  );
  return key ? FRETE[key] : FRETE.default;
};

// Padroniza o objeto de tecido (importante para o PDF e Excel conversarem)
export const formatFabricRow = (row) => {
  const preco = parseFloat(String(row['R$'] || 0).replace(',', '.')) || 0;
  const gramatura = parseInt(row['G/ml'] || 0) || 0;
  const origem = row['Orig.'] || '';
  const freteKg = getFretePorKg(origem);
  const pesoM = gramatura / 1000;

  return {
    Código: row['Código'] || '',
    Origem: origem,
    Descrição: row['Descrição'] || '',
    Preço: preco,
    PreçoComFrete: parseFloat((preco + pesoM * freteKg).toFixed(2)),
    FretePorMetro: parseFloat((pesoM * freteKg).toFixed(2)),
    PesoPorMetro: parseFloat(pesoM.toFixed(4)),
    FretePorKg: freteKg,
    Largura: row['Larg.'] || '',
    Unidade: row['Und.'] || 'MET',
    Gramatura: gramatura,
    NCM: row['NCM'] || '',
    Catálogo: row['Catálogo'] || '',
    Acabamento: row['Acabamento'] || '',
  };
};

export const parseExcel = (buffer) => {
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[1] || wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet).map(formatFabricRow);
};

export const parsePDF = async (buffer) => {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((s) => s.str).join(' ') + '\n';
  }

  // Regex ajustada para o padrão da sua tabela PDF
  const lines = text.split('\n');
  const results = [];
  lines.forEach((line) => {
    const match = line.match(
      /^(\d{5}[-\w]*)\s+(Nac\.|Imp\.)\s+(.*?)\s+(\d+[\d,.]*)\s+(\d+[\d,.]*)\s+(\w{3})\s+(\d+)/
    );
    if (match) {
      results.push(
        formatFabricRow({
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
  return results;
};
