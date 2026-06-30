/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserProfile, 
  Language, 
  TranslationDict, 
  CivicIssue, 
  VotingPoll 
} from '../types';
import { MOCK_BADGES } from '../data';
import { 
  User, 
  Settings, 
  Shield, 
  Mail, 
  Award, 
  ClipboardList, 
  Vote, 
  Volume2, 
  Globe,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  issues: CivicIssue[];
  polls: VotingPoll[];
  onSelectIssue: (issue: CivicIssue) => void;
  lang: Language;
  translations: TranslationDict;
}

export default function ProfilePage({ 
  profile, 
  onUpdateProfile, 
  issues, 
  polls,
  onSelectIssue,
  lang, 
  translations 
}: ProfilePageProps) {
  
  const [activeTab, setActiveTab] = useState<'reports' | 'votes' | 'badges'>('reports');

  // Profile Edit Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150");

  // Filter issues reported by this user (mock matches 'Girish A.')
  const myIssues = issues.filter(issue => issue.reportedBy.includes('Girish A.') || issue.reportedBy.includes(profile.name));

  // Filter polls the user has voted on
  const myVotes = polls.filter(poll => !!poll.userVotedOptionId);

  const handleLanguageChange = (newLang: Language) => {
    onUpdateProfile({
      ...profile,
      language: newLang
    });
  };

  const handleToggleVoice = () => {
    onUpdateProfile({
      ...profile,
      voiceAccessEnabled: !profile.voiceAccessEnabled
    });
  };

  return (
    <div id="profile-page-root" className="space-y-6">
      
      {/* 1. Page Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.navProfile}</h2>
        <p className="text-xs text-slate-500 mt-1">Manage your civic preferences, tracking history, and achievements</p>
      </div>

      {/* 2. User Bio Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {isEditing ? (
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">Edit Profile Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Avatar Preset Choice</label>
              <div className="flex items-center gap-3">
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
                ].map((url, index) => (
                  <button 
                    key={index}
                    type="button"
                    onClick={() => setEditAvatar(url)}
                    className={`relative rounded-full border-2 overflow-hidden w-12 h-12 transition-all ${
                      editAvatar === url ? 'border-indigo-600 scale-105 shadow' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setEditName(profile.name);
                  setEditEmail(profile.email);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  onUpdateProfile({
                    ...profile,
                    name: editName,
                    email: editEmail,
                    avatarUrl: editAvatar
                  });
                  setIsEditing(false);
                }}
                className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0 select-none">
              <img 
                src={profile.avatarUrl || editAvatar} 
                alt={profile.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-xl"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 border border-white text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow">
                Lvl{profile.level}
              </span>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h3 className="text-md font-black text-slate-800">{profile.name}</h3>
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ward 151 Ambassador</span>
                </span>
              </div>

              <p className="text-xs text-slate-650 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.email}</span>
              </p>

              <p className="text-[11px] text-slate-600">
                You have earned <strong className="text-indigo-650 font-extrabold">{profile.points} Hero Points</strong> by helping resolve {issues.filter(i => i.status === 'resolved' && (i.reportedBy.includes('Girish A.') || i.reportedBy.includes(profile.name))).length} neighborhood issues!
              </p>
            </div>

            {/* Edit button */}
            <button 
              id="btn-trigger-edit-profile"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-750 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
            >
              Update Profile Details
            </button>
          </div>
        )}
      </div>

      {/* 3. Settings & Accessibility Preferences block */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-slate-550" />
          <span>Regional & Accessibility Settings</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Language Selection dictionary trigger */}
          <div className="space-y-2">
            <label id="language-selector-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Select System Translation Language</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                { code: 'te', label: 'తెలుగు (Telugu)' },
                { code: 'ta', label: 'தமிழ் (Tamil)' },
                { code: 'ml', label: 'മലയാളം (Malayalam)' },
                { code: 'mr', label: 'मराठी (Marathi)' }
              ].map((l) => (
                <button
                  key={l.code}
                  id={`btn-language-profile-${l.code}`}
                  onClick={() => handleLanguageChange(l.code as Language)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    profile.language === l.code
                      ? 'bg-indigo-600 border-indigo-500 text-white font-extrabold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Mic Toggle */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Speech-to-Text accessibility</span>
            </label>
            <button
              id="btn-toggle-voice-pref"
              type="button"
              onClick={handleToggleVoice}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                profile.voiceAccessEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <span>Auto-enable Voice Reporting Microphone</span>
              <span className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${
                profile.voiceAccessEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}>
                <span className="w-4 h-4 rounded-full bg-white shadow" />
              </span>
            </button>
          </div>

        </div>

        {/* Info accessibility */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-600 flex items-start gap-2 shadow-inner">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p>
            🎙️ <strong>Web Speech Integration Enabled:</strong> You can click the floating green megaphone icon in the bottom-right corner of the app at any time to have the entire screen's content read aloud. Speech recognition dictation is also active in issue description text inputs.
          </p>
        </div>
      </div>

      {/* 4. Activity Logs and History Lists (Tabs layout) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
        
        {/* Tabs switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 select-none">
          <button
            id="btn-profile-tab-reports"
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 text-center text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'reports'
                ? 'border-indigo-600 text-indigo-600 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>My Reports ({myIssues.length})</span>
            </span>
          </button>

          <button
            id="btn-profile-tab-votes"
            onClick={() => setActiveTab('votes')}
            className={`flex-1 py-3 text-center text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'votes'
                ? 'border-indigo-600 text-indigo-600 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Vote className="w-4 h-4 shrink-0" />
              <span>My Votes ({myVotes.length})</span>
            </span>
          </button>

          <button
            id="btn-profile-tab-badges"
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 text-center text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'badges'
                ? 'border-indigo-600 text-indigo-600 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4 shrink-0" />
              <span>Earned Badges ({profile.badges.length})</span>
            </span>
          </button>
        </div>

        {/* Tab Contents list */}
        <div className="p-5 flex-1 min-h-[220px]">
          
          {/* TAB 1: My Reports list */}
          {activeTab === 'reports' && (
            <div className="space-y-2.5">
              {myIssues.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  You haven't reported any neighborhood issues yet.
                </div>
              ) : (
                myIssues.map(issue => (
                  <button
                    key={issue.id}
                    id={`profile-issue-item-${issue.id}`}
                    onClick={() => onSelectIssue(issue)}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100/70 border border-slate-200 p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-inner"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{issue.title}</h4>
                      <p className="text-[10px] text-slate-450 mt-1 capitalize">{issue.category.replace('_', ' ')} • Reported on {issue.reportedDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                        issue.status === 'resolved' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                          : 'bg-red-50 text-red-700 border-red-150'
                      }`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-650 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Voted registry */}
          {activeTab === 'votes' && (
            <div className="space-y-2.5">
              {myVotes.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  You haven't participated in any ward ballots yet.
                </div>
              ) : (
                myVotes.map(poll => {
                  const selectionText = poll.options.find(o => o.id === poll.userVotedOptionId)?.text || "Voted";
                  return (
                    <div 
                      key={poll.id} 
                      className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800">{poll.title}</h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">Voted option: <strong className="text-slate-600 font-bold">{selectionText}</strong></p>
                      </div>

                      <div className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 font-mono shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Receipt Verified</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: Unlocked Badges Cabinet */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {profile.badges.length === 0 ? (
                <div className="col-span-2 text-center py-10 text-slate-400 text-xs">
                  You haven't earned any special achievement badges yet.
                </div>
              ) : (
                profile.badges.map(badgeId => {
                  const badge = MOCK_BADGES.find(b => b.id === badgeId);
                  if (!badge) return null;
                  return (
                    <div 
                      key={badge.id} 
                      className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-inner"
                    >
                      <div className={`w-10 h-10 rounded-xl ${badge.color} border border-white flex items-center justify-center font-bold shrink-0 shadow-sm`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-700">{badge.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{badge.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
