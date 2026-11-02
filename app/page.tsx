// app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NSW_CURRICULUM, StageId } from '@/data/curriculum';

interface StageMeta {
  id: StageId;
  label: string;
  subheading: string;
  description: string;
  badgeClass: string;
  headerAccent: string;
}

const STAGES: StageMeta[] = [
  {
    id: 'early-stage-1',
    label: 'Early Stage 1 (Kindy)',
    subheading: 'Early Stage 1 — Kindergarten',
    description: 'Foundations of number sense, subitising, and early counting patterns.',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    headerAccent: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  {
    id: 'stage-1',
    label: 'Stage 1 (Years 1–2)',
    subheading: 'Stage 1 — Years 1 & 2',
    description: 'Bridging through 10, dual ten-frames, and addition/subtraction structures.',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    headerAccent: 'text-sky-600 bg-sky-50 border-sky-200',
  },
  {
    id: 'stage-2',
    label: 'Stage 2 (Years 3–4)',
    subheading: 'Stage 2 — Years 3 & 4',
    description: 'Multiplicative thinking, partitioning arrays, and open number line jumps.',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    headerAccent: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  {
    id: 'stage-3',
    label: 'Stage 3 (Years 5–6)',
    subheading: 'Stage 3 — Years 5 & 6',
    description: 'Order of operations, brackets, decimal place-value, area decomposition, and chance.',
    badgeClass: 'bg-violet-100 text-violet-800 border-violet-200',
    headerAccent: 'text-violet-600 bg-violet-50 border-violet-200',
  },
];

const FILTER_BUTTONS: { id: StageId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Stages' },
  ...STAGES.map((s) => ({ id: s.id, label: s.label })),
];

export default function HomePage() {
  const [selectedStage, setSelectedStage] = useState<StageId | 'all'>('all');

  // Filter which stage sections to display
  const visibleStages = STAGES.filter((s) => {
    if (selectedStage === 'all') return true;
    return s.id === selectedStage;
  });

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header / Hero */}
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            NSW K–6 Mathematics
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ACS Mathematics Consolidation Hub
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Select the activity given by your teacher. These activities are designed to build on ideas, concepts and skills you have seen in class. By practicing and consolidating these skills we become more fluent and efficient when solving problems.
          </p>
        </header>

        {/* Stage Filter Buttons */}
        <nav aria-label="Filter activities by school stage" className="flex flex-wrap gap-2 mb-10">
          {FILTER_BUTTONS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedStage(filter.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                selectedStage === filter.id
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </nav>

        {/* Stage-Grouped Sections */}
        <div className="space-y-12">
          {visibleStages.map((stage) => {
            const stageOutcomes = Object.values(NSW_CURRICULUM).filter(
              (item) => item.stage === stage.id
            );

            if (stageOutcomes.length === 0) return null;

            return (
              <section key={stage.id} aria-labelledby={`heading-${stage.id}`} className="space-y-4">
                {/* Stage Subheading Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-3 gap-1">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2
                        id={`heading-${stage.id}`}
                        className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
                      >
                        {stage.subheading}
                      </h2>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${stage.headerAccent}`}
                      >
                        {stageOutcomes.length} {stageOutcomes.length === 1 ? 'Outcome' : 'Outcomes'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Activity Cards Grid for this Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stageOutcomes.map((item) => (
                    <Link
                      key={item.outcomeCode}
                      href={`/${item.stage}/${item.outcomeCode}`}
                      className="group block p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${stage.badgeClass}`}
                        >
                          {item.outcomeCode}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.questions.length} Questions
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {item.strand} • {item.focusArea}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}