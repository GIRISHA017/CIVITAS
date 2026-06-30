/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertTriangle, Lightbulb, Trash2, Droplets, Info } from 'lucide-react';
import { CivicIssue, IssueCategory, IssueSeverity, Language, TranslationDict } from '../types';
import { VoiceInputButton } from './SpeechAccessibility';

interface ReportIssueModalProps {
  onClose: () => void;
  onSubmit: (newIssue: Omit<CivicIssue, 'id' | 'reportedBy' | 'reportedDate' | 'comments' | 'status'>) => void;
  lang: Language;
  translations: TranslationDict;
  prefilledCategory?: string | null;
  selectedLat?: number;
  selectedLng?: number;
}

const CATEGORY_AUTHORITIES: Record<IssueCategory, { department: string, representative: string }> = {
  pothole: { 
    department: "Bruhat Bengaluru Mahanagara Palike (BBMP) - Road Infrastructure Division", 
    representative: "Sub-Divisional Engineer Mr. K. Srinivasa" 
  },
  streetlight: { 
    department: "BESCOM (Bangalore Electricity Supply Company) Electrical Ward 8", 
    representative: "Lineman Overseer Prasad Swamy" 
  },
  garbage: { 
    department: "BBMP Solid Waste Management (SWM) - South Zone", 
    representative: "Health Inspector Mrs. Manjula Gowda" 
  },
  water_leak: { 
    department: "Bangalore Water Supply and Sewerage Board (BWSSB) Ward Waterlines", 
    representative: "Assistant Engineer Ms. Preeti Nair" 
  },
  other: { 
    department: "Ward 151 Community Grievance Cell", 
    representative: "Nodal Officer Mr. Ramesh Gowda" 
  }
};

export default function ReportIssueModal({ 
  onClose, 
  onSubmit, 
  lang, 
  translations, 
  prefilledCategory = null,
  selectedLat,
  selectedLng
}: ReportIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>((prefilledCategory as IssueCategory) || 'pothole');
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-route authority based on category
  const authorityInfo = CATEGORY_AUTHORITIES[category];

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    // Create a local object URL to display preview
    if (selectedFile.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setDescription(prev => (prev ? prev + ' ' + text : text));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Use selected coordinates if available, else standard Ward Coordinates with a slight random variation
    const baseLat = selectedLat || 12.93 + Math.random() * 0.05;
    const baseLng = selectedLng || 77.62 + Math.random() * 0.04;

    onSubmit({
      title,
      description,
      category,
      severity,
      latitude: baseLat,
      longitude: baseLng,
      authorityDepartment: authorityInfo.department,
      authorityContactPerson: authorityInfo.representative,
      proofs: {
        reported: filePreview || "https://images.unsplash.com/photo-1599740831244-42ea2d63cc69?auto=format&fit=crop&q=80&w=400"
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="report-issue-modal" 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-900/60">
              +
            </div>
            <h2 className="text-md font-extrabold text-slate-100 uppercase tracking-wider">{translations.reportAnIssue}</h2>
          </div>
          <button 
            id="btn-close-modal" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-100 p-1 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Issue Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{translations.title}</label>
            <input
              id="input-issue-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken pipe flooding Sector 2 road"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Grid Category & Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{translations.category}</label>
              <select
                id="select-issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="pothole">{translations.categoryPothole}</option>
                <option value="streetlight">{translations.categoryStreetlight}</option>
                <option value="garbage">{translations.categoryGarbage}</option>
                <option value="water_leak">{translations.categoryWaterLeak}</option>
                <option value="other">{translations.categoryOther}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{translations.severity}</label>
              <select
                id="select-issue-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="low">{translations.severityLow}</option>
                <option value="medium">{translations.severityMedium}</option>
                <option value="high">{translations.severityHigh}</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{translations.description}</label>
              {/* Voice Accessibility Dictation Trigger */}
              <VoiceInputButton 
                lang={lang} 
                onTranscript={handleVoiceTranscript} 
                className="scale-95" 
              />
            </div>
            <textarea
              id="textarea-issue-desc"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details of the location, hazards, and duration..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Coordinate Selection Helper */}
          {(selectedLat && selectedLng) && (
            <div className="bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 rounded-xl text-[11px] text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Report Location PIN coordinates: <strong>{selectedLat.toFixed(5)}° N, {selectedLng.toFixed(5)}° E</strong></span>
            </div>
          )}

          {/* File Upload Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{translations.attachProof}</label>
            <div
              id="upload-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-950/20' 
                  : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {filePreview ? (
                <div className="relative">
                  <img src={filePreview} alt="Proof preview" className="max-h-24 rounded-lg object-cover border border-slate-800" />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFilePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="text-xs font-semibold text-slate-300">
                    {file ? file.name : "Drag & drop image, or click to browse"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, or PDF up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* AI Routing Logic Notification Simulation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              <span>Civic Department Auto-Routing</span>
            </div>
            <p>Based on your selected category, this report will automatically trigger a dispatch directly to:</p>
            <div className="font-semibold text-slate-200 bg-slate-900 px-3 py-1.5 rounded border border-slate-800/60 mt-1">
              <div>🏢 Department: {authorityInfo.department}</div>
              <div>👤 Nodal Officer: {authorityInfo.representative}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              id="btn-form-cancel"
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              id="btn-form-submit"
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950/20"
            >
              {translations.submitReport}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
