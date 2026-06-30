/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Comment, Language } from '../types';
import { MessageSquare, Send, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  lang: Language;
  title?: string;
  isFlaggedItem?: boolean;
  onToggleFlag?: () => void;
}

export default function CommentsSection({ 
  comments, 
  onAddComment, 
  lang, 
  title = "Discussion Feed",
  isFlaggedItem = false,
  onToggleFlag 
}: CommentsSectionProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm mt-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">{title}</h3>
          <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {comments.length}
          </span>
        </div>

        {/* Audit Flag Toggle for transparency audits */}
        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isFlaggedItem 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span>{isFlaggedItem ? "Flagged for Auditor Review" : "Raise Audit Concern / Flag"}</span>
          </button>
        )}
      </div>

      {/* Flag Warning Banner */}
      {isFlaggedItem && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl leading-relaxed flex gap-2.5 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Audit Query Active</p>
            <p className="text-red-700/90">This transaction or issue has been highlighted by residents as having questionable metrics. Municipal auditors and ward council members have been auto-alerted to respond in this feed.</p>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No comments yet. Start the conversation by asking a question or offering support.
          </div>
        ) : (
          comments.map((comment) => {
            const isOfficial = !!comment.authorRole;
            return (
              <div 
                key={comment.id} 
                className={`p-3.5 rounded-xl border flex gap-3 transition-colors ${
                  isOfficial 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-white border-slate-200/60 shadow-sm'
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {comment.avatarUrl ? (
                    <img 
                      src={comment.avatarUrl} 
                      alt={comment.authorName} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase ${
                      isOfficial ? 'bg-emerald-600' : 'bg-slate-500'
                    }`}>
                      {comment.authorName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-800">{comment.authorName}</span>
                    
                    {/* Official badge (e.g. Ward Representative, BBMP Officer) */}
                    {isOfficial && (
                      <span className="flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-bold border border-emerald-200">
                        <UserCheck className="w-2.5 h-2.5" />
                        {comment.authorRole}
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono ml-auto">{comment.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed break-words">{comment.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 relative mt-4">
        <input
          id="comment-text-input"
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type comment or audit query here..."
          className="flex-1 bg-white text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
        />
        <button
          type="submit"
          id="btn-submit-comment"
          disabled={!commentText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all duration-150 disabled:bg-slate-100 disabled:text-slate-400 shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
