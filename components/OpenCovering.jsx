'use client';

import React, { useState } from 'react';

export default function OpenCoveringVisualization() {
  const [step, setStep] = useState(0);
  const [showFiniteSubcover, setShowFiniteSubcover] = useState(false);
  
  const steps = [
    {
      title: "The Set S",
      description: "Let's start with a set S (the thick blue line segment). This is the set we want to 'cover'."
    },
    {
      title: "Open Sets (Circles)",
      description: "An open set in ℝ is like an interval without its endpoints. Here, we visualize them as circular regions. Each point inside is 'covered' by that open set."
    },
    {
      title: "Open Covering",
      description: "An open covering is a collection of open sets whose union contains all of S. Every point in S must be inside at least one open set."
    },
    {
      title: "Why 'Open'?",
      description: "The sets must be open (no boundary points included). This is crucial for many theorems in analysis!"
    }
  ];

  const openSets = [
    { cx: 80, cy: 200, r: 70, color: 'rgba(255, 99, 132, 0.25)', border: 'rgb(255, 99, 132)', label: 'U₁' },
    { cx: 160, cy: 200, r: 65, color: 'rgba(255, 159, 64, 0.25)', border: 'rgb(255, 159, 64)', label: 'U₂' },
    { cx: 240, cy: 200, r: 75, color: 'rgba(255, 205, 86, 0.25)', border: 'rgb(255, 205, 86)', label: 'U₃' },
    { cx: 330, cy: 200, r: 70, color: 'rgba(75, 192, 192, 0.25)', border: 'rgb(75, 192, 192)', label: 'U₄' },
    { cx: 410, cy: 200, r: 65, color: 'rgba(54, 162, 235, 0.25)', border: 'rgb(54, 162, 235)', label: 'U₅' },
    { cx: 490, cy: 200, r: 70, color: 'rgba(153, 102, 255, 0.25)', border: 'rgb(153, 102, 255)', label: 'U₆' },
  ];

  const finiteSubcover = [0, 2, 4]; // Indices of sets that form a finite subcover

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Open Covering
        </h1>
        
        <p className="viz-subtitle">
          A fundamental concept in topology and real analysis
        </p>
        
        <div className="definition-box" style={{ borderLeftColor: 'var(--color-error)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-error)', fontSize: '1.1rem' }}>
            📖 Definition 2.3.4 — Open Covering
          </h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Let <span className="math-text">A</span> be a subset of <span className="math-text">ℝ</span>. 
            An <strong>open covering</strong> of <span className="math-text">A</span> is a collection of open sets 
            <span className="math-text"> {'{Uᵢ}ᵢ∈I'}</span> such that:
          </p>
          <p style={{ 
            textAlign: 'center', 
            fontSize: '1.3rem', 
            margin: '16px 0 0 0',
            fontFamily: 'var(--font-mono)'
          }}>
            A ⊂ ⋃<sub>i∈I</sub> Uᵢ
          </p>
        </div>

        {/* Main Visualization */}
        <div className="visualization-container" style={{ marginTop: '32px' }}>
          <svg viewBox="0 0 560 320" style={{ width: '100%', height: 'auto' }}>
            {/* Grid lines for reference */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Draw open sets based on current step */}
            {step >= 1 && openSets.map((set, i) => {
              const isInSubcover = finiteSubcover.includes(i);
              const shouldShow = !showFiniteSubcover || isInSubcover;
              const opacity = showFiniteSubcover && !isInSubcover ? 0.15 : 1;
              
              return (
                <g key={i} className="open-set" style={{ opacity }}>
                  <circle
                    cx={set.cx}
                    cy={set.cy}
                    r={set.r}
                    fill={set.color}
                    stroke={set.border}
                    strokeWidth="2"
                    strokeDasharray={step >= 2 ? "none" : "5,5"}
                  />
                  <text
                    x={set.cx}
                    y={set.cy - set.r - 10}
                    textAnchor="middle"
                    fill={set.border}
                    fontSize="16"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="500"
                  >
                    {set.label}
                  </text>
                </g>
              );
            })}
            
            {/* The set S (line segment) */}
            <line
              x1="50"
              y1="200"
              x2="520"
              y2="200"
              stroke="#4fc3f7"
              strokeWidth="6"
              strokeLinecap="round"
              className={step === 0 ? "pulse" : ""}
            />
            
            {/* Endpoints */}
            <circle cx="50" cy="200" r="8" fill="#4fc3f7" />
            <circle cx="520" cy="200" r="8" fill="#4fc3f7" />
            
            {/* Labels for the set */}
            <text x="50" y="235" textAnchor="middle" fill="#4fc3f7" fontSize="14" fontFamily="JetBrains Mono">a</text>
            <text x="520" y="235" textAnchor="middle" fill="#4fc3f7" fontSize="14" fontFamily="JetBrains Mono">b</text>
            <text x="285" y="260" textAnchor="middle" fill="#4fc3f7" fontSize="18" fontFamily="JetBrains Mono" fontWeight="500">
              S = [a, b]
            </text>
            
            {/* Overlap indicators */}
            {step >= 2 && (
              <g>
                {[120, 200, 285, 370, 450].map((x, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={200}
                    r="4"
                    fill="#fff"
                    opacity="0.7"
                  />
                ))}
              </g>
            )}
          </svg>
          
          {/* Step description */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            minHeight: '80px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#e94560' }}>
              {steps[step].title}
            </h3>
            <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>
              {steps[step].description}
            </p>
          </div>
          
          {/* Step indicators */}
          <div className="step-indicator">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`step-dot ${i === step ? 'active' : ''}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              className="btn secondary"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              style={{ opacity: step === 0 ? 0.5 : 1 }}
            >
              ← Previous
            </button>
            <button 
              className="btn"
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
              style={{ opacity: step === steps.length - 1 ? 0.5 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>
        
        {/* Heine-Borel Connection */}
        {step >= 2 && (
          <div style={{
            background: 'rgba(233, 69, 96, 0.1)',
            border: '1px solid rgba(233, 69, 96, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '32px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#e94560' }}>
              🎯 Connection to Heine-Borel Theorem
            </h3>
            <p style={{ margin: '0 0 16px 0', lineHeight: 1.7 }}>
              The Heine-Borel Theorem states: If <span className="math-text">S</span> is <strong>closed and bounded</strong>, 
              then <em>every</em> open covering has a <strong>finite subcovering</strong>—meaning you only need 
              finitely many of those open sets!
            </p>
            
            <button 
              className={`btn ${showFiniteSubcover ? '' : 'secondary'}`}
              onClick={() => setShowFiniteSubcover(!showFiniteSubcover)}
            >
              {showFiniteSubcover ? '← Show All Open Sets' : 'Show Finite Subcover →'}
            </button>
            
            {showFiniteSubcover && (
              <p style={{ marginTop: '16px', opacity: 0.8, fontStyle: 'italic' }}>
                Notice: Just <span className="math-text">U₁, U₃, U₅</span> (3 sets!) are enough to cover all of S. 
                This is the power of the Heine-Borel theorem!
              </p>
            )}
          </div>
        )}
        
        {/* Key Intuition */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '32px'
        }}>
          <div className="proof-box" style={{ padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔓</div>
            <h4 style={{ margin: '0 0 8px 0' }}>Open</h4>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.95rem' }}>
              Each set Uᵢ is open (contains no boundary points)
            </p>
          </div>
          
          <div className="proof-box" style={{ padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎪</div>
            <h4 style={{ margin: '0 0 8px 0' }}>Covering</h4>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.95rem' }}>
              Their union contains the entire set S
            </p>
          </div>
          
          <div className="proof-box" style={{ padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>♾️</div>
            <h4 style={{ margin: '0 0 8px 0' }}>Possibly Infinite</h4>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.95rem' }}>
              The collection {'{Uᵢ}'} can have infinitely many sets
            </p>
          </div>
        </div>
        
        {/* Formal summary */}
        <div className="proof-box" style={{ marginTop: '32px', background: 'rgba(136, 192, 208, 0.1)', borderColor: 'rgba(136, 192, 208, 0.3)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)' }}>📝 In Plain English</h3>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Think of an open covering like putting <strong>overlapping bubbles</strong> over every point 
            of your set. Each bubble is an open set, and together they must cover everything. 
            The bubbles can overlap (and usually do!), and you might need infinitely many of them—unless 
            your set is compact (closed and bounded), in which case finitely many bubbles always suffice!
          </p>
        </div>
      </div>
    </div>
  );
}