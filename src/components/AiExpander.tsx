import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  sourceText: string;
  expandedText: string;
  onExpandedTextChange: (text: string) => void;
}

const AiExpander = ({ sourceText, expandedText, onExpandedTextChange }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!sourceText.trim()) {
      toast.warning("Salin dulu teks dari langkah sebelumnya!");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("expand-text", {
        body: { text: sourceText },
      });
      if (error) {
        console.error("AI error:", error);
        toast.error("Gagal menghubungi AI. Coba lagi!");
        return;
      }
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      if (data?.result) {
        onExpandedTextChange(data.result);
        toast.success("Teks berhasil dikembangkan! ✨");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySource = () => {
    onExpandedTextChange(sourceText);
    toast.success("Teks disalin!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-warm px-4 sm:px-6 py-4 flex items-center gap-3">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-foreground">
          🤖 Kembangkan Teks dengan AI
        </h2>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border">
          <p className="font-heading font-bold text-xs sm:text-sm text-foreground">
            📌 Salin kalimat yang sudah berisi kata kunci yang telah kamu rangkai ke bawah ini. Dan tambahkan kalimat "kembangkan kalimat ini agar semakin rinci dan detail untuk menjadi sebuah teks deskripsi"
          </p>
        </div>

        {/* Source text preview */}
        {sourceText.trim() && (
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-secondary/20 border border-secondary">
            <p className="font-heading font-bold text-xs text-muted-foreground mb-1">📝 Teks dari langkah sebelumnya:</p>
            <p className="font-body text-xs sm:text-sm text-foreground whitespace-pre-wrap">{sourceText}</p>
            <button
              onClick={handleCopySource}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-heading font-bold text-xs hover:bg-primary/20 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Salin ke kotak bawah
            </button>
          </div>
        )}

        <textarea
          value={expandedText}
          onChange={(e) => onExpandedTextChange(e.target.value)}
          placeholder="Teks yang sudah disalin akan muncul di sini, lalu tekan tombol AI untuk mengembangkan..."
          rows={6}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-xs sm:text-sm leading-relaxed resize-none"
        />

        <button
          onClick={handleExpand}
          disabled={loading || !expandedText.trim()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto mx-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-fun disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sedang mengembangkan...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              🤖 Kembangkan dengan AI
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default AiExpander;
