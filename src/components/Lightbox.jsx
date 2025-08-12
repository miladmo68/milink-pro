import { useEffect } from "react";
export default function Lightbox({ src, onClose }){
  useEffect(()=>{
    const onKey = (e)=>{ if(e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return ()=> document.removeEventListener("keydown", onKey);
  },[onClose]);
  return (
    <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <img src={src} alt="" className="max-h-[90vh] rounded-box shadow-2xl" onClick={(e)=>e.stopPropagation()} loading="eager" />
      <button className="btn btn-sm absolute right-4 top-4" onClick={onClose} aria-label="Close">✕</button>
    </div>
  );
}
