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
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Part 1: Existence of the Ceiling</h3>
      <p className="text-sm text-gray-600 mb-4">
        For any real a, there exists m ∈ ℤ such that m &lt; a ≤ m + 1.
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          a = {a.toFixed(2)}
        </label>
        <input
          type="range"
          min="-0.5"
          max="5.5"
          step="0.1"
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          className="w-64"
        />
      </div>
      
      <svg width="650" height="200" className="bg-white rounded-lg shadow">
        {/* Number line */}
        <line x1="50" y1="100" x2="600" y2="100" stroke="#374151" strokeWidth="2" />
        
        {/* Integer tick marks */}
        {[0, 1, 2, 3, 4, 5].map(n => (
          <g key={n}>
            <line 
              x1={scale(n, xMin, xMax, 50, 600)} 
              y1="90" 
              x2={scale(n, xMin, xMax, 50, 600)} 
              y2="110" 
              stroke="#374151" 
              strokeWidth="2" 
            />
            <text 
              x={scale(n, xMin, xMax, 50, 600)} 
              y="130" 
              textAnchor="middle" 
              className="text-sm fill-gray-600"
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
          stroke="#3b82f6" 
          strokeWidth="6" 
          opacity="0.5"
        />
        
        {/* Open circle at m */}
        <circle 
          cx={scale(m, xMin, xMax, 50, 600)} 
          cy="100" 
          r="8" 
          fill="white" 
          stroke="#3b82f6" 
          strokeWidth="2" 
        />
        <text 
          x={scale(m, xMin, xMax, 50, 600)} 
          y="155" 
          textAnchor="middle" 
          className="text-sm font-semibold fill-blue-600"
        >
          m = {m}
        </text>
        
        {/* Closed circle at m+1 */}
        <circle 
          cx={scale(m + 1, xMin, xMax, 50, 600)} 
          cy="100" 
          r="8" 
          fill="#3b82f6" 
        />
        <text 
          x={scale(m + 1, xMin, xMax, 50, 600)} 
          y="155" 
          textAnchor="middle" 
          className="text-sm font-semibold fill-blue-600"
        >
          m+1 = {m + 1}
        </text>
        
        {/* Point a */}
        <circle 
          cx={scale(a, xMin, xMax, 50, 600)} 
          cy="100" 
          r="6" 
          fill="#dc2626" 
        />
        <line 
          x1={scale(a, xMin, xMax, 50, 600)} 
          y1="70" 
          x2={scale(a, xMin, xMax, 50, 600)} 
          y2="95" 
          stroke="#dc2626" 
          strokeWidth="2" 
        />
        <text 
          x={scale(a, xMin, xMax, 50, 600)} 
          y="60" 
          textAnchor="middle" 
          className="text-sm font-bold fill-red-600"
        >
          a = {a.toFixed(2)}
        </text>
        
        {/* Interval notation */}
        <text x="325" y="180" textAnchor="middle" className="text-sm fill-gray-700">
          a ∈ ({m}, {m + 1}] means {m} &lt; a ≤ {m + 1}
        </text>
      </svg>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
        <strong>Key insight:</strong> The integers partition ℝ into intervals (m, m+1]. 
        Every real number falls into exactly one such interval. The integer m is ⌈a⌉ - 1 (one less than the ceiling).
      </div>
    </div>
  );
}

function Part1ProofView() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Part 1: Proof Sketch</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
          <h4 className="font-semibold text-amber-800 mb-2">Step 1: Find integers above and below a</h4>
          <p className="text-sm text-gray-700">
            By the <strong>Archimedean property</strong>, there exist integers N₁ and N₂ such that N₁ &gt; a and -N₂ &lt; a.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            This means -N₂ &lt; a &lt; N₁, so a is "sandwiched" between integers.
          </p>
        </div>
        
        <svg width="600" height="120" className="bg-white rounded-lg shadow mx-auto">
          <line x1="50" y1="60" x2="550" y2="60" stroke="#374151" strokeWidth="2" />
          
          {/* -N₂ */}
          <circle cx="120" cy="60" r="6" fill="#7c3aed" />
          <text x="120" y="45" textAnchor="middle" className="text-xs fill-purple-600">-N₂</text>
          
          {/* a */}
          <circle cx="300" cy="60" r="6" fill="#dc2626" />
          <text x="300" y="45" textAnchor="middle" className="text-xs font-bold fill-red-600">a</text>
          
          {/* N₁ */}
          <circle cx="480" cy="60" r="6" fill="#7c3aed" />
          <text x="480" y="45" textAnchor="middle" className="text-xs fill-purple-600">N₁</text>
          
          {/* Arrows */}
          <text x="210" y="85" textAnchor="middle" className="text-xs fill-gray-500">integers exist here</text>
          <text x="390" y="85" textAnchor="middle" className="text-xs fill-gray-500">integers exist here</text>
        </svg>
        
        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h4 className="font-semibold text-green-800 mb-2">Step 2: Define the candidate set S</h4>
          <p className="text-sm text-gray-700">
            Let S = {"{"} n ∈ ℤ : n ≥ a {"}"} = {"{"} integers that are ≥ a {"}"}.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            S is <strong>nonempty</strong> (contains N₁) and <strong>bounded below</strong> (by -N₂).
          </p>
        </div>
        
        <svg width="600" height="120" className="bg-white rounded-lg shadow mx-auto">
          <line x1="50" y1="60" x2="550" y2="60" stroke="#374151" strokeWidth="2" />
          
          {/* Points not in S */}
          {[-2, -1, 0, 1, 2].map(n => (
            <g key={n}>
              <circle cx={150 + n * 40} cy="60" r="5" fill="#9ca3af" />
              <text x={150 + n * 40} y="90" textAnchor="middle" className="text-xs fill-gray-400">{n}</text>
            </g>
          ))}
          
          {/* a marker */}
          <line x1="280" y1="40" x2="280" y2="80" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
          <text x="280" y="30" textAnchor="middle" className="text-xs font-bold fill-red-600">a ≈ 2.7</text>
          
          {/* Points in S */}
          {[3, 4, 5, 6, 7].map(n => (
            <g key={n}>
              <circle cx={150 + n * 40} cy="60" r="5" fill="#059669" />
              <text x={150 + n * 40} y="90" textAnchor="middle" className="text-xs fill-green-600">{n}</text>
            </g>
          ))}
          
          {/* S label */}
          <text x="470" y="30" className="text-sm fill-green-700">S = {"{"}3, 4, 5, ...{"}"}</text>
        </svg>
        
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 mb-2">Step 3: S has a minimum element</h4>
          <p className="text-sm text-gray-700">
            Since S ⊂ ℤ is nonempty and bounded below, S has a <strong>minimum element</strong>. Call it m + 1.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            (This uses the well-ordering principle for integers, or can be derived from the least upper bound property.)
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
          <h4 className="font-semibold text-purple-800 mb-2">Step 4: Verify m &lt; a ≤ m + 1</h4>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Why m + 1 ≥ a?</strong> Because m + 1 ∈ S, and S = {"{"} n ∈ ℤ : n ≥ a {"}"}.
          </p>
          <p className="text-sm text-gray-700">
            <strong>Why m &lt; a?</strong> Because m + 1 is the <em>minimum</em> of S, so m ∉ S, meaning m &lt; a.
          </p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
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
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Part 2: Sequence Approaching From Below</h3>
      <p className="text-sm text-gray-600 mb-4">
        For any real x, there exists a Cauchy sequence (xₖ) with xₖ &lt; x for all k, and [xₖ] = x.
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          x = {x.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={x}
          onChange={(e) => setX(parseFloat(e.target.value))}
          className="w-64"
        />
      </div>
      
      <svg width="650" height="300" className="bg-white rounded-lg shadow">
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => {
          const y = yMin + i * (yMax - yMin) / 3;
          return (
            <g key={i}>
              <line x1="60" y1={scale(y, yMin, yMax, 260, 40)} x2="620" y2={scale(y, yMin, yMax, 260, 40)} stroke="#e5e7eb" strokeWidth="1" />
              <text x="45" y={scale(y, yMin, yMax, 260, 40) + 4} className="text-xs fill-gray-400">{y.toFixed(2)}</text>
            </g>
          );
        })}
        
        {/* Limit line x */}
        <line x1="60" y1={scale(x, yMin, yMax, 260, 40)} x2="620" y2={scale(x, yMin, yMax, 260, 40)} stroke="#dc2626" strokeWidth="2" />
        <text x="625" y={scale(x, yMin, yMax, 260, 40) + 4} className="text-sm font-semibold fill-red-600">x</text>
        
        {/* Shaded region above x (forbidden) */}
        <rect 
          x="60" 
          y="40" 
          width="560" 
          height={scale(x, yMin, yMax, 260, 40) - 40}
          fill="#fee2e2"
          opacity="0.3"
        />
        <text x="400" y="60" className="text-xs fill-red-400">xₖ never enters this region</text>
        
        {/* Sequence points */}
        {seq.map((val, i) => (
          <g key={i}>
            <circle 
              cx={70 + i * 28} 
              cy={scale(val, yMin, yMax, 260, 40)} 
              r="5" 
              fill="#059669"
              opacity="0.8"
            />
            {i < 5 && (
              <text 
                x={70 + i * 28} 
                y={scale(val, yMin, yMax, 260, 40) + 18} 
                textAnchor="middle" 
                className="text-xs fill-green-600"
              >
                {val.toFixed(2)}
              </text>
            )}
          </g>
        ))}
        
        {/* X-axis label */}
        <text x="340" y="290" textAnchor="middle" className="text-sm fill-gray-600">k (sequence index)</text>
        
        {/* Legend */}
        <g transform="translate(80, 25)">
          <circle cx="0" cy="0" r="5" fill="#059669" />
          <text x="10" y="4" className="text-xs fill-gray-600">xₖ = mₖ/k where mₖ &lt; kx ≤ mₖ + 1</text>
        </g>
      </svg>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-50 rounded-lg text-sm">
          <strong>Why xₖ &lt; x?</strong>
          <p className="text-gray-600 mt-1">
            From mₖ &lt; kx, we get mₖ/k &lt; x, so xₖ &lt; x.
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <strong>Why xₖ → x?</strong>
          <p className="text-gray-600 mt-1">
            From kx ≤ mₖ + 1, we get x - 1/k ≤ mₖ/k = xₖ, so x - 1/k ≤ xₖ &lt; x.
          </p>
        </div>
      </div>
    </div>
  );
}

