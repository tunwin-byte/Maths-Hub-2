// app/[stage]/[outcome]/BracketPlacementRunner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { OutcomeCurriculum, BracketPlacementQuestion } from '@/data/curriculum';

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
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.05);
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

function operate(a: number, op: '+' | '-' | '×' | '÷', b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return a / b;
  }
}

export default function BracketPlacementRunner({ curriculum }: { curriculum: OutcomeCurriculum }) {
  const [qIndex, setQIndex] = useState(0);
  const q = curriculum.questions[qIndex] as BracketPlacementQuestion;

  const [placement, setPlacement] = useState<'none' | 'left' | 'right'>('none');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hint, setHint] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setPlacement('none');
    setStatus('idle');
    setHint(null);
  }, [qIndex, q]);

  const calculateLiveResult = (): { value: number; stepDisplay: string } => {
    const { num1, op1, num2, op2, num3 } = q.terms;

    if (placement === 'left') {
      const step1 = operate(num1, op1, num2);
      const finalVal = operate(step1, op2, num3);
      return {
        value: finalVal,
        stepDisplay: `(${num1} ${op1} ${num2}) ${op2} ${num3}  =  ${step1} ${op2} ${num3}  =  ${finalVal}`,
      };
    } else if (placement === 'right') {
      const step1 = operate(num2, op2, num3);
      const finalVal = operate(num1, op1, step1);
      return {
        value: finalVal,
        stepDisplay: `${num1} ${op1} (${num2} ${op2} ${num3})  =  ${num1} ${op1} ${step1}  =  ${finalVal}`,
      };
    } else {
      return {
        value: q.defaultResult,
        stepDisplay: `No brackets applied (Standard BODMAS order)  =  ${q.defaultResult}`,
      };
    }
  };

  const { value: currentVal, stepDisplay } = calculateLiveResult();

  const handleToggle = (choice: 'none' | 'left' | 'right') => {
    sounds.playClick();
    setPlacement(choice);
    if (status === 'incorrect') setStatus('idle');
  };

  const handleCheck = () => {
    if (placement === 'none') {
      setStatus('incorrect');
      setHint('Tap one of the bracket positions to group terms before checking!');
      sounds.playBuzz();
      return;
    }

    if (placement !== q.correctBracket || currentVal !== q.targetResult) {
      setStatus('incorrect');
      setHint(q.hint);
      sounds.playBuzz();
      return;
    }

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
        <div className="text-5xl mb-3">🏆</div>
        <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-bold uppercase">
          Outcome Completed
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">{curriculum.outcomeCode} Mastered!</h2>
        <p className="text-slate-600 text-sm mt-1">
          You mastered placing grouping symbols (brackets) to alter operation precedence!
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

  const { num1, op1, num2, op2, num3 } = q.terms;

  return (
    <div className="w-full max-w-xl flex flex-col items-center select-none font-sans">
      <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-3xl shadow-md text-white mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-violet-200 block">
            Mission: Make It True
          </span>
          <h2 className="text-2xl font-black mt-0.5">{q.title}</h2>
          <p className="text-xs text-violet-100 mt-1 max-w-sm">{q.context}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 text-center">
          <span className="text-[10px] uppercase font-bold text-violet-200 block">Target</span>
          <span className="text-3xl font-black text-white">{q.targetResult}</span>
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-4 flex flex-col items-center">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
          Tap where the brackets `( )` belong:
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl w-full text-2xl font-black">
          <button
            onClick={() => handleToggle(placement === 'left' ? 'none' : 'left')}
            className={`px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-2 active:scale-95 ${
              placement === 'left'
                ? 'bg-violet-600 border-violet-700 text-white shadow-lg ring-4 ring-violet-200'
                : 'bg-white border-slate-200 hover:border-violet-300 text-slate-800'
            }`}
          >
            <span className="text-amber-400 font-extrabold text-3xl">(</span>
            <span>{num1}</span>
            <span className="text-slate-400 font-bold">{op1}</span>
            <span>{num2}</span>
            <span className="text-amber-400 font-extrabold text-3xl">)</span>
          </button>

          <span className="text-slate-500 font-bold px-1">{op2}</span>

          <button
            onClick={() => handleToggle(placement === 'right' ? 'none' : 'right')}
            className={`px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-2 active:scale-95 ${
              placement === 'right'
                ? 'bg-violet-600 border-violet-700 text-white shadow-lg ring-4 ring-violet-200'
                : 'bg-white border-slate-200 hover:border-violet-300 text-slate-800'
            }`}
          >
            <span className="text-amber-400 font-extrabold text-3xl">(</span>
            <span>{num2}</span>
            <span className="text-slate-400 font-bold">{op2}</span>
            <span>{num3}</span>
            <span className="text-amber-400 font-extrabold text-3xl">)</span>
          </button>
        </div>

        <div className="w-full mt-4 p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Live Evaluated Value
          </span>
          <div className="font-mono text-sm font-semibold text-slate-700 mb-2 text-center">
            {stepDisplay}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Result with current brackets:</span>
            <span
              className={`text-xl font-black px-3 py-1 rounded-xl transition ${
                currentVal === q.targetResult
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-300'
              }`}
            >
              {currentVal}
            </span>
            {currentVal === q.targetResult && (
              <span className="text-emerald-600 font-bold text-xs">✓ Matches Target!</span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-3">
          {status !== 'correct' ? (
            <button
              onClick={handleCheck}
              className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
            >
              Check My Brackets
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
            >
              {qIndex + 1 === curriculum.questions.length ? 'Finish Activity 🏆' : 'Next Challenge →'}
            </button>
          )}
        </div>

        {status === 'correct' && (
          <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span>Brilliant! Placing brackets there changes the precedence to make {q.targetResult}!</span>
          </div>
        )}

        {status === 'incorrect' && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-center gap-2">
            <span className="text-xl">❌</span>
            <div>
              <span className="font-bold block">Not quite!</span>
              {hint && <span className="text-xs text-rose-700 font-medium">{hint}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}