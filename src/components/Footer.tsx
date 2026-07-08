export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/20 dark:border-[#2DD4BF]/10 mt-12 bg-white/20 dark:bg-transparent backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-5 text-[11px] font-medium tracking-widest text-slate-400 dark:text-[#bacac5]/60 uppercase">
        <div className="font-sans font-bold tracking-[0.25em] text-slate-600 dark:text-[#d4e4fa] mb-3 md:mb-0">
          S.T.A.R.
          AI AGENT
        </div>
        
        <div className="text-center mb-3 md:mb-0">
          © {currentYear} CROO NETWORK • S.T.A.R. INTELLIGENCE LAYER
        </div>

        <div className="flex gap-4">
          <a
            href="#docs"
            onClick={(e) => e.preventDefault()}
            className="hover:text-teal-600 dark:hover:text-[#2DD4BF] transition-colors"
          >
            Documentation
          </a>
          <a
            href="#status"
            onClick={(e) => e.preventDefault()}
            className="hover:text-teal-600 dark:hover:text-[#2DD4BF] transition-colors"
          >
            Network Status
          </a>
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-teal-600 dark:hover:text-[#2DD4BF] transition-colors"
          >
            Privacy Protocol
          </a>
        </div>
      </div>
    </footer>
  );
}
