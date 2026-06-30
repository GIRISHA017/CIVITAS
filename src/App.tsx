/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Language, 
  CivicIssue, 
  LedgerTransaction, 
  LocalBusiness, 
  CommunityEvent, 
  AchievementPost, 
  VotingPoll, 
  UserProfile 
} from './types';
import { 
  TRANSLATIONS, 
  MOCK_ISSUES, 
  MOCK_LEDGER, 
  MOCK_BUSINESSES, 
  MOCK_EVENTS, 
  MOCK_ACHIEVEMENTS, 
  MOCK_POLLS, 
  DEFAULT_PROFILE 
} from './data';

// Navigation & Accessibility components
import Navigation from './components/Navigation';
import SpeechAccessibility from './components/SpeechAccessibility';

// Page Views
import HomePage from './pages/HomePage';
import IssueDetailPage from './pages/IssueDetailPage';
import LedgerPage from './pages/LedgerPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import EventsPage from './pages/EventsPage';
import NewspaperPage from './pages/NewspaperPage';
import AchievementsPage from './pages/AchievementsPage';
import VotingPage from './pages/VotingPage';
import ProfilePage from './pages/ProfilePage';
import PlannerPage from './pages/PlannerPage';

// Lucide icons
import { Globe, Accessibility, Shield, Bell } from 'lucide-react';

