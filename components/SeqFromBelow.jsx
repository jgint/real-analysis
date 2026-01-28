'use client';

import React, { useState } from 'react';

function Part1View() {
  const [a, setA] = useState(2.7);
  
  const m = Math.ceil(a) - 1;
  
  const scale = (val, min, max, pixelMin, pixelMax) => {
    return pixelMin + (val - min) / (max - min) * (pixelMax - pixelMin);
  };
  
  const xMin = -1;
  const xMax = 6;
  
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Part 1: Existence of the Ceiling
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      }}>
        For any real a, there exists m ∈ ℤ such that m &lt; a ≤ m + 1.
      </p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}>
          a = {a.toFixed(2)}
        </label>
        <input
          type="range"
          min="-0.5"
          max="5.5"
          step="0.1"
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          style={{ width: '260px', accentColor: '#88c0d0' }}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <svg
          width="650"
          height="200"
          viewBox="0 0 650 200"
          style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}
        >
        {/* Number line */}
        <line x1="50" y1="100" x2="600" y2="100" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
        
        {/* Integer tick marks */}
        {[0, 1, 2, 3, 4, 5].map(n => (
          <g key={n}>
            <line 
              x1={scale(n, xMin, xMax, 50, 600)} 
              y1="90" 
              x2={scale(n, xMin, xMax, 50, 600)} 
              y2="110" 
              stroke="rgba(136, 192, 208, 0.4)" 
              strokeWidth="2" 
            />
            <text 
              x={scale(n, xMin, xMax, 50, 600)} 
              y="130" 
              textAnchor="middle" 
              fill="rgba(136, 192, 208, 0.7)"
              fontSize="13"
              fontFamily="var(--font-mono)"
            >
              {n}
            </text>
          </g>
        ))}
        
        {/* Highlight interval (m, m+1] */}
        <line 
          x1={scale(m, xMin, xMax, 50, 600)} 
          y1="100" 
          x2={scale(m + 1, xMin, xMax, 50, 600)} 
          y2="100" 
          stroke="#4fc3f7" 
          strokeWidth="6" 
          opacity="0.5"
        />
        
        {/* Open circle at m */}
        <circle 
          cx={scale(m, xMin, xMax, 50, 600)} 
          cy="100" 
          r="8" 
          fill="rgba(13, 17, 23, 0.8)" 
          stroke="#4fc3f7" 
          strokeWidth="2" 
        />
        <text 
          x={scale(m, xMin, xMax, 50, 600)} 
          y="155" 
          textAnchor="middle" 
          fill="#4fc3f7"
          fontSize="13"
          fontWeight="600"
          fontFamily="var(--font-mono)"
        >
          m = {m}
        </text>
        
        {/* Closed circle at m+1 */}
        <circle 
          cx={scale(m + 1, xMin, xMax, 50, 600)} 
          cy="100" 
          r="8" 
          fill="#4fc3f7" 
        />
        <text 
          x={scale(m + 1, xMin, xMax, 50, 600)} 
          y="155" 
          textAnchor="middle" 
          fill="#4fc3f7"
          fontSize="13"
          fontWeight="600"
          fontFamily="var(--font-mono)"
        >
          m+1 = {m + 1}
        </text>
        
        {/* Point a */}
        <circle 
          cx={scale(a, xMin, xMax, 50, 600)} 
          cy="100" 
          r="6" 
          fill="#e94560" 
        />
        <line 
          x1={scale(a, xMin, xMax, 50, 600)} 
          y1="70" 
          x2={scale(a, xMin, xMax, 50, 600)} 
          y2="95" 
          stroke="#e94560" 
          strokeWidth="2" 
        />
        <text 
          x={scale(a, xMin, xMax, 50, 600)} 
          y="60" 
          textAnchor="middle" 
          fill="#e94560"
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--font-mono)"
        >
          a = {a.toFixed(2)}
        </text>
        
        {/* Interval notation */}
        <text x="325" y="180" textAnchor="middle" fill="rgba(255, 255, 255, 0.8)" fontSize="13" fontFamily="var(--font-primary)">
          a ∈ ({m}, {m + 1}] means {m} &lt; a ≤ {m + 1}
        </text>
        </svg>
      </div>
      
      <div className="proof-box" style={{
        marginTop: '1.25rem',
        background: 'rgba(79, 195, 247, 0.08)',
        border: '1px solid rgba(79, 195, 247, 0.3)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#4fc3f7',
        }}>
          Key insight
        </h4>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          The integers partition ℝ into intervals (m, m+1]. 
          Every real number falls into exactly one such interval. The integer m is ⌈a⌉ - 1 (one less than the ceiling).
        </p>
      </div>
    </div>
  );
}

