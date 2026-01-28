'use client';

import React, { useState } from 'react';

function Part1View() {
  const [r, setR] = useState(0.3);
  
  // Generate a Cauchy sequence converging to 1.5
  const limit = 1.5;
  const seq = [];
  for (let k = 1; k <= 25; k++) {
    const val = limit + 0.8 / k + 0.2 * Math.sin(k * 1.5) / k;
    seq.push(val);
  }
  
  // Find N where all terms after are within r of limit
  let N = 1;
  for (let k = 0; k < seq.length; k++) {
    if (Math.abs(seq[k] - limit) >= r) {
      N = k + 2;
    }
  }
  
  const scale = (val, min, max, pixelMin, pixelMax) => {
    return pixelMin + (val - min) / (max - min) * (pixelMax - pixelMin);
  };
  
  const yMin = 0.8;
  const yMax = 2.2;
  
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Part 1: Sequence Terms Stay Within r of the Limit
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      }}>
        For any rational r &gt; 0, we have x − r ≤ xₙ ≤ x + r eventually.
      </p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}>
          r = {r.toFixed(2)} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(adjust the band width)</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="0.8"
          step="0.05"
          value={r}
          onChange={(e) => setR(parseFloat(e.target.value))}
          style={{ width: '260px', accentColor: '#88c0d0' }}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <svg
          width="650"
          height="320"
          viewBox="0 0 650 320"
          style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}
        >
          {/* Grid lines */}
          {[1.0, 1.5, 2.0].map(y => (
            <g key={y}>
              <line 
                x1="60" 
                y1={scale(y, yMin, yMax, 280, 40)} 
                x2="620" 
                y2={scale(y, yMin, yMax, 280, 40)} 
                stroke="rgba(136, 192, 208, 0.15)" 
                strokeWidth="1" 
              />
              <text 
                x="45" 
                y={scale(y, yMin, yMax, 280, 40) + 4} 
                fill="rgba(136, 192, 208, 0.6)"
                fontSize="12"
                fontFamily="var(--font-mono)"
              >
                {y}
              </text>
            </g>
          ))}
          
          {/* The band [x-r, x+r] */}
          <rect 
            x="60" 
            y={scale(limit + r, yMin, yMax, 280, 40)} 
            width="560" 
            height={scale(limit - r, yMin, yMax, 280, 40) - scale(limit + r, yMin, yMax, 280, 40)}
            fill="rgba(79, 195, 247, 0.15)"
          />
          
          {/* Limit line x */}
          <line 
            x1="60" 
            y1={scale(limit, yMin, yMax, 280, 40)} 
            x2="620" 
            y2={scale(limit, yMin, yMax, 280, 40)} 
            stroke="#4fc3f7" 
            strokeWidth="2" 
          />
          <text 
            x="625" 
            y={scale(limit, yMin, yMax, 280, 40) + 4} 
            fill="#4fc3f7"
            fontSize="14"
            fontWeight="600"
            fontFamily="var(--font-mono)"
          >
            x
          </text>
          
          {/* Upper bound x + r */}
          <line 
            x1="60" 
            y1={scale(limit + r, yMin, yMax, 280, 40)} 
            x2="620" 
            y2={scale(limit + r, yMin, yMax, 280, 40)} 
            stroke="#b48ead" 
            strokeWidth="1.5" 
            strokeDasharray="4,2" 
          />
          <text 
            x="625" 
            y={scale(limit + r, yMin, yMax, 280, 40) + 4} 
            fill="#b48ead"
            fontSize="12"
            fontFamily="var(--font-mono)"
          >
            x+r
          </text>
          
          {/* Lower bound x - r */}
          <line 
            x1="60" 
            y1={scale(limit - r, yMin, yMax, 280, 40)} 
            x2="620" 
            y2={scale(limit - r, yMin, yMax, 280, 40)} 
            stroke="#b48ead" 
            strokeWidth="1.5" 
            strokeDasharray="4,2" 
          />
          <text 
            x="625" 
            y={scale(limit - r, yMin, yMax, 280, 40) + 4} 
            fill="#b48ead"
            fontSize="12"
            fontFamily="var(--font-mono)"
          >
            x−r
          </text>
          
          {/* N marker */}
          {N <= 25 && (
            <g>
              <line 
                x1={70 + (N-1) * 22} 
                y1="35" 
                x2={70 + (N-1) * 22} 
                y2="285" 
                stroke="#e94560" 
                strokeWidth="1.5" 
                strokeDasharray="3,3" 
              />
              <text 
                x={70 + (N-1) * 22} 
                y="300" 
                textAnchor="middle" 
                fill="#e94560"
                fontSize="12"
                fontWeight="600"
                fontFamily="var(--font-mono)"
              >
                N={N}
              </text>
            </g>
          )}
          
          {/* Sequence points */}
          {seq.map((val, i) => {
            const isInBand = Math.abs(val - limit) < r;
            const isAfterN = i + 1 >= N;
            return (
              <circle 
                key={i} 
                cx={70 + i * 22} 
                cy={scale(val, yMin, yMax, 280, 40)} 
                r="5" 
                fill={isAfterN && isInBand ? "#a3be8c" : "#ebcb8b"}
                opacity="0.9"
              />
            );
          })}
          
          {/* X-axis label */}
          <text 
            x="340" 
            y="315" 
            textAnchor="middle" 
            fill="rgba(136, 192, 208, 0.7)"
            fontSize="13"
            fontFamily="var(--font-primary)"
          >
            k (sequence index)
          </text>
          
          {/* Legend */}
          <g transform="translate(80, 20)">
            <circle cx="0" cy="0" r="5" fill="#ebcb8b" />
            <text x="10" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">Before N</text>
            <circle cx="100" cy="0" r="5" fill="#a3be8c" />
            <text x="110" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">After N (in band)</text>
            <rect x="220" y="-6" width="12" height="12" fill="rgba(79, 195, 247, 0.3)" rx="2" />
            <text x="237" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">[x−r, x+r]</text>
          </g>
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
          Key observation
        </h4>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          No matter how small you make r, there is always some N after which all sequence terms xₙ fall
          within the band [x−r, x+r]. This is exactly the visual meaning of "xₙ → x".
        </p>
      </div>
    </div>
  );
}

