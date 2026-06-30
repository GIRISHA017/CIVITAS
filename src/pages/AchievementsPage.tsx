/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AchievementPost, Badge, Language, TranslationDict, Comment } from '../types';
import { MOCK_BADGES } from '../data';
import CommentsSection from '../components/CommentsSection';
import { 
  Award, 
  ThumbsUp, 
  Sparkles, 
  Camera, 
  Send, 
  Plus, 
  User, 
  Check, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

interface AchievementsPageProps {
  achievements: AchievementPost[];
  onAddAchievement: (newAch: Omit<AchievementPost, 'id' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'comments'>) => void;
  onUpdateAchievement: (updatedAch: AchievementPost) => void;
  lang: Language;
  translations: TranslationDict;
  userPoints: number;
  userLevel: number;
}

export default function AchievementsPage({ 
  achievements, 
  onAddAchievement, 
  onUpdateAchievement, 
  lang, 
  translations,
  userPoints,
  userLevel
}: AchievementsPageProps) {
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Local state for expanded comment threads
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const handleToggleComments = (id: string) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  const handleLike = (post: AchievementPost) => {
    onUpdateAchievement({
      ...post,
      likes: post.likes + 1
    });
  };

  const handleAddComment = (post: AchievementPost, text: string) => {
    const newComment: Comment = {
      id: `achcomm_${Date.now()}`,
      authorName: "Girish A. (You)",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onUpdateAchievement({
      ...post,
      comments: [...post.comments, newComment]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddAchievement({
      title,
      description,
      badgeId: selectedBadgeId || undefined,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400"
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setSelectedBadgeId('');
    setImageUrl('');
    setIsFormOpen(false);
  };

  return (
    <div id="achievements-page-root" className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.achievementsTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">{translations.achievementsSubtitle}</p>
        </div>

        {/* Share Achievement CTA button */}
        <button
          id="btn-open-achievement-form"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{translations.shareAchievement}</span>
        </button>
      </div>

      {/* 2. Gamified Scoreboard and Badge Grid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scoreboard Left widget */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between h-48 shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Your Hero Standing</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-800">{translations.userLevel} {userLevel}</span>
              <span className="text-xs text-slate-550">({userPoints} Total Points)</span>
            </div>
            {/* Elegant progress bar to next level */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden border border-slate-200">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-[9px] text-slate-400 mt-2 font-mono">650 / 1000 Pts to reach level {userLevel + 1}</p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top 5% active residents this week</span>
          </div>
        </div>

        {/* Badge cabinet widget (2/3 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between h-auto lg:h-48 shadow-sm">
          <span className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Your Unlocked Badges ({MOCK_BADGES.length - 1} / {MOCK_BADGES.length})</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-3">
            {MOCK_BADGES.map((badge) => (
              <div 
                key={badge.id}
                className="p-2.5 rounded-xl border flex items-center gap-2.5 bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 transition-all shadow-inner"
                title={badge.description}
              >
                <div className={`w-8 h-8 rounded-lg ${badge.color} flex items-center justify-center font-bold shrink-0 border border-white`}>
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-700 truncate">{badge.name}</h4>
                  <span className="text-[8px] text-slate-400 block truncate leading-relaxed">Unlocked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Collapsible Share Contribution Form */}
      {isFormOpen && (
        <form 
          onSubmit={handleSubmit} 
          className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm animate-in slide-in-from-top-4 duration-200"
        >
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>What civic act did you complete?</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Achievement Title</label>
              <input
                id="achievement-title-input"
                type="text"
                required
                placeholder="e.g. Cleared garbage pile at Sector 2 corner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Select Badge Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Related Badge category</label>
              <select
                id="achievement-badge-select"
                value={selectedBadgeId}
                onChange={(e) => setSelectedBadgeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="">No special badge (Simple contribution)</option>
                {MOCK_BADGES.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.description})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description details */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Describe your activity</label>
            <textarea
              id="achievement-desc-textarea"
              required
              rows={3}
              placeholder="Detail what actions you took, how long it took, and how it benefits your neighbors..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Optional image link mock */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo URL (Optional mockup image link)</label>
            <input
              id="achievement-img-input"
              type="text"
              placeholder="e.g. https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              id="btn-achievement-form-cancel"
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-achievement-form-submit"
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Post Victory
            </button>
          </div>

        </form>
      )}

      {/* 4. Social Achievements feed list */}
      <div className="space-y-5">
        {achievements.map((post) => {
          const associatedBadge = MOCK_BADGES.find(b => b.id === post.badgeId);
          const isCommentsExpanded = expandedPostId === post.id;

          return (
            <div 
              key={post.id} 
              id={`achievement-post-${post.id}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-5 space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* User Post Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {post.userAvatar ? (
                    <img 
                      src={post.userAvatar} 
                      alt={post.userName} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                      {post.userName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{post.userName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono font-bold block">{post.timestamp}</span>
                  </div>
                </div>

                {/* Unlocked Badge Overlay */}
                {associatedBadge && (
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Badge Earned: {associatedBadge.name}</span>
                  </div>
                )}
              </div>

              {/* Text content details */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-extrabold text-slate-850">{post.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{post.description}</p>
                
                {post.imageUrl && (
                  <div className="relative max-h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full object-cover max-h-64 opacity-95 hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Interaction bottom bar */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                <button
                  id={`btn-achievement-like-${post.id}`}
                  onClick={() => handleLike(post)}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <ThumbsUp className="w-4 h-4 text-indigo-600" />
                  <span>{translations.likes} ({post.likes})</span>
                </button>

                <button
                  id={`btn-achievement-comments-toggle-${post.id}`}
                  onClick={() => handleToggleComments(post.id)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-850 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {isCommentsExpanded ? "Hide Comments" : `Show Comments (${post.comments.length})`}
                </button>
              </div>

              {/* Expanded Comments Thread */}
              {isCommentsExpanded && (
                <div className="pt-2 animate-in slide-in-from-top-2 duration-150">
                  <CommentsSection 
                    comments={post.comments}
                    onAddComment={(text) => handleAddComment(post, text)}
                    lang={lang}
                    title="Applause and supportive neighbor comments"
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
