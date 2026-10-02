import { 
  X, LayoutDashboard, Terminal, Wallet, LineChart, Shield, 
  BookOpen, Rocket, Activity, Zap, User, Lock, Sparkles,
  Send, Users, CreditCard, ShoppingBag, BarChart3, Layers
} from "lucide-react";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import { isAuthenticated } from "../lib/auth";

export type ViewType = 
  | "terminal" 
  | "publishing" 
  | "collaboration" 
  | "ai_gen" 
  | "vcard" 
  | "whatsapp" 
  | "wallet" 
  | "portfolio" 
  | "analytics" 
  | "payments" 
  | "admin" 
  | "guide" 
  | "missions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

const navSections = [
  {
    title: "Stackposts Publishing & Social",
    items: [
      { id: "publishing" as ViewType, label: "Publishing Studio", icon: Send, color: "group-hover:text-cyan-400", activeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/40" },
      { id: "collaboration" as ViewType, label: "Team Approvals", icon: Users, color: "group-hover:text-blue-400", activeColor: "text-blue-400 bg-blue-500/15 border-blue-500/40" },
      { id: "ai_gen" as ViewType, label: "AI Copywriter Engine", icon: Sparkles, color: "group-hover:text-yellow-400", activeColor: "text-yellow-400 bg-yellow-500/15 border-yellow-500/40" },
      { id: "vcard" as ViewType, label: "vCard NFC Pass Builder", icon: CreditCard, color: "group-hover:text-pink-400", activeColor: "text-pink-400 bg-pink-500/15 border-pink-500/40" },
      { id: "whatsapp" as ViewType, label: "WhatsApp Storefront", icon: ShoppingBag, color: "group-hover:text-emerald-400", activeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40" },
      { id: "analytics" as ViewType, label: "Revenue & Analytics", icon: BarChart3, color: "group-hover:text-cyan-400", activeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/40" },
      { id: "payments" as ViewType, label: "Subscription Plans", icon: Zap, color: "group-hover:text-yellow-400", activeColor: "text-yellow-400 bg-yellow-500/15 border-yellow-500/40" },
    ]
  },
  {
    title: "Cyber AI & Asset Custody",
    items: [
      { id: "terminal" as ViewType, label: "AI Terminal Hub", icon: Terminal, color: "group-hover:text-cyan-400", activeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/40" },
      { id: "wallet" as ViewType, label: "Cyber Vault & Keys", icon: Wallet, color: "group-hover:text-orange-400", activeColor: "text-orange-400 bg-orange-500/15 border-orange-500/40" },
      { id: "portfolio" as ViewType, label: "AI Portfolio Quant", icon: LineChart, color: "group-hover:text-yellow-400", activeColor: "text-yellow-400 bg-yellow-500/15 border-yellow-500/40" },
      { id: "missions" as ViewType, label: "Live Missions Board", icon: Rocket, color: "group-hover:text-blue-400", activeColor: "text-blue-400 bg-blue-500/15 border-blue-500/40" },
      { id: "admin" as ViewType, label: "Admin Command", icon: Shield, color: "group-hover:text-red-400", activeColor: "text-red-400 bg-red-500/15 border-red-500/40" },
      { id: "guide" as ViewType, label: "User Guide & Codex", icon: BookOpen, color: "group-hover:text-emerald-400", activeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40" },
    ]
  }
];

export function Sidebar({ 
  isOpen, 
  onClose, 
  activeView, 
  onSelectView, 
  onOpenProfile, 
  onOpenAuth 
}: SidebarProps) {
  const isAuth = isAuthenticated();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="fixed top-0 left-0 w-84 h-full z-50 glass-panel border-l-0 border-t-0 border-b-0 rounded-r-3xl flex flex-col p-6 shadow-[20px_0_60px_rgba(0,0,0,0.8)] border-cyan-500/20"
          >
            {/* Header branding */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-orange-500 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <span className="font-extrabold tracking-widest text-lg text-white">
                    STACKPOSTS<span className="text-cyan-400">.</span>
                  </span>
                  <span className="block text-[9px] font-mono text-cyan-300 uppercase tracking-wider">Enterprise Suite v3.2</span>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Nav sections list */}
            <nav className="flex-1 space-y-5 overflow-y-auto pr-1 custom-scrollbar">
              {navSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-3 font-bold">
                    {sec.title}
                  </div>
                  {sec.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl border transition-all group text-left",
                        activeView === item.id
                          ? item.activeColor
                          : "bg-white/5 border-transparent text-gray-300 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={cn("w-4 h-4 transition-colors", item.color)} />
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      {activeView === item.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 radar-dot" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
            
            {/* Account & Status Footer */}
            <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
              {isAuth ? (
                <button
                  onClick={() => {
                    onOpenProfile();
                    onClose();
                  }}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-cyan-300" />
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Neural Profile</p>
                      <p className="text-[10px] text-gray-400 font-mono">Manage Security & 2FA</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">→</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
