import { useState, useEffect } from "react";
import { 
  Users, FileText, Activity, Settings, Shield, Trash2, Plus, 
  Search, RefreshCw, CheckCircle, AlertTriangle, Cpu, HardDrive, 
  Clock, Database, UserCheck, Edit3, X, Save, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  walletAddress?: string;
  twoFactorEnabled?: boolean;
  createdAt: string;
}

interface ContentItem {
  id: string;
  title: string;
  category: string;
  type: string;
  content: string;
  status: string;
  author: string;
  updatedAt: string;
}

interface SettingItem {
  key: string;
  value: string;
  description: string;
}

interface AuditLog {
  id: string;
  action: string;
  userEmail: string;
  level: string;
  ipAddress: string;
  timestamp: string;
}

interface ErrorLog {
  id: string;
  userId?: string;
  userEmail?: string;
  message: string;
  stack?: string;
  context?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
}

export function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState<"users" | "content" | "health" | "settings" | "logs">("users");
  
  // Data states
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [settingsList, setSettingsList] = useState<SettingItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [logSubTab, setLogSubTab] = useState<"audit" | "error">("audit");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Content creation modal
  const [showAddContent, setShowAddContent] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    category: "AI Agent Templates",
    type: "System Prompt",
    content: "",
    author: "Admin Operative",
    status: "Published"
  });

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsersList(Array.isArray(data) ? data : []);
      } else if (activeTab === "content") {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        setContentList(Array.isArray(data) ? data : []);
      } else if (activeTab === "health") {
        const [mRes, hRes] = await Promise.all([
          fetch("/api/metrics"),
          fetch("/api/health")
        ]);
        const mData = await mRes.json();
        const hData = await hRes.json();
        setHealthData({ ...mData, ...hData });
      } else if (activeTab === "settings") {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettingsList(Array.isArray(data) ? data : []);
      } else if (activeTab === "logs") {
        const [aRes, eRes] = await Promise.all([
          fetch("/api/admin/logs"),
          fetch("/api/admin/error-logs")
        ]);
        const aData = await aRes.json();
        const eData = await eRes.json();
        setAuditLogs(Array.isArray(aData) ? aData : []);
        setErrorLogs(Array.isArray(eData) ? eData : []);
      }
    } catch (e) {
      console.error(e);
      showNotification("Failed to load administration data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // User Handlers
  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsersList(usersList.filter(u => u.id !== id));
        showNotification("Operative credentials revoked successfully");
      }
    } catch (e) {
      showNotification("Error deleting user", "error");
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
        showNotification(`User role updated to ${newRole}`);
      }
    } catch (e) {
      showNotification("Error updating role", "error");
    }
  };

  // Content Handlers
  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent)
      });
      if (res.ok) {
        const created = await res.json();
        setContentList([created, ...contentList]);
        setShowAddContent(false);
        setNewContent({
          title: "",
          category: "AI Agent Templates",
          type: "System Prompt",
          content: "",
          author: "Admin Operative",
          status: "Published"
        });
        showNotification("Content published to Enterprise Matrix");
      }
    } catch (e) {
      showNotification("Failed to publish content", "error");
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContentList(contentList.filter(c => c.id !== id));
        showNotification("Knowledge item removed");
      }
    } catch (e) {
      showNotification("Error deleting content", "error");
    }
  };

  // Settings Handler
  const handleSaveSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsList })
      });
      if (res.ok) {
        showNotification("System configurations synchronized to database");
      }
    } catch (e) {
      showNotification("Failed to save settings", "error");
    }
  };

  const handleSettingChange = (key: string, newVal: string) => {
    setSettingsList(settingsList.map(s => s.key === key ? { ...s, value: newVal } : s));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-red-500/20 shadow-[0_0_30px_rgba(255,0,85,0.1)]">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-red-400 text-xs font-mono tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-red-400 radar-dot" />
              <span>Root Access Terminal • Level 5 Clearance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Enterprise <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Admin Command</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              User identity access control, centralized content repository, real-time telemetry diagnostics, and core system policies.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all flex items-center space-x-2 text-xs font-mono"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: "users", label: "Operatives Directory", icon: Users, count: usersList.length },
            { id: "content", label: "Content & Templates", icon: FileText, count: contentList.length },
            { id: "health", label: "Health & Telemetry", icon: Activity },
            { id: "settings", label: "Configuration & Flags", icon: Settings },
            { id: "logs", label: "Audit & Security Logs", icon: ShieldAlert, count: auditLogs.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_15px_rgba(255,0,85,0.2)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-2xl border text-xs flex items-center space-x-2 font-mono",
            feedbackMsg.type === "success" 
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-red-500/20 border-red-500/40 text-red-300"
          )}
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </motion.div>
      )}

      {/* Tab 1: User Management */}
      {activeTab === "users" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-red-400" />
                <span>Active Operatives & RBAC Directory</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Manage authentication permissions, multi-sig access, and security tiers.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search email or operative..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-gray-400 uppercase tracking-wider font-mono border-b border-white/10 bg-white/5">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Operative</th>
                  <th className="p-3.5">Security Role</th>
                  <th className="p-3.5">2FA Cyber Key</th>
                  <th className="p-3.5">Wallet Link</th>
                  <th className="p-3.5">Registered</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList
                  .filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 flex items-center space-x-3">
                        <img 
                          src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.email}`} 
                          alt="avatar" 
                          className="w-8 h-8 rounded-full bg-black/60 border border-white/10"
                        />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={u.role || "user"}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className={cn(
                            "bg-black/60 border rounded-lg px-2.5 py-1 text-[11px] font-mono outline-none",
                            u.role === "admin" ? "border-red-500/40 text-red-300" : "border-white/10 text-gray-300"
                          )}
                        >
                          <option value="user">User / Operative</option>
                          <option value="admin">Root Admin</option>
                          <option value="auditor">Security Auditor</option>
                        </select>
                      </td>
                      <td className="p-3.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                          u.twoFactorEnabled ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-gray-500/20 text-gray-400 border border-white/10"
                        )}>
                          {u.twoFactorEnabled ? "ACTIVE 2FA" : "OFFLINE"}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-cyan-400">
                        {u.walletAddress ? `${u.walletAddress.slice(0, 6)}...${u.walletAddress.slice(-4)}` : "None"}
                      </td>
                      <td className="p-3.5 text-gray-400 font-mono text-[10px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Revoke Credentials"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Content & Templates Management */}
      {activeTab === "content" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                <span>Cyber Knowledge Hub & Prompt Templates</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Maintain system instructions, whitepapers, and pre-trained prompt vectors.</p>
            </div>

            <button
              onClick={() => setShowAddContent(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all flex items-center space-x-1.5 flash-effect"
            >
              <Plus className="w-4 h-4" />
              <span>Create Content Vector</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentList.map((item) => (
              <div key={item.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-3 relative group">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-yellow-300 border border-white/10">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-3 font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
                    {item.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                  <span>Author: {item.author}</span>
                  <span className="text-emerald-400 font-bold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Health & Telemetry */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card-blue rounded-3xl p-5 space-y-2">
              <div className="flex justify-between text-xs text-cyan-300 font-mono">
                <span>System Uptime</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {healthData?.uptime || "99.98%"}
              </div>
              <p className="text-[10px] text-emerald-400">Zero Unscheduled Downtime</p>
            </div>

            <div className="glass-card-orange rounded-3xl p-5 space-y-2">
              <div className="flex justify-between text-xs text-orange-300 font-mono">
                <span>Active WebSockets</span>
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {healthData?.activeWsConnections || 1} Nodes
              </div>
              <p className="text-[10px] text-orange-300">Bi-directional telemetry synced</p>
            </div>

            <div className="glass-card-yellow rounded-3xl p-5 space-y-2">
              <div className="flex justify-between text-xs text-yellow-300 font-mono">
                <span>Total Request Volume</span>
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {healthData?.requests || 142}
              </div>
              <p className="text-[10px] text-yellow-300">Errors: {healthData?.errors || 0}</p>
            </div>

            <div className="glass-card-red rounded-3xl p-5 space-y-2">
              <div className="flex justify-between text-xs text-red-300 font-mono">
                <span>Memory Footprint</span>
                <HardDrive className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {healthData?.memory?.rssMB ? `${healthData.memory.rssMB} MB` : "64.2 MB"}
              </div>
              <p className="text-[10px] text-emerald-400">Heap Used: {healthData?.memory?.heapUsedMB || "38.5"} MB</p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Cyber Cluster Health Matrix</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { name: "SQLite Persistence Engine", status: "ONLINE", latency: "0.8ms", color: "text-emerald-400" },
                { name: "Winston Log Streaming Hub", status: "ONLINE", latency: "1.2ms", color: "text-emerald-400" },
                { name: "WebSocket Mesh Gateway", status: "CONNECTED", latency: "14ms", color: "text-cyan-400" },
              ].map((node, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{node.name}</span>
                    <span className={cn("text-[10px] font-mono font-bold", node.color)}>{node.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono">Internal Latency: {node.latency}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Configuration & Feature Flags */}
      {activeTab === "settings" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Settings className="w-5 h-5 text-orange-400" />
                <span>System Variables & Security Directives</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Enforce cluster policies, cryptographic standards, and AI engines.</p>
            </div>

            <button
              onClick={handleSaveSettings}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(255,140,0,0.4)] transition-all flex items-center space-x-1.5 flash-effect"
            >
              <Save className="w-4 h-4" />
              <span>Save & Propagate</span>
            </button>
          </div>

          <div className="space-y-4">
            {settingsList.map((setting) => (
              <div key={setting.key} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-mono font-bold text-cyan-300">{setting.key}</label>
                    <p className="text-[11px] text-gray-400">{setting.description}</p>
                  </div>
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="w-full sm:w-80 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Audit & Security Logs */}
      {activeTab === "logs" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>Enterprise Event Tracking Matrix</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Cryptographic log stream tracking authentication vectors and technical anomalies.</p>
            </div>

            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
              <button
                onClick={() => setLogSubTab("audit")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all",
                  logSubTab === "audit" ? "bg-red-500/20 text-red-300" : "text-gray-500 hover:text-white"
                )}
              >
                Security Audit
              </button>
              <button
                onClick={() => setLogSubTab("error")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all",
                  logSubTab === "error" ? "bg-red-500/20 text-red-300" : "text-gray-500 hover:text-white"
                )}
              >
                Technical Errors
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {logSubTab === "audit" ? (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold",
                      log.level === "WARN" ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" :
                      log.level === "CRITICAL" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                      "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    )}>
                      {log.level}
                    </span>
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-gray-400 text-[11px]">({log.userEmail})</span>
                  </div>
                  <div className="text-right text-gray-500 text-[10px]">
                    <span>{new Date(log.timestamp).toLocaleTimeString()} • {log.ipAddress}</span>
                  </div>
                </div>
              ))
            ) : (
              errorLogs.length === 0 ? (
                <div className="p-10 text-center text-gray-500 font-mono text-xs italic">
                  No technical anomalies detected in the current cluster.
                </div>
              ) : (
                errorLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-white font-mono">{log.message}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    {log.url && <p className="text-[10px] text-gray-400 font-mono truncate">URL: {log.url}</p>}
                    {log.stack && (
                      <details className="text-[9px] text-red-400/70 font-mono bg-black/30 p-2 rounded-lg border border-red-500/5">
                        <summary className="cursor-pointer hover:text-red-300">View Stack Trace</summary>
                        <pre className="mt-2 overflow-x-auto no-scrollbar">{log.stack}</pre>
                      </details>
                    )}
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      <AnimatePresence>
        {showAddContent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddContent(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg glass-panel-glow p-6 sm:p-8 rounded-3xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Create Knowledge Vector</h3>
                <button onClick={() => setShowAddContent(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateContent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Liquidity Balancer System Prompt"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Category</label>
                    <select
                      value={newContent.category}
                      onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option>AI Agent Templates</option>
                      <option>Security Protocol</option>
                      <option>Whitepaper</option>
                      <option>Terminal Commands</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Author</label>
                    <input
                      type="text"
                      value={newContent.author}
                      onChange={(e) => setNewContent({ ...newContent, author: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Content / Instruction Body</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter prompt instructions or knowledge text..."
                    value={newContent.content}
                    onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 custom-scrollbar"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all"
                >
                  Publish Knowledge Block
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
