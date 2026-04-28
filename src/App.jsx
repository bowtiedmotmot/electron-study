import { useState, useEffect, useRef, forwardRef } from 'react';
import { newQuestion, formatCharge, getCorrectAnswers } from './elements';

const FIELDS = [
  {
    key: 'protons',
    label: 'Protons',
    icon: '🔴',
    hint: 'Protons = Atomic Number (always!)',
    color: 'red',
  },
  {
    key: 'electrons',
    label: 'Electrons',
    icon: '🔵',
    hint: 'Electrons = Protons − Charge\n(+charge = lost electrons, −charge = gained)',
    color: 'blue',
  },
  {
    key: 'neutrons',
    label: 'Neutrons',
    icon: '⚪',
    hint: 'Neutrons = Mass Number − Atomic Number',
    color: 'gray',
  },
  {
    key: 'massNumber',
    label: 'Mass Number',
    icon: '⚛️',
    hint: 'Mass Number = Protons + Neutrons',
    color: 'purple',
  },
];

const CATEGORY_COLORS = {
  'nonmetal':        'from-yellow-500 to-amber-400',
  'noble gas':       'from-purple-500 to-violet-400',
  'alkali metal':    'from-red-500 to-rose-400',
  'alkaline earth':  'from-orange-500 to-amber-400',
  'metalloid':       'from-green-600 to-emerald-500',
  'halogen':         'from-teal-500 to-cyan-400',
  'transition':      'from-blue-600 to-blue-400',
  'post-transition': 'from-sky-500 to-blue-400',
};

function AtomDiagram({ protons, electrons, neutrons }) {
  const shells = [2, 8, 18, 32];
  const shellCounts = [];
  let remaining = electrons;
  for (const cap of shells) {
    if (remaining <= 0) break;
    shellCounts.push(Math.min(remaining, cap));
    remaining -= shellCounts[shellCounts.length - 1];
  }

  const numShells = Math.max(shellCounts.length, 1);
  const shellGap = 34;
  const nucleusR = 28;
  const outerR = nucleusR + numShells * shellGap;
  const size = (outerR + 14) * 2;
  const cx = size / 2;

  return (
    <div className="flex items-center justify-center py-2" aria-label="Atom diagram">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-xs sm:max-w-sm"
        style={{ maxHeight: 240 }}
      >
        {shellCounts.map((count, si) => {
          const r = nucleusR + (si + 1) * shellGap;
          return (
            <g key={si}>
              <circle cx={cx} cy={cx} r={r} fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5 4" />
              {Array.from({ length: count }).map((_, ei) => {
                const angle = (ei / count) * 2 * Math.PI - Math.PI / 2;
                return (
                  <circle
                    key={ei}
                    cx={cx + r * Math.cos(angle)}
                    cy={cx + r * Math.sin(angle)}
                    r={6}
                    fill="#3b82f6"
                  />
                );
              })}
            </g>
          );
        })}
        <circle cx={cx} cy={cx} r={nucleusR} fill="url(#nucGrad)" />
        <defs>
          <radialGradient id="nucGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </radialGradient>
        </defs>
        <text x={cx} y={cx - 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          {protons + neutrons}
        </text>
        <text x={cx} y={cx + 10} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)">
          nucleus
        </text>
      </svg>
    </div>
  );
}

function HintTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-300 active:bg-indigo-400 transition-colors touch-manipulation"
        aria-label="Show hint"
      >?</button>
      {open && (
        <span className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 w-60 bg-indigo-900 text-white text-xs rounded-lg p-3 whitespace-pre-line shadow-xl pointer-events-none leading-relaxed">
          {text}
          <span className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-900" />
        </span>
      )}
    </span>
  );
}

