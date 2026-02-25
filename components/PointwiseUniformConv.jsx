'use client';

import { useState, useRef, useEffect } from "react";

const W = 520;
const H = 340;
const PAD = { top: 30, right: 30, bottom: 40, left: 45 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

// Canvas colors aligned with app theme (dark)
const C = {
  axis: "rgba(107,115,148,0.5)",
  tick: "rgba(230,237,243,0.6)",
  grid: "rgba(107,115,148,0.2)",
  fnPointwise: "#88c0d0",
  fnUniform: "#b48ead",
  limit: "#a3be8c",
  epsBandPoint: "rgba(235,203,139,0.12)",
  epsBandUniform: "rgba(163,190,140,0.12)",
  epsStrokePoint: "rgba(235,203,139,0.5)",
  epsStrokeUniform: "rgba(52,211,153,0.5)",
  escape: "rgba(191,97,106,0.15)",
  escapeText: "#bf616a",
  success: "#a3be8c",
  error: "#bf616a",
};

function toCanvasX(x, xmin, xmax) {
  return PAD.left + ((x - xmin) / (xmax - xmin)) * PW;
}
function toCanvasY(y, ymin, ymax) {
  return PAD.top + ((ymax - y) / (ymax - ymin)) * PH;
}

function drawAxes(ctx, xmin, xmax, ymin, ymax, xlabel) {
  ctx.strokeStyle = C.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top);
  ctx.lineTo(PAD.left, PAD.top + PH);
  ctx.lineTo(PAD.left + PW, PAD.top + PH);
  ctx.stroke();

  ctx.fillStyle = C.tick;
  ctx.font = '11px "Fira Code", monospace';
  ctx.textAlign = "center";

  const xTicks = [xmin, (xmin + xmax) / 2, xmax];
  xTicks.forEach((v) => {
    const cx = toCanvasX(v, xmin, xmax);
    ctx.beginPath();
    ctx.moveTo(cx, PAD.top + PH);
    ctx.lineTo(cx, PAD.top + PH + 5);
    ctx.stroke();
    ctx.fillText(v.toFixed(1), cx, PAD.top + PH + 18);
  });

  ctx.textAlign = "right";
  const yTicks = [ymin, (ymin + ymax) / 2, ymax];
  yTicks.forEach((v) => {
    const cy = toCanvasY(v, ymin, ymax);
    ctx.beginPath();
    ctx.moveTo(PAD.left - 5, cy);
    ctx.lineTo(PAD.left, cy);
    ctx.stroke();
    ctx.fillText(v.toFixed(1), PAD.left - 8, cy + 4);
  });

  // grid lines
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 0.5;
  yTicks.forEach((v) => {
    const cy = toCanvasY(v, ymin, ymax);
    ctx.beginPath();
    ctx.moveTo(PAD.left, cy);
    ctx.lineTo(PAD.left + PW, cy);
    ctx.stroke();
  });

  ctx.fillStyle = C.tick;
  ctx.font = '12px "Fira Code", monospace';
  ctx.textAlign = "center";
  ctx.fillText(xlabel, PAD.left + PW / 2, PAD.top + PH + 34);
}

function drawFunction(ctx, fn, xmin, xmax, ymin, ymax, color, lineWidth = 2) {
  const steps = 400;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (i / steps) * (xmax - xmin);
    const y = fn(x);
    if (y < ymin - 1 || y > ymax + 1) {
      started = false;
      continue;
    }
    const cx = toCanvasX(x, xmin, xmax);
    const cy = toCanvasY(y, ymin, ymax);
    if (!started) {
      ctx.moveTo(cx, cy);
      started = true;
    } else {
      ctx.lineTo(cx, cy);
    }
  }
  ctx.stroke();
}

function drawEpsilonBand(ctx, f, eps, xmin, xmax, ymin, ymax, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  const steps = 400;
  // upper band
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (i / steps) * (xmax - xmin);
    const y = Math.min(ymax, f(x) + eps);
    const cx = toCanvasX(x, xmin, xmax);
    const cy = toCanvasY(y, ymin, ymax);
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  // lower band (reversed)
  for (let i = steps; i >= 0; i--) {
    const x = xmin + (i / steps) * (xmax - xmin);
    const y = Math.max(ymin, f(x) - eps);
    const cx = toCanvasX(x, xmin, xmax);
    const cy = toCanvasY(y, ymin, ymax);
    ctx.lineTo(cx, cy);
  }
  ctx.closePath();
  ctx.fill();
}

