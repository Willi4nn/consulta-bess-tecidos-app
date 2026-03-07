export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 px-5">
      <span className="text-5xl">🔍</span>
      <p className="text-base font-semibold text-gray-500 mt-1">
        Nenhum tecido encontrado
      </p>
      <p className="text-sm text-gray-400">
        Tente ajustar o termo de busca ou os filtros
      </p>
    </div>
  );
}
