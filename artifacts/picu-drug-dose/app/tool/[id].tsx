/**
 * Full-screen tool detail — renders the appropriate clinical calculator
 * based on the route param `id` (growth | vis | bundles | fluids |
 * electrolytes | gcs | scores | renal | pews | apgar).
 */
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { useFavorites } from "@/context/FavoritesContext";
import { StarButton } from "@/components/StarButton";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

const C = Colors.light;

// ─── WHO Weight-for-Age Data ──────────────────────────────────────────────────
const WHO_W_BOYS: Record<number, [number, number, number, number, number]> = {
  0:[2.5,3.0,3.5,4.0,4.4],3:[5.0,5.7,6.4,7.2,7.9],6:[6.4,7.1,7.9,8.8,9.7],
  9:[7.1,8.0,8.9,9.9,10.9],12:[7.7,8.7,9.6,10.7,11.5],18:[9.1,10.2,11.1,12.3,13.3],
  24:[10.4,11.5,12.5,13.9,15.0],36:[11.9,13.3,14.6,16.3,17.8],48:[13.0,14.8,16.3,18.4,20.2],
  60:[14.1,16.2,18.0,20.7,23.0],72:[15.3,17.7,19.8,23.0,25.6],84:[16.6,19.2,21.5,25.3,28.5],
  96:[18.0,20.9,23.6,28.0,32.0],108:[19.5,22.9,26.0,31.2,36.2],120:[21.3,25.1,28.9,35.1,41.2],
  144:[27.0,32.0,37.5,46.0,55.0],168:[39.0,47.0,56.0,67.0,78.0],192:[52.0,63.0,73.0,85.0,96.0],
  216:[58.0,70.0,80.0,93.0,104.0],
};
const WHO_W_GIRLS: Record<number, [number, number, number, number, number]> = {
  0:[2.4,2.8,3.2,3.7,4.2],3:[4.6,5.2,5.8,6.6,7.3],6:[6.0,6.7,7.3,8.2,9.1],
  9:[6.7,7.5,8.2,9.2,10.2],12:[7.1,8.0,8.9,10.0,11.0],18:[8.4,9.4,10.2,11.6,12.8],
  24:[9.8,10.8,11.9,13.2,14.4],36:[11.3,12.7,14.1,15.9,17.4],48:[12.6,14.2,15.8,18.1,20.1],
  60:[13.7,15.6,17.5,20.4,23.0],72:[14.9,17.0,19.2,22.8,26.0],84:[16.2,18.7,21.2,25.6,29.7],
  96:[17.6,20.5,23.6,29.1,34.3],108:[19.3,22.8,26.5,33.2,39.9],120:[21.5,25.6,30.0,38.0,46.4],
  144:[29.0,35.5,42.5,54.0,64.0],168:[42.0,50.0,58.0,70.0,80.0],192:[48.0,56.0,64.0,76.0,87.0],
  216:[49.0,57.0,65.0,77.0,88.0],
};

function findNearestAge(ageMonths: number, table: Record<number, [number,number,number,number,number]>): [number,number,number,number,number] {
  const keys = Object.keys(table).map(Number).sort((a,b)=>a-b);
  let nearest = keys[0];
  for (const k of keys) { if (Math.abs(k-ageMonths) < Math.abs(nearest-ageMonths)) nearest = k; }
  return table[nearest];
}

function estimatePercentile(val: number, refs: [number,number,number,number,number]) {
  const [p3,p15,p50,p85,p97] = refs;
  const sd = (p97-p3)/(2*1.88);
  const zscore = sd > 0 ? (val-p50)/sd : 0;
  const zRounded = Math.round(zscore*10)/10;
  let nutritionStatus: string, nutritionColor: string, samAlert = false;
  if (zscore<-3){nutritionStatus="Severe Acute Malnutrition (SAM)";nutritionColor="#DC2626";samAlert=true;}
  else if (zscore<-2){nutritionStatus="Moderate Acute Malnutrition (MAM)";nutritionColor="#D97706";}
  else if (zscore<=2){nutritionStatus="Normal";nutritionColor="#16A34A";}
  else if (zscore<=3){nutritionStatus="Overweight";nutritionColor="#D97706";}
  else{nutritionStatus="Obese";nutritionColor="#DC2626";}
  let label:string,color:string,note:string,band:number;
  if (val<p3){label="<3rd percentile";color="#DC2626";note="Significantly below expected weight for age";band=0;}
  else if (val<p15){label="3rd–15th percentile";color="#D97706";note="Below average — monitor closely";band=1;}
  else if (val<p50){label="15th–50th percentile";color="#16A34A";note="Low-normal range";band=2;}
  else if (val<p85){label="50th–85th percentile";color="#16A34A";note="Normal range";band=3;}
  else if (val<p97){label="85th–97th percentile";color="#D97706";note="Above average — assess for obesity risk";band=4;}
  else{label=">97th percentile";color="#DC2626";note="Obese range — clinical review recommended";band=5;}
  return{label,color,note,zscore:zRounded,nutritionStatus,nutritionColor,samAlert,band};
}

