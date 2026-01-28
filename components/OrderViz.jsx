'use client';

import React, { useState } from 'react';

function WellDefinedView({ seqA, seqAPrime, seqB, seqBPrime, scale }) {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Well-Definedness of Order
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      }}>
        If (aₖ) ~ (aₖ') and (bₖ) ~ (bₖ'), and aₖ &lt; bₖ eventually, then aₖ' &lt; bₖ' eventually.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <svg
          width="600"
          height="320"
          viewBox="0 0 600 320"
          style={{
            background: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(136, 192, 208, 0.2)',
            maxWidth: '100%',
            height: 'auto',
          }}
        >
        {/* Grid lines */}
        {[0.5, 1.0, 1.5, 2.0].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, 0, 2.5, 280, 40)} x2="580" y2={scale(y, 0, 2.5, 280, 40)} stroke="rgba(136, 192, 208, 0.15)" strokeWidth="1" />
            <text x="45" y={scale(y, 0, 2.5, 280, 40) + 4} fill="rgba(136, 192, 208, 0.6)" fontSize="12" fontFamily="var(--font-mono)">{y}</text>
          </g>
        ))}
        
        {/* Limit lines */}
        <line x1="60" y1={scale(1.5, 0, 2.5, 280, 40)} x2="580" y2={scale(1.5, 0, 2.5, 280, 40)} stroke="#a3be8c" strokeWidth="2" strokeDasharray="6,3" />
        <line x1="60" y1={scale(0.8, 0, 2.5, 280, 40)} x2="580" y2={scale(0.8, 0, 2.5, 280, 40)} stroke="#e94560" strokeWidth="2" strokeDasharray="6,3" />
        
        {/* Sequences */}
        {seqA.map((val, i) => (
          <circle key={`a${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#a3be8c" opacity="0.9" />
        ))}
        {seqAPrime.map((val, i) => (
          <circle key={`ap${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#a3be8c" opacity="0.6" />
        ))}
        {seqB.map((val, i) => (
          <circle key={`b${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#e94560" opacity="0.9" />
        ))}
        {seqBPrime.map((val, i) => (
          <circle key={`bp${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#e94560" opacity="0.6" />
        ))}
        
        {/* Labels */}
        <text x="520" y={scale(1.5, 0, 2.5, 280, 40) - 10} fill="#a3be8c" fontSize="13" fontWeight="600" fontFamily="var(--font-mono)">[aₖ] → 1.5</text>
        <text x="520" y={scale(0.8, 0, 2.5, 280, 40) + 20} fill="#e94560" fontSize="13" fontWeight="600" fontFamily="var(--font-mono)">[bₖ] → 0.8</text>
        
        {/* X-axis label */}
        <text x="320" y="310" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="13" fontFamily="var(--font-primary)">k (sequence index)</text>
        
        {/* Legend */}
        <g transform="translate(80, 15)">
          <circle cx="0" cy="0" r="4" fill="#a3be8c" />
          <text x="10" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">(aₖ)</text>
          <circle cx="60" cy="0" r="4" fill="#a3be8c" opacity="0.6" />
          <text x="70" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">(aₖ')</text>
          <circle cx="130" cy="0" r="4" fill="#e94560" />
          <text x="140" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">(bₖ)</text>
          <circle cx="190" cy="0" r="4" fill="#e94560" opacity="0.6" />
          <text x="200" y="4" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontFamily="var(--font-primary)">(bₖ')</text>
        </g>
        </svg>
      </div>
      
      <div className="proof-box" style={{
        marginTop: '1.25rem',
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
          Key observation
        </h4>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          Both green sequences converge to 1.5, both red sequences converge to 0.8. 
          Since 1.5 &gt; 0.8, eventually ALL green points are above ALL red points, regardless of which representative we choose.
        </p>
      </div>
    </div>
  );
}

function TotalityView({ seqP, seqQ, scale }) {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Totality of Order
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      }}>
        For distinct a, b ∈ ℝ, either a &lt; b or a &gt; b. The key is that non-equivalent Cauchy sequences eventually separate.
      </p>
      
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
        {/* Grid lines */}
        {[0, 0.5, 1.0, 1.5].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, -0.2, 1.8, 240, 40)} x2="580" y2={scale(y, -0.2, 1.8, 240, 40)} stroke="rgba(136, 192, 208, 0.15)" strokeWidth="1" />
            <text x="45" y={scale(y, -0.2, 1.8, 240, 40) + 4} fill="rgba(136, 192, 208, 0.6)" fontSize="12" fontFamily="var(--font-mono)">{y}</text>
          </g>
        ))}
        
        {/* Sequences */}
        {seqP.map((val, i) => (
          <circle key={`p${i}`} cx={80 + i * 25} cy={scale(val, -0.2, 1.8, 240, 40)} r="4" fill="#b48ead" opacity="0.9" />
        ))}
        {seqQ.map((val, i) => (
          <circle key={`q${i}`} cx={80 + i * 25} cy={scale(val, -0.2, 1.8, 240, 40)} r="4" fill="#ebcb8b" opacity="0.9" />
        ))}
        
        {/* Limit lines */}
        <line x1="60" y1={scale(1.2, -0.2, 1.8, 240, 40)} x2="580" y2={scale(1.2, -0.2, 1.8, 240, 40)} stroke="#b48ead" strokeWidth="2" strokeDasharray="6,3" />
        <line x1="60" y1={scale(0.7, -0.2, 1.8, 240, 40)} x2="580" y2={scale(0.7, -0.2, 1.8, 240, 40)} stroke="#ebcb8b" strokeWidth="2" strokeDasharray="6,3" />
        
        {/* Labels */}
        <text x="540" y={scale(1.2, -0.2, 1.8, 240, 40) - 8} fill="#b48ead" fontSize="13" fontWeight="600" fontFamily="var(--font-mono)">a → 1.2</text>
        <text x="540" y={scale(0.7, -0.2, 1.8, 240, 40) + 16} fill="#ebcb8b" fontSize="13" fontWeight="600" fontFamily="var(--font-mono)">b → 0.7</text>
        
        <text x="320" y="270" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="13" fontFamily="var(--font-primary)">k (sequence index)</text>
        </svg>
      </div>
      
      <div className="proof-box" style={{
        marginTop: '1.25rem',
        background: 'rgba(180, 142, 173, 0.08)',
        border: '1px solid rgba(180, 142, 173, 0.3)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#b48ead',
        }}>
          Key insight
        </h4>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          Since (aₖ) ≁ (bₖ), by Lemma 1.2.5, there exists c &gt; 0 such that |aₖ - bₖ| ≥ c eventually.
          Combined with the Cauchy property, the signs must stabilize: either aₖ &gt; bₖ eventually or aₖ &lt; bₖ eventually.
        </p>
      </div>
    </div>
  );
}

