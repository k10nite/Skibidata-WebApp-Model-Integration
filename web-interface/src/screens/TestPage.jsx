export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl">
        <h1 className="text-6xl font-bold text-green-600 mb-6">
          ✅ Server Works!
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Your dev server is running perfectly.
        </p>
        <div className="space-y-4">
          <a
            href="/plant-selection-kimi"
            className="block bg-green-600 text-white text-center py-4 px-8 rounded-xl text-xl font-semibold hover:bg-green-700 transition-colors"
          >
            🤖 View Kimi's Plant Selection
          </a>
          <a
            href="/compare"
            className="block bg-gray-800 text-white text-center py-4 px-8 rounded-xl text-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            📊 View All Comparisons
          </a>
        </div>
      </div>
    </div>
  );
}
