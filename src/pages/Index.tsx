import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, ChevronLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import StudentNameForm from "@/components/StudentNameForm";
import MultisensoryCard, { PRESET_ITEMS } from "@/components/MultisensoryCard";
import DescriptionTable from "@/components/DescriptionTable";
import MindMap from "@/components/MindMap";
import TextEditor from "@/components/TextEditor";
import ScoreDisplay from "@/components/ScoreDisplay";
import { DescriptionItem } from "@/types/description";
import { supabase } from "@/integrations/supabase/client";

const EMPTY_ITEM = (): DescriptionItem => ({
  id: crypto.randomUUID(), namaBarang: "", warna: "", tekstur: "", ukuran: "", rasa: "", manfaat: "",
});

const Index = () => {
  const [studentName, setStudentName] = useState("");
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);

  // Multisensory state
  const [selectedItemId, setSelectedItemId] = useState("");
  const [itemLabels, setItemLabels] = useState<Record<string, string>>({});

  // Table state
  const [items, setItems] = useState<DescriptionItem[]>([EMPTY_ITEM()]);

  // Mind map state
  const [mindMapCenter, setMindMapCenter] = useState("");
  const [mindMapBranches, setMindMapBranches] = useState<Record<string, string>>({});

  // Text & essay state
  const [descText, setDescText] = useState("");
  const [essayText, setEssayText] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Derive the selected item's label for auto-fill
  const selectedItemName = useMemo(() => {
    if (!selectedItemId) return "";
    const label = itemLabels[selectedItemId];
    if (label && label.trim()) return label.trim();
    const preset = PRESET_ITEMS.find((p) => p.id === selectedItemId);
    return preset?.name || "";
  }, [selectedItemId, itemLabels]);

  // Keywords from mind map branches (the actual values students filled)
  const keywords = useMemo(() => {
    return Object.values(mindMapBranches).filter((v) => v.trim());
  }, [mindMapBranches]);

  // Check if all keywords are mentioned in descText
  const allKeywordsMatched = useMemo(() => {
    if (keywords.length === 0) return false;
    const lower = descText.toLowerCase();
    return keywords.every((kw) => lower.includes(kw.trim().toLowerCase()));
  }, [keywords, descText]);

  // When selecting an item, auto-fill the first table row's namaBarang and mindmap center
  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    const label = itemLabels[id];
    const name = (label && label.trim()) ? label.trim() : (PRESET_ITEMS.find((p) => p.id === id)?.name || "");

    // Auto-fill table first row
    setItems((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = { ...updated[0], namaBarang: name };
      }
      return updated;
    });

    // Auto-fill mind map center
    setMindMapCenter(name);
  };

  // Validation per step
  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!selectedItemId && !!selectedItemName;
      case 1:
        return items.length > 0 && items[0].namaBarang.trim() !== "";
      case 2:
        return mindMapCenter.trim() !== "" && Object.values(mindMapBranches).some((v) => v.trim());
      case 3:
        return descText.trim() !== "" && allKeywordsMatched;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceedFromStep(activeStep)) {
      const messages = [
        "Pilih salah satu barang dan isi namanya terlebih dahulu! 🔍",
        "Lengkapi data barang di tabel terlebih dahulu! 📝",
        "Isi nama benda dan minimal satu cabang mind map! 🧠",
        "Tuliskan teks deskripsi dan sebutkan semua kata kunci! ✍️",
      ];
      toast.warning(messages[activeStep] || "Lengkapi bagian ini dulu!");
      return;
    }
    const next = activeStep + 1;
    setActiveStep(next);
    if (next > highestStep) setHighestStep(next);
  };

  const handleStepClick = (i: number) => {
    if (i <= highestStep || i <= activeStep) {
      setActiveStep(i);
    } else {
      toast.warning("Selesaikan langkah sebelumnya terlebih dahulu! ⏳");
    }
  };

  // Sync table → mind map branches whenever table items change
  const syncTableToMindMap = (updatedItems: DescriptionItem[]) => {
    if (updatedItems.length > 0) {
      const first = updatedItems[0];
      setMindMapBranches((prev) => ({
        ...prev,
        warna: first.warna || prev.warna || "",
        tekstur: first.tekstur || prev.tekstur || "",
        ukuran: first.ukuran || prev.ukuran || "",
        rasa: first.rasa || prev.rasa || "",
        manfaat: first.manfaat || prev.manfaat || "",
      }));
    }
  };

  const handleItemsChange = (newItems: DescriptionItem[]) => {
    setItems(newItems);
    syncTableToMindMap(newItems);
  };

  const handleBranchChange = (key: string, val: string) => {
    setMindMapBranches((prev) => ({ ...prev, [key]: val }));
  };

  const handleLabelChange = (id: string, label: string) => {
    setItemLabels((prev) => ({ ...prev, [id]: label }));
    if (id === selectedItemId && label.trim()) {
      setItems((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[0] = { ...updated[0], namaBarang: label.trim() };
        }
        return updated;
      });
      setMindMapCenter(label.trim());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("student_submissions").insert([{
        student_name: studentName,
        table_data: items as any,
        multisensory_notes: JSON.stringify({
          selectedItemId,
          itemLabels,
          mindMapCenter,
          mindMapBranches,
          essayText,
        }),
        description_text: descText,
        score: 0,
        total_keywords: keywords.length,
        matched_keywords: keywords.length,
      }]);
      if (error) {
        console.error("Save error:", error);
        toast.error("Gagal menyimpan. Coba lagi!");
      } else {
        setSaved(true);
        toast.success("Jawaban berhasil disimpan! ✅");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan. Coba lagi!");
    } finally {
      setSaving(false);
    }
  };

  if (!started) {
    return <StudentNameForm onSubmit={(name) => { setStudentName(name); setStarted(true); }} />;
  }

  const steps = [
    { icon: "👀", title: "Pengamatan", desc: "Amati dengan panca indera" },
    { icon: "📝", title: "Isi Tabel", desc: "Lengkapi data barang" },
    { icon: "🧠", title: "Mind Map", desc: "Isi cabang mind map" },
    { icon: "✍️", title: "Tulis Teks", desc: "Buat teks deskripsi" },
    { icon: "🎯", title: "Hasil", desc: "Simpan jawabanmu" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden bg-gradient-fun py-8 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-6xl animate-bounce-gentle">📚</div>
          <div className="absolute top-8 right-20 text-5xl animate-bounce-gentle" style={{ animationDelay: "0.5s" }}>✏️</div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <button
            onClick={() => { setStarted(false); setActiveStep(0); setHighestStep(0); setSaved(false); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
            title="Kembali ke halaman awal"
          >
            <Home className="w-5 h-5" />
          </button>
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
              <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-primary-foreground">Belajar Teks Deskripsi</h1>
            </motion.div>
            <p className="text-primary-foreground/80 font-body">Halo, <span className="font-bold">{studentName}</span>! Ayo mulai belajar! 🚀</p>
          </div>
        </div>
      </header>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 -mt-5 relative z-20">
        <div className="flex gap-2 justify-center flex-wrap">
          {steps.map((step, i) => {
            const isAccessible = i <= highestStep || i <= activeStep;
            return (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-heading font-bold text-xs transition-all shadow-card-fun ${
                  activeStep === i
                    ? "bg-card text-foreground scale-105 border-2 border-primary"
                    : isAccessible
                      ? "bg-card/80 text-muted-foreground border border-border hover:bg-card cursor-pointer"
                      : "bg-muted/50 text-muted-foreground/50 border border-border/50 cursor-not-allowed"
                }`}
                disabled={!isAccessible}
              >
                <span className="text-base">{step.icon}</span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {activeStep === 0 && (
          <MultisensoryCard
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            itemLabels={itemLabels}
            onLabelChange={handleLabelChange}
          />
        )}
        {activeStep === 1 && <DescriptionTable items={items} onItemsChange={handleItemsChange} />}
        {activeStep === 2 && (
          <MindMap
            centerLabel={mindMapCenter}
            onCenterLabelChange={setMindMapCenter}
            branches={mindMapBranches}
            onBranchChange={handleBranchChange}
            readOnlyCenter
          />
        )}
        {activeStep === 3 && (
          <TextEditor
            text={descText}
            onTextChange={setDescText}
            keywords={keywords}
            selectedItemName={selectedItemName}
          />
        )}
        {activeStep === 4 && (
          <ScoreDisplay
            studentName={studentName}
            essayText={essayText}
            onEssayChange={setEssayText}
            onSave={handleSave}
            saving={saving}
            saved={saved}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-3">
          {activeStep > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setActiveStep((s) => s - 1)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-heading font-bold hover:opacity-90 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </motion.button>
          )}
          {activeStep < 4 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:opacity-90 transition-opacity shadow-fun"
            >
              Lanjut ke {steps[activeStep + 1].title}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </main>

      <footer className="text-center py-6 space-y-2">
        <Link to="/hasil" className="text-primary font-heading font-bold text-sm hover:underline">
          📊 Lihat Semua Hasil Siswa
        </Link>
        <p className="text-muted-foreground text-xs font-body">🎓 Belajar Teks Deskripsi untuk Siswa SD Kelas 3</p>
      </footer>
    </div>
  );
};

export default Index;