function PointwisePanel({ n, eps }) {
  const canvasRef = useRef(null);
  const xmin = -0.99, xmax = 0.99, ymin = -0.3, ymax = 1.1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    drawAxes(ctx, xmin, xmax, ymin, ymax, "x");

    // epsilon band around f=0
    drawEpsilonBand(ctx, () => 0, eps, xmin, xmax, ymin, ymax, C.epsBandPoint);

    // dashed epsilon lines
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = C.epsStrokePoint;
    ctx.lineWidth = 1;
    [eps, -eps].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(xmin, xmin, xmax), toCanvasY(offset, ymin, ymax));
      ctx.lineTo(toCanvasX(xmax, xmin, xmax), toCanvasY(offset, ymin, ymax));
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // limit function f=0
    drawFunction(ctx, () => 0, xmin, xmax, ymin, ymax, C.limit, 1.5);

    // f_n(x) = x^n (handling odd/even)
    const fn = (x) => {
      if (x >= 0) return Math.pow(x, n);
      return n % 2 === 0 ? Math.pow(-x, n) : -Math.pow(-x, n);
    };
    drawFunction(ctx, fn, xmin, xmax, ymin, ymax, C.fnPointwise, 2.5);

    // Show sup |f_n(x) - f(x)| = sup |x^n| on (-1,1)
    // The sup approaches 1 (never achieved but approaches at boundaries)
    const supErr = Math.pow(0.99, n); // approximate
    const supErrDisplay = supErr.toFixed(3);

    // Mark a point near x=0.99 to show the function doesn't stay in band
    if (supErr > eps) {
      // find x where |x^n| = eps
      const xCrit = Math.pow(eps, 1 / n);
      const cxCrit = toCanvasX(xCrit, xmin, xmax);

      // shade the "escaping" region
      ctx.fillStyle = C.escape;
      ctx.fillRect(cxCrit, PAD.top, toCanvasX(xmax, xmin, xmax) - cxCrit, PH);

      // arrow pointing to escape region
      ctx.fillStyle = C.escapeText;
      ctx.font = 'bold 11px "Fira Code", monospace';
      ctx.textAlign = "center";
      ctx.fillText("fₙ escapes ε-band", (cxCrit + toCanvasX(xmax, xmin, xmax)) / 2, PAD.top + 18);
    }

    // Labels
    ctx.fillStyle = C.fnPointwise;
    ctx.font = 'bold 12px "Fira Code", monospace';
    ctx.textAlign = "left";
    ctx.fillText(`f_${n}(x) = x^${n}`, PAD.left + 8, PAD.top + 18);

    ctx.fillStyle = C.limit;
    ctx.fillText("f(x) = 0", PAD.left + 8, PAD.top + 34);

    ctx.fillStyle = C.epsStrokePoint;
    ctx.textAlign = "right";
    ctx.fillText(`ε = ${eps.toFixed(2)}`, PAD.left + PW - 5, PAD.top + PH - 8);

    ctx.fillStyle = C.tick;
    ctx.font = '11px "Fira Code", monospace';
    ctx.textAlign = "right";
    ctx.fillText(`sup|fₙ - f| ≈ ${supErrDisplay}`, PAD.left + PW - 5, PAD.top + PH - 24);

  }, [n, eps]);

  return <canvas ref={canvasRef} width={W} height={H} style={{ width: "100%", maxWidth: W }} />;
}

