// PeptidePros UI Kit — PeptideCard Component
// Source: src/app/peptides/page.tsx (peptide card UI)

const PEPTIDE_DATA = [
  {
    name: 'BPC-157', slug: 'bpc-157',
    synonyms: ['Body Protection Compound'],
    shortDescription: 'Preclinical cytoprotective peptide studied for tissue repair and GI protection.',
    evidenceTier: 'C', riskLevel: 'high', category: 'tissue_repair',
    goals: ['Recovery', 'Gut Health'],
    notIdeal: ['Pregnancy', 'Cancer Risk'],
    effectiveness: '7.8', timeline: '2-4 Weeks', cost: '$60–$120',
    fdaFlag: true, wadaFlag: true,
  },
  {
    name: 'TB-500', slug: 'tb-500',
    synonyms: ['Thymosin Beta-4 Fragment'],
    shortDescription: 'Synthetic fragment promoting tissue repair, flexibility, and recovery via actin regulation.',
    evidenceTier: 'C', riskLevel: 'medium', category: 'tissue_repair',
    goals: ['Recovery', 'Injury Support'],
    notIdeal: ['Cancer Risk', 'Gray-Market Use'],
    effectiveness: '7.8', timeline: '3-6 Weeks', cost: '$80–$160',
    fdaFlag: false, wadaFlag: true,
  },
  {
    name: 'Ipamorelin', slug: 'ipamorelin',
    synonyms: ['GH Secretagogue'],
    shortDescription: 'Selective GH secretagogue with minimal cortisol/prolactin side effects.',
    evidenceTier: 'B-C', riskLevel: 'medium', category: 'gh_axis',
    goals: ['Muscle Growth', 'Recovery', 'Anti-Aging'],
    notIdeal: ['Hormone-Sensitive Use'],
    effectiveness: '8.2', timeline: '4-8 Weeks', cost: '$70–$140',
    fdaFlag: false, wadaFlag: true,
  },
  {
    name: 'Semaglutide', slug: 'semaglutide',
    synonyms: ['GLP-1 Receptor Agonist', 'Ozempic'],
    shortDescription: 'FDA-approved GLP-1 agonist for type 2 diabetes and weight management.',
    evidenceTier: 'A', riskLevel: 'medium', category: 'metabolic',
    goals: ['Fat Loss', 'Metabolic Health'],
    notIdeal: ['Pancreatitis History', 'Thyroid Risk'],
    effectiveness: '9.4', timeline: '4-12 Weeks', cost: '$200–$400',
    fdaFlag: false, wadaFlag: false,
  },
  {
    name: 'Semax', slug: 'semax',
    synonyms: ['ACTH 4-10 Analogue'],
    shortDescription: 'Neuropeptide analogue studied for cognitive enhancement and neuroprotection.',
    evidenceTier: 'C-D', riskLevel: 'med-high', category: 'neuropeptide',
    goals: ['Cognitive Enhancement', 'Mood'],
    notIdeal: ['Seizure History', 'Low-Friction Use'],
    effectiveness: '7.3', timeline: '1-3 Weeks', cost: '$50–$100',
    fdaFlag: false, wadaFlag: false,
  },
  {
    name: 'PT-141', slug: 'pt-141',
    synonyms: ['Bremelanotide'],
    shortDescription: 'Melanocortin receptor agonist studied for sexual dysfunction. FDA-approved (Vyleesi) for women.',
    evidenceTier: 'B', riskLevel: 'medium', category: 'sexual_health',
    goals: ['Libido', 'Sexual Health'],
    notIdeal: ['Cardiovascular Risk', 'BP Concerns'],
    effectiveness: '8.5', timeline: 'Hours', cost: '$40–$90',
    fdaFlag: false, wadaFlag: false,
  },
];

