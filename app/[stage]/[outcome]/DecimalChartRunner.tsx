// app/[stage]/[outcome]/DecimalChartRunner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { OutcomeCurriculum, DecimalChartQuestion } from '@/data/curriculum';

class DecimalSoundSynth {
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

  playDiskDrop(pitchMultiplier = 1) {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const freq = 440 * pitchMultiplier;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  playRegroup() {
    const ctx = this.initCtx();
    if (!ctx) return;
    [400, 600, 800].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
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

const sounds = new DecimalSoundSynth();

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

  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
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

function parseDecimalParts(val: number) {
  const rounded = Math.round(val * 100);
  const ones = Math.floor(rounded / 100);
  const tenths = Math.floor((rounded % 100) / 10);
  const hundredths = rounded % 10;
  return { ones, tenths, hundredths };
}

export default function DecimalChartRunner({ curriculum }: { curriculum: OutcomeCurriculum }) {
  const [qIndex, setQIndex] = useState(0);
  const q = curriculum.questions[qIndex] as DecimalChartQuestion;

  const [ones, setOnes] = useState(0);
  const [tenths, setTenths] = useState(0);
  const [hundredths, setHundredths] = useState(0);

  const [answerInput, setAnswerInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hint, setHint] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const parts = parseDecimalParts(q.startVal);
    setOnes(parts.ones);
    setTenths(parts.tenths);
    setHundredths(parts.hundredths);
    setAnswerInput('');
    setStatus('idle');
    setHint(null);
  }, [qIndex, q]);

  const matValue = Math.round((ones * 1 + tenths * 0.1 + hundredths * 0.01) * 100) / 100;

  const adjustDisk = (place: 'ones' | 'tenths' | 'hundredths', delta: number) => {
    const pitch = place === 'ones' ? 0.8 : place === 'tenths' ? 1.0 : 1.3;
    sounds.playDiskDrop(pitch);

    if (place === 'ones') setOnes((prev) => Math.max(0, prev + delta));
    if (place === 'tenths') setTenths((prev) => Math.max(0, prev + delta));
    if (place === 'hundredths') setHundredths((prev) => Math.max(0, prev + delta));

    if (status === 'incorrect') setStatus('idle');
  };

  const bundleHundredths = () => {
    if (hundredths < 10) return;
    sounds.playRegroup();
    setHundredths((prev) => prev - 10);
    setTenths((prev) => prev + 1);
  };

  const unbundleTenth = () => {
    if (tenths < 1) return;
    sounds.playRegroup();
    setTenths((prev) => prev - 1);
    setHundredths((prev) => prev + 10);
  };

  const bundleTenths = () => {
    if (tenths < 10) return;
    sounds.playRegroup();
    setTenths((prev) => prev - 10);
    setOnes((prev) => prev + 1);
  };

  const unbundleOne = () => {
    if (ones < 1) return;
    sounds.playRegroup();
    setOnes((prev) => prev - 1);
    setTenths((prev) => prev + 10);
  };

  const handleCheck = () => {
    const userVal = parseFloat(answerInput.trim());

    if (isNaN(userVal)) {
      setStatus('incorrect');
      setHint('Enter your final calculated decimal answer in the box.');
      sounds.playBuzz();
      return;
    }

    if (Math.abs(userVal - q.correctAnswer) > 0.001) {
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
        <div className="text-5xl mb-3">⭐</div>
        <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold uppercase">
          Outcome Completed
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">{curriculum.outcomeCode} Mastered!</h2>
        <p className="text-slate-600 text-sm mt-1">
          You mastered adding, subtracting, and regrouping decimals with tenths and hundredths!
        </p>
        <button
          onClick={() => {
            setQIndex(0);
            setFinished(false);
          }}
          className="mt-6 w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow transition"
        >
          Practice Again ↺
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl flex flex-col items-center select-none font-sans">
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg">
            Problem {qIndex + 1} of {curriculum.questions.length}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono">
            {q.startVal} {q.operation} {q.changeVal}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.context}</p>
      </div>

      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Interactive Place-Value Chart
          </span>
          <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
            Disks on mat: <strong className="font-mono">{matValue.toFixed(2)}</strong>
          </span>
        </div>

        <div className="w-full grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
          {/* Ones */}
          <div className="flex flex-col items-center bg-white rounded-xl p-2.5 border border-slate-200 shadow-sm">
            <span className="text-xs font-black text-indigo-700 uppercase">Ones (1)</span>
            <span className="text-2xl font-black text-slate-900 mt-1">{ones}</span>
            <div className="w-full min-h-[90px] flex flex-wrap content-start justify-center gap-1.5 p-2 bg-slate-50 rounded-lg my-2">
              {Array.from({ length: ones }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm"
                >
                  1
                </div>
              ))}
            </div>
            <div className="flex gap-1 w-full">
              <button
                onClick={() => adjustDisk('ones', 1)}
                className="flex-1 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black rounded-lg text-xs transition active:scale-95"
              >
                +1
              </button>
              <button
                onClick={() => adjustDisk('ones', -1)}
                disabled={ones === 0}
                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-lg text-xs transition disabled:opacity-30"
              >
                -1
              </button>
            </div>
            <button
              onClick={unbundleOne}
              disabled={ones < 1}
              className="mt-2 w-full py-1 text-[10px] font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 rounded border border-indigo-200 disabled:opacity-30 transition"
            >
              Unbundle → 10 Tenths
            </button>
          </div>

          {/* Tenths */}
          <div className="flex flex-col items-center bg-white rounded-xl p-2.5 border border-slate-200 shadow-sm relative">
            <div className="absolute -left-2 top-6 w-3 h-3 rounded-full bg-slate-900 border-2 border-white shadow" />
            <span className="text-xs font-black text-cyan-700 uppercase">Tenths (0.1)</span>
            <span className="text-2xl font-black text-slate-900 mt-1">{tenths}</span>
            <div className="w-full min-h-[90px] flex flex-wrap content-start justify-center gap-1.5 p-2 bg-slate-50 rounded-lg my-2">
              {Array.from({ length: tenths }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm"
                >
                  .1
                </div>
              ))}
            </div>
            <div className="flex gap-1 w-full">
              <button
                onClick={() => adjustDisk('tenths', 1)}
                className="flex-1 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-black rounded-lg text-xs transition active:scale-95"
              >
                +.1
              </button>
              <button
                onClick={() => adjustDisk('tenths', -1)}
                disabled={tenths === 0}
                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-lg text-xs transition disabled:opacity-30"
              >
                -.1
              </button>
            </div>
            <div className="flex flex-col gap-1 w-full mt-2">
              <button
                onClick={bundleTenths}
                disabled={tenths < 10}
                className="w-full py-1 text-[10px] font-bold text-cyan-800 bg-cyan-100 hover:bg-cyan-200 rounded border border-cyan-300 disabled:opacity-30 transition"
              >
                ← Bundle 10 to 1 One
              </button>
              <button
                onClick={unbundleTenth}
                disabled={tenths < 1}
                className="w-full py-1 text-[10px] font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded border border-cyan-200 disabled:opacity-30 transition"
              >
                Unbundle → 10 Hund.
              </button>
            </div>
          </div>

