import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ArrowLeft } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("student_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setSubmissions(data as Submission[]);
      setLoading(false);
    };
    fetch();
  }, []);

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
        {loading ? (
          <p className="text-center text-muted-foreground font-heading">Memuat data...</p>
        ) : submissions.length === 0 ? (
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
