import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Instagram } from "lucide-react";
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";
import Button from "../components/ui/Button.jsx";
import Field from "../components/ui/Field.jsx";
import { BUSINESS, mapsUrl, whatsappLinks } from "../config/business.js";
import { openWhatsApp } from "../lib/whatsapp.js";

/* ─── Shared easing ─────────────────────────────────────── */
const EASE = [0.4, 0, 0.2, 1];
const PACKAGE_OPTIONS = ["Essential", "Professional", "E-commerce & Custom"];
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

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
      "0 20px 48px -12px rgb(var(--brand) / 0.26), 0 0 0 1.5px rgb(var(--brand-soft) / 0.4)",
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

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-primary" aria-hidden="true">
    <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.38 0 0 5.38 0 12c0 2.12.55 4.18 1.6 6.02L0 24l6.16-1.6A11.96 11.96 0 0012 24c6.62 0 12-5.38 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82c-1.83 0-3.6-.5-5.14-1.45l-.37-.22-3.65.95.97-3.56-.24-.37a9.78 9.78 0 01-1.52-5.17c0-5.42 4.4-9.82 9.82-9.82 2.62 0 5.09 1.02 6.94 2.88 1.85 1.85 2.88 4.32 2.88 6.94 0 5.42-4.4 9.82-9.82 9.82zm5.6-7.4c-.31-.15-1.84-.91-2.13-1.02-.29-.11-.5-.15-.71.15-.21.29-.82 1.02-1.01 1.23-.19.21-.37.23-.68.08-.31-.15-1.31-.48-2.5-1.53-.92-.82-1.53-1.83-1.71-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.37.46-.55.15-.18.2-.31.31-.52.1-.21.05-.4-.02-.55-.08-.15-.71-1.72-.97-2.36-.26-.63-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.15.21 2.22 3.39 5.37 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2-.13.31-.21 1.02-1.01 1.17-1.42.15-.4.15-.74.1-.82-.05-.08-.29-.18-.6-.32z" />
  </svg>
);

const EMPTY_FORM = { name: "", email: "", phone: "", message: "", website: "" };

