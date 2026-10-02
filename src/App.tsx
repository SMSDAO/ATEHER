import { useState, useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { Sidebar, ViewType } from "./components/Sidebar";
import { PromptBar } from "./components/PromptBar";
import { ActionCards } from "./components/ActionCards";
import { ProjectsBoard } from "./components/ProjectsBoard";
import { CommandPalette } from "./components/CommandPalette";
import { AgentSelector } from "./components/AgentSelector";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { PublishingEngineView } from "./components/PublishingEngineView";
import { TeamCollaborationView } from "./components/TeamCollaborationView";
import { AIContentGeneratorView } from "./components/AIContentGeneratorView";
import { VCardBuilderView } from "./components/VCardBuilderView";
import { WhatsAppStoreView } from "./components/WhatsAppStoreView";
import { AnalyticsRevenueView } from "./components/AnalyticsRevenueView";
import { PaymentPlansView } from "./components/PaymentPlansView";
import { CyberWalletView } from "./components/CyberWalletView";
import { PortfolioAnalysisView } from "./components/PortfolioAnalysisView";
import { AdminDashboardView } from "./components/AdminDashboardView";
import { UserGuideView } from "./components/UserGuideView";
import { AuthModal } from "./components/AuthModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { Sparkles, Terminal, Wallet, LineChart, Shield, BookOpen, Rocket, Activity, Zap, Send, CreditCard, ShoppingBag, BarChart3, Users } from "lucide-react";
import { cn } from "./lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>("publishing");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [lastExecutedPrompt, setLastExecutedPrompt] = useState<string>("");
  const [assistantResponse, setAssistantResponse] = useState<string>("");
  const [activePersona, setActivePersona] = useState<string>("Debug & Smart Contract Expert");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExecutePrompt = (prompt: string) => {
    setLastExecutedPrompt(prompt);
    
    if (activePersona.includes("Security") || prompt.toLowerCase().includes("security") || prompt.toLowerCase().includes("audit")) {
      setAssistantResponse(
        `[SECURITY SENTINEL REPORT]\nTarget: "${prompt}"\n• Multi-sig threshold verified: 3-of-5 cold keys online.\n• Zero re-entrancy attack surface detected.\n• BIP-39 entropy seed validation passed with 256-bit strength.\n• Recommendation: Maintain air-gapped signature protocol.`
      );
    } else if (activePersona.includes("Debug") || prompt.toLowerCase().includes("code") || prompt.toLowerCase().includes("sol")) {
      setAssistantResponse(
        `[DEBUG & CODE SYNTHESIS]\nTarget: "${prompt}"\n• Analyzed execution loop: 21,420 gas units estimated.\n• Optimized memory allocations and removed redundant state reads.\n• Deployed WebSocket real-time broadcast hook across cluster nodes.\n• Status: Ready for compilation and test suite execution.`
      );
    } else {
      setAssistantResponse(
        `[CREATIVE & TACTICAL STRATEGY]\nTarget: "${prompt}"\n• Formulated enterprise positioning vector for decentralized asset custody.\n• Highlighting quantum-resistant cryptographic derivations and institutional Sharpe ratio modeling.\n• Ready for automated multi-channel dissemination.`
      );
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden cyber-grid">
      {/* Cyber Neon Background Orbs & Flash Layers */}
      <div className="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-cyan-600/20 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/15 blur-[140px] pointer-events-none" />
      <div className="fixed top-[45%] right-[-5%] w-[450px] h-[450px] rounded-full bg-red-600/15 blur-[150px] pointer-events-none" />
      <div className="fixed top-[20%] left-[50%] -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-yellow-500/10 blur-[160px] pointer-events-none" />

      {/* Global Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectView={(v) => setActiveView(v)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth & Profile Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <UserProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />

      {/* Main Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col max-w-7xl mx-auto px-3 sm:px-6 pb-16">
        <TopBar 
          onToggleMenu={() => setSidebarOpen(true)}
          activeView={activeView}
          onSelectView={(v) => setActiveView(v)}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          onSelectView={(v) => setActiveView(v)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Live Ticker Bar */}
        <div className="w-full mt-3 px-4 py-2 glass-panel rounded-xl border border-white/5 flex items-center justify-between overflow-x-auto no-scrollbar text-[11px] font-mono">
          <div className="flex items-center space-x-6 min-w-max">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 radar-dot" />
              <span className="text-gray-400">STACKPOSTS NODE:</span>
              <span className="text-white font-bold">ALL PLATFORMS CONNECTED</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">TWITTER/X:</span>
              <span className="text-cyan-400 font-bold">SYNCED (42k)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">LINKEDIN:</span>
              <span className="text-blue-400 font-bold">LIVE (28k)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">WHATSAPP COMMERCE:</span>
              <span className="text-emerald-400 font-bold">CATALOG ACTIVE</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">AI COPIES:</span>
              <span className="text-yellow-400 font-bold">GPT-4 & GEMINI PRO</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>ENTERPRISE ACTIVE</span>
          </div>
        </div>

        {/* Main Content Area Routing */}
        <main className="flex-1 w-full flex flex-col items-center justify-start pt-6 pb-12">
          <AnimatePresence mode="wait">
            {/* 1. Publishing Studio */}
            {activeView === "publishing" && (
              <motion.div
                key="publishing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <PublishingEngineView />
              </motion.div>
            )}

            {/* 2. Team Collaboration */}
            {activeView === "collaboration" && (
              <motion.div
                key="collaboration"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <TeamCollaborationView />
              </motion.div>
            )}

            {/* 3. AI Copywriter */}
            {activeView === "ai_gen" && (
              <motion.div
                key="ai_gen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <AIContentGeneratorView />
              </motion.div>
            )}

            {/* 4. vCard & NFC */}
            {activeView === "vcard" && (
              <motion.div
                key="vcard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <VCardBuilderView />
              </motion.div>
            )}

            {/* 5. WhatsApp Store */}
            {activeView === "whatsapp" && (
              <motion.div
                key="whatsapp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <WhatsAppStoreView />
              </motion.div>
            )}

            {/* 6. Analytics & Revenue */}
            {activeView === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <AnalyticsRevenueView />
              </motion.div>
            )}

            {/* 7. Payments & Plans */}
            {activeView === "payments" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <PaymentPlansView />
              </motion.div>
            )}

            {/* 8. AI Prompt Terminal Hub */}
            {activeView === "terminal" && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col items-center"
              >
                {/* Hero Header */}
                <div className="text-center mb-6 max-w-3xl">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>NEURAL CYBER PROMPT HUB & REALTIME COLLABORATION</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
                    Construct Autonomous <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-cyan-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      Enterprise Intelligence
                    </span>
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    Voice-enabled prompt engineering, decentralized multi-chain key derivation, institutional portfolio analytics, and live mission orchestration.
                  </p>
                </div>

                {/* Prompt Input & Token Progress */}
                <div className="w-full max-w-3xl mb-6">
                  <PromptBar onExecutePrompt={handleExecutePrompt} />
                </div>

                {/* Quick Action Navigation Pills */}
                <ActionCards onSelectAction={(v) => setActiveView(v)} />

                {/* Agent Persona Selector */}
                <AgentSelector onSelectPersona={(persona) => setActivePersona(persona)} />
                
                {/* Dynamic Assistant Results Display */}
                <ResultsDisplay 
                  lastPrompt={lastExecutedPrompt} 
                  response={assistantResponse} 
                />

                {/* Real-time Missions Board */}
                <div className="w-full max-w-5xl mt-12">
                  <ProjectsBoard />
                </div>
              </motion.div>
            )}

            {/* 9. Cyber Wallet */}
            {activeView === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <CyberWalletView />
              </motion.div>
            )}

            {/* 10. Portfolio Quant */}
            {activeView === "portfolio" && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <PortfolioAnalysisView />
              </motion.div>
            )}

            {/* 11. Admin Command */}
            {activeView === "admin" && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <AdminDashboardView />
              </motion.div>
            )}

            {/* 12. User Guide */}
            {activeView === "guide" && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <UserGuideView />
              </motion.div>
            )}

            {/* 13. Missions */}
            {activeView === "missions" && (
              <motion.div
                key="missions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-5xl mx-auto"
              >
                <ProjectsBoard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
