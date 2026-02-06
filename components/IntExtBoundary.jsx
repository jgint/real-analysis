'use client';

import React, { useState, useRef, useEffect } from 'react';

// Set definitions: membership, draw, signedDist (for classification)
const SETS = {
  disk: {
    name: 'Disk',
    label: 'Closed Disk',
    radius: 140,
    contains(x, y) {
      return x * x + y * y <= this.radius * this.radius;
    },
    draw(ctx, cx, cy) {
      ctx.beginPath();
      ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
      ctx.fill();
    },
    signedDist(x, y) {
      return Math.sqrt(x * x + y * y) - this.radius;
    },
  },
  square: {
    name: 'Square',
    label: 'Closed Square',
    half: 130,
    contains(x, y) {
      return Math.abs(x) <= this.half && Math.abs(y) <= this.half;
    },
    draw(ctx, cx, cy) {
      ctx.fillRect(cx - this.half, cy - this.half, this.half * 2, this.half * 2);
    },
    signedDist(x, y) {
      const dx = Math.abs(x) - this.half;
      const dy = Math.abs(y) - this.half;
      const outside = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2);
      const inside = Math.min(Math.max(dx, dy), 0);
      return outside + inside;
    },
  },
  annulus: {
    name: 'Ring',
    label: 'Annulus',
    r1: 60,
    r2: 150,
    contains(x, y) {
      const d = Math.sqrt(x * x + y * y);
      return d >= this.r1 && d <= this.r2;
    },
    draw(ctx, cx, cy) {
      ctx.beginPath();
      ctx.arc(cx, cy, this.r2, 0, Math.PI * 2);
      ctx.arc(cx, cy, this.r1, 0, Math.PI * 2, true);
      ctx.fill();
    },
    signedDist(x, y) {
      const d = Math.sqrt(x * x + y * y);
      const dOuter = d - this.r2;
      const dInner = this.r1 - d;
      if (d >= this.r1 && d <= this.r2) return -Math.min(d - this.r1, this.r2 - d);
      if (d < this.r1) return dInner;
      return dOuter;
    },
  },
  star: {
    name: 'Star',
    label: 'Star Shape',
    points: 5,
    outerR: 150,
    innerR: 65,
    contains(x, y) {
      const pts = this._getPoints();
      let inside = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const xi = pts[i][0], yi = pts[i][1];
        const xj = pts[j][0], yj = pts[j][1];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    },
    _getPoints() {
      const pts = [];
      for (let i = 0; i < this.points * 2; i++) {
        const angle = (Math.PI / 2) * 3 + (i * Math.PI) / this.points;
        const r = i % 2 === 0 ? this.outerR : this.innerR;
        pts.push([Math.cos(angle) * r, Math.sin(angle) * r]);
      }
      return pts;
    },
    draw(ctx, cx, cy) {
      const pts = this._getPoints();
      ctx.beginPath();
      ctx.moveTo(cx + pts[0][0], cy + pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(cx + pts[i][0], cy + pts[i][1]);
      ctx.closePath();
      ctx.fill();
    },
    signedDist(x, y) {
      return this._approxSignedDist(x, y);
    },
    _approxSignedDist(x, y) {
      const pts = this._getPoints();
      let minDist = Infinity;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const ax = pts[j][0], ay = pts[j][1];
        const bx = pts[i][0], by = pts[i][1];
        const dx = bx - ax, dy = by - ay;
        let t = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy);
        t = Math.max(0, Math.min(1, t));
        const px = ax + t * dx, py = ay + t * dy;
        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
        if (dist < minDist) minDist = dist;
      }
      return this.contains(x, y) ? -minDist : minDist;
    },
  },
};

function classifyBall(set, px, py, eps) {
  const sd = set.signedDist(px, py);
  if (sd < -eps) return 'interior';
  if (sd > eps) return 'exterior';
  return 'boundary';
}

