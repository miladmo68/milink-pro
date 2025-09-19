import { useEffect, useRef } from "react";
export default function Modal({ payload, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.activeElement;
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);
  const stop = (e) => e.stopPropagation();
  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-w-2xl w-full bg-base-100 rounded-2xl p-6 relative"
        onClick={stop}
      >
        <button
          className="btn btn-sm btn-ghost absolute right-3 top-3"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold">{payload.title}</h3>
        {payload.img && (
          <img
            src={payload.img}
            alt=""
            className="mt-3 rounded-box"
            loading="lazy"
          />
        )}
        {payload.text && <p className="opacity-80 mt-3">{payload.text}</p>}
        {Array.isArray(payload.list) && (
          <ul className="mt-3 space-y-2">
            {payload.list.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        )}
        <button className="btn btn-primary mt-6" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
