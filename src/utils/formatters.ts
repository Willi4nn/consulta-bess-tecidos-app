export const formatBRL = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export const formatDecimal = (value: number) =>
  value.toFixed(2).replace('.', ',');
