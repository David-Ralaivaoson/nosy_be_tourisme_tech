import { Breakpoint, getBreakpoint } from "@/src/hooks/useBreakpoint";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SurMesureHeading } from "./Handwritten";

// ─── Compteur animé ───────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 1800,
  color,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  color: string;
}) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease out expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.floor(eased * target));
      if (t < 1) requestAnimationFrame(raf);
      else setValue(target);
    };
    requestAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <div ref={ref}>
      <span style={{ color, fontWeight: 900 }}>
        {prefix}
        {value}
        {suffix}
      </span>
    </div>
  );
}

// ─── Ligne de feature avec reveal ────────────────────────────────────────────
function FeatureRow({
  label,
  color,
  delay = 0,
  visible,
}: {
  label: string;
  color: string;
  delay?: number;
  visible: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        fontFamily: "var(--mono)",
        fontSize: "0.6rem",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: "3px",
          border: `1px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "1px",
            background: color,
          }}
        />
      </span>
      {label}
    </div>
  );
}

export function SceneTexts() {
  const [mounted, setMounted] = useState(false);
  const [bp, setBp] = useState<Breakpoint>("desktop");

  // Visibilité des scènes pour déclencher les animations internes
  const [scene2Visible, setScene2Visible] = useState(false);
  const [scene3Visible, setScene3Visible] = useState(false);
  const [scene4Visible, setScene4Visible] = useState(false);
  const [scene5Visible, setScene5Visible] = useState(false);

  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const scene5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const update = () => setBp(getBreakpoint(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Observer chaque scène pour déclencher animations internes
  useEffect(() => {
    if (!mounted) return;
    const pairs: [
      React.RefObject<HTMLDivElement | null>,
      (v: boolean) => void,
    ][] = [
      [scene2Ref, setScene2Visible],
      [scene3Ref, setScene3Visible],
      [scene4Ref, setScene4Visible],
      [scene5Ref, setScene5Visible],
    ];
    const observers = pairs.map(([ref, setter]) => {
      const obs = new IntersectionObserver(
        ([entry]) => setter(entry.intersectionRatio > 0.15),
        { threshold: [0, 0.15, 0.5] },
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [mounted]);

  if (!mounted) return null;

  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const mono =
    "'JetBrains Mono','SF Mono','Fira Code','IBM Plex Mono',monospace";

  return createPortal(
    <>
      <style>{`
        :root { --mono: ${mono}; }

        @keyframes pulse-dot {
          0%,100% { opacity:.5; transform:scale(1); box-shadow:0 0 0 0 currentColor; }
          50%      { opacity:1; transform:scale(1.15); box-shadow:0 0 8px 2px currentColor; }
        }
        @keyframes line-slide {
          0%   { transform:scaleY(0); opacity:0; transform-origin:top; }
          100% { transform:scaleY(1); opacity:1; transform-origin:top; }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fade-right {
          from { opacity:0; transform:translateX(18px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fade-left {
          from { opacity:0; transform:translateX(-18px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes gradient-pan {
          0%,100% { background-position:0% 50%; }
          50%     { background-position:100% 50%; }
        }
        @keyframes blink {
          0%,100%{ opacity:1; } 50%{ opacity:0; }
        }
        @keyframes scan {
          0%   { transform:translateY(-10%); }
          100% { transform:translateY(110%); }
        }
        @keyframes bar-fill {
          from { width:0; }
          to   { width:92%; }
        }
        @keyframes corner-draw {
          from { clip-path:inset(0 100% 100% 0); }
          to   { clip-path:inset(0 0% 0% 0); }
        }

        .g-violet {
          background:linear-gradient(135deg,#a78bfa 0%,#7c3aed 50%,#a78bfa 100%);
          background-size:200% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:gradient-pan 4s ease infinite;
        }
        .g-blue {
          background:linear-gradient(135deg,#60a5fa 0%,#3b82f6 50%,#60a5fa 100%);
          background-size:200% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:gradient-pan 4s ease infinite;
        }
        .g-emerald {
          background:linear-gradient(135deg,#34d399 0%,#059669 50%,#34d399 100%);
          background-size:200% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:gradient-pan 4s ease infinite;
        }

        .mono { font-family:var(--mono); }
        .hud  { font-family:var(--mono); font-size:.55rem; letter-spacing:.26em;
                text-transform:uppercase; color:rgba(255,255,255,.25); }

        .tech-chip {
          padding:.28rem .72rem; border-radius:4px;
          font-family:var(--mono); font-size:.54rem; font-weight:700;
          letter-spacing:.12em; text-transform:uppercase;
          transition:all .25s ease;
        }

        /* Badge pulsé */
        .pulse-dot {
          width:6px; height:6px; border-radius:50%;
          animation:pulse-dot 2.2s ease-in-out infinite;
        }

        /* Watermark */
        .wmk {
          position:absolute; font-family:var(--mono); font-weight:900;
          color:rgba(255,255,255,.018); line-height:1;
          user-select:none; pointer-events:none;
        }

        /* Corner accent */
        .corner { position:absolute; width:28px; height:28px; }
        .corner-tl { top:0; left:0; border-top:1px solid; border-left:1px solid; }
        .corner-tr { top:0; right:0; border-top:1px solid; border-right:1px solid; }
        .corner-bl { bottom:0; left:0; border-bottom:1px solid; border-left:1px solid; }
        .corner-br { bottom:0; right:0; border-bottom:1px solid; border-right:1px solid; }

        /* Scan line pour scènes */
        .scan-overlay {
          position:absolute; inset:0; pointer-events:none; overflow:hidden;
        }
        .scan-overlay::after {
          content:''; position:absolute; left:0; right:0; height:60px;
          background:linear-gradient(to bottom, transparent, rgba(167,139,250,.04), transparent);
          animation:scan 6s linear infinite;
        }
      `}</style>

      <div
        id="scene-texts-portal"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 15,
          pointerEvents: "none",
          overflow: "hidden",
          color: "white",
          fontFamily: "'Inter','Helvetica Neue',sans-serif",
        }}
      >
        {/* ════════════════════════════════════════════════════════════════
            SCENE 1 — HERO
        ════════════════════════════════════════════════════════════════ */}
        <div
          className="scene-1-text"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile
              ? "0 1.5rem 50vh"
              : isTablet
                ? "0 2rem 35vh"
                : "0 2rem",
            transformOrigin: "center center",
            opacity: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              marginBottom: isMobile ? "1.25rem" : "2rem",
            }}
          >
            <div
              style={{
                width: isMobile ? "2rem" : "3.5rem",
                height: 1,
                background:
                  "linear-gradient(to right,transparent,rgba(167,139,250,.45))",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".3rem 1rem",
                border: "1px solid rgba(167,139,250,.14)",
                borderRadius: "3px",
                background: "rgba(167,139,250,.04)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="pulse-dot"
                style={{ background: "#a78bfa", color: "#a78bfa" }}
              />
              <span
                className="mono"
                style={{
                  fontSize: ".54rem",
                  fontWeight: 700,
                  letterSpacing: ".32em",
                  textTransform: "uppercase",
                  color: "rgba(167,139,250,.7)",
                }}
              >
                {isMobile ? "STUDIO DIGITAL" : "STUDIO DIGITAL D'EXCEPTION"}
              </span>
            </div>
            <div
              style={{
                width: isMobile ? "2rem" : "3.5rem",
                height: 1,
                background:
                  "linear-gradient(to left,transparent,rgba(167,139,250,.45))",
              }}
            />
          </div>

          {/* Headline — 3 lignes en cascade */}
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "1.5rem" : "2.5rem",
            }}
          >
            <h1
              style={{
                fontSize: isMobile
                  ? "clamp(1.9rem,9vw,2.9rem)"
                  : isTablet
                    ? "clamp(2.4rem,6vw,4rem)"
                    : "clamp(3.2rem,6.5vw,5.8rem)",
                display: isMobile ? "block" : "inline-block",
                fontWeight: 200,
                lineHeight: 0.8,
                letterSpacing: "-.025em",
                marginBottom: ".1em",
                animation: "fade-up .8s ease both",
                color: "rgba(255,255,255,.9)",
              }}
            >
              Solutions
            </h1>
            <h1
              style={{
                fontSize: isMobile
                  ? "clamp(1.9rem,9vw,2.9rem)"
                  : isTablet
                    ? "clamp(2.4rem,6vw,4rem)"
                    : "clamp(3.2rem,6.5vw,5.8rem)",
                display: isMobile ? "block" : "inline-block",
                marginLeft: isMobile ? 0 : "2rem",
                fontWeight: 200,
                lineHeight: 0.8,
                letterSpacing: "-.025em",
                marginBottom: ".1em",
                animation: "fade-up .8s .12s ease both",
              }}
            >
              <span className="g-violet">digitales</span>
            </h1>
            <SurMesureHeading isMobile={isMobile} isTablet={isTablet} />
          </div>

          {/* Indicateur scroll */}
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: isTablet ? "2rem" : "3rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: ".55rem",
              }}
            >
              <div
                style={{
                  width: 1,
                  height: "3.5rem",
                  background:
                    "linear-gradient(to bottom,transparent,rgba(167,139,250,.4))",
                }}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
              >
                <span className="hud" style={{ fontSize: ".48rem" }}>
                  01
                </span>
                <div
                  style={{
                    width: "1.5rem",
                    height: 1,
                    background: "rgba(255,255,255,.08)",
                  }}
                />
                <span className="hud" style={{ fontSize: ".62rem" }}>
                  Scroll pour explorer
                </span>
                <div
                  style={{
                    width: "1.5rem",
                    height: 1,
                    background: "rgba(255,255,255,.08)",
                  }}
                />
                <span className="hud" style={{ fontSize: ".48rem" }}>
                  05
                </span>
              </div>
            </div>
          )}

          {/* Coins */}
          {!isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: isTablet ? "5rem" : "5.5rem",
                  left: isTablet ? "1.5rem" : "2.5rem",
                  width: 24,
                  height: 24,
                  borderTop: "1px solid rgba(167,139,250,.14)",
                  borderLeft: "1px solid rgba(167,139,250,.14)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: isTablet ? "5rem" : "6rem",
                  right: isTablet ? "1.5rem" : "2.5rem",
                  width: 24,
                  height: 24,
                  borderBottom: "1px solid rgba(167,139,250,.14)",
                  borderRight: "1px solid rgba(167,139,250,.14)",
                }}
              />
            </>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SCENE 2 — SOLUTIONS WEB
        ════════════════════════════════════════════════════════════════ */}
        <div
          ref={scene2Ref}
          className="scene-2-text"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-end",
            padding: isMobile
              ? "0 1.5rem 50vh"
              : isTablet
                ? `0 clamp(2rem,6vw,4rem) 35vh`
                : `0 clamp(2rem,8vw,5rem)`,
            opacity: 0,
          }}
        >
          <div className="scan-overlay" />

          <div
            style={{
              maxWidth: isMobile ? "100%" : "460px",
              textAlign: isMobile ? "center" : "right",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".65rem",
                justifyContent: isMobile ? "center" : "flex-end",
                marginBottom: "1.5rem",
                opacity: scene2Visible ? 1 : 0,
                transform: scene2Visible ? "translateX(0)" : "translateX(16px)",
                transition: "opacity .5s ease, transform .5s ease",
              }}
            ></div>

            {/* Headline */}
            <h2
              style={{
                fontSize: isMobile
                  ? "clamp(1.6rem,7vw,2.4rem)"
                  : "clamp(2rem,4vw,3.2rem)",
                fontWeight: 200,
                lineHeight: 1.08,
                letterSpacing: "-.025em",
                marginBottom: ".25rem",
                opacity: scene2Visible ? 1 : 0,
                transform: scene2Visible ? "translateX(0)" : "translateX(20px)",
                transition: "opacity .5s .1s ease, transform .5s .1s ease",
              }}
            >
              Sites web
            </h2>
            <h2
              style={{
                fontSize: isMobile
                  ? "clamp(1.6rem,7vw,2.4rem)"
                  : "clamp(2rem,4vw,3.2rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-.04em",
                marginBottom: isMobile ? "1rem" : "1.6rem",
                opacity: scene2Visible ? 1 : 0,
                transform: scene2Visible ? "translateX(0)" : "translateX(20px)",
                transition: "opacity .5s .18s ease, transform .5s .18s ease",
              }}
            >
              <span className="g-violet">haute</span> performance.
            </h2>

            {/* Description */}
            {!isMobile && (
              <p
                style={{
                  color: "rgba(255,255,255,.32)",
                  fontSize: ".85rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                  opacity: scene2Visible ? 1 : 0,
                  transition: "opacity .6s .28s ease",
                }}
              >
                Des interfaces immersives pensées pour convertir, avec des
                animations fluides et une UX irréprochable.
              </p>
            )}

            {/* Séparateur animé */}
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(to left, rgba(167,139,250,.35), transparent)",
                marginBottom: isMobile ? ".75rem" : "1.25rem",
                transform: scene2Visible ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "right",
                transition: "transform .6s .3s ease",
              }}
            />

            {/* Tech chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: ".4rem",
                justifyContent: isMobile ? "center" : "flex-end",
                marginBottom: !isMobile ? "1.4rem" : 0,
              }}
            >
              {["Next.js", "React", "Three.js", "GSAP"].map((tech, i) => (
                <span
                  key={tech}
                  className="tech-chip"
                  style={{
                    border: "1px solid rgba(167,139,250,.16)",
                    background: "rgba(167,139,250,.05)",
                    color: "rgba(167,139,250,.65)",
                    opacity: scene2Visible ? 1 : 0,
                    transform: scene2Visible
                      ? "translateY(0)"
                      : "translateY(8px)",
                    transition: `opacity .4s ${0.35 + i * 0.07}s ease, transform .4s ${0.35 + i * 0.07}s ease`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Feature rows */}
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".55rem",
                  alignItems: "flex-end",
                }}
              >
                {[
                  { label: "Motion-first UI", delay: 420 },
                  { label: "Headless architecture", delay: 490 },
                  { label: "SEO & Core Web Vitals", delay: 560 },
                ].map(({ label, delay }) => (
                  <FeatureRow
                    key={label}
                    label={label}
                    color="#a78bfa"
                    delay={delay}
                    visible={scene2Visible}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SCENE 3 — APPLICATIONS MOBILE
        ════════════════════════════════════════════════════════════════ */}
        <div
          ref={scene3Ref}
          className="scene-3-text"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-start",
            padding: isMobile
              ? "0 1.5rem 50vh"
              : isTablet
                ? `0 clamp(2rem,6vw,4rem) 35vh`
                : `0 clamp(2rem,8vw,5rem)`,
            opacity: 0,
          }}
        >
          <div className="scan-overlay" />

          <div
            style={{
              maxWidth: isMobile ? "100%" : "460px",
              textAlign: isMobile ? "center" : "left",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".65rem",
                justifyContent: isMobile ? "center" : "flex-start",
                marginBottom: "1.5rem",
                opacity: scene3Visible ? 1 : 0,
                transform: scene3Visible
                  ? "translateX(0)"
                  : "translateX(-16px)",
                transition: "opacity .5s ease, transform .5s ease",
              }}
            ></div>

            {/* Headline */}
            <div style={{ marginBottom: isMobile ? "1rem" : "1.6rem" }}>
              {[
                { text: "Scalable.", weight: 900, cls: "", delay: 0.1 },
                { text: "Élégant.", weight: 200, cls: "g-blue", delay: 0.18 },
                { text: "Puissant.", weight: 200, cls: "", delay: 0.26 },
              ].map(({ text, weight, cls, delay }) => (
                <h2
                  key={text}
                  style={{
                    fontSize: isMobile
                      ? "clamp(1.6rem,7vw,2.4rem)"
                      : "clamp(2rem,4vw,3.2rem)",
                    fontWeight: weight,
                    lineHeight: 1.04,
                    letterSpacing: "-.035em",
                    marginBottom: ".1rem",
                    opacity: scene3Visible ? 1 : 0,
                    transform: scene3Visible
                      ? "translateX(0)"
                      : "translateX(-18px)",
                    transition: `opacity .5s ${delay}s ease, transform .5s ${delay}s ease`,
                  }}
                >
                  {cls ? <span className={cls}>{text}</span> : text}
                </h2>
              ))}
            </div>

            {!isMobile && (
              <p
                style={{
                  color: "rgba(255,255,255,.32)",
                  fontSize: ".85rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                  opacity: scene3Visible ? 1 : 0,
                  transition: "opacity .6s .32s ease",
                }}
              >
                Des dashboards et applications mobiles sur mesure, conçus pour
                les entreprises en croissance.
              </p>
            )}

            {/* Séparateur */}
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(to right, rgba(96,165,250,.35), transparent)",
                marginBottom: isMobile ? ".75rem" : "1.25rem",
                transform: scene3Visible ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform .6s .3s ease",
              }}
            />

            {/* Chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: ".4rem",
                justifyContent: isMobile ? "center" : "flex-start",
                marginBottom: !isMobile ? "1.4rem" : 0,
              }}
            >
              {["React Native", "TypeScript", "Supabase", "Stripe"].map(
                (tech, i) => (
                  <span
                    key={tech}
                    className="tech-chip"
                    style={{
                      border: "1px solid rgba(96,165,250,.16)",
                      background: "rgba(96,165,250,.05)",
                      color: "rgba(96,165,250,.65)",
                      opacity: scene3Visible ? 1 : 0,
                      transform: scene3Visible
                        ? "translateY(0)"
                        : "translateY(8px)",
                      transition: `opacity .4s ${0.35 + i * 0.07}s ease, transform .4s ${0.35 + i * 0.07}s ease`,
                    }}
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>

            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".55rem",
                  alignItems: "flex-start",
                }}
              >
                {[
                  { label: "Realtime data experience", delay: 420 },
                  { label: "Product-oriented UI systems", delay: 490 },
                  { label: "Secure payment workflows", delay: 560 },
                ].map(({ label, delay }) => (
                  <FeatureRow
                    key={label}
                    label={label}
                    color="#60a5fa"
                    delay={delay}
                    visible={scene3Visible}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SCENE 4 — RÉSULTATS
        ════════════════════════════════════════════════════════════════ */}
        <div
          ref={scene4Ref}
          className="scene-4-text"
          style={{
            position: "absolute",
            top: isMobile ? 0 : "auto",
            bottom: isMobile ? "auto" : "4rem",
            left: 0,
            right: 0,
            height: isMobile ? "50%" : "auto",
            display: "flex",
            alignItems: isMobile ? "center" : "flex-end",
            justifyContent: "center",
            opacity: 0,
            padding: isMobile ? "0 1.5rem" : "0 2rem",
          }}
        >
          <div
            style={{ maxWidth: "720px", textAlign: "center", width: "100%" }}
          >
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: ".75rem",
                marginBottom: "2rem",
                opacity: scene4Visible ? 1 : 0,
                transition: "opacity .5s ease",
              }}
            >
              <div
                style={{
                  width: isMobile ? "2rem" : "5rem",
                  height: 1,
                  background:
                    "linear-gradient(to right,transparent,rgba(52,211,153,.35))",
                }}
              />
              <div
                style={{
                  width: isMobile ? "2rem" : "5rem",
                  height: 1,
                  background:
                    "linear-gradient(to left,transparent,rgba(52,211,153,.35))",
                }}
              />
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "center",
                gap: isMobile ? "1.5rem" : 0,
                marginBottom: "2rem",
              }}
            >
              {[
                {
                  target: 150,
                  suffix: "+",
                  label: "Projets livrés",
                  color: "#a78bfa",
                  sub: "depuis 2019",
                  delay: 0,
                },
                {
                  target: 99.9,
                  suffix: "%",
                  label: "Uptime garanti",
                  color: "#34d399",
                  sub: "SLA contractuel",
                  delay: 200,
                },
                {
                  target: 2.1,
                  suffix: "s",
                  label: "LCP moyen",
                  color: "#60a5fa",
                  sub: "Core Web Vitals",
                  delay: 400,
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    borderRight:
                      !isMobile && i < 2
                        ? "1px solid rgba(255,255,255,.06)"
                        : "none",
                    borderBottom:
                      isMobile && i < 2
                        ? "1px solid rgba(255,255,255,.06)"
                        : "none",
                    padding: isMobile ? "1rem 0" : "0 2.5rem",
                    opacity: scene4Visible ? 1 : 0,
                    transform: scene4Visible
                      ? "translateY(0)"
                      : "translateY(16px)",
                    transition: `opacity .5s ${stat.delay}ms ease, transform .5s ${stat.delay}ms ease`,
                  }}
                >
                  <div
                    style={{
                      fontSize: isMobile
                        ? "clamp(2rem,8vw,2.8rem)"
                        : "clamp(2.2rem,3.5vw,3.2rem)",
                      fontWeight: 900,
                      letterSpacing: "-.05em",
                      lineHeight: 1,
                      marginBottom: ".45rem",
                    }}
                  >
                    {scene4Visible ? (
                      <AnimatedCounter
                        target={stat.target}
                        suffix={stat.suffix}
                        color={stat.color}
                        duration={1400}
                      />
                    ) : (
                      <span style={{ color: stat.color }}>0{stat.suffix}</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: ".85rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,.65)",
                      marginBottom: ".25rem",
                    }}
                  >
                    {stat.label}
                  </div>
                  <span className="hud" style={{ fontSize: ".46rem" }}>
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Barre de progression */}
            {!isMobile && (
              <div
                style={{
                  position: "relative",
                  width: "55%",
                  height: 2,
                  margin: "0 auto 1.5rem",
                  background: "rgba(255,255,255,.05)",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    background:
                      "linear-gradient(90deg,#a78bfa,#34d399,#60a5fa)",
                    borderRadius: 1,
                    width: scene4Visible ? "92%" : "0",
                    transition: "width 1.2s .6s ease",
                  }}
                />
              </div>
            )}

            <p
              style={{
                color: "rgba(255,255,255,.25)",
                fontWeight: 300,
                fontSize: isMobile ? ".78rem" : ".88rem",
                letterSpacing: ".06em",
                opacity: scene4Visible ? 1 : 0,
                transition: "opacity .6s .7s ease",
              }}
            >
              Des solutions robustes qui perdurent dans le temps.
            </p>
          </div>
        </div>

        {/* Overlay */}
        <div
          className="scene-5-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "#050505",
            opacity: 0,
            zIndex: 10,
          }}
        />

        {/* ════════════════════════════════════════════════════════════════
            SCENE 5 — DÉCOUVERTE
        ════════════════════════════════════════════════════════════════ */}
        <div
          ref={scene5Ref}
          className="scene-5-discover"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 11,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: isMobile ? "3.5rem" : "6rem",
            opacity: 0,
            transform: "translateY(-20px)",
          }}
        >
          <div className="scan-overlay" />

          {/* Ligne d'entrée */}
          <div
            style={{
              width: 1,
              height: isMobile ? "2rem" : "3rem",
              background:
                "linear-gradient(to bottom,transparent,rgba(167,139,250,.55))",
              marginBottom: "1.5rem",
              opacity: scene5Visible ? 1 : 0,
              transform: scene5Visible ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "top",
              transition: "opacity .5s ease, transform .5s ease",
            }}
          />

          {/* Label */}
          <span
            className="mono"
            style={{
              fontSize: ".54rem",
              fontWeight: 700,
              letterSpacing: ".38em",
              textTransform: "uppercase",
              color: "rgba(167,139,250,.55)",
              marginBottom: "1.5rem",
              opacity: scene5Visible ? 1 : 0,
              transition: "opacity .5s .1s ease",
            }}
          >
            EXPLOREZ L'UNIVERS LUMINA
          </span>

          {/* Titre */}
          <h2
            style={{
              fontSize: isMobile
                ? "clamp(1.7rem,7vw,2.6rem)"
                : "clamp(2.6rem,5.5vw,4.2rem)",
              fontWeight: 200,
              textAlign: "center",
              lineHeight: 1.06,
              letterSpacing: "-.025em",
              marginBottom: ".2rem",
              opacity: scene5Visible ? 1 : 0,
              transform: scene5Visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity .5s .15s ease, transform .5s .15s ease",
            }}
          >
            Découvrez <span className="g-violet">tous</span>
          </h2>
          <h2
            style={{
              fontSize: isMobile
                ? "clamp(1.7rem,7vw,2.6rem)"
                : "clamp(2.6rem,5.5vw,4.2rem)",
              fontWeight: 900,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "-.05em",
              lineHeight: 1,
              marginBottom: "2.5rem",
              opacity: scene5Visible ? 1 : 0,
              transform: scene5Visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity .5s .22s ease, transform .5s .22s ease",
            }}
          >
            nos services.
          </h2>

          {/* Grille services */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)",
              gap: isMobile ? ".45rem" : ".65rem",
              maxWidth: isMobile ? "300px" : "660px",
              width: "100%",
              padding: "0 1.5rem",
            }}
          >
            {[
              {
                icon: "◆",
                name: "Sites Web",
                desc: "Next.js / React",
                color: "#a78bfa",
              },
              {
                icon: "◈",
                name: "Apps Mobile",
                desc: "React Native",
                color: "#60a5fa",
              },
              {
                icon: "◇",
                name: "UI/UX Design",
                desc: "Figma / Framer",
                color: "#c084fc",
              },
              {
                icon: "▸",
                name: "SEO",
                desc: "Core Web Vitals",
                color: "#34d399",
              },
              {
                icon: "▹",
                name: "Branding",
                desc: "Identité visuelle",
                color: "#f472b6",
              },
              {
                icon: "◻",
                name: "E-commerce",
                desc: "Shopify / Stripe",
                color: "#fb923c",
              },
            ].map((s, i) => (
              <div
                key={s.name}
                style={{
                  padding: isMobile ? ".6rem .5rem" : ".75rem .9rem",
                  borderRadius: "5px",
                  border: "1px solid rgba(255,255,255,.055)",
                  background: "rgba(255,255,255,.012)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMobile ? "center" : "flex-start",
                  gap: ".28rem",
                  opacity: scene5Visible ? 1 : 0,
                  transform: scene5Visible
                    ? "translateY(0)"
                    : "translateY(12px)",
                  transition: `opacity .4s ${0.28 + i * 0.06}s ease, transform .4s ${0.28 + i * 0.06}s ease`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".45rem",
                  }}
                >
                  <span style={{ fontSize: ".55rem", color: s.color }}>
                    {s.icon}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: isMobile ? ".56rem" : ".62rem",
                      fontWeight: 700,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,.62)",
                    }}
                  >
                    {s.name}
                  </span>
                </div>
                <span
                  className="hud"
                  style={{
                    fontSize: ".43rem",
                    paddingLeft: isMobile ? 0 : ".9rem",
                  }}
                >
                  {s.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: ".75rem",
              opacity: scene5Visible ? 1 : 0,
              transition: "opacity .5s .6s ease",
            }}
          >
            <div
              style={{
                width: 1,
                height: "2rem",
                background:
                  "linear-gradient(to bottom,rgba(167,139,250,.35),transparent)",
              }}
            />
            <span
              className="hud"
              style={{
                fontSize: ".46rem",
                letterSpacing: ".35em",
                color: "rgba(255,255,255,.15)",
              }}
            >
              CONTINUEZ ↓
            </span>
          </div>

          {/* Coins */}
          {!isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: "4rem",
                  left: "2rem",
                  width: 24,
                  height: 24,
                  borderTop: "1px solid rgba(167,139,250,.12)",
                  borderLeft: "1px solid rgba(167,139,250,.12)",
                  opacity: scene5Visible ? 1 : 0,
                  transition: "opacity .5s .5s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "4rem",
                  right: "2rem",
                  width: 24,
                  height: 24,
                  borderTop: "1px solid rgba(167,139,250,.12)",
                  borderRight: "1px solid rgba(167,139,250,.12)",
                  opacity: scene5Visible ? 1 : 0,
                  transition: "opacity .5s .55s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "4rem",
                  left: "2rem",
                  width: 24,
                  height: 24,
                  borderBottom: "1px solid rgba(167,139,250,.12)",
                  borderLeft: "1px solid rgba(167,139,250,.12)",
                  opacity: scene5Visible ? 1 : 0,
                  transition: "opacity .5s .6s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "4rem",
                  right: "2rem",
                  width: 24,
                  height: 24,
                  borderBottom: "1px solid rgba(167,139,250,.12)",
                  borderRight: "1px solid rgba(167,139,250,.12)",
                  opacity: scene5Visible ? 1 : 0,
                  transition: "opacity .5s .65s ease",
                }}
              />
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
