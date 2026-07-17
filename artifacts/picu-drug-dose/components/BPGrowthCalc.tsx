/**
 * Pediatric BP & Growth Centile Calculator
 *
 * Blood Pressure:  NHBPEP Fourth Report (2004) / AAP 2017 CPG (Flynn et al., Pediatrics 2017)
 *                  Ages 1–17 · 7 height-percentile columns per age-sex cell
 * Height centile:  CDC 2000 Growth Charts (7-point interpolation)
 * Weight centile:  WHO Child Growth Standards (z-score via L/M/S approximation)
 * Classification:  AAP 2017 (Normal / Elevated / Stage 1 / Stage 2)
 */
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

// ─── Normal CDF (Abramowitz & Stegun, error < 7.5e-8) ────────────────────────
function normCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  return z >= 0 ? 1 - p : p;
}
function zToPct(z: number) { return Math.min(99.9, Math.max(0.1, normCDF(z) * 100)); }

// ─── Z-scores at the 7 reference height-percentile columns ──────────────────
const Z7 = [-1.6449, -1.2816, -0.6745, 0, 0.6745, 1.2816, 1.6449];
const PCT7_LABELS = ["5th","10th","25th","50th","75th","90th","95th"];

// ─── CDC 2000 Height-for-Age percentile tables (cm) ─────────────────────────
// [5th, 10th, 25th, 50th, 75th, 90th, 95th]  keyed by integer age in years
const HT_B: Record<number,number[]> = {
  1:[71,73,75,76,78,80,81],2:[82,83,86,87,89,91,92],3:[89,91,93,96,98,100,101],
  4:[96,98,100,103,105,107,109],5:[102,104,107,110,113,115,116],6:[108,110,113,116,119,122,123],
  7:[114,116,119,122,125,128,129],8:[119,122,125,128,131,134,136],9:[124,127,130,133,137,140,142],
  10:[129,132,135,138,142,146,148],11:[134,137,141,144,148,152,154],12:[139,142,147,151,156,161,163],
  13:[145,148,153,157,162,168,170],14:[151,154,159,164,169,174,176],15:[156,159,164,170,175,179,181],
  16:[159,162,167,173,178,182,184],17:[161,163,168,175,180,184,186],
};
const HT_G: Record<number,number[]> = {
  1:[69,71,73,75,77,78,79],2:[80,82,84,86,88,90,91],3:[88,90,92,95,97,99,100],
  4:[95,97,99,102,104,106,107],5:[101,103,106,109,111,113,115],6:[107,109,112,115,118,120,122],
  7:[112,115,118,121,124,127,128],8:[118,120,124,127,130,133,135],9:[123,126,129,133,136,139,141],
  10:[128,131,135,138,142,145,147],11:[133,137,141,145,148,152,154],12:[139,142,147,151,154,157,159],
  13:[144,147,151,156,159,162,163],14:[148,151,155,160,163,165,166],15:[150,153,157,162,165,167,168],
  16:[151,154,158,163,166,168,169],17:[151,155,159,163,167,169,170],
};

// Returns height z-score and percentile for given age (years, integer 1-17) + sex
function heightZAndPct(htCm: number, ageYears: number, sex: "M"|"F"): { z: number; pct: number; col: number; colLabel: string } {
  const age = Math.max(1, Math.min(17, Math.round(ageYears)));
  const refs = sex === "M" ? HT_B[age] : HT_G[age];
  if (!refs) return { z: 0, pct: 50, col: 3, colLabel: "50th" };
  // Clamp and linearly interpolate between the 7 percentile anchors
  let z = 0;
  if (htCm <= refs[0]) {
    z = Z7[0] - (refs[0] - htCm) / (refs[1] - refs[0]) * (Z7[1] - Z7[0]);
  } else if (htCm >= refs[6]) {
    z = Z7[6] + (htCm - refs[6]) / (refs[6] - refs[5]) * (Z7[6] - Z7[5]);
  } else {
    for (let i = 0; i < 6; i++) {
      if (htCm <= refs[i + 1]) {
        const t = (htCm - refs[i]) / (refs[i + 1] - refs[i]);
        z = Z7[i] + t * (Z7[i + 1] - Z7[i]);
        break;
      }
    }
  }
  // Pick nearest column for BP table lookup
  let col = 0;
  let best = Math.abs(z - Z7[0]);
  for (let i = 1; i < 7; i++) {
    const d = Math.abs(z - Z7[i]);
    if (d < best) { best = d; col = i; }
  }
  return { z: Math.round(z * 100) / 100, pct: zToPct(z), col, colLabel: PCT7_LABELS[col] };
}

// ─── NHBPEP 4th Report BP Tables ─────────────────────────────────────────────
// [50th_row, 90th_row, 95th_row, 99th_row]  each row = 7 values (cols 0–6)
type BPRows = [number[], number[], number[], number[]];

