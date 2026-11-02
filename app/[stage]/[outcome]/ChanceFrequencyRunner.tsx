// app/[stage]/[outcome]/ChanceFrequencyRunner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { OutcomeCurriculum, ChanceQuestion } from '@/data/curriculum';

class ChanceSoundSynth {
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

  playTick() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
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

const sounds = new ChanceSoundSynth();

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

  const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
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

export default function ChanceFrequencyRunner({ curriculum }: { curriculum: OutcomeCurriculum }) {
  const [qIndex, setQIndex] = useState(0);
  const q = curriculum.questions[qIndex] as ChanceQuestion;

  const [numInput, setNumInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hint, setHint] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  // Live in-browser trial simulator
  const [simCount, setSimCount] = useState<number>(0);
  const [simHits, setSimHits] = useState<number>(0);

  useEffect(() => {
    setNumInput('');
    setSelectedOption(null);
    setStatus('idle');
    setHint(null);
    setSimCount(0);
    setSimHits(0);
  }, [qIndex, q]);

  // Run a batch of simulated trials in real time
  const runLiveSimulation = (batchSize: number) => {
    sounds.playTick();
    let additionalHits = 0;

    // Determine probability fraction for live trial
    const pStr = q.experimentDetails.probabilityStr;
    let prob = 0.5;
    if (pStr.includes('1/6')) prob = 1 / 6;
    else if (pStr.includes('1/4')) prob = 1 / 4;
    else if (pStr.includes('1/2')) prob = 1 / 2;
    else if (pStr.includes('1/5')) prob = 1 / 5;
    else if (pStr.includes('4/5')) prob = 4 / 5;
    else if (pStr.includes('7/10')) prob = 7 / 10;
    else if (pStr.includes('3/10')) prob = 3 / 10;

    for (let i = 0; i < batchSize; i++) {
      if (Math.random() < prob) {
        additionalHits++;
      }
    }

    setSimCount((prev) => prev + batchSize);
    setSimHits((prev) => prev + additionalHits);
  };

  const handleCheckAnswer = () => {
    let isUserCorrect = false;

    if (q.answerType === 'number') {
      const val = parseFloat(numInput.trim());
      if (isNaN(val)) {
        setStatus('incorrect');
        setHint('Type a numeric answer in the box before checking.');
        sounds.playBuzz();
        return;
      }
      isUserCorrect = val === Number(q.correctAnswer);
    } else {
      if (!selectedOption) {
        setStatus('incorrect');
        setHint('Select one of the options above.');
        sounds.playBuzz();
        return;
      }
      isUserCorrect = selectedOption === q.correctAnswer;
    }

    if (!isUserCorrect) {
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
        <div className="text-5xl mb-3">🎲</div>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">
          Outcome Completed
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">{curriculum.outcomeCode} Mastered!</h2>
        <p className="text-slate-600 text-sm mt-1">
          You mastered distinguishing frequency from probability, calculating expected frequencies, and analyzing randomness and fairness!
        </p>
        <button
          onClick={() => {
            setQIndex(0);
            setFinished(false);
          }}
          className="mt-6 w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition"
        >
          Practice Again ↺
        </button>
      </div>
    );
  }

  const categoryBadgeColor =
    q.category === 'terminology'
      ? 'bg-blue-100 text-blue-800'
      : q.category === 'expected-calc'
      ? 'bg-amber-100 text-amber-800'
      : q.category === 'observed-vs-expected'
      ? 'bg-violet-100 text-violet-800'
      : 'bg-emerald-100 text-emerald-800';

  return (
    <div className="w-full max-w-xl flex flex-col items-center select-none font-sans">
      {/* Scenario Header */}
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${categoryBadgeColor}`}>
            {q.category === 'terminology'
              ? 'Frequency vs Probability'
              : q.category === 'expected-calc'
              ? 'Expected Calculation'
              : q.category === 'observed-vs-expected'
              ? 'Observed vs Expected'
              : 'Fairness & Randomness'}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Question {qIndex + 1} of {curriculum.questions.length}
          </span>
        </div>
        <h2 className="text-base font-black text-slate-900">{q.title}</h2>
        <p className="text-sm font-semibold text-slate-700 mt-1 leading-relaxed">{q.scenario}</p>
      </div>

      {/* Visual Frequency & Comparison Mat */}
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Experiment Comparison Board
          </span>
          <span className="text-xs font-bold text-slate-400">
            {q.experimentDetails.device.toUpperCase()} • {q.experimentDetails.trials} TRIALS
          </span>
        </div>

        {/* Dual Cards: Expected vs Sample Observed */}
        <div className="w-full grid grid-cols-2 gap-3 mb-4">
          {/* Expected Card */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col items-center text-center">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
              Theoretical Expected
            </span>
            <span className="text-2xl font-black text-amber-950 mt-1">
              {q.experimentDetails.expectedFrequency}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 mt-0.5">
              Prob: {q.experimentDetails.probabilityStr}
            </span>
          </div>

          {/* Observed Card */}
          <div className="p-3 bg-violet-50 rounded-2xl border border-violet-200 flex flex-col items-center text-center">
            <span className="text-[11px] font-black uppercase tracking-wider text-violet-800">
              Sample Observed
            </span>
            <span className="text-2xl font-black text-violet-950 mt-1">
              {q.experimentDetails.sampleObservedFrequency}
            </span>
            <span className="text-[11px] font-semibold text-violet-700 mt-0.5">
              Target: {q.experimentDetails.targetOutcome}
            </span>
          </div>
        </div>

        {/* Interactive Live Chance Simulator Sandbox */}
        <div className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-700">
              Live Simulator: <strong className="font-mono">{simCount}</strong> spins/tosses
            </span>
            <span className="text-xs font-bold text-slate-500">
              Observed Hits: <strong className="font-mono text-emerald-600">{simHits}</strong>
              {simCount > 0 && ` (${Math.round((simHits / simCount) * 100)}%)`}
            </span>
          </div>

          {/* Quick Simulation Batch Triggers */}
          <div className="flex gap-2 w-full">
            <button
              onClick={() => runLiveSimulation(1)}
              className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black rounded-xl border border-slate-300 transition active:scale-95 shadow-sm"
            >
              +1 Trial
            </button>
            <button
              onClick={() => runLiveSimulation(10)}
              className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black rounded-xl border border-slate-300 transition active:scale-95 shadow-sm"
            >
              +10 Trials
            </button>
            <button
              onClick={() => runLiveSimulation(100)}
              className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black rounded-xl border border-amber-300 transition active:scale-95 shadow-sm"
            >
              +100 Trials ⚡
            </button>
          </div>
        </div>
      </div>

      {/* Answer Form & Multiple Choice Options */}
      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {q.prompt}
        </label>

        {q.answerType === 'number' ? (
          /* Numeric Input */
          <div className="flex gap-3">
            <input
              type="number"
              inputMode="numeric"
              value={numInput}
              onChange={(e) => {
                setNumInput(e.target.value);
                if (status === 'incorrect') setStatus('idle');
              }}
              disabled={status === 'correct'}
              placeholder="Frequency"
              className={`w-36 text-center text-2xl font-black p-3 rounded-xl border-2 transition focus:outline-none ${
                status === 'correct'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : status === 'incorrect'
                  ? 'bg-rose-50 border-rose-500 text-rose-900'
                  : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
              }`}
            />

            {status !== 'correct' ? (
              <button
                onClick={handleCheckAnswer}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
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
        ) : (
          /* Multiple Choice Selection */
          <div className="flex flex-col gap-2 mt-2">
            {q.options?.map((opt, idx) => (
              <button
                key={idx}
                disabled={status === 'correct'}
                onClick={() => {
                  sounds.playTick();
                  setSelectedOption(opt);
                  if (status === 'incorrect') setStatus('idle');
                }}
                className={`w-full text-left p-3 rounded-xl border-2 text-sm font-semibold transition active:scale-[0.99] ${
                  selectedOption === opt
                    ? 'bg-amber-500 border-amber-600 text-white font-bold shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            ))}

            <div className="mt-2">
              {status !== 'correct' ? (
                <button
                  onClick={handleCheckAnswer}
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition active:scale-95 text-base"
                >
                  {qIndex + 1 === curriculum.questions.length ? 'Finish Activity 🏆' : 'Next Question →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Status Alert Banners */}
        {status === 'correct' && (
          <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-sm font-semibold flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <div>
              <span className="font-bold block">Correct!</span>
              <span className="text-xs text-emerald-800">{q.explanation}</span>
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