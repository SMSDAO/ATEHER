import { 
  Sparkles, MessageSquare, LineChart, Wallet, ShieldAlert, Cpu, Layers, Zap,
  Send, Users, CreditCard, ShoppingBag, BarChart3
} from "lucide-react";
import { cn } from "../lib/utils";
import { ViewType } from "./Sidebar";

interface ActionCardsProps {
  onSelectAction?: (view: ViewType) => void;
}

const actions = [
  { id: "publishing" as ViewType, icon: Send, label: "Publishing Studio", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30", glow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]" },
  { id: "collaboration" as ViewType, icon: Users, label: "Team Approvals", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]" },
  { id: "ai_gen" as ViewType, icon: Sparkles, label: "AI Copywriter", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", glow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]" },
  { id: "vcard" as ViewType, icon: CreditCard, label: "vCard Pass", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/30", glow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]" },
  { id: "whatsapp" as ViewType, icon: ShoppingBag, label: "WhatsApp Store", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", glow: "hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]" },
  { id: "wallet" as ViewType, icon: Wallet, label: "Cyber Vault", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", glow: "hover:shadow-[0_0_20px_rgba(255,140,0,0.3)]" },
  { id: "portfolio" as ViewType, icon: LineChart, label: "AI Quant Risk", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", glow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]" },
  { id: "admin" as ViewType, icon: ShieldAlert, label: "Admin Console", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", glow: "hover:shadow-[0_0_20px_rgba(255,0,85,0.3)]" },
];

export function ActionCards({ onSelectAction }: ActionCardsProps) {
  return (
    <div className="w-full max-w-6xl mx-auto overflow-x-auto pb-4 no-scrollbar">
      <div className="flex items-center justify-center gap-3 min-w-max px-4">
        {actions.map((action, idx) => (
          <button 
            key={idx}
            onClick={() => onSelectAction?.(action.id)}
            className={cn(
              "flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl glass-panel hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-1 border border-white/5",
              action.glow
            )}
          >
            <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110", action.bg)}>
              <action.icon className={cn("w-3.5 h-3.5", action.color)} />
            </div>
            <span className="font-semibold text-xs text-gray-200 group-hover:text-white transition-colors tracking-wide">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