const SBP_B: Record<number,BPRows> = {
  1:[[80,81,83,85,87,88,89],[94,95,97,99,100,102,102],[98,99,101,103,104,106,106],[105,106,108,110,112,113,114]],
  2:[[84,85,87,88,90,92,92],[98,99,101,102,104,105,106],[102,103,105,107,108,110,110],[109,110,112,114,115,117,117]],
  3:[[86,87,89,91,93,94,95],[100,101,103,105,107,108,109],[104,105,107,109,111,112,113],[111,112,114,116,118,119,120]],
  4:[[88,89,91,93,95,96,97],[102,103,105,107,109,110,111],[106,107,109,111,113,114,115],[113,114,116,118,120,121,122]],
  5:[[90,91,93,95,96,98,98],[104,105,106,108,110,112,112],[108,109,110,112,114,115,116],[115,116,118,120,121,123,123]],
  6:[[91,92,94,96,98,99,100],[105,106,108,110,112,113,114],[109,110,112,114,116,117,118],[116,117,119,121,123,124,125]],
  7:[[92,94,95,97,99,100,101],[106,107,109,111,113,114,115],[110,111,113,115,117,118,119],[117,119,120,122,124,125,126]],
  8:[[94,95,97,99,100,102,102],[107,109,110,112,114,115,116],[111,112,114,116,118,119,120],[119,120,122,124,125,127,127]],
  9:[[95,96,98,100,102,103,104],[109,110,112,114,115,117,117],[113,114,116,118,119,121,121],[120,121,123,125,127,128,129]],
  10:[[97,98,100,102,103,105,106],[111,112,114,115,117,119,119],[115,116,117,119,121,122,123],[122,123,125,127,128,130,130]],
  11:[[99,100,102,104,105,107,107],[113,114,115,117,119,120,121],[117,118,119,121,123,124,125],[124,125,126,128,130,132,132]],
  12:[[101,102,104,106,108,109,110],[115,116,118,120,121,123,123],[119,120,122,123,125,127,127],[126,127,129,131,133,134,135]],
  13:[[104,105,106,108,110,111,112],[117,118,120,122,124,125,126],[121,122,124,126,128,129,130],[128,130,131,133,135,136,137]],
  14:[[106,107,109,111,113,114,115],[120,121,123,125,126,128,128],[124,125,127,128,130,132,132],[131,132,134,136,138,139,140]],
  15:[[109,110,112,113,115,117,117],[122,124,125,127,129,130,131],[126,127,129,131,133,134,135],[134,135,136,138,140,142,142]],
  16:[[111,112,114,116,118,119,120],[125,126,128,130,131,133,134],[129,130,132,134,135,137,137],[136,138,139,141,143,144,145]],
  17:[[114,115,116,118,120,121,122],[127,128,130,132,134,135,136],[131,132,134,136,138,139,140],[139,140,141,143,145,146,147]],
};
const DBP_B: Record<number,BPRows> = {
  1:[[34,35,36,37,38,39,39],[49,50,51,52,53,53,54],[54,54,55,56,57,58,58],[61,62,63,64,65,66,66]],
  2:[[39,40,41,42,43,44,44],[54,55,55,56,57,58,58],[58,59,60,61,62,62,63],[66,67,67,68,69,70,70]],
  3:[[44,44,45,46,47,48,48],[59,59,60,61,62,63,63],[63,63,64,65,66,67,67],[70,71,72,73,74,74,75]],
  4:[[47,48,49,50,51,51,52],[62,63,64,65,66,66,67],[66,67,68,69,70,71,71],[74,74,75,76,77,78,78]],
  5:[[50,51,52,53,54,55,55],[65,66,67,68,68,69,70],[69,70,71,72,72,73,74],[77,77,78,79,80,81,81]],
  6:[[53,53,54,55,56,57,57],[68,68,69,70,71,72,72],[72,72,73,74,75,76,76],[79,80,81,82,83,83,84]],
  7:[[55,55,56,57,58,59,59],[70,70,71,72,73,74,74],[74,74,75,76,77,78,78],[82,82,83,84,84,85,86]],
  8:[[56,57,58,58,59,60,61],[71,72,72,73,74,75,75],[75,76,76,77,78,79,80],[83,83,84,85,86,87,87]],
  9:[[57,58,59,60,61,61,62],[72,73,74,75,75,76,77],[76,77,78,79,80,81,81],[84,85,86,87,87,88,89]],
  10:[[58,59,60,61,61,62,63],[73,74,75,75,76,77,78],[77,78,79,80,80,81,82],[85,86,87,87,88,89,90]],
  11:[[59,59,60,61,62,63,63],[74,74,75,76,77,78,78],[78,78,79,80,81,82,82],[86,86,87,88,89,90,90]],
  12:[[59,60,61,62,63,63,64],[74,75,75,76,77,78,79],[78,79,79,80,81,82,83],[86,87,87,88,89,90,91]],
  13:[[60,60,61,62,63,64,64],[75,75,76,77,78,79,79],[79,79,80,81,82,83,83],[87,87,88,89,90,91,91]],
  14:[[60,61,62,63,64,65,65],[75,76,77,78,79,79,80],[79,80,81,82,83,83,84],[87,88,89,90,91,91,92]],
  15:[[61,62,63,64,65,66,66],[76,77,78,79,80,80,81],[80,81,82,83,84,84,85],[88,89,90,91,92,92,93]],
  16:[[63,63,64,65,66,67,67],[78,78,79,80,81,82,82],[82,82,83,84,85,86,86],[90,90,91,92,93,94,94]],
  17:[[65,66,66,67,68,69,70],[80,81,82,83,84,85,85],[84,85,86,87,88,89,89],[92,93,94,95,96,97,97]],
};
const SBP_G: Record<number,BPRows> = {
  1:[[83,84,85,86,88,89,90],[97,97,98,100,101,102,103],[100,101,102,104,105,106,107],[107,108,109,111,112,113,114]],
  2:[[85,85,87,88,89,91,91],[98,99,100,101,103,104,105],[102,102,104,105,106,108,108],[109,110,111,112,114,115,115]],
  3:[[86,87,88,89,91,92,92],[100,100,102,103,104,105,106],[104,104,105,107,108,109,110],[111,112,113,114,116,117,117]],
  4:[[88,88,90,91,92,94,94],[101,102,103,105,106,107,108],[105,106,107,108,110,111,112],[112,113,114,116,117,118,119]],
  5:[[89,90,91,93,94,95,96],[103,103,105,106,107,109,109],[107,107,108,110,111,112,113],[114,115,116,117,119,120,120]],
  6:[[91,92,93,94,96,97,98],[104,105,106,108,109,110,111],[108,109,110,111,113,114,115],[115,116,117,119,120,121,122]],
  7:[[93,93,95,96,97,99,99],[106,107,108,109,111,112,113],[110,111,112,113,115,116,116],[117,118,119,120,122,123,123]],
  8:[[95,95,96,98,99,100,101],[108,109,110,111,113,114,114],[112,112,114,115,116,118,118],[119,119,121,122,123,125,125]],
  9:[[96,97,98,100,101,102,103],[110,110,112,113,114,116,116],[114,114,115,117,118,119,120],[121,121,122,124,125,126,127]],
  10:[[98,99,100,102,103,104,105],[112,112,114,115,116,118,118],[116,116,117,119,120,121,122],[123,123,124,126,127,128,129]],
  11:[[100,101,102,103,105,106,107],[114,114,116,117,118,119,120],[118,118,119,121,122,123,124],[125,125,126,128,129,130,131]],
  12:[[102,103,104,105,107,108,108],[116,116,117,119,120,121,122],[119,120,121,123,124,125,126],[126,127,128,130,131,132,133]],
  13:[[104,105,106,107,109,110,110],[117,118,119,121,122,123,124],[121,122,123,124,126,127,128],[128,129,130,131,133,134,135]],
  14:[[106,106,107,109,110,111,112],[119,120,121,122,124,125,125],[123,123,125,126,127,129,129],[130,130,132,133,134,136,136]],
  15:[[107,108,109,110,111,113,113],[120,121,122,123,125,126,127],[124,125,126,127,129,130,131],[131,132,133,134,136,137,138]],
  16:[[108,108,110,111,112,114,114],[121,121,123,124,125,127,127],[125,125,126,128,129,130,131],[132,132,134,135,136,138,138]],
  17:[[108,109,110,111,113,114,115],[122,122,123,125,126,127,128],[125,126,127,128,130,131,132],[132,133,134,135,137,138,139]],
};
const DBP_G: Record<number,BPRows> = {
  1:[[38,38,39,39,40,41,41],[52,53,53,54,55,55,56],[56,57,57,58,59,59,60],[64,64,65,66,66,67,67]],
  2:[[43,43,44,44,45,46,46],[58,58,58,59,60,60,61],[62,62,63,63,64,65,65],[69,70,70,71,72,72,73]],
  3:[[47,47,48,48,49,50,50],[61,62,62,63,63,64,64],[65,66,66,67,68,68,69],[73,73,74,75,75,76,76]],
  4:[[50,50,51,52,52,53,53],[64,64,65,65,66,67,67],[68,68,69,69,70,71,71],[76,76,77,77,78,79,79]],
  5:[[52,52,53,54,54,55,55],[66,67,67,68,68,69,69],[70,71,71,72,73,73,74],[78,79,79,80,80,81,81]],
  6:[[54,54,55,55,56,57,57],[68,68,69,69,70,70,71],[72,72,73,73,74,75,75],[80,80,81,81,82,83,83]],
  7:[[55,56,56,57,57,58,58],[69,69,70,71,71,72,72],[73,74,74,74,75,76,76],[82,82,82,82,83,84,84]],
  8:[[57,57,57,58,59,59,60],[71,71,71,72,72,73,74],[75,75,75,76,77,77,78],[83,83,83,84,85,85,86]],
  9:[[58,58,59,59,60,61,61],[72,72,73,73,74,74,75],[76,76,77,77,78,79,79],[84,84,85,85,86,87,87]],
  10:[[59,59,59,60,61,61,62],[73,73,73,74,74,75,75],[77,77,77,78,78,79,79],[85,85,85,86,86,87,87]],
  11:[[60,60,60,61,61,62,62],[74,74,74,74,75,75,76],[78,78,78,78,79,79,80],[86,86,86,86,87,87,88]],
  12:[[61,61,61,62,62,63,63],[75,75,75,75,76,76,77],[79,79,79,79,80,80,81],[87,87,87,87,88,88,89]],
  13:[[62,62,62,63,63,64,64],[76,76,76,77,77,78,78],[80,80,80,81,81,82,82],[88,88,88,89,89,90,90]],
  14:[[63,63,63,64,65,65,66],[77,77,77,78,78,79,79],[81,81,81,82,82,83,83],[89,89,89,90,90,91,91]],
  15:[[64,64,65,66,66,67,67],[78,78,79,79,80,81,81],[82,82,83,83,84,85,85],[90,90,91,91,92,93,93]],
  16:[[64,65,65,66,67,67,68],[78,78,79,80,80,81,81],[82,82,83,84,84,85,85],[90,90,91,92,92,93,93]],
  17:[[64,65,65,66,66,67,67],[78,78,79,79,80,81,81],[82,82,83,83,84,85,85],[90,90,91,91,92,93,93]],
};

