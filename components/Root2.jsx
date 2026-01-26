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
          <label style={{ display: 'block', marginBottom: '12px', color: '#88c0d0', fontSize: '1rem' }}>
            Grid denominator q = {q} (grid spacing = 1/{q})
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
              cursor: 'pointer'
            }}
          />
        </div>
      
      <div className="visualization-container" style={{ marginBottom: '24px' }}>
      <svg width="600" height="280" style={{ width: '100%', height: 'auto' }}>
        {/* Number line */}
        <line x1="40" y1="120" x2="560" y2="120" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        
        {/* Tick marks and labels for 0, 1, 2 */}
        {[0, 1, 2].map(val => (
          <g key={val}>
            <line x1={scale(val)} y1="115" x2={scale(val)} y2="125" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <text x={scale(val)} y="145" textAnchor="middle" fill="#88c0d0" fontSize="14" fontFamily="Fira Code">{val}</text>
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
                  fontFamily="Fira Code"
                  fill={isX ? "#a3be8c" : "#bf616a"}
                >
                  {isX ? `x = ${x.toFixed(3)}` : `x+ε = ${xPlusEps.toFixed(3)}`}
                </text>
              )}
            </g>
          );
        })}
        
        {/* sqrt(2) marker */}
        <line x1={scale(sqrt2)} y1="90" x2={scale(sqrt2)} y2="150" stroke="#b48ead" strokeWidth="2" strokeDasharray="4" />
        <text x={scale(sqrt2)} y="80" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Fira Code" fill="#b48ead">√2 ≈ 1.414</text>
        
        {/* Legend */}
        <g transform="translate(50, 190)">
          <circle cx="10" cy="10" r="5" fill="#88c0d0" />
          <text x="25" y="14" fontSize="12" fontFamily="Fira Code" fill="rgba(255,255,255,0.8)">k/q where (k/q)² &lt; 2</text>
          
          <circle cx="10" cy="35" r="5" fill="rgba(255,255,255,0.3)" />
          <text x="25" y="39" fontSize="12" fontFamily="Fira Code" fill="rgba(255,255,255,0.8)">k/q where (k/q)² &gt; 2</text>
          
          <circle cx="200" cy="10" r="6" fill="#a3be8c" />
          <text x="215" y="14" fontSize="12" fontFamily="Fira Code" fill="rgba(255,255,255,0.8)">x (largest with x² &lt; 2)</text>
          
          <circle cx="200" cy="35" r="6" fill="#bf616a" />
          <text x="215" y="39" fontSize="12" fontFamily="Fira Code" fill="rgba(255,255,255,0.8)">x + ε (has (x+ε)² &gt; 2)</text>
          
          <line x1="400" y1="5" x2="400" y2="20" stroke="#b48ead" strokeWidth="2" strokeDasharray="4" />
          <text x="415" y="14" fontSize="12" fontFamily="Fira Code" fill="rgba(255,255,255,0.8)">√2 (irrational)</text>
        </g>
      </svg>
      </div>
      
      <div className="proof-box" style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#88c0d0', fontSize: '1.1rem' }}>Current Values:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.95rem' }}>
          <div>
            <span style={{ opacity: 0.7 }}>Grid spacing:</span>
            <span className="math" style={{ marginLeft: '8px' }}>1/{q} = {(1/q).toFixed(4)}</span>
          </div>
          <div>
            <span style={{ opacity: 0.7 }}>√2 ≈</span>
            <span className="math" style={{ marginLeft: '8px' }}>{sqrt2.toFixed(6)}</span>
          </div>
          <div>
            <span style={{ color: '#a3be8c', fontWeight: 600 }}>x = {x.toFixed(4)}</span>
            <span style={{ marginLeft: '8px', opacity: 0.7 }}>with x² = {(x*x).toFixed(6)} &lt; 2 ✓</span>
          </div>
          <div>
            <span style={{ color: '#bf616a', fontWeight: 600 }}>x + ε = {xPlusEps.toFixed(4)}</span>
            <span style={{ marginLeft: '8px', opacity: 0.7 }}>with (x+ε)² = {(xPlusEps*xPlusEps).toFixed(6)} &gt; 2 ✓</span>
          </div>
        </div>
      </div>
      
      <div className="proof-box" style={{ background: 'rgba(136, 192, 208, 0.1)', borderColor: 'rgba(136, 192, 208, 0.3)' }}>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
          <strong style={{ color: '#88c0d0' }}>Key insight:</strong> As you increase q, the grid becomes finer, and x gets closer to √2 from below.
          For any ε = p/q, we can always find such an x because we're choosing the largest grid point
          whose square is still less than 2.
        </p>
      </div>
      </div>
    </div>
  );
}