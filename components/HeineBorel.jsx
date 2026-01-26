'use client';

import React, { useState, useEffect } from 'react';

export default function HeineBorelProofVisualization() {
  const [step, setStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Interval boundaries for the bisection process
  const intervals = [
    { a: 0, b: 1, level: 0, label: '[a₀, b₀]' },
    { a: 0.5, b: 1, level: 1, label: '[a₁, b₁]', note: 'Right half cannot be finitely covered' },
    { a: 0.5, b: 0.75, level: 2, label: '[a₂, b₂]', note: 'Left half cannot be finitely covered' },
    { a: 0.625, b: 0.75, level: 3, label: '[a₃, b₃]', note: 'Right half cannot be finitely covered' },
    { a: 0.625, b: 0.6875, level: 4, label: '[a₄, b₄]', note: 'Left half cannot be finitely covered' },
  ];

  const proofSteps = [
    {
      title: "Setup: Assume for Contradiction",
      description: "Suppose S ⊂ [a₀, b₀] is closed and bounded, but CANNOT be covered by finitely many open sets from our covering {Uᵢ}.",
      detail: "We'll derive a contradiction by constructing a nested sequence of intervals."
    },
    {
      title: "Step 1: Bisect the Interval",
      description: "Cut [a₀, b₀] in half. At least ONE half cannot be finitely covered (otherwise the whole interval could be!).",
      detail: "Call this 'bad' half [a₁, b₁]. Its length is (b₀-a₀)/2."
    },
    {
      title: "Step 2: Keep Bisecting",
      description: "Repeat! Bisect [a₁, b₁]. One half cannot be finitely covered — call it [a₂, b₂].",
      detail: "Length is now (b₀-a₀)/4. We keep going..."
    },
    {
      title: "Step 3: Nested Intervals",
      description: "We get a nested sequence: [a₀,b₀] ⊃ [a₁,b₁] ⊃ [a₂,b₂] ⊃ ...",
      detail: "Each [aⱼ, bⱼ] cannot be finitely covered, and bⱼ - aⱼ = (b₀-a₀)/2ʲ → 0"
    },
    {
      title: "Step 4: Find the Limit Point",
      description: "Pick cₖ ∈ S ∩ [aₖ, bₖ] for each k. Since intervals shrink to zero width, (cₖ) is Cauchy!",
      detail: "So cₖ → c for some c ∈ ℝ. Since S is closed, c ∈ S."
    },
    {
      title: "Step 5: The Contradiction",
      description: "Since c ∈ S, some open set Uᵢ₀ contains c. So there's an ε-ball around c inside Uᵢ₀.",
      detail: "But for large j, the entire interval [aⱼ, bⱼ] fits inside this ε-ball!"
    },
    {
      title: "Step 6: Conclusion",
      description: "This means [aⱼ, bⱼ] ∩ S is covered by just ONE open set Uᵢ₀ — a finite cover!",
      detail: "CONTRADICTION! So our assumption was wrong. S CAN be finitely covered. ∎"
    }
  ];

  // Auto-advance animation
  useEffect(() => {
    if (isPlaying && animationPhase < 10) {
      const timer = setTimeout(() => {
        setAnimationPhase(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (animationPhase >= 10) {
      setIsPlaying(false);
    }
  }, [isPlaying, animationPhase]);

  const resetAnimation = () => {
    setAnimationPhase(0);
    setIsPlaying(false);
  };

  // Convert interval [a,b] in [0,1] to SVG coordinates
  const toSvgX = (val) => 60 + val * 480;
  
  // Calculate the limit point c (around 0.656...)
  const limitPoint = 0.656;

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Heine-Borel Theorem
        </h1>
        
        <p className="viz-subtitle">
          Proof by Contradiction using Interval Bisection
        </p>

        {/* Theorem Statement */}
        <div className="proof-box" style={{ borderColor: 'rgba(180, 142, 173, 0.5)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#b48ead', fontSize: '1rem', fontWeight: 600 }}>
            📜 Theorem 2.3.3 (Heine-Borel)
          </h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Let <span className="math">S</span> be a <strong>closed and bounded</strong> subset of ℝ, 
            and let <span className="math">{'{Uᵢ}ᵢ∈I'}</span> be an open covering of S. 
            Then there exists a <strong>finite</strong> subcollection that still covers S.
          </p>
        </div>

        {/* Step Navigation */}
        <div className="step-nav">
          {proofSteps.map((_, i) => (
            <button
              key={i}
              className={`step-btn ${i === step ? 'active' : ''}`}
              onClick={() => { setStep(i); resetAnimation(); }}
            >
              {i}
            </button>
          ))}
        </div>

        {/* Current Step Display */}
        <div className="proof-box">
          <h3 style={{ 
            margin: '0 0 12px 0', 
            color: '#88c0d0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              background: '#88c0d0',
              color: '#0d1117',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: 700
            }}>{step}</span>
            {proofSteps[step].title}
          </h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '1.1rem', lineHeight: 1.7 }}>
            {proofSteps[step].description}
          </p>
          <p style={{ margin: 0, opacity: 0.7, fontStyle: 'italic', fontSize: '0.95rem' }}>
            {proofSteps[step].detail}
          </p>
        </div>

        {/* Main Visualization */}
        <div className="visualization-container">
          <svg viewBox="0 0 600 380" style={{ width: '100%', height: 'auto' }}>
            <defs>
              <linearGradient id="intervalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#88c0d0" />
                <stop offset="100%" stopColor="#81a1c1" />
              </linearGradient>
              <linearGradient id="badGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#bf616a" />
                <stop offset="100%" stopColor="#d08770" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Title for diagram */}
            <text x="300" y="25" textAnchor="middle" fill="#e6edf3" fontSize="14" fontWeight="600">
              Bisection Process: Finding the Contradiction
            </text>

            {/* Base number line */}
            <line x1="60" y1="60" x2="540" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="60" y="80" textAnchor="middle" fill="#88c0d0" fontSize="12" fontFamily="Fira Code">a₀</text>
            <text x="540" y="80" textAnchor="middle" fill="#88c0d0" fontSize="12" fontFamily="Fira Code">b₀</text>

            {/* Draw intervals based on step */}
            {step >= 0 && intervals.slice(0, Math.min(step + 1, intervals.length)).map((interval, i) => {
              const y = 55 + i * 50;
              const x1 = toSvgX(interval.a);
              const x2 = toSvgX(interval.b);
              const midX = (x1 + x2) / 2;
              const isLatest = i === Math.min(step, intervals.length - 1);
              
              return (
                <g key={i} className="interval-animate" style={{ animationDelay: `${i * 0.2}s` }}>
                  {/* Interval bar */}
                  <rect
                    x={x1}
                    y={y - 8}
                    width={x2 - x1}
                    height={16}
                    rx="4"
                    fill={isLatest ? "url(#badGrad)" : "rgba(136, 192, 208, 0.3)"}
                    stroke={isLatest ? "#bf616a" : "#88c0d0"}
                    strokeWidth={isLatest ? 2 : 1}
                    filter={isLatest ? "url(#glow)" : "none"}
                  />
                  
                  {/* Interval label */}
                  <text 
                    x={midX} 
                    y={y + 4} 
                    textAnchor="middle" 
                    fill="#fff" 
                    fontSize="11"
                    fontFamily="Fira Code"
                    fontWeight="500"
                  >
                    {interval.label}
                  </text>

                  {/* Length annotation */}
                  <text 
                    x={x2 + 10} 
                    y={y + 4} 
                    fill="rgba(255,255,255,0.6)" 
                    fontSize="10"
                    fontFamily="Fira Code"
                  >
                    length = 1/{Math.pow(2, i)}
                  </text>

                  {/* Bisection line for next step */}
                  {step > i && i < intervals.length - 1 && (
                    <line
                      x1={toSvgX((interval.a + interval.b) / 2)}
                      y1={y + 12}
                      x2={toSvgX((interval.a + interval.b) / 2)}
                      y2={y + 35}
                      stroke="#d08770"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                  )}
                </g>
              );
            })}

            {/* Show limit point c for steps 4+ */}
            {step >= 4 && (
              <g>
                {/* Vertical line showing convergence */}
                <line
                  x1={toSvgX(limitPoint)}
                  y1="90"
                  x2={toSvgX(limitPoint)}
                  y2="310"
                  stroke="#a3be8c"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  opacity="0.7"
                />
                
                {/* The limit point c */}
                <circle
                  cx={toSvgX(limitPoint)}
                  cy="320"
                  r="8"
                  fill="#a3be8c"
                  className="point-pulse"
                  filter="url(#glow)"
                />
                <text 
                  x={toSvgX(limitPoint)} 
                  y="345" 
                  textAnchor="middle" 
                  fill="#a3be8c" 
                  fontSize="14"
                  fontFamily="Fira Code"
                  fontWeight="600"
                >
                  c ∈ S
                </text>
                <text 
                  x={toSvgX(limitPoint)} 
                  y="360" 
                  textAnchor="middle" 
                  fill="rgba(163, 190, 140, 0.7)" 
                  fontSize="11"
                  fontFamily="Fira Code"
                >
                  (limit point)
                </text>
              </g>
            )}

            {/* Show ε-ball and contradiction for steps 5+ */}
            {step >= 5 && (
              <g>
                {/* ε-ball around c */}
                <ellipse
                  cx={toSvgX(limitPoint)}
                  cy="200"
                  rx="80"
                  ry="120"
                  fill="rgba(163, 190, 140, 0.15)"
                  stroke="#a3be8c"
                  strokeWidth="2"
                  strokeDasharray={step >= 6 ? "none" : "8,4"}
                />
                <text 
                  x={toSvgX(limitPoint) + 85} 
                  y="200" 
                  fill="#a3be8c" 
                  fontSize="13"
                  fontFamily="Fira Code"
                >
                  Uᵢ₀ ∋ c
                </text>
                <text 
                  x={toSvgX(limitPoint) + 85} 
                  y="218" 
                  fill="rgba(163, 190, 140, 0.7)" 
                  fontSize="11"
                  fontFamily="Fira Code"
                >
                  (one open set!)
                </text>

                {/* Arrow showing the interval fits inside */}
                {step >= 6 && (
                  <g>
                    <path
                      d={`M ${toSvgX(limitPoint)} 270 Q ${toSvgX(limitPoint) - 60} 240 ${toSvgX(limitPoint) - 40} 200`}
                      fill="none"
                      stroke="#ebcb8b"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text 
                      x={toSvgX(limitPoint) - 100} 
                      y="245" 
                      fill="#ebcb8b" 
                      fontSize="11"
                      fontFamily="Fira Code"
                      fontWeight="500"
                    >
                      [aⱼ, bⱼ] ⊂ Uᵢ₀
                    </text>
                    <text 
                      x={toSvgX(limitPoint) - 100} 
                      y="260" 
                      fill="rgba(235, 203, 139, 0.7)" 
                      fontSize="10"
                      fontFamily="Fira Code"
                    >
                      (for large j)
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* Contradiction symbol */}
            {step >= 6 && (
              <g>
                <text 
                  x="300" 
                  y="375" 
                  textAnchor="middle" 
                  fill="#bf616a" 
                  fontSize="16"
                  fontWeight="700"
                >
                  ⚡ CONTRADICTION! One set covers [aⱼ, bⱼ] ∩ S — but we said it couldn't be finitely covered!
                </text>
              </g>
            )}

            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ebcb8b" />
              </marker>
            </defs>
          </svg>

          {/* Legend */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '8px',
            marginTop: '16px' 
          }}>
            <div className="legend-box">
              <div style={{ width: '16px', height: '16px', background: 'linear-gradient(135deg, #bf616a, #d08770)', borderRadius: '3px' }} />
              <span>Current "bad" interval</span>
            </div>
            <div className="legend-box">
              <div style={{ width: '16px', height: '16px', background: 'rgba(136, 192, 208, 0.5)', borderRadius: '3px', border: '1px solid #88c0d0' }} />
              <span>Previous intervals</span>
            </div>
            {step >= 4 && (
              <div className="legend-box">
                <div style={{ width: '12px', height: '12px', background: '#a3be8c', borderRadius: '50%' }} />
                <span>Limit point c</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            className="btn secondary"
            onClick={() => { setStep(Math.max(0, step - 1)); resetAnimation(); }}
            disabled={step === 0}
          >
            ← Previous
          </button>
          <button 
            className="btn"
            onClick={() => { setStep(Math.min(proofSteps.length - 1, step + 1)); resetAnimation(); }}
            disabled={step === proofSteps.length - 1}
          >
            Next →
          </button>
        </div>

        {/* Key Insight Boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginTop: '32px'
        }}>
          <div style={{
            background: 'rgba(191, 97, 106, 0.1)',
            border: '1px solid rgba(191, 97, 106, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#bf616a' }}>🔑 Key Technique</h4>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6 }}>
              <strong>Bisection + Pigeonhole:</strong> If the whole can't be finitely covered, 
              at least one half can't either. Keep bisecting the "bad" half.
            </p>
          </div>
          
          <div style={{
            background: 'rgba(163, 190, 140, 0.1)',
            border: '1px solid rgba(163, 190, 140, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#a3be8c' }}>🎯 Why Closed Matters</h4>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6 }}>
              The limit point c must be <em>in S</em> for the contradiction to work. 
              Closedness guarantees accumulation points stay in S.
            </p>
          </div>
          
          <div style={{
            background: 'rgba(136, 192, 208, 0.1)',
            border: '1px solid rgba(136, 192, 208, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#88c0d0' }}>📐 Why Bounded Matters</h4>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6 }}>
              Boundedness lets us start with a finite interval [a₀, b₀]. 
              Unbounded sets can have open coverings with no finite subcover!
            </p>
          </div>
        </div>

        {/* Summary of the Logic */}
        <div style={{
          background: 'rgba(235, 203, 139, 0.1)',
          border: '1px solid rgba(235, 203, 139, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#ebcb8b' }}>📋 Proof Logic Summary</h3>
          <div style={{ 
            fontFamily: '"Fira Code", monospace', 
            fontSize: '0.9rem',
            lineHeight: 2,
            color: 'rgba(255,255,255,0.9)'
          }}>
            <div>1. <span style={{color: '#bf616a'}}>Assume</span> S cannot be finitely covered</div>
            <div>2. <span style={{color: '#d08770'}}>Bisect</span> repeatedly → nested intervals [aⱼ, bⱼ], each "bad"</div>
            <div>3. <span style={{color: '#ebcb8b'}}>Widths → 0</span>, so sequence (cⱼ) is Cauchy → converges to c</div>
            <div>4. <span style={{color: '#a3be8c'}}>S closed</span> ⟹ c ∈ S ⟹ some Uᵢ₀ contains c</div>
            <div>5. <span style={{color: '#88c0d0'}}>Small interval</span> [aⱼ, bⱼ] fits entirely inside Uᵢ₀</div>
            <div>6. <span style={{color: '#b48ead'}}>Contradiction!</span> [aⱼ, bⱼ] ∩ S has a finite cover (just Uᵢ₀) ∎</div>
          </div>
        </div>
      </div>
    </div>
  );
}
