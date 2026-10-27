import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, ChevronLeft, Home, Check, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { IconEye, IconPencil, IconMindMap, IconBookOpen, IconRobot, IconTarget, IconStar } from "@/components/Icons";
import StudentNameForm from "@/components/StudentNameForm";
import MultisensoryCard, { PRESET_ITEMS } from "@/components/MultisensoryCard";
import DescriptionTable from "@/components/DescriptionTable";
import MindMap from "@/components/MindMap";
import TextEditor from "@/components/TextEditor";
import AiExpander from "@/components/AiExpander";
import ScoreDisplay from "@/components/ScoreDisplay";
import { DescriptionItem } from "@/types/description";
import { supabase } from "@/integrations/supabase/client";

const EMPTY_ITEM = (): DescriptionItem => ({
  id: crypto.randomUUID(), namaBarang: "", warna: "", tekstur: "", rasa: "", aroma: "", bunyi: "", manfaat: "",
});

const STEPS = [
  { icon: <IconEye className="w-4 h-4" />, title: "Pengamatan", chapter: "Amati Barang" },
  { icon: <IconPencil className="w-4 h-4" />, title: "Isi Tabel", chapter: "Catatan Indra" },
  { icon: <IconMindMap className="w-4 h-4" />, title: "Mind Map", chapter: "Peta Gagasan" },
  { icon: <IconBookOpen className="w-4 h-4" />, title: "Tulis Teks", chapter: "Tulis Deskripsi" },
  { icon: <IconRobot className="w-4 h-4" />, title: "AI", chapter: "Bantuan AI" },
  { icon: <IconTarget className="w-4 h-4" />, title: "Hasil", chapter: "Simpan Karya" },
];

