/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  BookOpen, 
  ShoppingBag, 
  Calendar, 
  Award, 
  Newspaper, 
  Vote, 
  User,
  Shield,
  HelpCircle,
  Accessibility,
  Sparkles
} from 'lucide-react';
import { Language, TranslationDict } from '../types';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  translations: TranslationDict;
  userPoints: number;
  userLevel: number;
}

export default function Navigation({ 
  currentPage, 
  setCurrentPage, 
  translations, 
  userPoints, 
  userLevel 
}: NavigationProps) {
  
  const navItems = [
    { id: 'home', label: translations.navHome, icon: Home },
    { id: 'planner', label: translations.navPlanner || 'Civic Planner', icon: Sparkles },
    { id: 'ledger', label: translations.navLedger, icon: BookOpen },
    { id: 'business', label: translations.navBusiness, icon: ShoppingBag },
    { id: 'events', label: translations.navEvents, icon: Calendar },
    { id: 'achievements', label: translations.navAchievements, icon: Award },
    { id: 'news', label: translations.navNews, icon: Newspaper },
    { id: 'voting', label: translations.navVoting, icon: Vote },
    { id: 'profile', label: translations.navProfile, icon: User },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar (Hidden on mobile) */}
      <aside 
        id="desktop-sidebar" 
        className="hidden md:flex flex-col w-64 bg-[#1e293b] border-r border-slate-700/50 text-[#f1f5f9] h-screen sticky top-0 shrink-0 select-none z-30"
      >
        {/* Brand / Title Header */}
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-900/40">
            CH
          </div>
          <div>
            <h1 className="text-md font-extrabold tracking-tight text-white font-sans">{translations.appName}</h1>
            <span className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase flex items-center gap-1">
              <Shield className="w-3 h-3 text-indigo-400" />
              Ward 151 Connected
            </span>
          </div>
        </div>

        {/* Navigation Link List */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-desktop-${item.id}`}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-slate-700 text-white shadow-md shadow-slate-950/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Profile Status Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/40 m-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80" 
              alt="Girish A." 
              className="w-10 h-10 rounded-full border border-slate-700/50 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Girish A.</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                Lvl {userLevel} • {userPoints} Pts
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <nav 
        id="mobile-navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-700 text-[#f1f5f9] px-2 py-1.5 flex justify-around items-center z-40 shadow-2xl pb-safe"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-mobile-${item.id}`}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-150 ${
                isActive 
                  ? 'text-indigo-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{ minWidth: '44px', minHeight: '44px' }} // Standard touch target
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[9px] mt-1 tracking-tight text-center font-medium truncate max-w-[50px]">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
