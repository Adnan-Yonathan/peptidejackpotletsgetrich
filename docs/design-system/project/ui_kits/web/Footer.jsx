// PeptidePros UI Kit — Footer Component
// Source: src/components/layout/Footer.tsx

function Footer({ onNavigate }) {
  const footerStyle = {
    borderTop: '1px solid #e2e8f0',
    background: 'oklch(0.97 0 0 / 0.4)',
    padding: '40px 20px 24px',
    fontFamily: 'inherit',
  };

  const colHead = { fontWeight: 600, fontSize: 12, marginBottom: 10, color: '#0f172a' };
  const link = { fontSize: 12, color: '#64748b', cursor: 'pointer', lineHeight: '28px', display: 'block', background: 'none', border: 'none', padding: 0, textAlign: 'left' };

  return (
    <footer style={footerStyle}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <button onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 15, color: '#103b2c', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 8 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0f6a52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2h6M10 2v7L4 19a2.5 2.5 0 0 0 2 4h12a2.5 2.5 0 0 0 2-4L14 9V2"/>
                <line x1="6" y1="15" x2="18" y2="15"/>
              </svg>
              PeptidePros
            </button>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, maxWidth: 220 }}>The trusted decision engine for peptide research. Compare, plan, and track with confidence.</p>
          </div>
          <div>
            <p style={colHead}>Research</p>
            {['Peptide Directory', 'Vendor Comparison', 'Stack Builder'].map(t => (
              <button key={t} style={link}>{t}</button>
            ))}
          </div>
          <div>
            <p style={colHead}>Get Started</p>
            {['Find Your Plan', 'Pricing', 'About'].map(t => (
              <button key={t} style={link}>{t}</button>
            ))}
          </div>
          <div>
            <p style={colHead}>Legal</p>
            <button style={link}>Privacy Policy</button>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 11, color: '#94a3b8' }}>© 2026 PeptidePros. All rights reserved.</p>
          <p style={{ fontSize: 11, color: '#94a3b8' }}>For educational and research purposes only. Not medical advice.</p>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
