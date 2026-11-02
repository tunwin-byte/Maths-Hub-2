// app/[stage]/[outcome]/ExpressionBuilderRunner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { OutcomeCurriculum, ExpressionBuilderQuestion } from '@/data/curriculum';

class SoundSynth {
  private ctx: AudioContext | null = null;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTileClick() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  playBuzz() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  playFanfare() {
    const ctx = this.initCtx();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }
}

const sounds = new SoundSynth();

function triggerConfetti() {
  if (typeof window === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
  const particles = Array.from({ length: 60 }, () => ({
    x: canvas.width / 2,
    y: canvas.height * 0.55,
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 0.7) * 16,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
  }));

  let frame = 0;
  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.alpha -= 0.015;
      if (p.alpha > 0) {
        alive = true;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });
    frame++;
    if (alive && frame < 90) requestAnimationFrame(animate);
    else canvas.remove();
  }
  animate();
}

export default function ExpressionBuilderRunner({ curriculum }: { curriculum: OutcomeCurriculum }) {
  const [qIndex, setQIndex] = useState(0);
  const q = curriculum.questions[qIndex] as ExpressionBuilderQuestion;

  // Inventory tracking of available vs placed tiles
  const [pool, setPool] = useState<{ id: string; val: string }[]>([]);
  const [assembled, setAssembled] = useState<{ id: string; val: string }[]>([]);
  const [answerInput, setAnswerInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hint, setHint] = useState<string | null>(null);
  const [step, setStep] = useState<'build' | 'solve'>('build');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Generate pool with unique IDs so duplicates (like '(' and ')') don't clash
    const initialPool = q.availableTiles.map((t, i) => ({ id: `${t}-${i}`, val: t }));
    // Simple deterministic shuffle
    setPool([...initialPool].sort(() => 0.5 - Math.random()));
    setAssembled([]);
    setAnswerInput('');
    setStatus('idle');
    setHint(null);
    setStep('build');
  }, [qIndex, q]);

  const addTile = (tile: { id: string; val: string }) => {
    if (step === 'solve' || status === 'correct') return;
    sounds.playTileClick();
    setPool((prev) => prev.filter((t) => t.id !== tile.id));
    setAssembled((prev) => [...prev, tile]);
    if (status === 'incorrect') setStatus('idle');
  };

  const removeTile = (tile: { id: string; val: string }) => {
    if (step === 'solve' || status === 'correct') return;
    sounds.playTileClick();
    setAssembled((prev) => prev.filter((t) => t.id !== tile.id));
    setPool((prev) => [...prev, tile]);
    if (status === 'incorrect') setStatus('idle');
  };

  const clearAll = () => {
    const all = [...pool, ...assembled];
    setPool(all);
    setAssembled([]);
    if (status === 'incorrect') setStatus('idle');
  };

  const handleCheckSentence = () => {
    const currentTokens = assembled.map((t) => t.val);

    // Verify if current tokens match any valid sequence
    const isValid = q.validSequences.some((seq) => {
      if (seq.length !== currentTokens.length) return false;
      return seq.every((val, idx) => val === currentTokens[idx]);
    });

    if (!isValid) {
      setStatus('incorrect');
      setHint('Look at the story structure. Do you need brackets to group operations that happen first?');
      sounds.playBuzz();
      return;
    }

    // Expression built correctly, move to evaluation step
    setStatus('idle');
    setHint(null);
    setStep('solve');
    sounds.playTileClick();
  };

  const handleCheckFinalAnswer = () => {
    const val = parseFloat(answerInput.trim());

    if (isNaN(val)) {
      setStatus('incorrect');
      setHint('Type a number in the box before checking.');
      sounds.playBuzz();
      return;
    }

    if (val !== q.correctAnswer) {
      setStatus('incorrect');
      setHint(q.explanation);
      sounds.playBuzz();
      return;
    }

    // Success!
    setStatus('correct');
    setHint(null);
    sounds.playFanfare();
    triggerConfetti();
  };

  const handleNext = () => {
    if (qIndex + 1 < curriculum.questions.length) {
      setQIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      sounds.playFanfare();
      triggerConfetti();
    }
  };

  if (finished) {
    return (
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-200 font-sans">
        <div className="text-5xl mb-3">🏅</div>
        <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-bold uppercase">
          Outcome Completed
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">{curriculum.outcomeCode} Mastered!</h2>
        <p className="text-slate-600 text-sm mt-1">
          You mastered translating real-world problems into single, correctly-bracketed number sentences!
        </p>
        <button
          onClick={() => {
            setQIndex(0);
            setFinished(false);
          }}
          className="mt-6 w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow transition"
        >
          Practice Again ↺
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl flex flex-col items-center select-none font-sans">
      {/* Story Scenario Card */}
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
            Scenario {qIndex + 1} of {curriculum.questions.length}
          </span>
          <span className="text-xs font-bold text-slate-400">Translate to a Single Sentence</span>
        </div>
        <p className="text-base font-semibold text-slate-900 leading-relaxed">
          {q.scenario}
        </p>
      </div>

      {/* Interactive Expression Assembly Workbench */}
      <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600">
            {step === 'build' ? 'Step 1: Build the Number Sentence' : 'Step 1: Completed Sentence ✓'}
          </span>
          {step === 'build' && assembled.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
            >
              Clear ↺
            </button>
          )}
        </div>

        {/* Assembly Line Drop-area */}
        <div className="min-h-[72px] w-full p-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-wrap items-center justify-center gap-2 mb-4">
          {assembled.length === 0 ? (
            <span className="text-xs font-semibold text-slate-400 italic">
              Tap tiles below in order to build the sentence...
            </span>
          ) : (
            assembled.map((tile) => (
              <button
                key={tile.id}
                onClick={() => removeTile(tile)}
                disabled={step === 'solve'}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-xl shadow-md transition active:scale-95 flex items-center justify-center"
              >
                {tile.val}
              </button>
            ))
          )}
        </div>

        {/* Tile Pool Bank */}
        {step === 'build' && (
          <div className="w-full flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Available Mathematical Tiles
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {pool.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => addTile(tile)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xl border-2 transition active:scale-95 shadow-sm ${
                    tile.val === '(' || tile.val === ')'
                      ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                      : ['+', '-', '×', '÷'].includes(tile.val)
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {tile.val}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer Form & Check Actions */}
      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        {step === 'build' ? (
          <button
            onClick={handleCheckSentence}
            disabled={assembled.length === 0}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
          >
            Check Number Sentence
          </button>
        ) : (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Step 2: Solve the sentence: {assembled.map((t) => t.val).join(' ')} = ?
            </label>
            <div className="flex gap-3 mt-2">
              <input
                type="number"
                inputMode="numeric"
                value={answerInput}
                onChange={(e) => {
                  setAnswerInput(e.target.value);
                  if (status === 'incorrect') setStatus('idle');
                }}
                disabled={status === 'correct'}
                placeholder="?"
                className={`w-28 text-center text-2xl font-black p-3 rounded-xl border-2 transition focus:outline-none ${
                  status === 'correct'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : status === 'incorrect'
                    ? 'bg-rose-50 border-rose-500 text-rose-900'
                    : 'bg-slate-50 border-slate-300 focus:border-violet-500 text-slate-900'
                }`}
              />
              {status !== 'correct' ? (
                <button
                  onClick={handleCheckFinalAnswer}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
                >
                  Calculate Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
                >
                  {qIndex + 1 === curriculum.questions.length ? 'Finish Activity 🏆' : 'Next Scenario →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feedback Banners */}
        {status === 'correct' && (
          <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span>Correct! {q.explanation}</span>
          </div>
        )}

        {status === 'incorrect' && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-center gap-2">
            <span className="text-xl">❌</span>
            <div>
              <span className="font-bold block">Incorrect!</span>
              {hint && <span className="text-xs text-rose-700 font-medium">{hint}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}