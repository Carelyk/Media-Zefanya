import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ArrowLeft, Lock, ChevronDown, ChevronUp, Trash2, Edit3, Search, ArrowUpDown, Save, X } from "lucide-react";
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

const Results = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number>(0);

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

  const parseNotes = (notes: string | null) => {
    if (!notes) return null;
    try { return JSON.parse(notes); } catch { return null; }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus jawaban siswa ini?")) return;
    try {
      const { data, error } = await supabase.functions.invoke("verify-teacher", {
        body: { password: storedPassword, action: "delete", submissionId: id },
      });
      if (error || !data?.success) { toast.error("Gagal menghapus."); return; }
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Jawaban berhasil dihapus.");
    } catch { toast.error("Terjadi kesalahan."); }
  };

  const handleUpdateScore = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-teacher", {
        body: { password: storedPassword, action: "update", submissionId: id, updateData: { score: editScore } },
      });
      if (error || !data?.success) { toast.error("Gagal menyimpan."); return; }
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, score: editScore } : s));
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
      const cmp = a.student_name.localeCompare(b.student_name, "id");
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [submissions, searchQuery, sortAsc]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="rounded-2xl bg-card shadow-card-fun border border-border p-6 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-lg sm:text-xl font-heading font-extrabold text-foreground mb-2">🔒 Halaman Guru</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-body mb-6">Masukkan password untuk melihat hasil siswa</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password guru..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {error && <p className="text-sm text-destructive font-body">{error}</p>}
              <button type="submit" disabled={loading || !password} className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Memverifikasi..." : "Masuk"}
              </button>
            </form>
            <Link to="/" className="inline-block mt-4 text-xs sm:text-sm text-muted-foreground hover:text-primary font-body">← Kembali ke halaman utama</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-fun py-6 sm:py-8 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
          <Link to="/" className="p-1.5 sm:p-2 rounded-xl bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
            <h1 className="text-lg sm:text-2xl font-heading font-extrabold text-primary-foreground">📊 Hasil Jawaban Siswa</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-border bg-background text-foreground font-body text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl border border-border bg-card text-foreground font-heading font-bold text-xs sm:text-sm hover:bg-muted/50 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortAsc ? "A → Z" : "Z → A"}
          </button>
        </div>

        {filteredSubmissions.length === 0 ? (
          <p className="text-center text-muted-foreground font-heading py-8 text-sm">
            {submissions.length === 0 ? "Belum ada jawaban siswa. 📭" : "Tidak ditemukan. 🔍"}
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground font-body">Total: {filteredSubmissions.length} jawaban</p>
            {filteredSubmissions.map((sub, i) => {
              const notes = parseNotes(sub.multisensory_notes);
              const isExpanded = expandedId === sub.id;
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl bg-card shadow-card-fun border border-border overflow-hidden"
                >
                  <button onClick={() => setExpandedId(isExpanded ? null : sub.id)} className="w-full p-3 sm:p-4 flex items-center justify-between text-left">
                    <div>
                      <h3 className="font-heading font-bold text-foreground text-sm sm:text-base">{sub.student_name}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-body">{new Date(sub.created_at).toLocaleString("id-ID")}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>

                  {isExpanded && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 border-t border-border pt-3">
                      {/* Score */}
                      <div className="flex items-center gap-3">
                        <p className="font-heading font-bold text-xs text-muted-foreground">⭐ Skor:</p>
                        {editingId === sub.id ? (
                          <div className="flex items-center gap-2">
                            <input type="number" value={editScore} onChange={(e) => setEditScore(Number(e.target.value))} min={0} max={100} className="w-16 sm:w-20 px-2 py-1 rounded-lg border border-input bg-background text-foreground font-body text-xs sm:text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary" />
                            <button onClick={() => handleUpdateScore(sub.id)} className="p-1.5 rounded-lg text-accent hover:bg-accent/10"><Save className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-body text-xs sm:text-sm text-foreground">{sub.score ?? 0}</span>
                            <button onClick={() => { setEditingId(sub.id); setEditScore(sub.score ?? 0); }} className="p-1.5 rounded-lg text-primary hover:bg-primary/10"><Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></button>
                          </div>
                        )}
                      </div>

                      {/* Kata Kunci */}
                      {notes?.mindMapBranches && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">🔑 Kata Kunci:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(notes.mindMapBranches).map(([key, val]) =>
                              val ? (
                                <span key={key} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-heading font-bold text-[10px] sm:text-xs capitalize">
                                  {key}: {val as string}
                                </span>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}

                      {/* Description text */}
                      {sub.description_text && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">📝 Teks Deskripsi:</p>
                          <p className="text-xs sm:text-sm font-body text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap text-center">{sub.description_text}</p>
                        </div>
                      )}

                      {/* AI Expanded text */}
                      {notes?.expandedText && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">🤖 Teks Dikembangkan AI:</p>
                          <p className="text-xs sm:text-sm font-body text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap text-center">{notes.expandedText}</p>
                        </div>
                      )}

                      {/* Essay */}
                      {notes?.essayText && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">✏️ Essai:</p>
                          <p className="text-xs sm:text-sm font-body text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap text-center">{notes.essayText}</p>
                        </div>
                      )}

                      {/* Mind map */}
                      {notes?.mindMapCenter && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">🧠 Mind Map:</p>
                          <div className="bg-muted/50 p-3 rounded-lg text-xs sm:text-sm font-body">
                            <p><span className="font-bold">Nama:</span> {notes.mindMapCenter}</p>
                            {notes.mindMapBranches && Object.entries(notes.mindMapBranches).map(([key, val]) =>
                              val ? <p key={key}><span className="font-bold capitalize">{key}:</span> {val as string}</p> : null
                            )}
                          </div>
                        </div>
                      )}

                      {/* Table data */}
                      {Array.isArray(sub.table_data) && sub.table_data.length > 0 && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">📋 Data Tabel:</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[10px] sm:text-xs font-body">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="px-2 py-1 text-left">Nama</th>
                                  <th className="px-2 py-1 text-left">Warna</th>
                                  <th className="px-2 py-1 text-left">Rasa</th>
                                  <th className="px-2 py-1 text-left">Tekstur</th>
                                  <th className="px-2 py-1 text-left">Aroma</th>
                                  <th className="px-2 py-1 text-left">Bunyi</th>
                                  <th className="px-2 py-1 text-left">Manfaat</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(sub.table_data as any[]).map((row: any, ri: number) => (
                                  <tr key={ri} className="border-t border-border">
                                    <td className="px-2 py-1">{row.namaBarang}</td>
                                    <td className="px-2 py-1">{row.warna}</td>
                                    <td className="px-2 py-1">{row.rasa}</td>
                                    <td className="px-2 py-1">{row.tekstur}</td>
                                    <td className="px-2 py-1">{row.aroma}</td>
                                    <td className="px-2 py-1">{row.bunyi}</td>
                                    <td className="px-2 py-1">{row.manfaat}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Delete */}
                      <div className="pt-2 border-t border-border flex justify-end">
                        <button onClick={() => handleDelete(sub.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 font-heading font-bold text-xs transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;
