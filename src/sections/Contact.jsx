export default function Contact(){
  return (
    <section id="contact" className="py-16">
      <div className="container grid md:grid-cols-2 gap-10">
        <div>
          <h2>Let’s build your next thing</h2>
          <p className="mt-2 opacity-80">Tell us your goals. We’ll propose scope, timeline, and budget.</p>
          <ul className="mt-6 space-y-2 text-sm opacity-80">
            <li>• Toronto, ON</li>
            <li>• hello@milink.studio</li>
            <li>• +1 (647) 555‑0123</li>
          </ul>
        </div>
        <form onSubmit={(e)=>{e.preventDefault(); alert("Thanks! We’ll reach out soon.");}} className="card bg-base-200/60 p-6 space-y-4">
          <input className="input input-bordered w-full" placeholder="Name" required />
          <input type="email" className="input input-bordered w-full" placeholder="Email" required />
          <input className="input input-bordered w-full" placeholder="Company (optional)" />
          <textarea className="textarea textarea-bordered w-full" rows="5" placeholder="What do you need?"></textarea>
          <button className="btn btn-primary">Send</button>
        </form>
      </div>
    </section>
  );
}
