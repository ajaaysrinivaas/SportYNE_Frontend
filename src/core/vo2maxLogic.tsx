// /core/vo2maxLogic.ts
// This module contains the core VO₂max logic, test definitions, and a performance rating lookup.
// It is fully typed so that tree shaking can remove unused tests.

export type Category = "field" | "cycle" | "treadmill" | "nonexercise";

export interface AdditionalField {
  key: string;
  label: string;
}

export interface TestDefinition {
  id: string;
  label: string;
  category: Category;
  description: string;
  formulaText: string;
  // List keys of common inputs needed (e.g. age, weight, gender, etc.)
  requiredCommon: Array<keyof CommonFields>;
  // Extra fields specific to the test
  additionalFields: AdditionalField[];
  // Compute function: returns VO₂max or null if inputs are missing/invalid.
  compute: (inputs: InputValues) => number | null;
}

export interface CommonFields {
  age: string;
  weight: string;
  gender: string;
  height: string;
  paRating: string;
}

export interface InputValues {
  [key: string]: string;
}

/* ---------------------------------------------------------------------------
   Test Definitions – using formulas from the review article.
   (Many tests are provided. You can add or remove as needed.)
--------------------------------------------------------------------------- */
export const testDefinitions: TestDefinition[] = [
  // ─── FIELD TESTS ─────────────────────────────────────────────
  {
    id: "run1_5",
    label: "1.5 Mile Run Test",
    category: "field",
    description: "Run 1.5 miles as fast as possible.",
    formulaText:
      "VO₂max = 88.02 + (3.716 × gender) – (0.0753 × weight in lbs) – (2.767 × run time [min])",
    requiredCommon: ["weight", "gender"],
    additionalFields: [{ key: "runTime", label: "Run Time (minutes)" }],
    compute: (inputs: InputValues) => {
      const genderVal = inputs.gender === "male" ? 1 : 0;
      const weight = parseFloat(inputs.weight);
      const runTime = parseFloat(inputs.runTime);
      if (isNaN(weight) || isNaN(runTime)) return null;
      const weightLbs = weight * 2.20462;
      return 88.02 + 3.716 * genderVal - 0.0753 * weightLbs - 2.767 * runTime;
    },
  },
  {
    id: "rockport",
    label: "1-Mile Walk Test (Rockport)",
    category: "field",
    description:
      "Walk 1 mile as fast as possible and record your time and ending heart rate.",
    formulaText:
      "VO₂max = 132.853 – (0.0769 × weight in lbs) – (0.3877 × age) + (6.315 × gender) – (3.2649 × walk time [min]) – (0.1565 × ending HR)",
    requiredCommon: ["age", "weight", "gender"],
    additionalFields: [
      { key: "walkTime", label: "Walk Time (minutes)" },
      { key: "endingHR", label: "Ending HR (bpm)" },
    ],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const weight = parseFloat(inputs.weight);
      const walkTime = parseFloat(inputs.walkTime);
      const endingHR = parseFloat(inputs.endingHR);
      if ([age, weight, walkTime, endingHR].some(v => isNaN(v))) return null;
      const weightLbs = weight * 2.20462;
      const genderVal = inputs.gender === "male" ? 1 : 0;
      return (
        132.853 -
        0.0769 * weightLbs -
        0.3877 * age +
        6.315 * genderVal -
        3.2649 * walkTime -
        0.1565 * endingHR
      );
    },
  },
  {
    id: "queens_step",
    label: "Queen's College Step Test",
    category: "field",
    description:
      "Step on a bench for 3 minutes. The recovery heart rate (measured after exercise) is used to estimate VO₂max.",
    formulaText:
      "For males: VO₂max = 111.33 – (0.42 × recovery HR); For females: VO₂max = 65.81 – (0.1847 × recovery HR)",
    requiredCommon: ["gender"],
    additionalFields: [{ key: "recoveryHR", label: "Recovery HR (bpm)" }],
    compute: (inputs: InputValues) => {
      const recoveryHR = parseFloat(inputs.recoveryHR);
      if (isNaN(recoveryHR)) return null;
      return inputs.gender === "male"
        ? 111.33 - 0.42 * recoveryHR
        : 65.81 - 0.1847 * recoveryHR;
    },
  },
  {
    id: "12min_run",
    label: "12-Minute Run Test",
    category: "field",
    description:
      "Run as far as possible in 12 minutes; record the distance in miles.",
    formulaText: "VO₂max = 35.97 × distance (miles) – 11.29",
    requiredCommon: [],
    additionalFields: [{ key: "distance", label: "Distance (miles)" }],
    compute: (inputs: InputValues) => {
      const distance = parseFloat(inputs.distance);
      if (isNaN(distance)) return null;
      return 35.97 * distance - 11.29;
    },
  },
  {
    id: "20m_shuttle",
    label: "20-Meter Shuttle Test",
    category: "field",
    description:
      "Perform shuttle runs between two lines 20 m apart; record the maximal speed (km/h).",
    formulaText:
      "VO₂max = 31.025 + (3.248 × speed) – (3.248 × age) + (0.1536 × age × speed)",
    requiredCommon: ["age"],
    additionalFields: [{ key: "shuttleSpeed", label: "Max Speed (km/h)" }],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const speed = parseFloat(inputs.shuttleSpeed);
      if (isNaN(age) || isNaN(speed)) return null;
      return 31.025 + 3.248 * speed - 3.248 * age + 0.1536 * age * speed;
    },
  },
  {
    id: "selfpaced_walk",
    label: "Self-Paced Walking Test",
    category: "field",
    description:
      "Walk at your own pace; record the speed (mph) and heart rate after the test.",
    formulaText:
      "VO₂max = 15.1 + 21.8 × speed – 0.327 × HR – 0.263 × speed × age + 5.98 × gender + 0.005 × HR × age",
    requiredCommon: ["age", "gender"],
    additionalFields: [
      { key: "speed", label: "Speed (mph)" },
      { key: "HR", label: "Heart Rate (bpm)" },
    ],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const speed = parseFloat(inputs.speed);
      const HR = parseFloat(inputs.HR);
      if ([age, speed, HR].some(v => isNaN(v))) return null;
      const genderVal = inputs.gender === "male" ? 1 : 0;
      return 15.1 + 21.8 * speed - 0.327 * HR - 0.263 * speed * age + 5.98 * genderVal + 0.005 * HR * age;
    },
  },
  {
    id: "modified_shuttle",
    label: "Modified Shuttle Walking Test",
    category: "field",
    description:
      "Walk a set distance with increasing pace; record the total distance walked (meters).",
    formulaText:
      "VO₂max = -0.457 + (0.139 × gender) + (0.025 × weight) + (0.002 × distance walked)",
    requiredCommon: ["weight", "gender"],
    additionalFields: [{ key: "DW", label: "Distance Walked (meters)" }],
    compute: (inputs: InputValues) => {
      const weight = parseFloat(inputs.weight);
      const DW = parseFloat(inputs.DW);
      if (isNaN(weight) || isNaN(DW)) return null;
      const genderVal = inputs.gender === "male" ? 1 : 0;
      return -0.457 + 0.139 * genderVal + 0.025 * weight + 0.002 * DW;
    },
  },
  {
    id: "6min_walk",
    label: "6-Minute Walk Test",
    category: "field",
    description: "Walk as far as possible in 6 minutes.",
    formulaText: "VO₂max = 553.289 – (2.11 × age) + (45.323 × gender)",
    requiredCommon: ["age", "gender"],
    additionalFields: [],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      if (isNaN(age)) return null;
      const genderVal = inputs.gender === "male" ? 1 : 0;
      return 553.289 - 2.11 * age + 45.323 * genderVal;
    },
  },
  {
    id: "yo_yo",
    label: "Yo-Yo Intermittent Recovery Test",
    category: "field",
    description:
      "Perform repeated shuttle runs; record the total mileage (miles).",
    formulaText: "VO₂max = (mileage × 0.0136) + 45.3",
    requiredCommon: [],
    additionalFields: [{ key: "yoYoMileage", label: "Mileage (miles)" }],
    compute: (inputs: InputValues) => {
      const mileage = parseFloat(inputs.yoYoMileage);
      if (isNaN(mileage)) return null;
      return mileage * 0.0136 + 45.3;
    },
  },
  {
    id: "hoff",
    label: "Hoff Test",
    category: "field",
    description:
      "Run an 8-minute shuttle with obstacles; record the total mileage (miles).",
    formulaText: "VO₂max = (mileage × 0.0136) + 45.3",
    requiredCommon: [],
    additionalFields: [{ key: "hoffMileage", label: "Mileage (miles)" }],
    compute: (inputs: InputValues) => {
      const mileage = parseFloat(inputs.hoffMileage);
      if (isNaN(mileage)) return null;
      return mileage * 0.0136 + 45.3;
    },
  },
  {
    id: "foote_val",
    label: "Foote-Val Test",
    category: "field",
    description:
      "An intermittent incremental test with recovery periods. (Formula not clearly provided; placeholder used.)",
    formulaText: "VO₂max = [Placeholder Formula]",
    requiredCommon: [],
    additionalFields: [{ key: "footeScore", label: "Test Score" }],
    compute: (inputs: InputValues) => {
      const score = parseFloat(inputs.footeScore);
      if (isNaN(score)) return null;
      return score; // Placeholder value
    },
  },
  // ─── CYCLE TESTS ─────────────────────────────────────────────
  {
    id: "storer_cycle",
    label: "Storer Maximal Bicycle Test",
    category: "cycle",
    description:
      "Cycle with increasing workload. VO₂max is first computed in ml/min and then divided by weight.",
    formulaText:
      "For males: VO₂max (ml/min) = (10.51 × watts) + (6.35 × weight) – (10.49 × age) + 519.3; For females: (9.39 × watts) + (7.7 × weight) – (5.88 × age) + 136.0; then divide by weight",
    requiredCommon: ["age", "weight", "gender"],
    additionalFields: [{ key: "watts", label: "Max Workload (watts)" }],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const weight = parseFloat(inputs.weight);
      const watts = parseFloat(inputs.watts);
      if ([age, weight, watts].some(v => isNaN(v))) return null;
      let vo2_ml_min: number;
      if (inputs.gender === "male") {
        vo2_ml_min = 10.51 * watts + 6.35 * weight - 10.49 * age + 519.3;
      } else {
        vo2_ml_min = 9.39 * watts + 7.7 * weight - 5.88 * age + 136.0;
      }
      return vo2_ml_min / weight;
    },
  },
  {
    id: "ymca_cycle",
    label: "YMCA Sub-maximal Bicycle Test",
    category: "cycle",
    description:
      "Cycle with sub-maximal workload. Use peak workload (W_peak) to estimate VO₂max.",
    formulaText: "VO₂max = 7 + [1.8 × (6.12 × W_peak) / weight]",
    requiredCommon: ["weight"],
    additionalFields: [{ key: "W_peak", label: "Peak Workload (watts)" }],
    compute: (inputs: InputValues) => {
      const weight = parseFloat(inputs.weight);
      const W_peak = parseFloat(inputs.W_peak);
      if (isNaN(weight) || isNaN(W_peak)) return null;
      return 7 + (1.8 * 6.12 * W_peak) / weight;
    },
  },
  {
    id: "milfit",
    label: "Milfit Test",
    category: "cycle",
    description:
      "Cycle test with increasing workload. VO₂max is estimated from the highest work rate achieved.",
    formulaText: "VO₂max = 12.35 × (watts / weight) + 3.5",
    requiredCommon: ["weight"],
    additionalFields: [{ key: "watts", label: "Max Workload (watts)" }],
    compute: (inputs: InputValues) => {
      const weight = parseFloat(inputs.weight);
      const watts = parseFloat(inputs.watts);
      if (isNaN(weight) || isNaN(watts)) return null;
      return 12.35 * (watts / weight) + 3.5;
    },
  },
  // ─── TREADMILL TESTS ─────────────────────────────────────────────
  {
    id: "acsm_running",
    label: "ACSM Running Equation",
    category: "treadmill",
    description:
      "Estimates oxygen consumption during running based on treadmill speed and grade.",
    formulaText: "VO₂ = 0.2 × speed + 0.9 × speed × grade + 3.5",
    requiredCommon: [],
    additionalFields: [
      { key: "speed", label: "Speed (m/min)" },
      { key: "grade", label: "Grade (decimal)" },
    ],
    compute: (inputs: InputValues) => {
      const speed = parseFloat(inputs.speed);
      const grade = parseFloat(inputs.grade);
      if (isNaN(speed) || isNaN(grade)) return null;
      return 0.2 * speed + 0.9 * speed * grade + 3.5;
    },
  },
  {
    id: "acsm_walking",
    label: "ACSM Walking Equation",
    category: "treadmill",
    description:
      "Estimates oxygen consumption during walking on a treadmill.",
    formulaText: "VO₂ = 0.1 × speed + 1.8 × speed × grade + 3.5",
    requiredCommon: [],
    additionalFields: [
      { key: "speed", label: "Speed (m/min)" },
      { key: "grade", label: "Grade (decimal)" },
    ],
    compute: (inputs: InputValues) => {
      const speed = parseFloat(inputs.speed);
      const grade = parseFloat(inputs.grade);
      if (isNaN(speed) || isNaN(grade)) return null;
      return 0.1 * speed + 1.8 * speed * grade + 3.5;
    },
  },
  {
    id: "ebbeling",
    label: "Ebbeling Treadmill Walking Test",
    category: "treadmill",
    description:
      "Estimates VO₂max from treadmill walking parameters along with age and gender.",
    formulaText:
      "VO₂max = 15.1 + 21.8 × speed – 0.327 × HR – 0.263 × speed × age + 0.005 × HR × age + 5.981 × gender",
    requiredCommon: ["age", "gender"],
    additionalFields: [
      { key: "speed", label: "Speed (mph)" },
      { key: "HR", label: "Heart Rate (bpm)" },
    ],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const speed = parseFloat(inputs.speed);
      const HR = parseFloat(inputs.HR);
      if ([age, speed, HR].some(v => isNaN(v))) return null;
      const genderVal = inputs.gender === "male" ? 1 : 0;
      return 15.1 + 21.8 * speed - 0.327 * HR - 0.263 * speed * age + 0.005 * HR * age + 5.981 * genderVal;
    },
  },
  {
    id: "friend",
    label: "FRIEND Equation",
    category: "treadmill",
    description:
      "Estimates VO₂max based on treadmill speed and grade.",
    formulaText: "VO₂max = speed × (0.17 + grade × 0.79) + 3.5",
    requiredCommon: [],
    additionalFields: [
      { key: "speed", label: "Speed (m/min)" },
      { key: "grade", label: "Grade (decimal)" },
    ],
    compute: (inputs: InputValues) => {
      const speed = parseFloat(inputs.speed);
      const grade = parseFloat(inputs.grade);
      if (isNaN(speed) || isNaN(grade)) return null;
      return speed * (0.17 + grade * 0.79) + 3.5;
    },
  },
  // ─── NON-EXERCISE TESTS ─────────────────────────────────────────────
  {
    id: "wasserman",
    label: "Wasserman's Equation",
    category: "nonexercise",
    description:
      "Estimates VO₂max (in L/min) from age and weight.",
    formulaText:
      "For males: VO₂max = [weight × (50.72 - 0.372 × age)]/1000; For females: VO₂max = [(weight + 42.8) × (22.78 - 0.17 × age)]/1000",
    requiredCommon: ["age", "weight"],
    additionalFields: [],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const weight = parseFloat(inputs.weight);
      if (isNaN(age) || isNaN(weight)) return null;
      return inputs.gender === "male"
        ? (weight * (50.72 - 0.372 * age)) / 1000
        : ((weight + 42.8) * (22.78 - 0.17 * age)) / 1000;
    },
  },
  {
    id: "nasa",
    label: "NASA/Johnson PA-R Test",
    category: "nonexercise",
    description:
      "Estimates VO₂max based on age, weight, height, and physical activity rating (PAR).",
    formulaText:
      "For males: VO₂max = 67.350 - 0.381×age - 0.754×BMI + 1.951×PAR; For females: VO₂max = 56.363 - 0.381×age - 0.754×BMI + 1.951×PAR, where BMI = weight/(height²)",
    requiredCommon: ["age", "weight", "gender", "height", "paRating"],
    additionalFields: [],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const weight = parseFloat(inputs.weight);
      const height = parseFloat(inputs.height);
      const paRating = parseFloat(inputs.paRating);
      if ([age, weight, height, paRating].some(v => isNaN(v))) return null;
      const bmi = weight / (height * height);
      return inputs.gender === "male"
        ? 67.350 - 0.381 * age - 0.754 * bmi + 1.951 * paRating
        : 56.363 - 0.381 * age - 0.754 * bmi + 1.951 * paRating;
    },
  },
  {
    id: "jackson_nonex",
    label: "Jackson Non-Exercise Test",
    category: "nonexercise",
    description:
      "Estimates VO₂max based on demographics and a physical activity rating.",
    formulaText:
      "VO₂max = 56.363 + 1.921×PAR - 0.381×age - 0.754×BMI + 10.987×gender, where BMI = weight/(height²)",
    requiredCommon: ["age", "weight", "gender", "height", "paRating"],
    additionalFields: [],
    compute: (inputs: InputValues) => {
      const age = parseFloat(inputs.age);
      const weight = parseFloat(inputs.weight);
      const height = parseFloat(inputs.height);
      const paRating = parseFloat(inputs.paRating);
      if ([age, weight, height, paRating].some(v => isNaN(v))) return null;
      const bmi = weight / (height * height);
      const genderVal = inputs.gender === "male" ? 1 : 0;
      return 56.363 + 1.921 * paRating - 0.381 * age - 0.754 * bmi + 10.987 * genderVal;
    },
  },
  {
    id: "george_nonex",
    label: "George Non-Exercise Test",
    category: "nonexercise",
    description:
      "Estimates VO₂max based on demographics, perceived functional ability (PFA), and physical activity rating.",
    formulaText:
      "VO₂max = 45.513 + 6.564×gender - 0.749×BMI + 0.724×PFA + 0.788×PAR, where BMI = weight/(height²)",
    requiredCommon: ["weight", "gender", "height", "paRating"],
    additionalFields: [{ key: "pfa", label: "Perceived Functional Ability" }],
    compute: (inputs: InputValues) => {
      const weight = parseFloat(inputs.weight);
      const height = parseFloat(inputs.height);
      const paRating = parseFloat(inputs.paRating);
      const pfa = parseFloat(inputs.pfa);
      if ([weight, height, paRating, pfa].some(v => isNaN(v))) return null;
      const bmi = weight / (height * height);
      const genderVal = inputs.gender === "male" ? 1 : 0;
      return 45.513 + 6.564 * genderVal - 0.749 * bmi + 0.724 * pfa + 0.788 * paRating;
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Rating Lookup (for tests reporting VO₂max in ml/kg/min)
// These groups come from the review article.
export interface RatingGroup {
  ageRange: [number, number];
  Excellent: number;
  Good: [number, number];
  AboveAverage: [number, number];
  Average: [number, number];
  BelowAverage: [number, number];
  Poor: [number, number];
  VeryPoor: number;
}

const menRatingGroups: RatingGroup[] = [
  { ageRange: [18, 25], Excellent: 60, Good: [52, 60], AboveAverage: [47, 51], Average: [42, 46], BelowAverage: [37, 41], Poor: [30, 36], VeryPoor: 30 },
  { ageRange: [26, 35], Excellent: 56, Good: [49, 56], AboveAverage: [43, 48], Average: [40, 42], BelowAverage: [35, 39], Poor: [30, 34], VeryPoor: 30 },
  { ageRange: [36, 45], Excellent: 51, Good: [43, 51], AboveAverage: [39, 42], Average: [35, 38], BelowAverage: [31, 34], Poor: [26, 30], VeryPoor: 26 },
  { ageRange: [46, 55], Excellent: 45, Good: [39, 45], AboveAverage: [36, 38], Average: [32, 35], BelowAverage: [29, 31], Poor: [25, 28], VeryPoor: 25 },
  { ageRange: [56, 65], Excellent: 41, Good: [36, 41], AboveAverage: [32, 35], Average: [30, 31], BelowAverage: [26, 29], Poor: [22, 25], VeryPoor: 22 },
  { ageRange: [66, Infinity], Excellent: 37, Good: [33, 37], AboveAverage: [29, 32], Average: [26, 28], BelowAverage: [22, 25], Poor: [20, 21], VeryPoor: 20 },
];

const womenRatingGroups: RatingGroup[] = [
  { ageRange: [18, 25], Excellent: 56, Good: [47, 56], AboveAverage: [42, 46], Average: [38, 41], BelowAverage: [33, 37], Poor: [28, 32], VeryPoor: 28 },
  { ageRange: [26, 35], Excellent: 52, Good: [45, 52], AboveAverage: [39, 44], Average: [35, 38], BelowAverage: [31, 34], Poor: [26, 30], VeryPoor: 26 },
  { ageRange: [36, 45], Excellent: 45, Good: [38, 45], AboveAverage: [34, 37], Average: [31, 33], BelowAverage: [27, 30], Poor: [22, 26], VeryPoor: 22 },
  { ageRange: [46, 55], Excellent: 40, Good: [34, 40], AboveAverage: [31, 33], Average: [28, 30], BelowAverage: [25, 27], Poor: [20, 24], VeryPoor: 20 },
  { ageRange: [56, 65], Excellent: 37, Good: [32, 37], AboveAverage: [28, 31], Average: [25, 27], BelowAverage: [22, 24], Poor: [18, 21], VeryPoor: 18 },
  { ageRange: [66, Infinity], Excellent: 32, Good: [28, 32], AboveAverage: [25, 27], Average: [22, 24], BelowAverage: [19, 21], Poor: [17, 18], VeryPoor: 17 },
];

export const getRating = (gender: string, age: number, vo2: number): string => {
  const groups = gender === "male" ? menRatingGroups : womenRatingGroups;
  const group = groups.find(g => age >= g.ageRange[0] && age <= g.ageRange[1]);
  if (!group) return "No rating available";
  if (vo2 > group.Excellent) return "Excellent";
  if (vo2 >= group.Good[0] && vo2 <= group.Good[1]) return "Good";
  if (vo2 >= group.AboveAverage[0] && vo2 <= group.AboveAverage[1]) return "Above average";
  if (vo2 >= group.Average[0] && vo2 <= group.Average[1]) return "Average";
  if (vo2 >= group.BelowAverage[0] && vo2 <= group.BelowAverage[1]) return "Below average";
  if (vo2 >= group.Poor[0] && vo2 <= group.Poor[1]) return "Poor";
  if (vo2 < group.VeryPoor) return "Very poor";
  return "Unclassified";
};
