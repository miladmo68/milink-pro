import { services } from "../data/content.js";
export default function Services({ onOpen }){
  return (
    <section id="services" className="py-16">
      <div className="container">
        <h2 className="text-center">Services</h2>
        <p className="text-center opacity-80">Design • Build • Grow</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <article key={s.id} className="card bg-base-200/60 hover:bg-base-200 transition shadow-soft">
              <div className="card-body">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="opacity-80 mt-1">{s.desc}</p>
                <ul className="mt-3 space-y-2">{s.bullets.map((b,i)=>(<li key={i}>• {b}</li>))}</ul>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm" onClick={()=>onOpen({title:s.title, text:s.desc, list:s.bullets})}>Read more</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
