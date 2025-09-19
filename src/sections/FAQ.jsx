import { faqs } from "../data/content.js";

export default function FAQ() {
  return (
    <section id="faq" className="py-16">
      <div className="container">
        <h2 className="text-center">FAQ</h2>

        <div className="mt-8 max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="collapse collapse-arrow bg-base-200/60 rounded-2xl"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">{f.q}</div>
              <div className="collapse-content">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
