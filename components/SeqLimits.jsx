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
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Part 1: Sequence Terms Stay Within r of the Limit</h3>
      <p className="text-sm text-gray-600 mb-4">
        For any rational r &gt; 0, we have x - r ≤ xₙ ≤ x + r eventually.
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          r = {r.toFixed(2)} (adjust the band width)
        </label>
        <input
          type="range"
          min="0.1"
          max="0.8"
          step="0.05"
          value={r}
          onChange={(e) => setR(parseFloat(e.target.value))}
          className="w-64"
        />
      </div>
      
      <svg width="650" height="320" className="bg-white rounded-lg shadow">
        {/* Grid lines */}
        {[1.0, 1.5, 2.0].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, yMin, yMax, 280, 40)} x2="620" y2={scale(y, yMin, yMax, 280, 40)} stroke="#e5e7eb" strokeWidth="1" />
            <text x="45" y={scale(y, yMin, yMax, 280, 40) + 4} className="text-xs fill-gray-400">{y}</text>
          </g>
        ))}
        
        {/* The band [x-r, x+r] */}
        <rect 
          x="60" 
          y={scale(limit + r, yMin, yMax, 280, 40)} 
          width="560" 
          height={scale(limit - r, yMin, yMax, 280, 40) - scale(limit + r, yMin, yMax, 280, 40)}
          fill="#dbeafe"
          opacity="0.5"
        />
        
        {/* Limit line x */}
        <line x1="60" y1={scale(limit, yMin, yMax, 280, 40)} x2="620" y2={scale(limit, yMin, yMax, 280, 40)} stroke="#2563eb" strokeWidth="2" />
        <text x="625" y={scale(limit, yMin, yMax, 280, 40) + 4} className="text-sm font-semibold fill-blue-600">x</text>
        
        {/* Upper bound x + r */}
        <line x1="60" y1={scale(limit + r, yMin, yMax, 280, 40)} x2="620" y2={scale(limit + r, yMin, yMax, 280, 40)} stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="625" y={scale(limit + r, yMin, yMax, 280, 40) + 4} className="text-xs fill-purple-600">x+r</text>
        
        {/* Lower bound x - r */}
        <line x1="60" y1={scale(limit - r, yMin, yMax, 280, 40)} x2="620" y2={scale(limit - r, yMin, yMax, 280, 40)} stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="625" y={scale(limit - r, yMin, yMax, 280, 40) + 4} className="text-xs fill-purple-600">x-r</text>
        
        {/* N marker */}
        {N <= 25 && (
          <g>
            <line x1={70 + (N-1) * 22} y1="35" x2={70 + (N-1) * 22} y2="285" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x={70 + (N-1) * 22} y="300" textAnchor="middle" className="text-xs font-semibold fill-red-600">N={N}</text>
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
              fill={isAfterN ? "#059669" : "#f59e0b"}
              opacity="0.8"
            />
          );
        })}
        
        {/* X-axis label */}
        <text x="340" y="315" textAnchor="middle" className="text-sm fill-gray-600">k (sequence index)</text>
        
        {/* Legend */}
        <g transform="translate(80, 20)">
          <rect x="-5" y="-12" width="280" height="20" fill="white" opacity="0.8" />
          <circle cx="0" cy="0" r="5" fill="#f59e0b" />
          <text x="10" y="4" className="text-xs fill-gray-600">Before N</text>
          <circle cx="80" cy="0" r="5" fill="#059669" />
          <text x="90" y="4" className="text-xs fill-gray-600">After N (in band)</text>
          <rect x="180" y="-6" width="12" height="12" fill="#dbeafe" opacity="0.7" />
          <text x="197" y="4" className="text-xs fill-gray-600">[x-r, x+r]</text>
        </g>
      </svg>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
        <strong>Key observation:</strong> No matter how small you make r, there's always some N after which 
        all sequence terms xₙ fall within the band [x-r, x+r]. This is essentially what it means for 
        the sequence to converge to x.
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
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Part 2: Inequalities Pass to Limits</h3>
      <p className="text-sm text-gray-600 mb-4">
        If a ≤ xₖ eventually, then a ≤ x. The bound on sequence terms becomes a bound on the limit.
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          a = {a.toFixed(2)} (the lower bound)
        </label>
        <input
          type="range"
          min="0.9"
          max="1.5"
          step="0.05"
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          className="w-64"
        />
      </div>
      
      <svg width="650" height="320" className="bg-white rounded-lg shadow">
        {/* Grid lines */}
        {[1.0, 1.5, 2.0].map(y => (
          <g key={y}>
            <line x1="60" y1={scale(y, yMin, yMax, 280, 40)} x2="620" y2={scale(y, yMin, yMax, 280, 40)} stroke="#e5e7eb" strokeWidth="1" />
            <text x="45" y={scale(y, yMin, yMax, 280, 40) + 4} className="text-xs fill-gray-400">{y}</text>
          </g>
        ))}
        
        {/* Shaded region below a */}
        <rect 
          x="60" 
          y={scale(a, yMin, yMax, 280, 40)} 
          width="560" 
          height={280 - scale(a, yMin, yMax, 280, 40)}
          fill="#fee2e2"
          opacity="0.4"
        />
        
        {/* Limit line x */}
        <line x1="60" y1={scale(limit, yMin, yMax, 280, 40)} x2="620" y2={scale(limit, yMin, yMax, 280, 40)} stroke="#2563eb" strokeWidth="2" />
        <text x="625" y={scale(limit, yMin, yMax, 280, 40) + 4} className="text-sm font-semibold fill-blue-600">x</text>
        
        {/* Lower bound a */}
        <line x1="60" y1={scale(a, yMin, yMax, 280, 40)} x2="620" y2={scale(a, yMin, yMax, 280, 40)} stroke="#dc2626" strokeWidth="2" />
        <text x="625" y={scale(a, yMin, yMax, 280, 40) + 4} className="text-sm font-semibold fill-red-600">a</text>
        
        {/* N marker */}
        {N <= 25 && N > 1 && (
          <g>
            <line x1={70 + (N-1) * 22} y1="35" x2={70 + (N-1) * 22} y2="285" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x={70 + (N-1) * 22} y="300" textAnchor="middle" className="text-xs font-semibold fill-purple-600">N={N}</text>
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
              fill={isAfterN && isAboveA ? "#059669" : "#f59e0b"}
              opacity="0.8"
            />
          );
        })}
        
        {/* X-axis label */}
        <text x="340" y="315" textAnchor="middle" className="text-sm fill-gray-600">k (sequence index)</text>
        
        {/* Status indicator */}
        <g transform="translate(400, 20)">
          <rect x="-5" y="-12" width="180" height="20" fill="white" opacity="0.9" rx="4" />
          {a <= limit ? (
            <text x="0" y="4" className="text-xs font-semibold fill-green-600">✓ a ≤ x (as expected!)</text>
          ) : (
            <text x="0" y="4" className="text-xs font-semibold fill-red-600">a &gt; x (not eventually ≤)</text>
          )}
        </g>
      </svg>
      
      <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm">
        <strong>Key insight:</strong> If a ≤ xₖ for all k ≥ N, then the limit x cannot be less than a. 
        Why? If x &lt; a, then by Part 1, eventually xₖ would be close to x and hence less than a — contradiction!
      </div>
    </div>
  );
}

