"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function IdentifyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleIdentify = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/identify/result?mock=true");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-800">← Back</Link>
        <h1 className="text-2xl font-black text-green-800">Identify</h1>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 pb-10">
        <div
          className="w-full max-w-sm h-72 rounded-3xl border-2 border-dashed border-green-400 bg-green-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
          ) : (
            <div className="text-center px-6">
              <div className="text-5xl mb-3">📸</div>
              <p className="text-green-700 font-semibold">Tap to upload a photo</p>
              <p className="text-gray-400 text-xs mt-1">or take a picture with your camera</p>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

        <div className="flex gap-3 w-full max-w-sm">
          <Button variant="ghost" size="md" className="flex-1" onClick={() => fileInputRef.current?.click()}>📁 Upload</Button>
          <Button variant="ghost" size="md" className="flex-1" onClick={() => fileInputRef.current?.click()}>📷 Camera</Button>
        </div>

        {preview && (
          <Button variant="primary" size="lg" className="w-full max-w-sm" onClick={handleIdentify} disabled={loading}>
            {loading ? "Identifying..." : "🔍 Identify This Poop"}
          </Button>
        )}

        {loading && <div className="text-center text-gray-500 text-sm animate-pulse">AI is analysing the scat...</div>}

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 w-full max-w-sm">
          <p className="text-xs text-amber-700">💡 <strong>Tip:</strong> Get close, make sure lighting is good, and include something for scale.</p>
        </div>
      </div>
    </main>
  );
}
