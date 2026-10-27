import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Trash2, Edit3, Search, ArrowUpDown, Save, X, Star, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Submission {
  id: string;
  student_name: string;
  score: number | null;
  total_keywords: number | null;
  matched_keywords: number | null;
  description_text: string | null;
  multisensory_notes: string | null;
  table_data: any;
  created_at: string;
}

type SortMode = "name" | "score-desc";

const SENSE_COLUMNS = [
  { key: "namaBarang", label: "Nama" },
  { key: "warna", label: "Warna" },
  { key: "rasa", label: "Rasa" },
  { key: "tekstur", label: "Tekstur" },
  { key: "aroma", label: "Aroma" },
  { key: "bunyi", label: "Bunyi" },
  { key: "manfaat", label: "Manfaat" },
] as const;

/* Apresiasi skor: beberapa pilihan kalimat per rentang nilai supaya tidak monoton */
const PRAISE_BANDS: Array<{ min: number; texts: string[] }> = [
  { min: 100, texts: ["Sempurna! Bintang lima untukmu!", "Luar biasa! Nilai sempurna!", "Hebat! Semua kata kunci tercapai!"] },
  { min: 80, texts: ["Kerja bagus! Hampir sempurna!", "Sangat baik! Tinggal selangkah lagi!", "Ide yang kuat, pertahankan!"] },
  { min: 60, texts: ["Bagus! Terus berlatih, ya!", "Sudah baik, bisa dikembangkan lagi!", "Cukup baik, ayo tingkatkan!"] },
  { min: 40, texts: ["Mulai bagus, ayo dilengkapi!", "Usaha yang baik, jangan menyerah!"] },
  { min: 0, texts: ["Terus berlatih, kamu pasti bisa!", "Jangan putus asa, coba lagi ya!"] },
];

const praiseFor = (score: number, name: string) => {
  const band = PRAISE_BANDS.find((b) => score >= b.min) ?? PRAISE_BANDS[PRAISE_BANDS.length - 1];
  return band.texts[(score + name.length) % band.texts.length];
};

const parseNotes = (notes: string | null) => {
  if (!notes) return null;
  try { return JSON.parse(notes); } catch { return null; }
};

/* Nilai satu sel: dari tabel siswa dulu, kalau kosong fallback ke peta gagasan */
const tableCell = (row: any, key: string, notes: any) => {
  const direct = String(row?.[key] ?? "").trim();
  if (direct) return direct;
  if (!notes) return "";
  if (key === "namaBarang") return String(notes.mindMapCenter ?? "").trim();
  return String(notes.mindMapBranches?.[key] ?? "").trim();
};

const senseValue = (sub: Submission, key: string, notes: any) => {
  const rows = Array.isArray(sub.table_data) ? (sub.table_data as any[]) : [];
  const values = rows.map((r) => tableCell(r, key, notes)).filter(Boolean);
  return Array.from(new Set(values)).join(", ");
};

