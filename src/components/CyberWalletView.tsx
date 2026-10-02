import { useState } from "react";
import { 
  Wallet, Key, ShieldCheck, RefreshCw, Copy, Check, Eye, EyeOff, 
  ArrowUpRight, ArrowDownLeft, Zap, Lock, Cpu, QrCode, AlertTriangle, 
  Sparkles, ExternalLink, ChevronRight, Layers, Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface GeneratedWallet {
  network: string;
  address: string;
  privateKey: string;
  mnemonic: string;
  derivationPath: string;
  createdAt: string;
  entropyBits: number;
  securityRating: string;
}

export function CyberWalletView() {
  const [activeTab, setActiveTab] = useState<"wallet" | "generator" | "transactions" | "gas">("wallet");
  const [connectedWallet, setConnectedWallet] = useState<string | null>("0x71C83a92D0b957E12f9B48cD38a9E4D1B0c54e89");
  const [selectedNetwork, setSelectedNetwork] = useState<"ethereum" | "solana" | "bitcoin">("ethereum");
  const [wordCount, setWordCount] = useState<12 | 24>(12);
  const [generatedWallet, setGeneratedWallet] = useState<GeneratedWallet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Send transaction state
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txSuccess, setTxSuccess] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateWallet = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/wallet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network: selectedNetwork, wordCount })
      });
      const data = await res.json();
      setGeneratedWallet(data);
      setShowPrivateKey(false);
      setShowMnemonic(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    setTxSuccess(true);
    setTimeout(() => {
      setTxSuccess(false);
      setRecipient("");
      setAmount("");
    }, 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 radar-dot" />
              <span>Quantum Key Custody & Multi-Chain Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Cyber <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 bg-clip-text text-transparent">Vault & Keys</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Air-gapped entropy generation, hardware & software multi-chain connections, real-time gas diagnostics, and decentralized asset custody.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {connectedWallet ? (
              <div className="flex items-center space-x-3 px-4 py-2.5 rounded-2xl glass-card-blue">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-left font-mono">
                  <p className="text-[10px] text-cyan-300 uppercase tracking-widest">Connected Node</p>
                  <p className="text-xs text-white font-bold">{connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}</p>
                </div>
                <button 
                  onClick={() => setConnectedWallet(null)} 
                  className="text-xs text-red-400 hover:text-red-300 ml-2 border-l border-white/10 pl-2"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConnectedWallet("0x71C83a92D0b957E12f9B48cD38a9E4D1B0c54e89")}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flash-effect"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Cyber Wallet</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: "wallet", label: "Vault Assets", icon: Coins },
            { id: "generator", label: "Key Generator (BIP-39)", icon: Key },
            { id: "transactions", label: "Instant Signer", icon: Zap },
            { id: "gas", label: "Gas & Telemetry", icon: Cpu },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Vault Assets Overview */}
      {activeTab === "wallet" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card-blue rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Total Custodial Balance</span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
                    $142,840<span className="text-cyan-400">.92</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-emerald-400">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">+5.42% (24h)</span>
                    <span className="text-gray-400">≈ 2.0874 BTC / 40.35 ETH</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                  <ShieldCheck className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              {/* Supported Multi-chains */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-gray-400">EVM L1/L2</div>
                  <div className="text-sm font-bold text-white mt-1">$84,210.00</div>
                  <div className="text-[10px] text-cyan-400">Mainnet / Arbitrum</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-gray-400">Solana Network</div>
                  <div className="text-sm font-bold text-white mt-1">$41,390.50</div>
                  <div className="text-[10px] text-orange-400">Fast Finality</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-gray-400">Bitcoin Native</div>
                  <div className="text-sm font-bold text-white mt-1">$17,240.42</div>
                  <div className="text-[10px] text-yellow-400">SegWit / Taproot</div>
                </div>
              </div>
            </div>

            {/* Asset Breakdown List */}
            <div className="glass-panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Holdings Distribution</span>
                <span className="text-xs text-gray-400 font-mono">5 Active Assets</span>
              </h3>

              <div className="space-y-3">
                {[
                  { sym: "BTC", name: "Bitcoin Quantum", bal: "1.45 BTC", val: "$99,209.72", chg: "+3.8%", color: "text-yellow-400", bg: "border-yellow-500/30" },
                  { sym: "ETH", name: "Ethereum Cyber", bal: "14.20 ETH", val: "$50,270.84", chg: "-1.2%", color: "text-blue-400", bg: "border-blue-500/30" },
                  { sym: "SOL", name: "Solana Velocity", bal: "95.00 SOL", val: "$17,328.00", chg: "+8.4%", color: "text-cyan-400", bg: "border-cyan-500/30" },
                  { sym: "AVAX", name: "Avalanche C-Chain", bal: "120.0 AVAX", val: "$4,176.00", chg: "+2.1%", color: "text-red-400", bg: "border-red-500/30" },
                  { sym: "USDC", name: "USD Cyber Stable", bal: "12,500 USDC", val: "$12,500.00", chg: "0.0%", color: "text-emerald-400", bg: "border-emerald-500/30" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-10 h-10 rounded-xl bg-black/60 flex items-center justify-center font-bold text-sm border", item.bg, item.color)}>
                        {item.sym}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{item.bal}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{item.val}</p>
                      <p className={cn("text-xs font-mono", item.chg.startsWith("+") ? "text-emerald-400" : item.chg === "0.0%" ? "text-gray-400" : "text-red-400")}>
                        {item.chg}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Security Rating */}
          <div className="space-y-6">
            <div className="glass-card-orange rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Custody Rating</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">QUANTUM SECURE</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Entropy Health</span>
                  <span className="text-cyan-400 font-mono">256-Bit Ultra</span>
                </div>
                <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-cyan-400 h-full w-[94%]" />
                </div>
              </div>

              <ul className="text-xs space-y-2 text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Hardware Enclave HSM Active</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>BIP-39 Mnemonic Air-Gapped Derivation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-Sig 3-of-5 Protocol Enabled</span>
                </li>
              </ul>

              <button 
                onClick={() => setActiveTab("generator")}
                className="w-full py-2.5 rounded-2xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-semibold text-xs border border-orange-500/40 transition-all flex items-center justify-center space-x-2"
              >
                <Key className="w-4 h-4" />
                <span>Generate New Cold Keys</span>
              </button>
            </div>

            {/* Quick Wallet Connect Providers */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Web3 Providers</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: "MetaMask", badge: "EVM", color: "hover:border-orange-500/40" },
                  { name: "Phantom", badge: "SOL", color: "hover:border-purple-500/40" },
                  { name: "WalletConnect", badge: "Multi", color: "hover:border-blue-500/40" },
                  { name: "Ledger Nano", badge: "HSM", color: "hover:border-cyan-500/40" },
                ].map((prov, idx) => (
                  <button
                    key={idx}
                    onClick={() => setConnectedWallet("0x" + Math.random().toString(16).substring(2, 42))}
                    className={cn(
                      "p-3 rounded-2xl bg-white/5 border border-white/5 text-left transition-all hover:bg-white/10 group flex flex-col justify-between h-20",
                      prov.color
                    )}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{prov.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono">{prov.badge}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-white flex items-center">
                      Connect <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Private Key & Mnemonic Generator */}
      {activeTab === "generator" && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  <span>Private Key & Seed Generator</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cryptographically secure entropy seed generation with BIP-39 word bank derivation and multi-chain path routing.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Network selector */}
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value as any)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="ethereum">Ethereum / EVM (m/44'/60')</option>
                  <option value="solana">Solana (m/44'/501')</option>
                  <option value="bitcoin">Bitcoin Native SegWit (m/84')</option>
                </select>

                {/* Word length */}
                <div className="flex rounded-xl bg-black/60 border border-white/10 p-1 text-xs">
                  <button
                    onClick={() => setWordCount(12)}
                    className={cn("px-2.5 py-1 rounded-lg transition-all", wordCount === 12 ? "bg-cyan-500 text-black font-bold" : "text-gray-400")}
                  >
                    12 Words
                  </button>
                  <button
                    onClick={() => setWordCount(24)}
                    className={cn("px-2.5 py-1 rounded-lg transition-all", wordCount === 24 ? "bg-cyan-500 text-black font-bold" : "text-gray-400")}
                  >
                    24 Words
                  </button>
                </div>

                <button
                  onClick={handleGenerateWallet}
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(255,140,0,0.4)] transition-all flex items-center space-x-1.5 flash-effect"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
                  <span>{isGenerating ? "Deriving..." : "Generate New Keys"}</span>
                </button>
              </div>
            </div>

            {/* Generated Results Panel */}
            {generatedWallet ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-4 border-t border-white/10"
              >
                {/* Warning Banner */}
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>
                    <strong>SECURITY ADVISORY:</strong> Store your recovery seed and private key in an air-gapped cold safe. Never transmit unencrypted keys over public networks.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Public Address */}
                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Public Address ({generatedWallet.network.toUpperCase()})</span>
                      <button
                        onClick={() => copyToClipboard(generatedWallet.address, "addr")}
                        className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                      >
                        {copiedField === "addr" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "addr" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-black/70 rounded-xl font-mono text-xs text-emerald-300 break-all border border-emerald-500/20">
                      {generatedWallet.address}
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                      <span>Derivation: {generatedWallet.derivationPath}</span>
                      <span>Entropy: {generatedWallet.entropyBits} bits</span>
                    </div>
                  </div>

                  {/* Private Key */}
                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-red-400 uppercase tracking-wider">Raw Private Key (Hex)</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                        >
                          {showPrivateKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPrivateKey ? "Hide" : "Reveal"}</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(generatedWallet.privateKey, "pk")}
                          className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 ml-2"
                        >
                          {copiedField === "pk" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === "pk" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-black/70 rounded-xl font-mono text-xs text-red-300 break-all border border-red-500/20">
                      {showPrivateKey ? generatedWallet.privateKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Rating: <span className="text-emerald-400 font-bold">{generatedWallet.securityRating}</span>
                    </div>
                  </div>
                </div>

                {/* Mnemonic Seed Phrase Words */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-yellow-400 uppercase tracking-wider">BIP-39 Secret Recovery Mnemonic ({wordCount} Words)</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowMnemonic(!showMnemonic)}
                        className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                      >
                        {showMnemonic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showMnemonic ? "Hide Words" : "Reveal Words"}</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(generatedWallet.mnemonic, "mnemonic")}
                        className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                      >
                        {copiedField === "mnemonic" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "mnemonic" ? "Copied Mnemonic" : "Copy Mnemonic"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {generatedWallet.mnemonic.split(" ").map((word, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center space-x-2">
                        <span className="text-[10px] text-gray-500 font-mono w-4">{idx + 1}.</span>
                        <span className="text-xs font-mono font-bold text-yellow-300">
                          {showMnemonic ? word : "••••"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-black/20 text-gray-400">
                <Key className="w-10 h-10 mx-auto mb-3 text-cyan-400/50" />
                <p className="text-sm font-medium text-white">No keys active in memory</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Click "Generate New Keys" above to derive a fresh quantum-resistant keypair with zero-knowledge local storage.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Instant Signer & Transfer Simulation */}
      {activeTab === "transactions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Signer Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center space-x-3 text-cyan-400">
              <Zap className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Smart Contract Signer</h3>
            </div>
            <p className="text-xs text-gray-400">
              Simulate gas estimation and dispatch zero-knowledge payload signatures across verified Layer 1 & 2 networks.
            </p>

            {txSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Payload Signed & Broadcast! TxHash: 0x{Math.random().toString(16).substring(2, 34)}</span>
              </div>
            )}

            <form onSubmit={handleSendTx} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Target Recipient / Contract</label>
                <input
                  type="text"
                  required
                  placeholder="0x... or vitalik.eth"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Amount</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.5"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Asset</label>
                  <select className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400">
                    <option>ETH (Ethereum)</option>
                    <option>SOL (Solana)</option>
                    <option>USDC (USD Cyber)</option>
                    <option>BTC (Wrapped / Native)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Estimated Base Gas:</span>
                  <span className="text-cyan-400">21,000 units (18 Gwei)</span>
                </div>
                <div className="flex justify-between">
                  <span>Slippage Tolerance:</span>
                  <span className="text-emerald-400">0.05% (Zero Front-running)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flash-effect"
              >
                Sign & Broadcast On-Chain
              </button>
            </form>
          </div>

          {/* Recent Transmissions History */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>On-Chain Ledger</span>
              <span className="text-xs font-mono text-cyan-400">Live Mempool</span>
            </h3>

            <div className="space-y-3">
              {[
                { type: "IN", asset: "+2.50 ETH", from: "0x89a...2e1", time: "2 mins ago", status: "Confirmed", color: "text-emerald-400" },
                { type: "OUT", asset: "-450 USDC", to: "0x34f...9c4", time: "18 mins ago", status: "Confirmed", color: "text-red-400" },
                { type: "EXEC", asset: "Stake 12.0 SOL", to: "Cyber Pool 01", time: "1 hr ago", status: "Finalized", color: "text-cyan-400" },
                { type: "IN", asset: "+0.15 BTC", from: "Cold Storage #4", time: "3 hrs ago", status: "Confirmed", color: "text-emerald-400" },
              ].map((tx, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-black/60 flex items-center justify-center">
                      {tx.type === "IN" ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{tx.asset}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{tx.from ? `From: ${tx.from}` : `To: ${tx.to}`}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {tx.status}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">{tx.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Gas & Telemetry */}
      {activeTab === "gas" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { network: "Ethereum Mainnet", gwei: "18 Gwei", speed: "Instant (<12s)", cost: "$1.42 Transfer / $4.80 Swap", color: "text-blue-400", border: "border-blue-500/30" },
            { network: "Solana Supercluster", gwei: "0.000005 SOL", speed: "Ultra Fast (400ms)", cost: "< $0.001 per Tx", color: "text-cyan-400", border: "border-cyan-500/30" },
            { network: "Bitcoin Mempool", gwei: "12 sat/vB", speed: "Standard (1 Block)", cost: "$2.10 Native", color: "text-yellow-400", border: "border-yellow-500/30" },
          ].map((item, idx) => (
            <div key={idx} className={cn("glass-panel rounded-3xl p-6 space-y-4 border", item.border)}>
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">{item.network}</h4>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {item.gwei}
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <p>Speed: <span className="text-white font-medium">{item.speed}</span></p>
                <p>Typical Cost: <span className="text-white font-medium">{item.cost}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
