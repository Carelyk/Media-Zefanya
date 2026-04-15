import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Sparkles } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden"
    >
      <div className="bg-gradient-fun px-4 sm:px-6 py-4 flex items-center gap-3">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-foreground">
          📝 Tabel Deskripsi Barang
        </h2>
      </div>

      <div className="p-3 sm:p-4">
        <p className="font-body text-muted-foreground text-xs sm:text-sm mb-3">
          Isilah tabel di bawah ini berdasarkan pengamatan yang sudah kamu lakukan. Kosongkan jika tidak ada.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left font-heading font-bold text-foreground text-[10px] sm:text-xs w-8 sm:w-10">No</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-2 sm:px-3 py-2 sm:py-3 text-left font-heading font-bold text-foreground text-[10px] sm:text-xs">
                  {col.label}
                </th>
              ))}
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-center font-heading font-bold text-foreground text-[10px] sm:text-xs w-10 sm:w-12">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-heading font-bold text-primary text-xs sm:text-sm">{index + 1}</td>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-2 sm:px-3 py-1.5 sm:py-2">
                      <input
                        type="text"
                        value={item[col.key] as string}
                        onChange={(e) => updateItem(item.id, col.key, e.target.value)}
                        readOnly={col.key === "namaBarang" && index === 0}
                        className={`w-full px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-[10px] sm:text-xs min-w-[70px] sm:min-w-[90px] ${col.key === "namaBarang" && index === 0 ? "bg-muted/50 cursor-default" : ""}`}
                      />
                    </td>
                  ))}
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 sm:p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="p-3 sm:p-4 border-t border-border">
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-fun"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Tambah Barang
        </button>
      </div>
    </motion.div>
  );
};

export default DescriptionTable;
