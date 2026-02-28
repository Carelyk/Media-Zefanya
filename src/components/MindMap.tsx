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
          Isi tabel di atas dulu ya! Mind map akan muncul di sini 🌟
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
        <div className="inline-flex flex-col items-center gap-6 min-w-[300px]">
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
                className="flex flex-col items-center gap-3 min-w-[200px] max-w-[280px]"
              >
                {/* Connector line */}
                <div className="w-0.5 h-4 bg-border" />

                {/* Item name node */}
                <div
                  className={`px-5 py-2.5 rounded-2xl font-heading font-bold text-sm shadow-card-fun ${BRANCH_COLORS[idx % BRANCH_COLORS.length]}`}
                >
                  {item.namaBarang}
                </div>

                {/* Sub nodes */}
                <div className="flex gap-3 w-full">
                  {item.deskripsi.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 + 0.2 }}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <div className="w-0.5 h-3 bg-border" />
                      <div className="px-3 py-2 rounded-xl bg-muted text-foreground text-xs font-body text-center border border-border">
                        <span className="font-heading font-bold block text-primary text-[10px] mb-0.5">Deskripsi</span>
                        {item.deskripsi}
                      </div>
                    </motion.div>
                  )}
                  {item.khasiat.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 + 0.3 }}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <div className="w-0.5 h-3 bg-border" />
                      <div className="px-3 py-2 rounded-xl bg-muted text-foreground text-xs font-body text-center border border-border">
                        <span className="font-heading font-bold block text-accent text-[10px] mb-0.5">Khasiat</span>
                        {item.khasiat}
                      </div>
                    </motion.div>
                  )}
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