const AnswerField = forwardRef(function AnswerField(
  { field, value, onChange, submitted, correct, answer, math },
  ref
) {
  const isRight = submitted && correct;
  const isWrong = submitted && !correct;

  const ringClass = !submitted
    ? 'ring-2 ring-transparent focus-within:ring-indigo-400'
    : isRight
    ? 'ring-2 ring-green-400 bg-green-50'
    : 'ring-2 ring-red-400 bg-red-50';

  return (
    <div className={`rounded-xl p-3 sm:p-4 transition-all ${ringClass} bg-white shadow-sm`}>
      <label className="flex items-center gap-1 text-sm sm:text-base font-semibold text-gray-700 mb-2">
        <span>{field.icon}</span>
        {field.label}
        <HintTooltip text={field.hint} />
      </label>
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="300"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={submitted}
          placeholder="?"
          className="w-24 sm:w-28 text-center text-xl sm:text-2xl font-bold border-2 border-gray-200 rounded-xl py-2 focus:outline-none focus:border-indigo-400 disabled:bg-transparent disabled:cursor-default touch-manipulation"
        />
        {isRight && (
          <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
            <CheckIcon /> Correct!
          </span>
        )}
        {isWrong && (
          <span className="text-red-600 text-sm flex items-center gap-1.5 flex-wrap">
            <XIcon />
            <span className="font-semibold">Answer: <strong>{answer}</strong></span>
            {math && <span className="text-red-400 font-mono text-xs">{math}</span>}
          </span>
        )}
      </div>
    </div>
  );
});

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ScoreBar({ correct, total }) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{correct}/{total}</span>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{pct}%</span>
    </div>
  );
}

function ExplainerPanel({ element, charge, answers }) {
  const chargeStr = charge === 0
    ? 'neutral — no electrons gained or lost'
    : charge > 0
    ? `+${charge} — lost ${charge} electron${charge !== 1 ? 's' : ''} (cation)`
    : `${charge} — gained ${Math.abs(charge)} electron${Math.abs(charge) !== 1 ? 's' : ''} (anion)`;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-900 space-y-2">
      <p className="font-semibold text-indigo-700">How to work it out:</p>
      <p>🔴 <strong>Protons</strong> = Atomic number of {element.name} = <strong>{answers.protons}</strong></p>
      <p>⚪ <strong>Neutrons</strong> = Mass number − Atomic number = {element.massNumber} − {element.atomicNumber} = <strong>{answers.neutrons}</strong></p>
      <p>⚛️ <strong>Mass number</strong> = Protons + Neutrons = {answers.protons} + {answers.neutrons} = <strong>{answers.massNumber}</strong></p>
      <p>🔵 <strong>Electrons</strong>: charge is {chargeStr}</p>
      <p className="pl-4">Electrons = Protons − Charge = {answers.protons} − ({charge}) = <strong>{answers.electrons}</strong></p>
    </div>
  );
}

