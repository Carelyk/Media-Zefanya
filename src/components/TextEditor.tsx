import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DescriptionItem } from "@/types/description";

interface Props {
  items: DescriptionItem[];
}

const TextEditor = ({ items }: Props) => {
  const [text, setText] = useState("");

  const filledItems = items.filter((i) => i.namaBarang.trim());

  // Extract all keywords from table
  const keywords = useMemo(() => {
    const kws: { word: string; source: string; field: string }[] = [];
    filledItems.forEach((item) => {
      if (item.namaBarang.trim()) {
        kws.push({ word: item.namaBarang.trim().toLowerCase(), source: item.namaBarang, field: "Nama" });
      }
      // Extract significant words from deskripsi (3+ chars)
      item.deskripsi.split(/[\s,.\-;:]+/).filter(w => w.length >= 3).forEach(w => {
        kws.push({ word: w.toLowerCase(), source: w, field: "Deskripsi" });
      });
      item.khasiat.split(/[\s,.\-;:]+/).filter(w => w.length >= 3).forEach(w => {
        kws.push({ word: w.toLowerCase(), source: w, field: "Khasiat" });
      });
    });
    // Deduplicate by word
    const seen = new Set<string>();
    return kws.filter(k => {
      if (seen.has(k.word)) return false;
      seen.add(k.word);
      return true;
    });
  }, [filledItems]);

  // Check which item names are missing from text
  const missingItemNames = useMemo(() => {
    if (!text.trim()) return [];
    const lower = text.toLowerCase();
    return filledItems
      .filter((item) => item.namaBarang.trim() && !lower.includes(item.namaBarang.trim().toLowerCase()))
      .map((item) => item.namaBarang);
  }, [text, filledItems]);

  // Check which keywords are present
  const presentKeywords = useMemo(() => {
    if (!text.trim()) return [];
    const lower = text.toLowerCase();
    return keywords.filter((k) => lower.includes(k.word));
  }, [text, keywords]);

  const completionPercentage = useMemo(() => {
    if (filledItems.length === 0) return 0;
    const included = filledItems.filter(
      (item) => item.namaBarang.trim() && text.toLowerCase().includes(item.namaBarang.trim().toLowerCase())
    ).length;
    return Math.round((included / filledItems.length) * 100);
  }, [text, filledItems]);

  // Highlight text with keywords
  const highlightedText = useMemo(() => {
    if (!text.trim()) return null;
    const parts: { text: string; highlighted: boolean }[] = [];
    let remaining = text;
    
    while (remaining.length > 0) {
      let earliestMatch = -1;
      let matchLength = 0;
      
      for (const kw of keywords) {
        const idx = remaining.toLowerCase().indexOf(kw.word);
        if (idx !== -1 && (earliestMatch === -1 || idx < earliestMatch)) {
          earliestMatch = idx;
          matchLength = kw.word.length;
        }
      }
      
      if (earliestMatch === -1) {
        parts.push({ text: remaining, highlighted: false });
        break;
      }
      
      if (earliestMatch > 0) {
        parts.push({ text: remaining.slice(0, earliestMatch), highlighted: false });
      }
      parts.push({ text: remaining.slice(earliestMatch, earliestMatch + matchLength), highlighted: true });
      remaining = remaining.slice(earliestMatch + matchLength);
    }
    
    return parts;
  }, [text, keywords]);

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
        {filledItems.length === 0 ? (
          <p className="text-muted-foreground text-center font-heading py-4">
            Isi tabel deskripsi dulu sebelum menulis teks ya! ☝️
          </p>
        ) : (
          <>
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-heading">
                <span className="text-muted-foreground">Kelengkapan kata kunci:</span>
                <span className={completionPercentage === 100 ? "text-accent font-bold" : "text-warning font-bold"}>
                  {completionPercentage}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${completionPercentage === 100 ? "bg-accent" : "bg-gradient-fun"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Text area */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tuliskan teks deskripsi berdasarkan mind map di atas. Pastikan semua kata kunci dari tabel sudah dimasukkan..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-sm leading-relaxed resize-none"
            />

            {/* Preview with highlights */}
            {text.trim() && highlightedText && (
              <div className="px-4 py-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs font-heading font-bold text-muted-foreground mb-2">Preview (kata kunci ditandai):</p>
                <p className="font-body text-sm leading-relaxed text-foreground">
                  {highlightedText.map((part, i) =>
                    part.highlighted ? (
                      <mark key={i} className="bg-fun-yellow/40 text-foreground px-0.5 rounded font-bold">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </p>
              </div>
            )}

            {/* Warnings */}
            <AnimatePresence>
              {missingItemNames.length > 0 && text.trim() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/30"
                >
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-heading font-bold text-sm text-foreground">
                      Kata kunci belum lengkap!
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Kamu belum menyebutkan:{" "}
                      {missingItemNames.map((name, i) => (
                        <span key={name}>
                          <span className="font-bold text-warning">{name}</span>
                          {i < missingItemNames.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  </div>
                </motion.div>
              )}

              {missingItemNames.length === 0 && text.trim() && filledItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/30"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <p className="font-heading font-bold text-sm text-foreground">
                    Hebat! Semua kata kunci sudah ada! 🎉
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TextEditor;
