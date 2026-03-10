import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Building2, Landmark, BarChart3, Bot, Coins, Home, Shield, Briefcase,
  ChevronRight, Check, ArrowRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  {
    id: "welcome",
    title: "Welcome to FinTwin",
    subtitle: "Your AI-powered wealth co-pilot",
    description: "We'll connect your financial accounts to build a complete picture of your wealth. This takes about 5 minutes.",
  },
  {
    id: "banks",
    title: "Singapore Banks",
    subtitle: "Connect via SGFinDex",
    icon: Building2,
    description: "Securely connect DBS, OCBC, UOB, and Standard Chartered via Singapore's government-built open finance API.",
    connections: ["DBS", "OCBC", "UOB", "Standard Chartered"],
  },
  {
    id: "cpf",
    title: "CPF Accounts",
    subtitle: "Connect via Singpass MyInfo",
    icon: Landmark,
    description: "Pull in OA, SA, MA, and RA balances, contribution history, and projected retirement payouts.",
    connections: ["CPF via Singpass"],
  },
  {
    id: "brokerage",
    title: "Brokerage Accounts",
    subtitle: "Equities & ETFs",
    icon: BarChart3,
    description: "Connect your brokerage accounts to track equity holdings, cost basis, and dividend history.",
    connections: ["CDP / SGX", "Tiger Brokers", "Interactive Brokers", "Moomoo"],
  },
  {
    id: "robo",
    title: "Robo-Advisers",
    subtitle: "Managed portfolios",
    icon: Bot,
    description: "Connect to pull portfolio composition, performance data, and fee structures.",
    connections: ["Endowus", "StashAway", "Syfe"],
  },
  {
    id: "crypto",
    title: "Crypto Wallets",
    subtitle: "Read-only access",
    icon: Coins,
    description: "Connect wallets and exchanges with read-only access. No custody or signing authority.",
    connections: ["MetaMask", "Ledger", "Binance", "Coinbase"],
  },
  {
    id: "property",
    title: "Property",
    subtitle: "Real estate holdings",
    icon: Home,
    description: "Add your property. We'll query URA and HDB databases for current market valuation.",
    connections: ["Add Property Address"],
  },
  {
    id: "insurance",
    title: "Insurance Policies",
    subtitle: "Coverage & surrender values",
    icon: Shield,
    description: "Connect via Singpass or add manually for policy details and coverage amounts.",
    connections: ["Singpass MyInfo", "Manual Entry"],
  },
  {
    id: "other",
    title: "Other Assets",
    subtitle: "Private holdings",
    icon: Briefcase,
    description: "Add private assets, business interests, or other investments with manual valuations.",
    connections: ["Add Manually"],
  },
  {
    id: "complete",
    title: "Your Financial Picture Is Ready",
    subtitle: "Running your first Wellness Assessment...",
    description: "We've connected all your accounts. Let's see your complete financial health.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [connected, setConnected] = useState({});
  const navigate = useNavigate();

  const current = STEPS[step];
  const progress = (step / (STEPS.length - 1)) * 100;

  const handleConnect = (name) => {
    setConnected((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      navigate(createPageUrl("Dashboard"));
    }
  };

  const handleSkip = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-[#0F1729] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 6h7v2H4zM4 11h7v2H4zM4 16h7v2H4z" fill="white" fillOpacity="0.95"/><path d="M13 6h7v2h-7zM13 11h7v2h-7zM13 16h7v2h-7z" fill="white" fillOpacity="0.45"/></svg>
              </div>
              <span className="text-white/70 text-sm font-medium">FinTwin</span>
            </div>
            <span className="text-white/30 text-xs">
              {step + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1 bg-white/10" />
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            {/* Icon */}
            {current.icon && (
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                <current.icon className="w-7 h-7 text-emerald-600" />
              </div>
            )}

            {current.id === "welcome" && (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 pulse-glow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 6h7v2H4zM4 11h7v2H4zM4 16h7v2H4z" fill="white" fillOpacity="0.95"/><path d="M13 6h7v2h-7zM13 11h7v2h-7zM13 16h7v2h-7z" fill="white" fillOpacity="0.45"/></svg>
              </div>
            )}

            {current.id === "complete" && (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-[#0F1729]">{current.title}</h2>
            <p className="text-sm text-emerald-600 font-medium mt-1">{current.subtitle}</p>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">{current.description}</p>

            {/* Connection options */}
            {current.connections && (
              <div className="mt-6 space-y-2">
                {current.connections.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleConnect(name)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition-all
                      ${connected[name]
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span>{name}</span>
                    {connected[name] ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-8">
              {current.id !== "welcome" && current.id !== "complete" ? (
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Skip for now
                </button>
              ) : (
                <div />
              )}
              <Button
                onClick={handleNext}
                className="bg-[#0F1729] hover:bg-[#1A2440] text-white px-6"
              >
                {current.id === "complete" ? "View Dashboard" : current.id === "welcome" ? "Get Started" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}