import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ArrowLeft, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      setAuthenticated(true);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const parseNotes = (notes: string | null) => {
    if (!notes) return null;
    try {
      return JSON.parse(notes);
    } catch {
      return null;
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl bg-card shadow-card-fun border border-border p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-foreground mb-2">
              🔒 Halaman Guru
            </h1>
            <p className="text-sm text-muted-foreground font-body mb-6">
              Masukkan password untuk melihat hasil siswa
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password guru..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-center focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {error && <p className="text-sm text-destructive font-body">{error}</p>}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Memverifikasi..." : "Masuk"}
              </button>
            </form>
            <Link to="/" className="inline-block mt-4 text-sm text-muted-foreground hover:text-primary font-body">
              ← Kembali ke halaman utama
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-fun py-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 rounded-xl bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary-foreground" />
            <h1 className="text-2xl font-heading font-extrabold text-primary-foreground">
              📊 Hasil Jawaban Siswa
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {submissions.length === 0 ? (
          <p className="text-center text-muted-foreground font-heading py-8">Belum ada jawaban siswa. 📭</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-body">Total: {submissions.length} jawaban</p>
            {submissions.map((sub, i) => {
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
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div>
                      <h3 className="font-heading font-bold text-foreground">{sub.student_name}</h3>
                      <p className="text-xs text-muted-foreground font-body">
                        {new Date(sub.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      {/* Description text */}
                      {sub.description_text && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">📝 Teks Deskripsi:</p>
                          <p className="text-sm font-body text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                            {sub.description_text}
                          </p>
                        </div>
                      )}

                      {/* Essay */}
                      {notes?.essayText && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">✏️ Essai:</p>
                          <p className="text-sm font-body text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                            {notes.essayText}
                          </p>
                        </div>
                      )}

                      {/* Mind map data */}
                      {notes?.mindMapCenter && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">🧠 Mind Map:</p>
                          <div className="bg-muted/50 p-3 rounded-lg text-sm font-body">
                            <p><span className="font-bold">Pusat:</span> {notes.mindMapCenter}</p>
                            {notes.mindMapBranches && Object.entries(notes.mindMapBranches).map(([key, val]) => (
                              val ? <p key={key}><span className="font-bold capitalize">{key}:</span> {val as string}</p> : null
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Table data */}
                      {Array.isArray(sub.table_data) && sub.table_data.length > 0 && (
                        <div>
                          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">📋 Data Tabel:</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="px-2 py-1 text-left">Nama</th>
                                  <th className="px-2 py-1 text-left">Warna</th>
                                  <th className="px-2 py-1 text-left">Tekstur</th>
                                  <th className="px-2 py-1 text-left">Ukuran</th>
                                  <th className="px-2 py-1 text-left">Rasa</th>
                                  <th className="px-2 py-1 text-left">Manfaat</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(sub.table_data as any[]).map((row: any, ri: number) => (
                                  <tr key={ri} className="border-t border-border">
                                    <td className="px-2 py-1">{row.namaBarang}</td>
                                    <td className="px-2 py-1">{row.warna}</td>
                                    <td className="px-2 py-1">{row.tekstur}</td>
                                    <td className="px-2 py-1">{row.ukuran}</td>
                                    <td className="px-2 py-1">{row.rasa}</td>
                                    <td className="px-2 py-1">{row.manfaat}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
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
