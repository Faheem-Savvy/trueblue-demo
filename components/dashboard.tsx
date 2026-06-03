"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, Plug, Sliders, CreditCard, Bell, Search, ChevronDown,
  Sparkles, CheckCircle2, Copy, Check, Mail, Building2, Eye, EyeOff,
  Shield, ExternalLink, RefreshCw, Loader2, Wand2, Send, AlertCircle,
  Webhook, ArrowRight, X, Activity, Menu, type LucideIcon,
} from "lucide-react";

// ---------- types ----------
type ConnectionStatus = "disconnected" | "connecting" | "connected";
type HcpState = { status: ConnectionStatus; masked?: string; connectedAt?: string };
type OutlookState = { status: ConnectionStatus; email?: string; connectedAt?: string };
type ViewKey = "home" | "connections" | "settings" | "billing";
type Tone = "ok" | "warn" | "default";

// ---------- design tokens ----------
const NAVY = "#1E4F7A";
const NAVY_DEEP = "#163C5E";
const BLUE = "#2E6FA3";

// ---------- mock data ----------
const tenant = { company: "TruBlue of North Idaho", owner: "Brian Espinoza" };

const automationEvents: Array<{ t: string; who: string; meta: string; at: string; c: string; icon: LucideIcon }> = [
  { t: "Estimate drafted", who: "for Sarah Mitchell · Bathroom tile repair", meta: "AI confidence 92% · sent for review", at: "12 min ago", c: NAVY,    icon: Sparkles },
  { t: "Reminder email sent", who: "to Henderson Family", meta: "Invoice INV-7721 · $1,840 · 16d overdue", at: "1 hr ago", c: "#ef4444", icon: Mail },
  { t: "Tech assignment recommended", who: "Mike Reyes for Job JOB-1192", meta: "Match 94% · awaiting your approval", at: "1 hr ago", c: "#8b5cf6", icon: Wand2 },
  { t: "Estimate sent", who: "to Patricia Hayes", meta: "$620 · via Outlook", at: "2 hr ago", c: "#10b981", icon: Send },
  { t: "Webhook received", who: "estimate.completed from HousecallPro", meta: "Job ID 4f21-c8 · processed in 184ms", at: "2 hr ago", c: "#64748b", icon: Webhook },
  { t: "Analyzing media", who: "9 photos for Marcus Chen · Deck staining", meta: "AI vision in progress…", at: "2 hr ago", c: "#f59e0b", icon: Activity },
];

// ---------- helpers ----------
const avatarColors = ["bg-indigo-500","bg-rose-500","bg-amber-500","bg-emerald-500","bg-sky-500","bg-fuchsia-500","bg-teal-500","bg-orange-500"];
function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const init = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cls = avatarColors[hash % avatarColors.length];
  const sz = size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-[11px]";
  return <div className={`${cls} ${sz} rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white`}>{init}</div>;
}

function StatusDot({ color = "bg-emerald-500", pulse = true }: { color?: string; pulse?: boolean }) {
  return (
    <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`}>
      {pulse && <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${color} animate-ping`}/>}
    </span>
  );
}

// ---------- Sidebar ----------
const NAV: Array<{ key: ViewKey; label: string; icon: LucideIcon; badgeWarn?: boolean }> = [
  { key: "home",        label: "Home",         icon: LayoutDashboard },
  { key: "connections", label: "Connections",  icon: Plug, badgeWarn: true },
  { key: "settings",    label: "Settings",     icon: Sliders },
  { key: "billing",     label: "Billing",      icon: CreditCard },
];