function Part2View() {
  const limit = 1.5;
  const seq = [];
  for (let k = 1; k <= 25; k++) {
    const val = limit + 0.6 / k + 0.15 * Math.sin(k * 1.5) / k;
    seq.push(val);
  }
  
  const [a, setA] = useState(1.2);
  
  // Find N where all terms after are >= a
  let N = 1;
  for (let k = 0; k < seq.length; k++) {
    if (seq[k] < a) {
      N = k + 2;
    }
  }
  
  const scale = (val, min, max, pixelMin, pixelMax) => {
    return pixelMin + (val - min) / (max - min) * (pixelMax - pixelMin);
  };
  
  const yMin = 0.8;
  const yMax = 2.4;
  
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Part 2: Inequalities Pass to Limits
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      }}>
        If a ≤ xₖ eventually, then a ≤ x. The bound on sequence terms becomes a bound on the limit.
      </p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}>
          a = {a.toFixed(2)} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(the lower bound)</span>
        </label>
        <input
          type="range"
          min="0.9"
          max="1.5"
          step="0.05"
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          style={{ width: '260px', accentColor: '#e94560' }}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <svg
          width="650"
          height="320"
          viewBox="0 0 650 320"
          style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}
        >
          {/* Grid lines */}
          {[1.0, 1.5, 2.0].map(y => (
            <g key={y}>
              <line 
                x1="60" 
                y1={scale(y, yMin, yMax, 280, 40)} 
                x2="620" 
                y2={scale(y, yMin, yMax, 280, 40)} 
                stroke="rgba(136, 192, 208, 0.15)" 
                strokeWidth="1" 
              />
              <text 
                x="45" 
                y={scale(y, yMin, yMax, 280, 40) + 4} 
                fill="rgba(136, 192, 208, 0.6)"
                fontSize="12"
                fontFamily="var(--font-mono)"
              >
                {y}
              </text>
            </g>
          ))}
          
          {/* Shaded region below a */}
          <rect 
            x="60" 
            y={scale(a, yMin, yMax, 280, 40)} 
            width="560" 
            height={280 - scale(a, yMin, yMax, 280, 40)}
            fill="rgba(233, 69, 96, 0.12)"
          />
          
          {/* Limit line x */}
          <line 
            x1="60" 
            y1={scale(limit, yMin, yMax, 280, 40)} 
            x2="620" 
            y2={scale(limit, yMin, yMax, 280, 40)} 
            stroke="#4fc3f7" 
            strokeWidth="2" 
          />
          <text 
            x="625" 
            y={scale(limit, yMin, yMax, 280, 40) + 4} 
            fill="#4fc3f7"
            fontSize="14"
            fontWeight="600"
            fontFamily="var(--font-mono)"
          >
            x
          </text>
          
          {/* Lower bound a */}
          <line 
            x1="60" 
            y1={scale(a, yMin, yMax, 280, 40)} 
            x2="620" 
            y2={scale(a, yMin, yMax, 280, 40)} 
            stroke="#e94560" 
            strokeWidth="2" 
          />
          <text 
            x="625" 
            y={scale(a, yMin, yMax, 280, 40) + 4} 
            fill="#e94560"
            fontSize="14"
            fontWeight="600"
            fontFamily="var(--font-mono)"
          >
            a
          </text>
          
          {/* N marker */}
          {N <= 25 && N > 1 && (
            <g>
              <line 
                x1={70 + (N-1) * 22} 
                y1="35" 
                x2={70 + (N-1) * 22} 
                y2="285" 
                stroke="#b48ead" 
                strokeWidth="1.5" 
                strokeDasharray="3,3" 
              />
              <text 
                x={70 + (N-1) * 22} 
                y="300" 
                textAnchor="middle" 
                fill="#b48ead"
                fontSize="12"
                fontWeight="600"
                fontFamily="var(--font-mono)"
              >
                N={N}
              </text>
            </g>
          )}
          
          {/* Sequence points */}
          {seq.map((val, i) => {
            const isAboveA = val >= a;
            const isAfterN = N <= 25 ? i + 1 >= N : true;
            return (
              <circle 
                key={i} 
                cx={70 + i * 22} 
                cy={scale(val, yMin, yMax, 280, 40)} 
                r="5" 
                fill={isAfterN && isAboveA ? "#a3be8c" : "#ebcb8b"}
                opacity="0.9"
              />
            );
          })}
          
          {/* X-axis label */}
          <text 
            x="340" 
            y="315" 
            textAnchor="middle" 
            fill="rgba(136, 192, 208, 0.7)"
            fontSize="13"
            fontFamily="var(--font-primary)"
          >
            k (sequence index)
          </text>
          
          {/* Status indicator */}
          <g transform="translate(400, 20)">
            <rect x="-5" y="-14" width="180" height="24" fill="rgba(13, 17, 23, 0.8)" rx="6" stroke="rgba(136, 192, 208, 0.2)" />
            {a <= limit ? (
              <text x="5" y="4" fill="#a3be8c" fontSize="12" fontWeight="600" fontFamily="'JetBrains Mono', monospace">✓ a ≤ x (as expected!)</text>
            ) : (
              <text x="5" y="4" fill="#e94560" fontSize="12" fontWeight="600" fontFamily="'JetBrains Mono', monospace">a &gt; x (not eventually ≤)</text>
            )}
          </g>
        </svg>
      </div>
      
      <div className="proof-box" style={{
        marginTop: '1.25rem',
        background: 'rgba(235, 203, 139, 0.08)',
        border: '1px solid rgba(235, 203, 139, 0.3)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#ebcb8b',
        }}>
          Key insight
        </h4>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          If a ≤ xₖ for all k ≥ N, then the limit x cannot be less than a. Otherwise, by Part 1 the
          terms xₖ would eventually lie inside a small band around x that sits entirely below a,
          contradicting a ≤ xₖ eventually.
        </p>
      </div>
    </div>
  );
}

