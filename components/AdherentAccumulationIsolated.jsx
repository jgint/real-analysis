'use client';

import React, { useState, useRef, useEffect } from 'react';

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

const ADHERENT_THRESH = 8;

function generatePoints(key, cx, cy, W, H) {
  const pts = [];
  const minWH = Math.min(W, H);
  switch (key) {
    case 'dense_disk': {
      const R = minWH * 0.22;
      for (let i = 0; i < 600; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * R;
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
      }
      pts.push({ x: cx + R + 90, y: cy - 50 });
      pts.push({ x: cx - R - 100, y: cy + 40 });
      pts.push({ x: cx + 50, y: cy - R - 80 });
      break;
    }
    case 'sequence': {
      const scale = minWH * 0.45;
      for (let n = 1; n <= 25; n++) {
        pts.push({ x: cx + (1 / n) * scale, y: cy });
      }
      break;
    }
    case 'lattice': {
      const spacing = 55;
      for (let i = -4; i <= 4; i++) {
        for (let j = -3; j <= 3; j++) {
          pts.push({ x: cx + i * spacing, y: cy + j * spacing });
        }
      }
      break;
    }
    case 'clusters': {
      for (let i = 0; i < 200; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 75;
        pts.push({ x: cx - 135 + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      }
      for (let i = 0; i < 200; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 75;
        pts.push({ x: cx + 135 + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      }
      pts.push({ x: cx, y: cy - 30 });
      pts.push({ x: cx, y: cy + 30 });
      break;
    }
    default:
      break;
  }
  return pts;
}

const SET_CONFIG = {
  dense_disk: { name: 'Disk+Outliers', description: 'A dense disk (all points are accumulation points) with 3 isolated outliers far away.' },
  sequence: { name: '1/n', description: 'Points at x = 1/n. The origin (x=0) is an accumulation point that is NOT in the set.' },
  lattice: { name: 'Lattice', description: 'Evenly spaced grid — every point is isolated (a small enough ball misses all neighbors).' },
  clusters: { name: 'Clusters', description: 'Two dense clusters with isolated points in the gap between them.' },
};

// True classification: independent of ε, uses mathematical definitions (small threshold for discrete sets).
function trueClassify(setPoints, px, py) {
  let selfDist = Infinity;
  for (const p of setPoints) {
    const d = dist(p.x, p.y, px, py);
    if (d < selfDist) selfDist = d;
  }
  const inSet = selfDist < 5;

  let nearestOther = Infinity;
  for (const p of setPoints) {
    const d = dist(p.x, p.y, px, py);
    if (inSet && d < 5) continue;
    if (d < nearestOther) nearestOther = d;
  }

  const isAdherent = inSet || selfDist < ADHERENT_THRESH;
  const isAccumulation = nearestOther < ADHERENT_THRESH;
  const isIsolated = inSet && nearestOther >= ADHERENT_THRESH;

  return { inSet, isAdherent, isAccumulation, isIsolated, nearestOther, selfDist };
}

// What the current ε ball shows.
function epsClassify(setPoints, px, py, eps) {
  let selfDist = Infinity;
  for (const p of setPoints) {
    const d = dist(p.x, p.y, px, py);
    if (d < selfDist) selfDist = d;
  }
  const inSet = selfDist < 5;

  let hasSetPointInBall = false;
  let hasOtherSetPointInBall = false;
  for (const p of setPoints) {
    const d = dist(p.x, p.y, px, py);
    if (d < eps) {
      hasSetPointInBall = true;
      if (!(inSet && d < 5)) hasOtherSetPointInBall = true;
    }
  }
  return { inSet, hasSetPointInBall, hasOtherSetPointInBall };
}

// Dark theme consistent with app (globals.css, IntExtBoundary)
const CSS = {
  bg: '#0c0e13',
  surface: '#14171e',
  border: '#252a36',
  text: '#d4d8e3',
  textDim: '#6b7394',
  adherent: '#ebcb8b',
  adherentBg: 'rgba(235, 203, 139, 0.12)',
  accumulation: '#88c0d0',
  accumulationBg: 'rgba(136, 192, 208, 0.12)',
  isolated: '#b48ead',
  isolatedBg: 'rgba(180, 142, 173, 0.12)',
  accent: '#88c0d0',
  pointColor: '#d4d8e3',
};

export default function AdherentAccumulationIsolatedVisualization() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [probePoint, setProbePoint] = useState(null);
  const [epsilon, setEpsilon] = useState(50);
  const [currentSetKey, setCurrentSetKey] = useState('dense_disk');
  const sizeRef = useRef({ W: 600, H: 420, dpr: 1 });
  const setPointsRef = useRef([]);
  const animTRef = useRef(0);

  // Resize and regenerate points
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const W = Math.floor(rect.width);
      const H = Math.max(380, Math.min(W * 0.65, 520));
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      sizeRef.current = { W, H, dpr };
      const cx = W / 2;
      const cy = H / 2;
      setPointsRef.current = generatePoints(currentSetKey, cx, cy, W, H);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [currentSetKey]);

  // Regenerate points when set changes (size already updated)
  useEffect(() => {
    const { W, H } = sizeRef.current;
    const cx = W / 2;
    const cy = H / 2;
    setPointsRef.current = generatePoints(currentSetKey, cx, cy, W, H);
  }, [currentSetKey]);

  // Wheel for epsilon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e) => {
      e.preventDefault();
      setEpsilon((prev) => Math.max(8, Math.min(160, prev - Math.sign(e.deltaY) * 5)));
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
      const setPoints = setPointsRef.current;
      animTRef.current += 0.012;
      const animT = animTRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const config = SET_CONFIG[currentSetKey];

      // Grid
      ctx.fillStyle = 'rgba(107, 115, 148, 0.12)';
      const sp = 28;
      for (let gx = sp; gx < W; gx += sp) {
        for (let gy = sp; gy < H; gy += sp) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Set points
      for (const p of setPoints) {
        ctx.fillStyle = 'rgba(212, 216, 227, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Probe
      if (probePoint) {
        const tc = trueClassify(setPoints, probePoint.x, probePoint.y);
        const ec = epsClassify(setPoints, probePoint.x, probePoint.y, epsilon);

        let mainColor, fillColor, strokeAlpha;
        if (tc.isIsolated) {
          mainColor = CSS.isolated;
          fillColor = 'rgba(180, 142, 173, 0.08)';
          strokeAlpha = 'rgba(180, 142, 173, 0.67)';
        } else if (tc.isAccumulation) {
          mainColor = CSS.accumulation;
          fillColor = 'rgba(136, 192, 208, 0.08)';
          strokeAlpha = 'rgba(136, 192, 208, 0.67)';
        } else if (tc.isAdherent) {
          mainColor = CSS.adherent;
          fillColor = 'rgba(235, 203, 139, 0.08)';
          strokeAlpha = 'rgba(235, 203, 139, 0.67)';
        } else {
          mainColor = CSS.textDim;
          fillColor = 'rgba(107, 115, 148, 0.06)';
          strokeAlpha = 'rgba(107, 115, 148, 0.5)';
        }

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.lineDashOffset = -animT * 18;
        ctx.strokeStyle = strokeAlpha;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(probePoint.x, probePoint.y, epsilon, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        ctx.strokeStyle = strokeAlpha;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(probePoint.x, probePoint.y);
        ctx.lineTo(probePoint.x + epsilon, probePoint.y);
        ctx.stroke();

        ctx.font = '500 10px var(--font-mono)';
        ctx.fillStyle = mainColor;
        ctx.textAlign = 'left';
        ctx.fillText(`ε = ${epsilon}`, probePoint.x + epsilon + 5, probePoint.y - 4);

        // Highlight set points inside ball: self → adherent (orange) ring + "x"; others → accumulation (teal) ring + pulse
        for (const p of setPoints) {
          const d = dist(p.x, p.y, probePoint.x, probePoint.y);
          const isSelf = tc.inSet && d < 5;
          if (d < epsilon) {
            if (isSelf) {
              ctx.strokeStyle = CSS.adherent;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
              ctx.stroke();
              ctx.font = '600 9px var(--font-mono)';
              ctx.fillStyle = CSS.adherent;
              ctx.textAlign = 'center';
              ctx.fillText('x', p.x, p.y - 11);
            } else {
              ctx.strokeStyle = CSS.accumulation;
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
              ctx.stroke();
              const pulse = Math.sin(animT * 3 + d * 0.02) * 0.3 + 0.5;
              ctx.globalAlpha = pulse * 0.2;
              ctx.fillStyle = CSS.accumulation;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }
        }

        // Isolated: dashed line to nearest other + "Xpx gap"
        if (tc.isIsolated && tc.nearestOther < 300) {
          let nearest = null;
          let nearDist = Infinity;
          for (const p of setPoints) {
            const d = dist(p.x, p.y, probePoint.x, probePoint.y);
            if (d >= 5 && d < nearDist) {
              nearDist = d;
              nearest = p;
            }
          }
          if (nearest) {
            ctx.save();
            ctx.setLineDash([2, 3]);
            ctx.strokeStyle = 'rgba(180, 142, 173, 0.53)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(probePoint.x, probePoint.y);
            ctx.lineTo(nearest.x, nearest.y);
            ctx.stroke();
            ctx.setLineDash([]);
            const mx = (probePoint.x + nearest.x) / 2;
            const my = (probePoint.y + nearest.y) / 2;
            ctx.font = '500 9px var(--font-mono)';
            ctx.fillStyle = 'rgba(180, 142, 173, 0.8)';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(nearDist)}px gap`, mx, my - 6);
            ctx.restore();
          }
        }

        ctx.fillStyle = mainColor;
        ctx.shadowColor = mainColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(probePoint.x, probePoint.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(probePoint.x, probePoint.y, 2, 0, Math.PI * 2);
        ctx.fill();

        let label = '';
        if (tc.isIsolated) label = 'ISOLATED';
        else if (tc.isAccumulation && tc.inSet) label = 'ACCUMULATION (in S)';
        else if (tc.isAccumulation && !tc.inSet) label = 'ACCUMULATION (not in S)';
        else if (tc.isAdherent) label = 'ADHERENT';
        else label = 'NOT ADHERENT';

        ctx.font = '600 10px var(--font-mono)';
        ctx.fillStyle = mainColor;
        ctx.textAlign = 'center';
        ctx.fillText(label, probePoint.x, probePoint.y - epsilon - 10);

        if (!tc.isAdherent && !ec.hasSetPointInBall) {
          ctx.font = '10px var(--font-mono)';
          ctx.fillStyle = 'rgba(107, 115, 148, 0.67)';
          ctx.fillText('B(x,ε) ∩ S = ∅', probePoint.x, probePoint.y + epsilon + 16);
        }
      }

      ctx.font = '400 11px var(--font-mono)';
      ctx.fillStyle = 'rgba(107, 115, 148, 0.5)';
      ctx.textAlign = 'left';
      ctx.fillText(config?.description ?? '', 14, H - 10);

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [currentSetKey, probePoint, epsilon]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { W, H } = sizeRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (W / rect.width);
    const y = (e.clientY - rect.top) * (H / rect.height);
    setProbePoint({ x, y });
  };

  const handleReset = () => {
    setProbePoint(null);
    setEpsilon(50);
  };

  const setPoints = setPointsRef.current;
  const tc = probePoint ? trueClassify(setPoints, probePoint.x, probePoint.y) : null;
  const ec = probePoint ? epsClassify(setPoints, probePoint.x, probePoint.y, epsilon) : null;

  return (
    <div className="viz-page-container">
      <div className="viz-content-container" style={{ maxWidth: '1220px' }}>
        <header style={{ textAlign: 'center', padding: '44px 24px 12px' }}>
          <h1 className="viz-title" style={{ fontSize: 'clamp(26px, 4.5vw, 42px)', fontWeight: 400, letterSpacing: '-0.3px' }}>
            Adherent, <em style={{ fontStyle: 'italic' }}>Accumulation</em> & Isolated
          </h1>
          <p className="viz-subtitle" style={{ fontSize: '14px', maxWidth: '640px', margin: '8px auto 0', lineHeight: 1.65 }}>
            Click any point on the canvas. The visualization instantly classifies it and shows <em>why</em> —
            an animated shrinking ball reveals which set points are nearby. Adjust ε to explore manually.
          </p>
        </header>

        <div
          className="adherent-viz-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '20px',
            padding: '20px 24px 48px',
          }}
        >
          <div
            style={{
              background: CSS.surface,
              border: `1px solid ${CSS.border}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderBottom: `1px solid ${CSS.border}`,
                background: CSS.bg,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: CSS.textDim,
                }}
              >
                Set
              </span>
              <div style={{ display: 'flex', border: `1px solid ${CSS.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                {Object.keys(SET_CONFIG).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setCurrentSetKey(key);
                      setProbePoint(null);
                    }}
                    style={{
                      background: currentSetKey === key ? CSS.accent : 'transparent',
                      color: currentSetKey === key ? '#0d1117' : CSS.textDim,
                      border: 'none',
                      borderRight: key !== 'clusters' ? `1px solid ${CSS.border}` : 'none',
                      padding: '5px 13px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {SET_CONFIG[key].name}
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
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Clear
              </button>
            </div>

            <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
              <canvas
                ref={canvasRef}
                style={{ display: 'block', cursor: 'crosshair', background: CSS.surface, width: '100%' }}
                onClick={handleCanvasClick}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                borderTop: `1px solid ${CSS.border}`,
                background: CSS.bg,
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: CSS.textDim,
                  letterSpacing: '0.3px',
                }}
              >
                Click to probe · Scroll to adjust ε · The true classification uses the smallest possible ε
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: CSS.textDim }}>ε =</label>
                <input
                  type="range"
                  min={8}
                  max={160}
                  value={epsilon}
                  onChange={(e) => setEpsilon(parseInt(e.target.value, 10))}
                  style={{ width: '100px', accentColor: CSS.accent }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: CSS.accent,
                    fontWeight: 600,
                    minWidth: '28px',
                  }}
                >
                  {epsilon}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                background: CSS.adherentBg,
                border: `1px solid rgba(235, 203, 139, 0.25)`,
                borderRadius: '12px',
                padding: '14px 16px',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: CSS.adherent, marginBottom: '6px' }}>
                How to read this
              </h4>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                The colored ball around your probe point shows what&apos;s inside B(x, ε).
                Circled dots are set points caught by the ball.
              </p>
              <ul style={{ margin: '6px 0 0 18px', fontSize: '12px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <li><strong>Orange ring:</strong> set points captured (proves adherence)</li>
                <li><strong>Teal ring:</strong> <em>other</em> set points captured (proves accumulation)</li>
                <li>Try shrinking ε — if points <em>always</em> remain captured no matter how small, the classification holds for all ε.</li>
              </ul>
            </div>

            <div
              className="definition-box"
              style={{
                background: CSS.surface,
                border: `1px solid ${CSS.border}`,
                borderRadius: '12px',
                padding: '16px 18px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Classification
              </h3>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  background: CSS.bg,
                  borderRadius: '8px',
                  padding: '14px',
                  minHeight: '80px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                {!probePoint ? (
                  'Click a point on the canvas to classify it.'
                ) : (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '6px' }}>
                      {tc.inSet ? (
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>x ∈ S</span>
                      ) : (
                        <span style={{ color: CSS.textDim }}>x ∉ S</span>
                      )}
                      <span style={{ opacity: 0.5 }}> {tc.inSet ? '(point is in the set)' : '(point is NOT in the set)'}</span>
                    </div>
                    <div>
                      {tc.isAdherent ? (
                        <span style={{ color: CSS.adherent, fontWeight: 600 }}>✓ Adherent</span>
                      ) : (
                        <span style={{ opacity: 0.5, textDecoration: 'line-through' }}>✗ Adherent</span>
                      )}
                      {' — '}
                      {tc.isAdherent ? 'Every ball around x intersects S' : `Nearest set point is ${Math.round(tc.selfDist)}px away — a ball smaller than that misses S entirely`}
                    </div>
                    <div>
                      {tc.isAccumulation ? (
                        <span style={{ color: CSS.accumulation, fontWeight: 600 }}>✓ Accumulation</span>
                      ) : (
                        <span style={{ opacity: 0.5, textDecoration: 'line-through' }}>✗ Accumulation</span>
                      )}
                      {' — '}
                      {tc.isAccumulation ? 'Every ball catches other set points nearby' : tc.inSet ? `Nearest other point is ${Math.round(tc.nearestOther)}px away — a smaller ball isolates x` : 'No cluster of set points converges to x'}
                    </div>
                    <div>
                      {tc.isIsolated ? (
                        <span style={{ color: CSS.isolated, fontWeight: 600 }}>✓ Isolated</span>
                      ) : (
                        <span style={{ opacity: 0.5, textDecoration: 'line-through' }}>✗ Isolated</span>
                      )}
                      {' — '}
                      {tc.isIsolated ? `x ∈ S and nearest other point is ${Math.round(tc.nearestOther)}px away` : tc.inSet ? 'Other set points are arbitrarily close' : 'x ∉ S (must be in S to be isolated)'}
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${CSS.border}`, fontSize: '11px', opacity: 0.7 }}>
                      Current B(x, {epsilon}): {ec.hasOtherSetPointInBall ? 'catches other set points ' : ec.hasSetPointInBall ? 'catches only x itself ' : 'empty of set points '}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--text-primary)' }} />
                  Set point
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: CSS.adherent }} />
                  Adherent
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: CSS.accumulation }} />
                  Accumulation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: CSS.isolated }} />
                  Isolated
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'transparent', border: `1px dashed ${CSS.textDim}` }} />
                  None
                </div>
              </div>
            </div>

            <div
              className="definition-box"
              style={{
                borderRadius: '12px',
                padding: '16px 18px',
                border: `1px solid ${CSS.border}`,
                background: CSS.surface,
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', padding: '2px 8px', borderRadius: '4px', background: CSS.adherentBg, color: CSS.adherent }}>
                  Adherent
                </span>
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <em>x</em> is adherent to S if <strong>every</strong> ball around it touches S. Equivalently, there is no gap separating x from S.
              </p>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--color-primary)',
                  background: 'rgba(136, 192, 208, 0.08)',
                  padding: '9px 13px',
                  borderRadius: '7px',
                  marginTop: '8px',
                  display: 'block',
                  lineHeight: 1.65,
                  borderLeft: `3px solid var(--color-primary)`,
                }}
              >
                x ∈ S̄ ⟺ ∀ε&gt;0 : B(x,ε) ∩ S ≠ ∅
              </code>
            </div>

            <div
              className="definition-box"
              style={{
                borderRadius: '12px',
                padding: '16px 18px',
                border: `1px solid ${CSS.border}`,
                background: CSS.surface,
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', padding: '2px 8px', borderRadius: '4px', background: CSS.accumulationBg, color: CSS.accumulation }}>
                  Accumulation
                </span>
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <em>x</em> is an accumulation (limit) point if every ball catches a set point <strong>other than x</strong>. Points of S crowd around x.
              </p>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--color-primary)',
                  background: 'rgba(136, 192, 208, 0.08)',
                  padding: '9px 13px',
                  borderRadius: '7px',
                  marginTop: '8px',
                  display: 'block',
                  lineHeight: 1.65,
                  borderLeft: `3px solid var(--color-primary)`,
                }}
              >
                x ∈ S′ ⟺ ∀ε&gt;0 : B(x,ε) ∩ (S ∖ {'{x}'}) ≠ ∅
              </code>
            </div>

            <div
              className="definition-box"
              style={{
                borderRadius: '12px',
                padding: '16px 18px',
                border: `1px solid ${CSS.border}`,
                background: CSS.surface,
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', padding: '2px 8px', borderRadius: '4px', background: CSS.isolatedBg, color: CSS.isolated }}>
                  Isolated
                </span>
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <em>x</em> ∈ S is isolated if <strong>some</strong> ball around it catches no other set points. x is in S but stands alone.
              </p>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--color-primary)',
                  background: 'rgba(136, 192, 208, 0.08)',
                  padding: '9px 13px',
                  borderRadius: '7px',
                  marginTop: '8px',
                  display: 'block',
                  lineHeight: 1.65,
                  borderLeft: `3px solid var(--color-primary)`,
                }}
              >
                x isolated ⟺ x ∈ S ∧ ∃ε&gt;0 : B(x,ε) ∩ S = {'{x}'}
              </code>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .adherent-viz-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
