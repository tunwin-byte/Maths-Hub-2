// app/[stage]/[outcome]/AreaDecompositionRunner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { OutcomeCurriculum, AreaQuestion } from '@/data/curriculum';

class AreaSoundSynth {
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

  playSlice() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.05);
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

const sounds = new AreaSoundSynth();

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

  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
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

export default function AreaDecompositionRunner({ curriculum }: { curriculum: OutcomeCurriculum }) {
  const [qIndex, setQIndex] = useState(0);
  const q = curriculum.questions[qIndex] as AreaQuestion;

  // L-shape strategy: 'none' | 'vertical' | 'horizontal' | 'subtract'
  const [lSplit, setLSplit] = useState<'none' | 'vertical' | 'horizontal' | 'subtract'>('none');
  // Parallelogram: is the triangle sliced and shifted to form a rectangle?
  const [isRearranged, setIsRearranged] = useState(false);
  // Triangle: is the duplicate triangle shown to form a parallelogram?
  const [isDuplicated, setIsDuplicated] = useState(false);

  const [answerInput, setAnswerInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hint, setHint] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setLSplit('none');
    setIsRearranged(false);
    setIsDuplicated(false);
    setAnswerInput('');
    setStatus('idle');
    setHint(null);
  }, [qIndex, q]);

  const handleCheck = () => {
    const val = parseFloat(answerInput.trim());

    if (isNaN(val)) {
      setStatus('incorrect');
      setHint('Enter your calculated area in the box.');
      sounds.playBuzz();
      return;
    }

    if (Math.abs(val - q.correctArea) > 0.1) {
      setStatus('incorrect');
      setHint(q.hint);
      sounds.playBuzz();
      return;
    }

    // Success
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
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase">
          Outcome Completed
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">{curriculum.outcomeCode} Mastered!</h2>
        <p className="text-slate-600 text-sm mt-1">
          You mastered calculating the area of composite L-shapes, parallelograms, and triangles!
        </p>
        <button
          onClick={() => {
            setQIndex(0);
            setFinished(false);
          }}
          className="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
        >
          Practice Again ↺
        </button>
      </div>
    );
  }

  const badgeBg =
    q.shapeType === 'l-shape'
      ? 'bg-amber-100 text-amber-800'
      : q.shapeType === 'parallelogram'
      ? 'bg-indigo-100 text-indigo-800'
      : 'bg-emerald-100 text-emerald-800';

  return (
    <div className="w-full max-w-xl flex flex-col items-center select-none font-sans">
      {/* Question Header Card */}
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${badgeBg}`}>
            {q.shapeType === 'l-shape'
              ? 'Composite L-Shape'
              : q.shapeType === 'parallelogram'
              ? 'Parallelogram Dissection'
              : 'Triangle Duplication'}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Question {qIndex + 1} of {curriculum.questions.length}
          </span>
        </div>
        <h2 className="text-base font-black text-slate-900">{q.title}</h2>
        <p className="text-sm font-semibold text-slate-700 mt-1 leading-relaxed">{q.prompt}</p>
      </div>

      {/* Interactive Geometric Dissection Canvas */}
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Interactive Dissection Mat
          </span>
          <span className="text-xs font-bold text-slate-400">Tap controls to transform</span>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="w-full h-56 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden">
          {/* 1. L-SHAPE VISUALIZATION */}
          {q.shapeType === 'l-shape' && (
            <svg viewBox="0 0 280 180" className="w-full h-full max-w-[260px]">
              {/* Outer Bounding box when subtract strategy is active */}
              {lSplit === 'subtract' && (
                <rect
                  x="30"
                  y="20"
                  width="200"
                  height="140"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )}

              {/* Main L-Shape Body */}
              <polygon
                points="30,20 110,20 110,80 230,80 230,160 30,160"
                fill="#fef3c7"
                stroke="#d97706"
                strokeWidth="3"
              />

              {/* Cutout area dashed box */}
              <rect
                x="110"
                y="20"
                width="120"
                height="60"
                fill={lSplit === 'subtract' ? '#fecdd3' : 'none'}
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Vertical Split Line */}
              {lSplit === 'vertical' && (
                <line x1="110" y1="20" x2="110" y2="160" stroke="#2563eb" strokeWidth="3" strokeDasharray="5 3" />
              )}

              {/* Horizontal Split Line */}
              {lSplit === 'horizontal' && (
                <line x1="30" y1="80" x2="230" y2="80" stroke="#16a34a" strokeWidth="3" strokeDasharray="5 3" />
              )}

              {/* Labels */}
              <text x="130" y="175" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">
                Width: {q.dimensions.totalWidth}
              </text>
              <text x="15" y="90" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">
                Height: {q.dimensions.totalHeight}
              </text>
              <text x="170" y="55" textAnchor="middle" className="text-[10px] font-bold fill-rose-600">
                Cut: {q.dimensions.cutWidth} × {q.dimensions.cutHeight}
              </text>
            </svg>
          )}

          {/* 2. PARALLELOGRAM DISSECTION VISUALIZATION */}
          {q.shapeType === 'parallelogram' && (
            <svg viewBox="0 0 280 180" className="w-full h-full max-w-[260px]">
              {/* Baseline */}
              <line x1="30" y1="140" x2="230" y2="140" stroke="#cbd5e1" strokeWidth="2" />

              {!isRearranged ? (
                /* Uncut Parallelogram */
                <g>
                  <polygon
                    points="60,40 210,40 180,140 30,140"
                    fill="#e0e7ff"
                    stroke="#4f46e5"
                    strokeWidth="3"
                  />
                  {/* Perpendicular Height dotted drop line */}
                  <line x1="60" y1="40" x2="60" y2="140" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3" />
                  <rect x="60" y="130" width="10" height="10" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="75" y="95" className="text-[10px] font-black fill-red-600">
                    h = {q.dimensions.height}
                  </text>
                </g>
              ) : (
                /* Rearranged into Rectangle */
                <g>
                  {/* Central Body */}
                  <polygon points="60,40 180,40 180,140 60,140" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
                  {/* Shifted Right Triangle filling the other side */}
                  <polygon points="180,40 210,40 180,140" fill="#a5b4fc" stroke="#4338ca" strokeWidth="2" />
                  <text x="120" y="95" textAnchor="middle" className="text-xs font-black fill-indigo-900">
                    Rectangle: b × h
                  </text>
                </g>
              )}

              {/* Base Label */}
              <text x="110" y="160" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">
                Base = {q.dimensions.base}
              </text>
            </svg>
          )}

          {/* 3. TRIANGLE DUPLICATION & ROTATION VISUALIZATION */}
          {q.shapeType === 'triangle' && (
            <svg viewBox="0 0 280 180" className="w-full h-full max-w-[260px]">
              {/* Original Triangle */}
              <polygon
                points="40,140 200,140 130,40"
                fill="#d1fae5"
                stroke="#059669"
                strokeWidth="3"
              />

              {/* Perpendicular Height Line */}
              <line x1="130" y1="40" x2="130" y2="140" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3" />
              <text x="140" y="95" className="text-[10px] font-black fill-red-600">
                h = {q.dimensions.height}
              </text>

              {/* Duplicated Rotated Triangle forming full Parallelogram */}
              {isDuplicated && (
                <polygon
                  points="130,40 200,140 290,40"
                  fill="#6ee7b7"
                  fillOpacity="0.6"
                  stroke="#047857"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              )}

              {/* Base Dimension */}
              <text x="120" y="160" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">
                Base = {q.dimensions.base}
              </text>
            </svg>
          )}
        </div>

        {/* Dynamic Transformation Controls */}
        <div className="w-full mt-3 flex flex-wrap gap-2 items-center justify-center">
          {q.shapeType === 'l-shape' && (
            <>
              <button
                onClick={() => {
                  sounds.playSlice();
                  setLSplit(lSplit === 'vertical' ? 'none' : 'vertical');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  lSplit === 'vertical' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Vertical Split Line ✂️
              </button>
              <button
                onClick={() => {
                  sounds.playSlice();
                  setLSplit(lSplit === 'horizontal' ? 'none' : 'horizontal');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  lSplit === 'horizontal' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Horizontal Split Line ✂️
              </button>
              <button
                onClick={() => {
                  sounds.playSlice();
                  setLSplit(lSplit === 'subtract' ? 'none' : 'subtract');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  lSplit === 'subtract' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Box Subtraction Method 🔲
              </button>
            </>
          )}

          {q.shapeType === 'parallelogram' && (
            <button
              onClick={() => {
                sounds.playSlice();
                setIsRearranged(!isRearranged);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition shadow-sm ${
                isRearranged ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              {isRearranged ? '↺ Reset to Parallelogram' : '✂️ Dissect Triangle & Translate to Rectangle'}
            </button>
          )}

          {q.shapeType === 'triangle' && (
            <button
              onClick={() => {
                sounds.playSlice();
                setIsDuplicated(!isDuplicated);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition shadow-sm ${
                isDuplicated ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isDuplicated ? '↺ Show Triangle Alone' : '🔄 Duplicate & Rotate to Parallelogram (2×)'}
            </button>
          )}
        </div>
      </div>

      {/* Answer Form & Feedback */}
      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Calculate the Total Area:
        </label>

        <div className="flex gap-3">
          <input
            type="number"
            inputMode="numeric"
            value={answerInput}
            onChange={(e) => {
              setAnswerInput(e.target.value);
              if (status === 'incorrect') setStatus('idle');
            }}
            disabled={status === 'correct'}
            placeholder="Area"
            className={`w-32 text-center text-2xl font-black p-3 rounded-xl border-2 transition focus:outline-none ${
              status === 'correct'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                : status === 'incorrect'
                ? 'bg-rose-50 border-rose-500 text-rose-900'
                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900'
            }`}
          />

          {status !== 'correct' ? (
            <button
              onClick={handleCheck}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
            >
              Check Area
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

        {/* Strategy Breakdown Banner */}
        {status === 'correct' && (
          <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-sm font-semibold flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <div>
              <span className="font-bold block">Correct! Area = {q.correctArea}</span>
              <span className="text-xs text-emerald-800">{q.decompositionStrategy}</span>
            </div>
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