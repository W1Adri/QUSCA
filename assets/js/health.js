/* =========================================================================
 * health.js — Evidence-based health & fitness calculations
 * Pure functions only. No DOM, no storage. Fully unit-testable.
 *
 * Sources of formulas (standard, widely cited):
 *  - BMR: Mifflin-St Jeor (1990) — most accurate predictive equation
 *  - TDEE: BMR x activity factor (Katch / standard PAL multipliers)
 *  - Macros: ISSN position stands (protein 1.6-2.2 g/kg for hypertrophy)
 *  - Water: ~35 ml/kg baseline + training adjustment
 *  - 1RM: Epley & Brzycki estimation
 *  - Body fat estimate: Deurenberg (BMI-based)
 * ========================================================================= */

export const ACTIVITY = {
  sedentary:   { factor: 1.2,   label: 'Sedentary', desc: 'Little or no exercise, desk job' },
  light:       { factor: 1.375, label: 'Lightly active', desc: 'Light exercise 1-3 days/week' },
  moderate:    { factor: 1.55,  label: 'Moderately active', desc: 'Moderate exercise 3-5 days/week' },
  very:        { factor: 1.725, label: 'Very active', desc: 'Hard exercise 6-7 days/week' },
  extra:       { factor: 1.9,   label: 'Extra active', desc: 'Physical job + hard training' },
};

export const GOALS = {
  lose:     { label: 'Lose fat',        adjust: -0.20, proteinPerKg: 2.2 },
  recomp:   { label: 'Body recomp',     adjust:  0.00, proteinPerKg: 2.0 },
  leanbulk: { label: 'Lean muscle gain', adjust: 0.12, proteinPerKg: 2.0 },
  bulk:     { label: 'Aggressive bulk',  adjust: 0.20, proteinPerKg: 1.8 },
};

/** Basal Metabolic Rate — Mifflin-St Jeor. sex: 'male' | 'female'. */
export function bmr({ weightKg, heightCm, age, sex }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (sex === 'male' ? 5 : -161));
}

/** Total Daily Energy Expenditure. */
export function tdee({ weightKg, heightCm, age, sex, activity }) {
  const factor = (ACTIVITY[activity] || ACTIVITY.moderate).factor;
  return Math.round(bmr({ weightKg, heightCm, age, sex }) * factor);
}

/** Target calories given a goal key. */
export function targetCalories(profile) {
  const maint = tdee(profile);
  const goal = GOALS[profile.goal] || GOALS.leanbulk;
  return { maintenance: maint, target: Math.round(maint * (1 + goal.adjust)) };
}

/**
 * Macro split. Protein from g/kg by goal, fat at ~25% of calories
 * (min 0.8 g/kg), carbs fill the rest. Returns grams + kcal.
 */
export function macros(profile) {
  const { target } = targetCalories(profile);
  const goal = GOALS[profile.goal] || GOALS.leanbulk;
  const w = profile.weightKg;

  const proteinG = Math.round(goal.proteinPerKg * w);
  let fatG = Math.round((target * 0.25) / 9);
  const minFat = Math.round(0.8 * w);
  if (fatG < minFat) fatG = minFat;

  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  let carbKcal = target - proteinKcal - fatKcal;
  if (carbKcal < 0) carbKcal = 0;
  const carbG = Math.round(carbKcal / 4);

  return {
    calories: target,
    protein: { g: proteinG, kcal: proteinKcal },
    fat:     { g: fatG,     kcal: fatG * 9 },
    carbs:   { g: carbG,    kcal: carbG * 4 },
  };
}

/** Body Mass Index + category. */
export function bmi({ weightKg, heightCm }) {
  const m = heightCm / 100;
  const value = weightKg / (m * m);
  let category = 'Normal';
  if (value < 18.5) category = 'Underweight';
  else if (value < 25) category = 'Normal';
  else if (value < 30) category = 'Overweight';
  else category = 'Obese';
  return { value: Math.round(value * 10) / 10, category };
}

/** Estimated body-fat % (Deurenberg, BMI-based — rough estimate). */
export function bodyFat({ weightKg, heightCm, age, sex }) {
  const b = bmi({ weightKg, heightCm }).value;
  const s = sex === 'male' ? 1 : 0;
  const bf = 1.20 * b + 0.23 * age - 10.8 * s - 5.4;
  return Math.max(3, Math.round(bf * 10) / 10);
}

/** Daily water goal in ml: ~35 ml/kg + 500 ml per training hour. */
export function waterGoalMl({ weightKg }, trainingHours = 0) {
  return Math.round(35 * weightKg + 500 * trainingHours);
}

/** Estimated 1-rep max. Epley by default; Brzycki alternative. */
export function oneRepMax(weight, reps, formula = 'epley') {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  const v = formula === 'brzycki'
    ? weight * (36 / (37 - reps))
    : weight * (1 + reps / 30);
  return Math.round(v * 10) / 10;
}

