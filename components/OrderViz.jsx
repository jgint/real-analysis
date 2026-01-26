'use client';

import React, { useState } from 'react';

function WellDefinedView({ seqA, seqAPrime, seqB, seqBPrime, scale }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Well-Definedness of Order</h3>
      <p className="text-sm text-gray-600 mb-4">
        If (aₖ) ~ (aₖ') and (bₖ) ~ (bₖ'), and aₖ &lt; bₖ eventually, then aₖ' &lt; bₖ' eventually.
      </p>
      
      <svg width="600" height="320" className="bg-white rounded-lg shadow">
        {/* Grid lines */}
        {[0.5, 1.0, 1.5, 2.0].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, 0, 2.5, 280, 40)} x2="580" y2={scale(y, 0, 2.5, 280, 40)} stroke="#e5e7eb" strokeWidth="1" />
            <text x="45" y={scale(y, 0, 2.5, 280, 40) + 4} className="text-xs fill-gray-400">{y}</text>
          </g>
        ))}
        
        {/* Limit lines */}
        <line x1="60" y1={scale(1.5, 0, 2.5, 280, 40)} x2="580" y2={scale(1.5, 0, 2.5, 280, 40)} stroke="#059669" strokeWidth="2" strokeDasharray="6,3" />
        <line x1="60" y1={scale(0.8, 0, 2.5, 280, 40)} x2="580" y2={scale(0.8, 0, 2.5, 280, 40)} stroke="#dc2626" strokeWidth="2" strokeDasharray="6,3" />
        
        {/* Sequences */}
        {seqA.map((val, i) => (
          <circle key={`a${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#059669" opacity="0.8" />
        ))}
        {seqAPrime.map((val, i) => (
          <circle key={`ap${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#10b981" opacity="0.6" />
        ))}
        {seqB.map((val, i) => (
          <circle key={`b${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#dc2626" opacity="0.8" />
        ))}
        {seqBPrime.map((val, i) => (
          <circle key={`bp${i}`} cx={80 + i * 25} cy={scale(val, 0, 2.5, 280, 40)} r="4" fill="#f87171" opacity="0.6" />
        ))}
        
        {/* Labels */}
        <text x="520" y={scale(1.5, 0, 2.5, 280, 40) - 10} className="text-sm font-semibold fill-green-600">[aₖ] → 1.5</text>
        <text x="520" y={scale(0.8, 0, 2.5, 280, 40) + 20} className="text-sm font-semibold fill-red-600">[bₖ] → 0.8</text>
        
        {/* X-axis label */}
        <text x="320" y="310" textAnchor="middle" className="text-sm fill-gray-600">k (sequence index)</text>
        
        {/* Legend */}
        <g transform="translate(80, 15)">
          <circle cx="0" cy="0" r="4" fill="#059669" />
          <text x="10" y="4" className="text-xs fill-gray-600">(aₖ)</text>
          <circle cx="60" cy="0" r="4" fill="#10b981" opacity="0.6" />
          <text x="70" y="4" className="text-xs fill-gray-600">(aₖ')</text>
          <circle cx="130" cy="0" r="4" fill="#dc2626" />
          <text x="140" y="4" className="text-xs fill-gray-600">(bₖ)</text>
          <circle cx="190" cy="0" r="4" fill="#f87171" opacity="0.6" />
          <text x="200" y="4" className="text-xs fill-gray-600">(bₖ')</text>
        </g>
      </svg>
      
      <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
        <strong>Key observation:</strong> Both green sequences converge to 1.5, both red sequences converge to 0.8. 
        Since 1.5 &gt; 0.8, eventually ALL green points are above ALL red points, regardless of which representative we choose.
      </div>
    </div>
  );
}

function TotalityView({ seqP, seqQ, scale }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Totality of Order</h3>
      <p className="text-sm text-gray-600 mb-4">
        For distinct a, b ∈ ℝ, either a &lt; b or a &gt; b. The key is that non-equivalent Cauchy sequences eventually separate.
      </p>
      
      <svg width="600" height="280" className="bg-white rounded-lg shadow">
        {/* Grid lines */}
        {[0, 0.5, 1.0, 1.5].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, -0.2, 1.8, 240, 40)} x2="580" y2={scale(y, -0.2, 1.8, 240, 40)} stroke="#e5e7eb" strokeWidth="1" />
            <text x="45" y={scale(y, -0.2, 1.8, 240, 40) + 4} className="text-xs fill-gray-400">{y}</text>
          </g>
        ))}
        
        {/* Sequences */}
        {seqP.map((val, i) => (
          <circle key={`p${i}`} cx={80 + i * 25} cy={scale(val, -0.2, 1.8, 240, 40)} r="4" fill="#7c3aed" opacity="0.8" />
        ))}
        {seqQ.map((val, i) => (
          <circle key={`q${i}`} cx={80 + i * 25} cy={scale(val, -0.2, 1.8, 240, 40)} r="4" fill="#f59e0b" opacity="0.8" />
        ))}
        
        {/* Limit lines */}
        <line x1="60" y1={scale(1.2, -0.2, 1.8, 240, 40)} x2="580" y2={scale(1.2, -0.2, 1.8, 240, 40)} stroke="#7c3aed" strokeWidth="2" strokeDasharray="6,3" />
        <line x1="60" y1={scale(0.7, -0.2, 1.8, 240, 40)} x2="580" y2={scale(0.7, -0.2, 1.8, 240, 40)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />
        
        {/* Labels */}
        <text x="540" y={scale(1.2, -0.2, 1.8, 240, 40) - 8} className="text-sm font-semibold fill-purple-600">a → 1.2</text>
        <text x="540" y={scale(0.7, -0.2, 1.8, 240, 40) + 16} className="text-sm font-semibold fill-amber-600">b → 0.7</text>
        
        <text x="320" y="270" textAnchor="middle" className="text-sm fill-gray-600">k (sequence index)</text>
      </svg>
      
      <div className="mt-4 p-3 bg-purple-50 rounded-lg text-sm">
        <strong>Key insight:</strong> Since (aₖ) ≁ (bₖ), by Lemma 1.2.5, there exists c &gt; 0 such that |aₖ - bₖ| ≥ c eventually.
        Combined with the Cauchy property, the signs must stabilize: either aₖ &gt; bₖ eventually or aₖ &lt; bₖ eventually.
      </div>
    </div>
  );
}

function DifferenceView({ diffSeq, scale }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">The Difference Sequence</h3>
      <p className="text-sm text-gray-600 mb-4">
        For non-equivalent sequences, (aₖ - bₖ) is eventually bounded away from 0 and has constant sign.
      </p>
      
      <svg width="600" height="280" className="bg-white rounded-lg shadow">
        {/* Grid lines */}
        {[-0.5, 0, 0.5, 1.0].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, -0.8, 1.2, 240, 40)} x2="580" y2={scale(y, -0.8, 1.2, 240, 40)} 
                  stroke={y === 0 ? "#374151" : "#e5e7eb"} strokeWidth={y === 0 ? 2 : 1} />
            <text x="45" y={scale(y, -0.8, 1.2, 240, 40) + 4} className="text-xs fill-gray-400">{y}</text>
          </g>
        ))}
        
        {/* Difference sequence */}
        {diffSeq.map((val, i) => (
          <circle key={`d${i}`} cx={80 + i * 25} cy={scale(val, -0.8, 1.2, 240, 40)} r="5" fill="#0891b2" opacity="0.8" />
        ))}
        
        {/* c threshold line */}
        <line x1="200" y1={scale(0.3, -0.8, 1.2, 240, 40)} x2="580" y2={scale(0.3, -0.8, 1.2, 240, 40)} stroke="#dc2626" strokeWidth="2" strokeDasharray="4,2" />
        <text x="540" y={scale(0.3, -0.8, 1.2, 240, 40) - 8} className="text-xs fill-red-600">c (lower bound)</text>
        
        {/* N marker */}
        <line x1="180" y1="50" x2="180" y2="230" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
        <text x="180" y="250" textAnchor="middle" className="text-xs fill-gray-500">N</text>
        
        <text x="320" y="270" textAnchor="middle" className="text-sm fill-gray-600">k (sequence index)</text>
        <text x="400" y="30" className="text-sm fill-cyan-700">aₖ - bₖ</text>
      </svg>
      
      <div className="mt-4 p-3 bg-cyan-50 rounded-lg text-sm">
        <strong>Conclusion:</strong> For k ≥ N, we have aₖ - bₖ &gt; c &gt; 0, which means aₖ &gt; bₖ eventually. 
        Therefore a &gt; b in ℝ.
      </div>
    </div>
  );
}

function CompatibilityView() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Compatibility with Operations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Addition: a ≤ b ⇒ a + c ≤ b + c</h4>
          <svg width="250" height="150" className="bg-white rounded">
            <line x1="30" y1="75" x2="230" y2="75" stroke="#374151" strokeWidth="2" />
            {/* a and b */}
            <circle cx="80" cy="75" r="6" fill="#059669" />
            <text x="80" y="65" textAnchor="middle" className="text-xs fill-green-600">a</text>
            <circle cx="150" cy="75" r="6" fill="#dc2626" />
            <text x="150" y="65" textAnchor="middle" className="text-xs fill-red-600">b</text>
            
            {/* Arrow showing +c */}
            <path d="M 80 90 Q 110 110 140 90" fill="none" stroke="#6b7280" strokeWidth="1" />
            <text x="110" y="120" textAnchor="middle" className="text-xs fill-gray-500">+c</text>
            
            {/* a+c and b+c */}
            <circle cx="140" cy="75" r="4" fill="#059669" opacity="0.5" />
            <circle cx="210" cy="75" r="4" fill="#dc2626" opacity="0.5" />
            <text x="140" y="95" textAnchor="middle" className="text-xs fill-green-600">a+c</text>
            <text x="210" y="95" textAnchor="middle" className="text-xs fill-red-600">b+c</text>
          </svg>
          <p className="text-xs text-gray-600 mt-2">Adding the same value preserves the gap.</p>
        </div>
        
        <div className="p-4 bg-amber-50 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">Multiplication: 0 ≤ a, 0 ≤ b ⇒ 0 ≤ ab</h4>
          <svg width="250" height="150" className="bg-white rounded">
            <line x1="30" y1="75" x2="230" y2="75" stroke="#374151" strokeWidth="2" />
            {/* 0 */}
            <circle cx="60" cy="75" r="6" fill="#374151" />
            <text x="60" y="65" textAnchor="middle" className="text-xs fill-gray-600">0</text>
            {/* a */}
            <circle cx="120" cy="75" r="6" fill="#7c3aed" />
            <text x="120" y="65" textAnchor="middle" className="text-xs fill-purple-600">a</text>
            {/* b */}
            <circle cx="160" cy="75" r="6" fill="#0891b2" />
            <text x="160" y="65" textAnchor="middle" className="text-xs fill-cyan-600">b</text>
            {/* ab */}
            <circle cx="200" cy="75" r="6" fill="#059669" />
            <text x="200" y="65" textAnchor="middle" className="text-xs fill-green-600">ab</text>
            
            <text x="140" y="110" textAnchor="middle" className="text-xs fill-gray-500">positive × positive = positive</text>
          </svg>
          <p className="text-xs text-gray-600 mt-2">Product of non-negatives is non-negative.</p>
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