function DifferenceView({ diffSeq, scale }) {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        The Difference Sequence
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      }}>
        For non-equivalent sequences, (aₖ - bₖ) is eventually bounded away from 0 and has constant sign.
      </p>
      
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
        {/* Grid lines */}
        {[-0.5, 0, 0.5, 1.0].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, -0.8, 1.2, 240, 40)} x2="580" y2={scale(y, -0.8, 1.2, 240, 40)} 
                  stroke={y === 0 ? "rgba(136, 192, 208, 0.4)" : "rgba(136, 192, 208, 0.15)"} strokeWidth={y === 0 ? 2 : 1} />
            <text x="45" y={scale(y, -0.8, 1.2, 240, 40) + 4} fill="rgba(136, 192, 208, 0.6)" fontSize="12" fontFamily="var(--font-mono)">{y}</text>
          </g>
        ))}
        
        {/* Difference sequence */}
        {diffSeq.map((val, i) => (
          <circle key={`d${i}`} cx={80 + i * 25} cy={scale(val, -0.8, 1.2, 240, 40)} r="5" fill="#88c0d0" opacity="0.9" />
        ))}
        
        {/* c threshold line */}
        <line x1="200" y1={scale(0.3, -0.8, 1.2, 240, 40)} x2="580" y2={scale(0.3, -0.8, 1.2, 240, 40)} stroke="#e94560" strokeWidth="2" strokeDasharray="4,2" />
        <text x="540" y={scale(0.3, -0.8, 1.2, 240, 40) - 8} fill="#e94560" fontSize="12" fontFamily="var(--font-mono)">c (lower bound)</text>
        
        {/* N marker */}
        <line x1="180" y1="50" x2="180" y2="230" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="1" strokeDasharray="3,3" />
        <text x="180" y="250" textAnchor="middle" fill="rgba(136, 192, 208, 0.6)" fontSize="12" fontFamily="var(--font-mono)">N</text>
        
        <text x="320" y="270" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="13" fontFamily="var(--font-primary)">k (sequence index)</text>
        <text x="400" y="30" fill="#88c0d0" fontSize="13" fontFamily="var(--font-mono)">aₖ - bₖ</text>
        </svg>
      </div>
      
      <div className="proof-box" style={{
        marginTop: '1.25rem',
        background: 'rgba(136, 192, 208, 0.08)',
        border: '1px solid rgba(136, 192, 208, 0.3)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#88c0d0',
        }}>
          Conclusion
        </h4>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          For k ≥ N, we have aₖ - bₖ &gt; c &gt; 0, which means aₖ &gt; bₖ eventually. 
          Therefore a &gt; b in ℝ.
        </p>
      </div>
    </div>
  );
}

