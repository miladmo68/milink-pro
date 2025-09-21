// import {
//   MapPinIcon,
//   EnvelopeIcon,
//   PhoneIcon,
// } from "@heroicons/react/24/outline";

// export default function Contact() {
//   return (
//     <section id="contact" className="py-20 bg-base-200">
//       {/* Title with margin-bottom */}
//       <h2 className="text-center mb-10 ">Contact Us</h2>

//       <div className="container mx-auto grid gap-12 lg:grid-cols-2">
//         {/* Left: Contact Info */}
//         <div className="space-y-8">
//           <h2 className="text-4xl font-bold">Get in Touch</h2>
//           <p className="opacity-80">
//             Have a question or want to start a project? Reach out to us and
//             let's bring your ideas to life.
//           </p>

//           <div className="space-y-6">
//             <div className="flex items-start gap-4">
//               <MapPinIcon className="h-8 w-8 text-primary" />
//               <div>
//                 <h3 className="font-semibold text-lg">Address</h3>
//                 <p>GTA, Ontario, Canada</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <EnvelopeIcon className="h-8 w-8 text-primary" />
//               <div>
//                 <h3 className="font-semibold text-lg">Email</h3>
//                 <p>info@milink.com</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <PhoneIcon className="h-8 w-8 text-primary" />
//               <div>
//                 <h3 className="font-semibold text-lg">Phone</h3>
//                 <p>+1 (437) 999-3668</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right: Contact Form */}
//         <div className="bg-base-100 shadow-lg rounded-2xl p-8">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               alert("Message sent!");
//             }}
//             className="space-y-5"
//           >
//             <h2 className="text-3xl font-bold mb-2">Send a Message</h2>
//             <input
//               type="text"
//               placeholder="Your Name"
//               className="input input-bordered w-full rounded-lg"
//               required
//             />
//             <input
//               type="email"
//               placeholder="Your Email"
//               className="input input-bordered w-full rounded-lg"
//               required
//             />
//             <textarea
//               placeholder="Your Message"
//               className="textarea textarea-bordered w-full rounded-lg"
//               rows="5"
//               required
//             ></textarea>
//             <button className="btn btn-primary w-full rounded-lg text-lg">
//               Send Message
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useState, useEffect, useRef } from "react";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function Contact() {
  // Math captcha
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [answer, setAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const captchaInputRef = useRef(null);

  // Honeypot (باید خالی بماند)
  const [trap, setTrap] = useState("");

  const regenerate = () => {
    const r1 = Math.floor(Math.random() * 9) + 1; // 1..9
    const r2 = Math.floor(Math.random() * 9) + 1;
    setA(r1);
    setB(r2);
    setAnswer("");
    setCaptchaError(false);
  };

  useEffect(() => {
    regenerate();
  }, []);

  const captchaOK = parseInt(answer, 10) === a + b;

  const handleSubmit = (e) => {
    e.preventDefault();

    // honeypot: اگر پر باشد، رد کن
    if (trap) {
      setCaptchaError(true);
      return;
    }

    // کپچا مثل بقیه فیلدها ارور بگیرد و ارسال نشود
    if (!captchaOK) {
      setCaptchaError(true);
      // فوکِس روی فیلد کپچا برای UX بهتر
      captchaInputRef.current?.focus();
      return;
    }

    // اگر لازم داری سایر فیلدها رو هم اعتبارسنجی کنی، اینجا اضافه کن

    alert("Message sent!");
    regenerate();
  };

  return (
    <section id="contact" className="py-20 bg-base-200">
      {/* Title with margin-bottom */}
      <h2 className="text-center mb-10 ">Contact Us</h2>

      <div className="container mx-auto grid gap-12 lg:grid-cols-2">
        {/* Left: Contact Info */}
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
                <p>info@milink.com</p>
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

        {/* Right: Contact Form */}
        <div className="bg-base-100 shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-3xl font-bold mb-2">Send a Message</h2>

            {/* Honeypot (مخفی) */}
            <input
              type="text"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              className="hidden"
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />

            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full rounded-lg"
              required
            />
            <textarea
              placeholder="Your Message"
              className="textarea textarea-bordered w-full rounded-lg"
              rows="5"
              required
            ></textarea>

            {/* Security: math captcha behaves like other fields (shows error, prevents submit) */}
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div className="form-control">
                <input
                  ref={captchaInputRef}
                  type="number"
                  inputMode="numeric"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    if (captchaError) setCaptchaError(false);
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
                      Incorrect answer. Please enter the correct result.
                    </span>
                  </label>
                )}
              </div>

              <button
                type="button"
                onClick={regenerate}
                className="btn btn-ghost"
                aria-label="New question"
                title="New question"
              >
                Refresh
              </button>
            </div>

            <button className="btn btn-primary w-full rounded-lg text-lg">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
