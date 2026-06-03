// src/components/NeuralBackground.tsx
"use client";

import { useRef, useEffect, useCallback } from "react";

// ─── Configuration ────────────────────────────────────────────────────────────
const CONFIG = {
  // Nombre de neurones
  particleCount: 100,
  // Distance max pour dessiner une connexion
  connectionDistance: 100,
  // Distance d'influence de la souris
  mouseRadius: 200,
  // Force de répulsion de la souris
  mouseRepelForce: 0.06,
  // Vitesse de base des particules
  baseSpeed: 0.5,
  // Taille min/max des neurones
  minSize: 1.2,
  maxSize: 2.8,
  // Couleurs
  colors: {
    particle: "rgba(167, 139, 250, ", // violet (alpha ajouté dynamiquement)
    connection: "rgba(96, 165, 250, ", // bleu
    mouseGlow: "rgba(167, 139, 250, ", // violet glow
    pulse: "rgba(139, 92, 246, ", // pulse ring
  },
  // Opacité de base
  baseOpacity: 0.35,
  // Fréquence des pulses (ms)
  pulseInterval: 2000,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  opacity: number;
  hue: number; // 0 = violet, 1 = bleu
}

interface Pulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  startTime: number;
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animFrameRef = useRef<number>(0);
  const lastPulseRef = useRef(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  // ─── Initialisation des particules ────────────────────────────────────────
  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      const baseSize =
        CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * CONFIG.baseSpeed,
        vy: (Math.random() - 0.5) * CONFIG.baseSpeed,
        size: baseSize,
        baseSize,
        opacity: 0.2 + Math.random() * 0.5,
        hue: Math.random(), // 0→violet, 1→bleu
      });
    }
    particlesRef.current = particles;
  }, []);

  // ─── Resize ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      dimensionsRef.current = { w, h };

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      // Réinitialiser les particules si vide
      if (particlesRef.current.length === 0) {
        initParticles(w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [initParticles]);

  // ─── Mouse tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };
    const onTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // ─── Animation loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = (time: number) => {
      const { w, h } = dimensionsRef.current;
      if (w === 0 || h === 0) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const pulses = pulsesRef.current;

      // ── Pulse aléatoire ────────────────────────────────────────────────
      if (time - lastPulseRef.current > CONFIG.pulseInterval) {
        lastPulseRef.current = time;
        // Pulse depuis une particule aléatoire
        const rp = particles[Math.floor(Math.random() * particles.length)];
        if (rp) {
          pulses.push({
            x: rp.x,
            y: rp.y,
            radius: 0,
            maxRadius: 120 + Math.random() * 80,
            opacity: 0.15,
            startTime: time,
          });
        }
      }

      // ── Update & draw pulses ───────────────────────────────────────────
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const elapsed = time - pulse.startTime;
        const progress = elapsed / 2000; // 2s duration

        if (progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        pulse.radius = pulse.maxRadius * easeOutCubic(progress);
        const alpha = pulse.opacity * (1 - progress);

        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${CONFIG.colors.pulse}${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── Update particles ───────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONFIG.mouseRadius && dist > 0) {
            const force =
              (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseRepelForce;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;

            // Grow near mouse
            p.size = p.baseSize + (1 - dist / CONFIG.mouseRadius) * 2.5;
            p.opacity = Math.min(
              1,
              p.opacity + (1 - dist / CONFIG.mouseRadius) * 0.05,
            );
          } else {
            // Return to base
            p.size += (p.baseSize - p.size) * 0.05;
          }
        } else {
          p.size += (p.baseSize - p.size) * 0.05;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Minimum velocity (drift)
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < CONFIG.baseSpeed * 0.3) {
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Opacity decay back to base
        p.opacity += (0.2 + p.hue * 0.3 - p.opacity) * 0.02;
      }

      // ── Draw connections ───────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONFIG.connectionDistance) {
            const alpha =
              (1 - dist / CONFIG.connectionDistance) * CONFIG.baseOpacity * 0.6;

            // Check if mouse is near the connection midpoint
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            let mouseBoost = 0;
            if (mouse.active) {
              const mdx = mx - mouse.x;
              const mdy = my - mouse.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < CONFIG.mouseRadius) {
                mouseBoost = (1 - mdist / CONFIG.mouseRadius) * 0.4;
              }
            }

            const finalAlpha = Math.min(1, alpha + mouseBoost);

            // Gradient line between the two particle colors
            const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            const colorA =
              a.hue < 0.5 ? CONFIG.colors.particle : CONFIG.colors.connection;
            const colorB =
              b.hue < 0.5 ? CONFIG.colors.particle : CONFIG.colors.connection;
            gradient.addColorStop(0, `${colorA}${finalAlpha})`);
            gradient.addColorStop(1, `${colorB}${finalAlpha})`);

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5 + mouseBoost * 2;
            ctx.stroke();
          }
        }
      }

      // ── Draw mouse glow ────────────────────────────────────────────────
      if (mouse.active) {
        const glowGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          CONFIG.mouseRadius,
        );
        glowGradient.addColorStop(0, `${CONFIG.colors.mouseGlow}0.06)`);
        glowGradient.addColorStop(0.5, `${CONFIG.colors.mouseGlow}0.02)`);
        glowGradient.addColorStop(1, `${CONFIG.colors.mouseGlow}0)`);

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, CONFIG.mouseRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }

      // ── Draw particles ─────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const color =
          p.hue < 0.5 ? CONFIG.colors.particle : CONFIG.colors.connection;

        // Outer glow
        const glowSize = p.size * 3;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        glow.addColorStop(0, `${color}${p.opacity * 0.4})`);
        glow.addColorStop(1, `${color}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${p.opacity})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Easing helper ────────────────────────────────────────────────────────────
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