function Sidebar({ view, setView, allConnected, mobileOpen, closeMobile }: {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  allConnected: boolean;
  mobileOpen: boolean;
  closeMobile: () => void;
}) {
  return (
    <aside className={`fixed top-0 left-0 z-40 h-full w-56 border-r border-slate-200 bg-white flex flex-col transition-transform duration-200 sm:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}`}>
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-slate-200">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})` }}>
          <Sparkles className="h-4 w-4 text-white"/>
        </div>
        <div className="leading-tight flex-1">
          <div className="text-[15px] font-bold text-slate-900 tracking-tight font-serif italic">Bluepoint</div>
          <div className="text-[10px] text-slate-500 -mt-0.5 tracking-wider uppercase">Estimate OS</div>
        </div>
        <button onClick={closeMobile} className="sm:hidden h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
          <X className="h-4 w-4 text-slate-500"/>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(n => {
          const Icon = n.icon;
          const active = view === n.key;
          const showWarn = n.badgeWarn && !allConnected;
          return (
            <button key={n.key} onClick={() => { setView(n.key); closeMobile(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              style={active ? { background: NAVY } : {}}>
              <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`}/>
              <span className="flex-1 text-left">{n.label}</span>
              {showWarn && (
                <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-amber-500"}`}/>
              )}
            </button>
          );
        })}
      </nav>

      <div className="m-3 p-3 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <StatusDot color={allConnected ? "bg-emerald-500" : "bg-amber-500"}/>
          <div className="text-[11px] font-semibold text-slate-700">{allConnected ? "All systems live" : "Setup incomplete"}</div>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">{allConnected ? "Automation is running" : "Finish connections to start"}</div>
      </div>
    </aside>
  );
}

// ---------- Topbar ----------
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur px-4 sm:px-6 flex items-center gap-3 sm:gap-4 sticky top-0 z-20">
      <button onClick={onMenuClick} className="sm:hidden h-9 w-9 -ml-1 rounded-lg hover:bg-slate-100 flex items-center justify-center shrink-0">
        <Menu className="h-5 w-5 text-slate-700"/>
      </button>
      <div className="hidden sm:block flex-1 max-w-md relative">
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
               placeholder="Search activity, settings…"/>
      </div>
      <div className="flex-1 sm:hidden"/>
      <button className="relative h-9 w-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center shrink-0">
        <Bell className="h-4 w-4 text-slate-600"/>
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"/>
      </button>
      <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 sm:border-l sm:border-slate-200 shrink-0">
        <Avatar name={tenant.owner} size="lg"/>
        <div className="hidden lg:block leading-tight">
          <div className="text-sm font-semibold text-slate-900">{tenant.owner}</div>
          <div className="text-[11px] text-slate-500">{tenant.company}</div>
        </div>
        <ChevronDown className="hidden lg:block h-4 w-4 text-slate-400"/>
      </div>
    </header>
  );
}

