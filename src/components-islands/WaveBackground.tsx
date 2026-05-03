import { useEffect, useRef } from "react";

interface WaveLayer {
  yFactor: number;
  amp: number;
  freq: number;
  speed: number;
  alpha: number;
  width: number;
  swellAmp: number;
  swellSpeed: number;
}

const LAYERS: WaveLayer[] = [
  {
    yFactor: 0.12,
    amp: 22,
    freq: 1.7,
    speed: 38,
    alpha: 0.05,
    width: 0.8,
    swellAmp: 8,
    swellSpeed: 14,
  },
  {
    yFactor: 0.28,
    amp: 18,
    freq: 2.1,
    speed: -28,
    alpha: 0.04,
    width: 0.7,
    swellAmp: 6,
    swellSpeed: 17,
  },
  {
    yFactor: 0.44,
    amp: 26,
    freq: 1.5,
    speed: 22,
    alpha: 0.04,
    width: 0.7,
    swellAmp: 10,
    swellSpeed: 20,
  },
  {
    yFactor: 0.6,
    amp: 20,
    freq: 2.4,
    speed: -35,
    alpha: 0.04,
    width: 0.8,
    swellAmp: 7,
    swellSpeed: 13,
  },
  {
    yFactor: 0.76,
    amp: 24,
    freq: 1.8,
    speed: 18,
    alpha: 0.03,
    width: 0.7,
    swellAmp: 9,
    swellSpeed: 18,
  },
  {
    yFactor: 0.91,
    amp: 15,
    freq: 2.7,
    speed: -25,
    alpha: 0.03,
    width: 0.6,
    swellAmp: 5,
    swellSpeed: 22,
  },
  {
    yFactor: 0.2,
    amp: 30,
    freq: 1.3,
    speed: 72,
    alpha: 0.14,
    width: 1.4,
    swellAmp: 12,
    swellSpeed: 9,
  },
  {
    yFactor: 0.52,
    amp: 28,
    freq: 1.6,
    speed: -58,
    alpha: 0.1,
    width: 1.2,
    swellAmp: 14,
    swellSpeed: 11,
  },
  {
    yFactor: 0.84,
    amp: 32,
    freq: 1.1,
    speed: 65,
    alpha: 0.12,
    width: 1.3,
    swellAmp: 11,
    swellSpeed: 8,
  },
];

const BASE_COLOR = "30,107,247";

function drawFrame(ctx: CanvasRenderingContext2D, width: number, height: number, t: number): void {
  ctx.clearRect(0, 0, width, height);

  for (const layer of LAYERS) {
    const swell = layer.amp + layer.swellAmp * Math.sin((t / layer.swellSpeed) * Math.PI * 2);
    const offsetX = (t / layer.speed) * width;
    const y0 = height * layer.yFactor;

    ctx.beginPath();
    ctx.lineWidth = layer.width;
    ctx.strokeStyle = `rgba(${BASE_COLOR},${layer.alpha})`;

    for (let x = -10; x <= width + 10; x += 2) {
      const phase = ((x - offsetX) / width) * layer.freq * Math.PI * 2;
      const y = y0 + swell * Math.sin(phase);
      if (x === -10) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }
}

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (prefersReduced) {
      drawFrame(ctx, width, height, 0);
      return;
    }

    let rafId: number;
    let start: number | null = null;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const loop = (timestamp: number) => {
      if (start === null) start = timestamp;
      const t = (timestamp - start) / 1000;
      drawFrame(ctx, width, height, t);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