const CSS = {
  bg: '#0c0e13',
  surface: '#14171e',
  border: '#252a36',
  text: '#d4d8e3',
  textDim: '#6b7394',
  interior: '#3b82f6',
  interiorGlow: 'rgba(59, 130, 246, 0.25)',
  boundary: '#f59e0b',
  boundaryGlow: 'rgba(245, 158, 11, 0.3)',
  exterior: '#64748b',
  exteriorGlow: 'rgba(100, 116, 139, 0.2)',
  accent: '#818cf8',
};

export default function IntExtBoundaryVisualization() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [probePoint, setProbePoint] = useState(null);
  const [epsilon, setEpsilon] = useState(45);
  const [currentSet, setCurrentSet] = useState('disk');
  const [hintVisible, setHintVisible] = useState(true);
  const animTRef = useRef(0);
  const sizeRef = useRef({ W: 600, H: 480, dpr: 1 });

  // Resize canvas to container
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const W = Math.floor(rect.width);
      const H = Math.max(420, Math.min(W * 0.7, 560));
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      sizeRef.current = { W, H, dpr };
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Wheel to change epsilon (passive: false so we can preventDefault)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e) => {
      e.preventDefault();
      setEpsilon((prev) => Math.max(10, Math.min(120, prev - Math.sign(e.deltaY) * 5)));
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let rafId;

    const draw = () => {
      const { W, H, dpr } = sizeRef.current;
      animTRef.current += 0.015;
      const animT = animTRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const set = SETS[currentSet];

      // Grid
      ctx.fillStyle = 'rgba(107, 115, 148, 0.12)';
      const spacing = 30;
      for (let gx = spacing; gx < W; gx += spacing) {
        for (let gy = spacing; gy < H; gy += spacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Axes
      ctx.strokeStyle = 'rgba(107, 115, 148, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Set fill
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      set.draw(ctx, cx, cy);

      // Set border
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 2;
      if (currentSet === 'disk') {
        ctx.beginPath();
        ctx.arc(cx, cy, set.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (currentSet === 'square') {
        ctx.strokeRect(cx - set.half, cy - set.half, set.half * 2, set.half * 2);
      } else if (currentSet === 'annulus') {
        ctx.beginPath();
        ctx.arc(cx, cy, set.r2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, set.r1, 0, Math.PI * 2);
        ctx.stroke();
      } else if (currentSet === 'star') {
        const pts = set._getPoints();
        ctx.beginPath();
        ctx.moveTo(cx + pts[0][0], cy + pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(cx + pts[i][0], cy + pts[i][1]);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.font = '600 12px "Fira Code", monospace';
      ctx.fillStyle = 'rgba(107, 115, 148, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('S', cx, cy - (currentSet === 'annulus' ? 0 : 10));
      ctx.fillText(set.label, cx, cy + (currentSet === 'annulus' ? 12 : 6));

      // Probe point and epsilon ball
      if (probePoint) {
        const px = probePoint.x, py = probePoint.y;
        const rx = px - cx, ry = py - cy;
        const classification = classifyBall(set, rx, ry, epsilon);

        const colors = {
          interior: { fill: 'rgba(59, 130, 246, 0.12)', stroke: 'rgba(59, 130, 246, 0.7)', dot: CSS.interior },
          boundary: { fill: 'rgba(245, 158, 11, 0.10)', stroke: 'rgba(245, 158, 11, 0.7)', dot: CSS.boundary },
          exterior: { fill: 'rgba(100, 116, 139, 0.10)', stroke: 'rgba(100, 116, 139, 0.6)', dot: '#94a3b8' },
        };
        const c = colors[classification];

        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.lineDashOffset = -animT * 20;
        ctx.strokeStyle = c.stroke;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = c.fill;
        ctx.beginPath();
        ctx.arc(px, py, epsilon, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        ctx.font = '11px "Fira Code", monospace';
        ctx.fillStyle = c.stroke;
        ctx.textAlign = 'left';
        ctx.fillText(`ε=${epsilon}`, px + epsilon + 6, py - 4);

        ctx.strokeStyle = c.stroke;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + epsilon, py);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.shadowColor = c.dot;
        ctx.shadowBlur = 12;
        ctx.fillStyle = c.dot;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '10px "Fira Code", monospace';
        ctx.fillStyle = 'rgba(212, 216, 227, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(`(${Math.round(rx)}, ${Math.round(-ry)})`, px, py + 18);

        if (classification === 'boundary') {
          for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const sx = rx + Math.cos(angle) * epsilon;
            const sy = ry + Math.sin(angle) * epsilon;
            const inSet = set.contains(sx, sy);
            ctx.fillStyle = inSet ? 'rgba(59, 130, 246, 0.7)' : 'rgba(100, 116, 139, 0.5)';
            ctx.beginPath();
            ctx.arc(cx + sx, cy + sy, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [currentSet, probePoint, epsilon]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { W, H } = sizeRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (W / rect.width);
    const y = (e.clientY - rect.top) * (H / rect.height);
    setProbePoint({ x, y });
    setHintVisible(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setEpsilon((prev) => Math.max(10, Math.min(120, prev - Math.sign(e.deltaY) * 5)));
  };

  const handleReset = () => {
    setProbePoint(null);
    setEpsilon(45);
    setHintVisible(true);
  };

  const setObj = SETS[currentSet];
  const classification = probePoint
    ? classifyBall(setObj, probePoint.x - (sizeRef.current.W || 600) / 2, probePoint.y - (sizeRef.current.H || 480) / 2, epsilon)
    : null;

  const probeColors = {
    interior: CSS.interior,
    boundary: CSS.boundary,
    exterior: CSS.exterior,
  };
  const probeLabels = { interior: 'Interior Point', boundary: 'Boundary Point', exterior: 'Exterior Point' };
  const probeExplanations = {
    interior: `B(x, ${epsilon}) ⊆ S — the entire ε-ball lies within the set.`,
    boundary: `B(x, ${epsilon}) intersects both S and Sᶜ — no ε-ball fits entirely in either.`,
    exterior: `B(x, ${epsilon}) ⊆ Sᶜ — the entire ε-ball lies outside the set.`,
  };

  return (
    <div className="viz-page-container" style={{ background: CSS.bg, color: CSS.text }}>
      <div className="viz-content-container" style={{ maxWidth: '1200px' }}>
        <header style={{ textAlign: 'center', padding: '48px 24px 16px' }}>
          <h1
            className="viz-title"
            style={{
              background: 'linear-gradient(135deg, #d4d8e3 0%, #818cf8 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px',
            }}
          >
            Interior, Boundary & Exterior
          </h1>
          <p style={{ color: CSS.textDim, fontSize: '15px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Click anywhere on the canvas to probe a point. The open ball around it reveals whether the point lies in
            the interior, on the boundary, or in the exterior of the set.
          </p>
        </header>

        <div
          className="int-ext-boundary-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: CSS.surface,
              border: `1px solid ${CSS.border}`,
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderBottom: `1px solid ${CSS.border}`,
                flexWrap: 'wrap',
              }}
            >
              <label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: CSS.textDim,
                  marginRight: '4px',
                }}
              >
                Set
              </label>
              <div style={{ display: 'flex', gap: '2px', background: CSS.bg, borderRadius: '8px', padding: '2px' }}>
                {Object.keys(SETS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setCurrentSet(key);
                      setProbePoint(null);
                    }}
                    style={{
                      background: currentSet === key ? CSS.accent : 'transparent',
                      color: currentSet === key ? '#fff' : CSS.textDim,
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {SETS[key].name}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: `1px solid ${CSS.border}`,
                  color: CSS.textDim,
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Reset View
              </button>
            </div>

            <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
              <canvas
                ref={canvasRef}
                style={{ display: 'block', cursor: 'crosshair', width: '100%' }}
                onClick={handleCanvasClick}
              />
            </div>

            {hintVisible && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: CSS.textDim,
                  background: 'rgba(12, 14, 19, 0.85)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Click to probe a point · Scroll to resize ε-ball
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                background: CSS.surface,
                border: `1px solid ${CSS.border}`,
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 400,
                  fontSize: '18px',
                  marginBottom: '10px',
                }}
              >
                Probe Result
              </h3>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  padding: '14px',
                  background: CSS.bg,
                  borderRadius: '10px',
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: CSS.textDim,
                  lineHeight: 1.7,
                }}
              >
                {!probePoint ? (
                  'Click on the canvas to classify a point'
                ) : (
                  <div>
                    <span
                      style={{
                        color: probeColors[classification],
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      ● {probeLabels[classification]}
                    </span>
                    <br />
                    <span style={{ fontSize: '11px', opacity: 0.7, lineHeight: 1.7 }}>
                      {probeExplanations[classification]}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <label
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: CSS.textDim,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ε =
                </label>
                <input
                  type="range"
                  min={10}
                  max={120}
                  value={epsilon}
                  onChange={(e) => setEpsilon(parseInt(e.target.value, 10))}
                  style={{ flex: 1, accentColor: CSS.accent, height: '4px' }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: CSS.accent,
                    minWidth: '32px',
                    textAlign: 'right',
                  }}
                >
                  {epsilon}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: CSS.textDim }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.interior, boxShadow: `0 0 8px ${CSS.interiorGlow}` }} />
                  Interior
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: CSS.textDim }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.boundary, boxShadow: `0 0 8px ${CSS.boundaryGlow}` }} />
                  Boundary
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: CSS.textDim }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.exterior, boxShadow: `0 0 8px ${CSS.exteriorGlow}` }} />
                  Exterior
                </div>
              </div>
            </div>

            <div
              style={{
                background: CSS.surface,
                border: `1px solid ${CSS.border}`,
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '18px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.interior, boxShadow: `0 0 8px ${CSS.interiorGlow}` }} />
                Interior — int(S)
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: CSS.textDim }}>
                A point <em>x</em> is an <strong>interior point</strong> of S if there exists an open ball B(x, ε) entirely
                contained in S. The interior is the largest open set inside S.
              </p>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: CSS.accent,
                  background: 'rgba(129, 140, 248, 0.08)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  display: 'block',
                  lineHeight: 1.6,
                  borderLeft: `2px solid ${CSS.accent}`,
                }}
              >
                x ∈ int(S) ⟺ ∃ε&gt;0 : B(x,ε) ⊆ S
              </code>
            </div>

            <div
              style={{
                background: CSS.surface,
                border: `1px solid ${CSS.border}`,
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '18px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.boundary, boxShadow: `0 0 8px ${CSS.boundaryGlow}` }} />
                Boundary — ∂S
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: CSS.textDim }}>
                A point <em>x</em> is a <strong>boundary point</strong> of S if every open ball B(x, ε) contains points both
                in S and in its complement Sᶜ.
              </p>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: CSS.accent,
                  background: 'rgba(129, 140, 248, 0.08)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  display: 'block',
                  lineHeight: 1.6,
                  borderLeft: `2px solid ${CSS.accent}`,
                }}
              >
                x ∈ ∂S ⟺ ∀ε&gt;0 : B(x,ε)∩S ≠ ∅ and B(x,ε)∩Sᶜ ≠ ∅
              </code>
            </div>

            <div
              style={{
                background: CSS.surface,
                border: `1px solid ${CSS.border}`,
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '18px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.exterior, boxShadow: `0 0 8px ${CSS.exteriorGlow}` }} />
                Exterior — ext(S)
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: CSS.textDim }}>
                A point <em>x</em> is an <strong>exterior point</strong> of S if there exists an open ball B(x, ε) entirely
                contained in Sᶜ. The exterior is the interior of the complement.
              </p>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: CSS.accent,
                  background: 'rgba(129, 140, 248, 0.08)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  display: 'block',
                  lineHeight: 1.6,
                  borderLeft: `2px solid ${CSS.accent}`,
                }}
              >
                x ∈ ext(S) ⟺ ∃ε&gt;0 : B(x,ε) ⊆ Sᶜ
              </code>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .int-ext-boundary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
