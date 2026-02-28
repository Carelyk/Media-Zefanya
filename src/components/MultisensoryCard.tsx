import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, Upload, ImageIcon, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  observations: string;
  onObservationsChange: (text: string) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

const SAMPLE_IMAGES = [
  { name: "Madu 🍯", url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop" },
  { name: "Apel 🍎", url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop" },
  { name: "Batu 🪨", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop" },
];

const MultisensoryCard = ({ observations, onObservationsChange, imageUrl, onImageUrlChange }: Props) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("item-photos").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("item-photos").getPublicUrl(path);
      onImageUrlChange(data.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-warm px-6 py-4 flex items-center gap-3">
        <Eye className="w-6 h-6 text-primary-foreground" />
        <h2 className="text-xl font-heading font-bold text-primary-foreground">
          👀 Pengamatan Multisensorik
        </h2>
      </div>

      <div className="p-6 space-y-5">
        <p className="font-body text-muted-foreground text-sm">
          Amati barang dengan panca indera. Lihat, raba, cium, dan rasakan! Tulis apa yang kamu temukan. 🔍
        </p>

        {/* Image section */}
        <div className="space-y-3">
          <p className="font-heading font-bold text-sm text-foreground">📸 Pilih atau upload foto barang:</p>
          
          {/* Sample images */}
          <div className="flex flex-wrap gap-3">
            {SAMPLE_IMAGES.map((img) => (
              <button
                key={img.name}
                onClick={() => onImageUrlChange(img.url)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                  imageUrl === img.url ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <img src={img.url} alt={img.name} className="w-20 h-16 object-cover rounded-lg" />
                <span className="text-xs font-heading font-bold">{img.name}</span>
              </button>
            ))}
            
            {/* Upload button */}
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 w-[96px] h-[80px] transition-all"
            >
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs font-heading text-muted-foreground">
                {uploading ? "..." : "Upload"}
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>

          {/* Selected image preview */}
          {imageUrl && (
            <div className="relative inline-block">
              <img src={imageUrl} alt="Barang" className="w-full max-w-sm rounded-xl border border-border shadow-card-fun" />
              <button
                onClick={() => onImageUrlChange("")}
                className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Observations */}
        <div>
          <label className="block font-heading font-bold text-sm text-foreground mb-2">
            ✏️ Tulis hasil pengamatanmu:
          </label>
          <textarea
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            placeholder="Contoh: Barang ini berwarna kuning keemasan, teksturnya lengket dan kental, baunya manis, rasanya sangat manis..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-sm leading-relaxed resize-none"
          />
        </div>

        {observations.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30"
          >
            <span className="text-lg">✅</span>
            <p className="font-heading font-bold text-sm text-foreground">
              Bagus! Sekarang lanjut ke tabel untuk menulis lebih detail!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MultisensoryCard;
