import { 
  Menu, Bell, User, LogOut, Search, Wallet, Shield, Zap, Terminal, LineChart, Send, CreditCard, ShoppingBag
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { isAuthenticated } from "../lib/auth";
import { ViewType } from "./Sidebar";

interface TopBarProps {
  onToggleMenu: () => void;
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenCommandPalette: () => void;
}

export function TopBar({ 
  onToggleMenu, 
  activeView, 
  onSelectView, 
  onOpenAuth, 
  onOpenProfile,
  onOpenCommandPalette
}: TopBarProps) {
  const isAuth = isAuthenticated();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="w-full h-[58px] flex items-center justify-between mt-3 px-3 sm:px-5 glass-panel rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] z-40 border-cyan-500/20">
      {/* Left side: Menu trigger & Quick brand */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleMenu}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors focus:outline-none text-gray-300 hover:text-white border border-white/5"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        <div 
          onClick={() => onSelectView("publishing")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-orange-500 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-extrabold tracking-widest text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
              STACKPOSTS
            </span>
            <span className="hidden md:inline-block text-[9px] font-mono tracking-wider bg-gradient-to-r from-cyan-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent uppercase border border-white/10 px-1.5 py-0.2 rounded">
              ENTERPRISE CYBER
            </span>
          </div>
        </div>
      </div>

      {/* Center: Desktop Nav Quick Pills */}
      <div className="hidden xl:flex items-center space-x-1 bg-black/50 p-1 rounded-xl border border-white/5 text-xs font-semibold">
        {[
          { id: "publishing" as ViewType, label: "Publishing", icon: Send },
          { id: "collaboration" as ViewType, label: "Approvals", icon: Shield },
          { id: "vcard" as ViewType, label: "vCard NFC", icon: CreditCard },
          { id: "whatsapp" as ViewType, label: "WhatsApp Store", icon: ShoppingBag },
          { id: "wallet" as ViewType, label: "Cyber Vault", icon: Wallet },
          { id: "portfolio" as ViewType, label: "Portfolio Quant", icon: LineChart },
          { id: "admin" as ViewType, label: "Admin", icon: Shield },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            className={cn(
              "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all",
              activeView === item.id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Right side: Command palette trigger, Notifications, User Auth */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Command Palette Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white transition-all font-mono"
          title="Search Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cmd Palette</span>
          <kbd className="text-[10px] px-1 py-0.2 rounded bg-white/10 text-gray-300">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors relative border border-white/5"
            title="Telemetry & Workflow Alerts"
          >
            <Bell className="w-4 h-4 text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(255,140,0,0.8)] animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 glass-panel-glow rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="font-bold text-white uppercase text-[10px] font-mono text-cyan-400">Stackposts Workflow</span>
                <span className="text-[10px] text-gray-400">2 New</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 space-y-1">
                <p className="font-semibold text-white">Post Approval Requested</p>
                <p className="text-[10px] text-gray-400">Campaign: Q4 Product Launch</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 space-y-1">
                <p className="font-semibold text-white">WhatsApp Order Link Generated</p>
                <p className="text-[10px] text-gray-400">Direct checkout cart ready</p>
              </div>
            </div>
          )}
        </div>
        
        {/* User Auth / Profile */}
        {isAuth ? (
          <button 
            onClick={onOpenProfile}
            title="Open Neural Profile"
            className="p-1 hover:bg-white/10 rounded-xl transition-all flex items-center space-x-2 border border-white/10 px-2"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold text-[10px]">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-white">Operative</span>
          </button>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black rounded-xl shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all flash-effect"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
