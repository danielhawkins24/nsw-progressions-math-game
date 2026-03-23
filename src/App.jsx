import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { CheckCircle2, XCircle, TimerReset, Trophy, Calculator, Flag, UserCircle2, ShoppingBag, Check, Palette, Cat, Pencil, Users, Rocket, Sparkles, CircleDollarSign } from "lucide-react";

const ROUND_TIME = 120;
const QUESTIONS_PER_ROUND = 15;
const PASS_SCORE = 14;
const TESTING_PASS_SCORE = 14;
const TESTING_HOLD_MIN = 4;
const TESTING_HOLD_MAX = 13;
const STORAGE_KEY = "nsw-progressions-power-up-user-history";
const PROFILE_STORAGE_KEY = "nsw-progressions-power-up-profile";
const PLAYER_NAME_STORAGE_KEY = "nsw-progressions-power-up-player-name";
const THEME_STORAGE_KEY = "nsw-progressions-power-up-theme";
const TESTING_SCORE_STORAGE_KEY = "nsw-progressions-power-up-testing-scores";
const TESTING_UNLOCK_STORAGE_KEY = "nsw-progressions-power-up-testing-unlock";
const BONUS_DISPLAY_MS = 2200;
const MIXED_MODE_MULTIPLIER = 1.5;
const MULTIPLAYER_TARGET_SCORE = 30;
const MULTIPLAYER_WAIT_SECONDS = 10;
const MULTIPLAYER_PLACEMENT_COINS = { 1: 30, 2: 20, 3: 10, 4: 5 };
const CURRENT_LEVEL_MATCH_MULTIPLIER = 2;

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

function buildRound(mode, level) {
  const questions = [];
  for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
    questions.push(generateQuestion(mode, level));
  }
  return questions;
}

const GOAL_PROGRESS_PERCENT = (PASS_SCORE / QUESTIONS_PER_ROUND) * 100;

const SHOP_CATEGORIES = [
  { id: "emoji", label: "Emoji", icon: Cat },
  { id: "background", label: "Background", icon: Palette },
  { id: "ring", label: "Ring", icon: Sparkles },
  { id: "upgrades", label: "Upgrades", icon: CircleDollarSign },
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
  { id: "emoji-tiger", category: "emoji", name: "Tiger", cost: 650, emoji: "🐯", rarity: "uncommon" },
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

  { id: "upgrade-coin-boost", category: "upgrades", name: "Double Coins Boost", cost: 200, detail: "Double all coins for 20 minutes", boostType: "coinMultiplier2x", durationMs: 20 * 60 * 1000 },
  { id: "theme-blue", category: "upgrades", name: "Beresford Blue", cost: 0, detail: "Permanent site theme", themeId: "blue", permanentUnlock: true },
  { id: "theme-emerald", category: "upgrades", name: "Emerald Glow", cost: 600, detail: "Permanent site theme", themeId: "emerald", permanentUnlock: true },
  { id: "theme-sunset", category: "upgrades", name: "Sunset Burst", cost: 800, detail: "Permanent site theme", themeId: "sunset", permanentUnlock: true },
  { id: "theme-violet", category: "upgrades", name: "Violet Storm", cost: 900, detail: "Permanent site theme", themeId: "violet", permanentUnlock: true },
  { id: "theme-gold", category: "upgrades", name: "Golden Hour", cost: 1200, detail: "Permanent site theme", themeId: "gold", permanentUnlock: true },
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
    default:
      return null;
  }
}

