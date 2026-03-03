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
  { key: "tekstur", label: "Tekstur" },
  { key: "ukuran", label: "Ukuran" },
  { key: "rasa", label: "Rasa" },
  { key: "manfaat", label: "Manfaat / Kegunaan" },
];

const DescriptionTable = ({ items, onItemsChange }: Props) => {
  const addRow = () => {
    onItemsChange([
      ...items,
      { id: crypto.randomUUID(), namaBarang: "", warna: "", tekstur: "", ukuran: "", rasa: "", manfaat: "" },
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
      <div className="bg-gradient-fun px-6 py-4 flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary-foreground" />
        <h2 className="text-xl font-heading font-bold text-primary-foreground">
          📝 Tabel Deskripsi Barang
        </h2>
      </div>

      <div className="p-4">
        <p className="font-body text-muted-foreground text-sm mb-4">
          Isilah tabel di bawah ini berdasarkan pengamatan yang sudah kamu lakukan terhadap barang yang kamu pilih. Kosongkan jika tidak ada.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="px-3 py-3 text-left font-heading font-bold text-foreground text-xs w-10">No</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-3 py-3 text-left font-heading font-bold text-foreground text-xs">
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-heading font-bold text-foreground text-xs w-12">Aksi</th>
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
                  <td className="px-3 py-2 font-heading font-bold text-primary text-sm">{index + 1}</td>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-3 py-2">
                      <input
                        type="text"
                        value={item[col.key] as string}
                        onChange={(e) => updateItem(item.id, col.key, e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-xs min-w-[100px]"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:opacity-90 transition-opacity shadow-fun"
        >
          <Plus className="w-4 h-4" />
          Tambah Barang
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="px-4 py-3 rounded-xl bg-muted/50 border border-border">
          <p className="font-heading font-bold text-sm text-foreground">
            📌 Contoh: Setelah mengisi tabel, isilah jawaban di setiap kotak cabang mind map dan tuliskan nama benda yang kamu pilih di tengah cabang.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DescriptionTable;