function CompatibilityView() {
  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <h3 style={{
        color: 'var(--text-primary)',
        margin: '0 0 0.75rem 0',
        fontSize: '1.1rem',
        fontWeight: 600,
      }}>
        Compatibility with Operations
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#4fc3f7',
            fontSize: '0.95rem',
          }}>
            Addition: a ≤ b ⇒ a + c ≤ b + c
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <svg width="250" height="150" viewBox="0 0 250 150" style={{
              background: 'rgba(13, 17, 23, 0.4)',
              borderRadius: '8px',
              maxWidth: '100%',
              height: 'auto',
            }}>
              <line x1="30" y1="75" x2="230" y2="75" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
              {/* a and b */}
              <circle cx="80" cy="75" r="6" fill="#a3be8c" />
              <text x="80" y="65" textAnchor="middle" fill="#a3be8c" fontSize="12" fontFamily="var(--font-mono)">a</text>
              <circle cx="150" cy="75" r="6" fill="#e94560" />
              <text x="150" y="65" textAnchor="middle" fill="#e94560" fontSize="12" fontFamily="var(--font-mono)">b</text>
              
              {/* Arrow showing +c */}
              <path d="M 80 90 Q 110 110 140 90" fill="none" stroke="rgba(136, 192, 208, 0.5)" strokeWidth="1" />
              <text x="110" y="120" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="11" fontFamily="var(--font-mono)">+c</text>
              
              {/* a+c and b+c */}
              <circle cx="140" cy="75" r="4" fill="#a3be8c" opacity="0.5" />
              <circle cx="210" cy="75" r="4" fill="#e94560" opacity="0.5" />
              <text x="140" y="95" textAnchor="middle" fill="#a3be8c" fontSize="11" fontFamily="var(--font-mono)">a+c</text>
              <text x="210" y="95" textAnchor="middle" fill="#e94560" fontSize="11" fontFamily="var(--font-mono)">b+c</text>
            </svg>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Adding the same value preserves the gap.</p>
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
            Multiplication: 0 ≤ a, 0 ≤ b ⇒ 0 ≤ ab
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <svg width="250" height="150" viewBox="0 0 250 150" style={{
              background: 'rgba(13, 17, 23, 0.4)',
              borderRadius: '8px',
              maxWidth: '100%',
              height: 'auto',
            }}>
              <line x1="30" y1="75" x2="230" y2="75" stroke="rgba(136, 192, 208, 0.4)" strokeWidth="2" />
              {/* 0 */}
              <circle cx="60" cy="75" r="6" fill="rgba(136, 192, 208, 0.6)" />
              <text x="60" y="65" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="12" fontFamily="var(--font-mono)">0</text>
              {/* a */}
              <circle cx="120" cy="75" r="6" fill="#b48ead" />
              <text x="120" y="65" textAnchor="middle" fill="#b48ead" fontSize="12" fontFamily="var(--font-mono)">a</text>
              {/* b */}
              <circle cx="160" cy="75" r="6" fill="#88c0d0" />
              <text x="160" y="65" textAnchor="middle" fill="#88c0d0" fontSize="12" fontFamily="var(--font-mono)">b</text>
              {/* ab */}
              <circle cx="200" cy="75" r="6" fill="#a3be8c" />
              <text x="200" y="65" textAnchor="middle" fill="#a3be8c" fontSize="12" fontFamily="var(--font-mono)">ab</text>
              
              <text x="140" y="110" textAnchor="middle" fill="rgba(136, 192, 208, 0.7)" fontSize="11" fontFamily="var(--font-mono)">positive × positive = positive</text>
            </svg>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product of non-negatives is non-negative.</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderVisualization() {
  const [view, setView] = useState('wellDefined');
  
  // Generate a Cauchy sequence converging to a limit
  const generateSeq = (limit, offset, oscillation = 0) => {
    const seq = [];
    for (let k = 1; k <= 20; k++) {
      const osc = oscillation * Math.sin(k * 2) / k;
      seq.push(limit + offset / k + osc);
    }
    return seq;
  };
  
  // Two equivalent sequences (both converge to 1.5)
  const seqA = generateSeq(1.5, 0.5, 0.3);
  const seqAPrime = generateSeq(1.5, -0.3, 0.2);
  
  // Two equivalent sequences (both converge to 0.8)
  const seqB = generateSeq(0.8, 0.4, 0.2);
  const seqBPrime = generateSeq(0.8, -0.2, 0.15);
  
  // For totality: two non-equivalent sequences
  const seqP = generateSeq(1.2, 0.3, 0.1);
  const seqQ = generateSeq(0.7, 0.2, 0.1);
  
  // Difference sequence for totality
  const diffSeq = seqP.map((val, i) => val - seqQ[i]);
  
  const scale = (val, min, max, pixelMin, pixelMax) => {
    return pixelMin + (val - min) / (max - min) * (pixelMax - pixelMin);
  };

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Order Relation on ℝ
        </h1>
        
        <p className="viz-subtitle">
          Understanding how order is defined and preserved in ℝ
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => setView('wellDefined')}
            className={`btn ${view === 'wellDefined' ? 'active' : 'secondary'}`}
          >
            Well-Definedness
          </button>
          <button
            onClick={() => setView('totality')}
            className={`btn ${view === 'totality' ? 'active' : 'secondary'}`}
          >
            Totality
          </button>
          <button
            onClick={() => setView('difference')}
            className={`btn ${view === 'difference' ? 'active' : 'secondary'}`}
          >
            Difference Sequence
          </button>
          <button
            onClick={() => setView('compatibility')}
            className={`btn ${view === 'compatibility' ? 'active' : 'secondary'}`}
          >
            Compatibility
          </button>
        </div>
        
        <div className="visualization-container">
        {view === 'wellDefined' && (
          <WellDefinedView 
            seqA={seqA} 
            seqAPrime={seqAPrime} 
            seqB={seqB} 
            seqBPrime={seqBPrime} 
            scale={scale} 
          />
        )}
        {view === 'totality' && (
          <TotalityView 
            seqP={seqP} 
            seqQ={seqQ} 
            scale={scale} 
          />
        )}
        {view === 'difference' && (
          <DifferenceView 
            diffSeq={diffSeq} 
            scale={scale} 
          />
        )}
        {view === 'compatibility' && <CompatibilityView />}
        </div>
      </div>
    </div>
  );
}