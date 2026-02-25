'use client';

import { useState, useRef, useEffect, useCallback } from "react";

// Canvas-only colors (dark theme, hex/rgba for 2d context)
const C = {
  bg: "#14171e",
  ink: "#e6edf3",
  muted: "rgba(230,237,243,0.5)",
  accent: "#bf616a",
  accentLight: "rgba(191,97,106,0.15)",
  blue: "#88c0d0",
  blueLight: "rgba(136,192,208,0.12)",
  green: "#a3be8c",
  greenLight: "rgba(163,190,140,0.12)",
  grid: "rgba(107,115,148,0.15)",
  axis: "rgba(107,115,148,0.4)",
  deltaBand: "rgba(136,192,208,0.12)",
  epsBand: "rgba(191,97,106,0.12)",
};

// The three example functions
const FUNCTIONS = [
  {
    name: "f(x) = x²",
    fn: (x) => x * x,
    x0: 1,
    y0: 1,
    domain: [-0.5, 2.5],
    range: [-0.5, 4],
    desc: "A simple parabola converging to 1 at x₀ = 1.",
  },
  {
    name: "f(x) = sin(x)/x",
    fn: (x) => (Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x),
    x0: 0,
    y0: 1,
    domain: [-4, 4],
    range: [-0.5, 1.5],
    desc: "Classic removable discontinuity: f isn't defined at 0, but the limit is 1.",
    skipAt0: true,
  },
  {
    name: "f(x) = x·sin(1/x)",
    fn: (x) => (Math.abs(x) < 1e-9 ? 0 : x * Math.sin(1 / x)),
    x0: 0,
    y0: 0,
    domain: [-1, 1],
    range: [-0.6, 0.6],
    desc: "Oscillates wildly near 0, yet still converges to 0 (squeeze!).",
    skipAt0: true,
  },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function Canvas({ funcIdx, epsilon, delta, showBands, showTrace }) {
  const canvasRef = useRef(null);
  const W = 560,
    H = 420;
  const pad = { l: 52, r: 20, t: 20, b: 42 };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const f = FUNCTIONS[funcIdx];
    const [xMin, xMax] = f.domain;
    const [yMin, yMax] = f.range;
    const toX = (v) => pad.l + ((v - xMin) / (xMax - xMin)) * (W - pad.l - pad.r);
    const toY = (v) => H - pad.b - ((v - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 0.5;
    const xStep = (xMax - xMin) > 4 ? 1 : 0.5;
    for (let v = Math.ceil(xMin / xStep) * xStep; v <= xMax; v += xStep) {
      ctx.beginPath();
      ctx.moveTo(toX(v), pad.t);
      ctx.lineTo(toX(v), H - pad.b);
      ctx.stroke();
    }
    const yStep = (yMax - yMin) > 3 ? 1 : 0.5;
    for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax; v += yStep) {
      ctx.beginPath();
      ctx.moveTo(pad.l, toY(v));
      ctx.lineTo(W - pad.r, toY(v));
      ctx.stroke();
    }

    // ε-band (horizontal band around y₀)
    if (showBands) {
      ctx.fillStyle = C.epsBand;
      const epsTop = toY(f.y0 + epsilon);
      const epsBot = toY(f.y0 - epsilon);
      ctx.fillRect(pad.l, epsTop, W - pad.l - pad.r, epsBot - epsTop);

      // ε labels
      ctx.fillStyle = C.accent;
      ctx.font = 'italic 12px "Source Serif 4", Georgia, serif';
      ctx.textAlign = "right";
      ctx.fillText(`y₀+ε = ${(f.y0 + epsilon).toFixed(2)}`, pad.l - 4, epsTop + 4);
      ctx.fillText(`y₀−ε = ${(f.y0 - epsilon).toFixed(2)}`, pad.l - 4, epsBot + 4);

      // Dashed ε boundary lines
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.l, epsTop);
      ctx.lineTo(W - pad.r, epsTop);
      ctx.moveTo(pad.l, epsBot);
      ctx.lineTo(W - pad.r, epsBot);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // δ-band (vertical band around x₀, excluding x₀)
    if (showBands) {
      ctx.fillStyle = C.deltaBand;
      const dLeft = toX(f.x0 - delta);
      const dRight = toX(f.x0 + delta);
      ctx.fillRect(dLeft, pad.t, dRight - dLeft, H - pad.t - pad.b);

      // δ labels
      ctx.fillStyle = C.blue;
      ctx.font = 'italic 12px "Source Serif 4", Georgia, serif';
      ctx.textAlign = "center";
      ctx.fillText(`x₀−δ`, dLeft, H - pad.b + 16);
      ctx.fillText(`x₀+δ`, dRight, H - pad.b + 16);

      // Dashed δ boundary lines
      ctx.strokeStyle = C.blue;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(dLeft, pad.t);
      ctx.lineTo(dLeft, H - pad.b);
      ctx.moveTo(dRight, pad.t);
      ctx.lineTo(dRight, H - pad.b);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Axes
    ctx.strokeStyle = C.axis;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // x-axis
    if (yMin <= 0 && yMax >= 0) {
      ctx.moveTo(pad.l, toY(0));
      ctx.lineTo(W - pad.r, toY(0));
    }
    // y-axis
    if (xMin <= 0 && xMax >= 0) {
      ctx.moveTo(toX(0), pad.t);
      ctx.lineTo(toX(0), H - pad.b);
    }
    ctx.stroke();

    // Tick labels
    ctx.fillStyle = C.muted;
    ctx.font = '11px "Source Serif 4", Georgia, serif';
    ctx.textAlign = "center";
    for (let v = Math.ceil(xMin); v <= xMax; v += xStep >= 1 ? 1 : 0.5) {
      if (Math.abs(v) < 0.01) continue;
      ctx.fillText(v % 1 === 0 ? v.toString() : v.toFixed(1), toX(v), H - pad.b + 16);
    }
    ctx.textAlign = "right";
    for (let v = Math.ceil(yMin); v <= yMax; v += yStep >= 1 ? 1 : 0.5) {
      if (Math.abs(v) < 0.01) continue;
      ctx.fillText(v % 1 === 0 ? v.toString() : v.toFixed(1), pad.l - 6, toY(v) + 4);
    }

    // Plot function curve
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    const steps = 800;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      // skip near x0 if function not defined there
      if (f.skipAt0 && Math.abs(x - f.x0) < 0.005) {
        started = false;
        continue;
      }
      const y = f.fn(x);
      if (y < yMin - 1 || y > yMax + 1) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(toX(x), toY(y));
        started = true;
      } else {
        ctx.lineTo(toX(x), toY(y));
      }
    }
    ctx.stroke();

    // Trace: show sample points inside δ-band mapping into ε-band
    if (showTrace) {
      const nPts = 12;
      for (let i = 1; i <= nPts; i++) {
        const t = i / (nPts + 1);
        // distribute on both sides of x0
        const side = i % 2 === 0 ? 1 : -1;
        const frac = Math.ceil(i / 2) / (Math.ceil(nPts / 2) + 1);
        const x = f.x0 + side * frac * delta;
        if (x <= xMin || x >= xMax) continue;
        if (f.skipAt0 && Math.abs(x - f.x0) < 0.002) continue;
        const y = f.fn(x);
        const inEps = Math.abs(y - f.y0) < epsilon;

        // Dot on curve
        ctx.fillStyle = inEps ? C.green : C.accent;
        ctx.beginPath();
        ctx.arc(toX(x), toY(y), 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Vertical guide to axis
        ctx.strokeStyle = inEps
          ? "rgba(30,132,73,0.25)"
          : "rgba(192,57,43,0.25)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(toX(x), toY(y));
        ctx.lineTo(toX(x), toY(0) || H - pad.b);
        ctx.stroke();

        // Horizontal guide to y-axis
        ctx.beginPath();
        ctx.moveTo(toX(x), toY(y));
        ctx.lineTo(pad.l, toY(y));
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // x₀ marker
    ctx.fillStyle = C.blue;
    ctx.beginPath();
    ctx.arc(toX(f.x0), toY(0) || H - pad.b, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.blue;
    ctx.font = 'bold 13px "Source Serif 4", Georgia, serif';
    ctx.textAlign = "center";
    ctx.fillText("x₀", toX(f.x0), (toY(0) || H - pad.b) + 18);

    // y₀ marker
    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(pad.l, toY(f.y0), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 13px "Source Serif 4", Georgia, serif';
    ctx.textAlign = "right";
    ctx.fillText("y₀", pad.l - 10, toY(f.y0) + 4);

    // Open circle at (x₀, y₀) if skipAt0
    if (f.skipAt0) {
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(toX(f.x0), toY(f.y0), 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = C.bg;
      ctx.beginPath();
      ctx.arc(toX(f.x0), toY(f.y0), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [funcIdx, epsilon, delta, showBands, showTrace]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: W, height: H, borderRadius: 8, display: "block" }}
    />
  );
}

export default function ConvergenceVisualization() {
  const [funcIdx, setFuncIdx] = useState(0);
  const [epsilon, setEpsilon] = useState(0.5);
  const [delta, setDelta] = useState(0.4);
  const [showBands, setShowBands] = useState(true);
  const [showTrace, setShowTrace] = useState(true);

  const f = FUNCTIONS[funcIdx];

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title" style={{ fontSize: '1.75rem', marginBottom: 4 }}>
            Convergence of a function at a point
        </h1>
        <p className="viz-subtitle" style={{ marginBottom: 24, fontSize: 14 }}>
            Definition 3.4.1
        </p>

        <div className="proof-box" style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 8px" }}>
            Let (<i>X</i>, <i>d</i><sub>X</sub>) and (<i>Y</i>, <i>d</i><sub>Y</sub>) be metric spaces, <i>f</i> : <i>E</i> → <i>Y</i>, <i>E</i> ⊂ <i>X</i>, <i>x</i>₀ an accumulation point of <i>E</i>, and <i>y</i>₀ ∈ <i>Y</i>.
          </p>
          <p style={{ margin: "0 0 8px" }}>
            We say <i>f</i> <b>converges to</b> <i>y</i>₀ <b>at</b> <i>x</i>₀ if:
          </p>
          <div className="definition-box" style={{ margin: '8px 0 0' }}>
            ∀ε &gt; 0, ∃δ &gt; 0 such that ∀x ∈ E with 0 &lt; <i>d</i><sub>X</sub>(x, x₀) &lt; δ, we have <i>d</i><sub>Y</sub>(f(x), y₀) &lt; ε
          </div>
        </div>

        <div className="proof-box">
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.65 }}>
            <b>In plain English:</b> No matter how small an <span className="math" style={{ color: 'var(--color-error)' }}>ε-window</span> you draw around <i>y</i>₀ in the output, I can always find a small enough <span className="math" style={{ color: 'var(--color-primary)' }}>δ-window</span> around <i>x</i>₀ in the input so that every point of <i>E</i> inside the δ-window (except <i>x</i>₀ itself) gets mapped inside the ε-window. Try dragging the sliders below!
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {FUNCTIONS.map((fn, i) => (
            <button
              key={i}
              type="button"
              className={`btn secondary ${i === funcIdx ? "active" : ""}`}
              onClick={() => {
                setFuncIdx(i);
                setEpsilon(0.5);
                setDelta(0.4);
              }}
              style={{
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: i === funcIdx ? 700 : 400,
              }}
            >
              {fn.name}
            </button>
          ))}
        </div>

        <p className="viz-subtitle" style={{ marginBottom: 14, fontSize: 13, fontStyle: "italic", textAlign: "left" }}>
          {f.desc}
        </p>

        <div className="visualization-container" style={{ padding: 16, marginBottom: 18 }}>
          <Canvas
            funcIdx={funcIdx}
            epsilon={epsilon}
            delta={delta}
            showBands={showBands}
            showTrace={showTrace}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div className="proof-box" style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: 'var(--color-error)', fontWeight: 700, fontSize: 14 }}>ε (epsilon)</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{epsilon.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.5"
              step="0.01"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: 'var(--color-error)' }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
              Output tolerance around y₀
            </div>
          </div>
          <div className="proof-box" style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 14 }}>δ (delta)</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{delta.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="1.5"
              step="0.01"
              value={delta}
              onChange={(e) => setDelta(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: 'var(--color-primary)' }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
              Input window around x₀
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 13 }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={showBands}
              onChange={(e) => setShowBands(e.target.checked)}
              style={{ accentColor: 'var(--color-error)' }}
            />
            Show ε/δ bands
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={showTrace}
              onChange={(e) => setShowTrace(e.target.checked)}
              style={{ accentColor: 'var(--color-success)' }}
            />
            Show sample points
          </label>
        </div>

        <div className="proof-box" style={{ background: 'rgba(163, 190, 140, 0.08)', borderColor: 'rgba(163, 190, 140, 0.35)' }}>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }}>
            <b>How to use this visualization:</b><br />
            1. Pick an ε — this is the &quot;challenge&quot; (how close to y₀ must f(x) be?).<br />
            2. Your job is to find a δ so that <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>all sample dots are green</span> (meaning they land inside the ε-band).<br />
            3. If you can always do this — no matter how small ε gets — then <i>f</i> converges to <i>y</i>₀ at <i>x</i>₀.<br />
            <span style={{ color: 'var(--color-error)' }}>Red dots</span> = points that escape the ε-band. Shrink δ until they all turn <span style={{ color: 'var(--color-success)' }}>green</span>!
          </p>
        </div>
      </div>
    </div>
  );
}