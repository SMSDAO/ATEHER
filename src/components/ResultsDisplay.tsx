import { Copy, Sparkles, Check, Terminal, Cpu, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface ResultsDisplayProps {
  lastPrompt?: string;
  response?: string;
}

export function ResultsDisplay({ lastPrompt, response }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const displayMessage = response || 
    `Autonomous Agent Synthesis Report:\n• Dissected 14 smart contract execution pathways across EVM and Solana clusters.\n• Zero re-entrancy vulnerabilities identified in target multi-sig custody module.\n• Calculated optimal liquidity routing parameters with +3.4% slippage reduction.\n• Status: Ready for cold-key cryptographic payload signing.`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 glass-panel-glow p-6 sm:p-7 rounded-3xl border border-cyan-500/30 relative overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.15)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-orange-400 to-red-500 opacity-80" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-widest font-mono">Neural Assistant Response Vector</span>
        </div>
        
        <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            LATENCY: 420ms
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            VERIFIED
          </span>
        </div>
      </div>

      {lastPrompt && (
        <div className="mb-4 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300 flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="font-mono text-gray-400">Target Objective:</span>
          <span className="text-white font-medium italic">"{lastPrompt}"</span>
        </div>
      )}

      <div className="text-gray-200 text-xs sm:text-sm font-mono leading-relaxed bg-black/60 p-4 sm:p-5 rounded-2xl border border-white/5 whitespace-pre-line custom-scrollbar">
        {displayMessage}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center space-x-3 text-[11px] text-gray-400 font-mono">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Model: Gemini-2.5 Quantum Neural</span>
          </span>
        </div>

        <button 
          onClick={() => copyToClipboard(displayMessage)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white border border-white/10 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied to Clipboard" : "Copy Response"}</span>
        </button>
      </div>
    </div>
  );
}
