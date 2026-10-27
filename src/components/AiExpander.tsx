import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IconRobot, IconPencil } from "@/components/Icons";

interface Props {
  sourceText: string;
  expandedText: string;
  onExpandedTextChange: (text: string) => void;
}

const AiExpander = ({ sourceText, expandedText, onExpandedTextChange }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!sourceText.trim()) {
      toast.warning("Salin dulu teks dari halaman sebelumnya!");
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
        toast.success("Teks berhasil dikembangkan!");
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
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center gap-2">
        <IconRobot className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        Bantuan Si Pintar
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-5">
        Halaman ini boleh dilewati. Jika ingin, teksmu bisa dibantu agar lebih rinci dan detail.
      </p>

      {sourceText.trim() && (
        <div className="mb-4 bg-muted/50 border border-border rounded-xl p-4">
          <p className="flex items-center gap-1.5 font-heading font-bold text-xs text-muted-foreground mb-1">
            <IconPencil className="w-3.5 h-3.5" />
            Teks dari halaman sebelumnya:
          </p>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{sourceText}</p>
          <button
            onClick={handleCopySource}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-primary font-heading font-bold text-xs hover:border-primary/50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Salin ke kotak bawah
          </button>
        </div>
      )}

      <div className="book-page overflow-hidden mb-4">
        <div className="washi washi-yellow" style={{ left: 30, transform: "rotate(-4deg)" }} />
        <textarea
          value={expandedText}
          onChange={(e) => onExpandedTextChange(e.target.value)}
          placeholder="Teks hasil pengembangan akan muncul di sini, dan boleh kamu perbaiki sendiri..."
          rows={6}
          className="ruled w-full bg-transparent px-5 sm:px-7 pt-4 pb-4 text-foreground placeholder:text-muted-foreground focus:outline-none font-semibold text-base resize-none"
          style={{ fontSize: "1.05rem" }}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExpand}
          disabled={loading || !expandedText.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.6)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sedang mengembangkan...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Kembangkan dengan AI
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AiExpander;
