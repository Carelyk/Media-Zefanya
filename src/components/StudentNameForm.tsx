import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { IconHeart } from "@/components/Icons";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg"
      >
        <div className="book-page px-7 sm:px-12 pt-12 pb-8">
          <div className="washi washi-pink left-8" style={{ left: 40, transform: "rotate(-5deg)" }} />
          <div className="washi washi-blue" style={{ right: 52, transform: "rotate(4deg)" }} />
          <div className="bookmark-ribbon" />

          <p className="font-note text-2xl text-muted-foreground -rotate-1">~ bab pembuka ~</p>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl leading-tight mt-1">
            Belajar Menulis<br />Teks Deskripsi
          </h1>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            Untuk siswa SD Kelas 3, kita akan mengamati benda di sekitarmu,
            lalu menuliskannya menjadi sebuah cerita.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="block font-heading font-bold text-base sm:text-lg mb-2">
                Sebelum mulai, siapa namamu?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ketik namamu di sini..."
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-lg font-semibold"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.6)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buka Buku, Mulai Belajar
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="hand-note inline-flex items-center gap-1.5">
              ditulis khusus untuk kelas 3
              <IconHeart className="w-3.5 h-3.5 text-accent" />
            </span>
          </div>
        </div>

        <p className="text-center mt-5">
          <Link to="/hasil" className="text-primary font-heading font-bold text-sm hover:underline">
            Guru? Lihat hasil jawaban siswa di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StudentNameForm;