const Index = () => {
  const [studentName, setStudentName] = useState("");
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);
  const [turnDir, setTurnDir] = useState<1 | -1>(1);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [itemLabels, setItemLabels] = useState<Record<string, string>>({});
  const [items, setItems] = useState<DescriptionItem[]>([EMPTY_ITEM()]);
  const [mindMapCenter, setMindMapCenter] = useState("");
  const [mindMapBranches, setMindMapBranches] = useState<Record<string, string>>({});
  const [descText, setDescText] = useState("");
  const [expandedText, setExpandedText] = useState("");
  const [essayText, setEssayText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedItemName = useMemo(() => {
    if (!selectedItemId) return "";
    const label = itemLabels[selectedItemId];
    if (label && label.trim()) return label.trim();
    const preset = PRESET_ITEMS.find((p) => p.id === selectedItemId);
    return preset?.name || "";
  }, [selectedItemId, itemLabels]);

  // Keywords from mind map branches
  const keywords = useMemo(() => {
    const branchKeys = ["warna", "rasa", "tekstur", "aroma", "bunyi", "manfaat"];
    return branchKeys.map((k) => mindMapBranches[k] || "").filter((v) => v.trim());
  }, [mindMapBranches]);

  const allKeywordsMatched = useMemo(() => {
    if (keywords.length === 0) return false;
    const lower = descText.toLowerCase();
    return keywords.every((kw) => lower.includes(kw.trim().toLowerCase()));
  }, [keywords, descText]);

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    const label = itemLabels[id];
    const name = (label && label.trim()) ? label.trim() : (PRESET_ITEMS.find((p) => p.id === id)?.name || "");
    setItems((prev) => {
      const updated = [...prev];
      if (updated.length > 0) updated[0] = { ...updated[0], namaBarang: name };
      return updated;
    });
    setMindMapCenter(name);
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 0: return !!selectedItemId && !!selectedItemName;
      case 1: return items.length > 0 && items[0].namaBarang.trim() !== "";
      case 2: return mindMapCenter.trim() !== "" && Object.values(mindMapBranches).some((v) => v.trim());
      case 3: return descText.trim() !== "" && allKeywordsMatched;
      case 4: return true; // AI step is optional
      default: return true;
    }
  };

  const goToStep = (next: number) => {
    setTurnDir(next > activeStep ? 1 : -1);
    setActiveStep(next);
    if (next > highestStep) setHighestStep(next);
  };

  const handleNext = () => {
    if (!canProceedFromStep(activeStep)) {
      const messages = [
        "Pilih dulu satu barang yang akan kamu deskripsikan!",
        "Isilah nama barang di tabel sebelum membalik halaman!",
        "Isi nama benda dan minimal satu cabang peta gagasan!",
        "Tuliskan teks deskripsimu dan sebutkan semua kata kunci!",
        "Halaman ini boleh dilewati, langsung lanjut saja!",
      ];
      toast.warning(messages[activeStep] || "Lengkapi halaman ini dulu!");
      return;
    }
    goToStep(activeStep + 1);
  };

  const handleStepClick = (i: number) => {
    if (i <= highestStep || i <= activeStep) {
      goToStep(i);
    } else {
      toast.warning("Selesaikan halaman sebelumnya terlebih dahulu!");
    }
  };

  const syncTableToMindMap = (updatedItems: DescriptionItem[]) => {
    if (updatedItems.length > 0) {
      const first = updatedItems[0];
      setMindMapBranches((prev) => ({
        ...prev,
        warna: first.warna || prev.warna || "",
        tekstur: first.tekstur || prev.tekstur || "",
        rasa: first.rasa || prev.rasa || "",
        aroma: first.aroma || prev.aroma || "",
        bunyi: first.bunyi || prev.bunyi || "",
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
        if (updated.length > 0) updated[0] = { ...updated[0], namaBarang: label.trim() };
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
          selectedItemId, itemLabels, mindMapCenter, mindMapBranches, essayText, expandedText,
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
        toast.success("Jawaban berhasil disimpan!");
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

  return (
    <div className="min-h-screen">
      {/* Kepala halaman */}
      <header className="pt-6 sm:pt-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => { setStarted(false); setActiveStep(0); setHighestStep(0); setSaved(false); }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-card border border-border font-heading font-bold text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-sticker"
            title="Kembali ke halaman awal"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Sampul</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Belajar Teks Deskripsi
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Halo, <span className="font-bold text-foreground">{studentName}</span>, mari kita buka bab berikutnya!
            </p>
          </div>
          <div className="w-20 sm:w-28" />
        </div>
      </header>

      {/* Bab-bab buku */}
      <div className="max-w-4xl mx-auto px-4 mt-5">
        <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap">
          {STEPS.map((step, i) => {
            const isAccessible = i <= highestStep || i <= activeStep;
            const isDone = i < highestStep && i !== activeStep;
            return (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                disabled={!isAccessible}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-t-lg font-heading font-bold text-[11px] sm:text-xs transition-all border-2 ${
                  activeStep === i
                    ? "bg-card border-border border-b-card text-foreground -mb-[2px] shadow-[0_-3px_10px_-4px_hsl(var(--foreground)/0.15)]"
                    : isAccessible
                      ? "bg-muted/60 border-transparent text-muted-foreground hover:text-foreground cursor-pointer"
                      : "bg-muted/30 border-transparent text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                <span className="text-sm flex items-center">{isDone ? <Check className="w-4 h-4 text-primary" /> : step.icon}</span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Halaman buku */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pb-4" style={{ perspective: 1600 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep}
            initial={{ rotateY: turnDir * 28, opacity: 0, x: turnDir * 60 }}
            animate={{ rotateY: 0, opacity: 1, x: 0 }}
            exit={{ rotateY: turnDir * -28, opacity: 0, x: turnDir * -60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: turnDir === 1 ? "left center" : "right center" }}
            className="book-page mt-0 px-4 sm:px-10 pt-8 sm:pt-10 pb-7 sm:pb-9"
          >
            <div className="washi washi-pink" style={{ left: 36, transform: "rotate(-5deg)" }} />
            <div className="washi washi-yellow" style={{ right: 44, transform: "rotate(4deg)" }} />
            <div className="bookmark-ribbon" />

            <p className="font-note text-xl sm:text-2xl text-muted-foreground -rotate-1 pl-5">
              bab {activeStep + 1}: {STEPS[activeStep].chapter}
            </p>

            <div className="pl-5">
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
                <AiExpander
                  sourceText={descText}
                  expandedText={expandedText}
                  onExpandedTextChange={setExpandedText}
                />
              )}
              {activeStep === 5 && (
                <ScoreDisplay
                  studentName={studentName}
                  essayText={essayText}
                  onEssayChange={setEssayText}
                  onSave={handleSave}
                  saving={saving}
                  saved={saved}
                />
              )}

              {/* Navigasi halaman */}
              <div className="flex justify-between gap-3 mt-7 pt-5 border-t-2 border-dashed border-border">
                {activeStep > 0 ? (
                  <button
                    onClick={() => goToStep(activeStep - 1)}
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-muted text-foreground font-heading font-bold text-sm hover:bg-muted/70 active:translate-y-0.5 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Balik Halaman
                  </button>
                ) : (
                  <span />
                )}
                {activeStep < 5 && (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.6)]"
                  >
                    {STEPS[activeStep + 1].title}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="text-center py-6 space-y-3">
        <Link to="/hasil" className="inline-flex items-center gap-1.5 text-primary font-heading font-bold text-sm hover:underline">
          <GraduationCap className="w-4 h-4" />
          Halaman Guru: lihat semua jawaban siswa
        </Link>
        <p className="text-muted-foreground text-xs flex items-center justify-center gap-1.5">
          <IconBookOpen className="w-3.5 h-3.5" />
          Belajar Teks Deskripsi untuk Siswa SD Kelas 3
        </p>
      </footer>
    </div>
  );
};

export default Index;