function Part1ProofView() {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Part 1: Proof Sketch
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          background: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#ebcb8b',
            fontSize: '0.95rem',
          }}>
            Step 1: Find integers above and below a
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            By the <strong>Archimedean property</strong>, there exist integers N₁ and N₂ such that N₁ &gt; a and -N₂ &lt; a.
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            opacity: 0.8,
          }}>
            This means -N₂ &lt; a &lt; N₁, so a is "sandwiched" between integers.
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="600" height="120" viewBox="0 0 600 120" style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}>
          <line x1="50" y1="60" x2="550" y2="60" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
          
          {/* -N₂ */}
          <circle cx="120" cy="60" r="6" fill="#b48ead" />
          <text x="120" y="45" textAnchor="middle" fill="#b48ead" fontSize="12" fontFamily="var(--font-mono)">-N₂</text>
          
          {/* a */}
          <circle cx="300" cy="60" r="6" fill="#e94560" />
          <text x="300" y="45" textAnchor="middle" fill="#e94560" fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">a</text>
          
          {/* N₁ */}
          <circle cx="480" cy="60" r="6" fill="#b48ead" />
          <text x="480" y="45" textAnchor="middle" fill="#b48ead" fontSize="12" fontFamily="var(--font-mono)">N₁</text>
          
          {/* Arrows */}
          <text x="210" y="85" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="11" fontFamily="var(--font-primary)">integers exist here</text>
          <text x="390" y="85" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="11" fontFamily="var(--font-primary)">integers exist here</text>
        </svg>
        </div>
        
        <div style={{
          background: 'rgba(163, 190, 140, 0.08)',
          border: '1px solid rgba(163, 190, 140, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#a3be8c',
            fontSize: '0.95rem',
          }}>
            Step 2: Define the candidate set S
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Let S = {"{"} n ∈ ℤ : n ≥ a {"}"} = {"{"} integers that are ≥ a {"}"}.
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            opacity: 0.8,
          }}>
            S is <strong>nonempty</strong> (contains N₁) and <strong>bounded below</strong> (by -N₂).
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="600" height="120" viewBox="0 0 600 120" style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}>
            <line x1="50" y1="60" x2="550" y2="60" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
            
            {/* Points not in S */}
            {[-2, -1, 0, 1, 2].map(n => (
              <g key={n}>
                <circle cx={150 + n * 40} cy="60" r="5" fill="rgba(136, 192, 208, 0.3)" />
                <text x={150 + n * 40} y="90" textAnchor="middle" fill="rgba(136, 192, 208, 0.6)" fontSize="11" fontFamily="var(--font-mono)">{n}</text>
              </g>
            ))}
            
            {/* a marker */}
            <line x1="280" y1="40" x2="280" y2="80" stroke="#e94560" strokeWidth="2" strokeDasharray="3,3" />
            <text x="280" y="30" textAnchor="middle" fill="#e94560" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">a ≈ 2.7</text>
            
            {/* Points in S */}
            {[3, 4, 5, 6, 7].map(n => (
              <g key={n}>
                <circle cx={150 + n * 40} cy="60" r="5" fill="#a3be8c" />
                <text x={150 + n * 40} y="90" textAnchor="middle" fill="#a3be8c" fontSize="11" fontFamily="var(--font-mono)">{n}</text>
              </g>
            ))}
            
            {/* S label */}
            <text x="470" y="30" fill="#a3be8c" fontSize="13" fontFamily="var(--font-mono)">S = {"{"}3, 4, 5, ...{"}"}</text>
          </svg>
        </div>
        
        <div style={{
          background: 'rgba(79, 195, 247, 0.08)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#4fc3f7',
            fontSize: '0.95rem',
          }}>
            Step 3: S has a minimum element
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Since S ⊂ ℤ is nonempty and bounded below, S has a <strong>minimum element</strong>. Call it m + 1.
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            opacity: 0.8,
          }}>
            (This uses the well-ordering principle for integers, or can be derived from the least upper bound property.)
          </p>
        </div>
        
        <div style={{
          background: 'rgba(180, 142, 173, 0.08)',
          border: '1px solid rgba(180, 142, 173, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#b48ead',
            fontSize: '0.95rem',
          }}>
            Step 4: Verify m &lt; a ≤ m + 1
          </h4>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            <strong>Why m + 1 ≥ a?</strong> Because m + 1 ∈ S, and S = {"{"} n ∈ ℤ : n ≥ a {"}"}.
          </p>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            <strong>Why m &lt; a?</strong> Because m + 1 is the <em>minimum</em> of S, so m ∉ S, meaning m &lt; a.
          </p>
        </div>
        
        <div style={{
          background: 'rgba(136, 192, 208, 0.08)',
          border: '1px solid rgba(136, 192, 208, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            <strong>Conclusion:</strong> m &lt; a ≤ m + 1, so m + 1 = ⌈a⌉. ∎
          </p>
        </div>
      </div>
    </div>
  );
}

