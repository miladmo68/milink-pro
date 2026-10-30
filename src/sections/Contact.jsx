import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";
import Button from "../components/ui/Button.jsx";
import Field from "../components/ui/Field.jsx";
import { BUSINESS, mapsUrl, whatsappLinks } from "../config/business.js";
import { openWhatsApp } from "../lib/whatsapp.js";
import { MAP } from "../data/mapDots.js";
import { track } from "../lib/track";

const PACKAGE_OPTIONS = ["Essential", "Professional", "E-commerce & Custom"];
const PROJECT_TYPES = ["Business website", "Online store", "Redesign", "SEO & speed", "Branding", "Not sure yet"];
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const EMPTY_FORM = { name: "", email: "", phone: "", message: "", website: "" };

const InstagramGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);
const WhatsAppGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 20l1.3-4.2A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L4 20z" />
    <path d="M9.2 9.2c0 3 2.6 5.6 5.6 5.6l1-1.3-1.9-1-.8.6a3.5 3.5 0 0 1-1.6-1.6l.6-.8-1-1.9z" />
  </svg>
);

/** The email row, with a one-tap copy button. */
function EmailRow() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS.email);
    } catch {
      const input = document.createElement("input");
      input.value = BUSINESS.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <li className="mk-row">
      <a href={`mailto:${BUSINESS.email}`} className="mk-row-link" aria-label={`Email: ${BUSINESS.email}`}>
        <span className="mk-row-icon"><Mail size={19} aria-hidden="true" /></span>
        <span className="mk-row-text"><small>Email</small><b>{BUSINESS.email}</b></span>
      </a>
      <button type="button" className="mk-copy" onClick={copy} aria-label={copied ? "Email address copied" : `Copy ${BUSINESS.email}`}>
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </li>
  );
}

function Row({ icon, label, value, href, external, onClick }) {
  return (
    <li className="mk-row">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={`${label}: ${value}`}
        onClick={onClick}
        className="mk-row-link"
      >
        <span className="mk-row-icon">{icon}</span>
        <span className="mk-row-text"><small>{label}</small><b>{value}</b></span>
        {external ? <ArrowUpRight className="mk-row-arrow" size={16} aria-hidden="true" /> : null}
      </a>
    </li>
  );
}

