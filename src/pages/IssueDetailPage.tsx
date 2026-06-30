/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CivicIssue, 
  IssueStatus, 
  Comment, 
  Language, 
  TranslationDict 
} from '../types';
import CommentsSection from '../components/CommentsSection';
import { translateData } from '../translations';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  User, 
  Building2, 
  Mail, 
  FileText, 
  ThumbsUp, 
  ThumbsDown,
  Wrench,
  Camera,
  Play
} from 'lucide-react';

interface IssueDetailPageProps {
  issue: CivicIssue;
  onBack: () => void;
  onUpdateIssue: (updatedIssue: CivicIssue) => void;
  lang: Language;
  translations: TranslationDict;
}

export default function IssueDetailPage({ 
  issue, 
  onBack, 
  onUpdateIssue, 
  lang, 
  translations 
}: IssueDetailPageProps) {
  
  // Local state for dispute/confirmation votes
  const [localConfirmed, setLocalConfirmed] = useState<boolean | null>(
    issue.isResolvedConfirmedByCommunity !== undefined ? issue.isResolvedConfirmedByCommunity : null
  );
  const [confirmVotes, setConfirmVotes] = useState(issue.votesToConfirm || 0);
  const [disputeVotes, setDisputedVotes] = useState(issue.votesToDispute || 0);

  // States for manual stage advancement form
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState<IssueStatus>('authority_contacted');
  const [customDescription, setCustomDescription] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Comments state local wrapper triggers callback
  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      authorName: "Girish A. (You)",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onUpdateIssue({
      ...issue,
      comments: [...issue.comments, newComment]
    });
  };

  const handleCommunityConfirm = () => {
    if (localConfirmed === true) return;
    setLocalConfirmed(true);
    setConfirmVotes(prev => prev + 1);
    if (localConfirmed === false) {
      setDisputedVotes(prev => Math.max(0, prev - 1));
    }
    onUpdateIssue({
      ...issue,
      isResolvedConfirmedByCommunity: true,
      votesToConfirm: (issue.votesToConfirm || 0) + 1,
      votesToDispute: localConfirmed === false ? Math.max(0, (issue.votesToDispute || 0) - 1) : (issue.votesToDispute || 0)
    });
  };

  const handleCommunityDispute = () => {
    if (localConfirmed === false) return;
    setLocalConfirmed(false);
    setDisputedVotes(prev => prev + 1);
    if (localConfirmed === true) {
      setConfirmVotes(prev => Math.max(0, prev - 1));
    }
    onUpdateIssue({
      ...issue,
      isResolvedConfirmedByCommunity: false,
      votesToDispute: (issue.votesToDispute || 0) + 1,
      votesToConfirm: localConfirmed === true ? Math.max(0, (issue.votesToConfirm || 0) - 1) : (issue.votesToConfirm || 0),
      isDisputed: true
    });
  };

  // ADVANCE STATUS SIMULATOR WITH MANUAL DATA ENTRY
  const handleAdvanceStatus = () => {
    // Determine next sequential status logically but let user customize it
    let next: IssueStatus = 'reported';

    if (issue.status === 'reported') {
      next = 'authority_contacted';
    } else if (issue.status === 'authority_contacted') {
      next = 'in_progress';
    } else if (issue.status === 'in_progress') {
      next = 'resolved';
    } else {
      next = 'reported';
    }

    setSelectedNextStatus(next);
    setCustomDescription('');
    setCustomImageUrl('');
    setIsStageModalOpen(true);
  };

  const handleSaveStageAdvance = () => {
    const updatedProofs = { ...issue.proofs };
    
    // Create combined data format: IMAGE_URL|DESCRIPTION
    const combinedData = customImageUrl 
      ? `${customImageUrl}|${customDescription}` 
      : customDescription;

    if (selectedNextStatus === 'reported') {
      // Loop back or reset
      delete updatedProofs.contacted;
      delete updatedProofs.progress;
      delete updatedProofs.resolved;
    } else if (selectedNextStatus === 'authority_contacted') {
      updatedProofs.contacted = combinedData;
    } else if (selectedNextStatus === 'in_progress') {
      updatedProofs.progress = combinedData;
    } else if (selectedNextStatus === 'resolved') {
      updatedProofs.resolved = combinedData;
    }

    onUpdateIssue({
      ...issue,
      status: selectedNextStatus,
      proofs: updatedProofs,
      isResolvedConfirmedByCommunity: undefined,
      isDisputed: false
    });
    setLocalConfirmed(null);
    setIsStageModalOpen(false);
  };

  // Timeline Step Generator
  const steps: { id: IssueStatus; label: string; description: string; proofKey: keyof typeof issue.proofs }[] = [
    { id: 'reported', label: translations.statusReported, description: 'Filed by citizen with initial photo', proofKey: 'reported' },
    { id: 'authority_contacted', label: translations.statusAuthorityContacted, description: 'Dispatched to official division', proofKey: 'contacted' },
    { id: 'in_progress', label: translations.statusInProgress, description: 'Repair crew assigned & on-site', proofKey: 'progress' },
    { id: 'resolved', label: translations.statusResolved, description: 'Resolution declared by official representative', proofKey: 'resolved' }
  ];

  const getStatusIndex = (status: IssueStatus) => {
    switch (status) {
      case 'reported': return 0;
      case 'authority_contacted': return 1;
      case 'in_progress': return 2;
      case 'resolved': return 3;
    }
  };

  const currentStepIndex = getStatusIndex(issue.status);

  return (
    <div id="issue-detail-root" className="space-y-6">
      
      {/* 1. Back and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          id="btn-back-to-home"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-850 transition-all cursor-pointer bg-white border border-slate-200 px-4 py-2.5 rounded-xl w-fit shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        {/* Advance Stage Tester Simulator widget */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 border border-slate-200 rounded-xl shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-2">🛠️ Stage Tester:</span>
          <button
            id="btn-advance-status-simulator"
            onClick={handleAdvanceStatus}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Move Stage</span>
          </button>
        </div>
      </div>

      {/* 2. Issue Title & Meta Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Issue Tracker #{issue.id}
          </span>
          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
            issue.severity === 'high' 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : issue.severity === 'medium'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-105 text-slate-600 border-slate-200'
          }`}>
            {issue.severity} Priority
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight leading-snug">
          {translateData(issue.id, 'title', issue.title, lang)}
        </h3>
        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
          {translateData(issue.id, 'description', issue.description, lang)}
        </p>

        {/* Municipal Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-5 mt-5">
          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Reported By</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{issue.reportedBy} ({issue.reportedDate})</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">{translations.authorityNotified}</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{issue.authorityDepartment}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">{translations.assignedTo}</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{issue.authorityContactPerson}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visual Interactive Stage Tracker Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
          Authority Remediation Progress Timeline
        </h3>

        {/* Timeline Line Grid */}
        <div className="relative flex flex-col md:flex-row gap-6 md:gap-4 md:justify-between items-start md:items-stretch">
          
          {/* Horizontal line (for desktop only) */}
          <div className="absolute top-[18px] left-[15px] right-[15px] h-0.5 bg-slate-100 hidden md:block z-0" />
          
          {/* Active progress bar (for desktop only) */}
          <div 
            className="absolute top-[18px] left-[15px] h-0.5 bg-indigo-600 hidden md:block z-0 transition-all duration-500" 
            style={{ width: `${(currentStepIndex / 3) * 92}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;
            const proofData = issue.proofs[step.proofKey];

            return (
              <div 
                key={step.id} 
                className="flex md:flex-col gap-3 md:gap-0 items-start md:items-center text-left md:text-center flex-1 z-10"
              >
                {/* Step circle indicator */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                  isCompleted 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Clock className="w-4 h-4" />}
                </div>

                {/* Text blocks */}
                <div className="mt-0.5 md:mt-3">
                  <h4 className={`text-xs font-bold ${isCompleted ? 'text-slate-855 font-extrabold' : 'text-slate-400'}`}>{step.label}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed max-w-[150px]">{step.description}</p>
                </div>

                {/* Proof Details for current/completed steps */}
                <div className="mt-2.5 md:mt-4 w-full md:max-w-[180px] text-[10px] bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-left text-slate-600 shadow-inner">
                  <span className="font-bold text-slate-450 uppercase text-[8px] tracking-wider block mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-450" />
                    Stage Proof Log
                  </span>
                  {proofData ? (
                    (() => {
                      const hasPipe = proofData.includes('|');
                      const imageUrl = hasPipe ? proofData.split('|')[0] : (proofData.startsWith('http') ? proofData : '');
                      const textDesc = hasPipe ? proofData.split('|')[1] : (!proofData.startsWith('http') ? proofData : '');

                      return (
                        <div className="space-y-1.5">
                          {imageUrl && (
                            <div>
                              <span className="text-indigo-600 font-bold flex items-center gap-1 mb-1">
                                <Camera className="w-3 h-3" />
                                Photo Proof
                              </span>
                              <img 
                                src={imageUrl} 
                                alt={`${step.label} proof`} 
                                className="w-full h-20 rounded object-cover border border-slate-200 bg-slate-100"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          {textDesc && (
                            <p className="leading-relaxed font-mono text-[9px] text-slate-650 bg-white p-1.5 rounded border border-slate-250/50">{textDesc}</p>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-slate-400 font-mono italic">No proof attached</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Resolved Community Vote / Dispute Panel (Only triggers if status is Resolved!) */}
      {issue.status === 'resolved' && (
        <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{translations.resolutionDispute}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The municipal authority has declared this issue closed. To maintain absolute accountability, we require the neighborhood's validation. Your vote logs directly onto the civic trust ledger.
              </p>

              {/* Vote Actions bar */}
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <button
                  id="btn-resolution-confirm"
                  onClick={handleCommunityConfirm}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${
                    localConfirmed === true
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 shrink-0" />
                  <span>{translations.confirmAction} ({confirmVotes})</span>
                </button>

                <button
                  id="btn-resolution-dispute"
                  onClick={handleCommunityDispute}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${
                    localConfirmed === false
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 shrink-0" />
                  <span>{translations.disputeAction} ({disputeVotes})</span>
                </button>
              </div>

              {/* Vote cast message */}
              {localConfirmed !== null && (
                <div className="mt-3.5 text-[11px] text-emerald-700 flex items-center gap-1.5 font-bold animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{translations.yourVoteCast}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Discussion Feed thread */}
      <CommentsSection 
        comments={issue.comments}
        onAddComment={handleAddComment}
        lang={lang}
        title={translations.comments}
      />

      {/* Manual Remediation Advance Stage Modal */}
      {isStageModalOpen && (
        <div id="remediation-stage-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white relative">
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-400 animate-spin" />
                <span>Advance Remediation Stage & Log Proof</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verify civic improvements by entering official notes and verifying photographs manually.
              </p>
            </div>

            {/* Content Form */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
              {/* Stage Indicator */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">Target Remediation Stage</label>
                <select
                  value={selectedNextStatus}
                  onChange={(e) => setSelectedNextStatus(e.target.value as IssueStatus)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="reported">Reported</option>
                  <option value="authority_contacted">Authority Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Log Notes Textarea */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">Remediation Status Description (Data)</label>
                <textarea 
                  rows={3}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Enter detailed description of activities completed at this stage..."
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              {/* Photo Proof URL / Preset Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">Photo Proof URL (Optional)</label>
                <input 
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Paste direct photo link (starts with http) or select a preset below..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-mono"
                />

                {/* Preset suggestions */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quick Preset Images:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Worksite', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400' },
                      { label: 'Completed', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400' },
                      { label: 'Cleaned Park', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400' },
                      { label: 'No Photo', url: '' }
                    ].map((preset, pIdx) => (
                      <button 
                        key={pIdx}
                        type="button"
                        onClick={() => setCustomImageUrl(preset.url)}
                        className={`p-2 border text-[9px] font-bold rounded-lg transition-all ${
                          customImageUrl === preset.url 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsStageModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveStageAdvance}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Move Stage</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
