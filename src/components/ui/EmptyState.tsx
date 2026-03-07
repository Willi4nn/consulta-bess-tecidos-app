export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 px-5">
      <span className="text-5xl">🔍</span>
      <p className="text-xl font-semibold text-gray-600 mt-2 text-center">
        Poxa, não encontramos esse tecido.
      </p>
      <p className="text-base text-gray-500 text-center">
        Verifique se o nome ou código foi digitado corretamente, ou tente usar
        menos palavras na busca.
      </p>
    </div>
  );
}