const Stars = ({ score }: { score: number }) => {
  const full = Math.round((score ?? 0) / 20);
  return (
    <span className="inline-flex gap-0.5" aria-label={`${full} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < full ? "fill-current text-primary" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
};

const SORT_OPTIONS: Array<{ mode: SortMode; label: string }> = [
  { mode: "name", label: "Urut Nama" },
  { mode: "score-desc", label: "Nilai Tertinggi" },
];

const Results = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [error, setError] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<string>("0");

  /* kunci scroll body saat modal detail terbuka */
  useEffect(() => {
    if (detailId) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [detailId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-teacher", {
        body: { password },
      });
      if (fnError || !data?.submissions) {
        setError("Password salah. Silakan coba lagi.");
        setLoading(false);
        return;
      }
      setSubmissions(data.submissions as Submission[]);
      setStoredPassword(password);
      setAuthenticated(true);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus jawaban siswa ini?")) return;
    try {
      const { data, error } = await supabase.functions.invoke("verify-teacher", {
        body: { password: storedPassword, action: "delete", submissionId: id },
      });
      if (error || !data?.success) { toast.error("Gagal menghapus."); return; }
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setDetailId(null);
      toast.success("Jawaban berhasil dihapus.");
    } catch { toast.error("Terjadi kesalahan."); }
  };

  const handleUpdateScore = async (id: string) => {
    const scoreNum = Math.min(100, Math.max(0, parseInt(editScore, 10) || 0));
    try {
      const { data, error } = await supabase.functions.invoke("verify-teacher", {
        body: { password: storedPassword, action: "update", submissionId: id, updateData: { score: scoreNum } },
      });
      if (error || !data?.success) { toast.error("Gagal menyimpan."); return; }
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, score: scoreNum } : s));
      setEditingId(null);
      toast.success("Skor berhasil diperbarui.");
    } catch { toast.error("Terjadi kesalahan."); }
  };

  const filteredSubmissions = useMemo(() => {
    let list = [...submissions];
    if (searchQuery.trim()) {
      list = list.filter((s) => s.student_name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    list.sort((a, b) => {
      if (sortMode === "score-desc") {
        return ((b.score ?? -1) - (a.score ?? -1)) || a.student_name.localeCompare(b.student_name, "id");
      }
      const cmp = a.student_name.localeCompare(b.student_name, "id");
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [submissions, searchQuery, sortMode, sortAsc]);

  const detailSubmission = detailId ? submissions.find((s) => s.id === detailId) ?? null : null;
  const detailNotes = parseNotes(detailSubmission?.multisensory_notes ?? null);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="garden-card px-7 py-9 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full sense-tekstur flex items-center justify-center">
              <Lock className="w-7 h-7 text-foreground/70" />
            </div>
            <h1 className="font-heading font-extrabold text-xl mb-1">Halaman Guru</h1>
            <p className="text-sm text-muted-foreground mb-6 text-balance">Masukkan password untuk melihat karya murid-muridmu</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password guru..."
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground text-center font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              {error && <p className="text-sm text-destructive font-semibold">{error}</p>}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.55)] disabled:opacity-40"
              >
                {loading ? "Memverifikasi..." : "Masuk"}
              </button>
            </form>
            <Link to="/" className="inline-block mt-5 text-xs text-muted-foreground hover:text-primary font-semibold">
              Kembali ke halaman siswa
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="pt-6 sm:pt-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-soft"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl">Karya Murid-Muridmu</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">Kumpulan jawaban siswa dari kebun indra</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-input bg-card text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted border border-border">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.mode}
                onClick={() => {
                  if (opt.mode === "name") {
                    if (sortMode === "name") {
                      setSortAsc(!sortAsc);
                    } else {
                      setSortMode("name");
                      setSortAsc(true);
                    }
                  } else {
                    setSortMode(opt.mode);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-colors ${
                  sortMode === opt.mode
                    ? "bg-card text-foreground border border-border shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.mode === "score-desc" ? (
                  <Star className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpDown className="w-3.5 h-3.5" />
                )}
                {opt.mode === "name" ? (sortAsc ? "A → Z" : "Z → A") : opt.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-semibold mb-3">Total: {filteredSubmissions.length} jawaban</p>

        {filteredSubmissions.length === 0 ? (
          <p className="text-center text-muted-foreground font-heading py-10 text-sm">
            {submissions.length === 0 ? "Belum ada jawaban siswa." : "Tidak ditemukan."}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full min-w-[900px] text-xs">
              <thead>
                <tr className="border-b-2 border-border text-left">
                  <th className="px-3 py-2.5 font-heading font-bold whitespace-nowrap">Nama Siswa</th>
                  <th className="px-3 py-2.5 font-heading font-bold whitespace-nowrap">Skor</th>
                  {SENSE_COLUMNS.map((col) => (
                    <th key={col.key} className="px-3 py-2.5 font-heading font-bold whitespace-nowrap">{col.label}</th>
                  ))}
                  <th className="px-3 py-2.5 font-heading font-bold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub, i) => {
                  const notes = parseNotes(sub.multisensory_notes);
                  const score = sub.score ?? 0;
                  return (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="border-b border-dashed border-border last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full sense-rasa flex-none flex items-center justify-center font-heading font-extrabold text-sm">
                            {sub.student_name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-heading font-bold text-foreground text-sm leading-tight">{sub.student_name}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(sub.created_at).toLocaleDateString("id-ID")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap align-middle">
                        <span className="stamp text-[11px]">
                          <Star className="w-3 h-3 fill-current" />
                          {score}
                        </span>
                        <div className="mt-1"><Stars score={score} /></div>
                      </td>
                      {SENSE_COLUMNS.map((col) => {
                        const val = senseValue(sub, col.key as string, notes);
                        return (
                          <td key={col.key} className="px-3 py-2 align-top text-foreground/90">
                            {val || <span className="text-muted-foreground/40">-</span>}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 align-middle whitespace-nowrap">
                        <button
                          onClick={() => setDetailId(sub.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-heading font-bold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Lihat Jawaban
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal detail jawaban */}
      {detailSubmission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-foreground/50 backdrop-blur-sm"
          onClick={() => setDetailId(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="garden-card w-full max-w-2xl max-h-[86vh] overflow-y-auto p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full sense-rasa flex-none flex items-center justify-center font-heading font-extrabold text-lg">
                  {detailSubmission.student_name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h2 className="font-heading font-extrabold text-lg leading-tight">{detailSubmission.student_name}</h2>
                  <p className="text-xs text-muted-foreground">{new Date(detailSubmission.created_at).toLocaleString("id-ID")}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailId(null)}
                aria-label="Tutup"
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Skor + apresiasi */}
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-heading font-bold text-xs text-muted-foreground">Skor:</p>
                  {editingId === detailSubmission.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editScore}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          if (val === "") { setEditScore(""); return; }
                          const num = parseInt(val, 10);
                          if (num <= 100) { setEditScore(String(num)); }
                        }}
                        onBlur={() => setEditScore(String(Math.min(100, parseInt(editScore, 10) || 0)))}
                        aria-label="Skor 0 sampai 100"
                        className="w-16 px-2 py-1 rounded-lg border-2 border-input bg-card text-foreground font-semibold text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button onClick={() => handleUpdateScore(detailSubmission.id)} aria-label="Simpan skor" className="p-1.5 rounded-lg text-primary hover:bg-primary/10"><Save className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingId(null)} aria-label="Batal" className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="stamp text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {detailSubmission.score ?? 0}
                      </span>
                      <Stars score={detailSubmission.score ?? 0} />
                      <button onClick={() => { setEditingId(detailSubmission.id); setEditScore(String(detailSubmission.score ?? 0)); }} aria-label="Edit skor" className="p-1.5 rounded-lg text-primary hover:bg-primary/10"><Edit3 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm font-heading font-bold text-primary text-balance">
                  {praiseFor(detailSubmission.score ?? 0, detailSubmission.student_name)}
                </p>
              </div>

              {detailNotes?.mindMapBranches && (
                <div>
                  <p className="font-heading font-bold text-xs text-muted-foreground mb-1">Kata Kunci:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(detailNotes.mindMapBranches).map(([key, val]) =>
                      val ? (
                        <span key={key} className="px-2.5 py-0.5 rounded-full bg-muted text-foreground font-heading font-bold text-xs capitalize border border-border">
                          {key}: {val as string}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {detailSubmission.description_text && (
                <div>
                  <p className="font-heading font-bold text-xs text-muted-foreground mb-1">Teks Deskripsi:</p>
                  <p className="text-sm text-foreground bg-card border border-border rounded-2xl p-3 whitespace-pre-wrap leading-relaxed">{detailSubmission.description_text}</p>
                </div>
              )}

              {detailNotes?.expandedText && (
                <div>
                  <p className="font-heading font-bold text-xs text-muted-foreground mb-1">Teks Dikembangkan AI:</p>
                  <p className="text-sm text-foreground bg-card border border-border rounded-2xl p-3 whitespace-pre-wrap leading-relaxed">{detailNotes.expandedText}</p>
                </div>
              )}

              {detailNotes?.essayText && (
                <div>
                  <p className="font-heading font-bold text-xs text-muted-foreground mb-1">Esai:</p>
                  <p className="text-sm text-foreground bg-card border border-border rounded-2xl p-3 whitespace-pre-wrap leading-relaxed">{detailNotes.essayText}</p>
                </div>
              )}

              {detailNotes?.mindMapCenter && (
                <div>
                  <p className="font-heading font-bold text-xs text-muted-foreground mb-1">Bunga Gagasan:</p>
                  <div className="bg-card border border-border rounded-2xl p-3 text-sm">
                    <p><span className="font-bold">Nama:</span> {detailNotes.mindMapCenter}</p>
                    {detailNotes.mindMapBranches && Object.entries(detailNotes.mindMapBranches).map(([key, val]) =>
                      val ? <p key={key}><span className="font-bold capitalize">{key}:</span> {val as string}</p> : null
                    )}
                  </div>
                </div>
              )}

              {/* Data tabel: sel kosong diisi dari peta gagasan */}
              <div>
                <p className="font-heading font-bold text-xs text-muted-foreground mb-1">Data Tabel:</p>
                <div className="overflow-x-auto bg-card border border-border rounded-2xl">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b-2 border-border">
                        {SENSE_COLUMNS.map((col) => (
                          <th key={col.key} className="px-2 py-1.5 text-left font-heading font-bold whitespace-nowrap">{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const rows = Array.isArray(detailSubmission.table_data) && (detailSubmission.table_data as any[]).length > 0
                          ? (detailSubmission.table_data as any[])
                          : [{}];
                        return rows.map((row: any, ri: number) => (
                          <tr key={ri} className="border-b border-dashed border-border last:border-0">
                            {SENSE_COLUMNS.map((col) => {
                              const val = tableCell(row, col.key as string, detailNotes);
                              return (
                                <td key={col.key} className="px-2 py-1.5 align-top">
                                  {val || <span className="text-muted-foreground/40">-</span>}
                                </td>
                              );
                            })}
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-border flex justify-end">
                <button
                  onClick={() => handleDelete(detailSubmission.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 font-heading font-bold text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Results;