// ─── WHO Weight-for-Age (p3, p15, p50, p85, p97) ─────────────────────────────
const WHO_W_B: Record<number,[number,number,number,number,number]> = {
  0:[2.5,3.0,3.5,4.0,4.4],3:[5.0,5.7,6.4,7.2,7.9],6:[6.4,7.1,7.9,8.8,9.7],
  9:[7.1,8.0,8.9,9.9,10.9],12:[7.7,8.7,9.6,10.7,11.5],18:[9.1,10.2,11.1,12.3,13.3],
  24:[10.4,11.5,12.5,13.9,15.0],36:[11.9,13.3,14.6,16.3,17.8],48:[13.0,14.8,16.3,18.4,20.2],
  60:[14.1,16.2,18.0,20.7,23.0],72:[15.3,17.7,19.8,23.0,25.6],84:[16.6,19.2,21.5,25.3,28.5],
  96:[18.0,20.9,23.6,28.0,32.0],108:[19.5,22.9,26.0,31.2,36.2],120:[21.3,25.1,28.9,35.1,41.2],
  144:[27.0,32.0,37.5,46.0,55.0],168:[39.0,47.0,56.0,67.0,78.0],192:[52.0,63.0,73.0,85.0,96.0],
  216:[58.0,70.0,80.0,93.0,104.0],
};
const WHO_W_G: Record<number,[number,number,number,number,number]> = {
  0:[2.4,2.8,3.2,3.7,4.2],3:[4.6,5.2,5.8,6.6,7.3],6:[6.0,6.7,7.3,8.2,9.1],
  9:[6.7,7.5,8.2,9.2,10.2],12:[7.1,8.0,8.9,10.0,11.0],18:[8.4,9.4,10.2,11.6,12.8],
  24:[9.8,10.8,11.9,13.2,14.4],36:[11.3,12.7,14.1,15.9,17.4],48:[12.6,14.2,15.8,18.1,20.1],
  60:[13.7,15.6,17.5,20.4,23.0],72:[14.9,17.0,19.2,22.8,26.0],84:[16.2,18.7,21.2,25.6,29.7],
  96:[17.6,20.5,23.6,29.1,34.3],108:[19.3,22.8,26.5,33.2,39.9],120:[21.5,25.6,30.0,38.0,46.4],
  144:[29.0,35.5,42.5,54.0,64.0],168:[42.0,50.0,58.0,70.0,80.0],192:[48.0,56.0,64.0,76.0,87.0],
  216:[49.0,57.0,65.0,77.0,88.0],
};

