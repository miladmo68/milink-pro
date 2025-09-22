import { useEffect, useRef, useState } from "react";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

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
    <section id="contact" className="py-20 bg-base-200">
      <h2 className="text-center mb-10">Contact Us</h2>

      <div className="container mx-auto grid gap-12 lg:grid-cols-2">
        {/* Left Info */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold">Get in Touch</h2>
          <p className="opacity-80">
            Have a question or want to start a project? Reach out to us and
            let's bring your ideas to life.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPinIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p>GTA, Ontario, Canada</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <EnvelopeIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p>info@milink.ca</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <PhoneIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p>+1 (437) 999-3668</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
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
