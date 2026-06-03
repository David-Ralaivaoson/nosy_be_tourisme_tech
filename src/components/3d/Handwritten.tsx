import { useEffect, useRef, useState } from "react";

const HandDrawnOval = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  const padX = 32;
  const padY = 22;
  const W = width - padX * 3;
  const H = height + padY * 2;

  const cx = W / 2;
  const cy = H / 2;
  const rx = W / 2 - 20;
  const ry = H / 2 - 20;

  // Ovale qui commence à ~10h, tourne dans le sens horaire
  // et dépasse son point de départ (intersection visible)
  const mainPath = `
    M ${cx - rx * 0.3} ${cy - ry + 1}
    C ${cx + rx * 0.1} ${cy - ry - 5},
      ${cx + rx * 0.6} ${cy - ry - 3},
      ${cx + rx - 10} ${cy - ry * 0.35}
    C ${cx + rx + 10} ${cy + ry * 0.1},
      ${cx + rx + 5} ${cy + ry * 0.55},
      ${cx + rx - 6} ${cy + ry * 0.85}
    C ${cx + rx * 0.55} ${cy + ry + 7},
      ${cx} ${cy + ry + 8},
      ${cx - rx * 0.55} ${cy + ry + 5}
    C ${cx - rx + 4} ${cy + ry + 2},
      ${cx - rx - 4} ${cy + ry * 0.5},
      ${cx - rx - 3} ${cy - ry * 0.1}
    C ${cx - rx - 2} ${cy - ry * 0.55},
      ${cx - rx * 0.6} ${cy - ry - 4},
      ${cx - rx * 0.15} ${cy - ry - 1}
    C ${cx + rx * 0.05} ${cy - ry - 3},
      ${cx + rx * 0.2} ${cy - ry + 3},
      ${cx - rx * 0.05} ${cy - ry + 5}
  `;

  // Second passage — décalé, plus court, s'arrête avant la fin
  // pour laisser le "gap" visible à l'intersection
  const texPath = `
    M ${cx - rx * 0.3} ${cy - ry + 1}
    C ${cx + rx * 0.1} ${cy - ry - 5},
      ${cx + rx * 0.6} ${cy - ry - 3},
      ${cx + rx - 10} ${cy - ry * 0.35}
    C ${cx + rx + 10} ${cy + ry * 0.1},
      ${cx + rx + 5} ${cy + ry * 0.55},
      ${cx + rx - 6} ${cy + ry * 0.85}
    C ${cx + rx * 0.55} ${cy + ry + 7},
      ${cx} ${cy + ry + 8},
      ${cx - rx * 0.55} ${cy + ry + 5}
    C ${cx - rx + 4} ${cy + ry + 2},
      ${cx - rx - 4} ${cy + ry * 0.5},
      ${cx - rx - 3} ${cy - ry * 0.1}
    C ${cx - rx - 2} ${cy - ry * 0.55},
      ${cx - rx * 0.6} ${cy - ry - 4},
      ${cx - rx * 0.15} ${cy - ry - 1}
    C ${cx + rx * 0.05} ${cy - ry - 3},
      ${cx + rx * 0.2} ${cy - ry + 3},
      ${cx - rx * 0.05} ${cy - ry + 5}
  `;

  useEffect(() => {
    if (width === 0 || height === 0) return;

    const main = pathRef.current;
    const tex = path2Ref.current;
    if (!main || !tex) return;

    const len1 = main.getTotalLength();
    const len2 = tex.getTotalLength();

    main.style.transition = "none";
    tex.style.transition = "none";
    main.style.strokeDasharray = `${len1}`;
    main.style.strokeDashoffset = `${len1}`;
    tex.style.strokeDasharray = `${len2}`;
    tex.style.strokeDashoffset = `${len2}`;

    void main.getBoundingClientRect();

    const t = setTimeout(() => {
      main.style.transition =
        "stroke-dashoffset 1.6s cubic-bezier(0.65, 0, 0.35, 1)";
      tex.style.transition =
        "stroke-dashoffset 1.7s cubic-bezier(0.65, 0, 0.35, 1)";
      main.style.strokeDashoffset = "0";
      tex.style.strokeDashoffset = "0";
    }, 800);

    return () => clearTimeout(t);
  }, [width, height]);

  if (width === 0 || height === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${W}px`,
        height: `${H}px`,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <filter id="crayon-oval" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.80"
            numOctaves="4"
            seed="5"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 4.5 -1.5"
            result="alphaNoise"
          />
          <feComposite
            in="SourceGraphic"
            in2="alphaNoise"
            operator="in"
            result="grain"
          />
          <feDisplacementMap
            in="grain"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter
          id="crayon-oval-light"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.0"
            numOctaves="3"
            seed="13"
          />
          <feDisplacementMap scale="1.5" in="SourceGraphic" />
        </filter>
      </defs>

      {/* Second passage en dessous — texture */}
      <path
        ref={path2Ref}
        d={texPath}
        fill="none"
        stroke="#E8430A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#crayon-oval-light)"
        style={{ opacity: 0.45 }}
      />

      {/* Trait principal par dessus */}
      <path
        ref={pathRef}
        d={mainPath}
        fill="none"
        stroke="#E8430A"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#crayon-oval)"
        style={{ opacity: 0.95 }}
      />
    </svg>
  );
};

export const SurMesureHeading = ({
  isMobile,
  isTablet,
}: {
  isMobile: boolean;
  isTablet: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDims({ width, height });
    };

    // Légère attente pour que le fade-up soit appliqué
    const t = setTimeout(measure, 50);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [isMobile, isTablet]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "block",
      }}
    >
      <HandDrawnOval width={dims.width} height={dims.height} />

      <h1
        style={{
          fontSize: isMobile
            ? "clamp(1.7rem, 8vw, 2.5rem)"
            : isTablet
              ? "clamp(2.1rem, 5.5vw, 3.5rem)"
              : "clamp(2.8rem, 6vw, 5rem)",
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.045em",
          textTransform: "uppercase",
          animation: "fade-up 0.8s 0.24s ease both",
          position: "relative",
          zIndex: 1,
          margin: 0,
        }}
      >
        sur mesure
      </h1>
    </div>
  );
};
