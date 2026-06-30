/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VotingPoll, Language, TranslationDict } from '../types';
import { 
  Vote, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Users, 
  BarChart3, 
  Inbox,
  AlertTriangle
} from 'lucide-react';

interface VotingPageProps {
  polls: VotingPoll[];
  onUpdatePoll: (updatedPoll: VotingPoll) => void;
  lang: Language;
  translations: TranslationDict;
}

export default function VotingPage({ 
  polls, 
  onUpdatePoll, 
  lang, 
  translations 
}: VotingPageProps) {
  
  const handleVote = (poll: VotingPoll, optionId: string) => {
    // If user already voted on this poll, don't allow duplicate voting
    if (poll.userVotedOptionId) return;

    const updatedOptions = poll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    onUpdatePoll({
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
      userVotedOptionId: optionId
    });
  };

  // Divide polls into active and past
  const activePolls = polls.filter(p => p.isActive);
  const pastPolls = polls.filter(p => !p.isActive);

  // Helper to calculate countdown
  const getDaysRemaining = (deadlineStr: string) => {
    const deadlineDate = new Date(deadlineStr);
    const currentDate = new Date("2026-06-29"); // Static relative to current local context
    
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} Days left` : "Ended";
  };

  const renderPollCard = (poll: VotingPoll) => {
    const userVoted = !!poll.userVotedOptionId;
    const daysLeft = getDaysRemaining(poll.deadline);

    return (
      <div 
        key={poll.id} 
        id={`voting-poll-card-${poll.id}`}
        className={`bg-white border rounded-2xl p-6 space-y-5 transition-all shadow-sm ${
          userVoted 
            ? 'border-emerald-200 bg-emerald-50/10 shadow-inner' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Card Header metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Ward Poll #{poll.id}
          </span>
          
          <div className="flex items-center gap-3 text-[10px] text-slate-550 font-mono font-bold">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{poll.totalVotes} Total Votes</span>
            </span>
            <span className="text-slate-200">•</span>
            <span className={`flex items-center gap-1 ${poll.isActive ? 'text-orange-700' : 'text-slate-400'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{poll.isActive ? daysLeft : "Completed"}</span>
            </span>
          </div>
        </div>

        {/* Title / Question */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-800 tracking-tight leading-snug">{poll.title}</h3>
          <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{poll.description}</p>
        </div>

        {/* Options list */}
        <div className="space-y-3 pt-2">
          {poll.options.map((opt) => {
            const votesCount = opt.votes;
            const percentage = poll.totalVotes > 0 ? Math.round((votesCount / poll.totalVotes) * 100) : 0;
            const isUserSelection = poll.userVotedOptionId === opt.id;

            return (
              <div 
                key={opt.id}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/30 p-3.5 transition-all shadow-inner"
              >
                {/* Visual percentage expansion bar */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-500 z-0 ${
                    isUserSelection 
                      ? 'bg-emerald-100/40' 
                      : 'bg-slate-100/60'
                  }`} 
                  style={{ width: `${percentage}%` }}
                />

                {/* Content Overlay */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  {/* Select Trigger */}
                  <button
                    id={`btn-poll-vote-${poll.id}-${opt.id}`}
                    disabled={userVoted || !poll.isActive}
                    onClick={() => handleVote(poll, opt.id)}
                    className={`text-left text-xs font-bold transition-all flex items-center gap-2.5 flex-1 ${
                      userVoted || !poll.isActive 
                        ? 'cursor-default text-slate-700' 
                        : 'text-slate-700 hover:text-indigo-600 cursor-pointer'
                    }`}
                  >
                    {/* Circle radio */}
                    <span className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                      isUserSelection 
                        ? 'bg-emerald-650 border-emerald-500 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isUserSelection && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>

                  {/* Percentage score */}
                  <div className="text-right font-mono text-[10px] font-bold text-slate-700 shrink-0 select-none">
                    <span>{percentage}%</span>
                    <span className="text-slate-400 font-normal ml-1.5">({votesCount})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ledger vote success confirmation */}
        {userVoted && poll.isActive && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[10px] text-emerald-700 flex items-center gap-1.5 font-bold animate-in fade-in duration-200 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{translations.yourVoteCast}</span>
          </div>
        )}

      </div>
    );
  };

  return (
    <div id="voting-page-root" className="space-y-6">
      
      {/* 1. Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.votingTitle}</h2>
        <p className="text-xs text-slate-500 mt-1">{translations.votingSubtitle}</p>
      </div>

      {/* 2. Active Polls list */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Vote className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{translations.activePolls}</h3>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.2 rounded-full font-bold">
            {activePolls.length} Active
          </span>
        </div>

        {activePolls.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs shadow-sm">
            There are no active municipal ballots at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {activePolls.map(renderPollCard)}
          </div>
        )}
      </div>

      {/* 3. Completed Past results */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BarChart3 className="w-5 h-5 text-slate-500" />
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{translations.pastPolls}</h3>
          <span className="bg-slate-100 text-slate-650 border border-slate-200 text-[10px] px-2 py-0.2 rounded-full font-bold">
            {pastPolls.length} Concluded
          </span>
        </div>

        {pastPolls.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs shadow-sm">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>No historical ballots to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 opacity-85">
            {pastPolls.map(renderPollCard)}
          </div>
        )}
      </div>

    </div>
  );
}
