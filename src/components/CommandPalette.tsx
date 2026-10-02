import { useState, useEffect, useRef } from "react";
import { 
  Search, Terminal, Wallet, LineChart, Shield, BookOpen, 
  Rocket, Zap, ArrowRight, X, Key, User, Cpu, Send, Users, 
  CreditCard, ShoppingBag, BarChart3, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { ViewType } from "./Sidebar";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView?: (view: ViewType) => void;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
}

export function CommandPalette({ 
  isOpen, 
  onClose, 
  onSelectView, 
  onOpenProfile, 
  onOpenAuth 
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: "view-publishing", label: "Open Publishing Studio & Multi-Channel Queue", icon: Send, group: "Publishing", run: () => onSelectView?.("publishing") },
    { id: "view-collaboration", label: "Open Team Approvals & Review Workflows", icon: Users, group: "Collaboration", run: () => onSelectView?.("collaboration") },
    { id: "view-ai-gen", label: "Open AI Copywriter & Hashtag Generator", icon: Sparkles, group: "AI Engine", run: () => onSelectView?.("ai_gen") },
    { id: "view-vcard", label: "Open vCard & NFC Smart Pass Studio", icon: CreditCard, group: "Identity", run: () => onSelectView?.("vcard") },
    { id: "view-whatsapp", label: "Open WhatsApp Commerce Store & Catalog", icon: ShoppingBag, group: "E-Commerce", run: () => onSelectView?.("whatsapp") },
    { id: "view-analytics", label: "Open Social Analytics & Revenue Intelligence", icon: BarChart3, group: "Analytics", run: () => onSelectView?.("analytics") },
    { id: "view-payments", label: "Open SaaS Plans & Invoices", icon: Zap, group: "Billing", run: () => onSelectView?.("payments") },
    { id: "view-terminal", label: "Open AI Prompt Terminal Hub", icon: Terminal, group: "Navigation", run: () => onSelectView?.("terminal") },
    { id: "view-wallet", label: "Open Cyber Vault & Key Custody", icon: Wallet, group: "Security", run: () => onSelectView?.("wallet") },
    { id: "view-portfolio", label: "Analyze Portfolio Risk & Sharpe Ratio", icon: LineChart, group: "Quantitative", run: () => onSelectView?.("portfolio") },
    { id: "view-admin", label: "Open Admin Command Center", icon: Shield, group: "Admin", run: () => onSelectView?.("admin") },
    { id: "view-missions", label: "Open Realtime Team Mission Board", icon: Rocket, group: "Collaboration", run: () => onSelectView?.("missions") },
    { id: "view-guide", label: "Browse Enterprise Operations Codex", icon: BookOpen, group: "Manual", run: () => onSelectView?.("guide") },
    { id: "act-generate-keys", label: "Derive New BIP-39 Cold Keys", icon: Key, group: "Security", run: () => onSelectView?.("wallet") },
    { id: "act-profile", label: "Manage Neural Profile & 2FA", icon: User, group: "Identity", run: () => onOpenProfile?.() },
    { id: "act-auth", label: "Authenticate / Switch Operative", icon: Zap, group: "Identity", run: () => onOpenAuth?.() },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery("");
    }
  }, [isOpen]);

  const filteredActions = actions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase()) ||
    action.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-xl glass-panel-glow border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            <div className="flex items-center px-5 py-3.5 border-b border-white/10">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a Stackposts command or shortcut..."
                className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder:text-gray-500 font-mono"
              />
              <div className="flex items-center space-x-1.5 shrink-0">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] text-cyan-300 bg-cyan-500/10 rounded-lg border border-cyan-500/20 font-mono">
                  ESC
                </kbd>
                <button
                  onClick={onClose}
                  className="sm:hidden p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-3 custom-scrollbar">
              {filteredActions.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-xs font-mono">
                  No neural vectors matching "{query}"
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.run();
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-cyan-500/15 text-gray-300 hover:text-white transition-all group border border-transparent hover:border-cyan-500/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-black/60 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors">
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors">
                            {action.label}
                          </span>
                          <span className="block text-[10px] font-mono text-gray-500 uppercase">
                            {action.group}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-5 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <div className="flex items-center space-x-4">
                <span>Navigate <kbd className="bg-white/10 px-1.5 py-0.5 rounded ml-1 text-white">↑↓</kbd></span>
                <span>Select <kbd className="bg-white/10 px-1.5 py-0.5 rounded ml-1 text-white">↵</kbd></span>
              </div>
              <div className="text-cyan-400 font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 radar-dot" />
                <span>STACKPOSTS.SYS</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