function Part2View() {
  const [x, setX] = useState(1.5);
  
  // Generate sequence approaching x from below
  const seq = [];
  for (let k = 1; k <= 20; k++) {
    // Using the construction: take m_k such that m_k < kx ≤ m_k + 1, then x_k = m_k / k
    const kx = k * x;
    const m_k = Math.ceil(kx) - 1;
    const x_k = m_k / k;
    seq.push(x_k);
  }
  
  const scale = (val, min, max, pixelMin, pixelMax) => {
    return pixelMin + (val - min) / (max - min) * (pixelMax - pixelMin);
  };
  
  const yMin = x - 0.8;
  const yMax = x + 0.3;
  
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Part 2: Sequence Approaching From Below
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      }}>
        For any real x, there exists a Cauchy sequence (xₖ) with xₖ &lt; x for all k, and [xₖ] = x.
      </p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}>
          x = {x.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={x}
          onChange={(e) => setX(parseFloat(e.target.value))}
          style={{ width: '260px', accentColor: '#e94560' }}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <svg
          width="650"
          height="300"
          viewBox="0 0 650 300"
          style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}
        >
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => {
          const y = yMin + i * (yMax - yMin) / 3;
          return (
            <g key={i}>
              <line x1="60" y1={scale(y, yMin, yMax, 260, 40)} x2="620" y2={scale(y, yMin, yMax, 260, 40)} stroke="rgba(136, 192, 208, 0.15)" strokeWidth="1" />
              <text x="45" y={scale(y, yMin, yMax, 260, 40) + 4} fill="rgba(136, 192, 208, 0.6)" fontSize="12" fontFamily="var(--font-mono)">{y.toFixed(2)}</text>
            </g>
          );
        })}
        
        {/* Limit line x */}
        <line x1="60" y1={scale(x, yMin, yMax, 260, 40)} x2="620" y2={scale(x, yMin, yMax, 260, 40)} stroke="#e94560" strokeWidth="2" />
        <text x="625" y={scale(x, yMin, yMax, 260, 40) + 4} fill="#e94560" fontSize="14" fontWeight="600" fontFamily="var(--font-mono)">x</text>
        
        {/* Shaded region above x (forbidden) */}
        <rect 
          x="60" 
          y="40" 
          width="560" 
          height={scale(x, yMin, yMax, 260, 40) - 40}
          fill="rgba(233, 69, 96, 0.12)"
        />
        <text x="400" y="60" fill="rgba(233, 69, 96, 0.7)" fontSize="11" fontFamily="var(--font-primary)">xₖ never enters this region</text>
        
        {/* Sequence points */}
        {seq.map((val, i) => (
          <g key={i}>
            <circle 
              cx={70 + i * 28} 
              cy={scale(val, yMin, yMax, 260, 40)} 
              r="5" 
              fill="#a3be8c"
              opacity="0.9"
            />
            {i < 5 && (
              <text 
                x={70 + i * 28} 
                y={scale(val, yMin, yMax, 260, 40) + 18} 
                textAnchor="middle" 
                fill="#a3be8c"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {val.toFixed(2)}
              </text>
            )}
          </g>
        ))}
        
        {/* X-axis label */}
        <text x="340" y="290" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="13" fontFamily="var(--font-primary)">k (sequence index)</text>
        
        {/* Legend */}
        <g transform="translate(80, 25)">
          <circle cx="0" cy="0" r="5" fill="#a3be8c" />
          <text x="10" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">xₖ = mₖ/k where mₖ &lt; kx ≤ mₖ + 1</text>
        </g>
        </svg>
      </div>
      
      <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="proof-box" style={{
          background: 'rgba(163, 190, 140, 0.08)',
          border: '1px solid rgba(163, 190, 140, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#a3be8c',
          }}>
            Why xₖ &lt; x?
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            From mₖ &lt; kx, we get mₖ/k &lt; x, so xₖ &lt; x.
          </p>
        </div>
        <div className="proof-box" style={{
          background: 'rgba(79, 195, 247, 0.08)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#4fc3f7',
          }}>
            Why xₖ → x?
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            From kx ≤ mₖ + 1, we get x - 1/k ≤ mₖ/k = xₖ, so x - 1/k ≤ xₖ &lt; x.
          </p>
        </div>
      </div>
    </div>
  );
}