function whoWeightPct(wtKg: number, ageMonths: number, sex: "M"|"F") {
  const tbl = sex === "M" ? WHO_W_B : WHO_W_G;
  const keys = Object.keys(tbl).map(Number).sort((a,b)=>a-b);
  let nearest = keys[0];
  for (const k of keys) { if (Math.abs(k-ageMonths)<Math.abs(nearest-ageMonths)) nearest=k; }
  const [p3,p15,p50,p85,p97] = tbl[nearest];
  const sd = (p97-p3)/(2*1.88);
  const z = sd > 0 ? (wtKg-p50)/sd : 0;
  return { z: Math.round(z*100)/100, pct: zToPct(z), p50 };
}

// ─── BP look-up and derived thresholds ───────────────────────────────────────
interface BPThresholds {
  sbp50:number; sbp75:number; sbp90:number; sbp95:number; sbp99:number;
  dbp50:number; dbp75:number; dbp90:number; dbp95:number; dbp99:number;
  htColLabel: string; htPct: number; htZ: number;
}

function getBPThresholds(ageYears:number, sex:"M"|"F", htCm:number): BPThresholds | null {
  const age = Math.max(1, Math.min(17, Math.round(ageYears)));
  const sbpTbl = sex==="M" ? SBP_B : SBP_G;
  const dbpTbl = sex==="M" ? DBP_B : DBP_G;
  const sbpR = sbpTbl[age]; const dbpR = dbpTbl[age];
  if (!sbpR||!dbpR) return null;
  const { z: htZ, pct: htPct, col, colLabel: htColLabel } = heightZAndPct(htCm, age, sex);
  // p75 = p50 + (Z75/Z90) × (p90 - p50) = p50 + 0.526 × (p90 - p50)
  const sbp50=sbpR[0][col], sbp90=sbpR[1][col], sbp95=sbpR[2][col], sbp99=sbpR[3][col];
  const dbp50=dbpR[0][col], dbp90=dbpR[1][col], dbp95=dbpR[2][col], dbp99=dbpR[3][col];
  const sbp75 = Math.round(sbp50 + 0.526*(sbp90-sbp50));
  const dbp75 = Math.round(dbp50 + 0.526*(dbp90-dbp50));
  return {sbp50,sbp75,sbp90,sbp95,sbp99,dbp50,dbp75,dbp90,dbp95,dbp99,htColLabel,htPct,htZ};
}

// ─── AAP 2017 exact BP percentile for a measured value ───────────────────────
function bpExactPct(measured:number, p50:number, p95:number): number {
  // SD estimated from (p95−p50)/1.6449
  const sd = (p95-p50)/1.6449;
  if (sd<=0) return 50;
  return zToPct((measured-p50)/sd);
}

// ─── AAP 2017 Classification ──────────────────────────────────────────────────
type BPClass = { label:string; shortLabel:string; color:string; level:number };

function classifyAAP2017(
  sbp:number, dbp:number,
  thresholds:BPThresholds,
  ageYears:number
): { sbp:BPClass; dbp:BPClass; overall:BPClass } {
  function category(val:number, p50:number, p90:number, p95:number, isAdolescent:boolean, isDBP:boolean): BPClass {
    const stage2Thresh = p95 + 12;
    // Stage 2
    if (val >= stage2Thresh || (isAdolescent && val >= (isDBP?90:140)))
      return { label:"Stage 2 Hypertension",shortLabel:"Stage 2 HTN",color:"#DC2626",level:3 };
    // Stage 1
    if (val >= p95 || (isAdolescent && val >= (isDBP?80:130)))
      return { label:"Stage 1 Hypertension",shortLabel:"Stage 1 HTN",color:"#EA580C",level:2 };
    // Elevated
    if (val >= p90 || (isAdolescent && !isDBP && val>=120))
      return { label:"Elevated BP",shortLabel:"Elevated",color:"#D97706",level:1 };
    return { label:"Normal",shortLabel:"Normal",color:"#16A34A",level:0 };
  }
  const isAdol = ageYears >= 13;
  const sbpCat = category(sbp,thresholds.sbp50,thresholds.sbp90,thresholds.sbp95,isAdol,false);
  const dbpCat = category(dbp,thresholds.dbp50,thresholds.dbp90,thresholds.dbp95,isAdol,true);
  const overall = sbpCat.level>=dbpCat.level ? sbpCat : dbpCat;
  return { sbp:sbpCat, dbp:dbpCat, overall };
}

