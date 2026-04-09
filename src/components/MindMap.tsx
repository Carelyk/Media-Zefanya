import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface Props {
  centerLabel: string;
  onCenterLabelChange: (val: string) => void;
  branches: Record<string, string>;
  onBranchChange: (key: string, val: string) => void;
  readOnlyCenter?: boolean;
}

const BRANCH_CONFIG = [
  { key: "warna", label: "🎨 Warna", position: "top" },
  { key: "tekstur", label: "🤚 Tekstur", position: "right" },
  { key: "ukuran", label: "📏 Ukuran", position: "bottom" },
  { key: "rasa", label: "👅 Rasa", position: "left" },
  { key: "manfaat", label: "💡 Manfaat", position: "top-right" },
];

const MindMap = ({ centerLabel, onCenterLabelChange, branches, onBranchChange, readOnlyCenter }: Props) => {
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

      <div className="p-6">
        <p className="font-body text-muted-foreground text-sm mb-6">
          {readOnlyCenter
            ? "Nama benda sudah terisi otomatis dari pilihanmu. Isi setiap cabang berdasarkan tabel yang sudah kamu isi."
            : "Tuliskan nama benda yang kamu pilih di tengah, lalu isi setiap cabang berdasarkan tabel yang sudah kamu isi."}
        </p>

        <div className="flex flex-col items-center gap-4">
          {/* Top branch */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-1">
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-bold text-xs">
              {BRANCH_CONFIG[0].label}
            </div>
            <input
              type="text"
              value={branches[BRANCH_CONFIG[0].key] || ""}
              onChange={(e) => onBranchChange(BRANCH_CONFIG[0].key, e.target.value)}
              className="w-40 px-3 py-2 rounded-xl border-2 border-input bg-background text-foreground text-center font-body text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="w-0.5 h-6 bg-border" />
          </motion.div>

          {/* Middle row: left - center - right */}
          <div className="flex items-center gap-3 w-full justify-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-1">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-bold text-xs">
                {BRANCH_CONFIG[3].label}
              </div>
              <input
                type="text"
                value={branches[BRANCH_CONFIG[3].key] || ""}
                onChange={(e) => onBranchChange(BRANCH_CONFIG[3].key, e.target.value)}
                className="w-32 px-3 py-2 rounded-xl border-2 border-input bg-background text-foreground text-center font-body text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </motion.div>

            <div className="h-0.5 w-6 bg-border" />

            {/* Center node */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center"
            >
              <input
                type="text"
                value={centerLabel}
                onChange={(e) => onCenterLabelChange(e.target.value)}
                placeholder="Nama benda..."
                readOnly={readOnlyCenter}
                className={`w-36 px-4 py-3 rounded-2xl bg-gradient-fun text-primary-foreground font-heading font-extrabold text-sm text-center shadow-fun placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring ${readOnlyCenter ? "cursor-default opacity-90" : ""}`}
              />
            </motion.div>

            <div className="h-0.5 w-6 bg-border" />

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-1">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-bold text-xs">
                {BRANCH_CONFIG[1].label}
              </div>
              <input
                type="text"
                value={branches[BRANCH_CONFIG[1].key] || ""}
                onChange={(e) => onBranchChange(BRANCH_CONFIG[1].key, e.target.value)}
                className="w-32 px-3 py-2 rounded-xl border-2 border-input bg-background text-foreground text-center font-body text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </motion.div>
          </div>

          {/* Bottom branches */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-0.5 h-6 bg-border" />
            <div className="flex gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-1">
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-bold text-xs">
                  {BRANCH_CONFIG[2].label}
                </div>
                <input
                  type="text"
                  value={branches[BRANCH_CONFIG[2].key] || ""}
                  onChange={(e) => onBranchChange(BRANCH_CONFIG[2].key, e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border-2 border-input bg-background text-foreground text-center font-body text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-1">
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-bold text-xs">
                  {BRANCH_CONFIG[4].label}
                </div>
                <input
                  type="text"
                  value={branches[BRANCH_CONFIG[4].key] || ""}
                  onChange={(e) => onBranchChange(BRANCH_CONFIG[4].key, e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border-2 border-input bg-background text-foreground text-center font-body text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { BRANCH_CONFIG };
export default MindMap;