// ---------- HOME ----------
function HomeView({ hcp, outlook, goConnections }: { hcp: HcpState; outlook: OutlookState; goConnections: () => void }) {
  const ready = hcp.status === "connected" && outlook.status === "connected";
  return (
    <div className="space-y-6 animate-[fade_300ms_ease-out]">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: BLUE }}>Welcome back</div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 font-serif">Hi {tenant.owner.split(" ")[0]}</h1>
          <p className="text-sm text-slate-500 mt-1">Your automation status and recent activity. All job and customer data lives in HousecallPro.</p>
        </div>
      </div>

      {!ready && (
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600"/>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">Finish setup to start the automation</div>
              <div className="text-[13px] text-slate-600 mt-0.5">Connect HousecallPro and Outlook to let Bluepoint start drafting estimates and sending reminders.</div>
            </div>
          </div>
          <button onClick={goConnections} className="self-stretch sm:self-auto shrink-0 px-4 py-2 text-sm font-semibold text-white rounded-lg flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap" style={{ background: NAVY }}>
            Go to Connections <ArrowRight className="h-3.5 w-3.5"/>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile label="Connections" value={`${[hcp,outlook].filter(c=>c.status==="connected").length} of 2`} desc="HousecallPro & Outlook" tone={ready ? "ok" : "warn"}/>
        <StatTile label="Automation events today" value="247" desc="webhooks processed · 0 errors" tone="ok"/>
        <StatTile label="AI estimates this month" value="94" desc="drafted automatically" tone="default"/>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Automation activity</div>
            <div className="text-[12px] text-slate-500">What Bluepoint did — open HousecallPro to view the underlying jobs.</div>
          </div>
          <a className="text-[12px] font-semibold inline-flex items-center gap-1 hover:underline" style={{ color: BLUE }} href="#">Open in HousecallPro <ExternalLink className="h-3 w-3"/></a>
        </div>
        <div className="divide-y divide-slate-100">
          {automationEvents.map((e, i) => {
            const I = e.icon;
            return (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${e.c}15` }}>
                  <I className="h-4 w-4" style={{ color: e.c }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-900"><span className="font-semibold">{e.t}</span> <span className="text-slate-500">{e.who}</span></div>
                  <div className="text-[12px] text-slate-500 mt-0.5">{e.meta}</div>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0 pt-1">{e.at}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, desc, tone }: { label: string; value: string; desc: string; tone: Tone }) {
  const tones: Record<Tone, { bar: string; chip: string }> = {
    ok:      { bar: "linear-gradient(90deg, #10b981, #34d399)", chip: "bg-emerald-50 text-emerald-700" },
    warn:    { bar: "linear-gradient(90deg, #f59e0b, #fbbf24)", chip: "bg-amber-50 text-amber-700" },
    default: { bar: `linear-gradient(90deg, ${NAVY}, ${BLUE})`, chip: "bg-slate-50 text-slate-700" },
  };
  const t = tones[tone];
  return (
    <div className="relative bg-white rounded-xl border border-slate-200 p-5 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: t.bar }}/>
      <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900" style={{ fontFeatureSettings: "'tnum'" }}>{value}</div>
      <div className="text-[12px] text-slate-500 mt-1">{desc}</div>
    </div>
  );
}

// ---------- CONNECTIONS ----------
function ConnectionsView({ hcp, setHcp, outlook, setOutlook }: {
  hcp: HcpState; setHcp: (s: HcpState) => void;
  outlook: OutlookState; setOutlook: (s: OutlookState) => void;
}) {
  return (
    <div className="space-y-6 animate-[fade_300ms_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">Connections</h1>
        <p className="text-sm text-slate-500 mt-1">Connect the services Bluepoint will use on your behalf. Your credentials are encrypted and never exposed to your browser after setup.</p>
      </div>

      <HCPConnectionCard hcp={hcp} setHcp={setHcp}/>
      <OutlookConnectionCard outlook={outlook} setOutlook={setOutlook}/>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ManagedCard name="Google Gemini" desc="AI vision and estimate generation" icon={Sparkles} grad="from-violet-500 to-fuchsia-500"/>
        <ManagedCard name="Stripe"        desc="Subscription billing and payments" icon={CreditCard} grad="from-indigo-500 to-violet-600"/>
      </div>
    </div>
  );
}

function HCPConnectionCard({ hcp, setHcp }: { hcp: HcpState; setHcp: (s: HcpState) => void }) {
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = "https://api.bluepoint.app/webhooks/trublue-id-7f3a";

  const connect = () => {
    if (!token.trim()) return;
    setHcp({ status: "connecting" });
    setTimeout(() => {
      setHcp({ status: "connected", masked: token.replace(/.(?=.{4})/g, "•").slice(0, 18), connectedAt: "just now" });
    }, 1400);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-white"/>
          </div>
          <div>
            <div className="font-semibold text-slate-900 inline-flex items-center gap-2">
              HousecallPro
              {hcp.status === "connected" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  <StatusDot/> CONNECTED
                </span>
              )}
              {hcp.status === "connecting" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                  <Loader2 className="h-2.5 w-2.5 animate-spin"/> CONNECTING…
                </span>
              )}
              {hcp.status === "disconnected" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">NOT CONNECTED</span>
              )}
            </div>
            <div className="text-[12px] text-slate-500 mt-0.5">Where your jobs, estimates, and invoices live. Bluepoint reads jobs and writes estimates here.</div>
          </div>
        </div>
        {hcp.status === "connected" && (
          <button onClick={() => setHcp({ status: "disconnected" })} className="text-[12px] font-medium text-slate-500 hover:text-rose-600 inline-flex items-center gap-1">
            Disconnect
          </button>
        )}
      </div>

      {hcp.status !== "connected" && (
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-5 w-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center" style={{ background: NAVY }}>1</span>
              <div className="text-[13px] font-semibold text-slate-900">Add this webhook in HousecallPro</div>
            </div>
            <p className="text-[12px] text-slate-500 pl-7 mb-3">
              In HousecallPro, go to <span className="font-semibold text-slate-700">Settings → API &amp; Webhooks → New Webhook</span>, paste the URL below, and subscribe to the two events shown. Bluepoint listens here to start each automation.
            </p>

            <div className="pl-7">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Webhook URL</div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <code className="text-[12px] text-slate-700 font-mono flex-1 truncate">{url}</code>
                <button onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                        className="text-slate-500 hover:text-slate-900 shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold">
                  {copied ? <><Check className="h-3.5 w-3.5 text-emerald-600"/> Copied</> : <><Copy className="h-3.5 w-3.5"/> Copy</>}
                </button>
              </div>

              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mt-4 mb-1.5">Subscribe to these events</div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2.5 bg-sky-50/60 border border-sky-100 rounded-lg px-3 py-2">
                  <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white border border-sky-200 text-sky-800 shrink-0">estimate.completed</code>
                  <span className="text-[12px] text-slate-600">Fires when an estimate is marked complete in HCP — triggers AI estimate drafting.</span>
                </div>
                <div className="flex items-start gap-2.5 bg-sky-50/60 border border-sky-100 rounded-lg px-3 py-2">
                  <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white border border-sky-200 text-sky-800 shrink-0">estimate.option.approval_status_changed</code>
                  <span className="text-[12px] text-slate-600">Fires when a customer approves or declines an estimate — triggers tech assignment.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100"/>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-5 w-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center" style={{ background: NAVY }}>2</span>
              <div className="text-[13px] font-semibold text-slate-900">Paste your HousecallPro API token</div>
            </div>
            <p className="text-[12px] text-slate-500 pl-7 mb-3">
              Generate this in HousecallPro under <span className="font-semibold text-slate-700">Settings → API &amp; Webhooks → Generate Token</span>. <a href="#" className="font-semibold inline-flex items-center gap-0.5" style={{ color: BLUE }}>Where do I find this? <ExternalLink className="h-3 w-3"/></a>
            </p>
            <div className="pl-7 flex items-stretch gap-2">
              <div className="flex-1 relative">
                <input value={token} onChange={e => setToken(e.target.value)} type={show ? "text" : "password"}
                       placeholder="hcp_live_••••••••••••••••••••"
                       disabled={hcp.status === "connecting"}
                       className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-sm font-mono placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 disabled:bg-slate-50"/>
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                  {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
              <button onClick={connect} disabled={hcp.status === "connecting" || !token.trim()}
                      className="px-4 py-2.5 text-sm font-semibold text-white rounded-lg inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      style={{ background: NAVY }}>
                {hcp.status === "connecting" ? <><Loader2 className="h-4 w-4 animate-spin"/> Connecting…</> : <>Connect <ArrowRight className="h-4 w-4"/></>}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[12px] text-slate-500 border-t border-slate-100 pt-4">
            <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: BLUE }}/>
            <span>Your token is encrypted at rest and never exposed to the browser after setup. You can revoke access from HousecallPro at any time.</span>
          </div>
        </div>
      )}

      {hcp.status === "connected" && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">API Token</div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <code className="text-[12px] text-slate-700 font-mono flex-1 truncate">{hcp.masked}</code>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">ENCRYPTED</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Webhook URL <span className="text-slate-400 normal-case font-normal">— configured in your HousecallPro account</span></div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <code className="text-[12px] text-slate-700 font-mono flex-1 truncate">{url}</code>
                <button onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                        className="text-slate-500 hover:text-slate-900 shrink-0">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600"/> : <Copy className="h-3.5 w-3.5"/>}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Listening for:</span>
                <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">estimate.completed</code>
                <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">estimate.option.approval_status_changed</code>
              </div>
            </div>
            <button className="text-[12px] font-semibold inline-flex items-center gap-1.5" style={{ color: BLUE }}>
              <RefreshCw className="h-3 w-3"/> Test connection
            </button>
          </div>
          <div className="space-y-3">
            <Stat small label="Connected" value={hcp.connectedAt || "just now"}/>
            <Stat small label="Last event" value="2 min ago"/>
            <Stat small label="Events today" value="247"/>
          </div>
        </div>
      )}
    </div>
  );
}

function OutlookConnectionCard({ outlook, setOutlook }: { outlook: OutlookState; setOutlook: (s: OutlookState) => void }) {
  const connect = () => {
    setOutlook({ status: "connecting" });
    setTimeout(() => {
      setOutlook({ status: "connected", email: "brian@trublueally.com", connectedAt: "just now" });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Mail className="h-5 w-5 text-white"/>
          </div>
          <div>
            <div className="font-semibold text-slate-900 inline-flex items-center gap-2">
              Microsoft Outlook
              {outlook.status === "connected" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  <StatusDot/> CONNECTED
                </span>
              )}
              {outlook.status === "connecting" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                  <Loader2 className="h-2.5 w-2.5 animate-spin"/> AUTHORIZING…
                </span>
              )}
              {outlook.status === "disconnected" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">NOT CONNECTED</span>
              )}
            </div>
            <div className="text-[12px] text-slate-500 mt-0.5">Used for sending estimate reviews, tech notifications, and invoice reminders.</div>
          </div>
        </div>
        {outlook.status === "connected" && (
          <button onClick={() => setOutlook({ status: "disconnected" })} className="text-[12px] font-medium text-slate-500 hover:text-rose-600 inline-flex items-center gap-1">
            Disconnect
          </button>
        )}
      </div>

      {outlook.status !== "connected" && (
        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="text-[13px] text-slate-600 sm:max-w-md">
            Sign in once with your Microsoft account. We use OAuth — your password never touches Bluepoint, and you can revoke access from Microsoft at any time.
          </div>
          <button onClick={connect} disabled={outlook.status === "connecting"}
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2.5 shadow-sm border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-60 w-full sm:w-auto">
            {outlook.status === "connecting" ? (
              <><Loader2 className="h-4 w-4 animate-spin text-slate-500"/> Redirecting to Microsoft…</>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden>
                  <rect width="10" height="10" x="1" y="1" fill="#F25022"/>
                  <rect width="10" height="10" x="12" y="1" fill="#7FBA00"/>
                  <rect width="10" height="10" x="1" y="12" fill="#00A4EF"/>
                  <rect width="10" height="10" x="12" y="12" fill="#FFB900"/>
                </svg>
                <span className="text-slate-800">Sign in with Microsoft</span>
              </>
            )}
          </button>
        </div>
      )}

      {outlook.status === "connected" && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Signed in as</div>
              <div className="inline-flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden>
                  <rect width="10" height="10" x="1" y="1" fill="#F25022"/>
                  <rect width="10" height="10" x="12" y="1" fill="#7FBA00"/>
                  <rect width="10" height="10" x="1" y="12" fill="#00A4EF"/>
                  <rect width="10" height="10" x="12" y="12" fill="#FFB900"/>
                </svg>
                <span className="text-sm text-slate-700 font-medium">{outlook.email}</span>
              </div>
            </div>
            <div className="text-[12px] text-slate-500 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" style={{ color: BLUE }}/>
              Permissions granted: <span className="font-semibold text-slate-700">Send mail on your behalf</span>
            </div>
          </div>
          <div className="space-y-3">
            <Stat small label="Connected" value={outlook.connectedAt || "just now"}/>
            <Stat small label="Emails sent today" value="38"/>
          </div>
        </div>
      )}
    </div>
  );
}

function ManagedCard({ name, desc, icon: I, grad }: { name: string; desc: string; icon: LucideIcon; grad: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center shadow-sm`}><I className="h-5 w-5 text-white"/></div>
        <div>
          <div className="font-semibold text-slate-900 text-[14px]">{name}</div>
          <div className="text-[11px] text-slate-500">{desc}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
          <Shield className="h-3 w-3" style={{ color: BLUE }}/>Managed by Bluepoint
        </span>
        <StatusDot/>
      </div>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className={`${small ? "text-[10px]" : "text-[11px]"} uppercase tracking-wider font-semibold text-slate-500`}>{label}</div>
      <div className={`${small ? "text-sm" : "text-base"} font-semibold text-slate-900 mt-0.5`}>{value}</div>
    </div>
  );
}

// ---------- SETTINGS ----------
function SettingsView() {
  const inputCls = "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm";
  return (
    <div className="space-y-6 animate-[fade_300ms_ease-out] max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Values that vary per business. The AI and automation flows read these at runtime.</p>
      </div>

      <Section title="Estimate generation" note="Used by the AI when drafting line items and pricing.">
        <FieldRow label="Default labor rate" hint="Per-hour rate the AI uses to estimate labor for each line item.">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-sm">$</span>
            <input defaultValue="35" className={`${inputCls} w-20 text-right`}/>
            <span className="text-slate-500 text-sm">/ hr</span>
          </div>
        </FieldRow>
        <FieldRow label="Materials markup" hint="Standard markup applied on top of looked-up material costs.">
          <div className="flex items-center gap-1.5">
            <input defaultValue="20" className={`${inputCls} w-20 text-right`}/>
            <span className="text-slate-500 text-sm">%</span>
          </div>
        </FieldRow>
        <FieldRow label="Default ZIP code" hint="Used for material price lookups when the customer's ZIP isn't on the job.">
          <input defaultValue="83814" className={`${inputCls} w-28 font-mono`}/>
        </FieldRow>
        <FieldRow label="Minimum estimate floor" hint="Estimates below this amount get flagged for your review even when confidence is high.">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-sm">$</span>
            <input defaultValue="150" className={`${inputCls} w-24 text-right`}/>
          </div>
        </FieldRow>
      </Section>

      <Section title="Timing & escalations" note="How long the automation waits at each step before moving on.">
        <FieldRow label="Media upload grace period" hint="If photos / videos aren't in HCP when an estimate is marked complete, wait this long before pinging the estimator.">
          <div className="flex items-center gap-1.5">
            <input defaultValue="30" className={`${inputCls} w-20 text-right`}/>
            <span className="text-slate-500 text-sm">minutes</span>
          </div>
        </FieldRow>
        <FieldRow label="Media re-check window" hint="After the reminder, wait this long, then re-check HCP for media one more time.">
          <div className="flex items-center gap-1.5">
            <input defaultValue="2" className={`${inputCls} w-20 text-right`}/>
            <span className="text-slate-500 text-sm">hours</span>
          </div>
        </FieldRow>
        <FieldRow label="Tech approval timeout" hint="How long to wait for you to approve a tech assignment before sending the fallback notification.">
          <div className="flex items-center gap-1.5">
            <input defaultValue="24" className={`${inputCls} w-20 text-right`}/>
            <span className="text-slate-500 text-sm">hours</span>
          </div>
        </FieldRow>
        <FieldRow label="Invoice reminders cadence" hint="How often to remind customers about past-due invoices.">
          <select className={inputCls}>
            <option>Every 7 days</option><option>Every 14 days</option><option>Every 30 days</option>
          </select>
        </FieldRow>
      </Section>

      <Section title="Notifications">
        <FieldRow label="Estimator email" hint="Where to send 'estimate ready for review' and 'media missing' notifications.">
          <input defaultValue="brian@trublueally.com" className={`${inputCls} w-72`}/>
        </FieldRow>
        <FieldRow label="Manager email (CC)" hint="Optional. Receives a copy of every estimate sent to a customer.">
          <input placeholder="optional" className={`${inputCls} w-72`}/>
        </FieldRow>
      </Section>

      <Section title="Workspace">
        <FieldRow label="Company name"><input defaultValue={tenant.company} className={`${inputCls} w-72`}/></FieldRow>
        <FieldRow label="Time zone"><input defaultValue="America/Boise (Mountain)" className={`${inputCls} w-72`}/></FieldRow>
      </Section>
    </div>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-6 pt-5 pb-3 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {note && <div className="text-[12px] text-slate-500 mt-0.5">{note}</div>}
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {hint && <div className="text-[12px] text-slate-500 mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ---------- BILLING ----------
function BillingView() {
  const plans: Array<{ tier: string; price: number; ests: string | number; highlights: string[]; current?: boolean }> = [
    { tier: "Starter",    price: 59,  ests: 50,         highlights: ["AI estimate drafting", "Outlook email", "Email support"] },
    { tier: "Pro",        price: 149, ests: 200,        highlights: ["Everything in Starter", "Tech assignments", "Invoice reminders", "Priority support"], current: true },
    { tier: "Enterprise", price: 399, ests: "Unlimited",highlights: ["Everything in Pro", "Custom SLA", "Dedicated success manager", "SSO & audit logs"] },
  ];
  return (
    <div className="space-y-6 animate-[fade_300ms_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">Billing</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your subscription. Powered by Stripe.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}>
          <div className="md:col-span-2 text-white">
            <div className="text-[11px] uppercase tracking-wider font-semibold opacity-70">Current plan</div>
            <div className="mt-1 flex items-baseline gap-3">
              <h2 className="text-3xl font-bold font-serif">Pro</h2>
              <div className="text-lg opacity-80" style={{ fontFeatureSettings: "'tnum'" }}>$149<span className="text-xs opacity-70 ml-0.5">/mo</span></div>
            </div>
            <div className="mt-3 text-[12px] opacity-80">Up to 200 AI estimates · all automation pipelines · priority support</div>
            <div className="mt-4 inline-flex items-center gap-2 text-[12px] bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5"/> Next invoice on <span className="font-semibold">Jul 3, 2026</span>
            </div>
          </div>
          <div className="text-white">
            <div className="text-[11px] uppercase tracking-wider font-semibold opacity-70">Usage this period</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold" style={{ fontFeatureSettings: "'tnum'" }}>94</span>
              <span className="opacity-70 text-sm">/ 200 estimates</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full rounded-full bg-white/80" style={{ width: "47%" }}/>
            </div>
            <div className="text-[11px] opacity-70 mt-2">47% used · 18 days remaining</div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Payment method</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-7 w-10 rounded bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center"><span className="text-[9px] font-bold text-white tracking-wider">VISA</span></div>
              <span className="text-sm text-slate-700 font-medium">•••• 4521</span>
              <span className="text-[11px] text-slate-500">exp 09/27</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Billing email</div>
            <div className="mt-2 text-sm text-slate-700 font-medium">brian@trublueally.com</div>
          </div>
          <div className="flex items-end justify-end gap-2">
            <button className="px-3 py-1.5 text-[12px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Update payment</button>
            <button className="px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg" style={{ background: NAVY }}>Change plan</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.tier} className={`rounded-xl border p-5 ${p.current ? "border-sky-400 ring-2 ring-sky-100 bg-white" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start justify-between">
              <div className="font-semibold text-slate-900 font-serif text-lg">{p.tier}</div>
              {p.current && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: NAVY }}>CURRENT</span>}
            </div>
            <div className="mt-2 flex items-baseline gap-1" style={{ fontFeatureSettings: "'tnum'" }}>
              <span className="text-3xl font-bold text-slate-900">${p.price}</span>
              <span className="text-xs text-slate-500">/mo</span>
            </div>
            <div className="text-[12px] text-slate-500 mt-1">{p.ests} estimates/mo</div>
            <div className="mt-4 space-y-1.5">
              {p.highlights.map(h => (
                <div key={h} className="text-[12px] text-slate-700 inline-flex items-start gap-1.5 w-full">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0"/> {h}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- App ----------
export default function Dashboard() {
  const [view, setView] = useState<ViewKey>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hcp, setHcp] = useState<HcpState>({ status: "disconnected" });
  const [outlook, setOutlook] = useState<OutlookState>({ status: "disconnected" });
  const allConnected = hcp.status === "connected" && outlook.status === "connected";

  const renderView = () => {
    switch (view) {
      case "home":        return <HomeView hcp={hcp} outlook={outlook} goConnections={() => setView("connections")}/>;
      case "connections": return <ConnectionsView hcp={hcp} setHcp={setHcp} outlook={outlook} setOutlook={setOutlook}/>;
      case "settings":    return <SettingsView/>;
      case "billing":     return <BillingView/>;
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar view={view} setView={setView} allConnected={allConnected} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)}/>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="sm:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30"/>
      )}
      <div className="sm:pl-56 flex flex-col min-h-screen min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)}/>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