function Part2ProofView() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Part 2: Proof Sketch</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
          <h4 className="font-semibold text-amber-800 mb-2">Step 1: Construct the sequence</h4>
          <p className="text-sm text-gray-700">
            For each k ∈ ℕ⁺, apply Part 1 to the real number kx:
          </p>
          <p className="text-sm text-gray-700 mt-2 font-mono bg-white p-2 rounded">
            Find mₖ ∈ ℤ such that mₖ &lt; kx ≤ mₖ + 1
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Define xₖ = mₖ / k ∈ ℚ.
          </p>
        </div>
        
        <svg width="600" height="140" className="bg-white rounded-lg shadow mx-auto">
          <line x1="50" y1="70" x2="550" y2="70" stroke="#374151" strokeWidth="2" />
          
          {/* mₖ */}
          <circle cx="150" cy="70" r="6" fill="white" stroke="#3b82f6" strokeWidth="2" />
          <text x="150" y="55" textAnchor="middle" className="text-sm fill-blue-600">mₖ</text>
          
          {/* kx */}
          <circle cx="320" cy="70" r="6" fill="#dc2626" />
          <text x="320" y="55" textAnchor="middle" className="text-sm font-bold fill-red-600">kx</text>
          
          {/* mₖ + 1 */}
          <circle cx="450" cy="70" r="6" fill="#3b82f6" />
          <text x="450" y="55" textAnchor="middle" className="text-sm fill-blue-600">mₖ + 1</text>
          
          {/* Interval highlight */}
          <line x1="150" y1="70" x2="450" y2="70" stroke="#3b82f6" strokeWidth="4" opacity="0.3" />
          
          {/* Inequality labels */}
          <text x="235" y="100" textAnchor="middle" className="text-xs fill-gray-600">mₖ &lt; kx</text>
          <text x="385" y="100" textAnchor="middle" className="text-xs fill-gray-600">kx ≤ mₖ + 1</text>
          
          {/* xₖ calculation */}
          <text x="300" y="125" textAnchor="middle" className="text-sm fill-green-700">xₖ = mₖ/k</text>
        </svg>
        
        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h4 className="font-semibold text-green-800 mb-2">Step 2: Show xₖ &lt; x for all k</h4>
          <p className="text-sm text-gray-700">
            From the left inequality mₖ &lt; kx:
          </p>
          <p className="text-sm font-mono bg-white p-2 rounded mt-2">
            mₖ &lt; kx → mₖ/k &lt; x → xₖ &lt; x ✓
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 mb-2">Step 3: Show xₖ is close to x</h4>
          <p className="text-sm text-gray-700">
            From the right inequality kx ≤ mₖ + 1:
          </p>
          <p className="text-sm font-mono bg-white p-2 rounded mt-2">
            kx ≤ mₖ + 1 → x ≤ (mₖ + 1)/k = mₖ/k + 1/k = xₖ + 1/k
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Rearranging: <strong>x - 1/k ≤ xₖ</strong>
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
          <h4 className="font-semibold text-purple-800 mb-2">Step 4: Combine the bounds</h4>
          <p className="text-sm text-gray-700">
            From Steps 2 and 3, we have:
          </p>
          <p className="text-sm font-mono bg-white p-2 rounded mt-2 text-center">
            x - 1/k ≤ xₖ &lt; x
          </p>
          <p className="text-sm text-gray-700 mt-2">
            This means |xₖ - x| &lt; 1/k → 0 as k → ∞.
          </p>
        </div>
        
        <svg width="600" height="100" className="bg-white rounded-lg shadow mx-auto">
          <line x1="100" y1="50" x2="500" y2="50" stroke="#374151" strokeWidth="2" />
          
          {/* x - 1/k */}
          <circle cx="180" cy="50" r="5" fill="#7c3aed" />
          <text x="180" y="35" textAnchor="middle" className="text-xs fill-purple-600">x - 1/k</text>
          
          {/* xₖ somewhere in between */}
          <circle cx="280" cy="50" r="6" fill="#059669" />
          <text x="280" y="75" textAnchor="middle" className="text-xs fill-green-600">xₖ lives here</text>
          
          {/* x */}
          <circle cx="380" cy="50" r="5" fill="#dc2626" />
          <text x="380" y="35" textAnchor="middle" className="text-xs fill-red-600">x</text>
          
          {/* Bracket */}
          <line x1="180" y1="55" x2="380" y2="55" stroke="#6b7280" strokeWidth="1" />
          <text x="280" y="95" textAnchor="middle" className="text-xs fill-gray-500">width ≤ 1/k → 0</text>
        </svg>
        
        <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
          <h4 className="font-semibold text-cyan-800 mb-2">Step 5: Verify it's Cauchy</h4>
          <p className="text-sm text-gray-700">
            For n, m ≥ N where 1/N &lt; ε/2:
          </p>
          <p className="text-sm font-mono bg-white p-2 rounded mt-2">
            |xₙ - xₘ| ≤ |xₙ - x| + |x - xₘ| &lt; 1/n + 1/m ≤ 2/N &lt; ε
          </p>
          <p className="text-sm text-gray-700 mt-2">
            So (xₖ) is Cauchy, and since |xₖ - x| → 0, we have [xₖ] = x.
          </p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
            <strong>Conclusion:</strong> (xₖ) is a Cauchy sequence of rationals with xₖ &lt; x for all k, and [xₖ] = x. ∎
          </p>
        </div>
      </div>
    </div>
  );
}

