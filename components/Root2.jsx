'use client';

import React, { useState } from 'react';

export default function Sqrt2Visualization() {
  const [q, setQ] = useState(4);
  const sqrt2 = Math.sqrt(2);
  
  // Generate grid points k/q from 0 to 2
  const gridPoints = [];
  for (let k = 0; k <= 2 * q; k++) {
    gridPoints.push(k / q);
  }
  
  // Find x = max{k/q : (k/q)^2 < 2}
  let x = 0;
  for (let k = 0; k <= 2 * q; k++) {
    if ((k / q) ** 2 < 2) {
      x = k / q;
    }
  }
  
  const epsilon = 1 / q; // minimum epsilon for this grid
  const xPlusEps = x + epsilon;
  
  // Scale for visualization (0 to 2 maps to 50 to 550)
  const scale = (val) => 50 + val * 250;
  
  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Trapping √2 Between Rationals
        </h1>
        
        <p className="viz-subtitle">
          Finding rational approximations to irrational numbers
        </p>
        
        <div className="proof-box" style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            color: 'var(--color-primary)',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}>
            Grid denominator q = {q} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(grid spacing = 1/{q})</span>
          </label>
          <input
            type="range"
            min="2"
            max="20"
            value={q}
            onChange={(e) => setQ(parseInt(e.target.value))}
            style={{
              width: '100%',
              maxWidth: '400px',
              cursor: 'pointer',
              accentColor: 'var(--color-primary)',
            }}
          />
        </div>
      
      <div className="visualization-container" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <svg
          width="600"
          height="280"
          viewBox="0 0 600 280"
          style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}
        >
        {/* Number line */}
        <line x1="40" y1="120" x2="560" y2="120" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
        
        {/* Tick marks and labels for 0, 1, 2 */}
        {[0, 1, 2].map(val => (
          <g key={val}>
            <line x1={scale(val)} y1="115" x2={scale(val)} y2="125" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
            <text x={scale(val)} y="145" textAnchor="middle" fill="var(--color-primary)" fontSize="14" fontFamily="var(--font-mono)">{val}</text>
          </g>
        ))}
        
        {/* Grid points */}
        {gridPoints.map((pt, i) => {
          const isX = Math.abs(pt - x) < 0.0001;
          const isXPlusEps = Math.abs(pt - xPlusEps) < 0.0001;
          const sqLessThan2 = pt * pt < 2;
          
          return (
            <g key={i}>
              <circle
                cx={scale(pt)}
                cy="120"
                r={isX || isXPlusEps ? 6 : 4}
                fill={isX ? "#a3be8c" : isXPlusEps ? "#bf616a" : sqLessThan2 ? "#88c0d0" : "rgba(255,255,255,0.3)"}
              />
              {(isX || isXPlusEps) && (
                <text
                  x={scale(pt)}
                  y={isX ? "100" : "160"}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                  fill={isX ? "#a3be8c" : "#e94560"}
                >
                  {isX ? `x = ${x.toFixed(3)}` : `x+ε = ${xPlusEps.toFixed(3)}`}
                </text>
              )}
            </g>
          );
        })}
        
        {/* sqrt(2) marker */}
        <line x1={scale(sqrt2)} y1="90" x2={scale(sqrt2)} y2="150" stroke="#b48ead" strokeWidth="2" strokeDasharray="4" />
        <text x={scale(sqrt2)} y="80" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" fill="#b48ead">√2 ≈ 1.414</text>
        
        {/* Legend */}
        <g transform="translate(50, 190)">
          <circle cx="10" cy="10" r="5" fill="var(--color-primary)" />
          <text x="25" y="14" fontSize="12" fontFamily="var(--font-primary)" fill="rgba(255,255,255,0.7)">k/q where (k/q)² &lt; 2</text>
          
          <circle cx="10" cy="35" r="5" fill="rgba(136, 192, 208, 0.3)" />
          <text x="25" y="39" fontSize="12" fontFamily="var(--font-primary)" fill="rgba(255,255,255,0.7)">k/q where (k/q)² &gt; 2</text>
          
          <circle cx="200" cy="10" r="6" fill="#a3be8c" />
          <text x="215" y="14" fontSize="12" fontFamily="var(--font-primary)" fill="rgba(255,255,255,0.7)">x (largest with x² &lt; 2)</text>
          
          <circle cx="200" cy="35" r="6" fill="#e94560" />
          <text x="215" y="39" fontSize="12" fontFamily="var(--font-primary)" fill="rgba(255,255,255,0.7)">x + ε (has (x+ε)² &gt; 2)</text>
          
          <line x1="400" y1="5" x2="400" y2="20" stroke="#b48ead" strokeWidth="2" strokeDasharray="4" />
          <text x="415" y="14" fontSize="12" fontFamily="var(--font-primary)" fill="rgba(255,255,255,0.7)">√2 (irrational)</text>
        </g>
        </svg>
      </div>
      </div>
      
      <div className="proof-box" style={{ marginBottom: '24px' }}>
        <h3 style={{
          margin: '0 0 12px 0',
          color: 'var(--color-primary)',
          fontSize: '1rem',
          fontWeight: 600,
        }}>
          Current Values:
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          fontSize: '0.95rem',
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Grid spacing:</span>
            <span className="math" style={{ marginLeft: '8px' }}>1/{q} = {(1/q).toFixed(4)}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>√2 ≈</span>
            <span className="math" style={{ marginLeft: '8px' }}>{sqrt2.toFixed(6)}</span>
          </div>
          <div>
            <span style={{ color: '#a3be8c', fontWeight: 600 }}>x = {x.toFixed(4)}</span>
            <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>with x² = {(x*x).toFixed(6)} &lt; 2 ✓</span>
          </div>
          <div>
            <span style={{ color: '#e94560', fontWeight: 600 }}>x + ε = {xPlusEps.toFixed(4)}</span>
            <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>with (x+ε)² = {(xPlusEps*xPlusEps).toFixed(6)} &gt; 2 ✓</span>
          </div>
        </div>
      </div>
      
      <div className="proof-box" style={{
        background: 'rgba(79, 195, 247, 0.08)',
        border: '1px solid rgba(79, 195, 247, 0.3)',
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
          As you increase q, the grid becomes finer, and x gets closer to √2 from below.
          For any ε = p/q, we can always find such an x because we're choosing the largest grid point
          whose square is still less than 2.
        </p>
      </div>
      </div>
    </div>
  );
}