import { useState, useEffect } from "react";
import { 
  Check, Zap, Shield, Sparkles, CreditCard, DollarSign, 
  ArrowRight, CheckCircle2, Wallet
} from "lucide-react";
import { cn } from "../lib/utils";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string;
  isPopular?: boolean;
}

export function PaymentPlansView() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("plan_pro");
  const [paymentGateway, setPaymentGateway] = useState<"Stripe" | "PayPal" | "Crypto">("Stripe");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/payments/plans");
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, paymentGateway })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Subscribed to plan successfully via ${paymentGateway}! Invoice: ${data.invoice.invoiceNumber}`);
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-yellow-500/20 shadow-[0_0_30px_rgba(255,215,0,0.1)] text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-mono mb-3">
          <CreditCard className="w-3.5 h-3.5" />
          <span>SaaS Tier Subscriptions & Gateways</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Unlock Full <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">Stackposts Enterprise</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto">
          Scale your social media publishing, automated AI content engines, WhatsApp commerce storefronts, and team workflows.
        </p>

        {/* Gateway Selector */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {(["Stripe", "PayPal", "Crypto"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setPaymentGateway(g)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border",
                paymentGateway === g
                  ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                  : "bg-black/50 border-white/10 text-gray-400 hover:text-white"
              )}
            >
              Pay with {g}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p) => {
          let parsedFeatures: string[] = [];
          try {
            parsedFeatures = JSON.parse(p.features || "[]");
          } catch (e) {
            parsedFeatures = ["Multi-Platform Publishing", "AI Content Generator", "Analytics"];
          }

          const isPro = p.id === "plan_pro" || p.isPopular;

          return (
            <div
              key={p.id}
              className={cn(
                "rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 relative transition-all border",
                isPro
                  ? "glass-card-orange shadow-[0_0_30px_rgba(255,140,0,0.2)]"
                  : "glass-panel border-white/10"
              )}
            >
              {isPro && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-500 text-black text-[10px] font-extrabold uppercase tracking-widest">
                  MOST POPULAR
                </span>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Enterprise Stack</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-white">${p.price}</span>
                    <span className="text-xs text-gray-400 font-mono">/mo</span>
                  </div>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-gray-300">
                  {parsedFeatures.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(p.id)}
                disabled={loading}
                className={cn(
                  "w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 flash-effect",
                  isPro
                    ? "bg-gradient-to-r from-orange-500 via-yellow-500 to-cyan-400 text-black shadow-[0_0_20px_rgba(255,140,0,0.4)] hover:from-orange-400 hover:to-cyan-300"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                )}
              >
                <span>Upgrade to {p.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
