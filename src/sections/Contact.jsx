import { useEffect, useRef, useState } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Instagram, Whatsapp } from "lucide-react"; // ✅ واتس‌اپ اضافه شد

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
  // اگر فارسی می‌خوای:
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
    <section id="contact" className="py-20 bg-base-200">
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

            {/* ✅ WhatsApp row — دقیقا بعد از Phone */}
            <div className="flex items-start gap-4">
              <Whatsapp className="h-8 w-8 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-lg">WhatsApp</h3>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                  aria-label="Chat on WhatsApp"
                  onClick={(e) => {
                    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                      // تلاش برای باز کردن داخل اپ
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