function getRiskColor(level) {
  const c = { low: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' }, medium: { bg: '#fefce8', text: '#a16207', border: '#fde047' }, 'med-high': { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' }, high: { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' }, extreme: { bg: '#fdf2f8', text: '#9f1239', border: '#f9a8d4' } };
  return c[level] || c['medium'];
}

function getTierColor(tier) {
  if (tier === 'A' || tier === 'B') return { bg: '#f0fdf4', text: '#15803d' };
  if (tier === 'B-C') return { bg: '#f0fdf4', text: '#0f6a52' };
  if (tier === 'C') return { bg: '#fefce8', text: '#a16207' };
  return { bg: '#fef2f2', text: '#dc2626' };
}

function PeptideBottleIcon({ category }) {
  const colors = { tissue_repair: '#0f6a52', gh_axis: '#1d4ed8', metabolic: '#7c3aed', neuropeptide: '#b45309', sexual_health: '#be185d' };
  const color = colors[category] || '#64748b';
  return (
    <div style={{ width: 80, height: 100, borderRadius: 12, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0 }}>
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <rect x="9" y="0" width="10" height="5" rx="2" fill={color} opacity="0.5"/>
        <rect x="7" y="5" width="14" height="28" rx="7" fill={color} opacity="0.2"/>
        <rect x="7" y="5" width="14" height="28" rx="7" stroke={color} strokeWidth="1.5"/>
        <rect x="9" y="8" width="10" height="14" rx="4" fill={color} opacity="0.25"/>
        <text x="14" y="30" textAnchor="middle" fontSize="6" fill={color} fontWeight="700" fontFamily="monospace">RUO</text>
      </svg>
    </div>
  );
}

function PeptideCard({ peptide, onCompare, isCompared, canCompare }) {
  const riskC = getRiskColor(peptide.riskLevel);
  const tierC = getTierColor(peptide.evidenceTier);
  return (
    <div style={{
      borderRadius: 22, border: '1px solid #e2e8f0', background: '#fff',
      padding: 16, boxShadow: '0 10px 30px -20px rgba(15,23,42,0.25)',
      transition: 'box-shadow 200ms', fontFamily: 'inherit',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <PeptideBottleIcon category={peptide.category} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>{peptide.name}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: '3px 0 0' }}>{peptide.synonyms[0]}</p>
            </div>
            <span style={{ flexShrink: 0, padding: '2px 9px', borderRadius: 9999, fontSize: 10, fontWeight: 600, background: riskC.bg, color: riskC.text, border: `1px solid ${riskC.border}` }}>
              {peptide.riskLevel === 'med-high' ? 'Med-High' : peptide.riskLevel.charAt(0).toUpperCase() + peptide.riskLevel.slice(1)} Risk
            </span>
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#0f6a52', margin: '8px 0 3px' }}>Best for {peptide.goals[0]?.toLowerCase()}</p>
          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.55, margin: 0 }}>{peptide.shortDescription}</p>
        </div>
      </div>

      {/* Best for / Not ideal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '8px 12px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#166534', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Best For
          </p>
          <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.5, margin: 0 }}>{peptide.goals.join(', ')}</p>
        </div>
        <div style={{ background: '#fff1f2', borderRadius: 14, padding: '8px 12px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#be123c', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Not Ideal If
          </p>
          <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.5, margin: 0 }}>{peptide.notIdeal.join(', ')}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '8px 12px', marginBottom: 10 }}>
        {[['Effectiveness', peptide.effectiveness + '/10'], ['Time to Results', peptide.timeline], ['Cycle Cost', peptide.cost]].map(([k, v]) => (
          <div key={k}>
            <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', margin: '0 0 3px' }}>{k}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Tier + goal tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        <span style={{ padding: '2px 9px', borderRadius: 9999, fontSize: 10, fontWeight: 600, background: tierC.bg, color: tierC.text }}>Tier {peptide.evidenceTier}</span>
        <span style={{ padding: '2px 9px', borderRadius: 9999, fontSize: 10, background: '#f1f5f9', color: '#475569' }}>{peptide.category.replace('_', ' ')}</span>
        {peptide.fdaFlag && <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 3 }}>⚠ FDA Flag</span>}
        {peptide.wadaFlag && <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', gap: 3 }}>△ WADA</span>}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0f6a52', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          View Full Guide →
        </button>
        <button
          onClick={() => onCompare(peptide.slug)}
          disabled={!isCompared && !canCompare}
          style={{
            padding: '5px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, border: 'none', cursor: isCompared || canCompare ? 'pointer' : 'not-allowed',
            background: isCompared ? '#e7f4ee' : !canCompare ? '#f1f5f9' : '#103b2c',
            color: isCompared ? '#0f6a52' : !canCompare ? '#94a3b8' : '#fff',
            opacity: !isCompared && !canCompare ? 0.5 : 1,
          }}
        >
          {isCompared ? 'Added ✓' : 'Add to Compare'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { PeptideCard, PEPTIDE_DATA, getRiskColor, getTierColor });
