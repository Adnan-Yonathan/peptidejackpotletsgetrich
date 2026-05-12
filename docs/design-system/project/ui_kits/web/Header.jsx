// PeptidePros UI Kit — Header Component
// Source: src/components/layout/Header.tsx

function Header({ currentPage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navLinks = [
    { href: 'peptides', label: 'Peptides' },
    { href: 'stack-builder', label: 'Stack Builder' },
    { href: 'guides', label: 'Guides' },
    { href: 'vendors', label: 'Vendors' },
    { href: 'quiz', label: 'Find Your Plan' },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, width: '100%',
      borderBottom: '1px solid #e2e8f0',
      background: 'rgba(251,250,247,0.96)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <button onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 18, color: '#103b2c', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f6a52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2h6M10 2v7L4 19a2.5 2.5 0 0 0 2 4h12a2.5 2.5 0 0 0 2-4L14 9V2"/>
            <line x1="6" y1="15" x2="18" y2="15"/>
          </svg>
          PeptidePros
        </button>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(link => (
            <button key={link.href} onClick={() => onNavigate(link.href)} style={{
              padding: '6px 12px', borderRadius: 9999, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 150ms',
              background: currentPage === link.href ? '#e7f4ee' : 'transparent',
              color: currentPage === link.href ? '#0f6a52' : '#475569',
            }}>{link.label}</button>
          ))}
        </nav>

        {/* Auth */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'transparent', border: '1px solid #e2e8f0', color: '#334155', cursor: 'pointer' }}>Sign in</button>
          <button style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'oklch(0.52 0.11 164)', color: '#fff', border: 'none', cursor: 'pointer' }}>Get Started</button>
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { Header });