function Part2ProofView() {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Part 2: Proof Sketch
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          background: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#ebcb8b',
            fontSize: '0.95rem',
          }}>
            Step 1: Construct the sequence
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            For each k ∈ ℕ⁺, apply Part 1 to the real number kx:
          </p>
          <p style={{
            margin: '0.5rem 0',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0.5rem',
            borderRadius: '6px',
            color: 'var(--text-primary)',
          }}>
            Find mₖ ∈ ℤ such that mₖ &lt; kx ≤ mₖ + 1
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Define xₖ = mₖ / k ∈ ℚ.
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="600" height="140" viewBox="0 0 600 140" style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}>
            <line x1="50" y1="70" x2="550" y2="70" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
            
            {/* mₖ */}
            <circle cx="150" cy="70" r="6" fill="rgba(13, 17, 23, 0.8)" stroke="#4fc3f7" strokeWidth="2" />
            <text x="150" y="55" textAnchor="middle" fill="#4fc3f7" fontSize="13" fontFamily="var(--font-mono)">mₖ</text>
            
            {/* kx */}
            <circle cx="320" cy="70" r="6" fill="#e94560" />
            <text x="320" y="55" textAnchor="middle" fill="#e94560" fontSize="13" fontWeight="700" fontFamily="var(--font-mono)">kx</text>
            
            {/* mₖ + 1 */}
            <circle cx="450" cy="70" r="6" fill="#4fc3f7" />
            <text x="450" y="55" textAnchor="middle" fill="#4fc3f7" fontSize="13" fontFamily="var(--font-mono)">mₖ + 1</text>
            
            {/* Interval highlight */}
            <line x1="150" y1="70" x2="450" y2="70" stroke="#4fc3f7" strokeWidth="4" opacity="0.3" />
            
            {/* Inequality labels */}
            <text x="235" y="100" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="11" fontFamily="var(--font-mono)">mₖ &lt; kx</text>
            <text x="385" y="100" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="11" fontFamily="var(--font-mono)">kx ≤ mₖ + 1</text>
            
            {/* xₖ calculation */}
            <text x="300" y="125" textAnchor="middle" fill="#a3be8c" fontSize="13" fontFamily="var(--font-mono)">xₖ = mₖ/k</text>
          </svg>
        </div>
        
        <div style={{
          background: 'rgba(163, 190, 140, 0.08)',
          border: '1px solid rgba(163, 190, 140, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#a3be8c',
            fontSize: '0.95rem',
          }}>
            Step 2: Show xₖ &lt; x for all k
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            From the left inequality mₖ &lt; kx:
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0.5rem',
            borderRadius: '6px',
            color: 'var(--text-primary)',
          }}>
            mₖ &lt; kx → mₖ/k &lt; x → xₖ &lt; x ✓
          </p>
        </div>
        
        <div style={{
          background: 'rgba(79, 195, 247, 0.08)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#4fc3f7',
            fontSize: '0.95rem',
          }}>
            Step 3: Show xₖ is close to x
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            From the right inequality kx ≤ mₖ + 1:
          </p>
          <p style={{
            margin: '0.5rem 0',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0.5rem',
            borderRadius: '6px',
            color: 'var(--text-primary)',
          }}>
            kx ≤ mₖ + 1 → x ≤ (mₖ + 1)/k = mₖ/k + 1/k = xₖ + 1/k
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Rearranging: <strong>x - 1/k ≤ xₖ</strong>
          </p>
        </div>
        
        <div style={{
          background: 'rgba(180, 142, 173, 0.08)',
          border: '1px solid rgba(180, 142, 173, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#b48ead',
            fontSize: '0.95rem',
          }}>
            Step 4: Combine the bounds
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            From Steps 2 and 3, we have:
          </p>
          <p style={{
            margin: '0.5rem 0',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0.5rem',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            textAlign: 'center',
          }}>
            x - 1/k ≤ xₖ &lt; x
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            This means |xₖ - x| &lt; 1/k → 0 as k → ∞.
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="600" height="100" viewBox="0 0 600 100" style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}>
            <line x1="100" y1="50" x2="500" y2="50" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
            
            {/* x - 1/k */}
            <circle cx="180" cy="50" r="5" fill="#b48ead" />
            <text x="180" y="35" textAnchor="middle" fill="#b48ead" fontSize="11" fontFamily="var(--font-mono)">x - 1/k</text>
            
            {/* xₖ somewhere in between */}
            <circle cx="280" cy="50" r="6" fill="#a3be8c" />
            <text x="280" y="75" textAnchor="middle" fill="#a3be8c" fontSize="11" fontFamily="var(--font-primary)">xₖ lives here</text>
            
            {/* x */}
            <circle cx="380" cy="50" r="5" fill="#e94560" />
            <text x="380" y="35" textAnchor="middle" fill="#e94560" fontSize="11" fontFamily="var(--font-mono)">x</text>
            
            {/* Bracket */}
            <line x1="180" y1="55" x2="380" y2="55" stroke="rgba(136, 192, 208, 0.5)" strokeWidth="1" />
            <text x="280" y="95" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="11" fontFamily="var(--font-mono)">width ≤ 1/k → 0</text>
          </svg>
        </div>
        
        <div style={{
          background: 'rgba(136, 192, 208, 0.08)',
          border: '1px solid rgba(136, 192, 208, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#88c0d0',
            fontSize: '0.95rem',
          }}>
            Step 5: Verify it's Cauchy
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            For n, m ≥ N where 1/N &lt; ε/2:
          </p>
          <p style={{
            margin: '0.5rem 0',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0.5rem',
            borderRadius: '6px',
            color: 'var(--text-primary)',
          }}>
            |xₙ - xₘ| ≤ |xₙ - x| + |x - xₘ| &lt; 1/n + 1/m ≤ 2/N &lt; ε
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            So (xₖ) is Cauchy, and since |xₖ - x| → 0, we have [xₖ] = x.
          </p>
        </div>
        
        <div style={{
          background: 'rgba(136, 192, 208, 0.08)',
          border: '1px solid rgba(136, 192, 208, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            <strong>Conclusion:</strong> (xₖ) is a Cauchy sequence of rationals with xₖ &lt; x for all k, and [xₖ] = x. ∎
          </p>
        </div>
      </div>
    </div>
  );
}

