import Link from "next/link";

const alertSpecies = [
  { name: "Wolverine", scientific: "Gulo gulo", note: "Population declining. Sightings are extremely valuable to researchers.", level: "critical" },
  { name: "Canada Lynx", scientific: "Lynx canadensis", note: "Federally threatened in parts of the US. Report any scat immediately.", level: "watch" },
];

const recentLogs = [
  { species: "Red Fox", location: "Trail 7, Olympic NP", date: "Apr 12, 2026", fresh: "2–4h" },
  { species: "Black Bear", location: "Ridge Loop, Olympic NP", date: "Apr 10, 2026", fresh: "< 1h" },
];

export default function ConservationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <div className="px-6 pt-8 pb-2">
        <h1 className="text-3xl font-black text-emerald-800">Conservation</h1>
        <p className="text-gray-500 text-sm mt-1">Track rare species, log sightings, contribute to science</p>
      </div>

      <section className="px-6 mt-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">🚨 Species Alerts</h2>
        <div className="space-y-3">
          {alertSpecies.map((s) => (
            <div key={s.name} className={`rounded-2xl border px-4 py-3 ${s.level === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                  <p className="text-xs italic text-gray-500">{s.scientific}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.level === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {s.level === "critical" ? "Critical" : "Watch"}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1.5">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">📍 My Scat Log</h2>
          <Link href="/identify" className="text-xs text-green-700 font-semibold">+ Log New</Link>
        </div>
        <div className="w-full h-44 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3 border border-emerald-200">
          <div className="text-center text-emerald-600">
            <div className="text-3xl mb-1">🗺</div>
            <p className="text-xs font-medium">Map coming soon</p>
            <p className="text-xs text-emerald-400">(Mapbox GL JS)</p>
          </div>
        </div>
        <div className="space-y-2">
          {recentLogs.map((log, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">{log.species}</p>
                <p className="text-xs text-gray-500">📍 {log.location}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{log.date}</p>
                <p className="text-xs text-green-600 font-medium">Fresh: {log.fresh}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 mt-8 pb-10">
        <div className="bg-emerald-700 rounded-2xl p-5 text-white">
          <h2 className="font-bold text-lg mb-1">🔬 Contribute to Science</h2>
          <p className="text-emerald-100 text-sm mb-4">Share your verified scat logs with wildlife research institutions. Your data helps track migration patterns and population health.</p>
          <button className="bg-white text-emerald-700 font-semibold px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform">Report My Findings</button>
        </div>
      </section>
    </main>
  );
}