export default function App() {
  const [question, setQuestion] = useState(() => newQuestion());
  const [inputs, setInputs] = useState({ protons: '', electrons: '', neutrons: '', massNumber: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [showAtom, setShowAtom] = useState(false);
  const firstInputRef = useRef(null);

  const { element, charge } = question;
  const answers = getCorrectAnswers(element, charge);
  const gradClass = CATEGORY_COLORS[element.category] ?? 'from-blue-500 to-indigo-400';

  useEffect(() => {
    if (!submitted) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [question, submitted]);

  function handleInput(key, val) {
    if (submitted) return;
    setInputs(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitted) return;
    const results = FIELDS.map(f => parseInt(inputs[f.key], 10) === answers[f.key]);
    const allRight = results.every(Boolean);
    setSubmitted(true);
    setScore(prev => ({
      correct: prev.correct + results.filter(Boolean).length,
      total: prev.total + FIELDS.length,
    }));
    setStreak(prev => allRight ? prev + 1 : 0);
    setShowAtom(true);
  }

  function handleNext() {
    setQuestion(newQuestion(element, charge));
    setInputs({ protons: '', electrons: '', neutrons: '', massNumber: '' });
    setSubmitted(false);
    setShowAtom(false);
  }

  const allCorrect = submitted && FIELDS.every(f => parseInt(inputs[f.key], 10) === answers[f.key]);
  const canSubmit = FIELDS.every(f => inputs[f.key] !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 flex flex-col items-center py-6 px-4 pb-16">

      {/* Header */}
      <div className="w-full max-w-lg mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 text-center tracking-tight">
          ⚛️ Electron Explorer
        </h1>
        <p className="text-center text-indigo-600 text-xs sm:text-sm mt-1">
          Learn protons, electrons &amp; neutrons!
        </p>
        <div className="mt-3">
          <ScoreBar correct={score.correct} total={score.total} />
        </div>
        {streak >= 3 && (
          <p className="text-center text-orange-500 font-bold mt-1 text-sm sm:text-base animate-bounce">
            🔥 {streak} in a row! You're on fire!
          </p>
        )}
      </div>

      {/* Element Card */}
      <div className={`w-full max-w-lg rounded-2xl bg-gradient-to-br ${gradClass} p-1 shadow-xl mb-4`}>
        <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col items-center">
          <div className={`bg-gradient-to-br ${gradClass} rounded-2xl w-28 h-28 sm:w-36 sm:h-36 flex flex-col items-center justify-center shadow-lg text-white mb-3`}>
            <span className="text-xs font-semibold uppercase tracking-widest opacity-80">{element.atomicNumber}</span>
            <span className="text-4xl sm:text-5xl font-black leading-none">{element.symbol}</span>
            <span className="text-xs font-medium opacity-90">{element.name}</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">{element.category}</p>
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              Charge:{' '}
              <span className={`font-black text-lg sm:text-xl ${charge > 0 ? 'text-red-500' : charge < 0 ? 'text-blue-500' : 'text-gray-700'}`}>
                {formatCharge(charge)}
              </span>
            </p>
            <p className="text-xs text-gray-400">
              Atomic number: <strong>{element.atomicNumber}</strong>
              &nbsp;|&nbsp;
              Mass number: <strong>{element.massNumber}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIELDS.map((field, i) => {
            const chargeStr = charge < 0 ? `(${charge})` : `${charge}`;
            const mathFor = {
              protons:    `= atomic # ${element.atomicNumber}`,
              neutrons:   `${element.massNumber} − ${element.atomicNumber}`,
              massNumber: `${answers.protons} + ${answers.neutrons}`,
              electrons:  `${answers.protons} − ${chargeStr}`,
            };
            return (
              <AnswerField
                key={field.key}
                field={field}
                value={inputs[field.key]}
                onChange={val => handleInput(field.key, val)}
                submitted={submitted}
                correct={parseInt(inputs[field.key], 10) === answers[field.key]}
                answer={answers[field.key]}
                math={mathFor[field.key]}
                ref={i === 0 ? firstInputRef : undefined}
              />
            );
          })}
        </div>

        {!submitted && (
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors shadow-md touch-manipulation"
          >
            Check Answers
          </button>
        )}
      </form>

      {/* Post-submit feedback */}
      {submitted && (
        <div className="w-full max-w-lg mt-4 space-y-3">
          {allCorrect ? (
            <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-700">Perfect! 🎉</p>
              <p className="text-green-600 text-sm mt-1">You got every answer right!</p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-base sm:text-lg font-bold text-amber-700">Good try! Check the explanations below 👇</p>
            </div>
          )}

          <ExplainerPanel element={element} charge={charge} answers={answers} />

          {showAtom && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Atom Diagram</p>
              <AtomDiagram protons={answers.protons} electrons={answers.electrons} neutrons={answers.neutrons} />
              <p className="text-center text-xs text-gray-400 mt-1">
                {answers.electrons} electron{answers.electrons !== 1 ? 's' : ''} orbiting a nucleus of {answers.protons}p + {answers.neutrons}n
              </p>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-lg transition-colors shadow-md touch-manipulation"
          >
            Next Element →
          </button>
        </div>
      )}

      {/* Reference / Study Guide */}
      <details className="w-full max-w-lg mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-700 text-sm select-none touch-manipulation">
          📖 Study Guide (tap to expand)
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">
          <p>🔴 <strong>Protons</strong> = always the <em>atomic number</em></p>
          <p>⚪ <strong>Neutrons</strong> = mass number − atomic number</p>
          <p>⚛️ <strong>Mass number</strong> = protons + neutrons</p>
          <p>🔵 <strong>Electrons</strong> = protons − charge</p>
          <div className="bg-blue-50 rounded-lg p-3 mt-2 text-xs space-y-1 leading-relaxed">
            <p className="font-semibold">Charge tip:</p>
            <p>A <strong>positive</strong> charge (+2) → atom <em>lost</em> electrons → fewer electrons than protons</p>
            <p>A <strong>negative</strong> charge (−2) → atom <em>gained</em> electrons → more electrons than protons</p>
            <p>A <strong>neutral</strong> atom (0) → electrons = protons</p>
          </div>
        </div>
      </details>
    </div>
  );
}
