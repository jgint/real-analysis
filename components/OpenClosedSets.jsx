'use client';

import React, { useState } from 'react';

export default function OpenClosedSetsVisualization() {
  const [selectedExample, setSelectedExample] = useState('interval');
  const [showProperty, setShowProperty] = useState(null);

  const examples = {
    interval: {
      name: 'Intervals',
      open: { notation: '(a, b)', description: 'Open interval - excludes endpoints' },
      closed: { notation: '[a, b]', description: 'Closed interval - includes endpoints' },
      neither: { notation: '[a, b)', description: 'Half-open - neither open nor closed' }
    },
    special: {
      name: 'Special Cases',
      open: { notation: 'ℝ, ∅', description: 'The entire real line and empty set' },
      closed: { notation: 'ℝ, ∅', description: 'Also closed! (clopen sets)' },
      neither: { notation: '(0, 1] ∪ (2, 3)', description: 'Mixed unions' }
    },
    discrete: {
      name: 'Discrete Sets',
      open: { notation: '∅', description: 'No isolated points form open sets' },
      closed: { notation: 'ℤ, {5}', description: 'All discrete sets are closed' },
      neither: { notation: '—', description: 'Not applicable' }
    }
  };

  return (
    <div className="viz-page-container">
      <div className="viz-content-container">
        <h1 className="viz-title">
          Open vs. Closed Sets
        </h1>
        
        <p className="viz-subtitle">
          Understanding topology in ℝ through visualization
        </p>

        {/* Core Definitions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="definition-box" style={{ borderLeftColor: 'var(--color-primary)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#4fc3f7', fontSize: '1.1rem' }}>
              🔓 Open Set
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>
              A set <span className="math-text">S ⊆ ℝ</span> is <strong>open</strong> if for every point 
              <span className="math-text"> x ∈ S</span>, there exists <span className="math-text">ε {'>'} 0</span> such that 
              <span className="math-text"> (x - ε, x + ε) ⊂ S</span>.
            </p>
          </div>
          
          <div className="definition-box" style={{ borderLeftColor: 'var(--color-error)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#e94560', fontSize: '1.1rem' }}>
              🔒 Closed Set
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>
              A set <span className="math-text">S ⊆ ℝ</span> is <strong>closed</strong> if it contains 
              all its accumulation points. Equivalently, its complement 
              <span className="math-text"> ℝ \ S</span> is open.
            </p>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="visualization-container" style={{ padding: '32px', marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 24px 0', textAlign: 'center', color: '#4fc3f7' }}>
            Visual Comparison
          </h2>
          
          {/* SVG Visualization */}
          <svg viewBox="0 0 700 400" style={{ width: '100%', height: 'auto' }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              </pattern>
              
              {/* Gradient for open set */}
              <linearGradient id="openGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#4fc3f7', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: '#4fc3f7', stopOpacity: 0.7}} />
              </linearGradient>
              
              {/* Gradient for closed set */}
              <linearGradient id="closedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#e94560', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: '#e94560', stopOpacity: 0.7}} />
              </linearGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Open Set (a, b) */}
            <g>
              <text x="350" y="80" textAnchor="middle" fill="#4fc3f7" fontSize="24" fontWeight="600">
                Open Set: (a, b)
              </text>
              
              {/* Number line */}
              <line x1="100" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <polygon points="600,120 595,117 595,123" fill="rgba(255,255,255,0.3)" />
              
              {/* Open interval */}
              <line x1="200" y1="120" x2="500" y2="120" stroke="url(#openGradient)" strokeWidth="12" strokeLinecap="round" />
              
              {/* Excluded endpoints (hollow circles) */}
              <circle cx="200" cy="120" r="10" fill="rgba(0,0,0,0.5)" stroke="#4fc3f7" strokeWidth="3" />
              <circle cx="500" cy="120" r="10" fill="rgba(0,0,0,0.5)" stroke="#4fc3f7" strokeWidth="3" />
              
              {/* Labels */}
              <text x="200" y="155" textAnchor="middle" fill="#4fc3f7" fontSize="18" className="math-text">a</text>
              <text x="500" y="155" textAnchor="middle" fill="#4fc3f7" fontSize="18" className="math-text">b</text>
              
              {/* Epsilon neighborhood illustration */}
              <g opacity="0.8">
                <circle cx="350" cy="120" r="4" fill="#fff" />
                <text x="350" y="110" textAnchor="middle" fill="#fff" fontSize="14" className="math-text">x</text>
                
                {/* Epsilon brackets */}
                <line x1="300" y1="105" x2="300" y2="135" stroke="#2ecc71" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="400" y1="105" x2="400" y2="135" stroke="#2ecc71" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="300" y1="145" x2="400" y2="145" stroke="#2ecc71" strokeWidth="2" />
                <text x="350" y="165" textAnchor="middle" fill="#2ecc71" fontSize="14" className="math-text">
                  (x - ε, x + ε) ⊂ S
                </text>
              </g>
            </g>
            
            {/* Closed Set [a, b] */}
            <g>
              <text x="350" y="240" textAnchor="middle" fill="#e94560" fontSize="24" fontWeight="600">
                Closed Set: [a, b]
              </text>
              
              {/* Number line */}
              <line x1="100" y1="280" x2="600" y2="280" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <polygon points="600,280 595,277 595,283" fill="rgba(255,255,255,0.3)" />
              
              {/* Closed interval */}
              <line x1="200" y1="280" x2="500" y2="280" stroke="url(#closedGradient)" strokeWidth="12" strokeLinecap="round" />
              
              {/* Included endpoints (filled circles) */}
              <circle cx="200" cy="280" r="10" fill="#e94560" />
              <circle cx="500" cy="280" r="10" fill="#e94560" />
              
              {/* Labels */}
              <text x="200" y="315" textAnchor="middle" fill="#e94560" fontSize="18" className="math-text">a</text>
              <text x="500" y="315" textAnchor="middle" fill="#e94560" fontSize="18" className="math-text">b</text>
              
              {/* Accumulation point illustration */}
              <g opacity="0.8">
                {/* Sequence approaching endpoint */}
                {[460, 475, 485, 492, 496].map((x, i) => (
                  <circle key={i} cx={x} cy="280" r="3" fill="#ffd700" opacity={0.6 + i * 0.1} />
                ))}
                <text x="450" y="265" textAnchor="middle" fill="#ffd700" fontSize="12" className="math-text">
                  xₙ → b
                </text>
                <text x="450" y="305" textAnchor="middle" fill="#ffd700" fontSize="12" className="math-text">
                  limit ∈ S ✓
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Key Visual Differences */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#fff', textAlign: 'center' }}>
            🎯 Key Visual Differences
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{
              background: 'rgba(79, 195, 247, 0.1)',
              border: '1px solid rgba(79, 195, 247, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>○</div>
              <h4 style={{ margin: '0 0 8px 0', color: '#4fc3f7' }}>Open Sets</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Hollow circles<br/>Endpoints excluded
              </p>
            </div>
            
            <div style={{
              background: 'rgba(233, 69, 96, 0.1)',
              border: '1px solid rgba(233, 69, 96, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>●</div>
              <h4 style={{ margin: '0 0 8px 0', color: '#e94560' }}>Closed Sets</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Filled circles<br/>Endpoints included
              </p>
            </div>
            
            <div style={{
              background: 'rgba(46, 204, 113, 0.1)',
              border: '1px solid rgba(46, 204, 113, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ε</div>
              <h4 style={{ margin: '0 0 8px 0', color: '#2ecc71' }}>Wiggle Room</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Open: every point has ε-neighborhood
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>→</div>
              <h4 style={{ margin: '0 0 8px 0', color: '#ffd700' }}>Limits</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Closed: contains all accumulation points
              </p>
            </div>
          </div>
        </div>

        {/* Examples by Category */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
            📚 Examples by Category
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            {Object.keys(examples).map(key => (
              <button
                key={key}
                className={`btn ${selectedExample === key ? 'active' : 'secondary'}`}
                onClick={() => setSelectedExample(key)}
              >
                {examples[key].name}
              </button>
            ))}
          </div>
          
          <div className="slide-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div className="card open-card">
              <h3 style={{ margin: '0 0 12px 0', color: '#4fc3f7' }}>Open</h3>
              <div className="math-text" style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#fff' }}>
                {examples[selectedExample].open.notation}
              </div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                {examples[selectedExample].open.description}
              </p>
            </div>
            
            <div className="card closed-card">
              <h3 style={{ margin: '0 0 12px 0', color: '#e94560' }}>Closed</h3>
              <div className="math-text" style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#fff' }}>
                {examples[selectedExample].closed.notation}
              </div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                {examples[selectedExample].closed.description}
              </p>
            </div>
            
            <div className="card neither-card">
              <h3 style={{ margin: '0 0 12px 0', color: '#9c27b0' }}>Neither</h3>
              <div className="math-text" style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#fff' }}>
                {examples[selectedExample].neither.notation}
              </div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                {examples[selectedExample].neither.description}
              </p>
            </div>
          </div>
        </div>

        {/* Property Explorer */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
            🔍 Test Your Understanding
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {['union', 'intersection', 'complement', 'bounded'].map(prop => (
              <button
                key={prop}
                className={`btn ${showProperty === prop ? '' : 'secondary'}`}
                onClick={() => setShowProperty(showProperty === prop ? null : prop)}
              >
                {prop.charAt(0).toUpperCase() + prop.slice(1)}
              </button>
            ))}
          </div>
          
          {showProperty && (
            <div className="slide-in" style={{
              marginTop: '24px',
              padding: '20px',
              background: 'rgba(79, 195, 247, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(79, 195, 247, 0.3)'
            }}>
              {showProperty === 'union' && (
                <>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4fc3f7' }}>Union Properties</h4>
                  <p style={{ margin: '0 0 8px 0' }}>✓ <strong>Open:</strong> Arbitrary union of open sets is open</p>
                  <p style={{ margin: 0 }}>✓ <strong>Closed:</strong> Finite union of closed sets is closed</p>
                  <p style={{ margin: '8px 0 0 0', opacity: 0.7, fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Infinite union of closed sets need not be closed! Example: ⋃[1/n, 1] = (0, 1]
                  </p>
                </>
              )}
              
              {showProperty === 'intersection' && (
                <>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4fc3f7' }}>Intersection Properties</h4>
                  <p style={{ margin: '0 0 8px 0' }}>✓ <strong>Open:</strong> Finite intersection of open sets is open</p>
                  <p style={{ margin: 0 }}>✓ <strong>Closed:</strong> Arbitrary intersection of closed sets is closed</p>
                  <p style={{ margin: '8px 0 0 0', opacity: 0.7, fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Infinite intersection of open sets need not be open! Example: ⋂(-1/n, 1/n) = {'{0}'}
                  </p>
                </>
              )}
              
              {showProperty === 'complement' && (
                <>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4fc3f7' }}>Complement Property</h4>
                  <p style={{ margin: '0 0 8px 0' }}>✓ If S is open, then ℝ \ S is closed</p>
                  <p style={{ margin: 0 }}>✓ If S is closed, then ℝ \ S is open</p>
                  <p style={{ margin: '8px 0 0 0', opacity: 0.7, fontSize: '0.9rem', fontStyle: 'italic' }}>
                    This is actually the definition of a closed set!
                  </p>
                </>
              )}
              
              {showProperty === 'bounded' && (
                <>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4fc3f7' }}>Relationship with Boundedness</h4>
                  <p style={{ margin: '0 0 8px 0' }}>✗ Open ≠ Bounded. Example: (0, ∞) is open but unbounded</p>
                  <p style={{ margin: 0 }}>✗ Closed ≠ Bounded. Example: [0, ∞) is closed but unbounded</p>
                  <p style={{ margin: '8px 0 0 0', opacity: 0.7, fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Closed AND Bounded ⟺ Compact (Heine-Borel Theorem)
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Final Summary */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.1) 0%, rgba(233, 69, 96, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.4rem' }}>
            💡 Key Takeaway
          </h3>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Open and closed are <strong>not opposites</strong>! A set can be both (ℝ, ∅), neither ([0, 1)), 
            or just one. Think of <span style={{color: '#4fc3f7'}}>"open"</span> as having wiggle room 
            around every point, and <span style={{color: '#e94560'}}>"closed"</span> as containing all 
            the points you can reach by taking limits.
          </p>
        </div>
      </div>
    </div>
  );
}