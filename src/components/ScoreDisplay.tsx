import { motion } from "framer-motion";
import { Trophy, Star, Save } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-fun px-6 py-4 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-primary-foreground" />
        <h2 className="text-xl font-heading font-bold text-primary-foreground">
          🎯 Hasil & Essai
        </h2>
      </div>

      <div className="p-6 space-y-5">
        <div className="px-4 py-3 rounded-xl bg-muted text-sm font-body">
          <p><span className="font-heading font-bold">Nama:</span> {studentName}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-muted/50 border border-border">
          <p className="font-heading font-bold text-sm text-foreground mb-1">
            📝 Penilaian akan dilakukan oleh guru setelah kamu menyimpan jawaban.
          </p>
          <p className="font-body text-xs text-muted-foreground">
            Pastikan semua bagian sudah terisi dengan lengkap sebelum menyimpan.
          </p>
        </div>

        {/* Essay section */}
        <div>
          <label className="block font-heading font-bold text-sm text-foreground mb-2">
            ✏️ Essai tambahan (tuliskan pendapatmu tentang barang yang kamu deskripsikan):
          </label>
          <textarea
            value={essayText}
            onChange={(e) => onEssayChange(e.target.value)}
            placeholder="Tuliskan pendapatmu di sini..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-sm leading-relaxed resize-none"
          />
        </div>

        <button
          onClick={onSave}
          disabled={saving || saved}
          className="flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-xl bg-accent text-accent-foreground font-heading font-bold hover:opacity-90 transition-opacity shadow-fun disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? "✅ Tersimpan!" : saving ? "Menyimpan..." : "Simpan Jawaban"}
        </button>
      </div>
    </motion.div>
  );
};

export default ScoreDisplay;
