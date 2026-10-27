import { motion } from "framer-motion";
import { IconEye, IconStar } from "@/components/Icons";

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
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center gap-2">
        <IconEye className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        Amati setiap barang
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-5">
        Pilih satu barang yang paling menarik, lalu tuliskan namamu sendiri di bawah gambarnya.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {PRESET_ITEMS.map((item, idx) => {
          const isSelected = selectedItemId === item.id;
          const tilt = idx % 2 === 0 ? "-1.6deg" : "1.4deg";
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: isSelected ? 0 : parseFloat(tilt) }}
              transition={{ delay: idx * 0.04, type: "spring", stiffness: 180, damping: 18 }}
              whileHover={{ y: -4, rotate: 0, scale: 1.02 }}
              onClick={() => onSelectItem(item.id)}
              className={`relative flex flex-col gap-2 p-3 rounded-xl bg-card border-2 cursor-pointer transition-colors shadow-sticker ${
                isSelected ? "border-primary" : "border-border/80 hover:border-primary/40"
              }`}
            >
              {isSelected && (
                <span className="absolute -top-3 right-3 font-note text-xl text-accent -rotate-6">
                  punyamu! ↖
                </span>
              )}
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-lg border border-border"
              />
              <input
                type="text"
                value={itemLabels[item.id] || ""}
                onChange={(e) => onLabelChange(item.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Nama barang..."
                className="w-full px-2 py-1.5 rounded-lg border border-dashed border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-semibold text-xs text-center"
              />
            </motion.div>
          );
        })}
      </div>

      {selectedItemId && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-center"
        >
          <span className="stamp text-sm inline-flex items-center gap-1.5">
            <IconStar className="w-4 h-4" />
            Bagus! Barang sudah dipilih
          </span>
        </motion.div>
      )}
    </div>
  );
};

export { PRESET_ITEMS };
export default MultisensoryCard;
