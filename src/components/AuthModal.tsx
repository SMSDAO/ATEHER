import { useState } from "react";
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles, Key, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { setToken } from "../lib/auth";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = "login" | "signup" | "reset";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      let endpoint = "";
      let payload: any = { email };

      if (mode === "login") {
        endpoint = "/api/auth/login";
        payload.password = password;
      } else if (mode === "signup") {
        endpoint = "/api/auth/register";
        payload.password = password;
        payload.name = name;
        payload.role = role;
      } else {
        endpoint = "/api/auth/forgot-password";
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Authentication procedure interrupted");
      }

      if (mode === "login" && data.token) {
        setToken(data.token);
        window.location.reload();
      } else if (mode === "signup") {
        setMode("login");
        setSuccessMsg("Account credentials established. You may now authenticate.");
      } else {
        setSuccessMsg(data.message || "Reset instruction routed through security relay.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md glass-panel-glow border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden p-6 sm:p-8"
      >
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
          <Shield className="w-4 h-4" />
          <span>Security Gateway</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === "login" ? "Authenticate Operative" : mode === "signup" ? "Initialize Clearance" : "Reset Cryptographic Access"}
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          {mode === "login" 
            ? "Enter your verified encrypted credentials to access AETHER matrix." 
            : mode === "signup"
            ? "Register new neural operator profile on the enterprise ledger."
            : "Initiate zero-knowledge recovery protocol for your credentials."}
        </p>

        {error && (
          <div className="mb-4 p-3.5 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-200 text-xs font-mono">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === "signup" && (
            <>
              <div>
                <label className="block font-mono text-gray-400 mb-1">Operative Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-400"
                    placeholder="Cipher Vance"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-gray-400 mb-1">Assigned Security Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-cyan-400"
                >
                  <option value="user">Operative (User)</option>
                  <option value="admin">Root Administrator</option>
                  <option value="auditor">Security Auditor</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block font-mono text-gray-400 mb-1">Identity Vector / Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
                placeholder="operative@aether.corp"
              />
            </div>
          </div>

          {mode !== "reset" && (
            <div>
              <label className="block font-mono text-gray-400 mb-1">Passphrase / Hash</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-400"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 transition-all flash-effect"
          >
            {loading 
              ? "Verifying Neural Handshake..." 
              : mode === "login" 
              ? "Authorize Access" 
              : mode === "signup" 
              ? "Initialize Operative Key" 
              : "Send Recovery Link"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 space-y-2">
          {mode === "login" ? (
            <>
              <div>
                Need security clearance?{" "}
                <button onClick={() => setMode("signup")} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Register new operative
                </button>
              </div>
              <div>
                <button onClick={() => setMode("reset")} className="text-gray-500 hover:text-gray-300">
                  Forgot passphrase?
                </button>
              </div>
            </>
          ) : mode === "signup" ? (
            <div>
              Already have verified credentials?{" "}
              <button onClick={() => setMode("login")} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Sign in to terminal
              </button>
            </div>
          ) : (
            <div>
              <button onClick={() => setMode("login")} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Return to sign in
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
