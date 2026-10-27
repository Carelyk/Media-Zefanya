import { motion } from "framer-motion";
import { IconEye, IconHand, IconTongue, IconNose, IconEar, IconBulb, IconMindMap } from "@/components/Icons";

interface Props {
  centerLabel: string;
  onCenterLabelChange: (val: string) => void;
  branches: Record<string, string>;
  onBranchChange: (key: string, val: string) => void;
  readOnlyCenter?: boolean;
}

const BRANCH_CONFIG = [
  { key: "warna", label: "Warna", Icon: IconEye, tape: "washi-pink" },
  { key: "rasa", label: "Rasa", Icon: IconTongue, tape: "washi-yellow" },
  { key: "tekstur", label: "Tekstur", Icon: IconHand, tape: "washi-blue" },
  { key: "aroma", label: "Aroma", Icon: IconNose, tape: "washi-pink" },
  { key: "bunyi", label: "Bunyi", Icon: IconEar, tape: "washi-blue" },
  { key: "manfaat", label: "Manfaat", Icon: IconBulb, tape: "washi-yellow" },
];

const MindMap = ({ centerLabel, onCenterLabelChange, branches, onBranchChange, readOnlyCenter }: Props) => {
  return (
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center gap-2">
        <IconMindMap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        Peta Gagasanku
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-6">
        Isinya sudah terisi otomatis dari catatan indramu. Boleh diperbaiki kalau ada yang salah.
      </p>

      {/* Pusat peta */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-3 bg-fun-pink rounded-full opacity-70 rotate-[-3deg]" />
          <input
            type="text"
            value={centerLabel}
            onChange={(e) => onCenterLabelChange(e.target.value)}
            placeholder="Nama benda..."
            readOnly={readOnlyCenter}
            className={`relative w-40 sm:w-44 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-base text-center shadow-page placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring ${
              readOnlyCenter ? "cursor-default" : ""
            }`}
          />
        </motion.div>

        {/* Garis penghubung putus-putus */}
        <svg viewBox="0 0 300 26" className="w-full max-w-md h-6" aria-hidden>
          <path d="M150 0 V10 M150 10 H40 V26 M150 10 H260 V26 M150 10 V26" fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
        </svg>

        {/* Cabang-cabang */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl">
          {BRANCH_CONFIG.map((branch, i) => (
            <motion.div
              key={branch.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="relative bg-card border border-border rounded-xl pt-4 px-3 pb-3 shadow-sticker"
            >
              <span className={`absolute -top-2.5 left-4 w-12 h-4 rounded-sm opacity-80 rotate-[-4deg] ${branch.tape}`} />
              <label className="flex items-center gap-1.5 font-heading font-bold text-xs text-muted-foreground mb-1.5">
                <branch.Icon className="w-3.5 h-3.5" />
                {branch.label}
              </label>
              <input
                type="text"
                value={branches[branch.key] || ""}
                onChange={(e) => onBranchChange(branch.key, e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-dashed border-input bg-background text-foreground text-center font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { BRANCH_CONFIG };
export default MindMap;
