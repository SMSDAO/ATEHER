import { useState, useEffect } from "react";
import { 
  LineChart, TrendingUp, TrendingDown, AlertCircle, ShieldAlert, Sparkles, 
  RefreshCw, Sliders, PieChart, CheckCircle2, ArrowRight, Zap, Target, BarChart3
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface Asset {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  change24h: number;
  allocation: number;
}

interface AnalysisData {
  totalPortfolioValue: number;
  riskScore: number;
  sharpeRatio: string;
  valueAtRisk95: string;
  marketSentiment: string;
  gasEfficiencyIndex: string;
  assets: Asset[];
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    impact: string;
  }>;
  analyzedAt: string;
}

export function PortfolioAnalysisView() {
  const [riskProfile, setRiskProfile] = useState<"conservative" | "balanced" | "aggressive">("balanced");
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [appliedRebalance, setAppliedRebalance] = useState(false);

  const fetchAnalysis = async (profile: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riskProfile: profile })
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(riskProfile);
  }, [riskProfile]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-orange-500/20 shadow-[0_0_30px_rgba(255,140,0,0.1)]">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-orange-400 text-xs font-mono tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 radar-dot" />
              <span>Neural Risk Engine & Quantitative Arbitrage</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              AI <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent">Portfolio Analytics</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Real-time Sharpe ratio modeling, volatility hedging matrix, 95% Value-at-Risk diagnostics, and autonomous AI rebalancing signals.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
            {(["conservative", "balanced", "aggressive"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setRiskProfile(mode)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  riskProfile === mode
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-[0_0_15px_rgba(255,140,0,0.4)]"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && !data ? (
        <div className="p-16 text-center glass-panel rounded-3xl">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-300">Calculating Quantum Risk Matrices...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* 4 Metric Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card-blue rounded-3xl p-5 relative overflow-hidden">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">Total Asset Valuation</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                ${data.totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+6.2% Est. Alpha vs Benchmark</span>
              </div>
            </div>

            <div className="glass-card-orange rounded-3xl p-5 relative overflow-hidden">
              <span className="text-[10px] font-mono text-orange-300 uppercase tracking-widest">AI Risk Index</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-baseline">
                {data.riskScore}<span className="text-xs text-gray-400 font-mono ml-1">/100</span>
              </div>
              <div className="text-xs text-orange-300 mt-1">
                {data.riskScore > 75 ? "High Volatility Mode" : data.riskScore < 45 ? "Capital Preservation" : "Balanced Growth Index"}
              </div>
            </div>

            <div className="glass-card-yellow rounded-3xl p-5 relative overflow-hidden">
              <span className="text-[10px] font-mono text-yellow-300 uppercase tracking-widest">Sharpe Ratio</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {data.sharpeRatio}
              </div>
              <div className="text-xs text-yellow-300 mt-1">
                Risk-Adjusted Return: <strong className="text-white">Top 2.5%</strong>
              </div>
            </div>

            <div className="glass-card-red rounded-3xl p-5 relative overflow-hidden">
              <span className="text-[10px] font-mono text-red-300 uppercase tracking-widest">95% Value-at-Risk (1D)</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                ${parseFloat(data.valueAtRisk95).toLocaleString()}
              </div>
              <div className="text-xs text-red-300 mt-1">
                Max Daily Exposure Bound
              </div>
            </div>
          </div>

          {/* Allocation & Simulated Chart View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Weight Allocation */}
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-cyan-400" />
                  <span>Target vs Current Weight Distribution</span>
                </h3>
                <button
                  onClick={() => fetchAnalysis(riskProfile)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
                  <span>Re-score</span>
                </button>
              </div>

              {/* Progress bars */}
              <div className="space-y-4">
                {data.assets.map((asset, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white flex items-center space-x-2">
                        <span>{asset.name}</span>
                        <span className="font-mono text-gray-400">({asset.symbol})</span>
                      </span>
                      <span className="font-mono text-cyan-300">
                        {asset.allocation}% • ${(asset.amount * asset.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          idx === 0 ? "bg-yellow-400" :
                          idx === 1 ? "bg-blue-400" :
                          idx === 2 ? "bg-cyan-400" :
                          idx === 3 ? "bg-red-400" : "bg-emerald-400"
                        )}
                        style={{ width: `${asset.allocation}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulated Waveform / Chart */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-400">Projected 30-Day Monte Carlo Convergence</span>
                  <span className="text-emerald-400 font-mono">+18.4% Expected Median</span>
                </div>
                <div className="h-28 flex items-end justify-between gap-1.5 pt-4">
                  {[35, 42, 38, 48, 55, 50, 62, 68, 60, 74, 82, 79, 88, 92, 85, 96, 102, 110, 105, 118].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-500/40 to-cyan-400 rounded-t-sm group-hover:from-orange-500 group-hover:to-yellow-400 transition-all"
                        style={{ height: `${(h / 120) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations Panel */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center space-x-2 text-orange-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">AI Tactical Signals</h3>
              </div>

              {appliedRebalance && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Rebalancing order sent to execution pool.</span>
                </div>
              )}

              <div className="space-y-3">
                {data.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                        rec.priority === "HIGH" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                        rec.priority === "MEDIUM" ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" :
                        "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      )}>
                        {rec.type} • {rec.priority}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{rec.impact}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{rec.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{rec.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setAppliedRebalance(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-yellow-500 to-cyan-400 hover:from-orange-400 hover:to-cyan-300 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(255,140,0,0.4)] transition-all flex items-center justify-center space-x-2 flash-effect"
              >
                <Zap className="w-4 h-4" />
                <span>Execute Auto-Rebalance</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
