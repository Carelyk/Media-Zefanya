import { useMemo } from "react";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";

interface Props {
  text: string;
  onTextChange: (text: string) => void;
  keywords: string[];
  selectedItemName?: string;
}

const KEYWORD_LABELS = ["Warna", "Rasa", "Tekstur", "Aroma", "Bunyi", "Manfaat"];

const TextEditor = ({ text, onTextChange, keywords, selectedItemName }: Props) => {
  const { matched, unmatched } = useMemo(() => {
    const lower = text.toLowerCase();
    const matched: string[] = [];
    const unmatched: string[] = [];
    keywords.forEach((kw) => {
      if (kw.trim() && lower.includes(kw.trim().toLowerCase())) {
        matched.push(kw.trim());
      } else if (kw.trim()) {
        unmatched.push(kw.trim());
      }
    });
    return { matched, unmatched };
  }, [text, keywords]);

  const allMatched = keywords.filter((k) => k.trim()).length > 0 && unmatched.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-fun px-4 sm:px-6 py-4 flex items-center gap-3">
        <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-foreground">
          ✍️ Tulis Teks Deskripsi
        </h2>
      </div>

      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border">
          <p className="font-heading font-bold text-xs sm:text-sm text-foreground">
            📌 Deskripsikan barang yang kamu pilih{selectedItemName ? ` (${selectedItemName})` : ""} berdasarkan kata kunci di bawah ini.
          </p>
        </div>

        {/* Keywords */}
        {keywords.filter((k) => k.trim()).length > 0 && (
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-secondary/30 border border-secondary">
            <p className="font-heading font-bold text-xs sm:text-sm text-foreground mb-2">
              🔑 Kata kunci yang harus disebutkan dalam teksmu:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {keywords.filter((k) => k.trim()).map((kw, i) => {
                const isMatched = text.toLowerCase().includes(kw.trim().toLowerCase());
                return (
                  <span
                    key={i}
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-heading font-bold transition-colors ${
                      isMatched
                        ? "bg-accent/20 text-accent line-through"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {isMatched ? "✅" : "❌"} {KEYWORD_LABELS[i] || "Kata kunci"}: {kw.trim()}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Tuliskan teks deskripsi berdasarkan tabel dan mind map yang sudah kamu isi..."
          rows={6}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-xs sm:text-sm leading-relaxed resize-none"
        />

        {allMatched ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-accent/10 border border-accent/30"
          >
            <span className="text-base sm:text-lg">✅</span>
            <p className="font-heading font-bold text-xs sm:text-sm text-foreground">
              Bagus! Semua kata kunci sudah disebutkan. Lanjut ke langkah berikutnya!
            </p>
          </motion.div>
        ) : text.trim() && unmatched.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/30"
          >
            <span className="text-base sm:text-lg">⚠️</span>
            <p className="font-heading font-bold text-xs sm:text-sm text-foreground">
              Masih ada {unmatched.length} kata kunci yang belum disebutkan dalam teksmu.
            </p>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default TextEditor;
