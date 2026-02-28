import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { DescriptionItem } from "@/types/description";

interface Props {
  items: DescriptionItem[];
}

const BRANCH_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-fun-pink text-primary-foreground",
  "bg-fun-orange text-primary-foreground",
  "bg-fun-cyan text-primary-foreground",
];

const FIELD_LABELS: { key: keyof DescriptionItem; label: string; emoji: string }[] = [
  { key: "warna", label: "Warna", emoji: "🎨" },
  { key: "tekstur", label: "Tekstur", emoji: "🤚" },
  { key: "ukuran", label: "Ukuran", emoji: "📏" },
  { key: "rasa", label: "Rasa", emoji: "👅" },
  { key: "manfaat", label: "Manfaat", emoji: "💡" },
];

const MindMap = ({ items }: Props) => {
  const filledItems = items.filter((i) => i.namaBarang.trim());

  if (filledItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-card shadow-card-fun border border-border p-8 text-center"
      >
        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground font-heading font-semibold">
          Isi tabel dulu ya! Mind map akan muncul di sini 🌟
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-warm px-6 py-4 flex items-center gap-3">
        <Brain className="w-6 h-6 text-primary-foreground" />
        <h2 className="text-xl font-heading font-bold text-primary-foreground">
          🧠 Mind Map Deskripsi
        </h2>
      </div>

      <div className="p-6 flex justify-center">
        <div className="inline-flex flex-col items-center gap-6 w-full">
          {/* Center node */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="px-6 py-3 rounded-2xl bg-gradient-fun text-primary-foreground font-heading font-extrabold text-lg shadow-fun"
          >
            📋 Deskripsi Barang
          </motion.div>

          {/* Branches */}
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {filledItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, type: "spring" }}
                className="flex flex-col items-center gap-3 min-w-[220px] max-w-[300px]"
              >
                <div className="w-0.5 h-4 bg-border" />

                {/* Item name node */}
                <div className={`px-5 py-2.5 rounded-2xl font-heading font-bold text-sm shadow-card-fun ${BRANCH_COLORS[idx % BRANCH_COLORS.length]}`}>
                  {item.namaBarang}
                </div>

                {/* Sub-branches for each field */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  {FIELD_LABELS.map((field, fi) => {
                    const value = (item[field.key] as string)?.trim();
                    if (!value) return null;
                    return (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 + fi * 0.08 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-0.5 h-2 bg-border" />
                        <div className="w-full px-2 py-1.5 rounded-xl bg-muted text-foreground text-[11px] font-body text-center border border-border">
                          <span className="font-heading font-bold block text-primary text-[10px]">
                            {field.emoji} {field.label}
                          </span>
                          {value}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MindMap;
