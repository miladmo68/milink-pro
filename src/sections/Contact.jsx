import { useEffect, useRef, useState } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Instagram } from "lucide-react";

export default function Contact() {
  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Captcha + Honeypot
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [answer, setAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const trapRef = useRef(null);
  const captchaRef = useRef(null);

  // Status
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  // ✅ WhatsApp setup
  const WA_PHONE = "14376003139"; // +1 437 600 3139 (digits only)
  const WA_TEXT = encodeURIComponent(
    "Hi Milink! I'm interested in your services."
  );
  // agar farsi mikhai:
  // const WA_TEXT = encodeURIComponent("سلام میلینک! برای طراحی وب/ای‌کامرس می‌خوام مشاوره بگیرم.");
  const WA_LINK = `https://wa.me/${WA_PHONE}?text=${WA_TEXT}`;
  const WA_MOBILE_FALLBACK = `whatsapp://send?phone=${WA_PHONE}&text=${WA_TEXT}`;

  const regen = () => {
    setA(Math.floor(Math.random() * 9) + 1);
    setB(Math.floor(Math.random() * 9) + 1);
    setAnswer("");
    setCaptchaError(false);
  };

  useEffect(() => {
    regen();
  }, []);

  const captchaOK = parseInt(answer, 10) === a + b;

  async function handleSubmit(e) {
    e.preventDefault();
    // Honeypot
    if (trapRef.current?.value) {
      setCaptchaError(true);
      return;
    }
    if (!captchaOK) {
      setCaptchaError(true);
      captchaRef.current?.focus();
      return;
    }

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

      setServerMsg({
        type: "success",
        text: "Message sent successfully. Thank you!",
      });
      setName("");
      setEmail("");
      setMessage("");
      regen();
    } catch (err) {
      setServerMsg({
        type: "error",
        text: "Message failed to send. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20 ">
      <h2 className="text-center mb-10">Contact Us</h2>

      <div className="container mx-auto grid gap-12 lg:grid-cols-2">
        {/* LEFT: Get in Touch */}
        <div className="bg-base-100 shadow-lg rounded-2xl p-8 space-y-8">
          <div>
            <h2 className="text-4xl font-bold">Get in Touch</h2>
            <p className="opacity-80 mt-2">
              Have a question or want to start a project? Reach out to us and
              let&apos;s bring your ideas to life.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPinIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p>GTA, Ontario, Canada</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Instagram className="h-8 w-8 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-lg">Instagram</h3>
                <a
                  href="https://instagram.com/milink.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                  aria-label="Instagram milink.ca"
                >
                  @milink.ca
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <PhoneIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <a
                  href="tel:+14376003139"
                  className="link link-hover"
                  aria-label="Call +1 (437) 600-3139"
                >
                  +1 (437) 600-3139
                </a>
              </div>
            </div>

            {/* ✅ WhatsApp row */}
            <div className="flex items-start gap-4">
              {/* SVG rasmi-ye WhatsApp */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.38 0 0 5.38 0 12c0 2.12.55 4.18 1.6 6.02L0 24l6.16-1.6A11.96 11.96 0 0012 24c6.62 0 12-5.38 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82c-1.83 0-3.6-.5-5.14-1.45l-.37-.22-3.65.95.97-3.56-.24-.37a9.78 9.78 0 01-1.52-5.17c0-5.42 4.4-9.82 9.82-9.82 2.62 0 5.09 1.02 6.94 2.88 1.85 1.85 2.88 4.32 2.88 6.94 0 5.42-4.4 9.82-9.82 9.82zm5.6-7.4c-.31-.15-1.84-.91-2.13-1.02-.29-.11-.5-.15-.71.15-.21.29-.82 1.02-1.01 1.23-.19.21-.37.23-.68.08-.31-.15-1.31-.48-2.5-1.53-.92-.82-1.53-1.83-1.71-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.37.46-.55.15-.18.2-.31.31-.52.1-.21.05-.4-.02-.55-.08-.15-.71-1.72-.97-2.36-.26-.63-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.15.21 2.22 3.39 5.37 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2-.13.31-.21 1.02-1.01 1.17-1.42.15-.4.15-.74.1-.82-.05-.08-.29-.18-.6-.32z" />
              </svg>

              <div>
                <h3 className="font-semibold text-lg">WhatsApp</h3>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                  aria-label="Chat on WhatsApp"
                  onClick={(e) => {
                    // mobile fallback for in-app open
                    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                      e.preventDefault();
                      window.location.href = WA_MOBILE_FALLBACK;
                    }
                  }}
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Send a Message */}
        <div className="bg-base-100 shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-3xl font-bold mb-2">Send a Message</h2>

            {/* Honeypot */}
            <input
              ref={trapRef}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <input
              className="input input-bordered w-full rounded-lg"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="input input-bordered w-full rounded-lg"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <textarea
              rows={5}
              className="textarea textarea-bordered w-full rounded-lg"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div className="form-control">
                <input
                  ref={captchaRef}
                  type="number"
                  inputMode="numeric"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setCaptchaError(false);
                  }}
                  className={`input input-bordered w-full rounded-lg ${
                    captchaError ? "input-error" : ""
                  }`}
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

              <button type="button" onClick={regen} className="btn btn-ghost">
                Refresh
              </button>
            </div>

            {/* Success / Error Messages */}
            {serverMsg && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                  serverMsg.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {serverMsg.type === "success" ? (
                  <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="h-5 w-5 flex-shrink-0" />
                )}
                <span>{serverMsg.text}</span>
              </div>
            )}

            <button
              className="btn btn-primary w-full rounded-lg text-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
