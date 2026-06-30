/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Language } from '../types';

interface SpeechAccessibilityProps {
  currentLanguage: Language;
}

// Global hook/state reference for simpler consumption if needed, but let's implement a clean self-contained visual helper
export default function SpeechAccessibility({ currentLanguage }: SpeechAccessibilityProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      setSynth(window.speechSynthesis);
    }
  }, []);

  const handleReadAloud = () => {
    if (!speechSupported || !synth) return;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    // Extract all meaningful text from the page
    const elements = document.querySelectorAll('h1, h2, h3, p, label, button, .read-aloud-content');
    const texts: string[] = [];
    
    elements.forEach((el) => {
      // Avoid reading hidden elements, nav items, or footer elements repeatedly
      if (
        el.closest('nav') || 
        el.closest('.no-read-aloud') || 
        el.id === 'language-selector' ||
        el.classList.contains('no-read')
      ) {
        return;
      }
      
      const text = el.textContent?.trim();
      if (text && text.length > 2) {
        texts.push(text);
      }
    });

    if (texts.length === 0) return;

    const fullTextToRead = texts.join('. ');
    const utterance = new SpeechSynthesisUtterance(fullTextToRead);
    
    // Set language locale based on current language selection
    if (currentLanguage === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (currentLanguage === 'kn') {
      utterance.lang = 'kn-IN';
    } else if (currentLanguage === 'te') {
      utterance.lang = 'te-IN';
    } else if (currentLanguage === 'ta') {
      utterance.lang = 'ta-IN';
    } else if (currentLanguage === 'ml') {
      utterance.lang = 'ml-IN';
    } else if (currentLanguage === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN'; // Elegant Indian English accent
    }

    utterance.rate = 0.95; // Slightly slower for clear comprehension

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    synth.cancel(); // Stop any pending speech
    synth.speak(utterance);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  if (!speechSupported) return null;

  return (
    <div id="speech-accessibility-widget" className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2">
      <button
        id="btn-read-aloud"
        onClick={handleReadAloud}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
          isPlaying 
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
        title={isPlaying ? "Stop Read Aloud" : "Read Page Aloud (Accessibility)"}
        aria-label="Accessibility Read Aloud"
      >
        {isPlaying ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>
    </div>
  );
}

/**
 * Reusable Voice Dictation Microphone Component for Text Areas and inputs
 */
interface VoiceInputProps {
  onTranscript: (text: string) => void;
  lang: Language;
  className?: string;
  placeholder?: string;
}

export function VoiceInputButton({ onTranscript, lang, className = "" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        
        if (lang === 'hi') {
          rec.lang = 'hi-IN';
        } else if (lang === 'kn') {
          rec.lang = 'kn-IN';
        } else if (lang === 'te') {
          rec.lang = 'te-IN';
        } else if (lang === 'ta') {
          rec.lang = 'ta-IN';
        } else if (lang === 'ml') {
          rec.lang = 'ml-IN';
        } else if (lang === 'mr') {
          rec.lang = 'mr-IN';
        } else {
          rec.lang = 'en-IN';
        }

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onTranscript(transcript);
          }
        };

        rec.onerror = () => {
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, [lang, onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error("Speech Recognition start failed", err);
      }
    }
  };

  if (!recognition) return null;

  return (
    <button
      type="button"
      id="btn-voice-dictation"
      onClick={toggleListening}
      className={`p-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-all ${
        isListening
          ? 'bg-red-50 border-red-300 text-red-700 animate-pulse'
          : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
      } ${className}`}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 text-red-600" />
          <span>Listening...</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-emerald-600" />
          <span>Speak details</span>
        </>
      )}
    </button>
  );
}
