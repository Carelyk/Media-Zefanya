import { motion } from "framer-motion";
import { PenTool } from "lucide-react";

interface Props {
  text: string;
  onTextChange: (text: string) => void;
}

const TextEditor = ({ text, onTextChange }: Props) => {
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

        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Tuliskan teks deskripsi berdasarkan tabel dan mind map yang sudah kamu isi..."
          rows={8}
          className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-sm leading-relaxed resize-none"
        />

        {text.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30"
          >
            <span className="text-lg">✅</span>
            <p className="font-heading font-bold text-sm text-foreground">
              Bagus! Teks deskripsimu sudah ditulis. Lanjut ke langkah berikutnya!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TextEditor;