/** Dotted map of eastern North America with a glowing pin on Toronto. */
function DotMap() {
  const px = `${(MAP.pin.x / MAP.width) * 100}%`;
  const py = `${(MAP.pin.y / MAP.height) * 100}%`;
  return (
    <div className="mk-map" style={{ aspectRatio: `${MAP.width} / ${MAP.height}` }}>
      <svg className="mk-map-svg" viewBox={`0 0 ${MAP.width} ${MAP.height}`} role="img" aria-label={`Map of eastern North America with a pin on ${MAP.pin.name}`}>
        <defs>
          <linearGradient id="mk-sweep" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="mk-dot-mask"><path d={MAP.dots} stroke="#fff" strokeWidth=".3" strokeLinecap="round" fill="none" /></mask>
        </defs>
        <path className="mk-dots" d={MAP.dots} strokeWidth=".3" strokeLinecap="round" fill="none" />
        <path className="mk-dots-near" d={MAP.near} strokeWidth=".34" strokeLinecap="round" fill="none" />
        <g mask="url(#mk-dot-mask)"><rect className="mk-sweep" x="-12" y="0" width="12" height={MAP.height} fill="url(#mk-sweep)" /></g>
      </svg>
      <span className="mk-pin" style={{ left: px, top: py }} aria-hidden="true"><i /><i /><b /></span>
      <a className="mk-map-chip" style={{ left: px, top: py }} href={mapsUrl()} target="_blank" rel="noopener noreferrer" aria-label={`Address: ${BUSINESS.address.short} (opens Google Maps)`}>
        <MapPin size={14} aria-hidden="true" />{BUSINESS.address.short}
      </a>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [projectType, setProjectType] = useState("");
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
          projectType: projectType || undefined,
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
      track("contact_submit");
      setForm(EMPTY_FORM);
      setProjectType("");
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

  const whatsapp = whatsappLinks();
  const panelRef = useRef(null);

  // Animations run only while the panel is on screen; a soft light follows the mouse.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      panel.dataset.live = entry.isIntersecting ? "true" : "false";
    }, { threshold: 0.15 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const glow = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-24 bg-base-200 dark:!bg-transparent">
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none hidden dark:block" offset={50}>
        <div className="section-depth-contact" />
      </ScrollParallax>
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none" offset={35}>
        <div className="bg-orb bg-orb--top-right" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left" aria-hidden="true" />
      </ScrollParallax>

      <div className="container mx-auto px-4">
        {/* Header: identical to every other section */}
        <div className="max-w-2xl mx-auto text-center">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">Contact</div>
          </Reveal>
          <Reveal from="up" distance={20}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Get In <span className="gradient-text">Touch</span>
            </h2>
          </Reveal>
          <Reveal from="up" distance={16} delay={0.05}>
            <p className="mt-4 text-base-content/68 max-w-md mx-auto">
              Have a question or want to start a project? Reach out and let&apos;s bring your ideas to life.
            </p>
          </Reveal>
        </div>

        <Reveal from="up" distance={32} delay={0.1}>
          <div ref={panelRef} className="mk-signal marketing-navy-surface bg-base-100 border border-base-300 card-surface" data-live="false" onPointerMove={glow}>
            {/* ── Left: where we are and how to reach us ── */}
            <div className="mk-signal-left">
              <DotMap />
              <ul className="mk-rows">
                <EmailRow />
                <Row icon={<WhatsAppGlyph />} label="WhatsApp" value="Chat with us" href={whatsapp.web} external onClick={openWhatsApp} />
                <Row icon={<Phone size={19} aria-hidden="true" />} label="Phone" value={BUSINESS.phone.display} href={`tel:${BUSINESS.phone.tel}`} />
                <Row icon={<InstagramGlyph />} label="Instagram" value={BUSINESS.instagram.handle} href={BUSINESS.instagram.url} external />
              </ul>
            </div>

            {/* ── Right: the form, or the thank-you once it is sent ── */}
            <div className="mk-signal-right">
              {sentTo ? (
                <div className="mk-thanks" role="status">
                  <svg className="mk-check" viewBox="0 0 52 52" aria-hidden="true">
                    <circle cx="26" cy="26" r="24" /><path d="M15 27l8 8 15-17" />
                  </svg>
                  <h3 className="mk-form-title">Message sent{sentTo.name ? `, ${sentTo.name}` : ""}!</h3>
                  <p className="text-base-content/75 leading-relaxed">
                    Thanks for reaching out. We&apos;ll reply to <strong className="text-base-content">{sentTo.email}</strong>. While you wait, you can get a head start:
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
                <form onSubmit={handleSubmit} noValidate className="mk-form">
                  <h3 className="mk-form-title">Send a Message</h3>

                  {/* Honeypot: invisible to people, irresistible to bots. */}
                  <div className="mk-hp" aria-hidden="true">
                    <label>
                      Website
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={setField("website")} />
                    </label>
                  </div>

                  <div className="mk-form-row">
                    <Field label="Your name" name="name" autoComplete="name" required value={form.name} onChange={setField("name")} error={fieldErrors.name} />
                    <Field label="Email" type="email" name="email" autoComplete="email" required value={form.email} onChange={setField("email")} error={fieldErrors.email} />
                  </div>
                  <div className="mk-form-row">
                    <Field label="Phone" optional type="tel" name="phone" autoComplete="tel" inputMode="tel" value={form.phone} onChange={setField("phone")} error={fieldErrors.phone} />
                    <Field as="select" label="Package" optional name="package" value={selectedPackage} onChange={(event) => setSelectedPackage(event.target.value)}>
                      <option value="">Not sure yet</option>
                      {PACKAGE_OPTIONS.map((packageName) => (<option key={packageName} value={packageName}>{packageName}</option>))}
                    </Field>
                  </div>
                  <Field as="select" label="What do you need?" optional name="projectType" value={projectType} onChange={(event) => setProjectType(event.target.value)}>
                    <option value="">Select one</option>
                    {PROJECT_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </Field>
                  <Field as="textarea" label="How can we help?" name="message" rows={4} required minLength={10} placeholder="Tell us about your business and what you need." value={form.message} onChange={setField("message")} error={fieldErrors.message} />

                  {TURNSTILE_SITE_KEY ? <div ref={turnstileRef} /> : null}

                  {status.state === "error" ? <div className="mk-alert mk-alert--error" role="alert">{status.message}</div> : null}

                  <Button type="submit" size="block" arrow={!loading} disabled={loading} className="text-lg">
                    {loading ? (<span className="flex items-center justify-center gap-2"><span className="mk-spinner" aria-hidden="true" />Sending…</span>) : "Send Message"}
                  </Button>
                  {BUSINESS.replyTime ? <p className="mk-reply-time">{BUSINESS.replyTime}</p> : null}
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
