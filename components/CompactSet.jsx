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
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
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
        <text x="50" y="52" textAnchor="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="4" fontFamily="var(--font-primary)">
          [a, b] — compact set
        </text>
        
        {/* Labels */}
        <text x="50" y="12" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="3.5" fontFamily="var(--font-primary)">
          Open sets covering the compact set
        </text>
        </svg>
      </div>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={() => setShowReduction(!showReduction)}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            alignSelf: 'flex-start',
          }}
        >
          {showReduction ? 'Show All Open Sets' : 'Extract Finite Subcover'}
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
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
          <text x="50" y="52" textAnchor="middle" fill="rgba(255, 255, 255, 0.95)" fontSize="4" fontFamily="var(--font-primary)">
            [a, b]
          </text>
          
          <text x="50" y="92" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="3" fontFamily="var(--font-primary)">
            {showReduction ? '✓ Only 3 open sets needed!' : 'Infinitely many open sets...'}
          </text>
          </svg>
        </div>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={() => setShowConvergence(!showConvergence)}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
            alignSelf: 'flex-start',
          }}
        >
          {showConvergence ? 'Show Full Sequence' : 'Find Convergent Subsequence'}
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
            {/* Compact set boundary (a disk) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="rgba(13, 17, 23, 0.4)"
              stroke="rgba(136, 192, 208, 0.4)"
              strokeWidth="1.5"
            />
            <text x="50" y="95" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="3" fontFamily="var(--font-primary)">
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
                  fill={highlight ? '#88c0d0' : '#e94560'}
                  style={{
                    opacity: showConvergence ? (isInSubseq ? 1 : 0.2) : 0.8,
                    transition: 'all 0.5s ease-in-out'
                  }}
                />
                {highlight && (
                    <text
                      x={pt.x * 100 + 3}
                      y={pt.y * 100 - 2}
                      fill="#88c0d0"
                      fontSize="2.5"
                      fontFamily="var(--font-mono)"
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
              <text x="50" y="43" textAnchor="middle" fill="#ebcb8b" fontSize="3" fontWeight="bold" fontFamily="var(--font-primary)">
                limit point
              </text>
            </g>
          )}
          </svg>
        </div>
        
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          margin: '0.5rem 0 0 0',
        }}>
          {showConvergence 
            ? "The highlighted subsequence converges to a limit inside the compact set!"
            : "Every sequence has infinitely many points..."}
        </p>
      </div>
    );
  };

  const EquivalenceCard = ({ title, description, icon, color }) => {
    const colorMap = {
      'border-emerald-500/50': { border: 'rgba(16, 185, 129, 0.5)', bg: 'rgba(6, 78, 59, 0.15)' },
      'border-amber-500/50': { border: 'rgba(245, 158, 11, 0.5)', bg: 'rgba(120, 53, 15, 0.15)' },
      'border-purple-500/50': { border: 'rgba(168, 85, 247, 0.5)', bg: 'rgba(88, 28, 135, 0.15)' },
    };
    const colors = colorMap[color] || { border: 'rgba(136, 192, 208, 0.5)', bg: 'rgba(13, 17, 23, 0.3)' };
    
    return (
      <div 
        className="card"
        style={{
          padding: '1.25rem',
          borderRadius: '12px',
          border: `2px solid ${colors.border}`,
          background: colors.bg,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          setHoveredConcept(title);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          setHoveredConcept(null);
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          {title}
        </h4>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          {description}
        </p>
      </div>
    );
  };

  const ExampleCard = ({ title, set, isCompact, reason }) => (
    <div
      className="card"
      style={{
        padding: '1rem',
        borderRadius: '8px',
        border: `1px solid ${isCompact ? 'rgba(16, 185, 129, 0.5)' : 'rgba(244, 63, 94, 0.5)'}`,
        background: isCompact ? 'rgba(6, 78, 59, 0.15)' : 'rgba(127, 29, 29, 0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{
          fontSize: '1.25rem',
          color: isCompact ? '#10b981' : '#f43f5e',
        }}>
          {isCompact ? '✓' : '✗'}
        </span>
        <h4 style={{
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          {title}
        </h4>
      </div>
      <code style={{
        display: 'block',
        color: '#fbbf24',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
      }}>
        {set}
      </code>
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        margin: 0,
      }}>
        {reason}
      </p>
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
            <section className="proof-box" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
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
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    margin: 0,
                    lineHeight: 1.7,
                  }}>
                    A subset A ⊂ ℝ is <strong style={{ color: 'var(--text-primary)' }}>compact</strong> if every open covering of A 
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
            <section className="proof-box" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: '#fbbf24',
                marginBottom: '1.5rem',
              }}>
                Open Coverings
              </h2>
              
              <div className="definition-box" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                }}>
                  📖 Definition
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.7,
                }}>
                  An <strong style={{ color: '#fbbf24' }}>open covering</strong> of a set A is a collection of open sets 
                  {' {'}U<sub>i</sub>{'}'}<sub>i∈I</sub> such that A ⊂ ⋃<sub>i∈I</sub> U<sub>i</sub>.
                </p>
              </div>

              <OpenCoveringVisualization />

              <div className="proof-box" style={{
                marginTop: '1.5rem',
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
                  The dashed circles represent open sets. 
                  Notice how they overlap and together cover the entire compact set [a, b]. Each point in the set 
                  is contained in at least one open set.
                </p>
              </div>
            </section>
          )}

          {/* Section 2: Finite Subcover */}
          {activeSection === 2 && (
            <section className="proof-box" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: '#fbbf24',
                marginBottom: '1.5rem',
              }}>
                Finite Subcover Property
              </h2>
              
              <div className="definition-box" style={{
                marginBottom: '1.5rem',
                borderLeftColor: '#f59e0b',
              }}>
                <h3 style={{
                  color: '#f59e0b',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                }}>
                  🔑 The Magic of Compactness
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.7,
                }}>
                  No matter how many open sets you use to cover a compact set—even infinitely many—you can 
                  always find a <strong style={{ color: '#fbbf24' }}>finite</strong> number that still covers it!
                </p>
              </div>

              <FiniteSubcoverVisualization />

              <div className="proof-box" style={{
                marginTop: '1.5rem',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(136, 192, 208, 0.2)',
              }}>
                <h4 style={{
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem',
                }}>
                  Why does this matter?
                </h4>
                <ul style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  paddingLeft: '1.5rem',
                  lineHeight: 1.8,
                }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Finite ≈ Manageable:</strong> We can work with finitely many things!</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Uniform properties:</strong> Enables uniform continuity, uniform convergence</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Extrema exist:</strong> Continuous functions achieve max/min on compact sets</li>
                </ul>
              </div>
            </section>
          )}

          {/* Section 3: Sequential Compactness */}
          {activeSection === 3 && (
            <section className="proof-box" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: '#fbbf24',
                marginBottom: '1.5rem',
              }}>
                Sequential Compactness
              </h2>
              
              <div className="definition-box" style={{
                marginBottom: '1.5rem',
                borderLeftColor: '#14b8a6',
              }}>
                <h3 style={{
                  color: '#14b8a6',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                }}>
                  📖 Definition
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.7,
                }}>
                  A set A is <strong style={{ color: '#14b8a6' }}>sequentially compact</strong> if every sequence in A 
                  has a subsequence that converges to a point <em>in A</em>.
                </p>
              </div>

              <SequentialCompactnessVisualization />

              <div className="proof-box" style={{
                marginTop: '1.5rem',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(136, 192, 208, 0.2)',
              }}>
                <h4 style={{
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem',
                }}>
                  The Bolzano-Weierstrass Connection
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  This is closely related to the <strong style={{ color: '#fbbf24' }}>Bolzano-Weierstrass Theorem</strong>: 
                  every bounded sequence in ℝ has a convergent subsequence. For compact sets, we additionally 
                  need the limit to be <em>inside</em> the set—which is guaranteed by closedness!
                </p>
              </div>
            </section>
          )}

          {/* Section 4: Equivalences */}
          {activeSection === 4 && (
            <section className="proof-box" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: '#fbbf24',
                marginBottom: '1.5rem',
              }}>
                The Three Equivalences
              </h2>
              
              <div className="definition-box" style={{
                marginBottom: '2rem',
                borderLeftColor: '#fbbf24',
                background: 'rgba(120, 53, 15, 0.15)',
              }}>
                <h3 style={{
                  color: '#fbbf24',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                }}>
                  ⚡ Lemma 2.3.4 (from your notes)
                </h3>
                <p style={{
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.7,
                }}>
                  For A ⊂ ℝ, the following are <strong>equivalent</strong>:
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}>
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
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <svg viewBox="0 0 300 100" style={{ width: '100%', maxWidth: '600px', height: 'auto' }}>
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
                  
                  <text x="60" y="55" textAnchor="middle" fill="#a3be8c" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)">1</text>
                  <text x="150" y="55" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)">2</text>
                  <text x="240" y="55" textAnchor="middle" fill="#b48ead" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)">3</text>
                  </svg>
                </div>
                <p style={{
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  margin: '0.5rem 0 0 0',
                }}>
                  All three definitions are equivalent in ℝ and ℝⁿ!
                </p>
              </div>
            </section>
          )}

          {/* Section 5: Examples */}
          {activeSection === 5 && (
            <section className="proof-box" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: '#fbbf24',
                marginBottom: '1.5rem',
              }}>
                Examples & Non-Examples
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
              }}>
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

              <div className="proof-box" style={{
                marginTop: '2rem',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}>
                <h3 style={{
                  color: '#fbbf24',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                }}>
                  💡 Quick Test for Compactness in ℝ
                </h3>
                <ol style={{
                  color: 'var(--text-secondary)',
                  margin: 0,
                  paddingLeft: '1.5rem',
                  lineHeight: 1.8,
                  fontSize: '0.95rem',
                }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Check boundedness:</strong> Is it contained in some [−M, M]?</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Check closedness:</strong> Does it contain all limit points?</li>
                  <li>If both ✓, then <span style={{ color: '#10b981', fontWeight: 700 }}>compact!</span></li>
                </ol>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactSetsVisualGuide;