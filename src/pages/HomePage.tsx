/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CivicIssue, 
  IssueCategory, 
  IssueStatus, 
  Language, 
  TranslationDict 
} from '../types';
import MapComponent from '../components/MapComponent';
import ReportIssueModal from '../components/ReportIssueModal';
import { translateData } from '../translations';
import { 
  Plus, 
  AlertTriangle, 
  Lightbulb, 
  Trash2, 
  Droplets, 
  HelpCircle, 
  ArrowRight, 
  Bell, 
  MapPin, 
  User, 
  Calendar,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  issues: CivicIssue[];
  onAddIssue: (newIssue: Omit<CivicIssue, 'id' | 'reportedBy' | 'reportedDate' | 'comments' | 'status'>) => void;
  onSelectIssue: (issue: CivicIssue) => void;
  lang: Language;
  translations: TranslationDict;
}

export default function HomePage({ 
  issues, 
  onAddIssue, 
  onSelectIssue, 
  lang, 
  translations 
}: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [prefilledCategory, setPrefilledCategory] = useState<IssueCategory | null>(null);
  
  // Custom double-click coordinate storage for the map
  const [selectedLat, setSelectedLat] = useState<number | undefined>(undefined);
  const [selectedLng, setSelectedLng] = useState<number | undefined>(undefined);

  // Active notifications feed (e.g. "Notification dispatched to BBMP for Pothole Report")
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleOpenReportModal = (category: IssueCategory | null = null) => {
    setPrefilledCategory(category);
    setIsReportModalOpen(true);
  };

  const handleSelectLocationFromMap = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    handleOpenReportModal(null);
  };

  const handleFormSubmit = (newIssueData: Omit<CivicIssue, 'id' | 'reportedBy' | 'reportedDate' | 'comments' | 'status'>) => {
    onAddIssue(newIssueData);
    
    // Add custom dispatch toast notification
    const dispatchMessage = `OFFICIAL DISPATCH: Notification sent to "${newIssueData.authorityDepartment}". Complaint ticket logged with Representative ${newIssueData.authorityContactPerson}.`;
    setNotifications(prev => [dispatchMessage, ...prev]);

    // Clear coordinates
    setSelectedLat(undefined);
    setSelectedLng(undefined);

    // Auto-clear notification after 8 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(msg => msg !== dispatchMessage));
    }, 8000);
  };

  // Filter issues for list
  const filteredIssuesList = issues.filter(issue => {
    const matchesCat = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || issue.status === selectedStatus;
    return matchesCat && matchesStat;
  });

  const getCategoryIcon = (category: IssueCategory, size: string = "w-4 h-4") => {
    switch (category) {
      case 'pothole': return <AlertTriangle className={`${size} text-orange-500`} />;
      case 'streetlight': return <Lightbulb className={`${size} text-yellow-500`} />;
      case 'garbage': return <Trash2 className={`${size} text-indigo-500`} />;
      case 'water_leak': return <Droplets className={`${size} text-sky-500`} />;
      default: return <HelpCircle className={`${size} text-slate-500`} />;
    }
  };

  const getCategoryTranslation = (category: string) => {
    switch (category) {
      case 'pothole': return translations.categoryPothole;
      case 'streetlight': return translations.categoryStreetlight;
      case 'garbage': return translations.categoryGarbage;
      case 'water_leak': return translations.categoryWaterLeak;
      default: return translations.categoryOther;
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'reported':
        return <span className="bg-red-950 text-red-400 border border-red-900 text-[10px] px-2 py-0.5 rounded-full font-bold">{translations.statusReported}</span>;
      case 'authority_contacted':
        return <span className="bg-orange-950 text-orange-400 border border-orange-900 text-[10px] px-2 py-0.5 rounded-full font-bold">{translations.statusAuthorityContacted}</span>;
      case 'in_progress':
        return <span className="bg-amber-950 text-amber-400 border border-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">{translations.statusInProgress}</span>;
      case 'resolved':
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[10px] px-2 py-0.5 rounded-full font-bold">{translations.statusResolved}</span>;
    }
  };

  return (
    <div id="home-page-root" className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.navHome}</h2>
          <p className="text-xs text-slate-500 mt-1">{translations.tagline}</p>
        </div>

        {/* Floating Quick General Report Trigger */}
        <button
          id="btn-report-general"
          onClick={() => handleOpenReportModal(null)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-950/10 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{translations.reportAnIssue}</span>
        </button>
      </div>

      {/* 2. Dispatch Broadcast Notification Banners */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notif, index) => (
            <div 
              key={index} 
              className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 leading-relaxed flex items-start gap-3 animate-in slide-in-from-top-4 duration-300 shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-1">
                  <Bell className="w-3.5 h-3.5 animate-bounce" />
                  Authority Dispatched
                </span>
                <p className="font-mono text-[10px]">{notif}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Category Quick action buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5">Quick Action: Choose Category to File Report</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            id="btn-shortcut-pothole"
            onClick={() => handleOpenReportModal('pothole')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-orange-300 rounded-xl transition-all duration-200 group gap-2.5 text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">{translations.categoryPothole.split(' ')[0]}</span>
          </button>

          <button
            id="btn-shortcut-streetlight"
            onClick={() => handleOpenReportModal('streetlight')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-yellow-300 rounded-xl transition-all duration-200 group gap-2.5 text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">{translations.categoryStreetlight.split(' ')[0]}</span>
          </button>

          <button
            id="btn-shortcut-garbage"
            onClick={() => handleOpenReportModal('garbage')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all duration-200 group gap-2.5 text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">{translations.categoryGarbage.split(' ')[0]}</span>
          </button>

          <button
            id="btn-shortcut-water-leak"
            onClick={() => handleOpenReportModal('water_leak')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-sky-300 rounded-xl transition-all duration-200 group gap-2.5 text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplets className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">{translations.categoryWaterLeak.split(' ')[0]}</span>
          </button>

          <button
            id="btn-shortcut-other"
            onClick={() => handleOpenReportModal('other')}
            className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200 group gap-2.5 text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">{translations.categoryOther.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* 4. Map & Sidebar Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Column (Occupies 2 cols on wide screens) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Map Filters bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Map Filters</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Category selector */}
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">{translations.allCategories}</option>
                <option value="pothole">{translations.categoryPothole}</option>
                <option value="streetlight">{translations.categoryStreetlight}</option>
                <option value="garbage">{translations.categoryGarbage}</option>
                <option value="water_leak">{translations.categoryWaterLeak}</option>
                <option value="other">{translations.categoryOther}</option>
              </select>

              {/* Status selector */}
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">{translations.statusAll}</option>
                <option value="reported">{translations.statusReported}</option>
                <option value="authority_contacted">{translations.statusAuthorityContacted}</option>
                <option value="in_progress">{translations.statusInProgress}</option>
                <option value="resolved">{translations.statusResolved}</option>
              </select>
            </div>
          </div>

          {/* Interactive Map Component */}
          <MapComponent 
            issues={issues}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onSelectIssue={onSelectIssue}
            onSelectLocationForReport={handleSelectLocationFromMap}
            lang={lang}
            translations={translations}
          />
        </div>

        {/* Recent Active Issues Feed Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col h-[526px]">
            
            {/* Title */}
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                {translations.activeIssues}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                Showing {filteredIssuesList.length}
              </span>
            </div>

            {/* List Feed */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {filteredIssuesList.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs font-medium">
                  No active issues match the selected filters. Change filters or report an issue.
                </div>
              ) : (
                filteredIssuesList.map((issue) => (
                  <button
                    key={issue.id}
                    id={`active-issue-card-${issue.id}`}
                    onClick={() => onSelectIssue(issue)}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 hover:border-slate-300 p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-2.5 relative group shadow-sm"
                  >
                    {/* Header: Badge & Priority */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(issue.category)}
                        <span className="text-[10px] font-bold text-slate-500 capitalize">
                          {getCategoryTranslation(issue.category)}
                        </span>
                      </div>
                      {getStatusBadge(issue.status)}
                    </div>

                    {/* Title & snippet */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {translateData(issue.id, 'title', issue.title, lang)}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {translateData(issue.id, 'description', issue.description, lang)}
                      </p>
                    </div>

                    {/* Footer stats */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex-wrap gap-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {issue.reportedBy}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {issue.reportedDate}
                      </span>
                    </div>

                    {/* Go to Details visual link overlay */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Trigger Report Issue Dialog Modal */}
      {isReportModalOpen && (
        <ReportIssueModal 
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleFormSubmit}
          lang={lang}
          translations={translations}
          prefilledCategory={prefilledCategory}
          selectedLat={selectedLat}
          selectedLng={selectedLng}
        />
      )}

    </div>
  );
}
