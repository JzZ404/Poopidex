import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="pt-14 px-6 text-center">
        <div className="text-6xl mb-3">💩</div>
        <h1 className="text-4xl font-black text-green-800 tracking-tight">Poopidex</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">Gotta log &apos;em all</p>
      </div>

      {/* Main actions */}
      <div className="flex flex-col items-center gap-4 mt-12 px-6">
        <Link href="/identify" className="w-full max-w-sm">
          <div className="bg-green-700 text-white rounded-3xl p-6 shadow-lg active:scale-95 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">📷</div>
            <h2 className="text-xl font-bold">Identify a Poop</h2>
            <p className="text-green-200 text-sm mt-1">
              Snap or upload a photo — AI identifies the species instantly
            </p>
          </div>
        </Link>

        <Link href="/collection" className="w-full max-w-sm">
          <div className="bg-amber-500 text-white rounded-3xl p-6 shadow-lg active:scale-95 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">📚</div>
            <h2 className="text-xl font-bold">My Collection</h2>
            <p className="text-amber-100 text-sm mt-1">
              Browse your Poopidex cards and discover new species
            </p>
          </div>
        </Link>

        <Link href="/conservation" className="w-full max-w-sm">
          <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-lg active:scale-95 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">🌿</div>
            <h2 className="text-xl font-bold">Conservation</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Rare species alerts, your scat log, and report to scientists
            </p>
          </div>
        </Link>
      </div>

      {/* Recent activity placeholder */}
      <div className="mt-10 px-6 pb-10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Recent Finds
        </h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center text-gray-400 text-sm">
          No finds yet — go explore! 🌲
        </div>
      </div>
    </main>
  );
}
