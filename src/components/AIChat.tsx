import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import type { ChatMessage } from '@/types/builder';

interface AIChatProps {
  appName: string;
  appType: string;
  screenCount: number;
}

const QUICK_PROMPTS = [
  'How do I add authentication?',
  'Generate a login screen',
  'What components should I add?',
  'Improve my app design',
  'Add dark mode support',
];

export default function AIChat({ appName, appType, screenCount }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hi! I'm your AI assistant for ${appName}. This is a ${appType} app with ${screenCount} screens. Ask me anything about your app, or request changes!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text, appType, screenCount);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-slate-900" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">AI Assistant</h3>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto animate-pulse" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-slate-800'
                  : 'bg-gradient-to-br from-emerald-400 to-cyan-500'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-slate-900" />
              )}
            </div>
            <div
              className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2.5 animate-fade-in-up">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-slate-900" />
            </div>
            <div className="rounded-xl px-3 py-2.5 bg-slate-900 border border-slate-800 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="text-[10px] px-2 py-1 rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2">
          <Sparkles className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="text-slate-400 hover:text-emerald-400 disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function generateResponse(input: string, appType: string, screenCount: number): string {
  const lower = input.toLowerCase();
  if (lower.includes('auth') || lower.includes('login') || lower.includes('sign')) {
    return `To add authentication, I recommend:\n\n1. Add a Login screen with email/password fields\n2. Add a Sign Up screen with name, email, password\n3. Use Supabase Auth for backend — it handles sessions automatically\n4. Add a "Forgot Password" flow\n5. Set up social login (Google, Apple) for better UX\n\nWould you like me to generate the login screen for you?`;
  }
  if (lower.includes('dark') || lower.includes('theme')) {
    return `Dark mode is a great addition! Here's how:\n\n1. Add a theme toggle in Settings\n2. Define dark color variants (dark surface, light text)\n3. Use a ThemeProvider to switch palettes\n4. Persist the preference with AsyncStorage\n5. Follow system theme by default\n\nYour ${appType} app would look stunning in dark mode!`;
  }
  if (lower.includes('design') || lower.includes('improve') || lower.includes('beautif')) {
    return `Here are design improvements for your ${appType} app:\n\n1. Add consistent spacing (8px grid)\n2. Use shadow elevation for cards\n3. Add smooth transitions between screens\n4. Include loading skeletons for async data\n5. Add haptic feedback on button presses\n6. Use a consistent color system — check the Theme tab!\n\nYou currently have ${screenCount} screens. Want me to suggest more?`;
  }
  if (lower.includes('component') || lower.includes('add')) {
    return `Great question! Based on your ${appType} app, I suggest adding:\n\n1. A search bar for content discovery\n2. Empty states with illustrations\n3. Pull-to-refresh on list screens\n4. Skeleton loaders for better UX\n5. A profile/settings screen\n6. Push notification opt-in\n\nCheck the Components tab to drag and drop new elements!`;
  }
  if (lower.includes('screen') || lower.includes('page')) {
    return `You currently have ${screenCount} screens. For a ${appType} app, consider adding:\n\n1. Onboarding flow (3-4 screens)\n2. Search/discovery screen\n3. Detail view for items\n4. Profile page\n5. Settings/preferences\n\nUse the Navigation Flow tab to visualize your screen structure!`;
  }
  return `I understand you're asking about "${input}". For your ${appType} app with ${screenCount} screens, I can help with:\n\n- Adding new screens or components\n- Design improvements and theming\n- Authentication setup\n- Performance optimization\n- Code generation for any platform\n\nWhat would you like to do next?`;
}
