import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../api/chat';

interface ChatBotProps {
  onClose: () => void;
  onPlaceSuggestion: (place: {
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }) => void;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Array<{
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }>;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      "Hello! I'm CampusSignal AI. I analyze 5G Massive MIMO beamforming, coverage dead-zones, and carrier performance across R.V.R. & J.C. College of Engineering. How can I assist your connectivity today?",
    timestamp: new Date(),
    suggestions: [
      {
        id: 'suggest-1',
        name: 'Best spot for video calls near Library',
        type: 'suggestion',
        campus: 'RVRJC College of Engineering'
      },
      {
        id: 'suggest-2',
        name: 'Jio True 5G vs Airtel 5G in Cyber Block',
        type: 'suggestion',
        campus: 'RVRJC College of Engineering'
      },
      {
        id: 'suggest-3',
        name: 'Wi-Fi 6E latency in Hostel A Wing',
        type: 'suggestion',
        campus: 'RVRJC College of Engineering'
      }
    ]
  }
];

export const ChatBot = ({ onClose, onPlaceSuggestion }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const botResponse: Message = await chatAPI.sendMessage({ message: input });
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'I encountered an interruption accessing live telemetry. Please retry your inquiry.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: {
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }) => {
    const place = {
      id: suggestion.id,
      name: suggestion.name,
      type: suggestion.type || 'place',
      building: suggestion.building,
      floor: suggestion.floor,
      campus: suggestion.campus || 'RVRJC College of Engineering'
    };
    onPlaceSuggestion(place);
    onClose();
  };

  const quickPrompts = [
    'Best 5G node?',
    'Jio vs Airtel comparison',
    'Low-latency spots',
    'Wi-Fi 6E coverage'
  ];

  return (
    <div className="w-84 sm:w-96 h-[500px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-950/70 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <span className="material-symbols-outlined text-[18px] text-white">smart_toy</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
            CampusSignal AI
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              5G COGNITIVE
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] text-emerald-400 font-mono">Telemetry Synchronized</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close Assistant"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                message.role === 'user'
                  ? 'bg-sky-500 text-slate-950 font-semibold rounded-br-xs shadow-md shadow-sky-500/10'
                  : 'bg-slate-800/85 text-slate-100 border border-slate-700/60 rounded-bl-xs shadow-md'
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/50 space-y-1.5">
                  <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">explore</span>
                    Recommended Campus Locations
                  </p>
                  {message.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 hover:border-sky-400/60 hover:bg-sky-500/10 transition-all cursor-pointer group"
                    >
                      <span className="material-symbols-outlined text-[14px] text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                        near_me
                      </span>
                      <span className="text-[11px] text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 font-mono px-1">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-bl-xs px-3.5 py-2.5 flex items-center gap-2.5 shadow-md">
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Analyzing campus RF beamforming...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="flex gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar shrink-0 border-t border-slate-800/70 bg-slate-950/40">
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300 hover:border-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition-all cursor-pointer whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700/70 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-2xl px-3 py-1.5 transition-all"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about 5G nodes, speeds, or latency..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-7 h-7 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Send"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
