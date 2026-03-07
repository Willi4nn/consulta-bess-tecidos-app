export function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-sm border border-red-100">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <p className="text-gray-800 font-bold text-xl mb-2">
          Ops! Algo deu errado
        </p>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