function ProofSketchView() {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Proof Sketch: Why Part 1 Implies Part 2
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
          }}>
            The Setup
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Suppose a ≤ xₖ eventually, but (for contradiction) a &gt; x.
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <svg
            width="600"
            height="200"
            viewBox="0 0 600 200"
            style={{
              background: 'rgba(13, 17, 23, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(136, 192, 208, 0.2)',
              maxWidth: '100%',
              height: 'auto',
            }}
          >
            {/* Number line */}
            <line x1="50" y1="100" x2="550" y2="100" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
            
            {/* x point */}
            <circle cx="200" cy="100" r="8" fill="#4fc3f7" />
            <text x="200" y="82" textAnchor="middle" fill="#4fc3f7" fontSize="14" fontWeight="600" fontFamily="'JetBrains Mono', monospace">x</text>
            
            {/* a point */}
            <circle cx="350" cy="100" r="8" fill="#e94560" />
            <text x="350" y="82" textAnchor="middle" fill="#e94560" fontSize="14" fontWeight="600" fontFamily="'JetBrains Mono', monospace">a</text>
            
            {/* r = (a-x)/2 bracket */}
            <line x1="200" y1="130" x2="275" y2="130" stroke="#b48ead" strokeWidth="2" />
            <line x1="200" y1="125" x2="200" y2="135" stroke="#b48ead" strokeWidth="2" />
            <line x1="275" y1="125" x2="275" y2="135" stroke="#b48ead" strokeWidth="2" />
            <text x="237" y="150" textAnchor="middle" fill="#b48ead" fontSize="11" fontFamily="'JetBrains Mono', monospace">r = (a−x)/2</text>
            
            {/* x + r point */}
            <circle cx="275" cy="100" r="6" fill="#b48ead" opacity="0.7" />
            <text x="275" y="82" textAnchor="middle" fill="#b48ead" fontSize="11" fontFamily="'JetBrains Mono', monospace">x+r</text>
            
            {/* Band indicator */}
            <rect x="125" y="95" width="150" height="10" fill="rgba(79, 195, 247, 0.2)" rx="2" />
            
            {/* xₖ eventually in band */}
            <circle cx="160" cy="100" r="5" fill="#a3be8c" />
            <circle cx="180" cy="100" r="5" fill="#a3be8c" />
            <circle cx="240" cy="100" r="5" fill="#a3be8c" />
            <circle cx="260" cy="100" r="5" fill="#a3be8c" />
            <text x="210" y="175" textAnchor="middle" fill="#a3be8c" fontSize="11" fontFamily="var(--font-primary)">xₖ eventually here (by Part 1)</text>
          </svg>
        </div>
        
        <div style={{
          background: 'rgba(233, 69, 96, 0.08)',
          border: '1px solid rgba(233, 69, 96, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#e94560',
          }}>
            The Contradiction
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Let r = (a − x)/2 &gt; 0. By Part 1, eventually xₖ ≤ x + r = x + (a−x)/2 = (x+a)/2 &lt; a.
          </p>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            But we assumed a ≤ xₖ eventually. This is a contradiction!
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
          }}>
            Conclusion
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}>
            Therefore our assumption was wrong, and we must have a ≤ x. ∎
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Lemma133Visualization() {
  const [view, setView] = useState('part1');

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Lemma 1.3.3: Sequences and Their Limits
        </h1>
        
        <p className="viz-subtitle">
          Understanding how sequence properties relate to limits
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => setView('part1')}
            className={`btn ${view === 'part1' ? 'active' : 'secondary'}`}
          >
            Part 1: Band Property
          </button>
          <button
            onClick={() => setView('part2')}
            className={`btn ${view === 'part2' ? 'active' : 'secondary'}`}
          >
            Part 2: Bounds Pass to Limits
          </button>
          <button
            onClick={() => setView('proofSketch')}
            className={`btn ${view === 'proofSketch' ? 'active' : 'secondary'}`}
          >
            Proof Sketch
          </button>
        </div>
        
        <div className="visualization-container">
          {view === 'part1' && <Part1View />}
          {view === 'part2' && <Part2View />}
          {view === 'proofSketch' && <ProofSketchView />}
        </div>
      </div>
    </div>
  );
}