import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50/60 via-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto mb-5 w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        </div>
        <p className="text-gray-700 font-bold text-lg">Carregando tecidos...</p>
        <p className="text-gray-500 text-sm mt-1">
          Só mais um momento, por favor.
        </p>
      </div>
    </div>
  );
}
