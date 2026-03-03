"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Brain, Zap, Send, Share2, CalendarCheck, Loader2 } from "lucide-react";

interface RoastResult {
  roast: string;
  distortion: string;
  action: string;
}

export default function Home() {
  const [excuse, setExcuse] = useState("");
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!excuse.trim() || loading) return;
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excuse }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Что-то пошло не так.");
        return;
      }

      setResult(data);
    } catch {
      setError("Сеть не выдержала. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const shareText = result
    ? `🔥 NeuroRoast меня уничтожил:\n\n${result.roast}\n\n🧠 Искажение: ${result.distortion}\n\n💊 Рецепт: ${result.action}`
    : "";

  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent("https://hardpsyh.vercel.app")}&text=${encodeURIComponent(shareText)}`;

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-red-500/5 blur-[120px]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-10 relative z-10"
      >
        <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-red-500 via-rose-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
          NeuroRoast
        </h1>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base tracking-wide">
          Анти-коучинг. Только КПТ и хардкор.
        </p>
      </motion.div>

      {/* Input section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-1 shadow-[0_0_40px_rgba(239,68,68,0.08)]">
          <textarea
            value={excuse}
            onChange={(e) => setExcuse(e.target.value.slice(0, 500))}
            placeholder="Напиши своё оправдание для срыва..."
            rows={4}
            className="w-full bg-transparent text-white placeholder-neutral-500 p-4 rounded-xl resize-none focus:outline-none text-sm sm:text-base leading-relaxed"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-xs text-neutral-600">
              {excuse.length}/500
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || !excuse.trim()}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                ${loading
                  ? "bg-red-500/20 text-red-300 animate-pulse cursor-wait"
                  : excuse.trim()
                    ? "bg-gradient-to-r from-red-600 to-rose-500 text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Анализ...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Поставить диагноз
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-xl w-full text-center relative z-10"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-8 w-full max-w-xl relative z-10"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(239,68,68,0.06)] space-y-5">
              {/* Roast */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <Flame className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Прожарка
                  </span>
                </div>
                <p className="text-neutral-200 text-sm leading-relaxed pl-7">
                  {result.roast}
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Distortion */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Brain className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Когнитивное искажение
                  </span>
                </div>
                <p className="text-neutral-200 text-sm leading-relaxed pl-7">
                  {result.distortion}
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Action */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Алгоритм спасения
                  </span>
                </div>
                <p className="text-neutral-200 text-sm leading-relaxed pl-7">
                  {result.action}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-neutral-300 font-medium hover:bg-white/10 hover:border-red-500/30 hover:text-white transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                Поделиться позором
              </a>
              <a
                href="https://t.me/anonosya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600/80 to-rose-500/80 text-sm text-white font-medium hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:scale-[1.02] transition-all duration-300"
              >
                <CalendarCheck className="w-4 h-4" />
                Запишись на сессию
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-auto pt-16 text-neutral-700 text-xs relative z-10"
      >
        NeuroRoast · Не является медицинской рекомендацией
      </motion.p>
    </main>
  );
}
