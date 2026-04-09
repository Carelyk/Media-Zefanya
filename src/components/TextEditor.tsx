import { useMemo } from "react";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";

interface Props {
  text: string;
  onTextChange: (text: string) => void;
  keywords: string[];
}

const TextEditor = ({ text, onTextChange, keywords }: Props) => {
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
      <div className="bg-gradient-fun px-6 py-4 flex items-center gap-3">
        <PenTool className="w-6 h-6 text-primary-foreground" />
        <h2 className="text-xl font-heading font-bold text-primary-foreground">
          ✍️ Tulis Teks Deskripsi
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="px-4 py-3 rounded-xl bg-muted/50 border border-border">
          <p className="font-heading font-bold text-sm text-foreground">
            📌 Setelah kamu mengisi mind mapping tadi, cobalah membuat teks deskripsimu sesuai apa saja yang kamu ketahui dari pengisian tabel dan mind mapping.
          </p>
        </div>

        {/* Keywords from mind map */}
        {keywords.filter((k) => k.trim()).length > 0 && (
          <div className="px-4 py-3 rounded-xl bg-secondary/30 border border-secondary">
            <p className="font-heading font-bold text-sm text-foreground mb-2">
              🔑 Kata kunci dari Mind Map (harus disebutkan dalam teksmu):
            </p>
            <div className="flex flex-wrap gap-2">
              {keywords.filter((k) => k.trim()).map((kw, i) => {
                const isMatched = text.toLowerCase().includes(kw.trim().toLowerCase());
                return (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition-colors ${
                      isMatched
                        ? "bg-accent/20 text-accent line-through"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {isMatched ? "✅" : "❌"} {kw.trim()}
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
          rows={8}
          className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-sm leading-relaxed resize-none"
        />

        {allMatched ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30"
          >
            <span className="text-lg">✅</span>
            <p className="font-heading font-bold text-sm text-foreground">
              Bagus! Semua kata kunci sudah disebutkan. Lanjut ke langkah berikutnya!
            </p>
          </motion.div>
        ) : text.trim() && unmatched.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/30"
          >
            <span className="text-lg">⚠️</span>
            <p className="font-heading font-bold text-sm text-foreground">
              Masih ada {unmatched.length} kata kunci yang belum disebutkan dalam teksmu.
            </p>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default TextEditor;
