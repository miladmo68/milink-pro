import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Instagram } from "lucide-react";
import { Reveal } from "../components/scroll-reveal.jsx";

/* ─── Shared easing ─────────────────────────────────────── */
const EASE = [0.4, 0, 0.2, 1];

/* ─── Card: lift + blue-glow on hover ───────────────────── */
const cardVariants = {
  rest: {
    y: 0,
    boxShadow:
      "0 4px 24px -4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
  },
  hover: {
    y: -4,
    boxShadow:
      "0 20px 48px -12px rgba(30,58,138,0.26), 0 0 0 1.5px rgba(59,130,246,0.4)",
    transition: { duration: 0.4, ease: EASE },
  },
};

/* ─── Contact row: slide-right nudge on hover ────────────── */
const rowVariants = {
  rest: { x: 0 },
  hover: { x: 6, transition: { duration: 0.25, ease: EASE } },
};

/* ─── Icon bubble: scale + rotate on hover ──────────────── */
const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.18, rotate: -8, transition: { duration: 0.25, ease: EASE } },
};

export default function Contact() {
  /* ── Form state ─────────────────────────────────────────── */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  /* ── Captcha + Honeypot ─────────────────────────────────── */
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [answer, setAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const trapRef = useRef(null);
  const captchaRef = useRef(null);

  /* ── Submission status ──────────────────────────────────── */
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  /* ── WhatsApp ───────────────────────────────────────────── */
  const WA_PHONE = "14376003139";
  const WA_TEXT = encodeURIComponent("Hi Milink! I'm interested in your services.");
  const WA_LINK = `https://wa.me/${WA_PHONE}?text=${WA_TEXT}`;
  const WA_MOBILE_FALLBACK = `whatsapp://send?phone=${WA_PHONE}&text=${WA_TEXT}`;

  const regen = () => {
    setA(Math.floor(Math.random() * 9) + 1);
    setB(Math.floor(Math.random() * 9) + 1);
    setAnswer("");
    setCaptchaError(false);
  };
  useEffect(() => { regen(); }, []);

  const captchaOK = parseInt(answer, 10) === a + b;

  async function handleSubmit(e) {
    e.preventDefault();
    if (trapRef.current?.value) { setCaptchaError(true); return; }
    if (!captchaOK) { setCaptchaError(true); captchaRef.current?.focus(); return; }

    setLoading(true);
    setServerMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Send failed");
      setServerMsg({ type: "success", text: "Message sent successfully. Thank you!" });
      setName(""); setEmail(""); setMessage(""); regen();
    } catch {
      setServerMsg({ type: "error", text: "Message failed to send. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  /* ── Contact info items ─────────────────────────────────── */
  const contactItems = [
    {
      key: "address",
      icon: <MapPinIcon className="h-5 w-5 text-primary" />,
      label: "Address",
      content: <p className="opacity-70 text-sm">GTA, Ontario, Canada</p>,
    },
    {
      key: "instagram",
      icon: <Instagram className="h-5 w-5 text-primary" aria-hidden="true" />,
      label: "Instagram",
      content: (
        <a href="https://instagram.com/milink.ca" target="_blank" rel="noopener noreferrer"
          className="link link-hover text-sm opacity-70" aria-label="Instagram milink.ca">
          @milink.ca
        </a>
      ),
    },
    {
      key: "phone",
      icon: <PhoneIcon className="h-5 w-5 text-primary" />,
      label: "Phone",
      content: (
        <a href="tel:+14376003139" className="link link-hover text-sm opacity-70"
          aria-label="Call +1 (437) 600-3139">
          +1 (437) 600-3139
        </a>
      ),
    },
    {
      key: "whatsapp",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
          className="h-5 w-5 text-primary" aria-hidden="true">
          <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.38 0 0 5.38 0 12c0 2.12.55 4.18 1.6 6.02L0 24l6.16-1.6A11.96 11.96 0 0012 24c6.62 0 12-5.38 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82c-1.83 0-3.6-.5-5.14-1.45l-.37-.22-3.65.95.97-3.56-.24-.37a9.78 9.78 0 01-1.52-5.17c0-5.42 4.4-9.82 9.82-9.82 2.62 0 5.09 1.02 6.94 2.88 1.85 1.85 2.88 4.32 2.88 6.94 0 5.42-4.4 9.82-9.82 9.82zm5.6-7.4c-.31-.15-1.84-.91-2.13-1.02-.29-.11-.5-.15-.71.15-.21.29-.82 1.02-1.01 1.23-.19.21-.37.23-.68.08-.31-.15-1.31-.48-2.5-1.53-.92-.82-1.53-1.83-1.71-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.37.46-.55.15-.18.2-.31.31-.52.1-.21.05-.4-.02-.55-.08-.15-.71-1.72-.97-2.36-.26-.63-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.15.21 2.22 3.39 5.37 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2-.13.31-.21 1.02-1.01 1.17-1.42.15-.4.15-.74.1-.82-.05-.08-.29-.18-.6-.32z" />
        </svg>
      ),
      label: "WhatsApp",
      content: (
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="link link-hover text-sm opacity-70" aria-label="Chat on WhatsApp"
          onClick={(e) => {
            if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
              e.preventDefault();
              window.location.href = WA_MOBILE_FALLBACK;
            }
          }}>
          Chat on WhatsApp
        </a>
      ),
    },
  ];

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <section id="contact" className="py-24">

      {/* ① Header — fadeInDown (enters from above, slides down) */}
      <div className="text-center mb-14 space-y-3">
        <Reveal from="down" distance={14}>
          <div className="badge badge-outline mb-1">Contact</div>
        </Reveal>
        <Reveal from="down" distance={20} delay={0.08}>
          <h2 className="text-4xl sm:text-5xl font-semibold">Get In Touch</h2>
        </Reveal>
        <Reveal from="down" distance={16} delay={0.16}>
          <p className="opacity-70 max-w-lg mx-auto">
            Have a question or want to start a project? Reach out and let&apos;s
            bring your ideas to life.
          </p>
        </Reveal>
      </div>

      <div className="container mx-auto grid gap-10 lg:grid-cols-2 items-start">

        {/* ② LEFT card — fadeInUp, delay 0 */}
        <Reveal from="up" distance={32} delay={0.1}>
          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-base-100 rounded-2xl p-8 border border-base-200 space-y-8 h-full"
          >
            <div>
              <h2 className="text-3xl font-bold">Contact Info</h2>
              <p className="opacity-70 mt-2 text-sm leading-relaxed">
                We&apos;d love to hear from you. Pick any channel below.
              </p>
            </div>

            {/* ④ Contact rows — staggered fadeInLeft + row hover nudge */}
            <ul className="space-y-5">
              {contactItems.map(({ key, icon, label, content }, i) => (
                <Reveal key={key} from="left" distance={18} delay={0.12 + i * 0.09}>
                  <motion.li
                    variants={rowVariants}
                    initial="rest"
                    whileHover="hover"
                    className="flex items-center gap-4"
                  >
                    {/* Icon bubble */}
                    <motion.div
                      variants={iconVariants}
                      className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                      style={{ transition: "background 0.3s" }}
                    >
                      {icon}
                    </motion.div>
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      {content}
                    </div>
                  </motion.li>
                </Reveal>
              ))}
            </ul>
          </motion.div>
        </Reveal>

        {/* ③ RIGHT card — fadeInUp, delay 0.2s */}
        <Reveal from="up" distance={32} delay={0.22}>
          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-base-100 rounded-2xl p-8 border border-base-200 h-full"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-3xl font-bold">Send a Message</h2>

              {/* Honeypot */}
              <input ref={trapRef} type="text" tabIndex={-1} autoComplete="off"
                className="hidden" aria-hidden="true" />

              {/* ⑤ Animated inputs */}
              <FocusInput
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <FocusInput
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FocusTextarea
                rows={5}
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              {/* Captcha row */}
              <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                <div className="form-control">
                  <FocusInput
                    inputRef={captchaRef}
                    type="number"
                    inputMode="numeric"
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value); setCaptchaError(false); }}
                    extraClass={captchaError ? "input-error" : ""}
                    placeholder={`What is ${a} + ${b}? *`}
                    aria-label={`What is ${a} plus ${b}?`}
                    required
                  />
                  {captchaError && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        Incorrect answer. Please try again.
                      </span>
                    </label>
                  )}
                </div>
                <motion.button
                  type="button"
                  onClick={regen}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.18 }}
                  className="btn btn-ghost"
                >
                  Refresh
                </motion.button>
              </div>

              {/* Status message */}
              {serverMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                    serverMsg.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {serverMsg.type === "success"
                    ? <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                    : <XCircleIcon className="h-5 w-5 flex-shrink-0" />}
                  <span>{serverMsg.text}</span>
                </motion.div>
              )}

              {/* ⑥ Shimmer submit button */}
              <ShimmerButton loading={loading} />
            </form>
          </motion.div>
        </Reveal>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   Sub-components
