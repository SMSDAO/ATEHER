import { useState } from "react";
import { 
  Sparkles, BrainCircuit, Hash, Globe, Copy, Check, 
  Send, RefreshCw, Sliders, Zap, MessageSquare, Cpu
} from "lucide-react";
import { cn } from "../lib/utils";

export function AIContentGeneratorView() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gemini-quantum");
  const [tone, setTone] = useState("professional");
  const [platform, setPlatform] = useState("twitter");
  const [length, setLength] = useState("medium");
  const [generatedText, setGeneratedText] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone, platform, length, model })
      });
      const data = await res.json();
      setGeneratedText(data.content || "");
      setHashtags(data.hashtags || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-yellow-500/20 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-yellow-400 text-xs font-mono tracking-wider uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Multi-Model AI Content Synthesis Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              AI <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Content Generator</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Trained models (GPT-4 Turbo, Gemini Pro Quantum, DeepSeek-V3), tone parameters, hashtag generators, and instant multi-platform optimizations.
            </p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl glass-card-yellow text-xs font-mono flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold">Latency: 380ms • 0.001¢/gen</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Model Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-mono text-gray-400 mb-1">AI Engine Core</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400 font-mono"
              >
                <option value="gemini-quantum">Gemini 2.5 Quantum Pro</option>
                <option value="gpt-4-turbo">OpenAI GPT-4 Turbo</option>
                <option value="deepseek-v3">DeepSeek-V3 Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Tone & Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400 font-mono"
              >
                <option value="professional">Professional / Executive</option>
                <option value="bold">Bold & Disruptive</option>
                <option value="witty">Witty & Conversational</option>
                <option value="urgent">High Urgency / Launch</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Platform Target</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400 font-mono"
              >
                <option value="twitter">Twitter / X (280 chars)</option>
                <option value="linkedin">LinkedIn Longform Post</option>
                <option value="instagram">Instagram Reel Caption</option>
                <option value="tiktok">TikTok Hook & Script</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Length Profile</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {["short", "medium", "long"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={cn(
                      "py-1.5 rounded-lg uppercase transition-all",
                      length === l ? "bg-yellow-500 text-black font-bold" : "bg-black/40 text-gray-400 hover:text-white"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input & Output Studio */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">
                Prompt Directive or Topic
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your subject, announcement, or key points..."
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white outline-none focus:border-yellow-400 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all flex items-center space-x-2 flash-effect"
              >
                <Sparkles className={cn("w-4 h-4", loading && "animate-spin")} />
                <span>{loading ? "Generating Neural Copy..." : "Generate AI Copy"}</span>
              </button>
            </div>
          </form>

          {/* Generated Result Output Card */}
          {generatedText && (
            <div className="p-5 rounded-2xl bg-black/60 border border-yellow-500/30 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-yellow-300 font-bold flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Synthesized Output</span>
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white/10 text-gray-300 hover:text-white font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-200 font-mono leading-relaxed whitespace-pre-line">
                {generatedText}
              </p>

              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {hashtags.map((h, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
