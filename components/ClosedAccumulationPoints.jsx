'use client';

import React, { useState } from 'react';

const LemmaVisualization = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Setup",
      description: "A is a closed set (shown in blue). We have a point 'a' that is an accumulation point of A.",
      showA: true,
      showPoint: true,
      showComplement: false,
      showNeighborhood: false,
      pointInA: null,
      highlightContradiction: false
    },
    {
      title: "Assume a ∉ A",
      description: "For contradiction, suppose a is NOT in A. This means a must be in the complement Aᶜ (the white region).",
      showA: true,
      showPoint: true,
      showComplement: true,
      showNeighborhood: false,
      pointInA: false,
      highlightContradiction: false
    },
    {
      title: "Aᶜ is Open",
      description: "Since A is closed, its complement Aᶜ is open by definition. This is crucial!",
      showA: true,
      showPoint: true,
      showComplement: true,
      showNeighborhood: false,
      pointInA: false,
      highlightContradiction: false
    },
    {
      title: "Open Set Property",
      description: "Since Aᶜ is open and a ∈ Aᶜ, there exists ε {'>'} 0 such that the entire interval (a-ε, a+ε) is contained in Aᶜ.",
      showA: true,
      showPoint: true,
      showComplement: true,
      showNeighborhood: true,
      pointInA: false,
      highlightContradiction: false
    },
    {
      title: "The Contradiction!",
      description: "But wait! If (a-ε, a+ε) ⊆ Aᶜ, then (a-ε, a+ε) ∩ A = ∅. This means NO points of A are near 'a'. But 'a' is an accumulation point — every neighborhood must contain points of A!",
      showA: true,
      showPoint: true,
      showComplement: true,
      showNeighborhood: true,
      pointInA: false,
      highlightContradiction: true
    },
    {
      title: "Conclusion",
      description: "Our assumption that a ∉ A led to a contradiction. Therefore, a ∈ A. Closed sets contain all their accumulation points. ∎",
      showA: true,
      showPoint: true,
      showComplement: false,
      showNeighborhood: false,
      pointInA: true,
      highlightContradiction: false
    }
  ];
  
  const current = steps[step];
  
  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Lemma 2.3.2 — Visual Proof
        </h1>
        <p className="viz-subtitle" style={{ fontStyle: 'italic' }}>
          If A is closed, then A contains all its accumulation points
        </p>
        
        {/* Main Visualization */}
        <div className="visualization-container" style={{ 
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* Number Line Visualization */}
          <svg viewBox="0 0 700 200" style={{ width: '100%', height: 'auto' }}>
            {/* Background */}
            <defs>
              <linearGradient id="aGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9"/>
              </linearGradient>
              <linearGradient id="complementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0.15"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* The Real Line */}
            <line x1="50" y1="100" x2="650" y2="100" stroke="#4a5568" strokeWidth="2"/>
            <polygon points="645,95 655,100 645,105" fill="#4a5568"/>
            <text x="660" y="105" fill="#718096" fontSize="14" fontFamily="serif">ℝ</text>
            
            {/* Complement region (shown as background) */}
            {current.showComplement && (
              <>
                <rect x="50" y="70" width="150" height="60" fill="url(#complementGradient)" 
                      style={{ transition: 'opacity 0.5s' }}/>
                <rect x="450" y="70" width="200" height="60" fill="url(#complementGradient)"
                      style={{ transition: 'opacity 0.5s' }}/>
                <text x="100" y="55" fill="#fcd34d" fontSize="12" fontFamily="serif" opacity="0.8">Aᶜ (open)</text>
                <text x="520" y="55" fill="#fcd34d" fontSize="12" fontFamily="serif" opacity="0.8">Aᶜ (open)</text>
              </>
            )}
            
            {/* Set A */}
            {current.showA && (
              <g style={{ transition: 'all 0.5s' }}>
                <rect x="200" y="85" width="250" height="30" rx="4" fill="url(#aGradient)"
                      style={{ filter: current.highlightContradiction ? 'none' : 'url(#glow)' }}/>
                <text x="325" y="78" fill="#93c5fd" fontSize="14" fontFamily="serif" textAnchor="middle">
                  A (closed set)
                </text>
                {/* Endpoints */}
                <circle cx="200" cy="100" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2"/>
                <circle cx="450" cy="100" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2"/>
              </g>
            )}
            
            {/* The neighborhood */}
            {current.showNeighborhood && (
              <g style={{ transition: 'all 0.5s' }}>
                {/* Epsilon neighborhood */}
                <rect x="480" y="82" width="100" height="36" rx="18" 
                      fill={current.highlightContradiction ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.2)"} 
                      stroke={current.highlightContradiction ? "#ef4444" : "#10b981"} 
                      strokeWidth="2" strokeDasharray="5,3"/>
                <text x="530" y="140" fill={current.highlightContradiction ? "#fca5a5" : "#6ee7b7"} 
                      fontSize="12" fontFamily="serif" textAnchor="middle">
                  (a-ε, a+ε)
                </text>
                {/* Epsilon markers */}
                <line x1="480" y1="155" x2="530" y2="155" stroke="#6ee7b7" strokeWidth="1"/>
                <text x="505" y="168" fill="#6ee7b7" fontSize="11" fontFamily="serif" textAnchor="middle">ε</text>
                <line x1="530" y1="155" x2="580" y2="155" stroke="#6ee7b7" strokeWidth="1"/>
                <text x="555" y="168" fill="#6ee7b7" fontSize="11" fontFamily="serif" textAnchor="middle">ε</text>
              </g>
            )}
            
            {/* Point a */}
            {current.showPoint && (
              <g style={{ transition: 'all 0.5s' }}>
                <circle cx="530" cy="100" r="8" 
                        fill={current.pointInA === true ? "#3b82f6" : current.pointInA === false ? "#f59e0b" : "#a855f7"}
                        stroke="#fff" strokeWidth="2"
                        style={{ filter: 'url(#glow)' }}/>
                <text x="530" y="45" fill={current.pointInA === true ? "#93c5fd" : current.pointInA === false ? "#fcd34d" : "#d8b4fe"} 
                      fontSize="16" fontFamily="serif" textAnchor="middle" fontStyle="italic">
                  a
                </text>
                <text x="530" y="62" fill="#a0a0a0" fontSize="11" fontFamily="serif" textAnchor="middle">
                  (accumulation point)
                </text>
              </g>
            )}
            
            {/* Contradiction X marks */}
            {current.highlightContradiction && (
              <g>
                <text x="530" y="108" fill="#ef4444" fontSize="24" fontFamily="serif" textAnchor="middle" fontWeight="bold">
                  ✗
                </text>
                <text x="325" y="185" fill="#fca5a5" fontSize="13" fontFamily="serif" textAnchor="middle">
                  No points of A in the neighborhood — but a is an accumulation point!
                </text>
              </g>
            )}
          </svg>
        </div>
        
        {/* Step Info */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {step + 1}
            </span>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#f0e6d3',
              margin: 0
            }}>
              {current.title}
            </h2>
          </div>
          <p style={{
            fontSize: '17px',
            lineHeight: '1.7',
            color: '#d1d5db',
            margin: 0
          }}>
            {current.description}
          </p>
        </div>
        
        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontFamily: "'Crimson Text', Georgia, serif",
              background: step === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              color: step === 0 ? '#666' : '#e8e8e8',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontFamily: "'Crimson Text', Georgia, serif",
              background: step === steps.length - 1 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: step === steps.length - 1 ? '#666' : '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: step === steps.length - 1 ? 'none' : '0 4px 20px rgba(99,102,241,0.3)'
            }}
          >
            Next →
          </button>
        </div>
        
        {/* Progress dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                background: i === step ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: i === step ? 'scale(1.3)' : 'scale(1)'
              }}
            />
          ))}
        </div>
        
        {/* Key Insight Box */}
        <div style={{
          marginTop: '40px',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.1) 100%)',
          borderRadius: '12px',
          padding: '20px 24px',
          border: '1px solid rgba(139,92,246,0.3)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#c4b5fd',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>💡</span> Key Insight
          </h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#d1d5db',
            margin: 0
          }}>
            The contradiction arises from two incompatible requirements: being an <em>accumulation point</em> means 
            every neighborhood must intersect A, but being in an <em>open set</em> (Aᶜ) means some neighborhood 
            is entirely contained in Aᶜ and thus misses A completely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LemmaVisualization;