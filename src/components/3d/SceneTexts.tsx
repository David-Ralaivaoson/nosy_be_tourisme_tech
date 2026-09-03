"use client";
import { Breakpoint, getBreakpoint } from "@/src/hooks/useBreakpoint";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Compass } from "lucide-react";
import { SainteMarieUnderline } from "./Handwritten";

function AnimatedCounter({
  target,
  suffix = "",
  duration = 1800,
  color,
}: {
  target: number;
  suffix?: string;
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
      ([e]) => {
        if (e.isIntersecting && !started) {
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
        {value}
        {suffix}
      </span>
    </div>
  );
}

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
        color: "rgba(23,18,58,0.55)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          border: `1px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{ width: 5, height: 5, borderRadius: 1, background: color }}
        />
      </span>
      {label}
    </div>
  );
}

export function SceneTexts() {
  const [mounted, setMounted] = useState(false);
  const [bp, setBp] = useState<Breakpoint>("desktop");
  const [s2, setS2] = useState(false);
  const [s3, setS3] = useState(false);
  const [s4, setS4] = useState(false);
  const [s5, setS5] = useState(false);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const r4 = useRef<HTMLDivElement>(null);
  const r5 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const u = () => setBp(getBreakpoint(window.innerWidth));
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    const pairs: [
      React.RefObject<HTMLDivElement | null>,
      (v: boolean) => void,
    ][] = [
      [r2, setS2],
      [r3, setS3],
      [r4, setS4],
      [r5, setS5],
    ];
    const obs = pairs.map(([ref, set]) => {
      const o = new IntersectionObserver(
        ([e]) => set(e.intersectionRatio > 0.15),
        { threshold: [0, 0.15, 0.5] },
      );
      if (ref.current) o.observe(ref.current);
      return o;
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [mounted]);
  if (!mounted) return null;

  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const mono = "'JetBrains Mono','SF Mono','Fira Code',monospace";

  return createPortal(
    <>
      <style>{`
        :root { --mono: ${mono}; }
        @keyframes pulse-dot { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradient-pan { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes scan { 0%{transform:translateY(-10%)} 100%{transform:translateY(110%)} }
        .g-violet{background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 45%,#a78bfa 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gradient-pan 4s ease infinite}
        .g-blue{background:linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#60a5fa 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gradient-pan 4s ease infinite}
        .mono{font-family:var(--mono)}
        .hud{font-family:var(--mono);font-size:.55rem;letter-spacing:.26em;text-transform:uppercase;color:rgba(23,18,58,.38)}
        .tech-chip{padding:.28rem .72rem;border-radius:999px;font-family:var(--mono);font-size:.54rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
        .scan-overlay{position:absolute;inset:0;pointer-events:none;overflow:hidden}
        .scan-overlay::after{content:'';position:absolute;left:0;right:0;height:60px;background:linear-gradient(to bottom,transparent,rgba(124,58,237,.05),transparent);animation:scan 6s linear infinite}
      `}</style>
      <div
        id="scene-texts-portal"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 15,
          pointerEvents: "none",
          overflow: "hidden",
          color: "#17123a",
          fontFamily: "'Inter','Helvetica Neue',sans-serif",
        }}
      >
        {/* SCENE 1 — HERO */}
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
          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              padding: ".45rem 1.1rem",
              marginBottom: isMobile ? "1.5rem" : "2.25rem",
              border: "1px solid rgba(124,58,237,.22)",
              borderRadius: 999,
              background: "rgba(255,255,255,.7)",
              boxShadow: "0 4px 18px rgba(76,29,149,.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Compass
              style={{ width: 14, height: 14, color: "#7c3aed" }}
              strokeWidth={2.4}
            />
            <span
              className="mono"
              style={{
                fontSize: ".58rem",
                fontWeight: 700,
                letterSpacing: ".28em",
                textTransform: "uppercase",
                color: "#6d28d9",
              }}
            >
              {isMobile
                ? "ÎLE AUX BALEINES"
                : "GUIDE TOURISTIQUE DE SAINTE-MARIE"}
            </span>
          </div> */}
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
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
                lineHeight: 1.05,
                letterSpacing: "-.025em",
                marginBottom: ".1em",
                animation: "fade-up .8s ease both",
                color: "#17123a",
              }}
            >
              Découvrez
            </h1>
            <h1
              style={{
                fontSize: isMobile
                  ? "clamp(1.9rem,9vw,2.9rem)"
                  : isTablet
                    ? "clamp(2.4rem,6vw,4rem)"
                    : "clamp(3.2rem,6.5vw,5.8rem)",
                display: isMobile ? "block" : "inline-block",
                marginLeft: isMobile ? 0 : "0.4em",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-.025em",
                marginBottom: ".16em",
                animation: "fade-up .8s .12s ease both",
              }}
            >
              <SainteMarieUnderline className="g-violet">
                Sainte-Marie
              </SainteMarieUnderline>
            </h1>
            {/* <h1
              style={{
                fontSize: isMobile
                  ? "clamp(1.7rem,8vw,2.6rem)"
                  : isTablet
                    ? "clamp(2.1rem,5.5vw,3.5rem)"
                    : "clamp(2rem,6vw,5rem)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-.045em",
                textTransform: "uppercase",
                color: "#17123a",
                animation: "fade-up .8s .24s ease both",
                margin: 0,
              }}
            >
              sur mesure
            </h1> */}
          </div>
          <p
            style={{
              maxWidth: 560,
              textAlign: "center",
              color: "rgba(23,18,58,.5)",
              fontSize: isMobile ? ".9rem" : "1.05rem",
              fontWeight: 300,
              lineHeight: 1.6,
              marginBottom: isMobile ? "1.75rem" : "2.5rem",
              animation: "fade-up .8s .32s ease both",
            }}
          >
            Safari baleines, lagons turquoise et îles préservées.
            <br />
            Explorez, réservez, profitez.
          </p>
          <a
            href="#destinations"
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: ".6rem",
              padding: isMobile ? ".85rem 1.6rem" : ".95rem 2rem",
              borderRadius: 999,
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              color: "#fff",
              fontSize: ".72rem",
              fontWeight: 800,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 12px 28px -8px rgba(124,58,237,.55)",
              animation: "fade-up .8s .4s ease both",
            }}
          >
            <Compass style={{ width: 15, height: 15 }} strokeWidth={2.4} />
            Explorer Sainte-Marie
          </a>
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: "2.75rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
              }}
            >
              <span className="hud" style={{ fontSize: ".48rem" }}>
                01
              </span>
              <div
                style={{
                  width: "1.5rem",
                  height: 1,
                  background: "rgba(23,18,58,.12)",
                }}
              />
              <span className="hud" style={{ fontSize: ".62rem" }}>
                Scroll pour explorer
              </span>
              <div
                style={{
                  width: "1.5rem",
                  height: 1,
                  background: "rgba(23,18,58,.12)",
                }}
              />
              <span className="hud" style={{ fontSize: ".48rem" }}>
                05
              </span>
            </div>
          )}
        </div>

        {/* SCENE 2 — LAGONS & ÎLES */}
        <div
          ref={r2}
          className="scene-2-text"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-end",
            padding: isMobile ? "0 1.5rem 50vh" : `0 clamp(2rem,8vw,5rem)`,
            opacity: 0,
          }}
        >
          <div className="scan-overlay" />
          <div
            style={{
              maxWidth: isMobile ? "100%" : 460,
              textAlign: isMobile ? "center" : "right",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontSize: isMobile
                  ? "clamp(1.6rem,7vw,2.4rem)"
                  : "clamp(2rem,4vw,3.2rem)",
                fontWeight: 200,
                lineHeight: 1.08,
                letterSpacing: "-.025em",
                marginBottom: ".25rem",
                color: "#17123a",
                opacity: s2 ? 1 : 0,
                transform: s2 ? "translateX(0)" : "translateX(20px)",
                transition: "opacity .5s .1s ease, transform .5s .1s ease",
              }}
            >
              Lagons & Îles
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
                opacity: s2 ? 1 : 0,
                transform: s2 ? "translateX(0)" : "translateX(20px)",
                transition: "opacity .5s .18s ease, transform .5s .18s ease",
              }}
            >
              <span className="g-violet">paradisiaques.</span>
            </h2>
            {!isMobile && (
              <p
                style={{
                  color: "rgba(23,18,58,.5)",
                  fontSize: ".85rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                  opacity: s2 ? 1 : 0,
                  transition: "opacity .6s .28s ease",
                }}
              >
                Île aux Nattes, Baie d'Ampanihy, Piscines Naturelles... Explorez
                le sanctuaire des baleines à bosse et ses eaux turquoise.
              </p>
            )}
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(to left, rgba(124,58,237,.3), transparent)",
                marginBottom: isMobile ? ".75rem" : "1.25rem",
                transform: s2 ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "right",
                transition: "transform .6s .3s ease",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: ".4rem",
                justifyContent: isMobile ? "center" : "flex-end",
                marginBottom: !isMobile ? "1.4rem" : 0,
              }}
            >
              {[
                "Île aux Nattes",
                "Baie d'Ampanihy",
                "Piscines Naturelles",
                "Ambodifotatra",
              ].map((d, i) => (
                <span
                  key={d}
                  className="tech-chip"
                  style={{
                    border: "1px solid rgba(124,58,237,.22)",
                    background: "rgba(124,58,237,.06)",
                    color: "#6d28d9",
                    opacity: s2 ? 1 : 0,
                    transform: s2 ? "translateY(0)" : "translateY(8px)",
                    transition: `opacity .4s ${0.35 + i * 0.07}s ease, transform .4s ${0.35 + i * 0.07}s ease`,
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
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
                  { label: "Plages de sable blanc", delay: 420 },
                  { label: "Sanctuaire des baleines", delay: 490 },
                  { label: "Récifs coralliens protégés", delay: 560 },
                ].map((f) => (
                  <FeatureRow
                    key={f.label}
                    label={f.label}
                    color="#7c3aed"
                    delay={f.delay}
                    visible={s2}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SCENE 3 — AVENTURES */}
        <div
          ref={r3}
          className="scene-3-text"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-start",
            padding: isMobile ? "0 1.5rem 50vh" : `0 clamp(2rem,8vw,5rem)`,
            opacity: 0,
          }}
        >
          <div className="scan-overlay" />
          <div
            style={{
              maxWidth: isMobile ? "100%" : 460,
              textAlign: isMobile ? "center" : "left",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ marginBottom: isMobile ? "1rem" : "1.6rem" }}>
              {[
                { text: "Aventure.", weight: 900, cls: "", delay: 0.1 },
                { text: "Culture.", weight: 200, cls: "g-blue", delay: 0.18 },
                { text: "Détente.", weight: 200, cls: "", delay: 0.26 },
              ].map((h) => (
                <h2
                  key={h.text}
                  style={{
                    fontSize: isMobile
                      ? "clamp(1.6rem,7vw,2.4rem)"
                      : "clamp(2rem,4vw,3.2rem)",
                    fontWeight: h.weight,
                    lineHeight: 1.04,
                    letterSpacing: "-.035em",
                    marginBottom: ".1rem",
                    color: "#17123a",
                    opacity: s3 ? 1 : 0,
                    transform: s3 ? "translateX(0)" : "translateX(-18px)",
                    transition: `opacity .5s ${h.delay}s ease, transform .5s ${h.delay}s ease`,
                  }}
                >
                  {h.cls ? <span className={h.cls}>{h.text}</span> : h.text}
                </h2>
              ))}
            </div>
            {!isMobile && (
              <p
                style={{
                  color: "rgba(23,18,58,.5)",
                  fontSize: ".85rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                  opacity: s3 ? 1 : 0,
                  transition: "opacity .6s .32s ease",
                }}
              >
                Baleines à bosse, cimetière des pirates, villages de pêcheurs et
                cuisine malgache. Vivez des expériences authentiques avec nos
                guides locaux.
              </p>
            )}
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(to right, rgba(37,99,235,.3), transparent)",
                marginBottom: isMobile ? ".75rem" : "1.25rem",
                transform: s3 ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform .6s .3s ease",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: ".4rem",
                justifyContent: isMobile ? "center" : "flex-start",
                marginBottom: !isMobile ? "1.4rem" : 0,
              }}
            >
              {["Safari baleines", "Plongée", "Pirogue", "Snorkeling"].map(
                (a, i) => (
                  <span
                    key={a}
                    className="tech-chip"
                    style={{
                      border: "1px solid rgba(37,99,235,.22)",
                      background: "rgba(37,99,235,.06)",
                      color: "#1d4ed8",
                      opacity: s3 ? 1 : 0,
                      transform: s3 ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity .4s ${0.35 + i * 0.07}s ease, transform .4s ${0.35 + i * 0.07}s ease`,
                    }}
                  >
                    {a}
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
                  { label: "Guides locaux certifiés", delay: 420 },
                  { label: "Excursions sur mesure", delay: 490 },
                  { label: "Transferts inclus", delay: 560 },
                ].map((f) => (
                  <FeatureRow
                    key={f.label}
                    label={f.label}
                    color="#2563eb"
                    delay={f.delay}
                    visible={s3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SCENE 4 — STATS */}
        <div
          ref={r4}
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
          <div style={{ maxWidth: 720, textAlign: "center", width: "100%" }}>
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
                  target: 300,
                  suffix: "j",
                  label: "Jours de soleil",
                  color: "#2563eb",
                  sub: "par an",
                  delay: 0,
                },
                {
                  target: 27,
                  suffix: "°C",
                  label: "Température du lagon",
                  color: "#059669",
                  sub: "eau turquoise",
                  delay: 200,
                },
                {
                  target: 2000,
                  suffix: "+",
                  label: "Baleines à bosse",
                  color: "#7c3aed",
                  sub: "juillet – octobre",
                  delay: 400,
                },
              ].map((st, i) => (
                <div
                  key={st.label}
                  style={{
                    flex: 1,
                    borderRight:
                      !isMobile && i < 2
                        ? "1px solid rgba(23,18,58,.08)"
                        : "none",
                    borderBottom:
                      isMobile && i < 2
                        ? "1px solid rgba(23,18,58,.08)"
                        : "none",
                    padding: isMobile ? "1rem 0" : "0 2.5rem",
                    opacity: s4 ? 1 : 0,
                    transform: s4 ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity .5s ${st.delay}ms ease, transform .5s ${st.delay}ms ease`,
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
                    {s4 ? (
                      <AnimatedCounter
                        target={st.target}
                        suffix={st.suffix}
                        color={st.color}
                        duration={1400}
                      />
                    ) : (
                      <span style={{ color: st.color }}>0{st.suffix}</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: ".85rem",
                      fontWeight: 600,
                      color: "rgba(23,18,58,.72)",
                      marginBottom: ".25rem",
                    }}
                  >
                    {st.label}
                  </div>
                  <span className="hud" style={{ fontSize: ".46rem" }}>
                    {st.sub}
                  </span>
                </div>
              ))}
            </div>
            <p
              style={{
                color: "rgba(23,18,58,.4)",
                fontWeight: 300,
                fontSize: isMobile ? ".78rem" : ".88rem",
                letterSpacing: ".06em",
                opacity: s4 ? 1 : 0,
                transition: "opacity .6s .7s ease",
              }}
            >
              L'île aux baleines vous attend toute l'année.
            </p>
          </div>
        </div>

        <div
          className="scene-5-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "#fbfaff",
            opacity: 0,
            zIndex: 10,
          }}
        />

        {/* SCENE 5 — DÉCOUVERTE */}
        <div
          ref={r5}
          className="scene-5-discover"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 11,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: isMobile ? "4.5rem" : "7rem",
            opacity: 0,
          }}
        >
          <div className="scan-overlay" />
          <span
            className="mono"
            style={{
              fontSize: ".54rem",
              fontWeight: 700,
              letterSpacing: ".38em",
              textTransform: "uppercase",
              color: "#7c3aed",
              marginBottom: "1.5rem",
              opacity: s5 ? 1 : 0,
              transition: "opacity .5s .1s ease",
            }}
          >
            EXPLOREZ SAINTE-MARIE
          </span>
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
              color: "#17123a",
              opacity: s5 ? 1 : 0,
              transform: s5 ? "translateY(0)" : "translateY(14px)",
              transition: "opacity .5s .15s ease, transform .5s .15s ease",
            }}
          >
            Découvrez <span className="g-violet">toutes</span>
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
              color: "#17123a",
              opacity: s5 ? 1 : 0,
              transform: s5 ? "translateY(0)" : "translateY(14px)",
              transition: "opacity .5s .22s ease, transform .5s .22s ease",
            }}
          >
            nos expériences.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)",
              gap: isMobile ? ".45rem" : ".65rem",
              maxWidth: isMobile ? 300 : 660,
              width: "100%",
              padding: "0 1.5rem",
            }}
          >
            {[
              {
                icon: "◆",
                name: "Excursions",
                desc: "Baleines & baies",
                color: "#7c3aed",
              },
              {
                icon: "◈",
                name: "Plongée",
                desc: "Récifs & épaves",
                color: "#2563eb",
              },
              {
                icon: "◇",
                name: "Hébergements",
                desc: "Lodges & bungalows",
                color: "#9333ea",
              },
              {
                icon: "▸",
                name: "Culture",
                desc: "Pirates & villages",
                color: "#059669",
              },
              {
                icon: "▹",
                name: "Nature",
                desc: "Île aux Nattes",
                color: "#db2777",
              },
              {
                icon: "◻",
                name: "Gastronomie",
                desc: "Saveurs malgaches",
                color: "#ea580c",
              },
            ].map((s, i) => (
              <div
                key={s.name}
                style={{
                  padding: isMobile ? ".6rem .5rem" : ".75rem .9rem",
                  borderRadius: 10,
                  border: "1px solid rgba(23,18,58,.08)",
                  background: "rgba(255,255,255,.75)",
                  boxShadow: "0 4px 16px rgba(76,29,149,.05)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMobile ? "center" : "flex-start",
                  gap: ".28rem",
                  opacity: s5 ? 1 : 0,
                  transform: s5 ? "translateY(0)" : "translateY(12px)",
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
                  <span style={{ fontSize: ".6rem", color: s.color }}>
                    {s.icon}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: isMobile ? ".56rem" : ".62rem",
                      fontWeight: 700,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "rgba(23,18,58,.75)",
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
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: ".75rem",
              opacity: s5 ? 1 : 0,
              transition: "opacity .5s .6s ease",
            }}
          >
            <div
              style={{
                width: 1,
                height: "2rem",
                background:
                  "linear-gradient(to bottom,rgba(124,58,237,.4),transparent)",
              }}
            />
            <span
              className="hud"
              style={{
                fontSize: ".46rem",
                letterSpacing: ".35em",
                color: "rgba(23,18,58,.3)",
              }}
            >
              CONTINUEZ ↓
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