function ProofSketchView() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Proof Sketch: Why Part 1 Implies Part 2</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">The Setup</h4>
          <p className="text-sm text-gray-600">
            Suppose a ≤ xₖ eventually, but (for contradiction) a &gt; x.
          </p>
        </div>
        
        <svg width="600" height="200" className="bg-white rounded-lg shadow mx-auto">
          {/* Number line */}
          <line x1="50" y1="100" x2="550" y2="100" stroke="#374151" strokeWidth="2" />
          
          {/* x point */}
          <circle cx="200" cy="100" r="8" fill="#2563eb" />
          <text x="200" y="85" textAnchor="middle" className="text-sm font-semibold fill-blue-600">x</text>
          
          {/* a point */}
          <circle cx="350" cy="100" r="8" fill="#dc2626" />
          <text x="350" y="85" textAnchor="middle" className="text-sm font-semibold fill-red-600">a</text>
          
          {/* r = (a-x)/2 bracket */}
          <line x1="200" y1="130" x2="275" y2="130" stroke="#7c3aed" strokeWidth="2" />
          <line x1="200" y1="125" x2="200" y2="135" stroke="#7c3aed" strokeWidth="2" />
          <line x1="275" y1="125" x2="275" y2="135" stroke="#7c3aed" strokeWidth="2" />
          <text x="237" y="150" textAnchor="middle" className="text-xs fill-purple-600">r = (a-x)/2</text>
          
          {/* x + r point */}
          <circle cx="275" cy="100" r="6" fill="#7c3aed" opacity="0.7" />
          <text x="275" y="85" textAnchor="middle" className="text-xs fill-purple-600">x+r</text>
          
          {/* Band indicator */}
          <rect x="125" y="95" width="150" height="10" fill="#dbeafe" opacity="0.5" />
          
          {/* xₖ eventually in band */}
          <circle cx="160" cy="100" r="5" fill="#059669" />
          <circle cx="180" cy="100" r="5" fill="#059669" />
          <circle cx="240" cy="100" r="5" fill="#059669" />
          <circle cx="260" cy="100" r="5" fill="#059669" />
          <text x="210" y="175" textAnchor="middle" className="text-xs fill-green-600">xₖ eventually here (by Part 1)</text>
        </svg>
        
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">The Contradiction</h4>
          <p className="text-sm text-gray-700">
            Let r = (a - x)/2 &gt; 0. By Part 1, eventually xₖ ≤ x + r = x + (a-x)/2 = (x+a)/2 &lt; a.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            But we assumed a ≤ xₖ eventually. This is a contradiction!
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Conclusion</h4>
          <p className="text-sm text-gray-700">
            Therefore our assumption was wrong, and we must have a ≤ x.
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