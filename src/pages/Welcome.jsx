import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, BarChart3, Lock, CheckCircle, TrendingUp } from "lucide-react";

const features = [
  { icon: BarChart3, text: "Complete wealth picture across all accounts" },
  { icon: Zap, text: "AI-prepared actions, you just approve" },
  { icon: Shield, text: "Behavioral circuit breakers protect your decisions" },
];

const stats = [
  { value: "S$2.4B+", label: "Assets tracked" },
  { value: "12,000+", label: "Singaporeans" },
  { value: "4.8★", label: "App rating" },
];

function FinTwinWordmark() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ width: 40, height: 40, background: "linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)" }}
      >
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h7v2H4zM4 11h7v2H4zM4 16h7v2H4z" fill="white" fillOpacity="0.95" />
          <path d="M13 6h7v2h-7zM13 11h7v2h-7zM13 16h7v2h-7z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
      <div>
        <span className="text-white text-xl font-bold tracking-tight block leading-none">FinTwin</span>
        <span className="text-white/30 text-[9px] tracking-[0.18em] uppercase mt-0.5 block">Digital Wealth Co-Pilot</span>
      </div>
    </div>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const [singpassHover, setSingpassHover] = useState(false);
  const [singpassLoading, setSingpassLoading] = useState(false);

  const handleSingpass = () => {
    setSingpassLoading(true);
    setTimeout(() => {
      navigate(createPageUrl("Onboarding"));
    }, 1200);
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: "#07111f" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full bg-emerald-500/[0.06] blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-teal-400/[0.04] blur-[110px]" />
        <div className="absolute top-[40%] left-[35%] w-[400px] h-[400px] rounded-full bg-blue-600/[0.04] blur-[100px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[54%] p-14 relative z-10">
        <FinTwinWordmark />

        <div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-medium tracking-wide">MAS-Regulated · SGFinDex Certified</span>
            </div>

            <h1 className="text-[52px] font-extrabold text-white leading-[1.08] tracking-tight">
              Your complete<br />
              <span style={{ backgroundImage: "linear-gradient(90deg, #34d399, #14b8a6, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                financial twin.
              </span>
            </h1>
            <p className="text-white/45 mt-5 text-[17px] leading-relaxed max-w-[420px]">
              FinTwin connects every account you own, monitors your wealth in real time, and prepares specific executable actions — asking for your approval before acting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
            className="mt-10 space-y-3.5"
          >
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <f.icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-white/55 text-[14px]">{f.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-12 flex items-center gap-10"
          >
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-white text-2xl font-bold tracking-tight">{s.value}</p>
                <p className="text-white/25 text-[11px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 text-white/15 text-[11px]"
        >
          <Lock className="w-3 h-3" />
          <span>Zero-knowledge encryption · MAS TRM compliant · Singapore data residency · SGFinDex certified</span>
        </motion.div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-[360px]"
        >
          {/* Mobile wordmark */}
          <div className="lg:hidden mb-10">
            <FinTwinWordmark />
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: "rgba(255,255,255,0.033)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
            }}
          >
            <div className="mb-7">
              <h2 className="text-white text-[22px] font-bold leading-tight">Welcome back</h2>
              <p className="text-white/35 text-sm mt-1.5">Sign in securely with your Singpass</p>
            </div>

            {/* ── Singpass button ── */}
            <button
              onClick={handleSingpass}
              onMouseEnter={() => setSingpassHover(true)}
              onMouseLeave={() => setSingpassHover(false)}
              disabled={singpassLoading}
              className="w-full relative overflow-hidden rounded-2xl transition-all duration-200 active:scale-[0.98]"
              style={{ boxShadow: singpassHover ? "0 0 0 3px rgba(226,37,39,0.25), 0 8px 24px rgba(226,37,39,0.3)" : "0 4px 16px rgba(226,37,39,0.25)" }}
            >
              <div
                className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200"
                style={{ background: singpassHover ? "#c91f21" : "#e22527" }}
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <SingpassLogo />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white text-[14px] font-semibold leading-tight">
                    {singpassLoading ? "Connecting to Singpass..." : "Sign in with Singpass"}
                  </p>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    {singpassLoading ? "Please wait" : "Government-backed secure identity"}
                  </p>
                </div>
                {singpassLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <ArrowRight className={`w-4 h-4 text-white/70 transition-transform duration-200 ${singpassHover ? "translate-x-0.5" : ""}`} />
                )}
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-white/18 text-[11px] font-medium">OR</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Email */}
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="w-full py-3.5 rounded-2xl text-sm font-medium transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
                background: "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              Continue with email
            </button>

            {/* Trust strip */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { label: "Singpass", sub: "Certified" },
                { label: "MAS", sub: "Regulated" },
                { label: "SGFinDex", sub: "Connected" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mb-1.5" />
                  <span className="text-white/65 text-[10px] font-semibold">{b.label}</span>
                  <span className="text-white/25 text-[9px]">{b.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-white/15 text-[10px] mt-5 leading-relaxed px-2">
            By signing in you agree to FinTwin's Terms of Service and Privacy Policy.
            Your financial data is end-to-end encrypted and never sold.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function SingpassLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="13" fill="#e22527" />
      <path
        d="M13 6C9.13 6 6 9.13 6 13C6 16.87 9.13 20 13 20C16.87 20 20 16.87 20 13C20 9.13 16.87 6 13 6ZM13 9.4C14.06 9.4 14.9 10.24 14.9 11.3C14.9 12.36 14.06 13.2 13 13.2C11.94 13.2 11.1 12.36 11.1 11.3C11.1 10.24 11.94 9.4 13 9.4ZM13 18.16C11.16 18.16 9.53 17.23 8.56 15.81C8.58 14.36 11.4 13.56 13 13.56C14.59 13.56 17.42 14.36 17.44 15.81C16.47 17.23 14.84 18.16 13 18.16Z"
        fill="white"
      />
    </svg>
  );
}