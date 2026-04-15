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
  { key: "warna", label: "🎨 Warna" },
  { key: "rasa", label: "👅 Rasa" },
  { key: "tekstur", label: "🤚 Tekstur" },
  { key: "aroma", label: "👃 Aroma" },
  { key: "bunyi", label: "🔔 Bunyi" },
  { key: "manfaat", label: "💡 Manfaat" },
];

const MindMap = ({ centerLabel, onCenterLabelChange, branches, onBranchChange, readOnlyCenter }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-warm px-4 sm:px-6 py-4 flex items-center gap-3">
        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-foreground">
          🧠 Mind Map Deskripsi
        </h2>
      </div>

      <div className="p-4 sm:p-6">
        <p className="font-body text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
          Data sudah terisi otomatis dari tabel. Kamu bisa mengedit jika perlu.
        </p>

        <div className="flex flex-col items-center gap-3 sm:gap-4">
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
              className={`w-32 sm:w-36 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-gradient-fun text-primary-foreground font-heading font-extrabold text-xs sm:text-sm text-center shadow-fun placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring ${readOnlyCenter ? "cursor-default opacity-90" : ""}`}
            />
          </motion.div>

          {/* Branches grid - mobile friendly */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-md">
            {BRANCH_CONFIG.map((branch, i) => (
              <motion.div
                key={branch.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-bold text-[10px] sm:text-xs">
                  {branch.label}
                </div>
                <input
                  type="text"
                  value={branches[branch.key] || ""}
                  onChange={(e) => onBranchChange(branch.key, e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border-2 border-input bg-background text-foreground text-center font-body text-[10px] sm:text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { BRANCH_CONFIG };
export default MindMap;