function WhyItMattersView() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Why This Exercise Matters</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🔧 Flexibility in Representatives</h4>
          <p className="text-sm text-gray-700">
            A real number x = [xₖ] can be represented by many different Cauchy sequences. 
            This exercise shows we can always choose one that approaches strictly from below 
            (or by symmetry, strictly from above).
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">📐 Used in Theorem 1.3.5 (LUB Property)</h4>
          <p className="text-sm text-gray-700">
            In the proof of the least upper bound property, we construct a sequence of upper bounds 
            that decreases toward the supremum. Having sequences approach from one side is crucial 
            for such constructions.
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">🎯 Strict vs Non-Strict Inequalities</h4>
          <p className="text-sm text-gray-700">
            Notice the subtle difference:
          </p>
          <ul className="text-sm text-gray-700 mt-2 ml-4 list-disc">
            <li>xₖ &lt; x for all k (strict inequality for each term)</li>
            <li>But [xₖ] = x, not [xₖ] &lt; x (equality at the limit)</li>
          </ul>
          <p className="text-sm text-gray-700 mt-2">
            This illustrates how strict inequalities can become non-strict when passing to limits.
          </p>
        </div>
        
        <div className="p-4 bg-amber-50 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">🔄 Alternative Constructions</h4>
          <p className="text-sm text-gray-700">
            Other ways to build sequences approaching from below:
          </p>
          <ul className="text-sm text-gray-700 mt-2 ml-4 list-disc">
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