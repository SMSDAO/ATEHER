import { useState, useEffect } from "react";
import { 
  Calendar, Send, Plus, Sparkles, Image, Hash, Clock, CheckCircle2, 
  AlertCircle, Trash2, Eye, MessageSquare, Tag, Layers, Share2, 
  ChevronRight, RefreshCw, X, Check, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface PostItem {
  id: string;
  platform: string;
  content: string;
  mediaUrls?: string;
  firstComment?: string;
  tags?: string;
  campaign?: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
}

const platforms = [
  { id: "twitter", name: "Twitter / X", color: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500/10" },
  { id: "instagram", name: "Instagram", color: "text-pink-400", border: "border-pink-500/40", bg: "bg-pink-500/10" },
  { id: "linkedin", name: "LinkedIn", color: "text-blue-400", border: "border-blue-500/40", bg: "bg-blue-500/10" },
  { id: "tiktok", name: "TikTok", color: "text-orange-400", border: "border-orange-500/40", bg: "bg-orange-500/10" },
];

export function PublishingEngineView() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"composer" | "calendar" | "queue">("composer");
  
  // Post form state
  const [selectedPlatform, setSelectedPlatform] = useState("twitter");
  const [content, setContent] = useState("");
  const [campaign, setCampaign] = useState("Q4 Product Launch");
  const [firstComment, setFirstComment] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [mediaList, setMediaList] = useState<string[]>([
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80"
  ]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          content,
          campaign,
          firstComment,
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString(),
          mediaUrls: mediaList,
          tags: ["#Stackposts", "#CyberAI", "#Web3"]
        })
      });
      if (res.ok) {
        const created = await res.json();
        setPosts([created, ...posts]);
        setContent("");
        setFirstComment("");
        showToast("Post queued & broadcast to social engine!");
        setViewMode("queue");
      }
    } catch (e) {
      showToast("Failed to create post");
    }
  };

  const handleAIWrite = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: content || "Quantum liquidity and multi-chain publishing",
          platform: selectedPlatform,
          tone: "bold"
        })
      });
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
        showToast("AI Generated post synthesized with optimal hashtags!");
      }
    } catch (e) {
      showToast("AI Generator unavailable");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
        showToast("Post removed from schedule");
      }
    } catch (e) {
      showToast("Error deleting post");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 radar-dot" />
              <span>Multi-Platform Content Engine & Queue</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Stackposts <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 bg-clip-text text-transparent">Publishing Studio</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Cross-network auto-scheduling, AI copywriter, spintax variations, first-comment automation, and live multi-platform preview renderers.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 text-xs font-mono">
            {[
              { id: "composer", label: "Post Composer", icon: Send },
              { id: "queue", label: `Queue (${posts.length})`, icon: Layers },
              { id: "calendar", label: "Content Calendar", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={cn(
                  "flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all",
                  viewMode === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mode 1: Composer & Live Preview */}
      {viewMode === "composer" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                Target Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p.id)}
                    className={cn(
                      "p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center space-x-2",
                      selectedPlatform === p.id
                        ? cn(p.bg, p.border, p.color, "shadow-[0_0_15px_rgba(0,240,255,0.2)]")
                        : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono text-gray-400">Post Content & Narrative</label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleAIWrite}
                      disabled={isGeneratingAI}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono flex items-center space-x-1"
                    >
                      <Sparkles className={cn("w-3.5 h-3.5", isGeneratingAI && "animate-spin")} />
                      <span>{isGeneratingAI ? "Synthesizing..." : "🤖 AI Write"}</span>
                    </button>
                    <span className="text-[10px] font-mono text-gray-500">{content.length}/2200</span>
                  </div>
                </div>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What objective or announcement do you want to broadcast across your social matrix?"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white outline-none focus:border-cyan-400 font-mono custom-scrollbar"
                />
              </div>

              {/* Media URL Preview Selector */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Attached Media Assets</label>
                <div className="flex items-center space-x-3">
                  {mediaList.map((img, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                      <img src={img} alt="asset" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setMediaList(mediaList.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMediaList([...mediaList, "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80"])}
                    className="w-16 h-16 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 text-[10px]"
                  >
                    <Plus className="w-4 h-4 mb-0.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Advanced Settings: Campaign, First Comment, Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Campaign Tag</label>
                  <input
                    type="text"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">First Comment Automation</label>
                  <input
                    type="text"
                    placeholder="Auto-post link or extra hashtags..."
                    value={firstComment}
                    onChange={(e) => setFirstComment(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Schedule Broadcast Date</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Dispatch Mode</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="scheduled">Schedule Post</option>
                    <option value="pending_approval">Submit for Team Approval</option>
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Instantly</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center space-x-2 flash-effect"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {status === "scheduled" ? "Schedule Post" : status === "pending_approval" ? "Submit for Approval" : "Commit Post"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live Mock Preview Card */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
              Live Mockup Preview ({selectedPlatform.toUpperCase()})
            </h3>
            
            <div className="glass-card-blue rounded-3xl p-5 space-y-3 relative overflow-hidden border border-cyan-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5">
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=aether" alt="avatar" className="w-full h-full rounded-full bg-black" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-xs text-white">AETHER Enterprise</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">@AetherEnterprise • Just now</span>
                </div>
              </div>

              <p className="text-xs text-gray-200 font-mono leading-relaxed whitespace-pre-line">
                {content || "Your synthesized social post will be formatted and previewed in real-time here..."}
              </p>

              {mediaList.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-white/10 max-h-48">
                  <img src={mediaList[0]} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}

              {firstComment && (
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-[11px] font-mono text-cyan-300">
                  <span className="text-gray-500 mr-1">💬 Auto-Comment:</span>
                  <span>{firstComment}</span>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex justify-between text-xs text-gray-400 font-mono">
                <span>Campaign: {campaign}</span>
                <span className="text-cyan-400 font-bold">{status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Scheduled & Published Queue */}
      {viewMode === "queue" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Multi-Channel Post Queue</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Manage scheduled posts, active approvals, and historical broadcasts.</p>
            </div>
            <button
              onClick={() => setViewMode("composer")}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </button>
          </div>

          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-black/60 flex items-center justify-center font-bold text-xs uppercase border border-white/10 text-cyan-400 shrink-0">
                    {post.platform.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white uppercase font-mono">{post.platform}</span>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase font-mono",
                        post.status === "published" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        post.status === "scheduled" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" :
                        post.status === "pending_approval" ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" :
                        "bg-gray-500/20 text-gray-400"
                      )}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2 font-mono">{post.content}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center text-xs font-mono text-gray-400">
                  <div className="text-right">
                    <p className="text-[10px]">{post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : "Immediate"}</p>
                    <p className="text-[9px] text-gray-500">{post.campaign}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Content Calendar */}
      {viewMode === "calendar" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span>Calendar Grid • October 2026</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">Automated Cron Dispatcher Online</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-gray-400 pt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="p-2 bg-white/5 rounded-xl font-bold">{d}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasPost = day === 1 || day === 4 || day === 8 || day === 14 || day === 22;
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[70px] p-2 rounded-xl bg-black/40 border border-white/5 text-left flex flex-col justify-between transition-all hover:border-cyan-500/30",
                    hasPost && "bg-cyan-500/5 border-cyan-500/20"
                  )}
                >
                  <span className="text-[10px] font-bold text-gray-400">{day}</span>
                  {hasPost && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold truncate">
                      🚀 2 Posts
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
