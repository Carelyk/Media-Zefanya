import { useState } from "react";
import { motion } from "framer-motion";
import { UserRound, ArrowRight } from "lucide-react";

interface Props {
  onSubmit: (name: string) => void;
}

const StudentNameForm = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl bg-card shadow-card-fun border border-border overflow-hidden">
          <div className="bg-gradient-fun px-6 py-8 text-center">
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ type: "spring" }}
              className="text-6xl mb-4"
            >
              📚
            </motion.div>
            <h1 className="text-2xl font-heading font-extrabold text-primary-foreground">
              Belajar Teks Deskripsi
            </h1>
            <p className="text-primary-foreground/80 font-body mt-2">
              Untuk Siswa SD Kelas 3
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block font-heading font-bold text-sm text-foreground mb-2">
                <UserRound className="w-4 h-4 inline mr-1" />
                Siapa namamu?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ketik nama lengkapmu di sini..."
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-body text-lg"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg hover:opacity-90 transition-opacity shadow-fun disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mulai Belajar! 🚀
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentNameForm;
