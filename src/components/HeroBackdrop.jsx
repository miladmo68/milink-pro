"use client";
import { useEffect, useRef } from "react";

// "Blueprint horizon": volumetric light rays falling onto a perspective grid
// floor, a halftone dot field lit by the pointer (or a slow autonomous
// spotlight on touch devices), and fine film grain — one dependency-free
// fragment shader. It also tells the Hero's story: a short ignition intro,
// a light colour that follows the active scene, a shockwave across the floor
// whenever the scene changes, and a gentle dim as the visitor scrolls away.
// Off-screen / hidden tabs pause rendering, reduced-motion visitors get one
// still frame, and without WebGL the CSS depth field underneath remains.

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uLight;
uniform float uScale;
uniform vec3 uTint;
uniform float uPulse;
uniform float uIntro;
uniform float uExit;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;
  float wide = step(1.2, aspect);

  // Intro: horizon line draws first, then the light ignites and the floor spreads.
  float lineIn = smoothstep(0.0, 0.35, uIntro);
  float ignite = smoothstep(0.25, 0.8, uIntro);
  float spread = smoothstep(0.35, 1.0, uIntro);
  float pulseFlash = exp(-uPulse * 3.0);

  // Light source sits above the project stage on desktop, centred on phones.
  vec2 src = vec2(mix(0.5, 0.71, wide) * aspect, 1.14);
  vec2 dir = p - src;
  float dist = length(dir);
  float ang = atan(dir.x, -dir.y);
  float cone = smoothstep(0.78, 0.05, abs(ang + 0.1 * wide));
  float streak = noise(vec2(ang * 17.0, t * 0.11)) * 0.62 + noise(vec2(ang * 43.0 - t * 0.06, 7.0)) * 0.38;
  streak = pow(streak, 2.3);
  float rays = streak * cone * exp(-dist * 1.05) * 1.7 + exp(-dist * 3.6) * 0.55 * cone;
  rays *= ignite * (1.0 + 0.7 * pulseFlash);

  // Perspective grid floor drifting slowly toward the viewer.
  float horizon = mix(0.2, 0.29, wide);
  float below = horizon - uv.y;
  float grid = 0.0;
  float floorLight = 0.0;
  float ring = 0.0;
  if (below > 0.0) {
    float depth = 0.42 / (below + 0.002);
    vec2 f = vec2((p.x - src.x) * depth * 0.85, depth + t * 0.32);
    vec2 d = abs(fract(f - 0.5) - 0.5);
#ifdef GL_OES_standard_derivatives
    vec2 w = fwidth(f);
#else
    vec2 w = vec2(0.02 * depth, 0.02 * depth * depth);
#endif
    vec2 line = 1.0 - smoothstep(w * 0.4, w * 1.4, d);
    grid = max(line.x, line.y);
    grid *= 1.0 - smoothstep(0.18, 0.45, max(w.x, w.y));
    grid *= smoothstep(0.0, 0.07, below);

    // The floor unrolls outward from beneath the stage during the intro.
    vec2 fromStage = vec2((p.x - src.x) / 1.6, below * 2.4);
    grid *= 1.0 - smoothstep(spread * 1.2 - 0.12, spread * 1.2, length(fromStage));

    // Scene-change shockwave: an ellipse racing outward across the floor.
    float r = length(vec2((p.x - src.x) * 0.9, below * 3.2));
    float radius = uPulse * 1.15;
    ring = exp(-pow((r - radius) * 11.0, 2.0)) * exp(-uPulse * 1.5);

    vec2 floorPt = vec2(p.x, uv.y);
    float pointerFloor = exp(-pow(distance(floorPt, vec2(uPointer.x * aspect, uPointer.y)), 2.0) * 9.0);
    floorLight = 0.12 + rays * 1.1 + pointerFloor * 0.7 + ring * 3.0;
  }
  float horizonGlow = exp(-abs(uv.y - horizon) * 30.0) * exp(-abs(p.x - src.x) * 1.4) * ignite;
  // A thin scanning line that draws the horizon open at the start.
  float horizonLine = exp(-abs(uv.y - horizon) * 260.0)
    * (1.0 - smoothstep(lineIn * 1.4 * aspect - 0.05, lineIn * 1.4 * aspect, abs(p.x - src.x)))
    * (0.35 + 0.65 * (1.0 - spread));

  // Halftone dot field revealed by the spotlight and, faintly, the rays.
  float cell = 18.0 * uScale;
  vec2 cid = floor(frag / cell);
  vec2 cuv = fract(frag / cell) - 0.5;
  vec2 cpos = (cid + 0.5) * cell / uRes;
  cpos.x *= aspect;
  float pd = distance(cpos, vec2(uPointer.x * aspect, uPointer.y));
  // Phones keep the dots to a soft spotlight so the copy stays clean.
  float dotI = exp(-pd * pd * mix(26.0, 16.0, wide)) * mix(0.55, 1.0, wide) + rays * 0.45 * wide;
  dotI *= smoothstep(horizon, horizon + 0.08, uv.y) * ignite;
  dotI *= 0.75 + 0.25 * hash(cid);
  float radiusDot = 0.05 + 0.24 * clamp(dotI, 0.0, 1.0);
  float dots = (1.0 - smoothstep(radiusDot - 0.08, radiusDot, length(cuv))) * smoothstep(0.03, 0.2, dotI);

  vec3 tint = uTint;
  vec3 rayCol = mix(tint * 0.85, mix(tint, vec3(1.0), 0.35), clamp(streak * 1.5, 0.0, 1.0));
  vec3 lineCol = mix(tint, vec3(1.0), 0.15);
  float grain = hash(frag + fract(t * 7.3) * 61.0) - 0.5;
  float presence = 1.0 - uExit * 0.65;

  if (uLight < 0.5) {
    // Deep navy that lifts toward the Services section seam at the bottom.
    vec3 top = vec3(0.027, 0.055, 0.14);
    vec3 mid = vec3(0.035, 0.07, 0.165);
    vec3 bottom = vec3(0.106, 0.176, 0.302);
    vec3 col = mix(bottom, mid, smoothstep(0.0, horizon + 0.05, uv.y));
    col = mix(col, top, smoothstep(0.45, 1.0, uv.y));
    vec3 light = rayCol * rays * mix(0.36, 0.5, wide);
    light += lineCol * grid * floorLight * 0.55;
    light += mix(tint, vec3(1.0), 0.4) * (horizonGlow * 0.32 + horizonLine * 0.9 + ring * 0.12);
    light += mix(tint, vec3(1.0), 0.2) * dots * 0.32;
    col += light * presence;
    // Keep the copy column calm and legible on wide screens.
    col *= mix(1.0, mix(0.8, 1.0, smoothstep(0.05, 0.55, uv.x)), wide);
    col += grain * 0.028;
    gl_FragColor = vec4(col, 1.0);
  } else {
    float a = rays * 0.22 + grid * floorLight * 0.3 + horizonGlow * 0.16 + horizonLine * 0.4 + dots * 0.22;
    a = clamp(a * presence + grain * 0.02, 0.0, 0.55);
    vec3 col = mix(vec3(0.0, 0.3, 0.85), tint * 0.8, 0.35);
    gl_FragColor = vec4(col * a, a);
  }
}
`;

const INTRO_MS = 1900;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroBackdrop({ className = "", tint = [0.22, 0.62, 1], pulseKey = 0, pulseDelay = 0 }) {
  const canvasRef = useRef(null);
  const tintRef = useRef(tint);
  const pulseRef = useRef({ key: pulseKey, at: Infinity });

  tintRef.current = tint;

  useEffect(() => {
    // Each scene change sends a shockwave; the first one lands with the stage.
    const current = pulseRef.current;
    if (current.key === pulseKey && current.at !== Infinity) return;
    const delay = current.at === Infinity ? pulseDelay : 0;
    pulseRef.current = { key: pulseKey, at: performance.now() + delay };
  }, [pulseKey, pulseDelay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return undefined;
    gl.getExtension("OES_standard_derivatives");

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return undefined;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = Object.fromEntries(
      ["uRes", "uTime", "uPointer", "uLight", "uScale", "uTint", "uPulse", "uIntro", "uExit"]
        .map((name) => [name, gl.getUniformLocation(program, name)]),
    );

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Grid lines and dots need real pixels, so render near device resolution
    // but cap it to keep the fragment cost predictable.
    const scale = Math.min(window.devicePixelRatio || 1, finePointer ? 1.25 : 1.5);

    const pointer = { x: 0.68, y: 0.55 };
    const target = { x: 0.68, y: 0.55 };
    const color = [...tintRef.current];
    let lastPointerAt = -Infinity;
    let light = document.documentElement.getAttribute("data-theme") === "light" ? 1 : 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (now) => {
      resize();
      const seconds = reduced ? 14 : (now - start) / 1000;
      // Without a recent mouse, the spotlight wanders slowly over the stage.
      if (now - lastPointerAt > 2500) {
        target.x = 0.64 + 0.2 * Math.sin(seconds * 0.21);
        target.y = 0.56 + 0.16 * Math.sin(seconds * 0.29 + 1.3);
      }
      pointer.x += (target.x - pointer.x) * 0.06;
      pointer.y += (target.y - pointer.y) * 0.06;
      for (let i = 0; i < 3; i++) color[i] += (tintRef.current[i] - color[i]) * (reduced ? 1 : 0.05);
      const pulseAge = Math.max(0, (now - pulseRef.current.at) / 1000);
      const rect = canvas.getBoundingClientRect();
      const exit = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));

      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, seconds);
      gl.uniform2f(u.uPointer, pointer.x, pointer.y);
      gl.uniform1f(u.uLight, light);
      gl.uniform1f(u.uScale, scale);
      gl.uniform3f(u.uTint, color[0], color[1], color[2]);
      gl.uniform1f(u.uPulse, reduced || now < pulseRef.current.at ? 99 : pulseAge);
      gl.uniform1f(u.uIntro, reduced ? 1 : Math.min(1, (now - start) / INTRO_MS));
      gl.uniform1f(u.uExit, exit);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // ~30fps is plenty for slow light; the intro runs at full rate for smoothness.
    const loop = (now) => {
      if (now - start < INTRO_MS || now - last >= 32) { last = now; draw(now); }
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const resume = () => {
      if (reduced) { draw(performance.now()); return; }
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const onPointer = (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
      lastPointerAt = performance.now();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    observer.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      light = document.documentElement.getAttribute("data-theme") === "light" ? 1 : 0;
      if (reduced) draw(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onResize = () => { if (reduced) draw(performance.now()); };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("resize", onResize);
    if (finePointer && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });
    canvas.style.opacity = "1";
    resume();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full opacity-0 transition-opacity duration-300 ${className}`}
    />
  );
}
