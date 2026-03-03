import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ArrowLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Submission {
  id: string;
  student_name: string;
  score: number;
  total_keywords: number;
  matched_keywords: number;
  description_text: string;
  created_at: string;
}

const Results = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
            {submissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card shadow-card-fun border border-border p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-foreground">{sub.student_name}</h3>
                  <span className={`px-3 py-1 rounded-full font-heading font-bold text-sm ${
                    sub.score >= 70 ? "bg-accent/20 text-accent" : sub.score >= 50 ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
                  }`}>
                    Skor: {sub.score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body mb-2">
                  {new Date(sub.created_at).toLocaleString("id-ID")} · Kata kunci: {sub.matched_keywords}/{sub.total_keywords}
                </p>
                {sub.description_text && (
                  <p className="text-sm font-body text-foreground bg-muted/50 p-3 rounded-lg line-clamp-3">
                    {sub.description_text}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;
