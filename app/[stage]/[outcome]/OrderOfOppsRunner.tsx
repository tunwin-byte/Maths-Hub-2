// app/[stage]/[outcome]/OrderOfOpsRunner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { OutcomeCurriculum, OrderOfOpsQuestion } from '@/data/curriculum';

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

  playClick() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
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

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.05;
    utter.lang = 'en-AU';
    window.speechSynthesis.speak(utter);
  }
}

export default function OrderOfOpsRunner({ curriculum }: { curriculum: OutcomeCurriculum }) {
  const [qIndex, setQIndex] = useState(0);
  const q = curriculum.questions[qIndex] as OrderOfOpsQuestion;

  const [step, setStep] = useState<'pick-op' | 'enter-final'>('pick-op');
  const [selectedOpIndex, setSelectedOpIndex] = useState<number | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hint, setHint] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setStep('pick-op');
    setSelectedOpIndex(null);
    setAnswerInput('');
    setStatus('idle');
    setHint(null);
    speak(`${q.context} Which operation must be calculated first?`);
  }, [qIndex, q]);

  const isOperator = (token: string) => ['+', '-', '×', '÷'].includes(token);

  const handleSelectToken = (idx: number) => {
    const token = q.tokens[idx];
    if (!isOperator(token)) return;

    sounds.playClick();
    setSelectedOpIndex(idx);

    if (idx !== q.correctFirstOpIndex) {
      setStatus('incorrect');
      setHint(
        `Look closely at the expression. Check for grouping symbols ( ) first, then multiplication or division!`
      );
      sounds.playBuzz();
      return;
    }

    setStatus('idle');
    setHint(null);
    setStep('enter-final');
    speak(`Correct! Now solve the remaining sentence: ${q.stepReduction}.`);
  };

  const handleCheckFinalAnswer = () => {
    const userVal = parseFloat(answerInput.trim());

    if (isNaN(userVal)) {
      setStatus('incorrect');
      setHint('Type a number in the box before checking.');
      sounds.playBuzz();
      return;
    }

    if (userVal !== q.correctAnswer) {
      setStatus('incorrect');
      setHint(q.explanation);
      sounds.playBuzz();
      return;
    }

    setStatus('correct');
    setHint(null);
    sounds.playFanfare();
    triggerConfetti();
    speak(`Brilliant! The final answer is ${q.correctAnswer}!`);
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
        <div className="text-5xl mb-3">🎯</div>
        <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-bold uppercase">
          Outcome Completed
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">{curriculum.outcomeCode} Mastered!</h2>
        <p className="text-slate-600 text-sm mt-1">
          You mastered brackets, operator precedence, and writing real-world number sentences!
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
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
        <span className="text-xs font-black uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
          Real-Life Context
        </span>
        <p className="text-sm font-semibold text-slate-800 mt-2 leading-relaxed">
          {q.context}
        </p>
      </div>

      <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            {step === 'pick-op' ? 'Step 1: Tap the operation to do FIRST' : 'Step 2: Simplified Number Sentence'}
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            B • O / D • M • A • S
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl w-full">
          {q.tokens.map((token, idx) => {
            const isOp = isOperator(token);
            const isSelected = selectedOpIndex === idx;

            return (
              <button
                key={idx}
                disabled={!isOp || step === 'enter-final'}
                onClick={() => handleSelectToken(idx)}
                className={`text-xl sm:text-2xl font-black rounded-2xl transition-all flex items-center justify-center ${
                  isOp
                    ? step === 'pick-op'
                      ? 'px-4 py-3 bg-violet-600 text-white hover:bg-violet-700 shadow-md active:scale-95 cursor-pointer ring-2 ring-violet-300 ring-offset-2'
                      : isSelected
                      ? 'px-4 py-3 bg-emerald-500 text-white shadow'
                      : 'px-4 py-3 bg-slate-200 text-slate-400'
                    : token === '(' || token === ')'
                    ? 'px-2 py-3 text-amber-600 font-extrabold text-2xl'
                    : 'px-3 py-3 bg-white text-slate-800 border border-slate-200 shadow-sm'
                }`}
              >
                {token}
              </button>
            );
          })}
        </div>

        {step === 'enter-final' && (
          <div className="w-full mt-4 flex flex-col items-center animate-fadeIn">
            <span className="text-xs font-bold text-emerald-700 mb-1">
              ↓ Reduced Expression after Step 1
            </span>
            <div className="px-6 py-2.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl font-mono text-xl font-black text-emerald-900 shadow-inner">
              {q.stepReduction}
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {step === 'pick-op' ? 'Tap the first operation above' : `Final Calculation: ${q.stepReduction} = ?`}
        </label>

        {step === 'enter-final' && (
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
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
              >
                {qIndex + 1 === curriculum.questions.length ? 'Finish Activity 🏆' : 'Next Question →'}
              </button>
            )}
          </div>
        )}

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