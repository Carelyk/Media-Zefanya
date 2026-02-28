import { motion } from "framer-motion";
import { Trophy, Star, Save } from "lucide-react";

interface Props {
  score: number;
  totalKeywords: number;
  matchedKeywords: number;
  studentName: string;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}

const ScoreDisplay = ({ score, totalKeywords, matchedKeywords, studentName, onSave, saving, saved }: Props) => {
  const getEmoji = () => {
    if (score >= 90) return "🏆";
    if (score >= 70) return "⭐";
    if (score >= 50) return "👍";
    return "💪";
  };

  const getMessage = () => {
    if (score >= 90) return "Luar biasa! Kamu hebat sekali!";
    if (score >= 70) return "Bagus! Hampir sempurna!";
    if (score >= 50) return "Lumayan! Coba tambah lagi kata kuncinya!";
    return "Ayo semangat! Cek kembali mind map-nya!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-fun px-6 py-4 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-primary-foreground" />
        <h2 className="text-xl font-heading font-bold text-primary-foreground">
          🎯 Skor Kamu
        </h2>
      </div>

      <div className="p-6 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-7xl"
        >
          {getEmoji()}
        </motion.div>

        <div>
          <p className="font-heading font-extrabold text-4xl text-primary">{score}</p>
          <p className="font-heading text-muted-foreground text-sm">dari 100 poin</p>
        </div>

        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < Math.ceil(score / 20) ? "text-fun-yellow fill-fun-yellow" : "text-muted"}`}
            />
          ))}
        </div>

        <p className="font-body text-foreground">{getMessage()}</p>

        <div className="px-4 py-3 rounded-xl bg-muted text-sm font-body space-y-1">
          <p><span className="font-heading font-bold">Nama:</span> {studentName}</p>
          <p><span className="font-heading font-bold">Kata kunci cocok:</span> {matchedKeywords} dari {totalKeywords}</p>
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
