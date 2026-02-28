import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import DescriptionTable from "@/components/DescriptionTable";
import MindMap from "@/components/MindMap";
import TextEditor from "@/components/TextEditor";
import { DescriptionItem } from "@/types/description";

const INITIAL_ITEMS: DescriptionItem[] = [
  { id: "1", namaBarang: "Madu", deskripsi: "Cairan manis alami yang dihasilkan oleh lebah", khasiat: "Menyembuhkan batuk, meningkatkan daya tahan tubuh" },
  { id: "2", namaBarang: "", deskripsi: "", khasiat: "" },
];

const Index = () => {
  const [items, setItems] = useState<DescriptionItem[]>(INITIAL_ITEMS);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: "📝", title: "Isi Tabel", desc: "Lengkapi deskripsi barang" },
    { icon: "🧠", title: "Lihat Mind Map", desc: "Peta konsep otomatis" },
    { icon: "✍️", title: "Tulis Teks", desc: "Buat teks deskripsi" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-fun py-12 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-6xl animate-bounce-gentle">📚</div>
          <div className="absolute top-8 right-20 text-5xl animate-bounce-gentle" style={{ animationDelay: "0.5s" }}>✏️</div>
          <div className="absolute bottom-4 left-1/3 text-4xl animate-bounce-gentle" style={{ animationDelay: "1s" }}>🌟</div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <BookOpen className="w-10 h-10 text-primary-foreground" />
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-foreground">
              Belajar Teks Deskripsi
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/90 font-body text-lg max-w-xl mx-auto"
          >
            Isi tabel → Lihat mind map → Tulis teks deskripsi yang lengkap! 🚀
          </motion.p>
        </div>
      </header>

      {/* Steps indicator */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        <div className="flex gap-3 justify-center">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-sm transition-all shadow-card-fun ${
                activeStep === i
                  ? "bg-card text-foreground scale-105 border-2 border-primary"
                  : "bg-card/80 text-muted-foreground border border-border hover:bg-card"
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {activeStep === 0 && <DescriptionTable items={items} onItemsChange={setItems} />}
        {activeStep === 1 && <MindMap items={items} />}
        {activeStep === 2 && <TextEditor items={items} />}

        {/* Navigation hint */}
        {activeStep < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={() => setActiveStep((s) => s + 1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:opacity-90 transition-opacity shadow-fun"
            >
              Lanjut ke {steps[activeStep + 1].title}
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </button>
          </motion.div>
        )}
      </main>

      <footer className="text-center py-6 text-muted-foreground text-xs font-body">
        🎓 Alat Belajar Teks Deskripsi untuk Siswa SD
      </footer>
    </div>
  );
};

export default Index;
