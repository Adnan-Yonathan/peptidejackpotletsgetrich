// PeptidePros UI Kit — Quiz Flow Component
// Source: src/app/quiz/page.tsx

const QUIZ_STEPS = [
  { id: 'identity', title: 'Who are you?', desc: 'Set your baseline so the planner can weigh age, sex, training profile, and the safety rules that come with them.' },
  { id: 'goals', title: 'What are you trying to solve?', desc: 'Pick a primary objective and the actual problems you want the program to address.' },
  { id: 'health', title: 'What health context matters?', desc: 'Flag medical context, reproductive status, and hormone-sensitive issues that should push the plan more conservative.' },
  { id: 'constraints', title: 'What are your constraints?', desc: 'Define budget, delivery preference, risk tolerance, and time horizon.' },
  { id: 'style', title: 'What kind of program fits you?', desc: 'Choose how complex and how aggressive the resulting program should feel.' },
];

const GOALS_LIST = [
  { id: 'fat_loss', label: 'Fat Loss', desc: 'Reduce body fat while preserving lean mass' },
  { id: 'muscle_growth', label: 'Muscle Growth', desc: 'Build strength and increase lean muscle' },
  { id: 'recovery', label: 'Recovery & Repair', desc: 'Heal faster from training and injuries' },
  { id: 'cognitive', label: 'Cognitive Enhancement', desc: 'Improve focus, memory, and mental clarity' },
  { id: 'anti_aging', label: 'Longevity & Anti-Aging', desc: 'Support cellular health and healthy aging' },
  { id: 'sleep', label: 'Sleep & Stress', desc: 'Improve sleep quality and stress resilience' },
];

const AGE_OPTIONS = ['18–25', '26–35', '36–45', '46–55', '56–65', '65+'];
const SEX_OPTIONS = ['Male', 'Female', 'Other / Prefer not to say'];
const EXPERIENCE_OPTIONS = ['Beginner — New to peptides', 'Intermediate — Some experience', 'Advanced — Extensive experience'];
const BUDGET_OPTIONS = ['Budget-Friendly — Under $50/mo', 'Mid-Range — $50–$150/mo', 'Premium — $150+/mo'];
const RISK_OPTIONS = [1, 2, 3, 4, 5];

function OptionButton({ label, desc, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${selected ? 'oklch(0.52 0.11 164)' : '#e2e8f0'}`,
      background: selected ? 'oklch(0.52 0.11 164 / 0.06)' : '#fff',
      textAlign: 'left', cursor: 'pointer', transition: 'all 150ms', width: '100%',
    }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: selected ? 'oklch(0.35 0.11 164)' : '#0f172a', margin: 0 }}>{label}</p>
      {desc && <p style={{ fontSize: 11, color: '#64748b', margin: '3px 0 0', lineHeight: 1.45 }}>{desc}</p>}
    </button>
  );
}

function QuizFlow({ onComplete }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});

  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;
  const current = QUIZ_STEPS[step];

  function set(key, val) { setAnswers(a => ({ ...a, [key]: val })); }

  function canProceed() {
    if (current.id === 'identity') return answers.age && answers.sex && answers.experience;
    if (current.id === 'goals') return answers.primaryGoal;
    if (current.id === 'health') return answers.reproStatus;
    if (current.id === 'constraints') return answers.budget && answers.risk;
    if (current.id === 'style') return answers.stackPref;
    return false;
  }

  function handleNext() {
    if (step === QUIZ_STEPS.length - 1) { onComplete(); return; }
    setStep(s => s + 1);
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px', fontFamily: 'inherit' }}>
      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
          <span>Step {step + 1} of {QUIZ_STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'oklch(0.52 0.11 164)', borderRadius: 9999, transition: 'width 400ms ease' }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 0 0 1px rgba(15,23,42,0.08), 0 4px 16px -4px rgba(15,23,42,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{current.title}</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.55 }}>{current.desc}</p>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          {current.id === 'identity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Age range</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {AGE_OPTIONS.map(o => <OptionButton key={o} label={o} selected={answers.age === o} onClick={() => set('age', o)} />)}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Sex</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {SEX_OPTIONS.map(o => <OptionButton key={o} label={o} selected={answers.sex === o} onClick={() => set('sex', o)} />)}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Experience level</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {EXPERIENCE_OPTIONS.map(o => <OptionButton key={o} label={o.split(' — ')[0]} desc={o.split(' — ')[1]} selected={answers.experience === o} onClick={() => set('experience', o)} />)}
                </div>
              </div>
            </div>
          )}

          {current.id === 'goals' && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Primary goal</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {GOALS_LIST.map(g => <OptionButton key={g.id} label={g.label} desc={g.desc} selected={answers.primaryGoal === g.id} onClick={() => set('primaryGoal', g.id)} />)}
              </div>
            </div>
          )}

          {current.id === 'health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Reproductive status</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['Not applicable', 'Pregnant or trying', 'Breastfeeding', 'Post-menopausal'].map(o => (
                    <OptionButton key={o} label={o} selected={answers.reproStatus === o} onClick={() => set('reproStatus', o)} />
                  ))}
                </div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: '0 0 6px' }}>Anything else the plan should know?</p>
                <textarea placeholder="E.g. previous tendon injury, poor sleep during travel, trying to stay needle-free..." style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontFamily: 'inherit', resize: 'none', height: 60, color: '#334155', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {current.id === 'constraints' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Budget</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {BUDGET_OPTIONS.map(o => <OptionButton key={o} label={o.split(' — ')[0]} desc={o.split(' — ')[1]} selected={answers.budget === o} onClick={() => set('budget', o)} />)}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Risk tolerance</p>
                <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>1 = very conservative. 5 = open to highest-risk research compounds.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {RISK_OPTIONS.map(n => (
                    <OptionButton key={n} label={String(n)} selected={answers.risk === n} onClick={() => set('risk', n)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {current.id === 'style' && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Stack complexity</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { id: 'single', label: 'Single Peptide', desc: 'Keep it simple with one peptide' },
                  { id: 'basic', label: 'Basic Stack', desc: '2–3 complementary peptides' },
                  { id: 'advanced', label: 'Advanced Stack', desc: '3–5 peptides for experienced users' },
                ].map(o => <OptionButton key={o.id} label={o.label} desc={o.desc} selected={answers.stackPref === o.id} onClick={() => set('stackPref', o.id)} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{
          padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff',
          fontSize: 13, fontWeight: 600, color: '#334155', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.4 : 1,
        }}>← Back</button>
        <button onClick={handleNext} disabled={!canProceed()} style={{
          padding: '8px 22px', borderRadius: 8, border: 'none',
          background: canProceed() ? 'oklch(0.52 0.11 164)' : '#e2e8f0',
          fontSize: 13, fontWeight: 600, color: canProceed() ? '#fff' : '#94a3b8', cursor: canProceed() ? 'pointer' : 'not-allowed', transition: 'all 150ms',
        }}>
          {step === QUIZ_STEPS.length - 1 ? 'Generate My Program →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { QuizFlow });