function isPremiumRing(ringId) {
  return Boolean(getPremiumRingOverlayClass(ringId));
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

function buildFakeMultiplayerOpponents() {
  const names = shuffle(fakeMultiplayerNames).slice(0, 3);
  const rivalIndex = randInt(0, 2);
  const emojiOptions = PROFILE_SHOP_ITEMS
    .filter((item) => item.category === "emoji" && item.emoji)
    .map((item) => item.emoji);

  return names.map((name, index) => ({
    id: `bot-${index}-${name}`,
    name,
    icon: choice(emojiOptions.length ? emojiOptions : ["🐨", "🦘", "🐊", "🦉", "🐸", "🦊"]),
    targetDuration: randInt(120, 240),
    progress: 0,
    joined: false,
    joinAt: randInt(0, MULTIPLAYER_WAIT_SECONDS),
    burst: false,
    isAdaptiveRival: index === rivalIndex,
    lockedPacePerSecond: null,
  }));
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
  const [cheatSequence, setCheatSequence] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const [purchasedItemsOpen, setPurchasedItemsOpen] = useState(false);
  const [profileState, setProfileState] = useState({ coins: 0, ownedItems: [], equippedItems: [], activeBoosts: [] });
  const [playerName, setPlayerName] = useState("");
  const [isEditingPlayerName, setIsEditingPlayerName] = useState(false);
  const [draftPlayerName, setDraftPlayerName] = useState("");
  const [themeId, setThemeId] = useState("blue");
  const [boostCountdownNow, setBoostCountdownNow] = useState(Date.now());
  const [roundReward, setRoundReward] = useState(null);
  const [testingCoinsEarned, setTestingCoinsEarned] = useState(0);
  const [multiplayerState, setMultiplayerState] = useState(null);
  const [mode, setMode] = useState(null);
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
  const [testingState, setTestingState] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [roundFinished, setRoundFinished] = useState(false);
  const inputRef = useRef(null);
  const playerNameInputRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isTestingMode = mode === "testing";
  const isMultiplayerMode = mode === "multiplayer";
  const score = useMemo(() => results.filter((r) => r.correct).length, [results]);
  const progressValue = (results.length / QUESTIONS_PER_ROUND) * 100;
  const multiplayerPlayerProgress = multiplayerState ? Math.min(100, (multiplayerState.playerScore / MULTIPLAYER_TARGET_SCORE) * 100) : 0;
  const expectedAnsweredByNow = ((ROUND_TIME - timeLeft) / ROUND_TIME) * QUESTIONS_PER_ROUND;
  const paceDelta = results.length - expectedAnsweredByNow;
  const timerProgress = ((ROUND_TIME - timeLeft) / ROUND_TIME) * 100;

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
    if (screen === "game" && !roundFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (screen === "game" && timeLeft <= 0 && !roundFinished) {
      finishRound();
    }
  }, [screen, timeLeft, roundFinished]);

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
        const nextOpponents = current.opponents.map((opponent) => {
          const previousProgress = opponent.progress;

          if (opponent.isAdaptiveRival) {
            let lockedPacePerSecond = opponent.lockedPacePerSecond;
            if (current.playerScore >= 10 && !lockedPacePerSecond) {
              lockedPacePerSecond = current.playerScore / Math.max(nextElapsed, 1);
            }

            let targetProgress;
            if (lockedPacePerSecond) {
              targetProgress = lockedPacePerSecond * nextElapsed;
            } else {
              const playerPace = current.playerScore / Math.max(nextElapsed, 1);
              const chaseFactor = 0.92 + Math.random() * 0.16;
              targetProgress = playerPace * nextElapsed * chaseFactor;
            }

            const randomNudge = Math.random() < 0.35 ? choice([0, 0, 1]) : 0;
            const nextProgress = Math.min(
              MULTIPLAYER_TARGET_SCORE,
              Math.max(opponent.progress, Math.round(targetProgress + randomNudge))
            );
            return {
              ...opponent,
              progress: nextProgress,
              burst: nextProgress > previousProgress,
              lockedPacePerSecond,
            };
          }

          const expectedProgress = Math.min(MULTIPLAYER_TARGET_SCORE, (nextElapsed / opponent.targetDuration) * MULTIPLAYER_TARGET_SCORE);
          const randomNudge = Math.random() < 0.45 ? choice([0, 0, 1]) : 0;
          const nextProgress = Math.min(MULTIPLAYER_TARGET_SCORE, Math.max(opponent.progress, Math.round(expectedProgress + randomNudge)));
          return { ...opponent, progress: nextProgress, burst: nextProgress > previousProgress };
        });
        return { ...current, opponents: nextOpponents, elapsedTime: nextElapsed };
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
    if (screen === "game" && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [screen, currentIndex, feedback, level]);

  useEffect(() => {
    function keepFocusReady() {
      if (screen === "game" && inputRef.current && document.activeElement !== inputRef.current) {
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
      return activeBoosts.some((boost) => boost.type === "coinMultiplier2x") ? 2 : 1;
    }
    return activeBoosts.some((boost) => boost.type === "coinMultiplier2x") ? 2 : 1;
  }

  function awardCoinsForRound(finalResults, options = {}) {
    const { testingModeActive = false, activeMode = mode } = options;
    const correctCount = finalResults.filter((r) => r.correct).length;
    const bonus = correctCount === 15 ? 10 : correctCount === 14 ? 5 : 0;
    const basePerQuestion = testingModeActive ? 2 : 1;
    const bonusMultiplier = testingModeActive ? 2 : 1;
    const mixedModeMultiplier = activeMode === "mixed" ? MIXED_MODE_MULTIPLIER : 1;
    const levelMatchMultiplier = getCurrentLevelMatchMultiplier(activeMode);
    const boostMultiplier = getActiveCoinMultiplier();
    const baseCoins = Math.round(correctCount * basePerQuestion * mixedModeMultiplier * levelMatchMultiplier * boostMultiplier);
    const bonusCoins = Math.round(bonus * bonusMultiplier * mixedModeMultiplier * levelMatchMultiplier * boostMultiplier);
    const totalCoins = baseCoins + bonusCoins;
    const storedProfile = readProfileState();
    const nextProfile = {
      ...storedProfile,
      coins: (storedProfile.coins || 0) + totalCoins,
    };
    saveProfileState(nextProfile);
    setRoundReward({ correctCount, baseCoins, bonusCoins, totalCoins, testingModeActive, boostMultiplier, mixedModeMultiplier, levelMatchMultiplier, activeMode });
    if (testingModeActive) {
      setTestingCoinsEarned((current) => current + totalCoins);
    }
    window.setTimeout(() => setRoundReward((current) => current), BONUS_DISPLAY_MS);
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

  function saveProfileState(nextProfile) {
    writeProfileState(nextProfile);
    setProfileState(nextProfile);
  }

  function handlePlayerNameChange(value) {
    setDraftPlayerName(value);
  }

  function beginEditingPlayerName() {
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

  function handleCheatLetterClick(letter) {
    setCheatSequence((current) => {
      const next = `${current}${letter}`.slice(-3);
      if (next === "POW") {
        setCheatModeActive((active) => !active);
        return "";
      }
      return "POW".startsWith(next) ? next : letter === "P" ? "P" : "";
    });
  }

  function clearAllData() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.localStorage.removeItem(PLAYER_NAME_STORAGE_KEY);
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    window.localStorage.removeItem(TESTING_SCORE_STORAGE_KEY);
    window.localStorage.removeItem(TESTING_UNLOCK_STORAGE_KEY);
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
    setTimeLeft(ROUND_TIME);
    setPendingTestingExitConfirm(false);
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
    if ((storedProfile.ownedItems || []).includes(itemId) && item.category !== "upgrades") {
      toggleEquipItem(itemId);
      return;
    }
    if (!cheatModeActive && (storedProfile.coins || 0) < item.cost) return;

    const alreadyOwned = (storedProfile.ownedItems || []).includes(itemId);
    const nextProfile = {
      ...storedProfile,
      coins: cheatModeActive ? storedProfile.coins : storedProfile.coins - item.cost,
      ownedItems: alreadyOwned ? (storedProfile.ownedItems || []) : [...(storedProfile.ownedItems || []), itemId],
      equippedItems: storedProfile.equippedItems || [],
    };

    saveProfileState(nextProfile);

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
    if (selectedMode === "multiplayer" && !hasCompletedTesting) {
      return;
    }
    if (selectedMode === "testing") {
      startTestingMode();
      return;
    }
    if (selectedMode === "multiplayer") {
      setMode("multiplayer");
      setScreen("multiplayerSelect");
      return;
    }
    setMode(selectedMode);
    setMixedSelection({ addsubLevel: null, muldivLevel: null });
    setScreen("levels");
  }

  function startTestingMode() {
    setTestingCoinsEarned(0);
    const history = readUserHistory();
    setUserHistory(history);
    const initialTestingState = {
      phase: "addsub",
      startLevel: history.addsubLevel || "AdS3",
      currentLevel: history.addsubLevel || "AdS3",
      adsResolvedLevel: null,
      musResolvedLevel: null,
      lastScore: null,
    };
    setTestingState(initialTestingState);
    setMode("testing");
    startLevel(history.addsubLevel || "AdS3", { selectedMode: "testing", testing: initialTestingState });
  }

  function startMultiplayerLobby(selectedMultiplayerMode) {
    const history = readUserHistory();
    const raceLevel = getMultiplayerLevelFromMode(selectedMultiplayerMode, history);
    setMultiplayerState({
      selectedMode: selectedMultiplayerMode,
      raceLevel,
      waitTimeLeft: MULTIPLAYER_WAIT_SECONDS,
      opponents: buildFakeMultiplayerOpponents(),
      playerScore: 0,
      elapsedTime: 0,
      finished: false,
      winner: null,
      placement: null,
      placementNumber: null,
      placementBonus: 0,
      playerCoinsEarned: 0,
    });
    setScreen("multiplayerWaiting");
  }

  function startMultiplayerRace() {
    setMultiplayerState((current) => {
      if (!current) return current;
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
    setLevel(selectedLevel);
    setQuestions(buildRound(activeMode === "testing" ? activeTestingState?.phase || "addsub" : activeMode, selectedLevel));
    setCurrentIndex(0);
    setTimeLeft(ROUND_TIME);
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
    awardCoinsForRound(finalResults, { testingModeActive: mode === "testing", activeMode: mode === "testing" ? testingState?.phase || "addsub" : mode });

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

  function handleTestingRoundComplete(finalResults) {
    const finalScore = finalResults.filter((r) => r.correct).length;
    const phase = testingState?.phase || "addsub";
    const currentTestingLevel = testingState?.currentLevel || level;

    if (finalScore >= TESTING_PASS_SCORE) {
      const higherLevel = getNextLevel(phase, currentTestingLevel);
      if (higherLevel) {
        const nextTestingState = {
          ...testingState,
          currentLevel: higherLevel,
          lastScore: finalScore,
        };
        setTestingState(nextTestingState);
        startLevel(higherLevel, { selectedMode: "testing", testing: nextTestingState });
        return;
      }

      if (phase === "addsub") {
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
        };
        setTestingState(nextTestingState);
        startLevel(nextTestingState.currentLevel, { selectedMode: "testing", testing: nextTestingState });
        return;
      }

      updateStoredLevels({ muldivLevel: currentTestingLevel });
      updateTestingScores({ muldivScore: finalScore });
      writeTestingUnlock(true);
      setHasCompletedTesting(true);
      setTestingState((prev) => ({ ...prev, musResolvedLevel: currentTestingLevel, lastScore: finalScore }));
      setScreen("testingComplete");
      return;
    }

    if (finalScore >= TESTING_HOLD_MIN && finalScore <= TESTING_HOLD_MAX) {
      if (phase === "addsub") {
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
        };
        setTestingState(nextTestingState);
        startLevel(nextTestingState.currentLevel, { selectedMode: "testing", testing: nextTestingState });
        return;
      }

      updateStoredLevels({ muldivLevel: currentTestingLevel });
      updateTestingScores({ muldivScore: finalScore });
      writeTestingUnlock(true);
      setHasCompletedTesting(true);
      setTestingState((prev) => ({ ...prev, musResolvedLevel: currentTestingLevel, lastScore: finalScore }));
      setScreen("testingComplete");
      return;
    }

    const lowerLevel = getPreviousLevel(phase, currentTestingLevel);
    if (lowerLevel) {
      const nextTestingState = {
        ...testingState,
        currentLevel: lowerLevel,
        lastScore: finalScore,
      };
      setTestingState(nextTestingState);
      startLevel(lowerLevel, { selectedMode: "testing", testing: nextTestingState });
      return;
    }

    if (phase === "addsub") {
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
      };
      setTestingState(nextTestingState);
      startLevel(nextTestingState.currentLevel, { selectedMode: "testing", testing: nextTestingState });
      return;
    }

    updateStoredLevels({ muldivLevel: currentTestingLevel });
      updateTestingScores({ muldivScore: finalScore });
      writeTestingUnlock(true);
      setHasCompletedTesting(true);
      setTestingState((prev) => ({ ...prev, musResolvedLevel: currentTestingLevel, lastScore: finalScore }));
      setScreen("testingComplete");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!currentQuestion || feedback) return;

    if (screen === "multiplayerGame") {
      handleMultiplayerSubmit();
      return;
    }

    const cleaned = answer.trim();
    const isCorrect = answersMatch(cleaned, currentQuestion.answer);

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
      if (nextIndex >= QUESTIONS_PER_ROUND) {
        finishRound(newResults);
      } else {
        setCurrentIndex(nextIndex);
      }
    }, 450);
  }

  function handleMultiplayerSubmit() {
    const cleaned = answer.trim();
    const isCorrect = answersMatch(cleaned, currentQuestion.answer);
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedback(null);
      setAnswer("");
      setMultiplayerState((current) => {
        if (!current || current.finished) return current;
        const nextPlayerScore = isCorrect ? current.playerScore + 1 : current.playerScore;
        const liveCoins = 0;
        if (nextPlayerScore >= MULTIPLAYER_TARGET_SCORE) {
          const higherBots = current.opponents.filter((opponent) => opponent.progress > nextPlayerScore).length;
          const placementNumber = higherBots + 1;
          const placement = placementNumber === 1 ? "win" : placementNumber === 2 ? "second" : placementNumber === 3 ? "third" : "finish";
          const placementBonus = MULTIPLAYER_PLACEMENT_COINS[placementNumber] || 5;
          const totalCoins = placementBonus;
          const storedProfile = readProfileState();
          saveProfileState({ ...storedProfile, coins: (storedProfile.coins || 0) + totalCoins });
          return {
            ...current,
            playerScore: nextPlayerScore,
            finished: true,
            winner: playerName?.trim() || "You",
            placement,
            placementNumber,
            placementBonus,
            playerCoinsEarned: totalCoins,
          };
        }
        return { ...current, playerScore: nextPlayerScore, playerCoinsEarned: liveCoins };
      });
      setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
    }, 300);
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
    setPendingTestingExitConfirm(true);
  }

  function cancelTestingExit() {
    setPendingTestingExitConfirm(false);
  }

  async function copyResultsToClipboard() {
    const addScoreText = testingScores.addsubScore !== null ? `${testingScores.addsubScore}/15` : "__/15";
    const mulScoreText = testingScores.muldivScore !== null ? `${testingScores.muldivScore}/15` : "__/15";
    const resultsText = `${userHistory.addsubLevel}   ${addScoreText}, ${userHistory.muldivLevel}   ${mulScoreText}`;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resultsText);
        setCopyStatus("Copied");
        window.setTimeout(() => setCopyStatus(""), 1800);
        return;
      }
    } catch {}

    try {
      if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = resultsText;
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
        window.prompt("Copy these results:", resultsText);
        setCopyStatus("Use Ctrl+C");
        window.setTimeout(() => setCopyStatus(""), 2200);
        return;
      }
    } catch {}

    setCopyStatus(resultsText);
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
    setGeneratedSaveCode(nextCode);
    setSaveCodeInput(nextCode);
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
    setTestingCoinsEarned(0);
    setMultiplayerState(null);
    setScreen("home");
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
    setTimeLeft(ROUND_TIME);
    setPendingTestingExitConfirm(false);
  }

  const incorrectItems = results.filter((r) => !r.correct);
  const activeCoinMultiplier = getActiveCoinMultiplier(profileState);
  const equippedEmojiItem = PROFILE_SHOP_ITEMS.find((item) => profileState.equippedItems?.includes(item.id) && item.category === "emoji");
  const equippedBackgroundItem = PROFILE_SHOP_ITEMS.find((item) => profileState.equippedItems?.includes(item.id) && item.category === "background");
  const equippedRingItem = PROFILE_SHOP_ITEMS.find((item) => profileState.equippedItems?.includes(item.id) && item.category === "ring");
  const premiumRingOverlay = getPremiumRingOverlayClass(equippedRingItem?.id);
  const currentTheme = SITE_THEMES[themeId] || SITE_THEMES.blue;
  const activeCoinBoost = (profileState.activeBoosts || []).filter((boost) => boost.type === "coinMultiplier2x" && boost.expiresAt > boostCountdownNow).sort((a, b) => a.expiresAt - b.expiresAt)[0] || null;
  const passed = score >= PASS_SCORE;
  const effectiveModeForProgression = mode === "testing" ? testingState?.phase : mode;
  const next = effectiveModeForProgression && level ? getNextLevel(effectiveModeForProgression, level) : null;

  return (
    <div className={`min-h-screen ${currentTheme.page} text-white p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Progressions
              <span className="ml-2 inline-flex items-center gap-0.5">
                <button type="button" onClick={() => handleCheatLetterClick("P")} className="inline text-inherit hover:text-white focus:outline-none">P</button>
                <button type="button" onClick={() => handleCheatLetterClick("O")} className="inline text-inherit hover:text-white focus:outline-none">o</button>
                <button type="button" onClick={() => handleCheatLetterClick("W")} className="inline text-inherit hover:text-white focus:outline-none">w</button>
                <span>er-Up</span>
              </span>
            </h1>
            <p className="text-white/85 mt-2 text-sm md:text-base">
              A fast-paced NSW progressions mental maths challenge.
            </p>
            {cheatModeActive && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" onClick={clearAllData} variant="outline" className="rounded-2xl border-red-300/30 bg-red-400/10 text-red-100 hover:bg-red-400/20">
                  Clear all data
                </Button>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
            <Calculator className="w-5 h-5" />
            <span className="text-sm">15 questions • 2 minutes • Level up at 14/15</span>
          </div>
        </div>

        {(cheatModeActive || activeCoinBoost) && (
          <div className="mb-4 flex flex-wrap gap-3">
            {cheatModeActive && (
              <div className="inline-flex items-center rounded-2xl border border-amber-300/30 bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-100">
                Unlimited coins active
              </div>
            )}
            {activeCoinBoost && (
              <div className="inline-flex items-center rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100">
                Double coins boost: {formatDuration(activeCoinBoost.expiresAt - boostCountdownNow)} left
              </div>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="grid gap-5">
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <CardContent className="p-5 md:p-6">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="text-blue-100/70 text-xs uppercase tracking-[0.25em] mb-2">Profile</div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]">
                                {playerName?.trim() ? playerName : "Player"}
                              </h2>
                              {!isEditingPlayerName && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={beginEditingPlayerName}
                                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 text-blue-50"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="rounded-full bg-amber-400/20 border border-amber-200/20 px-3 py-1 text-sm font-bold text-amber-100">
                            {cheatModeActive ? "∞ coins" : `${profileState.coins} coins`}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            {premiumRingOverlay && (
                              <div className={`absolute -inset-2 rounded-full opacity-95 ${premiumRingOverlay} blur-[1px]`} />
                            )}
                            <div className={`relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center border border-white/15 shrink-0 overflow-hidden ${equippedBackgroundItem?.style || "bg-slate-900/70"} ${equippedRingItem?.style || ""}`}>
                              {equippedEmojiItem ? (
                                <div className="text-6xl md:text-7xl drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]">{equippedEmojiItem.emoji}</div>
                              ) : (
                                <UserCircle2 className="w-20 h-20 md:w-24 md:h-24 text-blue-100/85" />
                              )}
                              {premiumRingOverlay && <div className="absolute inset-[6px] rounded-full border border-white/20 pointer-events-none" />}
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="text-sm text-white/90">Start with a blank silhouette, then unlock profile upgrades in the shop.</div>
                            {isEditingPlayerName && (
                              <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.2em] text-white/80">Player name</label>
                                <div className="flex items-center gap-2">
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
                                    className="h-11 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/40"
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    onClick={savePlayerName}
                                    className="w-11 h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white shrink-0"
                                  >
                                    <Check className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            {profileState.equippedItems.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {profileState.equippedItems.map((id) => {
                                  const item = PROFILE_SHOP_ITEMS.find((entry) => entry.id === id);
                                  return item ? <Badge key={id} className="bg-cyan-400/20 text-cyan-50 border-none">{item.name}</Badge> : null;
                                })}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2 text-xs text-white/80">
                              {activeCoinMultiplier > 1 && <Badge className="bg-emerald-400/15 text-emerald-100 border-none">2x coin boost active</Badge>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button onClick={() => setShowInfo((open) => !open)} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">
                                {showInfo ? "Hide Info" : "Info"}
                              </Button>
                              <Button onClick={() => setShopOpen((open) => !open)} className={`rounded-2xl ${currentTheme.primaryButton} text-white`}>
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                {shopOpen ? "Close Shop" : "Open Shop"}
                              </Button>
                              <Button onClick={() => setPurchasedItemsOpen((open) => !open)} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">
                                {purchasedItemsOpen ? "Hide Purchased" : "Purchased Items"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-950/75 border border-white/15 shadow-[0_12px_30px_rgba(15,23,42,0.35)] p-5 space-y-4">
                        <div>
                          <div className="text-white/75 text-xs uppercase tracking-[0.22em] mb-2">User's current level</div>
                          <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-[0_3px_14px_rgba(255,255,255,0.18)]">Saved placement</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-slate-800/95 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] px-4 py-4 min-w-0">
                            <div className="text-[10px] md:text-[11px] text-white/78 mb-2 uppercase tracking-[0.08em] whitespace-nowrap">Addition and Subtraction</div>
                            <div className="text-3xl md:text-4xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.12)]">{userHistory.addsubLevel}</div>
                            <div className="text-sm font-semibold text-cyan-100/90 mt-2">{testingScores.addsubScore !== null ? `${testingScores.addsubScore}/15` : "No test yet"}</div>
                          </div>
                          <div className="rounded-2xl bg-slate-800/95 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] px-4 py-4 min-w-0">
                            <div className="text-[10px] md:text-[11px] text-white/78 mb-2 uppercase tracking-[0.08em] whitespace-nowrap">Multiplication and Division</div>
                            <div className="text-3xl md:text-4xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.12)]">{userHistory.muldivLevel}</div>
                            <div className="text-sm font-semibold text-cyan-100/90 mt-2">{testingScores.muldivScore !== null ? `${testingScores.muldivScore}/15` : "No test yet"}</div>
                          </div>
                        </div>
                        <div className="grid gap-3 pt-1">
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              <Button type="button" onClick={copyResultsToClipboard} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 px-2 text-xs md:text-sm whitespace-nowrap">
                                Copy Results
                              </Button>
                              <Button type="button" onClick={generateSavePassword} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 px-2 text-xs md:text-sm whitespace-nowrap">
                                Generate Password
                              </Button>
                              <Button type="button" onClick={() => setShowPasswordEntry((open) => !open)} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 px-2 text-xs md:text-sm whitespace-nowrap">
                                {showPasswordEntry ? "Hide Password" : "Enter Password"}
                              </Button>
                            </div>
                            <div className="text-xs text-white/70">
                              Copy results to send to your Class Teams. Use the password to transfer progress between computers.
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              {copyStatus && <span className="text-sm text-emerald-200 font-semibold">{copyStatus}</span>}
                              {saveCodeStatus && <span className="text-sm text-cyan-200 font-semibold">{saveCodeStatus}</span>}
                            </div>
                          </div>

                          {generatedSaveCode && (
                            <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-4 py-3 space-y-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">Save password</div>
                                <Button type="button" size="sm" onClick={copySavePasswordToClipboard} variant="outline" className="h-8 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10">
                                  Copy
                                </Button>
                              </div>
                              <div className="text-sm md:text-base font-mono break-all text-white">{generatedSaveCode}</div>
                              <div className="text-xs text-white/70">Generate this code, then save it somewhere safe to use on a different computer later.</div>
                            </div>
                          )}

                          {showPasswordEntry && (
                            <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-4 py-3 space-y-3">
                              <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">Load save password</div>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                  value={saveCodeInput}
                                  onChange={(e) => setSaveCodeInput(e.target.value)}
                                  placeholder="Paste save password"
                                  className="h-11 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/40"
                                />
                                <Button type="button" onClick={loadSavePassword} className={`rounded-2xl ${currentTheme.primaryButton} text-white`}>
                                  Load
                                </Button>
                              </div>
                              <div className="text-xs text-white/70">Paste a saved password from another computer to transfer progress into this device.</div>
                            </div>
                          )}
                        </div>
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {purchasedItemsOpen && (
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <CardContent className="p-5 md:p-6 space-y-4">
                    <div>
                      <div className="text-blue-100/70 text-xs uppercase tracking-[0.25em] mb-2">Purchased items</div>
                      <h2 className="text-xl md:text-2xl font-bold">Your collection</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {SHOP_CATEGORIES.map((category) => {
                        const ownedItems = PROFILE_SHOP_ITEMS.filter(
                          (item) => item.category === category.id && (profileState.ownedItems || []).includes(item.id)
                        );
                        const CategoryIcon = category.icon;
                        return (
                          <div key={category.id} className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4 text-cyan-100" />
                              <div className="text-sm font-bold text-white">{category.label}</div>
                              <Badge className="bg-white/10 text-blue-100 border-none ml-auto">{ownedItems.length}</Badge>
                            </div>
                            {ownedItems.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {ownedItems.map((item) => {
                                  const isEquipped = (profileState.equippedItems || []).includes(item.id);
                                  const isActiveTheme = item.themeId && themeId === item.themeId;
                                  const isActive = isEquipped || isActiveTheme;
                                  return (
                                    <Button
                                      key={item.id}
                                      type="button"
                                      size="sm"
                                      onClick={() => {
                                        if (item.themeId) {
                                          activateUpgrade(item);
                                        } else if (item.category !== "upgrades") {
                                          toggleEquipItem(item.id);
                                        }
                                      }}
                                      className={`h-auto min-h-8 px-3 py-1.5 rounded-full text-xs font-medium border ${isActive ? "bg-emerald-400/20 text-emerald-50 border-emerald-300/30 hover:bg-emerald-400/30" : "bg-white/10 text-blue-100 border-white/10 hover:bg-white/15"}`}
                                    >
                                      {item.emoji ? `${item.emoji} ` : ""}
                                      {item.name}
                                    </Button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-sm text-blue-100/55">No items purchased yet.</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                                {Array.isArray(item.entries) ? (
                                  item.entries.map((entry, index) => (
                                    <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1">
                                      <div className="text-white text-sm font-semibold">{entry.type}</div>
                                      <div className="text-white/80 text-sm"><span className="font-semibold">Example:</span> {entry.example}</div>
                                      <div className="text-emerald-100 text-sm"><span className="font-semibold">Best strategy:</span> {entry.strategy}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1">
                                    <div className="text-white/90 text-sm"><span className="font-semibold">Question types:</span> {Array.isArray(item.types) ? item.types.join(" • ") : item.types || "Not listed"}</div>
                                    <div className="text-white/80 text-sm"><span className="font-semibold">Examples:</span> {Array.isArray(item.examples) ? item.examples.join(" • ") : item.examples || "Not listed"}</div>
                                    <div className="text-emerald-100 text-sm"><span className="font-semibold">Best strategy:</span> {item.strategy || "Use the level strategy notes."}</div>
                                  </div>
                                )}
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
                                {Array.isArray(item.entries) ? (
                                  item.entries.map((entry, index) => (
                                    <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1">
                                      <div className="text-white text-sm font-semibold">{entry.type}</div>
                                      <div className="text-white/80 text-sm"><span className="font-semibold">Example:</span> {entry.example}</div>
                                      <div className="text-emerald-100 text-sm"><span className="font-semibold">Best strategy:</span> {entry.strategy}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1">
                                    <div className="text-white/90 text-sm"><span className="font-semibold">Question types:</span> {Array.isArray(item.types) ? item.types.join(" • ") : item.types || "Not listed"}</div>
                                    <div className="text-white/80 text-sm"><span className="font-semibold">Examples:</span> {Array.isArray(item.examples) ? item.examples.join(" • ") : item.examples || "Not listed"}</div>
                                    <div className="text-emerald-100 text-sm"><span className="font-semibold">Best strategy:</span> {item.strategy || "Use the level strategy notes."}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {shopOpen && (
                <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                  <CardContent className="p-5 md:p-6 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-blue-100/70 text-xs uppercase tracking-[0.25em] mb-2">Shop</div>
                        <h3 className="text-2xl font-bold">Profile upgrades</h3>
                      </div>
                      <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-4 py-2 text-sm text-white font-semibold">
                        Balance: {cheatModeActive ? "∞ coins" : `${profileState.coins} coins`}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {SHOP_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const items = PROFILE_SHOP_ITEMS.filter((item) => item.category === category.id);
                        return (
                          <div key={category.id} className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                                <Icon className="w-6 h-6 text-cyan-100" />
                              </div>
                              <div>
                                <div className="text-lg font-bold text-white">{category.label}</div>
                                <div className="text-xs text-white/70 uppercase tracking-[0.2em]">{items.length} items</div>
                              </div>
                            </div>
                            <div className="space-y-2 max-h-[430px] overflow-auto pr-1">
                              {items.map((item) => {
                                const owned = (profileState.ownedItems || []).includes(item.id);
                                const equipped = (profileState.equippedItems || []).includes(item.id);
                                const canAfford = cheatModeActive || (profileState.coins || 0) >= item.cost;
                                const isUpgrade = item.category === "upgrades";
                                return (
                                  <div key={item.id} className="rounded-2xl bg-slate-950/60 border border-white/5 px-3 py-3 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          {item.emoji && <span className="text-xl">{item.emoji}</span>}
                                          <span className="text-sm text-white font-semibold truncate">{item.name}</span>
                                        </div>
                                        {item.detail && <div className="text-xs text-white/80 mt-1">{item.detail}</div>}
                                        {item.themeId && <div className="text-[11px] text-emerald-200 mt-1">Permanent theme</div>}
                                      </div>
                                      <span className="text-xs text-amber-100 shrink-0">{item.cost}</span>
                                    </div>

                                    {item.category === "background" && (
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full border border-white/10 ${item.style}`} />
                                        <div className="text-[11px] uppercase tracking-[0.12em] text-white/70">Preview</div>
                                      </div>
                                    )}

                                    {item.category === "ring" && (
                                      <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10">
                                          {isPremiumRing(item.id) && (
                                            <div className={`absolute -inset-1 rounded-full ${getPremiumRingOverlayClass(item.id)} blur-[1px] opacity-95`} />
                                          )}
                                          <div className={`absolute inset-1 rounded-full bg-slate-900 ${item.style}`} />
                                        </div>
                                        <div className="text-[11px] uppercase tracking-[0.12em] text-white/70">Preview</div>
                                      </div>
                                    )}

                                    <Button
                                      onClick={() => (owned && !isUpgrade ? toggleEquipItem(item.id) : buyProfileItem(item.id))}
                                      disabled={!owned && !canAfford}
                                      className={`w-full rounded-2xl ${equipped ? "bg-emerald-500 hover:bg-emerald-400" : owned && !isUpgrade ? "bg-blue-500 hover:bg-blue-400" : "bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-300"}`}
                                    >
                                      {item.themeId ? (themeId === item.themeId ? "Active theme" : owned ? "Apply theme" : "Buy theme") : isUpgrade ? "Buy & activate" : equipped ? "Equipped" : owned ? "Equip" : "Buy"}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-5">
                <div className="grid md:grid-cols-3 gap-5">
                  {(["addsub", "muldiv", "mixed"]).map((key) => {
                    const item = modeMeta[key];
                    const practiceLocked = !hasCompletedTesting;
                    return (
                      <Card key={key} className={`bg-white/10 border-white/10 rounded-3xl shadow-2xl ${practiceLocked ? "opacity-55" : ""}`}>
                        <CardContent className="p-6 flex flex-col gap-4 h-full">
                          <div className="flex items-start justify-between gap-3">
                            <Badge className={`w-fit shrink-0 ${currentTheme.accentBadge} border-none`}>Game Mode</Badge>
                            <div className="text-right text-[11px] md:text-sm font-semibold leading-tight whitespace-nowrap ml-auto">
                              {key === "addsub" && <span className="text-emerald-200">🪙 +1 per ✓ • Bonuses on 14+</span>}
                              {key === "muldiv" && <span className="text-emerald-200">🪙 +1 per ✓ • Bonuses on 14+</span>}
                              {key === "mixed" && <span className="text-cyan-200">🪙 +1.5 per ✓ • Bonuses on 14+</span>}
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                          <div className="text-white/85 min-h-[92px] space-y-2">
                            <p>{item.description}</p>
                            {practiceLocked && <p className="text-amber-200 font-semibold">Complete Testing Mode first to unlock practice modes.</p>}
                          </div>
                          <Button
                            onClick={() => startMode(key)}
                            disabled={practiceLocked}
                            className={`rounded-2xl text-base py-6 ${currentTheme.primaryButton} text-white mt-auto disabled:bg-slate-700 disabled:text-slate-300`}
                          >
                            {`Choose ${item.title}`}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {(["testing", "multiplayer"]).map((key) => {
                    const item = modeMeta[key];
                    return (
                      <Card key={key} className={`bg-white/10 border-white/10 rounded-3xl shadow-2xl ${key === "multiplayer" && !hasCompletedTesting ? "opacity-55" : ""}`}>
                        <CardContent className="p-6 flex flex-col gap-4 h-full">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <Badge className={`w-fit ${currentTheme.accentBadge} border-none`}>{key === "testing" ? "Adaptive" : "Race Mode"}</Badge>
                            <div className="text-right text-xs md:text-sm font-semibold">
                              {key === "testing" && <span className="text-emerald-200">🪙 Double coins</span>}
                              {key === "multiplayer" && <span className="text-cyan-200">🪙 1st 30 • 2nd 20 • 3rd 10 • 4th 5</span>}
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-white">{key === "multiplayer" ? "Race Mode" : item.title}</h2>
                          <div className="text-white/85 min-h-[92px] space-y-2">
                            <p>{item.description}</p>
                            {key === "multiplayer" && <p className="text-cyan-200 font-semibold">Race Mode unlocks after Testing Mode is completed.</p>}
                            {key === "multiplayer" && !hasCompletedTesting && <p className="text-amber-200 font-semibold">Complete Testing Mode first to unlock Race Mode.</p>}
                            {key === "testing" && <p className="text-blue-100/70">Completing Testing Mode unlocks practice modes and Race Mode.</p>}
                          </div>
                          <Button
                            onClick={() => startMode(key)}
                            className={`rounded-2xl text-base py-6 ${currentTheme.primaryButton} text-white mt-auto`}
                          >
                            {key === "testing" ? "Start Testing" : "Enter Race Mode"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {screen === "levels" && (
            <motion.div
              key="levels"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">Select a progression level</h2>
                      <p className="text-blue-100/80 mt-2">
                        {modeMeta[mode]?.title} • Students answer 15 questions against the clock.
                      </p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">
                      Back
                    </Button>
                  </div>

                  {mode === "mixed" ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-5">
                        <div className="text-blue-100/70 text-xs uppercase tracking-[0.25em] mb-2">Step 1</div>
                        <h3 className="text-xl font-bold mb-4">Choose an AdS level</h3>
                        <p className="text-sm text-blue-100/70 mb-4">Your current AdS level is highlighted. Matching it gives double coins.</p>
                        <div className="grid grid-cols-2 gap-3">
                          {progressionOrder.addsub.map((lvl) => {
                            const isCurrent = lvl === userHistory.addsubLevel;
                            const isSelected = mixedSelection.addsubLevel === lvl;
                            return (
                              <Button
                                key={lvl}
                                onClick={() => startMixedLevelSelection("addsubLevel", lvl)}
                                className={`h-14 rounded-2xl text-base font-bold ${isSelected ? "bg-cyan-500 hover:bg-cyan-400" : isCurrent ? "bg-slate-800 hover:bg-slate-700 ring-2 ring-emerald-300/80 border border-emerald-300/70" : "bg-slate-800 hover:bg-slate-700"}`}
                              >
                                <div className="flex flex-col items-center leading-tight">
                                <span>{lvl}</span>
                                {isCurrent && <span className="mt-1 text-[10px] uppercase tracking-[0.08em] text-emerald-100">Double coins</span>}
                              </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-5">
                        <div className="text-blue-100/70 text-xs uppercase tracking-[0.25em] mb-2">Step 2</div>
                        <h3 className="text-xl font-bold mb-4">Choose a MuS level</h3>
                        <p className="text-sm text-blue-100/70 mb-4">Your current MuS level is highlighted. Matching it gives double coins.</p>
                        <div className="grid grid-cols-2 gap-3">
                          {progressionOrder.muldiv.map((lvl) => {
                            const isCurrent = lvl === userHistory.muldivLevel;
                            const isSelected = mixedSelection.muldivLevel === lvl;
                            return (
                              <Button
                                key={lvl}
                                onClick={() => startMixedLevelSelection("muldivLevel", lvl)}
                                className={`h-14 rounded-2xl text-base font-bold ${isSelected ? "bg-cyan-500 hover:bg-cyan-400" : isCurrent ? "bg-slate-800 hover:bg-slate-700 ring-2 ring-emerald-300/80 border border-emerald-300/70" : "bg-slate-800 hover:bg-slate-700"}`}
                              >
                                <div className="flex flex-col items-center leading-tight">
                                <span>{lvl}</span>
                                {isCurrent && <span className="mt-1 text-[10px] uppercase tracking-[0.08em] text-emerald-100">Double coins</span>}
                              </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="md:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-blue-100/80">
                          Current mixed setup: <span className="font-bold text-white">{mixedSelection.addsubLevel || "Choose AdS"}</span> + <span className="font-bold text-white">{mixedSelection.muldivLevel || "Choose MuS"}</span>
                          <span className="block mt-2 text-emerald-200 font-semibold">Pick both highlighted current levels to get double coins.</span>
                        </div>
                        {mixedSelection.addsubLevel && mixedSelection.muldivLevel && (
                          <Button onClick={() => startLevel(mixedSelection, { selectedMode: "mixed" })} className={`rounded-2xl ${currentTheme.primaryButton} text-white font-bold`}>
                            Start Mixed Round
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {progressionOrder[mode]?.map((lvl) => {
                        const currentLevel = mode === "addsub" ? userHistory.addsubLevel : userHistory.muldivLevel;
                        const isCurrent = lvl === currentLevel;
                        return (
                          <Button
                            key={lvl}
                            onClick={() => startLevel(lvl)}
                            className={`h-16 rounded-2xl text-lg font-bold ${isCurrent ? "bg-slate-800 hover:bg-slate-700 ring-2 ring-emerald-300/80 border border-emerald-300/70" : "bg-slate-800 hover:bg-slate-700"}`}
                          >
                            <div className="flex flex-col items-center justify-center leading-tight">
                            <span>{lvl}</span>
                            {isCurrent && <span className="mt-1 text-[10px] uppercase tracking-[0.08em] text-emerald-100">Double coins</span>}
                          </div>
                          </Button>
                        );
                      })}
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
                      <h2 className="text-2xl md:text-3xl font-bold">Choose your multiplayer race</h2>
                      <p className="text-blue-100/80 mt-2">This uses your saved AdS or MuS level and matches you into a 4-player room.</p>
                    </div>
                    <Button variant="outline" onClick={backToHome} className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Back</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { key: "addsub", title: "Addition / Subtraction", detail: `Uses ${userHistory.addsubLevel}` },
                      { key: "muldiv", title: "Multiplication / Division", detail: `Uses ${userHistory.muldivLevel}` },
                      { key: "mixed", title: "Mixed", detail: "Uses your current saved level mix" },
                    ].map((item) => (
                      <Card key={item.key} className="bg-slate-900/60 border-white/10 rounded-3xl">
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-cyan-100" />
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          </div>
                          <p className="text-blue-100/75">{item.detail}</p>
                          <Button onClick={() => startMultiplayerLobby(item.key)} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white">Join Room</Button>
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
                <CardContent className="p-8 md:p-10 text-center space-y-6">
                  <Users className="w-16 h-16 mx-auto text-cyan-200" />
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black">Waiting for players...</h2>
                    <p className="text-blue-100/80 mt-2">
                      Room found. {multiplayerState.selectedMode === "addsub"
                        ? "Addition / Subtraction"
                        : multiplayerState.selectedMode === "muldiv"
                        ? "Multiplication / Division"
                        : "Mixed"}{" "}•{" "}
                      {typeof multiplayerState.raceLevel === "object"
                        ? `${multiplayerState.raceLevel.addsubLevel} + ${multiplayerState.raceLevel.muldivLevel}`
                        : multiplayerState.raceLevel}
                    </p>
                  </div>
                  <div className="text-5xl font-black text-cyan-100">{multiplayerState.waitTimeLeft}s</div>
                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                      { name: playerName?.trim() || "You", icon: "🙂", joined: true, isSelf: true },
                      ...multiplayerState.opponents.map((opponent) => ({
                        name: opponent.name,
                        icon: opponent.icon,
                        joined: opponent.joined,
                        isSelf: false,
                      })),
                    ].map((player, index) => (
                      <motion.div
                        key={`${player.isSelf ? "self" : player.name}-${index}`}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`rounded-3xl border p-4 ${player.joined ? "bg-slate-900/60 border-white/10" : "bg-slate-900/30 border-white/5"}`}
                      >
                        {player.joined ? (
                          <motion.div
                            initial={{ opacity: 0.2, scale: 0.92 }}
                            animate={{ opacity: [0.5, 1, 1], scale: [0.92, 1.04, 1] }}
                            transition={{ duration: 0.45 }}
                          >
                            <div className="text-4xl mb-2">{player.icon}</div>
                            <div className="font-bold text-white">{player.name}</div>
                            <div className={`text-xs mt-1 ${player.isSelf ? "text-emerald-200" : "text-cyan-200 font-semibold"}`}>
                              {player.isSelf ? "Joined room" : `${player.name} joined`}
                            </div>
                          </motion.div>
                        ) : (
                          <div className="py-4">
                            <div className="h-10 w-10 rounded-full bg-white/10 mx-auto mb-3" />
                            <div className="h-4 w-24 rounded-full bg-white/10 mx-auto mb-2" />
                            <div className="text-xs text-blue-100/45">Searching...</div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "multiplayerGame" && currentQuestion && multiplayerState && (
            <motion.div key="multiplayerGame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-5 md:p-6 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-cyan-500/20 text-cyan-50 border-none">Multiplayer Race</Badge>
                    <Badge className="bg-purple-500/20 text-purple-50 border-none">{multiplayerState.selectedMode === "addsub" ? "Addition / Subtraction" : multiplayerState.selectedMode === "muldiv" ? "Multiplication / Division" : "Mixed"}</Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-50 border-none">First to 30 correct</Badge>
                    <Badge className="bg-white/10 text-white border-none">
                      {typeof multiplayerState.raceLevel === "object"
                        ? `${multiplayerState.raceLevel.addsubLevel} + ${multiplayerState.raceLevel.muldivLevel}`
                        : `Level ${multiplayerState.raceLevel}`}
                    </Badge>
                  </div>

                  <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-5 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl md:text-2xl font-bold">Race Track</h3>
                      <div className="text-sm text-blue-100/70">{multiplayerState.elapsedTime}s elapsed</div>
                    </div>
                    {[{ id: "player", name: playerName?.trim() || "You", icon: "🙂", progress: multiplayerState.playerScore, isPlayer: true, burst: feedback === "correct" }, ...multiplayerState.opponents].map((runner) => {
                      const progress = Math.min(100, (runner.progress / MULTIPLAYER_TARGET_SCORE) * 100);
                      return (
                        <div key={runner.id || runner.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{runner.icon}</span>
                              <span className={`font-bold ${runner.isPlayer ? "text-white" : "text-blue-100/80"}`}>{runner.name}</span>
                            </div>
                            <span className="text-blue-100/75">{runner.progress} / {MULTIPLAYER_TARGET_SCORE}</span>
                          </div>
                          <div className={`relative h-10 rounded-full ${currentTheme.trackLane} border overflow-hidden`}>
                            <div className={`absolute inset-y-0 left-0 right-0 ${currentTheme.trackStripe} bg-[length:32px_100%]`} />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.22em] text-white/45">Start</div>
                            <div className={`absolute right-0 top-0 h-full w-24 bg-gradient-to-l ${currentTheme.trackFinish}`} />
                            <motion.div className="absolute top-1/2 -translate-y-1/2 text-2xl" animate={{ left: `calc(${progress}% - 14px)` }} transition={{ type: "tween", duration: 0.35 }}>
                              {runner.icon}
                            </motion.div>
                            {runner.burst && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: [0, 1, 0], scale: [0.7, 1.15, 1.3] }}
                                transition={{ duration: 0.45 }}
                                className="absolute top-1/2 -translate-y-1/2 text-xs font-black text-emerald-200"
                                style={{ left: `calc(${progress}% + 8px)` }}
                              >
                                +1
                              </motion.div>
                            )}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-100">FINISH</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="bg-white/5 border-white/10 rounded-3xl md:col-span-3">
                      <CardContent className="p-5 md:p-6 space-y-5">
                        <div className={`rounded-3xl p-8 md:p-12 text-center transition-all duration-200 border ${feedback === "correct" ? "bg-emerald-500/20 ring-2 ring-emerald-400 border-emerald-200/30" : feedback === "incorrect" ? "bg-red-500/20 ring-2 ring-red-400 border-red-200/30" : "bg-slate-950/90 border-blue-200/20"}`}>
                          <div className="text-sm uppercase tracking-[0.3em] text-blue-100/80 mb-4">Multiplayer Question</div>
                          <div className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.18)]">{currentQuestion.prompt}</div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3 max-w-xl mx-auto">
                          <Input ref={inputRef} autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type answer" className="h-20 rounded-2xl !text-[3rem] md:!text-[3.5rem] leading-none font-black tracking-tight bg-white/12 border-white/20 text-white placeholder:text-white/40 text-center" autoComplete="off" />
                          <Button type="submit" className="w-full h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-base font-bold">Submit Answer</Button>
                        </form>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 rounded-3xl">
                      <CardContent className="p-5 md:p-6 space-y-4">
                        <div>
                          <div className="text-sm text-blue-100/70 mb-2">Your correct answers</div>
                          <div className="text-4xl font-black">{multiplayerState.playerScore}</div>
                        </div>
                        <div>
                          <div className="text-sm text-blue-100/70 mb-2">Race target</div>
                          <div className="text-2xl font-black">30</div>
                        </div>
                        <div className="rounded-2xl bg-slate-900/60 p-4 border border-white/10">
                          <div className="text-sm text-blue-100/75">Current place</div>
                          <div className="text-lg font-bold text-white mt-1">#{[multiplayerState.playerScore, ...multiplayerState.opponents.map((o) => o.progress)].sort((a, b) => b - a).indexOf(multiplayerState.playerScore) + 1}</div>
                        </div>
                        <div className="rounded-2xl bg-slate-900/60 p-4 border border-white/10">
                          <div className="text-sm text-blue-100/75">Race reward</div>
                          <div className="text-lg font-bold text-amber-100 mt-1">{MULTIPLAYER_PLACEMENT_COINS[[multiplayerState.playerScore, ...multiplayerState.opponents.map((o) => o.progress)].sort((a, b) => b - a).indexOf(multiplayerState.playerScore) + 1] || 5} coins</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "game" && currentQuestion && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-white/10 border-white/10 rounded-3xl md:col-span-3">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className="bg-blue-500/20 text-blue-50 border-none">{modeMeta[mode]?.title}</Badge>
                      <Badge className="bg-purple-500/20 text-purple-50 border-none">{typeof level === "object" ? `${level.addsubLevel} + ${level.muldivLevel}` : level}</Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-50 border-none">Question {currentIndex + 1} / {QUESTIONS_PER_ROUND}</Badge>
                      {isTestingMode && !pendingTestingExitConfirm && (
                        <Button type="button" onClick={requestTestingExit} variant="outline" className="ml-auto rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">
                          Back to Home
                        </Button>
                      )}
                    </div>

                    {isTestingMode && pendingTestingExitConfirm && (
                      <div className="mb-4 rounded-3xl border border-amber-300/25 bg-amber-400/10 p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-amber-100 font-semibold">Are you sure? You’re going to forfeit any coins earnt this round.</div>
                        <div className="flex gap-2">
                          <Button type="button" onClick={backToHome} className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-white">Yes, go home</Button>
                          <Button type="button" onClick={cancelTestingExit} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10">Keep playing</Button>
                        </div>
                      </div>
                    )}

                    <div className="mb-6 space-y-3">
                      <div className="flex items-center justify-between text-sm text-blue-100/80">
                        <span>Progress to level up</span>
                        <span>{results.length} / {QUESTIONS_PER_ROUND} answered</span>
                      </div>
                      <div className="relative h-5 rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${progressValue}%` }}
                        />
                        <div
                          className="absolute top-0 bottom-0 border-l-2 border-dashed border-yellow-300/90 z-10"
                          style={{ left: `${GOAL_PROGRESS_PERCENT}%` }}
                        />
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 z-20"
                          animate={{ left: `calc(${timerProgress}% - 10px)` }}
                          transition={{ type: "tween", duration: 0.25 }}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.6)] border-2 border-blue-950" />
                        </motion.div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-blue-100/70">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3.5 h-3.5 text-yellow-200" />
                          <span>Goal line: 14 correct</span>
                        </div>
                        <span className={paceDelta >= 0 ? "text-emerald-200" : "text-amber-200"}>
                          {paceDelta >= 0 ? "Ahead of pace" : "Behind pace"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`rounded-3xl p-8 md:p-12 text-center transition-all duration-200 border ${
                        feedback === "correct"
                          ? "bg-emerald-500/20 ring-2 ring-emerald-400 border-emerald-200/30"
                          : feedback === "incorrect"
                          ? "bg-red-500/20 ring-2 ring-red-400 border-red-200/30"
                          : "bg-slate-950/90 border-blue-200/20"
                      }`}
                    >
                      <div className="text-sm uppercase tracking-[0.3em] text-blue-100/80 mb-4">
                        {isTestingMode ? `Testing Mode • ${testingState?.phase === "muldiv" ? "Multiplication / Division" : "Addition / Subtraction"}` : "Mental Maths Challenge"}
                      </div>
                      <div className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.18)]">{currentQuestion.prompt}</div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3 max-w-xl mx-auto">
                      <Input
                        ref={inputRef}
                        autoFocus
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type answer"
                        className="h-20 rounded-2xl !text-[3rem] md:!text-[3.5rem] leading-none font-black tracking-tight bg-white/12 border-white/20 text-white placeholder:text-white/40 text-center"
                        autoComplete="off"
                      />
                      <Button type="submit" className={`w-full h-12 rounded-2xl ${currentTheme.primaryButton} text-base font-bold`}>
                        Submit
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/10 rounded-3xl">
                  <CardContent className="p-5 md:p-6 flex flex-col gap-5 h-full">
                    <div className="flex items-center gap-3 text-xl font-bold">
                      <TimerReset className="w-5 h-5" />
                      {timeLeft}s
                    </div>
                    <div>
                      <div className="text-sm text-blue-100/70 mb-2">Score so far</div>
                      <div className="text-4xl font-black">{score}</div>
                      {playerName?.trim() && <div className="text-sm text-blue-100/70 mt-2">Player: <span className="text-white font-semibold">{playerName}</span></div>}
                    </div>
                    <div className="rounded-2xl bg-slate-900/60 p-4 border border-white/10 space-y-2 mt-auto">
                      <div className="text-sm text-blue-100/75">Pacing check</div>
                      <div className={`text-lg font-bold ${paceDelta >= 0 ? "text-emerald-200" : "text-amber-200"}`}>
                        {paceDelta >= 0 ? "You are ahead" : "You are behind"}
                      </div>
                      <div className="text-sm text-blue-100/70">
                        Expected by now: {Math.max(0, Math.min(QUESTIONS_PER_ROUND, Math.round(expectedAnsweredByNow)))} questions
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {screen === "multiplayerResults" && multiplayerState && (
            <motion.div key="multiplayerResults" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center space-y-5">
                  <Rocket className="w-20 h-20 mx-auto text-cyan-200" />
                  <div className="text-blue-100/70 text-sm uppercase tracking-[0.25em]">Multiplayer Race Complete</div>
                  <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_3px_16px_rgba(255,255,255,0.22)]">
                    {multiplayerState.placement === "win" ? "You Won!" : `${multiplayerState.winner} won the race`}
                  </h2>
                  <p className="text-blue-100/80 max-w-2xl mx-auto">The race finished the moment you crossed the line. Race Mode rewards placing only: 1st earns 30 coins, 2nd earns 20, 3rd earns 10, and 4th earns 5.</p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    <Badge className="bg-amber-400/20 text-amber-50 border-none text-base px-4 py-2">Coins earned: +{multiplayerState.playerCoinsEarned || 0}</Badge>
                    <Badge className="bg-emerald-400/20 text-emerald-50 border-none text-base px-4 py-2">Place #{multiplayerState.placementNumber}</Badge>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                    {[{ id: "you", name: playerName?.trim() || "You", icon: "🙂", progress: multiplayerState.playerScore }, ...multiplayerState.opponents].sort((a, b) => b.progress - a.progress).map((runner, index) => (
                      <div key={runner.id} className="rounded-3xl bg-slate-900/60 border border-white/10 p-4">
                        <div className="text-sm text-blue-100/60 mb-2">Place #{index + 1}</div>
                        <div className="text-3xl mb-2">{runner.icon}</div>
                        <div className="font-bold text-white">{runner.name}</div>
                        <div className="text-blue-100/75 mt-1">{runner.progress} correct</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button onClick={() => setScreen("multiplayerSelect")} className="rounded-2xl h-12 px-6 bg-cyan-500 hover:bg-cyan-400 text-white font-bold">Play Again</Button>
                    <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10">Home</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <Card className="bg-white/10 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-blue-100/70 text-sm mb-2">Round Complete</div>
                      <h2 className="text-3xl md:text-4xl font-black">{modeMeta[mode]?.title} • {typeof level === "object" ? `${level.addsubLevel} + ${level.muldivLevel}` : level}</h2>
                      <p className="text-blue-100/80 mt-2">{playerName?.trim() ? `${playerName}, you answered ${score} out of ${results.length} correctly.` : `You answered ${score} out of ${results.length} correctly.`}</p>
                    </div>
                    <div className={`rounded-3xl px-6 py-5 ${passed ? "bg-emerald-500/20" : "bg-amber-500/20"}`}>
                      <div className="text-sm uppercase tracking-[0.25em] text-white/70">Result</div>
                      <div className="text-3xl font-black mt-1">{passed ? "LEVEL UP" : "Keep Practising"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {roundReward && (
                <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35 }}>
                  <Card className="bg-cyan-500/10 border-cyan-300/20 rounded-3xl shadow-2xl">
                    <CardContent className="p-6 md:p-8 text-center space-y-4">
                      <div className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">Coin Reward</div>
                      <div className="text-4xl md:text-5xl font-black text-cyan-50">+{roundReward.totalCoins} coins</div>
                      <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <Badge className="bg-white/10 text-cyan-50 border-none">{roundReward.correctCount} correct = +{roundReward.baseCoins}</Badge>
                        {roundReward.bonusCoins > 0 && (
                          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: [1, 1.12, 1] }} transition={{ duration: 0.6 }}>
                            <Badge className="bg-amber-400/20 text-amber-50 border-none">Bonus coins +{roundReward.bonusCoins}</Badge>
                          </motion.div>
                        )}
                        {roundReward.testingModeActive && <Badge className="bg-emerald-400/20 text-emerald-50 border-none">Testing mode double coins</Badge>}
                        {roundReward.activeMode === "mixed" && <Badge className="bg-cyan-400/20 text-cyan-50 border-none">Mixed mode 1.5x coins</Badge>}
                        {roundReward.levelMatchMultiplier > 1 && <Badge className="bg-emerald-400/20 text-emerald-50 border-none">Current level double coins</Badge>}
                        {roundReward.boostMultiplier > 1 && <Badge className="bg-fuchsia-400/20 text-fuchsia-50 border-none">Coin multiplier active</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {passed ? (
                <Card className="bg-emerald-500/15 border-emerald-300/20 rounded-3xl">
                  <CardContent className="p-8 text-center space-y-4">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: 2, duration: 0.5 }}>
                      <Trophy className="w-16 h-16 mx-auto text-emerald-200" />
                    </motion.div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-wide">LEVEL UP!</h3>
                    <p className="text-emerald-50/90 max-w-2xl mx-auto">
                      Amazing work. You reached the level-up score by getting at least 14 correct.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                      <Button onClick={restartSameLevel} className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-white font-bold">
                        Play Again
                      </Button>
                      {score >= 14 && (
                        <Button onClick={startTestingMode} variant="outline" className="rounded-2xl h-12 px-6 border-emerald-300/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20">
                          Retake Test
                        </Button>
                      )}
                      <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10">
                        Go Home
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid lg:grid-cols-2 gap-5">
                  <Card className="bg-white/10 border-white/10 rounded-3xl">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(255,255,255,0.12)]">Review your answers</h3>
                      <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
                        {results.map((item, i) => (
                          <div key={i} className="rounded-2xl bg-slate-900/60 p-4 border border-white/5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="font-bold text-xl text-white">{item.prompt}</div>
                              {item.correct ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-300 shrink-0" />
                              )}
                            </div>
                            <div className="text-sm text-white/85 mt-2">
                              Your answer: <span className="font-bold text-white">{item.given || "No answer"}</span> • Correct answer: <span className="font-bold text-white">{item.expected}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-500/10 border-amber-300/20 rounded-3xl">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(255,255,255,0.12)]">Mental strategy tip</h3>
                      <div className="space-y-4 max-h-[420px] overflow-auto pr-2">
                        {incorrectItems.length > 0 ? (
                          incorrectItems.map((item, i) => (
                            <div key={i} className="rounded-2xl bg-slate-900/60 p-4 border border-white/5">
                              <div className="font-bold text-xl text-white mb-1">{item.prompt}</div>
                              <div className="text-sm text-white/85 mb-2">Correct answer: {item.expected}</div>
                              <div className="text-sm leading-6 text-amber-50/90">{item.strategy}</div>
                            </div>
                          ))
                        ) : (
                          <p className="text-white/85">No incorrect responses to review this round.</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-6">
                        <Button onClick={restartSameLevel} className={`rounded-2xl h-12 px-6 ${currentTheme.primaryButton} text-white font-bold`}>
                          Try {typeof level === "object" ? `${level.addsubLevel} + ${level.muldivLevel}` : level} Again
                        </Button>
                        <Button onClick={backToHome} variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10">
                          Home
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
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
                    Testing mode has worked out the student’s current placement and saved it to this device.
                  </p>
                  <div className="flex justify-center">
                    <Badge className="bg-emerald-400/20 text-emerald-50 border-none text-base px-4 py-2">Testing coins earned: +{testingCoinsEarned}</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                    <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-5 py-4">
                      <div className="text-sm text-blue-100/70 mb-1">Addition / Subtraction</div>
                      <div className="text-3xl font-black">{userHistory.addsubLevel}</div>
                      <div className="text-sm text-cyan-100/80 mt-2">{testingScores.addsubScore !== null ? `${testingScores.addsubScore}/15` : "No test yet"}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/60 border border-white/10 px-5 py-4">
                      <div className="text-sm text-blue-100/70 mb-1">Multiplication / Division</div>
                      <div className="text-3xl font-black">{userHistory.muldivLevel}</div>
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
                      <Button onClick={startTestingMode} className={`rounded-2xl h-12 px-6 ${currentTheme.primaryButton} text-white font-bold`}>
                        Retake Tests
                      </Button>
                    )}
                    <Button onClick={backToHome} variant={testingScores.addsubScore >= 14 || testingScores.muldivScore >= 14 ? "outline" : undefined} className={testingScores.addsubScore >= 14 || testingScores.muldivScore >= 14 ? "rounded-2xl h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10" : `rounded-2xl h-12 px-6 ${currentTheme.primaryButton} text-white font-bold`}>
                      Back to Home
                    </Button>
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
                    <Button onClick={backToHome} className={`rounded-2xl h-12 px-6 ${currentTheme.primaryButton} text-white font-bold`}>
                      Back to Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
