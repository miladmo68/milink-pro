export default function Footer(){
  return (
    <footer className="py-10 border-t border-base-200">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="opacity-70">© {new Date().getFullYear()} Milink. All rights reserved.</p>
        <div className="flex gap-4 opacity-80 text-sm">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact" className="link">Contact</a>
        </div>
      </div>
    </footer>
  );
}
