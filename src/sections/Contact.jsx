import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function Contact() {
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent!");
            }}
            className="space-y-5"
          >
            <h2 className="text-3xl font-bold mb-2">Send a Message</h2>
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
            <button className="btn btn-primary w-full rounded-lg text-lg">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