export default function App() {
  // Global states for all pages (allows dynamic reactive persistence across navigation tabs)
  const [issues, setIssues] = useState<CivicIssue[]>(MOCK_ISSUES);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(MOCK_LEDGER);
  const [businesses, setBusinesses] = useState<LocalBusiness[]>(MOCK_BUSINESSES);
  const [events, setEvents] = useState<CommunityEvent[]>(MOCK_EVENTS);
  const [achievements, setAchievements] = useState<AchievementPost[]>(MOCK_ACHIEVEMENTS);
  const [polls, setPolls] = useState<VotingPoll[]>(MOCK_POLLS);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Router layout states
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<LocalBusiness | null>(null);

  // Translations matching
  const currentLanguage = profile.language;
  const translations = TRANSLATIONS[currentLanguage];

  // Global action controllers
  const handleAddIssue = (newIssueData: Omit<CivicIssue, 'id' | 'reportedBy' | 'reportedDate' | 'comments' | 'status'>) => {
    const freshIssue: CivicIssue = {
      ...newIssueData,
      id: `iss_0${issues.length + 1}`,
      reportedBy: profile.name + " (You)",
      reportedDate: new Date().toISOString().split('T')[0],
      comments: [],
      status: 'reported'
    };

    setIssues(prev => [freshIssue, ...prev]);
    // Give hero points for reporting
    setProfile(prev => ({
      ...prev,
      points: prev.points + 50
    }));
  };

  const handleUpdateIssue = (updatedIssue: CivicIssue) => {
    setIssues(prev => prev.map(issue => issue.id === updatedIssue.id ? updatedIssue : issue));
    // Sync active drill view
    if (selectedIssue && selectedIssue.id === updatedIssue.id) {
      setSelectedIssue(updatedIssue);
    }
  };

  const handleUpdateTransaction = (updatedTx: LedgerTransaction) => {
    setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
  };

  const handleUpdateEvent = (updatedEvent: CommunityEvent) => {
    setEvents(prev => prev.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
  };

  const handleUpdateAchievement = (updatedAch: AchievementPost) => {
    setAchievements(prev => prev.map(ach => ach.id === updatedAch.id ? updatedAch : ach));
  };

  const handleAddAchievement = (newAchData: Omit<AchievementPost, 'id' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'comments'>) => {
    const freshAch: AchievementPost = {
      ...newAchData,
      id: `ach_0${achievements.length + 1}`,
      userName: profile.name + " (You)",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      likes: 0,
      comments: []
    };

    setAchievements(prev => [freshAch, ...prev]);
    // Award 100 points for civic acts!
    setProfile(prev => ({
      ...prev,
      points: prev.points + 100,
      // If shared custom badge, unlocked on profile
      badges: newAchData.badgeId && !prev.badges.includes(newAchData.badgeId) 
        ? [...prev.badges, newAchData.badgeId] 
        : prev.badges
    }));
  };

  const handleUpdatePoll = (updatedPoll: VotingPoll) => {
    setPolls(prev => prev.map(poll => poll.id === updatedPoll.id ? updatedPoll : poll));
    // Reward points for voting
    setProfile(prev => ({
      ...prev,
      points: prev.points + 20
    }));
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleAddPoints = (pts: number) => {
    setProfile(prev => ({
      ...prev,
      points: prev.points + pts,
      level: Math.floor((prev.points + pts) / 300) + 1 // Dynamic level-up calculation
    }));
  };

  const handleLanguageChange = (newLang: Language) => {
    setProfile(prev => ({
      ...prev,
      language: newLang
    }));
  };

  const handleNavigateToIssue = (issue: CivicIssue) => {
    setSelectedIssue(issue);
  };

  const handleAddBusiness = (newBizData: Omit<LocalBusiness, 'id' | 'rating' | 'products' | 'reviews'>) => {
    const freshBiz: LocalBusiness = {
      ...newBizData,
      id: `biz_${Date.now()}`,
      rating: 5.0,
      products: [],
      reviews: []
    };
    setBusinesses(prev => [freshBiz, ...prev]);
    // Award 50 points for registering a business
    setProfile(prev => ({
      ...prev,
      points: prev.points + 50
    }));
  };

  const handleDeleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    if (selectedBusiness && selectedBusiness.id === id) {
      setSelectedBusiness(null);
    }
  };

  // Switch pages render helper
  const renderPageContent = () => {
    // If drilling into issue detail, show that screen as top priority overlay stack
    if (selectedIssue) {
      return (
        <IssueDetailPage 
          issue={selectedIssue}
          onBack={() => setSelectedIssue(null)}
          onUpdateIssue={handleUpdateIssue}
          lang={currentLanguage}
          translations={translations}
        />
      );
    }

    if (selectedBusiness) {
      return (
        <BusinessDetailPage
          business={selectedBusiness}
          onBack={() => setSelectedBusiness(null)}
          onUpdateBusiness={(updatedBiz) => {
            setBusinesses(prev => prev.map(b => b.id === updatedBiz.id ? updatedBiz : b));
            setSelectedBusiness(updatedBiz);
          }}
          lang={currentLanguage}
          translations={translations}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            issues={issues}
            onAddIssue={handleAddIssue}
            onSelectIssue={handleNavigateToIssue}
            lang={currentLanguage}
            translations={translations}
          />
        );
      case 'planner':
        return (
          <PlannerPage 
            translations={translations}
            lang={currentLanguage}
            userPoints={profile.points}
            userLevel={profile.level}
            onAddPoints={handleAddPoints}
            onNavigateToPage={(pageId) => {
              setCurrentPage(pageId);
              setSelectedIssue(null);
              setSelectedBusiness(null);
            }}
          />
        );
      case 'ledger':
        return (
          <LedgerPage 
            transactions={transactions}
            onUpdateTransaction={handleUpdateTransaction}
            lang={currentLanguage}
            translations={translations}
          />
        );
      case 'business':
        return (
          <BusinessDirectoryPage 
            businesses={businesses}
            lang={currentLanguage}
            translations={translations}
            onSelectBusiness={(biz) => setSelectedBusiness(biz)}
            onAddBusiness={handleAddBusiness}
            onDeleteBusiness={handleDeleteBusiness}
          />
        );
      case 'events':
        return (
          <EventsPage 
            events={events}
            onUpdateEvent={handleUpdateEvent}
            lang={currentLanguage}
            translations={translations}
          />
        );
      case 'achievements':
        return (
          <AchievementsPage 
            achievements={achievements}
            onAddAchievement={handleAddAchievement}
            onUpdateAchievement={handleUpdateAchievement}
            lang={currentLanguage}
            translations={translations}
            userPoints={profile.points}
            userLevel={profile.level}
          />
        );
      case 'news':
        return (
          <NewspaperPage 
            lang={currentLanguage}
            translations={translations}
          />
        );
      case 'voting':
        return (
          <VotingPage 
            polls={polls}
            onUpdatePoll={handleUpdatePoll}
            lang={currentLanguage}
            translations={translations}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            issues={issues}
            polls={polls}
            onSelectIssue={handleNavigateToIssue}
            lang={currentLanguage}
            translations={translations}
          />
        );
      default:
        return <div className="text-center py-20 text-slate-500 text-xs">Page under construction</div>;
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* 1. Desktop & Mobile Navigation layouts */}
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setSelectedIssue(null); // Clear stack drilling on nav click
          setCurrentPage(page);
        }}
        translations={translations}
        userPoints={profile.points}
        userLevel={profile.level}
      />

      {/* 2. Main Content viewport area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* Top universal Header rail bar */}
        <header id="universal-top-header" className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              WARD 151 CIVIC INFRASTRUCTURE ENGINE
            </span>
          </div>

          {/* Quick Language Toggle drop selector in topbar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <select
                id="header-language-select"
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-transparent border-none text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer"
                aria-label="Language Selector"
              >
                <option value="en" className="bg-white text-slate-700 font-bold">English</option>
                <option value="hi" className="bg-white text-slate-700 font-bold">हिन्दी (Hindi)</option>
                <option value="kn" className="bg-white text-slate-700 font-bold">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>
        </header>

        {/* Dynamic page render container block with responsive bounds */}
        <div className="flex-1 px-4 sm:px-6 py-6 max-w-5xl w-full mx-auto">
          {renderPageContent()}
        </div>

      </main>

      {/* 3. Site-Wide Speech Synthesis Accessibility Floater Button widget */}
      <SpeechAccessibility currentLanguage={currentLanguage} />

    </div>
  );
}
