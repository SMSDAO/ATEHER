import { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, DollarSign, Share2, Eye, Heart, 
  Layers, Download, RefreshCw, CheckCircle2, ArrowUpRight
} from "lucide-react";
import { cn } from "../lib/utils";

interface AnalyticsData {
  totalPosts: number;
  totalEngagement: number;
  engagementTrend: string;
  revenueTotal: string;
  platformBreakdown: Array<{ platform: string; share: number; engagement: string }>;
  weeklyActivity: Array<{ day: string; posts: number; impressions: number }>;
}

export function AnalyticsRevenueView() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [aRes, iRes] = await Promise.all([
        fetch("/api/analytics/overview"),
        fetch("/api/payments/invoices")
      ]);
      const aData = await aRes.json();
      const iData = await iRes.json();
      setData(aData);
      setInvoices(Array.isArray(iData) ? iData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>Real-time Omnichannel Social & SaaS Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Engagement & <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent">Revenue Intelligence</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Cross-platform impression velocity, audience growth attribution, automated revenue recognition, and invoice ledger.
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-400 border border-white/10 flex items-center space-x-1.5"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card-blue rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-cyan-300 uppercase">Total Impressions</span>
              <div className="text-3xl font-extrabold text-white">96,200</div>
              <p className="text-xs text-emerald-400 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+24.8% vs last cycle</span>
              </p>
            </div>

            <div className="glass-card-orange rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-orange-300 uppercase">Active Engagements</span>
              <div className="text-3xl font-extrabold text-white">{data.totalEngagement.toLocaleString()}</div>
              <p className="text-xs text-orange-300">Likes, Shares & Clicks</p>
            </div>

            <div className="glass-card-yellow rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-yellow-300 uppercase">SaaS Gross Revenue</span>
              <div className="text-3xl font-extrabold text-white">{data.revenueTotal}</div>
              <p className="text-xs text-yellow-300">Stripe & Crypto Invoices</p>
            </div>

            <div className="glass-card-red rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-red-300 uppercase">Published Vectors</span>
              <div className="text-3xl font-extrabold text-white">{data.totalPosts}</div>
              <p className="text-xs text-red-300">Across 4 Active Networks</p>
            </div>
          </div>

          {/* Charts & Platform Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Activity Bar Visualization */}
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Weekly Impression Trajectory
              </h3>

              <div className="h-44 flex items-end justify-between gap-3 pt-6">
                {data.weeklyActivity.map((w, i) => {
                  const pct = Math.round((w.impressions / 25000) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(w.impressions / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500/40 to-cyan-400 rounded-t-xl transition-all group-hover:from-orange-500 group-hover:to-yellow-400"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-xs font-mono font-bold text-gray-300">{w.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Network Share
              </h3>

              <div className="space-y-4">
                {data.platformBreakdown.map((p, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-bold">{p.platform}</span>
                      <span className="text-cyan-400">{p.engagement} ({p.share}%)</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          idx === 0 ? "bg-cyan-400" : idx === 1 ? "bg-blue-400" : idx === 2 ? "bg-pink-400" : "bg-orange-400"
                        )}
                        style={{ width: `${p.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Recent Billing Invoices & Receipts
            </h3>

            <div className="space-y-2.5">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <div>
                      <span className="font-bold text-white">{inv.invoiceNumber}</span>
                      <span className="text-[10px] text-gray-400 block">{new Date(inv.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-white">${inv.amount.toFixed(2)} {inv.currency}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
