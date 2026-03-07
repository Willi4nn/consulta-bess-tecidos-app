export function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-100">
        <p className="text-red-500 font-medium mb-2">Erro</p>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
