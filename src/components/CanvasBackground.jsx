import { useEffect, useRef } from "react";
export default function CanvasBackground(){
  const ref = useRef(null);
  useEffect(()=>{
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const particles = Array.from({length: 60}).map(()=> ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random()-0.5)*0.0008, vy: (Math.random()-0.5)*0.0008,
      r: Math.random()*2 + 0.5,
    }));
    const resize = ()=>{
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize(); window.addEventListener("resize", resize);
    const tick = ()=>{
      const w = canvas.offsetWidth; const h = canvas.offsetHeight;
      ctx.clearRect(0,0,w,h);
      const grad = ctx.createLinearGradient(0,0,w,h);
      grad.addColorStop(0,"rgba(212,175,55,0.08)");
      grad.addColorStop(1,"rgba(34,211,238,0.08)");
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
      ctx.fillStyle = "rgba(212,175,55,0.6)";
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>1) p.vx*=-1; if(p.y<0||p.y>1) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x*w, p.y*h, p.r, 0, Math.PI*2); ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 -z-10 rounded-3xl" aria-hidden="true"/>;
}
