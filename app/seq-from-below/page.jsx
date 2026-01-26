'use client';

import Link from 'next/link';
import Exercise17Visualization from '@/components/SeqFromBelow';

export default function SeqFromBelowPage() {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: 'rgba(136, 192, 208, 0.2)',
            border: '1px solid rgba(136, 192, 208, 0.4)',
            borderRadius: '8px',
            color: '#88c0d0',
            textDecoration: 'none',
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(136, 192, 208, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(136, 192, 208, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ← Back to Home
        </Link>
      </div>
      <Exercise17Visualization />
    </>
  );
}
