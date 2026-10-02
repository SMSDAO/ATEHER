import { useState } from "react";
import { 
  BookOpen, Terminal, Key, LineChart, Shield, HelpCircle, 
  Sparkles, CheckCircle2, ChevronRight, Zap, Mic, Copy, Sliders, Cpu
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const guideSections = [
  {
    id: "quickstart",
    title: "1. Quickstart & Architecture",
    icon: Sparkles,
    color: "text-cyan-400",
    badge: "ESSENTIAL",
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-gray-300">
        <p>
          Welcome to <strong className="text-white">AETHER Enterprise</strong>, a unified cyber-futuristic terminal engineered for autonomous AI prompt engineering, decentralized multi-chain key custody, portfolio risk modeling, and real-time team collaboration.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">CORE DIRECTIVE</span>
            <h4 className="text-sm font-bold text-white">Full-Stack Real-time Mesh</h4>
            <p className="text-gray-400">Integrated WebSockets keep mission states and telemetry synchronized with SQLite backing.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">SECURITY ENCLAVE</span>
            <h4 className="text-sm font-bold text-white">Zero-Trust Cryptography</h4>
            <p className="text-gray-400">BIP-39 entropy generators, AES-256 password hashing, and role-based access tokens.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "terminal",
    title: "2. AI Prompt Hub & Voice Input",
    icon: Terminal,
    color: "text-blue-400",
    badge: "AI ENGINE",
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-gray-300">
        <p>
          The AETHER Prompt Bar allows instantaneous natural language command dispatching with real-time character-to-token computation.
        </p>
        <ul className="space-y-2.5 pt-1">
          <li className="flex items-start space-x-2">
            <Mic className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Voice-to-Text Dictation:</strong> Click the microphone icon to activate the Web Speech recognition pipeline for hands-free query creation.
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Agent Persona Matrix:</strong> Switch personas (Creative Writer, Debug Expert, Cybersecurity Analyst) to automatically configure system context.
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <Copy className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Copy Response:</strong> Instant clipboard extract with one click on assistant response cards.
            </div>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: "wallet-guide",
    title: "3. Cyber Vault & Key Generation",
    icon: Key,
    color: "text-orange-400",
    badge: "CUSTODY",
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-gray-300">
        <p>
          Manage cryptographic keypairs across EVM, Solana, and Bitcoin native addresses with air-gapped security practices.
        </p>
        <div className="space-y-2 bg-black/50 p-4 rounded-2xl border border-white/5 font-mono">
          <div className="text-cyan-400 font-bold">/// AIR-GAPPED SECURITY PROTOCOL ///</div>
          <div>1. Select 12 or 24-word BIP-39 mnemonic seed configuration.</div>
          <div>2. Derive multi-chain paths (m/44'/60' for EVM, m/44'/501' for SOL).</div>
          <div>3. Write mnemonic words on cold storage media; avoid digital screenshots.</div>
          <div>4. Use Instant Signer to simulate payload broadcasting with Gwei gas bounds.</div>
        </div>
      </div>
    )
  },
  {
    id: "portfolio-guide",
    title: "4. Quantitative AI Portfolio Analytics",
    icon: LineChart,
    color: "text-yellow-400",
    badge: "QUANT",
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-gray-300">
        <p>
          The quantitative engine computes institutional financial metrics in real-time to maximize Sharpe ratios and minimize tail risk.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-yellow-400 font-bold font-mono">Sharpe Ratio</span>
            <p className="text-gray-400 text-[11px] mt-1">Calculates return per unit of total portfolio volatility against risk-free benchmarks.</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-red-400 font-bold font-mono">95% Daily VaR</span>
            <p className="text-gray-400 text-[11px] mt-1">Statistical lower bound of maximum estimated portfolio loss under standard conditions.</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-emerald-400 font-bold font-mono">Auto-Rebalance</span>
            <p className="text-gray-400 text-[11px] mt-1">Autonomous delta-hedging recommendations across multi-asset allocations.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "admin-guide",
    title: "5. Admin Command & RBAC Policies",
    icon: Shield,
    color: "text-red-400",
    badge: "ADMIN",
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-gray-300">
        <p>
          Administrators with Level 5 clearance possess supervisory controls over user directories, knowledge content, live metrics, and cluster flags.
        </p>
        <ul className="space-y-2 pt-1">
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>RBAC Roles:</strong> User (Operative), Security Auditor (Read/Log), Root Admin (Full Override).</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Content Repository:</strong> Create, publish, or purge prompt templates and enterprise whitepapers.</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>System Telemetry:</strong> Monitor live node memory footprint, requests, and WebSocket connection meshes.</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: "shortcuts",
    title: "6. Keyboard Shortcuts & Terminal Commands",
    icon: Zap,
    color: "text-cyan-400",
    badge: "PRODUCTIVITY",
    content: (
      <div className="space-y-3 text-xs font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: "Ctrl + K / ⌘ + K", action: "Trigger Cyber Command Palette" },
            { key: "Esc", action: "Dismiss Open Drawers / Modals" },
            { key: "Enter in Prompt Bar", action: "Dispatch Autonomous Mission" },
            { key: "Click Mic Icon", action: "Toggle Web Speech Dictation" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center">
              <span className="text-gray-300">{item.action}</span>
              <kbd className="px-2 py-1 rounded bg-white/10 text-cyan-300 font-bold text-[11px] border border-white/10">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    )
  },
];

export function UserGuideView() {
  const [selectedSection, setSelectedSection] = useState(guideSections[0].id);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Operational Manual & Knowledge Codex</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          AETHER <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent">Enterprise User Guide</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Comprehensive step-by-step operating manual for the AETHER terminal, cryptography vault, AI analytics engine, and administration console.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation List */}
        <div className="space-y-2">
          {guideSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={cn(
                "w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between border group",
                selectedSection === sec.id
                  ? "bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-white"
                  : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <div className="flex items-center space-x-3">
                <sec.icon className={cn("w-5 h-5", selectedSection === sec.id ? sec.color : "text-gray-500")} />
                <div>
                  <h4 className="text-xs font-bold leading-tight">{sec.title}</h4>
                  <span className="text-[9px] font-mono text-gray-500 uppercase">{sec.badge}</span>
                </div>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform", selectedSection === sec.id && "translate-x-1 text-cyan-400")} />
            </button>
          ))}
        </div>

        {/* Section Detail Panel */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8">
          {guideSections
            .filter((sec) => sec.id === selectedSection)
            .map((sec) => (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-10 h-10 rounded-2xl bg-black/60 flex items-center justify-center border border-white/10", sec.color)}>
                      <sec.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{sec.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {sec.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {sec.content}
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
