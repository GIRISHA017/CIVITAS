/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language, TranslationDict } from '../types';
import { MOCK_NEWS_DIGEST } from '../data';
import { 
  Newspaper, 
  CheckCircle, 
  IndianRupee, 
  Sparkles, 
  Calendar, 
  BookOpen,
  Printer,
  TrendingUp,
  Share2
} from 'lucide-react';

interface NewspaperPageProps {
  lang: Language;
  translations: TranslationDict;
}

export default function NewspaperPage({ lang, translations }: NewspaperPageProps) {
  const digest = MOCK_NEWS_DIGEST;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="newspaper-page-root" className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. Top Controls Bar */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.navNews}</h2>
          <p className="text-xs text-slate-500 mt-1">Compiled and audited every Sunday morning for Ward 151 residents</p>
        </div>

        {/* Print & Share actions */}
        <div className="flex gap-2">
          <button
            id="btn-print-newspaper"
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Digest</span>
          </button>
        </div>
      </div>

      {/* 2. Classic Newspaper Layout Paper */}
      <div className="bg-[#fcfbf9] border-4 border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-800 shadow-md relative overflow-hidden font-serif">
        
        {/* Newspaper watermark header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

        {/* Paper Header block */}
        <div className="text-center border-b-4 border-double border-slate-200 pb-6 space-y-3 select-none">
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <Newspaper className="w-8 h-8" />
            <span className="text-xs tracking-widest font-sans font-bold uppercase">WARD 151 PUBLIC CHRONICLE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 font-sans leading-none py-1">
            {digest.headline.split(':')[0]}
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-sans border-t border-b border-slate-200 py-2.5 font-bold tracking-wider uppercase gap-2">
            <span>{digest.volume}</span>
            <span className="text-slate-700 text-xs tracking-normal">{digest.date}</span>
            <span>Bengaluru South Edition</span>
          </div>
        </div>

        {/* Main Content Double Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Main Editorial and Solved reports (Occupies 2/3 wide) */}
          <div className="md:col-span-2 space-y-6 md:border-r md:border-slate-200 md:pr-6">
            
            {/* Editor's summary paragraph */}
            <div className="space-y-2.5">
              <span className="first-letter:text-4xl first-letter:font-black first-letter:text-indigo-600 first-letter:float-left first-letter:mr-2 text-xs leading-relaxed text-slate-700 font-sans inline-block">
                {digest.editorNote}
              </span>
            </div>

            {/* Resolved issues list */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-black uppercase text-emerald-700 font-sans flex items-center gap-1.5 tracking-wider">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                <span>{translations.resolvedThisWeek} ({digest.solvedThisWeekCount})</span>
              </h3>

              <div className="space-y-4 pt-1">
                {digest.resolvedIssuesList.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-sm">
                    <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                      0{idx+1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 font-sans">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 font-sans mt-0.5 leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public financial highlights review */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-black uppercase text-indigo-700 font-sans flex items-center gap-1.5 tracking-wider">
                <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                <span>{translations.ledgerHighlights}</span>
              </h3>
              <p className="text-xs leading-relaxed text-slate-650 font-sans">
                {digest.ledgerSummary}
              </p>
            </div>

          </div>

          {/* Column 3: Entrepreneur & Upcoming spotlight (Occupies 1/3 narrow) */}
          <div className="space-y-6">
            
            {/* Featured Business card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm">
              <span className="flex items-center gap-1.5 text-[9px] text-purple-700 font-black uppercase tracking-widest font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{translations.featuredEntrepreneur}</span>
              </span>

              <h4 className="text-xs font-extrabold text-slate-850 font-sans leading-tight">
                {digest.featuredBusiness.name}
              </h4>
              
              <div className="text-[10px] text-slate-600 font-sans leading-relaxed">
                <p className="font-bold text-slate-700">Run by: {digest.featuredBusiness.owner}</p>
                <p className="mt-2 text-[10.5px] italic text-slate-500">"{digest.featuredBusiness.impact}"</p>
              </div>

              {/* Decorative stamp element */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                <span>+40% Direct Sales recorded</span>
              </div>
            </div>

            {/* Upcoming Event callout card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <span className="flex items-center gap-1.5 text-[9px] text-orange-700 font-black uppercase tracking-widest font-sans">
                <Calendar className="w-3.5 h-3.5" />
                <span>Next Volunteer Meet</span>
              </span>

              <h4 className="text-xs font-extrabold text-slate-850 font-sans leading-tight">
                {digest.upcomingEvent.title}
              </h4>

              <div className="text-[10.5px] text-slate-600 font-sans leading-relaxed">
                <p className="font-bold text-orange-700 font-mono">{digest.upcomingEvent.date}</p>
                <p className="mt-1">{digest.upcomingEvent.description}</p>
              </div>
            </div>

            {/* Audit compliance sign-off stamp */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3.5 text-center font-sans space-y-1 select-none shadow-inner">
              <span className="text-[9px] text-emerald-750 font-black tracking-widest uppercase">AUDIT COMPLIANT</span>
              <p className="text-[8px] text-slate-450 leading-tight">All reported statistics and ledgers have been verified by community-consensus voting hashes.</p>
            </div>

          </div>

        </div>

        {/* Paper Footer border */}
        <div className="border-t border-slate-200 pt-5 text-center text-[10px] text-slate-500 font-sans select-none flex flex-col sm:flex-row justify-between gap-2">
          <span>Civitas Platform Ward Digest // ISSN 481-9029</span>
          <span>© 2026 Civitas Inc. All Rights Reserved.</span>
        </div>

      </div>

    </div>
  );
}
