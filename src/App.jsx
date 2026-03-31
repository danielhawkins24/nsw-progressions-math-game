import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { CheckCircle2, XCircle, TimerReset, Trophy, Calculator, Flag, UserCircle2, ShoppingBag, Check, Palette, Cat, Pencil, Users, Rocket, Sparkles, CircleDollarSign } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TimeTrialStopwatch({ prompt, timeLeft, totalTime, feedback, countdownLabel, monochrome = false }) {
  const progressRatio = Math.max(0, Math.min(1, timeLeft / Math.max(1, totalTime)));
  const radius = 128;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressRatio);
  const activeStroke = monochrome
    ? "rgba(255,255,255,0.98)"
    : feedback === "correct"
    ? "rgba(74,222,128,0.95)"
    : feedback === "incorrect"
    ? "rgba(248,113,113,0.95)"
    : "rgba(56,189,248,0.98)";

  return (
    <div className="relative mx-auto w-full max-w-[440px] aspect-square">
      <div className={cn(
        "absolute left-1/2 top-0.5 -translate-x-1/2 w-16 h-7 rounded-t-[14px] rounded-b-[10px] border shadow-[0_8px_24px_rgba(15,23,42,0.4)]",
        monochrome ? "bg-black border-white/70" : "bg-slate-950/96 border-white/20"
      )} />
      <div className={cn(
        "absolute left-1/2 top-5 -translate-x-1/2 w-8 h-4 rounded-full border",
        monochrome ? "bg-zinc-900 border-white/60" : "bg-slate-900 border-white/15"
      )} />
      <div className={cn(
        "absolute inset-[8%] rounded-[48%] border shadow-[0_24px_56px_rgba(2,6,23,0.55)]",
        monochrome
          ? "border-white/70 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.12),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.98),rgba(24,24,27,0.96))]"
          : "border-white/15 bg-[radial-gradient(circle_at_50%_26%,rgba(125,211,252,0.16),transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))]"
      )} />

      <svg className="absolute inset-[5%] w-[90%] h-[90%] -rotate-90" viewBox="0 0 300 300" fill="none" aria-hidden="true">
        <circle cx="150" cy="150" r={radius} stroke={monochrome ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"} strokeWidth="10" />
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke={activeStroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-300"
        />
      </svg>

      <div className={cn(
        "absolute left-1/2 top-[12.5%] -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.16em] whitespace-nowrap shadow-[0_6px_18px_rgba(2,6,23,0.45)] border",
        monochrome ? "bg-black text-white border-white/70" : "bg-slate-950/94 border-white/12 text-white/90"
      )}>
        {timeLeft}s left
      </div>

      <div className={cn(
        "absolute inset-[19%] rounded-full flex items-center justify-center text-center px-6 py-7 md:px-8 md:py-8 overflow-hidden border",
        monochrome
          ? "border-white/70 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_52%),linear-gradient(180deg,rgba(0,0,0,0.98),rgba(24,24,27,0.98))]"
          : "border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06),transparent_52%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))]"
      )}>
        {countdownLabel ? (
          <motion.div
            key={countdownLabel}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-5xl md:text-6xl font-black text-white"
          >
            {countdownLabel}
          </motion.div>
        ) : (
          <div className={cn(
            monochrome
              ? "w-full max-w-[96%] text-[2.5rem] md:text-[3.25rem] font-black leading-[1.04] text-white break-words"
              : "w-full max-w-[96%] text-[2.3rem] md:text-[3rem] font-black leading-[1.08] text-white drop-shadow-[0_4px_18px_rgba(255,255,255,0.12)] break-words",
            feedback === "correct" && !monochrome && "text-emerald-200",
            feedback === "incorrect" && !monochrome && "text-red-200"
          )}>
            {prompt}
          </div>
        )}
      </div>
    </div>
  );
}

function BilleaMinimalGamePanel({
  timerLabel,
  timerValue,
  timerProgress = null,
  questionLabel,
  prompt,
  answer,
  setAnswer,
  onSubmit,
  inputRef,
  feedback,
  submitLabel = "Enter",
  disabled = false,
}) {
  const clampedProgress = typeof timerProgress === "number" ? Math.max(0, Math.min(100, timerProgress)) : null;

  return (
    <Card className="bg-black border-white/75 rounded-3xl shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-5">
          <div className="rounded-3xl border-2 border-white bg-zinc-950 px-4 py-4 text-center">
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.24em] text-white/80">{timerLabel}</div>
            <div className="text-4xl md:text-6xl font-black text-white mt-2">{timerValue}</div>
            {clampedProgress !== null && (
              <div className="mt-4 h-4 rounded-full bg-zinc-800 border border-white/40 overflow-hidden">
                <motion.div className="h-full bg-white" animate={{ width: `${clampedProgress}%` }} transition={{ duration: 0.15 }} />
              </div>
            )}
          </div>

          <div className={cn(
            "rounded-[2rem] border-2 px-5 py-8 md:px-8 md:py-10 text-center bg-black",
            feedback === "correct" ? "border-white bg-zinc-900" : feedback === "incorrect" ? "border-white bg-zinc-800" : "border-white/85"
          )}>
            {questionLabel && <div className="text-sm md:text-base font-bold uppercase tracking-[0.24em] text-white/75 mb-4">{questionLabel}</div>}
            <div className="text-[2.6rem] md:text-[4.2rem] font-black leading-[1.05] text-white">{prompt}</div>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              ref={inputRef}
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type answer"
              className="h-20 md:h-24 rounded-[2rem] !text-[2.6rem] md:!text-[3.2rem] leading-none font-black tracking-tight bg-black border-2 border-white text-white placeholder:text-white/35 text-center"
              autoComplete="off"
              disabled={disabled}
            />
            <Button
              type="submit"
              disabled={disabled}
              className="w-full h-12 md:h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-lg disabled:bg-zinc-700 disabled:text-zinc-300"
            >
              {submitLabel}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

const DEFAULT_ROUND_TIME = 120;
const DEFAULT_QUESTION_COUNT = 15;
const PASS_SCORE = 14;
const PRACTISE_ROUND_OPTIONS = {
  15: { questionCount: 15, timeLimit: 120, coinMultiplier: 1 },
  30: { questionCount: 30, timeLimit: 210, coinMultiplier: 1 },
  50: { questionCount: 50, timeLimit: 360, coinMultiplier: 1 },
  100: { questionCount: 100, timeLimit: 720, coinMultiplier: 3 },
};

function getPractisePassScore(questionCount) {
  return Math.max(14, Math.ceil((Number(questionCount || DEFAULT_QUESTION_COUNT) * 14) / 15));
}
const TESTING_PASS_SCORE = 14;
const TESTING_HOLD_MIN = 4;
const TESTING_HOLD_MAX = 13;
const STORAGE_KEY = "nsw-progressions-power-up-user-history";
const PROFILE_STORAGE_KEY = "nsw-progressions-power-up-profile";
const PLAYER_NAME_STORAGE_KEY = "nsw-progressions-power-up-player-name";
const THEME_STORAGE_KEY = "nsw-progressions-power-up-theme";
const TESTING_SCORE_STORAGE_KEY = "nsw-progressions-power-up-testing-scores";
const TESTING_UNLOCK_STORAGE_KEY = "nsw-progressions-power-up-testing-unlock";
const MULTIPLAYER_BESTS_STORAGE_KEY = "nsw-progressions-power-up-multiplayer-bests";
const STATS_STORAGE_KEY = "nsw-progressions-power-up-stats-log";
const BONUS_DISPLAY_MS = 2200;
const MIXED_MODE_MULTIPLIER = 1.5;
const MULTIPLAYER_TARGET_SCORE = 30;
const MULTIPLAYER_WAIT_SECONDS = 10;
const MULTIPLAYER_PLACEMENT_COINS = { 1: 30, 2: 20, 3: 10, 4: 5 };
const CURRENT_LEVEL_MATCH_MULTIPLIER = 2;
const TIME_TRIAL_SECONDS = 60;
const TIME_TRIAL_QUESTION_BUFFER = 400;
const TIME_TRIAL_HISTORY_STORAGE_KEY = "nsw-progressions-power-up-time-trial-history";
const FREE_FALL_HISTORY_STORAGE_KEY = "nsw-progressions-power-up-free-fall-history";
const TIME_TRIAL_COUNTDOWN_STEPS = ["Ready?", "3", "2", "1", "Go!"];
const KING_OF_THE_HILL_ROUND_SIZE = 15;
const KING_OF_THE_HILL_START_SECONDS = 10;
const KING_OF_THE_HILL_MIN_SECONDS = 2;
const KING_OF_THE_HILL_INTERMISSION_STEPS = ["Round over", "Faster", "Level up", "New challenger"];
const TUG_OF_WAR_TOTAL_ROUNDS = 10;
const TUG_OF_WAR_ROPE_START = 50;
const TUG_OF_WAR_PLAYER_PULL = 10;
const TUG_OF_WAR_BASE_AI_PULL = TUG_OF_WAR_PLAYER_PULL;
const TUG_OF_WAR_AI_PULL_INTERVAL_START = 10000;
const TUG_OF_WAR_AI_PULL_INTERVAL_MIN = 1000;
const TUG_OF_WAR_INTRO_MS = 3200;
const TUG_OF_WAR_ROUND_BUFFER = 240;
const FREE_FALL_START_LIVES = 3;
const FREE_FALL_SPECIAL_CHANCE = 0.05;
const FREE_FALL_FAST_CHANCE = 0.10;
const FREE_FALL_FAST_DURATION_MULTIPLIER = 0.72;
const FREE_FALL_SPECIAL_GOLD_MS = 2000;
const FREE_FALL_BOX_FLASH_MS = 260;
const FREE_FALL_LANES = [8, 31, 54, 77];
const TUG_TEACHER_POOLS = {
  1: [
    { name: "Mrs Dabit", icon: "🍎" },
    { name: "Mrs Korendis", icon: "📚" },
    { name: "Mrs Rizk", icon: "✏️" },
  ],
  2: [
    {
      name: "Mrs Buccini",
      icon: "⚽",
      backgroundStyle: "bg-[linear-gradient(135deg,#166534_0%,#22c55e_55%,#f8fafc_100%)]",
      ringStyle: "ring-4 ring-emerald-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(187,247,208,0.95),_rgba(34,197,94,0.95),_rgba(22,101,52,0.98),_rgba(187,247,208,0.95))]",
    },
    {
      name: "Mrs Wass",
      icon: "👮",
      backgroundStyle: "bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_46%,#94a3b8_100%)]",
      ringStyle: "ring-4 ring-sky-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(191,219,254,0.95),_rgba(59,130,246,0.95),_rgba(148,163,184,0.98),_rgba(191,219,254,0.95))]",
    },
    { name: "Ms Kaplan", icon: "📝" },
  ],
  3: [
    {
      name: "Mr Orr",
      icon: "🔨",
      backgroundStyle: "bg-[linear-gradient(135deg,#7f1d1d_0%,#b91c1c_62%,#facc15_100%)]",
      ringStyle: "ring-4 ring-amber-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(254,240,138,0.95),_rgba(239,68,68,0.95),_rgba(127,29,29,0.98),_rgba(254,240,138,0.95))]",
    },
    { name: "Mrs Steiner", icon: "📖" },
    { name: "Mrs Reyani", icon: "🧠" },
    { name: "Mrs Elsaket", icon: "📌" },
  ],
  4: [
    { name: "Mrs Aga", icon: "🌟" },
    {
      name: "Ms Fletcher",
      icon: "🏖️",
      backgroundStyle: "bg-[linear-gradient(135deg,#38bdf8_0%,#fef08a_52%,#fb7185_100%)]",
      ringStyle: "ring-4 ring-cyan-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(186,230,253,0.95),_rgba(253,224,71,0.95),_rgba(251,113,133,0.95),_rgba(186,230,253,0.95))]",
    },
    {
      name: "Mr Tang",
      icon: "🧮",
      backgroundStyle: "bg-[linear-gradient(135deg,#0f172a_0%,#334155_46%,#22d3ee_100%)]",
      ringStyle: "ring-4 ring-cyan-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(224,242,254,0.95),_rgba(34,211,238,0.95),_rgba(15,23,42,0.98),_rgba(224,242,254,0.95))]",
    },
  ],
  5: [
    { name: "Mrs Driscoll", icon: "📗" },
    { name: "Ms Demanuele", icon: "🪄" },
    {
      name: "Mr Getsios",
      icon: "🐓",
      backgroundStyle: "bg-[linear-gradient(180deg,#082f49_0%,#082f49_42%,#f8fafc_42%,#f8fafc_46%,#dc2626_46%,#dc2626_50%,#2563eb_50%,#2563eb_54%,#f8fafc_54%,#f8fafc_58%,#082f49_58%,#082f49_100%)]",
      ringStyle: "ring-4 ring-red-300/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(254,202,202,0.95),_rgba(239,68,68,0.95),_rgba(37,99,235,0.95),_rgba(254,202,202,0.95))]",
    },
  ],
  6: [
    { name: "Ms Glendhill", icon: "🖍️" },
    {
      name: "Mr Laidlaw",
      icon: "🐶",
      backgroundStyle: "bg-[repeating-linear-gradient(180deg,#1d4ed8_0px,#1d4ed8_34px,#f8fafc_34px,#f8fafc_52px,#1d4ed8_52px,#1d4ed8_86px)]",
      ringStyle: "ring-4 ring-sky-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(219,234,254,0.95),_rgba(29,78,216,0.95),_rgba(248,250,252,0.98),_rgba(219,234,254,0.95))]",
    },
    { name: "Mrs Landels", icon: "📙" },
  ],
  7: [
    {
      name: "Ms Burnett",
      icon: "🕶️",
      backgroundStyle: "bg-[linear-gradient(135deg,#ec4899_0%,#8b5cf6_34%,#22d3ee_68%,#fde047_100%)]",
      ringStyle: "ring-4 ring-pink-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(244,114,182,0.95),_rgba(139,92,246,0.95),_rgba(34,211,238,0.95),_rgba(253,224,71,0.95),_rgba(244,114,182,0.95))]",
    },
    {
      name: "Mrs Lenaz",
      icon: "🏃",
      backgroundStyle: "bg-[linear-gradient(135deg,#7f1d1d_0%,#dc2626_58%,#f8fafc_100%)]",
      ringStyle: "ring-4 ring-red-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(254,202,202,0.95),_rgba(239,68,68,0.95),_rgba(127,29,29,0.98),_rgba(254,202,202,0.95))]",
    },
    { name: "Mrs Rimac", icon: "📕" },
    {
      name: "Mr Hawkins",
      icon: "🦈",
      backgroundStyle: "bg-[linear-gradient(180deg,#38bdf8_0%,#38bdf8_42%,#111827_42%,#111827_46%,#f8fafc_46%,#f8fafc_54%,#111827_54%,#111827_58%,#38bdf8_58%,#38bdf8_100%)]",
      ringStyle: "ring-4 ring-cyan-300/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(186,230,253,0.95),_rgba(34,211,238,0.95),_rgba(15,23,42,0.98),_rgba(186,230,253,0.95))]",
    },
  ],
  8: [
    { name: "Ms Sheppard", icon: "📘" },
    { name: "Ms Mahendra", icon: "📚" },
    { name: "Ms Cox", icon: "🖊️" },
    {
      name: "Mrs Lobb",
      icon: "🦞",
      backgroundStyle: "bg-[linear-gradient(180deg,#991b1b_0%,#991b1b_44%,#f8fafc_44%,#f8fafc_56%,#991b1b_56%,#991b1b_100%)]",
      ringStyle: "ring-4 ring-red-300/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(254,202,202,0.95),_rgba(153,27,27,0.98),_rgba(248,250,252,0.95),_rgba(254,202,202,0.95))]",
    },
    { name: "Mrs Strachen", icon: "🏫" },
  ],
  9: [
    {
      name: "Mrs Dong",
      icon: "🐇",
      backgroundStyle: "bg-[repeating-linear-gradient(180deg,#166534_0px,#166534_36px,#991b1b_36px,#991b1b_72px)]",
      ringStyle: "ring-4 ring-red-300/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(248,113,113,0.95),_rgba(52,211,153,0.95),_rgba(127,29,29,0.98),_rgba(248,113,113,0.95))]",
    },
    { name: "Mrs Obsioma", icon: "📓" },
    {
      name: "Mr Sharp",
      icon: "💻",
      backgroundStyle: "bg-[linear-gradient(135deg,#020617_0%,#0f172a_46%,#06b6d4_100%)]",
      ringStyle: "ring-4 ring-cyan-200/85 ring-offset-2 ring-offset-slate-950",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(224,242,254,0.95),_rgba(6,182,212,0.95),_rgba(2,6,23,0.98),_rgba(224,242,254,0.95))]",
    },
  ],
  10: [
    {
      name: "Mr Herbert",
      icon: "👑",
      backgroundStyle: "bg-[radial-gradient(circle_at_30%_22%,#ffffff_0%,#f8fafc_18%,#e2e8f0_34%,#94a3b8_56%,#334155_78%,#020617_100%)]",
      ringStyle: "ring-[5px] ring-slate-100/95 ring-offset-2 ring-offset-slate-950 shadow-[0_0_34px_rgba(226,232,240,0.78)]",
      ringOverlay: "bg-[conic-gradient(from_0deg,_rgba(255,255,255,0.98),_rgba(226,232,240,0.98),_rgba(148,163,184,0.98),_rgba(255,255,255,0.98))]",
    },
  ],
};

function getTugAIPullInterval(roundNumber) {
  const intervalMap = {
    1: 10000,
    2: 8000,
    3: 6500,
    4: 5000,
    5: 4000,
    6: 3000,
    7: 2300,
    8: 1800,
    9: 1500,
    10: 1000,
  };
  return intervalMap[Math.max(1, Math.min(10, Number(roundNumber) || 1))] || 1000;
}

function getTugAIPullAmount(roundNumber) {
  return TUG_OF_WAR_PLAYER_PULL;
}

function resolveTugStateAtTime(state, now = Date.now()) {
  if (!state) return state;

  let nextPullAt = Number(state.nextAIPullAt || now);
  let ropePosition = Number(state.ropePosition ?? TUG_OF_WAR_ROPE_START);
  const aiPullAmount = Number(state.aiPullAmount || TUG_OF_WAR_BASE_AI_PULL);
  const aiPullEveryMs = Number(state.aiPullEveryMs || TUG_OF_WAR_AI_PULL_INTERVAL_START);
  let changed = false;

  while (now >= nextPullAt) {
    ropePosition -= aiPullAmount;
    nextPullAt += aiPullEveryMs;
    changed = true;
  }

  if (!changed) return state;

  return {
    ...state,
    ropePosition: Math.max(0, ropePosition),
    nextAIPullAt: nextPullAt,
  };
}

const SITE_THEMES = {
  blue: {
    id: "blue",
    name: "Beresford Blue",
    page: "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900",
    primaryButton: "bg-blue-500 hover:bg-blue-400",
    accentBadge: "bg-blue-400/20 text-blue-100",
    trackLane: "bg-blue-950/85 border-blue-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(96,165,250,0.16)_0%,rgba(96,165,250,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-cyan-300/25 to-blue-500/10 border-cyan-200/30",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Glow",
    page: "bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-900",
    primaryButton: "bg-emerald-500 hover:bg-emerald-400",
    accentBadge: "bg-emerald-400/20 text-emerald-100",
    trackLane: "bg-emerald-950/85 border-emerald-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(52,211,153,0.16)_0%,rgba(52,211,153,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-emerald-300/25 to-teal-500/10 border-emerald-200/30",
  },
  sunset: {
    id: "sunset",
    name: "Sunset Burst",
    page: "bg-gradient-to-b from-slate-950 via-orange-950 to-rose-950",
    primaryButton: "bg-orange-500 hover:bg-orange-400",
    accentBadge: "bg-orange-400/20 text-orange-100",
    trackLane: "bg-rose-950/85 border-orange-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(251,146,60,0.16)_0%,rgba(251,146,60,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-amber-300/25 to-rose-500/10 border-amber-200/30",
  },
  violet: {
    id: "violet",
    name: "Violet Storm",
    page: "bg-gradient-to-b from-slate-950 via-violet-950 to-indigo-950",
    primaryButton: "bg-violet-500 hover:bg-violet-400",
    accentBadge: "bg-violet-400/20 text-violet-100",
    trackLane: "bg-indigo-950/85 border-violet-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(167,139,250,0.16)_0%,rgba(167,139,250,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-violet-300/25 to-indigo-500/10 border-violet-200/30",
  },
  gold: {
    id: "gold",
    name: "Golden Hour",
    page: "bg-gradient-to-b from-slate-950 via-amber-900 to-orange-950",
    primaryButton: "bg-amber-500 hover:bg-amber-400",
    accentBadge: "bg-amber-400/20 text-amber-100",
    trackLane: "bg-amber-950/85 border-amber-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(251,191,36,0.16)_0%,rgba(251,191,36,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-yellow-300/25 to-amber-500/10 border-yellow-200/30",
  },
  billea: {
    id: "billea",
    name: "Billea Mode",
    page: "bg-black",
    primaryButton: "bg-black hover:bg-zinc-900 border-2 border-white",
    accentBadge: "bg-white text-black border border-white",
    trackLane: "bg-black border-white/70",
    trackStripe: "bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.18)_10%,transparent_10%,transparent_20%)]",
    trackFinish: "from-white/20 to-white/10 border-white/80",
  },
  crimson: {
    id: "crimson",
    name: "Crimson Rush",
    page: "bg-gradient-to-b from-slate-950 via-red-950 to-rose-950",
    primaryButton: "bg-rose-600 hover:bg-rose-500",
    accentBadge: "bg-rose-400/20 text-rose-100",
    trackLane: "bg-rose-950/85 border-rose-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(251,113,133,0.16)_0%,rgba(251,113,133,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-rose-300/25 to-red-500/10 border-rose-200/30",
  },
  glacier: {
    id: "glacier",
    name: "Glacier Pop",
    page: "bg-gradient-to-b from-slate-950 via-sky-950 to-cyan-950",
    primaryButton: "bg-sky-500 hover:bg-sky-400",
    accentBadge: "bg-sky-300/20 text-sky-100",
    trackLane: "bg-sky-950/85 border-sky-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(125,211,252,0.18)_0%,rgba(125,211,252,0.18)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-cyan-200/25 to-sky-400/10 border-cyan-100/40",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Neon",
    page: "bg-gradient-to-b from-black via-slate-950 to-indigo-950",
    primaryButton: "bg-fuchsia-600 hover:bg-fuchsia-500",
    accentBadge: "bg-fuchsia-400/20 text-fuchsia-100",
    trackLane: "bg-slate-950/90 border-fuchsia-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(232,121,249,0.16)_0%,rgba(232,121,249,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-fuchsia-300/25 to-indigo-500/10 border-fuchsia-200/30",
  },
  citrus: {
    id: "citrus",
    name: "Citrus Flash",
    page: "bg-gradient-to-b from-slate-950 via-lime-950 to-emerald-950",
    primaryButton: "bg-lime-500 hover:bg-lime-400",
    accentBadge: "bg-lime-300/20 text-lime-100",
    trackLane: "bg-lime-950/85 border-lime-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(190,242,100,0.16)_0%,rgba(190,242,100,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-lime-300/25 to-emerald-500/10 border-lime-200/30",
  },
  rosequartz: {
    id: "rosequartz",
    name: "Rose Quartz",
    page: "bg-gradient-to-b from-slate-950 via-pink-950 to-purple-950",
    primaryButton: "bg-pink-500 hover:bg-pink-400",
    accentBadge: "bg-pink-300/20 text-pink-100",
    trackLane: "bg-pink-950/85 border-pink-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(249,168,212,0.18)_0%,rgba(249,168,212,0.18)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-pink-200/25 to-violet-500/10 border-pink-100/40",
  },
  storm: {
    id: "storm",
    name: "Storm Teal",
    page: "bg-gradient-to-b from-slate-950 via-teal-950 to-cyan-950",
    primaryButton: "bg-teal-500 hover:bg-teal-400",
    accentBadge: "bg-teal-300/20 text-teal-100",
    trackLane: "bg-teal-950/85 border-teal-300/20",
    trackStripe: "bg-[linear-gradient(to_right,rgba(45,212,191,0.16)_0%,rgba(45,212,191,0.16)_8%,transparent_8%,transparent_16%)]",
    trackFinish: "from-teal-200/25 to-cyan-500/10 border-teal-100/40",
  },
  rainbow: {
    id: "rainbow",
    name: "Rainbow Mode",
    page: "bg-[linear-gradient(180deg,#0f172a_0%,#4c1d95_16%,#be123c_34%,#ea580c_50%,#ca8a04_66%,#16a34a_82%,#0ea5e9_100%)]",
    primaryButton: "bg-pink-500 hover:bg-pink-400",
    accentBadge: "bg-white/20 text-white",
    trackLane: "bg-slate-950/80 border-pink-200/25",
    trackStripe: "bg-[linear-gradient(to_right,rgba(244,114,182,0.16)_0%,rgba(250,204,21,0.16)_18%,rgba(74,222,128,0.16)_36%,rgba(56,189,248,0.16)_54%,rgba(167,139,250,0.16)_72%,transparent_72%,transparent_100%)]",
    trackFinish: "from-pink-300/25 via-yellow-200/20 to-cyan-300/15 border-white/40",
  },
  broncos: {
    id: "broncos",
    name: "Brisbane Broncos",
    page: "bg-[repeating-linear-gradient(180deg,#7f1d1d_0px,#7f1d1d_34px,#f59e0b_34px,#f59e0b_56px,#7f1d1d_56px,#7f1d1d_90px)]",
    primaryButton: "bg-amber-500 hover:bg-amber-400",
    accentBadge: "bg-amber-300/20 text-amber-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#5f1523_0px,#5f1523_30px,#f59e0b_30px,#f59e0b_48px,#5f1523_48px,#5f1523_78px)] border-amber-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-amber-300/20 to-red-500/10 border-amber-200/30",
  },
  raiders: {
    id: "raiders",
    name: "Canberra Raiders",
    page: "bg-[repeating-linear-gradient(180deg,#14532d_0px,#14532d_34px,#84cc16_34px,#84cc16_54px,#14532d_54px,#14532d_88px)]",
    primaryButton: "bg-lime-500 hover:bg-lime-400",
    accentBadge: "bg-lime-300/20 text-lime-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#14532d_0px,#14532d_30px,#84cc16_30px,#84cc16_46px,#14532d_46px,#14532d_76px)] border-lime-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-lime-300/20 to-emerald-500/10 border-lime-200/30",
  },
  bulldogs: {
    id: "bulldogs",
    name: "Canterbury-Bankstown Bulldogs",
    page: "bg-[repeating-linear-gradient(180deg,#1d4ed8_0px,#1d4ed8_34px,#f8fafc_34px,#f8fafc_52px,#1d4ed8_52px,#1d4ed8_86px)]",
    primaryButton: "bg-sky-500 hover:bg-sky-400",
    accentBadge: "bg-sky-300/20 text-sky-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#1d4ed8_0px,#1d4ed8_30px,#f8fafc_30px,#f8fafc_46px,#1d4ed8_46px,#1d4ed8_76px)] border-sky-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-sky-300/20 to-blue-500/10 border-sky-200/30",
  },
  sharks: {
    id: "sharks",
    name: "Cronulla Sharks",
    page: "bg-[linear-gradient(180deg,#38bdf8_0%,#38bdf8_42%,#111827_42%,#111827_46%,#f8fafc_46%,#f8fafc_54%,#111827_54%,#111827_58%,#38bdf8_58%,#38bdf8_100%)]",
    primaryButton: "bg-sky-500 hover:bg-sky-400",
    accentBadge: "bg-sky-300/20 text-sky-100",
    trackLane: "bg-[linear-gradient(180deg,#38bdf8_0%,#38bdf8_42%,#111827_42%,#111827_46%,#f8fafc_46%,#f8fafc_54%,#111827_54%,#111827_58%,#38bdf8_58%,#38bdf8_100%)] border-sky-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-sky-300/20 to-slate-100/10 border-sky-200/30",
  },
  dolphins: {
    id: "dolphins",
    name: "Dolphins",
    page: "bg-[repeating-linear-gradient(180deg,#9f1239_0px,#9f1239_34px,#fb7185_34px,#fb7185_56px,#9f1239_56px,#9f1239_90px)]",
    primaryButton: "bg-rose-500 hover:bg-rose-400",
    accentBadge: "bg-rose-300/20 text-rose-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#9f1239_0px,#9f1239_30px,#fb7185_30px,#fb7185_48px,#9f1239_48px,#9f1239_78px)] border-rose-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-rose-300/20 to-red-500/10 border-rose-200/30",
  },
  titans: {
    id: "titans",
    name: "Gold Coast Titans",
    page: "bg-[repeating-linear-gradient(180deg,#082f49_0px,#082f49_30px,#7dd3fc_30px,#7dd3fc_54px,#fde047_54px,#fde047_70px,#082f49_70px,#082f49_100px)]",
    primaryButton: "bg-sky-400 hover:bg-sky-300 text-slate-950",
    accentBadge: "bg-sky-300/20 text-sky-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#082f49_0px,#082f49_26px,#7dd3fc_26px,#7dd3fc_46px,#fde047_46px,#fde047_60px,#082f49_60px,#082f49_86px)] border-sky-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-sky-300/20 to-yellow-300/10 border-sky-200/30",
  },
  seaeagles: {
    id: "seaeagles",
    name: "Manly Sea Eagles",
    page: "bg-[linear-gradient(180deg,#7f1d1d_0%,#7f1d1d_44%,#f8fafc_44%,#f8fafc_56%,#7f1d1d_56%,#7f1d1d_100%)]",
    primaryButton: "bg-rose-600 hover:bg-rose-500",
    accentBadge: "bg-rose-300/20 text-rose-100",
    trackLane: "bg-[linear-gradient(180deg,#7f1d1d_0%,#7f1d1d_44%,#f8fafc_44%,#f8fafc_56%,#7f1d1d_56%,#7f1d1d_100%)] border-rose-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_9px,transparent_9px,transparent_18px)]",
    trackFinish: "from-slate-100/20 to-rose-500/10 border-rose-200/30",
  },
  melbstorm: {
    id: "melbstorm",
    name: "Melbourne Storm",
    page: "bg-[repeating-linear-gradient(180deg,#4c1d95_0px,#4c1d95_34px,#facc15_34px,#facc15_42px,#312e81_42px,#312e81_82px)]",
    primaryButton: "bg-violet-500 hover:bg-violet-400",
    accentBadge: "bg-violet-300/20 text-violet-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#4c1d95_0px,#4c1d95_30px,#facc15_30px,#facc15_36px,#312e81_36px,#312e81_72px)] border-violet-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-violet-300/20 to-yellow-300/10 border-violet-200/30",
  },
  knights: {
    id: "knights",
    name: "Newcastle Knights",
    page: "bg-[repeating-linear-gradient(180deg,#7f1d1d_0px,#7f1d1d_24px,#1d4ed8_24px,#1d4ed8_42px,#7f1d1d_42px,#7f1d1d_66px)]",
    primaryButton: "bg-red-500 hover:bg-red-400",
    accentBadge: "bg-red-300/20 text-red-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#7f1d1d_0px,#7f1d1d_22px,#1d4ed8_22px,#1d4ed8_38px,#7f1d1d_38px,#7f1d1d_60px)] border-red-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-red-300/20 to-blue-500/10 border-red-200/30",
  },
  warriors: {
    id: "warriors",
    name: "New Zealand Warriors",
    page: "bg-[repeating-linear-gradient(180deg,#111827_0px,#111827_30px,#2563eb_30px,#2563eb_40px,#dc2626_40px,#dc2626_48px,#a3e635_48px,#a3e635_58px,#facc15_58px,#facc15_68px,#111827_68px,#111827_102px)]",
    primaryButton: "bg-slate-700 hover:bg-slate-600",
    accentBadge: "bg-lime-300/20 text-lime-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#111827_0px,#111827_26px,#2563eb_26px,#2563eb_34px,#dc2626_34px,#dc2626_40px,#a3e635_40px,#a3e635_48px,#facc15_48px,#facc15_56px,#111827_56px,#111827_86px)] border-lime-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-lime-300/20 to-blue-500/10 border-lime-200/30",
  },
  cowboys: {
    id: "cowboys",
    name: "North Queensland Cowboys",
    page: "bg-[repeating-linear-gradient(180deg,#1e3a8a_0px,#1e3a8a_34px,#facc15_34px,#facc15_56px,#1e3a8a_56px,#1e3a8a_92px)]",
    primaryButton: "bg-blue-500 hover:bg-blue-400",
    accentBadge: "bg-blue-300/20 text-blue-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#1e3a8a_0px,#1e3a8a_30px,#facc15_30px,#facc15_48px,#1e3a8a_48px,#1e3a8a_80px)] border-blue-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-blue-300/20 to-yellow-300/10 border-blue-200/30",
  },
  eels: {
    id: "eels",
    name: "Parramatta Eels",
    page: "bg-[repeating-linear-gradient(180deg,#2563eb_0px,#2563eb_34px,#fde047_34px,#fde047_56px,#2563eb_56px,#2563eb_92px)]",
    primaryButton: "bg-yellow-400 hover:bg-yellow-300 text-slate-950",
    accentBadge: "bg-yellow-300/20 text-yellow-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#2563eb_0px,#2563eb_30px,#fde047_30px,#fde047_48px,#2563eb_48px,#2563eb_80px)] border-yellow-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-yellow-300/20 to-blue-500/10 border-yellow-200/30",
  },
  panthers: {
    id: "panthers",
    name: "Penrith Panthers",
    page: "bg-[repeating-linear-gradient(180deg,#000000_0px,#000000_36px,#16a34a_36px,#16a34a_42px,#dc2626_42px,#dc2626_48px,#eab308_48px,#eab308_54px,#f8fafc_54px,#f8fafc_60px,#000000_60px,#000000_96px)]",
    primaryButton: "bg-rose-500 hover:bg-rose-400",
    accentBadge: "bg-rose-300/20 text-rose-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#000000_0px,#000000_30px,#16a34a_30px,#16a34a_35px,#dc2626_35px,#dc2626_40px,#eab308_40px,#eab308_45px,#f8fafc_45px,#f8fafc_50px,#000000_50px,#000000_80px)] border-rose-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_10px,transparent_10px,transparent_20px)]",
    trackFinish: "from-slate-100/18 to-rose-500/10 border-rose-200/30",
  },
  rabbitohs: {
    id: "rabbitohs",
    name: "South Sydney Rabbitohs",
    page: "bg-[repeating-linear-gradient(180deg,#166534_0px,#166534_34px,#991b1b_34px,#991b1b_68px)]",
    primaryButton: "bg-emerald-500 hover:bg-emerald-400",
    accentBadge: "bg-emerald-300/20 text-emerald-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#166534_0px,#166534_30px,#991b1b_30px,#991b1b_60px)] border-emerald-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-emerald-300/20 to-red-500/10 border-emerald-200/30",
  },
  dragons: {
    id: "dragons",
    name: "St George Illawarra Dragons",
    page: "bg-[linear-gradient(180deg,#f8fafc_0%,#f8fafc_44%,#dc2626_44%,#dc2626_58%,#f8fafc_58%,#f8fafc_100%)]",
    primaryButton: "bg-red-600 hover:bg-red-500",
    accentBadge: "bg-red-300/20 text-red-100",
    trackLane: "bg-[linear-gradient(180deg,#f8fafc_0%,#f8fafc_44%,#dc2626_44%,#dc2626_58%,#f8fafc_58%,#f8fafc_100%)] border-red-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_10px,transparent_10px,transparent_20px)]",
    trackFinish: "from-red-300/20 to-slate-100/10 border-red-200/30",
  },
  roosters: {
    id: "roosters",
    name: "Sydney Roosters",
    page: "bg-[linear-gradient(180deg,#082f49_0%,#082f49_42%,#f8fafc_42%,#f8fafc_46%,#dc2626_46%,#dc2626_50%,#2563eb_50%,#2563eb_54%,#f8fafc_54%,#f8fafc_58%,#082f49_58%,#082f49_100%)]",
    primaryButton: "bg-red-500 hover:bg-red-400",
    accentBadge: "bg-red-300/20 text-red-100",
    trackLane: "bg-[linear-gradient(180deg,#082f49_0%,#082f49_42%,#f8fafc_42%,#f8fafc_46%,#dc2626_46%,#dc2626_50%,#2563eb_50%,#2563eb_54%,#f8fafc_54%,#f8fafc_58%,#082f49_58%,#082f49_100%)] border-red-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_10px,transparent_10px,transparent_20px)]",
    trackFinish: "from-red-300/18 to-blue-300/10 border-red-200/30",
  },
  tigers: {
    id: "tigers",
    name: "Wests Tigers",
    page: "bg-[repeating-linear-gradient(180deg,#111827_0px,#111827_32px,#f97316_32px,#f97316_56px,#111827_56px,#111827_88px)]",
    primaryButton: "bg-orange-500 hover:bg-orange-400",
    accentBadge: "bg-orange-300/20 text-orange-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#111827_0px,#111827_28px,#f97316_28px,#f97316_48px,#111827_48px,#111827_76px)] border-orange-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-orange-300/20 to-slate-500/10 border-orange-200/30",
  },
  matildas: {
    id: "matildas",
    name: "Matildas",
    page: "bg-[repeating-linear-gradient(180deg,#14532d_0px,#14532d_34px,#facc15_34px,#facc15_44px,#166534_44px,#166534_82px)]",
    primaryButton: "bg-emerald-500 hover:bg-emerald-400",
    accentBadge: "bg-emerald-300/20 text-emerald-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#14532d_0px,#14532d_30px,#facc15_30px,#facc15_38px,#166534_38px,#166534_72px)] border-yellow-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-yellow-300/20 to-emerald-500/10 border-yellow-200/30",
  },
  swans: {
    id: "swans",
    name: "Sydney Swans",
    page: "bg-[linear-gradient(180deg,#991b1b_0%,#991b1b_44%,#f8fafc_44%,#f8fafc_56%,#991b1b_56%,#991b1b_100%)]",
    primaryButton: "bg-red-500 hover:bg-red-400",
    accentBadge: "bg-red-300/20 text-red-100",
    trackLane: "bg-[linear-gradient(180deg,#991b1b_0%,#991b1b_44%,#f8fafc_44%,#f8fafc_56%,#991b1b_56%,#991b1b_100%)] border-red-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-red-300/20 to-slate-100/10 border-white/40",
  },
  giants: {
    id: "giants",
    name: "GWS Giants",
    page: "bg-[repeating-linear-gradient(180deg,#1f2937_0px,#1f2937_32px,#ea580c_32px,#ea580c_56px,#1f2937_56px,#1f2937_88px)]",
    primaryButton: "bg-orange-500 hover:bg-orange-400",
    accentBadge: "bg-orange-300/20 text-orange-100",
    trackLane: "bg-[repeating-linear-gradient(180deg,#1f2937_0px,#1f2937_28px,#ea580c_28px,#ea580c_48px,#1f2937_48px,#1f2937_76px)] border-orange-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-orange-300/20 to-slate-500/10 border-orange-200/30",
  },
  chrono: {
    id: "chrono",
    name: "Chrono Circuit",
    page: "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#164e63_100%)]",
    primaryButton: "bg-cyan-500 hover:bg-cyan-400",
    accentBadge: "bg-cyan-300/20 text-cyan-100",
    trackLane: "bg-slate-950/88 border-cyan-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(103,232,249,0.14)_0px,rgba(103,232,249,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-cyan-300/25 to-sky-500/10 border-cyan-200/30",
  },
  champion: {
    id: "champion",
    name: "Champion Crown",
    page: "bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_30%),linear-gradient(180deg,#111827_0%,#7f1d1d_46%,#f59e0b_100%)]",
    primaryButton: "bg-amber-500 hover:bg-amber-400",
    accentBadge: "bg-amber-300/20 text-amber-100",
    trackLane: "bg-red-950/85 border-amber-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(253,224,71,0.14)_0px,rgba(253,224,71,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-amber-300/25 to-red-500/10 border-amber-200/30",
  },
  streak: {
    id: "streak",
    name: "Streak Surge",
    page: "bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.16),transparent_28%),linear-gradient(180deg,#020617_0%,#052e16_42%,#164e63_100%)]",
    primaryButton: "bg-emerald-500 hover:bg-emerald-400",
    accentBadge: "bg-emerald-300/20 text-emerald-100",
    trackLane: "bg-emerald-950/85 border-emerald-300/20",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(74,222,128,0.14)_0px,rgba(74,222,128,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-emerald-300/25 to-cyan-500/10 border-emerald-200/30",
  },
  vault: {
    id: "vault",
    name: "Vault Glow",
    page: "bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.12)_0_2px,transparent_3px),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.12)_0_2px,transparent_3px),linear-gradient(135deg,#052e16_0%,#14532d_30%,#0f766e_55%,#a16207_80%,#fde68a_100%)]",
    primaryButton: "bg-emerald-500 hover:bg-emerald-400",
    accentBadge: "bg-emerald-300/20 text-emerald-100",
    trackLane: "bg-[linear-gradient(135deg,rgba(5,46,22,0.95),rgba(20,83,45,0.92),rgba(13,148,136,0.88))] border-emerald-300/24",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(167,243,208,0.14)_0px,rgba(167,243,208,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-emerald-300/25 to-amber-400/14 border-emerald-200/30",
  },
  auroraforge: {
    id: "auroraforge",
    name: "Aurora Forge",
    page: "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_2px,transparent_3px),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.1)_0_2px,transparent_3px),linear-gradient(135deg,#0f172a_0%,#164e63_24%,#0f766e_48%,#7c3aed_72%,#f472b6_100%)]",
    primaryButton: "bg-cyan-500 hover:bg-cyan-400",
    accentBadge: "bg-cyan-300/20 text-cyan-100",
    trackLane: "bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(22,78,99,0.92),rgba(124,58,237,0.88))] border-cyan-300/22",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(125,211,252,0.14)_0px,rgba(125,211,252,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-cyan-200/25 via-violet-300/18 to-pink-300/14 border-cyan-100/34",
  },
  prismaticlegend: {
    id: "prismaticlegend",
    name: "Prismatic Legend",
    page: "bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_18%,#14b8a6_36%,#7c3aed_54%,#ec4899_72%,#f59e0b_100%)]",
    primaryButton: "bg-fuchsia-500 hover:bg-fuchsia-400",
    accentBadge: "bg-white/18 text-white",
    trackLane: "bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(29,78,216,0.88),rgba(124,58,237,0.9))] border-white/26",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0px,rgba(255,255,255,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-pink-300/24 via-yellow-200/20 to-cyan-300/18 border-white/36",
  },
  timesurge: {
    id: "timesurge",
    name: "Time Surge",
    page: "bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.12)_0_2px,transparent_3px),linear-gradient(135deg,#020617_0%,#155e75_28%,#0ea5e9_56%,#22d3ee_100%)]",
    primaryButton: "bg-cyan-500 hover:bg-cyan-400",
    accentBadge: "bg-cyan-300/20 text-cyan-100",
    trackLane: "bg-[linear-gradient(135deg,rgba(2,6,23,0.96),rgba(21,94,117,0.9),rgba(14,165,233,0.86))] border-cyan-300/24",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(103,232,249,0.14)_0px,rgba(103,232,249,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-cyan-200/24 to-sky-300/14 border-cyan-100/34",
  },
  quantumcore: {
    id: "quantumcore",
    name: "Quantum Core",
    page: "bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.12)_0_2px,transparent_3px),linear-gradient(135deg,#020617_0%,#312e81_24%,#7c3aed_52%,#ec4899_100%)]",
    primaryButton: "bg-violet-500 hover:bg-violet-400",
    accentBadge: "bg-violet-300/20 text-violet-100",
    trackLane: "bg-[linear-gradient(135deg,rgba(2,6,23,0.96),rgba(49,46,129,0.9),rgba(124,58,237,0.88))] border-violet-300/24",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(196,181,253,0.14)_0px,rgba(196,181,253,0.14)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-violet-200/24 to-fuchsia-300/14 border-violet-100/34",
  },
  eternalglow: {
    id: "eternalglow",
    name: "Eternal Glow",
    page: "bg-[linear-gradient(135deg,#020617_0%,#0f766e_20%,#1d4ed8_40%,#7c3aed_62%,#ec4899_82%,#f59e0b_100%)]",
    primaryButton: "bg-white text-slate-950 hover:bg-slate-100",
    accentBadge: "bg-white/18 text-white",
    trackLane: "bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,118,110,0.9),rgba(124,58,237,0.88),rgba(236,72,153,0.86))] border-white/28",
    trackStripe: "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.16)_0px,rgba(255,255,255,0.16)_8px,transparent_8px,transparent_16px)]",
    trackFinish: "from-white/26 via-yellow-200/18 to-pink-300/16 border-white/40",
  },
};

const SPORT_THEME_MASCOT_NAMES = {
  broncos: "Broncos",
  raiders: "Raiders",
  bulldogs: "Bulldogs",
  sharks: "Sharks",
  dolphins: "Dolphins",
  titans: "Titans",
  seaeagles: "Sea Eagles",
  melbstorm: "Storm",
  knights: "Knights",
  warriors: "Warriors",
  cowboys: "Cowboys",
  eels: "Eels",
  panthers: "Panthers",
  rabbitohs: "Rabbitohs",
  dragons: "Dragons",
  roosters: "Roosters",
  tigers: "Tigers",
  matildas: "Matildas",
  swans: "Swans",
  giants: "Giants",
};

const progressionOrder = {
  addsub: [
    "AdS3",
    "AdS4",
    "AdS5",
    "AdS6",
    "AdS7",
    "AdS8",
    "AdS9",
    "AdS10"
  ],
  muldiv: [
    "MuS3",
    "MuS4",
    "MuS5-A",
    "MuS5-B",
    "MuS5-C",
    "MuS6",
    "MuS7-A",
    "MuS7-B",
    "MuS8",
    "MuS9"
  ],
  mixed: [
    "AdS3",
    "AdS4",
    "AdS5",
    "AdS6",
    "AdS7",
    "AdS8",
    "AdS9",
    "AdS10",
    "MuS3",
    "MuS4",
    "MuS5-A",
    "MuS5-B",
    "MuS5-C",
    "MuS6",
    "MuS7-A",
    "MuS7-B",
    "MuS8",
    "MuS9"
  ]
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getNextLevel(mode, currentLevel) {
  const levels = progressionOrder?.[mode];
  if (!Array.isArray(levels)) return null;
  const index = levels.indexOf(currentLevel);
  if (index === -1 || index === levels.length - 1) return null;
  return levels[index + 1];
}

function getPreviousLevel(mode, currentLevel) {
  const levels = progressionOrder?.[mode];
  if (!Array.isArray(levels)) return null;
  const index = levels.indexOf(currentLevel);
  if (index <= 0) return null;
  return levels[index - 1];
}

function readUserHistory() {
  const validAddSub = new Set(progressionOrder.addsub);
  const validMulDiv = new Set(progressionOrder.muldiv);

  if (typeof window === "undefined") {
    return { addsubLevel: "AdS3", muldivLevel: "MuS3" };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { addsubLevel: "AdS3", muldivLevel: "MuS3" };
    const parsed = JSON.parse(raw);
    const nextHistory = {
      addsubLevel: validAddSub.has(parsed.addsubLevel) ? parsed.addsubLevel : "AdS3",
      muldivLevel: validMulDiv.has(parsed.muldivLevel) ? parsed.muldivLevel : "MuS3",
    };
    if (nextHistory.addsubLevel !== parsed.addsubLevel || nextHistory.muldivLevel !== parsed.muldivLevel) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    }
    return nextHistory;
  } catch {
    return { addsubLevel: "AdS3", muldivLevel: "MuS3" };
  }
}

function writeUserHistory(history) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function readTestingScores() {
  if (typeof window === "undefined") {
    return { addsubScore: null, muldivScore: null };
  }
  try {
    const raw = window.localStorage.getItem(TESTING_SCORE_STORAGE_KEY);
    if (!raw) return { addsubScore: null, muldivScore: null };
    const parsed = JSON.parse(raw);
    return {
      addsubScore: typeof parsed.addsubScore === "number" ? parsed.addsubScore : null,
      muldivScore: typeof parsed.muldivScore === "number" ? parsed.muldivScore : null,
    };
  } catch {
    return { addsubScore: null, muldivScore: null };
  }
}

function writeTestingScores(scores) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TESTING_SCORE_STORAGE_KEY, JSON.stringify(scores));
}

function readTestingUnlock() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(TESTING_UNLOCK_STORAGE_KEY) === "true";
}

function writeTestingUnlock(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TESTING_UNLOCK_STORAGE_KEY, value ? "true" : "false");
}

function tipFromQuestion(q) {
  if (q.strategy) return q.strategy;
  if (q.op === "+") return "Try breaking one number into friendly parts and add in chunks.";
  if (q.op === "-") return "Try counting back in parts or using the difference between the numbers.";
  if (q.op === "×") return "Think about known facts first, then use doubles or place value to help.";
  if (q.op === "÷") return "Use multiplication facts you know to work backwards to the answer.";
  return "Look for an easier mental strategy, such as partitioning, doubles, or friendly numbers.";
}

function makeQuestion(prompt, answer, meta = {}) {
  return { prompt, answer: String(answer), ...meta };
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

function reduceFraction(num, den) {
  const divisor = gcd(num, den);
  const sign = den < 0 ? -1 : 1;
  return {
    num: (num / divisor) * sign,
    den: Math.abs(den / divisor),
  };
}

function fractionToString(num, den) {
  const reduced = reduceFraction(num, den);
  return reduced.den === 1 ? String(reduced.num) : `${reduced.num}/${reduced.den}`;
}

function parseFractionValue(text) {
  const cleaned = String(text || "").trim().toLowerCase().split(" ").join("");
  if (!cleaned) return null;

  if (cleaned.includes("/")) {
    const parts = cleaned.split("/");
    if (parts.length !== 2) return null;
    const num = Number(parts[0]);
    const den = Number(parts[1]);
    if (!Number.isInteger(num) || !Number.isInteger(den) || den === 0) return null;
    return reduceFraction(num, den);
  }

  const whole = Number(cleaned);
  if (Number.isInteger(whole)) {
    return { num: whole, den: 1 };
  }

  return null;
}

function answersMatch(userAnswer, expectedAnswer) {
  const user = String(userAnswer || "").trim().toLowerCase();
  const expected = String(expectedAnswer || "").trim().toLowerCase();

  if (expected.includes(",")) {
    const userParts = user.replaceAll(",", " ").split(" ").filter(Boolean);
    const expectedParts = expected.replaceAll(",", " ").split(" ").filter(Boolean);
    return userParts.length === expectedParts.length && userParts.every((part, index) => part === expectedParts[index]);
  }

  const userFraction = parseFractionValue(user);
  const expectedFraction = parseFractionValue(expected);
  if (userFraction && expectedFraction) {
    return userFraction.num === expectedFraction.num && userFraction.den === expectedFraction.den;
  }

  const normalisedUser = user.split(" ").filter(Boolean).join(" ");
  const normalisedExpected = expected.split(" ").filter(Boolean).join(" ");
  return normalisedUser === normalisedExpected;
}

function buildAds10Question(isAddition) {
  const allowedDenominators = [2, 5, 10, 25, 50];

  while (true) {
    const d1 = choice(allowedDenominators);
    const d2 = choice(allowedDenominators.filter((d) => d !== d1));
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    const commonDenominator = Math.abs((d1 * d2) / gcd(d1, d2));
    const scaled1 = n1 * (commonDenominator / d1);
    const scaled2 = n2 * (commonDenominator / d2);

    if (!isAddition && scaled1 <= scaled2) {
      continue;
    }

    const numerator = isAddition ? scaled1 + scaled2 : scaled1 - scaled2;
    const prompt = `${n1}/${d1} ${isAddition ? "+" : "-"} ${n2}/${d2}`;
    const answer = fractionToString(numerator, commonDenominator);

    return makeQuestion(prompt, answer, {
      op: isAddition ? "+" : "-",
      strategy: "Rename both fractions with a common denominator first.",
    });
  }
}

function build2DigitAddition(requireTrade) {
  while (true) {
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    const hasTrade = (a % 10) + (b % 10) >= 10;
    if (hasTrade === requireTrade) return [a, b];
  }
}

function build2DigitSubtraction(requireTrade) {
  while (true) {
    const a = randInt(20, 99);
    const b = randInt(10, a - 1);
    const hasTrade = (a % 10) < (b % 10);
    if (hasTrade === requireTrade) return [a, b];
  }
}

function build3DigitAddition(requireTrade) {
  while (true) {
    const a = randInt(100, 999);
    const b = randInt(100, 999);
    const onesTrade = (a % 10) + (b % 10) >= 10;
    const tensTrade = Math.floor((a % 100) / 10) + Math.floor((b % 100) / 10) >= 10;
    const hasTrade = onesTrade || tensTrade;
    if (hasTrade === requireTrade) return [a, b];
  }
}

function build3DigitSubtraction(requireTrade) {
  while (true) {
    const a = randInt(200, 999);
    const b = randInt(100, a - 1);
    const onesTrade = (a % 10) < (b % 10);
    const tensTrade = Math.floor((a % 100) / 10) < Math.floor((b % 100) / 10);
    const hasTrade = onesTrade || tensTrade;
    if (hasTrade === requireTrade) return [a, b];
  }
}

function buildFactQuestion(factors) {
  const factor = choice(factors);
  const other = randInt(1, 12);
  const product = factor * other;
  const options = [
    () => makeQuestion(`${factor} × ${other}`, product, { op: "×", strategy: "Use known multiplication facts and inverse relationships." }),
    () => makeQuestion(`${other} × ${factor}`, product, { op: "×", strategy: "Turn the factors around if that fact is easier to recall." }),
    () => makeQuestion(`${product} ÷ ${factor}`, other, { op: "÷", strategy: "Use the inverse multiplication fact." }),
    () => makeQuestion(`${factor} × ___ = ${product}`, other, { op: "×", strategy: "Use the inverse relationship to find the missing factor." }),
  ];
  return choice(options)();
}

function buildCleanDecimalMultiplyQuestion() {
  const presets = [
    { multiplier: 0.1, bases: [10, 20, 30, 40, 50, 60, 70, 80] },
    { multiplier: 0.25, bases: [4, 8, 12, 16, 20, 24, 28, 40] },
    { multiplier: 0.5, bases: [2, 4, 6, 8, 10, 12, 14, 16, 20, 24] },
    { multiplier: 0.75, bases: [4, 8, 12, 16, 20, 24, 28, 40] },
    { multiplier: 1.5, bases: [2, 4, 6, 8, 10, 12, 14, 16, 20] },
    { multiplier: 2.5, bases: [2, 4, 6, 8, 10, 12, 16, 20] },
  ];
  const preset = choice(presets);
  const base = choice(preset.bases);
  return makeQuestion(`${base} × ${preset.multiplier}`, String(base * preset.multiplier), {
    op: "×",
    strategy: "Use benchmark multipliers like 0.5, 0.25, 1.5 or 2.5 and relate them to halves or quarters.",
  });
}

function buildCleanDecimalDivisionQuestion() {
  const presets = [
    { divisor: 0.1, quotients: [10, 20, 30, 40, 50] },
    { divisor: 0.25, quotients: [4, 8, 12, 16, 20] },
    { divisor: 0.5, quotients: [2, 4, 6, 8, 10, 12, 16] },
    { divisor: 0.75, quotients: [4, 8, 12, 16, 20] },
    { divisor: 1.5, quotients: [2, 4, 6, 8, 10, 12] },
    { divisor: 2.5, quotients: [2, 4, 6, 8, 10, 12] },
  ];
  const preset = choice(presets);
  const quotient = choice(preset.quotients);
  const dividend = preset.divisor * quotient;
  return makeQuestion(`${dividend} ÷ ${preset.divisor}`, String(quotient), {
    op: "÷",
    strategy: "Use known decimal divisors and inverse multiplication facts.",
  });
}

function generateAddSub(level) {
  switch (level) {
    case "AdS3": {
      const options = [
        () => {
          const a = randInt(0, 10);
          const b = randInt(0, 10 - a);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Use known number facts to 10." });
        },
        () => {
          const total = 10;
          const sub = randInt(0, 10);
          return makeQuestion(`${total} - ${sub}`, total - sub, { op: "-", strategy: "Think about the missing part needed to make 10." });
        },
        () => {
          const total = randInt(1, 10);
          const sub = randInt(0, total);
          return makeQuestion(`${total} - ${sub}`, total - sub, { op: "-", strategy: "Use subtraction facts within 10." });
        },
      ];
      return choice(options)();
    }
    case "AdS4": {
      const options = [
        () => {
          const a = randInt(1, 9);
          const b = randInt(1, 10 - a);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Use known facts within 10." });
        },
        () => {
          const a = randInt(7, 12);
          const b = randInt(1, 15 - a);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Count on from the larger number." });
        },
        () => {
          const a = randInt(11, 19);
          const b = randInt(1, 20 - a);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Bridge to 20 if helpful." });
        },
        () => {
          const a = randInt(1, 19);
          return makeQuestion(`${a} + ${20 - a}`, 20, { op: "+", strategy: "Use friends of 20." });
        },
        () => {
          const a = randInt(1, 19);
          return makeQuestion(`20 = ${a} + ___`, 20 - a, { op: "+", strategy: "Think about the missing part needed to make 20." });
        },
        () => {
          const a = randInt(1, 19);
          return makeQuestion(`___ + ${a} = 20`, 20 - a, { op: "+", strategy: "Find the number that completes 20." });
        },
      ];
      return choice(options)();
    }
    case "AdS5": {
      const options = [
        () => {
          const total = 10;
          const sub = randInt(0, total);
          return makeQuestion(`${total} - ${sub}`, total - sub, { op: "-", strategy: "Use subtraction facts within 10." });
        },
        () => {
          const total = 15;
          const sub = randInt(0, total);
          return makeQuestion(`${total} - ${sub}`, total - sub, { op: "-", strategy: "Count back or think about the missing part." });
        },
        () => {
          const total = randInt(6, 20);
          const sub = randInt(0, total);
          return makeQuestion(`${total} - ${sub}`, total - sub, { op: "-", strategy: "Use the difference between the numbers." });
        },
        () => {
          const answer = randInt(0, 20);
          return makeQuestion(`${answer} = 20 - ___`, 20 - answer, { op: "-", strategy: "Think about what must be taken away from 20." });
        },
        () => {
          const answer = randInt(0, 20);
          return makeQuestion(`20 - ___ = ${answer}`, 20 - answer, { op: "-", strategy: "Find the missing subtrahend by thinking about the gap to 20." });
        },
      ];
      return choice(options)();
    }
    case "AdS6": {
      const options = [
        () => {
          const a = randInt(11, 19);
          const b = randInt(11, 19);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Bridge to 10 or 20 by splitting one addend." });
        },
        () => {
          const total = randInt(11, 19);
          const sub = randInt(2, 9);
          return makeQuestion(`${total} - ${sub}`, total - sub, { op: "-", strategy: "Bridge through 10 to subtract mentally." });
        },
        () => {
          const a = randInt(6, 9);
          const b = a + choice([-1, 1]);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Use doubles or near doubles." });
        },
        () => {
          const whole = randInt(11, 20);
          const part = randInt(1, whole - 1);
          return makeQuestion(`${whole} = ${part} + ___`, whole - part, { op: "+", strategy: "Use part-part-whole to find the missing part." });
        },
        () => {
          const whole = randInt(11, 20);
          const answer = randInt(1, whole - 1);
          return makeQuestion(`${answer} = ${whole} - ___`, whole - answer, { op: "-", strategy: "Use part-part-whole to find what was removed." });
        },
      ];
      return choice(options)();
    }
    case "AdS7": {
      const options = [
        () => {
          const base = randInt(2, 8) * 10 + choice([5, 15]);
          const first = randInt(1, 8);
          const second = 10 - first;
          return makeQuestion(`${base} + ${first} + ${second}`, base + first + second, { op: "+", strategy: "Bridge the decade by making the next ten first." });
        },
        () => {
          const [a, b] = build2DigitAddition(false);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Add tens and ones separately. No trading is needed." });
        },
        () => {
          const [a, b] = build2DigitAddition(true);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Add tens and ones, then trade when the ones pass 10." });
        },
        () => {
          const ones = randInt(2, 9);
          const tens = randInt(3, 8) * 10;
          const total = tens + ones;
          const first = randInt(1, ones - 1);
          const second = ones - first;
          return makeQuestion(`${total} - ${first} - ${second}`, total - first - second, { op: "-", strategy: "Subtract to the nearest ten first." });
        },
        () => {
          const [a, b] = build2DigitSubtraction(true);
          return makeQuestion(`${a} - ${b}`, a - b, { op: "-", strategy: "Subtract tens and ones carefully, trading mentally if needed." });
        },
      ];
      return choice(options)();
    }
    case "AdS8": {
      const options = [
        () => {
          const [a, b] = build3DigitAddition(false);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Think in hundreds, tens and ones separately." });
        },
        () => {
          const [a, b] = build3DigitAddition(true);
          return makeQuestion(`${a} + ${b}`, a + b, { op: "+", strategy: "Use column-style mental thinking and trade carefully." });
        },
        () => {
          const [a, b] = build3DigitSubtraction(false);
          return makeQuestion(`${a} - ${b}`, a - b, { op: "-", strategy: "Subtract each place value separately." });
        },
        () => {
          const [a, b] = build3DigitSubtraction(true);
          return makeQuestion(`${a} - ${b}`, a - b, { op: "-", strategy: "Trade across place value when needed." });
        },
      ];
      return choice(options)();
    }
    case "AdS9": {
      const options = [
        () => {
          const a = (randInt(100, 999) / 100).toFixed(2);
          const b = (randInt(100, 999) / 100).toFixed(2);
          return makeQuestion(`${a} + ${b}`, (parseFloat(a) + parseFloat(b)).toFixed(2), { op: "+", strategy: "Line up tenths and hundredths mentally." });
        },
        () => {
          const a = (randInt(10, 99) / 10).toFixed(1);
          const b = (randInt(10, 99) / 10).toFixed(1);
          return makeQuestion(`${a} + ${b}`, (parseFloat(a) + parseFloat(b)).toFixed(1), { op: "+", strategy: "Think about ones and tenths separately." });
        },
        () => {
          const a = randInt(200, 999) / 100;
          const b = randInt(100, Math.floor(a * 100)) / 100;
          return makeQuestion(`${a.toFixed(2)} - ${b.toFixed(2)}`, (a - b).toFixed(2), { op: "-", strategy: "Think about whole numbers first, then decimals." });
        },
        () => {
          const a = randInt(20, 99) / 10;
          const b = randInt(10, Math.floor(a * 10)) / 10;
          return makeQuestion(`${a.toFixed(1)} - ${b.toFixed(1)}`, (a - b).toFixed(1), { op: "-", strategy: "Use place value and subtract tenths carefully." });
        },
      ];
      return choice(options)();
    }
    case "AdS10": {
      const options = [
        () => buildAds10Question(true),
        () => buildAds10Question(true),
        () => buildAds10Question(true),
        () => buildAds10Question(false),
        () => buildAds10Question(false),
      ];
      return choice(options)();
    }
    default:
      return makeQuestion(`7 + 5`, 12, { op: "+" });
  }
}

function generateMulDiv(level) {
  switch (level) {
    case "MuS3": {
      const options = [
        () => {
          const start = choice([0, 1, 2, 5, 10, 12]);
          const step = choice([2, 5, 10]);
          const terms = [start, start + step, start + 2 * step, start + 3 * step];
          return makeQuestion(`${terms[0]}, ${terms[1]}, ${terms[2]}, ${terms[3]}, ____`, start + 4 * step, { op: "×", strategy: "Keep skip counting by the same amount." });
        },
        () => {
          const value = choice([2, 5, 10]);
          const groups = randInt(2, 5);
          return makeQuestion(Array(groups).fill(value).join(" + "), value * groups, { op: "×", strategy: "Treat repeated addition as skip counting." });
        },
        () => {
          const value = choice([2, 5, 10]);
          const groups = randInt(2, 5);
          return makeQuestion(`${value * groups} - ${value} - ${value}`, value * (groups - 2), { op: "-", strategy: "Treat repeated subtraction as equal jumps backwards." });
        },
        () => {
          const groups = randInt(2, 5);
          const size = randInt(2, 5);
          return makeQuestion(`${groups} groups of ${size}`, groups * size, { op: "×", strategy: "Think of each group as the same size and count by groups." });
        },
      ];
      return choice(options)();
    }
    case "MuS4": {
      const options = [
        () => {
          const value = randInt(2, 5);
          const groups = randInt(2, 5);
          return makeQuestion(Array(groups).fill(value).join(" + "), value * groups, { op: "×", strategy: "Use skip counting to combine equal parts quickly." });
        },
        () => {
          const groups = randInt(2, 6);
          const size = randInt(2, 10);
          return makeQuestion(`${groups} groups of ${size}`, groups * size, { op: "×", strategy: "Skip count by the size of each group." });
        },
        () => {
          const size = choice([2, 5, 10]);
          const count = randInt(2, 10);
          return makeQuestion(`What is the product of ${count} and ${size}?`, count * size, { op: "×", strategy: "Product means the answer to a multiplication question." });
        },
        () => {
          const size = choice([2, 3, 4, 5, 10]);
          const count = randInt(2, 10);
          return makeQuestion(`${count} ${size}s`, count * size, { op: "×", strategy: "Think about how many equal groups of that size there are." });
        },
        () => {
          const people = choice([2, 3, 4, 5, 6]);
          const share = randInt(2, 6);
          const total = people * share;
          return makeQuestion(`${total} shared between ${people}`, share, { op: "÷", strategy: "Build the total by skip counting from the quotient." });
        },
      ];
      return choice(options)();
    }
    case "MuS5-A":
      return buildFactQuestion([2, 5, 10]);
    case "MuS5-B":
      return buildFactQuestion([2, 3, 4, 5, 10]);
    case "MuS5-C":
      return buildFactQuestion([6, 7, 8, 9]);
    case "MuS6": {
      const options = [
        () => {
          const a = randInt(2, 9);
          const b = randInt(2, 12);
          return makeQuestion(`${a} × ___ = ${a * b}`, b, { op: "×", strategy: "Use the inverse relationship of multiplication and division." });
        },
        () => {
          const dividend = choice([24, 36, 48, 54, 63, 72, 81, 96]);
          const quotient = choice([3, 4, 6, 8, 9, 12]);
          if (dividend % quotient !== 0) {
            return makeQuestion(`81 ÷ ___ = 9`, 9, { op: "÷", strategy: "Use multiplication facts to find the missing number." });
          }
          return makeQuestion(`${dividend} ÷ ___ = ${quotient}`, dividend / quotient, { op: "÷", strategy: "Use multiplication facts to find the missing number." });
        },
        () => {
          const a = randInt(2, 9);
          const b = randInt(2, 12);
          return makeQuestion(`What is the product of ${a} and ${b}?`, a * b, { op: "×", strategy: "Know that product means the answer to a multiplication question." });
        },
        () => {
          const factor = choice([3, 4, 5, 6]);
          const start = randInt(1, 5);
          return makeQuestion(`Find the next 3 multiples of ${factor} after ${factor * start}`, `${factor * (start + 1)}, ${factor * (start + 2)}, ${factor * (start + 3)}`, { op: "×", strategy: "Keep skip counting by the same multiple." });
        },
        () => {
          const factor = choice([2, 3, 4, 5, 6, 7]);
          const number = choice([24, 30, 35, 42, 48, 49]);
          return makeQuestion(`Is ${factor} a factor of ${number}? (yes/no)`, number % factor === 0 ? "yes" : "no", { op: "÷", strategy: "Check whether the division is exact with no remainder." });
        },
      ];
      return choice(options)();
    }
    case "MuS7-A": {
      const factor = choice([11, 12]);
      const other = randInt(1, 12);
      const product = factor * other;
      const options = [
        () => makeQuestion(`${factor} × ${other}`, product, { op: "×", strategy: "Build automatic recall for 11 and 12 facts." }),
        () => makeQuestion(`${product} ÷ ${factor}`, other, { op: "÷", strategy: "Use inverse relationships with 11 and 12 facts." }),
        () => makeQuestion(`${factor} × ___ = ${product}`, other, { op: "×", strategy: "Use inverse thinking to find the missing factor." }),
        () => makeQuestion(`${product} ÷ ___ = ${other}`, factor, { op: "÷", strategy: "Use the matching multiplication fact to find the missing divisor." }),
      ];
      return choice(options)();
    }
    case "MuS7-B": {
      const options = [
        () => {
          const a = randInt(3, 9);
          const b = choice([4, 6, 8, 10, 12, 14, 16, 18, 20]);
          return makeQuestion(`${a} × ${b} = ${a * 2} × ___`, b / 2, { op: "×", strategy: "Double one factor and halve the other to keep the product the same." });
        },
        () => {
          const a = randInt(3, 9);
          const b = choice([10, 25, 100]);
          return makeQuestion(`${a} × ${b}`, a * b, { op: "×", strategy: "Use benchmark numbers like 10, 25 and 100." });
        },
        () => {
          const a = randInt(3, 9);
          const b = randInt(11, 20);
          return makeQuestion(`${a} × ${b}`, a * b, { op: "×", strategy: "Decompose the 2-digit number into tens and ones." });
        },
        () => {
          const value = choice([300, 400, 600, 800, 900, 1200]);
          const divisor = choice([10, 100]);
          return makeQuestion(`${value} ÷ ${divisor}`, value / divisor, { op: "÷", strategy: "Use place value when dividing by 10 and 100." });
        },
        () => {
          const divisor = choice([2, 5, 10]);
          const answer = randInt(20, 90);
          return makeQuestion(`${divisor * answer} ÷ ${divisor}`, answer, { op: "÷", strategy: "Use flexible factor finding and partitioning with larger multiples." });
        },
      ];
      return choice(options)();
    }
    case "MuS8": {
      const options = [
        () => {
          const a = randInt(3, 9);
          const b = choice([30, 40, 50, 60, 70, 80, 90]);
          return makeQuestion(`${a} × ${b}`, a * b, { op: "×", strategy: "Use decomposition with place value for a decade multiplier." });
        },
        () => {
          const a = randInt(3, 9);
          const b = randInt(31, 98);
          return makeQuestion(`${a} × ${b}`, a * b, { op: "×", strategy: "Decompose the 2-digit factor into tens and ones." });
        },
        () => {
          const a = randInt(3, 9);
          const b = choice([98, 99, 101, 102]);
          return makeQuestion(`${a} × ${b}`, a * b, { op: "×", strategy: "Use 100 as a benchmark, then compensate." });
        },
        () => {
          const a = choice([120, 130, 140, 160, 170, 180, 210, 230, 240, 270, 320, 360, 450]);
          const b = randInt(3, 9);
          return makeQuestion(`${a} × ${b}`, a * b, { op: "×", strategy: "Decompose the 3-digit decade number by place value parts." });
        },
        () => {
          const divisor = choice([4, 6, 8]);
          const tensMultiplier = choice(divisor === 4 ? [5, 10, 15, 20, 25, 30] : divisor === 6 ? [5, 10, 15, 20, 25, 30] : [5, 10, 15, 20, 25, 30]);
          const tensChunk = divisor * tensMultiplier;
          const onesChunk = divisor * randInt(2, 9);
          const total = tensChunk + onesChunk;
          return makeQuestion(`${total} ÷ ${divisor}`, total / divisor, { op: "÷", strategy: "Use decomposition and known multiplication chunks." });
        },
        () => {
          const addPart = randInt(90, 240);
          const divisor = choice([2, 3, 4, 6, 8]);
          const quotient = randInt(6, 24);
          const divPart = divisor * quotient;
          return makeQuestion(`${addPart} + ${divPart} ÷ ${divisor}`, addPart + quotient, { op: "÷", strategy: "Apply BODMAS: do division before addition." });
        },
      ];
      return choice(options)();
    }
    case "MuS9": {
      const options = [
        () => {
          const root = choice([1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]);
          return makeQuestion(`√${root}`, Math.sqrt(root), { op: "×", strategy: "Recall square numbers and their matching roots." });
        },
        () => {
          const a = choice([1, 4, 9, 16, 25]);
          const b = choice([1, 4, 9, 16, 25]);
          return makeQuestion(`√${a} + √${b}`, Math.sqrt(a) + Math.sqrt(b), { op: "+", strategy: "Solve each root first, then add." });
        },
        () => {
          const n = randInt(2, 12);
          return makeQuestion(`${n}²`, n * n, { op: "×", strategy: "Use square number knowledge." });
        },
        () => buildCleanDecimalMultiplyQuestion(),
        () => buildCleanDecimalDivisionQuestion(),
        () => {
          const pct = choice([10, 25, 50]);
          const total = choice([200, 400, 800, 1200, 2000]);
          return makeQuestion(`${pct}% of ${total}`, (pct / 100) * total, { op: "×", strategy: "Use common percentage facts such as 10%, 25% and 50%." });
        },
      ];
      return choice(options)();
    }
    default:
      return makeQuestion(`2, 12, 22, 32, ____`, 42, { op: "×", strategy: "Keep skip counting by 10." });
  }
}

function generateQuestion(mode, level) {
  if (mode === "addsub") return generateAddSub(level);
  if (mode === "muldiv") return generateMulDiv(level);
  if (mode === "mixed") {
    if (level && typeof level === "object") {
      const addLevel = level.addsubLevel || "AdS3";
      const mulLevel = level.muldivLevel || "MuS3";
      return Math.random() < 0.5 ? generateAddSub(addLevel) : generateMulDiv(mulLevel);
    }
    if (typeof level === "string" && level.startsWith("AdS")) return generateAddSub(level);
    if (typeof level === "string") return generateMulDiv(level);
    return Math.random() < 0.5 ? generateAddSub("AdS3") : generateMulDiv("MuS3");
  }
  return generateAddSub("AdS3");
}

function buildRound(mode, level, questionCount = DEFAULT_QUESTION_COUNT) {
  const questions = [];
  for (let i = 0; i < questionCount; i++) {
    questions.push(generateQuestion(mode, level));
  }
  return questions;
}



const SHOP_CATEGORIES = [
  { id: "emoji", label: "Emoji", icon: Cat },
  { id: "background", label: "Background", icon: Palette },
  { id: "ring", label: "Ring", icon: Sparkles },
  { id: "upgrades", label: "Upgrades and Themes", icon: CircleDollarSign },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

const ACHIEVEMENT_SECTION_ORDER = ["upgrades", "emoji", "background", "ring"];
const ACHIEVEMENT_SECTION_LABELS = {
  upgrades: "Themes",
  emoji: "Icons",
  background: "Backgrounds",
  ring: "Rings",
};
const ACHIEVEMENT_METRIC_SORT_ORDER = {
  bestTimeTrialScore: 0,
  bestStreak: 1,
  raceWins: 2,
  totalCorrect: 3,
  coinsEarned: 4,
  coinsSpent: 5,
  timeSpentSeconds: 6,
};

function sortAchievementItems(items) {
  return [...(items || [])].sort((a, b) => {
    const metricDelta = (ACHIEVEMENT_METRIC_SORT_ORDER[a?.achievementMetric] ?? 99) - (ACHIEVEMENT_METRIC_SORT_ORDER[b?.achievementMetric] ?? 99);
    if (metricDelta !== 0) return metricDelta;
    const thresholdDelta = Number(a?.achievementThreshold || 0) - Number(b?.achievementThreshold || 0);
    if (thresholdDelta !== 0) return thresholdDelta;
    return String(a?.name || "").localeCompare(String(b?.name || ""));
  });
}

const ACHIEVEMENT_SHOP_ITEMS = [
  { id: "ach-emoji-10m", category: "emoji", name: "Spark Scout", cost: 0, emoji: "🛼", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 10 * 60, detail: "Play for 10 minutes total" },
  { id: "ach-emoji-30m", category: "emoji", name: "Sky Rider", cost: 0, emoji: "🛸", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 30 * 60, detail: "Play for 30 minutes total" },
  { id: "ach-emoji-1h", category: "emoji", name: "Neon Dino", cost: 0, emoji: "🦖", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 60 * 60, detail: "Play for 1 hour total" },
  { id: "ach-emoji-3h", category: "emoji", name: "Target Master", cost: 0, emoji: "🎯", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 3 * 60 * 60, detail: "Play for 3 hours total" },
  { id: "ach-emoji-5h", category: "emoji", name: "Rainbow Rebel", cost: 0, emoji: "🌈", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 5 * 60 * 60, detail: "Play for 5 hours total" },
  { id: "ach-emoji-10h", category: "emoji", name: "Brain King", cost: 0, emoji: "🧠", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 10 * 60 * 60, detail: "Play for 10 hours total" },
  { id: "ach-emoji-25h", category: "emoji", name: "Midnight Meteor", cost: 0, emoji: "☄️", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 24 * 60 * 60, detail: "Play for 1 day total" },
  { id: "ach-emoji-50h", category: "emoji", name: "Galaxy Crown", cost: 0, emoji: "👾", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 50 * 60 * 60, detail: "Play for 50 hours total" },

  { id: "ach-ring-100", category: "ring", name: "Century Ring", cost: 0, style: "ring-4 ring-cyan-300/90 shadow-[0_0_24px_rgba(125,211,252,0.42)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 100, detail: "Answer 100 questions correctly" },
  { id: "ach-ring-500", category: "ring", name: "Burst Ring", cost: 0, style: "ring-4 ring-emerald-300/90 shadow-[0_0_26px_rgba(74,222,128,0.44)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 500, detail: "Answer 500 questions correctly" },
  { id: "ach-ring-1000", category: "ring", name: "Master Ring", cost: 0, style: "ring-4 ring-violet-300/90 shadow-[0_0_28px_rgba(196,181,253,0.46)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 1000, detail: "Answer 1000 questions correctly" },
  { id: "ach-ring-2500", category: "ring", name: "Galaxy Ring", cost: 0, style: "ring-4 ring-fuchsia-300/90 shadow-[0_0_30px_rgba(232,121,249,0.48)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 2500, detail: "Answer 2500 questions correctly" },
  { id: "ach-ring-5000", category: "ring", name: "Legend Ring", cost: 0, style: "ring-4 ring-amber-200/95 shadow-[0_0_34px_rgba(251,191,36,0.52)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 5000, detail: "Answer 5000 questions correctly" },
  { id: "ach-ring-10000", category: "ring", name: "Pulse Nova Ring", cost: 0, style: "ring-4 ring-pink-200/95 shadow-[0_0_38px_rgba(244,114,182,0.58)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 10000, detail: "Answer 10000 questions correctly" },
  { id: "ach-ring-25000", category: "ring", name: "Eclipse Crown Ring", cost: 0, style: "ring-4 ring-white/95 shadow-[0_0_42px_rgba(255,255,255,0.62)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 25000, detail: "Answer 25000 questions correctly" },

  { id: "ach-bg-earned-500", category: "background", name: "Coin Trail", cost: 0, style: "bg-[linear-gradient(135deg,#1d4ed8_0%,#38bdf8_45%,#f8fafc_100%)]", achievementOnly: true, achievementMetric: "coinsEarned", achievementThreshold: 500, detail: "Earn 500 coins" },
  { id: "ach-bg-earned-2000", category: "background", name: "Treasure Grid", cost: 0, style: "bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(135deg,#0f766e,#22c55e,#facc15)] bg-[length:16px_16px,16px_16px,100%_100%]", achievementOnly: true, achievementMetric: "coinsEarned", achievementThreshold: 2000, detail: "Earn 2000 coins" },
  { id: "ach-bg-earned-5000", category: "background", name: "Treasure Burst", cost: 0, style: "bg-[radial-gradient(circle_at_30%_30%,#fde68a_0%,#f59e0b_28%,#7c2d12_100%)]", achievementOnly: true, achievementMetric: "coinsEarned", achievementThreshold: 5000, detail: "Earn 5000 coins" },
  { id: "ach-bg-earned-12000", category: "background", name: "Prism Vault", cost: 0, style: "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14)_0_2px,transparent_3px),radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.12)_0_2px,transparent_3px),linear-gradient(135deg,#1d4ed8_0%,#06b6d4_26%,#7c3aed_54%,#ec4899_78%,#f59e0b_100%)]", achievementOnly: true, achievementMetric: "coinsEarned", achievementThreshold: 12000, detail: "Earn 12000 coins" },
  { id: "ach-bg-spent-500", category: "background", name: "Collector Check", cost: 0, style: "bg-[linear-gradient(45deg,#0f172a_25%,transparent_25%,transparent_75%,#0f172a_75%,#0f172a),linear-gradient(45deg,#0f172a_25%,transparent_25%,transparent_75%,#0f172a_75%,#0f172a)] bg-[length:18px_18px] bg-[position:0_0,9px_9px] bg-emerald-600", achievementOnly: true, achievementMetric: "coinsSpent", achievementThreshold: 500, detail: "Spend 500 coins in the shop" },
  { id: "ach-bg-spent-2000", category: "background", name: "Collector Crown", cost: 0, style: "bg-[radial-gradient(circle_at_20%_20%,#ffffff_0_2px,transparent_3px),radial-gradient(circle_at_70%_35%,#ffffff_0_2px,transparent_3px),radial-gradient(circle_at_40%_75%,#ffffff_0_2px,transparent_3px),linear-gradient(135deg,#14532d,#a16207,#facc15)]", achievementOnly: true, achievementMetric: "coinsSpent", achievementThreshold: 2000, detail: "Spend 2000 coins in the shop" },
  { id: "ach-bg-spent-7500", category: "background", name: "Mythic Collector", cost: 0, style: "bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(135deg,#111827_0%,#7c3aed_30%,#0ea5e9_56%,#22c55e_78%,#fde68a_100%)] bg-[length:18px_18px,18px_18px,100%_100%]", achievementOnly: true, achievementMetric: "coinsSpent", achievementThreshold: 7500, detail: "Spend 7500 coins in the shop" },

  { id: "ach-theme-firstwin", category: "upgrades", name: "Victory Theme", cost: 0, detail: "Win your first race", themeId: "champion", permanentUnlock: true, achievementOnly: true, achievementMetric: "raceWins", achievementThreshold: 1 },
  { id: "ach-theme-race10", category: "upgrades", name: "Champion Theme", cost: 0, detail: "Win 10 races", themeId: "vault", permanentUnlock: true, achievementOnly: true, achievementMetric: "raceWins", achievementThreshold: 10 },
  { id: "ach-theme-race50", category: "upgrades", name: "Prismatic Legend Theme", cost: 0, detail: "Win 50 races", themeId: "prismaticlegend", permanentUnlock: true, achievementOnly: true, achievementMetric: "raceWins", achievementThreshold: 50 },
  { id: "ach-theme-tt20", category: "upgrades", name: "Chrono Theme", cost: 0, detail: "Score 20 correct in a Time Trial", themeId: "chrono", permanentUnlock: true, achievementOnly: true, achievementMetric: "bestTimeTrialScore", achievementThreshold: 20 },
  { id: "ach-theme-tt35", category: "upgrades", name: "Streak Theme", cost: 0, detail: "Score 35 correct in a Time Trial", themeId: "streak", permanentUnlock: true, achievementOnly: true, achievementMetric: "bestTimeTrialScore", achievementThreshold: 35 },
  { id: "ach-theme-tt45", category: "upgrades", name: "Aurora Forge Theme", cost: 0, detail: "Score 45 correct in a Time Trial", themeId: "auroraforge", permanentUnlock: true, achievementOnly: true, achievementMetric: "bestTimeTrialScore", achievementThreshold: 45 },
  { id: "ach-theme-tt60", category: "upgrades", name: "Time Surge Theme", cost: 0, detail: "Score 60 correct in a Time Trial", themeId: "timesurge", permanentUnlock: true, achievementOnly: true, achievementMetric: "bestTimeTrialScore", achievementThreshold: 60 },
  { id: "ach-theme-tt75", category: "upgrades", name: "Quantum Core Theme", cost: 0, detail: "Score 75 correct in a Time Trial", themeId: "quantumcore", permanentUnlock: true, achievementOnly: true, achievementMetric: "bestTimeTrialScore", achievementThreshold: 75 },
  { id: "ach-theme-tt100", category: "upgrades", name: "Eternal Glow Theme", cost: 0, detail: "Score 100 correct in a Time Trial", themeId: "eternalglow", permanentUnlock: true, achievementOnly: true, achievementMetric: "bestTimeTrialScore", achievementThreshold: 100 },
  { id: "ach-emoji-100h", category: "emoji", name: "Orbit Master", cost: 0, emoji: "🪐", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 100 * 60 * 60, detail: "Play for 100 hours total" },
  { id: "ach-emoji-150h", category: "emoji", name: "Deep Space", cost: 0, emoji: "🌌", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 168 * 60 * 60, detail: "Play for 1 week total" },
  { id: "ach-emoji-1month", category: "emoji", name: "Eternal Orbit", cost: 0, emoji: "🌍", rarity: "achievement", achievementOnly: true, achievementMetric: "timeSpentSeconds", achievementThreshold: 720 * 60 * 60, detail: "Play for 1 month total" },
  { id: "ach-ring-50000", category: "ring", name: "Solar Halo", cost: 0, style: "border-[4px] border-dashed border-cyan-100/95 outline outline-2 outline-offset-[3px] outline-cyan-300/60 shadow-[0_0_34px_rgba(186,230,253,0.55)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 50000, detail: "Answer 50000 questions correctly" },
  { id: "ach-ring-75000", category: "ring", name: "Infinity Halo", cost: 0, style: "border-[4px] border-double border-white/95 outline outline-2 outline-offset-[4px] outline-fuchsia-300/65 shadow-[0_0_40px_rgba(244,114,182,0.6)]", achievementOnly: true, achievementMetric: "totalCorrect", achievementThreshold: 75000, detail: "Answer 75000 questions correctly" },
  { id: "ach-bg-earned-24000", category: "background", name: "Vault Nebula", cost: 0, style: "bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.14)_0_2px,transparent_3px),radial-gradient(circle_at_78%_26%,rgba(255,255,255,0.12)_0_2px,transparent_3px),linear-gradient(135deg,#0f172a_0%,#0ea5e9_28%,#8b5cf6_62%,#f59e0b_100%)]", achievementOnly: true, achievementMetric: "coinsEarned", achievementThreshold: 24000, detail: "Earn 24000 coins" },
  { id: "ach-bg-earned-36000", category: "background", name: "Mythic Treasury", cost: 0, style: "bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(135deg,#020617_0%,#0ea5e9_22%,#10b981_48%,#8b5cf6_74%,#f472b6_100%)] bg-[length:20px_20px,20px_20px,100%_100%]", achievementOnly: true, achievementMetric: "coinsEarned", achievementThreshold: 36000, detail: "Earn 36000 coins" },
  { id: "ach-bg-spent-15000", category: "background", name: "Collector Prism", cost: 0, style: "bg-[radial-gradient(circle_at_28%_30%,rgba(255,255,255,0.18)_0_2px,transparent_3px),radial-gradient(circle_at_72%_36%,rgba(255,255,255,0.14)_0_2px,transparent_3px),linear-gradient(135deg,#111827_0%,#7c3aed_34%,#0ea5e9_68%,#facc15_100%)]", achievementOnly: true, achievementMetric: "coinsSpent", achievementThreshold: 15000, detail: "Spend 15000 coins in the shop" },
  { id: "ach-bg-spent-22500", category: "background", name: "Master Collector", cost: 0, style: "bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(135deg,#020617_0%,#1d4ed8_20%,#14b8a6_44%,#a855f7_70%,#f59e0b_100%)] bg-[length:18px_18px,18px_18px,100%_100%]", achievementOnly: true, achievementMetric: "coinsSpent", achievementThreshold: 22500, detail: "Spend 22500 coins in the shop" },
  { id: "ach-emoji-race100", category: "emoji", name: "Victory Meteor", cost: 0, emoji: "🏆", rarity: "achievement", achievementOnly: true, achievementMetric: "raceWins", achievementThreshold: 100, detail: "Win 100 races" },
  { id: "ach-emoji-race150", category: "emoji", name: "Track Titan", cost: 0, emoji: "🚀", rarity: "achievement", achievementOnly: true, achievementMetric: "raceWins", achievementThreshold: 150, detail: "Win 150 races" },
  { id: "ach-ring-streak15", category: "ring", name: "Dot Streak", cost: 0, style: "border-[4px] border-dotted border-sky-200/95 shadow-[0_0_22px_rgba(125,211,252,0.4)]", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 15, detail: "Get 15 correct in a row" },
  { id: "ach-bg-streak30", category: "background", name: "Focus Flow", cost: 0, style: "bg-[linear-gradient(135deg,#052e16_0%,#0f766e_36%,#22c55e_70%,#a7f3d0_100%)]", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 30, detail: "Get 30 correct in a row" },
  { id: "ach-emoji-streak50", category: "emoji", name: "Hot Hand", cost: 0, emoji: "🔥", rarity: "achievement", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 50, detail: "Get 50 correct in a row" },
  { id: "ach-ring-streak100", category: "ring", name: "Streak Circuit", cost: 0, style: "border-[4px] border-dashed border-emerald-200/95 shadow-[0_0_26px_rgba(110,231,183,0.45)]", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 100, detail: "Get 100 correct in a row" },
  { id: "ach-bg-streak150", category: "background", name: "Unbroken Wave", cost: 0, style: "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14)_0_2px,transparent_3px),linear-gradient(135deg,#0f172a_0%,#06b6d4_26%,#8b5cf6_58%,#ec4899_100%)]", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 150, detail: "Get 150 correct in a row" },
  { id: "ach-emoji-streak200", category: "emoji", name: "Precision Pulse", cost: 0, emoji: "🎯", rarity: "achievement", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 200, detail: "Get 200 correct in a row" },
  { id: "ach-ring-streak250", category: "ring", name: "Perfect Orbit", cost: 0, style: "border-[4px] border-double border-violet-100/95 outline outline-2 outline-offset-[3px] outline-fuchsia-300/55 shadow-[0_0_34px_rgba(216,180,254,0.58)]", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 250, detail: "Get 250 correct in a row" },
  { id: "ach-bg-streak500", category: "background", name: "Monolith Current", cost: 0, style: "bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(135deg,#020617_0%,#1d4ed8_24%,#14b8a6_48%,#7c3aed_72%,#ec4899_100%)] bg-[length:20px_20px,20px_20px,100%_100%]", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 500, detail: "Get 500 correct in a row" },
  { id: "ach-emoji-streak1000", category: "emoji", name: "Unbreakable", cost: 0, emoji: "🌟", rarity: "achievement", achievementOnly: true, achievementMetric: "bestStreak", achievementThreshold: 1000, detail: "Get 1000 correct in a row" },
];

const PROFILE_SHOP_ITEMS = [
  { id: "emoji-smile", category: "emoji", name: "Classic Smile", cost: 100, emoji: "🙂", rarity: "common" },
  { id: "emoji-cool", category: "emoji", name: "Cool Shades", cost: 120, emoji: "😎", rarity: "common" },
  { id: "emoji-party", category: "emoji", name: "Party Star", cost: 140, emoji: "🥳", rarity: "common" },
  { id: "emoji-wink", category: "emoji", name: "Quick Wink", cost: 160, emoji: "😉", rarity: "common" },
  { id: "emoji-laugh", category: "emoji", name: "Big Laugh", cost: 180, emoji: "😆", rarity: "common" },
  { id: "emoji-nerd", category: "emoji", name: "Nerd Mode", cost: 220, emoji: "🤓", rarity: "common" },
  { id: "emoji-fox", category: "emoji", name: "Fox", cost: 260, emoji: "🦊", rarity: "common" },
  { id: "emoji-koala", category: "emoji", name: "Koala", cost: 300, emoji: "🐨", rarity: "common" },
  { id: "emoji-kangaroo", category: "emoji", name: "Kangaroo", cost: 360, emoji: "🦘", rarity: "common" },
  { id: "emoji-panda", category: "emoji", name: "Panda", cost: 420, emoji: "🐼", rarity: "common" },
  { id: "emoji-owl", category: "emoji", name: "Night Owl", cost: 500, emoji: "🦉", rarity: "uncommon" },
  { id: "emoji-tiger", category: "emoji", name: "Tiger", cost: 650, emoji: "🐅", rarity: "uncommon" },
  { id: "emoji-unicorn", category: "emoji", name: "Unicorn", cost: 800, emoji: "🦄", rarity: "uncommon" },
  { id: "emoji-robot", category: "emoji", name: "Robot", cost: 950, emoji: "🤖", rarity: "uncommon" },
  { id: "emoji-octopus", category: "emoji", name: "Octopus", cost: 1100, emoji: "🐙", rarity: "uncommon" },
  { id: "emoji-croc", category: "emoji", name: "Croc", cost: 1300, emoji: "🐊", rarity: "uncommon" },
  { id: "emoji-dragon", category: "emoji", name: "Dragon", cost: 1500, emoji: "🐲", rarity: "rare" },
  { id: "emoji-ghost", category: "emoji", name: "Ghost", cost: 1700, emoji: "👻", rarity: "rare" },
  { id: "emoji-alien", category: "emoji", name: "Alien", cost: 1900, emoji: "👽", rarity: "rare" },
  { id: "emoji-fire", category: "emoji", name: "Fire Face", cost: 2200, emoji: "🤩", rarity: "rare" },
  { id: "emoji-astronaut", category: "emoji", name: "Astronaut", cost: 2500, emoji: "🧑‍🚀", rarity: "rare" },
  { id: "emoji-wizard", category: "emoji", name: "Wizard", cost: 2800, emoji: "🧙", rarity: "rare" },
  { id: "emoji-crowncat", category: "emoji", name: "Royal Cat", cost: 3200, emoji: "😺", rarity: "epic" },
  { id: "emoji-phoenix", category: "emoji", name: "Phoenix Mood", cost: 3600, emoji: "🐔", rarity: "epic" },
  { id: "emoji-squidking", category: "emoji", name: "Squid King", cost: 4000, emoji: "🦑", rarity: "epic" },
  { id: "emoji-cosmic", category: "emoji", name: "Cosmic Face", cost: 4300, emoji: "😶‍🌫️", rarity: "epic" },
  { id: "emoji-volcano", category: "emoji", name: "Volcano Vibe", cost: 4500, emoji: "🌋", rarity: "legendary" },
  { id: "emoji-lightning", category: "emoji", name: "Lightning Spirit", cost: 4700, emoji: "⚡", rarity: "legendary" },
  { id: "emoji-crown", category: "emoji", name: "Crowned Legend", cost: 4900, emoji: "👑", rarity: "legendary" },
  { id: "emoji-diamond", category: "emoji", name: "Diamond Icon", cost: 5000, emoji: "💎", rarity: "legendary" },
  { id: "emoji-lion", category: "emoji", name: "Lion", cost: 2600, emoji: "🦁", rarity: "rare" },
  { id: "emoji-hamster", category: "emoji", name: "Hamster", cost: 2700, emoji: "🐹", rarity: "rare" },
  { id: "emoji-whale", category: "emoji", name: "Whale", cost: 2800, emoji: "🐳", rarity: "rare" },
  { id: "emoji-peacock", category: "emoji", name: "Peacock", cost: 2900, emoji: "🦚", rarity: "rare" },
  { id: "emoji-sloth", category: "emoji", name: "Sloth", cost: 3000, emoji: "🦥", rarity: "rare" },
  { id: "emoji-rhino", category: "emoji", name: "Rhino", cost: 3100, emoji: "🦏", rarity: "epic" },
  { id: "emoji-llama", category: "emoji", name: "Llama", cost: 3200, emoji: "🦙", rarity: "epic" },
  { id: "emoji-goose", category: "emoji", name: "Goose", cost: 3300, emoji: "🪿", rarity: "epic" },
  { id: "emoji-swan", category: "emoji", name: "Swan", cost: 3400, emoji: "🕊️", rarity: "epic" },
  { id: "emoji-parrot", category: "emoji", name: "Parrot", cost: 3500, emoji: "🦜", rarity: "epic" },
  { id: "emoji-tornado", category: "emoji", name: "Tornado", cost: 3600, emoji: "🌪️", rarity: "epic" },
  { id: "emoji-soccer", category: "emoji", name: "Football Star", cost: 3700, emoji: "🥅", rarity: "epic" },
  { id: "emoji-footy", category: "emoji", name: "Footy Fan", cost: 3800, emoji: "🏉", rarity: "epic" },
  { id: "emoji-wolf", category: "emoji", name: "Wolf", cost: 3900, emoji: "🐺", rarity: "epic" },
  { id: "emoji-penguin", category: "emoji", name: "Penguin", cost: 4000, emoji: "🐧", rarity: "epic" },
  { id: "emoji-comet", category: "emoji", name: "Comet", cost: 4200, emoji: "☄️", rarity: "legendary" },
  { id: "emoji-rainbowstar", category: "emoji", name: "Rainbow Star", cost: 4400, emoji: "🌈", rarity: "legendary" },
  { id: "emoji-crystalball", category: "emoji", name: "Crystal Ball", cost: 4600, emoji: "🔮", rarity: "legendary" },
  { id: "emoji-medal", category: "emoji", name: "Gold Medal", cost: 4800, emoji: "🥇", rarity: "legendary" },
  { id: "emoji-fireball", category: "emoji", name: "Fireball", cost: 5000, emoji: "🔥", rarity: "legendary" },

  { id: "emoji-team-broncos", category: "emoji", name: "Broncos", cost: 2200, emoji: "🐎", rarity: "team" },
  { id: "emoji-team-raiders", category: "emoji", name: "Raiders", cost: 2200, emoji: "🪖", rarity: "team" },
  { id: "emoji-team-bulldogs", category: "emoji", name: "Bulldogs", cost: 2200, emoji: "🐶", rarity: "team" },
  { id: "emoji-team-sharks", category: "emoji", name: "Sharks", cost: 2200, emoji: "🦈", rarity: "team" },
  { id: "emoji-team-dolphins", category: "emoji", name: "Dolphins", cost: 2200, emoji: "🐬", rarity: "team" },
  { id: "emoji-team-titans", category: "emoji", name: "Titans", cost: 2200, emoji: "🔱", rarity: "team" },
  { id: "emoji-team-seaeagles", category: "emoji", name: "Sea Eagles", cost: 2200, emoji: "🦅", rarity: "team" },
  { id: "emoji-team-melbstorm", category: "emoji", name: "Storm", cost: 2200, emoji: "⛈️", rarity: "team" },
  { id: "emoji-team-knights", category: "emoji", name: "Knights", cost: 2200, emoji: "🛡️", rarity: "team" },
  { id: "emoji-team-warriors", category: "emoji", name: "Warriors", cost: 2200, emoji: "⚔️", rarity: "team" },
  { id: "emoji-team-cowboys", category: "emoji", name: "Cowboys", cost: 2200, emoji: "🤠", rarity: "team" },
  { id: "emoji-team-eels", category: "emoji", name: "Eels", cost: 2200, emoji: "🐍", rarity: "team" },
  { id: "emoji-team-panthers", category: "emoji", name: "Panthers", cost: 2200, emoji: "🐆", rarity: "team" },
  { id: "emoji-team-rabbitohs", category: "emoji", name: "Rabbitohs", cost: 2200, emoji: "🐇", rarity: "team" },
  { id: "emoji-team-dragons", category: "emoji", name: "Dragons", cost: 2200, emoji: "🐉", rarity: "team" },
  { id: "emoji-team-roosters", category: "emoji", name: "Roosters", cost: 2200, emoji: "🐓", rarity: "team" },
  { id: "emoji-team-tigers", category: "emoji", name: "Tigers", cost: 2200, emoji: "🐾", rarity: "team" },
  { id: "emoji-team-matildas", category: "emoji", name: "Matildas", cost: 2200, emoji: "⚽", rarity: "team" },
  { id: "emoji-team-swans", category: "emoji", name: "Swans", cost: 2200, emoji: "🦢", rarity: "team" },
  { id: "emoji-team-giants", category: "emoji", name: "Giants", cost: 2200, emoji: "🗿", rarity: "team" },

  { id: "bg-sky", category: "background", name: "Sky", cost: 50, style: "bg-sky-500" },
  { id: "bg-forest", category: "background", name: "Forest", cost: 60, style: "bg-green-600" },
  { id: "bg-rose", category: "background", name: "Rose", cost: 70, style: "bg-rose-500" },
  { id: "bg-violet", category: "background", name: "Violet", cost: 80, style: "bg-violet-600" },
  { id: "bg-ocean", category: "background", name: "Ocean", cost: 90, style: "bg-cyan-600" },
  { id: "bg-charcoal", category: "background", name: "Charcoal", cost: 100, style: "bg-slate-700" },
  { id: "bg-mint", category: "background", name: "Mint", cost: 120, style: "bg-emerald-500" },
  { id: "bg-sun", category: "background", name: "Sunbeam", cost: 140, style: "bg-yellow-400" },
  { id: "bg-lava", category: "background", name: "Lava", cost: 180, style: "bg-orange-600" },
  { id: "bg-berry", category: "background", name: "Berry", cost: 220, style: "bg-fuchsia-600" },
  { id: "bg-sand", category: "background", name: "Sand", cost: 260, style: "bg-amber-200" },
  { id: "bg-deepsea", category: "background", name: "Deep Sea", cost: 280, style: "bg-teal-800" },
  { id: "bg-sunset", category: "background", name: "Sunset", cost: 300, style: "bg-gradient-to-br from-yellow-300 via-orange-400 to-rose-500" },
  { id: "bg-aurora", category: "background", name: "Aurora", cost: 360, style: "bg-gradient-to-br from-emerald-300 via-cyan-400 to-blue-600" },
  { id: "bg-dusk", category: "background", name: "Dusk", cost: 420, style: "bg-gradient-to-br from-indigo-700 via-violet-600 to-pink-500" },
  { id: "bg-candy", category: "background", name: "Candy Swirl", cost: 500, style: "bg-gradient-to-br from-pink-300 via-fuchsia-400 to-purple-500" },
  { id: "bg-lagoon", category: "background", name: "Lagoon", cost: 650, style: "bg-gradient-to-br from-cyan-300 via-teal-400 to-blue-700" },
  { id: "bg-flame", category: "background", name: "Flame Fade", cost: 800, style: "bg-gradient-to-br from-amber-300 via-orange-500 to-red-700" },
  { id: "bg-rainbow", category: "background", name: "Rainbow", cost: 950, style: "bg-gradient-to-br from-red-400 via-yellow-300 via-green-400 to-blue-500" },
  { id: "bg-nebula", category: "background", name: "Nebula", cost: 1200, style: "bg-gradient-to-br from-slate-900 via-violet-700 to-fuchsia-500" },
  { id: "bg-ice", category: "background", name: "Ice Crystal", cost: 1500, style: "bg-gradient-to-br from-white via-sky-100 to-cyan-300" },
  { id: "bg-stripes-sea", category: "background", name: "Sea Stripes", cost: 1700, style: "bg-[repeating-linear-gradient(135deg,#0f766e_0px,#0f766e_10px,#155e75_10px,#155e75_20px)]" },
  { id: "bg-stripes-candy", category: "background", name: "Candy Stripes", cost: 1850, style: "bg-[repeating-linear-gradient(135deg,#f9a8d4_0px,#f9a8d4_10px,#f472b6_10px,#f472b6_20px)]" },
  { id: "bg-checker-midnight", category: "background", name: "Midnight Check", cost: 2100, style: "bg-[linear-gradient(45deg,#0f172a_25%,transparent_25%,transparent_75%,#0f172a_75%,#0f172a),linear-gradient(45deg,#0f172a_25%,transparent_25%,transparent_75%,#0f172a_75%,#0f172a)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] bg-slate-700" },
  { id: "bg-gold", category: "background", name: "Gold", cost: 2200, style: "bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600" },
  { id: "bg-honeycomb", category: "background", name: "Honeycomb", cost: 2400, style: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18)_0_18%,transparent_19%),linear-gradient(135deg,#f59e0b,#92400e)] bg-[length:22px_22px,100%_100%]" },
  { id: "bg-platinum", category: "background", name: "Platinum", cost: 2600, style: "bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500" },
  { id: "bg-pinstripe", category: "background", name: "Royal Pinstripe", cost: 2900, style: "bg-[repeating-linear-gradient(90deg,#312e81_0px,#312e81_8px,#4338ca_8px,#4338ca_11px)]" },
  { id: "bg-galaxy", category: "background", name: "Galaxy", cost: 3200, style: "bg-gradient-to-br from-slate-950 via-indigo-700 to-fuchsia-600" },
  { id: "bg-radial-bloom", category: "background", name: "Bloom", cost: 3400, style: "bg-[radial-gradient(circle_at_30%_30%,#f9a8d4_0%,#c084fc_35%,#1e1b4b_100%)]" },
  { id: "bg-opal", category: "background", name: "Opal", cost: 3800, style: "bg-gradient-to-br from-cyan-100 via-pink-200 to-violet-300" },
  { id: "bg-zebra-neon", category: "background", name: "Neon Zebra", cost: 4100, style: "bg-[repeating-linear-gradient(135deg,#0f172a_0px,#0f172a_9px,#22d3ee_9px,#22d3ee_15px,#e879f9_15px,#e879f9_24px)]" },
  { id: "bg-crown", category: "background", name: "Royal Velvet", cost: 4500, style: "bg-gradient-to-br from-purple-950 via-violet-700 to-amber-400" },
  { id: "bg-starlight", category: "background", name: "Starlight", cost: 4700, style: "bg-[radial-gradient(circle_at_20%_20%,#ffffff_0_2px,transparent_3px),radial-gradient(circle_at_70%_35%,#ffffff_0_2px,transparent_3px),radial-gradient(circle_at_40%_75%,#ffffff_0_2px,transparent_3px),linear-gradient(135deg,#0f172a,#4338ca,#a21caf)]" },
  { id: "bg-prismatic-grid", category: "background", name: "Prismatic Grid", cost: 4900, style: "bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(135deg,#38bdf8,#a78bfa,#f472b6)] bg-[length:18px_18px,18px_18px,100%_100%]" },
  { id: "bg-mythic", category: "background", name: "Mythic Shine", cost: 5000, style: "bg-gradient-to-br from-amber-200 via-white to-sky-300" },
  { id: "bg-broncos", category: "background", name: "Broncos Stripe", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#7f1d1d_0px,#7f1d1d_36px,#f59e0b_36px,#f59e0b_60px,#7f1d1d_60px,#7f1d1d_96px)]" },
  { id: "bg-raiders", category: "background", name: "Raiders Green", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#14532d_0px,#14532d_36px,#84cc16_36px,#84cc16_58px,#14532d_58px,#14532d_94px)]" },
  { id: "bg-bulldogs", category: "background", name: "Bulldogs Blue", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#1d4ed8_0px,#1d4ed8_34px,#f8fafc_34px,#f8fafc_52px,#1d4ed8_52px,#1d4ed8_86px)]" },
  { id: "bg-sharks", category: "background", name: "Sharks Steel", cost: 2200, style: "bg-[linear-gradient(180deg,#38bdf8_0%,#38bdf8_42%,#111827_42%,#111827_46%,#f8fafc_46%,#f8fafc_54%,#111827_54%,#111827_58%,#38bdf8_58%,#38bdf8_100%)]" },
  { id: "bg-dolphins", category: "background", name: "Dolphins Wave", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#9f1239_0px,#9f1239_36px,#fb7185_36px,#fb7185_60px,#9f1239_60px,#9f1239_96px)]" },
  { id: "bg-titans", category: "background", name: "Titans Coast", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#082f49_0px,#082f49_32px,#7dd3fc_32px,#7dd3fc_58px,#fde047_58px,#fde047_76px,#082f49_76px,#082f49_108px)]" },
  { id: "bg-stormclub", category: "background", name: "Storm Club", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#4c1d95_0px,#4c1d95_34px,#facc15_34px,#facc15_42px,#312e81_42px,#312e81_84px)]" },
  { id: "bg-knights", category: "background", name: "Knights Clash", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#7f1d1d_0px,#7f1d1d_24px,#1d4ed8_24px,#1d4ed8_42px,#7f1d1d_42px,#7f1d1d_66px)]" },
  { id: "bg-warriors", category: "background", name: "Warriors Pulse", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#111827_0px,#111827_30px,#2563eb_30px,#2563eb_40px,#dc2626_40px,#dc2626_48px,#a3e635_48px,#a3e635_58px,#facc15_58px,#facc15_68px,#111827_68px,#111827_104px)]" },
  { id: "bg-cowboys", category: "background", name: "Cowboys Gold", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#1e3a8a_0px,#1e3a8a_36px,#facc15_36px,#facc15_60px,#1e3a8a_60px,#1e3a8a_96px)]" },
  { id: "bg-eels", category: "background", name: "Eels Split", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#2563eb_0px,#2563eb_36px,#fde047_36px,#fde047_60px,#2563eb_60px,#2563eb_96px)]" },
  { id: "bg-panthers", category: "background", name: "Panthers Night", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#000000_0px,#000000_38px,#16a34a_38px,#16a34a_46px,#dc2626_46px,#dc2626_54px,#eab308_54px,#eab308_62px,#f8fafc_62px,#f8fafc_70px,#000000_70px,#000000_108px)]" },
  { id: "bg-rabbitohs", category: "background", name: "Rabbitohs Run", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#166534_0px,#166534_36px,#991b1b_36px,#991b1b_72px)]" },
  { id: "bg-dragons-v", category: "background", name: "Dragons V", cost: 2200, style: "bg-[linear-gradient(180deg,#f8fafc_0%,#f8fafc_44%,#dc2626_44%,#dc2626_58%,#f8fafc_58%,#f8fafc_100%)]" },
  { id: "bg-manly-v", category: "background", name: "Manly V", cost: 2200, style: "bg-[linear-gradient(180deg,#7f1d1d_0%,#7f1d1d_44%,#f8fafc_44%,#f8fafc_56%,#7f1d1d_56%,#7f1d1d_100%)]" },
  { id: "bg-roosters", category: "background", name: "Roosters Flight", cost: 2200, style: "bg-[linear-gradient(180deg,#082f49_0%,#082f49_42%,#f8fafc_42%,#f8fafc_46%,#dc2626_46%,#dc2626_50%,#2563eb_50%,#2563eb_54%,#f8fafc_54%,#f8fafc_58%,#082f49_58%,#082f49_100%)]" },
  { id: "bg-tigersclub", category: "background", name: "Tigers Clash", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#111827_0px,#111827_34px,#f97316_34px,#f97316_58px,#111827_58px,#111827_92px)]" },
  { id: "bg-matildas", category: "background", name: "Matildas Gold", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#14532d_0px,#14532d_34px,#facc15_34px,#facc15_46px,#166534_46px,#166534_88px)]" },
  { id: "bg-swans", category: "background", name: "Swans Red", cost: 2200, style: "bg-[linear-gradient(180deg,#991b1b_0%,#991b1b_44%,#f8fafc_44%,#f8fafc_56%,#991b1b_56%,#991b1b_100%)]" },
  { id: "bg-giants", category: "background", name: "Giants Orange", cost: 2200, style: "bg-[repeating-linear-gradient(180deg,#1f2937_0px,#1f2937_34px,#ea580c_34px,#ea580c_58px,#1f2937_58px,#1f2937_94px)]" },

  { id: "ring-moss", category: "ring", name: "Moss Ring", cost: 80, style: "ring-4 ring-green-400/80" },
  { id: "ring-sky", category: "ring", name: "Sky Ring", cost: 100, style: "ring-4 ring-sky-400/80" },
  { id: "ring-rose", category: "ring", name: "Rose Ring", cost: 120, style: "ring-4 ring-rose-400/80" },
  { id: "ring-violet", category: "ring", name: "Violet Ring", cost: 140, style: "ring-4 ring-violet-400/80" },
  { id: "ring-gold", category: "ring", name: "Gold Ring", cost: 220, style: "ring-4 ring-amber-300/90 shadow-[0_0_18px_rgba(251,191,36,0.5)]" },
  { id: "ring-ice", category: "ring", name: "Ice Ring", cost: 300, style: "ring-4 ring-cyan-200/90 shadow-[0_0_20px_rgba(103,232,249,0.5)]" },
  { id: "ring-lava", category: "ring", name: "Lava Ring", cost: 450, style: "ring-4 ring-orange-400/90 shadow-[0_0_20px_rgba(251,146,60,0.5)]" },
  { id: "ring-neon", category: "ring", name: "Neon Ring", cost: 700, style: "ring-4 ring-fuchsia-400/90 shadow-[0_0_22px_rgba(232,121,249,0.58)]" },
  { id: "ring-platinum", category: "ring", name: "Platinum Ring", cost: 1200, style: "ring-4 ring-slate-200/95 shadow-[0_0_24px_rgba(226,232,240,0.58)]" },
  { id: "ring-cosmic", category: "ring", name: "Cosmic Ring", cost: 2200, style: "ring-4 ring-indigo-300/95 shadow-[0_0_26px_rgba(165,180,252,0.62)]" },
  { id: "ring-sunflare", category: "ring", name: "Sunflare Ring", cost: 3500, style: "ring-4 ring-yellow-300/95 shadow-[0_0_30px_rgba(253,224,71,0.72)]" },
  { id: "ring-mythic", category: "ring", name: "Mythic Ring", cost: 5000, style: "ring-4 ring-cyan-200/95 shadow-[0_0_34px_rgba(186,230,253,0.78)]" },
  { id: "ring-rainbow", category: "ring", name: "Rainbow Ring", cost: 2800, style: "ring-4 ring-pink-300/90 shadow-[0_0_24px_rgba(244,114,182,0.45)]" },
  { id: "ring-aurora", category: "ring", name: "Aurora Ring", cost: 3200, style: "ring-4 ring-emerald-300/90 shadow-[0_0_28px_rgba(52,211,153,0.48)]" },
  { id: "ring-prism", category: "ring", name: "Prism Ring", cost: 4200, style: "ring-4 ring-sky-200/90 shadow-[0_0_30px_rgba(125,211,252,0.5)]" },
  { id: "ring-eclipse", category: "ring", name: "Eclipse Ring", cost: 4600, style: "ring-4 ring-fuchsia-200/90 shadow-[0_0_34px_rgba(244,114,182,0.5)]" },
  { id: "ring-crownfire", category: "ring", name: "Crownfire Ring", cost: 5000, style: "ring-4 ring-amber-200/95 shadow-[0_0_38px_rgba(253,224,71,0.82)]" },
  { id: "ring-candy-stripe", category: "ring", name: "Candy Stripe", cost: 900, style: "ring-4 ring-pink-300/90 bg-[repeating-linear-gradient(135deg,rgba(249,168,212,0.95)_0px,rgba(249,168,212,0.95)_4px,rgba(244,114,182,0.22)_4px,rgba(244,114,182,0.22)_8px)] shadow-[0_0_22px_rgba(244,114,182,0.36)]" },
  { id: "ring-ocean-stripe", category: "ring", name: "Ocean Stripe", cost: 1050, style: "ring-4 ring-cyan-300/90 bg-[repeating-linear-gradient(135deg,rgba(103,232,249,0.95)_0px,rgba(103,232,249,0.95)_4px,rgba(34,211,238,0.2)_4px,rgba(34,211,238,0.2)_9px)] shadow-[0_0_22px_rgba(34,211,238,0.38)]" },
  { id: "ring-lime-zigzag", category: "ring", name: "Lime Zigzag", cost: 1150, style: "ring-4 ring-lime-300/90 bg-[repeating-linear-gradient(45deg,rgba(190,242,100,0.9)_0px,rgba(190,242,100,0.9)_6px,rgba(101,163,13,0.22)_6px,rgba(101,163,13,0.22)_12px)] shadow-[0_0_22px_rgba(190,242,100,0.34)]" },
  { id: "ring-violet-swirl", category: "ring", name: "Violet Swirl", cost: 1300, style: "ring-4 ring-violet-300/90 bg-[radial-gradient(circle_at_30%_30%,rgba(233,213,255,0.95)_0px,rgba(233,213,255,0.95)_12%,rgba(139,92,246,0.18)_28%,transparent_44%),radial-gradient(circle_at_70%_65%,rgba(216,180,254,0.95)_0px,rgba(216,180,254,0.95)_10%,rgba(109,40,217,0.2)_24%,transparent_42%)] shadow-[0_0_24px_rgba(196,181,253,0.42)]" },
  { id: "ring-sunset-wave", category: "ring", name: "Sunset Wave", cost: 1450, style: "ring-4 ring-orange-300/90 bg-[linear-gradient(135deg,rgba(253,186,116,0.95)_0%,rgba(251,146,60,0.95)_35%,rgba(244,114,182,0.45)_100%)] shadow-[0_0_24px_rgba(251,146,60,0.42)]" },
  { id: "ring-emerald-curve", category: "ring", name: "Emerald Curve", cost: 1600, style: "ring-4 ring-emerald-300/90 bg-[radial-gradient(circle_at_20%_20%,rgba(167,243,208,0.95)_0px,rgba(167,243,208,0.95)_10%,rgba(16,185,129,0.18)_28%,transparent_44%),linear-gradient(135deg,rgba(16,185,129,0.9),rgba(13,148,136,0.24))] shadow-[0_0_24px_rgba(52,211,153,0.38)]" },
  { id: "ring-starlight-grid", category: "ring", name: "Starlight Grid", cost: 1750, style: "ring-4 ring-sky-200/90 bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(135deg,rgba(56,189,248,0.9),rgba(14,165,233,0.25))] bg-[length:10px_10px,10px_10px,100%_100%] shadow-[0_0_24px_rgba(125,211,252,0.42)]" },
  { id: "ring-royal-curves", category: "ring", name: "Royal Curves", cost: 1950, style: "ring-4 ring-indigo-200/90 bg-[radial-gradient(circle_at_25%_30%,rgba(199,210,254,0.95)_0px,rgba(199,210,254,0.95)_10%,rgba(99,102,241,0.22)_28%,transparent_46%),radial-gradient(circle_at_75%_70%,rgba(224,231,255,0.95)_0px,rgba(224,231,255,0.95)_10%,rgba(79,70,229,0.18)_24%,transparent_42%)] shadow-[0_0_28px_rgba(165,180,252,0.44)]" },
  { id: "ring-rose-ripple", category: "ring", name: "Rose Ripple", cost: 2150, style: "ring-4 ring-rose-200/90 bg-[radial-gradient(circle,rgba(255,228,230,0.95)_0%,rgba(251,113,133,0.22)_24%,transparent_48%),radial-gradient(circle_at_65%_35%,rgba(255,228,230,0.9)_0%,rgba(244,63,94,0.22)_18%,transparent_38%)] shadow-[0_0_26px_rgba(251,113,133,0.44)]" },
  { id: "ring-neon-lines", category: "ring", name: "Neon Lines", cost: 2400, style: "ring-4 ring-cyan-100/90 bg-[repeating-linear-gradient(90deg,rgba(34,211,238,0.95)_0px,rgba(34,211,238,0.95)_2px,rgba(232,121,249,0.16)_2px,rgba(232,121,249,0.16)_6px)] shadow-[0_0_30px_rgba(34,211,238,0.45)]" },
  { id: "ring-opal-swish", category: "ring", name: "Opal Swish", cost: 2750, style: "ring-4 ring-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(186,230,253,0.7)_30%,rgba(233,213,255,0.62)_65%,rgba(254,205,211,0.7)_100%)] shadow-[0_0_28px_rgba(255,255,255,0.45)]" },
  { id: "ring-gold-scroll", category: "ring", name: "Gold Scroll", cost: 3200, style: "ring-4 ring-amber-100/95 bg-[radial-gradient(circle_at_25%_25%,rgba(254,240,138,0.95)_0px,rgba(254,240,138,0.95)_10%,rgba(234,179,8,0.18)_24%,transparent_42%),linear-gradient(135deg,rgba(251,191,36,0.92),rgba(146,64,14,0.24))] shadow-[0_0_30px_rgba(251,191,36,0.46)]" },
  { id: "ring-aurora-ribbon", category: "ring", name: "Aurora Ribbon", cost: 3650, style: "ring-4 ring-teal-100/95 bg-[linear-gradient(135deg,rgba(110,231,183,0.95)_0%,rgba(34,211,238,0.7)_45%,rgba(129,140,248,0.55)_100%)] shadow-[0_0_32px_rgba(45,212,191,0.48)]" },
  { id: "ring-heartburst", category: "ring", name: "Heartburst", cost: 1800, style: "ring-4 ring-rose-300/90 shadow-[0_0_24px_rgba(251,113,133,0.4)]" },
  { id: "ring-starshine", category: "ring", name: "Starshine", cost: 1900, style: "ring-4 ring-yellow-300/90 shadow-[0_0_24px_rgba(253,224,71,0.42)]" },
  { id: "ring-dot-pop", category: "ring", name: "Dot Pop", cost: 2000, style: "ring-4 ring-sky-300/90 shadow-[0_0_24px_rgba(125,211,252,0.42)]" },
  { id: "ring-boltline", category: "ring", name: "Boltline", cost: 2100, style: "ring-4 ring-amber-300/90 shadow-[0_0_24px_rgba(251,191,36,0.42)]" },
  { id: "ring-petal", category: "ring", name: "Petal Ring", cost: 2200, style: "ring-4 ring-pink-300/90 shadow-[0_0_26px_rgba(244,114,182,0.4)]" },
  { id: "ring-seaeagle", category: "ring", name: "Sea Eagle Ring", cost: 2300, style: "ring-4 ring-rose-700/90 shadow-[0_0_26px_rgba(190,24,93,0.44)]" },
  { id: "ring-raider", category: "ring", name: "Raider Ring", cost: 2400, style: "ring-4 ring-lime-400/90 shadow-[0_0_26px_rgba(163,230,53,0.44)]" },
  { id: "ring-bronco", category: "ring", name: "Bronco Ring", cost: 2500, style: "ring-4 ring-amber-400/90 shadow-[0_0_26px_rgba(251,191,36,0.44)]" },
  { id: "ring-sharkfin", category: "ring", name: "Shark Fin", cost: 2600, style: "ring-4 ring-cyan-300/90 shadow-[0_0_28px_rgba(34,211,238,0.46)]" },
  { id: "ring-stormpulse", category: "ring", name: "Storm Pulse", cost: 2700, style: "ring-4 ring-violet-300/90 shadow-[0_0_28px_rgba(167,139,250,0.46)]" },
  { id: "ring-footyfire", category: "ring", name: "Footy Fire", cost: 2800, style: "ring-4 ring-orange-400/90 shadow-[0_0_28px_rgba(251,146,60,0.46)]" },
  { id: "ring-matildaspark", category: "ring", name: "Matilda Spark", cost: 2900, style: "ring-4 ring-emerald-300/90 shadow-[0_0_28px_rgba(74,222,128,0.46)]" },
  { id: "ring-swanwing", category: "ring", name: "Swan Wing", cost: 3000, style: "ring-4 ring-red-300/90 shadow-[0_0_28px_rgba(248,113,113,0.46)]" },
  { id: "ring-giantglow", category: "ring", name: "Giant Glow", cost: 3150, style: "ring-4 ring-orange-300/90 shadow-[0_0_28px_rgba(251,146,60,0.48)]" },
  { id: "ring-crystalstars", category: "ring", name: "Crystal Stars", cost: 3300, style: "ring-4 ring-white/90 shadow-[0_0_30px_rgba(255,255,255,0.5)]" },
  { id: "ring-rainbowhearts", category: "ring", name: "Rainbow Hearts", cost: 3500, style: "ring-4 ring-pink-300/90 shadow-[0_0_30px_rgba(244,114,182,0.5)]" },
  { id: "ring-cometcrown", category: "ring", name: "Comet Crown", cost: 3700, style: "ring-4 ring-sky-200/90 shadow-[0_0_32px_rgba(125,211,252,0.5)]" },
  { id: "ring-candystars", category: "ring", name: "Candy Stars", cost: 3900, style: "ring-4 ring-fuchsia-300/90 shadow-[0_0_32px_rgba(217,70,239,0.5)]" },
  { id: "ring-mythichearts", category: "ring", name: "Mythic Hearts", cost: 4200, style: "ring-4 ring-amber-200/95 shadow-[0_0_34px_rgba(251,191,36,0.54)]" },
  { id: "ring-legendstars", category: "ring", name: "Legend Stars", cost: 4600, style: "ring-4 ring-cyan-100/95 shadow-[0_0_36px_rgba(186,230,253,0.56)]" },

  { id: "upgrade-coin-boost", category: "upgrades", name: "Double Coins Boost", cost: 200, detail: "Double all coins for 20 minutes", boostType: "coinMultiplier2x", durationMs: 20 * 60 * 1000 },
  { id: "upgrade-triple-boost", category: "upgrades", name: "Triple Coins Boost", cost: 500, detail: "Triple all coins for 15 minutes", boostType: "coinMultiplier3x", durationMs: 15 * 60 * 1000 },
  { id: "upgrade-quad-boost", category: "upgrades", name: "Quad Coins Boost", cost: 750, detail: "Quadruple all coins for 12 minutes", boostType: "coinMultiplier4x", durationMs: 12 * 60 * 1000 },
  { id: "theme-blue", category: "upgrades", name: "Beresford Blue", cost: 0, detail: "Permanent site theme", themeId: "blue", permanentUnlock: true },
  { id: "theme-billea", category: "upgrades", name: "Billea Mode", cost: 0, detail: "Bold, cool, and extra clear", themeId: "billea", permanentUnlock: true },
  { id: "theme-emerald", category: "upgrades", name: "Emerald Glow", cost: 600, detail: "Permanent site theme", themeId: "emerald", permanentUnlock: true },
  { id: "theme-sunset", category: "upgrades", name: "Sunset Burst", cost: 800, detail: "Permanent site theme", themeId: "sunset", permanentUnlock: true },
  { id: "theme-violet", category: "upgrades", name: "Violet Storm", cost: 900, detail: "Permanent site theme", themeId: "violet", permanentUnlock: true },
  { id: "theme-gold", category: "upgrades", name: "Golden Hour", cost: 1200, detail: "Permanent site theme", themeId: "gold", permanentUnlock: true },
  { id: "theme-crimson", category: "upgrades", name: "Crimson Rush", cost: 1000, detail: "Permanent site theme", themeId: "crimson", permanentUnlock: true },
  { id: "theme-glacier", category: "upgrades", name: "Glacier Pop", cost: 1150, detail: "Permanent site theme", themeId: "glacier", permanentUnlock: true },
  { id: "theme-midnight", category: "upgrades", name: "Midnight Neon", cost: 1350, detail: "Permanent site theme", themeId: "midnight", permanentUnlock: true },
  { id: "theme-citrus", category: "upgrades", name: "Citrus Flash", cost: 1450, detail: "Permanent site theme", themeId: "citrus", permanentUnlock: true },
  { id: "theme-rosequartz", category: "upgrades", name: "Rose Quartz", cost: 1650, detail: "Permanent site theme", themeId: "rosequartz", permanentUnlock: true },
  { id: "theme-storm", category: "upgrades", name: "Storm Teal", cost: 1800, detail: "Permanent site theme", themeId: "storm", permanentUnlock: true },
  { id: "theme-rainbow", category: "upgrades", name: "Rainbow Mode", cost: 3000, detail: "Permanent site theme", themeId: "rainbow", permanentUnlock: true },
  { id: "theme-broncos", category: "upgrades", name: "Brisbane Broncos", cost: 2200, detail: "Permanent team theme", themeId: "broncos", permanentUnlock: true },
  { id: "theme-raiders", category: "upgrades", name: "Canberra Raiders", cost: 2200, detail: "Permanent team theme", themeId: "raiders", permanentUnlock: true },
  { id: "theme-bulldogs", category: "upgrades", name: "Canterbury-Bankstown Bulldogs", cost: 2200, detail: "Permanent team theme", themeId: "bulldogs", permanentUnlock: true },
  { id: "theme-sharks", category: "upgrades", name: "Cronulla Sharks", cost: 2200, detail: "Permanent team theme", themeId: "sharks", permanentUnlock: true },
  { id: "theme-dolphins", category: "upgrades", name: "Dolphins", cost: 2200, detail: "Permanent team theme", themeId: "dolphins", permanentUnlock: true },
  { id: "theme-titans", category: "upgrades", name: "Gold Coast Titans", cost: 2200, detail: "Permanent team theme", themeId: "titans", permanentUnlock: true },
  { id: "theme-seaeagles", category: "upgrades", name: "Manly Sea Eagles", cost: 2200, detail: "Permanent team theme", themeId: "seaeagles", permanentUnlock: true },
  { id: "theme-melbstorm", category: "upgrades", name: "Melbourne Storm", cost: 2200, detail: "Permanent team theme", themeId: "melbstorm", permanentUnlock: true },
  { id: "theme-knights", category: "upgrades", name: "Newcastle Knights", cost: 2200, detail: "Permanent team theme", themeId: "knights", permanentUnlock: true },
  { id: "theme-warriors", category: "upgrades", name: "New Zealand Warriors", cost: 2200, detail: "Permanent team theme", themeId: "warriors", permanentUnlock: true },
  { id: "theme-cowboys", category: "upgrades", name: "North Queensland Cowboys", cost: 2200, detail: "Permanent team theme", themeId: "cowboys", permanentUnlock: true },
  { id: "theme-eels", category: "upgrades", name: "Parramatta Eels", cost: 2200, detail: "Permanent team theme", themeId: "eels", permanentUnlock: true },
  { id: "theme-panthers", category: "upgrades", name: "Penrith Panthers", cost: 2200, detail: "Permanent team theme", themeId: "panthers", permanentUnlock: true },
  { id: "theme-rabbitohs", category: "upgrades", name: "South Sydney Rabbitohs", cost: 2200, detail: "Permanent team theme", themeId: "rabbitohs", permanentUnlock: true },
  { id: "theme-dragons", category: "upgrades", name: "St George Illawarra Dragons", cost: 2200, detail: "Permanent team theme", themeId: "dragons", permanentUnlock: true },
  { id: "theme-roosters", category: "upgrades", name: "Sydney Roosters", cost: 2200, detail: "Permanent team theme", themeId: "roosters", permanentUnlock: true },
  { id: "theme-tigers", category: "upgrades", name: "Wests Tigers", cost: 2200, detail: "Permanent team theme", themeId: "tigers", permanentUnlock: true },
  { id: "theme-matildas", category: "upgrades", name: "Matildas", cost: 2400, detail: "Permanent team theme", themeId: "matildas", permanentUnlock: true },
  { id: "theme-swans", category: "upgrades", name: "Sydney Swans", cost: 2400, detail: "Permanent team theme", themeId: "swans", permanentUnlock: true },
  { id: "theme-giants", category: "upgrades", name: "GWS Giants", cost: 2400, detail: "Permanent team theme", themeId: "giants", permanentUnlock: true },
  ...ACHIEVEMENT_SHOP_ITEMS,
];

const SHOP_PREVIEW_ITEMS = {};

const SAVE_WORD_PREFIXES_A = ["Aero", "Amber", "Brisk", "Bright", "Cloud", "Clever", "Daring", "Ember", "Frost", "Golden", "Lucky", "Rapid"];
const SAVE_WORD_SUFFIXES_A = ["Fox", "Hawk", "Leaf", "Moon", "Nova", "Pine", "Quill", "Rain", "Spark", "Star", "Stone", "Wave"];
const SAVE_WORD_PREFIXES_B = ["Acorn", "Blaze", "Cedar", "Drift", "Echo", "Flint", "Glade", "Harbor", "Ivory", "Jet", "Kite", "Lotus", "Maple", "Nimbus"];
const SAVE_WORD_SUFFIXES_B = ["Ant", "Bear", "Crow", "Dingo", "Emu", "Frog", "Goat", "Heron", "Ibis", "Jay", "Koala", "Lynx", "Moth"];

function createCompoundWords(prefixes, suffixes) {
  const words = [];
  prefixes.forEach((prefix) => {
    suffixes.forEach((suffix) => {
      words.push(`${prefix}${suffix}`);
    });
  });
  return words;
}

const ADDSUB_SAVE_WORDS = createCompoundWords(SAVE_WORD_PREFIXES_A, SAVE_WORD_SUFFIXES_A);
const MULDIV_SAVE_WORDS = createCompoundWords(SAVE_WORD_PREFIXES_B, SAVE_WORD_SUFFIXES_B);
const ADDSUB_SAVE_WORDS_SORTED = [...ADDSUB_SAVE_WORDS].sort((a, b) => b.length - a.length);
const MULDIV_SAVE_WORDS_SORTED = [...MULDIV_SAVE_WORDS].sort((a, b) => b.length - a.length);
const SAVE_THEME_RADIX = BigInt(Object.keys(SITE_THEMES).length || 1);
const SAVE_ITEM_RADIX = BigInt(PROFILE_SHOP_ITEMS.length + 1);
const SAVE_COUNT_RADIX = 64n;

function encodeLevelScoreWord(level, score, levels, words) {
  const levelIndex = Math.max(0, levels.indexOf(level));
  const scoreIndex = typeof score === "number" && score >= 0 && score <= 15 ? score : 16;
  return words[levelIndex * 17 + scoreIndex] || words[0];
}

function decodeLevelScoreWord(word, levels, words) {
  const index = words.indexOf(word);
  if (index < 0) return null;
  const levelIndex = Math.floor(index / 17);
  const scoreIndex = index % 17;
  return {
    level: levels[levelIndex] || levels[0],
    score: scoreIndex === 16 ? null : scoreIndex,
  };
}

function bigIntToBase36(value) {
  let current = BigInt(value);
  if (current === 0n) return "0";
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const radix = BigInt(chars.length);
  let result = "";
  while (current > 0n) {
    const remainder = Number(current % radix);
    result = chars[remainder] + result;
    current = current / radix;
  }
  return result;
}

function base36ToBigInt(value) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const radix = BigInt(chars.length);
  let result = 0n;
  const cleaned = String(value || "0").trim();
  for (const char of cleaned) {
    const index = chars.indexOf(char);
    if (index < 0) throw new Error("Invalid save password");
    result = result * radix + BigInt(index);
  }
  return result;
}

function itemIdsToIndices(ids) {
  const wanted = new Set(ids || []);
  return PROFILE_SHOP_ITEMS.map((item, index) => (wanted.has(item.id) ? index : -1)).filter((index) => index >= 0).sort((a, b) => a - b);
}

function indicesToItemIds(indices) {
  return (indices || []).map((index) => PROFILE_SHOP_ITEMS[index]?.id).filter(Boolean);
}

function packSaveNumber(profile, selectedThemeId, unlocked) {
  const themeIds = Object.keys(SITE_THEMES);
  const themeIndex = Math.max(0, themeIds.indexOf(selectedThemeId));
  const ownedIndices = itemIdsToIndices(profile.ownedItems || []);
  const ownedSet = new Set(ownedIndices);
  const equippedIndices = itemIdsToIndices((profile.equippedItems || []).filter((id) => ownedSet.has(PROFILE_SHOP_ITEMS.findIndex((item) => item.id === id))));

  let packed = BigInt(Math.max(0, Number(profile.coins || 0)));
  packed = packed * 2n + BigInt(unlocked ? 1 : 0);
  packed = packed * SAVE_THEME_RADIX + BigInt(themeIndex);

  ownedIndices.forEach((index) => {
    packed = packed * SAVE_ITEM_RADIX + BigInt(index + 1);
  });
  packed = packed * SAVE_COUNT_RADIX + BigInt(ownedIndices.length);

  equippedIndices.forEach((index) => {
    packed = packed * SAVE_ITEM_RADIX + BigInt(index + 1);
  });
  packed = packed * SAVE_COUNT_RADIX + BigInt(equippedIndices.length);

  return bigIntToBase36(packed);
}

function unpackSaveNumber(encoded) {
  let packed = base36ToBigInt(encoded || "0");

  const equippedCount = Number(packed % SAVE_COUNT_RADIX);
  packed = packed / SAVE_COUNT_RADIX;
  const equippedIndices = [];
  for (let i = 0; i < equippedCount; i++) {
    equippedIndices.push(Number(packed % SAVE_ITEM_RADIX) - 1);
    packed = packed / SAVE_ITEM_RADIX;
  }
  equippedIndices.reverse();

  const ownedCount = Number(packed % SAVE_COUNT_RADIX);
  packed = packed / SAVE_COUNT_RADIX;
  const ownedIndices = [];
  for (let i = 0; i < ownedCount; i++) {
    ownedIndices.push(Number(packed % SAVE_ITEM_RADIX) - 1);
    packed = packed / SAVE_ITEM_RADIX;
  }
  ownedIndices.reverse();

  const themeIndex = Number(packed % SAVE_THEME_RADIX);
  packed = packed / SAVE_THEME_RADIX;
  const unlocked = (packed % 2n) === 1n;
  packed = packed / 2n;
  const coins = Number(packed);

  const ownedItems = indicesToItemIds(ownedIndices);
  const ownedSet = new Set(ownedItems);
  const equippedItems = indicesToItemIds(equippedIndices).filter((id) => ownedSet.has(id));

  return {
    coins: Number.isFinite(coins) && coins >= 0 ? coins : 0,
    ownedItems,
    equippedItems,
    themeIndex,
    unlocked,
  };
}

function extractSaveWords(code) {
  const cleaned = String(code || "").trim().replace(/[^A-Za-z0-9]/g, "");
  if (!cleaned) throw new Error("Invalid save password");

  const addWord = ADDSUB_SAVE_WORDS_SORTED.find((word) => cleaned.startsWith(word));
  if (!addWord) throw new Error("Invalid save password");

  const afterAdd = cleaned.slice(addWord.length);
  const mulWord = MULDIV_SAVE_WORDS_SORTED.find((word) => afterAdd.startsWith(word));
  if (!mulWord) throw new Error("Invalid save password");

  const numberPart = afterAdd.slice(mulWord.length);
  if (!numberPart) throw new Error("Invalid save password");

  return { addWord, mulWord, numberPart };
}

function readProfileState() {
  if (typeof window === "undefined") {
    return { coins: 0, ownedItems: [], equippedItems: [], activeBoosts: [] };
  }
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { coins: 0, ownedItems: [], equippedItems: [], activeBoosts: [] };
    const parsed = JSON.parse(raw);
    return {
      coins: parsed.coins ?? 0,
      ownedItems: parsed.ownedItems || [],
      equippedItems: parsed.equippedItems || [],
      activeBoosts: parsed.activeBoosts || [],
    };
  } catch {
    return { coins: 0, ownedItems: [], equippedItems: [], activeBoosts: [] };
  }
}

function writeProfileState(profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function readPlayerName() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY) || "";
}

function writePlayerName(name) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name);
}

function readThemeId() {
  if (typeof window === "undefined") return "blue";
  return window.localStorage.getItem(THEME_STORAGE_KEY) || "blue";
}

function writeThemeId(themeId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
}

function getMultiplayerRaceKey(selectedMode, raceLevel) {
  if (selectedMode === "mixed" && raceLevel && typeof raceLevel === "object") {
    return `mixed:${raceLevel.addsubLevel}+${raceLevel.muldivLevel}`;
  }
  return `${selectedMode}:${String(raceLevel)}`;
}

function readMultiplayerBests() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(MULTIPLAYER_BESTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMultiplayerBests(bests) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MULTIPLAYER_BESTS_STORAGE_KEY, JSON.stringify(bests));
}

function readTimeTrialHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TIME_TRIAL_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTimeTrialHistory(history) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TIME_TRIAL_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function readFreeFallHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FREE_FALL_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFreeFallHistory(history) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FREE_FALL_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function recordFreeFallHistoryEntry(entry) {
  const history = readFreeFallHistory();
  const nextHistory = [...history, { ...entry, ts: entry.ts || Date.now() }]
    .sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0))
    .slice(0, 250);
  writeFreeFallHistory(nextHistory);
}

function recordTimeTrialHistoryEntry(entry) {
  const history = readTimeTrialHistory();
  const nextHistory = [...history, { ...entry, ts: entry.ts || Date.now() }]
    .sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0))
    .slice(0, 250);
  writeTimeTrialHistory(nextHistory);
}

function getTimeTrialLevelLabel(selectedMode, selectedLevel) {
  if (selectedMode === "mixed" && selectedLevel && typeof selectedLevel === "object") {
    return `${selectedLevel.addsubLevel} + ${selectedLevel.muldivLevel}`;
  }
  return String(selectedLevel || "");
}

function getTimeTrialLeaderboardEntries(history, selectedMode, levelLabel) {
  const entries = Array.isArray(history) ? history : [];
  const scoped = entries.filter((entry) => entry.selectedMode === selectedMode);
  const sorter = (a, b) => {
    const correctDelta = Number(b.correctAnswers || 0) - Number(a.correctAnswers || 0);
    if (correctDelta !== 0) return correctDelta;
    const answeredDelta = Number(b.totalAnswered || 0) - Number(a.totalAnswered || 0);
    if (answeredDelta !== 0) return answeredDelta;
    return Number(b.ts || 0) - Number(a.ts || 0);
  };
  return {
    overall: [...scoped].sort(sorter).slice(0, 10),
    byLevel: [...scoped].filter((entry) => entry.levelLabel === levelLabel).sort(sorter).slice(0, 10),
  };
}

function formatTimeTrialTimestamp(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString("en-AU", {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getAchievementMetrics(statsLog, timeTrialHistory) {
  const allStats = summariseStats(statsLog, null);
  return {
    totalCorrect: Number(allStats.correctAnswers || 0),
    timeSpentSeconds: Number(allStats.totalSeconds || 0),
    coinsEarned: Number(allStats.coinsEarned || 0),
    coinsSpent: (statsLog || []).reduce((sum, entry) => sum + Number(entry.coinsSpent || 0), 0),
    raceWins: (statsLog || []).filter((entry) => entry.raceWon).length,
    bestTimeTrialScore: (timeTrialHistory || []).reduce((best, entry) => Math.max(best, Number(entry.correctAnswers || 0)), 0),
    bestStreak: (statsLog || []).reduce((best, entry) => Math.max(best, Number(entry.bestStreak || 0)), 0),
  };
}

function isAchievementUnlocked(item, achievementMetrics) {
  if (!item?.achievementOnly) return true;
  return Number(achievementMetrics?.[item.achievementMetric] || 0) >= Number(item.achievementThreshold || 0);
}

function formatAchievementRequirement(item) {
  const threshold = Number(item?.achievementThreshold || 0);
  switch (item?.achievementMetric) {
    case "timeSpentSeconds": {
      if (threshold === 24 * 3600) return "Play for 1 day";
      if (threshold === 7 * 24 * 3600) return "Play for 1 week";
      if (threshold === 30 * 24 * 3600) return "Play for 1 month";
      const hours = threshold / 3600;
      if (hours >= 1) return `Play for ${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`;
      return `Play for ${Math.round(threshold / 60)} minutes`;
    }
    case "totalCorrect":
      return `Answer ${threshold} questions correctly`;
    case "coinsEarned":
      return `Earn ${threshold} coins`;
    case "coinsSpent":
      return `Spend ${threshold} coins`;
    case "raceWins":
      return `Win ${threshold} race${threshold === 1 ? "" : "s"}`;
    case "bestTimeTrialScore":
      return `Score ${threshold} correct in a Time Trial`;
    case "bestStreak":
      return `Get ${threshold} correct in a row without a mistake`;
    default:
      return item?.detail || "Unlock requirement";
  }
}

function getAchievementMetricLabel(metric) {
  switch (metric) {
    case "timeSpentSeconds": return "Time played";
    case "totalCorrect": return "Correct answers";
    case "coinsEarned": return "Coins earned";
    case "coinsSpent": return "Coins spent";
    case "raceWins": return "Race wins";
    case "bestTimeTrialScore": return "Time Trial best";
    case "bestStreak": return "Streak";
    default: return "Achievement";
  }
}

function readStatsLog() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStatsLog(log) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(log));
}

function recordStatsEntry(entry) {
  const log = readStatsLog();
  const nextLog = [...log, { ...entry, ts: entry.ts || Date.now() }].slice(-500);
  writeStatsLog(nextLog);
}

function summariseStats(log, sinceDays = null) {
  const cutoff = sinceDays ? Date.now() - sinceDays * 24 * 60 * 60 * 1000 : 0;
  const filtered = (log || []).filter((entry) => !cutoff || entry.ts >= cutoff);
  const totalSeconds = filtered.reduce((sum, entry) => sum + Number(entry.durationSeconds || 0), 0);
  const correctAnswers = filtered.reduce((sum, entry) => sum + Number(entry.correctAnswers || 0), 0);
  const coinsEarned = filtered.reduce((sum, entry) => sum + Number(entry.coinsEarned || 0), 0);
  const fastestRaceTime = filtered
    .filter((entry) => typeof entry.raceTimeSeconds === "number" && entry.raceTimeSeconds > 0)
    .reduce((best, entry) => (best === null || entry.raceTimeSeconds < best ? entry.raceTimeSeconds : best), null);
  return {
    totalSeconds,
    correctAnswers,
    coinsEarned,
    fastestRaceTime,
    roundsPlayed: filtered.length,
  };
}

function formatStatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function getLongestCorrectStreak(resultEntries) {
  let best = 0;
  let current = 0;
  (resultEntries || []).forEach((entry) => {
    if (entry?.correct) {
      current += 1;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  });
  return best;
}

function getThemeShopBarClass(themeId, owned) {
  switch (themeId) {
    case "blue": return owned ? "bg-blue-500/70 border-blue-300/60 text-white" : "bg-blue-500/25 border-blue-300/30 text-blue-100/80";
    case "billea": return owned ? "bg-white border-white text-black" : "bg-white/20 border-white/40 text-white";
    case "emerald": return owned ? "bg-emerald-500/70 border-emerald-300/60 text-white" : "bg-emerald-500/25 border-emerald-300/30 text-emerald-100/80";
    case "sunset": return owned ? "bg-orange-500/70 border-orange-300/60 text-white" : "bg-orange-500/25 border-orange-300/30 text-orange-100/80";
    case "violet": return owned ? "bg-violet-500/70 border-violet-300/60 text-white" : "bg-violet-500/25 border-violet-300/30 text-violet-100/80";
    case "gold": return owned ? "bg-amber-400/80 border-amber-200/70 text-slate-950" : "bg-amber-400/25 border-amber-200/30 text-amber-100/80";
    case "crimson": return owned ? "bg-rose-600/75 border-rose-300/60 text-white" : "bg-rose-600/25 border-rose-300/30 text-rose-100/80";
    case "glacier": return owned ? "bg-sky-400/75 border-cyan-200/60 text-slate-950" : "bg-sky-400/25 border-cyan-200/30 text-sky-100/80";
    case "midnight": return owned ? "bg-fuchsia-600/75 border-fuchsia-300/60 text-white" : "bg-fuchsia-600/25 border-fuchsia-300/30 text-fuchsia-100/80";
    case "citrus": return owned ? "bg-lime-500/80 border-lime-200/70 text-slate-950" : "bg-lime-500/25 border-lime-200/30 text-lime-100/80";
    case "rosequartz": return owned ? "bg-pink-500/75 border-pink-200/60 text-white" : "bg-pink-500/25 border-pink-200/30 text-pink-100/80";
    case "storm": return owned ? "bg-teal-500/75 border-teal-200/60 text-white" : "bg-teal-500/25 border-teal-200/30 text-teal-100/80";
    case "rainbow": return owned ? "bg-[linear-gradient(90deg,#fb7185_0%,#facc15_20%,#4ade80_40%,#38bdf8_60%,#a78bfa_80%,#f472b6_100%)] border-white/70 text-white" : "bg-[linear-gradient(90deg,rgba(251,113,133,0.35)_0%,rgba(250,204,21,0.35)_20%,rgba(74,222,128,0.35)_40%,rgba(56,189,248,0.35)_60%,rgba(167,139,250,0.35)_80%,rgba(244,114,182,0.35)_100%)] border-white/30 text-white/90";
    case "broncos": return owned ? "bg-[repeating-linear-gradient(90deg,#7f1d1d_0px,#7f1d1d_18px,#f59e0b_18px,#f59e0b_30px,#7f1d1d_30px,#7f1d1d_48px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(127,29,29,0.55)_0px,rgba(127,29,29,0.55)_18px,rgba(245,158,11,0.55)_18px,rgba(245,158,11,0.55)_30px,rgba(127,29,29,0.55)_30px,rgba(127,29,29,0.55)_48px)] border-white/20 text-white/90";
    case "raiders": return owned ? "bg-[repeating-linear-gradient(90deg,#14532d_0px,#14532d_18px,#84cc16_18px,#84cc16_28px,#14532d_28px,#14532d_46px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(20,83,45,0.55)_0px,rgba(20,83,45,0.55)_18px,rgba(132,204,22,0.55)_18px,rgba(132,204,22,0.55)_28px,rgba(20,83,45,0.55)_28px,rgba(20,83,45,0.55)_46px)] border-white/20 text-white/90";
    case "bulldogs": return owned ? "bg-[repeating-linear-gradient(180deg,#1d4ed8_0px,#1d4ed8_18px,#f8fafc_18px,#f8fafc_30px,#1d4ed8_30px,#1d4ed8_48px)] border-white/50 text-slate-900" : "bg-[repeating-linear-gradient(180deg,rgba(29,78,216,0.55)_0px,rgba(29,78,216,0.55)_18px,rgba(248,250,252,0.82)_18px,rgba(248,250,252,0.82)_30px,rgba(29,78,216,0.55)_30px,rgba(29,78,216,0.55)_48px)] border-white/20 text-white/90";
    case "sharks": return owned ? "bg-[linear-gradient(180deg,#38bdf8_0%,#38bdf8_42%,#111827_42%,#111827_46%,#f8fafc_46%,#f8fafc_54%,#111827_54%,#111827_58%,#38bdf8_58%,#38bdf8_100%)] border-white/50 text-slate-900" : "bg-[linear-gradient(180deg,rgba(56,189,248,0.55)_0%,rgba(56,189,248,0.55)_42%,rgba(17,24,39,0.75)_42%,rgba(17,24,39,0.75)_46%,rgba(248,250,252,0.82)_46%,rgba(248,250,252,0.82)_54%,rgba(17,24,39,0.75)_54%,rgba(17,24,39,0.75)_58%,rgba(56,189,248,0.55)_58%,rgba(56,189,248,0.55)_100%)] border-white/20 text-white/90";
    case "dolphins": return owned ? "bg-[repeating-linear-gradient(90deg,#9f1239_0px,#9f1239_18px,#fb7185_18px,#fb7185_30px,#9f1239_30px,#9f1239_48px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(159,18,57,0.55)_0px,rgba(159,18,57,0.55)_18px,rgba(251,113,133,0.55)_18px,rgba(251,113,133,0.55)_30px,rgba(159,18,57,0.55)_30px,rgba(159,18,57,0.55)_48px)] border-white/20 text-white/90";
    case "titans": return owned ? "bg-[repeating-linear-gradient(90deg,#082f49_0px,#082f49_18px,#7dd3fc_18px,#7dd3fc_34px,#fde047_34px,#fde047_44px,#082f49_44px,#082f49_60px)] border-white/50 text-slate-950" : "bg-[repeating-linear-gradient(90deg,rgba(8,47,73,0.65)_0px,rgba(8,47,73,0.65)_18px,rgba(125,211,252,0.55)_18px,rgba(125,211,252,0.55)_34px,rgba(253,224,71,0.55)_34px,rgba(253,224,71,0.55)_44px,rgba(8,47,73,0.65)_44px,rgba(8,47,73,0.65)_60px)] border-white/20 text-white/90";
    case "seaeagles": return owned ? "bg-[linear-gradient(180deg,#7f1d1d_0%,#7f1d1d_44%,#f8fafc_44%,#f8fafc_56%,#7f1d1d_56%,#7f1d1d_100%)] border-white/50 text-white" : "bg-[linear-gradient(180deg,rgba(127,29,29,0.65)_0%,rgba(127,29,29,0.65)_44%,rgba(248,250,252,0.82)_44%,rgba(248,250,252,0.82)_56%,rgba(127,29,29,0.65)_56%,rgba(127,29,29,0.65)_100%)] border-white/20 text-white/90";
    case "melbstorm": return owned ? "bg-[repeating-linear-gradient(90deg,#4c1d95_0px,#4c1d95_18px,#facc15_18px,#facc15_22px,#312e81_22px,#312e81_42px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(76,29,149,0.55)_0px,rgba(76,29,149,0.55)_18px,rgba(250,204,21,0.55)_18px,rgba(250,204,21,0.55)_22px,rgba(49,46,129,0.55)_22px,rgba(49,46,129,0.55)_42px)] border-white/20 text-white/90";
    case "knights": return owned ? "bg-[repeating-linear-gradient(180deg,#7f1d1d_0px,#7f1d1d_24px,#1d4ed8_24px,#1d4ed8_42px,#7f1d1d_42px,#7f1d1d_66px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(180deg,rgba(127,29,29,0.55)_0px,rgba(127,29,29,0.55)_24px,rgba(29,78,216,0.55)_24px,rgba(29,78,216,0.55)_42px,rgba(127,29,29,0.55)_42px,rgba(127,29,29,0.55)_66px)] border-white/20 text-white/90";
    case "warriors": return owned ? "bg-[repeating-linear-gradient(90deg,#111827_0px,#111827_18px,#2563eb_18px,#2563eb_24px,#dc2626_24px,#dc2626_28px,#a3e635_28px,#a3e635_34px,#facc15_34px,#facc15_38px,#111827_38px,#111827_56px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(17,24,39,0.7)_0px,rgba(17,24,39,0.7)_18px,rgba(37,99,235,0.55)_18px,rgba(37,99,235,0.55)_24px,rgba(220,38,38,0.55)_24px,rgba(220,38,38,0.55)_28px,rgba(163,230,53,0.55)_28px,rgba(163,230,53,0.55)_34px,rgba(250,204,21,0.55)_34px,rgba(250,204,21,0.55)_38px,rgba(17,24,39,0.7)_38px,rgba(17,24,39,0.7)_56px)] border-white/20 text-white/90";
    case "cowboys": return owned ? "bg-[repeating-linear-gradient(90deg,#1e3a8a_0px,#1e3a8a_18px,#facc15_18px,#facc15_30px,#1e3a8a_30px,#1e3a8a_50px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(30,58,138,0.55)_0px,rgba(30,58,138,0.55)_18px,rgba(250,204,21,0.55)_18px,rgba(250,204,21,0.55)_30px,rgba(30,58,138,0.55)_30px,rgba(30,58,138,0.55)_50px)] border-white/20 text-white/90";
    case "eels": return owned ? "bg-[repeating-linear-gradient(90deg,#2563eb_0px,#2563eb_18px,#fde047_18px,#fde047_30px,#2563eb_30px,#2563eb_48px)] border-white/50 text-slate-950" : "bg-[repeating-linear-gradient(90deg,rgba(37,99,235,0.55)_0px,rgba(37,99,235,0.55)_18px,rgba(253,224,71,0.65)_18px,rgba(253,224,71,0.65)_30px,rgba(37,99,235,0.55)_30px,rgba(37,99,235,0.55)_48px)] border-white/20 text-white/90";
    case "panthers": return owned ? "bg-[repeating-linear-gradient(90deg,#000000_0px,#000000_20px,#16a34a_20px,#16a34a_22px,#dc2626_22px,#dc2626_24px,#eab308_24px,#eab308_26px,#f8fafc_26px,#f8fafc_28px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.75)_0px,rgba(0,0,0,0.75)_20px,rgba(22,163,74,0.55)_20px,rgba(22,163,74,0.55)_22px,rgba(220,38,38,0.55)_22px,rgba(220,38,38,0.55)_24px,rgba(234,179,8,0.55)_24px,rgba(234,179,8,0.55)_26px,rgba(248,250,252,0.8)_26px,rgba(248,250,252,0.8)_28px)] border-white/20 text-white/90";
    case "rabbitohs": return owned ? "bg-[repeating-linear-gradient(180deg,#166534_0px,#166534_10px,#991b1b_10px,#991b1b_20px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(180deg,rgba(22,101,52,0.55)_0px,rgba(22,101,52,0.55)_10px,rgba(153,27,27,0.55)_10px,rgba(153,27,27,0.55)_20px)] border-white/20 text-white/90";
    case "dragons": return owned ? "bg-[linear-gradient(180deg,#f8fafc_0%,#f8fafc_44%,#dc2626_44%,#dc2626_58%,#f8fafc_58%,#f8fafc_100%)] border-red-300/60 text-slate-900" : "bg-[linear-gradient(180deg,rgba(248,250,252,0.92)_0%,rgba(248,250,252,0.92)_44%,rgba(220,38,38,0.76)_44%,rgba(220,38,38,0.76)_58%,rgba(248,250,252,0.92)_58%,rgba(248,250,252,0.92)_100%)] border-red-200/30 text-slate-900";
    case "roosters": return owned ? "bg-[linear-gradient(180deg,#082f49_0%,#082f49_42%,#f8fafc_42%,#f8fafc_46%,#dc2626_46%,#dc2626_50%,#2563eb_50%,#2563eb_54%,#f8fafc_54%,#f8fafc_58%,#082f49_58%,#082f49_100%)] border-white/60 text-white" : "bg-[linear-gradient(180deg,rgba(8,47,73,0.78)_0%,rgba(8,47,73,0.78)_42%,rgba(248,250,252,0.82)_42%,rgba(248,250,252,0.82)_46%,rgba(220,38,38,0.75)_46%,rgba(220,38,38,0.75)_50%,rgba(37,99,235,0.75)_50%,rgba(37,99,235,0.75)_54%,rgba(248,250,252,0.82)_54%,rgba(248,250,252,0.82)_58%,rgba(8,47,73,0.78)_58%,rgba(8,47,73,0.78)_100%)] border-white/20 text-white/90";
    case "tigers": return owned ? "bg-[repeating-linear-gradient(90deg,#111827_0px,#111827_16px,#f97316_16px,#f97316_30px,#111827_30px,#111827_44px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(17,24,39,0.7)_0px,rgba(17,24,39,0.7)_16px,rgba(249,115,22,0.6)_16px,rgba(249,115,22,0.6)_30px,rgba(17,24,39,0.7)_30px,rgba(17,24,39,0.7)_44px)] border-white/20 text-white/90";
    case "matildas": return owned ? "bg-[repeating-linear-gradient(90deg,#14532d_0px,#14532d_14px,#facc15_14px,#facc15_20px,#166534_20px,#166534_38px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(20,83,45,0.65)_0px,rgba(20,83,45,0.65)_14px,rgba(250,204,21,0.55)_14px,rgba(250,204,21,0.55)_20px,rgba(22,101,52,0.65)_20px,rgba(22,101,52,0.65)_38px)] border-white/20 text-white/90";
    case "swans": return owned ? "bg-[linear-gradient(180deg,#991b1b_0%,#991b1b_44%,#f8fafc_44%,#f8fafc_56%,#991b1b_56%,#991b1b_100%)] border-white/60 text-white" : "bg-[linear-gradient(180deg,rgba(153,27,27,0.72)_0%,rgba(153,27,27,0.72)_44%,rgba(248,250,252,0.82)_44%,rgba(248,250,252,0.82)_56%,rgba(153,27,27,0.72)_56%,rgba(153,27,27,0.72)_100%)] border-white/20 text-white/90";
    case "giants": return owned ? "bg-[repeating-linear-gradient(90deg,#1f2937_0px,#1f2937_16px,#ea580c_16px,#ea580c_30px,#1f2937_30px,#1f2937_46px)] border-white/50 text-white" : "bg-[repeating-linear-gradient(90deg,rgba(31,41,55,0.7)_0px,rgba(31,41,55,0.7)_16px,rgba(234,88,12,0.6)_16px,rgba(234,88,12,0.6)_30px,rgba(31,41,55,0.7)_30px,rgba(31,41,55,0.7)_46px)] border-white/20 text-white/90";
    case "chrono": return owned ? "bg-[linear-gradient(90deg,#0f172a_0%,#164e63_40%,#22d3ee_100%)] border-cyan-200/60 text-white" : "bg-[linear-gradient(90deg,rgba(15,23,42,0.82)_0%,rgba(22,78,99,0.72)_40%,rgba(34,211,238,0.42)_100%)] border-cyan-200/30 text-white/90";
    case "champion": return owned ? "bg-[linear-gradient(90deg,#111827_0%,#7f1d1d_42%,#f59e0b_100%)] border-amber-200/60 text-white" : "bg-[linear-gradient(90deg,rgba(17,24,39,0.84)_0%,rgba(127,29,29,0.7)_42%,rgba(245,158,11,0.42)_100%)] border-amber-200/30 text-white/90";
    case "streak": return owned ? "bg-[linear-gradient(90deg,#052e16_0%,#0f766e_42%,#86efac_100%)] border-emerald-200/60 text-white" : "bg-[linear-gradient(90deg,rgba(5,46,22,0.84)_0%,rgba(15,118,110,0.7)_42%,rgba(134,239,172,0.42)_100%)] border-emerald-200/30 text-white/90";
    case "vault": return owned ? "bg-[linear-gradient(90deg,#052e16_0%,#0f766e_42%,#f59e0b_100%)] border-emerald-200/60 text-white" : "bg-[linear-gradient(90deg,rgba(5,46,22,0.84)_0%,rgba(15,118,110,0.7)_42%,rgba(245,158,11,0.42)_100%)] border-emerald-200/30 text-white/90";
    case "auroraforge": return owned ? "bg-[linear-gradient(90deg,#0f172a_0%,#0ea5e9_24%,#10b981_48%,#8b5cf6_72%,#f472b6_100%)] border-white/60 text-white" : "bg-[linear-gradient(90deg,rgba(15,23,42,0.86)_0%,rgba(14,165,233,0.4)_24%,rgba(16,185,129,0.4)_48%,rgba(139,92,246,0.4)_72%,rgba(244,114,182,0.4)_100%)] border-white/28 text-white/90";
    case "prismaticlegend": return owned ? "bg-[linear-gradient(90deg,#1d4ed8_0%,#14b8a6_24%,#7c3aed_48%,#ec4899_72%,#f59e0b_100%)] border-white/65 text-white" : "bg-[linear-gradient(90deg,rgba(29,78,216,0.42)_0%,rgba(20,184,166,0.42)_24%,rgba(124,58,237,0.42)_48%,rgba(236,72,153,0.42)_72%,rgba(245,158,11,0.42)_100%)] border-white/30 text-white/90";
    case "timesurge": return owned ? "bg-[linear-gradient(90deg,#0f172a_0%,#155e75_32%,#0ea5e9_68%,#22d3ee_100%)] border-cyan-200/60 text-white" : "bg-[linear-gradient(90deg,rgba(15,23,42,0.84)_0%,rgba(21,94,117,0.5)_32%,rgba(14,165,233,0.4)_68%,rgba(34,211,238,0.42)_100%)] border-cyan-200/30 text-white/90";
    case "quantumcore": return owned ? "bg-[linear-gradient(90deg,#020617_0%,#312e81_34%,#7c3aed_68%,#ec4899_100%)] border-violet-200/60 text-white" : "bg-[linear-gradient(90deg,rgba(2,6,23,0.84)_0%,rgba(49,46,129,0.5)_34%,rgba(124,58,237,0.4)_68%,rgba(236,72,153,0.42)_100%)] border-violet-200/30 text-white/90";
    case "eternalglow": return owned ? "bg-[linear-gradient(90deg,#0f766e_0%,#1d4ed8_22%,#7c3aed_48%,#ec4899_74%,#f59e0b_100%)] border-white/70 text-white" : "bg-[linear-gradient(90deg,rgba(15,118,110,0.46)_0%,rgba(29,78,216,0.4)_22%,rgba(124,58,237,0.4)_48%,rgba(236,72,153,0.42)_74%,rgba(245,158,11,0.42)_100%)] border-white/34 text-white/90";
    default: return owned ? "bg-white/30 border-white/50 text-white" : "bg-white/10 border-white/20 text-white/80";
  }
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const fakeMultiplayerNames = [
  "Ava", "Kai", "Zara", "Noah", "Mila", "Leo", "Ruby", "Arlo", "Luca", "Evie",
  "Jett", "Isla", "Hudson", "Willow", "Sienna", "Mason", "Poppy", "Harvey", "Aaliyah", "Flynn",
  "Matilda", "Nate", "Chloe", "Oscar", "Georgia", "Ethan", "Sage", "Finn", "Layla", "Cooper",
  "Maya", "Asher", "Elodie", "Xavier", "Zoe", "Riley", "Addison", "Roman", "Audrey", "Hugo",
  "Amelia", "Beau", "Elsie", "Dylan", "Piper", "Max", "Ari", "Rory", "Hazel", "Jack",
  "Sadie", "Owen", "Lilah", "Charlie", "Thea", "Louis", "Maddox", "Nina", "Eli", "Freya",
  "Axel", "Ivy", "Jasper", "Mabel", "Bodhi", "Hallie", "Miles", "Tessa", "Declan", "Ayla",
  "Seb", "Nova", "Spencer", "Bonnie", "Ruben", "Daisy", "Felix", "Skye", "Callum", "Zahra",
  "Remy", "Mikayla", "Niko", "Sophie", "Kobe", "Lucia", "Toby", "Heidi", "Angus", "Marnie",
  "Brody", "Cleo", "Isaac", "Anika", "Billy", "Phoebe", "Tyson", "Imogen", "Rafael", "Keira"
];

function getPremiumRingOverlayClass(ringId) {
  switch (ringId) {
    case "ring-rainbow":
      return "bg-[conic-gradient(from_180deg_at_50%_50%,#fb7185_0deg,#facc15_70deg,#4ade80_140deg,#38bdf8_220deg,#a78bfa_290deg,#fb7185_360deg)]";
    case "ring-aurora":
      return "bg-[linear-gradient(135deg,#6ee7b7_0%,#22d3ee_40%,#818cf8_100%)]";
    case "ring-prism":
      return "bg-[conic-gradient(from_90deg_at_50%_50%,#e0f2fe_0deg,#bae6fd_90deg,#c4b5fd_180deg,#f5d0fe_270deg,#e0f2fe_360deg)]";
    case "ring-eclipse":
      return "bg-[conic-gradient(from_180deg_at_50%_50%,#1e1b4b_0deg,#312e81_90deg,#ec4899_220deg,#1e1b4b_360deg)]";
    case "ring-crownfire":
      return "bg-[conic-gradient(from_180deg_at_50%_50%,#fde68a_0deg,#f59e0b_120deg,#fb7185_230deg,#fde68a_360deg)]";
    case "ring-heartburst":
    case "ring-rainbowhearts":
    case "ring-mythichearts":
      return "bg-[radial-gradient(circle_at_50%_50%,rgba(244,114,182,0.0)_0%,rgba(244,114,182,0.0)_42%,rgba(244,114,182,0.95)_43%,rgba(244,114,182,0.95)_49%,transparent_50%),radial-gradient(circle_at_22%_24%,rgba(255,255,255,0.95)_0_7%,transparent_8%),radial-gradient(circle_at_78%_24%,rgba(255,255,255,0.95)_0_7%,transparent_8%),radial-gradient(circle_at_50%_78%,rgba(255,255,255,0.95)_0_6%,transparent_7%)]";
    case "ring-starshine":
    case "ring-crystalstars":
    case "ring-candystars":
    case "ring-legendstars":
      return "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.96)_43%,rgba(255,255,255,0.96)_49%,transparent_50%),radial-gradient(circle_at_22%_24%,rgba(253,224,71,0.95)_0_5%,transparent_6%),radial-gradient(circle_at_78%_24%,rgba(253,224,71,0.95)_0_5%,transparent_6%),radial-gradient(circle_at_50%_78%,rgba(253,224,71,0.95)_0_5%,transparent_6%)]";
    case "ring-dot-pop":
      return "bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.9)_0_5%,transparent_6%),radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.9)_0_5%,transparent_6%),radial-gradient(circle_at_18%_78%,rgba(255,255,255,0.9)_0_5%,transparent_6%),radial-gradient(circle_at_82%_78%,rgba(255,255,255,0.9)_0_5%,transparent_6%)]";
    case "ring-cometcrown":
      return "bg-[conic-gradient(from_180deg_at_50%_50%,#e0f2fe_0deg,#38bdf8_120deg,#ffffff_220deg,#e0f2fe_360deg)]";
    default:
      return null;
  }
}

function isPremiumRing(ringId) {
  return Boolean(getPremiumRingOverlayClass(ringId));
}

function getEmojiVisualOffsetClass(emoji) {
  const symbol = String(emoji || "");
  if (symbol === "👑") return "-translate-y-[10%]";
  return "";
}

function getEmojiVisualClass(emoji, sizeClass = "") {
  return cn(
    "w-full h-full flex items-center justify-center leading-none relative z-10 scale-125",
    getEmojiVisualOffsetClass(emoji),
    sizeClass
  );
}

function getCircularBackgroundClass(style) {
  return cn("absolute inset-[-2px] rounded-full", style || "bg-slate-900/70");
}

function getBoostMultiplierFromType(type) {
  switch (type) {
    case "coinMultiplier4x":
      return 4;
    case "coinMultiplier3x":
      return 3;
    case "coinMultiplier2x":
      return 2;
    default:
      return 1;
  }
}

function getMultiplayerLevelFromMode(selectedMode, history) {
  const safeHistory = history || { addsubLevel: "AdS3", muldivLevel: "MuS3" };
  if (selectedMode === "addsub") return safeHistory.addsubLevel || "AdS3";
  if (selectedMode === "muldiv") return safeHistory.muldivLevel || "MuS3";
  if (selectedMode === "mixed") {
    return {
      addsubLevel: safeHistory.addsubLevel || "AdS3",
      muldivLevel: safeHistory.muldivLevel || "MuS3",
    };
  }
  return safeHistory.addsubLevel || "AdS3";
}

function buildFakeMultiplayerOpponents(selectedMode, raceLevel) {
  const names = shuffle(fakeMultiplayerNames).slice(0, 3);
  const emojiOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "emoji" && item.emoji)
    .map((item) => item.emoji);
  const backgroundOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "background")
    .map((item) => item.style)
    .filter(Boolean);
  const ringOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "ring")
    .map((item) => ({ style: item.style, overlay: getPremiumRingOverlayClass(item.id) }))
    .filter((item) => item.style);
  const raceKey = getMultiplayerRaceKey(selectedMode, raceLevel);
  const playerBestTime = Number(readMultiplayerBests()[raceKey] || 0);

  function makeAppearance() {
    const ring = choice(ringOptions.length ? ringOptions : [{ style: "", overlay: null }]);
    return {
      icon: choice(emojiOptions.length ? emojiOptions : ["🐨", "🦘", "🐊", "🦉", "🐸", "🦊"]),
      backgroundStyle: choice(backgroundOptions.length ? backgroundOptions : ["bg-slate-900/70"]),
      ringStyle: ring.style || "",
      ringOverlay: ring.overlay || null,
    };
  }

  return [
    {
      id: `bot-question-${names[0]}`,
      name: names[0],
      ...makeAppearance(),
      strategy: "questionTracker",
      progress: 0,
      joined: false,
      joinAt: randInt(0, MULTIPLAYER_WAIT_SECONDS),
      burst: false,
      lockedPacePerSecond: null,
      finished: false,
      finishOrdinal: null,
      targetDuration: null,
    },
    {
      id: `bot-time-${names[1]}`,
      name: names[1],
      ...makeAppearance(),
      strategy: "timeTracker",
      progress: 0,
      joined: false,
      joinAt: randInt(0, MULTIPLAYER_WAIT_SECONDS),
      burst: false,
      lockedPacePerSecond: null,
      finished: false,
      finishOrdinal: null,
      targetDuration: null,
    },
    {
      id: `bot-best-${names[2]}`,
      name: names[2],
      ...makeAppearance(),
      strategy: "personalBest",
      progress: 0,
      joined: false,
      joinAt: randInt(0, MULTIPLAYER_WAIT_SECONDS),
      burst: false,
      lockedPacePerSecond: null,
      finished: false,
      finishOrdinal: null,
      targetDuration: playerBestTime > 0 ? Math.max(60, playerBestTime) : randInt(120, 200),
    },
  ];
}

function createKingChallenger() {
  const emojiOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "emoji" && item.emoji)
    .map((item) => item.emoji);
  const backgroundOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "background")
    .map((item) => item.style)
    .filter(Boolean);
  const ringOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "ring")
    .map((item) => ({ style: item.style, overlay: getPremiumRingOverlayClass(item.id) }))
    .filter((item) => item.style);
  const ring = choice(ringOptions.length ? ringOptions : [{ style: "", overlay: null }]);

  return {
    id: `king-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: choice(fakeMultiplayerNames),
    icon: choice(emojiOptions.length ? emojiOptions : ["🐨", "🦘", "🐊", "🦉", "🐸", "🦊"]),
    backgroundStyle: choice(backgroundOptions.length ? backgroundOptions : ["bg-slate-900/70"]),
    ringStyle: ring.style || "",
    ringOverlay: ring.overlay || null,
  };
}

function getFreeFallMaxConcurrent(elapsedMs = 0) {
  if (elapsedMs < 18000) return 1;
  if (elapsedMs < 42000) return 2;
  if (elapsedMs < 70000) return 3;
  return 4;
}

function getFreeFallFallDurationMs(elapsedMs = 0) {
  if (elapsedMs < 18000) return 12000;
  if (elapsedMs < 42000) return 10200;
  if (elapsedMs < 70000) return 9000;
  return 7800;
}

function getFreeFallSpawnDelayMs(elapsedMs = 0) {
  if (elapsedMs < 18000) return 1200;
  if (elapsedMs < 42000) return 900;
  if (elapsedMs < 70000) return 700;
  return 560;
}

function buildFreeFallQuestion(activeQuestions = [], selectedMode, selectedLevel, elapsedMs = 0) {
  const activeAnswers = activeQuestions
    .filter((question) => !question.resolvedAt)
    .map((question) => String(question.answer || "").trim().toLowerCase());

  let nextQuestion = null;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const candidate = generateQuestion(selectedMode, selectedLevel);
    const answerKey = String(candidate.answer || "").trim().toLowerCase();
    if (!activeAnswers.includes(answerKey)) {
      nextQuestion = candidate;
      break;
    }
  }

  if (!nextQuestion) return null;

  const occupiedLanes = new Set(activeQuestions.filter((question) => !question.resolvedAt).map((question) => question.lane));
  const availableLanes = FREE_FALL_LANES.filter((lane) => !occupiedLanes.has(lane));
  const lane = choice(availableLanes.length ? availableLanes : FREE_FALL_LANES);
  const spawnedAt = Date.now();
  const isSpecial = Math.random() < FREE_FALL_SPECIAL_CHANCE;
  const isFast = !isSpecial && Math.random() < FREE_FALL_FAST_CHANCE;
  const baseDurationMs = getFreeFallFallDurationMs(elapsedMs);

  return {
    ...nextQuestion,
    id: `freefall-${spawnedAt}-${Math.random().toString(36).slice(2, 8)}`,
    lane,
    progress: 0,
    durationMs: isFast ? Math.max(2600, Math.round(baseDurationMs * FREE_FALL_FAST_DURATION_MULTIPLIER)) : baseDurationMs,
    spawnedAt,
    isSpecial,
    isFast,
    goldUntil: spawnedAt + (isSpecial ? FREE_FALL_SPECIAL_GOLD_MS : 0),
    resolvedAt: null,
    flash: null,
  };
}

function createTugTeacher(roundIndex = 0) {
  const emojiOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "emoji" && item.emoji)
    .map((item) => item.emoji);
  const backgroundOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "background")
    .map((item) => item.style)
    .filter(Boolean);
  const ringOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "ring")
    .map((item) => ({ style: item.style, overlay: getPremiumRingOverlayClass(item.id) }))
    .filter((item) => item.style);

  const roundNumber = roundIndex + 1;
  const teacherPool = TUG_TEACHER_POOLS[roundNumber] || [{ name: `Teacher ${roundNumber}`, icon: "🧑‍🏫" }];
  const selectedTeacher = choice(teacherPool);
  const ring = choice(ringOptions.length ? ringOptions : [{ style: "", overlay: null }]);
  const safeId = String(selectedTeacher?.name || `Teacher ${roundNumber}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    id: `tug-teacher-${roundNumber}-${safeId || roundNumber}`,
    roundNumber,
    name: selectedTeacher?.name || `Teacher ${roundNumber}`,
    icon: selectedTeacher?.icon || choice(emojiOptions.length ? emojiOptions : ["🦉", "🐲", "🦊", "🗿", "🧠", "🤖"]),
    backgroundStyle: selectedTeacher?.backgroundStyle || choice(backgroundOptions.length ? backgroundOptions : ["bg-slate-900/70"]),
    ringStyle: selectedTeacher?.ringStyle || ring.style || "",
    ringOverlay: selectedTeacher?.ringOverlay || ring.overlay || null,
  };
}

/* mode labels */
const modeMeta = {
  addsub: {
    title: "Addition / Subtraction",
    description: "Build mental strategies for efficient addition and subtraction.",
  },
  muldiv: {
    title: "Multiplication / Division",
    description: "Strengthen known facts, multiplicative thinking and inverse strategies.",
  },
  mixed: {
    title: "Mixed",
    description: "A combined challenge across additive and multiplicative thinking.",
  },
  testing: {
    title: "Testing Mode",
    description: "Adaptive placement that works out a student’s current AdS and MuS level.",
  },
  multiplayer: {
    title: "Multiplayer",
    description: "Race against three other players using your saved progression level.",
  },
  timetrial: {
    title: "Time Trial",
    description: "A 1-minute sprint against the clock using your saved progression level.",
  },
  king: {
    title: "King of the Hill",
    description: "Survive 15-question rounds as each new round gives you less time per question.",
  },
  tug: {
    title: "Tug of War",
    description: "Pull the rope against a teacher opponent. Every correct answer drags the rope your way while the teacher keeps tugging back faster each round.",
  },
  freefall: {
    title: "Free Fall",
    description: "Answer falling questions before they hit the bottom line. Special gold questions can give you an extra life if you answer them quickly.",
  },
};

const levelInfo = {
  addsub: [
    {
      level: "AdS3",
      skill: "Facts to 10",
      entries: [
        { type: "Adding numbers to 10", example: "2 + 5", strategy: "Use known number facts to 10 and count on if needed." },
        { type: "Subtracting numbers to 10", example: "10 − 7", strategy: "Think about the missing part that makes 10." },
      ],
    },
    {
      level: "AdS4",
      skill: "Addition to 20",
      entries: [
        { type: "1–10 addition", example: "1 + 3", strategy: "Use basic known facts within 10." },
        { type: "7–15 addition", example: "13 + 3", strategy: "Count on from the larger number." },
        { type: "11–20 addition", example: "18 + 5", strategy: "Bridge to 20 if it helps." },
        { type: "Friends of 20", example: "5 + 15", strategy: "Learn and recall pairs that make 20." },
        { type: "Missing addend to 20", example: "20 = 12 + ___", strategy: "Think about the missing part needed to make 20." },
      ],
    },
    {
      level: "AdS5",
      skill: "Subtraction to 20",
      entries: [
        { type: "1–10 subtraction", example: "10 − 3", strategy: "Use subtraction facts within 10." },
        { type: "1–15 subtraction", example: "15 − 9", strategy: "Count back or think about the difference." },
        { type: "6–20 subtraction", example: "20 − 12", strategy: "Use the gap between the numbers." },
        { type: "Friends of 20", example: "20 − ___", strategy: "Think about what must be taken away from 20." },
        { type: "Missing subtrahend to 20", example: "8 = 20 − ___", strategy: "Find the missing number by thinking about the gap to 20." },
      ],
    },
    {
      level: "AdS6",
      skill: "Bridging to 10 and part-part-whole",
      entries: [
        { type: "Bridging to 10 (addition)", example: "16 + 11", strategy: "Split one number to bridge through 20 or the nearest ten." },
        { type: "Bridging to 10 (subtraction)", example: "18 − 9", strategy: "Subtract to 10 first, then subtract the rest." },
        { type: "Near doubles", example: "8 + 7", strategy: "Use a doubles fact, then adjust by 1." },
        { type: "Part–part–whole (addition)", example: "15 = 6 + ___", strategy: "Think about the missing part of the whole." },
        { type: "Part–part–whole (subtraction)", example: "10 = 17 − ___", strategy: "Work backwards to find what was removed." },
      ],
    },
    {
      level: "AdS7",
      skill: "Two-digit mental addition and subtraction",
      entries: [
        { type: "Bridging the decade (addition)", example: "35 + 6 + 5", strategy: "Make the next ten first, then add what is left." },
        { type: "2 × 2 digit addition (no trading)", example: "25 + 15", strategy: "Add tens and ones separately." },
        { type: "2 × 2 digit addition (some trading)", example: "49 + 23", strategy: "Add tens and ones, then trade when needed." },
        { type: "Bridging the decade (subtraction)", example: "32 − 6 − 2", strategy: "Subtract to the nearest ten first." },
        { type: "2 × 2 digit subtraction (some trading)", example: "75 − 17", strategy: "Subtract tens and ones carefully, trading mentally if needed." },
      ],
    },
    {
      level: "AdS8",
      skill: "Three-digit addition and subtraction",
      entries: [
        { type: "3 × 3 addition (no trading)", example: "559 + 330", strategy: "Think in hundreds, tens and ones separately." },
        { type: "3 × 3 addition (some trading)", example: "658 + 216", strategy: "Use column-style mental thinking and trade carefully." },
        { type: "3 × 3 subtraction (no trading)", example: "768 − 404", strategy: "Subtract each place value separately." },
        { type: "3 × 3 subtraction (trading)", example: "332 − 164", strategy: "Trade across place value when needed." },
      ],
    },
    {
      level: "AdS9",
      skill: "Decimal addition and subtraction",
      entries: [
        { type: "Addition with decimals", example: "7.61 + 4.82", strategy: "Line up place value and think about whole numbers first." },
        { type: "Subtraction with decimals", example: "4.28 − 3.83", strategy: "Think about ones, tenths and hundredths separately." },
      ],
    },
    {
      level: "AdS10",
      skill: "Fractions with unlike denominators",
      entries: [
        { type: "Adding fractions with unlike denominators", example: "9/10 + 4/25", strategy: "Rename both fractions with a common denominator first." },
        { type: "Subtracting fractions with unlike denominators", example: "7/10 − 1/25", strategy: "Convert to equivalent fractions before subtracting." },
      ],
    },
  ],
  muldiv: [
    {
      level: "MuS3",
      skill: "Skip counting, groups and repeated addition",
      entries: [
        { type: "Skip counting by 10s, 5s and 2s – on and off the decade", example: "2, 12, 22, 32, ____", strategy: "Use skip counting patterns and keep the count size steady." },
        { type: "Repeated addition + subtraction", example: "10 + 10 + 10", strategy: "Treat repeated addition as skip counting in equal jumps." },
        { type: "Groups of", example: "2 groups of 2", strategy: "Think of each group as the same size and count by groups." },
      ],
    },
    {
      level: "MuS4",
      skill: "Repeated addition, groups, product and sharing",
      entries: [
        { type: "Repeated addition", example: "2 + 2 + 2", strategy: "Use skip counting to combine equal parts quickly." },
        { type: "Groups of", example: "4 groups of 5", strategy: "Skip count by the size of each group." },
        { type: "Find the product", example: "10 fives", strategy: "Use skip counting or known multiplication facts." },
        { type: "Sharing", example: "18 shared between 3", strategy: "Skip count from the quotient to build the total." },
      ],
    },
    {
      level: "MuS5-A",
      skill: "2, 5 and 10 facts",
      entries: [
        { type: "2, 5, 10 multiplication facts", example: "5 × 2", strategy: "Build automatic recall and use flexible strategies for multiplication facts." },
        { type: "Division with 2, 5 and 10 multiplication facts", example: "60 ÷ 10", strategy: "Use the inverse relationship and known facts." },
      ],
    },
    {
      level: "MuS5-B",
      skill: "2, 5, 10, 3 and 4 facts",
      entries: [
        { type: "2, 5, 10, 3 and 4 multiplication facts", example: "4 × 5", strategy: "Use automaticity and flexible fact strategies." },
        { type: "Division with 2, 5, 10, 3 and 4 multiplication facts", example: "24 ÷ 3", strategy: "Work backwards from known multiplication facts." },
      ],
    },
    {
      level: "MuS5-C",
      skill: "6, 7, 8 and 9 facts",
      entries: [
        { type: "6, 7, 8 and 9 multiplication facts", example: "9 × 7", strategy: "Use automatic recall and flexible derived fact strategies." },
        { type: "Division with 6, 7, 8 and 9 multiplication facts", example: "72 ÷ 8", strategy: "Use inverse thinking with known multiplication facts." },
      ],
    },
    {
      level: "MuS6",
      skill: "Missing numbers, vocabulary and factors",
      entries: [
        { type: "Find the missing quotient", example: "8 × ___ = 64", strategy: "Use the inverse relationship of multiplication and division." },
        { type: "Find the missing dividend", example: "81 ÷ ___ = 9", strategy: "Use flexible multiplication facts to find the missing number." },
        { type: "Find the product", example: "What is the product of 4 and 8", strategy: "Know the vocabulary and connect it to multiplication." },
        { type: "Find multiples", example: "Find the next 3 multiples of 5", strategy: "Use vocabulary knowledge and flexible multiplication facts." },
        { type: "Factorising", example: "Is 6 a factor of 49?", strategy: "Use vocabulary knowledge and check using known facts." },
      ],
    },
    {
      level: "MuS7-A",
      skill: "11 and 12 facts",
      entries: [
        { type: "11 and 12 multiplication facts", example: "11 × 12", strategy: "Build automatic recall of 11 and 12 facts." },
        { type: "Division with 11 and 12 multiplication facts", example: "88 ÷ 11", strategy: "Use inverse relationships with 11 and 12 facts." },
      ],
    },
    {
      level: "MuS7-B",
      skill: "Benchmark numbers and decomposition",
      entries: [
        { type: "Double and half", example: "3 × 8 = 6 × __", strategy: "Use the relationship between factors by doubling one and halving the other." },
        { type: "Multiplying by benchmark numbers (10, 100 and 25)", example: "6 × 100", strategy: "Use place value knowledge and area-model thinking." },
        { type: "1 × 2 digit (up to 20)", example: "3 × 14", strategy: "Decompose: 3 × 10 + 3 × 4." },
        { type: "Dividing by 10 and 100", example: "800 ÷ 10", strategy: "Use place value knowledge." },
        { type: "Dividing large multiples by 2, 5 and 10", example: "150 ÷ 5", strategy: "Use flexible factor finding and partitioning." },
      ],
    },
    {
      level: "MuS8",
      skill: "Larger multiplication, division and BODMAS",
      entries: [
        { type: "Multiply numbers by a decade", example: "8 × 60", strategy: "Use decomposition with place value." },
        { type: "1 × 2 digit multiplication", example: "3 × 47", strategy: "Decompose: 3 × 40 + 3 × 7." },
        { type: "100 as a benchmark", example: "7 × 102", strategy: "Use compensation: 7 × 100 + 7 × 2." },
        { type: "3-digit decade × 1 digit", example: "170 × 3", strategy: "Decompose by place value parts." },
        { type: "Dividing by 4, 6 and 8", example: "96 ÷ 6", strategy: "Use decomposition and known multiplication chunks." },
        { type: "BODMAS", example: "102 + 42 ÷ 2", strategy: "Apply order of operations correctly." },
      ],
    },
    {
      level: "MuS9",
      skill: "Roots, indices, decimals and percentages",
      entries: [
        { type: "Solving square roots up to 12 × 12", example: "√9", strategy: "Recall square numbers and their matching roots." },
        { type: "Adding roots", example: "√9 + √4", strategy: "Solve each root first, then add." },
        { type: "Square numbers", example: "5²", strategy: "Use index notation knowledge for squares." },
        { type: "Multiplying by decimals", example: "36 × 1.5", strategy: "Use known decimal multipliers such as 0.1, 0.25, 0.5, 0.75, 1.5 and 2.5." },
        { type: "Dividing by decimals", example: "28 ÷ 0.1", strategy: "Use known decimal divisors and place value relationships." },
        { type: "Finding simple percentages", example: "10% of 2000", strategy: "Use multiplication by common percentages." },
      ],
    },
  ],
};

export default function NSWProgressionsMathGame() {
  const [screen, setScreen] = useState("home");
  const [cheatModeActive, setCheatModeActive] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [purchasedItemsOpen, setPurchasedItemsOpen] = useState(false);
  const [selectedShopCategory, setSelectedShopCategory] = useState("emoji");
  const [emojiShopTab, setEmojiShopTab] = useState("standard");
  const [backgroundShopTab, setBackgroundShopTab] = useState("standard");
  const [ringShopTab, setRingShopTab] = useState("standard");
  const [upgradesShopTab, setUpgradesShopTab] = useState("standard");
  const [profileState, setProfileState] = useState({ coins: 0, ownedItems: [], equippedItems: [], activeBoosts: [] });
  const [playerName, setPlayerName] = useState("");
  const [isEditingPlayerName, setIsEditingPlayerName] = useState(false);
  const [draftPlayerName, setDraftPlayerName] = useState("");
  const [themeId, setThemeId] = useState("blue");
  const [boostCountdownNow, setBoostCountdownNow] = useState(Date.now());
  const [roundReward, setRoundReward] = useState(null);
  const [testingCoinsEarned, setTestingCoinsEarned] = useState(0);
  const [multiplayerState, setMultiplayerState] = useState(null);
  const [timeTrialState, setTimeTrialState] = useState(null);
  const [timeTrialCountdown, setTimeTrialCountdown] = useState(null);
  const [kingState, setKingState] = useState(null);
  const [kingIntroDeadline, setKingIntroDeadline] = useState(null);
  const [tugState, setTugState] = useState(null);
  const [tugIntroDeadline, setTugIntroDeadline] = useState(null);
  const [tugFlash, setTugFlash] = useState(null);
  const [freeFallState, setFreeFallState] = useState(null);
  const tugFlashTimeoutRef = useRef(null);
  const [mode, setMode] = useState(null);
  const [sessionType, setSessionType] = useState(null);
  const [practiseQuestionCount, setPractiseQuestionCount] = useState(15);
  const [activeRoundConfig, setActiveRoundConfig] = useState(PRACTISE_ROUND_OPTIONS[15]);
  const [level, setLevel] = useState(null);
  const [mixedSelection, setMixedSelection] = useState({ addsubLevel: null, muldivLevel: null });
  const [userHistory, setUserHistory] = useState({ addsubLevel: "AdS3", muldivLevel: "MuS3" });
  const [testingScores, setTestingScores] = useState({ addsubScore: null, muldivScore: null });
  const [hasCompletedTesting, setHasCompletedTesting] = useState(false);
  const [pendingTestingExitConfirm, setPendingTestingExitConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [generatedSaveCode, setGeneratedSaveCode] = useState("");
  const [saveCodeInput, setSaveCodeInput] = useState("");
  const [saveCodeStatus, setSaveCodeStatus] = useState("");
  const [showPasswordEntry, setShowPasswordEntry] = useState(false);
  const [passwordPanelMode, setPasswordPanelMode] = useState(null);
  const [homeModeGroup, setHomeModeGroup] = useState("testing");
  const [testingStartSelector, setTestingStartSelector] = useState(null);
  const [manualTestingStart, setManualTestingStart] = useState({ addsubLevel: "AdS3", muldivLevel: "MuS3" });
  const [testingState, setTestingState] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_ROUND_TIME);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [roundFinished, setRoundFinished] = useState(false);
  const inputRef = useRef(null);
  const playerNameInputRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  const exitToHome = () => {
    setPendingTestingExitConfirm(false);
    setCurrentIndex(0);
    setQuestions([]);
    setAnswer("");
    setFeedback(null);
    setResults([]);
    setRoundFinished(false);
    setTimeLeft(DEFAULT_ROUND_TIME);
    setTimeTrialState(null);
    setTimeTrialCountdown(null);
    setMultiplayerState(null);
    setKingState(null);
    setKingIntroDeadline(null);
    setTugState(null);
    setTugIntroDeadline(null);
    setTugFlash(null);
    setFreeFallState(null);
    setRoundReward(null);
    setTestingCoinsEarned(0);
    setTestingStartSelector(null);
    setShowPasswordEntry(false);
    setPasswordPanelMode(null);
    setIsEditingPlayerName(false);
    setScreen("home");
    setMode(null);
    setSessionType(null);
    setLevel(null);
    setMixedSelection({ addsubLevel: null, muldivLevel: null });
    setTestingState(null);
  };

  function triggerTugFlash(side) {
    const flashKey = `${side}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    if (tugFlashTimeoutRef.current) {
      window.clearTimeout(tugFlashTimeoutRef.current);
    }
    setTugFlash({ side, key: flashKey });
    tugFlashTimeoutRef.current = window.setTimeout(() => {
      setTugFlash((current) => current?.key === flashKey ? null : current);
    }, 420);
  }
  const isTestingMode = mode === "testing";
  const isMultiplayerMode = mode === "multiplayer";
  const isTimeTrialMode = mode === "timetrial";
  const roundQuestionCount = Number(activeRoundConfig?.questionCount || DEFAULT_QUESTION_COUNT);
  const roundTimeLimit = Number(activeRoundConfig?.timeLimit || DEFAULT_ROUND_TIME);
  const currentPassScore = sessionType === "practice" ? getPractisePassScore(roundQuestionCount) : PASS_SCORE;
  const score = useMemo(() => results.filter((r) => r.correct).length, [results]);
  const progressValue = (results.length / Math.max(1, roundQuestionCount)) * 100;
  const multiplayerPlayerProgress = multiplayerState ? Math.min(100, (multiplayerState.playerScore / MULTIPLAYER_TARGET_SCORE) * 100) : 0;
  const expectedAnsweredByNow = ((roundTimeLimit - timeLeft) / Math.max(1, roundTimeLimit)) * roundQuestionCount;
  const paceDelta = results.length - expectedAnsweredByNow;
  const currentRoundTime = isTimeTrialMode ? TIME_TRIAL_SECONDS : roundTimeLimit;
  const timerProgress = ((currentRoundTime - timeLeft) / currentRoundTime) * 100;
  const timeTrialCountdownLabel = isTimeTrialMode && timeTrialCountdown !== null ? TIME_TRIAL_COUNTDOWN_STEPS[timeTrialCountdown] : null;
  const isTimeTrialInteractionLocked = isTimeTrialMode && timeTrialCountdown !== null;

  useEffect(() => {
    setUserHistory(readUserHistory());
    setProfileState(readProfileState());
    setThemeId(readThemeId());
    setTestingScores(readTestingScores());
    setHasCompletedTesting(readTestingUnlock());
    const savedName = readPlayerName();
    setPlayerName(savedName);
    setDraftPlayerName(savedName);
  }, []);

  useEffect(() => {
    return () => {
      if (tugFlashTimeoutRef.current) {
        window.clearTimeout(tugFlashTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (screen === "game" && !roundFinished && timeLeft > 0 && !(isTimeTrialMode && timeTrialCountdown !== null)) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (screen === "game" && timeLeft <= 0 && !roundFinished) {
      finishRound();
    }
  }, [screen, timeLeft, roundFinished, isTimeTrialMode, timeTrialCountdown]);

  useEffect(() => {
    const pauseKingTimer = feedback === "correct";
    if (screen === "kingGame" && !roundFinished && !pauseKingTimer && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (screen === "kingGame" && timeLeft <= 0 && !roundFinished && !pauseKingTimer) {
      finishKingRun("Time ran out");
    }
  }, [screen, timeLeft, roundFinished, feedback]);

  useEffect(() => {
    if (screen !== "game" || !isTimeTrialMode || timeTrialCountdown === null) return;
    const timer = setTimeout(() => {
      setTimeTrialCountdown((current) => {
        if (current === null) return current;
        return current >= TIME_TRIAL_COUNTDOWN_STEPS.length - 1 ? null : current + 1;
      });
    }, timeTrialCountdown === TIME_TRIAL_COUNTDOWN_STEPS.length - 1 ? 750 : 1050);
    return () => clearTimeout(timer);
  }, [screen, isTimeTrialMode, timeTrialCountdown]);

  useEffect(() => {
    if (screen !== "kingIntermission" || !kingState) return;
    const step = Number(kingState.intermissionStep || 0);
    const timer = setTimeout(() => {
      if (step >= KING_OF_THE_HILL_INTERMISSION_STEPS.length - 1) {
        const nextRound = Number(kingState.roundNumber || 1) + 1;
        const nextTimePerQuestion = Math.max(KING_OF_THE_HILL_MIN_SECONDS, KING_OF_THE_HILL_START_SECONDS - (nextRound - 1));
        const nextState = {
          ...kingState,
          roundNumber: nextRound,
          timePerQuestion: nextTimePerQuestion,
          challenger: createKingChallenger(),
          intermissionStep: 0,
          intermissionLabel: null,
        };
        setKingState(nextState);
        setKingIntroDeadline(Date.now() + 4000);
        setScreen("kingIntro");
        return;
      }

      setKingState((current) => current ? {
        ...current,
        intermissionStep: step + 1,
        intermissionLabel: KING_OF_THE_HILL_INTERMISSION_STEPS[step + 1],
      } : current);
    }, 1140);
    return () => clearTimeout(timer);
  }, [screen, kingState]);

  useEffect(() => {
    if (screen !== "kingIntro" || !kingState) return;
    const timer = setTimeout(() => {
      beginKingRound(kingState);
    }, 4000);
    return () => clearTimeout(timer);
  }, [screen, kingState]);

  useEffect(() => {
    if (screen !== "tugIntro" || !tugState) return;
    const timer = setTimeout(() => {
      beginTugRound(tugState);
    }, TUG_OF_WAR_INTRO_MS);
    return () => clearTimeout(timer);
  }, [screen, tugState]);

  useEffect(() => {
    if (screen !== "tugGame" || !tugState || feedback) return;
    const timer = setInterval(() => {
      let losingState = null;
      let teacherPulled = false;
      setTugState((current) => {
        if (!current) return current;
        const updated = resolveTugStateAtTime(current, Date.now());
        if (updated !== current && Number(updated.ropePosition || 0) < Number(current.ropePosition || 0)) {
          teacherPulled = true;
        }
        if (updated !== current && updated.ropePosition <= 0) {
          losingState = updated;
        }
        return updated;
      });
      if (teacherPulled) {
        triggerTugFlash("teacher");
      }
      if (losingState) {
        finishTugRun("The teacher pulled the rope across.", losingState);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [screen, tugState, feedback]);

  useEffect(() => {
    if (screen !== "freeFallGame" || !freeFallState || freeFallState.gameOver) return;

    let lastTick = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTick;
      lastTick = now;
      setFreeFallState((current) => {
        if (!current || current.gameOver) return current;

        const elapsedMs = now - Number(current.startedAt || now);
        const maxConcurrent = getFreeFallMaxConcurrent(elapsedMs);
        let lives = Number(current.lives || FREE_FALL_START_LIVES);
        let currentStreak = Number(current.currentStreak || 0);
        let bestStreak = Number(current.bestStreak || 0);
        const incorrectItems = [...(current.incorrectItems || [])];
        const announcements = (current.announcements || []).filter((item) => Number(item.expiresAt || 0) > now);

        const activeQuestions = [];
        for (const question of current.activeQuestions || []) {
          if (question.resolvedAt && now - question.resolvedAt > FREE_FALL_BOX_FLASH_MS) {
            continue;
          }

          if (!question.resolvedAt) {
            const nextProgress = Number(question.progress || 0) + deltaMs / Math.max(1, Number(question.durationMs || 1));
            if (nextProgress >= 1) {
              lives -= 1;
              currentStreak = 0;
              incorrectItems.push({
                prompt: question.prompt,
                expected: question.answer,
                given: "",
                correct: false,
                strategy: tipFromQuestion(question),
                reason: "Missed",
              });
              announcements.push({
                id: `freefall-miss-${question.id}`,
                text: "Life lost",
                style: "miss",
                expiresAt: now + 900,
              });
              activeQuestions.push({
                ...question,
                progress: 1,
                resolvedAt: now,
                flash: "miss",
              });
              continue;
            }

            activeQuestions.push({
              ...question,
              progress: nextProgress,
            });
            continue;
          }

          activeQuestions.push(question);
        }

        let nextSpawnAt = Number(current.nextSpawnAt || now);
        while (activeQuestions.filter((question) => !question.resolvedAt).length < maxConcurrent && (activeQuestions.filter((question) => !question.resolvedAt).length === 0 || now >= nextSpawnAt)) {
          const nextQuestion = buildFreeFallQuestion(activeQuestions, current.selectedMode, current.selectedLevel, elapsedMs);
          if (!nextQuestion) break;
          activeQuestions.push(nextQuestion);
          nextSpawnAt = now + getFreeFallSpawnDelayMs(elapsedMs);
        }

        const nextState = {
          ...current,
          activeQuestions,
          announcements,
          incorrectItems,
          lives,
          currentStreak,
          bestStreak: Math.max(bestStreak, currentStreak),
          maxConcurrent,
          nextSpawnAt,
          elapsedSeconds: Math.max(0, Math.floor(elapsedMs / 1000)),
          gameOver: lives <= 0,
        };

        return nextState;
      });
    }, 80);

    return () => window.clearInterval(timer);
  }, [screen, Boolean(freeFallState), freeFallState?.gameOver]);

  useEffect(() => {
    if (screen !== "freeFallGame" || !freeFallState?.gameOver) return;
    finishFreeFallRun(freeFallState.failureReason || "Out of lives.", freeFallState);
  }, [screen, freeFallState?.gameOver]);

  useEffect(() => {
    if (screen === "multiplayerWaiting" && multiplayerState?.waitTimeLeft > 0) {
      const timer = setTimeout(() => {
        setMultiplayerState((current) => {
          if (!current) return current;
          const nextWait = current.waitTimeLeft - 1;
          const nextOpponents = current.opponents.map((opponent) => {
            if (!opponent.joined && nextWait <= opponent.joinAt) {
              return { ...opponent, joined: true };
            }
            return opponent;
          });
          return { ...current, waitTimeLeft: nextWait, opponents: nextOpponents };
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (screen === "multiplayerWaiting" && multiplayerState?.waitTimeLeft === 0) {
      startMultiplayerRace();
    }
  }, [screen, multiplayerState?.waitTimeLeft]);

  useEffect(() => {
    if (screen !== "multiplayerGame" || !multiplayerState?.opponents) return;
    const interval = setInterval(() => {
      setMultiplayerState((current) => {
        if (!current || current.finished) return current;

        const nextElapsed = current.elapsedTime + 1;
        let nextFinishOrdinal = current.nextFinishOrdinal || 1;

        const nextOpponents = current.opponents.map((opponent) => {
          if (opponent.finished) {
            return { ...opponent, burst: false };
          }

          const previousProgress = opponent.progress;
          let lockedPacePerSecond = opponent.lockedPacePerSecond;
          let targetProgress = opponent.progress;
          const livePlayerPace = current.playerScore / Math.max(nextElapsed, 1);

          if (opponent.strategy === "questionTracker") {
            if (current.playerScore >= 10 && !lockedPacePerSecond) {
              lockedPacePerSecond = current.playerScore / Math.max(current.elapsedTime, 1);
            }
            const targetPace = lockedPacePerSecond || Math.max(0.35, livePlayerPace * (0.96 + Math.random() * 0.06));
            targetProgress = targetPace * nextElapsed + (Math.random() < 0.3 ? 1 : 0);
          } else if (opponent.strategy === "timeTracker") {
            if (nextElapsed >= 10 && !lockedPacePerSecond) {
              lockedPacePerSecond = (current.playerScore / 10) * 0.9;
            }
            const targetPace = lockedPacePerSecond || Math.max(0.35, livePlayerPace * 0.88);
            targetProgress = targetPace * nextElapsed + (Math.random() < 0.2 ? 1 : 0);
          } else {
            const targetDuration = Math.max(60, Number(opponent.targetDuration) || 150);
            const targetPace = MULTIPLAYER_TARGET_SCORE / targetDuration;
            targetProgress = targetPace * nextElapsed + (Math.random() < 0.22 ? 1 : 0);
          }

          let progress = Math.max(opponent.progress, Math.min(MULTIPLAYER_TARGET_SCORE, Math.round(targetProgress)));
          let finished = opponent.finished;
          let finishOrdinal = opponent.finishOrdinal;

          if (!finished && progress >= MULTIPLAYER_TARGET_SCORE) {
            progress = MULTIPLAYER_TARGET_SCORE;
            finished = true;
            finishOrdinal = nextFinishOrdinal;
            nextFinishOrdinal += 1;
          }

          return {
            ...opponent,
            progress,
            burst: progress > previousProgress,
            lockedPacePerSecond,
            finished,
            finishOrdinal,
          };
        });

        return {
          ...current,
          opponents: nextOpponents,
          elapsedTime: nextElapsed,
          nextFinishOrdinal,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, multiplayerState?.opponents]);

  useEffect(() => {
    if (screen !== "multiplayerGame" || !multiplayerState?.opponents?.some((o) => o.burst)) return;
    const timer = setTimeout(() => {
      setMultiplayerState((current) => current ? { ...current, opponents: current.opponents.map((opponent) => ({ ...opponent, burst: false })) } : current);
    }, 450);
    return () => clearTimeout(timer);
  }, [screen, multiplayerState?.opponents]);

  useEffect(() => {
    if (screen === "multiplayerGame" && multiplayerState?.finished) {
      setScreen("multiplayerResults");
    }
  }, [screen, multiplayerState?.finished]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBoostCountdownNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ((screen === "game" || screen === "freeFallGame") && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [screen, currentIndex, feedback, level]);

  useEffect(() => {
    function handleCheatKeyShortcuts(event) {
      if (!cheatModeActive || feedback) return;
      if (screen !== "game" && screen !== "multiplayerGame" && screen !== "kingGame" && screen !== "tugGame") return;

      const key = String(event.key || "").toLowerCase();
      if (key !== "y" && key !== "n") return;

      event.preventDefault();
      if (screen === "multiplayerGame") {
        applyMultiplayerRoundAnswer(key, key === "y");
        return;
      }
      if (screen === "kingGame") {
        applyKingAnswer(key, key === "y");
        return;
      }
      if (screen === "tugGame") {
        applyTugAnswer(key, key === "y");
        return;
      }
      applySoloRoundAnswer(key, key === "y");
    }

    window.addEventListener("keydown", handleCheatKeyShortcuts);
    return () => window.removeEventListener("keydown", handleCheatKeyShortcuts);
  }, [cheatModeActive, feedback, screen, currentQuestion, currentIndex, results, questions, playerName]);

  useEffect(() => {
    function keepFocusReady() {
      if ((screen === "game" || screen === "freeFallGame") && inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }

    window.addEventListener("click", keepFocusReady);
    window.addEventListener("keydown", keepFocusReady);
    return () => {
      window.removeEventListener("click", keepFocusReady);
      window.removeEventListener("keydown", keepFocusReady);
    };
  }, [screen]);

  function getActiveCoinMultiplier(profile = profileState) {
    const now = Date.now();
    const activeBoosts = (profile.activeBoosts || []).filter((boost) => boost.expiresAt > now);
    if (activeBoosts.length !== (profile.activeBoosts || []).length) {
      const cleaned = { ...profile, activeBoosts };
      writeProfileState(cleaned);
      setProfileState(cleaned);
      return activeBoosts.reduce((highest, boost) => Math.max(highest, getBoostMultiplierFromType(boost.type)), 1);
    }
    return activeBoosts.reduce((highest, boost) => Math.max(highest, getBoostMultiplierFromType(boost.type)), 1);
  }

  function awardCoinsForRound(finalResults, options = {}) {
    const { testingModeActive = false, activeMode = mode } = options;
    const correctCount = finalResults.filter((r) => r.correct).length;
    const bonus = correctCount === roundQuestionCount ? 10 : correctCount === roundQuestionCount - 1 ? 5 : 0;
    const basePerQuestion = testingModeActive ? 2 : 1;
    const bonusMultiplier = testingModeActive ? 2 : 1;
    const practiseModeMultiplier = sessionType === "practice" ? getPracticeCoinMultiplier(activeMode, level) : 1;
    const mixedModeMultiplier = sessionType === "practice" ? 1 : activeMode === "mixed" ? MIXED_MODE_MULTIPLIER : 1;
    const levelMatchMultiplier = sessionType === "practice" ? 1 : getCurrentLevelMatchMultiplier(activeMode);
    const boostMultiplier = getActiveCoinMultiplier();
    const gameplayMultiplier = sessionType === "practice"
      ? practiseModeMultiplier
      : mixedModeMultiplier * levelMatchMultiplier;
    const baseCoins = Math.round(correctCount * basePerQuestion * gameplayMultiplier * boostMultiplier);
    const bonusCoins = Math.round(bonus * bonusMultiplier * gameplayMultiplier * boostMultiplier);
    const totalCoins = baseCoins + bonusCoins;
    const storedProfile = readProfileState();
    const nextProfile = {
      ...storedProfile,
      coins: (storedProfile.coins || 0) + totalCoins,
    };
    saveProfileState(nextProfile);
    setRoundReward({ correctCount, baseCoins, bonusCoins, totalCoins, testingModeActive, boostMultiplier, mixedModeMultiplier, practiseModeMultiplier, levelMatchMultiplier, activeMode, roundQuestionCount });
    if (testingModeActive) {
      setTestingCoinsEarned((current) => current + totalCoins);
    }
    window.setTimeout(() => setRoundReward((current) => current), BONUS_DISPLAY_MS);
    return totalCoins;
  }

  function getCurrentLevelMatchMultiplier(activeMode = mode) {
    if (activeMode === "testing" || activeMode === "multiplayer") return 1;
    if (activeMode === "addsub") {
      return level === userHistory.addsubLevel ? CURRENT_LEVEL_MATCH_MULTIPLIER : 1;
    }
    if (activeMode === "muldiv") {
      return level === userHistory.muldivLevel ? CURRENT_LEVEL_MATCH_MULTIPLIER : 1;
    }
    if (activeMode === "mixed") {
      const matchesAdd = level?.addsubLevel && level.addsubLevel === userHistory.addsubLevel;
      const matchesMul = level?.muldivLevel && level.muldivLevel === userHistory.muldivLevel;
      return matchesAdd && matchesMul ? CURRENT_LEVEL_MATCH_MULTIPLIER : 1;
    }
    return 1;
  }

  function getPracticeCoinMultiplier(activeMode = mode, activeLevel = level) {
    const questionCount = Number(activeRoundConfig?.questionCount || DEFAULT_QUESTION_COUNT);
    const isHundredQuestionRound = questionCount >= 100;
    const isCurrentSavedLevel = (() => {
      if (activeMode === "addsub") return activeLevel === userHistory.addsubLevel;
      if (activeMode === "muldiv") return activeLevel === userHistory.muldivLevel;
      if (activeMode === "mixed") {
        return Boolean(
          activeLevel &&
          typeof activeLevel === "object" &&
          activeLevel.addsubLevel === userHistory.addsubLevel &&
          activeLevel.muldivLevel === userHistory.muldivLevel
        );
      }
      return false;
    })();

    if (isHundredQuestionRound) return 3;
    if (isCurrentSavedLevel) return 2;
    return 1;
  }

  function saveProfileState(nextProfile) {
    writeProfileState(nextProfile);
    setProfileState(nextProfile);
  }

  function handlePlayerNameChange(value) {
    setDraftPlayerName(value);
  }

  function beginEditingPlayerName() {
    setShowPasswordEntry(false);
    setPasswordPanelMode(null);
    setDraftPlayerName(playerName);
    setIsEditingPlayerName(true);
    window.setTimeout(() => playerNameInputRef.current?.focus(), 0);
  }

  function savePlayerName() {
    const trimmedName = draftPlayerName.trim().slice(0, 20);
    setPlayerName(trimmedName);
    writePlayerName(trimmedName);
    setDraftPlayerName(trimmedName);
    setIsEditingPlayerName(false);
  }

  function cancelPlayerNameEdit() {
    setDraftPlayerName(playerName);
    setIsEditingPlayerName(false);
  }


  function clearAllData() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.localStorage.removeItem(PLAYER_NAME_STORAGE_KEY);
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    window.localStorage.removeItem(TESTING_SCORE_STORAGE_KEY);
    window.localStorage.removeItem(TESTING_UNLOCK_STORAGE_KEY);
    window.localStorage.removeItem(MULTIPLAYER_BESTS_STORAGE_KEY);
    window.localStorage.removeItem(STATS_STORAGE_KEY);
    window.localStorage.removeItem(TIME_TRIAL_HISTORY_STORAGE_KEY);
    setProfileState({ coins: 0, ownedItems: [], equippedItems: [], activeBoosts: [] });
    setUserHistory({ addsubLevel: "AdS3", muldivLevel: "MuS3" });
    setTestingScores({ addsubScore: null, muldivScore: null });
    setHasCompletedTesting(false);
    setPlayerName("");
    setDraftPlayerName("");
    setThemeId("blue");
    setShopOpen(false);
    setPurchasedItemsOpen(false);
    setTestingCoinsEarned(0);
    setMultiplayerState(null);
    setFreeFallState(null);
    setMode(null);
    setLevel(null);
    setMixedSelection({ addsubLevel: null, muldivLevel: null });
    setTestingState(null);
    setQuestions([]);
    setCurrentIndex(0);
    setResults([]);
    setAnswer("");
    setFeedback(null);
    setRoundFinished(false);
    setTimeLeft(DEFAULT_ROUND_TIME);
    setPendingTestingExitConfirm(false);
    setGeneratedSaveCode("");
    setSaveCodeInput("");
    setSaveCodeStatus("");
    setHistoryRefreshKey((current) => current + 1);
    setScreen("home");
  }

  function activateUpgrade(item) {
    if (item?.themeId) {
      setThemeId(item.themeId);
      writeThemeId(item.themeId);
      return;
    }
    if (!item?.boostType || !item?.durationMs) return;
    const now = Date.now();
    const storedProfile = readProfileState();
    const activeBoosts = (storedProfile.activeBoosts || []).filter((boost) => boost.expiresAt > now);
    activeBoosts.push({ id: `${item.id}-${now}`, type: item.boostType, expiresAt: now + item.durationMs, name: item.name });
    saveProfileState({ ...storedProfile, activeBoosts });
  }

  function buyProfileItem(itemId) {
    const item = PROFILE_SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item) return;
    const storedProfile = readProfileState();

    if (item.achievementOnly && !isAchievementUnlocked(item, achievementMetrics)) {
      return;
    }

    if ((storedProfile.ownedItems || []).includes(itemId)) {
      if (item.category === "upgrades") {
        activateUpgrade(item);
        return;
      }
      toggleEquipItem(itemId);
      return;
    }

    const shouldChargeCoins = !item.achievementOnly && !cheatModeActive;
    if (shouldChargeCoins && (storedProfile.coins || 0) < item.cost) return;

    const nextProfile = {
      ...storedProfile,
      coins: shouldChargeCoins ? storedProfile.coins - item.cost : storedProfile.coins,
      ownedItems: [...new Set([...(storedProfile.ownedItems || []), itemId])],
      equippedItems: storedProfile.equippedItems || [],
    };

    saveProfileState(nextProfile);

    if (shouldChargeCoins && item.cost > 0) {
      recordStatsEntry({
        mode: "shop",
        durationSeconds: 0,
        correctAnswers: 0,
        raceTimeSeconds: null,
        coinsEarned: 0,
        coinsSpent: item.cost,
      });
      setHistoryRefreshKey((current) => current + 1);
    }

    if (item.category === "upgrades") {
      activateUpgrade(item);
      return;
    }

    toggleEquipItem(itemId, nextProfile);
  }

  function toggleEquipItem(itemId, baseProfile = null) {
    const item = PROFILE_SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item || item.category === "upgrades") return;
    const storedProfile = baseProfile || readProfileState();
    if (!(storedProfile.ownedItems || []).includes(itemId)) return;

    const sameCategoryIds = PROFILE_SHOP_ITEMS.filter((entry) => entry.category === item.category).map((entry) => entry.id);
    const currentlyEquipped = storedProfile.equippedItems || [];
    const isEquipped = currentlyEquipped.includes(itemId);

    let nextEquipped;
    if (isEquipped) {
      nextEquipped = currentlyEquipped.filter((id) => id !== itemId);
    } else {
      nextEquipped = [...currentlyEquipped.filter((id) => !sameCategoryIds.includes(id)), itemId];
    }

    saveProfileState({ ...storedProfile, equippedItems: nextEquipped });
  }

  function startMode(selectedMode) {
    if ((selectedMode === "multiplayer" || selectedMode === "timetrial" || selectedMode === "king" || selectedMode === "tug") && !hasAnyPlacement) {
      return;
    }
    if (selectedMode === "testing") {
      startTestingMode();
      return;
    }
    if (selectedMode === "multiplayer") {
      setSessionType("multiplayer");
      setMode("multiplayer");
      setScreen("multiplayerSelect");
      return;
    }
    if (selectedMode === "timetrial") {
      setSessionType("timetrial");
      setMode("timetrial");
      setScreen("timeTrialSelect");
      return;
    }
    if (selectedMode === "king") {
      setSessionType("king");
      setMode("king");
      setScreen("kingSelect");
      return;
    }
    if (selectedMode === "tug") {
      setSessionType("tug");
      setMode("tug");
      setScreen("tugSelect");
      return;
    }
    if (selectedMode === "freefall") {
      setSessionType("freefall");
      setMode("freefall");
      setScreen("freeFallSelect");
      return;
    }
    setSessionType("practice");
    setMode(selectedMode);
    setMixedSelection({ addsubLevel: null, muldivLevel: null });
    setScreen("levels");
  }

  function startTestingMode(runType = "mixed", chosenStart = null) {
    setTestingCoinsEarned(0);
    const history = readUserHistory();
    setUserHistory(history);

    const addsubStart = runType === "mixed"
      ? (chosenStart?.addsubLevel || history.addsubLevel || "AdS3")
      : runType === "addsub"
      ? (chosenStart || history.addsubLevel || "AdS3")
      : (history.addsubLevel || "AdS3");

    const muldivStart = runType === "mixed"
      ? (chosenStart?.muldivLevel || history.muldivLevel || "MuS3")
      : runType === "muldiv"
      ? (chosenStart || history.muldivLevel || "MuS3")
      : (history.muldivLevel || "MuS3");

    const isMulOnly = runType === "muldiv";
    const initialLevel = isMulOnly ? muldivStart : addsubStart;
    const initialTestingState = {
      phase: isMulOnly ? "muldiv" : "addsub",
      startLevel: initialLevel,
      currentLevel: initialLevel,
      adsResolvedLevel: null,
      musResolvedLevel: null,
      lastScore: null,
      runType,
      manualStart: { addsubLevel: addsubStart, muldivLevel: muldivStart },
      retryUsedLevels: {},
      pendingRetry: null,
    };

    setTestingStartSelector(null);
    setTestingState(initialTestingState);
    setSessionType("testing");
    setMode("testing");
    startLevel(initialLevel, { selectedMode: "testing", testing: initialTestingState });
  }

  function startTimeTrialMode(selectedTimeTrialMode) {
    const history = readUserHistory();
    setUserHistory(history);
    const selectedLevel = getMultiplayerLevelFromMode(selectedTimeTrialMode, history);
    setMode("timetrial");
    setLevel(selectedLevel);
    setActiveRoundConfig({ questionCount: TIME_TRIAL_QUESTION_BUFFER, timeLimit: TIME_TRIAL_SECONDS, coinMultiplier: 1 });
    setQuestions(Array.from({ length: TIME_TRIAL_QUESTION_BUFFER }, () => generateQuestion(selectedTimeTrialMode, selectedLevel)));
    setCurrentIndex(0);
    setTimeLeft(TIME_TRIAL_SECONDS);
    setAnswer("");
    setFeedback(null);
    setResults([]);
    setRoundFinished(false);
    setPendingTestingExitConfirm(false);
    setTimeTrialCountdown(0);
    setTimeTrialState({
      selectedMode: selectedTimeTrialMode,
      selectedLevel,
      levelLabel: getTimeTrialLevelLabel(selectedTimeTrialMode, selectedLevel),
      startedAt: Date.now(),
    });
    setScreen("game");
  }

  function startMultiplayerLobby(selectedMultiplayerMode) {
    const history = readUserHistory();
    const raceLevel = getMultiplayerLevelFromMode(selectedMultiplayerMode, history);
    setMultiplayerState({
      selectedMode: selectedMultiplayerMode,
      raceLevel,
      waitTimeLeft: MULTIPLAYER_WAIT_SECONDS,
      opponents: buildFakeMultiplayerOpponents(selectedMultiplayerMode, raceLevel),
      playerScore: 0,
      elapsedTime: 0,
      finished: false,
      winner: null,
      placement: null,
      placementNumber: null,
      placementBonus: 0,
      playerCoinsEarned: 0,
      playerFinishOrdinal: null,
      nextFinishOrdinal: 1,
    });
    setScreen("multiplayerWaiting");
  }

  function startMultiplayerRace() {
    setMultiplayerState((current) => {
      if (!current) return current;
      setActiveRoundConfig({ questionCount: 120, timeLimit: DEFAULT_ROUND_TIME, coinMultiplier: 1 });
      setQuestions(Array.from({ length: 120 }, () => generateQuestion(current.selectedMode, current.raceLevel)));
      setCurrentIndex(0);
      setAnswer("");
      setFeedback(null);
      setResults([]);
      setRoundFinished(false);
      setLevel(current.raceLevel);
      setScreen("multiplayerGame");
      return {
        ...current,
        waitTimeLeft: 0,
        playerScore: 0,
        elapsedTime: 0,
        finished: false,
        winner: null,
        placement: null,
        placementNumber: null,
        placementBonus: 0,
        playerCoinsEarned: 0,
      };
    });
  }

  function beginKingRound(nextKingState) {
    setLevel(nextKingState.selectedLevel);
    setActiveRoundConfig({ questionCount: KING_OF_THE_HILL_ROUND_SIZE, timeLimit: nextKingState.timePerQuestion, coinMultiplier: 1 });
    setQuestions(buildRound(nextKingState.selectedMode, nextKingState.selectedLevel, KING_OF_THE_HILL_ROUND_SIZE));
    setCurrentIndex(0);
    setTimeLeft(nextKingState.timePerQuestion);
    setAnswer("");
    setFeedback(null);
    setRoundFinished(false);
    setPendingTestingExitConfirm(false);
    setScreen("kingGame");
  }

  function startKingMode(selectedKingMode) {
    const history = readUserHistory();
    setUserHistory(history);
    const selectedLevel = getMultiplayerLevelFromMode(selectedKingMode, history);
    const initialKingState = {
      selectedMode: selectedKingMode,
      selectedLevel,
      levelLabel: getTimeTrialLevelLabel(selectedKingMode, selectedLevel),
      roundNumber: 1,
      completedRounds: 0,
      timePerQuestion: KING_OF_THE_HILL_START_SECONDS,
      challenger: createKingChallenger(),
      intermissionStep: 0,
      intermissionLabel: null,
      failureReason: null,
      coinsEarned: 0,
      startedAt: Date.now(),
      beatenOpponents: [],
    };
    setResults([]);
    setKingState(initialKingState);
    setKingIntroDeadline(Date.now() + 4000);
    setScreen("kingIntro");
  }

  function startTugMode(selectedTugMode) {
    const history = readUserHistory();
    setUserHistory(history);
    const selectedLevel = getMultiplayerLevelFromMode(selectedTugMode, history);
    const initialTugState = {
      selectedMode: selectedTugMode,
      selectedLevel,
      levelLabel: getTimeTrialLevelLabel(selectedTugMode, selectedLevel),
      roundNumber: 1,
      completedRounds: 0,
      ropePosition: TUG_OF_WAR_ROPE_START,
      playerPullAmount: TUG_OF_WAR_PLAYER_PULL,
      aiPullAmount: getTugAIPullAmount(1),
      aiPullEveryMs: getTugAIPullInterval(1),
      nextAIPullAt: Date.now() + getTugAIPullInterval(1),
      challenger: createTugTeacher(0),
      startedAt: Date.now(),
      roundStartedAt: null,
      totalCorrectAnswers: 0,
      roundCorrectAnswers: 0,
      beatenTeachers: [],
      failureReason: null,
      coinsEarned: 0,
      totalDurationSeconds: 0,
      victory: false,
    };
    setResults([]);
    setTugState(initialTugState);
    setTugIntroDeadline(Date.now() + TUG_OF_WAR_INTRO_MS);
    setScreen("tugIntro");
  }

  function beginTugRound(nextTugState) {
    setMode("tug");
    setLevel(nextTugState.selectedLevel);
    setActiveRoundConfig({ questionCount: TUG_OF_WAR_ROUND_BUFFER, timeLimit: DEFAULT_ROUND_TIME, coinMultiplier: 1 });
    setQuestions(buildRound(nextTugState.selectedMode, nextTugState.selectedLevel, TUG_OF_WAR_ROUND_BUFFER));
    setCurrentIndex(0);
    setAnswer("");
    setFeedback(null);
    setPendingTestingExitConfirm(false);
    setRoundFinished(false);
    const now = Date.now();
    setTugState({
      ...nextTugState,
      ropePosition: TUG_OF_WAR_ROPE_START,
      roundCorrectAnswers: 0,
      roundStartedAt: now,
      nextAIPullAt: now + Number(nextTugState.aiPullEveryMs || getTugAIPullInterval(nextTugState.roundNumber || 1)),
    });
    setScreen("tugGame");
  }

  function handleTugRoundWin(currentTugState) {
    if (!currentTugState) return;
    const roundSeconds = Math.max(1, Math.round((Date.now() - Number(currentTugState.roundStartedAt || Date.now())) / 1000));
    const roundSummary = {
      ...(currentTugState.challenger || {}),
      roundNumber: currentTugState.roundNumber,
      durationSeconds: roundSeconds,
      correctAnswers: currentTugState.roundCorrectAnswers,
      averageSecondsPerCorrect: currentTugState.roundCorrectAnswers > 0 ? roundSeconds / currentTugState.roundCorrectAnswers : roundSeconds,
    };
    const beatenTeachers = [...(currentTugState.beatenTeachers || []), roundSummary];
    const completedRounds = beatenTeachers.length;

    if (completedRounds >= TUG_OF_WAR_TOTAL_ROUNDS) {
      finishTugRun("You beat all 10 teachers.", {
        ...currentTugState,
        beatenTeachers,
        completedRounds,
        victory: true,
      });
      return;
    }

    const nextRound = completedRounds + 1;
    const nextState = {
      ...currentTugState,
      beatenTeachers,
      completedRounds,
      roundNumber: nextRound,
      ropePosition: TUG_OF_WAR_ROPE_START,
      roundCorrectAnswers: 0,
      aiPullAmount: getTugAIPullAmount(nextRound),
      aiPullEveryMs: getTugAIPullInterval(nextRound),
      challenger: createTugTeacher(nextRound - 1),
    };
    setTugState(nextState);
    setTugIntroDeadline(Date.now() + TUG_OF_WAR_INTRO_MS);
    setScreen("tugIntro");
  }

  function startFreeFallMode(selectedFreeFallMode) {
    const history = readUserHistory();
    setUserHistory(history);
    const selectedLevel = getMultiplayerLevelFromMode(selectedFreeFallMode, history);
    const startedAt = Date.now();
    setMode("freefall");
    setLevel(selectedLevel);
    setAnswer("");
    setFeedback(null);
    setResults([]);
    setPendingTestingExitConfirm(false);
    setFreeFallState({
      selectedMode: selectedFreeFallMode,
      selectedLevel,
      levelLabel: getTimeTrialLevelLabel(selectedFreeFallMode, selectedLevel),
      startedAt,
      elapsedSeconds: 0,
      lives: FREE_FALL_START_LIVES,
      correctAnswers: 0,
      incorrectItems: [],
      activeQuestions: [],
      nextSpawnAt: startedAt,
      maxConcurrent: 1,
      currentStreak: 0,
      bestStreak: 0,
      announcements: [],
      gameOver: false,
      coinsEarned: 0,
    });
    setScreen("freeFallGame");
  }

  function applyFreeFallAnswer(rawAnswer) {
    const cleaned = String(rawAnswer || "").trim();
    if (!cleaned) return;

    const now = Date.now();
    let matched = false;
    setFreeFallState((current) => {
      if (!current || current.gameOver) return current;
      const activeIndex = (current.activeQuestions || []).findIndex((question) => !question.resolvedAt && answersMatch(cleaned, question.answer));
      if (activeIndex < 0) return current;

      matched = true;
      const targetQuestion = current.activeQuestions[activeIndex];
      const bonusLife = Boolean(targetQuestion.isSpecial && now <= Number(targetQuestion.goldUntil || 0));
      const nextStreak = Number(current.currentStreak || 0) + 1;

      return {
        ...current,
        lives: Number(current.lives || 0) + (bonusLife ? 1 : 0),
        correctAnswers: Number(current.correctAnswers || 0) + 1,
        currentStreak: nextStreak,
        bestStreak: Math.max(Number(current.bestStreak || 0), nextStreak),
        announcements: [
          ...(current.announcements || []).filter((item) => Number(item.expiresAt || 0) > now),
          ...(bonusLife ? [{ id: `freefall-life-${targetQuestion.id}`, text: "+1 Life", style: "life", expiresAt: now + 1200 }] : []),
        ],
        activeQuestions: current.activeQuestions.map((question, index) => {
          if (index !== activeIndex) return question;
          return {
            ...question,
            resolvedAt: now,
            flash: "correct",
          };
        }),
      };
    });

    setAnswer("");
  }

  function finishFreeFallRun(reason = "Out of lives.", stateOverride = freeFallState) {
    const finalFreeFallState = stateOverride || freeFallState;
    if (!finalFreeFallState) return;

    const totalCorrect = Number(finalFreeFallState.correctAnswers || 0);
    const totalDurationSeconds = Math.max(1, Math.round((Date.now() - Number(finalFreeFallState.startedAt || Date.now())) / 1000));
    const boostMultiplier = getActiveCoinMultiplier();
    const totalCoins = Math.round(totalCorrect * boostMultiplier);
    const storedProfile = readProfileState();
    saveProfileState({ ...storedProfile, coins: (storedProfile.coins || 0) + totalCoins });
    setRoundReward({
      correctCount: totalCorrect,
      baseCoins: totalCoins,
      bonusCoins: 0,
      totalCoins,
      testingModeActive: false,
      boostMultiplier,
      mixedModeMultiplier: 1,
      levelMatchMultiplier: 1,
      activeMode: "freefall",
      roundQuestionCount: totalCorrect,
    });
    recordStatsEntry({
      mode: `freefall-${finalFreeFallState.selectedMode}`,
      durationSeconds: totalDurationSeconds,
      correctAnswers: totalCorrect,
      raceTimeSeconds: null,
      coinsEarned: totalCoins,
      bestStreak: Number(finalFreeFallState.bestStreak || 0),
    });
    recordFreeFallHistoryEntry({
      selectedMode: finalFreeFallState.selectedMode,
      levelLabel: finalFreeFallState.levelLabel,
      timeSurvivedSeconds: totalDurationSeconds,
      correctAnswers: totalCorrect,
      ts: Date.now(),
    });
    const nextFreeFallHighScoreSeconds = Math.max(
      totalDurationSeconds,
      ...readFreeFallHistory().map((entry) => Number(entry?.timeSurvivedSeconds || 0))
    );
    setHistoryRefreshKey((current) => current + 1);
    setFreeFallState({
      ...finalFreeFallState,
      failureReason: reason,
      coinsEarned: totalCoins,
      elapsedSeconds: totalDurationSeconds,
      gameOver: true,
      activeQuestions: [],
      highScoreSeconds: nextFreeFallHighScoreSeconds,
    });
    setScreen("freeFallResults");
  }

  function finishTugRun(reason = "The teacher pulled the rope across.", stateOverride = tugState) {
    const finalTugState = stateOverride || tugState;
    if (!finalTugState) return;
    const totalCorrect = Number(finalTugState.totalCorrectAnswers || 0);
    const totalDurationSeconds = Math.max(1, Math.round((Date.now() - Number(finalTugState.startedAt || Date.now())) / 1000));
    const boostMultiplier = getActiveCoinMultiplier();
    const totalCoins = Math.round(((finalTugState.beatenTeachers || []).length * 15 + totalCorrect) * boostMultiplier);
    const storedProfile = readProfileState();
    saveProfileState({ ...storedProfile, coins: (storedProfile.coins || 0) + totalCoins });
    setRoundReward({
      correctCount: totalCorrect,
      baseCoins: totalCoins,
      bonusCoins: 0,
      totalCoins,
      testingModeActive: false,
      boostMultiplier,
      mixedModeMultiplier: 1,
      levelMatchMultiplier: 1,
      activeMode: "tug",
      roundQuestionCount: totalCorrect,
    });
    recordStatsEntry({
      mode: `tug-${finalTugState.selectedMode}`,
      durationSeconds: totalDurationSeconds,
      correctAnswers: totalCorrect,
      raceTimeSeconds: null,
      coinsEarned: totalCoins,
      bestStreak: getLongestCorrectStreak(results),
    });
    setHistoryRefreshKey((current) => current + 1);
    setTugState({
      ...finalTugState,
      failureReason: reason,
      coinsEarned: totalCoins,
      totalDurationSeconds,
      victory: Boolean(finalTugState.victory),
    });
    setScreen("tugResults");
  }

  function applyTugAnswer(cleanedAnswer, forcedCorrect = null) {
    if (!currentQuestion || feedback || !tugState) return;

    const cleaned = String(cleanedAnswer || "").trim();
    const isCorrect = forcedCorrect === null ? answersMatch(cleaned, currentQuestion.answer) : forcedCorrect;
    const entry = {
      prompt: currentQuestion.prompt,
      expected: currentQuestion.answer,
      given: cleaned,
      correct: isCorrect,
      strategy: tipFromQuestion(currentQuestion),
    };
    const newResults = [...results, entry];
    setResults(newResults);
    setFeedback(isCorrect ? "correct" : "incorrect");

    const resolvedTugState = resolveTugStateAtTime(tugState, Date.now());
    let updatedTugState = resolvedTugState;
    let roundWon = false;

    if (resolvedTugState !== tugState) {
      setTugState(resolvedTugState);
    }

    if (resolvedTugState?.ropePosition <= 0) {
      triggerTugFlash("teacher");
      finishTugRun("The teacher pulled the rope across.", resolvedTugState);
      return;
    }

    if (isCorrect) {
      const nextPosition = Math.min(100, Number(resolvedTugState.ropePosition || TUG_OF_WAR_ROPE_START) + Number(resolvedTugState.playerPullAmount || TUG_OF_WAR_PLAYER_PULL));
      updatedTugState = {
        ...resolvedTugState,
        ropePosition: nextPosition,
        roundCorrectAnswers: Number(resolvedTugState.roundCorrectAnswers || 0) + 1,
        totalCorrectAnswers: Number(resolvedTugState.totalCorrectAnswers || 0) + 1,
      };
      roundWon = nextPosition >= 100;
      setTugState(updatedTugState);
      triggerTugFlash("player");
    }

    setTimeout(() => {
      setFeedback(null);
      setAnswer("");
      if (roundWon) {
        handleTugRoundWin(updatedTugState);
        return;
      }
      setCurrentIndex((index) => (index + 1 >= questions.length ? 0 : index + 1));
    }, 320);
  }

  function triggerKingIntermission(finalResults) {
    setResults(finalResults);
    setKingState((current) => current ? {
      ...current,
      completedRounds: current.roundNumber,
      beatenOpponents: [
        ...(current.beatenOpponents || []),
        {
          ...(current.challenger || {}),
          roundNumber: current.roundNumber,
        },
      ],
      intermissionStep: 0,
      intermissionLabel: KING_OF_THE_HILL_INTERMISSION_STEPS[0],
    } : current);
    setScreen("kingIntermission");
  }

  function finishKingRun(reason = "Time ran out") {
    const currentKingState = kingState;
    if (!currentKingState) return;

    const totalCorrect = results.filter((item) => item.correct).length;
    const boostMultiplier = getActiveCoinMultiplier();
    const totalCoins = Math.round((totalCorrect + (currentKingState.completedRounds || 0) * 10) * boostMultiplier);
    const storedProfile = readProfileState();
    saveProfileState({ ...storedProfile, coins: (storedProfile.coins || 0) + totalCoins });
    setRoundReward({
      correctCount: totalCorrect,
      baseCoins: totalCoins,
      bonusCoins: 0,
      totalCoins,
      testingModeActive: false,
      boostMultiplier,
      mixedModeMultiplier: 1,
      levelMatchMultiplier: 1,
      activeMode: "king",
      roundQuestionCount: results.length,
    });
    recordStatsEntry({
      mode: `king-${currentKingState.selectedMode}`,
      durationSeconds: Math.max(1, Math.round((Date.now() - Number(currentKingState.startedAt || Date.now())) / 1000)),
      correctAnswers: totalCorrect,
      raceTimeSeconds: null,
      coinsEarned: totalCoins,
      bestStreak: getLongestCorrectStreak(results),
    });
    setHistoryRefreshKey((current) => current + 1);
    setKingState({
      ...currentKingState,
      failureReason: reason,
      coinsEarned: totalCoins,
    });
    setScreen("kingResults");
  }

  function applyKingAnswer(cleanedAnswer, forcedCorrect = null) {
    if (!currentQuestion || feedback || !kingState) return;

    const cleaned = String(cleanedAnswer || "").trim();
    const isCorrect = forcedCorrect === null ? answersMatch(cleaned, currentQuestion.answer) : forcedCorrect;
    const entry = {
      prompt: currentQuestion.prompt,
      expected: currentQuestion.answer,
      given: cleaned,
      correct: isCorrect,
      strategy: tipFromQuestion(currentQuestion),
    };
    const newResults = [...results, entry];
    setResults(newResults);
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedback(null);
      setAnswer("");
      const nextIndex = currentIndex + 1;
      if (nextIndex >= KING_OF_THE_HILL_ROUND_SIZE) {
        triggerKingIntermission(newResults);
        return;
      }
      setCurrentIndex(nextIndex);
      if (isCorrect) {
        setTimeLeft(kingState.timePerQuestion);
      }
    }, 320);
  }

  function startMixedLevelSelection(levelType, selectedLevel) {
    const nextSelection = {
      ...mixedSelection,
      [levelType]: selectedLevel,
    };
    setMixedSelection(nextSelection);
  }

  function startLevel(selectedLevel, options = {}) {
    const activeMode = options.selectedMode || mode;
    const activeTestingState = options.testing || testingState;
    if (options.testing) {
      setTestingState(options.testing);
    }
    const nextRoundConfig = options.roundConfig || (sessionType === "practice"
      ? (PRACTISE_ROUND_OPTIONS[practiseQuestionCount] || PRACTISE_ROUND_OPTIONS[15])
      : { questionCount: DEFAULT_QUESTION_COUNT, timeLimit: DEFAULT_ROUND_TIME, coinMultiplier: 1 });
    setActiveRoundConfig(nextRoundConfig);
    setLevel(selectedLevel);
    setQuestions(buildRound(activeMode === "testing" ? activeTestingState?.phase || "addsub" : activeMode, selectedLevel, nextRoundConfig.questionCount));
    setCurrentIndex(0);
    setTimeLeft(nextRoundConfig.timeLimit);
    setPendingTestingExitConfirm(false);
    setAnswer("");
    setFeedback(null);
    setResults([]);
    setRoundFinished(false);
    setScreen("game");
  }

  function finishRound(finalResults = results) {
    setRoundFinished(true);
    setResults(finalResults);

    if (mode === "timetrial") {
      const correctCount = finalResults.filter((r) => r.correct).length;
      const boostMultiplier = getActiveCoinMultiplier();
      const totalCoins = Math.round(correctCount * boostMultiplier);
      const storedProfile = readProfileState();
      saveProfileState({ ...storedProfile, coins: (storedProfile.coins || 0) + totalCoins });
      setRoundReward({ correctCount, baseCoins: totalCoins, bonusCoins: 0, totalCoins, testingModeActive: false, boostMultiplier, mixedModeMultiplier: 1, levelMatchMultiplier: 1, activeMode: "timetrial" });
      recordStatsEntry({
        mode: `timeTrial-${timeTrialState?.selectedMode || "addsub"}`,
        durationSeconds: Math.max(0, currentRoundTime - timeLeft),
        correctAnswers: correctCount,
        raceTimeSeconds: null,
        coinsEarned: totalCoins,
        bestStreak: getLongestCorrectStreak(finalResults),
      });
      recordTimeTrialHistoryEntry({
        selectedMode: timeTrialState?.selectedMode || "addsub",
        levelLabel: timeTrialState?.levelLabel || getTimeTrialLevelLabel(timeTrialState?.selectedMode || "addsub", timeTrialState?.selectedLevel || level),
        correctAnswers: correctCount,
        totalAnswered: finalResults.length,
        ts: Date.now(),
      });
      setHistoryRefreshKey((current) => current + 1);
      setScreen("timeTrialResults");
      return;
    }

    const earnedCoins = awardCoinsForRound(finalResults, { testingModeActive: mode === "testing", activeMode: mode === "testing" ? testingState?.phase || "addsub" : mode });
    recordStatsEntry({
      mode: mode === "testing" ? `testing-${testingState?.phase || "addsub"}` : mode,
      durationSeconds: Math.max(0, currentRoundTime - timeLeft),
      correctAnswers: finalResults.filter((r) => r.correct).length,
      raceTimeSeconds: null,
      coinsEarned: earnedCoins,
      bestStreak: getLongestCorrectStreak(finalResults),
    });
    setHistoryRefreshKey((current) => current + 1);

    if (mode === "testing") {
      handleTestingRoundComplete(finalResults);
      return;
    }

    setScreen("results");
  }

  function updateStoredLevels(partial) {
    const updated = { ...readUserHistory(), ...partial };
    writeUserHistory(updated);
    setUserHistory(updated);
  }

  function updateTestingScores(partial) {
    const updated = { ...readTestingScores(), ...partial };
    writeTestingScores(updated);
    setTestingScores(updated);
  }

  function completeSingleTestingPhase(phaseKey, resolvedLevel, scoreValue, stateOverride = testingState) {
    const baseState = stateOverride || testingState || {};
    if (phaseKey === "addsub") {
      updateStoredLevels({ addsubLevel: resolvedLevel });
      updateTestingScores({ addsubScore: scoreValue });
      setTestingState({ ...baseState, adsResolvedLevel: resolvedLevel, lastScore: scoreValue, pendingRetry: null });
    } else {
      updateStoredLevels({ muldivLevel: resolvedLevel });
      updateTestingScores({ muldivScore: scoreValue });
      setTestingState({ ...baseState, musResolvedLevel: resolvedLevel, lastScore: scoreValue, pendingRetry: null });
    }
    writeTestingUnlock(true);
    setHasCompletedTesting(true);
    setScreen("testingComplete");
  }

  function resolveTestingHoldScore(scoreValue, phase, runType, currentTestingLevel, stateOverride = testingState) {
    const baseState = stateOverride || testingState || {};

    if (phase === "addsub" && runType === "mixed") {
      updateStoredLevels({ addsubLevel: currentTestingLevel });
      updateTestingScores({ addsubScore: scoreValue });
      const history = readUserHistory();
      const muldivStart = baseState?.manualStart?.muldivLevel || history.muldivLevel || "MuS3";
      const nextTestingState = {
        ...baseState,
        phase: "muldiv",
        adsResolvedLevel: currentTestingLevel,
        currentLevel: muldivStart,
        startLevel: muldivStart,
        lastScore: scoreValue,
        pendingRetry: null,
      };
      setTestingState(nextTestingState);
      startLevel(nextTestingState.currentLevel, { selectedMode: "testing", testing: nextTestingState });
      return;
    }

    if (phase === "muldiv" && runType === "mixed") {
      updateStoredLevels({ muldivLevel: currentTestingLevel });
      updateTestingScores({ muldivScore: scoreValue });
      writeTestingUnlock(true);
      setHasCompletedTesting(true);
      setTestingState({ ...baseState, musResolvedLevel: currentTestingLevel, lastScore: scoreValue, pendingRetry: null });
      setScreen("testingComplete");
      return;
    }

    completeSingleTestingPhase(phase, currentTestingLevel, scoreValue, { ...baseState, pendingRetry: null });
  }

  function retryCloseCallTestingLevel() {
    if (!testingState?.pendingRetry) return;
    const pending = testingState.pendingRetry;
    const retryKey = `${pending.phase}:${pending.level}`;
    const nextTestingState = {
      ...testingState,
      retryUsedLevels: {
        ...(testingState.retryUsedLevels || {}),
        [retryKey]: true,
      },
      pendingRetry: null,
      lastScore: pending.score,
    };
    setTestingState(nextTestingState);
    startLevel(pending.level, { selectedMode: "testing", testing: nextTestingState });
  }

  function continueCloseCallTestingLevel() {
    if (!testingState?.pendingRetry) return;
    const pending = testingState.pendingRetry;
    const nextTestingState = {
      ...testingState,
      pendingRetry: null,
      lastScore: pending.score,
    };
    setTestingState(nextTestingState);
    resolveTestingHoldScore(pending.score, pending.phase, testingState.runType || "mixed", pending.level, nextTestingState);
  }

  function handleTestingRoundComplete(finalResults) {
    const finalScore = finalResults.filter((r) => r.correct).length;
    const phase = testingState?.phase || "addsub";
    const runType = testingState?.runType || "mixed";
    const currentTestingLevel = testingState?.currentLevel || level;

    if (finalScore >= TESTING_PASS_SCORE) {
      const higherLevel = getNextLevel(phase, currentTestingLevel);
      if (higherLevel) {
        const nextTestingState = {
          ...testingState,
          currentLevel: higherLevel,
          lastScore: finalScore,
          pendingRetry: null,
        };
        setTestingState(nextTestingState);
        startLevel(higherLevel, { selectedMode: "testing", testing: nextTestingState });
        return;
      }

      if (phase === "addsub" && runType === "mixed") {
        updateStoredLevels({ addsubLevel: currentTestingLevel });
        updateTestingScores({ addsubScore: finalScore });
        const history = readUserHistory();
        const muldivStart = testingState?.manualStart?.muldivLevel || history.muldivLevel || "MuS3";
        const nextTestingState = {
          ...testingState,
          phase: "muldiv",
          adsResolvedLevel: currentTestingLevel,
          currentLevel: muldivStart,
          startLevel: muldivStart,
          lastScore: finalScore,
          pendingRetry: null,
        };
        setTestingState(nextTestingState);
        startLevel(nextTestingState.currentLevel, { selectedMode: "testing", testing: nextTestingState });
        return;
      }

      if (phase === "muldiv" && runType === "mixed") {
        updateStoredLevels({ muldivLevel: currentTestingLevel });
        updateTestingScores({ muldivScore: finalScore });
        writeTestingUnlock(true);
        setHasCompletedTesting(true);
        setTestingState((prev) => ({ ...prev, musResolvedLevel: currentTestingLevel, lastScore: finalScore, pendingRetry: null }));
        setScreen("testingComplete");
        return;
      }

      completeSingleTestingPhase(phase, currentTestingLevel, finalScore);
      return;
    }

    if (finalScore === 12 || finalScore === 13) {
      const retryKey = `${phase}:${currentTestingLevel}`;
      const retryUsed = Boolean(testingState?.retryUsedLevels?.[retryKey]);

      if (!retryUsed) {
        setTestingState((prev) => ({
          ...(prev || {}),
          lastScore: finalScore,
          pendingRetry: {
            phase,
            level: currentTestingLevel,
            score: finalScore,
          },
        }));
        setScreen("testingRetryPrompt");
        return;
      }

      resolveTestingHoldScore(finalScore, phase, runType, currentTestingLevel);
      return;
    }

    if (finalScore >= TESTING_HOLD_MIN && finalScore <= TESTING_HOLD_MAX) {
      resolveTestingHoldScore(finalScore, phase, runType, currentTestingLevel);
      return;
    }

    const lowerLevel = getPreviousLevel(phase, currentTestingLevel);
    if (lowerLevel) {
      const nextTestingState = {
        ...testingState,
        currentLevel: lowerLevel,
        lastScore: finalScore,
        pendingRetry: null,
      };
      setTestingState(nextTestingState);
      startLevel(lowerLevel, { selectedMode: "testing", testing: nextTestingState });
      return;
    }

    if (phase === "addsub" && runType === "mixed") {
      updateStoredLevels({ addsubLevel: currentTestingLevel });
      updateTestingScores({ addsubScore: finalScore });
      const history = readUserHistory();
      const nextTestingState = {
        ...testingState,
        phase: "muldiv",
        adsResolvedLevel: currentTestingLevel,
        currentLevel: history.muldivLevel || "MuS3",
        startLevel: history.muldivLevel || "MuS3",
        lastScore: finalScore,
        pendingRetry: null,
      };
      setTestingState(nextTestingState);
      startLevel(nextTestingState.currentLevel, { selectedMode: "testing", testing: nextTestingState });
      return;
    }

    if (phase === "muldiv" && runType === "mixed") {
      updateStoredLevels({ muldivLevel: currentTestingLevel });
      updateTestingScores({ muldivScore: finalScore });
      writeTestingUnlock(true);
      setHasCompletedTesting(true);
      setTestingState((prev) => ({ ...prev, musResolvedLevel: currentTestingLevel, lastScore: finalScore, pendingRetry: null }));
      setScreen("testingComplete");
      return;
    }

    completeSingleTestingPhase(phase, currentTestingLevel, finalScore);
  }

  function applySoloRoundAnswer(cleanedAnswer, forcedCorrect = null) {
    if (!currentQuestion || feedback) return;

    const cleaned = String(cleanedAnswer || "").trim();
    const isCorrect = forcedCorrect === null ? answersMatch(cleaned, currentQuestion.answer) : forcedCorrect;

    const entry = {
      prompt: currentQuestion.prompt,
      expected: currentQuestion.answer,
      given: cleaned,
      correct: isCorrect,
      strategy: tipFromQuestion(currentQuestion),
    };

    const newResults = [...results, entry];
    setResults(newResults);
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedback(null);
      setAnswer("");

      const nextIndex = currentIndex + 1;
      const roundQuestionLimit = isTimeTrialMode ? questions.length : roundQuestionCount;
      if (nextIndex >= roundQuestionLimit) {
        finishRound(newResults);
      } else {
        setCurrentIndex(nextIndex);
      }
    }, 450);
  }

  function applyMultiplayerRoundAnswer(cleanedAnswer, forcedCorrect = null) {
    if (!currentQuestion || feedback) return;

    const cleaned = String(cleanedAnswer || "").trim();
    const isCorrect = forcedCorrect === null ? answersMatch(cleaned, currentQuestion.answer) : forcedCorrect;
    const entry = {
      prompt: currentQuestion.prompt,
      expected: currentQuestion.answer,
      given: cleaned,
      correct: isCorrect,
      strategy: tipFromQuestion(currentQuestion),
    };
    const newResults = [...results, entry];
    setResults(newResults);
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedback(null);
      setAnswer("");
      setMultiplayerState((current) => {
        if (!current || current.finished) return current;
        const nextPlayerScore = isCorrect ? current.playerScore + 1 : current.playerScore;
        let nextState = {
          ...current,
          playerScore: nextPlayerScore,
          playerCoinsEarned: current.playerCoinsEarned || 0,
        };

        if (nextPlayerScore >= MULTIPLAYER_TARGET_SCORE) {
          const finishOrdinal = current.playerFinishOrdinal || current.nextFinishOrdinal || 1;
          const placementNumber = finishOrdinal;
          const placement = placementNumber === 1 ? "win" : placementNumber === 2 ? "second" : placementNumber === 3 ? "third" : "fourth";
          const placementBonus = MULTIPLAYER_PLACEMENT_COINS[placementNumber] || 5;
          const totalCoins = placementBonus;
          recordStatsEntry({
            mode: `race-${current.selectedMode}`,
            durationSeconds: Math.max(1, current.elapsedTime),
            correctAnswers: nextPlayerScore,
            raceTimeSeconds: Math.max(1, current.elapsedTime),
            coinsEarned: totalCoins,
            raceWon: placementNumber === 1,
            bestStreak: getLongestCorrectStreak(newResults),
          });
          setHistoryRefreshKey((value) => value + 1);
          const storedProfile = readProfileState();
          saveProfileState({ ...storedProfile, coins: (storedProfile.coins || 0) + totalCoins });

          const raceKey = getMultiplayerRaceKey(current.selectedMode, current.raceLevel);
          const bests = readMultiplayerBests();
          const finishTime = Math.max(1, current.elapsedTime);
          if (!bests[raceKey] || finishTime < bests[raceKey]) {
            bests[raceKey] = finishTime;
            writeMultiplayerBests(bests);
          }

          nextState = {
            ...current,
            playerScore: MULTIPLAYER_TARGET_SCORE,
            finished: true,
            winner: placementNumber === 1 ? (playerName?.trim() || "You") : current.opponents.find((opponent) => opponent.finishOrdinal === 1)?.name || "Opponent",
            placement,
            placementNumber,
            placementBonus,
            playerCoinsEarned: totalCoins,
            playerFinishOrdinal: finishOrdinal,
            nextFinishOrdinal: Math.max(current.nextFinishOrdinal || 1, finishOrdinal + 1),
          };
        }

        return nextState;
      });
      setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
    }, 300);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (screen === "multiplayerGame") {
      applyMultiplayerRoundAnswer(answer);
      return;
    }
    if (screen === "kingGame") {
      applyKingAnswer(answer);
      return;
    }
    if (screen === "tugGame") {
      applyTugAnswer(answer);
      return;
    }
    if (screen === "freeFallGame") {
      applyFreeFallAnswer(answer);
      return;
    }
    applySoloRoundAnswer(answer);
  }

  function restartSameLevel() {
    startLevel(level);
  }

  function nextLevel() {
    const next = getNextLevel(mode, level);
    if (next) {
      startLevel(next);
    } else {
      setScreen("complete");
    }
  }

  function requestTestingExit() {
    exitToHome();
  }

  function cancelTestingExit() {
    setPendingTestingExitConfirm(false);
  }

  async function copyResultsToClipboard() {
    const addLevelText = testingScores.addsubScore !== null ? userHistory.addsubLevel : "AdS__";
    const addScoreText = testingScores.addsubScore !== null ? String(testingScores.addsubScore) : "";
    const mulLevelText = testingScores.muldivScore !== null ? userHistory.muldivLevel : "MuS__";
    const mulScoreText = testingScores.muldivScore !== null ? String(testingScores.muldivScore) : "";

    const plainText = [addLevelText, addScoreText, mulLevelText, mulScoreText].join("	");
    const htmlTable = `
      <table>
        <tr>
          <td>${addLevelText}</td>
          <td>${addScoreText}</td>
          <td>${mulLevelText}</td>
          <td>${mulScoreText}</td>
        </tr>
      </table>
    `;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({
          "text/plain": new Blob([plainText], { type: "text/plain" }),
          "text/html": new Blob([htmlTable], { type: "text/html" }),
        });
        await navigator.clipboard.write([item]);
        setCopyStatus("Copied");
        window.setTimeout(() => setCopyStatus(""), 1800);
        return;
      }
    } catch {}

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(plainText);
        setCopyStatus("Copied");
        window.setTimeout(() => setCopyStatus(""), 1800);
        return;
      }
    } catch {}

    try {
      if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = plainText;
        textArea.readOnly = true;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);

        let copied = false;
        if (typeof document.execCommand === "function") {
          copied = document.execCommand("copy");
        }

        document.body.removeChild(textArea);

        if (copied) {
          setCopyStatus("Copied");
          window.setTimeout(() => setCopyStatus(""), 1800);
          return;
        }
      }
    } catch {}

    try {
      if (typeof window !== "undefined") {
        window.prompt("Copy these results:", plainText);
        setCopyStatus("Use Ctrl+C");
        window.setTimeout(() => setCopyStatus(""), 2200);
        return;
      }
    } catch {}

    setCopyStatus(plainText);
    window.setTimeout(() => setCopyStatus(""), 3000);
  }

  function buildProgressPassword() {
    const addWord = encodeLevelScoreWord(userHistory.addsubLevel, testingScores.addsubScore, progressionOrder.addsub, ADDSUB_SAVE_WORDS);
    const mulWord = encodeLevelScoreWord(userHistory.muldivLevel, testingScores.muldivScore, progressionOrder.muldiv, MULDIV_SAVE_WORDS);
    const packedNumber = packSaveNumber(profileState, themeId, hasCompletedTesting);
    return `${addWord}${mulWord}${packedNumber}`;
  }

  function generateSavePassword() {
    const nextCode = buildProgressPassword();
    setIsEditingPlayerName(false);
    setGeneratedSaveCode(nextCode);
    setSaveCodeInput(nextCode);
    setPasswordPanelMode("generate");
    setShowPasswordEntry(true);
    setSaveCodeStatus("Save password ready");
    window.setTimeout(() => setSaveCodeStatus(""), 2200);
  }

  async function copySavePasswordToClipboard() {
    if (!generatedSaveCode) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedSaveCode);
        setSaveCodeStatus("Password copied");
        window.setTimeout(() => setSaveCodeStatus(""), 1800);
        return;
      }
    } catch {}

    try {
      if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = generatedSaveCode;
        textArea.readOnly = true;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        const copied = typeof document.execCommand === "function" ? document.execCommand("copy") : false;
        document.body.removeChild(textArea);

        if (copied) {
          setSaveCodeStatus("Password copied");
          window.setTimeout(() => setSaveCodeStatus(""), 1800);
          return;
        }
      }
    } catch {}

    try {
      if (typeof window !== "undefined") {
        window.prompt("Copy this save password:", generatedSaveCode);
        setSaveCodeStatus("Use Ctrl+C");
        window.setTimeout(() => setSaveCodeStatus(""), 2200);
      }
    } catch {}
  }

  function loadSavePassword() {
    const enteredPassword = String(saveCodeInput || "").trim();
    if (enteredPassword.toLowerCase() === "hawkins") {
      const nextCheatState = !cheatModeActive;
      setCheatModeActive(nextCheatState);
      setSaveCodeInput("");
      setSaveCodeStatus(nextCheatState ? "Cheat mode enabled" : "Cheat mode disabled");
      window.setTimeout(() => setSaveCodeStatus(""), 2400);
      return;
    }

    try {
      const { addWord, mulWord, numberPart } = extractSaveWords(saveCodeInput);
      const addData = decodeLevelScoreWord(addWord, progressionOrder.addsub, ADDSUB_SAVE_WORDS);
      const mulData = decodeLevelScoreWord(mulWord, progressionOrder.muldiv, MULDIV_SAVE_WORDS);
      if (!addData || !mulData) throw new Error("Invalid save password");

      const unpacked = unpackSaveNumber(numberPart);
      const themeIds = Object.keys(SITE_THEMES);
      const nextThemeId = themeIds[unpacked.themeIndex] || "blue";
      const ownedSet = new Set(unpacked.ownedItems);
      const equippedItems = unpacked.equippedItems.filter((id) => ownedSet.has(id));

      const nextHistory = {
        addsubLevel: addData.level,
        muldivLevel: mulData.level,
      };
      const nextScores = {
        addsubScore: addData.score,
        muldivScore: mulData.score,
      };
      const nextProfile = {
        coins: unpacked.coins,
        ownedItems: unpacked.ownedItems,
        equippedItems,
        activeBoosts: [],
      };

      writeUserHistory(nextHistory);
      setUserHistory(nextHistory);
      writeTestingScores(nextScores);
      setTestingScores(nextScores);
      writeTestingUnlock(unpacked.unlocked);
      setHasCompletedTesting(unpacked.unlocked);
      saveProfileState(nextProfile);
      writeThemeId(nextThemeId);
      setThemeId(nextThemeId);
      setGeneratedSaveCode("");
      setSaveCodeStatus("Progress loaded");
      window.setTimeout(() => setSaveCodeStatus(""), 2400);
    } catch {
      setSaveCodeStatus("Invalid save password");
      window.setTimeout(() => setSaveCodeStatus(""), 2400);
    }
  }

  function backToHome() {
    setShopOpen(false);
    setPurchasedItemsOpen(false);
    setRoundReward(null);
    setGeneratedSaveCode("");
    setSaveCodeInput("");
    setSaveCodeStatus("");
    setShowPasswordEntry(false);
    setPasswordPanelMode(null);
    setIsEditingPlayerName(false);
    setShowInfo(false);
    exitToHome();
  }

  const incorrectItems = results.filter((r) => !r.correct);
  const activeCoinMultiplier = getActiveCoinMultiplier(profileState);
  const equippedEmojiItem = PROFILE_SHOP_ITEMS.find((item) => profileState.equippedItems?.includes(item.id) && item.category === "emoji");
  const equippedBackgroundItem = PROFILE_SHOP_ITEMS.find((item) => profileState.equippedItems?.includes(item.id) && item.category === "background");
  const equippedRingItem = PROFILE_SHOP_ITEMS.find((item) => profileState.equippedItems?.includes(item.id) && item.category === "ring");
  const premiumRingOverlay = getPremiumRingOverlayClass(equippedRingItem?.id);
  const currentTheme = SITE_THEMES[themeId] || SITE_THEMES.blue;
  const isSportsTheme = ["broncos", "raiders", "bulldogs", "sharks", "dolphins", "titans", "seaeagles", "melbstorm", "knights", "warriors", "cowboys", "eels", "panthers", "rabbitohs", "dragons", "roosters", "tigers", "matildas", "swans", "giants"].includes(themeId);
  const sportsMascotLabel = SPORT_THEME_MASCOT_NAMES[themeId] || "School";
  const brandSuffix = isSportsTheme ? sportsMascotLabel : "School";
  const actionButtonClass = isSportsTheme ? "bg-slate-950 hover:bg-slate-900 border border-white/20 text-white" : currentTheme.primaryButton;
  const accentPillClass = isSportsTheme ? "bg-slate-950/95 text-white border border-white/20" : currentTheme.accentBadge;
  const headerSurfaceClass = isSportsTheme ? "border-white/20 bg-slate-950/95" : "border-white/15 bg-white/10";
  const placementBoxClass = isSportsTheme ? "inline-flex items-center gap-2 rounded-2xl bg-slate-950/95 border border-white/20 px-3 py-2 min-w-0" : "inline-flex items-center gap-2 rounded-2xl bg-slate-800/95 border border-white/15 px-3 py-2 min-w-0";
  const topControlButtonClass = isSportsTheme ? "h-11 min-w-[140px] rounded-2xl border-white/20 bg-slate-950 text-white hover:bg-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.35)]" : "h-11 min-w-[140px] rounded-2xl border-white/30 bg-white/20 px-4 text-white hover:bg-white/30 shadow-[0_8px_24px_rgba(255,255,255,0.08)]";
  const homeTileBaseClass = isSportsTheme ? "bg-slate-950/95 border-white/20 hover:bg-slate-900" : "bg-white/5 border-white/10 hover:bg-white/10";
  const homeTileActiveClass = isSportsTheme ? "bg-slate-950 border-white/30 shadow-[0_0_0_1px_rgba(255,255,255,0.16)]" : "bg-white/15 border-cyan-300/40 shadow-[0_0_0_1px_rgba(125,211,252,0.18)]";
  const homeShellClass = isSportsTheme ? "bg-slate-950/96 border-white/20" : "bg-white/10 border-white/10";
  const sportsThemeVisibilityClass = isSportsTheme
    ? "[&_.bg-white\/10]:bg-slate-950/96 [&_.bg-white\/12]:bg-slate-950/96 [&_.bg-white\/15]:bg-slate-950/96 [&_.bg-white\/20]:bg-slate-950/97 [&_.bg-white\/5]:bg-slate-950/94 [&_.bg-slate-900\/50]:bg-slate-950/94 [&_.bg-slate-900\/60]:bg-slate-950/96 [&_.bg-slate-900\/65]:bg-slate-950/96 [&_.bg-slate-900\/70]:bg-slate-950/97 [&_.bg-slate-900\/75]:bg-slate-950/97 [&_.bg-slate-900\/80]:bg-slate-950/97 [&_.bg-slate-800\/95]:bg-slate-950/97 [&_.bg-slate-950\/60]:bg-slate-950/96 [&_.bg-slate-950\/70]:bg-slate-950/97 [&_.bg-slate-950\/90]:bg-slate-950/98 [&_.bg-cyan-500\/15]:bg-slate-950/97 [&_.bg-emerald-500\/15]:bg-slate-950/97 [&_.bg-amber-500\/15]:bg-slate-950/97 [&_.border-white\/10]:border-white/20 [&_.border-white\/15]:border-white/24 [&_.border-white\/20]:border-white/28 [&_.border-white\/30]:border-white/36"
    : "";
  const isBilleaMode = themeId === "billea";
  const minimalCopyMode = isBilleaMode;
  const billeaTileClass = isBilleaMode ? "bg-black border-white/80 hover:bg-zinc-900 text-white" : "";
  const billeaTileActiveClass = isBilleaMode ? "bg-black border-white shadow-[0_0_0_2px_rgba(255,255,255,0.8)] text-white" : "";
  const billeaActionButtonClass = isBilleaMode ? "bg-black hover:bg-zinc-900 text-white border-2 border-white disabled:bg-zinc-900 disabled:text-white/40" : "";
  const billeaTestingScreen = isBilleaMode && isTestingMode;
  const activeCoinBoost = (profileState.activeBoosts || []).filter((boost) => getBoostMultiplierFromType(boost.type) > 1 && boost.expiresAt > boostCountdownNow).sort((a, b) => a.expiresAt - b.expiresAt)[0] || null;
  const statsLog = useMemo(() => readStatsLog(), [historyRefreshKey]);
  const storedTimeTrialHistory = useMemo(() => readTimeTrialHistory(), [historyRefreshKey]);
  const storedFreeFallHistory = useMemo(() => readFreeFallHistory(), [historyRefreshKey]);
  const achievementMetrics = useMemo(() => getAchievementMetrics(statsLog, storedTimeTrialHistory), [statsLog, storedTimeTrialHistory]);
  const achievementItems = useMemo(() => PROFILE_SHOP_ITEMS.filter((item) => item.achievementOnly), []);
  const timeTrialLeaderboards = useMemo(() => {
    if (!timeTrialState) return { overall: [], byLevel: [] };
    return getTimeTrialLeaderboardEntries(storedTimeTrialHistory, timeTrialState.selectedMode, timeTrialState.levelLabel);
  }, [timeTrialState, storedTimeTrialHistory]);
  const freeFallHighScoreSeconds = useMemo(() => {
    return (storedFreeFallHistory || []).reduce((best, entry) => Math.max(best, Number(entry?.timeSurvivedSeconds || 0)), 0);
  }, [storedFreeFallHistory]);
  const freeFallDifficultyLevel = freeFallState ? 1 + Math.floor((freeFallState.correctAnswers || 0) / 20) : 1;
  const freeFallMaxOnScreen = 1 + freeFallDifficultyLevel;
  const freeFallVisualSpeedMultiplier = 1 + Math.max(0, freeFallDifficultyLevel - 1) * 0.06;
  const freeFallModeHighScoreSeconds = useMemo(() => {
    return (storedFreeFallHistory || [])
      .filter((entry) => entry?.selectedMode === freeFallState?.selectedMode)
      .reduce((best, entry) => Math.max(best, Number(entry?.timeSurvivedSeconds || 0)), 0);
  }, [storedFreeFallHistory, freeFallState?.selectedMode]);
  const goalProgressPercent = (currentPassScore / Math.max(1, roundQuestionCount)) * 100;
  const GOAL_PROGRESS_PERCENT = goalProgressPercent;
  const kingLowTimeThreshold = kingState ? Math.max(1, Math.ceil(kingState.timePerQuestion * 0.15)) : 0;
  const kingIsUrgent = screen === "kingGame" && Boolean(kingState) && timeLeft <= kingLowTimeThreshold && !feedback;
  const kingIntroSecondsLeft = screen === "kingIntro" && kingIntroDeadline ? Math.max(0, Math.ceil((kingIntroDeadline - boostCountdownNow) / 1000)) : 0;
  const kingIntroProgress = screen === "kingIntro" && kingIntroDeadline ? Math.max(0, Math.min(100, ((kingIntroDeadline - boostCountdownNow) / 4000) * 100)) : 0;
  const tugIntroSecondsLeft = screen === "tugIntro" && tugIntroDeadline ? Math.max(0, Math.ceil((tugIntroDeadline - boostCountdownNow) / 1000)) : 0;
  const tugIntroProgress = screen === "tugIntro" && tugIntroDeadline ? Math.max(0, Math.min(100, ((tugIntroDeadline - boostCountdownNow) / TUG_OF_WAR_INTRO_MS) * 100)) : 0;
  const tugNextPullMs = screen === "tugGame" && tugState ? Math.max(0, Number(tugState.nextAIPullAt || 0) - boostCountdownNow) : 0;
  const tugNextPullSeconds = tugNextPullMs > 0 ? (tugNextPullMs / 1000).toFixed(1) : "0.0";
  const tugNextPullProgress = screen === "tugGame" && tugState ? Math.max(0, Math.min(100, (tugNextPullMs / Math.max(1, Number(tugState.aiPullEveryMs || 1))) * 100)) : 0;

  const TUG_PLAYER_WIN_POSITION = 82;
  const TUG_TEACHER_WIN_POSITION = 18;
  const TUG_MATCH_POINT_BUFFER = 8;
  const tugRopePosition = typeof tugState?.ropePosition === "number" ? tugState.ropePosition : 50;
  const tugPlayerMatchPoint = tugRopePosition >= TUG_PLAYER_WIN_POSITION - TUG_MATCH_POINT_BUFFER;
  const tugTeacherMatchPoint = tugRopePosition <= TUG_TEACHER_WIN_POSITION + TUG_MATCH_POINT_BUFFER;
  const tugRopeDotClass = tugPlayerMatchPoint || tugTeacherMatchPoint
    ? "border-red-100 bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.5)]"
    : "border-cyan-100 bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.45)]";

  
  const passed = score >= currentPassScore;
  const hasAddSubPlacement = testingScores.addsubScore !== null;
  const hasMulDivPlacement = testingScores.muldivScore !== null;
  const hasAnyPlacement = hasAddSubPlacement || hasMulDivPlacement;
  const hasMixedPlacement = hasAddSubPlacement && hasMulDivPlacement;
  const sportThemeIds = useMemo(() => Object.keys(SPORT_THEME_MASCOT_NAMES), []);
  const sportBackgroundIds = useMemo(() => new Set([
    "bg-broncos", "bg-raiders", "bg-bulldogs", "bg-sharks", "bg-dolphins", "bg-titans",
    "bg-stormclub", "bg-knights", "bg-warriors", "bg-cowboys", "bg-eels", "bg-panthers",
    "bg-rabbitohs", "bg-dragons-v", "bg-manly-v", "bg-roosters", "bg-tigersclub",
    "bg-matildas", "bg-swans", "bg-giants"
  ]), []);
  const sportRingIds = useMemo(() => new Set([
    "ring-seaeagle", "ring-raider", "ring-bronco", "ring-sharkfin", "ring-stormpulse",
    "ring-footyfire", "ring-matildaspark", "ring-swanwing", "ring-giantglow"
  ]), []);
  const historyStats = useMemo(() => {
    return {
      all: summariseStats(statsLog, null),
      week: summariseStats(statsLog, 7),
    };
  }, [statsLog]);

  useEffect(() => {
    const unlockedAchievementIds = PROFILE_SHOP_ITEMS
      .filter((item) => item.achievementOnly && isAchievementUnlocked(item, achievementMetrics))
      .map((item) => item.id);
    const missingAchievementIds = unlockedAchievementIds.filter((id) => !(profileState.ownedItems || []).includes(id));
    if (missingAchievementIds.length === 0) return;
    saveProfileState({
      ...profileState,
      ownedItems: [...new Set([...(profileState.ownedItems || []), ...missingAchievementIds])],
    });
  }, [achievementMetrics, profileState]);
  const practiceLocked = !hasAnyPlacement;
  const gamesLocked = !hasAnyPlacement;
  const effectiveModeForProgression = mode === "testing" ? testingState?.phase : mode;
  const next = effectiveModeForProgression && level ? getNextLevel(effectiveModeForProgression, level) : null;

  return (
    <div className={`min-h-screen ${currentTheme.page} text-white p-6 ${sportsThemeVisibilityClass} ${isBilleaMode ? "[&_input]:bg-black [&_input]:text-white [&_input]:border-2 [&_input]:border-white [&_.text-blue-100\/80]:text-white [&_.text-blue-100\/70]:text-white/90 [&_.text-blue-100\/75]:text-white/90 [&_.text-white\/75]:text-white/90 [&_.bg-white\/10]:bg-black [&_.bg-white\/5]:bg-black [&_.bg-slate-900\/60]:bg-black [&_.bg-slate-950\/60]:bg-black [&_.bg-slate-950\/70]:bg-black [&_.bg-slate-800\/95]:bg-black [&_.border-white\/10]:border-white/70 [&_.border-white\/15]:border-white/80 [&_.text-xs]:text-sm [&_.text-sm]:text-lg [&_.text-lg]:text-2xl [&_.text-xl]:text-3xl [&_p]:text-lg [&_h3]:text-3xl [&_h4]:text-2xl" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-3 space-y-3">
          <button type="button" onClick={backToHome} className="text-left group">
            <h1 className="text-3xl md:text-4xl tracking-tight group-hover:opacity-90 transition-opacity">
              <span className="font-black">MFaB.</span><span className="font-normal">{brandSuffix}</span>
            </h1>
          </button>

          <div className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap xl:flex-nowrap min-w-0">
              <div className={cn("inline-flex items-center gap-3 rounded-2xl border px-3 py-2.5 backdrop-blur-sm h-11 shrink-0", headerSurfaceClass)}>
                <div className="relative shrink-0 w-[52px] h-[52px]">
                  {premiumRingOverlay && (
                    <div className={`absolute -inset-1.5 rounded-full opacity-95 ${premiumRingOverlay} blur-[1px]`} />
                  )}
                  {equippedRingItem?.style && <div className={`absolute inset-0 rounded-full pointer-events-none ${equippedRingItem.style}`} />}
                  <div className="absolute inset-[5px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate">
                    <div className={getCircularBackgroundClass(equippedBackgroundItem?.style)} />
                    {equippedEmojiItem ? (
                      <div className={getEmojiVisualClass(equippedEmojiItem.emoji, "text-3xl drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]")}>{equippedEmojiItem.emoji}</div>
                    ) : (
                      <UserCircle2 className="w-7 h-7 text-blue-100/85" />
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-sm md:text-base font-black text-white truncate max-w-[120px] md:max-w-[170px]">{playerName?.trim() ? playerName : "Player"}</div>
                    {!isEditingPlayerName && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={beginEditingPlayerName}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/15 text-blue-50 shrink-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  {!minimalCopyMode && <div className="text-[11px] text-white/70">Profile active</div>}
                </div>
              </div>

              <div className={cn("inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold backdrop-blur-sm h-11 whitespace-nowrap shrink-0", isSportsTheme ? "border-white/20 bg-slate-950/95 text-white" : "border-amber-200/20 bg-amber-400/15 text-amber-100")}>
                <CircleDollarSign className="w-3.5 h-3.5" />
                {cheatModeActive ? "∞ coins" : `${profileState.coins} coins`}
              </div>

              <div className={cn("inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-semibold backdrop-blur-sm h-11 whitespace-nowrap shrink-0 min-w-[170px] justify-center", isSportsTheme ? "border-white/20 bg-slate-950/95 text-white" : "border-emerald-300/30 bg-emerald-400/15 text-emerald-100")}>
                {activeCoinBoost ? (
                  <>
                    <CircleDollarSign className="w-3.5 h-3.5" />
                    <span>{formatDuration(activeCoinBoost.expiresAt - boostCountdownNow)} left</span>
                  </>
                ) : (
                  <span className="text-emerald-100/60">No boost active</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap xl:flex-nowrap shrink-0">
              <Button
                type="button"
                onClick={() => {
                  setIsEditingPlayerName(false);
                  setShowInfo((open) => !open);
                }}
                variant="outline"
                className={topControlButtonClass}
              >
                {showInfo ? "Hide Level Info" : "Level Info"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (showPasswordEntry && passwordPanelMode === "generate") {
                    setShowPasswordEntry(false);
                    setPasswordPanelMode(null);
                    return;
                  }
                  generateSavePassword();
                }}
                variant="outline"
                className={topControlButtonClass}
              >
                {showPasswordEntry && passwordPanelMode === "generate"
                  ? (minimalCopyMode ? "Hide Code" : "Hide Password")
                  : (minimalCopyMode ? "Save Code" : "Generate Password")}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const openingLoad = !(showPasswordEntry && passwordPanelMode === "load");
                  setIsEditingPlayerName(false);
                  setPasswordPanelMode("load");
                  setShowPasswordEntry(openingLoad);
                  if (openingLoad) setSaveCodeInput("");
                }}
                variant="outline"
                className={topControlButtonClass}
              >
                {showPasswordEntry && passwordPanelMode === "load"
                  ? (minimalCopyMode ? "Hide Code" : "Hide Password")
                  : (minimalCopyMode ? "Load Code" : "Enter Password")}
              </Button>
            </div>
          </div>

          {cheatModeActive && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={clearAllData}
                variant="outline"
                className="rounded-2xl border-red-300/30 bg-red-400/10 text-red-100 hover:bg-red-400/20"
              >
                Clear all data
              </Button>
            </div>
          )}

          {(isEditingPlayerName || showPasswordEntry) && (
            <div className="flex items-center justify-end gap-2 w-full">
              {isEditingPlayerName ? (
                <>
                  <Input
                    ref={playerNameInputRef}
                    value={draftPlayerName}
                    onChange={(e) => handlePlayerNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") savePlayerName();
                      if (e.key === "Escape") cancelPlayerNameEdit();
                    }}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="h-11 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/40 min-w-0 flex-1 max-w-[620px]"
                  />
                  <Button type="button" onClick={savePlayerName} className={`h-11 rounded-2xl px-4 ${actionButtonClass} text-white font-bold whitespace-nowrap`}>
                    Save
                  </Button>
                  <Button type="button" onClick={cancelPlayerNameEdit} variant="outline" className="h-11 rounded-2xl border-white/20 bg-white/5 px-4 text-white hover:bg-white/10 whitespace-nowrap">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    value={saveCodeInput}
                    onChange={(e) => setSaveCodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (passwordPanelMode === "generate") {
                          copySavePasswordToClipboard();
                        } else {
                          loadSavePassword();
                        }
                      }
                    }}
                    readOnly={passwordPanelMode === "generate"}
                    placeholder={passwordPanelMode === "generate" ? "Generated password" : "Enter password"}
                    className="h-11 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/40 min-w-0 flex-1 max-w-[620px]"
                  />
                  {passwordPanelMode === "generate" ? (
                    <Button
                      type="button"
                      onClick={copySavePasswordToClipboard}
                      className={`h-11 rounded-2xl px-4 ${actionButtonClass} text-white font-bold whitespace-nowrap`}
                    >
                      Copy
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={loadSavePassword}
                      className={`h-11 rounded-2xl px-4 ${actionButtonClass} text-white font-bold whitespace-nowrap`}
                    >
                      Submit
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {saveCodeStatus && <div className="text-xs text-cyan-200 font-semibold text-right">{saveCodeStatus}</div>}
        </div>

        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <Card className={cn("rounded-3xl shadow-2xl overflow-hidden", homeShellClass)}>
                <CardContent className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 min-w-0">
                      <div className="text-white/70 text-[11px] uppercase tracking-[0.18em] shrink-0">Current placement</div>
                      <div className={placementBoxClass}>
                        <div className="text-[10px] md:text-[11px] text-white/78 uppercase tracking-[0.12em] whitespace-nowrap">+ / −</div>
                        <div className="text-sm md:text-base font-black text-white">{testingScores.addsubScore !== null ? userHistory.addsubLevel : "_____"}</div>
                        <div className="text-[11px] font-semibold text-cyan-100/90">{testingScores.addsubScore !== null ? `${testingScores.addsubScore}/15` : "No test yet"}</div>
                      </div>                      <div className={placementBoxClass}>
                        <div className="text-[10px] md:text-[11px] text-white/78 uppercase tracking-[0.12em] whitespace-nowrap">× / ÷</div>
                        <div className="text-sm md:text-base font-black text-white">{testingScores.muldivScore !== null ? userHistory.muldivLevel : "_____"}</div>
                        <div className="text-[11px] font-semibold text-cyan-100/90">{testingScores.muldivScore !== null ? `${testingScores.muldivScore}/15` : "No test yet"}</div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2.5 shrink-0 flex-wrap justify-end">
                      <div className="flex flex-col items-center gap-1 mr-2">
                        <div className="h-[10px]" />
                        <Button type="button" onClick={() => setScreen("history")} variant="outline" className="h-9 rounded-2xl border-white/20 bg-white/5 px-3 text-xs whitespace-nowrap text-white hover:bg-white/10">
                          History
                        </Button>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-[10px]" />
                        <Button type="button" onClick={copyResultsToClipboard} variant="outline" className="h-9 rounded-2xl border-white/20 bg-white/5 px-3 text-xs whitespace-nowrap text-white hover:bg-white/10">
                          {minimalCopyMode ? "Copy" : "Copy Results"}
                        </Button>
                      </div>
                      {!minimalCopyMode && (
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-[10px] text-white/65 leading-none text-center">Send to your</div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.open("https://teams.microsoft.com/", "_blank", "noopener,noreferrer")}
                            className="h-9 rounded-2xl border-white/20 bg-white/5 px-3 text-xs whitespace-nowrap text-white hover:bg-white/10"
                          >
                            Class Teams
                          </Button>
                        </div>
                      )}
                      {copyStatus && <span className="text-xs text-emerald-200 font-semibold self-center">{copyStatus}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {showInfo && (
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <CardContent className="p-5 md:p-6 space-y-6">
                    <div>
                      <div className="text-white/75 text-xs uppercase tracking-[0.25em] mb-2">Progression information</div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">What each level looks like</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-5">
                      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                        <h3 className="text-xl font-bold text-white">Addition / Subtraction</h3>
                        <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                          {levelInfo.addsub.map((item) => (
                            <div key={item.level} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 space-y-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-lg font-black text-white">{item.level}</div>
                                <Badge className="bg-cyan-400/20 text-cyan-50 border-none">{item.skill}</Badge>
                              </div>
                              <div className="space-y-3 pt-1">
                                {item.entries.map((entry, index) => (
                                  <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1">
                                    <div className="text-white text-sm font-semibold">{entry.type}</div>
                                    <div className="text-white/80 text-sm"><span className="font-semibold">Example:</span> {entry.example}</div>
                                    <div className="text-emerald-100 text-sm"><span className="font-semibold">Best strategy:</span> {entry.strategy}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                        <h3 className="text-xl font-bold text-white">Multiplication / Division</h3>
                        <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                          {levelInfo.muldiv.map((item) => (
                            <div key={item.level} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 space-y-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-lg font-black text-white">{item.level}</div>
                                <Badge className="bg-cyan-400/20 text-cyan-50 border-none">{item.skill}</Badge>
                              </div>
                              <div className="space-y-3 pt-1">
                                {item.entries.map((entry, index) => (
                                  <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1">
                                    <div className="text-white text-sm font-semibold">{entry.type}</div>
                                    <div className="text-white/80 text-sm"><span className="font-semibold">Example:</span> {entry.example}</div>
                                    <div className="text-emerald-100 text-sm"><span className="font-semibold">Best strategy:</span> {entry.strategy}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className={cn("rounded-3xl shadow-2xl overflow-hidden", homeShellClass)}>
                <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      type="button"
                      onClick={() => { setShopOpen(false); setHomeModeGroup("testing"); }}
                      className={cn(
                        "h-auto rounded-3xl border text-left p-4 flex flex-col items-start gap-3 transition-all",
                        homeModeGroup === "testing"
                          ? (isBilleaMode ? billeaTileActiveClass : homeTileActiveClass)
                          : (isBilleaMode ? billeaTileClass : homeTileBaseClass)
                      )}
                    >
                      <div className="flex w-full items-start justify-between gap-3 min-h-[34px]">
                        <Badge className={`${homeModeGroup === "testing" ? "bg-cyan-400/20 text-cyan-50" : currentTheme.accentBadge} border-none`}>Adaptive</Badge>
                        <span className="text-xs font-semibold text-emerald-200">Start here</span>
                      </div>
                      <div className="w-full space-y-1">
                        <div className="text-lg md:text-xl font-bold text-white">Testing</div>
                        {!minimalCopyMode && <div className="text-xs md:text-sm text-white/75 mt-1.5 leading-5">Save one strand to unlock that strand. Save both to unlock Mixed.</div>}
                      </div>
                    </Button>

                    <Button
                      type="button"
                      onClick={() => { setShopOpen(false); setHomeModeGroup("practice"); }}
                      disabled={practiceLocked}
                      className={cn(
                        "h-auto rounded-3xl border text-left p-4 flex flex-col items-start gap-3 transition-all",
                        homeModeGroup === "practice"
                          ? (isBilleaMode ? billeaTileActiveClass : homeTileActiveClass)
                          : (isBilleaMode ? billeaTileClass : homeTileBaseClass),
                        practiceLocked && "opacity-55 bg-white/5 hover:bg-white/5"
                      )}
                    >
                      <div className="flex w-full items-start justify-between gap-3 min-h-[34px]">
                        <Badge className={`${homeModeGroup === "practice" ? "bg-cyan-400/20 text-cyan-50" : currentTheme.accentBadge} border-none`}>Skills</Badge>
                        {practiceLocked ? <span className="text-xs font-semibold text-amber-200">Locked</span> : <span className="text-xs font-semibold text-emerald-200">Up to 3x coins</span>}
                      </div>
                      <div className="w-full space-y-1">
                        <div className="text-lg md:text-xl font-bold text-white">Practise</div>
                        {!minimalCopyMode && <div className="text-xs md:text-sm text-white/75 mt-1.5 leading-5">Practise AdS, MuS, or Mixed. Your saved current level gives 2x coins, and the 100-question round gives up to 3x coins.</div>}
                      </div>
                    </Button>

                    <Button
                      type="button"
                      onClick={() => { setShopOpen(false); setHomeModeGroup("games"); }}
                      disabled={gamesLocked}
                      className={cn(
                        "h-auto rounded-3xl border text-left p-4 flex flex-col items-start gap-3 transition-all",
                        homeModeGroup === "games"
                          ? (isBilleaMode ? billeaTileActiveClass : homeTileActiveClass)
                          : (isBilleaMode ? billeaTileClass : homeTileBaseClass),
                        gamesLocked && "opacity-55 bg-white/5 hover:bg-white/5"
                      )}
                    >
                      <div className="flex w-full items-start justify-between gap-3 min-h-[34px]">
                        <Badge className={`${homeModeGroup === "games" ? "bg-cyan-400/20 text-cyan-50" : currentTheme.accentBadge} border-none`}>Play</Badge>
                        {gamesLocked && <span className="text-xs font-semibold text-amber-200">Locked</span>}
                      </div>
                      <div className="w-full space-y-1">
                        <div className="text-lg md:text-xl font-bold text-white">Games</div>
                        {!minimalCopyMode && <div className="text-xs md:text-sm text-white/75 mt-1.5 leading-5">Race only in strands that have already been saved.</div>}
                      </div>
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setShopOpen((open) => !open)}
                      className={cn(
                        "h-auto rounded-3xl border text-left p-4 flex flex-col items-start gap-3 transition-all",
                        shopOpen
                          ? (isBilleaMode ? billeaTileActiveClass : homeTileActiveClass)
                          : (isBilleaMode ? billeaTileClass : homeTileBaseClass)
                      )}
                    >
                      <div className="flex w-full items-start justify-between gap-3 min-h-[34px]">
                        <Badge className={`${shopOpen ? "bg-cyan-400/20 text-cyan-50" : currentTheme.accentBadge} border-none`}>Shop</Badge>
                        <ShoppingBag className="w-4 h-4 text-cyan-100" />
                      </div>
                      <div className="w-full space-y-1">
                        <div className="text-lg md:text-xl font-bold text-white">{minimalCopyMode ? "Shop" : shopOpen ? "Close Shop" : "Open Shop"}</div>
                        {!minimalCopyMode && <div className="text-xs md:text-sm text-white/75 mt-1.5 leading-5">Buy emoji, backgrounds, rings and upgrades.</div>}
                      </div>
                    </Button>
                  </div>

                  {shopOpen ? (
                    <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-4 md:p-5 space-y-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="text-xl font-bold text-white">Shop</h3>
                        <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-4 py-2 text-sm text-white font-semibold">
                          Balance: {cheatModeActive ? "∞ coins" : `${profileState.coins} coins`}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {SHOP_CATEGORIES.map((category) => {
                          const Icon = category.icon;
                          const active = selectedShopCategory === category.id;
                          const itemCount = category.id === "achievements"
                            ? achievementItems.length
                            : PROFILE_SHOP_ITEMS.filter((item) => item.category === category.id && !item.achievementOnly).length;

                          return (
                            <Button
                              key={category.id}
                              type="button"
                              onClick={() => setSelectedShopCategory(category.id)}
                              className={cn(
                                "h-auto rounded-3xl border text-left p-4 flex flex-col items-start gap-3 transition-all",
                                active
                                  ? (isBilleaMode ? billeaTileActiveClass : homeTileActiveClass)
                                  : (isBilleaMode ? billeaTileClass : homeTileBaseClass)
                              )}
                            >
                              <div className="flex w-full items-start justify-between gap-3 min-h-[34px]">
                                <Badge className={`${active ? "bg-cyan-400/20 text-cyan-50" : currentTheme.accentBadge} border-none`}>
                                  {category.label}
                                </Badge>
                                <Icon className="w-4 h-4 text-cyan-100" />
                              </div>
                              <div className="text-xs text-white/75">{itemCount} items</div>
                            </Button>
                          );
                        })}
                      </div>

                      {selectedShopCategory === "achievements" ? (
                        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div>
                              <div className="text-lg font-bold text-white">Achievements</div>
                              <div className="text-xs text-white/70 uppercase tracking-[0.2em] mt-1">Exclusive rewards earned from playing</div>
                            </div>
                            <div className="rounded-2xl bg-slate-950/70 border border-white/10 px-3 py-2 text-xs text-white/75">
                              {achievementItems.filter((item) => isAchievementUnlocked(item, achievementMetrics)).length} / {achievementItems.length} unlocked
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 items-start">
                            {[
                              { id: "timeSpentSeconds", label: "Time played", items: sortAchievementItems(achievementItems.filter((item) => item.achievementMetric === "timeSpentSeconds")) },
                              { id: "bestStreak", label: "Streak", items: sortAchievementItems(achievementItems.filter((item) => item.achievementMetric === "bestStreak")) },
                              { id: "coinsEarned", label: "Coins earned", items: sortAchievementItems(achievementItems.filter((item) => item.achievementMetric === "coinsEarned")) },
                              { id: "coinsSpent", label: "Coins spent", items: sortAchievementItems(achievementItems.filter((item) => item.achievementMetric === "coinsSpent")) },
                              { id: "totalCorrect", label: "Correct answers", items: sortAchievementItems(achievementItems.filter((item) => item.achievementMetric === "totalCorrect")) },
                              { id: "games", label: "Game modes", items: sortAchievementItems(achievementItems.filter((item) => item.achievementMetric === "raceWins" || item.achievementMetric === "bestTimeTrialScore")) },
                            ].map((section) => {
                              const unlockedCount = section.items.filter((item) => isAchievementUnlocked(item, achievementMetrics)).length;

                              return (
                                <div key={section.id} className="rounded-3xl bg-slate-950/55 border border-white/10 p-4 space-y-3 h-full">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm font-bold text-white uppercase tracking-[0.16em]">{section.label}</div>
                                    <Badge className="bg-white/10 text-white/75 border-none">{unlockedCount}/{section.items.length}</Badge>
                                  </div>

                                  <div className="space-y-3">
                                    {section.items.map((item) => {
                                      const unlocked = isAchievementUnlocked(item, achievementMetrics);
                                      const owned = (profileState.ownedItems || []).includes(item.id);
                                      const equipped = (profileState.equippedItems || []).includes(item.id);
                                      const isThemeActive = Boolean(item.themeId && themeId === item.themeId);

                                      return (
                                        <div key={item.id} className={cn("rounded-2xl border px-3 py-3 flex flex-col gap-3", unlocked ? "bg-slate-950/75 border-white/12" : "bg-slate-950/45 border-white/8 opacity-80")}>
                                          <div className="flex items-start justify-between gap-2">
                                            <Badge className={`${unlocked ? "bg-emerald-400/18 text-emerald-100" : "bg-white/10 text-white/70"} border-none`}>
                                              {item.category === "upgrades" ? "Theme" : item.category === "emoji" ? "Icon" : item.category === "background" ? "Background" : "Ring"}
                                            </Badge>
                                            <div className="text-[10px] uppercase tracking-[0.16em] text-white/55">{unlocked ? "Unlocked" : "Locked"}</div>
                                          </div>

                                          <div className="flex-1 flex flex-col items-center text-center gap-3">
                                            {item.category === "emoji" ? (
                                              <div className="text-5xl leading-none">{item.emoji}</div>
                                            ) : item.category === "background" ? (
                                              <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden">
                                                <div className={`w-full h-full ${item.style}`} />
                                              </div>
                                            ) : item.category === "ring" ? (
                                              <div className="relative w-14 h-14">
                                                <div className={`absolute inset-0 rounded-full pointer-events-none ${item.style}`} />
                                                <div className="absolute inset-[7px] rounded-full bg-slate-900/95 border border-white/10" />
                                              </div>
                                            ) : (
                                              <div className="w-full space-y-2">
                                                <div className="w-14 h-14 mx-auto rounded-full border border-white/10 bg-slate-900/70 flex items-center justify-center text-2xl">🎨</div>
                                                {item.themeId && (
                                                  <div className={cn("w-full h-5 rounded-full text-[10px] font-semibold flex items-center justify-center border", getThemeShopBarClass(item.themeId, unlocked || owned))}>
                                                    Theme hint
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            <div>
                                              <div className="text-sm font-semibold text-white">{item.name}</div>
                                              <div className="text-xs text-white/65 mt-1">{formatAchievementRequirement(item)}</div>
                                            </div>
                                          </div>

                                          <Button
                                            type="button"
                                            onClick={() => buyProfileItem(item.id)}
                                            disabled={!unlocked}
                                            className={cn(
                                              "w-full rounded-2xl h-10 text-xs",
                                              !unlocked
                                                ? "bg-slate-700 text-slate-300"
                                                : item.themeId
                                                ? (isThemeActive ? "bg-emerald-500 hover:bg-emerald-400" : `${actionButtonClass} text-white`)
                                                : equipped
                                                ? "bg-emerald-500 hover:bg-emerald-400"
                                                : owned
                                                ? "bg-blue-500 hover:bg-blue-400"
                                                : `${actionButtonClass} text-white`
                                            )}
                                          >
                                            {item.themeId
                                              ? (isThemeActive ? "Active theme" : unlocked ? "Apply theme" : "Locked")
                                              : equipped
                                              ? "Equipped"
                                              : unlocked
                                              ? (owned ? "Equip" : "Claim")
                                              : "Locked"}
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="text-lg font-bold text-white">
                              {SHOP_CATEGORIES.find((category) => category.id === selectedShopCategory)?.label || "Items"}
                            </div>
                            {!minimalCopyMode && <div className="text-xs text-white/70 uppercase tracking-[0.2em]">Tap an item to buy or equip</div>}
                          </div>

                          {(selectedShopCategory === "emoji" || selectedShopCategory === "background" || selectedShopCategory === "ring" || selectedShopCategory === "upgrades") && (
                            <div className="flex flex-wrap gap-2">
                              {[
                                { id: "standard", label: selectedShopCategory === "upgrades" ? "Standard Themes" : `Standard ${selectedShopCategory === "emoji" ? "Icons" : selectedShopCategory === "background" ? "Backgrounds" : "Rings"}` },
                                { id: "teams", label: "Sport Teams" },
                              ].map((tab) => {
                                const activeTab = selectedShopCategory === "emoji"
                                  ? emojiShopTab
                                  : selectedShopCategory === "background"
                                  ? backgroundShopTab
                                  : selectedShopCategory === "ring"
                                  ? ringShopTab
                                  : upgradesShopTab;

                                return (
                                  <Button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                      if (selectedShopCategory === "emoji") setEmojiShopTab(tab.id);
                                      if (selectedShopCategory === "background") setBackgroundShopTab(tab.id);
                                      if (selectedShopCategory === "ring") setRingShopTab(tab.id);
                                      if (selectedShopCategory === "upgrades") setUpgradesShopTab(tab.id);
                                    }}
                                    className={cn(
                                      "h-10 rounded-2xl border px-4 text-sm font-bold",
                                      activeTab === tab.id ? `${actionButtonClass} text-white` : "bg-slate-900/60 border-white/10 text-white hover:bg-slate-800"
                                    )}
                                  >
                                    {tab.label}
                                  </Button>
                                );
                              })}
                            </div>
                          )}

                          <div className={cn("grid gap-4", selectedShopCategory === "upgrades" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6")}>
                            {PROFILE_SHOP_ITEMS
                              .filter((item) => item.category === selectedShopCategory && !item.achievementOnly)
                              .filter((item) => {
                                if (selectedShopCategory === "emoji") {
                                  return emojiShopTab === "teams" ? item.rarity === "team" : item.rarity !== "team";
                                }
                                if (selectedShopCategory === "background") {
                                  return backgroundShopTab === "teams" ? sportBackgroundIds.has(item.id) : !sportBackgroundIds.has(item.id);
                                }
                                if (selectedShopCategory === "ring") {
                                  return ringShopTab === "teams" ? sportRingIds.has(item.id) : !sportRingIds.has(item.id);
                                }
                                if (selectedShopCategory === "upgrades") {
                                  const isSportTheme = Boolean(item.themeId && sportThemeIds.includes(item.themeId));
                                  return upgradesShopTab === "teams" ? isSportTheme : !isSportTheme;
                                }
                                return true;
                              })
                              .map((item) => {
                                const owned = (profileState.ownedItems || []).includes(item.id);
                                const equipped = (profileState.equippedItems || []).includes(item.id);
                                const canAfford = cheatModeActive || (profileState.coins || 0) >= item.cost;
                                const isUpgrade = item.category === "upgrades";
                                const isThemeActive = Boolean(item.themeId && themeId === item.themeId);

                                return (
                                  <div key={item.id} className="rounded-2xl bg-slate-950/60 border border-white/5 px-3 py-3 h-full flex flex-col gap-3">
                                    <div className="min-w-0 flex-1 flex flex-col items-center text-center gap-3">
                                      {item.category === "emoji" ? (
                                        <>
                                          <div className="text-5xl leading-none">{item.emoji}</div>
                                          <div className="text-sm text-white font-semibold">{item.name}</div>
                                          {!minimalCopyMode && <div className="text-[10px] text-white/55">{item.rarity || "emoji"}</div>}
                                        </>
                                      ) : item.category === "background" ? (
                                        <>
                                          <div className="w-14 h-14 rounded-full border border-white/10 bg-slate-950/80 overflow-hidden flex items-center justify-center">
                                            <div className={`w-full h-full ${item.style}`} />
                                          </div>
                                          <div className="text-sm text-white font-semibold">{item.name}</div>
                                        </>
                                      ) : item.category === "ring" ? (
                                        <>
                                          <div className="relative w-14 h-14">
                                          {isPremiumRing(item.id) && <div className={`absolute -inset-1 rounded-full ${getPremiumRingOverlayClass(item.id)} blur-[1px] opacity-95`} />}
                                          <div className={`absolute inset-0 rounded-full pointer-events-none ${item.style}`} />
                                          <div className="absolute inset-[7px] rounded-full bg-slate-900/95 border border-white/10" />
                                        </div>
                                          <div className="text-sm text-white font-semibold">{item.name}</div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="text-sm text-white font-semibold">{item.name}</div>
                                          {item.detail && !minimalCopyMode && <div className="text-[11px] text-white/70 max-w-[16rem]">{item.detail}</div>}
                                        </>
                                      )}
                                    </div>

                                    <div className="min-h-[20px] flex items-center justify-center w-full">
                                      {item.themeId ? (
                                        <div className={cn("w-full h-5 rounded-full text-[10px] font-semibold flex items-center justify-center border", getThemeShopBarClass(item.themeId, owned))}>
                                          {owned ? "Purchased" : ""}
                                        </div>
                                      ) : owned && !isUpgrade && !equipped ? (
                                        <Badge className="bg-blue-500/20 text-blue-100 border-none text-[10px] px-2 py-0.5">Purchased</Badge>
                                      ) : null}
                                    </div>

                                    <Button
                                      type="button"
                                      onClick={() => (owned && !isUpgrade ? toggleEquipItem(item.id) : buyProfileItem(item.id))}
                                      disabled={!owned && !canAfford}
                                      className={cn(
                                        "w-full rounded-2xl h-10 mt-auto",
                                        isBilleaMode
                                          ? billeaActionButtonClass
                                          : equipped || isThemeActive
                                          ? "bg-emerald-500 hover:bg-emerald-400"
                                          : owned && !isUpgrade
                                          ? "bg-blue-500 hover:bg-blue-400"
                                          : "bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-300"
                                      )}
                                    >
                                      {item.themeId
                                        ? (isThemeActive ? "Active theme" : owned ? "Apply theme" : `Buy ${item.cost}`)
                                        : isUpgrade
                                        ? `Buy ${item.cost}`
                                        : equipped
                                        ? "Equipped"
                                        : owned
                                        ? "Equip"
                                        : `Buy ${item.cost}`}
                                    </Button>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-4 md:p-5 space-y-4">
                      {homeModeGroup === "practice" && (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="text-white/70 text-xs uppercase tracking-[0.22em] mb-2">Practise options</div>
                              <h3 className="text-xl font-bold text-white">Choose a practise mode</h3>
                            </div>
                            {!minimalCopyMode && <div className="text-right text-xs md:text-sm font-semibold text-amber-200">{hasAnyPlacement ? "Only 100 questions gives 3x coins" : "Complete a test first"}</div>}
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            {[
                              { key: "addsub", coins: "🪙 +1 per ✓", unlocked: hasAddSubPlacement },
                              { key: "muldiv", coins: "🪙 +1 per ✓", unlocked: hasMulDivPlacement },
                              { key: "mixed", coins: "🪙 +1.5 per ✓", unlocked: hasMixedPlacement },
                            ].map((item) => {
                              const meta = modeMeta[item.key];
                              return (
                                <Card key={item.key} className={`bg-white/5 border-white/10 rounded-3xl ${!item.unlocked ? "opacity-55" : ""}`}>
                                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                                    <div className="flex items-start justify-between gap-3">
                                      <Badge className={`${accentPillClass} border-none`}>Practice</Badge>
                                      {practiceLocked ? <span className="text-xs font-semibold text-amber-200">Locked</span> : <span className="text-xs font-semibold text-emerald-200">{item.coins}</span>}
                                    </div>
                                    <h4 className="text-xl font-bold text-white">{meta.title}</h4>
                                    <div className="text-white/85 min-h-[64px] space-y-2">
                                      {!minimalCopyMode && <p>{meta.description}</p>}
                                      {!hasAnyPlacement && <p className="text-amber-200 font-semibold">Complete at least one test first to unlock practise modes.</p>}
                                      {hasAnyPlacement && !item.unlocked && item.key === "addsub" && <p className="text-amber-200 font-semibold">Save an AdS test first to unlock this mode.</p>}
                                      {hasAnyPlacement && !item.unlocked && item.key === "muldiv" && <p className="text-amber-200 font-semibold">Save a MuS test first to unlock this mode.</p>}
                                      {hasAnyPlacement && !item.unlocked && item.key === "mixed" && <p className="text-amber-200 font-semibold">Save both AdS and MuS tests to unlock Mixed practice.</p>}
                                    </div>
                                    <Button onClick={() => startMode(item.key)} disabled={!item.unlocked} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white mt-auto disabled:bg-slate-700 disabled:text-slate-300`}>
                                      {`Choose ${meta.title}`}
                                    </Button>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {homeModeGroup === "testing" && (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-xl font-bold text-white">Adaptive placement</h3>
                            {!minimalCopyMode && <div className="text-right text-xs md:text-sm font-semibold text-emerald-200">🪙 Double coins in testing</div>}
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <Card className="bg-white/5 border-white/10 rounded-3xl">
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Unlocks everything</Badge>
                                  <div className="text-sm text-emerald-200 font-semibold">Best first step</div>
                                </div>
                                <h4 className="text-xl font-bold text-white">Mixed Testing</h4>
                                <div className="grid gap-2 mt-auto">
                                  <Button onClick={() => startTestingMode("mixed")} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white`}>
                                    {minimalCopyMode ? "Start Mixed" : "Start Mixed Testing"}
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setManualTestingStart({
                                        addsubLevel: testingScores.addsubScore !== null ? userHistory.addsubLevel : "AdS3",
                                        muldivLevel: testingScores.muldivScore !== null ? userHistory.muldivLevel : "MuS3",
                                      });
                                      setTestingStartSelector(testingStartSelector === "mixed" ? null : "mixed");
                                    }}
                                    variant="outline"
                                    className="h-9 rounded-2xl border-white/30 bg-white/14 px-3 text-xs text-white hover:bg-white/20"
                                  >
                                    Know your level?
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-white/5 border-white/10 rounded-3xl">
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Unlocks AdS only</Badge>
                                  <div className="text-sm text-white/75">Single strand</div>
                                </div>
                                <h4 className="text-xl font-bold text-white">AdS Testing</h4>
                                <div className="grid gap-2 mt-auto">
                                  <Button onClick={() => startTestingMode("addsub")} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white`}>
                                    {minimalCopyMode ? "Test AdS" : "Test AdS Only"}
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setManualTestingStart((current) => ({ ...current, addsubLevel: testingScores.addsubScore !== null ? userHistory.addsubLevel : "AdS3" }));
                                      setTestingStartSelector(testingStartSelector === "addsub" ? null : "addsub");
                                    }}
                                    variant="outline"
                                    className="h-9 rounded-2xl border-white/30 bg-white/14 px-3 text-xs text-white hover:bg-white/20"
                                  >
                                    Know your level?
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-white/5 border-white/10 rounded-3xl">
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Unlocks MuS only</Badge>
                                  <div className="text-sm text-white/75">Single strand</div>
                                </div>
                                <h4 className="text-xl font-bold text-white">MuS Testing</h4>
                                <div className="grid gap-2 mt-auto">
                                  <Button onClick={() => startTestingMode("muldiv")} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white`}>
                                    {minimalCopyMode ? "Test MuS" : "Test MuS Only"}
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setManualTestingStart((current) => ({ ...current, muldivLevel: testingScores.muldivScore !== null ? userHistory.muldivLevel : "MuS3" }));
                                      setTestingStartSelector(testingStartSelector === "muldiv" ? null : "muldiv");
                                    }}
                                    variant="outline"
                                    className="h-9 rounded-2xl border-white/30 bg-white/14 px-3 text-xs text-white hover:bg-white/20"
                                  >
                                    Know your level?
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {testingStartSelector === "mixed" && (
                            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                              <div>
                                <div className="text-white/70 text-xs uppercase tracking-[0.22em] mb-2">Know your level?</div>
                                <h4 className="text-lg font-bold text-white">{minimalCopyMode ? "Start Mixed" : "Start Mixed Testing"} from chosen levels</h4>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-white/75 mb-2">Choose an AdS starting level</div>
                                  <div className="grid grid-cols-4 gap-2">
                                    {progressionOrder.addsub.map((lvl) => (
                                      <Button key={lvl} type="button" onClick={() => setManualTestingStart((current) => ({ ...current, addsubLevel: lvl }))} className={`h-8 rounded-xl text-[11px] font-bold ${manualTestingStart.addsubLevel === lvl ? "bg-cyan-500 hover:bg-cyan-400" : "bg-white/12 hover:bg-white/18 border border-white/10"}`}>
                                        {lvl}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-white/75 mb-2">Choose a MuS starting level</div>
                                  <div className="grid grid-cols-3 gap-2">
                                    {progressionOrder.muldiv.map((lvl) => (
                                      <Button key={lvl} type="button" onClick={() => setManualTestingStart((current) => ({ ...current, muldivLevel: lvl }))} className={`h-8 rounded-xl text-[11px] font-bold ${manualTestingStart.muldivLevel === lvl ? "bg-cyan-500 hover:bg-cyan-400" : "bg-white/12 hover:bg-white/18 border border-white/10"}`}>
                                        {lvl}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button onClick={() => startTestingMode("mixed", manualTestingStart)} className={`rounded-2xl text-sm py-3 ${actionButtonClass} text-white`}>
                                  Start from {manualTestingStart.addsubLevel} + {manualTestingStart.muldivLevel}
                                </Button>
                                <Button onClick={() => setTestingStartSelector(null)} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Cancel</Button>
                              </div>
                            </div>
                          )}

                          {testingStartSelector === "addsub" && (
                            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                              <div>
                                <div className="text-white/70 text-xs uppercase tracking-[0.22em] mb-2">Know your level?</div>
                                <h4 className="text-lg font-bold text-white">Start AdS Testing from a chosen level</h4>
                              </div>
                              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                {progressionOrder.addsub.map((lvl) => (
                                  <Button key={lvl} type="button" onClick={() => setManualTestingStart((current) => ({ ...current, addsubLevel: lvl }))} className={`h-8 rounded-xl text-[11px] font-bold ${manualTestingStart.addsubLevel === lvl ? "bg-cyan-500 hover:bg-cyan-400" : "bg-white/12 hover:bg-white/18 border border-white/10"}`}>
                                    {lvl}
                                  </Button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button onClick={() => startTestingMode("addsub", manualTestingStart.addsubLevel)} className={`rounded-2xl text-sm py-3 ${actionButtonClass} text-white`}>
                                  Start from {manualTestingStart.addsubLevel}
                                </Button>
                                <Button onClick={() => setTestingStartSelector(null)} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Cancel</Button>
                              </div>
                            </div>
                          )}

                          {testingStartSelector === "muldiv" && (
                            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                              <div>
                                <div className="text-white/70 text-xs uppercase tracking-[0.22em] mb-2">Know your level?</div>
                                <h4 className="text-lg font-bold text-white">Start MuS Testing from a chosen level</h4>
                              </div>
                              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                {progressionOrder.muldiv.map((lvl) => (
                                  <Button key={lvl} type="button" onClick={() => setManualTestingStart((current) => ({ ...current, muldivLevel: lvl }))} className={`h-8 rounded-xl text-[11px] font-bold ${manualTestingStart.muldivLevel === lvl ? "bg-cyan-500 hover:bg-cyan-400" : "bg-white/12 hover:bg-white/18 border border-white/10"}`}>
                                    {lvl}
                                  </Button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button onClick={() => startTestingMode("muldiv", manualTestingStart.muldivLevel)} className={`rounded-2xl text-sm py-3 ${actionButtonClass} text-white`}>
                                  Start from {manualTestingStart.muldivLevel}
                                </Button>
                                <Button onClick={() => setTestingStartSelector(null)} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Cancel</Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {homeModeGroup === "games" && (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="text-white/70 text-xs uppercase tracking-[0.22em] mb-2">Game options</div>
                              <h3 className="text-xl font-bold text-white">Play a game mode</h3>
                            </div>
                            
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <Card className={`bg-white/5 border-white/10 rounded-3xl ${gamesLocked ? "opacity-55" : ""}`}>
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Race Mode</Badge>
                                  {!hasAnyPlacement && <div className="text-sm text-amber-200 font-semibold">Complete a test first</div>}
                                </div>
                                <h4 className="text-xl font-bold text-white">Race Mode</h4>
                                <div className="text-white/85 min-h-[64px] space-y-2">
                                  {!minimalCopyMode && <p>{modeMeta.multiplayer.description}</p>}
                                  {!hasAnyPlacement && <p className="text-amber-200 font-semibold">Complete at least one test first to unlock race modes.</p>}
                                  {hasAnyPlacement && !hasMixedPlacement && <p className="text-amber-200 font-semibold">Only saved test strands can race. Mixed unlocks after both AdS and MuS are saved.</p>}
                                  {hasMixedPlacement && <p className="text-cyan-200 font-semibold">All race modes are unlocked.</p>}
                                </div>
                                <Button onClick={() => startMode("multiplayer")} disabled={!hasAnyPlacement} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white mt-auto disabled:bg-slate-700 disabled:text-slate-300`}>
                                  {minimalCopyMode ? "Start Race" : "Enter Race Mode"}
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className={`bg-white/5 border-white/10 rounded-3xl ${gamesLocked ? "opacity-55" : ""}`}>
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Time Trial</Badge>
                                  {!hasAnyPlacement && <div className="text-sm text-amber-200 font-semibold">Complete a test first</div>}
                                </div>
                                <h4 className="text-xl font-bold text-white">Time Trial</h4>
                                <div className="text-white/85 min-h-[64px] space-y-2">
                                  {!minimalCopyMode && <p>{modeMeta.timetrial.description}</p>}
                                  {!hasAnyPlacement && <p className="text-amber-200 font-semibold">Complete at least one test first to unlock time trial.</p>}
                                  {hasAnyPlacement && <p className="text-cyan-200 font-semibold">Saved scores and level leaderboards are tracked automatically.</p>}
                                </div>
                                <Button onClick={() => startMode("timetrial")} disabled={!hasAnyPlacement} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white mt-auto disabled:bg-slate-700 disabled:text-slate-300`}>
                                  {minimalCopyMode ? "Start Trial" : "Enter Time Trial"}
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className={`bg-white/5 border-white/10 rounded-3xl ${gamesLocked ? "opacity-55" : ""}`}>
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Survival</Badge>
                                  {!hasAnyPlacement && <div className="text-sm text-amber-200 font-semibold">Complete a test first</div>}
                                </div>
                                <h4 className="text-xl font-bold text-white">King of the Hill</h4>
                                <div className="text-white/85 min-h-[64px] space-y-2">
                                  {!minimalCopyMode && <p>{modeMeta.king.description}</p>}
                                  {!hasAnyPlacement && <p className="text-amber-200 font-semibold">Complete at least one test first to unlock this mode.</p>}
                                  {hasAnyPlacement && <p className="text-cyan-200 font-semibold">15 questions per round. Each new round gives you less time per question.</p>}
                                </div>
                                <Button onClick={() => startMode("king")} disabled={!hasAnyPlacement} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white mt-auto disabled:bg-slate-700 disabled:text-slate-300`}>
                                  Enter King of the Hill
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className={`bg-white/5 border-white/10 rounded-3xl ${gamesLocked ? "opacity-55" : ""}`}>
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Head to head</Badge>
                                  {!hasAnyPlacement && <div className="text-sm text-amber-200 font-semibold">Complete a test first</div>}
                                </div>
                                <h4 className="text-xl font-bold text-white">Tug of War</h4>
                                <div className="text-white/85 min-h-[64px] space-y-2">
                                  {!minimalCopyMode && <p>{modeMeta.tug.description}</p>}
                                  {!hasAnyPlacement && <p className="text-amber-200 font-semibold">Complete at least one test first to unlock Tug of War.</p>}
                                  {hasAnyPlacement && <p className="text-cyan-200 font-semibold">Beat 10 teacher opponents in a row before the rope gets dragged away.</p>}
                                </div>
                                <Button onClick={() => startMode("tug")} disabled={!hasAnyPlacement} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white mt-auto disabled:bg-slate-700 disabled:text-slate-300`}>
                                  Enter Tug of War
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className={`bg-white/5 border-white/10 rounded-3xl ${gamesLocked ? "opacity-55" : ""}`}>
                              <CardContent className="p-4 flex flex-col gap-3 h-full">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <Badge className={`${accentPillClass} border-none`}>Arcade</Badge>
                                  {!hasAnyPlacement && <div className="text-sm text-amber-200 font-semibold">Complete a test first</div>}
                                </div>
                                <h4 className="text-xl font-bold text-white">Free Fall</h4>
                                <div className="text-white/85 min-h-[64px] space-y-2">
                                  {!minimalCopyMode && <p>{modeMeta.freefall.description}</p>}
                                  {!hasAnyPlacement && <p className="text-amber-200 font-semibold">Complete at least one test first to unlock Free Fall.</p>}
                                  {hasAnyPlacement && <p className="text-cyan-200 font-semibold">Start with 3 lives and answer before the boxes hit the bottom line.</p>}
                                </div>
                                <Button onClick={() => startMode("freefall")} disabled={!hasAnyPlacement} className={`rounded-2xl text-sm py-3.5 ${actionButtonClass} text-white mt-auto disabled:bg-slate-700 disabled:text-slate-300`}>
                                  Enter Free Fall
                                </Button>
                              </CardContent>
                            </Card>

                            {[
                              { title: "Mystery Mode", icon: Calculator },
                            ].map((coming) => {
                              const Icon = coming.icon;
                              return (
                                <Card key={coming.title} className="bg-white/5 border-white/10 rounded-3xl opacity-55">
                                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                                    <div className="flex flex-wrap items-start justify-between gap-3 min-h-[34px]">
                                      <Badge className={cn("bg-white/10 text-white border-none", isSportsTheme && "bg-slate-950/96 text-white border border-white/20")}>Coming soon</Badge>
                                      <Icon className="w-5 h-5 text-white/55" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">{coming.title}</h4>
                                    <div className="text-white/70 min-h-[64px]">We’ll build this mode later.</div>
                                    <Button disabled className="rounded-2xl text-sm py-3.5 bg-slate-700 text-slate-300 mt-auto">Coming soon</Button>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "multiplayerSelect" && (
            <motion.div key="multiplayerSelect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">Choose your race</h2>
                      <p className="text-blue-100/80 mt-2">Race to 30 correct answers against 3 opponents using your saved progression level.</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { key: "addsub", title: "Addition / Subtraction", detail: `Uses ${testingScores.addsubScore !== null ? userHistory.addsubLevel : "_____"}`, unlocked: hasAddSubPlacement },
                      { key: "muldiv", title: "Multiplication / Division", detail: `Uses ${testingScores.muldivScore !== null ? userHistory.muldivLevel : "_____"}`, unlocked: hasMulDivPlacement },
                      { key: "mixed", title: "Mixed", detail: hasMixedPlacement ? `Uses ${userHistory.addsubLevel} + ${userHistory.muldivLevel}` : "Requires both saved test strands", unlocked: hasMixedPlacement },
                    ].map((item) => (
                      <Card key={item.key} className={`bg-slate-900/60 border-white/10 rounded-3xl ${!item.unlocked ? "opacity-55" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-cyan-100" />
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          </div>
                          <div className="space-y-2">
                            <p className="text-blue-100/75">{item.detail}</p>
                            {!item.unlocked && item.key === "addsub" && <p className="text-amber-200 text-sm font-semibold">Save an AdS test first to unlock this race.</p>}
                            {!item.unlocked && item.key === "muldiv" && <p className="text-amber-200 text-sm font-semibold">Save a MuS test first to unlock this race.</p>}
                            {!item.unlocked && item.key === "mixed" && <p className="text-amber-200 text-sm font-semibold">Save both AdS and MuS tests to unlock Mixed race mode.</p>}
                          </div>
                          <Button onClick={() => startMultiplayerLobby(item.key)} disabled={!item.unlocked} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white disabled:bg-slate-700 disabled:text-slate-300">Enter Race Track</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "multiplayerWaiting" && multiplayerState && (
            <motion.div key="multiplayerWaiting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-cyan-500/20 text-cyan-50 border-none">Race Track</Badge>
                    <Badge className="bg-purple-500/20 text-purple-50 border-none">{multiplayerState.selectedMode === "addsub" ? "Addition / Subtraction" : multiplayerState.selectedMode === "muldiv" ? "Multiplication / Division" : "Mixed"}</Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-50 border-none">First to {MULTIPLAYER_TARGET_SCORE}</Badge>
                    <Badge className="bg-white/10 text-white border-none">Starts in {multiplayerState.waitTimeLeft}s</Badge>
                    <Button variant="outline" onClick={backToHome} className={cn("ml-auto rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                  </div>

                  <div className="rounded-3xl bg-slate-950/92 border border-white/10 p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3 text-sm text-blue-100/80">
                      <span>Race begins soon</span>
                      <span>{multiplayerState.waitTimeLeft}s</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                      <motion.div className="h-full bg-cyan-400" animate={{ width: `${((MULTIPLAYER_WAIT_SECONDS - multiplayerState.waitTimeLeft) / MULTIPLAYER_WAIT_SECONDS) * 100}%` }} transition={{ duration: 0.35 }} />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-4 flex flex-col items-center text-center gap-3">
                        <div className="relative w-20 h-20">
                          {premiumRingOverlay && <div className={`absolute -inset-1 rounded-full opacity-95 ${premiumRingOverlay} blur-[1px]`} />}
                          {equippedRingItem?.style && <div className={`absolute inset-0 rounded-full pointer-events-none ${equippedRingItem.style}`} />}
                          <div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate">
                            <div className={getCircularBackgroundClass(equippedBackgroundItem?.style)} />
                            {equippedEmojiItem ? <div className={getEmojiVisualClass(equippedEmojiItem.emoji, "text-4xl")}>{equippedEmojiItem.emoji}</div> : <UserCircle2 className="w-9 h-9 text-blue-100/85" />}
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-white">{playerName?.trim() || "You"}</div>
                          <div className="text-xs uppercase tracking-[0.16em] text-emerald-200">Ready</div>
                        </div>
                      </div>

                      {multiplayerState.opponents.map((opponent) => (
                        <div key={opponent.id} className="rounded-3xl bg-slate-900/70 border border-white/10 p-4 flex flex-col items-center text-center gap-3">
                          {opponent.joined ? (
                            <>
                              <div className="relative w-20 h-20">
                                {opponent.ringOverlay && <div className={`absolute -inset-1 rounded-full opacity-95 ${opponent.ringOverlay} blur-[1px]`} />}
                                {opponent.ringStyle && <div className={`absolute inset-0 rounded-full pointer-events-none ${opponent.ringStyle}`} />}
                                <div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate">
                                  <div className={getCircularBackgroundClass(opponent.backgroundStyle)} />
                                  <div className={getEmojiVisualClass(opponent.icon, "text-4xl")}>{opponent.icon}</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-lg font-black text-white">{opponent.name}</div>
                                <div className="text-xs uppercase tracking-[0.16em] text-emerald-200">Joined</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-20 h-20 rounded-full border border-dashed border-white/15 bg-slate-950/75 flex items-center justify-center text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                                ...
                              </div>
                              <div>
                                <div className="text-lg font-black text-white/75">Searching...</div>
                                <div className="text-xs uppercase tracking-[0.16em] text-cyan-100/65">Waiting to join</div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "multiplayerGame" && currentQuestion && multiplayerState && (
            <motion.div key="multiplayerGame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {isBilleaMode ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button type="button" onClick={exitToHome} variant="outline" className={cn("rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                  </div>
                  <BilleaMinimalGamePanel
                    timerLabel="Race timer"
                    timerValue={`${multiplayerState.elapsedTime}s`}
                    questionLabel="Race mode"
                    prompt={currentQuestion.prompt}
                    answer={answer}
                    setAnswer={setAnswer}
                    onSubmit={handleSubmit}
                    inputRef={inputRef}
                    feedback={feedback}
                  />
                </div>
              ) : (
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-cyan-500/20 text-cyan-50 border-none">Race Track</Badge>
                      <Badge className="bg-purple-500/20 text-purple-50 border-none">{multiplayerState.selectedMode === "addsub" ? "Addition / Subtraction" : multiplayerState.selectedMode === "muldiv" ? "Multiplication / Division" : "Mixed"}</Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-50 border-none">First to {MULTIPLAYER_TARGET_SCORE}</Badge>
                      <Badge className="bg-white/10 text-white border-none">{multiplayerState.elapsedTime}s</Badge>
                      <Button type="button" onClick={exitToHome} variant="outline" className={cn("ml-auto rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                    </div>

                    <div className="rounded-3xl bg-slate-950/92 border border-white/10 p-4 md:p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-white/70 text-xs uppercase tracking-[0.22em] mb-1">Race Track</div>
                          <div className="text-xl font-bold text-white">Race to 30 correct answers</div>
                        </div>
                        <div className="rounded-2xl bg-slate-900/70 border border-white/10 px-4 py-2 text-sm text-white font-semibold">Target: {MULTIPLAYER_TARGET_SCORE}</div>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            id: "player",
                            name: playerName?.trim() || "You",
                            progress: multiplayerPlayerProgress,
                            icon: equippedEmojiItem?.emoji || null,
                            backgroundStyle: equippedBackgroundItem?.style,
                            ringStyle: equippedRingItem?.style,
                            ringOverlay: premiumRingOverlay,
                            burst: feedback === "correct",
                            score: multiplayerState.playerScore,
                          },
                          ...multiplayerState.opponents.map((opponent) => ({
                            ...opponent,
                            progress: Math.min(100, (Number(opponent.progress || 0) / MULTIPLAYER_TARGET_SCORE) * 100),
                            score: Number(opponent.progress || 0),
                          })),
                        ].map((racer) => {
                          const iconOffset = Math.max(2, Math.min(92, racer.progress));
                          return (
                            <div key={racer.id} className="grid grid-cols-[110px_minmax(0,1fr)] md:grid-cols-[140px_minmax(0,1fr)] gap-3 items-center">
                              <div className="rounded-2xl bg-slate-900/70 border border-white/10 px-3 py-3 flex items-center justify-between gap-2 min-w-0">
                                <div className="min-w-0">
                                  <div className="text-sm md:text-base font-black text-white truncate">{racer.name}</div>
                                  <div className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/70">{racer.score}/{MULTIPLAYER_TARGET_SCORE}</div>
                                </div>
                                {racer.finishOrdinal && <div className="text-xs font-bold text-amber-200">#{racer.finishOrdinal}</div>}
                              </div>

                              <div className="relative h-14 rounded-2xl border overflow-hidden bg-slate-950/90 border-white/10">
                                <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.07)_0px,rgba(255,255,255,0.07)_14px,transparent_14px,transparent_28px)]" />
                                <div className="absolute inset-y-0 right-[2%] w-[6px] bg-[repeating-linear-gradient(180deg,#f8fafc_0px,#f8fafc_8px,#111827_8px,#111827_16px)]" />
                                <motion.div
                                  className={cn("absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/20 overflow-hidden isolate shadow-[0_8px_18px_rgba(15,23,42,0.35)]", racer.burst && "scale-110")}
                                  animate={{ left: `calc(${iconOffset}% - 18px)`, scale: racer.burst ? [1, 1.12, 1] : 1 }}
                                  transition={{ left: { duration: 0.35, ease: "easeOut" }, scale: { duration: 0.3 } }}
                                >
                                  {racer.ringOverlay && <div className={`absolute -inset-1 rounded-full opacity-95 ${racer.ringOverlay} blur-[1px]`} />}
                                  {racer.ringStyle && <div className={`absolute inset-0 rounded-full pointer-events-none ${racer.ringStyle}`} />}
                                  <div className="absolute inset-[3px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate">
                                    <div className={getCircularBackgroundClass(racer.backgroundStyle)} />
                                    {racer.icon ? <div className={getEmojiVisualClass(racer.icon, "text-2xl")}>{racer.icon}</div> : <UserCircle2 className="w-5 h-5 text-blue-100/85 relative z-10" />}
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Card className="bg-white/5 border-white/10 rounded-3xl">
                      <CardContent className="p-4 space-y-3">
                        <div className={`rounded-3xl p-4 text-center transition-all duration-200 border ${feedback === "correct" ? "bg-emerald-500/20 ring-2 ring-emerald-400 border-emerald-200/30" : feedback === "incorrect" ? "bg-red-500/20 ring-2 ring-red-400 border-red-200/30" : "bg-slate-900/95 border-blue-200/20"}`}>
                          <div className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-blue-100/80 mb-2">Race question</div>
                          <div className="text-2xl md:text-3xl font-black text-white leading-tight">{currentQuestion.prompt}</div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                          <Input
                            ref={inputRef}
                            autoFocus
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type answer"
                            className="h-16 rounded-3xl !text-[2.3rem] leading-none font-black tracking-tight bg-white/12 border-white/20 text-white placeholder:text-white/40 text-center"
                            autoComplete="off"
                          />
                          <Button type="submit" className="w-full h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-sm md:text-base font-bold">Enter</Button>
                        </form>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3 py-3 text-center">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Your score</div>
                        <div className="text-xl md:text-2xl font-black text-white mt-1">{multiplayerState.playerScore}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3 py-3 text-center">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Correct</div>
                        <div className="text-xl md:text-2xl font-black text-white mt-1">{score}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3 py-3 text-center">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Level</div>
                        <div className="text-sm md:text-lg font-black text-white mt-1">{multiplayerState.selectedMode === "mixed" && multiplayerState.raceLevel && typeof multiplayerState.raceLevel === "object" ? `${multiplayerState.raceLevel.addsubLevel} + ${multiplayerState.raceLevel.muldivLevel}` : String(multiplayerState.raceLevel || "")}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {screen === "multiplayerResults" && multiplayerState && (
            <motion.div key="multiplayerResults" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${multiplayerState.placementNumber === 1 ? "bg-emerald-500/15 border-emerald-300/40" : "bg-amber-500/15 border-amber-300/40"}`}>
                      {multiplayerState.placementNumber === 1 ? <Trophy className="w-12 h-12 text-emerald-200" /> : <Flag className="w-12 h-12 text-amber-200" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">Race Track</div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">{multiplayerState.placementNumber === 1 ? "You won the race" : `You finished ${multiplayerState.placementNumber}${multiplayerState.placementNumber === 1 ? "st" : multiplayerState.placementNumber === 2 ? "nd" : multiplayerState.placementNumber === 3 ? "rd" : "th"}`}</h2>
                    <p className="text-blue-100/80 max-w-2xl mx-auto">Winner: {multiplayerState.winner || "Unknown"}. Placement bonus earned: {multiplayerState.playerCoinsEarned || 0} coins.</p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5">
                      <div className="text-sm text-blue-100/70 mb-2">Placement</div>
                      <div className="text-4xl font-black text-white">#{multiplayerState.placementNumber || 4}</div>
                    </div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5">
                      <div className="text-sm text-blue-100/70 mb-2">Time</div>
                      <div className="text-4xl font-black text-white">{multiplayerState.elapsedTime || 0}s</div>
                    </div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5">
                      <div className="text-sm text-blue-100/70 mb-2">Correct</div>
                      <div className="text-4xl font-black text-white">{multiplayerState.playerScore || 0}</div>
                    </div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5">
                      <div className="text-sm text-blue-100/70 mb-2">Coins</div>
                      <div className="text-4xl font-black text-white">+{multiplayerState.playerCoinsEarned || 0}</div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button onClick={() => startMultiplayerLobby(multiplayerState.selectedMode)} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>
                      Race Again
                    </Button>
                    <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold">
                      Go Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "levels" && (
            <motion.div key="levels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Choose your level</h2>
                      <p className="text-blue-100/80 mt-2">{modeMeta[mode]?.title || "Practice mode"}</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>

                  {sessionType === "practice" && (
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <div className="text-white/70 text-xs uppercase tracking-[0.22em] mb-1">Round size</div>
                          <div className="text-lg font-bold text-white">Choose question amount</div>
                        </div>
                        <div className="text-xs font-semibold text-amber-200">Current level = 2x coins • 100 questions = up to 3x coins</div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(PRACTISE_ROUND_OPTIONS).map(([count, config]) => (
                          <Button
                            key={count}
                            type="button"
                            onClick={() => setPractiseQuestionCount(Number(count))}
                            className={cn(
                              "h-auto rounded-3xl border p-4 text-left flex flex-col items-start gap-2",
                              practiseQuestionCount === Number(count) ? `${actionButtonClass} text-white` : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                            )}
                          >
                            <div className="text-xl font-black">{count}</div>
                            <div className="text-xs text-white/75">{config.timeLimit}s</div>
                            <div className={`text-xs font-semibold ${Number(count) === 100 ? "text-amber-200" : "text-emerald-200"}`}>{Number(count) === 100 ? "Up to 3x coins" : "Normal coins"}</div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {mode !== "mixed" ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(progressionOrder[mode] || []).map((lvl) => {
                        const isCurrentSavedLevel = (mode === "addsub" && lvl === userHistory.addsubLevel) || (mode === "muldiv" && lvl === userHistory.muldivLevel);
                        return (
                          <Button
                            key={lvl}
                            type="button"
                            onClick={() => startLevel(lvl)}
                            className={cn(
                              "h-auto rounded-3xl border p-4 text-left flex flex-col items-start gap-2",
                              isCurrentSavedLevel
                                ? "bg-emerald-500/12 border-emerald-300/35 hover:bg-emerald-500/18"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                          >
                            <div className="flex w-full items-start justify-between gap-2">
                              <Badge className={`${accentPillClass} border-none`}>{mode === "addsub" ? "AdS" : "MuS"}</Badge>
                              {isCurrentSavedLevel && <Badge className="bg-emerald-400/20 text-emerald-50 border-none">2x coins</Badge>}
                            </div>
                            <div className="text-2xl font-black text-white">{lvl}</div>
                            <div className="text-xs text-white/70">{isCurrentSavedLevel ? "Current saved level" : "Start this level"}</div>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-5">
                      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-3">
                        <div className="text-lg font-bold text-white">Choose AdS level</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {progressionOrder.addsub.map((lvl) => {
                            const isCurrentSavedLevel = lvl === userHistory.addsubLevel;
                            return (
                              <Button
                                key={lvl}
                                type="button"
                                onClick={() => startMixedLevelSelection("addsubLevel", lvl)}
                                className={cn(
                                  "rounded-2xl h-auto min-h-[44px] border px-3 py-2 flex flex-col items-center justify-center gap-0.5",
                                  mixedSelection.addsubLevel === lvl ? `${actionButtonClass} text-white` : isCurrentSavedLevel ? "bg-emerald-500/12 border-emerald-300/35 text-white hover:bg-emerald-500/18" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                )}
                              >
                                <span className="font-bold">{lvl}</span>
                                {isCurrentSavedLevel && <span className="text-[10px] font-semibold text-emerald-200">2x coins</span>}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-3">
                        <div className="text-lg font-bold text-white">Choose MuS level</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {progressionOrder.muldiv.map((lvl) => {
                            const isCurrentSavedLevel = lvl === userHistory.muldivLevel;
                            return (
                              <Button
                                key={lvl}
                                type="button"
                                onClick={() => startMixedLevelSelection("muldivLevel", lvl)}
                                className={cn(
                                  "rounded-2xl h-auto min-h-[44px] border px-3 py-2 flex flex-col items-center justify-center gap-0.5",
                                  mixedSelection.muldivLevel === lvl ? `${actionButtonClass} text-white` : isCurrentSavedLevel ? "bg-emerald-500/12 border-emerald-300/35 text-white hover:bg-emerald-500/18" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                )}
                              >
                                <span className="font-bold">{lvl}</span>
                                {isCurrentSavedLevel && <span className="text-[10px] font-semibold text-emerald-200">2x coins</span>}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="lg:col-span-2 flex justify-center">
                        <Button
                          type="button"
                          disabled={!mixedSelection.addsubLevel || !mixedSelection.muldivLevel}
                          onClick={() => startLevel({ addsubLevel: mixedSelection.addsubLevel, muldivLevel: mixedSelection.muldivLevel })}
                          className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold disabled:bg-slate-700 disabled:text-slate-300`}
                        >
                          Start Mixed Level
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "game" && currentQuestion && (
            <motion.div key="game" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {isBilleaMode ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button type="button" onClick={isTestingMode ? exitToHome : backToHome} variant="outline" className={cn("rounded-2xl", topControlButtonClass)}>
                      Back to Home
                    </Button>
                  </div>

                  {isTimeTrialMode ? (
                    <Card className="bg-black border-white/75 rounded-3xl shadow-2xl">
                      <CardContent className="p-4 md:p-6">
                        <div className="max-w-4xl mx-auto space-y-4">
                          <div className="rounded-3xl border-2 border-white bg-black p-4 md:p-6">
                            <TimeTrialStopwatch
                              prompt={currentQuestion.prompt}
                              timeLeft={timeLeft}
                              totalTime={TIME_TRIAL_SECONDS}
                              feedback={feedback}
                              countdownLabel={timeTrialCountdownLabel}
                              monochrome
                            />
                          </div>
                          <form onSubmit={handleSubmit} className="space-y-3">
                            <Input
                              ref={inputRef}
                              autoFocus
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              placeholder="Type answer"
                              className="h-20 md:h-24 rounded-[2rem] !text-[2.6rem] md:!text-[3.2rem] leading-none font-black tracking-tight bg-black border-2 border-white text-white placeholder:text-white/35 text-center"
                              autoComplete="off"
                              disabled={isTimeTrialInteractionLocked}
                            />
                            <Button type="submit" disabled={isTimeTrialInteractionLocked} className="w-full h-12 md:h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-lg disabled:bg-zinc-700 disabled:text-zinc-300">
                              Enter
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <BilleaMinimalGamePanel
                      timerLabel="Time left"
                      timerValue={`${timeLeft}s`}
                      timerProgress={(timeLeft / Math.max(1, currentRoundTime)) * 100}
                      questionLabel={isTestingMode ? (testingState?.phase === "muldiv" ? "MuS" : "AdS") : mode === "mixed" ? `${level?.addsubLevel || ""} + ${level?.muldivLevel || ""}` : String(level || "")}
                      prompt={currentQuestion.prompt}
                      answer={answer}
                      setAnswer={setAnswer}
                      onSubmit={handleSubmit}
                      inputRef={inputRef}
                      feedback={feedback}
                    />
                  )}

                  {isTestingMode && pendingTestingExitConfirm && (
                    <div className="rounded-3xl bg-black border-2 border-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-white">
                      <div>Leave now? Your testing result for this round will not save.</div>
                      <div className="flex gap-2">
                        <Button type="button" onClick={exitToHome} className="rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold px-4">Leave</Button>
                        <Button type="button" onClick={cancelTestingExit} variant="outline" className="rounded-2xl border-white bg-black text-white hover:bg-zinc-900 px-4">Stay</Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${accentPillClass} border-none`}>{isTestingMode ? "Testing" : isTimeTrialMode ? "Time Trial" : "Practice"}</Badge>
                      <Badge className="bg-white/10 text-white border-none">{isTestingMode ? (testingState?.phase === "muldiv" ? "MuS" : "AdS") : modeMeta[mode]?.title || "Mode"}</Badge>
                      <Badge className="bg-white/10 text-white border-none">{mode === "mixed" && level && typeof level === "object" ? `${level.addsubLevel} + ${level.muldivLevel}` : String(level || "")}</Badge>
                      <Button type="button" onClick={isTestingMode ? exitToHome : backToHome} variant="outline" className={cn("ml-auto rounded-2xl", topControlButtonClass)}>
                        Back to Home
                      </Button>
                    </div>

                    {isTimeTrialMode ? (
                      <div className="space-y-3">
                        <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-3 items-start">
                          <div className="rounded-3xl bg-slate-950/92 border border-white/10 p-4 md:p-5">
                            <TimeTrialStopwatch prompt={currentQuestion.prompt} timeLeft={timeLeft} totalTime={TIME_TRIAL_SECONDS} feedback={feedback} countdownLabel={timeTrialCountdownLabel} />
                          </div>
                          <Card className="bg-white/5 border-white/10 rounded-3xl">
                            <CardContent className="p-3 md:p-4 h-full flex flex-col justify-center">
                              <form onSubmit={handleSubmit} className="space-y-3">
                                <Input
                                  ref={inputRef}
                                  autoFocus
                                  value={answer}
                                  onChange={(e) => setAnswer(e.target.value)}
                                  placeholder="Type answer"
                                  className="h-16 rounded-3xl !text-[2.1rem] md:!text-[2.4rem] leading-none font-black tracking-tight bg-white/12 border-white/20 text-white placeholder:text-white/40 text-center"
                                  autoComplete="off"
                                  disabled={isTimeTrialInteractionLocked}
                                />
                                <Button type="submit" disabled={isTimeTrialInteractionLocked} className="w-full h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-base font-bold disabled:bg-slate-700 disabled:text-slate-300">Enter</Button>
                              </form>
                            </CardContent>
                          </Card>
                        </div>
                        <Card className="bg-white/5 border-white/10 rounded-3xl">
                          <CardContent className="p-3">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Correct</div>
                                <div className="text-xl md:text-2xl font-black text-white mt-1">{score}</div>
                              </div>
                              <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Answered</div>
                                <div className="text-xl md:text-2xl font-black text-white mt-1">{results.length}</div>
                              </div>
                              <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Level</div>
                                <div className="text-lg md:text-xl font-black text-white mt-1 break-words">{mode === "mixed" && level && typeof level === "object" ? `${level.addsubLevel} + ${level.muldivLevel}` : String(level || "")}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="grid xl:grid-cols-[minmax(0,1fr)_240px] gap-3 items-start">
                        <div className="space-y-3 min-w-0">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                            <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3.5 py-3">
                              <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Correct</div>
                              <div className="text-2xl md:text-3xl font-black text-white mt-1">{score}</div>
                            </div>
                            <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3.5 py-3">
                              <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Question</div>
                              <div className="text-2xl md:text-3xl font-black text-white mt-1">{currentIndex + 1}/{roundQuestionCount}</div>
                            </div>
                            <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3.5 py-3">
                              <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Time</div>
                              <div className="text-2xl md:text-3xl font-black text-white mt-1">{timeLeft}s</div>
                            </div>
                            <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-3.5 py-3">
                              <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Target</div>
                              <div className="text-2xl md:text-3xl font-black text-white mt-1">{currentPassScore}</div>
                            </div>
                          </div>

                          <div className="rounded-3xl bg-slate-950/92 border border-white/10 p-4 md:p-5 space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm text-blue-100/80">
                                <span>Round progress</span>
                                <span>{results.length}/{roundQuestionCount} answered • Goal {currentPassScore}</span>
                              </div>
                              <div className="relative h-3.5 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                                <div className="absolute inset-y-0 left-0 bg-white/10" style={{ width: `${GOAL_PROGRESS_PERCENT}%` }} />
                                <div className="absolute inset-y-0 w-[3px] bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.4)]" style={{ left: `calc(${GOAL_PROGRESS_PERCENT}% - 1.5px)` }} />
                                <motion.div className="absolute inset-y-0 left-0 bg-emerald-400" animate={{ width: `${progressValue}%` }} transition={{ duration: 0.2 }} />
                              </div>
                            </div>

                            <div className={`rounded-3xl p-4 md:p-5 text-center transition-all duration-200 border ${feedback === "correct" ? "bg-emerald-500/20 ring-2 ring-emerald-400 border-emerald-200/30" : feedback === "incorrect" ? "bg-red-500/20 ring-2 ring-red-400 border-red-200/30" : "bg-slate-900/95 border-blue-200/20"}`}>
                              <div className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-blue-100/80 mb-2">
                                {isTestingMode ? (testingState?.phase === "muldiv" ? "MuS" : "AdS") : (mode === "muldiv" ? "MuS" : mode === "mixed" ? "Mixed" : "AdS")}
                              </div>
                              <div className="text-2xl md:text-4xl font-black text-white leading-tight text-center">{currentQuestion.prompt}</div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                              <Input
                                ref={inputRef}
                                autoFocus
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type answer"
                                className="h-16 md:h-18 rounded-3xl !text-[2.2rem] md:!text-[2.6rem] leading-none font-black tracking-tight bg-white/12 border-white/20 text-white placeholder:text-white/40 text-center"
                                autoComplete="off"
                              />
                              <Button type="submit" className="w-full h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-sm md:text-base font-bold">Enter</Button>
                            </form>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Card className="bg-white/5 border-white/10 rounded-3xl">
                            <CardContent className="p-4 space-y-3">
                              <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-4 py-3">
                                <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Level</div>
                                <div className="text-xl md:text-2xl font-black text-white mt-1">{mode === "mixed" && level && typeof level === "object" ? `${level.addsubLevel} + ${level.muldivLevel}` : String(level || "")}</div>
                              </div>
                              <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-4 py-3">
                                <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Answered</div>
                                <div className="text-2xl font-black text-white mt-1">{results.length}</div>
                              </div>
                              <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-4 py-3">
                                <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Remaining</div>
                                <div className="text-2xl font-black text-white mt-1">{Math.max(0, roundQuestionCount - results.length)}</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {isTestingMode && pendingTestingExitConfirm && (
                      <div className="rounded-3xl bg-amber-400/10 border border-amber-300/20 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="text-amber-100">Leave now? Your testing result for this round will not save.</div>
                        <div className="flex gap-2">
                          <Button type="button" onClick={exitToHome} className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4">Leave</Button>
                          <Button type="button" onClick={cancelTestingExit} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 px-4">Stay</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {screen === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${passed ? "bg-emerald-500/15 border-emerald-300/40" : "bg-amber-500/15 border-amber-300/40"}`}>
                      {passed ? <CheckCircle2 className="w-12 h-12 text-emerald-200" /> : <TimerReset className="w-12 h-12 text-amber-200" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">Round complete</div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">{passed ? "Nice work" : "Keep practising"}</h2>
                    <p className="text-blue-100/80 max-w-2xl mx-auto">You answered {score} out of {roundQuestionCount} correctly.</p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Correct</div><div className="text-4xl font-black text-white">{score}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Goal</div><div className="text-4xl font-black text-white">{currentPassScore}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Level</div><div className="text-2xl font-black text-white">{mode === "mixed" && level && typeof level === "object" ? `${level.addsubLevel} + ${level.muldivLevel}` : String(level || "")}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Coins</div><div className="text-4xl font-black text-white">+{roundReward?.totalCoins || 0}</div></div>
                  </div>

                  <div className="max-w-3xl mx-auto text-left rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                    <h3 className="text-xl font-bold text-white">Incorrect answers</h3>
                    {incorrectItems.length > 0 ? (
                      <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                        {incorrectItems.map((item, index) => (
                          <div key={`${item.prompt}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 space-y-1">
                            <div className="text-white font-semibold">{item.prompt}</div>
                            <div className="text-sm text-red-200">Your answer: {item.given || "No answer"}</div>
                            <div className="text-sm text-emerald-200">Correct answer: {item.expected}</div>
                            <div className="text-sm text-blue-100/80">{item.strategy}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-emerald-200 font-semibold">No incorrect answers this round.</div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button onClick={restartSameLevel} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>Play Again</Button>
                    {next && mode !== "mixed" && <Button onClick={nextLevel} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>Next Level</Button>}
                    <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold">Go Home</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "timeTrialSelect" && (
            <motion.div key="timeTrialSelect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">Choose a Time Trial</h2>
                      <p className="text-blue-100/80 mt-2">One minute against the clock using your saved level.</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { key: "addsub", title: "Addition / Subtraction", detail: `Uses ${testingScores.addsubScore !== null ? userHistory.addsubLevel : "_____"}`, unlocked: hasAddSubPlacement },
                      { key: "muldiv", title: "Multiplication / Division", detail: `Uses ${testingScores.muldivScore !== null ? userHistory.muldivLevel : "_____"}`, unlocked: hasMulDivPlacement },
                      { key: "mixed", title: "Mixed", detail: hasMixedPlacement ? `Uses ${userHistory.addsubLevel} + ${userHistory.muldivLevel}` : "Requires both saved test strands", unlocked: hasMixedPlacement },
                    ].map((item) => (
                      <Card key={item.key} className={`bg-slate-900/60 border-white/10 rounded-3xl ${!item.unlocked ? "opacity-55" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center gap-3"><Rocket className="w-6 h-6 text-cyan-100" /><h3 className="text-xl font-bold text-white">{item.title}</h3></div>
                          <p className="text-blue-100/75">{item.detail}</p>
                          <Button onClick={() => startTimeTrialMode(item.key)} disabled={!item.unlocked} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white disabled:bg-slate-700 disabled:text-slate-300">Start Time Trial</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "timeTrialResults" && timeTrialState && (
            <motion.div key="timeTrialResults" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <Trophy className="w-20 h-20 mx-auto text-cyan-200" />
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">Time Trial complete</div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">You scored {score}</h2>
                    <p className="text-blue-100/80 max-w-2xl mx-auto">Your result has been saved to the leaderboards.</p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Correct</div><div className="text-4xl font-black text-white">{score}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Answered</div><div className="text-4xl font-black text-white">{results.length}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Level</div><div className="text-2xl font-black text-white">{timeTrialState.levelLabel}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Coins</div><div className="text-4xl font-black text-white">+{roundReward?.totalCoins || 0}</div></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4 max-w-5xl mx-auto text-left">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-3">
                      <h3 className="text-xl font-bold text-white">All levels leaderboard</h3>
                      {timeTrialLeaderboards.overall.length > 0 ? timeTrialLeaderboards.overall.map((entry, index) => (
                        <div key={`overall-${entry.ts}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 px-4 py-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-white font-semibold">#{index + 1} • {entry.correctAnswers} correct</div>
                            <div className="text-xs text-white/65">{entry.levelLabel} • {formatTimeTrialTimestamp(entry.ts)}</div>
                          </div>
                        </div>
                      )) : <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-white/70">No scores yet.</div>}
                    </div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-3">
                      <h3 className="text-xl font-bold text-white">This level leaderboard</h3>
                      {timeTrialLeaderboards.byLevel.length > 0 ? timeTrialLeaderboards.byLevel.map((entry, index) => (
                        <div key={`level-${entry.ts}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 px-4 py-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-white font-semibold">#{index + 1} • {entry.correctAnswers} correct</div>
                            <div className="text-xs text-white/65">{entry.levelLabel} • {formatTimeTrialTimestamp(entry.ts)}</div>
                          </div>
                        </div>
                      )) : <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-white/70">No scores yet for this level.</div>}
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto text-left rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                    <h3 className="text-xl font-bold text-white">Incorrect answers</h3>
                    {incorrectItems.length > 0 ? incorrectItems.map((item, index) => (
                      <div key={`${item.prompt}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 space-y-1">
                        <div className="text-white font-semibold">{item.prompt}</div>
                        <div className="text-sm text-red-200">Your answer: {item.given || "No answer"}</div>
                        <div className="text-sm text-emerald-200">Correct answer: {item.expected}</div>
                      </div>
                    )) : <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-emerald-200 font-semibold">No incorrect answers this round.</div>}
                  </div>

                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button onClick={() => startTimeTrialMode(timeTrialState.selectedMode)} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>Play Again</Button>
                    <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold">Go Home</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "kingSelect" && (
            <motion.div key="kingSelect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">King of the Hill</h2>
                      <p className="text-blue-100/80 mt-2">Survive 15-question rounds as the time per question drops each round.</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { key: "addsub", title: "Addition / Subtraction", detail: `Uses ${testingScores.addsubScore !== null ? userHistory.addsubLevel : "_____"}`, unlocked: hasAddSubPlacement },
                      { key: "muldiv", title: "Multiplication / Division", detail: `Uses ${testingScores.muldivScore !== null ? userHistory.muldivLevel : "_____"}`, unlocked: hasMulDivPlacement },
                      { key: "mixed", title: "Mixed", detail: hasMixedPlacement ? `Uses ${userHistory.addsubLevel} + ${userHistory.muldivLevel}` : "Requires both saved test strands", unlocked: hasMixedPlacement },
                    ].map((item) => (
                      <Card key={item.key} className={`bg-slate-900/60 border-white/10 rounded-3xl ${!item.unlocked ? "opacity-55" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center gap-3"><Trophy className="w-6 h-6 text-cyan-100" /><h3 className="text-xl font-bold text-white">{item.title}</h3></div>
                          <p className="text-blue-100/75">{item.detail}</p>
                          <Button onClick={() => startKingMode(item.key)} disabled={!item.unlocked} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white disabled:bg-slate-700 disabled:text-slate-300">Start</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "kingIntro" && kingState && (
            <motion.div key="kingIntro" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">New challenger</div>
                  <div className="flex justify-center items-center gap-6">
                    <div className="relative w-24 h-24">
                      {premiumRingOverlay && <div className={`absolute -inset-1 rounded-full opacity-95 ${premiumRingOverlay} blur-[1px]`} />}
                      {equippedRingItem?.style && <div className={`absolute inset-0 rounded-full pointer-events-none ${equippedRingItem.style}`} />}
                      <div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate"><div className={getCircularBackgroundClass(equippedBackgroundItem?.style)} />{equippedEmojiItem ? <div className={getEmojiVisualClass(equippedEmojiItem.emoji, "text-5xl")}>{equippedEmojiItem.emoji}</div> : <UserCircle2 className="w-10 h-10 text-blue-100/85" />}</div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white">VS</div>
                    <div className="relative w-24 h-24">
                      {kingState.challenger?.ringOverlay && <div className={`absolute -inset-1 rounded-full opacity-95 ${kingState.challenger.ringOverlay} blur-[1px]`} />}
                      {kingState.challenger?.ringStyle && <div className={`absolute inset-0 rounded-full pointer-events-none ${kingState.challenger.ringStyle}`} />}
                      <div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate"><div className={getCircularBackgroundClass(kingState.challenger?.backgroundStyle)} /> <div className={getEmojiVisualClass(kingState.challenger?.icon, "text-5xl")}>{kingState.challenger?.icon}</div></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-5xl font-black text-white">{kingState.challenger?.name}</div>
                    <div className="text-blue-100/80 mt-2">Round {kingState.roundNumber} • {kingState.timePerQuestion}s per question</div>
                  </div>
                  <div className="max-w-xl mx-auto space-y-2">
                    <div className="flex items-center justify-between text-sm text-blue-100/80"><span>Starting in</span><span>{kingIntroSecondsLeft}s</span></div>
                    <div className="h-3 rounded-full bg-slate-800 border border-white/10 overflow-hidden"><motion.div className="h-full bg-cyan-400" animate={{ width: `${100 - kingIntroProgress}%` }} transition={{ duration: 0.2 }} /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "kingGame" && currentQuestion && kingState && (
            <motion.div key="kingGame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {isBilleaMode ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button type="button" onClick={exitToHome} variant="outline" className={cn("rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                  </div>
                  <BilleaMinimalGamePanel
                    timerLabel="Question timer"
                    timerValue={`${timeLeft}s`}
                    timerProgress={(timeLeft / Math.max(1, kingState.timePerQuestion || 1)) * 100}
                    questionLabel={`Round ${kingState.roundNumber}`}
                    prompt={currentQuestion.prompt}
                    answer={answer}
                    setAnswer={setAnswer}
                    onSubmit={handleSubmit}
                    inputRef={inputRef}
                    feedback={feedback}
                  />
                </div>
              ) : (
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${accentPillClass} border-none`}>King of the Hill</Badge>
                      <Badge className="bg-white/10 text-white border-none">Round {kingState.roundNumber}</Badge>
                      <Badge className={`${kingIsUrgent ? "bg-red-500/20 text-red-50" : "bg-white/10 text-white"} border-none`}>{timeLeft}s</Badge>
                      <Button type="button" onClick={exitToHome} variant="outline" className={cn("ml-auto rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-blue-100/70">
                        <span>Question timer</span>
                        <span>{timeLeft}s / {kingState.timePerQuestion}s</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
                        <motion.div
                          className={`${kingIsUrgent ? "bg-red-400" : "bg-cyan-400"} h-full`}
                          animate={{ width: `${Math.max(0, Math.min(100, (timeLeft / Math.max(1, kingState.timePerQuestion || 1)) * 100))}%` }}
                          transition={{ duration: 0.15 }}
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl bg-slate-950/92 border border-white/10 p-4 space-y-4">
                      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                        <div className="flex items-center gap-3 justify-end md:justify-end">
                          <div className="text-right"><div className="text-lg font-black text-white">{playerName?.trim() || "You"}</div></div>
                          <div className="relative w-20 h-20">
                            {premiumRingOverlay && <div className={`absolute -inset-1 rounded-full opacity-95 ${premiumRingOverlay} blur-[1px]`} />}
                            {equippedRingItem?.style && <div className={`absolute inset-0 rounded-full pointer-events-none ${equippedRingItem.style}`} />}
                            <div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate"><div className={getCircularBackgroundClass(equippedBackgroundItem?.style)} />{equippedEmojiItem ? <div className={getEmojiVisualClass(equippedEmojiItem.emoji, "text-4xl")}>{equippedEmojiItem.emoji}</div> : <UserCircle2 className="w-8 h-8 text-blue-100/85" />}</div>
                          </div>
                        </div>
                        <div className="text-center text-3xl md:text-4xl font-black text-white">VS</div>
                        <div className="flex items-center gap-3 justify-start">
                          <div className="relative w-20 h-20">
                            {kingState.challenger?.ringOverlay && <div className={`absolute -inset-1 rounded-full opacity-95 ${kingState.challenger.ringOverlay} blur-[1px]`} />}
                            {kingState.challenger?.ringStyle && <div className={`absolute inset-0 rounded-full pointer-events-none ${kingState.challenger.ringStyle}`} />}
                            <div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate"><div className={getCircularBackgroundClass(kingState.challenger?.backgroundStyle)} /> <div className={getEmojiVisualClass(kingState.challenger?.icon, "text-4xl")}>{kingState.challenger?.icon}</div></div>
                          </div>
                          <div><div className="text-lg font-black text-white">{kingState.challenger?.name}</div></div>
                        </div>
                      </div>

                      <div className={`rounded-3xl p-4 text-center transition-all duration-200 border ${feedback === "correct" ? "bg-emerald-500/20 ring-2 ring-emerald-400 border-emerald-200/30" : feedback === "incorrect" ? "bg-red-500/20 ring-2 ring-red-400 border-red-200/30" : kingIsUrgent ? "bg-red-500/15 border-red-300/30" : "bg-slate-900/95 border-blue-200/20"}`}>
                        <div className="text-2xl md:text-4xl font-black text-white leading-tight">{currentQuestion.prompt}</div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl mx-auto">
                        <Input ref={inputRef} autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type answer" className="h-16 rounded-3xl !text-[2.3rem] leading-none font-black tracking-tight bg-white/12 border-white/20 text-white placeholder:text-white/40 text-center" autoComplete="off" />
                        <Button type="submit" className="w-full h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-sm md:text-base font-bold">Enter</Button>
                      </form>
                    </div>

                    <div className="rounded-2xl bg-slate-900/70 border border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm text-white/80">
                      <span>Round {kingState.roundNumber}</span>
                      <span>{results.length}/15 answered</span>
                      <span>{score} correct</span>
                      <span>{kingState.timePerQuestion}s per question</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {screen === "kingIntermission" && kingState && (
            <motion.div key="kingIntermission" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-5">
                  <Trophy className="w-16 h-16 mx-auto text-cyan-200" />
                  <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">Round complete</div>
                  <h2 className="text-3xl md:text-5xl font-black text-white">{kingState.intermissionLabel || "New challenger"}</h2>
                  <p className="text-blue-100/80">Next round starting soon.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "kingResults" && kingState && (
            <motion.div key="kingResults" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <Trophy className="w-20 h-20 mx-auto text-cyan-200" />
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">King of the Hill finished</div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">{kingState.failureReason || "Run finished"}</h2>
                    <p className="text-blue-100/80 max-w-2xl mx-auto">You reached round {kingState.roundNumber} and cleared {kingState.completedRounds || 0} rounds.</p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Rounds cleared</div><div className="text-4xl font-black text-white">{kingState.completedRounds || 0}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Correct</div><div className="text-4xl font-black text-white">{score}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Last challenger</div><div className="text-2xl font-black text-white">{kingState.challenger?.name || "-"}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Coins</div><div className="text-4xl font-black text-white">+{kingState.coinsEarned || 0}</div></div>
                  </div>
                  <div className="max-w-4xl mx-auto text-left rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                    <h3 className="text-xl font-bold text-white">Opponents beaten</h3>
                    {(kingState.beatenOpponents || []).length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        {(kingState.beatenOpponents || []).map((opponent, index) => (
                          <div key={`${opponent.id}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 px-4 py-3 flex items-center gap-3">
                            <div className="text-3xl">{opponent.icon}</div>
                            <div><div className="text-white font-semibold">Round {opponent.roundNumber} • {opponent.name}</div></div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-white/70">No challengers beaten yet.</div>}
                  </div>
                  <div className="max-w-3xl mx-auto text-left rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                    <h3 className="text-xl font-bold text-white">Incorrect answers</h3>
                    {incorrectItems.length > 0 ? incorrectItems.map((item, index) => (
                      <div key={`${item.prompt}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 space-y-1"><div className="text-white font-semibold">{item.prompt}</div><div className="text-sm text-red-200">Your answer: {item.given || "No answer"}</div><div className="text-sm text-emerald-200">Correct answer: {item.expected}</div></div>
                    )) : <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-emerald-200 font-semibold">No incorrect answers this run.</div>}
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button onClick={() => startKingMode(kingState.selectedMode)} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>Play Again</Button>
                    <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold">Go Home</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "tugSelect" && (
            <motion.div key="tugSelect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">Tug of War</h2>
                      <p className="text-blue-100/80 mt-2">Beat 10 teacher opponents by pulling the rope your way.</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { key: "addsub", title: "Addition / Subtraction", detail: `Uses ${testingScores.addsubScore !== null ? userHistory.addsubLevel : "_____"}`, unlocked: hasAddSubPlacement },
                      { key: "muldiv", title: "Multiplication / Division", detail: `Uses ${testingScores.muldivScore !== null ? userHistory.muldivLevel : "_____"}`, unlocked: hasMulDivPlacement },
                      { key: "mixed", title: "Mixed", detail: hasMixedPlacement ? `Uses ${userHistory.addsubLevel} + ${userHistory.muldivLevel}` : "Requires both saved test strands", unlocked: hasMixedPlacement },
                    ].map((item) => (
                      <Card key={item.key} className={`bg-slate-900/60 border-white/10 rounded-3xl ${!item.unlocked ? "opacity-55" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center gap-3"><Users className="w-6 h-6 text-cyan-100" /><h3 className="text-xl font-bold text-white">{item.title}</h3></div>
                          <p className="text-blue-100/75">{item.detail}</p>
                          <Button onClick={() => startTugMode(item.key)} disabled={!item.unlocked} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white disabled:bg-slate-700 disabled:text-slate-300">Start</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "tugIntro" && tugState && (
            <motion.div key="tugIntro" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">Teacher battle</div>
                  <div className="flex justify-center items-center gap-6">
                    <div className="relative w-24 h-24"><div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate"><div className={getCircularBackgroundClass(equippedBackgroundItem?.style)} />{equippedEmojiItem ? <div className={getEmojiVisualClass(equippedEmojiItem.emoji, "text-5xl")}>{equippedEmojiItem.emoji}</div> : <UserCircle2 className="w-10 h-10 text-blue-100/85" />}</div></div>
                    <div className="text-4xl md:text-5xl font-black text-white">VS</div>
                    <div className="relative w-24 h-24"><div className="absolute inset-[6px] rounded-full flex items-center justify-center border border-white/15 overflow-hidden isolate"><div className={getCircularBackgroundClass(tugState.challenger?.backgroundStyle)} /><div className={getEmojiVisualClass(tugState.challenger?.icon, "text-5xl")}>{tugState.challenger?.icon}</div></div></div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_10px_28px_rgba(255,255,255,0.16)]">
                      Round {tugState.roundNumber}
                    </div>
                    <div className="text-3xl md:text-5xl font-black text-white">{tugState.challenger?.name}</div>
                    <div className="text-lg md:text-2xl font-semibold text-blue-100/90">Teacher battle {tugState.roundNumber} of {TUG_OF_WAR_TOTAL_ROUNDS}</div>
                  </div>
                  <div className="max-w-xl mx-auto space-y-2">
                    <div className="flex items-center justify-between text-sm text-blue-100/80"><span>Starting in</span><span>{tugIntroSecondsLeft}s</span></div>
                    <div className="h-3 rounded-full bg-slate-800 border border-white/10 overflow-hidden"><motion.div className="h-full bg-cyan-400" animate={{ width: `${100 - tugIntroProgress}%` }} transition={{ duration: 0.2 }} /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "tugGame" && currentQuestion && tugState && (
            <motion.div key="tugGame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {isBilleaMode ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button type="button" onClick={exitToHome} variant="outline" className={cn("rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                  </div>
                  <BilleaMinimalGamePanel
                    timerLabel="Teacher pull timer"
                    timerValue={`${tugNextPullSeconds}s`}
                    timerProgress={tugNextPullProgress}
                    questionLabel={`Round ${tugState.roundNumber}`}
                    prompt={currentQuestion.prompt}
                    answer={answer}
                    setAnswer={setAnswer}
                    onSubmit={handleSubmit}
                    inputRef={inputRef}
                    feedback={feedback}
                  />
                </div>
              ) : (
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${accentPillClass} border-none`}>Tug of War</Badge>
                      <Badge className="bg-white/10 text-white border-none">Round {tugState.roundNumber} / {TUG_OF_WAR_TOTAL_ROUNDS}</Badge>
                      <Button type="button" onClick={exitToHome} variant="outline" className={cn("ml-auto rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                    </div>

                    <div className="grid xl:grid-cols-[minmax(0,1fr)_280px] gap-3 items-start">
                      <div className="space-y-3">
                        <div className={cn("rounded-3xl bg-slate-950/92 border border-white/10 p-4 space-y-5", tugFlash?.side === "player" && "ring-2 ring-emerald-400", tugFlash?.side === "teacher" && "ring-2 ring-emerald-400") }>
                          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                            <div className="flex items-center gap-3 justify-end">
                              <div className="text-right">
                                <div className="text-xs uppercase tracking-[0.18em] text-blue-100/65">Player</div>
                                <div className="text-lg font-black text-white">{playerName?.trim() || "You"}</div>
                              </div>
                              <div className="w-16 h-16 rounded-full border border-white/15 bg-slate-900/90 flex items-center justify-center text-3xl shrink-0">{equippedEmojiItem?.emoji || "🙂"}</div>
                            </div>
                            <div className="text-center text-2xl md:text-3xl font-black text-white">VS</div>
                            <div className="flex items-center gap-3 justify-start">
                              <div className="w-16 h-16 rounded-full border border-white/15 bg-slate-900/90 flex items-center justify-center text-3xl shrink-0">{tugState.challenger?.icon || "🧑‍🏫"}</div>
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-blue-100/65">Teacher</div>
                                <div className="text-lg font-black text-white">{tugState.challenger?.name}</div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-3xl bg-slate-900/92 border border-white/10 px-5 py-6 space-y-3">
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-blue-100/65">
                              <span>Your side</span>
                              <span>Teacher side</span>
                            </div>
                            <div className="relative h-[82px]">
                              <div className="absolute inset-x-[14%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/15" />
                              <div className="absolute left-1/2 top-1/2 h-10 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-white/35" />

                              <div className={cn("absolute left-[14%] top-1/2 -translate-x-[118%] -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-slate-900/95 text-4xl shadow-[0_10px_24px_rgba(15,23,42,0.38)] transition-transform", tugFlash?.side === "player" && "scale-125")}>
                                {equippedEmojiItem?.emoji || "🙂"}
                              </div>

                              <div className={cn("absolute right-[14%] top-1/2 translate-x-[118%] -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-slate-900/95 text-4xl shadow-[0_10px_24px_rgba(15,23,42,0.38)] transition-transform", tugFlash?.side === "teacher" && "scale-125")}>
                                {tugState.challenger?.icon || "🧑‍🏫"}
                              </div>

                              <motion.div
                                className={cn("absolute top-1/2 h-7 w-7 rounded-full border-2 -translate-x-1/2 -translate-y-1/2", tugRopeDotClass)}
                                animate={{ left: `${Math.max(14, Math.min(86, tugRopePosition))}%` }}
                                transition={{ duration: 0.16 }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                              <span>{tugPlayerMatchPoint ? "One away" : "Pull left"}</span>
                              <span>{tugTeacherMatchPoint ? "One away" : "Hold them off"}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`rounded-3xl p-4 text-center transition-all duration-200 border ${feedback === "correct" ? "bg-emerald-500/20 ring-2 ring-emerald-400 border-emerald-200/30" : feedback === "incorrect" ? "bg-red-500/20 ring-2 ring-red-400 border-red-200/30" : "bg-slate-900/95 border-blue-200/20"}`}>
                          <div className="text-2xl md:text-3xl font-black text-white leading-tight">{currentQuestion.prompt}</div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                          <Input ref={inputRef} autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type answer" className="h-16 rounded-3xl !text-[2.3rem] leading-none font-black tracking-tight bg-white/12 border-white/20 text-white placeholder:text-white/40 text-center" autoComplete="off" />
                          <Button type="submit" className="w-full h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-sm md:text-base font-bold">Enter</Button>
                        </form>
                      </div>

                      <Card className="bg-white/5 border-white/10 rounded-3xl">
                        <CardContent className="p-4 space-y-3">
                          <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-4 py-3"><div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Round</div><div className="text-2xl font-black text-white mt-1">{tugState.roundNumber}</div></div>
                          <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-4 py-3"><div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Correct</div><div className="text-2xl font-black text-white mt-1">{tugState.totalCorrectAnswers || 0}</div></div>
                          <div className="rounded-2xl bg-slate-900/65 border border-white/10 px-4 py-3"><div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">Teachers beaten</div><div className="text-2xl font-black text-white mt-1">{(tugState.beatenTeachers || []).length}</div></div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {screen === "tugResults" && tugState && (
            <motion.div key="tugResults" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <Trophy className="w-20 h-20 mx-auto text-cyan-200" />
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">Tug of War finished</div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">{tugState.victory ? "You beat all 10 teachers" : tugState.failureReason || "Run finished"}</h2>
                    <p className="text-blue-100/80 max-w-2xl mx-auto">{tugState.challenger?.name ? `Final opponent: ${tugState.challenger.name}.` : ""}</p>
                  </div>
                  <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto text-left">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Rounds beaten</div><div className="text-4xl font-black text-white">{(tugState.beatenTeachers || []).length}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Total correct</div><div className="text-4xl font-black text-white">{tugState.totalCorrectAnswers || 0}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Time</div><div className="text-4xl font-black text-white">{tugState.totalDurationSeconds || 0}s</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Average time</div><div className="text-4xl font-black text-white">{tugState.totalCorrectAnswers ? Math.max(1, Math.round((tugState.totalDurationSeconds || 0) / tugState.totalCorrectAnswers)) : 0}s</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Coins</div><div className="text-4xl font-black text-white">+{tugState.coinsEarned || 0}</div></div>
                  </div>
                  <div className="max-w-4xl mx-auto text-left rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                    <h3 className="text-xl font-bold text-white">Teachers beaten</h3>
                    {(tugState.beatenTeachers || []).length > 0 ? (
                      <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                        {(tugState.beatenTeachers || []).map((teacher, index) => (
                          <div key={`${teacher.id}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 px-4 py-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3"><div className="text-3xl">{teacher.icon}</div><div><div className="text-white font-semibold">Round {teacher.roundNumber} • {teacher.name}</div><div className="text-xs text-white/65">{teacher.correctAnswers} correct • {teacher.durationSeconds}s</div></div></div>
                            <div className="text-sm text-blue-100/75">Avg {teacher.averageSecondsPerCorrect ? teacher.averageSecondsPerCorrect.toFixed(1) : "-"}s</div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-white/70">No teachers beaten yet.</div>}
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button onClick={() => startTugMode(tugState.selectedMode)} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>Play Again</Button>
                    <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold">Go Home</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "freeFallSelect" && (
            <motion.div key="freeFallSelect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">Free Fall</h2>
                      <p className="text-blue-100/80 mt-2">Questions fall toward the bottom. Miss three and the run ends.</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { key: "addsub", title: "Addition / Subtraction", detail: `Uses ${testingScores.addsubScore !== null ? userHistory.addsubLevel : "_____"}`, unlocked: hasAddSubPlacement },
                      { key: "muldiv", title: "Multiplication / Division", detail: `Uses ${testingScores.muldivScore !== null ? userHistory.muldivLevel : "_____"}`, unlocked: hasMulDivPlacement },
                      { key: "mixed", title: "Mixed", detail: hasMixedPlacement ? `Uses ${userHistory.addsubLevel} + ${userHistory.muldivLevel}` : "Requires both saved test strands", unlocked: hasMixedPlacement },
                    ].map((item) => (
                      <Card key={item.key} className={`bg-slate-900/60 border-white/10 rounded-3xl ${!item.unlocked ? "opacity-55" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center gap-3"><Calculator className="w-6 h-6 text-cyan-100" /><h3 className="text-xl font-bold text-white">{item.title}</h3></div>
                          <p className="text-blue-100/75">{item.detail}</p>
                          <Button onClick={() => startFreeFallMode(item.key)} disabled={!item.unlocked} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white disabled:bg-slate-700 disabled:text-slate-300">Start</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "freeFallGame" && freeFallState && (
            <motion.div key="freeFallGame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <Card className={cn("rounded-3xl shadow-2xl overflow-hidden", isBilleaMode ? "bg-black border-white/75" : "bg-white/10 border-white/10")}>
                <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={isBilleaMode ? "bg-black text-white border border-white" : `${accentPillClass} border-none`}>Free Fall</Badge>
                    <Badge className={isBilleaMode ? "bg-black text-white border border-white" : "bg-white/10 text-white border-none"}>{freeFallState.levelLabel}</Badge>
                    <Badge className={isBilleaMode ? "bg-black text-white border border-white" : "bg-white/10 text-white border-none"}>Level {freeFallDifficultyLevel}</Badge>
                    <Button type="button" onClick={exitToHome} variant="outline" className={cn("ml-auto rounded-2xl", topControlButtonClass)}>Back to Home</Button>
                  </div>

                  <div className="grid xl:grid-cols-[minmax(0,1fr)_260px] gap-3 items-start">
                    <div className="space-y-3">
                      <div className={cn("relative rounded-3xl overflow-hidden min-h-[480px] border", isBilleaMode ? "bg-black border-white/75" : "bg-slate-950/92 border-white/10")}>
                        <div className={cn("absolute inset-0", isBilleaMode ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_28%,rgba(0,0,0,0)_72%,rgba(255,255,255,0.08)_100%)]" : "bg-[linear-gradient(180deg,rgba(30,41,59,0.12)_0%,rgba(15,23,42,0)_28%,rgba(15,23,42,0)_72%,rgba(30,41,59,0.22)_100%)]")} />
                        {(freeFallState.activeQuestions || []).slice(0, freeFallMaxOnScreen).map((question) => {
                          const topPercent = 6 + Math.min(68, Number(question.progress || 0) * 68 * freeFallVisualSpeedMultiplier);
                          const isGoldActive = Boolean(question.isSpecial && !question.resolvedAt && Date.now() <= Number(question.goldUntil || 0));
                          return (
                            <motion.div
                              key={question.id}
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              style={{ left: `${question.lane}%`, top: `${topPercent}%`, width: "18%" }}
                              className={cn(
                                "absolute z-20 -translate-x-1/2 rounded-2xl border px-3 py-3 text-center shadow-[0_14px_30px_rgba(15,23,42,0.35)] transition-all duration-150",
                                isBilleaMode
                                  ? question.flash === "correct"
                                    ? "bg-white text-black border-white"
                                    : question.flash === "miss"
                                    ? "bg-zinc-700 text-white border-white"
                                    : isGoldActive
                                    ? "bg-zinc-800 text-white border-white animate-pulse"
                                    : question.isFast
                                    ? "bg-zinc-900 text-white border-white"
                                    : "bg-black text-white border-white/80"
                                  : question.flash === "correct"
                                  ? "bg-emerald-500/30 border-emerald-300/40 text-emerald-50"
                                  : question.flash === "miss"
                                  ? "bg-red-500/35 border-red-300/45 text-red-50"
                                  : isGoldActive
                                  ? "bg-amber-400/25 border-amber-200/45 text-amber-50 animate-pulse"
                                  : question.isFast
                                  ? "bg-red-500/28 border-red-300/40 text-red-50"
                                  : "bg-slate-900/92 border-white/12 text-white"
                              )}
                            >
                              {isGoldActive && <div className={cn("text-[10px] font-black uppercase tracking-[0.18em] mb-1", isBilleaMode ? "text-white" : "text-amber-100/90")}>{question.flash === "correct" ? "+1 Life" : "Bonus"}</div>}
                              {!isGoldActive && question.isFast && <div className={cn("text-[10px] font-black uppercase tracking-[0.18em] mb-1", isBilleaMode ? "text-white/90" : "text-red-100/90")}>Fast</div>}
                              <div className="text-lg md:text-xl font-black leading-tight">{question.prompt}</div>
                            </motion.div>
                          );
                        })}

                        <div className={cn("absolute inset-x-0 bottom-0 h-[72px] border-t", isBilleaMode ? "bg-zinc-700 border-white/50" : "bg-slate-500 border-slate-200/30")} />
                        <div className="absolute inset-x-0 bottom-[54px] h-[18px] flex items-end justify-between px-1 md:px-2 overflow-hidden">
                          {Array.from({ length: 18 }).map((_, index) => (
                            <div key={index} className={cn("w-[5.2%] h-full rounded-t-md border border-b-0", isBilleaMode ? "bg-zinc-700 border-white/35" : "bg-slate-500 border-slate-200/20")} />
                          ))}
                        </div>
                        <div className={cn("absolute left-0 bottom-[22px] w-[20%] h-[64px] border-y border-r rounded-r-xl", isBilleaMode ? "bg-zinc-700 border-white/35" : "bg-slate-500 border-slate-200/20")} />
                        <div className={cn("absolute right-0 bottom-[22px] w-[20%] h-[64px] border-y border-l rounded-l-xl", isBilleaMode ? "bg-zinc-700 border-white/35" : "bg-slate-500 border-slate-200/20")} />
                        <div className={cn("absolute left-[10%] bottom-[48px] w-8 h-16 rounded-t-xl border", isBilleaMode ? "bg-zinc-700 border-white/35" : "bg-slate-500 border-slate-200/20")} />
                        <div className={cn("absolute right-[10%] bottom-[48px] w-8 h-16 rounded-t-xl border", isBilleaMode ? "bg-zinc-700 border-white/35" : "bg-slate-500 border-slate-200/20")} />
                        <div className={cn("absolute left-1/2 bottom-[18px] -translate-x-1/2 w-[140px] h-[78px] rounded-t-[28px] border shadow-[0_0_30px_rgba(15,23,42,0.4)]", isBilleaMode ? "bg-zinc-700 border-white/40" : "bg-slate-600 border-slate-200/25")} />
                        <div className={cn("absolute left-1/2 bottom-[8px] -translate-x-1/2 w-16 h-12 rounded-t-2xl border", isBilleaMode ? "bg-zinc-700 border-white/40" : "bg-slate-600 border-slate-200/25")} />
                        <div className="absolute left-1/2 bottom-[28px] -translate-x-1/2 text-4xl">{equippedEmojiItem?.emoji || "🙂"}</div>

                        <div className="absolute left-3 top-3 z-30 rounded-2xl bg-black/85 border border-white/35 px-3 py-2 text-left">
                          <div className="text-[10px] uppercase tracking-[0.18em] text-white/65">Lives</div>
                          <div className="text-xl font-black text-white">{freeFallState.lives || 0}</div>
                        </div>
                        <div className="absolute right-3 top-3 z-30 rounded-2xl bg-black/85 border border-white/35 px-3 py-2 text-right">
                          <div className="text-[10px] uppercase tracking-[0.18em] text-white/65">Timer</div>
                          <div className="text-xl font-black text-white">{freeFallState.elapsedSeconds || 0}s</div>
                        </div>
                        {freeFallState.correctAnswers > 0 && freeFallState.correctAnswers % 20 === 0 && (
                          <div className="absolute inset-x-0 top-16 flex justify-center z-30 pointer-events-none">
                            <div className={cn("rounded-2xl border px-4 py-2 font-black uppercase tracking-[0.22em]", isBilleaMode ? "bg-black border-white text-white" : "bg-cyan-400/20 border-cyan-200/30 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.2)]")}>Level Up</div>
                          </div>
                        )}
                        <div className="absolute right-3 top-20 space-y-2">
                          {(freeFallState.announcements || []).map((item) => (
                            <div key={item.id} className={cn("rounded-2xl px-3 py-2 text-sm font-bold border", isBilleaMode ? "bg-black border-white text-white" : item.style === "life"
                                ? "bg-emerald-500/20 border-emerald-300/30 text-emerald-100"
                                : item.style === "level"
                                ? "bg-cyan-400/20 border-cyan-200/30 text-cyan-100"
                                : "bg-red-500/20 border-red-300/30 text-red-100")}>{item.text}</div>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <Input ref={inputRef} autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type answer" className={cn("h-16 rounded-3xl !text-[2.3rem] leading-none font-black tracking-tight text-center", isBilleaMode ? "bg-black border-2 border-white text-white placeholder:text-white/35" : "bg-white/12 border-white/20 text-white placeholder:text-white/40")} autoComplete="off" />
                        <Button type="submit" className={cn("w-full h-11 rounded-2xl text-sm md:text-base font-bold", isBilleaMode ? "bg-white text-black hover:bg-zinc-200" : "bg-cyan-500 hover:bg-cyan-400 text-white")}>Enter</Button>
                      </form>
                    </div>

                    <Card className={cn("rounded-3xl", isBilleaMode ? "bg-black border-white/75" : "bg-white/5 border-white/10")}>
                      <CardContent className="p-4 space-y-3">
                        <div className={cn("rounded-2xl border px-4 py-3", isBilleaMode ? "bg-zinc-950 border-white/35" : "bg-slate-900/65 border-white/10")}><div className={cn("text-[11px] uppercase tracking-[0.16em]", isBilleaMode ? "text-white/65" : "text-blue-100/65")}>Correct</div><div className="text-3xl font-black text-white mt-1">{freeFallState.correctAnswers || 0}</div></div>
                        <div className={cn("rounded-2xl border px-4 py-3", isBilleaMode ? "bg-zinc-950 border-white/35" : "bg-slate-900/65 border-white/10")}><div className={cn("text-[11px] uppercase tracking-[0.16em]", isBilleaMode ? "text-white/65" : "text-blue-100/65")}>Difficulty</div><div className="text-3xl font-black text-white mt-1">Lv {freeFallDifficultyLevel}</div></div>
                        <div className={cn("rounded-2xl border px-4 py-3", isBilleaMode ? "bg-zinc-950 border-white/35" : "bg-slate-900/65 border-white/10")}><div className={cn("text-[11px] uppercase tracking-[0.16em]", isBilleaMode ? "text-white/65" : "text-blue-100/65")}>Max on screen</div><div className="text-3xl font-black text-white mt-1">{freeFallMaxOnScreen}</div></div>
                        <div className={cn("rounded-2xl border px-4 py-3", isBilleaMode ? "bg-zinc-950 border-white/35" : "bg-slate-900/65 border-white/10")}><div className={cn("text-[11px] uppercase tracking-[0.16em]", isBilleaMode ? "text-white/65" : "text-blue-100/65")}>On screen</div><div className="text-3xl font-black text-white mt-1">{(freeFallState.activeQuestions || []).filter((question) => !question.resolvedAt).length}</div></div>
                        <div className={cn("rounded-2xl border px-4 py-3", isBilleaMode ? "bg-zinc-950 border-white/35" : "bg-slate-900/65 border-white/10")}><div className={cn("text-[11px] uppercase tracking-[0.16em]", isBilleaMode ? "text-white/65" : "text-blue-100/65")}>High score</div><div className="text-3xl font-black text-white mt-1">{freeFallModeHighScoreSeconds || freeFallHighScoreSeconds || 0}s</div></div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "freeFallResults" && freeFallState && (
            <motion.div key="freeFallResults" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <Trophy className="w-20 h-20 mx-auto text-cyan-200" />
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">Free Fall finished</div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">{freeFallState.failureReason || "Run finished"}</h2>
                    <p className="text-blue-100/80 max-w-2xl mx-auto">Your high score in this mode is based on time survived.</p>
                  </div>
                  <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto text-left">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Time survived</div><div className="text-4xl font-black text-white">{freeFallState.elapsedSeconds || 0}s</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Correct answers</div><div className="text-4xl font-black text-white">{freeFallState.correctAnswers || 0}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Best streak</div><div className="text-4xl font-black text-white">{freeFallState.bestStreak || 0}</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">High score</div><div className="text-4xl font-black text-white">{freeFallState.highScoreSeconds || freeFallHighScoreSeconds || 0}s</div></div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5"><div className="text-sm text-blue-100/70 mb-2">Coins</div><div className="text-4xl font-black text-white">+{freeFallState.coinsEarned || 0}</div></div>
                  </div>

                  <div className="max-w-3xl mx-auto text-left rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                    <h3 className="text-xl font-bold text-white">Incorrect answers</h3>
                    {(freeFallState.incorrectItems || []).length > 0 ? (
                      <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                        {(freeFallState.incorrectItems || []).map((item, index) => (
                          <div key={`${item.prompt}-${index}`} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 space-y-1">
                            <div className="text-white font-semibold">{item.prompt}</div>
                            <div className="text-sm text-red-200">Your answer: {item.given || "No answer"}</div>
                            <div className="text-sm text-emerald-200">Correct answer: {item.expected}</div>
                            <div className="text-sm text-blue-100/80">{item.strategy}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-emerald-200 font-semibold">No missed questions to review. Great work.</div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button onClick={() => startFreeFallMode(freeFallState.selectedMode)} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>Play Again</Button>
                    <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold">Go Home</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">History</h2>
                      <p className="text-blue-100/80 mt-2">All-time stats and the past 7 days.</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5">
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                      <h3 className="text-xl font-bold text-white">All time</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Time played</div><div className="text-3xl font-black text-white mt-1">{formatStatDuration(historyStats.all.totalSeconds)}</div></div>
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Correct answers</div><div className="text-3xl font-black text-white mt-1">{historyStats.all.correctAnswers}</div></div>
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Coins earned</div><div className="text-3xl font-black text-white mt-1">{historyStats.all.coinsEarned}</div></div>
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Fastest race</div><div className="text-3xl font-black text-white mt-1">{historyStats.all.fastestRaceTime ? `${historyStats.all.fastestRaceTime}s` : "-"}</div></div>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 space-y-4">
                      <h3 className="text-xl font-bold text-white">Past 7 days</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Time played</div><div className="text-3xl font-black text-white mt-1">{formatStatDuration(historyStats.week.totalSeconds)}</div></div>
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Correct answers</div><div className="text-3xl font-black text-white mt-1">{historyStats.week.correctAnswers}</div></div>
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Coins earned</div><div className="text-3xl font-black text-white mt-1">{historyStats.week.coinsEarned}</div></div>
                        <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4"><div className="text-sm text-blue-100/70">Fastest race</div><div className="text-3xl font-black text-white mt-1">{historyStats.week.fastestRaceTime ? `${historyStats.week.fastestRaceTime}s` : "-"}</div></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "testingRetryPrompt" && testingState?.pendingRetry && (
            <motion.div
              key="testingRetryPrompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-10 text-center space-y-5">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 bg-amber-500/15 border-amber-300/40">
                      <Sparkles className="w-10 h-10 text-amber-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.22em] text-blue-100/70">So close</div>
                    <h2 className="text-3xl md:text-4xl font-black text-white">You were very close on {testingState.pendingRetry.level}</h2>
                    <p className="text-blue-100/80 max-w-2xl mx-auto">
                      You scored <span className="font-bold text-white">{testingState.pendingRetry.score} / 15</span>. You can have one more try at this level because you were so close to moving up.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-400/10 border border-amber-300/20 px-5 py-4 max-w-2xl mx-auto text-amber-100">
                    If you score 12/15 or 13/15 again, you will stay on this level with that score.
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button onClick={retryCloseCallTestingLevel} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>
                      Try this level again
                    </Button>
                    <Button onClick={continueCloseCallTestingLevel} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold">
                      Move on
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "testingComplete" && (
            <motion.div
              key="testingComplete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-5">
                  <Trophy className="w-20 h-20 mx-auto text-cyan-200" />
                  {roundReward && <div className="flex justify-center"><Badge className="bg-cyan-400/20 text-cyan-50 border-none">+{roundReward.totalCoins} coins earned</Badge></div>}
                  <div className="text-blue-100/70 text-sm">Testing complete</div>
                  <h2 className="text-4xl md:text-5xl font-black">{playerName?.trim() ? `${playerName}'s current levels updated` : "Current levels updated"}</h2>
                  <p className="text-blue-100/80 max-w-2xl mx-auto">
                    {testingState?.runType === "mixed"
                      ? "Mixed Testing has worked out both current placements, saved them to this device, and unlocked all Practice and Game modes."
                      : testingState?.runType === "addsub"
                      ? "AdS testing has updated the Addition and Subtraction placement, saved it to this device, and unlocked AdS practice and AdS race mode."
                      : "MuS testing has updated the Multiplication and Division placement, saved it to this device, and unlocked MuS practice and MuS race mode."}
                  </p>
                  <div className="flex justify-center">
                    <Badge className="bg-emerald-400/20 text-emerald-50 border-none text-base px-4 py-2">Testing coins earned: +{testingCoinsEarned}</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                    <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-5 py-4">
                      <div className="text-sm text-blue-100/70 mb-1">Addition / Subtraction</div>
                      <div className="text-3xl font-black">{testingScores.addsubScore !== null ? userHistory.addsubLevel : "_____"}</div>
                      <div className="text-sm text-cyan-100/80 mt-2">{testingScores.addsubScore !== null ? `${testingScores.addsubScore}/15` : "No test yet"}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-5 py-4">
                      <div className="text-sm text-blue-100/70 mb-1">Multiplication / Division</div>
                      <div className="text-3xl font-black">{testingScores.muldivScore !== null ? userHistory.muldivLevel : "_____"}</div>
                      <div className="text-sm text-cyan-100/80 mt-2">{testingScores.muldivScore !== null ? `${testingScores.muldivScore}/15` : "No test yet"}</div>
                    </div>
                  </div>
                  {(testingScores.addsubScore >= 14 || testingScores.muldivScore >= 14) && (
                    <div className="rounded-2xl bg-amber-400/10 border border-amber-300/20 px-5 py-4 max-w-2xl mx-auto text-amber-100">
                      A very strong test result was recorded. You may want to retake the test to check if the student can place even higher.
                    </div>
                  )}
                  <div className="flex justify-center gap-3 flex-wrap">
                    {(testingScores.addsubScore >= 14 || testingScores.muldivScore >= 14) && (
                      <Button
                        onClick={() => startTestingMode(testingState?.runType || "mixed")}
                        className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}
                      >
                        {testingState?.runType === "addsub" ? "Retake AdS Test" : testingState?.runType === "muldiv" ? "Retake MuS Test" : "Retake Mixed Testing"}
                      </Button>
                    )}
                    {testingScores.addsubScore >= 14 || testingScores.muldivScore >= 14 ? (
                      <Button onClick={exitToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10">
                        {minimalCopyMode ? "Home" : "Back to Home"}
                      </Button>
                    ) : (
                      <Button onClick={exitToHome} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>
                        {minimalCopyMode ? "Home" : "Back to Home"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-5">
                  <Trophy className="w-20 h-20 mx-auto text-yellow-200" />
                  <h2 className="text-4xl md:text-5xl font-black">Sequence Complete</h2>
                  <p className="text-blue-100/80 max-w-2xl mx-auto">
                    You completed all progression levels in this mode. You could now add class leaderboards, student names, or teacher-assigned level tracking.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button onClick={backToHome} className={`rounded-2xl h-12 px-6 ${actionButtonClass} text-white font-bold`}>
                      {minimalCopyMode ? "Home" : "Back to Home"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      <Analytics />
      </div>
    </div>
  );
}
