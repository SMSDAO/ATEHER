import { useState } from "react";
import { Bot, Code2, ShieldAlert, PenTool, BrainCircuit, Activity } from "lucide-react";
import { cn } from "../lib/utils";

const templates = [
  { 
    id: "creative",
    name: "Creative Strategist", 
    icon: PenTool, 
    description: "Generates high-impact narratives, decentralized product branding, and cyber copy.",
    color: "text-orange-400",
    border: "border-orange-500/40",
    glow: "shadow-[0_0_20px_rgba(255,140,0,0.25)]"
  },
  { 
    id: "debug",
    name: "Debug & Smart Contract Expert", 
    icon: Code2, 
    description: "Dissects EVM bytecode, Rust Solana programs, and optimizes execution gas.",
    color: "text-cyan-400",
    border: "border-cyan-500/40",
    glow: "shadow-[0_0_20px_rgba(0,240,255,0.25)]"
  },
  { 
    id: "security",
    name: "Cybersecurity Sentinel", 
    icon: ShieldAlert, 
    description: "Audits zero-trust vectors, re-entrancy vulnerabilities, and multi-sig policies.",
    color: "text-red-400",
    border: "border-red-500/40",
    glow: "shadow-[0_0_20px_rgba(255,0,85,0.25)]"
  },
];

interface AgentSelectorProps {
  onSelectPersona?: (personaName: string) => void;
}

export function AgentSelector({ onSelectPersona }: AgentSelectorProps) {
  const [selected, setSelected] = useState(templates[1].name);

  const handleSelect = (name: string) => {
    setSelected(name);
    onSelectPersona?.(name);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span>Neural Agent Persona Core</span>
        </h3>
        <span className="text-[10px] font-mono text-cyan-400">3 Models Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {templates.map((t) => (
          <button
            key={t.name}
            onClick={() => handleSelect(t.name)}
            className={cn(
              "flex flex-col items-start p-4 rounded-2xl glass-panel text-left transition-all border group relative overflow-hidden",
              selected === t.name 
                ? cn("bg-white/10", t.border, t.glow) 
                : "border-white/5 hover:border-white/20 hover:bg-white/5"
            )}
          >
            {selected === t.name && (
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 radar-dot" />
              </div>
            )}
            
            <div className={cn("w-9 h-9 rounded-xl bg-black/60 flex items-center justify-center mb-3 border border-white/10", t.color)}>
              <t.icon className="w-5 h-5" />
            </div>

            <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
              {t.name}
            </span>
            <span className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              {t.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
