export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white">Yükleniyor...</span>
        </div>
      </div>
    </div>
  );
}
