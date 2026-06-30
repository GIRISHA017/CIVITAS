/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LocalBusiness, Language, TranslationDict, Message } from '../types';
import { VoiceInputButton } from '../components/SpeechAccessibility';
import { translateData } from '../translations';
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Star, 
  MapPin, 
  User, 
  X, 
  Send, 
  Sparkles,
  ShoppingBag,
  Clock,
  Plus,
  Trash2,
  ChevronRight
} from 'lucide-react';

interface BusinessDirectoryPageProps {
  businesses: LocalBusiness[];
  lang: Language;
  translations: TranslationDict;
  onSelectBusiness: (biz: LocalBusiness) => void;
  onAddBusiness: (newBiz: Omit<LocalBusiness, 'id' | 'rating' | 'products' | 'reviews'>) => void;
  onDeleteBusiness: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Categories",
  food: "Home Food & Catering",
  tailoring: "Tailoring & Alteration",
  crafts: "Handicrafts & Decor",
  tutoring: "Home Tuitions"
};

export default function BusinessDirectoryPage({ 
  businesses, 
  lang, 
  translations,
  onSelectBusiness,
  onAddBusiness,
  onDeleteBusiness
}: BusinessDirectoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Registration Form State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('food');
  const [newBizDesc, setNewBizDesc] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizLocation, setNewBizLocation] = useState('');
  const [newBizPhotoUrl, setNewBizPhotoUrl] = useState('');
  const [newBizAddedBy, setNewBizAddedBy] = useState('');

  // Chat state management
  const [activeChatBiz, setActiveChatBiz] = useState<LocalBusiness | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({});
  const [messageText, setMessageText] = useState('');
  const [isTypingReply, setIsTypingReply] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Filter logic
  const filteredBiz = businesses.filter((biz) => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          biz.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          biz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || biz.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeChatBiz, isTypingReply]);

  // Handle opening chat
  const handleOpenChat = (biz: LocalBusiness) => {
    setActiveChatBiz(biz);
    
    // Initialize default welcome message if never chatted before
    if (!chatMessages[biz.id]) {
      const welcomeMsg: Message = {
        id: `msg_welcome_${biz.id}`,
        sender: 'owner',
        text: `Namaste, thank you for supporting my home business! I am ${biz.ownerName.split(' ')[0]}. How can I help you today? Feel free to ask about custom items, pricing, or delivery schedules.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [biz.id]: [welcomeMsg]
      }));
    }
  };

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatBiz) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const bizId = activeChatBiz.id;
    setChatMessages(prev => ({
      ...prev,
      [bizId]: [...(prev[bizId] || []), userMsg]
    }));
    setMessageText('');

    // Simulate Merchant Auto-Reply
    setIsTypingReply(true);
    setTimeout(() => {
      const replies = [
        "Aha, sounds great! I have received your request. Let me check my raw ingredients/inventory and I will send over the cost shortly.",
        "Thank you for reaching out, neighbor! Yes, I can certainly customize that for you. Let's arrange a convenient pickup time once it is ready.",
        "Perfect! I will lock in this booking for you. Let's finalize payment details on-delivery or via UPI. Looking forward!",
        "Thank you! Yes, I do deliveries around Ward 151 and Koramangala every evening. Your support means the world to our family!"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const ownerMsg: Message = {
        id: `msg_reply_${Date.now()}`,
        sender: 'owner',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => ({
        ...prev,
        [bizId]: [...(prev[bizId] || []), ownerMsg]
      }));
      setIsTypingReply(false);
    }, 1800);
  };

  // Submit Business Registration Form
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizOwner.trim() || !newBizPhone.trim()) return;

    onAddBusiness({
      name: newBizName,
      ownerName: newBizOwner,
      category: newBizCategory,
      description: newBizDesc || "No description provided.",
      photoUrl: newBizPhotoUrl || "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=300",
      phoneNumber: newBizPhone,
      whatsappNumber: newBizPhone.replace(/\D/g, ''),
      location: newBizLocation || "Ward 151, Bengaluru",
      addedBy: newBizAddedBy.trim() || undefined
    });

    // Reset Form
    setNewBizName('');
    setNewBizOwner('');
    setNewBizDesc('');
    setNewBizPhone('');
    setNewBizLocation('');
    setNewBizPhotoUrl('');
    setNewBizAddedBy('');
    setIsRegisterOpen(false);
  };

  return (
    <div id="business-directory-root" className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Page Title & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.businessTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">{translations.businessSubtitle}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Register business button */}
          <button
            id="btn-open-register-modal"
            onClick={() => setIsRegisterOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Home Business</span>
          </button>

          {/* Support Banner Accent */}
          <div className="bg-purple-50 border border-purple-200 text-purple-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm hidden md:flex">
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
            <span>Empowering 12+ Self-Help Women Guilds</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="biz-search-input"
            type="text"
            placeholder={translations.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {['all', 'food', 'tailoring', 'crafts', 'tutoring'].map((cat) => (
            <button
              key={cat}
              id={`btn-biz-filter-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white font-extrabold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

      </div>

      {/* 3. Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBiz.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs shadow-sm font-medium">
            No local businesses found matching your criteria.
          </div>
        ) : (
          filteredBiz.map((biz) => (
            <div 
              key={biz.id} 
              id={`business-card-${biz.id}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:border-slate-300 transition-all duration-300 relative"
            >
              {/* Product Photo */}
              <div 
                className="sm:w-1/3 h-48 sm:h-auto relative bg-slate-100 shrink-0 cursor-pointer"
                onClick={() => onSelectBusiness(biz)}
              >
                <img 
                  src={biz.photoUrl} 
                  alt={biz.name} 
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Category Sticker */}
                <span className="absolute top-3 left-3 bg-white/95 text-indigo-700 border border-slate-100 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                  {translateData(biz.id, 'category', biz.category, lang)}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Business Info - Clickable for details view */}
                <div 
                  className="space-y-1.5 cursor-pointer"
                  onClick={() => onSelectBusiness(biz)}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                      <span>{translateData(biz.id, 'name', biz.name, lang)}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </h4>
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs shrink-0 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{biz.rating}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{translations.ownerName}: <strong className="text-slate-700">{biz.ownerName}</strong></span>
                  </p>

                  {biz.addedBy && (
                    <p className="text-[9px] text-indigo-600/90 font-medium italic flex items-center gap-1">
                      <span>Registered by: <strong>{biz.addedBy}</strong></span>
                    </p>
                  )}

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {translateData(biz.id, 'description', biz.description, lang)}
                  </p>
                </div>

                {/* Footer specs & actions */}
                <div className="border-t border-slate-100 pt-3.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {translateData(biz.id, 'location', biz.location, lang).split(',')[0]}
                  </span>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    {/* Delete listing curation */}
                    <button
                      id={`btn-biz-delete-${biz.id}`}
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to unregister and delete "${biz.name}"?`)) {
                          onDeleteBusiness(biz.id);
                        }
                      }}
                      className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 p-2.5 rounded-xl transition-all cursor-pointer"
                      title="Delete Business Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Call Owner directly */}
                    <a
                      id={`btn-biz-call-${biz.id}`}
                      href={`tel:${biz.phoneNumber}`}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 p-2.5 rounded-xl transition-all cursor-pointer"
                      title={translations.callOwner}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* Chat Trigger */}
                    <button
                      id={`btn-biz-chat-${biz.id}`}
                      onClick={() => handleOpenChat(biz)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{translations.messageOwner}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Interactive Direct Chat Overlay Modal */}
      {activeChatBiz && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            id="business-chat-modal" 
            className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md h-[90vh] sm:h-[500px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={activeChatBiz.photoUrl} 
                  alt={activeChatBiz.name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{activeChatBiz.name}</h3>
                  <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{activeChatBiz.ownerName} is Online</span>
                  </span>
                </div>
              </div>

              {/* Header CTR Action */}
              <div className="flex items-center gap-2">
                <a
                  id="btn-chat-direct-call"
                  href={`tel:${activeChatBiz.phoneNumber}`}
                  className="text-slate-500 hover:text-slate-700 bg-white border border-slate-200 p-2 rounded-lg transition-all"
                  title="Call Phone Number"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  id="btn-close-chat"
                  onClick={() => setActiveChatBiz(null)}
                  className="text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Message Box */}
            <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
              {(chatMessages[activeChatBiz.id] || []).map((msg) => {
                const isOwner = msg.sender === 'owner';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isOwner ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isOwner
                        ? 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                        : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}>
                      <p className="leading-relaxed break-words">{msg.text}</p>
                      <span className={`text-[8px] font-mono block text-right mt-1.5 ${
                        isOwner ? 'text-slate-400' : 'text-indigo-200'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing simulation */}
              {isTypingReply && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce duration-1000 delay-100" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce duration-1000 delay-200" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce duration-1000 delay-300" />
                    <span className="text-[9px] text-slate-400 ml-1.5 font-bold font-mono">Owner typing...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Send Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input
                id="chat-message-input"
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your question or order details..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                id="btn-send-chat-msg"
                disabled={!messageText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all disabled:bg-slate-200 disabled:text-slate-400 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Business Registration Overlay Modal (CRUD Create) */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Register Home Business</h3>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Business Name</label>
                <input
                  type="text"
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g. Swasth Kitchen & Bakery"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={newBizOwner}
                    onChange={(e) => setNewBizOwner(e.target.value)}
                    placeholder="e.g. Ananya Rao"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                  <select
                    value={newBizCategory}
                    onChange={(e) => setNewBizCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="food">Home Food & Catering</option>
                    <option value="tailoring">Tailoring & Alteration</option>
                    <option value="crafts">Handicrafts & Decor</option>
                    <option value="tutoring">Home Tuitions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newBizPhone}
                  onChange={(e) => setNewBizPhone(e.target.value)}
                  placeholder="e.g. +91 99887 76655"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Location Address</label>
                <input
                  type="text"
                  value={newBizLocation}
                  onChange={(e) => setNewBizLocation(e.target.value)}
                  placeholder="e.g. HSR Layout Sector 3, Bengaluru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Photo URL (Optional)</label>
                <input
                  type="text"
                  value={newBizPhotoUrl}
                  onChange={(e) => setNewBizPhotoUrl(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">About Business</label>
                  <VoiceInputButton 
                    lang={lang} 
                    onTranscript={(text) => setNewBizDesc(prev => prev ? `${prev} ${text}` : text)}
                    className="py-1 px-2 border-slate-200"
                  />
                </div>
                <textarea
                  rows={3}
                  value={newBizDesc}
                  onChange={(e) => setNewBizDesc(e.target.value)}
                  placeholder="What makes your home business unique? Explain your specials, services, delivery zones, or booking details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Your Name (Registered By)</label>
                  <VoiceInputButton 
                    lang={lang} 
                    onTranscript={(text) => setNewBizAddedBy(text)}
                    className="py-1 px-2 border-slate-200"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={newBizAddedBy}
                  onChange={(e) => setNewBizAddedBy(e.target.value)}
                  placeholder="e.g. Girish A."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Register Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
