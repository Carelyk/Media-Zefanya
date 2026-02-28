import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DescriptionItem } from "@/types/description";

interface Props {
  items: DescriptionItem[];
  text: string;
  onTextChange: (text: string) => void;
}

const FIELD_LABELS: { key: keyof DescriptionItem; label: string }[] = [
  { key: "namaBarang", label: "Nama" },
  { key: "warna", label: "Warna" },
  { key: "tekstur", label: "Tekstur" },
  { key: "ukuran", label: "Ukuran" },
  { key: "rasa", label: "Rasa" },
  { key: "manfaat", label: "Manfaat" },
];

const TextEditor = ({ items, text, onTextChange }: Props) => {
  const filledItems = items.filter((i) => i.namaBarang.trim());

  const keywords = useMemo(() => {
    const kws: { word: string; source: string; field: string }[] = [];
    filledItems.forEach((item) => {
      FIELD_LABELS.forEach(({ key, label }) => {
        const val = (item[key] as string)?.trim();
        if (!val) return;
        val.split(/[\s,.\-;:]+/).filter(w => w.length >= 3).forEach(w => {
          kws.push({ word: w.toLowerCase(), source: w, field: label });
        });
      });
    });
    const seen = new Set<string>();
    return kws.filter(k => {
      if (seen.has(k.word)) return false;
      seen.add(k.word);
      return true;
    });
  }, [filledItems]);

  const missingItemNames = useMemo(() => {
    if (!text.trim()) return [];
    const lower = text.toLowerCase();
    return filledItems
      .filter((item) => item.namaBarang.trim() && !lower.includes(item.namaBarang.trim().toLowerCase()))
      .map((item) => item.namaBarang);
  }, [text, filledItems]);

  const matchedKeywords = useMemo(() => {
    if (!text.trim()) return [];
    const lower = text.toLowerCase();
    return keywords.filter((k) => lower.includes(k.word));
  }, [text, keywords]);

  const completionPercentage = useMemo(() => {
    if (keywords.length === 0) return 0;
    return Math.round((matchedKeywords.length / keywords.length) * 100);
  }, [matchedKeywords, keywords]);

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
      if (earliestMatch > 0) parts.push({ text: remaining.slice(0, earliestMatch), highlighted: false });
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
            {/* Keyword hints */}
            <div className="px-4 py-3 rounded-xl bg-muted/50 border border-border">
              <p className="font-heading font-bold text-xs text-muted-foreground mb-2">💡 Kata kunci yang harus ada di teksmu:</p>
              <div className="flex flex-wrap gap-1.5">
                {keywords.slice(0, 20).map((kw, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-heading font-bold ${
                      text.toLowerCase().includes(kw.word)
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {kw.source}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-heading">
                <span className="text-muted-foreground">Kelengkapan kata kunci:</span>
                <span className={completionPercentage === 100 ? "text-accent font-bold" : "text-warning font-bold"}>
                  {completionPercentage}% ({matchedKeywords.length}/{keywords.length})
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

            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Tuliskan teks deskripsi berdasarkan mind map. Gunakan semua kata kunci dari tabel..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-sm leading-relaxed resize-none"
            />

            {text.trim() && highlightedText && (
              <div className="px-4 py-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs font-heading font-bold text-muted-foreground mb-2">Preview (kata kunci ditandai):</p>
                <p className="font-body text-sm leading-relaxed text-foreground">
                  {highlightedText.map((part, i) =>
                    part.highlighted ? (
                      <mark key={i} className="bg-fun-yellow/40 text-foreground px-0.5 rounded font-bold">{part.text}</mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </p>
              </div>
            )}

            <AnimatePresence>
              {missingItemNames.length > 0 && text.trim() && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/30">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-heading font-bold text-sm text-foreground">Kata kunci belum lengkap!</p>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Belum menyebutkan:{" "}
                      {missingItemNames.map((name, i) => (
                        <span key={name}><span className="font-bold text-warning">{name}</span>{i < missingItemNames.length - 1 ? ", " : ""}</span>
                      ))}
                    </p>
                  </div>
                </motion.div>
              )}
              {missingItemNames.length === 0 && text.trim() && filledItems.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/30">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <p className="font-heading font-bold text-sm text-foreground">Hebat! Semua kata kunci sudah ada! 🎉</p>
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
