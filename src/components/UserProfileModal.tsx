import { useState, useEffect } from "react";
import { 
  X, User, Shield, Key, Wallet, Check, AlertCircle, 
  Sparkles, LogOut, Save, RefreshCw, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getToken, logout } from "../lib/auth";
import { cn } from "../lib/utils";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setWalletAddress(data.walletAddress || "");
        setTwoFactorEnabled(!!data.twoFactorEnabled);
        setAvatar(data.avatar || "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          bio,
          walletAddress,
          twoFactorEnabled,
          avatar
        })
      });
      if (res.ok) {
        setMessage({ text: "Profile updated successfully across neural network", type: "success" });
      } else {
        setMessage({ text: "Failed to update profile", type: "error" });
      }
    } catch (e) {
      setMessage({ text: "Network error occurred", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const regenerateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl glass-panel-glow rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(0,0,0,0.9)]"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img
              src={avatar || profile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=operative`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl bg-black/80 border-2 border-cyan-400/40 p-1"
            />
            <button
              type="button"
              onClick={regenerateAvatar}
              className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 shadow-md transition-all"
              title="Generate New Cyber Avatar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{name || "Cyber Operative"}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                {profile?.role || "Operative"}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{profile?.email || "operative@aether.corp"}</p>
          </div>
        </div>

        {message && (
          <div className={cn(
            "p-3.5 rounded-2xl text-xs font-mono flex items-center space-x-2",
            message.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-red-500/20 text-red-300 border border-red-500/40"
          )}>
            <Check className="w-4 h-4 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono text-gray-400 mb-1">Display Codename / Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block font-mono text-gray-400 mb-1">Operative Bio & Specialization</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-cyan-400 custom-scrollbar"
            />
          </div>

          <div>
            <label className="block font-mono text-gray-400 mb-1">Bound Web3 Custody Address</label>
            <div className="relative">
              <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* 2FA Toggle */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Quantum 2FA Authentication</p>
                <p className="text-[11px] text-gray-400">Enforces hardware token authentication on mission execution</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative p-0.5",
                twoFactorEnabled ? "bg-cyan-500" : "bg-white/20"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full bg-black transition-transform",
                twoFactorEnabled && "translate-x-6 bg-white"
              )} />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center space-x-2 flash-effect"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Updating..." : "Save Neural Profile"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