          {/* Hundredths */}
          <div className="flex flex-col items-center bg-white rounded-xl p-2.5 border border-slate-200 shadow-sm">
            <span className="text-xs font-black text-emerald-700 uppercase">Hundredths (0.01)</span>
            <span className="text-2xl font-black text-slate-900 mt-1">{hundredths}</span>
            <div className="w-full min-h-[90px] flex flex-wrap content-start justify-center gap-1.5 p-2 bg-slate-50 rounded-lg my-2">
              {Array.from({ length: hundredths }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center shadow-sm"
                >
                  .01
                </div>
              ))}
            </div>
            <div className="flex gap-1 w-full">
              <button
                onClick={() => adjustDisk('hundredths', 1)}
                className="flex-1 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black rounded-lg text-xs transition active:scale-95"
              >
                +.01
              </button>
              <button
                onClick={() => adjustDisk('hundredths', -1)}
                disabled={hundredths === 0}
                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-lg text-xs transition disabled:opacity-30"
              >
                -.01
              </button>
            </div>
            <button
              onClick={bundleHundredths}
              disabled={hundredths < 10}
              className="mt-2 w-full py-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded border border-emerald-300 disabled:opacity-30 transition"
            >
              ← Bundle 10 to 1 Tenth
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Calculate: {q.startVal} {q.operation} {q.changeVal} = ?
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={answerInput}
            onChange={(e) => {
              setAnswerInput(e.target.value);
              if (status === 'incorrect') setStatus('idle');
            }}
            disabled={status === 'correct'}
            placeholder="e.g. 1.75"
            className={`w-36 text-center text-2xl font-black p-3 rounded-xl border-2 transition focus:outline-none ${
              status === 'correct'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                : status === 'incorrect'
                ? 'bg-rose-50 border-rose-500 text-rose-900'
                : 'bg-slate-50 border-slate-300 focus:border-cyan-500 text-slate-900'
            }`}
          />
          {status !== 'correct' ? (
            <button
              onClick={handleCheck}
              className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
            >
              {qIndex + 1 === curriculum.questions.length ? 'Finish Activity 🏆' : 'Next Problem →'}
            </button>
          )}
        </div>

        {status === 'correct' && (
          <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span>Correct! {q.startVal} {q.operation} {q.changeVal} = {q.correctAnswer}</span>
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