import React, { useState, useEffect } from 'react';

const CompactSetsVisualGuide = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [coveringDemo, setCoveringDemo] = useState({ showFinite: false, step: 0 });
  const [sequenceDemo, setSequenceDemo] = useState({ points: [], showSubseq: false });
  const [hoveredConcept, setHoveredConcept] = useState(null);

  // Generate sequence points for sequential compactness demo
  useEffect(() => {
    const pts = [];
    for (let i = 1; i <= 20; i++) {
      pts.push({
        x: 0.5 + 0.3 * Math.cos(i * 0.8) + (Math.random() - 0.5) * 0.15,
        y: 0.5 + 0.3 * Math.sin(i * 0.7) + (Math.random() - 0.5) * 0.15,
        index: i
      });
    }
    setSequenceDemo(prev => ({ ...prev, points: pts }));
  }, []);

  const sections = [
    { id: 'intro', title: 'What is Compactness?' },
    { id: 'open-cover', title: 'Open Coverings' },
    { id: 'finite-subcover', title: 'Finite Subcover' },
    { id: 'sequential', title: 'Sequential Compactness' },
    { id: 'equivalence', title: 'The Three Equivalences' },
    { id: 'examples', title: 'Examples & Non-Examples' }
  ];

  const OpenCoveringVisualization = () => {
    const [animationStep, setAnimationStep] = useState(0);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(timer);
    }, []);

    const openSets = [
      { cx: 30, cy: 50, r: 25, color: 'rgba(255, 107, 107, 0.3)', border: '#ff6b6b' },
      { cx: 50, cy: 35, r: 22, color: 'rgba(78, 205, 196, 0.3)', border: '#4ecdc4' },
      { cx: 70, cy: 50, r: 28, color: 'rgba(255, 230, 109, 0.3)', border: '#ffe66d' },
      { cx: 50, cy: 65, r: 24, color: 'rgba(149, 117, 205, 0.3)', border: '#9575cd' },
      { cx: 40, cy: 45, r: 20, color: 'rgba(100, 181, 246, 0.3)', border: '#64b5f6' },
      { cx: 60, cy: 55, r: 21, color: 'rgba(129, 199, 132, 0.3)', border: '#81c784' },
    ];

    return (
      <svg viewBox="0 0 100 100" className="w-full h-64">
        {/* Animated open sets */}
        {openSets.map((set, i) => (
          <g key={i}>
            <circle
              cx={set.cx}
              cy={set.cy}
              r={set.r + Math.sin(animationStep * 0.1 + i) * 2}
              fill={set.color}
              stroke={set.border}
              strokeWidth="0.5"
              strokeDasharray="2,1"
            />
          </g>
        ))}
        
        {/* The compact set (closed interval) */}
        <rect
          x="25"
          y="42"
          width="50"
          height="16"
          rx="2"
          fill="rgba(45, 52, 54, 0.8)"
          stroke="#dfe6e9"
          strokeWidth="1"
        />
        <text x="50" y="52" textAnchor="middle" fill="#dfe6e9" fontSize="4" fontFamily="serif">
          [a, b] — compact set
        </text>
        
        {/* Labels */}
        <text x="50" y="12" textAnchor="middle" fill="#b2bec3" fontSize="3.5" fontFamily="sans-serif">
          Open sets covering the compact set
        </text>
      </svg>
    );
  };

  const FiniteSubcoverVisualization = () => {
    const [showReduction, setShowReduction] = useState(false);

    const allSets = [
      { cx: 30, cy: 50, r: 25, essential: true },
      { cx: 50, cy: 35, r: 22, essential: false },
      { cx: 70, cy: 50, r: 28, essential: true },
      { cx: 50, cy: 65, r: 24, essential: false },
      { cx: 40, cy: 45, r: 20, essential: false },
      { cx: 60, cy: 55, r: 21, essential: false },
      { cx: 50, cy: 50, r: 30, essential: true },
    ];

    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowReduction(!showReduction)}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-medium hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg"
        >
          {showReduction ? 'Show All Open Sets' : 'Extract Finite Subcover'}
        </button>
        
        <svg viewBox="0 0 100 100" className="w-full h-64">
          {allSets.map((set, i) => {
            const visible = !showReduction || set.essential;
            return (
              <circle
                key={i}
                cx={set.cx}
                cy={set.cy}
                r={set.r}
                fill={set.essential ? 'rgba(255, 184, 77, 0.35)' : 'rgba(150, 150, 150, 0.2)'}
                stroke={set.essential ? '#ffb84d' : '#888'}
                strokeWidth={set.essential ? '1' : '0.3'}
                strokeDasharray="2,1"
                style={{
                  opacity: visible ? 1 : 0.1,
                  transition: 'all 0.5s ease-in-out'
                }}
              />
            );
          })}
          
          {/* The compact set */}
          <rect
            x="25"
            y="42"
            width="50"
            height="16"
            rx="2"
            fill="rgba(45, 52, 54, 0.9)"
            stroke="#f8f9fa"
            strokeWidth="1.5"
          />
          <text x="50" y="52" textAnchor="middle" fill="#f8f9fa" fontSize="4" fontFamily="serif">
            [a, b]
          </text>
          
          <text x="50" y="92" textAnchor="middle" fill="#b2bec3" fontSize="3" fontFamily="sans-serif">
            {showReduction ? '✓ Only 3 open sets needed!' : 'Infinitely many open sets...'}
          </text>
        </svg>
      </div>
    );
  };

  const SequentialCompactnessVisualization = () => {
    const [showConvergence, setShowConvergence] = useState(false);
    const [convergentSubseq, setConvergentSubseq] = useState([]);

    useEffect(() => {
      if (showConvergence && sequenceDemo.points.length > 0) {
        // Pick every 3rd point to form a "convergent subsequence"
        const subseq = sequenceDemo.points.filter((_, i) => i % 3 === 0);
        setConvergentSubseq(subseq);
      }
    }, [showConvergence, sequenceDemo.points]);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowConvergence(!showConvergence)}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg"
        >
          {showConvergence ? 'Show Full Sequence' : 'Find Convergent Subsequence'}
        </button>

        <svg viewBox="0 0 100 100" className="w-full h-64">
          {/* Compact set boundary (a disk) */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="rgba(45, 52, 54, 0.6)"
            stroke="#dfe6e9"
            strokeWidth="1.5"
          />
          <text x="50" y="95" textAnchor="middle" fill="#b2bec3" fontSize="3" fontFamily="serif">
            Compact set (closed bounded disk)
          </text>

          {/* Sequence points */}
          {sequenceDemo.points.map((pt, i) => {
            const isInSubseq = convergentSubseq.some(p => p.index === pt.index);
            const highlight = showConvergence && isInSubseq;
            
            return (
              <g key={i}>
                <circle
                  cx={pt.x * 100}
                  cy={pt.y * 100}
                  r={highlight ? 2.5 : 1.5}
                  fill={highlight ? '#4ecdc4' : '#ff6b6b'}
                  style={{
                    opacity: showConvergence ? (isInSubseq ? 1 : 0.2) : 0.8,
                    transition: 'all 0.5s ease-in-out'
                  }}
                />
                {highlight && (
                  <text
                    x={pt.x * 100 + 3}
                    y={pt.y * 100 - 2}
                    fill="#4ecdc4"
                    fontSize="2.5"
                  >
                    a_{pt.index}
                  </text>
                )}
              </g>
            );
          })}

          {/* Limit point indicator */}
          {showConvergence && (
            <g>
              <circle
                cx="50"
                cy="50"
                r="4"
                fill="none"
                stroke="#ffe66d"
                strokeWidth="1"
                strokeDasharray="2,1"
              >
                <animate
                  attributeName="r"
                  values="3;5;3"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <text x="50" y="43" textAnchor="middle" fill="#ffe66d" fontSize="3" fontWeight="bold">
                limit point
              </text>
            </g>
          )}
        </svg>
        
        <p className="text-sm text-slate-400 text-center">
          {showConvergence 
            ? "The highlighted subsequence converges to a limit inside the compact set!"
            : "Every sequence has infinitely many points..."}
        </p>
      </div>
    );
  };

  const EquivalenceCard = ({ title, description, icon, color }) => (
    <div 
      className={`p-5 rounded-xl border-2 ${color} bg-slate-800/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer`}
      onMouseEnter={() => setHoveredConcept(title)}
      onMouseLeave={() => setHoveredConcept(null)}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );

  const ExampleCard = ({ title, set, isCompact, reason }) => (
    <div className={`p-4 rounded-lg border ${isCompact ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-rose-500/50 bg-rose-900/20'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xl ${isCompact ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isCompact ? '✓' : '✗'}
        </span>
        <h4 className="font-bold text-white">{title}</h4>
      </div>
      <code className="block text-amber-300 font-mono text-sm mb-2">{set}</code>
      <p className="text-xs text-slate-400">{reason}</p>
    </div>
  );

  return (
    <div className="viz-page-container">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div
        className="viz-content-container"
        style={{ position: 'relative', zIndex: 1, paddingTop: '48px' }}
      >
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="viz-title">Compact Sets</h1>
          <p className="viz-subtitle">
            A Visual Guide for Math 20300 — Analysis in ℝⁿ
          </p>
          <div
            style={{
              marginTop: '1rem',
              height: '4px',
              width: '8rem',
              marginInline: 'auto',
              background:
                'linear-gradient(to right, transparent, #fbbf24, transparent)',
              borderRadius: '999px',
            }}
          />
        </header>

        {/* Navigation */}
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
          }}
        >
          {sections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(i)}
              className={`btn ${activeSection === i ? 'active' : 'secondary'}`}
            >
              {section.title}
            </button>
          ))}
        </nav>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 0: Introduction */}
          {activeSection === 0 && (
            <section className="proof-box">
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  fontWeight: 700,
                  color: '#fbbf24',
                  marginBottom: '1.5rem',
                }}
              >
                What is Compactness?
              </h2>

              <div>
                <p
                  style={{
                    color: 'rgba(226, 232, 240, 0.9)',
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem',
                  }}
                >
                  Compactness is one of the most important concepts in analysis. Intuitively, a compact set is 
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}> "small enough"</span> that certain nice properties hold—like 
                  being able to extract convergent subsequences from any sequence.
                </p>

                <div className="definition-box" style={{ marginBottom: '1.5rem' }}>
                  <h3
                    style={{
                      color: '#fcd34d',
                      fontWeight: 700,
                      marginBottom: '0.75rem',
                    }}
                  >
                    📜 Definition (Open Cover)
                  </h3>
                  <p className="math-text" style={{ color: '#e5e7eb' }}>
                    A subset A ⊂ ℝ is <strong style={{ color: 'white' }}>compact</strong> if every open covering of A 
                    has a <em style={{ color: '#fbbf24' }}>finite subcovering</em>.
                  </p>
                </div>

                <p style={{ color: '#9ca3af' }}>
                  In ℝ (and ℝⁿ), this is equivalent to being <strong style={{ color: '#2dd4bf' }}>closed</strong> and 
                  <strong style={{ color: '#2dd4bf' }}> bounded</strong>. This is the famous <em>Heine-Borel Theorem</em>!
                </p>
              </div>

              <div
                style={{
                  marginTop: '2rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div
                  className="card"
                  style={{
                    borderColor: 'rgba(45, 212, 191, 0.5)',
                    background: 'rgba(13, 148, 136, 0.15)',
                  }}
                >
                  <h4
                    style={{
                      fontWeight: 700,
                      color: '#5eead4',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Closed
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                    Contains all its accumulation points (complement is open)
                  </p>
                </div>
                <div
                  className="card"
                  style={{
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                    background: 'rgba(88, 28, 135, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontWeight: 700,
                      color: '#e9d5ff',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Bounded
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                    Contained in some interval [−M, M] for M ∈ ℝ
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 1: Open Coverings */}
          {activeSection === 1 && (
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif font-bold text-amber-300 mb-6">Open Coverings</h2>
              
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600 mb-6">
                <h3 className="text-slate-200 font-bold mb-3">📖 Definition</h3>
                <p className="text-slate-300">
                  An <strong className="text-amber-300">open covering</strong> of a set A is a collection of open sets 
                  {' {'}U<sub>i</sub>{'}'}<sub>i∈I</sub> such that A ⊂ ⋃<sub>i∈I</sub> U<sub>i</sub>.
                </p>
              </div>

              <OpenCoveringVisualization />

              <div className="mt-6 text-slate-400 text-sm">
                <p>
                  <strong className="text-white">Key insight:</strong> The dashed circles represent open sets. 
                  Notice how they overlap and together cover the entire compact set [a, b]. Each point in the set 
                  is contained in at least one open set.
                </p>
              </div>
            </section>
          )}

          {/* Section 2: Finite Subcover */}
          {activeSection === 2 && (
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif font-bold text-amber-300 mb-6">Finite Subcover Property</h2>
              
              <div className="bg-slate-900/50 rounded-xl p-6 border border-orange-500/30 mb-6">
                <h3 className="text-orange-300 font-bold mb-3">🔑 The Magic of Compactness</h3>
                <p className="text-slate-300">
                  No matter how many open sets you use to cover a compact set—even infinitely many—you can 
                  always find a <strong className="text-amber-300">finite</strong> number that still covers it!
                </p>
              </div>

              <FiniteSubcoverVisualization />

              <div className="mt-6 bg-slate-900/30 rounded-lg p-4 border border-slate-700">
                <h4 className="text-slate-200 font-bold mb-2">Why does this matter?</h4>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• <strong className="text-white">Finite ≈ Manageable:</strong> We can work with finitely many things!</li>
                  <li>• <strong className="text-white">Uniform properties:</strong> Enables uniform continuity, uniform convergence</li>
                  <li>• <strong className="text-white">Extrema exist:</strong> Continuous functions achieve max/min on compact sets</li>
                </ul>
              </div>
            </section>
          )}

          {/* Section 3: Sequential Compactness */}
          {activeSection === 3 && (
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif font-bold text-amber-300 mb-6">Sequential Compactness</h2>
              
              <div className="bg-slate-900/50 rounded-xl p-6 border border-teal-500/30 mb-6">
                <h3 className="text-teal-300 font-bold mb-3">📖 Definition</h3>
                <p className="text-slate-300">
                  A set A is <strong className="text-teal-300">sequentially compact</strong> if every sequence in A 
                  has a subsequence that converges to a point <em>in A</em>.
                </p>
              </div>

              <SequentialCompactnessVisualization />

              <div className="mt-6 bg-slate-900/30 rounded-lg p-4 border border-slate-700">
                <h4 className="text-slate-200 font-bold mb-2">The Bolzano-Weierstrass Connection</h4>
                <p className="text-sm text-slate-400">
                  This is closely related to the <strong className="text-amber-300">Bolzano-Weierstrass Theorem</strong>: 
                  every bounded sequence in ℝ has a convergent subsequence. For compact sets, we additionally 
                  need the limit to be <em>inside</em> the set—which is guaranteed by closedness!
                </p>
              </div>
            </section>
          )}

          {/* Section 4: Equivalences */}
          {activeSection === 4 && (
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif font-bold text-amber-300 mb-6">The Three Equivalences</h2>
              
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-500/30 mb-8">
                <h3 className="text-amber-300 font-bold mb-3">⚡ Lemma 2.3.4 (from your notes)</h3>
                <p className="text-slate-200">
                  For A ⊂ ℝ, the following are <strong className="text-white">equivalent</strong>:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <EquivalenceCard
                  title="Bounded & Closed"
                  description="A is contained in some interval [−M, M] and contains all its accumulation points."
                  icon="📦"
                  color="border-emerald-500/50"
                />
                <EquivalenceCard
                  title="Compact"
                  description="Every open covering of A has a finite subcovering."
                  icon="🎯"
                  color="border-amber-500/50"
                />
                <EquivalenceCard
                  title="Seq. Compact"
                  description="Every sequence in A has a convergent subsequence with limit in A."
                  icon="🔄"
                  color="border-purple-500/50"
                />
              </div>

              <div className="relative">
                <svg viewBox="0 0 300 100" className="w-full h-32">
                  {/* Circular arrows connecting the three concepts */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
                    </marker>
                  </defs>
                  
                  <path
                    d="M 60 50 Q 150 10 240 50"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  <path
                    d="M 240 50 Q 150 90 60 50"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  
                  <text x="60" y="55" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">1</text>
                  <text x="150" y="55" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">2</text>
                  <text x="240" y="55" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="bold">3</text>
                </svg>
                <p className="text-center text-slate-400 text-sm">All three definitions are equivalent in ℝ and ℝⁿ!</p>
              </div>
            </section>
          )}

          {/* Section 5: Examples */}
          {activeSection === 5 && (
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif font-bold text-amber-300 mb-6">Examples & Non-Examples</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <ExampleCard
                  title="Closed Interval"
                  set="[0, 1]"
                  isCompact={true}
                  reason="Closed (contains endpoints) and bounded. The classic compact set!"
                />
                <ExampleCard
                  title="Open Interval"
                  set="(0, 1)"
                  isCompact={false}
                  reason="Not closed! The sequence 1/n converges to 0, which is outside (0,1)."
                />
                <ExampleCard
                  title="Closed Ball in ℝⁿ"
                  set="B̄(0, r) = {x ∈ ℝⁿ : ||x|| ≤ r}"
                  isCompact={true}
                  reason="Closed and bounded in ℝⁿ. Heine-Borel applies!"
                />
                <ExampleCard
                  title="Real Line"
                  set="ℝ"
                  isCompact={false}
                  reason="Not bounded! The sequence n = 1, 2, 3, ... has no convergent subsequence."
                />
                <ExampleCard
                  title="Cantor Set"
                  set="C ⊂ [0, 1]"
                  isCompact={true}
                  reason="Intersection of closed sets, hence closed. Subset of [0,1], hence bounded."
                />
                <ExampleCard
                  title="Integers"
                  set="ℤ = {..., -2, -1, 0, 1, 2, ...}"
                  isCompact={false}
                  reason="Closed but not bounded. Discrete points go to infinity."
                />
                <ExampleCard
                  title="Finite Set"
                  set="{x₁, x₂, ..., xₙ}"
                  isCompact={true}
                  reason="Always compact! Any finite set is closed and bounded."
                />
                <ExampleCard
                  title="Half-Open Interval"
                  set="[0, 1)"
                  isCompact={false}
                  reason="Not closed! 1 - 1/n converges to 1, which is not in the set."
                />
              </div>

              <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border border-amber-500/20">
                <h3 className="text-amber-300 font-bold mb-3">💡 Quick Test for Compactness in ℝ</h3>
                <ol className="text-slate-300 space-y-2 list-decimal list-inside">
                  <li><strong className="text-white">Check boundedness:</strong> Is it contained in some [−M, M]?</li>
                  <li><strong className="text-white">Check closedness:</strong> Does it contain all limit points?</li>
                  <li>If both ✓, then <span className="text-emerald-400 font-bold">compact!</span></li>
                </ol>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-4" />
          <p>Math 20300 — Analysis in ℝⁿ | Winter 2026</p>
          <p className="mt-1 text-slate-600">Based on Boller & Sally, Lemma 2.3.4</p>
        </footer>
      </div>
    </div>
  );
};

export default CompactSetsVisualGuide;