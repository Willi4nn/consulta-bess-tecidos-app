export function formatPrice(price) {
  if (typeof price !== 'number') return 'N/D';
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}