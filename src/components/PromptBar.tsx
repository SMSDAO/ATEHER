import { Mic, Zap, Paperclip, Copy, Sparkles, Terminal, Cpu } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "../lib/utils";
import { useCollaboration } from "../hooks/useCollaboration";

// Token approximation: 1 token ~ 4 chars
const estimateTokens = (text: string) => Math.ceil(text.length / 4);

interface PromptBarProps {
  onExecutePrompt?: (prompt: string) => void;
}

export function PromptBar({ onExecutePrompt }: PromptBarProps) {
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { createProject } = useCollaboration();

  const handleGenerate = () => {
    if (!val.trim()) return;
    setLoading(true);
    
    // Dispatch to realtime WebSocket collaboration & trigger callback
    setTimeout(() => {
      createProject(val);
      if (onExecutePrompt) {
        onExecutePrompt(val);
      }
      setVal("");
      setLoading(false);
    }, 600);
  };

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("Web Speech recognition not supported in this environment");
        return;
      }
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVal(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        setIsListening(true);
        recognitionRef.current = recognition;
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const tokens = estimateTokens(val);
  const tokenPercentage = Math.min(100, Math.round((tokens / 4096) * 100));

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="relative w-full max-w-3xl mx-auto flex items-center glass-panel-glow rounded-full p-2.5 shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.25)] border border-cyan-500/30">
        
        {/* Voice Dictation Trigger */}
        <button 
          type="button"
          title="Voice-to-Text Dictation" 
          onClick={toggleVoice}
          className={cn(
            "p-3 rounded-full transition-all shrink-0",
            isListening 
              ? "text-red-400 bg-red-500/20 animate-pulse shadow-[0_0_15px_rgba(255,0,85,0.5)]" 
              : "text-gray-400 hover:text-cyan-300 hover:bg-white/10"
          )}
        >
          <Mic className="w-5 h-5" />
        </button>

        <input 
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="Command AETHER or describe mission... (e.g. Audit DeFi smart contract liquidity pool)"
          className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm px-3 font-medium placeholder:text-gray-500"
        />

        <div className="flex items-center space-x-1.5 pr-1 shrink-0">
          <button 
            type="button"
            title="Attach Data Source"
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden sm:block"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button 
            type="button"
            onClick={handleGenerate}
            disabled={loading || !val.trim()}
            className={cn(
              "flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full transition-all text-xs font-bold flash-effect",
              loading || !val.trim() 
                ? "bg-white/10 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.5)]"
            )}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-black text-black" />
            )}
            <span className="hidden sm:inline">Dispatch</span>
          </button>
        </div>
      </div>

      {/* Token Progress & Live Approximation Meter */}
      <div className="w-full max-w-3xl mx-auto px-6 flex items-center justify-between text-[10px] font-mono text-gray-400">
        <div className="flex items-center space-x-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Context Load: <strong className="text-white">{tokens}</strong> tokens ({tokenPercentage}% of standard context window)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-24 bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-orange-400 to-red-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(4, tokenPercentage)}%` }}
            />
          </div>
          <span className="text-cyan-400 font-bold">4k Context Max</span>
        </div>
      </div>
    </div>
  );
}