export default function Contact() {
  /* ── Form state ─────────────────────────────────────────── */
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [sentTo, setSentTo] = useState(null);
  const openedAt = useRef(0);
  const turnstileRef = useRef(null);
  const turnstileToken = useRef("");
  const turnstileWidget = useRef(null);
  const loading = status.state === "sending";

  const setField = (key) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  useEffect(() => {
    openedAt.current = Date.now();
    const requestedPackage = new URLSearchParams(window.location.search).get("package");
    if (PACKAGE_OPTIONS.includes(requestedPackage)) setSelectedPackage(requestedPackage);
  }, []);

  // Optional Cloudflare Turnstile: only runs when a public site key is set.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return undefined;
    const render = () => {
      if (!window.turnstile || turnstileWidget.current !== null || !turnstileRef.current) return;
      turnstileWidget.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "auto",
        callback: (token) => { turnstileToken.current = token; },
        "expired-callback": () => { turnstileToken.current = ""; },
      });
    };
    if (window.turnstile) { render(); return undefined; }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
    return undefined;
  }, [sentTo]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setStatus({ state: "sending", message: "" });
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          message: form.message,
          service: selectedPackage || undefined,
          website: form.website,
          openedAt: openedAt.current,
          cfToken: turnstileToken.current || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data?.fields) setFieldErrors(data.fields);
        setStatus({ state: "error", message: data?.error || "Message failed to send. Please try again." });
        if (window.turnstile && turnstileWidget.current !== null) window.turnstile.reset(turnstileWidget.current);
        turnstileToken.current = "";
        return;
      }
      setSentTo({ name: form.name.trim().split(" ")[0], email: form.email.trim() });
      setForm(EMPTY_FORM);
      setStatus({ state: "idle", message: "" });
    } catch {
      setStatus({ state: "error", message: "We couldn't reach the server. Please check your connection and try again." });
    }
  }

  function sendAnother() {
    openedAt.current = Date.now();
    turnstileWidget.current = null;
    setSentTo(null);
  }

  /* ── Contact info items ─────────────────────────────────── */
  const whatsapp = whatsappLinks();
  const contactItems = [
    {
      key: "address",
      icon: <MapPinIcon className="h-5 w-5 text-primary" />,
      label: "Address",
      value: BUSINESS.address.short,
      href: mapsUrl(),
      external: true,
    },
    {
      key: "instagram",
      icon: <Instagram className="h-5 w-5 text-primary" aria-hidden="true" />,
      label: "Instagram",
      value: BUSINESS.instagram.handle,
      href: BUSINESS.instagram.url,
      external: true,
    },
    {
      key: "phone",
      icon: <PhoneIcon className="h-5 w-5 text-primary" />,
      label: "Phone",
      value: BUSINESS.phone.display,
      href: `tel:${BUSINESS.phone.tel}`,
    },
    {
      key: "whatsapp",
      icon: <WhatsAppIcon />,
      label: "WhatsApp",
      value: "Chat on WhatsApp",
      href: whatsapp.web,
      external: true,
      onClick: openWhatsApp,
    },
  ];

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden py-24 bg-base-200 dark:!bg-transparent"
    >
      <ScrollParallax
        className="absolute inset-0 -z-10 pointer-events-none hidden dark:block"
        offset={50}
      >
        <div className="section-depth-contact" />
      </ScrollParallax>
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none" offset={35}>
        <div className="bg-orb bg-orb--top-right" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left" aria-hidden="true" />
      </ScrollParallax>

      {/* ① Header */}
      <div className="mb-14 space-y-3 px-5 text-center sm:px-0">
        <Reveal from="up" distance={14}>
          <div className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">Contact</div>
        </Reveal>
        <Reveal from="up" distance={20} delay={0.08}>
          <h2 className="text-4xl sm:text-5xl font-semibold">Get In <span className="gradient-text">Touch</span></h2>
        </Reveal>
        <Reveal from="up" distance={16} delay={0.16}>
          <p className="text-base-content/68 max-w-md mx-auto">
            Have a question or want to start a project? Reach out and let&apos;s
            bring your ideas to life.
          </p>
        </Reveal>
      </div>

      <div className="container mx-auto grid gap-8 lg:grid-cols-2 items-stretch">

        {/* ② LEFT card */}
        <Reveal from="up" distance={32} delay={0.1} className="h-full">
          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="marketing-navy-surface bg-base-100 rounded-2xl p-8 border border-base-300 space-y-8 h-full card-surface card-sweep card-bar"
          >
            <div>
              <h3 className="text-3xl font-bold">Contact Info</h3>
              <p className="text-base-content/75 mt-2 text-sm leading-relaxed">
                We&apos;d love to hear from you. Pick any channel below.
              </p>
            </div>

            <ul className="grid gap-3.5">
              {contactItems.map(({ key, icon, label, value, href, external, onClick }, i) => (
                <li key={key}>
                <Reveal from="up" distance={18} delay={0.12 + i * 0.08}>
                  <motion.a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={`${label}: ${value}`}
                    onClick={onClick}
                    variants={rowVariants}
                    initial="rest"
                    whileHover="hover"
                    className="flex min-h-[76px] cursor-pointer items-center gap-[18px] rounded-[20px] border border-base-content/10 bg-base-100/5 px-[22px] py-[18px] no-underline transition-colors duration-300 hover:border-primary/70 hover:bg-base-100/10"
                  >
                    <motion.div
                      variants={iconVariants}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-primary/10"
                      style={{ transition: "background 0.3s" }}
                    >
                      {icon}
                    </motion.div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-base-content/58">{label}</p>
                      <p className="mt-0.5 text-[17px] font-semibold text-base-content">{value}</p>
                    </div>
                  </motion.a>
                </Reveal>
                </li>
              ))}
            </ul>
          </motion.div>
        </Reveal>

        {/* ③ RIGHT card: the form, or the thank-you once it is sent */}
        <Reveal from="up" distance={32} delay={0.22} className="h-full">
          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="marketing-navy-surface bg-base-100 rounded-2xl p-8 border border-base-300 h-full card-surface card-sweep card-bar"
          >
            {sentTo ? (
              <div className="mk-thanks" role="status">
                <span className="mk-thanks-icon" aria-hidden="true"><CheckCircleIcon className="h-8 w-8" /></span>
                <h3 className="text-3xl font-bold">
                  Message sent{sentTo.name ? `, ${sentTo.name}` : ""}!
                </h3>
                <p className="text-base-content/75 leading-relaxed">
                  Thanks for reaching out. We&apos;ll reply to <strong className="text-base-content">{sentTo.email}</strong> as
                  soon as we can. While you wait, you can get a head start:
                </p>
                <ul className="mk-thanks-steps">
                  <li><b>1</b> Fill in your project brief in the client portal. It saves as you go.</li>
                  <li><b>2</b> Or message us on WhatsApp if it&apos;s time-sensitive.</li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button href="/portal" arrow>Start your project brief</Button>
                  <Button variant="secondary" href={whatsapp.web} external onClick={openWhatsApp}>WhatsApp us</Button>
                </div>
                <button type="button" onClick={sendAnother} className="mk-link-button">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h3 className="text-3xl font-bold">Send a Message</h3>

                {/* Honeypot: invisible to people, irresistible to bots. */}
                <div className="mk-hp" aria-hidden="true">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={setField("website")} />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" name="name" autoComplete="name" required value={form.name} onChange={setField("name")} error={fieldErrors.name} />
                  <Field label="Email" type="email" name="email" autoComplete="email" required value={form.email} onChange={setField("email")} error={fieldErrors.email} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" optional type="tel" name="phone" autoComplete="tel" inputMode="tel" value={form.phone} onChange={setField("phone")} error={fieldErrors.phone} />
                  <Field as="select" label="Package" optional name="package" value={selectedPackage} onChange={(event) => setSelectedPackage(event.target.value)}>
                    <option value="">Not sure yet</option>
                    {PACKAGE_OPTIONS.map((packageName) => (
                      <option key={packageName} value={packageName}>{packageName}</option>
                    ))}
                  </Field>
                </div>
                <Field as="textarea" label="How can we help?" name="message" rows={5} required minLength={10} placeholder="Tell us about your business and what you need." value={form.message} onChange={setField("message")} error={fieldErrors.message} />

                {TURNSTILE_SITE_KEY ? <div ref={turnstileRef} /> : null}

                {status.state === "error" ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mk-alert mk-alert--error"
                    role="alert"
                  >
                    {status.message}
                  </motion.div>
                ) : null}

                <Button type="submit" size="block" arrow={!loading} disabled={loading} className="text-lg">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
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
                </Button>
              </form>
            )}
          </motion.div>
        </Reveal>

      </div>
    </section>
  );
}