function UniformPanel({ n, eps }) {
  const canvasRef = useRef(null);
  const xmin = -0.5, xmax = 0.5, ymin = -0.15, ymax = 0.35;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    drawAxes(ctx, xmin, xmax, ymin, ymax, "x");

    // epsilon band
    drawEpsilonBand(ctx, () => 0, eps, xmin, xmax, ymin, ymax, C.epsBandUniform);

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = C.epsStrokeUniform;
    ctx.lineWidth = 1;
    [eps, -eps].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(xmin, xmin, xmax), toCanvasY(offset, ymin, ymax));
      ctx.lineTo(toCanvasX(xmax, xmin, xmax), toCanvasY(offset, ymin, ymax));
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // limit function
    drawFunction(ctx, () => 0, xmin, xmax, ymin, ymax, C.limit, 1.5);

    // f_n
    const fn = (x) => {
      if (x >= 0) return Math.pow(x, n);
      return n % 2 === 0 ? Math.pow(-x, n) : -Math.pow(-x, n);
    };
    drawFunction(ctx, fn, xmin, xmax, ymin, ymax, C.fnUniform, 2.5);

    // sup error on [-1/2, 1/2] = (1/2)^n
    const supErr = Math.pow(0.5, n);
    const inside = supErr < eps;

    // labels
    ctx.fillStyle = C.fnUniform;
    ctx.font = 'bold 12px "Fira Code", monospace';
    ctx.textAlign = "left";
    ctx.fillText(`f_${n}(x) = x^${n}`, PAD.left + 8, PAD.top + 18);

    ctx.fillStyle = C.limit;
    ctx.fillText("f(x) = 0", PAD.left + 8, PAD.top + 34);

    ctx.fillStyle = C.epsStrokeUniform;
    ctx.textAlign = "right";
    ctx.fillText(`ε = ${eps.toFixed(2)}`, PAD.left + PW - 5, PAD.top + PH - 8);

    ctx.fillStyle = inside ? C.success : C.error;
    ctx.font = 'bold 11px "Fira Code", monospace';
    ctx.fillText(
      `sup|fₙ - f| = (1/2)^${n} = ${supErr.toFixed(4)}`,
      PAD.left + PW - 5,
      PAD.top + PH - 24
    );

    if (inside) {
      ctx.fillStyle = C.success;
      ctx.font = 'bold 13px "Fira Code", monospace';
      ctx.textAlign = "center";
      ctx.fillText("✓ Entirely within ε-band!", PAD.left + PW / 2, PAD.top + 56);
    }

  }, [n, eps]);

  return <canvas ref={canvasRef} width={W} height={H} style={{ width: "100%", maxWidth: W }} />;
}

export default function PointwiseUniformConvViz() {
  const [n, setN] = useState(3);
  const [eps, setEps] = useState(0.2);
  const [tab, setTab] = useState("pointwise");

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title" style={{ fontSize: "1.6rem", marginBottom: 4 }}>
          Pointwise vs Uniform Convergence
        </h1>
        <p className="viz-subtitle" style={{ marginBottom: 20 }}>
          fₙ(x) = xⁿ converging to f(x) = 0
        </p>

        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 3 }}>
          {[
            { key: "pointwise", label: "Pointwise · (−1, 1)" },
            { key: "uniform", label: "Uniform · [−½, ½]" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`btn secondary ${tab === key ? "active" : ""}`}
              onClick={() => setTab(key)}
              style={{
                padding: "8px 18px",
                fontSize: 12,
                fontWeight: 600,
                borderBottom: tab === key ? `2px solid var(--color-primary)` : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="visualization-container">
          {tab === "pointwise" ? (
            <PointwisePanel n={n} eps={eps} />
          ) : (
            <UniformPanel n={n} eps={eps} />
          )}
        </div>

        <div className="proof-box">
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>n (power)</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{n}</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: tab === "pointwise" ? "var(--color-primary)" : "var(--color-accent)" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>ε (tolerance)</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-warning)" }}>{eps.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.5}
              step={0.01}
              value={eps}
              onChange={(e) => setEps(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "var(--color-warning)" }}
            />
          </div>
        </div>

        <div className="proof-box">
          {tab === "pointwise" ? (
            <>
              <p>
                <strong style={{ color: "var(--color-primary)" }}>Pointwise on (−1, 1):</strong> For any fixed x, xⁿ → 0.
                But as x → 1⁻, convergence gets arbitrarily slow.
              </p>
              <p style={{ margin: 0 }}>
                The <span style={{ color: "var(--color-error)" }}>red region</span> shows where fₙ escapes the ε-band.
                No matter how large n is, there&apos;s always an x close enough to 1 where |xⁿ| &gt; ε.
                So <strong>sup|fₙ − f| stays near 1</strong> — not uniform.
              </p>
            </>
          ) : (
            <>
              <p style={{ margin: "0 0 8px" }}>
                <strong style={{ color: "var(--color-accent)" }}>Uniform on [−½, ½]:</strong> The worst-case error is
                sup|xⁿ| = (½)ⁿ, which shrinks to 0 as n → ∞.
              </p>
              <p style={{ margin: 0 }}>
                Once n is large enough that (½)ⁿ &lt; ε, the <em>entire</em> graph of fₙ sits inside
                the ε-band. A single N works for <strong>all x simultaneously</strong> — that&apos;s uniform convergence.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}