// ─── BP Tables (NHBPEP Fourth Report) ────────────────────────────────────────
type BPRow = [number[], number[], number[], number[]];
const BP_BOYS_SBP: Record<number, BPRow> = {
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
const BP_GIRLS_SBP: Record<number, BPRow> = {
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
const BP_BOYS_DBP: Record<number, BPRow> = {
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
const BP_GIRLS_DBP: Record<number, BPRow> = {
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
const HT_BOYS_PCT: Record<number, number[]> = {
  1:[71,73,75,76,78,80,81],2:[82,83,86,87,89,91,92],3:[89,91,93,96,98,100,101],
  4:[96,98,100,103,105,107,109],5:[102,104,107,110,113,115,116],6:[108,110,113,116,119,122,123],
  7:[114,116,119,122,125,128,129],8:[119,122,125,128,131,134,136],9:[124,127,130,133,137,140,142],
  10:[129,132,135,138,142,146,148],11:[134,137,141,144,148,152,154],12:[139,142,147,151,156,161,163],
  13:[145,148,153,157,162,168,170],14:[151,154,159,164,169,174,176],15:[156,159,164,170,175,179,181],
  16:[159,162,167,173,178,182,184],17:[161,163,168,175,180,184,186],
};
const HT_GIRLS_PCT: Record<number, number[]> = {
  1:[69,71,73,75,77,78,79],2:[80,82,84,86,88,90,91],3:[88,90,92,95,97,99,100],
  4:[95,97,99,102,104,106,107],5:[101,103,106,109,111,113,115],6:[107,109,112,115,118,120,122],
  7:[112,115,118,121,124,127,128],8:[118,120,124,127,130,133,135],9:[123,126,129,133,136,139,141],
  10:[128,131,135,138,142,145,147],11:[133,137,141,145,148,152,154],12:[139,142,147,151,154,157,159],
  13:[144,147,151,156,159,162,163],14:[148,151,155,160,163,165,166],15:[150,153,157,162,165,167,168],
  16:[151,154,158,163,166,168,169],17:[151,155,159,163,167,169,170],
};
const HT_PCT_LABELS = ["5th","10th","25th","50th","75th","90th","95th"];

function getHeightColIndex(ht: number, htPcts: number[]): number {
  if (ht<htPcts[1]) return 0; if (ht<htPcts[2]) return 1;
  if (ht<htPcts[3]) return 2; if (ht<htPcts[4]) return 3;
  if (ht<htPcts[5]) return 4; if (ht<htPcts[6]) return 5; return 6;
}
function getBPBand(val: number, p50: number, p90: number, p95: number): number {
  if (val<p50) return 0; if (val<p90) return 1; if (val<p95) return 2; return 3;
}
interface BPCalcResult {
  col: number; htLabel: string;
  sbp50: number; sbp90: number; sbp95: number; sbp99: number;
  dbp50: number; dbp90: number; dbp95: number; dbp99: number;
  sbpBand: number; dbpBand: number; overallBand: number;
  classification: string; color: string;
}
function classifyBP(ageYears: number, gender: "M"|"F", heightCm: number, sbp: number, dbp: number): BPCalcResult | null {
  const age = Math.round(ageYears);
  if (age<1||age>17) return null;
  const sbpTable = gender==="M" ? BP_BOYS_SBP : BP_GIRLS_SBP;
  const dbpTable = gender==="M" ? BP_BOYS_DBP : BP_GIRLS_DBP;
  const htTable  = gender==="M" ? HT_BOYS_PCT : HT_GIRLS_PCT;
  const sbpRow=sbpTable[age]; const dbpRow=dbpTable[age]; const htPcts=htTable[age];
  if (!sbpRow||!dbpRow||!htPcts) return null;
  const col=getHeightColIndex(heightCm,htPcts);
  const sbp50=sbpRow[0][col],sbp90=sbpRow[1][col],sbp95=sbpRow[2][col],sbp99=sbpRow[3][col];
  const dbp50=dbpRow[0][col],dbp90=dbpRow[1][col],dbp95=dbpRow[2][col],dbp99=dbpRow[3][col];
  const sbpBand=sbp>0?getBPBand(sbp,sbp50,sbp90,sbp95):-1;
  const dbpBand=dbp>0?getBPBand(dbp,dbp50,dbp90,dbp95):-1;
  const overallBand=Math.max(sbpBand,dbpBand);
  const BANDS=[
    {label:"Normotensive (<50th percentile)",color:"#16A34A"},
    {label:"High-Normal (50th–90th percentile)",color:"#0891B2"},
    {label:"Pre-hypertensive (90th–95th percentile)",color:"#D97706"},
    {label:"Hypertensive (>95th percentile)",color:"#DC2626"},
  ];
  const b=BANDS[overallBand]??BANDS[0];
  return {col,htLabel:HT_PCT_LABELS[col]??"50th",sbp50,sbp90,sbp95,sbp99,dbp50,dbp90,dbp95,dbp99,sbpBand,dbpBand,overallBand,classification:b.label,color:b.color};
}

// ─── VIS ─────────────────────────────────────────────────────────────────────
function calcVIS(d:{dopa:string;dobu:string;epi:string;mil:string;vaso:string;norepi:string}) {
  return +((parseFloat(d.dopa)||0)+(parseFloat(d.dobu)||0)+100*(parseFloat(d.epi)||0)+10*(parseFloat(d.mil)||0)+10000*(parseFloat(d.vaso)||0)+100*(parseFloat(d.norepi)||0)).toFixed(1);
}
function visInterpret(vis: number) {
  if (vis===0) return {label:"No vasoactive support",color:"#16A34A"};
  if (vis<=10) return {label:"Low vasoactive support",color:"#16A34A"};
  if (vis<=20) return {label:"Moderate support",color:"#D97706"};
  if (vis<=30) return {label:"High support",color:"#EA580C"};
  return {label:"Very high — critical haemodynamic compromise",color:"#DC2626"};
}

// ─── Holliday-Segar ───────────────────────────────────────────────────────────
function hollidaySegar(wt: number) {
  let daily = wt<=10 ? 100*wt : wt<=20 ? 1000+50*(wt-10) : 1500+20*(wt-20);
  return {daily:Math.round(daily),hourly:+(daily/24).toFixed(1)};
}

// ─── GCS ─────────────────────────────────────────────────────────────────────
const EYE_OPTIONS = [{val:4,label:"4 — Spontaneous"},{val:3,label:"3 — To voice"},{val:2,label:"2 — To pain"},{val:1,label:"1 — None"}];
const VERBAL_OPTIONS = [{val:5,label:"5 — Alert / Babbling / Oriented words"},{val:4,label:"4 — Confused / Less than usual words"},{val:3,label:"3 — Inappropriate words / Cries to pain"},{val:2,label:"2 — Incomprehensible / Moans to pain"},{val:1,label:"1 — None"}];
const MOTOR_OPTIONS = [{val:6,label:"6 — Obeys commands / Normal spontaneous"},{val:5,label:"5 — Localises pain"},{val:4,label:"4 — Withdraws to pain"},{val:3,label:"3 — Abnormal flexion (Decorticate)"},{val:2,label:"2 — Extension (Decerebrate)"},{val:1,label:"1 — None"}];
function gcsInterpret(total: number) {
  if (total>=14) return {label:"Mild impairment",color:"#16A34A"};
  if (total>=9) return {label:"Moderate impairment",color:"#D97706"};
  return {label:"Severe impairment — consider intubation if GCS ≤8",color:"#DC2626"};
}

// ─── Vitals Table ─────────────────────────────────────────────────────────────
const VITALS_TABLE = [
  {age:"Neonate (0–4 wk)",hr:"100–170",sbp:"60–85",rr:"40–60",map:"45–60"},
  {age:"Infant (1–12 mo)",hr:"100–160",sbp:"70–100",rr:"30–53",map:"50–65"},
  {age:"Toddler (1–2 yr)",hr:"90–150",sbp:"80–110",rr:"24–40",map:"55–70"},
  {age:"Pre-school (3–5 yr)",hr:"80–140",sbp:"80–115",rr:"22–34",map:"60–75"},
  {age:"School (6–11 yr)",hr:"70–120",sbp:"90–125",rr:"18–30",map:"65–80"},
  {age:"Adolescent (≥12 yr)",hr:"60–100",sbp:"100–135",rr:"12–16",map:"70–90"},
];

// ─── Renal / Hepatic ──────────────────────────────────────────────────────────
const RENAL_DRUGS = [
  {drug:"Amikacin",adj:"Extend interval: CrCl 10–50 → q36h; CrCl <10 → q48h. Monitor troughs.",alert:"high"},
  {drug:"Gentamicin",adj:"Extend interval: CrCl 10–50 → q36h; CrCl <10 → q48h. Monitor levels.",alert:"high"},
  {drug:"Vancomycin",adj:"CrCl 10–50: q24–48h. CrCl <10: q48–96h. AUC/MIC monitoring preferred.",alert:"high"},
  {drug:"Meropenem",adj:"CrCl 26–50: normal dose q12h. CrCl 10–25: ½ dose q12h. CrCl <10: ½ dose q24h.",alert:"moderate"},
  {drug:"Ceftazidime",adj:"CrCl 10–50: 50% dose q12h. CrCl <10: 50% dose q24h.",alert:"moderate"},
  {drug:"Metronidazole",adj:"Severe renal failure: monitor for neurotoxicity. No dose change routinely.",alert:"low"},
  {drug:"Acyclovir",adj:"CrCl 10–50: reduce dose 50%. CrCl <10: reduce dose 75%. Ensure adequate hydration.",alert:"moderate"},
  {drug:"Furosemide",adj:"May need higher doses in renal failure. Avoid in anuria. Monitor electrolytes.",alert:"moderate"},
  {drug:"Midazolam",adj:"Metabolite accumulates in renal failure. Reduce dose and monitor CNS depression.",alert:"moderate"},
  {drug:"Morphine",adj:"Active metabolite (M6G) accumulates. Avoid or reduce dose by 50% in CrCl <30.",alert:"high"},
  {drug:"Fentanyl",adj:"Preferred opioid in renal failure — minimal active metabolites. Titrate carefully.",alert:"low"},
  {drug:"Ranitidine / Omeprazole",adj:"No significant renal adjustment required for standard doses.",alert:"low"},
];
const HEPATIC_DRUGS = [
  {drug:"Midazolam",adj:"Hepatic metabolism impaired — reduce dose 30–50%. Prolonged sedation risk.",alert:"high"},
  {drug:"Fentanyl",adj:"Use with caution; hepatic metabolism — monitor for accumulation.",alert:"moderate"},
  {drug:"Morphine",adj:"Reduce dose in hepatic failure. Risk of encephalopathy.",alert:"high"},
  {drug:"Metronidazole",adj:"Severe hepatic failure: reduce dose by 50%. Risk of encephalopathy.",alert:"moderate"},
  {drug:"Paracetamol",adj:"Avoid or reduce dose significantly in severe hepatic failure. Hepatotoxic in overdose.",alert:"high"},
  {drug:"Amiodarone",adj:"Use with caution — hepatotoxic. Monitor LFTs regularly.",alert:"moderate"},
  {drug:"Carbamazepine",adj:"May worsen hepatic failure. Monitor LFTs.",alert:"moderate"},
  {drug:"Fluconazole",adj:"Use with caution — hepatotoxic in high doses. Reduce dose in severe dysfunction.",alert:"moderate"},
];
function crclSeverity(v: number) {
  if (v>=60) return {label:"Normal/Mild",color:"#16A34A"};
  if (v>=30) return {label:"Moderate CKD",color:"#D97706"};
  if (v>=15) return {label:"Severe CKD",color:"#EA580C"};
  return {label:"Kidney Failure — adjust all renally-cleared drugs",color:"#DC2626"};
}

// ─── Care Bundles ──────────────────────────────────────────────────────────────
const FASTHUG_BUNDLE = [
  "Feeding — Enteral nutrition initiated within 24–48h if hemodynamically stable",
  "Analgesia — Assess pain (FLACC / VAS) every 4 hours; treat before sedation",
  "Sedation — Target RASS goal; avoid oversedation; daily SAT when feasible",
  "Thromboembolic prophylaxis — DVT prophylaxis (pharmacologic + mechanical) per protocol",
  "Head of Bed (HOB) elevation — 30–45° for all intubated patients",
  "Ulcer prophylaxis — Stress ulcer prophylaxis for high-risk patients (mechanical ventilation + coagulopathy)",
  "Glycemic control — Target 140–180 mg/dL; avoid hypoglycemia (<70 mg/dL)",
];
const VAP_BUNDLE_UPDATED = [
  "Head of bed elevated 30–45°","Daily sedation interruption (SAT) and assess readiness to extubate",
  "Daily spontaneous breathing trial (SBT) when SAT successful","Peptic ulcer disease (PUD) prophylaxis — PPI or H2 blocker per protocol",
  "DVT prophylaxis — SCDs + pharmacologic if no contraindication","Oral care with chlorhexidine 0.12% every 4–6 hours",
  "Subglottic secretion suctioning (if ETT with subglottic port available)","Ventilator circuit: do NOT change routinely (change if soiled or malfunction)",
  "Hand hygiene before and after any airway manipulation","Cuff pressure maintained 20–30 cmH₂O; verify daily",
];
const CLABSI_BUNDLE_UPDATED = [
  "Daily review of line necessity — remove central line as soon as no longer needed",
  "Hand hygiene with soap or alcohol gel before accessing line or changing dressing",
  "Strict aseptic technique for dressing changes — mask, sterile gloves, large drape",
  "Hub scrub — disinfect needleless connectors / hubs with 70% alcohol for ≥15 seconds",
  "Maximal sterile barrier precautions during insertion","Chlorhexidine skin antisepsis (>0.5% CHG in 70% alcohol)",
  "Optimal catheter site selection (avoid femoral if possible; prefer subclavian)","Change IV tubing every 96 hours (blood / lipid lines: 24 hours)",
  "Sterile dressing changed every 5–7 days or when soiled / loose","No routine guidewire exchanges for suspected infection",
];
const CAUTI_BUNDLE = [
  "Daily assessment of catheter need — remove urinary catheter at earliest opportunity",
  "Maintain closed sterile drainage system — do not break circuit unless necessary",
  "Keep drainage bag below bladder level at all times","Proper securement to prevent movement / traction — avoid urethral trauma",
  "Ensure unobstructed urine flow and prevent kinking of tubing","Hand hygiene before and after any catheter manipulation",
  "Use aseptic technique for insertion and maintenance","Consider alternatives (condom catheter, intermittent catheterization) when appropriate",
];

// ─── Advanced ICU Scores ──────────────────────────────────────────────────────
const FOUR_EYE = [
  {label:"4 — Eyelids open, tracking, blinking to command",value:4},{label:"3 — Eyelids open but not tracking",value:3},
  {label:"2 — Eyelids closed, open to loud voice",value:2},{label:"1 — Eyelids closed, open to pain",value:1},
  {label:"0 — Eyelids remain closed with pain",value:0},
];
const FOUR_MOTOR = [
  {label:"4 — Thumbs-up, fist, or peace sign to command",value:4},{label:"3 — Localizing to pain",value:3},
  {label:"2 — Flexion response to pain",value:2},{label:"1 — Extension response to pain",value:1},
  {label:"0 — No response to pain or generalized myoclonus",value:0},
];
const FOUR_BRAINSTEM = [
  {label:"4 — Pupil and corneal reflexes present",value:4},{label:"3 — One pupil wide and fixed",value:3},
  {label:"2 — Pupil or corneal reflexes absent",value:2},{label:"1 — Pupil and corneal reflexes absent",value:1},
  {label:"0 — Absent pupil, corneal, and cough reflexes",value:0},
];
const FOUR_RESP = [
  {label:"4 — Not intubated, regular breathing pattern",value:4},{label:"3 — Not intubated, Cheyne-Stokes breathing pattern",value:3},
  {label:"2 — Not intubated, irregular breathing",value:2},{label:"1 — Breathes above ventilator rate",value:1},
  {label:"0 — Breathes at ventilator rate or apnea",value:0},
];
function sipaThreshold(ageMonths: number) {
  if (ageMonths<=12) return 1.0; if (ageMonths<=24) return 0.9;
  if (ageMonths<=48) return 0.85; if (ageMonths<=72) return 0.75;
  if (ageMonths<=144) return 0.7; return 0.6;
}
const WAT1_PAST12 = [
  {label:"Loose/watery stools",points:1},{label:"Vomiting / retching / gagging",points:1},{label:"Temperature > 37.8°C",points:1},
];
const WAT1_OBS2MIN = [
  {label:"State: Awake and distressed",points:1},{label:"Tremor",points:1},{label:"Sweating",points:1},
  {label:"Uncoordinated or repetitive movements",points:1},{label:"Yawning or sneezing > 1 time",points:1},
];
const WAT1_STIMULUS = [
  {label:"Startle to touch",points:1},{label:"Muscle tone increased",points:1},
];
const WAT1_CALM_TIME = [
  {label:"< 2 min",points:0},{label:"2 – 5 min",points:1},{label:"> 5 min",points:2},
];

// ─── Tool metadata ─────────────────────────────────────────────────────────────
const TOOL_META: Record<string,{title:string;icon:string;color:string;subtitle:string}> = {
  growth:{title:"Growth Charts",icon:"bar-chart-2",color:"#0D9488",subtitle:"WHO Child Growth Standards"},
  vis:{title:"VIS / Cardiac",icon:"heart",color:"#E53E3E",subtitle:"Vasoactive-Inotropic Score"},
  bundles:{title:"PICU Care Bundles",icon:"check-square",color:"#7C3AED",subtitle:"ICU daily checklists"},
  fluids:{title:"IV Fluids",icon:"droplet",color:"#0EA5E9",subtitle:"Holliday-Segar · Dehydration · DKA"},
  electrolytes:{title:"Electrolyte Correction",icon:"zap",color:"#0891B2",subtitle:"K⁺ Potassium correction"},
  gcs:{title:"Pediatric GCS",icon:"activity",color:"#16A34A",subtitle:"Modified GCS for children & infants"},
  scores:{title:"ICU Scores",icon:"activity",color:"#FF4C60",subtitle:"FOUR · OSI · SIPA · WAT-1"},
  renal:{title:"Renal & Hepatic",icon:"shield",color:"#DC2626",subtitle:"Dose adjustments by organ function"},
  pews:{title:"PEWS Score",icon:"activity",color:"#FF4C60",subtitle:"Pediatric Early Warning Score"},
  apgar:{title:"APGAR Score",icon:"heart",color:"#EC4899",subtitle:"Neonatal assessment at 1 & 5 min"},
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Row({label,value,isDark}:{label:string;value:string;isDark:boolean}) {
  return (
    <View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:4}}>
      <Text style={{fontSize:13,color:isDark?"#8892B0":"#64748B"}}>{label}</Text>
      <Text style={{fontSize:13,fontWeight:"700",color:isDark?"#CCD6F6":"#0D1B2A"}}>{value}</Text>
    </View>
  );
}

function GCSOption({options,selected,onSelect,isDark}:{options:{val:number;label:string}[];selected:number;onSelect:(v:number)=>void;isDark:boolean}) {
  return (
    <View style={{gap:6,marginBottom:8}}>
      {options.map(o=>(
        <TouchableOpacity key={o.val} onPress={()=>onSelect(o.val)}
          style={{flexDirection:"row",alignItems:"center",gap:10,padding:10,borderRadius:10,borderWidth:1.5,
            backgroundColor:selected===o.val?C.tint+"22":isDark?"#0F1F2E":"#F8FAFC",
            borderColor:selected===o.val?C.tint:isDark?"#233554":"#E2E8F0"}}>
          <View style={{width:18,height:18,borderRadius:9,borderWidth:2,justifyContent:"center",alignItems:"center",
            borderColor:selected===o.val?C.tint:isDark?"#3D5470":"#CBD5E1"}}>
            {selected===o.val&&<View style={{width:8,height:8,borderRadius:4,backgroundColor:C.tint}}/>}
          </View>
          <Text style={{flex:1,fontSize:13,color:isDark?"#CBD5E1":"#334155"}}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Chip({label,color,selected,onPress,isDark}:{label:string;color:string;selected:boolean;onPress:()=>void;isDark:boolean}) {
  return (
    <TouchableOpacity onPress={onPress}
      style={{paddingHorizontal:12,paddingVertical:7,borderRadius:20,borderWidth:1.5,
        backgroundColor:selected?color:isDark?"#0A192F":"#F1F5F9",
        borderColor:selected?color:isDark?"#2D4456":"#CBD5E1"}}>
      <Text style={{fontSize:12,fontWeight:"600",color:selected?"#FFF":isDark?"#8892B0":"#64748B"}}>{label}</Text>
    </TouchableOpacity>
  );
}

function ScenarioFluidPanel({scenario,kCl,isDark,textMuted,textPrimary}:{scenario:string;kCl:boolean;isDark:boolean;textMuted:string;textPrimary:string}) {
  const data:Record<string,{fluid:string;alert:string;alertColor:string;bg:string;border:string}> = {
    neonatal:{fluid:"D10W or D10 0.2% NaCl",alert:"Monitor blood glucose periodically.",alertColor:"#7C3AED",bg:isDark?"#1A0A2E":"#F3E8FF",border:isDark?"#7C3AED":"#D8B4FE"},
    maintenance:{fluid:`D5 0.45% NaCl or D5 0.9% NaCl${kCl?" + 20 mEq/L KCl":""}`,alert:"",alertColor:"#0EA5E9",bg:isDark?"#0A192F":"#EFF6FF",border:isDark?"#0EA5E9":"#BFDBFE"},
    dehydration:{fluid:`D5 0.45% NaCl or D5 0.9% NaCl${kCl?" + 20 mEq/L KCl":""}`,alert:"",alertColor:"#0EA5E9",bg:isDark?"#0A192F":"#EFF6FF",border:isDark?"#0EA5E9":"#BFDBFE"},
    resuscitation:{fluid:"0.9% NaCl or Ringer's Lactate (10–20 mL/kg bolus)",alert:"Caution: Check Serum Calcium if massive transfusion or blood products are running with RL.",alertColor:"#DC2626",bg:isDark?"#450A0A":"#FEE2E2",border:isDark?"#DC2626":"#FCA5A5"},
    dka:{fluid:"0.9% NaCl",alert:"Avoid Dextrose initially.",alertColor:"#DC2626",bg:isDark?"#450A0A":"#FEE2E2",border:isDark?"#DC2626":"#FCA5A5"},
  };
  const d=data[scenario]||data.maintenance;
  return (
    <View style={{borderRadius:12,padding:12,borderWidth:1.5,marginTop:10,backgroundColor:d.bg,borderColor:d.border}}>
      <Text style={{fontSize:11,color:textMuted,fontWeight:"700",marginBottom:4}}>RECOMMENDED FLUID</Text>
      <Text style={{fontSize:14,fontWeight:"800",color:d.alertColor}}>{d.fluid}</Text>
      {d.alert?(
        <View style={{flexDirection:"row",alignItems:"center",gap:6,marginTop:6}}>
          <Feather name="alert-triangle" size={14} color={d.alertColor}/>
          <Text style={{flex:1,fontSize:12,color:d.alertColor}}>{d.alert}</Text>
        </View>
      ):null}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ToolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { weight } = useWeight();
  const { isFav, toggleFav } = useFavorites();

  const bg   = isDark ? "#0B132B" : "#F0F4F8";
  const card = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const tp   = isDark ? "#CCD6F6" : "#0D1B2A";
  const tm   = isDark ? "#8892B0" : "#8A9BB0";
  const inputBg = isDark ? "#0A192F" : "#F8FAFC";

  const meta = TOOL_META[id ?? ""] ?? { title:"Tool", icon:"tool", color:C.tint, subtitle:"" };

  // ── Growth state ──────────────────────────────────────────────────────────
  const [growthSex, setGrowthSex] = useState<"M"|"F">("M");
  const [growthAge, setGrowthAge] = useState("");
  const [growthAgeUnit, setGrowthAgeUnit] = useState<"months"|"years">("months");
  const [growthWeight, setGrowthWeight] = useState(weight>0?weight.toString():"");
  const [growthEdema, setGrowthEdema] = useState(false);
  type GrowthEntry = {id:string;date:string;ageMonths:number;weight:number;zscore:number;band:number;sex:"M"|"F"};
  const [growthEntries, setGrowthEntries] = useState<GrowthEntry[]>([]);
  const growthAgeMonths = growthAgeUnit==="years" ? (parseFloat(growthAge)||0)*12 : parseFloat(growthAge)||0;
  const growthWeightNum = parseFloat(growthWeight)||0;
  const growthTable = growthSex==="M" ? WHO_W_BOYS : WHO_W_GIRLS;
  const growthRefs = growthAgeMonths>0 ? findNearestAge(growthAgeMonths,growthTable) : null;
  const growthResult = growthRefs&&growthWeightNum>0 ? estimatePercentile(growthWeightNum,growthRefs) : null;
  const lastEntry = growthEntries.length>0 ? growthEntries[growthEntries.length-1] : null;
  const fttAlert = !!(lastEntry&&growthResult&&lastEntry.sex===growthSex&&(lastEntry.band-growthResult.band)>=1);
  const zTrend = lastEntry&&growthResult ? growthResult.zscore-lastEntry.zscore : null;

  useEffect(()=>{
    AsyncStorage.getItem("growth_entries_v1").then(raw=>{
      if (raw) { try{setGrowthEntries(JSON.parse(raw));}catch{} }
    });
  },[]);

  const saveGrowthEntry = async () => {
    if (!growthResult||growthWeightNum<=0||growthAgeMonths<=0) return;
    const entry:GrowthEntry = {id:Date.now().toString(),date:new Date().toLocaleDateString("en-GB"),ageMonths:Math.round(growthAgeMonths),weight:growthWeightNum,zscore:growthResult.zscore,band:growthResult.band,sex:growthSex};
    const updated=[...growthEntries,entry].slice(-8);
    setGrowthEntries(updated);
    await AsyncStorage.setItem("growth_entries_v1",JSON.stringify(updated));
  };
  const clearGrowthEntries = async () => {
    setGrowthEntries([]);
    await AsyncStorage.removeItem("growth_entries_v1");
  };

  // ── VIS state ────────────────────────────────────────────────────────────
  const [vis, setVis] = useState({dopa:"",dobu:"",epi:"",mil:"",vaso:"",norepi:""});
  const visScore = calcVIS(vis);
  const visResult = visInterpret(visScore);

  // ── BP state ──────────────────────────────────────────────────────────────
  const [bpAgeYears,setBpAgeYears] = useState("");
  const [bpGender,setBpGender] = useState<"M"|"F">("M");
  const [bpHeight,setBpHeight] = useState("");
  const [bpSBP,setBpSBP] = useState("");
  const [bpDBP,setBpDBP] = useState("");
  const [bpShowTable,setBpShowTable] = useState(false);
  const bpAgeNum=parseFloat(bpAgeYears)||0, bpHeightNum=parseFloat(bpHeight)||0;
  const bpSBPNum=parseFloat(bpSBP)||0, bpDBPNum=parseFloat(bpDBP)||0;
  const bpResult = bpAgeNum>=1&&bpAgeNum<=17&&bpHeightNum>0&&bpSBPNum>0 ? classifyBP(bpAgeNum,bpGender,bpHeightNum,bpSBPNum,bpDBPNum) : null;
  const bpVISAlert = bpResult!==null&&bpResult.overallBand===0&&visScore>10;

  // ── Fluids state ──────────────────────────────────────────────────────────
  const [fluidWt,setFluidWt] = useState(weight>0?weight.toString():"");
  const [dehydPct,setDehydPct] = useState<5|10|15>(5);
  const [maintTarget,setMaintTarget] = useState<100|75|66|50>(100);
  const [scenario,setScenario] = useState<"maintenance"|"neonatal"|"dehydration"|"resuscitation"|"dka">("maintenance");
  const [kClToggle,setKClToggle] = useState(false);
  const fluidWtNum = Math.min(parseFloat(fluidWt)||0,60);
  const rawMaint = fluidWtNum>0 ? hollidaySegar(fluidWtNum) : null;
  const multiplier = maintTarget/100;
  const maintenance = rawMaint ? {daily:Math.round(rawMaint.daily*multiplier),hourly:+(rawMaint.hourly*multiplier).toFixed(1)} : null;
  const deficit = fluidWtNum>0 ? Math.round((dehydPct/100)*fluidWtNum*1000) : 0;
  const total48h = maintenance ? Math.round(maintenance.daily+deficit/2) : 0;

  // ── Electrolytes state ────────────────────────────────────────────────────
  const [elActualK,setElActualK] = useState("");
  const [elTargetK,setElTargetK] = useState("4.0");
  const [elWt,setElWt] = useState(weight>0?weight.toString():"");
  const [elCentral,setElCentral] = useState(false);
  const [elRestrictFluids,setElRestrictFluids] = useState(false);
  const [elChecklist,setElChecklist] = useState({renal:false,ecg:false,mg:false});
  const elActualKNum=parseFloat(elActualK)||0, elTargetKNum=parseFloat(elTargetK)||4.0, elWtNum=parseFloat(elWt)||0;
  const elDeficit = elWtNum>0&&elActualKNum>0&&elTargetKNum>elActualKNum ? Math.round((elTargetKNum-elActualKNum)*elWtNum*0.4*10)/10 : 0;
  const elChecklistDone = elChecklist.renal&&elChecklist.ecg&&elChecklist.mg;
  const elConc = (elCentral||elRestrictFluids) ? 0.08 : 0.04;
  const elKClML = elDeficit>0 ? Math.round((elDeficit/2)*10)/10 : 0;
  const elTotalVol = elKClML>0 ? Math.round(elDeficit/elConc) : 0;
  const elNSML = Math.max(0,elTotalVol-elKClML);
  const elRateMEqHr = elWtNum>0 ? (elCentral?0.5:0.3)*elWtNum : 0;
  const elRateMLHr = elConc>0&&elRateMEqHr>0 ? Math.round(elRateMEqHr/elConc*10)/10 : 0;
  const elDurationHr = elRateMLHr>0&&elTotalVol>0 ? Math.round(elTotalVol/elRateMLHr*10)/10 : 0;

  // ── GCS state ─────────────────────────────────────────────────────────────
  const [eye,setEye] = useState(4);
  const [verbal,setVerbal] = useState(5);
  const [motor,setMotor] = useState(6);
  const gcsTotal = eye+verbal+motor;
  const gcsResult = gcsInterpret(gcsTotal);

  // ── Advanced scores state ─────────────────────────────────────────────────
  const [scoreTab,setScoreTab] = useState<"four"|"osi"|"sipa"|"wat1">("four");
  const [fourEye,setFourEye] = useState(4);
  const [fourMotor,setFourMotor] = useState(4);
  const [fourBrainstem,setFourBrainstem] = useState(4);
  const [fourResp,setFourResp] = useState(4);
  const fourTotal = fourEye+fourMotor+fourBrainstem+fourResp;
  const fourInterpret = fourTotal>=13?{label:"Awake / Coma recovery",color:"#16A34A"}:fourTotal>=7?{label:"Coma — moderate brainstem involvement",color:"#D97706"}:{label:"Coma — severe brainstem involvement",color:"#DC2626"};
  const [osiMap,setOsiMap] = useState(""); const [osiFio2,setOsiFio2] = useState(""); const [osiSpo2,setOsiSpo2] = useState("");
  const osiVal = osiMap&&osiFio2&&osiSpo2 ? +((parseFloat(osiMap)||0)*(parseFloat(osiFio2)||0)/(parseFloat(osiSpo2)||1)).toFixed(2) : null;
  const osiInterp = osiVal===null?null:osiVal>=12.4?{label:"Severe ARDS (OSI ≥ 12.4)",color:"#DC2626"}:osiVal>=7.5?{label:"Moderate ARDS (OSI 7.5–12.3)",color:"#D97706"}:osiVal>=5?{label:"Mild ARDS (OSI 5.0–7.4)",color:"#F59E0B"}:{label:"Normal (OSI < 5)",color:"#16A34A"};
  const [sipaAge,setSipaAge] = useState(""); const [sipaAgeUnit,setSipaAgeUnit] = useState<"months"|"years">("years");
  const [sipaHR,setSipaHR] = useState(""); const [sipaSBP,setSipaSBP] = useState("");
  const sipaAgeMonths = sipaAgeUnit==="years"?(parseFloat(sipaAge)||0)*12:parseFloat(sipaAge)||0;
  const sipaHrNum=parseFloat(sipaHR)||0, sipaSbpNum=parseFloat(sipaSBP)||0;
  const sipaSi = sipaSbpNum>0 ? +(sipaHrNum/sipaSbpNum).toFixed(2) : null;
  const sipaThresholdVal = sipaAgeMonths>0 ? sipaThreshold(sipaAgeMonths) : 0.6;
  const sipaAlert = sipaSi!==null&&sipaSi>sipaThresholdVal;
  const [wat1Past12,setWat1Past12] = useState<boolean[]>(WAT1_PAST12.map(()=>false));
  const [wat1Obs2,setWat1Obs2] = useState<boolean[]>(WAT1_OBS2MIN.map(()=>false));
  const [wat1Stim,setWat1Stim] = useState<boolean[]>(WAT1_STIMULUS.map(()=>false));
  const [wat1CalmTime,setWat1CalmTime] = useState(0);
  const wat1Score = wat1Past12.filter(Boolean).length+wat1Obs2.filter(Boolean).length+wat1Stim.filter(Boolean).length+wat1CalmTime;
  const wat1Interpret = wat1Score<=2?{label:"Minimal / No Withdrawal",color:"#16A34A"}:{label:"Significant Withdrawal — Intervention may be needed",color:"#FF4C60"};

  // ── Renal state ───────────────────────────────────────────────────────────
  const [renalTab,setRenalTab] = useState<"renal"|"hepatic">("renal");
  const [crclCr,setCrclCr] = useState(""); const [crclHt,setCrclHt] = useState("");
  const crclCrNum=parseFloat(crclCr)||0, crclHtNum=parseFloat(crclHt)||0;
  const schwartz = crclCrNum>0&&crclHtNum>0 ? +(0.413*crclHtNum/crclCrNum).toFixed(1) : null;

  // ── Bundles state ─────────────────────────────────────────────────────────
  const [bundleTab,setBundleTab] = useState<"fasthug"|"vap"|"clabsi"|"cauti">("fasthug");
  const [fasthugChecked,setFasthugChecked] = useState<boolean[]>(FASTHUG_BUNDLE.map(()=>false));
  const [vapChecked,setVapChecked] = useState<boolean[]>(VAP_BUNDLE_UPDATED.map(()=>false));
  const [clabsiChecked,setClabsiChecked] = useState<boolean[]>(CLABSI_BUNDLE_UPDATED.map(()=>false));
  const [cautiChecked,setCautiChecked] = useState<boolean[]>(CAUTI_BUNDLE.map(()=>false));
  const fasthugPct=Math.round((fasthugChecked.filter(Boolean).length/FASTHUG_BUNDLE.length)*100);
  const vapPct=Math.round((vapChecked.filter(Boolean).length/VAP_BUNDLE_UPDATED.length)*100);
  const clabsiPct=Math.round((clabsiChecked.filter(Boolean).length/CLABSI_BUNDLE_UPDATED.length)*100);
  const cautiPct=Math.round((cautiChecked.filter(Boolean).length/CAUTI_BUNDLE.length)*100);

  // ── PEWS state ────────────────────────────────────────────────────────────
  const [pewsB,setPewsB] = useState(""); const [pewsCv,setPewsCv] = useState(""); const [pewsR,setPewsR] = useState("");
  const pewsSum = (parseInt(pewsB)||0)+(parseInt(pewsCv)||0)+(parseInt(pewsR)||0);
  const pewsAlert = pewsSum>=5;

  // ── APGAR state ───────────────────────────────────────────────────────────
  const [apgarA,setApgarA] = useState<number|null>(null);
  const [apgarP,setApgarP] = useState<number|null>(null);
  const [apgarG,setApgarG] = useState<number|null>(null);
  const [apgarAc,setApgarAc] = useState<number|null>(null);
  const [apgarR,setApgarR] = useState<number|null>(null);
  const apgarTotal = (apgarA??0)+(apgarP??0)+(apgarG??0)+(apgarAc??0)+(apgarR??0);
  const apgarItems = [
    {key:"Appearance",setter:setApgarA,value:apgarA,options:[{score:0,label:"Pale / Blue"},{score:1,label:"Pink body, Blue extremities"},{score:2,label:"Completely Pink"}]},
    {key:"Pulse",setter:setApgarP,value:apgarP,options:[{score:0,label:"Absent"},{score:1,label:"< 100 bpm"},{score:2,label:"> 100 bpm"}]},
    {key:"Grimace",setter:setApgarG,value:apgarG,options:[{score:0,label:"No response"},{score:1,label:"Grimace / feeble cry"},{score:2,label:"Cry, sneeze, cough"}]},
    {key:"Activity",setter:setApgarAc,value:apgarAc,options:[{score:0,label:"Flaccid / Limp"},{score:1,label:"Some flexion"},{score:2,label:"Active movement"}]},
    {key:"Respiration",setter:setApgarR,value:apgarR,options:[{score:0,label:"Absent"},{score:1,label:"Weak / irregular / gasping"},{score:2,label:"Good, strong cry"}]},
  ];

  // ── Inline input styles ───────────────────────────────────────────────────
  const inputStyle = {color:tp,backgroundColor:inputBg,borderColor:border,borderWidth:1,borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:16,fontWeight:"600" as const};

  function renderContent() {
    switch (id) {
      // ── GROWTH CHARTS ─────────────────────────────────────────────────────
      case "growth": return (
        <View style={{gap:12}}>
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            <View>
              <Text style={{fontSize:12,fontWeight:"700",color:"#0D9488"}}>WHO Child Growth Standards</Text>
              <Text style={{fontSize:11,color:tm,marginTop:1}}>Nelson's Pediatrics 22e · Harriet Lane 23e</Text>
            </View>
            <StarButton isFav={isFav("tool-growth")} onToggle={()=>toggleFav({id:"tool-growth",type:"tool",label:"Growth Charts",color:"#0D9488"})} size={18} color="#0D9488"/>
          </View>
          <Text style={{fontSize:11,color:tm,fontStyle:"italic"}}>Weight-for-Age · Z-score (SD) · Nutritional Status Classification</Text>

          <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Sex</Text>
          <View style={{flexDirection:"row",gap:8}}>
            {(["M","F"] as const).map(s=>(
              <TouchableOpacity key={s} onPress={()=>setGrowthSex(s)} style={{flex:1,paddingVertical:10,borderRadius:10,alignItems:"center",backgroundColor:growthSex===s?(s==="M"?"#0D9488":"#7C3AED"):isDark?"#1E293B":"#F1F5F9",borderWidth:2,borderColor:growthSex===s?(s==="M"?"#0D9488":"#7C3AED"):isDark?"#334155":"#CBD5E1"}}>
                <Text style={{fontWeight:"700",fontSize:14,color:growthSex===s?"#FFFFFF":tm}}>{s==="M"?"♂ Male":"♀ Female"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Age</Text>
          <View style={{flexDirection:"row",gap:8}}>
            <TextInput style={[inputStyle,{flex:1}]} value={growthAge} onChangeText={setGrowthAge} keyboardType="decimal-pad" placeholder="e.g. 18" placeholderTextColor={tm}/>
            {(["months","years"] as const).map(u=>(
              <TouchableOpacity key={u} onPress={()=>setGrowthAgeUnit(u)} style={{paddingHorizontal:12,paddingVertical:10,borderRadius:10,justifyContent:"center",backgroundColor:growthAgeUnit===u?"#0D9488":isDark?"#1E293B":"#F1F5F9",borderWidth:2,borderColor:growthAgeUnit===u?"#0D9488":isDark?"#334155":"#CBD5E1"}}>
                <Text style={{fontWeight:"700",fontSize:13,color:growthAgeUnit===u?"#FFFFFF":tm}}>{u==="months"?"Months":"Years"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Weight (kg)</Text>
          <TextInput style={inputStyle} value={growthWeight} onChangeText={setGrowthWeight} keyboardType="decimal-pad" placeholder="e.g. 12.5" placeholderTextColor={tm}/>

          <TouchableOpacity onPress={()=>setGrowthEdema(!growthEdema)} style={{flexDirection:"row",alignItems:"center",gap:10,padding:10,borderRadius:10,backgroundColor:growthEdema?"#FEF3C7":isDark?"#1E293B":"#F8FAFC",borderWidth:1.5,borderColor:growthEdema?"#F59E0B":isDark?"#334155":"#E2E8F0"}}>
            <View style={{width:22,height:22,borderRadius:6,borderWidth:2,borderColor:growthEdema?"#F59E0B":isDark?"#475569":"#CBD5E1",backgroundColor:growthEdema?"#F59E0B":"transparent",justifyContent:"center",alignItems:"center"}}>
              {growthEdema&&<Feather name="check" size={13} color="#FFFFFF"/>}
            </View>
            <View style={{flex:1}}>
              <Text style={{fontSize:13,fontWeight:"700",color:growthEdema?"#92400E":tp}}>Edema Detected?</Text>
              <Text style={{fontSize:10,color:tm,marginTop:1}}>Tick if pitting edema is present — affects weight interpretation</Text>
            </View>
          </TouchableOpacity>

          {growthResult&&growthRefs&&(
            <View style={{gap:10}}>
              {growthEdema&&<View style={{backgroundColor:"#FEF9C3",borderColor:"#FDE047",borderWidth:1.5,borderRadius:10,padding:10,flexDirection:"row",alignItems:"flex-start",gap:8}}><Feather name="droplet" size={16} color="#B45309"/><Text style={{flex:1,fontSize:12,color:"#92400E",fontWeight:"600"}}>Weight may be falsely elevated due to fluid overload. Z-score may underestimate severity.{"\n"}<Text style={{fontStyle:"italic",fontWeight:"400"}}>Ref: Nelson's Pediatric Nutrition</Text></Text></View>}
              {fttAlert&&<View style={{backgroundColor:"#FEE2E2",borderColor:"#DC2626",borderWidth:2,borderRadius:10,padding:12,flexDirection:"row",alignItems:"center",gap:8}}><Feather name="trending-down" size={18} color="#DC2626"/><View style={{flex:1}}><Text style={{color:"#DC2626",fontWeight:"800",fontSize:13}}>Warning: Potential Growth Failure</Text><Text style={{color:"#B91C1C",fontSize:12,marginTop:2}}>Percentile has crossed a major centile line since last saved entry.</Text></View></View>}
              {growthResult.samAlert&&<View style={{backgroundColor:"#FEE2E2",borderColor:"#DC2626",borderWidth:2,borderRadius:10,padding:12,flexDirection:"row",alignItems:"center",gap:8}}><Feather name="alert-triangle" size={20} color="#DC2626"/><View style={{flex:1}}><Text style={{color:"#DC2626",fontWeight:"800",fontSize:13}}>CRITICAL: Severe Acute Malnutrition</Text><Text style={{color:"#B91C1C",fontSize:12,marginTop:2}}>Refer to Dietitian — Initiate SAM Protocol</Text></View></View>}
              <View style={{flexDirection:"row",gap:8}}>
                <View style={{flex:1,backgroundColor:growthResult.color+"18",borderColor:growthResult.color+"50",borderWidth:1.5,borderRadius:10,padding:12,alignItems:"center"}}>
                  <Text style={{fontSize:11,color:tm,fontWeight:"600",marginBottom:2}}>Z-SCORE (SD)</Text>
                  <Text style={{fontSize:26,fontWeight:"800",color:growthResult.color}}>{growthResult.zscore>0?"+":""}{growthResult.zscore}</Text>
                  {zTrend!==null&&<Text style={{fontSize:11,color:zTrend>=0?"#16A34A":"#DC2626",fontWeight:"700",marginTop:2}}>{zTrend>=0?"↑":"↓"} {zTrend>=0?"+":""}{Math.round(zTrend*10)/10} vs last</Text>}
                </View>
                <View style={{flex:1,backgroundColor:growthResult.color+"18",borderColor:growthResult.color+"50",borderWidth:1.5,borderRadius:10,padding:12,alignItems:"center"}}>
                  <Text style={{fontSize:11,color:tm,fontWeight:"600",marginBottom:2}}>PERCENTILE</Text>
                  <Text style={{fontSize:14,fontWeight:"800",color:growthResult.color,textAlign:"center"}}>{growthResult.label}</Text>
                </View>
              </View>
              <View style={{backgroundColor:growthResult.nutritionColor+"15",borderColor:growthResult.nutritionColor+"60",borderWidth:1.5,borderRadius:10,padding:12}}>
                <Text style={{fontSize:11,color:tm,fontWeight:"600",marginBottom:2}}>NUTRITIONAL STATUS</Text>
                <Text style={{fontSize:15,fontWeight:"800",color:growthResult.nutritionColor}}>{growthResult.nutritionStatus}</Text>
                <Text style={{fontSize:12,color:tm,marginTop:3}}>{growthResult.note}</Text>
              </View>
              <TouchableOpacity onPress={saveGrowthEntry} style={{backgroundColor:"#0D9488",borderRadius:10,paddingVertical:12,alignItems:"center",flexDirection:"row",justifyContent:"center",gap:8}}>
                <Feather name="save" size={15} color="#FFFFFF"/>
                <Text style={{color:"#FFFFFF",fontWeight:"700",fontSize:14}}>Save This Entry</Text>
              </TouchableOpacity>
              <Text style={{fontSize:11,color:tm,fontStyle:"italic"}}>Reference at {Math.round(growthAgeMonths)} mo ({growthSex==="M"?"Boys":"Girls"}): P3 = {growthRefs[0]} kg · P50 = {growthRefs[2]} kg · P97 = {growthRefs[4]} kg</Text>
            </View>
          )}

          {growthEntries.length>0&&(
            <View style={{backgroundColor:isDark?"#0F172A":"#F0FDF4",borderColor:isDark?"#1A3A2A":"#BBF7D0",borderWidth:1,borderRadius:10,padding:12}}>
              <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <Text style={{fontSize:12,fontWeight:"800",color:"#16A34A"}}>Z-Score Trend ({growthEntries.length} saved)</Text>
                <TouchableOpacity onPress={clearGrowthEntries}><Text style={{fontSize:11,color:"#DC2626",fontWeight:"600"}}>Clear</Text></TouchableOpacity>
              </View>
              <View style={{flexDirection:"row",alignItems:"flex-end",gap:6,marginBottom:8}}>
                {growthEntries.map((entry)=>{
                  const dc=entry.zscore<-3?"#DC2626":entry.zscore<-2?"#F59E0B":"#16A34A";
                  const bh=Math.max(8,Math.min(40,24+entry.zscore*6));
                  return(<View key={entry.id} style={{flex:1,alignItems:"center",gap:3}}><Text style={{fontSize:9,color:dc,fontWeight:"700"}}>{entry.zscore>0?"+":""}{entry.zscore}</Text><View style={{width:"100%",height:bh,backgroundColor:dc+"CC",borderRadius:4}}/><Text style={{fontSize:8,color:tm,textAlign:"center"}}>{entry.ageMonths}mo</Text></View>);
                })}
              </View>
            </View>
          )}
        </View>
      );

      // ── VIS / CARDIAC ─────────────────────────────────────────────────────
      case "vis": return (
        <View style={{gap:12}}>
          <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
            <StarButton isFav={isFav("tool-vis")} onToggle={()=>toggleFav({id:"tool-vis",type:"tool",label:"VIS / Cardiac",color:"#E53E3E"})} size={18} color="#E53E3E"/>
          </View>
          <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>Vasoactive-Inotropic Score (Wernovsky et al. 1995){"\n"}VIS = Dopa + Dobu + 100×Epi + 10×Milrinone + 10000×Vaso + 100×Norepi</Text>
          {(["dopa","dobu","epi","mil","vaso","norepi"] as const).map(key=>{
            const labels:Record<string,string>={dopa:"Dopamine (mcg/kg/min)",dobu:"Dobutamine (mcg/kg/min)",epi:"Epinephrine (mcg/kg/min)",mil:"Milrinone (mcg/kg/min)",vaso:"Vasopressin (units/kg/min)",norepi:"Norepinephrine (mcg/kg/min)"};
            return(
              <View key={key}>
                <Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>{labels[key]}</Text>
                <TextInput style={inputStyle} value={vis[key]} onChangeText={t=>setVis(p=>({...p,[key]:t}))} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={tm}/>
              </View>
            );
          })}
          <View style={{backgroundColor:visResult.color+"15",borderColor:visResult.color+"40",borderWidth:1.5,borderRadius:12,padding:14,alignItems:"center"}}>
            <Text style={{fontSize:24,fontWeight:"900",color:visResult.color}}>VIS = {visScore}</Text>
            <Text style={{fontSize:13,color:tm,marginTop:4}}>{visResult.label}</Text>
          </View>

          {/* BP Calculator */}
          <View style={{backgroundColor:isDark?"#0D1F36":"#F0F9FF",borderColor:isDark?"#1E3A5F":"#BAE6FD",borderWidth:1.5,borderRadius:14,padding:14,gap:10}}>
            <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
              <View style={{width:32,height:32,borderRadius:9,backgroundColor:"#0891B218",alignItems:"center",justifyContent:"center"}}><Feather name="activity" size={16} color="#0891B2"/></View>
              <View style={{flex:1}}><Text style={{fontSize:13,fontWeight:"700",color:"#0891B2"}}>BP Percentile Calculator</Text><Text style={{fontSize:10,color:tm,marginTop:1}}>NHBPEP Fourth Report · Harriet Lane 23e</Text></View>
            </View>
            <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Gender</Text>
            <View style={{flexDirection:"row",gap:8}}>
              {(["M","F"] as const).map(g=>(
                <TouchableOpacity key={g} onPress={()=>setBpGender(g)} style={{flex:1,paddingVertical:9,borderRadius:10,alignItems:"center",backgroundColor:bpGender===g?"#0891B2":isDark?"#1E293B":"#F1F5F9",borderWidth:2,borderColor:bpGender===g?"#0891B2":isDark?"#334155":"#CBD5E1"}}>
                  <Text style={{fontWeight:"700",fontSize:13,color:bpGender===g?"#FFFFFF":tm}}>{g==="M"?"♂ Male":"♀ Female"}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{flexDirection:"row",gap:8}}>
              <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Age (years)</Text><TextInput style={inputStyle} value={bpAgeYears} onChangeText={setBpAgeYears} keyboardType="decimal-pad" placeholder="1–17" placeholderTextColor={tm}/></View>
              <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Height (cm)</Text><TextInput style={inputStyle} value={bpHeight} onChangeText={setBpHeight} keyboardType="decimal-pad" placeholder="e.g. 120" placeholderTextColor={tm}/></View>
            </View>
            <View style={{flexDirection:"row",gap:8}}>
              <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Actual SBP (mmHg)</Text><TextInput style={inputStyle} value={bpSBP} onChangeText={setBpSBP} keyboardType="decimal-pad" placeholder="e.g. 110" placeholderTextColor={tm}/></View>
              <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Actual DBP (mmHg)</Text><TextInput style={inputStyle} value={bpDBP} onChangeText={setBpDBP} keyboardType="decimal-pad" placeholder="e.g. 72" placeholderTextColor={tm}/></View>
            </View>
            {bpAgeNum>0&&(bpAgeNum<1||bpAgeNum>17)&&<View style={{backgroundColor:"#FEF3C7",borderRadius:8,padding:10,flexDirection:"row",gap:6,alignItems:"center"}}><Feather name="alert-triangle" size={14} color="#92400E"/><Text style={{fontSize:12,color:"#92400E"}}>Age must be 1–17 years (NHBPEP table range)</Text></View>}
            {bpResult&&(
              <View style={{gap:8}}>
                <View style={{flexDirection:"row",gap:6}}>
                  {[{label:"50th",sbp:bpResult.sbp50,dbp:bpResult.dbp50,color:"#16A34A"},{label:"90th",sbp:bpResult.sbp90,dbp:bpResult.dbp90,color:"#D97706"},{label:"95th",sbp:bpResult.sbp95,dbp:bpResult.dbp95,color:"#DC2626"},{label:"99th",sbp:bpResult.sbp99,dbp:bpResult.dbp99,color:"#7F1D1D"}].map(t=>(
                    <View key={t.label} style={{flex:1,backgroundColor:t.color+"14",borderRadius:10,padding:8,alignItems:"center",borderWidth:1,borderColor:t.color+"30"}}>
                      <Text style={{fontSize:9,color:t.color,fontWeight:"600",letterSpacing:0.3}}>{t.label} SBP</Text>
                      <Text style={{fontSize:16,fontWeight:"700",color:t.color,marginTop:1}}>{t.sbp}</Text>
                      <Text style={{fontSize:8,color:tm}}>mmHg</Text>
                    </View>
                  ))}
                </View>
                <Text style={{fontSize:11,color:tm,textAlign:"center"}}>Height at {bpResult.htLabel} percentile · {bpGender==="M"?"Male":"Female"}</Text>
                <View style={{flexDirection:"row",alignItems:"center",gap:10,padding:12,borderRadius:12,borderWidth:1.5,backgroundColor:bpResult.color+"18",borderColor:bpResult.color+"40"}}>
                  <Feather name={bpResult.overallBand===0?"check-circle":bpResult.overallBand>=3?"alert-circle":"alert-triangle"} size={18} color={bpResult.color}/>
                  <View style={{flex:1}}>
                    <Text style={{fontSize:14,fontWeight:"700",color:bpResult.color}}>{bpResult.classification}</Text>
                    <Text style={{fontSize:11,color:tm,marginTop:2}}>SBP: {bpSBPNum} · DBP: {bpDBPNum>0?bpDBPNum+"—":""} · Age {Math.round(bpAgeNum)}y · {bpHeightNum}cm</Text>
                  </View>
                </View>
              </View>
            )}
            {bpVISAlert&&<View style={{backgroundColor:"#DC2626",borderRadius:12,padding:12}}><Text style={{color:"#FFF",fontWeight:"700",fontSize:13}}>Clinical Alert: Active Inotropic Support with Hypotension</Text><Text style={{color:"rgba(255,255,255,0.9)",fontSize:11,marginTop:4}}>BP below 50th percentile while VIS = {visScore} ({">"} 10). Consider vasopressor escalation.</Text></View>}
          </View>

          {/* Vitals Table */}
          <View style={{backgroundColor:isDark?"#0A192F":"#EFF6FF",borderColor:isDark?"#233554":"#BFDBFE",borderWidth:1,borderRadius:12,padding:12}}>
            <Text style={{fontSize:13,fontWeight:"700",color:"#3B82F6",marginBottom:8}}>Normal Vitals by Age</Text>
            <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:border,paddingBottom:6,marginBottom:4}}>
              {["Age Group","HR","SBP","RR","MAP"].map(h=><Text key={h} style={{flex:1,fontSize:11,fontWeight:"700",color:"#3B82F6",textAlign:"center"}}>{h}</Text>)}
            </View>
            {VITALS_TABLE.map(row=>(
              <View key={row.age} style={{flexDirection:"row",paddingVertical:5,borderBottomWidth:1,borderBottomColor:isDark?"#1E293B":"#F1F5F9"}}>
                <Text style={{flex:1,fontSize:11,color:tp}}>{row.age}</Text>
                <Text style={{flex:1,fontSize:11,color:tm,textAlign:"center"}}>{row.hr}</Text>
                <Text style={{flex:1,fontSize:11,color:tm,textAlign:"center"}}>{row.sbp}</Text>
                <Text style={{flex:1,fontSize:11,color:tm,textAlign:"center"}}>{row.rr}</Text>
                <Text style={{flex:1,fontSize:11,color:tm,textAlign:"center"}}>{row.map}</Text>
              </View>
            ))}
          </View>
        </View>
      );

      // ── CARE BUNDLES ──────────────────────────────────────────────────────
      case "bundles": return (
        <View style={{gap:10}}>
          <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
            <Chip label={`FASTHUG (${fasthugPct}%)`} color="#0891B2" selected={bundleTab==="fasthug"} onPress={()=>setBundleTab("fasthug")} isDark={isDark}/>
            <Chip label={`VAP (${vapPct}%)`} color="#E53E3E" selected={bundleTab==="vap"} onPress={()=>setBundleTab("vap")} isDark={isDark}/>
            <Chip label={`CLABSI (${clabsiPct}%)`} color="#7C3AED" selected={bundleTab==="clabsi"} onPress={()=>setBundleTab("clabsi")} isDark={isDark}/>
            <Chip label={`CAUTI (${cautiPct}%)`} color="#F59E0B" selected={bundleTab==="cauti"} onPress={()=>setBundleTab("cauti")} isDark={isDark}/>
          </View>
          {bundleTab==="fasthug"&&(
            <>
              <Text style={{fontSize:14,fontWeight:"700",color:"#0891B2"}}>FASTHUG (Daily ICU Checklist)</Text>
              <View style={{height:6,borderRadius:3,backgroundColor:isDark?"#233554":"#E2E8F0"}}><View style={{height:6,borderRadius:3,width:`${fasthugPct}%` as any,backgroundColor:fasthugPct===100?"#16A34A":"#0891B2"}}/></View>
              <Text style={{fontSize:11,color:tm}}>{fasthugChecked.filter(Boolean).length}/{FASTHUG_BUNDLE.length} complete</Text>
              {FASTHUG_BUNDLE.map((item,i)=>(
                <TouchableOpacity key={i} onPress={()=>setFasthugChecked(p=>p.map((v,j)=>j===i?!v:v))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8}}>
                  <View style={{width:22,height:22,borderRadius:6,borderWidth:2,justifyContent:"center",alignItems:"center",backgroundColor:fasthugChecked[i]?"#16A34A":"transparent",borderColor:fasthugChecked[i]?"#16A34A":isDark?"#3D5470":"#CBD5E1"}}>{fasthugChecked[i]&&<Feather name="check" size={12} color="#FFF"/>}</View>
                  <Text style={{flex:1,fontSize:13,color:fasthugChecked[i]?tm:tp,textDecorationLine:fasthugChecked[i]?"line-through":"none"}}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={()=>setFasthugChecked(FASTHUG_BUNDLE.map(()=>false))} style={{flexDirection:"row",alignItems:"center",gap:6,paddingVertical:8}}><Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset checklist</Text></TouchableOpacity>
            </>
          )}
          {bundleTab==="vap"&&(
            <>
              <Text style={{fontSize:14,fontWeight:"700",color:"#E53E3E"}}>Ventilator-Associated Pneumonia (VAP) Prevention</Text>
              <View style={{height:6,borderRadius:3,backgroundColor:isDark?"#233554":"#E2E8F0"}}><View style={{height:6,borderRadius:3,width:`${vapPct}%` as any,backgroundColor:vapPct===100?"#16A34A":"#E53E3E"}}/></View>
              {VAP_BUNDLE_UPDATED.map((item,i)=>(
                <TouchableOpacity key={i} onPress={()=>setVapChecked(p=>p.map((v,j)=>j===i?!v:v))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8}}>
                  <View style={{width:22,height:22,borderRadius:6,borderWidth:2,justifyContent:"center",alignItems:"center",backgroundColor:vapChecked[i]?"#16A34A":"transparent",borderColor:vapChecked[i]?"#16A34A":isDark?"#3D5470":"#CBD5E1"}}>{vapChecked[i]&&<Feather name="check" size={12} color="#FFF"/>}</View>
                  <Text style={{flex:1,fontSize:13,color:vapChecked[i]?tm:tp,textDecorationLine:vapChecked[i]?"line-through":"none"}}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={()=>setVapChecked(VAP_BUNDLE_UPDATED.map(()=>false))} style={{flexDirection:"row",alignItems:"center",gap:6,paddingVertical:8}}><Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset checklist</Text></TouchableOpacity>
            </>
          )}
          {bundleTab==="clabsi"&&(
            <>
              <Text style={{fontSize:14,fontWeight:"700",color:"#7C3AED"}}>CLABSI Prevention (Central Line Bundle)</Text>
              <View style={{height:6,borderRadius:3,backgroundColor:isDark?"#233554":"#E2E8F0"}}><View style={{height:6,borderRadius:3,width:`${clabsiPct}%` as any,backgroundColor:clabsiPct===100?"#16A34A":"#7C3AED"}}/></View>
              {CLABSI_BUNDLE_UPDATED.map((item,i)=>(
                <TouchableOpacity key={i} onPress={()=>setClabsiChecked(p=>p.map((v,j)=>j===i?!v:v))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8}}>
                  <View style={{width:22,height:22,borderRadius:6,borderWidth:2,justifyContent:"center",alignItems:"center",backgroundColor:clabsiChecked[i]?"#16A34A":"transparent",borderColor:clabsiChecked[i]?"#16A34A":isDark?"#3D5470":"#CBD5E1"}}>{clabsiChecked[i]&&<Feather name="check" size={12} color="#FFF"/>}</View>
                  <Text style={{flex:1,fontSize:13,color:clabsiChecked[i]?tm:tp,textDecorationLine:clabsiChecked[i]?"line-through":"none"}}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={()=>setClabsiChecked(CLABSI_BUNDLE_UPDATED.map(()=>false))} style={{flexDirection:"row",alignItems:"center",gap:6,paddingVertical:8}}><Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset checklist</Text></TouchableOpacity>
            </>
          )}
          {bundleTab==="cauti"&&(
            <>
              <Text style={{fontSize:14,fontWeight:"700",color:"#F59E0B"}}>CAUTI Prevention (Urinary Catheter Bundle)</Text>
              <View style={{height:6,borderRadius:3,backgroundColor:isDark?"#233554":"#E2E8F0"}}><View style={{height:6,borderRadius:3,width:`${cautiPct}%` as any,backgroundColor:cautiPct===100?"#16A34A":"#F59E0B"}}/></View>
              {CAUTI_BUNDLE.map((item,i)=>(
                <TouchableOpacity key={i} onPress={()=>setCautiChecked(p=>p.map((v,j)=>j===i?!v:v))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8}}>
                  <View style={{width:22,height:22,borderRadius:6,borderWidth:2,justifyContent:"center",alignItems:"center",backgroundColor:cautiChecked[i]?"#16A34A":"transparent",borderColor:cautiChecked[i]?"#16A34A":isDark?"#3D5470":"#CBD5E1"}}>{cautiChecked[i]&&<Feather name="check" size={12} color="#FFF"/>}</View>
                  <Text style={{flex:1,fontSize:13,color:cautiChecked[i]?tm:tp,textDecorationLine:cautiChecked[i]?"line-through":"none"}}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={()=>setCautiChecked(CAUTI_BUNDLE.map(()=>false))} style={{flexDirection:"row",alignItems:"center",gap:6,paddingVertical:8}}><Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset checklist</Text></TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={()=>{setFasthugChecked(FASTHUG_BUNDLE.map(()=>false));setVapChecked(VAP_BUNDLE_UPDATED.map(()=>false));setClabsiChecked(CLABSI_BUNDLE_UPDATED.map(()=>false));setCautiChecked(CAUTI_BUNDLE.map(()=>false));}} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:6,paddingVertical:10,borderRadius:10,backgroundColor:isDark?"#1A0505":"#FEE2E2",marginTop:8}}>
            <Feather name="rotate-ccw" size={14} color="#DC2626"/><Text style={{fontSize:13,fontWeight:"700",color:"#DC2626"}}>Reset All Bundles</Text>
          </TouchableOpacity>
        </View>
      );

      // ── IV FLUIDS ─────────────────────────────────────────────────────────
      case "fluids": return (
        <View style={{gap:12}}>
          <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
            <StarButton isFav={isFav("tool-fluids")} onToggle={()=>toggleFav({id:"tool-fluids",type:"tool",label:"IV Fluids",color:"#0EA5E9"})} size={18} color="#0EA5E9"/>
          </View>
          <Text style={{fontSize:11,color:tm,fontStyle:"italic"}}>Holliday-Segar · Harriet Lane 23e · Nelson 22e</Text>
          <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Patient Weight (kg)</Text>
          <TextInput style={inputStyle} value={fluidWt} onChangeText={setFluidWt} keyboardType="decimal-pad" placeholder="e.g. 15" placeholderTextColor={tm}/>
          <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Clinical Scenario</Text>
          <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
            {[{key:"maintenance",label:"Maintenance"},{key:"neonatal",label:"Neonatal"},{key:"dehydration",label:"Dehydration"},{key:"resuscitation",label:"Resuscitation"},{key:"dka",label:"DKA / Metabolic"}].map(s=>(
              <Chip key={s.key} label={s.label} color={s.key==="resuscitation"||s.key==="dka"?"#DC2626":s.key==="neonatal"?"#7C3AED":"#0EA5E9"} selected={scenario===s.key as any} onPress={()=>setScenario(s.key as any)} isDark={isDark}/>
            ))}
          </View>
          <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Maintenance Target</Text>
          <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
            {([{key:100,label:"100% (Full)"},{key:75,label:"75% (3/4)"},{key:66,label:"66% (2/3)"},{key:50,label:"50% (1/2)"}]).map(m=>(
              <Chip key={m.key} label={m.label} color="#0891B2" selected={maintTarget===m.key as any} onPress={()=>setMaintTarget(m.key as any)} isDark={isDark}/>
            ))}
          </View>
          {maintenance&&(
            <>
              <View style={{backgroundColor:"#0EA5E915",borderColor:"#0EA5E940",borderWidth:1.5,borderRadius:12,padding:14}}>
                <Text style={{fontSize:13,fontWeight:"700",color:"#0EA5E9",marginBottom:8}}>Maintenance Fluids {maintTarget<100?`(${maintTarget}% of Holliday-Segar)`:""}</Text>
                <Row label="24-hour total" value={`${maintenance.daily} mL/day`} isDark={isDark}/>
                <Row label="Hourly rate" value={`${maintenance.hourly} mL/hr`} isDark={isDark}/>
              </View>
              <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Dehydration Severity</Text>
              <View style={{flexDirection:"row",gap:8}}>
                {([5,10,15] as const).map(pct=>(
                  <Chip key={pct} label={`${pct}% (${pct===5?"Mild":pct===10?"Moderate":"Severe"})`} color={pct===5?"#16A34A":pct===10?"#D97706":"#DC2626"} selected={dehydPct===pct} onPress={()=>setDehydPct(pct)} isDark={isDark}/>
                ))}
              </View>
              <View style={{backgroundColor:"#D9770615",borderColor:"#D9770640",borderWidth:1.5,borderRadius:12,padding:14}}>
                <Text style={{fontSize:13,fontWeight:"700",color:"#D97706",marginBottom:8}}>Fluid Deficit</Text>
                <Row label="Deficit volume" value={`${deficit} mL`} isDark={isDark}/>
                <Row label="Replace over 48h + maintenance" value={`${total48h} mL/day`} isDark={isDark}/>
                <Row label="Total hourly rate" value={`${+(total48h/24).toFixed(1)} mL/hr`} isDark={isDark}/>
              </View>
              <ScenarioFluidPanel scenario={scenario} kCl={kClToggle} isDark={isDark} textMuted={tm} textPrimary={tp}/>
            </>
          )}
        </View>
      );

      // ── ELECTROLYTES ──────────────────────────────────────────────────────
      case "electrolytes": return (
        <View style={{gap:12}}>
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            <View><Text style={{fontSize:12,fontWeight:"700",color:"#0891B2"}}>K⁺ Correction Calculator</Text><Text style={{fontSize:10,color:tm,marginTop:1}}>Deficit = (Target − Actual) × Weight × 0.4</Text></View>
            <StarButton isFav={isFav("tool-electrolytes")} onToggle={()=>toggleFav({id:"tool-electrolytes",type:"tool",label:"Electrolyte Correction",color:"#0891B2"})} size={18} color="#0891B2"/>
          </View>
          <View style={{flexDirection:"row",gap:8}}>
            <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Actual K⁺ (mEq/L)</Text><TextInput style={inputStyle} value={elActualK} onChangeText={setElActualK} keyboardType="decimal-pad" placeholder="e.g. 2.8" placeholderTextColor={tm}/></View>
            <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Target K⁺ (mEq/L)</Text><TextInput style={inputStyle} value={elTargetK} onChangeText={setElTargetK} keyboardType="decimal-pad" placeholder="e.g. 4.0" placeholderTextColor={tm}/></View>
          </View>
          <Text style={{fontSize:12,fontWeight:"700",color:tm}}>Weight (kg)</Text>
          <TextInput style={inputStyle} value={elWt} onChangeText={setElWt} keyboardType="decimal-pad" placeholder="e.g. 15" placeholderTextColor={tm}/>
          <View style={{flexDirection:"row",gap:8}}>
            <TouchableOpacity onPress={()=>setElCentral(!elCentral)} style={{flex:1,paddingVertical:10,borderRadius:10,alignItems:"center",backgroundColor:elCentral?"#0891B2":isDark?"#1E293B":"#F1F5F9",borderWidth:2,borderColor:elCentral?"#0891B2":isDark?"#334155":"#CBD5E1"}}>
              <Text style={{fontWeight:"700",fontSize:12,color:elCentral?"#FFFFFF":tm}}>🏥 Central Line</Text>
              <Text style={{fontSize:10,color:elCentral?"#E0F7FA":tm,marginTop:2}}>{elCentral?"80 mEq/L max":"Peripheral"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setElRestrictFluids(!elRestrictFluids)} style={{flex:1,paddingVertical:10,borderRadius:10,alignItems:"center",backgroundColor:elRestrictFluids?"#7C3AED":isDark?"#1E293B":"#F1F5F9",borderWidth:2,borderColor:elRestrictFluids?"#7C3AED":isDark?"#334155":"#CBD5E1"}}>
              <Text style={{fontWeight:"700",fontSize:12,color:elRestrictFluids?"#FFFFFF":tm}}>💧 Restrict Fluids</Text>
              <Text style={{fontSize:10,color:elRestrictFluids?"#EDE9FE":tm,marginTop:2}}>{elRestrictFluids?"High-conc. recipe":"Standard volume"}</Text>
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor:isDark?"#0F172A":"#FEF9C3",borderColor:isDark?"#334155":"#FDE047",borderWidth:1.5,borderRadius:10,padding:12}}>
            <Text style={{fontSize:12,fontWeight:"800",color:"#B45309",marginBottom:8}}>⚠ Safety Checklist — Required Before Infusion</Text>
            {([{key:"renal",label:"Renal function (Cr / BUN) checked?"},{key:"ecg",label:"Baseline ECG performed?"},{key:"mg",label:"Magnesium levels normal (≥ 0.7 mmol/L)?"}] as {key: keyof typeof elChecklist;label:string}[]).map(item=>(
              <TouchableOpacity key={item.key} onPress={()=>setElChecklist(p=>({...p,[item.key]:!p[item.key]}))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:6}}>
                <View style={{width:22,height:22,borderRadius:6,borderWidth:2,borderColor:elChecklist[item.key]?"#16A34A":"#D97706",backgroundColor:elChecklist[item.key]?"#16A34A":"transparent",justifyContent:"center",alignItems:"center"}}>{elChecklist[item.key]&&<Feather name="check" size={13} color="#FFFFFF"/>}</View>
                <Text style={{flex:1,fontSize:13,color:elChecklist[item.key]?"#16A34A":isDark?"#FDE68A":"#92400E"}}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {elDeficit>0&&elChecklistDone&&(
            <View style={{gap:8}}>
              <View style={{flexDirection:"row",gap:8}}>
                <View style={{flex:1,backgroundColor:"#0891B220",borderColor:"#0891B250",borderWidth:1.5,borderRadius:10,padding:12,alignItems:"center"}}><Text style={{fontSize:11,color:tm,fontWeight:"600",marginBottom:2}}>TOTAL DEFICIT</Text><Text style={{fontSize:26,fontWeight:"800",color:"#0891B2"}}>{elDeficit}</Text><Text style={{fontSize:12,color:tm}}>mEq</Text></View>
                <View style={{flex:1,backgroundColor:"#0891B220",borderColor:"#0891B250",borderWidth:1.5,borderRadius:10,padding:12,alignItems:"center"}}><Text style={{fontSize:11,color:tm,fontWeight:"600",marginBottom:2}}>RATE</Text><Text style={{fontSize:26,fontWeight:"800",color:"#0891B2"}}>{elRateMLHr}</Text><Text style={{fontSize:12,color:tm}}>mL/hr</Text></View>
              </View>
              <View style={{backgroundColor:isDark?"#0A192F":"#EFF6FF",borderColor:isDark?"#1E3A5F":"#BFDBFE",borderWidth:1,borderRadius:10,padding:12}}>
                <Text style={{fontSize:12,fontWeight:"800",color:"#2563EB",marginBottom:6}}>{(elCentral||elRestrictFluids)?"Central / Fluid-Restricted Recipe":"Peripheral Line Recipe"}</Text>
                <Text style={{fontSize:13,color:tp,lineHeight:20}}>{"• KCl drawn: "}<Text style={{fontWeight:"700",color:"#0891B2"}}>{elKClML} mL</Text>{" from 2 mEq/mL ampoule\n• Add NS: "}<Text style={{fontWeight:"700",color:"#0891B2"}}>{elNSML} mL</Text>{"\n• Total syringe: "}<Text style={{fontWeight:"700",color:"#0891B2"}}>{elTotalVol} mL</Text>{"\n• Concentration: "}<Text style={{fontWeight:"700",color:"#0891B2"}}>{(elCentral||elRestrictFluids)?80:40} mEq/L</Text></Text>
                <Text style={{fontSize:12,color:tm,marginTop:8}}>Infusion duration: ~<Text style={{fontWeight:"700",color:"#0891B2"}}>{elDurationHr} hr</Text>{"  ·  Rate: "}<Text style={{fontWeight:"700"}}>{elCentral?0.5:0.3} mEq/kg/hr</Text></Text>
              </View>
              <View style={{backgroundColor:"#FEF2F2",borderColor:"#FECACA",borderWidth:1,borderRadius:10,padding:10}}>
                <Text style={{fontSize:11,color:"#DC2626",fontWeight:"700",marginBottom:4}}>⚠ Clinical Warnings</Text>
                <Text style={{fontSize:11,color:"#991B1B",lineHeight:18}}>{"• Max peripheral KCl: 40 mEq/L — extravasation risk\n• Central line required if conc. > 40 mEq/L\n• Never give KCl bolus IV — fatal arrhythmia risk\n• Continuous ECG monitoring during infusion\n• Recheck K⁺ level 1–2 hr after infusion"}</Text>
              </View>
            </View>
          )}
        </View>
      );

      // ── GCS ───────────────────────────────────────────────────────────────
      case "gcs": return (
        <View style={{gap:10}}>
          <View style={{flexDirection:"row",justifyContent:"flex-end"}}><StarButton isFav={isFav("tool-gcs")} onToggle={()=>toggleFav({id:"tool-gcs",type:"tool",label:"Pediatric GCS",color:"#16A34A"})} size={18} color="#16A34A"/></View>
          <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>Modified GCS for verbal children and infants (Reilly et al. 1988 / PALS 2025). Score range: 3–15.</Text>
          <Text style={{fontSize:13,fontWeight:"700",color:tp}}>Eye Opening (E) — selected: {eye}</Text>
          <GCSOption options={EYE_OPTIONS} selected={eye} onSelect={setEye} isDark={isDark}/>
          <Text style={{fontSize:13,fontWeight:"700",color:tp}}>Verbal Response (V) — selected: {verbal}</Text>
          <GCSOption options={VERBAL_OPTIONS} selected={verbal} onSelect={setVerbal} isDark={isDark}/>
          <Text style={{fontSize:13,fontWeight:"700",color:tp}}>Motor Response (M) — selected: {motor}</Text>
          <GCSOption options={MOTOR_OPTIONS} selected={motor} onSelect={setMotor} isDark={isDark}/>
          <View style={{backgroundColor:gcsResult.color+"15",borderColor:gcsResult.color+"40",borderWidth:1.5,borderRadius:12,padding:16,alignItems:"center"}}>
            <Text style={{fontSize:28,fontWeight:"900",color:gcsResult.color}}>pGCS = {gcsTotal} / 15</Text>
            <Text style={{fontSize:13,color:tm,marginTop:4}}>E{eye} + V{verbal} + M{motor} = {gcsTotal}</Text>
            <Text style={{fontSize:14,fontWeight:"700",color:gcsResult.color,marginTop:4}}>{gcsResult.label}</Text>
          </View>
          <TouchableOpacity onPress={()=>{setEye(4);setVerbal(5);setMotor(6);}} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:6,paddingVertical:10,borderRadius:10,backgroundColor:isDark?"#1E293B":"#F1F5F9"}}>
            <Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset GCS</Text>
          </TouchableOpacity>
        </View>
      );

      // ── ADVANCED ICU SCORES ───────────────────────────────────────────────
      case "scores": return (
        <View style={{gap:10}}>
          <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
            {[{key:"four",label:"FOUR Score",color:"#0891B2"},{key:"osi",label:"OSI",color:"#0EA5E9"},{key:"sipa",label:"SIPA",color:"#D97706"},{key:"wat1",label:"WAT-1",color:"#FF4C60"}].map(s=>(
              <Chip key={s.key} label={s.label} color={s.color} selected={scoreTab===s.key as any} onPress={()=>setScoreTab(s.key as any)} isDark={isDark}/>
            ))}
          </View>
          {scoreTab==="four"&&(
            <>
              <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>Full Outline of UnResponsiveness (Wijdicks et al. 2005). Range 0–16.</Text>
              {[{label:"Eye Response",options:FOUR_EYE,value:fourEye,setter:setFourEye},{label:"Motor Response",options:FOUR_MOTOR,value:fourMotor,setter:setFourMotor},{label:"Brainstem Reflexes",options:FOUR_BRAINSTEM,value:fourBrainstem,setter:setFourBrainstem},{label:"Respiration",options:FOUR_RESP,value:fourResp,setter:setFourResp}].map(section=>(
                <View key={section.label}>
                  <Text style={{fontSize:13,fontWeight:"700",color:tp,marginBottom:6}}>{section.label} — selected: {section.value}</Text>
                  <View style={{gap:6,marginBottom:8}}>
                    {section.options.map(opt=>(
                      <TouchableOpacity key={opt.value} onPress={()=>section.setter(opt.value)} style={{flexDirection:"row",alignItems:"center",gap:10,padding:10,borderRadius:10,borderWidth:1.5,backgroundColor:section.value===opt.value?"#0891B220":isDark?"#0F1F2E":"#F8FAFC",borderColor:section.value===opt.value?"#0891B2":border}}>
                        <View style={{width:18,height:18,borderRadius:9,borderWidth:2,justifyContent:"center",alignItems:"center",borderColor:section.value===opt.value?"#0891B2":tm}}>{section.value===opt.value&&<View style={{width:8,height:8,borderRadius:4,backgroundColor:"#0891B2"}}/>}</View>
                        <Text style={{flex:1,fontSize:13,color:isDark?"#CBD5E1":"#334155"}}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
              <View style={{backgroundColor:fourInterpret.color+"15",borderColor:fourInterpret.color+"40",borderWidth:1.5,borderRadius:12,padding:14,alignItems:"center"}}>
                <Text style={{fontSize:22,fontWeight:"900",color:fourInterpret.color}}>FOUR = {fourTotal} / 16</Text>
                <Text style={{fontSize:13,fontWeight:"700",color:fourInterpret.color,marginTop:4}}>{fourInterpret.label}</Text>
              </View>
              <TouchableOpacity onPress={()=>{setFourEye(4);setFourMotor(4);setFourBrainstem(4);setFourResp(4);}} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:6,paddingVertical:10,borderRadius:10,backgroundColor:isDark?"#1E293B":"#F1F5F9"}}>
                <Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset FOUR Score</Text>
              </TouchableOpacity>
            </>
          )}
          {scoreTab==="osi"&&(
            <>
              <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>Oxygen Saturation Index (OSI) — Severe et al. 2014{"\n"}Formula: OSI = (MAP × FiO₂%) / SpO₂%</Text>
              <View style={{flexDirection:"row",gap:8}}>
                <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>MAP (mmHg)</Text><TextInput style={inputStyle} value={osiMap} onChangeText={setOsiMap} keyboardType="decimal-pad" placeholder="e.g. 70" placeholderTextColor={tm}/></View>
                <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>FiO₂ (%)</Text><TextInput style={inputStyle} value={osiFio2} onChangeText={setOsiFio2} keyboardType="decimal-pad" placeholder="e.g. 40" placeholderTextColor={tm}/></View>
                <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>SpO₂ (%)</Text><TextInput style={inputStyle} value={osiSpo2} onChangeText={setOsiSpo2} keyboardType="decimal-pad" placeholder="e.g. 95" placeholderTextColor={tm}/></View>
              </View>
              {osiVal!==null&&osiInterp&&<View style={{backgroundColor:osiInterp.color+"15",borderColor:osiInterp.color+"40",borderWidth:1.5,borderRadius:12,padding:14,alignItems:"center"}}><Text style={{fontSize:22,fontWeight:"900",color:osiInterp.color}}>OSI = {osiVal}</Text><Text style={{fontSize:13,fontWeight:"700",color:osiInterp.color,marginTop:4}}>{osiInterp.label}</Text></View>}
            </>
          )}
          {scoreTab==="sipa"&&(
            <>
              <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>Pediatric Age-Adjusted Shock Index (SIPA){"\n"}SI = HR / SBP · Compare to age-specific threshold</Text>
              <View style={{flexDirection:"row",gap:8}}>
                <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Age</Text><TextInput style={inputStyle} value={sipaAge} onChangeText={setSipaAge} keyboardType="decimal-pad" placeholder="e.g. 5" placeholderTextColor={tm}/></View>
                <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>HR (bpm)</Text><TextInput style={inputStyle} value={sipaHR} onChangeText={setSipaHR} keyboardType="decimal-pad" placeholder="e.g. 140" placeholderTextColor={tm}/></View>
                <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>SBP (mmHg)</Text><TextInput style={inputStyle} value={sipaSBP} onChangeText={setSipaSBP} keyboardType="decimal-pad" placeholder="e.g. 80" placeholderTextColor={tm}/></View>
              </View>
              <View style={{flexDirection:"row",gap:8}}><Chip label="Years" color="#D97706" selected={sipaAgeUnit==="years"} onPress={()=>setSipaAgeUnit("years")} isDark={isDark}/><Chip label="Months" color="#D97706" selected={sipaAgeUnit==="months"} onPress={()=>setSipaAgeUnit("months")} isDark={isDark}/></View>
              {sipaSi!==null&&<View style={{backgroundColor:sipaAlert?"#FEE2E2":"#DCFCE715",borderColor:sipaAlert?"#FCA5A5":"#86EFAC40",borderWidth:1.5,borderRadius:12,padding:14,alignItems:"center"}}><Text style={{fontSize:18,fontWeight:"900",color:sipaAlert?"#DC2626":"#16A34A"}}>SIPA = {sipaSi} (threshold: {sipaThresholdVal})</Text><Text style={{fontSize:13,fontWeight:"700",color:sipaAlert?"#DC2626":"#16A34A",marginTop:4}}>{sipaAlert?"SIPA ABOVE threshold — possible shock":"SIPA within normal limits"}</Text></View>}
            </>
          )}
          {scoreTab==="wat1"&&(
            <>
              <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>WAT-1 (Franck et al. 2012) · Range 0–12 · Score ≥3 = significant withdrawal</Text>
              <Text style={{fontSize:13,fontWeight:"700",color:tp}}>Section 1: Past 12 Hours</Text>
              {WAT1_PAST12.map((item,i)=>(
                <TouchableOpacity key={item.label} onPress={()=>setWat1Past12(p=>p.map((v,j)=>j===i?!v:v))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8}}>
                  <View style={{width:22,height:22,borderRadius:6,borderWidth:2,justifyContent:"center",alignItems:"center",backgroundColor:wat1Past12[i]?"#FF4C60":"transparent",borderColor:wat1Past12[i]?"#FF4C60":isDark?"#3D5470":"#CBD5E1"}}>{wat1Past12[i]&&<Feather name="check" size={12} color="#FFF"/>}</View>
                  <Text style={{flex:1,fontSize:13,color:wat1Past12[i]?tm:tp}}>{item.label} <Text style={{color:tm,fontWeight:"700"}}>(+{item.points})</Text></Text>
                </TouchableOpacity>
              ))}
              <Text style={{fontSize:13,fontWeight:"700",color:tp}}>Section 2: 2-Minute Observation</Text>
              {WAT1_OBS2MIN.map((item,i)=>(
                <TouchableOpacity key={item.label} onPress={()=>setWat1Obs2(p=>p.map((v,j)=>j===i?!v:v))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8}}>
                  <View style={{width:22,height:22,borderRadius:6,borderWidth:2,justifyContent:"center",alignItems:"center",backgroundColor:wat1Obs2[i]?"#FF4C60":"transparent",borderColor:wat1Obs2[i]?"#FF4C60":isDark?"#3D5470":"#CBD5E1"}}>{wat1Obs2[i]&&<Feather name="check" size={12} color="#FFF"/>}</View>
                  <Text style={{flex:1,fontSize:13,color:wat1Obs2[i]?tm:tp}}>{item.label} <Text style={{color:tm,fontWeight:"700"}}>(+{item.points})</Text></Text>
                </TouchableOpacity>
              ))}
              <Text style={{fontSize:13,fontWeight:"700",color:tp}}>Section 3: Stimulus Observation</Text>
              {WAT1_STIMULUS.map((item,i)=>(
                <TouchableOpacity key={item.label} onPress={()=>setWat1Stim(p=>p.map((v,j)=>j===i?!v:v))} style={{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8}}>
                  <View style={{width:22,height:22,borderRadius:6,borderWidth:2,justifyContent:"center",alignItems:"center",backgroundColor:wat1Stim[i]?"#FF4C60":"transparent",borderColor:wat1Stim[i]?"#FF4C60":isDark?"#3D5470":"#CBD5E1"}}>{wat1Stim[i]&&<Feather name="check" size={12} color="#FFF"/>}</View>
                  <Text style={{flex:1,fontSize:13,color:wat1Stim[i]?tm:tp}}>{item.label} <Text style={{color:tm,fontWeight:"700"}}>(+{item.points})</Text></Text>
                </TouchableOpacity>
              ))}
              <Text style={{fontSize:13,fontWeight:"700",color:tp}}>Time to gain calm state</Text>
              <View style={{flexDirection:"row",gap:8}}>
                {WAT1_CALM_TIME.map(opt=>(
                  <TouchableOpacity key={opt.label} onPress={()=>setWat1CalmTime(opt.points)} style={{flex:1,paddingVertical:10,borderRadius:10,alignItems:"center",borderWidth:1.5,backgroundColor:wat1CalmTime===opt.points?"#FF4C60":isDark?"#0A192F":"#F8FAFC",borderColor:wat1CalmTime===opt.points?"#FF4C60":border}}>
                    <Text style={{fontSize:13,fontWeight:"600",color:wat1CalmTime===opt.points?"#FFFFFF":tm}}>{opt.label}</Text>
                    <Text style={{fontSize:11,color:wat1CalmTime===opt.points?"rgba(255,255,255,0.8)":tm}}>{opt.points>0?`+${opt.points}`:opt.points}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{backgroundColor:wat1Interpret.color+"15",borderColor:wat1Interpret.color+"40",borderWidth:1.5,borderRadius:12,padding:14,alignItems:"center"}}>
                <Text style={{fontSize:22,fontWeight:"900",color:wat1Interpret.color}}>WAT-1 Score = {wat1Score} / 12</Text>
                <Text style={{fontSize:13,fontWeight:"700",color:wat1Interpret.color,marginTop:4}}>{wat1Interpret.label}</Text>
                <Text style={{fontSize:12,color:tm,marginTop:4}}>{wat1Score<=2?"Routine monitoring":"Consider weaning / sedation adjustment"}</Text>
              </View>
              <TouchableOpacity onPress={()=>{setWat1Past12(WAT1_PAST12.map(()=>false));setWat1Obs2(WAT1_OBS2MIN.map(()=>false));setWat1Stim(WAT1_STIMULUS.map(()=>false));setWat1CalmTime(0);}} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:6,paddingVertical:10,borderRadius:10,backgroundColor:isDark?"#1E293B":"#F1F5F9"}}>
                <Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset WAT-1</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      );

      // ── RENAL / HEPATIC ───────────────────────────────────────────────────
      case "renal": return (
        <View style={{gap:10}}>
          <View style={{flexDirection:"row",gap:8}}>
            <Chip label="Renal" color="#DC2626" selected={renalTab==="renal"} onPress={()=>setRenalTab("renal")} isDark={isDark}/>
            <Chip label="Hepatic" color="#D97706" selected={renalTab==="hepatic"} onPress={()=>setRenalTab("hepatic")} isDark={isDark}/>
          </View>
          {renalTab==="renal"&&(
            <>
              <View style={{backgroundColor:isDark?"#1C0A0A":"#FFF1F1",borderColor:isDark?"#4A1A1A":"#FCA5A5",borderWidth:1.5,borderRadius:12,padding:14}}>
                <Text style={{fontSize:13,fontWeight:"700",color:"#DC2626",marginBottom:4}}>Schwartz eGFR (Paediatric)</Text>
                <Text style={{fontSize:11,color:tm,marginBottom:10,fontStyle:"italic"}}>eGFR = 0.413 × Height(cm) / Serum Creatinine(mg/dL)</Text>
                <View style={{flexDirection:"row",gap:8}}>
                  <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Height (cm)</Text><TextInput style={inputStyle} value={crclHt} onChangeText={setCrclHt} keyboardType="decimal-pad" placeholder="e.g. 90" placeholderTextColor={tm}/></View>
                  <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"700",color:tm,marginBottom:6}}>Creatinine (mg/dL)</Text><TextInput style={inputStyle} value={crclCr} onChangeText={setCrclCr} keyboardType="decimal-pad" placeholder="e.g. 0.5" placeholderTextColor={tm}/></View>
                </View>
                {schwartz!==null&&<View style={{backgroundColor:crclSeverity(schwartz).color+"15",borderColor:crclSeverity(schwartz).color+"40",borderWidth:1.5,borderRadius:10,padding:12,alignItems:"center",marginTop:8}}><Text style={{fontSize:18,fontWeight:"900",color:crclSeverity(schwartz).color}}>eGFR = {schwartz} mL/min/1.73m²</Text><Text style={{fontSize:13,color:tm,marginTop:4}}>{crclSeverity(schwartz).label}</Text></View>}
              </View>
              <Text style={{fontSize:14,fontWeight:"700",color:tp,marginTop:4}}>Drug Adjustments in Renal Failure</Text>
              {RENAL_DRUGS.map(d=>(
                <View key={d.drug} style={{borderLeftWidth:3,borderLeftColor:d.alert==="high"?"#DC2626":d.alert==="moderate"?"#D97706":"#16A34A",backgroundColor:isDark?"#0A192F":"#F8FAFC",borderRadius:8,padding:12,marginBottom:4}}>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                    <Text style={{fontSize:13,fontWeight:"700",color:tp}}>{d.drug}</Text>
                    <View style={{backgroundColor:d.alert==="high"?"#DC262620":d.alert==="moderate"?"#D9770620":"#16A34A20",borderRadius:6,paddingHorizontal:8,paddingVertical:3}}>
                      <Text style={{fontSize:10,fontWeight:"700",color:d.alert==="high"?"#DC2626":d.alert==="moderate"?"#D97706":"#16A34A"}}>{d.alert==="high"?"HIGH RISK":d.alert==="moderate"?"CAUTION":"LOW RISK"}</Text>
                    </View>
                  </View>
                  <Text style={{fontSize:12,color:tm,lineHeight:18}}>{d.adj}</Text>
                </View>
              ))}
            </>
          )}
          {renalTab==="hepatic"&&(
            <>
              <View style={{backgroundColor:isDark?"#1A0D00":"#FFFBEB",borderColor:isDark?"#4A2800":"#FCD34D",borderWidth:1.5,borderRadius:12,padding:14}}>
                <Text style={{fontSize:13,fontWeight:"700",color:"#D97706",marginBottom:6}}>Hepatic Failure — General Principles</Text>
                <Text style={{fontSize:12,color:tm,lineHeight:20}}>{"• Most sedatives, opioids, and antimicrobials are hepatically metabolised\n• Child-Pugh score guides severity: A (5–6), B (7–9), C (10–15)\n• Avoid nephrotoxic drugs — hepatorenal syndrome risk\n• Monitor coagulation (PT/INR) and ammonia regularly\n• Anticipate prolonged drug effect — titrate slowly"}</Text>
              </View>
              <Text style={{fontSize:14,fontWeight:"700",color:tp,marginTop:4}}>Drug Adjustments in Hepatic Failure</Text>
              {HEPATIC_DRUGS.map(d=>(
                <View key={d.drug} style={{borderLeftWidth:3,borderLeftColor:d.alert==="high"?"#DC2626":"#D97706",backgroundColor:isDark?"#0A192F":"#F8FAFC",borderRadius:8,padding:12,marginBottom:4}}>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                    <Text style={{fontSize:13,fontWeight:"700",color:tp}}>{d.drug}</Text>
                    <View style={{backgroundColor:d.alert==="high"?"#DC262620":"#D9770620",borderRadius:6,paddingHorizontal:8,paddingVertical:3}}>
                      <Text style={{fontSize:10,fontWeight:"700",color:d.alert==="high"?"#DC2626":"#D97706"}}>{d.alert==="high"?"HIGH RISK":"CAUTION"}</Text>
                    </View>
                  </View>
                  <Text style={{fontSize:12,color:tm,lineHeight:18}}>{d.adj}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      );

      // ── PEWS ──────────────────────────────────────────────────────────────
      case "pews": return (
        <View style={{gap:12}}>
          <View style={{flexDirection:"row",justifyContent:"flex-end"}}><StarButton isFav={isFav("tool-pews")} onToggle={()=>toggleFav({id:"tool-pews",type:"tool",label:"PEWS Score",color:"#FF4C60"})} size={18} color="#FF4C60"/></View>
          <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>Pediatric Early Warning Score (PEWS) — 3 categories 0–3 each. Total 0–9.</Text>
          {[{l:"Behavior",v:pewsB,s:setPewsB},{l:"Cardiovascular",v:pewsCv,s:setPewsCv},{l:"Respiratory",v:pewsR,s:setPewsR}].map(x=>(
            <View key={x.l}>
              <Text style={{fontSize:13,fontWeight:"700",color:tp,marginBottom:8}}>{x.l} (0–3)</Text>
              <View style={{flexDirection:"row",gap:8}}>
                {[0,1,2,3].map(n=>(
                  <TouchableOpacity key={n} onPress={()=>x.s(n.toString())} style={{flex:1,paddingVertical:12,borderRadius:10,alignItems:"center",borderWidth:1.5,backgroundColor:x.v===n.toString()?"#FF4C60":isDark?"#0A192F":"#F8FAFC",borderColor:x.v===n.toString()?"#FF4C60":border}}>
                    <Text style={{fontSize:16,fontWeight:"700",color:x.v===n.toString()?"#FFFFFF":tm}}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <View style={{backgroundColor:pewsAlert?"#FF4C6015":"#16A34A15",borderColor:pewsAlert?"#FF4C6040":"#16A34A40",borderWidth:1.5,borderRadius:12,padding:16,alignItems:"center"}}>
            <Text style={{fontSize:28,fontWeight:"900",color:pewsAlert?"#FF4C60":"#16A34A"}}>PEWS = {pewsSum} / 9</Text>
            <Text style={{fontSize:13,fontWeight:"700",color:pewsAlert?"#FF4C60":"#16A34A",marginTop:4}}>{pewsAlert?"⚠ Urgent: Activate Rapid Response":"Routine monitoring"}</Text>
          </View>
        </View>
      );

      // ── APGAR ─────────────────────────────────────────────────────────────
      case "apgar": return (
        <View style={{gap:12}}>
          <View style={{flexDirection:"row",justifyContent:"flex-end"}}><StarButton isFav={isFav("tool-apgar")} onToggle={()=>toggleFav({id:"tool-apgar",type:"tool",label:"APGAR Score",color:"#EC4899"})} size={18} color="#EC4899"/></View>
          <Text style={{fontSize:12,color:tm,fontStyle:"italic"}}>Neonatal assessment at 1 and 5 minutes. Score range: 0–10.</Text>
          {apgarItems.map(item=>(
            <View key={item.key}>
              <Text style={{fontSize:13,fontWeight:"700",color:tp,marginBottom:8}}>{item.key} — <Text style={{color:tm,fontWeight:"400"}}>selected: {item.value??'—'}</Text></Text>
              <View style={{flexDirection:"row",gap:6}}>
                {item.options.map(opt=>(
                  <TouchableOpacity key={opt.score} onPress={()=>item.setter(opt.score)} style={{flex:1,paddingVertical:10,borderRadius:10,alignItems:"center",borderWidth:1.5,backgroundColor:item.value===opt.score?"#EC4899":isDark?"#0A192F":"#F8FAFC",borderColor:item.value===opt.score?"#EC4899":border}}>
                    <Text style={{fontSize:16,fontWeight:"700",color:item.value===opt.score?"#FFFFFF":tm}}>{opt.score}</Text>
                    <Text style={{fontSize:10,color:item.value===opt.score?"rgba(255,255,255,0.8)":tm,marginTop:2,textAlign:"center"}}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <View style={{backgroundColor:apgarTotal>=7?"#16A34A15":apgarTotal>=4?"#F59E0B15":"#FEE2E2",borderColor:apgarTotal>=7?"#16A34A40":apgarTotal>=4?"#F59E0B40":"#FCA5A5",borderWidth:1.5,borderRadius:12,padding:16,alignItems:"center"}}>
            <Text style={{fontSize:28,fontWeight:"900",color:apgarTotal>=7?"#16A34A":apgarTotal>=4?"#F59E0B":"#DC2626"}}>APGAR = {apgarTotal} / 10</Text>
            <Text style={{fontSize:14,fontWeight:"700",color:apgarTotal>=7?"#16A34A":apgarTotal>=4?"#F59E0B":"#DC2626",marginTop:4}}>{apgarTotal>=7?"Normal":apgarTotal>=4?"Moderately depressed":"Severely depressed"}</Text>
            {apgarTotal<7&&<Text style={{fontSize:12,color:tm,marginTop:4}}>If HR &lt; 100: PPV. If HR &lt; 60: CPR + Epi</Text>}
          </View>
          <TouchableOpacity onPress={()=>{setApgarA(null);setApgarP(null);setApgarG(null);setApgarAc(null);setApgarR(null);}} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:6,paddingVertical:10,borderRadius:10,backgroundColor:isDark?"#1E293B":"#F1F5F9"}}>
            <Feather name="rotate-ccw" size={14} color={tm}/><Text style={{fontSize:12,color:tm}}>Reset APGAR</Text>
          </TouchableOpacity>
        </View>
      );

      default: return <Text style={{color:tm,padding:20}}>Tool not found.</Text>;
    }
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:bg}} edges={["top","bottom"]}>
      {/* Header */}
      <View style={{flexDirection:"row",alignItems:"center",gap:12,paddingHorizontal:16,paddingVertical:14,backgroundColor:card,borderBottomWidth:1,borderBottomColor:border,...Platform.select({ios:{shadowColor:"#000",shadowOffset:{width:0,height:2},shadowOpacity:0.06,shadowRadius:8},android:{elevation:3}})}}>
        <TouchableOpacity onPress={()=>router.back()} style={{width:38,height:38,borderRadius:19,alignItems:"center",justifyContent:"center",backgroundColor:isDark?"#233554":"#F0F4F8"}}>
          <Feather name="arrow-left" size={20} color={isDark?"#8892B0":C.tint}/>
        </TouchableOpacity>
        <View style={{width:36,height:36,borderRadius:10,backgroundColor:meta.color+"1A",alignItems:"center",justifyContent:"center"}}>
          <Feather name={meta.icon as any} size={18} color={meta.color}/>
        </View>
        <View style={{flex:1,minWidth:0}}>
          <Text style={{fontSize:17,fontWeight:"800",color:tp,letterSpacing:-0.3}} numberOfLines={1}>{meta.title}</Text>
          <Text style={{fontSize:11,color:tm,marginTop:1}} numberOfLines={1}>{meta.subtitle}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{padding:16,paddingBottom:60}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {renderContent()}
        <ProfessionalFooter/>
      </ScrollView>
    </SafeAreaView>
  );
}