══════════════════════════════════════════════════════════ */

/** Input with hover border + focus glow ring */
function FocusInput({ inputRef, extraClass = "", ...props }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = focused || hovered;

  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0 0 0 4px rgba(30,58,138,0.1)"
          : "0 0 0 0px rgba(30,58,138,0)",
      }}
      transition={{ duration: 0.22 }}
      className="rounded-lg"
    >
      <input
        ref={inputRef}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`input input-bordered w-full rounded-lg transition-all duration-300 ${
          active ? "border-blue-500" : ""
        } ${focused ? "bg-base-200/40" : ""} ${extraClass}`}
        {...props}
      />
    </motion.div>
  );
}

/** Textarea with same hover/focus treatment */
function FocusTextarea({ ...props }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = focused || hovered;

  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0 0 0 4px rgba(30,58,138,0.1)"
          : "0 0 0 0px rgba(30,58,138,0)",
      }}
      transition={{ duration: 0.22 }}
      className="rounded-lg"
    >
      <textarea
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`textarea textarea-bordered w-full rounded-lg transition-all duration-300 resize-none ${
          active ? "border-blue-500" : ""
        } ${focused ? "bg-base-200/40" : ""}`}
        {...props}
      />
    </motion.div>
  );
}

/** Button that lifts on hover + has a shimmer sweep */
function ShimmerButton({ loading }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      initial="rest"
      whileHover={!loading ? "hover" : undefined}
      whileTap={!loading ? { scale: 0.98 } : undefined}
      variants={{
        rest: { y: 0 },
        hover: { y: -2, transition: { duration: 0.2, ease: EASE } },
      }}
      className="btn btn-primary w-full rounded-lg text-lg relative overflow-hidden"
    >
      {/* Shimmer sweep — slides left→right on hover */}
      <motion.span
        aria-hidden="true"
        variants={{
          rest: { x: "-110%" },
          hover: { x: "210%", transition: { duration: 0.52, ease: "easeInOut" } },
        }}
        className="absolute inset-y-0 left-0 w-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "skewX(-15deg)",
        }}
      />
      <span className="relative z-10">
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
            Sending…
          </span>
        ) : (
          "Send Message"
        )}
      </span>
    </motion.button>
  );
}
