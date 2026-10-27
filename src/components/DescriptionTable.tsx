import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { IconPencil } from "@/components/Icons";
import { DescriptionItem } from "@/types/description";

interface Props {
  items: DescriptionItem[];
  onItemsChange: (items: DescriptionItem[]) => void;
}

const COLUMNS: { key: keyof DescriptionItem; label: string }[] = [
  { key: "namaBarang", label: "Nama Barang" },
  { key: "warna", label: "Warna" },
  { key: "rasa", label: "Rasa" },
  { key: "tekstur", label: "Tekstur" },
  { key: "aroma", label: "Aroma" },
  { key: "bunyi", label: "Bunyi" },
  { key: "manfaat", label: "Manfaat" },
];

const DescriptionTable = ({ items, onItemsChange }: Props) => {
  const addRow = () => {
    onItemsChange([
      ...items,
      { id: crypto.randomUUID(), namaBarang: "", warna: "", tekstur: "", rasa: "", aroma: "", bunyi: "", manfaat: "" },
    ]);
  };

  const updateItem = (id: string, field: keyof DescriptionItem, value: string) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center gap-2">
        <IconPencil className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        Catatan enam indra
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-5">
        Isilah tabel di bawah ini berdasarkan pengamatanmu. Tidak apa-apa dikosongkan kalau memang tidak ada.
      </p>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-2 py-2.5 text-left font-heading font-bold text-xs text-muted-foreground w-8 border-b-2 border-foreground/25">No</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-2 py-2.5 text-left font-heading font-bold text-xs text-muted-foreground border-b-2 border-foreground/25">
                  {col.label}
                </th>
              ))}
              <th className="px-2 py-2.5 w-10 border-b-2 border-foreground/25" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-dashed border-border"
                >
                  <td className="px-2 py-2 font-heading font-bold text-primary text-sm">{index + 1}</td>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-1 py-1.5">
                      <input
                        type="text"
                        value={item[col.key] as string}
                        onChange={(e) => updateItem(item.id, col.key, e.target.value)}
                        readOnly={col.key === "namaBarang" && index === 0}
                        className={`w-full px-2 py-1.5 rounded-lg border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-ring focus:bg-card font-semibold text-xs sm:text-sm min-w-[80px] sm:min-w-[96px] transition-colors ${
                          col.key === "namaBarang" && index === 0
                            ? "bg-muted/60 text-muted-foreground cursor-default"
                            : "bg-transparent"
                        }`}
                      />
                    </td>
                  ))}
                  <td className="px-1 py-1.5 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Hapus baris ${index + 1}`}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 font-heading font-bold text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Tambah barang lain
      </button>
    </div>
  );
};

export default DescriptionTable;
