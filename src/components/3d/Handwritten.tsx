import { useEffect, useRef } from "react";

const HandDrawnOval = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  // ViewBox et paths TOTALEMENT FIXES — ne dépendent d'aucune mesure
  const VW = 700;
  const VH = 160;
  const cx = VW / 2;
  const cy = VH / 2;
  const rx = VW / 2 - 18;
  const ry = VH / 2 - 14;

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

  const texPath = `
    M ${cx - rx * 0.28} ${cy - ry + 3}
    C ${cx + rx * 0.12} ${cy - ry - 3},
      ${cx + rx * 0.58} ${cy - ry - 1},
      ${cx + rx - 8} ${cy - ry * 0.3}
    C ${cx + rx + 8} ${cy + ry * 0.15},
      ${cx + rx + 3} ${cy + ry * 0.6},
      ${cx + rx - 8} ${cy + ry * 0.9}
    C ${cx + rx * 0.5} ${cy + ry + 9},
      ${cx} ${cy + ry + 10},
      ${cx - rx * 0.5} ${cy + ry + 7}
    C ${cx - rx + 6} ${cy + ry + 4},
      ${cx - rx - 2} ${cy + ry * 0.45},
      ${cx - rx - 1} ${cy - ry * 0.05}
    C ${cx - rx} ${cy - ry * 0.5},
      ${cx - rx * 0.55} ${cy - ry - 2},
      ${cx - rx * 0.18} ${cy - ry + 1}
  `;

  useEffect(() => {
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
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "115%",
        height: "140%",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 20,
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

      <path
        ref={path2Ref}
        d={texPath}
        fill="none"
        stroke="#E8430A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#crayon-oval-light)"
        style={{ opacity: 0.45 }}
      />

      <path
        ref={pathRef}
        d={mainPath}
        fill="none"
        stroke="#E8430A"
        strokeWidth="6"
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
  return (
    <div
      style={{
        position: "relative",
        display: "block",
        padding: "0.1em 0.15em",
      }}
    >
      <HandDrawnOval />

      <h1
        style={{
          fontSize: isMobile
            ? "clamp(1.5rem, 8vw, 2.5rem)"
            : isTablet
              ? "clamp(2.1rem, 5.5vw, 3.5rem)"
              : "clamp(2rem, 6vw, 5rem)",
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
