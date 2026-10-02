import { useState, useEffect } from "react";
import { 
  Users, CheckCircle, XCircle, MessageSquare, AlertTriangle, 
  Send, UserCheck, Shield, ChevronRight, Filter, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface PendingPost {
  id: string;
  platform: string;
  content: string;
  campaign?: string;
  status: string;
  scheduledAt?: string;
  createdAt: string;
}

export function TeamCollaborationView() {
  const [posts, setPosts] = useState<PendingPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "scheduled", approvedBy: "Senior Editor" })
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === id ? { ...p, status: "scheduled" } : p));
        showToast("Post approved and routed to broadcast scheduler!");
      }
    } catch (e) {
      showToast("Approval error");
    }
  };

  const handleRequestChanges = async (id: string) => {
    if (!feedbackText.trim()) return;
    try {
      const res = await fetch(`/api/posts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "changes_requested", approvedBy: "Editor Review" })
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === id ? { ...p, status: "changes_requested" } : p));
        showToast(`Feedback routed: "${feedbackText}"`);
        setSelectedPostId(null);
        setFeedbackText("");
      }
    } catch (e) {
      showToast("Feedback error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === id ? { ...p, status: "rejected" } : p));
        showToast("Post rejected");
      }
    } catch (e) {
      showToast("Error rejecting post");
    }
  };

  const pendingApprovals = posts.filter(p => p.status === "pending_approval" || p.status === "changes_requested");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono tracking-wider uppercase mb-2">
              <Users className="w-4 h-4" />
              <span>Multi-Tenant Workspaces & Review Pipeline</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Team <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Collaboration & Approvals</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Tiered review workflows, editorial comments, role permissions (Super Admin, Manager, Editor, Viewer), and instant broadcast authorization.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl glass-card-blue text-xs font-mono text-center">
            <span className="text-gray-400 block text-[10px]">AWAITING REVIEW</span>
            <span className="text-xl font-bold text-cyan-400">{pendingApprovals.length} Posts</span>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          {toastMsg}
        </div>
      )}

      {/* Approval Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Pending Approvals Queue</span>
            <span className="text-xs text-gray-500 font-normal">Workflow Active</span>
          </h3>

          {pendingApprovals.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl text-gray-400 border border-white/5 space-y-2">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-400/50 mb-2" />
              <p className="text-sm font-bold text-white">All queues cleared!</p>
              <p className="text-xs text-gray-500">No content items are currently waiting for editorial sign-off.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((post) => (
                <div key={post.id} className="glass-panel p-5 rounded-3xl space-y-4 border border-white/5 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-black/60 flex items-center justify-center font-bold text-xs uppercase text-cyan-400 border border-white/10">
                        {post.platform.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white uppercase font-mono">{post.platform} Post</span>
                        <span className="block text-[10px] text-gray-400 font-mono">Campaign: {post.campaign}</span>
                      </div>
                    </div>

                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase",
                      post.status === "pending_approval" ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    )}>
                      {post.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-xs text-gray-200 font-mono bg-black/50 p-3.5 rounded-2xl border border-white/5 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(post.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Post</span>
                      </button>

                      <button
                        onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 text-xs font-bold flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Request Changes</span>
                      </button>

                      <button
                        onClick={() => handleReject(post.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Feedback Drawer */}
                  {selectedPostId === post.id && (
                    <div className="p-3.5 rounded-2xl bg-black/70 border border-yellow-500/30 space-y-2">
                      <label className="text-[11px] font-mono text-yellow-300">Editorial Feedback & Corrections</label>
                      <textarea
                        rows={2}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Specify what copy edits or asset changes are required..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-yellow-400 font-mono"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRequestChanges(post.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-yellow-500 text-black font-bold text-xs"
                        >
                          Send Editorial Notes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Members & Role Permissions */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Workspace Operatives
            </h4>
            <div className="space-y-3">
              {[
                { name: "Alex Vance", role: "Super Admin", email: "alex@aether.corp", avatar: "alex" },
                { name: "Elena Rostova", role: "Manager", email: "elena@aether.corp", avatar: "elena" },
                { name: "Devon Reed", role: "Editor", email: "devon@aether.corp", avatar: "devon" },
                { name: "Clara Chen", role: "Viewer", email: "clara@aether.corp", avatar: "clara" },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member.avatar}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full bg-black/60 border border-white/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{member.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
