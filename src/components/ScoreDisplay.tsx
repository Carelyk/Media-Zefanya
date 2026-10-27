import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { IconTarget, IconPencil, IconStar } from "@/components/Icons";

interface Props {
  studentName: string;
  essayText: string;
  onEssayChange: (text: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}

const ScoreDisplay = ({ studentName, essayText, onEssayChange, onSave, saving, saved }: Props) => {
  return (
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center gap-2">
        <IconTarget className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        Karyamu selesai!
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-5">
        Satu halaman terakhir: tuliskan pendapatmu, lalu simpan jawabanmu untuk Bu Guru.
      </p>

      <div className="flex items-center gap-3 mb-5 bg-muted/50 border border-border rounded-xl px-4 py-3">
        <span className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-heading font-extrabold text-lg">
          {studentName.charAt(0).toUpperCase()}
        </span>
        <p className="text-sm">
          <span className="font-heading font-bold">Penulis:</span>{" "}
          <span className="font-semibold">{studentName}</span>
        </p>
      </div>

      <label className="flex items-center gap-1.5 font-heading font-bold text-sm text-foreground mb-2">
        <IconPencil className="w-4 h-4" />
        Esai tambahan: apa pendapatmu tentang barang ini?
      </label>
      <div className="book-page overflow-hidden mb-5">
        <div className="washi washi-pink" style={{ left: 30, transform: "rotate(-4deg)" }} />
        <textarea
          value={essayText}
          onChange={(e) => onEssayChange(e.target.value)}
          placeholder="Tuliskan pendapatmu di sini..."
          rows={5}
          className="ruled w-full bg-transparent px-5 sm:px-7 pt-4 pb-4 text-foreground placeholder:text-muted-foreground focus:outline-none font-semibold text-base resize-none"
          style={{ fontSize: "1.05rem" }}
        />
      </div>

      <div className="text-center space-y-3">
        <button
          onClick={onSave}
          disabled={saving || saved}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.6)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saved ? "Tersimpan!" : saving ? "Menyimpan..." : "Simpan Jawaban"}
        </button>
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 14 }}
          >
            <span className="stamp text-base inline-flex items-center gap-1.5">
              <IconStar className="w-4 h-4" />
              Hebat! Karyamu sudah dikirim
            </span>
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground">
          Penilaian akan dilakukan oleh guru setelah kamu menyimpan jawaban.
        </p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
