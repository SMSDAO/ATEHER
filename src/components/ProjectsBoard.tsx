import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, CheckCircle2, Trash2, Rocket, Plus, Zap, AlertTriangle, Filter } from "lucide-react";
import { useCollaboration } from "../hooks/useCollaboration";
import { cn } from "../lib/utils";

export function ProjectsBoard() {
  const { projects, deleteProject, createProject, isConnected } = useCollaboration();
  const [filter, setFilter] = useState<string>("All");
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("High");

  const filteredProjects = projects.filter((p) => {
    if (filter === "All") return true;
    return p.status === filter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createProject(newTitle);
    setNewTitle("");
    setShowNewModal(false);
  };

  return (
    <div className="w-full text-left space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono tracking-wider uppercase mb-1">
            <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-400 radar-dot" : "bg-red-400")} />
            <span>WebSocket Live Collaboration Mesh • {isConnected ? "CONNECTED" : "OFFLINE"}</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Rocket className="w-6 h-6 text-cyan-400" />
            <span>Team Missions & Objectives</span>
          </h2>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
            {["All", "Active", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-3 py-1 rounded-lg font-mono transition-all",
                  filter === status ? "bg-cyan-500 text-black font-bold" : "text-gray-400 hover:text-white"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center space-x-1.5 flash-effect"
          >
            <Plus className="w-4 h-4" />
            <span>New Mission</span>
          </button>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="w-full p-12 text-center glass-panel rounded-3xl text-gray-400 border border-white/5 space-y-3">
          <Rocket className="w-10 h-10 mx-auto text-cyan-400/40" />
          <p className="text-sm font-medium text-white">No active cyber missions dispatched.</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Use the prompt terminal above or click "New Mission" to distribute an objective across the collaboration cluster.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="glass-panel p-5 rounded-3xl flex flex-col group relative overflow-hidden border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-orange-400 opacity-60" />
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {project.status === "Completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                    <span className={cn(
                      "text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      project.status === "Completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    )}>
                      {project.status}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300"
                    title="Abort Mission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 leading-relaxed">
                  {project.title}
                </h3>
                
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{new Date(project.timestamp || Date.now()).toLocaleTimeString()}</span>
                  </div>
                  <span className="text-cyan-300">ID: {project.id.slice(0, 7)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* New Mission Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md glass-panel-glow p-6 sm:p-7 rounded-3xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Dispatch New Cyber Mission</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Mission Objective</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Zero-Knowledge Rollup proof verifier"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Priority Tier</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
                >
                  <option>Critical (Tier 1)</option>
                  <option>High (Tier 2)</option>
                  <option>Standard (Tier 3)</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  Broadcast Mission
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