function WhyItMattersView() {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Why This Exercise Matters
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          background: 'rgba(79, 195, 247, 0.08)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#4fc3f7',
            fontSize: '0.95rem',
          }}>
            🔧 Flexibility in Representatives
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            A real number x = [xₖ] can be represented by many different Cauchy sequences. 
            This exercise shows we can always choose one that approaches strictly from below 
            (or by symmetry, strictly from above).
          </p>
        </div>
        
        <div style={{
          background: 'rgba(163, 190, 140, 0.08)',
          border: '1px solid rgba(163, 190, 140, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#a3be8c',
            fontSize: '0.95rem',
          }}>
            📐 Used in Theorem 1.3.5 (LUB Property)
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            In the proof of the least upper bound property, we construct a sequence of upper bounds 
            that decreases toward the supremum. Having sequences approach from one side is crucial 
            for such constructions.
          </p>
        </div>
        
        <div style={{
          background: 'rgba(180, 142, 173, 0.08)',
          border: '1px solid rgba(180, 142, 173, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#b48ead',
            fontSize: '0.95rem',
          }}>
            🎯 Strict vs Non-Strict Inequalities
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Notice the subtle difference:
          </p>
          <ul style={{
            margin: '0.5rem 0 0 1.5rem',
            padding: 0,
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            listStyleType: 'disc',
          }}>
            <li>xₖ &lt; x for all k (strict inequality for each term)</li>
            <li>But [xₖ] = x, not [xₖ] &lt; x (equality at the limit)</li>
          </ul>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            This illustrates how strict inequalities can become non-strict when passing to limits.
          </p>
        </div>
        
        <div style={{
          background: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#ebcb8b',
            fontSize: '0.95rem',
          }}>
            🔄 Alternative Constructions
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Other ways to build sequences approaching from below:
          </p>
          <ul style={{
            margin: '0.5rem 0 0 1.5rem',
            padding: 0,
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            listStyleType: 'disc',
          }}>
            <li>Truncated decimal expansions: 1.4, 1.41, 1.414, ... → √2</li>
            <li>xₖ = x - 1/k (if x is already known)</li>
            <li>Dyadic rationals: ⌊2ᵏx⌋/2ᵏ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Exercise17Visualization() {
  const [view, setView] = useState('part1');

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Exercise 1.7: Ceiling Function and Sequences From Below
        </h1>
        
        <p className="viz-subtitle">
          Constructing sequences that approach real numbers from below
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => setView('part1')}
            className={`btn ${view === 'part1' ? 'active' : 'secondary'}`}
          >
            Part 1: Visualization
          </button>
          <button
            onClick={() => setView('part1proof')}
            className={`btn ${view === 'part1proof' ? 'active' : 'secondary'}`}
          >
            Part 1: Proof
          </button>
          <button
            onClick={() => setView('part2')}
            className={`btn ${view === 'part2' ? 'active' : 'secondary'}`}
          >
            Part 2: Visualization
          </button>
          <button
            onClick={() => setView('part2proof')}
            className={`btn ${view === 'part2proof' ? 'active' : 'secondary'}`}
          >
            Part 2: Proof
          </button>
          <button
            onClick={() => setView('why')}
            className={`btn ${view === 'why' ? 'active' : 'secondary'}`}
          >
            Why It Matters
          </button>
        </div>
        
        <div className="visualization-container">
        {view === 'part1' && <Part1View />}
        {view === 'part1proof' && <Part1ProofView />}
        {view === 'part2' && <Part2View />}
        {view === 'part2proof' && <Part2ProofView />}
        {view === 'why' && <WhyItMattersView />}
        </div>
      </div>
    </div>
  );
}