/** Total volume load of a set list [{weight, reps}]. */
export function volume(sets = []) {
  return sets.reduce((t, s) => t + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
}

/** Ideal body-weight range (BMI 18.5–24.9) for a height. */
export function healthyWeightRange(heightCm) {
  const m = heightCm / 100;
  return { min: Math.round(18.5 * m * m), max: Math.round(24.9 * m * m) };
}

/* ------------------------------------------------------------------ *
 * Food database — values per 100 g (or per 100 ml for liquids).
 * kcal / protein / carbs / fat. Curated common whole foods.
 * ------------------------------------------------------------------ */
export const FOODS = [
  { name: 'Chicken breast (cooked)', kcal: 165, p: 31, c: 0,  f: 3.6 },
  { name: 'Lean beef (cooked)',      kcal: 217, p: 26, c: 0,  f: 12 },
  { name: 'Salmon (cooked)',         kcal: 208, p: 20, c: 0,  f: 13 },
  { name: 'Canned tuna (water)',     kcal: 116, p: 26, c: 0,  f: 1 },
  { name: 'Whole egg',               kcal: 143, p: 13, c: 1,  f: 10 },
  { name: 'Egg white',               kcal: 52,  p: 11, c: 0.7,f: 0.2 },
  { name: 'Greek yogurt (0%)',       kcal: 59,  p: 10, c: 3.6,f: 0.4 },
  { name: 'Cottage cheese',          kcal: 98,  p: 11, c: 3.4,f: 4.3 },
  { name: 'Whey protein (powder)',   kcal: 400, p: 80, c: 8,  f: 6 },
  { name: 'Milk (semi-skimmed)',     kcal: 47,  p: 3.4,c: 4.8,f: 1.6 },
  { name: 'White rice (cooked)',     kcal: 130, p: 2.7,c: 28, f: 0.3 },
  { name: 'Brown rice (cooked)',     kcal: 123, p: 2.7,c: 26, f: 1 },
  { name: 'Oats (dry)',              kcal: 389, p: 17, c: 66, f: 7 },
  { name: 'Pasta (cooked)',          kcal: 158, p: 6,  c: 31, f: 0.9 },
  { name: 'Whole wheat bread',       kcal: 247, p: 13, c: 41, f: 3.4 },
  { name: 'Potato (cooked)',         kcal: 87,  p: 2,  c: 20, f: 0.1 },
  { name: 'Sweet potato (cooked)',   kcal: 90,  p: 2,  c: 21, f: 0.1 },
  { name: 'Banana',                  kcal: 89,  p: 1.1,c: 23, f: 0.3 },
  { name: 'Apple',                   kcal: 52,  p: 0.3,c: 14, f: 0.2 },
  { name: 'Blueberries',             kcal: 57,  p: 0.7,c: 14, f: 0.3 },
  { name: 'Broccoli',                kcal: 34,  p: 2.8,c: 7,  f: 0.4 },
  { name: 'Spinach',                 kcal: 23,  p: 2.9,c: 3.6,f: 0.4 },
  { name: 'Avocado',                 kcal: 160, p: 2,  c: 9,  f: 15 },
  { name: 'Almonds',                 kcal: 579, p: 21, c: 22, f: 50 },
  { name: 'Peanut butter',           kcal: 588, p: 25, c: 20, f: 50 },
  { name: 'Olive oil',               kcal: 884, p: 0,  c: 0,  f: 100 },
  { name: 'Black beans (cooked)',    kcal: 132, p: 9,  c: 24, f: 0.5 },
  { name: 'Lentils (cooked)',        kcal: 116, p: 9,  c: 20, f: 0.4 },
  { name: 'Chickpeas (cooked)',      kcal: 164, p: 9,  c: 27, f: 2.6 },
  { name: 'Tofu',                    kcal: 76,  p: 8,  c: 1.9,f: 4.8 },
  { name: 'Cheddar cheese',          kcal: 403, p: 25, c: 1.3,f: 33 },
  { name: 'Dark chocolate (85%)',    kcal: 599, p: 8,  c: 32, f: 46 },
  { name: 'Honey',                   kcal: 304, p: 0.3,c: 82, f: 0 },
];

/* ------------------------------------------------------------------ *
 * Training templates for muscle gain (hypertrophy focus).
 * Progressive overload: add reps to top of range, then add load.
 * ------------------------------------------------------------------ */
export const PROGRAMS = {
  ppl: {
    name: 'Push / Pull / Legs (6 days)',
    desc: 'High-frequency hypertrophy split. Best for intermediate lifters who can train 5-6x/week.',
    days: [
      { day: 'Push A', exercises: [
        ['Barbell bench press', '4 x 6-8'], ['Overhead press', '3 x 8-10'],
        ['Incline dumbbell press', '3 x 10-12'], ['Lateral raise', '4 x 12-15'],
        ['Triceps pushdown', '3 x 12-15'] ] },
      { day: 'Pull A', exercises: [
        ['Deadlift', '3 x 5'], ['Pull-up / lat pulldown', '4 x 8-10'],
        ['Barbell row', '4 x 8-10'], ['Face pull', '3 x 15'],
        ['Barbell curl', '3 x 10-12'] ] },
      { day: 'Legs A', exercises: [
        ['Back squat', '4 x 6-8'], ['Romanian deadlift', '3 x 8-10'],
        ['Leg press', '3 x 12'], ['Leg curl', '3 x 12-15'],
        ['Standing calf raise', '4 x 15-20'] ] },
      { day: 'Push B', exercises: [
        ['Overhead press', '4 x 6-8'], ['Incline bench press', '3 x 8-10'],
        ['Dumbbell flye', '3 x 12-15'], ['Cable lateral raise', '4 x 15'],
        ['Overhead triceps extension', '3 x 12'] ] },
      { day: 'Pull B', exercises: [
        ['Lat pulldown', '4 x 10-12'], ['Seated cable row', '4 x 10-12'],
        ['Dumbbell row', '3 x 10'], ['Rear delt flye', '3 x 15'],
        ['Hammer curl', '3 x 12'] ] },
      { day: 'Legs B', exercises: [
        ['Front squat', '4 x 8-10'], ['Hip thrust', '3 x 10-12'],
        ['Walking lunge', '3 x 12'], ['Leg extension', '3 x 15'],
        ['Seated calf raise', '4 x 15-20'] ] },
    ],
  },
  upperLower: {
    name: 'Upper / Lower (4 days)',
    desc: 'Balanced 4-day split. Ideal starting point for muscle gain with good recovery.',
    days: [
      { day: 'Upper A', exercises: [
        ['Barbell bench press', '4 x 6-8'], ['Barbell row', '4 x 8-10'],
        ['Overhead press', '3 x 8-10'], ['Lat pulldown', '3 x 10-12'],
        ['Lateral raise', '3 x 15'], ['Barbell curl', '3 x 12'] ] },
      { day: 'Lower A', exercises: [
        ['Back squat', '4 x 6-8'], ['Romanian deadlift', '3 x 8-10'],
        ['Leg press', '3 x 12'], ['Leg curl', '3 x 12-15'],
        ['Calf raise', '4 x 15-20'] ] },
      { day: 'Upper B', exercises: [
        ['Incline dumbbell press', '4 x 8-10'], ['Pull-up', '4 x 8-10'],
        ['Dumbbell shoulder press', '3 x 10'], ['Seated cable row', '3 x 12'],
        ['Triceps pushdown', '3 x 15'], ['Hammer curl', '3 x 12'] ] },
      { day: 'Lower B', exercises: [
        ['Deadlift', '3 x 5'], ['Front squat', '3 x 8-10'],
        ['Hip thrust', '3 x 12'], ['Leg extension', '3 x 15'],
        ['Seated calf raise', '4 x 15-20'] ] },
    ],
  },
  fullBody: {
    name: 'Full Body (3 days)',
    desc: 'Time-efficient 3-day plan. Great for beginners building a base.',
    days: [
      { day: 'Full Body A', exercises: [
        ['Back squat', '3 x 8'], ['Bench press', '3 x 8'],
        ['Barbell row', '3 x 8'], ['Overhead press', '3 x 10'],
        ['Plank', '3 x 45s'] ] },
      { day: 'Full Body B', exercises: [
        ['Deadlift', '3 x 5'], ['Incline dumbbell press', '3 x 10'],
        ['Lat pulldown', '3 x 10'], ['Lunge', '3 x 12'],
        ['Lateral raise', '3 x 15'] ] },
      { day: 'Full Body C', exercises: [
        ['Front squat', '3 x 8'], ['Dip', '3 x 10'],
        ['Pull-up', '3 x 8'], ['Romanian deadlift', '3 x 10'],
        ['Barbell curl', '3 x 12'] ] },
    ],
  },
};

export const COMMON_EXERCISES = [
  'Barbell bench press', 'Incline bench press', 'Overhead press', 'Back squat',
  'Front squat', 'Deadlift', 'Romanian deadlift', 'Barbell row', 'Pull-up',
  'Lat pulldown', 'Seated cable row', 'Dumbbell row', 'Leg press', 'Leg curl',
  'Leg extension', 'Hip thrust', 'Lunge', 'Lateral raise', 'Face pull',
  'Barbell curl', 'Hammer curl', 'Triceps pushdown', 'Dip', 'Calf raise',
];
