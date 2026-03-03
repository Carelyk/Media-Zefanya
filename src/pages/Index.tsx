import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import StudentNameForm from "@/components/StudentNameForm";
import MultisensoryCard from "@/components/MultisensoryCard";
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

  const handleBranchChange = (key: string, val: string) => {
    setMindMapBranches((prev) => ({ ...prev, [key]: val }));
  };

  const handleLabelChange = (id: string, label: string) => {
    setItemLabels((prev) => ({ ...prev, [id]: label }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from("student_submissions").insert([{
        student_name: studentName,
        table_data: items as any,
        multisensory_notes: JSON.stringify({ selectedItemId, itemLabels, mindMapCenter, mindMapBranches, essayText }),
        description_text: descText,
        score: 0,
        total_keywords: 0,
        matched_keywords: 0,
      }]);
      setSaved(true);
    } catch (err) {
      console.error(err);
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
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-primary-foreground">Belajar Teks Deskripsi</h1>
          </motion.div>
          <p className="text-primary-foreground/80 font-body">Halo, <span className="font-bold">{studentName}</span>! Ayo mulai belajar! 🚀</p>
        </div>
      </header>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 -mt-5 relative z-20">
        <div className="flex gap-2 justify-center flex-wrap">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-heading font-bold text-xs transition-all shadow-card-fun ${
                activeStep === i
                  ? "bg-card text-foreground scale-105 border-2 border-primary"
                  : "bg-card/80 text-muted-foreground border border-border hover:bg-card"
              }`}
            >
              <span className="text-base">{step.icon}</span>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {activeStep === 0 && (
          <MultisensoryCard
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            itemLabels={itemLabels}
            onLabelChange={handleLabelChange}
          />
        )}
        {activeStep === 1 && <DescriptionTable items={items} onItemsChange={setItems} />}
        {activeStep === 2 && (
          <MindMap
            centerLabel={mindMapCenter}
            onCenterLabelChange={setMindMapCenter}
            branches={mindMapBranches}
            onBranchChange={handleBranchChange}
          />
        )}
        {activeStep === 3 && <TextEditor text={descText} onTextChange={setDescText} />}
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
        {activeStep < 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <button
              onClick={() => setActiveStep((s) => s + 1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:opacity-90 transition-opacity shadow-fun"
            >
              Lanjut ke {steps[activeStep + 1].title}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </main>

      <footer className="text-center py-6 space-y-2">
        <Link to="/hasil" className="text-primary font-heading font-bold text-sm hover:underline">
          📊 Lihat Semua Hasil Siswa
        </Link>
        <p className="text-muted-foreground text-xs font-body">🎓 Alat Belajar Teks Deskripsi untuk Siswa SD</p>
      </footer>
    </div>
  );
};

export default Index;
