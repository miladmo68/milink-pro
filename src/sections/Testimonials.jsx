import { useState } from "react";

const testimonials = [
  {
    name: "Sarah Lee",
    text: "Milink transformed our business presence!",
    role: "CEO, TechNova",
  },
  {
    name: "James Brown",
    text: "Professional service and modern design.",
    role: "Founder, BizCorp",
  },
  {
    name: "Anna White",
    text: "Loved their responsive approach!",
    role: "Manager, CreativeHouse",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const prev = () =>
    setIndex((index - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((index + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-20 bg-base-200 text-center">
      <h2 className="text-4xl font-bold mb-8">What Clients Say</h2>
      <div className="card bg-base-100 shadow-xl mx-auto max-w-md p-6">
        <p className="italic text-lg mb-4">"{testimonials[index].text}"</p>
        <h4 className="font-bold">{testimonials[index].name}</h4>
        <span className="text-sm opacity-75">{testimonials[index].role}</span>
        <div className="flex justify-between mt-6">
          <button className="btn btn-sm btn-outline" onClick={prev}>
            ‹
          </button>
          <button className="btn btn-sm btn-outline" onClick={next}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
