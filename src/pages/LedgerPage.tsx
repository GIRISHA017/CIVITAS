/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LedgerTransaction, Language, TranslationDict, Comment } from '../types';
import CommentsSection from '../components/CommentsSection';
import { translateData } from '../translations';
import { 
  DollarSign, 
  Search, 
  TrendingUp, 
  CheckCircle, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Layers, 
  Calendar,
  IndianRupee,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface LedgerPageProps {
  transactions: LedgerTransaction[];
  onUpdateTransaction: (updatedTx: LedgerTransaction) => void;
  lang: Language;
  translations: TranslationDict;
}

export default function LedgerPage({ 
  transactions, 
  onUpdateTransaction, 
  lang, 
  translations 
}: LedgerPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount_desc' | 'amount_asc'>('date');

  // Calculate totals dynamically based on mock data
  const totalAllocated = 500000; // 5 Lakhs
  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const activeFlagsCount = transactions.filter(tx => tx.isQuestioned).length;

  const handleToggleExpand = (id: string) => {
    setExpandedTxId(expandedTxId === id ? null : id);
  };

  const handleToggleQuestion = (tx: LedgerTransaction) => {
    onUpdateTransaction({
      ...tx,
      isQuestioned: !tx.isQuestioned
    });
  };

  const handleAddComment = (tx: LedgerTransaction, text: string) => {
    const newComment: Comment = {
      id: `lcomm_${Date.now()}`,
      authorName: "Girish A. (You)",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onUpdateTransaction({
      ...tx,
      comments: [...tx.comments, newComment]
    });
  };

  // Filter Categories
  const categories = Array.from(new Set(transactions.map(tx => tx.category)));

  // Filter & Sort Logic
  const filteredTx = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || tx.category === filterCategory;
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    if (sortBy === 'amount_desc') return b.amount - a.amount;
    if (sortBy === 'amount_asc') return a.amount - b.amount;
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // default date desc
  });

  return (
    <div id="ledger-page-root" className="space-y-6">
      
      {/* 1. Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">{translations.ledgerTitle}</h2>
        <p className="text-xs text-slate-500 mt-1">{translations.ledgerSubtitle}</p>
      </div>

      {/* 2. Visual Audit Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allocated Budget */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{translations.totalFundsAllocated}</span>
            <div className="text-lg font-extrabold text-slate-800 mt-1.5 flex items-center">
              <IndianRupee className="w-4 h-4 text-slate-500 mr-0.5 shrink-0" />
              <span>{totalAllocated.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Ward 151 Fund Allocation verified</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{translations.totalFundsSpent}</span>
            <div className="text-lg font-extrabold text-slate-800 mt-1.5 flex items-center">
              <IndianRupee className="w-4 h-4 text-slate-500 mr-0.5 shrink-0" />
              <span>{totalSpent.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              {((totalSpent / totalAllocated) * 100).toFixed(1)}% of allocated budget spent
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Outstanding Flagged Issues */}
        <div className={`border p-5 rounded-2xl flex items-center justify-between transition-all shadow-sm ${
          activeFlagsCount > 0 
            ? 'bg-red-50 border-red-200' 
            : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{translations.auditTransparency}</span>
            <div className="text-lg font-extrabold mt-1.5 flex items-center gap-1.5 text-slate-800">
              <ShieldAlert className={`w-5 h-5 shrink-0 ${activeFlagsCount > 0 ? 'text-red-500' : 'text-slate-400'}`} />
              <span>{activeFlagsCount} Transaction Queries</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              {activeFlagsCount > 0 
                ? "Disputes require municipal clarification" 
                : "All accounts fully balanced"}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            activeFlagsCount > 0 
              ? 'bg-red-100/55 text-red-600 border-red-200' 
              : 'bg-slate-50 text-slate-400 border-slate-100'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="ledger-search-input"
            type="text"
            placeholder="Search vendor or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Category & Sorting Selectors */}
        <div className="flex gap-2.5 w-full md:w-auto flex-wrap">
          <select
            id="ledger-filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            id="ledger-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="date">Sort: Recent Date</option>
            <option value="amount_desc">Sort: Amount (High to Low)</option>
            <option value="amount_asc">Sort: Amount (Low to High)</option>
          </select>
        </div>

      </div>

      {/* 4. Ledger Transaction Expandable Feed List */}
      <div className="space-y-4">
        {filteredTx.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-medium shadow-sm">
            No transactions found matching your criteria.
          </div>
        ) : (
          filteredTx.map((tx) => {
            const isExpanded = expandedTxId === tx.id;
            return (
              <div 
                key={tx.id} 
                id={`ledger-transaction-card-${tx.id}`}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${
                  tx.isQuestioned 
                    ? 'border-red-300' 
                    : isExpanded 
                    ? 'border-indigo-300 ring-1 ring-indigo-100' 
                    : 'border-slate-200'
                }`}
              >
                
                {/* Compact Card Title Header (Expand Trigger) */}
                <button
                  id={`btn-ledger-expand-${tx.id}`}
                  onClick={() => handleToggleExpand(tx.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Circle Status/Category marker */}
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                      tx.isQuestioned 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {tx.isQuestioned ? <AlertCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>

                    {/* Title Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-bold uppercase tracking-wider">
                          {translateData(tx.id, 'category', tx.category, lang)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {tx.date}
                        </span>
                        {tx.isQuestioned && (
                          <span className="bg-red-50 text-red-600 text-[9px] px-1.5 py-0.2 rounded font-bold border border-red-200 uppercase">
                            Audit Dispute Raised
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">
                        {translateData(tx.id, 'title', tx.title, lang)}
                      </h4>
                    </div>
                  </div>

                  {/* Financial Amount Value & Expand Arrow */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-slate-800 flex items-center justify-end">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                        <span>{tx.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Ward Fund</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                  </div>

                </button>

                {/* Expanded Detailed Content Area */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/40 p-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Contract details block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: General Meta Info */}
                      <div className="space-y-4">
                        <div className="text-xs text-slate-600 leading-relaxed">
                          <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1">Contract Specifications</p>
                          <p>{translateData(tx.id, 'description', tx.description, lang)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Contract Vendor</span>
                            <span className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              {translateData(tx.id, 'vendor', tx.vendor, lang)}
                            </span>
                          </div>
                          
                          {tx.receiptUrl && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Official Receipt</span>
                              <span className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1 font-mono">
                                <FileText className="w-3.5 h-3.5" />
                                Receipt_Tx{tx.id}.pdf
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Receipt Invoice Document Image Preview */}
                      {tx.receiptUrl && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            Supporting Ledger Receipt (Scanned Document)
                          </label>
                          <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white h-36 flex items-center justify-center shadow-sm">
                            <img 
                              src={tx.receiptUrl} 
                              alt="Receipt proof document" 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              referrerPolicy="no-referrer"
                            />
                            {/* Decorative invoice stamp */}
                            <div className="absolute right-3 bottom-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded font-bold text-[9px] uppercase tracking-wider shadow font-mono">
                              Verified Audit Stamp
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Integrated Comments section with Toggle Dispute Flag */}
                    <CommentsSection 
                      comments={tx.comments}
                      onAddComment={(text) => handleAddComment(tx, text)}
                      lang={lang}
                      title="Ledger Discussion & Public Audits"
                      isFlaggedItem={tx.isQuestioned}
                      onToggleFlag={() => handleToggleQuestion(tx)}
                    />

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
