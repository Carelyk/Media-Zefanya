import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { IconPencil, IconKey, IconStar } from "@/components/Icons";

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
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center gap-2">
        <IconPencil className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        Tulis teks deskripsimu
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-5">
        Deskripsikan {selectedItemName ? <span className="font-bold text-foreground">{selectedItemName}</span> : "barang pilihanmu"} dengan kata-katamu sendiri.
      </p>

      {/* Kata kunci sebagai stempel */}
      {keywords.filter((k) => k.trim()).length > 0 && (
        <div className="mb-4">
          <p className="flex items-center gap-1.5 font-heading font-bold text-xs text-muted-foreground mb-2">
            <IconKey className="w-3.5 h-3.5" />
            Kata kunci yang harus muncul di tulisanmu:
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.filter((k) => k.trim()).map((kw, i) => {
              const isMatched = text.toLowerCase().includes(kw.trim().toLowerCase());
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-heading font-bold text-xs transition-all ${
                    isMatched
                      ? "bg-accent/12 text-accent border-2 border-accent -rotate-2"
                      : "bg-muted text-muted-foreground border-2 border-dashed border-border"
                  }`}
                >
                  {isMatched ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full border-2 border-current" />} {KEYWORD_LABELS[i] || "Kata kunci"}: {kw.trim()}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Kertas bergaris */}
      <div className="book-page overflow-hidden">
        <div className="washi washi-blue" style={{ left: 30, transform: "rotate(-4deg)" }} />
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Tuliskan teks deskripsimu di halaman bergaris ini..."
          rows={6}
          className="ruled w-full bg-transparent px-5 sm:px-7 pt-4 pb-4 text-foreground placeholder:text-muted-foreground focus:outline-none font-semibold text-base resize-none"
          style={{ fontSize: "1.05rem" }}
        />
      </div>

      {allMatched ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="flex justify-center mt-4"
        >
          <span className="stamp text-sm inline-flex items-center gap-1.5">
            <IconStar className="w-4 h-4" />
            Lengkap! Semua kata kunci terpakai
          </span>
        </motion.div>
      ) : text.trim() && unmatched.length > 0 ? (
        <p className="mt-3 text-center text-sm text-muted-foreground font-semibold">
          Masih ada {unmatched.length} kata kunci yang belum muncul di tulisanmu.
        </p>
      ) : null}
    </div>
  );
};

export default TextEditor;
