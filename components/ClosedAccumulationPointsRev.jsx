'use client';

import React, { useState } from 'react';

const LemmaReverseVisualization = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Setup",
      description: "We have a set A that contains all its accumulation points. We want to prove A is closed, which means proving Aᶜ (the complement) is open.",
      showA: true,
      showComplement: false,
      showPointA: false,
      showNeighborhood: false,
      showAccumulationTest: false,
      highlightSuccess: false
    },
    {
      title: "Goal: Show Aᶜ is Open",
      description: "To prove A is closed, we must show Aᶜ is open. By definition, Aᶜ is open if for every point a ∈ Aᶜ, there exists ε > 0 such that (a-ε, a+ε) ⊆ Aᶜ.",
      showA: true,
      showComplement: true,
      showPointA: false,
      showNeighborhood: false,
      showAccumulationTest: false,
      highlightSuccess: false
    },
    {
      title: "Pick Arbitrary a ∈ Aᶜ",
      description: "Let a be any point in Aᶜ. Since a ∉ A, and A contains all its accumulation points, we know a is NOT an accumulation point of A.",
      showA: true,
      showComplement: true,
      showPointA: true,
      showNeighborhood: false,
      showAccumulationTest: false,
      highlightSuccess: false
    },
    {
      title: "What Does 'Not an Accumulation Point' Mean?",
      description: "Since a is NOT an accumulation point of A, the negation of the definition tells us: there EXISTS some ε > 0 such that ((a-ε, a+ε) \\ {a}) ∩ A = ∅. That is, some neighborhood of a (excluding a itself) contains no points of A.",
      showA: true,
      showComplement: true,
      showPointA: true,
      showNeighborhood: false,
      showAccumulationTest: true,
      highlightSuccess: false
    },
    {
      title: "The Key Neighborhood",
      description: "Since a ∉ A already, and ((a-ε, a+ε) \\ {a}) ∩ A = ∅, the entire interval (a-ε, a+ε) contains no points of A. This means (a-ε, a+ε) ⊆ Aᶜ!",
      showA: true,
      showComplement: true,
      showPointA: true,
      showNeighborhood: true,
      showAccumulationTest: false,
      highlightSuccess: false
    },
    {
      title: "Conclusion",
      description: "We showed that for arbitrary a ∈ Aᶜ, there exists ε > 0 with (a-ε, a+ε) ⊆ Aᶜ. This is exactly the definition of Aᶜ being open. Therefore A is closed. ∎",
      showA: true,
      showComplement: true,
      showPointA: true,
      showNeighborhood: true,
      showAccumulationTest: false,
      highlightSuccess: true
    }
  ];
  
  const current = steps[step];
  
  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Lemma 2.3.2 — Reverse Direction (⇐)
        </h1>
        <p className="viz-subtitle" style={{ fontStyle: 'italic' }}>
          If A contains all its accumulation points, then A is closed
        </p>
        
        {/* Main Visualization */}
        <div className="visualization-container" style={{ padding: '30px', marginBottom: '30px' }}>
          {/* Number Line Visualization */}
          <svg viewBox="0 0 700 220" style={{ width: '100%', height: 'auto' }}>
            {/* Background */}
            <defs>
              <linearGradient id="aGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9"/>
              </linearGradient>
              <linearGradient id="complementGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0.15"/>
              </linearGradient>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#059669" stopOpacity="0.25"/>
              </linearGradient>
              <filter id="glow2">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* The Real Line */}
            <line x1="50" y1="110" x2="650" y2="110" stroke="#4a5568" strokeWidth="2"/>
            <polygon points="645,105 655,110 645,115" fill="#4a5568"/>
            <text x="660" y="115" fill="#718096" fontSize="14" fontFamily="serif">ℝ</text>
            
            {/* Complement region */}
            {current.showComplement && (
              <>
                <rect x="50" y="80" width="130" height="60" 
                      fill={current.highlightSuccess ? "url(#successGradient)" : "url(#complementGradient2)"} 
                      style={{ transition: 'all 0.5s' }}/>
                <rect x="470" y="80" width="180" height="60" 
                      fill={current.highlightSuccess ? "url(#successGradient)" : "url(#complementGradient2)"}
                      style={{ transition: 'all 0.5s' }}/>
                <text x="100" y="65" fill={current.highlightSuccess ? "#6ee7b7" : "#fcd34d"} fontSize="12" fontFamily="serif" opacity="0.9">
                  Aᶜ
                </text>
                <text x="540" y="65" fill={current.highlightSuccess ? "#6ee7b7" : "#fcd34d"} fontSize="12" fontFamily="serif" opacity="0.9">
                  Aᶜ
                </text>
              </>
            )}
            
            {/* Set A */}
            {current.showA && (
              <g style={{ transition: 'all 0.5s' }}>
                <rect x="180" y="95" width="290" height="30" rx="4" fill="url(#aGradient2)"
                      style={{ filter: 'url(#glow2)' }}/>
                <text x="325" y="88" fill="#93c5fd" fontSize="14" fontFamily="serif" textAnchor="middle">
                  A (contains all its accumulation points)
                </text>
                {/* Endpoints */}
                <circle cx="180" cy="110" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2"/>
                <circle cx="470" cy="110" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2"/>
              </g>
            )}
            
            {/* The neighborhood showing success */}
            {current.showNeighborhood && (
              <g style={{ transition: 'all 0.5s' }}>
                <rect x="515" y="92" width="90" height="36" rx="18" 
                      fill={current.highlightSuccess ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.2)"} 
                      stroke={current.highlightSuccess ? "#10b981" : "#10b981"} 
                      strokeWidth="2"/>
                <text x="560" y="150" fill="#6ee7b7" fontSize="12" fontFamily="serif" textAnchor="middle">
                  (a-ε, a+ε) ⊆ Aᶜ
                </text>
                {/* Epsilon markers */}
                <line x1="515" y1="165" x2="560" y2="165" stroke="#6ee7b7" strokeWidth="1"/>
                <text x="537" y="178" fill="#6ee7b7" fontSize="11" fontFamily="serif" textAnchor="middle">ε</text>
                <line x1="560" y1="165" x2="605" y2="165" stroke="#6ee7b7" strokeWidth="1"/>
                <text x="582" y="178" fill="#6ee7b7" fontSize="11" fontFamily="serif" textAnchor="middle">ε</text>
                
                {current.highlightSuccess && (
                  <text x="560" y="200" fill="#6ee7b7" fontSize="13" fontFamily="serif" textAnchor="middle" fontWeight="600">
                    ✓ Entirely in Aᶜ — so Aᶜ is open!
                  </text>
                )}
              </g>
            )}
            
            {/* Accumulation point test visualization */}
            {current.showAccumulationTest && (
              <g style={{ transition: 'all 0.5s' }}>
                {/* Show the "missing" points near a */}
                <rect x="515" y="92" width="90" height="36" rx="18" 
                      fill="rgba(239,68,68,0.1)" 
                      stroke="#ef4444" 
                      strokeWidth="2" strokeDasharray="5,3"/>
                <text x="560" y="150" fill="#fca5a5" fontSize="11" fontFamily="serif" textAnchor="middle">
                  No points of A here
                </text>
                <text x="560" y="165" fill="#fca5a5" fontSize="11" fontFamily="serif" textAnchor="middle">
                  (except possibly a, but a ∉ A)
                </text>
                
                {/* X marks to show no A points */}
                <text x="530" y="115" fill="#ef4444" fontSize="14" fontFamily="serif" textAnchor="middle">∅</text>
                <text x="590" y="115" fill="#ef4444" fontSize="14" fontFamily="serif" textAnchor="middle">∅</text>
              </g>
            )}
            
            {/* Point a */}
            {current.showPointA && (
              <g style={{ transition: 'all 0.5s' }}>
                <circle cx="560" cy="110" r="8" 
                        fill="#f59e0b"
                        stroke="#fff" strokeWidth="2"
                        style={{ filter: 'url(#glow2)' }}/>
                <text x="560" y="50" fill="#fcd34d" fontSize="16" fontFamily="serif" textAnchor="middle" fontStyle="italic">
                  a
                </text>
                <text x="560" y="67" fill="#a0a0a0" fontSize="10" fontFamily="serif" textAnchor="middle">
                  (a ∈ Aᶜ, so a ∉ A)
                </text>
                <text x="560" y="80" fill="#a0a0a0" fontSize="10" fontFamily="serif" textAnchor="middle">
                  (not an accum. pt. of A)
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              background: step === steps.length - 1 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: step === steps.length - 1 ? '#666' : '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: step === steps.length - 1 ? 'none' : '0 4px 20px rgba(16,185,129,0.3)'
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
                background: i === step ? '#10b981' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: i === step ? 'scale(1.3)' : 'scale(1)'
              }}
            />
          ))}
        </div>
        
        {/* Logic Box */}
        <div style={{
          marginTop: '40px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
          borderRadius: '12px',
          padding: '20px 24px',
          border: '1px solid rgba(16,185,129,0.3)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#6ee7b7',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>🔗</span> The Logical Chain
          </h3>
          <div style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#d1d5db',
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <span style={{ color: '#6ee7b7' }}>1.</span> a ∈ Aᶜ → a ∉ A
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <span style={{ color: '#6ee7b7' }}>2.</span> A contains all accumulation points + a ∉ A → a is not an accumulation point
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <span style={{ color: '#6ee7b7' }}>3.</span> a not accumulation point → ∃ε: neighborhood misses A (except possibly at a)
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <span style={{ color: '#6ee7b7' }}>4.</span> a ∉ A + neighborhood misses A → entire neighborhood ⊆ Aᶜ
            </p>
            <p style={{ margin: '0' }}>
              <span style={{ color: '#6ee7b7' }}>5. </span> Every point of Aᶜ has such a neighborhood → Aᶜ is open → A is closed ∎
            </p>
          </div>
        </div>
        
        {/* Comparison Box */}
        <div style={{
          marginTop: '24px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          padding: '20px 24px',
          border: '1px solid rgba(255,255,255,0.1)'
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
            <span style={{ fontSize: '20px' }}>⚖️</span> Comparing Both Directions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            fontSize: '14px'
          }}>
            <div style={{
              padding: '12px',
              background: 'rgba(139,92,246,0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(139,92,246,0.2)'
            }}>
              <p style={{ color: '#c4b5fd', fontWeight: '600', margin: '0 0 8px 0' }}>(⇒) A closed → contains acc. pts.</p>
              <p style={{ color: '#a0a0a0', margin: 0, lineHeight: '1.5' }}>
                Proof by contradiction: if acc. pt. a ∉ A, then a ∈ Aᶜ (open), so some neighborhood misses A entirely — contradiction.
              </p>
            </div>
            <div style={{
              padding: '12px',
              background: 'rgba(16,185,129,0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16,185,129,0.2)'
            }}>
              <p style={{ color: '#6ee7b7', fontWeight: '600', margin: '0 0 8px 0' }}>(⇐) Contains acc. pts. → A closed</p>
              <p style={{ color: '#a0a0a0', margin: 0, lineHeight: '1.5' }}>
                Direct proof: show Aᶜ is open. Any a ∈ Aᶜ isn't an acc. pt., so some neighborhood misses A, hence lies in Aᶜ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LemmaReverseVisualization;