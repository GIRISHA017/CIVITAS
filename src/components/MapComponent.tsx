/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { CivicIssue, IssueCategory, IssueStatus, Language, TranslationDict } from '../types';
import { translateData } from '../translations';
import { MapPin, Info, AlertTriangle, Lightbulb, Trash2, Droplets, HelpCircle, Layers, Navigation } from 'lucide-react';

interface MapComponentProps {
  issues: CivicIssue[];
  selectedCategory: string;
  selectedStatus: string;
  onSelectIssue: (issue: CivicIssue) => void;
  onSelectLocationForReport?: (lat: number, lng: number) => void;
  lang?: Language;
  translations?: TranslationDict;
}

const CATEGORY_COLORS: Record<IssueCategory, { bg: string, text: string, border: string }> = {
  pothole: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
  streetlight: { bg: 'bg-yellow-500', text: 'text-slate-900', border: 'border-yellow-600' },
  garbage: { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-600' },
  water_leak: { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
  other: { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-600' }
};

const STATUS_COLORS: Record<IssueStatus, string> = {
  reported: 'ring-red-400 bg-red-100 text-red-800',
  authority_contacted: 'ring-orange-400 bg-orange-100 text-orange-800',
  in_progress: 'ring-amber-400 bg-amber-100 text-amber-800',
  resolved: 'ring-emerald-400 bg-emerald-100 text-emerald-800'
};

export default function MapComponent({ 
  issues, 
  selectedCategory, 
  selectedStatus, 
  onSelectIssue,
  onSelectLocationForReport,
  lang = 'en',
  translations
}: MapComponentProps) {
  const [mapMode, setMapMode] = useState<'schematic' | 'leaflet'>('schematic');
  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [leafletError, setLeafletError] = useState<string | null>(null);

  // Filter issues based on criteria
  const filteredIssues = issues.filter((issue) => {
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  // Coordinates mapping from Lat-Lng to SVG Percentages for our beautiful schematic ward map (Bangalore Ward 151)
  // Let's bound the region: lat [12.90, 12.99] and lng [77.60, 77.66]
  const getSvgCoordinates = (lat: number, lng: number) => {
    const minLat = 12.905;
    const maxLat = 12.985;
    const minLng = 77.605;
    const maxLng = 77.655;

    // Map to percentages (X: 5% to 95%, Y: 5% to 95%)
    // Note: Latitudes decrease going south, which is "down" in SVG, so we invert Y
    const x = 5 + ((lng - minLng) / (maxLng - minLng)) * 90;
    const y = 95 - ((lat - minLat) / (maxLat - minLat)) * 90;

    return { 
      x: Math.max(8, Math.min(92, x)), 
      y: Math.max(8, Math.min(92, y)) 
    };
  };

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case 'pothole': return <AlertTriangle className="w-3 h-3" />;
      case 'streetlight': return <Lightbulb className="w-3 h-3" />;
      case 'garbage': return <Trash2 className="w-3 h-3" />;
      case 'water_leak': return <Droplets className="w-3 h-3" />;
      default: return <HelpCircle className="w-3 h-3" />;
    }
  };

  // Setup Leaflet map when mode changes
  useEffect(() => {
    if (mapMode !== 'leaflet') {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
      return;
    }

    // Dynamic import to avoid SSR errors
    import('leaflet').then((L) => {
      if (!leafletContainerRef.current) return;

      try {
        if (leafletMapInstance.current) {
          leafletMapInstance.current.remove();
        }

        // Initialize Bangalore centered map
        const map = L.map(leafletContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true
        }).setView([12.945, 77.63], 13);

        // Standard OSM tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        leafletMapInstance.current = map;

        // Custom double-click to report location
        map.on('dblclick', (e: any) => {
          if (onSelectLocationForReport) {
            onSelectLocationForReport(e.latlng.lat, e.latlng.lng);
          }
        });

        setLeafletError(null);
      } catch (err) {
        console.error("Leaflet initialization failed: ", err);
        setLeafletError("Could not load external GIS map. Falling back to high-resolution offline schematic map.");
        setMapMode('schematic');
      }
    }).catch(err => {
      console.error("Failed to load leaflet module", err);
      setLeafletError("Leaflet module loading failed.");
      setMapMode('schematic');
    });

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, [mapMode]);

  // Update Leaflet markers dynamically
  useEffect(() => {
    if (mapMode !== 'leaflet' || !leafletMapInstance.current) return;

    import('leaflet').then((L) => {
      // Clear old markers
      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();
      } else {
        markersGroupRef.current = L.layerGroup().addTo(leafletMapInstance.current);
      }

      filteredIssues.forEach((issue) => {
        const colorConfig = CATEGORY_COLORS[issue.category];
        const statusConfig = issue.status === 'resolved' ? 'bg-emerald-500' : 'bg-red-500';

        // Custom elegant HTML divIcon to bypass standard leaflet asset loading issues
        const customIcon = L.divIcon({
          className: 'custom-leaflet-pin',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${colorConfig.bg} text-white border-2 border-white transition-transform hover:scale-110">
              <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${statusConfig} border border-white"></span>
              <div class="w-4 h-4 flex items-center justify-center">
                ${issue.category === 'pothole' ? '⚠️' : issue.category === 'streetlight' ? '💡' : issue.category === 'garbage' ? '🗑️' : issue.category === 'water_leak' ? '💧' : '🔧'}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([issue.latitude, issue.longitude], { icon: customIcon });
        
        marker.on('click', () => {
          onSelectIssue(issue);
        });

        marker.addTo(markersGroupRef.current);
      });
    });
  }, [filteredIssues, mapMode]);

  return (
    <div id="interactive-map-container" className="relative w-full h-[450px] bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      
      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-1 shadow-md">
        <button
          id="btn-schematic-map"
          onClick={() => setMapMode('schematic')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            mapMode === 'schematic' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Schematic GIS Map</span>
        </button>
        <button
          id="btn-live-leaflet-map"
          onClick={() => setMapMode('leaflet')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            mapMode === 'leaflet' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Live GIS Leaflet Map</span>
        </button>
      </div>

      {/* Map Content Mode 1: Leaflet Live Map */}
      {mapMode === 'leaflet' && (
        <div className="w-full h-full relative">
          <div ref={leafletContainerRef} className="w-full h-full z-10" />
          <div className="absolute bottom-2 left-2 z-20 bg-white/95 text-[10px] text-slate-500 px-2 py-1 rounded border border-slate-200 pointer-events-none shadow">
            💡 Double-click anywhere on the map to set reported coordinates
          </div>
        </div>
      )}

      {/* Map Content Mode 2: Custom High-Resolution Schematic Ward Map */}
      {mapMode === 'schematic' && (
        <div className="w-full h-full relative flex items-center justify-center p-2 select-none overflow-hidden">
          
          {/* Animated Background Grid & Tech UI */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          
          <svg className="w-full h-full max-w-4xl" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Water Reservoirs & Canals */}
            <path d="M 10 10 Q 25 35 30 70 T 15 90" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeOpacity="0.25" />
            <path d="M 85 5 Q 92 40 80 85" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.15" />
            
            {/* Major Arterial Roads Grid */}
            {/* Outer Ring Road */}
            <line x1="8" y1="20" x2="92" y2="20" stroke="#94a3b8" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" />
            {/* 80 Feet Road Bypass */}
            <line x1="8" y1="65" x2="92" y2="65" stroke="#cbd5e1" strokeWidth="1.6" strokeOpacity="0.7" />
            
            {/* Local Crossing Lanes */}
            <line x1="25" y1="10" x2="25" y2="90" stroke="#e2e8f0" strokeWidth="0.8" strokeOpacity="0.8" />
            <line x1="55" y1="10" x2="55" y2="90" stroke="#e2e8f0" strokeWidth="0.8" strokeOpacity="0.8" />
            <line x1="75" y1="10" x2="75" y2="90" stroke="#e2e8f0" strokeWidth="0.8" strokeOpacity="0.8" />
            <line x1="10" y1="42" x2="90" y2="42" stroke="#e2e8f0" strokeWidth="0.8" strokeOpacity="0.8" />

            {/* Neighborhood Zones */}
            <rect x="12" y="24" width="22" height="15" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="0.5" className="shadow-sm" />
            <text x="23" y="32" fontSize="2.2" fill="#475569" textAnchor="middle" fontWeight="bold">Koramangala Block 4</text>

            <rect x="60" y="25" width="22" height="13" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="0.5" className="shadow-sm" />
            <text x="71" y="32" fontSize="2.2" fill="#475569" textAnchor="middle" fontWeight="bold">Indiranagar Ward</text>

            <rect x="34" y="72" width="26" height="15" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="0.5" className="shadow-sm" />
            <text x="47" y="80" fontSize="2.2" fill="#475569" textAnchor="middle" fontWeight="bold">HSR Layout Sector 2</text>

            {/* Green Parks */}
            <circle cx="48" cy="48" r="8" fill="#10b981" fillOpacity="0.08" stroke="#10b981" strokeWidth="0.4" strokeDasharray="1 1" />
            <text x="48" y="49.5" fontSize="2" fill="#059669" textAnchor="middle" fontWeight="bold">Sector 2 Park</text>

            {/* Grid Intersections coordinates labels */}
            <text x="4" y="21.5" fontSize="1.8" fill="#94a3b8" className="font-mono">12.97° N</text>
            <text x="4" y="66.5" fontSize="1.8" fill="#94a3b8" className="font-mono">12.93° N</text>
            <text x="21" y="94" fontSize="1.8" fill="#94a3b8" className="font-mono">77.61° E</text>
            <text x="51" y="94" fontSize="1.8" fill="#94a3b8" className="font-mono">77.63° E</text>
          </svg>

          {/* Render Interactive Issue Pins as SVG overlays on absolute div map overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {filteredIssues.map((issue) => {
              const { x, y } = getSvgCoordinates(issue.latitude, issue.longitude);
              const colorConfig = CATEGORY_COLORS[issue.category];
              const isResolved = issue.status === 'resolved';

              return (
                <button
                  key={issue.id}
                  id={`map-pin-${issue.id}`}
                  onClick={() => onSelectIssue(issue)}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {/* Ripple radar ring for higher priorities */}
                  {issue.severity === 'high' && !isResolved && (
                    <span className="absolute -inset-2 rounded-full bg-red-400/30 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin Container */}
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white ${
                    isResolved ? 'bg-emerald-600 text-white' : colorConfig.bg
                  } text-white hover:scale-125 transition-transform`}>
                    
                    {/* Tiny Status Indicator Dot */}
                    <span className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border border-white ${
                      isResolved ? 'bg-emerald-400' : issue.status === 'in_progress' ? 'bg-amber-400 animate-pulse' : 'bg-red-500'
                    }`} />

                    {/* Icon inside marker */}
                    {getCategoryIcon(issue.category)}
                  </div>

                  {/* Pin label popover on hover */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-30 pointer-events-none">
                    <div className="font-bold text-slate-800">{translateData(issue.id, 'title', issue.title, lang)}</div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-500">
                      <span className="capitalize">
                        {translations 
                          ? (issue.category === 'pothole' ? translations.categoryPothole 
                             : issue.category === 'streetlight' ? translations.categoryStreetlight 
                             : issue.category === 'garbage' ? translations.categoryGarbage 
                             : issue.category === 'water_leak' ? translations.categoryWaterLeak 
                             : translations.categoryOther) 
                          : issue.category.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span className={`px-1 py-0.2 rounded text-[8px] ${
                        isResolved ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {translations 
                          ? (issue.status === 'reported' ? translations.statusReported 
                             : issue.status === 'authority_contacted' ? translations.statusAuthorityContacted 
                             : issue.status === 'in_progress' ? translations.statusInProgress 
                             : translations.statusResolved) 
                          : issue.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] text-slate-500 pointer-events-none max-w-xs leading-relaxed shadow-lg">
            🗺️ Click any colored marker to open detailed authority logs and community resolution tracking.
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-2.5 shadow-lg flex flex-col gap-1 text-[10px] text-slate-600">
        <span className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1">Issue Color Key</span>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Pothole Repair</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>Streetlight Malfunction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Uncontrolled Garbage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Water Pipeline Leak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Resolved (All Categories)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
