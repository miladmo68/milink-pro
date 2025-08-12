import { work } from "../data/content.js";
export default function Work({ onOpen }){
  return (
    <section id="work" className="py-16">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h2>Case studies</h2>
            <p className="opacity-80">Selected projects and growth stories</p>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {work.map(w => (
            <article key={w.id} className="card bg-base-200/60 hover:bg-base-200 transition shadow-soft">
              <figure className="aspect-video overflow-hidden rounded-t-box">
                <img src={w.cover} alt={w.title} className="h-full w-full object-cover" loading="lazy"/>
              </figure>
              <div className="card-body">
                <span className="badge badge-outline">{w.tag}</span>
                <h3 className="card-title">{w.title}</h3>
                <p className="opacity-80">{w.summary}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm" onClick={()=>onOpen({title:w.title, text:w.summary, img:w.cover})}>Read more</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
