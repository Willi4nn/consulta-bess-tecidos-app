export const formatBRL = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export const formatDecimal = (value: number) =>
  value.toFixed(2).replace('.', ',');

export const calcFreight = (grossTotal: number): number => {
  if (grossTotal <= 0) return 0;
  const netMerchandise = Math.round(grossTotal * 0.665 * 100) / 100;
  const dynamic = netMerchandise * 0.069207;
  return Math.min(80, Math.max(dynamic, 74));
};