// ─── Helper: format percentile display ───────────────────────────────────────
function fmtPct(p:number) {
  if (p>=99.5) return ">99th";
  if (p<=0.5)  return "<1st";
  const r = Math.round(p);
  if (r===1||r===21||r===31||r===41||r===51||r===61||r===71||r===81||r===91) return `${r}st`;
  if (r===2||r===22||r===32||r===42||r===52||r===62||r===72||r===82||r===92) return `${r}nd`;
  if (r===3||r===23||r===33||r===43||r===53||r===63||r===73||r===83||r===93) return `${r}rd`;
  return `${r}th`;
}

// ─── Percentile bar ───────────────────────────────────────────────────────────
function PctBar({ pct, color, isDark }: { pct:number; color:string; isDark:boolean }) {
  const clamped = Math.min(99.9, Math.max(0.1, pct));
  return (
    <View style={{ height:8, borderRadius:4, backgroundColor:isDark?"#1E3A5F":"#E2E8F0", overflow:"hidden", marginTop:4 }}>
      <View style={{ height:8, width:`${clamped}%` as any, backgroundColor:color, borderRadius:4 }} />
      {/* Threshold marks */}
      {[50,75,90,95].map(t=>(
        <View key={t} style={{ position:"absolute", left:`${t}%` as any, top:0, width:1.5, height:8, backgroundColor:isDark?"#FFFFFF40":"#00000020" }}/>
      ))}
    </View>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
interface Props { isDark: boolean }

export function BPGrowthCalc({ isDark }: Props) {
  const bg    = isDark ? "#0B132B" : "#F0F4F8";
  const card  = isDark ? "#0F1F2E" : "#FFFFFF";
  const card2 = isDark ? "#112240" : "#F8FAFC";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const tp    = isDark ? "#CCD6F6" : "#0D1B2A";
  const tm    = isDark ? "#8892B0" : "#64748B";

  const [sex,   setSex]   = useState<"M"|"F">("M");
  const [yrStr, setYrStr] = useState("");
  const [moStr, setMoStr] = useState("");
  const [htStr, setHtStr] = useState("");
  const [wtStr, setWtStr] = useState("");
  const [wtUnit,setWtUnit] = useState<"kg"|"lbs">("kg");
  const [sbpStr,setSbpStr] = useState("");
  const [dbpStr,setDbpStr] = useState("");

  const years   = parseFloat(yrStr) || 0;
  const months  = parseInt(moStr)   || 0;
  const totalYears = years + months / 12;
  const totalMonths = Math.round(totalYears * 12);
  const htCm    = parseFloat(htStr) || 0;
  const wtRaw   = parseFloat(wtStr) || 0;
  const wtKg    = wtUnit==="lbs" ? +(wtRaw*0.453592).toFixed(1) : wtRaw;
  const sbp     = parseFloat(sbpStr) || 0;
  const dbp     = parseFloat(dbpStr) || 0;

  const thresholds = useMemo(()=>{
    if (totalYears<1||totalYears>17||htCm<=0) return null;
    return getBPThresholds(totalYears,sex,htCm);
  },[totalYears,sex,htCm]);

  const classification = useMemo(()=>{
    if (!thresholds||sbp<=0) return null;
    return classifyAAP2017(sbp,dbp,thresholds,totalYears);
  },[thresholds,sbp,dbp,totalYears]);

  const sbpExactPct = thresholds&&sbp>0 ? bpExactPct(sbp,thresholds.sbp50,thresholds.sbp95) : null;
  const dbpExactPct = thresholds&&dbp>0 ? bpExactPct(dbp,thresholds.dbp50,thresholds.dbp95) : null;

  const htInfo = useMemo(()=>{
    if (totalYears<1||totalYears>17||htCm<=0) return null;
    return heightZAndPct(htCm,totalYears,sex);
  },[totalYears,sex,htCm]);

  const wtInfo = useMemo(()=>{
    if (wtKg<=0||totalMonths<=0) return null;
    return whoWeightPct(wtKg,totalMonths,sex);
  },[wtKg,totalMonths,sex]);

  const inp = {
    backgroundColor: isDark ? "#0A192F" : "#F1F5F9",
    borderWidth:1.5, borderRadius:10, borderColor:border,
    color:tp, fontSize:16, fontWeight:"700" as const,
    paddingHorizontal:12, paddingVertical:9,
  };

  const ROWS = thresholds ? [
    { pctLabel:"50th", sbp:thresholds.sbp50, dbp:thresholds.dbp50, color:"#16A34A" },
    { pctLabel:"75th", sbp:thresholds.sbp75, dbp:thresholds.dbp75, color:"#0891B2" },
    { pctLabel:"90th", sbp:thresholds.sbp90, dbp:thresholds.dbp90, color:"#D97706" },
    { pctLabel:"95th", sbp:thresholds.sbp95, dbp:thresholds.dbp95, color:"#EA580C" },
    { pctLabel:"99th", sbp:thresholds.sbp99, dbp:thresholds.dbp99, color:"#DC2626" },
  ] : [];

  return (
    <View style={{ backgroundColor:card, borderRadius:16, borderWidth:1.5, borderColor:"#0891B230", overflow:"hidden" }}>

      {/* ── Header ── */}
      <View style={{ backgroundColor:"#0891B2", paddingHorizontal:16, paddingVertical:12, flexDirection:"row", alignItems:"center", gap:10 }}>
        <View style={{ width:32,height:32,borderRadius:10,backgroundColor:"#FFFFFF20",alignItems:"center",justifyContent:"center" }}>
          <Feather name="activity" size={18} color="#FFFFFF"/>
        </View>
        <View style={{ flex:1 }}>
          <Text style={{ color:"#FFFFFF",fontSize:15,fontWeight:"800",letterSpacing:-0.3 }}>BP & Growth Centile Calculator</Text>
          <Text style={{ color:"rgba(255,255,255,0.8)",fontSize:11,marginTop:1 }}>AAP 2017 · NHBPEP 4th Report · Ages 1–17 years</Text>
        </View>
      </View>

      <View style={{ padding:14, gap:12 }}>

        {/* ── Sex ── */}
        <View style={{ flexDirection:"row", gap:8 }}>
          {(["M","F"] as const).map(s=>(
            <TouchableOpacity key={s} onPress={()=>setSex(s)}
              style={{ flex:1,paddingVertical:10,borderRadius:10,alignItems:"center",
                backgroundColor: sex===s ? (s==="M"?"#0891B2":"#A855F7") : isDark?"#0A192F":"#F1F5F9",
                borderWidth:1.5, borderColor: sex===s ? (s==="M"?"#0891B2":"#A855F7") : border }}>
              <Text style={{ fontWeight:"700",fontSize:14,color:sex===s?"#FFFFFF":tm }}>
                {s==="M"?"♂ Male":"♀ Female"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Age row ── */}
        <View style={{ flexDirection:"row", gap:8, alignItems:"flex-end" }}>
          <View style={{ flex:1.2 }}>
            <Text style={{ fontSize:11,fontWeight:"700",color:tm,marginBottom:6,textTransform:"uppercase",letterSpacing:0.4 }}>Years</Text>
            <TextInput style={inp} value={yrStr} onChangeText={setYrStr} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={tm}/>
          </View>
          <View style={{ flex:1 }}>
            <Text style={{ fontSize:11,fontWeight:"700",color:tm,marginBottom:6,textTransform:"uppercase",letterSpacing:0.4 }}>Months</Text>
            <TextInput style={inp} value={moStr} onChangeText={setMoStr} keyboardType="number-pad" placeholder="0" placeholderTextColor={tm} maxLength={2}/>
          </View>
          <View style={{ flex:1.5, paddingBottom:1 }}>
            <Text style={{ fontSize:12,color:tm,fontStyle:"italic" }}>
              {totalYears>0 ? `= ${totalYears<1?`${totalMonths} mo`:`${totalYears.toFixed(1)} yr`}` : ""}
            </Text>
          </View>
        </View>

        {/* ── Height ── */}
        <View>
          <Text style={{ fontSize:11,fontWeight:"700",color:tm,marginBottom:6,textTransform:"uppercase",letterSpacing:0.4 }}>Height (cm)</Text>
          <TextInput style={inp} value={htStr} onChangeText={setHtStr} keyboardType="decimal-pad" placeholder="e.g. 130" placeholderTextColor={tm}/>
        </View>

        {/* ── Weight ── */}
        <View>
          <Text style={{ fontSize:11,fontWeight:"700",color:tm,marginBottom:6,textTransform:"uppercase",letterSpacing:0.4 }}>Weight</Text>
          <View style={{ flexDirection:"row",gap:8 }}>
            <TextInput style={[inp,{flex:1}]} value={wtStr} onChangeText={setWtStr} keyboardType="decimal-pad" placeholder="e.g. 40" placeholderTextColor={tm}/>
            <View style={{ flexDirection:"row",borderRadius:10,overflow:"hidden",borderWidth:1.5,borderColor:border }}>
              {(["kg","lbs"] as const).map(u=>(
                <TouchableOpacity key={u} onPress={()=>setWtUnit(u)}
                  style={{ paddingHorizontal:14,paddingVertical:9,backgroundColor:wtUnit===u?"#0891B2":isDark?"#0A192F":"#F1F5F9" }}>
                  <Text style={{ fontWeight:"700",fontSize:13,color:wtUnit===u?"#FFFFFF":tm }}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {wtUnit==="lbs"&&wtRaw>0&&<Text style={{ fontSize:11,color:tm,marginTop:4 }}>= {wtKg} kg</Text>}
        </View>

        {/* ── Actual BP ── */}
        <View style={{ flexDirection:"row", gap:8 }}>
          <View style={{ flex:1 }}>
            <Text style={{ fontSize:11,fontWeight:"700",color:tm,marginBottom:6,textTransform:"uppercase",letterSpacing:0.4 }}>Systolic (mmHg)</Text>
            <TextInput style={inp} value={sbpStr} onChangeText={setSbpStr} keyboardType="decimal-pad" placeholder="e.g. 120" placeholderTextColor={tm}/>
          </View>
          <View style={{ flex:1 }}>
            <Text style={{ fontSize:11,fontWeight:"700",color:tm,marginBottom:6,textTransform:"uppercase",letterSpacing:0.4 }}>Diastolic (mmHg)</Text>
            <TextInput style={inp} value={dbpStr} onChangeText={setDbpStr} keyboardType="decimal-pad" placeholder="e.g. 78" placeholderTextColor={tm}/>
          </View>
        </View>

        {/* ── Out-of-range warning ── */}
        {totalYears>0&&(totalYears<1||totalYears>17)&&(
          <View style={{ flexDirection:"row",alignItems:"center",gap:8,backgroundColor:"#FEF3C7",borderRadius:10,padding:10 }}>
            <Feather name="alert-triangle" size={14} color="#92400E"/>
            <Text style={{ flex:1,fontSize:12,color:"#92400E" }}>BP tables available for ages 1–17 years (NHBPEP 4th Report)</Text>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            GROWTH CENTILE CARD
        ═══════════════════════════════════════════════════════ */}
        {(htInfo||wtInfo)&&(
          <View style={{ backgroundColor:isDark?"#0A192F":"#F0FDF4", borderRadius:12, borderWidth:1.5, borderColor:isDark?"#1A3A2A":"#86EFAC", padding:12, gap:8 }}>
            <Text style={{ fontSize:12,fontWeight:"800",color:"#16A34A",marginBottom:2 }}>Growth Centiles</Text>

            {htInfo&&(
              <View>
                <View style={{ flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:3 }}>
                  <Text style={{ fontSize:12,color:tm }}>Height ({htCm} cm)</Text>
                  <View style={{ flexDirection:"row",alignItems:"center",gap:6 }}>
                    <Text style={{ fontSize:14,fontWeight:"800",color:"#16A34A" }}>{fmtPct(htInfo.pct)} pct</Text>
                    <Text style={{ fontSize:11,color:tm }}>z = {htInfo.z>0?"+":""}{htInfo.z}</Text>
                  </View>
                </View>
                <PctBar pct={htInfo.pct} color="#16A34A" isDark={isDark}/>
                <Text style={{ fontSize:10,color:tm,marginTop:3 }}>
                  BP table column: <Text style={{ fontWeight:"700" }}>{htInfo.colLabel} ht percentile</Text>
                  {sex==="M"?" · Boys":" · Girls"}
                </Text>
              </View>
            )}

            {wtInfo&&(
              <View style={{ marginTop:4 }}>
                <View style={{ flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:3 }}>
                  <Text style={{ fontSize:12,color:tm }}>Weight ({wtKg} kg)</Text>
                  <View style={{ flexDirection:"row",alignItems:"center",gap:6 }}>
                    <Text style={{
                      fontSize:14,fontWeight:"800",
                      color:wtInfo.z<-2?"#DC2626":wtInfo.z<-1?"#D97706":wtInfo.z>2?"#EA580C":"#16A34A"
                    }}>{fmtPct(wtInfo.pct)} pct</Text>
                    <Text style={{ fontSize:11,color:tm }}>z = {wtInfo.z>0?"+":""}{wtInfo.z}</Text>
                  </View>
                </View>
                <PctBar
                  pct={wtInfo.pct}
                  color={wtInfo.z<-2?"#DC2626":wtInfo.z<-1?"#D97706":wtInfo.z>2?"#EA580C":"#16A34A"}
                  isDark={isDark}
                />
                <Text style={{ fontSize:10,color:tm,marginTop:3 }}>WHO median for age: {wtInfo.p50} kg</Text>
              </View>
            )}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            BP THRESHOLDS TABLE
        ═══════════════════════════════════════════════════════ */}
        {thresholds&&(
          <View style={{ backgroundColor:card2, borderRadius:12, borderWidth:1.5, borderColor:border, overflow:"hidden" }}>
            {/* Table header */}
            <View style={{ flexDirection:"row", backgroundColor:"#0891B210", paddingVertical:8, paddingHorizontal:12, borderBottomWidth:1, borderBottomColor:border }}>
              <Text style={{ flex:1.2,fontSize:11,fontWeight:"800",color:"#0891B2" }}>PERCENTILE</Text>
              <Text style={{ flex:1,fontSize:11,fontWeight:"800",color:"#0891B2",textAlign:"center" }}>SBP (mmHg)</Text>
              <Text style={{ flex:1,fontSize:11,fontWeight:"800",color:"#0891B2",textAlign:"center" }}>DBP (mmHg)</Text>
            </View>

            {ROWS.map((row,i)=>{
              const sbpHit = sbp>0 && sbp >= row.sbp && (i===ROWS.length-1 || sbp < ROWS[i+1].sbp);
              const dbpHit = dbp>0 && dbp >= row.dbp && (i===ROWS.length-1 || dbp < ROWS[i+1].dbp);
              return (
                <View key={row.pctLabel}
                  style={{ flexDirection:"row", alignItems:"center", paddingVertical:8, paddingHorizontal:12,
                    borderBottomWidth: i<ROWS.length-1?1:0, borderBottomColor:border,
                    backgroundColor: (sbpHit||dbpHit) ? row.color+"14" : "transparent" }}>
                  <View style={{ flex:1.2,flexDirection:"row",alignItems:"center",gap:5 }}>
                    <View style={{ width:8,height:8,borderRadius:4,backgroundColor:row.color }}/>
                    <Text style={{ fontSize:13,fontWeight:"700",color:row.color }}>{row.pctLabel}</Text>
                  </View>
                  <View style={{ flex:1,alignItems:"center" }}>
                    <Text style={{ fontSize:14,fontWeight:"700",color:(sbpHit?row.color:tp) }}>{row.sbp}</Text>
                    {sbpHit&&<Text style={{ fontSize:9,color:row.color,fontWeight:"700" }}>← your SBP</Text>}
                  </View>
                  <View style={{ flex:1,alignItems:"center" }}>
                    <Text style={{ fontSize:14,fontWeight:"700",color:(dbpHit?row.color:tp) }}>{row.dbp}</Text>
                    {dbpHit&&<Text style={{ fontSize:9,color:row.color,fontWeight:"700" }}>← your DBP</Text>}
                  </View>
                </View>
              );
            })}

            <View style={{ padding:10, borderTopWidth:1, borderTopColor:border, backgroundColor:"#0891B208" }}>
              <Text style={{ fontSize:10,color:tm }}>
                Height column used: <Text style={{ fontWeight:"700" }}>{thresholds.htColLabel}</Text> percentile
                {" "}(actual ht = <Text style={{ fontWeight:"700" }}>{htCm} cm</Text>,
                {" "}ht z = {thresholds.htZ>0?"+":""}{thresholds.htZ})
              </Text>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            EXACT PERCENTILE BARS
        ═══════════════════════════════════════════════════════ */}
        {thresholds&&sbp>0&&sbpExactPct!==null&&(
          <View style={{ backgroundColor:card2, borderRadius:12, borderWidth:1.5, borderColor:border, padding:12, gap:10 }}>
            <Text style={{ fontSize:12,fontWeight:"800",color:tp }}>Your Patient's BP Percentile</Text>
            {/* SBP */}
            <View>
              <View style={{ flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:3 }}>
                <Text style={{ fontSize:12,color:tm }}>SBP {sbp} mmHg</Text>
                <Text style={{ fontSize:15,fontWeight:"800",color:classification?.sbp.color||tp }}>
                  {fmtPct(sbpExactPct)} pct
                </Text>
              </View>
              <PctBar pct={sbpExactPct} color={classification?.sbp.color||"#0891B2"} isDark={isDark}/>
            </View>
            {/* DBP */}
            {dbp>0&&dbpExactPct!==null&&(
              <View>
                <View style={{ flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:3 }}>
                  <Text style={{ fontSize:12,color:tm }}>DBP {dbp} mmHg</Text>
                  <Text style={{ fontSize:15,fontWeight:"800",color:classification?.dbp.color||tp }}>
                    {fmtPct(dbpExactPct)} pct
                  </Text>
                </View>
                <PctBar pct={dbpExactPct} color={classification?.dbp.color||"#0891B2"} isDark={isDark}/>
              </View>
            )}
            <View style={{ flexDirection:"row",alignItems:"center",gap:8 }}>
              {[{l:"50th",c:"#16A34A"},{l:"75th",c:"#0891B2"},{l:"90th",c:"#D97706"},{l:"95th",c:"#EA580C"}].map(m=>(
                <View key={m.l} style={{ flexDirection:"row",alignItems:"center",gap:3 }}>
                  <View style={{ width:6,height:6,backgroundColor:m.c,borderRadius:3 }}/>
                  <Text style={{ fontSize:9,color:tm }}>{m.l}</Text>
                </View>
              ))}
              <Text style={{ fontSize:9,color:tm,marginLeft:4 }}>threshold markers</Text>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            AAP 2017 CLASSIFICATION BANNER
        ═══════════════════════════════════════════════════════ */}
        {classification&&(
          <View>
            <View style={{ borderRadius:12, padding:14, backgroundColor:classification.overall.color+"18",
              borderWidth:2, borderColor:classification.overall.color+"60", flexDirection:"row", alignItems:"center", gap:12 }}>
              <View style={{ width:44,height:44,borderRadius:22,backgroundColor:classification.overall.color+"25",
                alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Feather
                  name={classification.overall.level===0?"check-circle":classification.overall.level===3?"alert-circle":"alert-triangle"}
                  size={22} color={classification.overall.color}/>
              </View>
              <View style={{ flex:1 }}>
                <Text style={{ fontSize:16,fontWeight:"800",color:classification.overall.color }}>
                  {classification.overall.label}
                </Text>
                <Text style={{ fontSize:11,color:tm,marginTop:3 }}>
                  SBP: <Text style={{ color:classification.sbp.color,fontWeight:"700" }}>{classification.sbp.shortLabel}</Text>
                  {"  "}DBP: <Text style={{ color:classification.dbp.color,fontWeight:"700" }}>{classification.dbp.shortLabel}</Text>
                </Text>
                <Text style={{ fontSize:10,color:tm,marginTop:2 }}>
                  AAP 2017 CPG · {totalYears>=13?"Adolescent (absolute + percentile criteria)":"Paediatric (percentile criteria)"}
                </Text>
              </View>
            </View>

            {/* Interpretation notes */}
            {classification.overall.level>=2&&(
              <View style={{ marginTop:8, backgroundColor:"#FEF2F2",borderRadius:10,padding:10,borderLeftWidth:3,borderLeftColor:"#DC2626" }}>
                <Text style={{ fontSize:12,color:"#991B1B",fontWeight:"700",marginBottom:3 }}>Clinical Guidance</Text>
                <Text style={{ fontSize:12,color:"#7F1D1D",lineHeight:18 }}>
                  {classification.overall.level===3
                    ? "Stage 2 HTN: Confirm on repeat measurement. Prompt evaluation. If symptomatic, consider urgent referral. Initiate pharmacotherapy."
                    : "Stage 1 HTN: Repeat BP in 1–2 weeks. Lifestyle intervention. If persists on 3 visits, initiate full evaluation."}
                </Text>
              </View>
            )}
            {classification.overall.level===1&&(
              <View style={{ marginTop:8, backgroundColor:"#FFFBEB",borderRadius:10,padding:10,borderLeftWidth:3,borderLeftColor:"#D97706" }}>
                <Text style={{ fontSize:12,color:"#92400E",fontWeight:"700",marginBottom:3 }}>Clinical Guidance</Text>
                <Text style={{ fontSize:12,color:"#78350F",lineHeight:18 }}>
                  Elevated BP: Repeat in 6 months. Counsel on healthy weight, diet (DASH), physical activity, screen-time reduction. No pharmacotherapy yet.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Reference footer */}
        <Text style={{ fontSize:10,color:tm,fontStyle:"italic",textAlign:"center",paddingTop:4,lineHeight:15 }}>
          Flynn JT et al. AAP CPG. Pediatrics 2017;140:e20171904 · NHBPEP 4th Report 2004{"\n"}
          CDC 2000 Growth Charts · WHO Child Growth Standards
        </Text>
      </View>
    </View>
  );
}
