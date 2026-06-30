import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Bell, 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Flame, 
  CalendarCheck,
  ChevronRight,
  UserCheck,
  Map,
  ShoppingBag,
  BookOpen,
  Newspaper,
  Vote,
  User,
  X,
  ArrowRight
} from 'lucide-react';
import { Language, TranslationDict } from '../types';
import { translateData } from '../translations';

interface PlannerPageProps {
  translations: TranslationDict;
  lang: Language;
  userPoints: number;
  userLevel: number;
  onAddPoints: (points: number) => void;
  onNavigateToPage?: (pageId: string) => void;
}

interface PlannerTask {
  id: string;
  title: string;
  category: string;
  impactScore: number; // 1-100
  aiPriority: 'high' | 'medium' | 'low';
  dueDate: string;
  estimatedHours: number;
  completed: boolean;
  scheduledTime?: string; // e.g. "Thursday 4:00 PM"
}

interface HabitGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  streak: number;
  type: 'habit' | 'goal';
}

export default function PlannerPage({ 
  translations, 
  lang, 
  userPoints, 
  userLevel,
  onAddPoints,
  onNavigateToPage
}: PlannerPageProps) {
  // 1. Core state
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<{ slot: string; title: string } | null>(null);
  const [tasks, setTasks] = useState<PlannerTask[]>([
    { 
      id: 'pt_001', 
      title: 'Water saplings at Corner Park Sector 3', 
      category: 'environment', 
      impactScore: 85, 
      aiPriority: 'high', 
      dueDate: 'Today', 
      estimatedHours: 1, 
      completed: false,
      scheduledTime: 'Thursday 4:00 PM' 
    },
    { 
      id: 'pt_002', 
      title: 'Inspect pothole repair quality on 80ft Road Bypass', 
      category: 'infrastructure', 
      impactScore: 92, 
      aiPriority: 'high', 
      dueDate: 'Tomorrow', 
      estimatedHours: 0.5, 
      completed: false 
    },
    { 
      id: 'pt_003', 
      title: 'Submit composting photo for Sunday Newspaper corner', 
      category: 'waste_management', 
      impactScore: 68, 
      aiPriority: 'medium', 
      dueDate: 'In 3 days', 
      estimatedHours: 0.5, 
      completed: false 
    },
    { 
      id: 'pt_004', 
      title: 'Order Karnataka lunch combo from Annapurna Caterers', 
      category: 'local_commerce', 
      impactScore: 45, 
      aiPriority: 'low', 
      dueDate: 'Today', 
      estimatedHours: 0.2, 
      completed: false 
    }
  ]);

  const [habits, setHabits] = useState<HabitGoal[]>([
    { id: 'hb_001', title: 'Daily Clean Neighborhood Patrol', target: 7, current: 5, unit: 'days/wk', streak: 5, type: 'habit' },
    { id: 'hb_002', title: 'Support Local Women Businesses', target: 2, current: 1, unit: 'times/wk', streak: 2, type: 'habit' },
    { id: 'hb_003', title: 'Civic Issues Reported & Logged', target: 3, current: 2, unit: 'issues/mo', streak: 0, type: 'goal' }
  ]);

  const [reminders, setReminders] = useState([
    { id: 'rm_001', text: 'Rain forecast tomorrow afternoon! Clear drains near Sector 2 Park.', type: 'weather', severity: 'warning' },
    { id: 'rm_002', text: '14 neighbors registered for Friday Park Sweepup. Bring extra trashbags!', type: 'community', severity: 'info' },
    { id: 'rm_003', text: 'The DAV Speedbreaker poll closes in 48 hours. Cast your vote!', type: 'voting', severity: 'warning' }
  ]);

  // 2. Planning / Calendar Scheduling state
  const [scheduledCalendar, setScheduledCalendar] = useState<Record<string, string>>({
    'Thursday 4:00 PM': 'Water saplings at Corner Park Sector 3',
    'Saturday 10:00 AM': 'Neighborhood Composting Workshop'
  });

  // Task creation state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('infrastructure');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Interactive Voice Assitant state
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('Hello Girish! I am your Voice Civic Copilot. Try saying: "Prioritize my tasks" or "Add task clean up Indiranagar tomorrow"');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);

  // Sorting
  const [sortByAiPriority, setSortByAiPriority] = useState(true);

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 3. Web Speech Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        
        // Map language
        if (lang === 'hi') rec.lang = 'hi-IN';
        else if (lang === 'kn') rec.lang = 'kn-IN';
        else if (lang === 'te') rec.lang = 'te-IN';
        else if (lang === 'ta') rec.lang = 'ta-IN';
        else if (lang === 'ml') rec.lang = 'ml-IN';
        else if (lang === 'mr') rec.lang = 'mr-IN';
        else rec.lang = 'en-IN';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleVoiceCommand(transcript);
          }
        };

        rec.onerror = (err: any) => {
          console.error('Speech recognition error', err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, [lang, tasks, habits]);

  // Text to Speech
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.cancel(); // Stop any currently playing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select appropriate regional language voice if available
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'kn') utterance.lang = 'kn-IN';
      else if (lang === 'te') utterance.lang = 'te-IN';
      else if (lang === 'ta') utterance.lang = 'ta-IN';
      else if (lang === 'ml') utterance.lang = 'ml-IN';
      else if (lang === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synth.speak(utterance);
    }
  };

  // 4. Voice Command Interpreter
  const handleVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase();
    
    // Command 1: Add task
    if (text.includes('add task') || text.includes('काम जोड़ें') || text.includes('ಕೆಲಸ ಸೇರಿಸಿ') || text.includes('టాస్క్ జోడించు')) {
      // Extract task title
      let title = rawText.replace(/add task/i, '').trim();
      title = title.replace(/काम जोड़ें/i, '').trim();
      title = title.replace(/ಕೆಲಸ ಸೇರಿಸಿ/i, '').trim();
      title = title.replace(/టాస్క్ జోడించు/i, '').trim();
      
      if (!title) title = 'Civic cleanup action';

      const newTask: PlannerTask = {
        id: 'pt_' + Date.now(),
        title: title,
        category: 'community',
        impactScore: 75,
        aiPriority: 'high',
        dueDate: 'Tomorrow',
        estimatedHours: 1,
        completed: false
      };

      setTasks(prev => [newTask, ...prev]);
      const reply = `Got it, I added the civic task: "${title}" to your scheduler.`;
      setAiResponse(reply);
      speakText(reply);
      showToast(`Added: "${title}" via voice!`);
      return;
    }

    // Command 2: Prioritize tasks
    if (text.includes('prioritize') || text.includes('प्राथमिकता') || text.includes('ಪ್ರಾಮುಖ್ಯತೆ') || text.includes('ప్రాధాన్యత')) {
      setSortByAiPriority(true);
      const reply = "I have run our intelligent neighborhood priority scoring. Your highest impact task is to inspect the 80 feet road bypass pothole repair, with an AI rating of 92 points.";
      setAiResponse(reply);
      speakText(reply);
      showToast("Tasks prioritized by impact points!");
      return;
    }

    // Command 3: Tell me my goals
    if (text.includes('goals') || text.includes('habits') || text.includes('लक्ष्य') || text.includes('ಗುರಿಗಳು') || text.includes('లక్ష్యాలు')) {
      const activeStreak = habits[0].streak;
      const reply = `You are doing great! Your daily clean neighborhood patrol has a streak of ${activeStreak} days. Keep it up to earn fifty extra hero points!`;
      setAiResponse(reply);
      speakText(reply);
      return;
    }

    // Default reply
    const fallbackReply = `I heard: "${rawText}". I can help schedule work, prioritize your civic duties, or note down local hazards. Try saying "prioritize tasks".`;
    setAiResponse(fallbackReply);
    speakText(fallbackReply);
  };

  const toggleMic = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Safari.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // 5. Actions
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const impactScores = { high: 88, medium: 65, low: 35 };

    const newTask: PlannerTask = {
      id: 'pt_' + Date.now(),
      title: newTaskTitle,
      category: newTaskCategory,
      impactScore: impactScores[newTaskPriority],
      aiPriority: newTaskPriority,
      dueDate: 'In 2 days',
      estimatedHours: newTaskPriority === 'high' ? 1.5 : 0.5,
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    showToast(`Task "${newTask.title}" added to your queue!`);
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newStatus = !t.completed;
        if (newStatus) {
          onAddPoints(15);
          showToast("Completed! +15 Hero Points earned.");
        }
        return { ...t, completed: newStatus };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    showToast("Task removed from planner.");
  };

  const incrementHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const nextVal = Math.min(h.target, h.current + 1);
        if (nextVal === h.target) {
          onAddPoints(30);
          showToast(`Awesome! Goal "${h.title}" reached. +30 Points!`);
          return { ...h, current: nextVal, streak: h.streak + 1 };
        }
        return { ...h, current: nextVal };
      }
      return h;
    }));
  };

  const scheduleTaskSmartly = (taskId: string, slot: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setScheduledCalendar({
      ...scheduledCalendar,
      [slot]: task.title
    });

    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, scheduledTime: slot };
      }
      return t;
    }));

    onAddPoints(5);
    showToast(`Scheduled "${task.title}" for ${slot}! +5 Points.`);
  };

  const handleExportCalendar = () => {
    showToast("Successfully exported Ward calendar to Google Calendar & Apple Calendar!");
  };

  // Sort helper
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortByAiPriority) {
      return b.impactScore - a.impactScore;
    }
    return 0; // Natural order
  });

  return (
    <div id="planner-container" className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24 md:pb-8 font-sans text-slate-800">
      
      {/* Dynamic Toast Success Notification */}
      {toastMessage && (
        <div id="planner-toast" className="fixed top-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-indigo-500/30 animate-bounce">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <header id="planner-header" className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Civic Assistant Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
              {lang === 'hi' ? 'नागरिक योजनाकार और शेड्यूलर' : 
               lang === 'kn' ? 'ನಾಗರಿಕ ಯೋಜನೆ ಮತ್ತು ಆಯೋಜಕ' :
               lang === 'te' ? 'సివిక్ ప్లానర్ & షెడ్యూలర్' :
               lang === 'ta' ? 'குடிமை திட்டமிடுபவர் & கால அட்டவணை' :
               lang === 'ml' ? 'സിവിക് പ്ലാനർ & ഷെഡ്യൂളർ' :
               lang === 'mr' ? 'नागरी नियोजक आणि वेळापत्रक' :
               'Hero Civic Planner'}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Organize your neighborhood contributions, prioritize high-impact issues, schedule cleanup sessions smoothly, and sync directly with local community events.
            </p>
          </div>

          {/* Productivity Stats Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Weekly Progress</p>
              <h3 className="text-lg font-extrabold font-sans text-white">{habits.filter(h => h.current >= h.target).length} of {habits.length} Done</h3>
              <p className="text-xs text-emerald-300 font-medium">Lvl {userLevel} Civic Guardian</p>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Layout: Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Voice assistant, Prioritizer, goals (8/12 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* FEATURE 7: VOICE ASSISTANCE COPILOT */}
          <section id="voice-assistant-section" className="bg-gradient-to-b from-indigo-50 to-white rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-200/20 rounded-full" />
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-indigo-600" />
              <span>Voice-Enabled Assistant Copilot</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 font-semibold rounded-full uppercase tracking-wider">Interactive Voice</span>
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-5">
              <button 
                id="mic-button-copilot"
                onClick={toggleMic}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md shrink-0 border ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-200 border-red-400' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500'
                }`}
                title="Click to talk"
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8 animate-pulse" />}
              </button>

              <div className="flex-1 space-y-2">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Copilot Response</p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-sm font-medium border border-slate-800 shadow-inner flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold select-none font-mono">🤖</span>
                  <p className="leading-relaxed">{aiResponse}</p>
                </div>
                
                {/* Voice Status */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
                  <span>Language input auto-adapted to Profile: <strong className="text-indigo-600 uppercase">{lang}</strong></span>
                  {isSpeaking && (
                    <span className="text-indigo-600 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Speaking answer aloud...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="mt-4 pt-3 border-t border-indigo-50 flex flex-wrap gap-2">
              <button 
                onClick={() => handleVoiceCommand("prioritize")}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-100 transition-all"
              >
                ⚡ "Prioritize my tasks"
              </button>
              <button 
                onClick={() => handleVoiceCommand("goals")}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-100 transition-all"
              >
                🎯 "Tell me my goals"
              </button>
              <button 
                onClick={() => handleVoiceCommand("Add task clear Indiranagar park on Saturday")}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-100 transition-all"
              >
                ✏️ "Add task: clean park"
              </button>
            </div>
          </section>

          {/* FEATURE 1: INTELLIGENT TASK PRIORITIZATION & TASK MANAGER */}
          <section id="prioritization-section" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-950 font-sans flex items-center gap-2">
                  <CheckSquare className="w-5.5 h-5.5 text-indigo-600" />
                  <span>Neighborhood Task List & Prioritizer</span>
                </h2>
                <p className="text-xs text-slate-500">
                  AI-prioritized according to severity, community votes, and reward multipliers.
                </p>
              </div>

              {/* Priority Filter / Sort Toggle */}
              <div className="inline-flex bg-slate-100 p-1 rounded-xl shrink-0">
                <button 
                  onClick={() => setSortByAiPriority(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    sortByAiPriority 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Score Sort</span>
                </button>
                <button 
                  onClick={() => setSortByAiPriority(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !sortByAiPriority 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span>Standard</span>
                </button>
              </div>
            </div>

            {/* Form to Add Task */}
            <form onSubmit={handleAddTask} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input 
                  type="text"
                  placeholder="What neighborhood action needs scheduling?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
                <select 
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="infrastructure">Infrastructure</option>
                  <option value="environment">Environment</option>
                  <option value="waste_management">Waste Management</option>
                  <option value="local_commerce">Support Local</option>
                </select>

                <select 
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="high">🚨 High Priority</option>
                  <option value="medium">⚡ Medium</option>
                  <option value="low">🌱 Low Priority</option>
                </select>

                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Action</span>
                </button>
              </div>
            </form>

            {/* Task Cards List */}
            <div className="space-y-3.5">
              {sortedTasks.map((task) => (
                <div 
                  key={task.id}
                  id={`task-item-${task.id}`}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    task.completed 
                      ? 'bg-slate-50/50 border-slate-200 opacity-65' 
                      : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-md'
                  }`}
                >
                  {/* Complete checkbox */}
                  <button 
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      task.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-slate-300 hover:border-indigo-500 bg-white'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-sm font-bold leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="capitalize font-semibold text-slate-500 font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">
                        {task.category.replace('_', ' ')}
                      </span>
                      
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {task.dueDate}
                      </span>

                      {task.scheduledTime ? (
                        <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px]">
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Scheduled: {task.scheduledTime}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          Not Scheduled Yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Priority Scoring Info */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-xs font-extrabold text-slate-900 font-mono">{task.impactScore}</span>
                      </div>
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        task.aiPriority === 'high' 
                          ? 'bg-red-50 text-red-600' 
                          : task.aiPriority === 'medium'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {task.aiPriority}
                      </span>
                    </div>

                    {/* Quick schedule helper */}
                    {!task.scheduledTime && !task.completed && (
                      <div className="relative group">
                        <button 
                          className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-950 transition-all"
                          title="Schedule this"
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </button>
                        {/* Quick timeslot list menu on hover */}
                        <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-20 min-w-[150px] text-left">
                          <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Select Timeslot</p>
                          <button 
                            type="button"
                            onClick={() => scheduleTaskSmartly(task.id, 'Thursday 4:00 PM')}
                            className="w-full text-xs hover:bg-indigo-50 px-2 py-1.5 rounded-lg font-medium text-slate-700 hover:text-indigo-700 text-left block"
                          >
                            Thur 4:00 PM
                          </button>
                          <button 
                            type="button"
                            onClick={() => scheduleTaskSmartly(task.id, 'Saturday 10:00 AM')}
                            className="w-full text-xs hover:bg-indigo-50 px-2 py-1.5 rounded-lg font-medium text-slate-700 hover:text-indigo-700 text-left block"
                          >
                            Sat 10:00 AM
                          </button>
                          <button 
                            type="button"
                            onClick={() => scheduleTaskSmartly(task.id, 'Sunday 9:00 AM')}
                            className="w-full text-xs hover:bg-indigo-50 px-2 py-1.5 rounded-lg font-medium text-slate-700 hover:text-indigo-700 text-left block"
                          >
                            Sun 9:00 AM
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Delete button */}
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                      title="Delete action"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* FEATURE 5: CALENDAR INTEGRATION */}
          <section id="calendar-integration-section" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-950 font-sans flex items-center gap-2">
                  <CalendarIcon className="w-5.5 h-5.5 text-indigo-600" />
                  <span>Ward Connected Calendar</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Track your RSVP'd public meetings, cleanup actions, and local shop pickups.
                </p>
              </div>

              <button 
                onClick={handleExportCalendar}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Export / Sync Calendars</span>
              </button>
            </div>

            {/* Weekly Calendar Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3.5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                // Find things scheduled on this day
                const scheduledItems = Object.entries(scheduledCalendar).filter(([slot, _]) => slot.startsWith(day));
                
                return (
                  <div key={day} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[120px]">
                    <div>
                      <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">{day.substring(0, 3)}</p>
                      {scheduledItems.length > 0 ? (
                        <div className="space-y-2">
                          {scheduledItems.map(([slot, title]) => (
                            <div 
                              key={slot} 
                              onClick={() => setSelectedCalendarEvent({ slot, title })}
                              className="p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 rounded-xl text-[10px] font-bold text-indigo-950 shadow-sm cursor-pointer transition-all duration-200 group/cal-item relative overflow-hidden"
                              title="Click to open related page options"
                            >
                              <span className="text-[9px] text-indigo-500 block mb-0.5 flex items-center justify-between">
                                <span>{slot.split(' ')[1]} {slot.split(' ')[2]}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/cal-item:opacity-100 transition-opacity text-indigo-600" />
                              </span>
                              <p className="truncate leading-tight pr-1">{title}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">No slots booked</p>
                      )}
                    </div>

                    <button 
                      onClick={() => showToast(`Click any task calendar icon above to schedule for ${day}!`)}
                      className="mt-3 w-full py-1 border border-dashed border-slate-200 hover:border-indigo-300 text-slate-400 hover:text-indigo-600 text-[10px] font-semibold rounded-lg transition-all text-center block"
                    >
                      + Add Item
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Reminders, Recommendations, Habits (4/12 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* FEATURE 4: CONTEXT-AWARE REMINDERS */}
          <section id="reminders-section" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-slate-950 font-sans flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <span>Context-Aware Reminders</span>
            </h2>

            <div className="space-y-3.5">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id}
                  className={`p-3.5 rounded-2xl border flex gap-3 ${
                    reminder.severity === 'warning' 
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                      : 'bg-indigo-50/70 border-indigo-100 text-indigo-900'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${reminder.severity === 'warning' ? 'text-amber-600' : 'text-indigo-600'}`} />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold leading-relaxed">
                      {reminder.text}
                    </p>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                      {reminder.type} • Ward Active Alert
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURE 2 & 3: AI-POWERED SCHEDULING ASSISTANCE & PRODUCTIVITY RECOMMENDATIONS */}
          <section id="recommendations-section" className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl p-6 text-white space-y-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <h2 className="text-md font-extrabold uppercase tracking-wider text-indigo-300 font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Personalized AI Recommendations</span>
            </h2>

            <div className="space-y-4">
              
              {/* Rec Card 1 */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-indigo-300 uppercase tracking-wider text-[10px]">Optimal Scheduling</span>
                  <span className="text-emerald-400 flex items-center gap-1">Nice Weather 24°C</span>
                </div>
                <h4 className="text-sm font-bold text-white">Suggested: Visit Corner Park</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Traffic is historically low on Thursdays at 4 PM. We suggest inspecting/watering saplings then.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setScheduledCalendar({ ...scheduledCalendar, 'Thursday 4:00 PM': 'Water saplings at Corner Park Sector 3' });
                      showToast("Scheduled! +5 Points.");
                    }}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all text-center block"
                  >
                    Accept AI Suggestion
                  </button>
                </div>
              </div>

              {/* Rec Card 2 */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px]">Points booster</span>
                <h4 className="text-sm font-bold text-white">Reach 500 Pts to Unlock Silver badge</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Completing your "Daily clean neighborhood patrol" checks three more times this week triggers a 50-point streak multiplier.
                </p>
              </div>

              {/* Rec Card 3 */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-indigo-300 font-bold uppercase tracking-wider text-[9px]">Local Commerce Support</span>
                <h4 className="text-sm font-bold text-white">10% Off Thali at Annapurna's</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Support women micro-entrepreneurs today. Show your Civitas profile card to claim 10% off.
                </p>
              </div>

            </div>
          </section>

          {/* FEATURE 6: GOAL AND HABIT TRACKING */}
          <section id="goals-habit-section" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-slate-950 font-sans flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Habits & Goal Tracker</span>
              </h2>
              <p className="text-xs text-slate-500">Track and build repeatable civic contribution habits.</p>
            </div>

            <div className="space-y-4">
              {habits.map((habit) => {
                const percent = Math.round((habit.current / habit.target) * 100);
                return (
                  <div key={habit.id} id={`habit-card-${habit.id}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{habit.title}</h4>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                          {habit.type} • {habit.target} {habit.unit}
                        </span>
                      </div>

                      {/* Streak badge */}
                      {habit.streak > 0 && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 animate-pulse">
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>{habit.streak}d streak</span>
                        </span>
                      )}
                    </div>

                    {/* Progress Bar & Buttons */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mt-1">
                          <span>{percent}% Complete</span>
                          <span>{habit.current} / {habit.target}</span>
                        </div>
                      </div>

                      {/* Log / Check-in button */}
                      <button 
                        onClick={() => incrementHabit(habit.id)}
                        disabled={habit.current >= habit.target}
                        className={`p-2 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                          habit.current >= habit.target
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        }`}
                        title={habit.current >= habit.target ? "Target Completed" : "Check-in today!"}
                      >
                        {habit.current >= habit.target ? (
                          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>

        </div>

      </div>

      {/* Interactive Calendar Event Detail & Navigation Modal */}
      {selectedCalendarEvent && (() => {
        const getRecommendedPage = (title: string): { id: string; name: string; reason: string } => {
          const lowerTitle = title.toLowerCase();
          if (lowerTitle.includes('water') || lowerTitle.includes('sapling') || lowerTitle.includes('park') || lowerTitle.includes('sweepup') || lowerTitle.includes('clean') || lowerTitle.includes('composting') || lowerTitle.includes('workshop') || lowerTitle.includes('volunteer')) {
            return { id: 'events', name: translations.navEvents || 'Events', reason: 'Matches environmental/neighborhood activities' };
          }
          if (lowerTitle.includes('caterer') || lowerTitle.includes('annapurna') || lowerTitle.includes('buy') || lowerTitle.includes('order') || lowerTitle.includes('food') || lowerTitle.includes('shop') || lowerTitle.includes('business') || lowerTitle.includes('enterprise') || lowerTitle.includes('fair')) {
            return { id: 'business', name: translations.navBusiness || 'Local Business', reason: 'Matches local business and shopping tasks' };
          }
          if (lowerTitle.includes('pothole') || lowerTitle.includes('road') || lowerTitle.includes('streetlight') || lowerTitle.includes('leak') || lowerTitle.includes('garbage') || lowerTitle.includes('drain') || lowerTitle.includes('repair') || lowerTitle.includes('inspect')) {
            return { id: 'home', name: translations.navHome || 'Home & Map', reason: 'Matches civic infrastructure reporting' };
          }
          if (lowerTitle.includes('spend') || lowerTitle.includes('ledger') || lowerTitle.includes('payment') || lowerTitle.includes('budget') || lowerTitle.includes('invoice') || lowerTitle.includes('contract')) {
            return { id: 'ledger', name: translations.navLedger || 'Ledger', reason: 'Matches financial or spending keywords' };
          }
          if (lowerTitle.includes('newspaper') || lowerTitle.includes('bulletin') || lowerTitle.includes('news') || lowerTitle.includes('article') || lowerTitle.includes('photo')) {
            return { id: 'news', name: translations.navNews || 'Sunday Newspaper', reason: 'Matches newspaper writing or bulletin tasks' };
          }
          if (lowerTitle.includes('vote') || lowerTitle.includes('poll') || lowerTitle.includes('speedbreaker') || lowerTitle.includes('ballot')) {
            return { id: 'voting', name: translations.navVoting || 'Community Vote', reason: 'Matches active public polls or votes' };
          }
          return { id: 'events', name: translations.navEvents || 'Events', reason: 'Default civic exploration' };
        };

        const handlePageNavigation = (pageId: string) => {
          if (onNavigateToPage) {
            onNavigateToPage(pageId);
            setSelectedCalendarEvent(null);
          }
        };

        const recommendation = getRecommendedPage(selectedCalendarEvent.title);
        const navigationOptions = [
          { id: 'home', label: translations.navHome || 'Home & Map', description: 'Active issues, reporting, and interactive maps', icon: Map, color: 'text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100 hover:border-rose-200' },
          { id: 'events', label: translations.navEvents || 'Events', description: 'Volunteer drives and coordination', icon: CalendarIcon, color: 'text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200' },
          { id: 'business', label: translations.navBusiness || 'Local Business', description: 'Local women-led shops & businesses', icon: ShoppingBag, color: 'text-sky-500 bg-sky-50 border-sky-100 hover:bg-sky-100 hover:border-sky-200' },
          { id: 'ledger', label: translations.navLedger || 'Ledger', description: 'Municipal funds and contract audits', icon: BookOpen, color: 'text-purple-500 bg-purple-50 border-purple-100 hover:bg-purple-100 hover:border-purple-200' },
          { id: 'news', label: translations.navNews || 'Sunday Newspaper', description: 'Sunday Newspaper and success stories', icon: Newspaper, color: 'text-amber-500 bg-amber-50 border-amber-100 hover:bg-amber-100 hover:border-amber-200' },
          { id: 'voting', label: translations.navVoting || 'Community Vote', description: 'Cast your vote in active community ballots', icon: Vote, color: 'text-indigo-500 bg-indigo-50 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200' },
          { id: 'profile', label: translations.navProfile || 'My Profile', description: 'Your points, level, and unlocked badges', icon: User, color: 'text-slate-500 bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-200' },
        ];

        return (
          <div 
            id="calendar-event-modal"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200"
            onClick={() => setSelectedCalendarEvent(null)}
          >
            <div 
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                    Calendar Action Hub
                  </span>
                  <h3 className="text-md font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <CalendarCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span>{selectedCalendarEvent.slot}</span>
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedCalendarEvent(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Event Description Card */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Scheduled Event Title</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-1 leading-snug">
                    {selectedCalendarEvent.title}
                  </h4>
                </div>

                {/* AI Detection & Recommendation Banner */}
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl text-white shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-200 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <span className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-widest block font-mono">Civic Match Recommendation</span>
                      <p className="text-xs font-medium leading-relaxed">
                        This event seems related to <strong className="text-white underline">{recommendation.name}</strong>. Would you like to jump directly there to coordinates, details, or participation tools?
                      </p>
                      <button
                        onClick={() => handlePageNavigation(recommendation.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 text-xs font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer mt-1"
                      >
                        <span>Jump to {recommendation.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* All Destinations List */}
                <div className="space-y-3">
                  <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alternative Destinations</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {navigationOptions.map((opt) => {
                      const IconComponent = opt.icon;
                      const isRecommended = opt.id === recommendation.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handlePageNavigation(opt.id)}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                            isRecommended 
                              ? 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50' 
                              : 'border-slate-150 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl border ${opt.color}`}>
                              <IconComponent className="w-4 h-4 shrink-0" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                                {isRecommended && (
                                  <span className="bg-indigo-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{opt.description}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => setSelectedCalendarEvent(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
