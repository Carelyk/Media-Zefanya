import { useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

import maduImg from "@/assets/madu.jpeg";
import loncengImg from "@/assets/lonceng.jpeg";
import berasImg from "@/assets/beras.jpeg";
import kopiImg from "@/assets/kopi.jpeg";
import garamImg from "@/assets/garam.jpeg";
import tehImg from "@/assets/teh.jpeg";
import amplasImg from "@/assets/amplas.jpeg";
import kapasImg from "@/assets/kapas.jpeg";
import karetImg from "@/assets/karet.jpeg";

export interface ItemCard {
  id: string;
  name: string;
  image: string;
  studentLabel: string;
}

const PRESET_ITEMS: Omit<ItemCard, "studentLabel">[] = [
  { id: "madu", name: "Madu", image: maduImg },
  { id: "lonceng", name: "Lonceng", image: loncengImg },
  { id: "beras", name: "Beras", image: berasImg },
  { id: "kopi", name: "Kopi", image: kopiImg },
  { id: "garam", name: "Garam", image: garamImg },
  { id: "teh", name: "Teh", image: tehImg },
  { id: "amplas", name: "Amplas", image: amplasImg },
  { id: "kapas", name: "Kapas", image: kapasImg },
  { id: "karet", name: "Karet", image: karetImg },
];

interface Props {
  selectedItemId: string;
  onSelectItem: (id: string) => void;
  itemLabels: Record<string, string>;
  onLabelChange: (id: string, label: string) => void;
}

const MultisensoryCard = ({ selectedItemId, onSelectItem, itemLabels, onLabelChange }: Props) => {
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

      <div className="p-6 space-y-4">
        <p className="font-body text-muted-foreground text-sm">
          Amati setiap barang dengan panca indera. Tuliskan nama barang di bawah gambar, lalu pilih salah satu untuk dideskripsikan! 🔍
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {PRESET_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedItemId === item.id
                  ? "border-primary bg-primary/10 shadow-fun"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSelectItem(item.id)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <input
                type="text"
                value={itemLabels[item.id] || ""}
                onChange={(e) => onLabelChange(item.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Nama barang..."
                className="w-full px-2 py-1.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-xs text-center"
              />
            </motion.div>
          ))}
        </div>

        {selectedItemId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30"
          >
            <span className="text-lg">✅</span>
            <p className="font-heading font-bold text-sm text-foreground">
              Bagus! Kamu memilih barang untuk dideskripsikan. Lanjut ke tabel!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export { PRESET_ITEMS };
export default MultisensoryCard;
