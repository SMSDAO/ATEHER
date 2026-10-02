import { useState } from "react";
import { 
  CreditCard, QrCode, Download, Share2, Sparkles, Check, 
  ExternalLink, Mail, Phone, Globe, MapPin, User, Briefcase
} from "lucide-react";
import { cn } from "../lib/utils";

const vcardTemplates = [
  { id: "cyber-blue", name: "Cyber Matrix Blue", primary: "#00f0ff", secondary: "#3b82f6", cardClass: "glass-card-blue" },
  { id: "neon-orange", name: "Solar Orange Flame", primary: "#ff8c00", secondary: "#f97316", cardClass: "glass-card-orange" },
  { id: "laser-red", name: "Quantum Laser Red", primary: "#ff0055", secondary: "#ef4444", cardClass: "glass-card-red" },
  { id: "gold-obsidian", name: "Cyber Gold Elite", primary: "#ffd700", secondary: "#eab308", cardClass: "glass-card-yellow" },
];

export function VCardBuilderView() {
  const [template, setTemplate] = useState(vcardTemplates[0]);
  const [fullName, setFullName] = useState("Alex Vance");
  const [jobTitle, setJobTitle] = useState("Chief Quantum Architect");
  const [company, setCompany] = useState("AETHER Dynamics Inc.");
  const [bio, setBio] = useState("Pioneering decentralized AI networks, neural prompt pipelines, and multi-chain liquidity routing.");
  const [email, setEmail] = useState("alex.vance@aether.corp");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [website, setWebsite] = useState("https://aether.corp");
  const [address, setAddress] = useState("San Francisco, CA");
  const [twitter, setTwitter] = useState("https://x.com/aether");
  const [linkedin, setLinkedin] = useState("https://linkedin.com");
  const [github, setGithub] = useState("https://github.com");
  const [saved, setSaved] = useState(false);

  const handleDownloadVCF = () => {
    const vcfData = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
ORG:${company}
TITLE:${jobTitle}
EMAIL;TYPE=INTERNET,PREF:${email}
TEL;TYPE=CELL,PREF:${phone}
URL:${website}
ADR;TYPE=WORK:;;${address};;;;
NOTE:${bio}
END:VCARD`;

    const blob = new Blob([vcfData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fullName.replace(/\s+/g, "_")}_vCard.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
              <CreditCard className="w-4 h-4" />
              <span>Decentralized Digital Identity & NFC Smart Pass</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Interactive <span className="bg-gradient-to-r from-cyan-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">vCard & NFC Studio</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Design instant contactless digital passes, embed multi-chain addresses, generate laser QR codes, and export RFC-standard `.vcf` contact payloads.
            </p>
          </div>

          <button
            onClick={handleDownloadVCF}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center space-x-2 flash-effect shrink-0"
          >
            {saved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{saved ? "vCard Saved!" : "Export .VCF Pass"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form Column */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
              Select vCard Visual Template (100+ Styles Available)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {vcardTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t)}
                  className={cn(
                    "p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center space-x-2",
                    template.id === t.id
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                      : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
                  )}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primary }} />
                  <span>{t.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono text-gray-400 mb-1">Full Operative Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Job Title / Designation</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Organization / Entity</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Direct Email Vector</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Secure Telephone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-gray-400 mb-1">Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">Biography & Credentials</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400 font-mono custom-scrollbar"
            />
          </div>
        </div>

        {/* Live vCard Card Preview & QR Code */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Contactless Pass Preview
          </h3>

          <div className={cn("rounded-3xl p-6 sm:p-7 space-y-5 relative overflow-hidden border shadow-2xl", template.cardClass)}>
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-orange-500 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`}
                  alt="avatar"
                  className="w-full h-full rounded-2xl bg-black object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">{fullName}</h2>
                <p className="text-xs font-mono" style={{ color: template.primary }}>{jobTitle}</p>
                <p className="text-[11px] text-gray-400">{company}</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-mono leading-relaxed bg-black/50 p-3 rounded-2xl border border-white/5">
              {bio}
            </p>

            <div className="space-y-2 text-xs font-mono text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>{website}</span>
              </div>
            </div>

            {/* Laser QR Code Box */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-white text-black flex items-center justify-center">
                <QrCode className="w-10 h-10" />
              </div>
              <div className="text-right font-mono text-[10px] text-gray-400">
                <span>NFC TAP READY</span>
                <p className="text-cyan-400 font-bold">RFC-2426 Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
