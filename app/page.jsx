'use client';

import Link from 'next/link';

const visualizations = [
  {
    id: 'heine-borel',
    title: 'Heine-Borel Theorem',
    description: 'Proof by Contradiction using Interval Bisection',
    route: '/heine-borel',
  },
  {
    id: 'open-closed-sets',
    title: 'Open vs. Closed Sets',
    description: 'Understanding topology in ℝ through visualization',
    route: '/open-closed-sets',
  },
  {
    id: 'open-covering',
    title: 'Open Covering',
    description: 'Visualizing open coverings and finite subcovers',
    route: '/open-covering',
  },
  {
    id: 'order-viz',
    title: 'Order on Real Numbers',
    description: 'Well-definedness, totality, and compatibility of order',
    route: '/order-viz',
  },
  {
    id: 'seq-limits',
    title: 'Sequences and Limits',
    description: 'Lemma 1.3.3: Sequences and their limits',
    route: '/seq-limits',
  },
  {
    id: 'seq-from-below',
    title: 'Sequences from Below',
    description: 'Understanding sequences approaching from below',
    route: '/seq-from-below',
  },
  {
    id: 'root2',
    title: 'Trapping √2 Between Rationals',
    description: 'Finding rational approximations to irrational numbers',
    route: '/root2',
  },
  {
    id: 'closed-accumulation-points',
    title: 'Closed Sets and Accumulation Points',
    description: 'Understanding closed sets through accumulation points',
    route: '/closed-accumulation-points',
  },
  {
    id: 'closed-accumulation-points-rev',
    title: 'Closed Sets and Accumulation Points (Reverse)',
    description: 'Reverse direction: accumulation points imply closed',
    route: '/closed-accumulation-points-rev',
  },
  {
    id: 'compact-set',
    title: 'Compact Sets',
    description: 'A visual guide to compactness: open coverings, finite subcovers, and sequential compactness',
    route: '/compact-set',
  },
];

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
      fontFamily: '"Source Serif 4", Georgia, serif',
      color: '#e6edf3',
      padding: '60px 20px'
    }}>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #88c0d0 0%, #81a1c1 50%, #b48ead 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Real Analysis Visualizations
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          opacity: 0.7, 
          marginBottom: '48px', 
          fontSize: '1.2rem' 
        }}>
          Interactive visualizations of key theorems and proofs
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '40px'
        }}>
          {visualizations.map((viz) => (
            <Link 
              key={viz.id}
              href={viz.route}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, rgba(136, 192, 208, 0.1) 0%, rgba(129, 140, 248, 0.1) 100%)',
                border: '1px solid rgba(136, 192, 208, 0.3)',
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(136, 192, 208, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(136, 192, 208, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(136, 192, 208, 0.3)';
              }}
              >
                <h2 style={{
                  margin: '0 0 12px 0',
                  color: '#88c0d0',
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  {viz.title}
                </h2>
                <p style={{
                  margin: 0,
                  opacity: 0.8,
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  flex: 1
                }}>
                  {viz.description}
                </p>
                <div style={{
                  marginTop: '20px',
                  color: '#88c0d0',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  View visualization →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {visualizations.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            opacity: 0.6
          }}>
            <p>No visualizations available yet.</p>
            <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>
              Create visualization components in the <code style={{
                background: 'rgba(136, 192, 208, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'Fira Code'
              }}>components/</code> directory and add routes in <code style={{
                background: 'rgba(136, 192, 208, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'Fira Code'
              }}>app/</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
