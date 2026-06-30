/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CommunityEvent, Language, TranslationDict, Comment } from '../types';
import CommentsSection from '../components/CommentsSection';
import { 
  Calendar, 
  MapPin, 
  UserCheck, 
  Clock, 
  ArrowLeft, 
  Check, 
  Users, 
  Bookmark, 
  ChevronRight,
  X 
} from 'lucide-react';

interface EventsPageProps {
  events: CommunityEvent[];
  onUpdateEvent: (updatedEvent: CommunityEvent) => void;
  lang: Language;
  translations: TranslationDict;
}

export default function EventsPage({ 
  events, 
  onUpdateEvent, 
  lang, 
  translations 
}: EventsPageProps) {
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);

  const handleRsvp = (event: CommunityEvent, rsvpStatus: 'going' | 'interested' | 'not_going') => {
    let diff = 0;
    
    // Calculate attendee count change based on transitions
    if (rsvpStatus === 'going' && event.userRsvpStatus !== 'going') {
      diff = 1;
    } else if (event.userRsvpStatus === 'going' && rsvpStatus !== 'going') {
      diff = -1;
    }

    const updatedEvent = {
      ...event,
      userRsvpStatus: rsvpStatus,
      attendeesCount: Math.max(0, event.attendeesCount + diff)
    };

    onUpdateEvent(updatedEvent);
    
    // Keep detail view in sync
    if (selectedEvent && selectedEvent.id === event.id) {
      setSelectedEvent(updatedEvent);
    }
  };

  const handleAddComment = (event: CommunityEvent, text: string) => {
    const newComment: Comment = {
      id: `ecomm_${Date.now()}`,
      authorName: "Girish A. (You)",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updatedEvent = {
      ...event,
      comments: [...event.comments, newComment]
    };

    onUpdateEvent(updatedEvent);
    setSelectedEvent(updatedEvent);
  };

  return (
    <div id="events-page-root" className="space-y-6">
      
      {/* 1. Header */}
      {!selectedEvent ? (
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.eventsTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">{translations.eventsSubtitle}</p>
        </div>
      ) : (
        <button
          id="btn-back-to-events-list"
          onClick={() => setSelectedEvent(null)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-850 transition-all cursor-pointer bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Directory</span>
        </button>
      )}

      {/* 2. Main Page Layout (Dual Mode: List View OR Detailed View) */}
      {!selectedEvent ? (
        
        /* MODE A: Events Grid Feed */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((event) => {
            const hasRsvpGoing = event.userRsvpStatus === 'going';
            const hasRsvpInt = event.userRsvpStatus === 'interested';
            
            return (
              <div 
                key={event.id} 
                id={`event-card-${event.id}`}
                onClick={() => setSelectedEvent(event)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 group shadow-sm"
              >
                
                {/* Event Title & Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{event.date}</span>
                    </span>
 
                    {/* Active User RSVP Status Overlay Badge */}
                    {event.userRsvpStatus && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        hasRsvpGoing 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : hasRsvpInt
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        RSVP: {event.userRsvpStatus.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Info and Actions */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2 flex-wrap">
                  
                  {/* Location and Attendance stats */}
                  <div className="flex items-center gap-3.5 text-[10px] text-slate-450">
                    <span className="flex items-center gap-1 truncate max-w-[150px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {event.location.split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {event.attendeesCount} {translations.rsvpGoing}
                    </span>
                  </div>

                  {/* Detail link icon */}
                  <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex items-center gap-1 font-bold text-[10px] uppercase">
                    <span>Coordinate</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* MODE B: Focused Detailed Coordination Panel */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Left: Detailed Info Column (Occupies 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Event Description Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="bg-slate-50 text-slate-500 border border-slate-200 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Community Coordination Panel
                </span>
                <span className="text-xs text-indigo-600 font-extrabold font-mono">{selectedEvent.date}</span>
              </div>

              <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-snug">{selectedEvent.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedEvent.description}</p>
              
              {/* Event meta tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 mt-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-inner">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Time slot</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    {selectedEvent.time}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 col-span-2 shadow-inner">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Full Address</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {selectedEvent.location}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic mt-2 font-semibold">
                {translations.organizer}: <strong className="text-slate-700 font-bold">{selectedEvent.organizer}</strong>
              </p>
            </div>

            {/* Embedded volunteer Comments coordinate feed */}
            <CommentsSection 
              comments={selectedEvent.comments}
              onAddComment={(text) => handleAddComment(selectedEvent, text)}
              lang={lang}
              title="Volunteer Coordination & task distribution"
            />

          </div>

          {/* Right: Dynamic RSVP Sidebar widget (Occupies 1 col) */}
          <div className="space-y-6">
            
            {/* Live RSVP Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                Register Your Status
              </h4>

              <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Committed Attendees</span>
                <div className="text-2xl font-black text-slate-800 mt-1 flex items-center justify-center gap-1.5">
                  <Users className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span>{selectedEvent.attendeesCount}</span>
                </div>
              </div>

              {/* RSVP Radio Buttons */}
              <div className="space-y-2.5">
                <button
                  id="btn-rsvp-going"
                  onClick={() => handleRsvp(selectedEvent, 'going')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedEvent.userRsvpStatus === 'going'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>I am GOING! (Volunteering)</span>
                  </span>
                  {selectedEvent.userRsvpStatus === 'going' && <Check className="w-4 h-4 animate-scale-up" />}
                </button>

                <button
                  id="btn-rsvp-interested"
                  onClick={() => handleRsvp(selectedEvent, 'interested')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedEvent.userRsvpStatus === 'interested'
                      ? 'bg-purple-50 border-purple-400 text-purple-700 font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 shrink-0" />
                    <span>Interested / Checking schedule</span>
                  </span>
                  {selectedEvent.userRsvpStatus === 'interested' && <Check className="w-4 h-4 animate-scale-up" />}
                </button>

                <button
                  id="btn-rsvp-not-going"
                  onClick={() => handleRsvp(selectedEvent, 'not_going')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedEvent.userRsvpStatus === 'not_going'
                      ? 'bg-slate-200 border-slate-300 text-slate-600 font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0" />
                    <span>Cannot Attend</span>
                  </span>
                  {selectedEvent.userRsvpStatus === 'not_going' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Volunteer requirements brief */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] text-slate-600 leading-relaxed space-y-2 shadow-inner">
              <span className="font-bold text-slate-700 uppercase text-[9px] tracking-wider block">Volunteer Checklist</span>
              <p>📍 Arrive 10 minutes early at the venue.</p>
              <p>🧤 Wear gloves and comfortable running/clean shoes if attending park drives.</p>
              <p>💧 Hydrate! Complimentary organic lunch boxes provided by <strong>Annapurna Homemade Caterers</strong>.</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
