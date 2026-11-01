// AUTO-GENERATED 2026-10-31 — formulary drugs converted into calculator format.
// Source: Harriet Lane 24th ed. formulary data (formularyData.ts + hlNewDrugs1-4.ts).
// Conversion rules (audited): per-day doses are split into a per-dose entry only when
// the frequency divides exactly (q12h/BID etc.); otherwise the daily total is shown
// with its frequency note. Numeric max caps are applied only where the cap's basis
// (per-dose vs per-day) is explicit in the source. Baclofen is intentionally absent
// (source unit suspected wrong — pending clinical verification).
// Drugs already in the hand-checked calculator list (constants/drugs.ts) are NOT
// duplicated here; those canonical entries win.
import type { Drug } from './drugs';

export const CONVERTED_DRUGS: Drug[] = [
 {
  "id": "fx-albendazole",
  "name": "Albendazole",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Single dose (soil-transmitted helminths)",
    "notes": ">2 yr and >10 kg: 400 mg single dose for STH. Neurocysticercosis: 15 mg/kg/day div BID × 8–30 days (max 800 mg/day). Hydatid: 7.5 mg/kg BID × 28 days (cycles)",
    "maxDose": "400 mg/dose",
    "unit": "mg",
    "perKg": false,
    "value": 400
   },
   {
    "route": "Oral",
    "frequency": "Single dose (soil-transmitted helminths)",
    "notes": ">2 yr and >10 kg: 400 mg (10 mL of 4% suspension) single dose for STH. Neurocysticercosis: 15 mg/kg/day div BID × 8–30 days (max 800 mg/day). Can be given with food. Shake well before use",
    "maxDose": "400 mg/dose",
    "unit": "mg/dose",
    "perKg": false,
    "value": 400
   }
  ],
  "indications": [
   "Soil-transmitted helminths (roundworm, hookworm, whipworm)",
   "Neurocysticercosis",
   "Hydatid disease (Echinococcus)",
   "Giardiasis (alternative)",
   "Soil-transmitted helminths in young children (roundworm, hookworm, whipworm)",
   "Neurocysticercosis (in combination with steroids)",
   "Hydatid disease"
  ],
  "contraindications": [
   "Age < 2 years (relative)",
   "Known hypersensitivity",
   "Pregnancy (Category D — teratogenic in animals)",
   "Ocular cysticercosis (before anti-inflammatory cover)",
   "Age < 2 years (limited data — weigh risk/benefit)",
   "Pregnancy (teratogenic — avoid)",
   "Ocular cysticercosis (before adequate steroid cover)"
  ],
  "formulations": [
   "200 mg tablet",
   "400 mg tablet (chewable)",
   "400 mg/10 mL suspension (40 mg/mL)"
  ],
  "monitoring": [
   "Liver function tests (especially with prolonged use)",
   "CBC (risk of leukopenia/aplastic anaemia with extended therapy)",
   "Neurological status and corticosteroid cover for neurocysticercosis",
   "LFTs (prolonged use)",
   "CBC (prolonged use)",
   "Clinical response"
  ],
  "notes": "Formulary class: Benzimidazole Anthelmintic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | WHO Essential Medicines"
 },
 {
  "id": "fx-amlodipine",
  "name": "Amlodipine",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 0.05–0.1 mg/kg/day; titrate at 2–4 week intervals. Usual paediatric dose 2.5–5 mg/day Per-dose amount calculated from 0.05–0.3 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "10 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.05,
    "max": 0.3
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 0.05–0.1 mg/kg/day; titrate at 2–4 week intervals. Usual paediatric dose 2.5–5 mg/day",
    "maxDose": "10 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.05,
    "max": 0.3,
    "adultMaxDose_num": 10
   }
  ],
  "indications": [
   "Hypertension",
   "Chronic stable angina (older children/adolescents)"
  ],
  "contraindications": [
   "Known hypersensitivity to dihydropyridines",
   "Severe aortic stenosis",
   "Cardiogenic shock"
  ],
  "formulations": [
   "2.5 mg tablet",
   "5 mg tablet",
   "10 mg tablet"
  ],
  "monitoring": [
   "Blood pressure (before and after each dose titration)",
   "Heart rate",
   "Peripheral oedema",
   "Liver function with prolonged use"
  ],
  "notes": "Formulary class: Calcium Channel Blocker (Dihydropyridine). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-amoxicillin",
  "name": "Amoxicillin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "High-dose (80–90 mg/kg/day) for penicillin non-susceptible S. pneumoniae otitis media. Strep pharyngitis: 50 mg/kg/day once daily × 10 days, max 1 g/day Per-dose amount calculated from 25–45 mg/kg/day divided by 2 (Every 12 hours). • High-dose (80–90 mg/kg/day) for resistant otitis media Per-dose amount calculated from 25–45 mg/kg/day divided by 2 (Every 12 hr).",
    "maxDose": "875 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 12.5,
    "max": 22.5,
    "adultMaxDose_num": 875
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "High-dose (80–90 mg/kg/day) for penicillin non-susceptible S. pneumoniae otitis media. Strep pharyngitis: 50 mg/kg/day once daily × 10 days, max 1 g/day • High-dose (80–90 mg/kg/day) for resistant otitis media",
    "maxDose": "Max 1750 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 45,
    "adultMaxDose_num": 1750
   }
  ],
  "indications": [
   "Otitis media",
   "Community-acquired pneumonia (mild)",
   "Streptococcal pharyngitis",
   "Urinary tract infection",
   "Skin and soft tissue infections",
   "Community-acquired pneumonia",
   "UTI"
  ],
  "contraindications": [
   "Penicillin or aminopenicillin allergy",
   "Infectious mononucleosis (risk of ampicillin rash)",
   "Penicillin allergy",
   "Infectious mononucleosis (risk of rash)"
  ],
  "formulations": [
   "250 mg tablet",
   "500 mg tablet",
   "875 mg tablet",
   "125 mg/5 mL suspension",
   "250 mg/5 mL suspension"
  ],
  "monitoring": [
   "Clinical response at 48–72 hours",
   "Signs of allergic reaction",
   "GI tolerance",
   "Renal function if prolonged use",
   "Clinical response at 48–72 hr"
  ],
  "notes": "Formulary class: Beta-lactam Antibiotic (Aminopenicillin). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-amoxicillin-clavulanate",
  "name": "Amoxicillin-Clavulanate",
  "genericName": "Co-amoxiclav",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "Dose refers to amoxicillin component. High-dose: 80–90 mg/kg/day for resistant pathogens (use 600/42.9 mg/5 mL suspension). Give with food to minimise GI side effects Per-dose amount calculated from 25–45 mg/kg/day divided by 2 (Every 12 hours). • Dose refers to amoxicillin component. High-dose (80–90 mg/kg/day): use 600/42.9 mg per 5 mL suspension. Standard concentration 250/62.5 mg per 5 mL. Take with food. Duration: 5–10 days depending on indication Per-dose amount calculated from 25–45 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "875 mg amoxicillin/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 12.5,
    "max": 22.5,
    "adultMaxDose_num": 875
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "Dose refers to amoxicillin component. High-dose: 80–90 mg/kg/day for resistant pathogens (use 600/42.9 mg/5 mL suspension). Give with food to minimise GI side effects • Dose refers to amoxicillin component. High-dose (80–90 mg/kg/day): use 600/42.9 mg per 5 mL suspension. Standard concentration 250/62.5 mg per 5 mL. Take with food. Duration: 5–10 days depending on indication",
    "maxDose": "Max 1750 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 45,
    "adultMaxDose_num": 1750
   }
  ],
  "indications": [
   "Otitis media (treatment failure or chronic)",
   "Sinusitis",
   "Community-acquired pneumonia (beta-lactamase producing organisms)",
   "Skin/soft tissue infections",
   "UTI (resistant organisms)",
   "Animal bite wounds",
   "Otitis media (treatment failure)",
   "Lower respiratory tract infections"
  ],
  "contraindications": [
   "Penicillin allergy",
   "History of amoxicillin-clavulanate-associated jaundice/hepatic dysfunction",
   "Severe renal impairment (adjust dose)",
   "History of co-amoxiclav associated cholestatic jaundice"
  ],
  "formulations": [
   "250/125 mg tablet",
   "500/125 mg tablet",
   "875/125 mg tablet",
   "125/31.25 mg per 5 mL suspension",
   "250/62.5 mg per 5 mL suspension",
   "600/42.9 mg per 5 mL suspension (high-dose)"
  ],
  "monitoring": [
   "Liver function (ALT/AST) with prolonged use",
   "Signs of GI intolerance",
   "Clinical response",
   "Renal function",
   "Liver function (cholestasis risk)",
   "GI tolerance (higher diarrhoea rate than amoxicillin alone)"
  ],
  "notes": "Formulary class: Beta-lactam + Beta-lactamase Inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-atenolol",
  "name": "Atenolol",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily or divided BID",
    "notes": "Start at 0.5 mg/kg/day; titrate as needed. SVT prophylaxis may require 1–2 mg/kg/day",
    "maxDose": "100 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.5,
    "max": 1,
    "adultMaxDose_num": 100
   }
  ],
  "indications": [
   "Hypertension",
   "Arrhythmia (SVT prophylaxis)",
   "Long QT syndrome (adjunct)",
   "Migraine prophylaxis"
  ],
  "contraindications": [
   "Sinus bradycardia",
   "Heart block (2nd/3rd degree)",
   "Cardiogenic shock",
   "Severe asthma/reactive airway disease",
   "Decompensated heart failure"
  ],
  "formulations": [
   "25 mg tablet",
   "50 mg tablet",
   "100 mg tablet"
  ],
  "monitoring": [
   "Heart rate (hold if HR <60 bpm)",
   "Blood pressure",
   "ECG (PR interval)",
   "Blood glucose (may mask hypoglycaemia)",
   "Respiratory status in asthmatics"
  ],
  "notes": "Formulary class: Selective Beta-1 Adrenergic Blocker (Cardioselective). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-azithromycin",
  "name": "Azithromycin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily Day 1, then 5 mg/kg/day Days 2–5",
    "notes": "CAP/pharyngitis: 10 mg/kg Day 1 (max 500 mg), then 5 mg/kg/day Days 2–5 (max 250 mg/day). Pertussis: 10 mg/kg/day × 5 days (max 500 mg/day). Chlamydia: 20 mg/kg single dose, max 1 g Per-dose amount calculated from 10 mg/kg/day divided by 1 (Once daily Day 1, then 5 mg/kg/day Days 2–5). • Standard 5-day course: 10 mg/kg Day 1, then 5 mg/kg Days 2–5. Pharyngitis: 12 mg/kg/day × 5 days (max 500 mg). Can be taken with food. Shake suspension well Per-dose amount calculated from 10 mg/kg/day divided by 1 (Once daily Day 1; then 5 mg/kg/day Days 2–5).",
    "maxDose": "500 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Once daily Day 1, then 5 mg/kg/day Days 2–5",
    "notes": "CAP/pharyngitis: 10 mg/kg Day 1 (max 500 mg), then 5 mg/kg/day Days 2–5 (max 250 mg/day). Pertussis: 10 mg/kg/day × 5 days (max 500 mg/day). Chlamydia: 20 mg/kg single dose, max 1 g • Standard 5-day course: 10 mg/kg Day 1, then 5 mg/kg Days 2–5. Pharyngitis: 12 mg/kg/day × 5 days (max 500 mg). Can be taken with food. Shake suspension well",
    "maxDose": "500 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 10,
    "adultMaxDose_num": 500
   }
  ],
  "indications": [
   "Community-acquired pneumonia (atypical organisms)",
   "Streptococcal pharyngitis (penicillin-allergic)",
   "Chlamydia trachomatis",
   "Mycobacterium avium complex (MAC) prophylaxis",
   "Pertussis",
   "Otitis media (5-day course)",
   "Pharyngitis/tonsillitis (penicillin-allergic)",
   "Otitis media (5-day Z-pack equivalent)"
  ],
  "contraindications": [
   "Known hypersensitivity to macrolides",
   "Known QT prolongation or concurrent QT-prolonging drugs (relative)",
   "Severe hepatic impairment",
   "Concurrent ergotamine",
   "Macrolide hypersensitivity",
   "QT prolongation"
  ],
  "formulations": [
   "250 mg tablet",
   "500 mg tablet",
   "200 mg/5 mL suspension (40 mg/mL)"
  ],
  "monitoring": [
   "QTc (ECG if risk factors)",
   "Liver function with prolonged use",
   "Clinical response",
   "Hearing with prolonged/high-dose use",
   "QTc if risk factors",
   "Liver function",
   "GI tolerance"
  ],
  "notes": "Formulary class: Macrolide Antibiotic (Azalide). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-bisacodyl",
  "name": "Bisacodyl",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily at bedtime",
    "notes": "Children 3–10 yr: 5 mg once daily. Children >10 yr / adolescents: 5–10 mg once daily. Onset: 6–10 hours after oral administration",
    "maxDose": "10 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.3,
    "adultMaxDose_num": 10
   }
  ],
  "indications": [
   "Constipation (short-term relief)",
   "Bowel preparation before procedures/surgery"
  ],
  "contraindications": [
   "Age < 3 years",
   "Intestinal obstruction or ileus",
   "Acute abdominal conditions",
   "Inflammatory bowel disease (acute phase)",
   "Dehydration or electrolyte imbalance"
  ],
  "formulations": [
   "5 mg enteric-coated tablet"
  ],
  "monitoring": [
   "Stool frequency and consistency",
   "Electrolytes with prolonged use (risk of hypokalaemia)",
   "Abdominal pain/cramping (discontinue if severe)"
  ],
  "notes": "Formulary class: Stimulant Laxative (Diphenylmethane derivative). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-carbamazepine",
  "name": "Carbamazepine",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral, divided BID–TID",
    "frequency": "Every 8–12 hours",
    "notes": "Start at 5–10 mg/kg/day div BID, increase by 5 mg/kg/week to maintenance 10–20 mg/kg/day div BID-TID. Adults: start 200 mg BID, max 1600 mg/day. Therapeutic range: 4–12 mg/L • Start at 5 mg/kg/day; increase by 5 mg/kg/week. Shake well before use. Suspension absorbed more rapidly than tablet — administer more frequently (BID vs OD for some CR preparations). Therapeutic level: 4–12 mg/L",
    "maxDose": "1200 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 20,
    "adultMaxDose_num": 1200
   }
  ],
  "indications": [
   "Focal (partial) seizures with or without secondary generalisation",
   "Trigeminal neuralgia",
   "Bipolar disorder (adjunct)",
   "Neuropathic pain",
   "Focal seizures (young children unable to swallow tablets)",
   "Generalised tonic-clonic seizures",
   "Neuropathic pain (trigeminal neuralgia)"
  ],
  "contraindications": [
   "Absence seizures or myoclonic epilepsy (may worsen)",
   "Concurrent MAOIs (within 14 days)",
   "Known hypersensitivity to tricyclics",
   "Bone marrow suppression",
   "AV block",
   "HLA-B*1502 positive patients (Asian ancestry — SJS/TEN risk)",
   "Absence or myoclonic seizures (worsens)",
   "HLA-B*1502 positive (Asian ancestry — SJS risk)",
   "Concurrent MAOIs"
  ],
  "formulations": [
   "100 mg tablet (chewable)",
   "200 mg tablet",
   "400 mg tablet",
   "Controlled-release formulations",
   "100 mg/5 mL suspension (20 mg/mL)"
  ],
  "monitoring": [
   "Serum carbamazepine levels (trough target 4–12 mg/L)",
   "CBC with differential (neutropenia risk)",
   "LFTs",
   "Serum sodium (SIADH)",
   "ECG if cardiac history",
   "HLA-B*1502 testing in high-risk populations before initiation",
   "Serum levels (4–12 mg/L)",
   "CBC (neutropenia)",
   "Sodium (SIADH)",
   "HLA-B*1502 screening"
  ],
  "notes": "Formulary class: Anticonvulsant / Sodium Channel Blocker (Dibenzazepine). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-cetirizine",
  "name": "Cetirizine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily or divided BID",
    "notes": "6 months–2 yr: 2.5 mg once daily (syrup preferred). 2–6 yr: 2.5–5 mg/day. 6–11 yr: 5–10 mg/day. ≥12 yr: 10 mg once daily. Reduce dose in renal impairment • 6 months–2 yr: 2.5 mg once or BID (max 5 mg/day). 2–6 yr: 2.5–5 mg once or BID. ≥6 yr: 5–10 mg once daily. Reduce dose in renal impairment",
    "maxDose": "10 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.25,
    "adultMaxDose_num": 10
   }
  ],
  "indications": [
   "Allergic rhinitis (seasonal and perennial)",
   "Urticaria (acute and chronic)",
   "Atopic dermatitis (adjunct)",
   "Allergic conjunctivitis",
   "Allergic rhinitis",
   "Urticaria",
   "Atopic dermatitis (adjunct antipruritic)"
  ],
  "contraindications": [
   "Known hypersensitivity to cetirizine or hydroxyzine",
   "Severe renal impairment (reduce dose)",
   "End-stage renal disease",
   "Severe renal impairment (GFR < 10 mL/min)"
  ],
  "formulations": [
   "5 mg tablet",
   "10 mg tablet",
   "5 mg/5 mL syrup (1 mg/mL)",
   "1 mg/mL oral solution"
  ],
  "monitoring": [
   "Renal function if prolonged use",
   "Sedation level (less sedating than 1st-generation but may still cause drowsiness in some children)",
   "Urinary retention risk in predisposed patients",
   "Renal function",
   "Sedation level",
   "Clinical symptom response"
  ],
  "notes": "Formulary class: Second-Generation Antihistamine (H1 Receptor Antagonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-cephalexin",
  "name": "Cephalexin",
  "genericName": "Cefalexin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided q6h",
    "frequency": "Every 6 hours",
    "notes": "Uncomplicated SSTI: 25–50 mg/kg/day div q6h. Severe infections: up to 100 mg/kg/day (max 4 g/day). Strep pharyngitis: 25–50 mg/kg/day div BID × 10 days (max 500 mg/dose) Per-dose amount calculated from 25–50 mg/kg/day divided by 4 (Every 6 hours). • Uncomplicated: 25–50 mg/kg/day div q6h. Strep pharyngitis: 25–50 mg/kg/day div BID × 10 days (max 500 mg/dose). Severe infections: up to 100 mg/kg/day (max 4 g/day). Shake well before use Per-dose amount calculated from 25–50 mg/kg/day divided by 4 (Every 6 hours).",
    "maxDose": "1000 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 6.25,
    "max": 12.5,
    "adultMaxDose_num": 1000
   },
   {
    "route": "Oral, divided q6h",
    "frequency": "Every 6 hours",
    "notes": "Uncomplicated SSTI: 25–50 mg/kg/day div q6h. Severe infections: up to 100 mg/kg/day (max 4 g/day). Strep pharyngitis: 25–50 mg/kg/day div BID × 10 days (max 500 mg/dose) • Uncomplicated: 25–50 mg/kg/day div q6h. Strep pharyngitis: 25–50 mg/kg/day div BID × 10 days (max 500 mg/dose). Severe infections: up to 100 mg/kg/day (max 4 g/day). Shake well before use",
    "maxDose": "Max 4000 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 50,
    "adultMaxDose_num": 4000
   }
  ],
  "indications": [
   "Skin and soft tissue infections (SSTI)",
   "Streptococcal pharyngitis",
   "Uncomplicated UTI",
   "Bone and joint infections (step-down therapy)",
   "Impetigo",
   "Skin and soft tissue infections",
   "Impetigo (step-down)"
  ],
  "contraindications": [
   "Known hypersensitivity to cephalosporins",
   "Caution with penicillin allergy (cross-reactivity ~1–2%)",
   "Cephalosporin hypersensitivity",
   "Caution if severe penicillin allergy"
  ],
  "formulations": [
   "250 mg capsule/tablet",
   "500 mg capsule/tablet",
   "125 mg/5 mL suspension (25 mg/mL)",
   "250 mg/5 mL suspension (50 mg/mL)"
  ],
  "monitoring": [
   "Renal function with prolonged use",
   "Signs of superinfection",
   "Clinical response at 48–72 hours",
   "Renal function"
  ],
  "notes": "Formulary class: First-Generation Cephalosporin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-chloroquine",
  "name": "Chloroquine",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Day 1: 10 mg base/kg (max 600 mg); then 5 mg base/kg at 6, 24, 48 hr",
    "notes": "Treatment: 10 mg base/kg Day 1 (max 600 mg base), then 5 mg base/kg at 6h, 24h, 48h (max 300 mg base). Prophylaxis: 5 mg base/kg/week (max 300 mg base/week). 1 tablet (250 mg phosphate) = 150 mg base",
    "maxDose": "600 mg base/dose (initial)",
    "unit": "mg base/kg/dose",
    "perKg": true,
    "value": 10,
    "adultMaxDose_num": 600
   }
  ],
  "indications": [
   "Malaria treatment (P. vivax, P. ovale, P. malariae — susceptible strains)",
   "Malaria prophylaxis (susceptible areas)",
   "Lupus erythematosus (off-label, less preferred than hydroxychloroquine)",
   "Amoebiasis (hepatic, adjunct)"
  ],
  "contraindications": [
   "Retinal/visual field changes attributable to chloroquine",
   "Known hypersensitivity",
   "Concurrent amiodarone or other QT-prolonging agents",
   "G6PD deficiency (caution — haemolysis risk)"
  ],
  "formulations": [
   "150 mg base (250 mg phosphate) tablet",
   "300 mg base (500 mg phosphate) tablet"
  ],
  "monitoring": [
   "Ophthalmological exam (baseline and annually with prolonged use — retinopathy)",
   "ECG (QT interval)",
   "CBC",
   "G6PD status before initiation in high-risk populations"
  ],
  "notes": "Formulary class: 4-Aminoquinoline Antimalarial. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | WHO Malaria Guidelines"
 },
 {
  "id": "fx-ciprofloxacin",
  "name": "Ciprofloxacin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "UTI/pyelonephritis: 20–30 mg/kg/day div q12h × 7–14 days. Typhoid: 15 mg/kg BID × 5–7 days (max 500 mg/dose). Anthrax: 15 mg/kg BID × 60 days (max 500 mg BID). Meningococcal prophylaxis (≥12 yr): 500 mg single dose Per-dose amount calculated from 20–30 mg/kg/day divided by 2 (Every 12 hours). • UTI: 20–30 mg/kg/day div q12h. Anthrax: 15 mg/kg/dose BID × 60 days (max 500 mg/dose). Shake well before use. Give 2 hours apart from antacids/dairy/iron. Duration 7–14 days for UTI Per-dose amount calculated from 20–30 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "500 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 15,
    "adultMaxDose_num": 500
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "UTI/pyelonephritis: 20–30 mg/kg/day div q12h × 7–14 days. Typhoid: 15 mg/kg BID × 5–7 days (max 500 mg/dose). Anthrax: 15 mg/kg BID × 60 days (max 500 mg BID). Meningococcal prophylaxis (≥12 yr): 500 mg single dose • UTI: 20–30 mg/kg/day div q12h. Anthrax: 15 mg/kg/dose BID × 60 days (max 500 mg/dose). Shake well before use. Give 2 hours apart from antacids/dairy/iron. Duration 7–14 days for UTI",
    "maxDose": "Max 1000 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 20,
    "max": 30,
    "adultMaxDose_num": 1000
   }
  ],
  "indications": [
   "Complicated UTI / pyelonephritis",
   "Typhoid fever",
   "Anthrax exposure prophylaxis/treatment",
   "Gram-negative infections (where alternatives unavailable)",
   "Meningococcal prophylaxis (single dose)",
   "Complicated UTI / pyelonephritis (young children unable to swallow tablets)",
   "Anthrax",
   "Gram-negative infections (where alternatives unavailable in young children)"
  ],
  "contraindications": [
   "Age < 18 yr (relative — avoid unless specific indication, e.g. anthrax, CF, complicated UTI)",
   "Concurrent tizanidine",
   "Known hypersensitivity to fluoroquinolones",
   "Tendon disease or previous fluoroquinolone tendinopathy",
   "Age < 18 yr (relative — avoid unless specific paediatric indication)",
   "Tendon disease history",
   "Known fluoroquinolone hypersensitivity"
  ],
  "formulations": [
   "250 mg tablet",
   "500 mg tablet",
   "750 mg tablet",
   "250 mg/5 mL suspension (50 mg/mL)",
   "500 mg/5 mL suspension (100 mg/mL)"
  ],
  "monitoring": [
   "Tendon pain/swelling (risk of tendinopathy/rupture)",
   "Serum creatinine/GFR",
   "Blood glucose (hypo/hyperglycaemia)",
   "CNS symptoms (seizures, confusion)",
   "QTc if risk factors",
   "Tendon pain (tendinopathy risk)",
   "Renal function",
   "CNS symptoms",
   "Glucose",
   "QTc"
  ],
  "notes": "Formulary class: Fluoroquinolone Antibiotic (2nd Generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-clarithromycin",
  "name": "Clarithromycin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours × 7–14 days",
    "notes": "Standard: 15 mg/kg/day div q12h (max 500 mg/dose). Duration depends on indication: pharyngitis 10 days, pneumonia 7–14 days, H. pylori with PPIs and amoxicillin × 14 days Per-dose amount calculated from 15 mg/kg/day divided by 2 (Every 12 hours × 7–14 days). • 15 mg/kg/day div q12h × 7–14 days (max 500 mg/dose). Shake well before use. Can be taken with food. H. pylori (triple therapy): 7.5 mg/kg BID + amoxicillin + PPI × 14 days Per-dose amount calculated from 15 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "500 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 7.5,
    "adultMaxDose_num": 500
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours × 7–14 days",
    "notes": "Standard: 15 mg/kg/day div q12h (max 500 mg/dose). Duration depends on indication: pharyngitis 10 days, pneumonia 7–14 days, H. pylori with PPIs and amoxicillin × 14 days • 15 mg/kg/day div q12h × 7–14 days (max 500 mg/dose). Shake well before use. Can be taken with food. H. pylori (triple therapy): 7.5 mg/kg BID + amoxicillin + PPI × 14 days",
    "maxDose": "Max 1000 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 15,
    "adultMaxDose_num": 1000
   }
  ],
  "indications": [
   "Community-acquired pneumonia (atypical)",
   "Pharyngitis/tonsillitis (penicillin-allergic)",
   "H. pylori eradication (triple therapy)",
   "MAC prophylaxis/treatment in HIV",
   "Skin and soft tissue infections",
   "Pharyngitis (penicillin-allergic)",
   "H. pylori eradication",
   "MAC prophylaxis/treatment"
  ],
  "contraindications": [
   "Known hypersensitivity to macrolides",
   "Concurrent colchicine, ergotamines, cisapride, pimozide",
   "QT prolongation or history of cardiac arrhythmia",
   "Severe hepatic impairment",
   "Macrolide hypersensitivity",
   "Concurrent colchicine, ergotamine, cisapride, pimozide",
   "QT prolongation"
  ],
  "formulations": [
   "250 mg tablet",
   "500 mg tablet",
   "125 mg/5 mL suspension (25 mg/mL)",
   "250 mg/5 mL suspension (50 mg/mL)"
  ],
  "monitoring": [
   "QTc interval (ECG if risk factors)",
   "Liver function tests",
   "Drug interactions (strong CYP3A4 inhibitor)",
   "GI tolerance",
   "QTc interval",
   "Liver function",
   "Drug interactions (CYP3A4 inhibitor)",
   "Metallic taste (characteristic)"
  ],
  "notes": "Formulary class: Macrolide Antibiotic (14-membered ring). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-clindamycin",
  "name": "Clindamycin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided q6–8h",
    "frequency": "Every 6–8 hours",
    "notes": "Mild–moderate infections: 10–20 mg/kg/day div q6–8h. Severe/MRSA SSTI: 25–30 mg/kg/day div q8h. Max 1.8–2.7 g/day. Duration typically 7–21 days depending on site Maximum is per dose: 450 mg/dose. Daily total shown — divide by the prescribed frequency. • Mild–moderate: 10–20 mg/kg/day div q6–8h. Severe/MRSA SSTI: 25–30 mg/kg/day div q8h. Max 1.8–2.7 g/day. Reconstituted suspension stable 2 weeks at room temperature Maximum is per dose: 450 mg/dose. Daily total shown — divide by the prescribed frequency.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 30
   }
  ],
  "indications": [
   "MRSA skin and soft tissue infections",
   "Streptococcal pharyngitis (penicillin-allergic)",
   "Dental infections",
   "Osteomyelitis (step-down)",
   "Anaerobic infections",
   "PCP prophylaxis (with primaquine)",
   "MRSA skin and soft tissue infections (step-down)",
   "Streptococcal infections (penicillin-allergic)",
   "Osteomyelitis (oral step-down)"
  ],
  "contraindications": [
   "Known hypersensitivity to lincosamides",
   "Previous clindamycin-associated pseudomembranous colitis",
   "Known lincosamide hypersensitivity"
  ],
  "formulations": [
   "75 mg capsule",
   "150 mg capsule",
   "300 mg capsule",
   "75 mg/5 mL oral solution (15 mg/mL)"
  ],
  "monitoring": [
   "Signs/symptoms of C. difficile-associated diarrhoea (CDAD)",
   "Liver function",
   "Clinical response",
   "Blood counts with prolonged use",
   "C. difficile-associated diarrhoea (CDAD)"
  ],
  "notes": "Formulary class: Lincosamide Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-clonazepam",
  "name": "Clonazepam",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral, divided BID–TID",
    "frequency": "Every 8–12 hours (titrate slowly)",
    "notes": "Start 0.01–0.05 mg/kg/day div BID-TID; increase 0.25–0.5 mg q3 days as tolerated. Target: 0.05–0.2 mg/kg/day div BID-TID. Adults: start 0.5 mg TID, max 20 mg/day • Start 0.01–0.05 mg/kg/day div BID-TID; increase 0.25 mg q3 days. Target 0.05–0.2 mg/kg/day div BID-TID. Drops: 0.1 mg per drop (2.5 mg/mL). Allow for dropwise titration in infants",
    "maxDose": "20 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.01,
    "max": 0.05,
    "adultMaxDose_num": 20
   }
  ],
  "indications": [
   "Absence seizures",
   "Myoclonic seizures",
   "Lennox-Gastaut syndrome (adjunct)",
   "Panic disorder (adolescents)",
   "Infantile spasms (West syndrome, adjunct)",
   "Infantile spasms (adjunct)"
  ],
  "contraindications": [
   "Severe hepatic impairment",
   "Acute narrow-angle glaucoma",
   "Known hypersensitivity to benzodiazepines",
   "Sleep apnoea (caution)",
   "Concurrent CNS depressants (increased respiratory depression risk)",
   "Sleep apnoea",
   "Concurrent CNS depressants (respiratory depression risk)"
  ],
  "formulations": [
   "0.5 mg tablet",
   "1 mg tablet",
   "2 mg tablet",
   "0.5 mg/5 mL oral solution",
   "2.5 mg/mL oral drops (0.1 mg per drop)"
  ],
  "monitoring": [
   "Seizure frequency",
   "CNS depression/sedation level",
   "Respiratory status",
   "LFTs",
   "Signs of dependence and tolerance with prolonged use",
   "Withdrawal symptoms if abruptly stopped",
   "CNS sedation/respiratory rate",
   "Behavioural changes",
   "Signs of dependence"
  ],
  "notes": "Formulary class: Benzodiazepine (Long-acting) — Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-co-trimoxazole",
  "name": "Co-trimoxazole",
  "genericName": "Trimethoprim-Sulfamethoxazole (TMP-SMX)",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "UTI treatment: 8–12 mg TMP/kg/day div q12h × 7–14 days. PCP treatment: 15–20 mg TMP/kg/day div q6–8h × 21 days. PCP prophylaxis: 5 mg TMP/kg/day or 150 mg TMP/m²/day div q12h × 3 days/week. DS tablet = 160 mg TMP + 800 mg SMX Per-dose amount calculated from 8–12 mg TMP/kg/day divided by 2 (Every 12 hours). • UTI: 8–12 mg TMP/kg/day div q12h × 7–14 days. PCP treatment: 15–20 mg TMP/kg/day div q6–8h × 21 days. PCP prophylaxis: 5 mg TMP/kg/day or 150 mg TMP/m²/day 3 days/week. Suspension: 40 mg TMP + 200 mg SMX per 5 mL. Shake well Per-dose amount calculated from 8–12 mg TMP/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "320 mg TMP/day",
    "unit": "mg TMP/kg/dose",
    "perKg": true,
    "min": 4,
    "max": 6
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "UTI treatment: 8–12 mg TMP/kg/day div q12h × 7–14 days. PCP treatment: 15–20 mg TMP/kg/day div q6–8h × 21 days. PCP prophylaxis: 5 mg TMP/kg/day or 150 mg TMP/m²/day div q12h × 3 days/week. DS tablet = 160 mg TMP + 800 mg SMX • UTI: 8–12 mg TMP/kg/day div q12h × 7–14 days. PCP treatment: 15–20 mg TMP/kg/day div q6–8h × 21 days. PCP prophylaxis: 5 mg TMP/kg/day or 150 mg TMP/m²/day 3 days/week. Suspension: 40 mg TMP + 200 mg SMX per 5 mL. Shake well",
    "maxDose": "320 mg TMP/day",
    "unit": "mg TMP/kg/day",
    "perKg": true,
    "min": 8,
    "max": 12,
    "adultMaxDose_num": 320
   }
  ],
  "indications": [
   "Urinary tract infections",
   "Pneumocystis jirovecii pneumonia (PCP) treatment and prophylaxis",
   "Toxoplasmosis (alternative)",
   "Nocardia",
   "Stenotrophomonas maltophilia",
   "Prophylaxis in immunocompromised (HIV, transplant)",
   "PCP treatment and prophylaxis",
   "Shigellosis"
  ],
  "contraindications": [
   "Megaloblastic anaemia due to folate deficiency",
   "Sulfonamide hypersensitivity",
   "Severe hepatic or renal impairment",
   "Neonates < 2 months (risk of kernicterus — bilirubin displacement)",
   "Pregnancy at term",
   "Folate deficiency anaemia",
   "Neonates < 2 months (kernicterus)",
   "Severe hepatic/renal impairment"
  ],
  "formulations": [
   "Tablet 80/400 mg (single strength, SS)",
   "Tablet 160/800 mg (double strength, DS)",
   "40 mg TMP + 200 mg SMX per 5 mL suspension (8 mg TMP/mL)"
  ],
  "monitoring": [
   "CBC (folate antagonism — macrocytic anaemia, neutropenia)",
   "Serum creatinine/electrolytes (TMP blocks tubular secretion of creatinine — spurious rise)",
   "Liver function tests",
   "Potassium (TMP blocks Na⁺/K⁺ tubular exchange — hyperkalaemia)",
   "CBC (neutropenia, macrocytic anaemia)",
   "Serum creatinine/K⁺ (spurious rise in creatinine; hyperkalaemia)",
   "LFTs",
   "Signs of hypersensitivity"
  ],
  "notes": "Formulary class: Antifolate / Sulfonamide Combination Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-desmopressin",
  "name": "Desmopressin",
  "genericName": "DDAVP (1-deamino-8-D-arginine vasopressin)",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "BID–TID (diabetes insipidus)",
    "notes": "Diabetes insipidus: start 0.05–0.1 mg BID-TID, titrate to response (usual 0.1–0.8 mg/day). Nocturnal enuresis (≥5 yr): 0.2–0.6 mg at bedtime (not weight-based); restrict fluids 1h before to 8h after dose. Monitor for hyponatraemia",
    "maxDose": "0.6 mg/day",
    "unit": "mg/dose",
    "perKg": false,
    "value": 0.1
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start with 0.05 mg/dose BID; titrate dose to effect; usual dose range: 0.1–0.8 mg/24 hr.",
    "unit": "mg/day",
    "perKg": false,
    "min": 0.1,
    "max": 0.8
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 0.05 mg/dose BID; titrate dose to effect; usual dose range: 0.1– 1.2 mg/24 hr ÷ BID–TID. Nasal spray (titrate dose to achieve control of excessive thirst and urination. Morning and evening doses should be adjusted separately for diurnal rhythm of water turnover): ≥ 4–18 yr: Start at 10 mCg once daily, may titrate up to 30 mCg/24 hr ÷ once daily or BID (20 mCg AM and 10 mCg PM).",
    "unit": "mg/day",
    "perKg": false,
    "min": 0.1,
    "max": 1.2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.1–1 mCg/24 hr ÷ once daily–BID; start with lower dose and increase as needed.",
    "unit": "mcg/day",
    "perKg": false,
    "min": 0.1,
    "max": 1
   }
  ],
  "indications": [
   "Central diabetes insipidus",
   "Nocturnal enuresis (primary monosymptomatic)",
   "Haemophilia A and von Willebrand disease type 1 (mild — short-term, parenteral preferred for bleeding)"
  ],
  "contraindications": [
   "Psychogenic polydipsia",
   "Habitual or psychogenic polydipsia",
   "Cardiac insufficiency",
   "Syndrome of inappropriate ADH secretion (SIADH)",
   "Known hypersensitivity",
   "Nocturnal enuresis with excessive fluid intake"
  ],
  "formulations": [
   "0.1 mg tablet",
   "0.2 mg tablet",
   "Tabs: DDAVP and generics: 0.1, 0.2 mg Sublingual tabs: Nocdurna: 27.7, 55.3 mCg; contains fish gelatin and mannitol"
  ],
  "monitoring": [
   "Serum sodium and osmolality",
   "Urine output and osmolality",
   "Blood pressure",
   "Signs of water intoxication/hyponatraemia (headache, nausea, seizures)",
   "Fluid intake and restriction compliance"
  ],
  "notes": "Formulary class: Synthetic Vasopressin Analogue (V2-receptor agonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-diazepam",
  "name": "Diazepam",
  "category": "sedative",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6–8 hours PRN",
    "notes": "Anxiety/muscle spasm: 0.1–0.3 mg/kg/dose q6–8h PRN (max 10 mg/dose). Febrile seizure prophylaxis: 0.3 mg/kg/dose at onset of fever q8h × 24–48h. Adults: 2–10 mg BID–QID",
    "maxDose": "10 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.3,
    "adultMaxDose_num": 10
   }
  ],
  "indications": [
   "Anxiety disorders",
   "Muscle spasm / spasticity",
   "Febrile seizure prophylaxis (intermittent rectal/oral)",
   "Adjunct to anaesthesia (pre-medication)",
   "Alcohol withdrawal (adolescents)",
   "Tetanus (muscle relaxation)"
  ],
  "contraindications": [
   "Acute narrow-angle glaucoma",
   "Myasthenia gravis",
   "Severe hepatic impairment",
   "Sleep apnoea syndrome",
   "Known hypersensitivity to benzodiazepines",
   "Concurrent CNS depressants / alcohol"
  ],
  "formulations": [
   "2 mg tablet",
   "5 mg tablet",
   "10 mg tablet"
  ],
  "monitoring": [
   "Level of sedation / respiratory rate",
   "Paradoxical excitation (especially in young children)",
   "Signs of physical dependence",
   "Liver function in prolonged use"
  ],
  "notes": "Formulary class: Benzodiazepine (Long-acting) — Anxiolytic / Muscle Relaxant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-domperidone",
  "name": "Domperidone",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "3–4 times daily before meals",
    "notes": "Children: 0.2–0.4 mg/kg/dose TID-QID before meals (max 10 mg/dose, max 40 mg/day). Adults: 10 mg TID. Not recommended in neonates < 1 month. Use shortest effective course due to cardiac risk",
    "maxDose": "10 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.2,
    "max": 0.4,
    "adultMaxDose_num": 10
   },
   {
    "route": "Oral, before meals",
    "frequency": "3–4 times daily",
    "notes": "0.2–0.4 mg/kg/dose TID-QID before meals (max 10 mg/dose, max 40 mg/day). Not recommended < 1 month. Use shortest effective course (QT risk). Suspension 1 mg/mL",
    "maxDose": "10 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.2,
    "max": 0.4,
    "adultMaxDose_num": 10
   }
  ],
  "indications": [
   "Gastroparesis",
   "Gastro-oesophageal reflux disease (GORD) — adjunct",
   "Nausea and vomiting (chemotherapy-induced, post-operative)",
   "Gastro-oesophageal reflux disease (GORD — adjunct)",
   "Nausea and vomiting",
   "Slow gastric emptying post-chemotherapy"
  ],
  "contraindications": [
   "Known hypersensitivity",
   "QT prolongation or concurrent QT-prolonging medications",
   "Prolactin-secreting pituitary tumour",
   "GI bleeding, mechanical obstruction or perforation",
   "Not licensed in several countries — use with caution and where licensed",
   "QT prolongation or concurrent QT-prolonging drugs",
   "Prolactin-secreting tumour",
   "GI obstruction/perforation/haemorrhage"
  ],
  "formulations": [
   "10 mg tablet",
   "1 mg/mL suspension"
  ],
  "monitoring": [
   "QTc interval (ECG before and during therapy)",
   "Signs of extrapyramidal effects (rare — does not cross BBB readily)",
   "Prolactin levels (galactorrhoea/gynaecomastia)",
   "Clinical response",
   "QTc interval (ECG before/during)",
   "Prolactin levels (galactorrhoea)",
   "Extrapyramidal symptoms (rare)"
  ],
  "notes": "Formulary class: Dopamine (D2) Receptor Antagonist — Prokinetic / Antiemetic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | EMA guidelines"
 },
 {
  "id": "fx-enalapril",
  "name": "Enalapril",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily or divided BID",
    "notes": "Start: 0.05–0.1 mg/kg/day (max initial 5 mg/day); titrate over weeks to 0.1–0.5 mg/kg/day. Monitor potassium and creatinine closely after initiation and after each dose increase. Avoid in neonates with oligo/anuria • Start 0.05–0.1 mg/kg/day (max initial 5 mg). Titrate over weeks to 0.1–0.5 mg/kg/day. Monitor K and creatinine within 1–2 weeks of each change. Extemporaneous preparation: 1 mg/mL",
    "maxDose": "40 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.08,
    "max": 0.5,
    "adultMaxDose_num": 40
   }
  ],
  "indications": [
   "Hypertension",
   "Heart failure (systolic)",
   "Proteinuric renal disease (chronic kidney disease)",
   "Diabetic nephropathy",
   "Hypertension (infants and young children unable to swallow tablets)",
   "Proteinuric renal disease"
  ],
  "contraindications": [
   "History of ACE inhibitor-induced angioedema",
   "Bilateral renal artery stenosis",
   "Pregnancy (Teratogenic — fetopathy in 2nd/3rd trimester)",
   "Concomitant aliskiren in diabetes",
   "Severe aortic stenosis",
   "ACE inhibitor-induced angioedema history",
   "Pregnancy (fetopathy)"
  ],
  "formulations": [
   "2.5 mg tablet",
   "5 mg tablet",
   "10 mg tablet",
   "20 mg tablet",
   "1 mg/mL extemporaneous oral solution"
  ],
  "monitoring": [
   "Renal function (serum creatinine, BUN) within 1–2 weeks of initiation and after dose increases",
   "Serum potassium (hyperkalaemia risk)",
   "Blood pressure (first-dose hypotension)",
   "Urine protein",
   "Signs of angioedema (discontinue immediately if occurs)",
   "Renal function and K⁺ within 1–2 weeks of initiation/dose changes",
   "Angioedema signs"
  ],
  "notes": "Formulary class: ACE Inhibitor (Angiotensin-Converting Enzyme Inhibitor). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-erythromycin",
  "name": "Erythromycin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided q6–8h",
    "frequency": "Every 6–8 hours",
    "notes": "Standard: 30–50 mg/kg/day div q6–8h. Pertussis: 40–50 mg/kg/day div q6h × 14 days (max 2 g/day). Prokinetic: 1–3 mg/kg/dose q6–8h (low dose). Give with food to reduce GI upset Maximum is per dose: 500 mg/dose. Daily total shown — divide by the prescribed frequency. • EES suspension: 30–50 mg/kg/day div q6–8h (max 500 mg/dose). Pertussis: 40–50 mg/kg/day div q6h × 14 days (max 2 g/day). Prokinetic: 1–3 mg/kg/dose q6–8h. Shake well. Give with food to reduce GI upset. Avoid neonates < 6 weeks (IHPS risk) Maximum is per dose: 500 mg/dose. Daily total shown — divide by the prescribed frequency.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 30,
    "max": 50
   }
  ],
  "indications": [
   "Streptococcal pharyngitis (penicillin-allergic)",
   "Pertussis (prophylaxis and treatment)",
   "Chlamydia trachomatis",
   "Campylobacter gastroenteritis",
   "Mycoplasma pneumoniae",
   "Gastroparesis (prokinetic — low-dose)",
   "Pertussis (treatment and prophylaxis)",
   "Gastroparesis — prokinetic (low dose)"
  ],
  "contraindications": [
   "Known hypersensitivity to macrolides",
   "Concurrent terfenadine, astemizole, cisapride, pimozide",
   "QT prolongation",
   "Concurrent CYP3A4-metabolised drugs with narrow therapeutic index",
   "Macrolide hypersensitivity",
   "Concurrent terfenadine, astemizole, cisapride",
   "Neonates < 6 weeks (hypertrophic pyloric stenosis risk — use azithromycin instead)"
  ],
  "formulations": [
   "250 mg tablet (enteric-coated)",
   "500 mg tablet",
   "200 mg/5 mL EES suspension (40 mg/mL)",
   "400 mg/5 mL EES suspension"
  ],
  "monitoring": [
   "QTc (ECG if risk factors)",
   "Liver function tests (cholestatic hepatitis risk)",
   "GI tolerance",
   "Hearing with high doses",
   "QTc",
   "LFTs (cholestatic hepatitis risk)",
   "Hearing (high-dose, prolonged)",
   "Hypertrophic pyloric stenosis signs (infants)"
  ],
  "notes": "Formulary class: Macrolide Antibiotic (14-membered ring). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-famotidine",
  "name": "Famotidine",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "GORD: 0.5 mg/kg/dose BID (max 40 mg/dose BID). PUD: 0.5 mg/kg/dose BID × 4–8 weeks. Adjust dose in renal impairment (GFR <50 mL/min: reduce dose or extend interval) Per-dose amount calculated from 0.5–1 mg/kg/day divided by 2 (Every 12 hours). • GORD/PUD: 0.5 mg/kg/dose BID (max 40 mg/dose BID). Infants: 0.5 mg/kg/dose BID for GORD. Adjust in renal impairment. Suspension: 40 mg/5 mL (8 mg/mL) Per-dose amount calculated from 0.5–1 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "40 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 0.5
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "GORD: 0.5 mg/kg/dose BID (max 40 mg/dose BID). PUD: 0.5 mg/kg/dose BID × 4–8 weeks. Adjust dose in renal impairment (GFR <50 mL/min: reduce dose or extend interval) • GORD/PUD: 0.5 mg/kg/dose BID (max 40 mg/dose BID). Infants: 0.5 mg/kg/dose BID for GORD. Adjust in renal impairment. Suspension: 40 mg/5 mL (8 mg/mL)",
    "maxDose": "40 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.5,
    "max": 1,
    "adultMaxDose_num": 40
   }
  ],
  "indications": [
   "Peptic ulcer disease",
   "Gastro-oesophageal reflux disease (GORD)",
   "Stress ulcer prophylaxis",
   "Zollinger-Ellison syndrome",
   "NSAID-induced gastric ulcer prevention",
   "GORD",
   "NSAID-associated gastric protection"
  ],
  "contraindications": [
   "Known hypersensitivity to H2 blockers",
   "Known H2-blocker hypersensitivity"
  ],
  "formulations": [
   "10 mg tablet",
   "20 mg tablet",
   "40 mg tablet",
   "40 mg/5 mL oral suspension (8 mg/mL)"
  ],
  "monitoring": [
   "Symptom response",
   "Renal function if prolonged use",
   "Note: less effective than PPIs for erosive oesophagitis",
   "Renal function (prolonged use)",
   "Note less effective than PPIs for erosive oesophagitis"
  ],
  "notes": "Formulary class: H2-Receptor Antagonist (Histamine H2 Blocker). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-fexofenadine",
  "name": "Fexofenadine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "6–11 yr: 30 mg BID (max 60 mg/day). ≥12 yr: 60 mg BID or 180 mg once daily. ≥2 yr: 30 mg BID (suspension). Not weight-based for standard indications. Avoid concurrent fruit juice (grapefruit, orange, apple — reduces bioavailability)",
    "maxDose": "180 mg/day",
    "unit": "mg/dose",
    "perKg": false,
    "value": 30
   }
  ],
  "indications": [
   "Seasonal allergic rhinitis",
   "Chronic idiopathic urticaria"
  ],
  "contraindications": [
   "Known hypersensitivity to fexofenadine or terfenadine",
   "Severe renal impairment (dose reduction required)"
  ],
  "formulations": [
   "30 mg tablet",
   "60 mg tablet",
   "120 mg tablet",
   "180 mg tablet"
  ],
  "monitoring": [
   "Renal function if prolonged use (reduce dose if GFR impaired)",
   "Drug interactions — avoid concurrent erythromycin/ketoconazole (increases fexofenadine levels)"
  ],
  "notes": "Formulary class: Second-Generation Antihistamine (Non-sedating H1 Antagonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-folic-acid",
  "name": "Folic Acid",
  "genericName": "Pteroylglutamic acid",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Deficiency treatment: 1–5 mg/day once daily. Prophylaxis (haemolytic anaemia, anticonvulsants): 1 mg/day. NTD prevention (periconceptional): 0.4–5 mg/day (higher doses for high-risk women). Megaloblastic: 1 mg/day × 3–4 months",
    "maxDose": "5 mg/day",
    "unit": "mg/day",
    "perKg": false,
    "min": 0.5,
    "max": 1
   }
  ],
  "indications": [
   "Folate deficiency anaemia",
   "Megaloblastic anaemia secondary to antifolate drugs (methotrexate — use folinic acid)",
   "Neural tube defect prevention (periconceptional supplementation)",
   "Haemolytic anaemias (prophylaxis)",
   "Anticonvulsant-associated folate deficiency"
  ],
  "contraindications": [
   "Untreated B12 deficiency (will correct anaemia but mask neurological deterioration)",
   "Known hypersensitivity"
  ],
  "formulations": [
   "0.4 mg tablet",
   "1 mg tablet",
   "5 mg tablet"
  ],
  "monitoring": [
   "CBC (reticulocyte response expected at 5–7 days; normalisation at 4–8 weeks)",
   "Serum folate levels",
   "Serum B12 (rule out concurrent B12 deficiency before high-dose folate)",
   "Haematological response"
  ],
  "notes": "Formulary class: Water-Soluble B Vitamin (Vitamin B9) / Haematinic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-gabapentin",
  "name": "Gabapentin",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral, divided TID",
    "frequency": "Every 8 hours (titrate slowly)",
    "notes": "Seizures: start 5 mg/kg/dose TID Day 1, increase to 10 mg/kg/dose TID Day 3, then 25 mg/kg/dose TID. Neuropathic pain: start 5 mg/kg HS then titrate. Adults: start 300 mg TID, titrate to 1800–3600 mg/day. Dose reduce in renal impairment Per-dose amount calculated from 5–35 mg/kg/day divided by 3 (Every 8 hours (titrate slowly)). • Epilepsy: Day 1: 5 mg/kg/dose TID; Day 2: 10 mg/kg/dose TID; Day 3: 25 mg/kg/dose TID; target 25–35 mg/kg/day div TID. Oral solution: 250 mg/5 mL (50 mg/mL). Dose reduce in renal impairment proportional to GFR Per-dose amount calculated from 5–35 mg/kg/day divided by 3 (Every 8 hours (titrate slowly)).",
    "maxDose": "3600 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1.667,
    "max": 11.667
   },
   {
    "route": "Oral, divided TID",
    "frequency": "Every 8 hours (titrate slowly)",
    "notes": "Seizures: start 5 mg/kg/dose TID Day 1, increase to 10 mg/kg/dose TID Day 3, then 25 mg/kg/dose TID. Neuropathic pain: start 5 mg/kg HS then titrate. Adults: start 300 mg TID, titrate to 1800–3600 mg/day. Dose reduce in renal impairment • Epilepsy: Day 1: 5 mg/kg/dose TID; Day 2: 10 mg/kg/dose TID; Day 3: 25 mg/kg/dose TID; target 25–35 mg/kg/day div TID. Oral solution: 250 mg/5 mL (50 mg/mL). Dose reduce in renal impairment proportional to GFR",
    "maxDose": "3600 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 5,
    "max": 35,
    "adultMaxDose_num": 3600
   }
  ],
  "indications": [
   "Partial seizures with/without secondary generalisation (adjunctive)",
   "Neuropathic pain (e.g. complex regional pain syndrome, phantom limb, spinal cord injury)",
   "Restless legs syndrome",
   "Post-herpetic neuralgia",
   "Partial seizures (adjunctive) — young children unable to swallow capsules",
   "Neuropathic pain"
  ],
  "contraindications": [
   "Known hypersensitivity to gabapentin",
   "Caution in respiratory depression or respiratory disease",
   "Caution with respiratory depression"
  ],
  "formulations": [
   "100 mg capsule",
   "300 mg capsule",
   "400 mg capsule",
   "600 mg tablet",
   "800 mg tablet",
   "250 mg/5 mL oral solution (50 mg/mL)"
  ],
  "monitoring": [
   "Seizure frequency",
   "Pain scores",
   "Sedation/CNS effects",
   "Renal function and dose adjustment",
   "Signs of dependence (especially high doses)",
   "Renal function",
   "Behavioural changes (hyperactivity in children)"
  ],
  "notes": "Formulary class: Anticonvulsant / Neuropathic Pain Agent (Alpha-2-delta voltage-gated calcium channel modulator). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-hydroxychloroquine",
  "name": "Hydroxychloroquine",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily (use ideal body weight — IBW)",
    "notes": "Dose based on ideal body weight to minimise retinopathy risk. Children: 3–5 mg/kg/day (IBW) max 400 mg/day. Malaria prophylaxis: 6.5 mg/kg/week (max 400 mg) — less preferred than chloroquine Per-dose amount calculated from 5 mg/kg/day divided by 1 (Once daily (use ideal body weight — IBW)).",
    "maxDose": "400 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily (use ideal body weight — IBW)",
    "notes": "Dose based on ideal body weight to minimise retinopathy risk. Children: 3–5 mg/kg/day (IBW) max 400 mg/day. Malaria prophylaxis: 6.5 mg/kg/week (max 400 mg) — less preferred than chloroquine",
    "maxDose": "400 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 5,
    "adultMaxDose_num": 400
   }
  ],
  "indications": [
   "Systemic lupus erythematosus (SLE)",
   "Juvenile idiopathic arthritis (adjunct)",
   "Dermatomyositis (skin manifestations)",
   "Malaria prophylaxis and treatment (less preferred than chloroquine)"
  ],
  "contraindications": [
   "Retinal or visual field changes attributable to hydroxychloroquine",
   "G6PD deficiency (relative)",
   "Known hypersensitivity",
   "Porphyria cutanea tarda"
  ],
  "formulations": [
   "200 mg tablet"
  ],
  "monitoring": [
   "Annual ophthalmological exam with OCT (retinal toxicity — cumulative dose-dependent)",
   "CBC (haematological toxicity)",
   "Blood glucose (may cause hypoglycaemia)",
   "QTc interval",
   "Liver function"
  ],
  "notes": "Formulary class: 4-Aminoquinoline — DMARD / Antimalarial. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | ACR Guidelines"
 },
 {
  "id": "fx-hydroxyzine",
  "name": "Hydroxyzine",
  "category": "sedative",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6 hours PRN",
    "notes": "Pruritus/anxiety: 0.5–1 mg/kg/dose q6h PRN (max 50 mg/dose). Pre-operative sedation: 0.5–1 mg/kg (max 50 mg) 30–60 min before procedure. Adults: 25–100 mg TID-QID. Max 600 mg/day in adults • Pruritus: 0.5–1 mg/kg/dose q6h PRN (max 50 mg/dose). Pre-operative sedation: 0.5–1 mg/kg (max 50 mg) 30–60 min before procedure. Syrup: 10 mg/5 mL (2 mg/mL)",
    "maxDose": "50 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1,
    "adultMaxDose_num": 50
   }
  ],
  "indications": [
   "Pruritus (atopic dermatitis, urticaria, drug rash)",
   "Anxiety (short-term)",
   "Pre-operative sedation",
   "Nausea and vomiting (adjunct)",
   "Pruritus (atopic dermatitis, urticaria)"
  ],
  "contraindications": [
   "QT prolongation or concurrent QT-prolonging medications",
   "Porphyria",
   "Known hypersensitivity to hydroxyzine or cetirizine",
   "Pregnancy (first trimester — teratogenic in animals)",
   "QT prolongation",
   "Concurrent QT-prolonging medications",
   "Age < 6 months (limited data)",
   "Pregnancy (1st trimester)"
  ],
  "formulations": [
   "10 mg tablet",
   "25 mg tablet",
   "50 mg tablet",
   "10 mg/5 mL syrup (2 mg/mL)"
  ],
  "monitoring": [
   "Sedation level",
   "QTc interval (risk of torsades)",
   "Urinary retention",
   "Anticholinergic symptoms",
   "Blood pressure",
   "QTc interval"
  ],
  "notes": "Formulary class: First-Generation Antihistamine (Piperazine H1 Antagonist) — Anxiolytic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-ivermectin",
  "name": "Ivermectin",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral, on empty stomach",
    "frequency": "Single dose (may repeat at 2 weeks for scabies)",
    "notes": "Scabies: 200 mcg/kg single dose × 2 doses (day 1 and day 8–15). Strongyloidiasis: 200 mcg/kg/day × 2 days. Onchocerciasis: 150 mcg/kg single dose annually. Take on empty stomach with water",
    "maxDose": "200 mcg/kg/dose",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "min": 150,
    "max": 200,
    "adultMaxDose_num": 200
   }
  ],
  "indications": [
   "Onchocerciasis (river blindness)",
   "Strongyloidiasis",
   "Scabies (including crusted/Norwegian scabies)",
   "Pediculosis (head lice — refractory)",
   "Lymphatic filariasis (mass drug administration)"
  ],
  "contraindications": [
   "Age < 5 years or weight < 15 kg",
   "Pregnancy (limited data)",
   "Loiasis (Loa loa) with high microfilaraemia (risk of encephalopathy)",
   "Known hypersensitivity",
   "Blood-brain barrier disruption (e.g., meningitis — increased CNS toxicity risk)"
  ],
  "formulations": [
   "3 mg tablet",
   "6 mg tablet"
  ],
  "monitoring": [
   "Mazzotti reaction (fever, rash, lymphadenopathy — killed microfilariae reaction) — mainly with onchocerciasis",
   "Neurological symptoms (dizziness, ataxia, seizures — rare)",
   "Loa loa microfilaria count before treatment (if endemic)",
   "Resolution of symptoms"
  ],
  "notes": "Formulary class: Macrocyclic Lactone Antiparasitic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | WHO Essential Medicines"
 },
 {
  "id": "fx-levocetirizine",
  "name": "Levocetirizine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily (evening)",
    "notes": "6 months–5 yr: 1.25 mg (2.5 mL of 0.5 mg/mL oral solution) once daily. 6–11 yr: 2.5 mg once daily. ≥12 yr: 5 mg once daily. Renal impairment: dose reduce according to GFR. Not weight-based at standard doses",
    "maxDose": "5 mg/day",
    "unit": "mg/day",
    "perKg": false,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily (evening)",
    "notes": "6 months–5 yr: 1.25 mg (2.5 mL of 0.5 mg/mL) once daily. 6–11 yr: 2.5 mg once daily (5 mL). ≥12 yr: 5 mg once daily (10 mL). Dose reduce in renal impairment according to GFR",
    "maxDose": "5 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.125,
    "adultMaxDose_num": 5
   }
  ],
  "indications": [
   "Allergic rhinitis (seasonal and perennial)",
   "Chronic idiopathic urticaria",
   "Atopic dermatitis (adjunct antipruritic)"
  ],
  "contraindications": [
   "Severe renal impairment (CrCl < 10 mL/min)",
   "Known hypersensitivity to levocetirizine or cetirizine",
   "Haemodialysis patients",
   "Severe renal impairment (GFR < 10 mL/min)"
  ],
  "formulations": [
   "5 mg tablet",
   "2.5 mg/5 mL oral solution (0.5 mg/mL)"
  ],
  "monitoring": [
   "Renal function (dose adjustment required in renal impairment)",
   "Level of sedation",
   "Clinical response",
   "Renal function (dose adjustment in impairment)",
   "Sedation level",
   "Symptom response"
  ],
  "notes": "Formulary class: Second-Generation Antihistamine (R-enantiomer of Cetirizine). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-levothyroxine",
  "name": "Levothyroxine",
  "genericName": "L-thyroxine (T4)",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral, fasting (30 min before food)",
    "frequency": "Once daily (morning)",
    "notes": "Age-based dosing: 0–3 mo: 10–15 mcg/kg/day; 3–6 mo: 8–10 mcg/kg/day; 6–12 mo: 6–8 mcg/kg/day; 1–5 yr: 5–6 mcg/kg/day; 6–12 yr: 4–5 mcg/kg/day; >12 yr: 2–3 mcg/kg/day. Administer 30–60 min before food or as directed. Adjust dose every 4–8 weeks based on TSH/FT4 Per-dose amount calculated from 10 mcg/kg/day divided by 1 (Once daily (morning)).",
    "maxDose": "200 mcg/day",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "value": 10
   },
   {
    "route": "Oral, fasting (30 min before food)",
    "frequency": "Once daily (morning)",
    "notes": "Age-based dosing: 0–3 mo: 10–15 mcg/kg/day; 3–6 mo: 8–10 mcg/kg/day; 6–12 mo: 6–8 mcg/kg/day; 1–5 yr: 5–6 mcg/kg/day; 6–12 yr: 4–5 mcg/kg/day; >12 yr: 2–3 mcg/kg/day. Administer 30–60 min before food or as directed. Adjust dose every 4–8 weeks based on TSH/FT4",
    "maxDose": "200 mcg/day",
    "unit": "mcg/kg/day",
    "perKg": true,
    "value": 10,
    "adultMaxDose_num": 200
   }
  ],
  "indications": [
   "Congenital hypothyroidism",
   "Acquired hypothyroidism (all aetiologies)",
   "Thyroid cancer (post-thyroidectomy suppression therapy)",
   "Goitre (select cases)"
  ],
  "contraindications": [
   "Uncorrected adrenal insufficiency (risk of adrenal crisis)",
   "Thyrotoxicosis (unless post-ablative)",
   "Recent acute MI (caution)",
   "Known hypersensitivity to levothyroxine"
  ],
  "formulations": [
   "25 mcg tablet",
   "50 mcg tablet",
   "75 mcg tablet",
   "100 mcg tablet",
   "150 mcg tablet"
  ],
  "monitoring": [
   "Serum TSH and Free T4 (4–8 weeks after initiation/dose change; then 6–12 monthly once stable)",
   "Growth and bone age (paediatrics)",
   "Heart rate, blood pressure",
   "Signs of over/under-replacement",
   "Timing with interacting medications (iron, calcium, antacids reduce absorption)"
  ],
  "notes": "Formulary class: Thyroid Hormone Replacement. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | ATA/ESPE guidelines"
 },
 {
  "id": "fx-loratadine",
  "name": "Loratadine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Children 2–5 yr (or ≤30 kg): 5 mg once daily. Children >5 yr (or >30 kg) and adults: 10 mg once daily. Hepatic impairment: reduce to every other day. Not weight-based at standard doses",
    "maxDose": "10 mg/day",
    "unit": "mg/dose",
    "perKg": false,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Children 2–5 yr (or ≤30 kg): 5 mg (5 mL of 1 mg/mL syrup) once daily. >5 yr or >30 kg: 10 mg (10 mL) once daily. Not weight-based at standard doses. Hepatic impairment: reduce to every other day",
    "maxDose": "10 mg/day",
    "unit": "mg/day",
    "perKg": false,
    "value": 5
   }
  ],
  "indications": [
   "Seasonal and perennial allergic rhinitis",
   "Urticaria (acute and chronic idiopathic)",
   "Allergic conjunctivitis"
  ],
  "contraindications": [
   "Known hypersensitivity to loratadine or desloratadine",
   "Significant hepatic impairment (reduce frequency)",
   "Known hypersensitivity to loratadine",
   "Significant hepatic impairment"
  ],
  "formulations": [
   "5 mg tablet (or syrup for younger children)",
   "10 mg tablet",
   "5 mg/5 mL syrup (1 mg/mL)"
  ],
  "monitoring": [
   "Liver function (reduce dosing frequency if impaired)",
   "Clinical symptom response",
   "Liver function (frequency reduction if impaired)",
   "Symptom response",
   "Minimal sedation monitoring required"
  ],
  "notes": "Formulary class: Second-Generation Antihistamine (Non-sedating H1 Antagonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-losartan",
  "name": "Losartan",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start 0.7 mg/kg/day (max 50 mg); titrate to max 1.4 mg/kg/day (max 100 mg/day). Suspension available for children who cannot swallow tablets. Use ideal body weight in obese patients. Monitor K and creatinine as per ACE inhibitors Per-dose amount calculated from 0.7–1.4 mg/kg/day divided by 1 (Once daily). • Start 0.7 mg/kg/day (max 50 mg); titrate to max 1.4 mg/kg/day (max 100 mg/day). Extemporaneous suspension: 2.5 mg/mL. Stable 4 weeks in refrigerator. Shake well Per-dose amount calculated from 0.7–1.4 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "100 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.7,
    "max": 1.4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start 0.7 mg/kg/day (max 50 mg); titrate to max 1.4 mg/kg/day (max 100 mg/day). Suspension available for children who cannot swallow tablets. Use ideal body weight in obese patients. Monitor K and creatinine as per ACE inhibitors • Start 0.7 mg/kg/day (max 50 mg); titrate to max 1.4 mg/kg/day (max 100 mg/day). Extemporaneous suspension: 2.5 mg/mL. Stable 4 weeks in refrigerator. Shake well",
    "maxDose": "100 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.7,
    "max": 1.4,
    "adultMaxDose_num": 100
   }
  ],
  "indications": [
   "Hypertension (≥6 years)",
   "Proteinuric renal disease / diabetic nephropathy",
   "Marfan syndrome (aortic root dilation — off-label)",
   "Heart failure (ACE inhibitor-intolerant)",
   "Hypertension (children ≥6 years who cannot swallow tablets)",
   "Proteinuric renal disease",
   "Marfan syndrome (aortic root — off-label)"
  ],
  "contraindications": [
   "Pregnancy (fetopathy — teratogenic, avoid)",
   "Bilateral renal artery stenosis",
   "Known hypersensitivity",
   "Concomitant aliskiren in patients with diabetes or renal impairment",
   "Pregnancy (fetopathy)",
   "Concurrent aliskiren in diabetes"
  ],
  "formulations": [
   "12.5 mg tablet",
   "25 mg tablet",
   "50 mg tablet",
   "100 mg tablet",
   "2.5 mg/mL extemporaneous suspension (compounded)"
  ],
  "monitoring": [
   "Blood pressure",
   "Serum creatinine/GFR",
   "Serum potassium (hyperkalaemia risk)",
   "Urine protein",
   "Liver function if hepatic disease present",
   "Serum potassium"
  ],
  "notes": "Formulary class: Angiotensin II Receptor Blocker (ARB, AT1-receptor antagonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-mebendazole",
  "name": "Mebendazole",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Single dose (pinworm) or BID × 3 days (other helminths)",
    "notes": "Pinworm: 100 mg single dose; repeat at 2–3 weeks (due to reinfection risk). Roundworm/whipworm/hookworm: 100 mg BID × 3 days, or 500 mg single dose. Can be chewed or swallowed. Not weight-based for standard STH treatment",
    "maxDose": "100 mg/dose",
    "unit": "mg/dose",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [
   "Enterobiasis (pinworm)",
   "Ascariasis (roundworm)",
   "Trichuriasis (whipworm)",
   "Ancylostomiasis (hookworm)",
   "Toxocariasis (visceral larva migrans — off-label)"
  ],
  "contraindications": [
   "Age < 2 years (limited safety data)",
   "Known hypersensitivity to benzimidazoles",
   "Pregnancy (especially 1st trimester — Category C)"
  ],
  "formulations": [
   "100 mg chewable tablet",
   "500 mg tablet"
  ],
  "monitoring": [
   "Symptom resolution (perianal itching)",
   "Family members should be treated simultaneously",
   "Repeat treatment after 2–3 weeks to prevent reinfection"
  ],
  "notes": "Formulary class: Benzimidazole Anthelmintic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | WHO Essential Medicines"
 },
 {
  "id": "fx-metformin",
  "name": "Metformin",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "BID with meals, titrate by 500 mg/week",
    "notes": "Start 500 mg BID with meals; increase by 500 mg/week as tolerated. Usual effective dose: 1000–2000 mg/day div BID. Extended-release (XR) can be given once daily. Max 2550 mg/day in adults; paediatric max typically 2000 mg/day. Take with food to reduce GI side effects",
    "maxDose": "2000 mg/day",
    "unit": "mg/dose",
    "perKg": false,
    "value": 500
   }
  ],
  "indications": [
   "Type 2 diabetes mellitus (≥10 years)",
   "Pre-diabetes (lifestyle failure)",
   "Polycystic ovarian syndrome (PCOS — off-label)",
   "Obesity (adjunct — off-label)"
  ],
  "contraindications": [
   "Type 1 diabetes",
   "Diabetic ketoacidosis",
   "Renal impairment (eGFR < 30 mL/min/1.73m²)",
   "Hepatic impairment",
   "IV contrast procedures (hold 48h before/after)",
   "Alcohol abuse",
   "Acute/severe illness at risk of dehydration/hypoperfusion"
  ],
  "formulations": [
   "500 mg tablet",
   "850 mg tablet",
   "1000 mg tablet",
   "Extended-release formulations"
  ],
  "monitoring": [
   "HbA1c (3-monthly initially, then 6-monthly)",
   "Fasting blood glucose",
   "Renal function (eGFR) — at least annually, more frequently if impaired",
   "Vitamin B12 levels (annually — metformin reduces B12 absorption)",
   "Lactic acid if symptomatic"
  ],
  "notes": "Formulary class: Biguanide — Oral Antidiabetic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | ADA Paediatric Guidelines"
 },
 {
  "id": "fx-metoclopramide",
  "name": "Metoclopramide",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "3–4 times daily (before meals)",
    "notes": "0.1–0.2 mg/kg/dose TID-QID (max 10 mg/dose, max 0.5 mg/kg/day). Children: max 30 mg/day; adults: max 40 mg/day. Avoid continuous use > 3 months. Risk of EPS higher in young patients — use lowest effective dose",
    "maxDose": "10 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.2,
    "adultMaxDose_num": 10
   }
  ],
  "indications": [
   "Nausea and vomiting (post-operative, chemotherapy, migraine)",
   "Gastroparesis (delayed gastric emptying)",
   "GORD (adjunct)",
   "Facilitating GI procedures (promote gastric emptying)"
  ],
  "contraindications": [
   "GI obstruction, perforation or haemorrhage",
   "Phaeochromocytoma",
   "Parkinson's disease (worsens)",
   "History of tardive dyskinesia or drug-induced EPS",
   "Epilepsy (lowers seizure threshold)",
   "Concurrent antipsychotics (additive EPS)"
  ],
  "formulations": [
   "5 mg tablet",
   "10 mg tablet"
  ],
  "monitoring": [
   "Extrapyramidal symptoms (EPS) — dystonia, akathisia, especially in young children",
   "Tardive dyskinesia (with prolonged use)",
   "Sedation level",
   "GI response",
   "Prolactin levels (galactorrhoea)"
  ],
  "notes": "Formulary class: Dopamine D2 Antagonist / Prokinetic — Antiemetic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-metronidazole",
  "name": "Metronidazole",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided q8h",
    "frequency": "Every 8 hours",
    "notes": "Anaerobic infections/C. diff: 15–35 mg/kg/day div q8h × 7–10 days (max 500 mg TID). Giardia: 15 mg/kg/day div TID × 5 days (max 250 mg TID). Amoebiasis: 35–50 mg/kg/day div TID × 7–10 days (max 750 mg TID) Per-dose amount calculated from 15–35 mg/kg/day divided by 3 (Every 8 hours). • Anaerobic infections: 15–35 mg/kg/day div q8h (max 500 mg TID). Giardia: 15 mg/kg/day div TID × 5 days. Amoebiasis: 35–50 mg/kg/day div TID × 7–10 days (max 750 mg TID). Avoid alcohol during and 48h after therapy Per-dose amount calculated from 15–35 mg/kg/day divided by 3 (Every 8 hours).",
    "maxDose": "500 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 11.667,
    "adultMaxDose_num": 500
   },
   {
    "route": "Oral, divided q8h",
    "frequency": "Every 8 hours",
    "notes": "Anaerobic infections/C. diff: 15–35 mg/kg/day div q8h × 7–10 days (max 500 mg TID). Giardia: 15 mg/kg/day div TID × 5 days (max 250 mg TID). Amoebiasis: 35–50 mg/kg/day div TID × 7–10 days (max 750 mg TID) • Anaerobic infections: 15–35 mg/kg/day div q8h (max 500 mg TID). Giardia: 15 mg/kg/day div TID × 5 days. Amoebiasis: 35–50 mg/kg/day div TID × 7–10 days (max 750 mg TID). Avoid alcohol during and 48h after therapy",
    "maxDose": "Max 1500 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 35,
    "adultMaxDose_num": 1500
   }
  ],
  "indications": [
   "Anaerobic bacterial infections",
   "Giardiasis",
   "Amoebiasis (intestinal and extra-intestinal)",
   "C. difficile colitis (mild–moderate)",
   "Bacterial vaginosis",
   "H. pylori (combination therapy)",
   "Dental infections",
   "Amoebiasis (intestinal and hepatic)",
   "Anaerobic bacterial infections (young children)",
   "C. difficile colitis (mild-moderate)"
  ],
  "contraindications": [
   "Known hypersensitivity to nitroimidazoles",
   "1st trimester pregnancy (relative — avoid if possible)",
   "Concurrent disulfiram or alcohol (disulfiram-like reaction)",
   "CNS disease (neurological side effects)",
   "Nitroimidazole hypersensitivity",
   "1st trimester pregnancy (relative)",
   "Concurrent disulfiram or alcohol"
  ],
  "formulations": [
   "200 mg tablet",
   "400 mg tablet",
   "500 mg tablet",
   "200 mg/5 mL suspension (40 mg/mL)"
  ],
  "monitoring": [
   "Signs of neurological toxicity (peripheral neuropathy, seizures — with prolonged use)",
   "CBC with prolonged therapy",
   "Liver function (hepatotoxicity — rare)",
   "Avoid alcohol during therapy and for 48h after completion",
   "GI tolerance",
   "Signs of peripheral neuropathy (prolonged use)",
   "CBC (prolonged therapy)",
   "Alcohol avoidance counselling"
  ],
  "notes": "Formulary class: Nitroimidazole Antibiotic / Antiprotozoal. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-montelukast",
  "name": "Montelukast",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily (evening)",
    "notes": "6–23 months: 4 mg granules once daily. 2–5 yr: 4 mg tablet/granules. 6–14 yr: 5 mg tablet. ≥15 yr: 10 mg tablet. Take in the evening. Not weight-based for standard doses",
    "maxDose": "10 mg/day",
    "unit": "mg/day",
    "perKg": false,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily (evening)",
    "notes": "6–23 months: 4 mg granules once daily. 2–5 yr: 4 mg chewable/granules. 6–14 yr: 5 mg chewable. ≥15 yr: 10 mg tablet. Granules: sprinkle on soft food (apple sauce) or room-temperature liquid. Evening administration preferred. FDA Black Box Warning: neuropsychiatric effects",
    "maxDose": "10 mg/day",
    "unit": "mg/day",
    "perKg": false,
    "value": 4
   }
  ],
  "indications": [
   "Persistent asthma (maintenance — mild to moderate, add-on)",
   "Allergic rhinitis (seasonal and perennial)",
   "Exercise-induced bronchoconstriction (prevention)",
   "Urticaria (chronic idiopathic — adjunct)",
   "Persistent asthma (maintenance, mild-moderate)",
   "Allergic rhinitis",
   "Exercise-induced bronchoconstriction"
  ],
  "contraindications": [
   "Known hypersensitivity to montelukast",
   "NOT for acute asthma attacks (no bronchodilator effect)",
   "NOT for acute asthma attacks"
  ],
  "formulations": [
   "4 mg chewable tablet / granules",
   "5 mg chewable tablet",
   "10 mg tablet",
   "4 mg granule sachets",
   "4 mg chewable tablet (use granules for liquid form)"
  ],
  "monitoring": [
   "Asthma symptom frequency/PEFR",
   "Neuropsychiatric symptoms (FDA Black Box Warning: mood changes, sleep disturbances, suicidal ideation — especially in children)",
   "Eosinophil count (Churg-Strauss vasculitis risk when steroid-sparing)",
   "Asthma symptom control",
   "Neuropsychiatric symptoms (Black Box Warning: mood, sleep, suicidal ideation)",
   "Eosinophil count"
  ],
  "notes": "Formulary class: Leukotriene Receptor Antagonist (LTRA, CysLT1 antagonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | FDA Black Box Warning 2020"
 },
 {
  "id": "fx-nitrofurantoin",
  "name": "Nitrofurantoin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided q6h with food",
    "frequency": "Every 6 hours × 7–14 days (treatment)",
    "notes": "Treatment: 5–7 mg/kg/day div q6h × 7 days (max 100 mg/dose). Prophylaxis: 1–2 mg/kg/day once daily at bedtime (max 100 mg/day). Macrocrystalline/monohydrate formulation: taken BID with food. Avoid in pyelonephritis or systemic infections (inadequate tissue penetration) Per-dose amount calculated from 5–7 mg/kg/day divided by 4 (Every 6 hours × 7–14 days (treatment)). • Treatment: 5–7 mg/kg/day div q6h × 7 days (max 100 mg/dose). Prophylaxis: 1–2 mg/kg/day once nightly (max 100 mg). Suspension 25 mg/5 mL. Give with food to reduce nausea. Avoid pyelonephritis (poor tissue penetration) Per-dose amount calculated from 5–7 mg/kg/day divided by 4 (Every 6 hours × 7 days).",
    "maxDose": "100 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1.25,
    "max": 1.75,
    "adultMaxDose_num": 100
   },
   {
    "route": "Oral, divided q6h with food",
    "frequency": "Every 6 hours × 7–14 days (treatment)",
    "notes": "Treatment: 5–7 mg/kg/day div q6h × 7 days (max 100 mg/dose). Prophylaxis: 1–2 mg/kg/day once daily at bedtime (max 100 mg/day). Macrocrystalline/monohydrate formulation: taken BID with food. Avoid in pyelonephritis or systemic infections (inadequate tissue penetration) • Treatment: 5–7 mg/kg/day div q6h × 7 days (max 100 mg/dose). Prophylaxis: 1–2 mg/kg/day once nightly (max 100 mg). Suspension 25 mg/5 mL. Give with food to reduce nausea. Avoid pyelonephritis (poor tissue penetration)",
    "maxDose": "Max 400 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 5,
    "max": 7,
    "adultMaxDose_num": 400
   }
  ],
  "indications": [
   "Lower urinary tract infections (uncomplicated cystitis)",
   "UTI prophylaxis (recurrent UTI in children)",
   "Lower urinary tract infections (uncomplicated)",
   "UTI prophylaxis (recurrent, children)"
  ],
  "contraindications": [
   "GFR < 30 mL/min (drug accumulates — inadequate urinary concentrations and increased toxicity)",
   "Age < 1 month (risk of haemolytic anaemia)",
   "G6PD deficiency (haemolysis risk)",
   "Pregnancy at term (neonatal haemolytic anaemia)",
   "Pulmonary fibrosis history",
   "GFR < 30 mL/min",
   "Age < 1 month (haemolytic anaemia)",
   "G6PD deficiency",
   "Pregnancy at term"
  ],
  "formulations": [
   "50 mg tablet/capsule",
   "100 mg tablet/capsule (macrocrystalline or monohydrate)",
   "25 mg/5 mL oral suspension (5 mg/mL)"
  ],
  "monitoring": [
   "Urine culture and sensitivity (confirm susceptibility)",
   "Renal function (GFR — contraindicated if impaired)",
   "Pulmonary symptoms (cough, dyspnoea — pulmonary toxicity)",
   "Liver function (rare hepatotoxicity)",
   "CBC in prolonged prophylaxis (haematological toxicity)",
   "Urine C&S",
   "Pulmonary symptoms",
   "LFTs",
   "CBC (prophylaxis — haematological toxicity)"
  ],
  "notes": "Formulary class: Nitrofuran Antibiotic (Urinary antiseptic). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-omeprazole",
  "name": "Omeprazole",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral (30 min before food)",
    "frequency": "Once daily (or BID for severe disease)",
    "notes": "GORD: 0.7–1.4 mg/kg/day once daily (max 20 mg/day <20 kg, 40 mg/day ≥20 kg). Erosive oesophagitis: 1–3.3 mg/kg/day div BID. H. pylori: 1 mg/kg/day BID + antibiotics × 14 days. Swallow capsule whole or open and sprinkle granules on applesauce Per-dose amount calculated from 0.7–3.3 mg/kg/day divided by 1 (Once daily (or BID for severe disease)).",
    "maxDose": "40 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.7,
    "max": 3.3,
    "adultMaxDose_num": 40
   },
   {
    "route": "Oral (30 min before food)",
    "frequency": "Once daily (or BID for severe disease)",
    "notes": "GORD: 0.7–1.4 mg/kg/day once daily (max 20 mg/day <20 kg, 40 mg/day ≥20 kg). Erosive oesophagitis: 1–3.3 mg/kg/day div BID. H. pylori: 1 mg/kg/day BID + antibiotics × 14 days. Swallow capsule whole or open and sprinkle granules on applesauce",
    "maxDose": "Max 40 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.7,
    "max": 3.3,
    "adultMaxDose_num": 40
   },
   {
    "route": "Oral (30 min before food)",
    "frequency": "Once daily or BID for severe disease",
    "notes": "GORD: 0.7–1.4 mg/kg/day OD (max 20 mg/day <20 kg; 40 mg/day ≥20 kg). Erosive oesophagitis: 1–3.3 mg/kg/day BID. Extemporaneous 2 mg/mL suspension. Open granules: mix in water/apple juice (slightly acidic) for enteral administration Maximum is per dose: 40 mg/dose. Daily total shown — divide by the prescribed frequency.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.7,
    "max": 3.3
   }
  ],
  "indications": [
   "Gastro-oesophageal reflux disease (GORD)",
   "Peptic ulcer disease",
   "H. pylori eradication (combination therapy)",
   "Zollinger-Ellison syndrome",
   "NSAID-associated gastric ulcer prevention",
   "Eosinophilic oesophagitis (adjunct)",
   "GORD",
   "H. pylori eradication (triple therapy)"
  ],
  "contraindications": [
   "Known hypersensitivity to PPIs or benzimidazoles",
   "Concurrent rilpivirine or nelfinavir (HIV agents — gastric pH interaction)",
   "PPI or benzimidazole hypersensitivity",
   "Concurrent rilpivirine"
  ],
  "formulations": [
   "10 mg capsule",
   "20 mg capsule",
   "40 mg capsule",
   "2 mg/mL extemporaneous oral suspension",
   "10 mg sachet granules (for suspension)"
  ],
  "monitoring": [
   "Symptom response (4–8 weeks initial trial)",
   "H. pylori eradication confirmation (urea breath test 4+ weeks after treatment)",
   "Magnesium (hypomagnesaemia with prolonged use)",
   "Vitamin B12 (impaired absorption — long-term use)",
   "Bone density (prolonged high-dose use — osteoporosis risk)",
   "Symptom response (4–8 weeks)",
   "H. pylori eradication confirmation",
   "Magnesium (prolonged use)",
   "B12 (long-term)",
   "Bone density (prolonged high-dose)"
  ],
  "notes": "Formulary class: Proton Pump Inhibitor (PPI) — Irreversible H⁺/K⁺-ATPase Inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-oseltamivir",
  "name": "Oseltamivir",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily × 5 days (treatment)",
    "notes": "Weight-based: <15 kg: 30 mg BID. 15–23 kg: 45 mg BID. >23–40 kg: 60 mg BID. >40 kg / ≥13 yr: 75 mg BID × 5 days. <1 yr: 3 mg/kg BID × 5 days. Prophylaxis: half the treatment dose once daily × 10 days (post-exposure) or × 6 weeks (seasonal). Adjust dose in renal impairment",
    "maxDose": "75 mg/dose",
    "unit": "mg/dose",
    "perKg": false,
    "value": 30
   },
   {
    "route": "Oral",
    "frequency": "Twice daily × 5 days",
    "notes": "<1 yr: 3 mg/kg/dose BID × 5 days. Weight-based (1–12 yr): ≤15 kg: 30 mg BID; >15–23 kg: 45 mg BID; >23–40 kg: 60 mg BID; >40 kg: 75 mg BID. Prophylaxis: half dose once daily × 10 days. Suspension 12 mg/mL. Adjust in renal impairment. Take with food to reduce nausea",
    "maxDose": "75 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 3,
    "adultMaxDose_num": 75
   }
  ],
  "indications": [
   "Influenza A and B treatment (within 48 hours of symptom onset)",
   "Influenza prophylaxis (post-exposure, seasonal)",
   "Influenza in high-risk patients (any time course — immunocompromised)",
   "High-risk patients (immunocompromised, chronic illness)"
  ],
  "contraindications": [
   "Known hypersensitivity to oseltamivir",
   "Severe renal impairment (dose adjustment required)",
   "Not a substitute for influenza vaccination"
  ],
  "formulations": [
   "30 mg capsule",
   "45 mg capsule",
   "75 mg capsule",
   "12 mg/mL oral suspension (60 mL bottle)"
  ],
  "monitoring": [
   "Symptom duration and severity",
   "Renal function (dose adjustment)",
   "Neuropsychiatric symptoms (hallucinations, self-injury — particularly in Japanese adolescents — FDA warning)",
   "Influenza test confirmation",
   "Neuropsychiatric symptoms (rare — hallucinations, self-injury)",
   "Influenza diagnosis confirmation"
  ],
  "notes": "Formulary class: Neuraminidase Inhibitor — Antiviral (Influenza). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | CDC Influenza Antiviral Guidance"
 },
 {
  "id": "fx-phenytoin",
  "name": "Phenytoin",
  "genericName": "Diphenylhydantoin",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral, divided BID–TID",
    "frequency": "Every 8–12 hours",
    "notes": "Children: 4–8 mg/kg/day div BID-TID; adjust by monitoring levels. Adults: 300–400 mg/day. Therapeutic range (total): 10–20 mg/L; free: 1–2 mg/L. Highly protein-bound — free levels critical in hypoalbuminaemia. Saturable (Michaelis-Menten) kinetics — small dose changes may cause large level changes. Potent CYP inducer • Children: 4–8 mg/kg/day div BID-TID. Suspension 125 mg/5 mL (25 mg/mL). Shake WELL before use (12+ vigorous shakes — settling causes inaccurate dosing). Therapeutic range: 10–20 mg/L total. Do NOT mix with enteral feeds (chelation — reduce absorption). Saturable kinetics",
    "maxDose": "300 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 4,
    "max": 8,
    "adultMaxDose_num": 300
   }
  ],
  "indications": [
   "Partial (focal) seizures with/without secondary generalisation",
   "Tonic-clonic seizures",
   "Post-traumatic seizure prophylaxis",
   "Trigeminal neuralgia (alternative)",
   "Partial seizures with/without secondary generalisation"
  ],
  "contraindications": [
   "Absence seizures (worsens)",
   "Concurrent delavirdine (HIV)",
   "Sinus bradycardia/SA block/2nd-3rd degree AV block (IV form)",
   "Known hypersensitivity to hydantoins",
   "Porphyria",
   "Sinus bradycardia/AV block",
   "Hypersensitivity to hydantoins"
  ],
  "formulations": [
   "25 mg tablet",
   "50 mg tablet (Infatabs — chewable)",
   "100 mg capsule",
   "125 mg/5 mL oral suspension (25 mg/mL)"
  ],
  "monitoring": [
   "Serum phenytoin levels (trough, target 10–20 mg/L total; free 1–2 mg/L)",
   "Free phenytoin if hypoalbuminaemia or renal failure",
   "CBC (haematological toxicity)",
   "LFTs",
   "Gum hypertrophy (dental hygiene)",
   "Neurological exam (nystagmus, ataxia — toxicity signs)",
   "Serum phenytoin levels (trough — target 10–20 mg/L; free 1–2 mg/L)",
   "Shake bottle well before dosing (critical)",
   "CBC",
   "Gum hypertrophy"
  ],
  "notes": "Formulary class: Anticonvulsant (Sodium Channel Blocker — Hydantoin). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-rifampicin",
  "name": "Rifampicin",
  "genericName": "Rifampin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, on empty stomach",
    "frequency": "Once daily (30 min before food)",
    "notes": "TB treatment: 10–20 mg/kg/day once daily (max 600 mg/day). Meningococcal prophylaxis: 10 mg/kg BID × 2 days (max 600 mg/dose). Hib prophylaxis: 20 mg/kg/day once daily × 4 days (max 600 mg/day). Potent inducer of CYP1A2, CYP2B6, CYP2C, CYP3A4 — numerous important drug interactions Per-dose amount calculated from 10–20 mg/kg/day divided by 1 (Once daily (30 min before food)). • TB: 10–20 mg/kg/day OD (max 600 mg/day). Meningococcal prophylaxis: 10 mg/kg BID × 2 days (max 600 mg/dose). Hib prophylaxis: 20 mg/kg/day OD × 4 days (max 600 mg). Suspension: 20 mg/mL extemporaneous. Warn: orange-red discolouration of all secretions/urine/tears Per-dose amount calculated from 10–20 mg/kg/day divided by 1 (Once daily (30 min before food)).",
    "maxDose": "600 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral, on empty stomach",
    "frequency": "Once daily (30 min before food)",
    "notes": "TB treatment: 10–20 mg/kg/day once daily (max 600 mg/day). Meningococcal prophylaxis: 10 mg/kg BID × 2 days (max 600 mg/dose). Hib prophylaxis: 20 mg/kg/day once daily × 4 days (max 600 mg/day). Potent inducer of CYP1A2, CYP2B6, CYP2C, CYP3A4 — numerous important drug interactions • TB: 10–20 mg/kg/day OD (max 600 mg/day). Meningococcal prophylaxis: 10 mg/kg BID × 2 days (max 600 mg/dose). Hib prophylaxis: 20 mg/kg/day OD × 4 days (max 600 mg). Suspension: 20 mg/mL extemporaneous. Warn: orange-red discolouration of all secretions/urine/tears",
    "maxDose": "600 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 20,
    "adultMaxDose_num": 600
   }
  ],
  "indications": [
   "Tuberculosis (part of combination regimen — HRZE/HR)",
   "Meningococcal carrier eradication (prophylaxis)",
   "Haemophilus influenzae type b prophylaxis",
   "Staphylococcal infections (adjunct — biofilm, osteomyelitis)",
   "Leprosy (combination)",
   "Tuberculosis (part of combination regimen)",
   "Meningococcal/Hib prophylaxis in young children",
   "Staphylococcal infections (biofilm adjunct)"
  ],
  "contraindications": [
   "Known hypersensitivity to rifamycins",
   "Severe hepatic impairment",
   "Concurrent protease inhibitors, azole antifungals, hormonal contraceptives (significant CYP induction — drug interactions)",
   "Jaundice",
   "Rifamycin hypersensitivity",
   "Concurrent protease inhibitors, azole antifungals (strong CYP induction)"
  ],
  "formulations": [
   "150 mg capsule",
   "300 mg capsule",
   "20 mg/mL extemporaneous oral suspension"
  ],
  "monitoring": [
   "Liver function tests (ALT, AST, bilirubin) at baseline and monthly",
   "CBC",
   "Urine/body secretion discolouration (orange-red — warn patient)",
   "Drug interactions (comprehensive review required — OCPs, anticoagulants, antifungals, HIV drugs, cyclosporin)",
   "Sputum culture/smear (TB monitoring)",
   "LFTs monthly (hepatotoxicity)",
   "Drug interactions (comprehensive review required)",
   "Adherence and orange discolouration counselling",
   "TB: sputum culture/smear"
  ],
  "notes": "Formulary class: Rifamycin Antibiotic (RNA polymerase inhibitor). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | WHO TB Guidelines"
 },
 {
  "id": "fx-sertraline",
  "name": "Sertraline",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily (morning or evening)",
    "notes": "Children 6–12 yr: start 25 mg/day; titrate by 25–50 mg/week to response. Target 50–150 mg/day. Adolescents: start 50 mg/day; titrate to 50–200 mg/day. Adults: 50–200 mg/day. Therapeutic effect typically 4–8 weeks. Taper slowly on discontinuation (withdrawal syndrome) • Children 6–12 yr: start 25 mg/day; titrate by 25 mg/week to 50–150 mg/day. Adolescents: start 50 mg/day; titrate to 50–200 mg/day. Oral concentrate: 20 mg/mL — dilute 1:1 with water/OJ/juice before giving. Therapeutic effect: 4–8 weeks. Taper on discontinuation",
    "maxDose": "200 mg/day",
    "unit": "mg/day",
    "perKg": false,
    "value": 25
   }
  ],
  "indications": [
   "Major depressive disorder (≥6 years)",
   "Obsessive-compulsive disorder (OCD) — ≥6 years",
   "Post-traumatic stress disorder (PTSD)",
   "Anxiety disorders (generalised, social, panic)",
   "OCD (≥6 years)",
   "PTSD",
   "Anxiety disorders (social anxiety, GAD, panic disorder)"
  ],
  "contraindications": [
   "Concurrent MAOIs (within 14 days)",
   "Concurrent pimozide",
   "Known hypersensitivity to sertraline",
   "Concurrent thioridazine",
   "Known hypersensitivity"
  ],
  "formulations": [
   "25 mg tablet",
   "50 mg tablet",
   "100 mg tablet",
   "20 mg/mL oral concentrate (must be diluted before use)"
  ],
  "monitoring": [
   "Mood and behaviour (especially first 4–8 weeks — FDA Black Box: suicidal ideation in <25 yr)",
   "Activation/agitation (serotonin-related)",
   "GI tolerance",
   "Serum sodium (SIADH risk)",
   "Drug interactions (SSRI + triptans, tramadol, linezolid — serotonin syndrome)",
   "Mood and behaviour — suicidal ideation (Black Box Warning < 25 yr)",
   "Activation/agitation (early)",
   "Serum sodium (SIADH)",
   "Serotonin syndrome signs"
  ],
  "notes": "Formulary class: Selective Serotonin Reuptake Inhibitor (SSRI). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | FDA SSRI Paediatric Guidelines"
 },
 {
  "id": "fx-sildenafil",
  "name": "Sildenafil",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "3 times daily (every 8 hours)",
    "notes": "PAH: 0.25–0.5 mg/kg/dose TID (max 20 mg TID — higher doses may increase mortality per STARTS-2). Some centres use 1 mg/kg/dose TID in infants off-label. Adults/adolescents: 5–20 mg TID. Adjust in hepatic impairment. Oral solution available for younger children • PAH: 0.25–0.5 mg/kg/dose TID (max 20 mg TID; higher doses may increase mortality per STARTS-2 trial). Infants (off-label): 0.5–1 mg/kg/dose TID. Oral suspension: 10 mg/mL. Adjust in hepatic impairment. Monitor for systemic hypotension",
    "maxDose": "20 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 0.5,
    "adultMaxDose_num": 20
   }
  ],
  "indications": [
   "Pulmonary arterial hypertension (PAH)",
   "Persistent pulmonary hypertension of the newborn (PPHN — off-label)",
   "Fontan-associated protein-losing enteropathy (off-label)",
   "Fontan-associated complications"
  ],
  "contraindications": [
   "Concurrent nitrates or nitric oxide donors (profound hypotension)",
   "Concurrent riociguat (additive hypotension)",
   "Severe hepatic impairment",
   "Recent MI or stroke (<6 months)",
   "Severe hypotension (BP <90/50 mmHg)",
   "Concurrent riociguat",
   "Severe hypotension"
  ],
  "formulations": [
   "20 mg tablet",
   "25 mg tablet",
   "50 mg tablet",
   "100 mg tablet",
   "10 mg/mL oral suspension"
  ],
  "monitoring": [
   "Blood pressure (systemic hypotension)",
   "Oxygen saturation",
   "6-minute walk distance / exercise tolerance",
   "ECG",
   "Hepatic function",
   "Vision changes (NAION — non-arteritic anterior ischaemic optic neuropathy)",
   "Blood pressure (systemic hypotension — especially concurrent antihypertensives)",
   "Oxygen saturation and pulmonary haemodynamics",
   "Vision changes"
  ],
  "notes": "Formulary class: Phosphodiesterase-5 (PDE5) Inhibitor — Pulmonary Vasodilator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | STARTS-2 Trial"
 },
 {
  "id": "fx-sodium-valproate",
  "name": "Sodium Valproate",
  "genericName": "Valproic acid / Valproate semisodium",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral, divided BID–TID",
    "frequency": "Every 8–12 hours (titrate slowly)",
    "notes": "Start 10–15 mg/kg/day; increase 5–10 mg/kg/week to maintenance 30–60 mg/kg/day div BID-TID. Therapeutic range: 50–100 mg/L (free: 5–15 mg/L). Extended-release can be given once or twice daily. Must be swallowed whole (not crushed — enteric coated) • Start 10–15 mg/kg/day; increase 5–10 mg/kg/week. Maintenance 30–60 mg/kg/day div BID-TID. Therapeutic range: 50–100 mg/L. Syrup 200 mg/5 mL. Oral solution can be mixed with juice. Avoid antacids (reduce absorption)",
    "maxDose": "3000 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 60,
    "adultMaxDose_num": 3000
   }
  ],
  "indications": [
   "Generalised epilepsy (tonic-clonic, absence, myoclonic)",
   "Focal seizures (adjunctive)",
   "Lennox-Gastaut syndrome",
   "Migraine prophylaxis",
   "Bipolar disorder (mood stabiliser)",
   "Generalised epilepsy (tonic-clonic, absence, myoclonic) — young children",
   "Infantile spasms (adjunct)"
  ],
  "contraindications": [
   "Hepatic disease or hepatic dysfunction",
   "Urea cycle disorders (life-threatening hyperammonaemia)",
   "Known mitochondrial disease (especially POLG mutations)",
   "Pregnancy — high teratogenicity (neural tube defects, neurodevelopmental delay)",
   "Known hypersensitivity",
   "Age < 2 years (highest hepatotoxicity risk)",
   "Hepatic disease",
   "Urea cycle disorders (hyperammonaemia)",
   "POLG mutations (mitochondrial disease)",
   "Pregnancy (teratogenic — spina bifida, neurodevelopmental delay)",
   "Age < 2 yr (highest hepatotoxicity risk — avoid if possible)"
  ],
  "formulations": [
   "200 mg e/c tablet",
   "500 mg e/c tablet",
   "500 mg MR (modified-release) tablet",
   "Enteric-coated chrono formulations",
   "200 mg/5 mL syrup (40 mg/mL)"
  ],
  "monitoring": [
   "Serum valproate levels (trough, target 50–100 mg/L)",
   "LFTs and ammonia (especially in first 6 months, high hepatotoxicity risk in young children)",
   "CBC with platelets (thrombocytopenia)",
   "Coagulation (fibrinogen)",
   "Weight (weight gain)",
   "Ammonia if encephalopathy suspected",
   "Serum valproate levels (target 50–100 mg/L)",
   "LFTs and ammonia (especially first 6 months)",
   "CBC + platelets (thrombocytopenia)",
   "Weight"
  ],
  "notes": "Formulary class: Anticonvulsant — Broad Spectrum (Multiple mechanisms: Na⁺ channel, GABA potentiation, T-type Ca²⁺ channel). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | MHRA Warnings"
 },
 {
  "id": "fx-spironolactone",
  "name": "Spironolactone",
  "category": "diuretic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "Children: 1–3 mg/kg/day div BID (max 100 mg/day). Adults: 25–200 mg/day. Take with food. May combine with loop diuretic for additive natriuresis while potassium-sparing effect counteracts loop diuretic hypokalaemia Per-dose amount calculated from 1–3 mg/kg/day divided by 2 (Every 12 hours). • Children: 1–3 mg/kg/day div BID (max 100 mg/day). Extemporaneous suspension 5 mg/mL or 25 mg/5 mL. Stable 4 weeks refrigerated. Take with food to improve absorption (lipophilic). Monitor K⁺ and creatinine closely Per-dose amount calculated from 1–3 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "100 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1.5
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours",
    "notes": "Children: 1–3 mg/kg/day div BID (max 100 mg/day). Adults: 25–200 mg/day. Take with food. May combine with loop diuretic for additive natriuresis while potassium-sparing effect counteracts loop diuretic hypokalaemia • Children: 1–3 mg/kg/day div BID (max 100 mg/day). Extemporaneous suspension 5 mg/mL or 25 mg/5 mL. Stable 4 weeks refrigerated. Take with food to improve absorption (lipophilic). Monitor K⁺ and creatinine closely",
    "maxDose": "100 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 3,
    "adultMaxDose_num": 100
   }
  ],
  "indications": [
   "Oedema (cardiac, hepatic, renal — adjunct)",
   "Heart failure (with ACE inhibitor/ARB)",
   "Hyperaldosteronism (primary or secondary)",
   "Hypertension (resistant)",
   "Acne (adolescent females — anti-androgenic — off-label)",
   "Oedema (cardiac, hepatic) — young children unable to swallow tablets",
   "Heart failure (systolic dysfunction)",
   "Hyperaldosteronism"
  ],
  "contraindications": [
   "Hyperkalaemia (K⁺ > 5.5 mmol/L)",
   "Addison's disease",
   "Severe renal impairment (risk of hyperkalaemia)",
   "Anuria",
   "Concurrent potassium supplements or potassium-sparing diuretics",
   "Severe renal impairment"
  ],
  "formulations": [
   "25 mg tablet",
   "50 mg tablet",
   "100 mg tablet",
   "5 mg/mL extemporaneous suspension (25 mg/5 mL)"
  ],
  "monitoring": [
   "Serum potassium (hyperkalaemia — check at 1 week, 1 month, then quarterly)",
   "Serum creatinine/GFR",
   "Blood pressure",
   "Signs of anti-androgenic effects (gynaecomastia, menstrual irregularity)",
   "Electrolytes and fluid balance",
   "Serum potassium (hyperkalaemia — check at 1 week, 1 month)",
   "Signs of anti-androgenic effects"
  ],
  "notes": "Formulary class: Potassium-Sparing Diuretic (Aldosterone Antagonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-topiramate",
  "name": "Topiramate",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours (titrate very slowly)",
    "notes": "Epilepsy: start 0.5–1 mg/kg/day week 1, increase 0.5–1 mg/kg/week to 5–9 mg/kg/day div BID. Adults: start 25 mg HS week 1, titrate by 25–50 mg/week to 100–400 mg/day div BID. Migraine prophylaxis: 50–100 mg/day (adult). Swallow whole or sprinkle capsule contents on food Per-dose amount calculated from 1–9 mg/kg/day divided by 2 (Every 12 hours (titrate very slowly)).",
    "maxDose": "400 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 4.5
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours (titrate very slowly)",
    "notes": "Epilepsy: start 0.5–1 mg/kg/day week 1, increase 0.5–1 mg/kg/week to 5–9 mg/kg/day div BID. Adults: start 25 mg HS week 1, titrate by 25–50 mg/week to 100–400 mg/day div BID. Migraine prophylaxis: 50–100 mg/day (adult). Swallow whole or sprinkle capsule contents on food",
    "maxDose": "400 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 9,
    "adultMaxDose_num": 400
   },
   {
    "route": "Oral, divided BID (titrate very slowly)",
    "frequency": "Every 12 hours",
    "notes": "Start 0.5–1 mg/kg/day week 1; increase 0.5–1 mg/kg/week to target 5–9 mg/kg/day div BID. Sprinkle capsule: open and sprinkle on soft food (1 tsp applesauce) — do NOT chew granules. Swallow immediately without chewing. Reduce dose in renal impairment Per-dose amount calculated from 1–9 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "400 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 4.5
   },
   {
    "route": "Oral, divided BID (titrate very slowly)",
    "frequency": "Every 12 hours",
    "notes": "Start 0.5–1 mg/kg/day week 1; increase 0.5–1 mg/kg/week to target 5–9 mg/kg/day div BID. Sprinkle capsule: open and sprinkle on soft food (1 tsp applesauce) — do NOT chew granules. Swallow immediately without chewing. Reduce dose in renal impairment",
    "maxDose": "400 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 9,
    "adultMaxDose_num": 400
   }
  ],
  "indications": [
   "Focal and generalised tonic-clonic seizures (adjunctive and monotherapy)",
   "Lennox-Gastaut syndrome (adjunctive)",
   "Migraine prophylaxis (≥12 years)",
   "Infantile spasms (adjunctive)",
   "PCOS-associated obesity (off-label)",
   "Focal and generalised seizures (adjunctive — young children)",
   "Migraine prophylaxis"
  ],
  "contraindications": [
   "Metabolic acidosis with concurrent metformin (additive risk)",
   "Concomitant valproate (encephalopathy risk, especially hyperammonaemia)",
   "History of kidney stones (relative — carbonic anhydrase inhibition increases risk)",
   "Known hypersensitivity",
   "Concurrent metformin with metabolic acidosis (additive)",
   "Concurrent valproate (encephalopathy/hyperammonaemia risk)",
   "History of kidney stones (relative)"
  ],
  "formulations": [
   "25 mg tablet",
   "50 mg tablet",
   "100 mg tablet",
   "200 mg tablet",
   "Sprinkle capsules",
   "15 mg sprinkle capsule",
   "25 mg sprinkle capsule (sprinkle on food for administration)"
  ],
  "monitoring": [
   "Cognition/language assessment (word-finding difficulties — most debilitating side effect)",
   "Weight (appetite suppression — weight loss)",
   "Serum bicarbonate (metabolic acidosis)",
   "Serum creatinine and urinalysis (nephrolithiasis risk)",
   "Temperature regulation (anhidrosis — hyperthermia in hot environments, esp. children)",
   "Intraocular pressure (acute angle-closure glaucoma — rare, early — discontinue immediately)",
   "Cognition/language assessment (word-finding difficulties)",
   "Weight (anorexia — weight loss)",
   "Urinalysis/creatinine (nephrolithiasis)",
   "Temperature regulation (anhidrosis in children)",
   "Intraocular pressure"
  ],
  "notes": "Formulary class: Anticonvulsant — Multiple Mechanisms (Na⁺ channel, AMPA/kainate, GABA-A potentiation, carbonic anhydrase inhibition). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-trimethoprim",
  "name": "Trimethoprim",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours × 7–14 days",
    "notes": "UTI treatment: 4–6 mg/kg/day div BID × 7–14 days (max 200 mg/day). UTI prophylaxis: 2 mg/kg/day once daily at night (max 100 mg/day). Adults: 100 mg BID or 200 mg once daily. Adjust dose if GFR < 30 mL/min Per-dose amount calculated from 4–6 mg/kg/day divided by 2 (Every 12 hours × 7–14 days). • UTI treatment: 4–6 mg/kg/day div BID × 7 days (max 200 mg/day). Prophylaxis: 2 mg/kg/day OD at night (max 100 mg). Suspension: 50 mg/5 mL (10 mg/mL). Shake well. Give with food if GI upset Per-dose amount calculated from 4–6 mg/kg/day divided by 2 (Every 12 hours × 7–14 days (treatment)).",
    "maxDose": "200 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 2,
    "max": 3
   },
   {
    "route": "Oral, divided BID",
    "frequency": "Every 12 hours × 7–14 days",
    "notes": "UTI treatment: 4–6 mg/kg/day div BID × 7–14 days (max 200 mg/day). UTI prophylaxis: 2 mg/kg/day once daily at night (max 100 mg/day). Adults: 100 mg BID or 200 mg once daily. Adjust dose if GFR < 30 mL/min • UTI treatment: 4–6 mg/kg/day div BID × 7 days (max 200 mg/day). Prophylaxis: 2 mg/kg/day OD at night (max 100 mg). Suspension: 50 mg/5 mL (10 mg/mL). Shake well. Give with food if GI upset",
    "maxDose": "200 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 4,
    "max": 6,
    "adultMaxDose_num": 200
   }
  ],
  "indications": [
   "Urinary tract infections (uncomplicated)",
   "UTI prophylaxis (recurrent infections)",
   "Pneumocystis jirovecii prophylaxis (alternative — without sulfonamide component)",
   "UTI prophylaxis in young children",
   "PCP prophylaxis (alternative without sulfonamide)"
  ],
  "contraindications": [
   "Known hypersensitivity to trimethoprim",
   "Megaloblastic anaemia due to folate deficiency",
   "Severe renal impairment (dose adjust or avoid)",
   "Pregnancy (folate antagonism — avoid 1st trimester)",
   "Trimethoprim hypersensitivity",
   "Megaloblastic anaemia (folate deficiency)",
   "Severe renal impairment",
   "Pregnancy (1st trimester — folate antagonism)"
  ],
  "formulations": [
   "100 mg tablet",
   "200 mg tablet",
   "50 mg/5 mL oral suspension (10 mg/mL)"
  ],
  "monitoring": [
   "Serum creatinine (TMP blocks creatinine tubular secretion — apparent creatinine rise not true GFR decline)",
   "Serum potassium (blocks K⁺ secretion — hyperkalaemia risk, especially with ACE inhibitors/ARBs)",
   "CBC (folate antagonism — neutropenia)",
   "Urine culture at end of treatment",
   "Serum creatinine (spurious rise — TMP blocks tubular creatinine secretion)",
   "Serum K⁺ (hyperkalaemia)",
   "CBC (folate antagonism)",
   "Urine culture (end-of-treatment)"
  ],
  "notes": "Formulary class: Dihydrofolate Reductase Inhibitor — Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-acetylcysteine",
  "name": "Acetylcysteine",
  "genericName": "N-Acetylcysteine (NAC)",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "3 times daily (mucolytic)",
    "notes": "Mucolytic: 2–6 yr: 100 mg BID-TID; >6 yr: 200 mg TID. Paracetamol OD oral protocol (if IV unavailable): 140 mg/kg loading, then 70 mg/kg q4h × 17 doses. Dilute solution in juice/cola to mask taste",
    "maxDose": "600 mg/day",
    "unit": "mg/dose",
    "perKg": false,
    "value": 200
   }
  ],
  "indications": [
   "Mucolytic: viscous secretions in bronchiectasis, cystic fibrosis, bronchitis",
   "Paracetamol overdose antidote (oral protocol)",
   "Prevention of contrast-induced nephropathy (adjunct)"
  ],
  "contraindications": [
   "Known hypersensitivity to acetylcysteine",
   "Oral mucolytic use in acute asthma (may trigger bronchospasm — nebulised form more applicable)",
   "Active peptic ulceration (oral — caution)"
  ],
  "formulations": [
   "200 mg/5 mL oral solution (40 mg/mL)",
   "600 mg effervescent tablet (dissolved)"
  ],
  "monitoring": [
   "Respiratory function (mucolytic use)",
   "Liver function and paracetamol levels (overdose management)",
   "Signs of anaphylactoid reaction (IV use more common)",
   "GI tolerance"
  ],
  "notes": "Formulary class: Mucolytic / Antidote (Paracetamol overdose) / Antioxidant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-chlorphenamine",
  "name": "Chlorphenamine",
  "genericName": "Chlorpheniramine maleate",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral, divided q4–6h",
    "frequency": "Every 4–6 hours PRN",
    "notes": "Children 2–5 yr: 1 mg q4–6h (max 6 mg/day). 6–11 yr: 2 mg q4–6h (max 12 mg/day). ≥12 yr: 4 mg q4–6h (max 24 mg/day). 0.35 mg/kg/day div q4–6h — use weight-based in smaller children. Sedating — use lowest effective dose",
    "maxDose": "12 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.35,
    "adultMaxDose_num": 12
   }
  ],
  "indications": [
   "Allergic rhinitis",
   "Urticaria and pruritus",
   "Anaphylaxis (adjunct — after epinephrine)",
   "Drug/food allergic reactions",
   "Hay fever"
  ],
  "contraindications": [
   "Age < 2 years (relative — sedation/paradoxical excitation risk)",
   "Narrow-angle glaucoma",
   "Urinary retention/BPH",
   "Concurrent MAOIs"
  ],
  "formulations": [
   "2 mg/5 mL syrup (0.4 mg/mL)"
  ],
  "monitoring": [
   "Sedation level (especially in young children)",
   "Paradoxical CNS excitation",
   "Urinary retention",
   "Anticholinergic symptoms"
  ],
  "notes": "Formulary class: First-Generation Antihistamine (H1 Receptor Antagonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-ferrous-sulfate",
  "name": "Ferrous Sulfate",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral, divided TID (fasting ideally)",
    "frequency": "2–3 times daily",
    "notes": "Treatment: 3–6 mg elemental iron/kg/day div TID (max 200 mg elemental iron/day). Prophylaxis (premature): 2 mg/kg/day once daily. 1 mL of 25 mg/mL elemental iron syrup. Ferrous sulfate 300 mg = 60 mg elemental iron. Take 1 hour before food or 2 hours after for best absorption (vitamin C enhances). Stools will turn black (harmless)",
    "maxDose": "200 mg elemental iron/day",
    "unit": "mg elemental iron/kg/day",
    "perKg": true,
    "min": 3,
    "max": 6,
    "adultMaxDose_num": 200
   }
  ],
  "indications": [
   "Iron deficiency anaemia (treatment)",
   "Iron deficiency without anaemia (supplementation)",
   "Prevention of iron deficiency in premature infants",
   "Dietary iron supplementation"
  ],
  "contraindications": [
   "Haemochromatosis or haemosiderosis",
   "Haemolytic anaemia (unless concurrent iron deficiency)",
   "Known hypersensitivity to iron salts",
   "Concurrent antacids (reduce iron absorption)"
  ],
  "formulations": [
   "Ferrous sulfate 150 mg/5 mL syrup (= 30 mg elemental iron/5 mL)",
   "Ferrous gluconate/fumarate formulations also available"
  ],
  "monitoring": [
   "Haemoglobin and MCV at 4 weeks (reticulocyte response within 7–10 days)",
   "Serum ferritin (repletion target > 30 mcg/L)",
   "Stool colour (black — expected)",
   "GI tolerance"
  ],
  "notes": "Formulary class: Iron Salt / Haematinic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | WHO Anaemia Guidelines"
 },
 {
  "id": "fx-flucloxacillin",
  "name": "Flucloxacillin",
  "genericName": "Flucloxacillin sodium oral solution",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral, 30 min before food, q6h",
    "frequency": "Every 6 hours (QID)",
    "notes": "Standard: 12.5–25 mg/kg/dose QID (max 500 mg/dose). Serious infections: 25 mg/kg/dose QID. Must be taken on an EMPTY STOMACH (30 min before meals) — food significantly reduces absorption. Duration: 7–21 days depending on site",
    "maxDose": "500 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 12.5,
    "max": 25,
    "adultMaxDose_num": 500
   }
  ],
  "indications": [
   "Staphylococcal infections (MSSA) — skin, soft tissue, bone, cellulitis",
   "Impetigo",
   "Osteomyelitis (step-down therapy)",
   "Septic arthritis (MSSA, step-down)"
  ],
  "contraindications": [
   "Penicillin allergy (hypersensitivity)",
   "Flucloxacillin-associated jaundice/hepatitis history"
  ],
  "formulations": [
   "125 mg/5 mL oral solution (25 mg/mL)"
  ],
  "monitoring": [
   "Clinical response at 48–72 hours",
   "LFTs (cholestatic hepatitis — rare, more with IV form)",
   "Signs of allergic reaction"
  ],
  "notes": "Formulary class: Beta-lactam Antibiotic — Antistaphylococcal Penicillin (Isoxazolyl penicillin). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | BNF for Children"
 },
 {
  "id": "fx-lactulose",
  "name": "Lactulose",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral, divided BID–TID",
    "frequency": "BID–TID (titrate to response)",
    "notes": "Constipation: 1–3 mL/kg/day div BID-TID; titrate to achieve 2–3 soft stools/day. Hepatic encephalopathy (adults): 30–45 mL q6–8h to produce 2–3 soft stools/day. Onset: 24–48 hours. Can dilute in fruit juice or water to improve palatability Per-dose amount calculated from 1–3 mL/kg/day divided by 2 (BID–TID (titrate to response)).",
    "maxDose": "60 mL/day",
    "unit": "mL/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1.5
   },
   {
    "route": "Oral, divided BID–TID",
    "frequency": "BID–TID (titrate to response)",
    "notes": "Constipation: 1–3 mL/kg/day div BID-TID; titrate to achieve 2–3 soft stools/day. Hepatic encephalopathy (adults): 30–45 mL q6–8h to produce 2–3 soft stools/day. Onset: 24–48 hours. Can dilute in fruit juice or water to improve palatability",
    "maxDose": "60 mL/day",
    "unit": "mL/kg/day",
    "perKg": true,
    "min": 1,
    "max": 3,
    "adultMaxDose_num": 60
   }
  ],
  "indications": [
   "Constipation (chronic and acute)",
   "Hepatic encephalopathy (reducing ammonia absorption)",
   "Constipation secondary to opioids or immobility"
  ],
  "contraindications": [
   "Galactosaemia (galactose-containing preparation)",
   "Intestinal obstruction or ileus",
   "Known hypersensitivity to lactulose",
   "Uncontrolled diabetes (caution — small amounts of free sugars)"
  ],
  "formulations": [
   "10 g/15 mL solution (667 mg/mL lactulose); dose in mL"
  ],
  "monitoring": [
   "Stool frequency and consistency (target 2–3 soft stools/day)",
   "Abdominal distension/discomfort",
   "Electrolytes (diarrhoea with high doses)",
   "Blood glucose (diabetic patients)",
   "Ammonia levels (hepatic encephalopathy)"
  ],
  "notes": "Formulary class: Osmotic Laxative / Disaccharide Laxative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-nystatin",
  "name": "Nystatin",
  "genericName": "Nystatin oral suspension",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral (swish and swallow/swish and spit)",
    "frequency": "4 times daily × 7–14 days",
    "notes": "Neonates: 100,000 units (1 mL) to each side of mouth QID. Infants: 200,000 units (2 mL) to each side QID. Children/Adults: 400,000–600,000 units QID. Swish around mouth for as long as possible before swallowing. Treat for 48 hours after symptoms resolve. 100,000 units/mL suspension",
    "maxDose": "500000 units/dose",
    "unit": "units/dose",
    "perKg": false,
    "value": 200000
   }
  ],
  "indications": [
   "Oral candidiasis (thrush)",
   "GI candidiasis (adjunct)",
   "Prevention of candidiasis in immunocompromised patients",
   "Neonatal thrush"
  ],
  "contraindications": [
   "Known hypersensitivity to nystatin",
   "Systemic fungal infections (nystatin is NOT absorbed — systemic infections require IV antifungals)"
  ],
  "formulations": [
   "100,000 units/mL oral suspension"
  ],
  "monitoring": [
   "Resolution of oral lesions (white plaques)",
   "Treatment of any fungal sources on nipples/dummies/breast (infants)",
   "Persistence despite treatment (consider fluconazole)"
  ],
  "notes": "Formulary class: Polyene Antifungal. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-promethazine",
  "name": "Promethazine",
  "genericName": "Promethazine hydrochloride syrup",
  "category": "sedative",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4–6 hours PRN (max 4 doses/day)",
    "notes": "Children ≥2 yr ONLY (Black Box Warning < 2 yr — do NOT use). 0.25–1 mg/kg/dose q4–6h PRN (max 25 mg/dose). Anti-emetic: 0.5 mg/kg. Motion sickness: 0.5 mg/kg 30 min before travel. Adults: 12.5–25 mg q4–6h. Syrup: 5 mg/5 mL (1 mg/mL)",
    "maxDose": "25 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 1,
    "adultMaxDose_num": 25
   }
  ],
  "indications": [
   "Nausea and vomiting (motion sickness, post-operative — children ≥2 yr)",
   "Allergic rhinitis/urticaria (anti-histaminic)",
   "Pre-operative sedation / anxiolysis"
  ],
  "contraindications": [
   "Age < 2 years (FDA Black Box Warning — risk of fatal respiratory depression)",
   "Comatose patients",
   "CNS depressants (additive respiratory depression)",
   "Lower respiratory tract disease (asthma, COPD)",
   "Known hypersensitivity to phenothiazines"
  ],
  "formulations": [
   "5 mg/5 mL syrup (1 mg/mL)"
  ],
  "monitoring": [
   "Respiratory rate and sedation depth (especially < 6 yr)",
   "Extrapyramidal symptoms (dystonia, akathisia)",
   "QTc interval",
   "Anticholinergic effects (urinary retention, constipation)"
  ],
  "notes": "Formulary class: First-Generation Antihistamine (Phenothiazine H1 Antagonist) — Antiemetic / Sedative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | FDA Black Box Warning"
 },
 {
  "id": "fx-senna",
  "name": "Senna",
  "genericName": "Sennoside B (Senna leaf extract)",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily at bedtime",
    "notes": "2–6 yr: 2.5–5 mg once daily. 6–12 yr: 7.5–15 mg once daily. >12 yr / adults: 15–30 mg once daily (or BID). Not weight-based for standard doses. Syrup: 7.5 mg/5 mL. Onset: 6–12 hours. Avoid long-term use (melanosis coli, dependency)",
    "maxDose": "30 mg/day",
    "unit": "mg/dose",
    "perKg": false,
    "value": 7.5
   }
  ],
  "indications": [
   "Constipation (short-term management)",
   "Opioid-induced constipation",
   "Bowel preparation before procedures"
  ],
  "contraindications": [
   "Age < 2 years (limited data)",
   "Intestinal obstruction or ileus",
   "Inflammatory bowel disease (acute)",
   "Abdominal pain of unknown cause",
   "Appendicitis",
   "Dehydration"
  ],
  "formulations": [
   "7.5 mg/5 mL syrup (1.5 mg/mL)"
  ],
  "monitoring": [
   "Stool frequency and consistency",
   "Electrolytes with prolonged use (risk of hypokalaemia)",
   "Signs of laxative dependence (chronic use)",
   "Dehydration"
  ],
  "notes": "Formulary class: Stimulant Laxative (Anthraquinone glycoside). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-ursodeoxycholic-acid",
  "name": "Ursodeoxycholic Acid",
  "genericName": "UDCA / Ursodiol",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral, divided BID–TID",
    "frequency": "BID–TID with food",
    "notes": "Cholestatic liver disease: 10–15 mg/kg/day div BID-TID. Gallstone dissolution: 8–10 mg/kg/day div BID. CF liver disease: 20 mg/kg/day div BID. Give with meals to enhance absorption. Suspension 50 mg/mL Per-dose amount calculated from 10–15 mg/kg/day divided by 2 (BID–TID with food).",
    "maxDose": "1200 mg/day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 7.5
   },
   {
    "route": "Oral, divided BID–TID",
    "frequency": "BID–TID with food",
    "notes": "Cholestatic liver disease: 10–15 mg/kg/day div BID-TID. Gallstone dissolution: 8–10 mg/kg/day div BID. CF liver disease: 20 mg/kg/day div BID. Give with meals to enhance absorption. Suspension 50 mg/mL",
    "maxDose": "1200 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 15,
    "adultMaxDose_num": 1200
   }
  ],
  "indications": [
   "Cholestatic liver disease (biliary atresia post-Kasai, neonatal cholestasis)",
   "Primary sclerosing cholangitis",
   "Intrahepatic cholestasis of pregnancy (maternal)",
   "Gallstone dissolution (cholesterol stones)",
   "Cystic fibrosis-related liver disease"
  ],
  "contraindications": [
   "Acute cholangitis",
   "Gallbladder non-function",
   "Calcified/radio-opaque gallstones (dissolution not possible)",
   "Known hypersensitivity to bile acids",
   "Inflammatory bowel disease exacerbation"
  ],
  "formulations": [
   "250 mg/5 mL suspension (50 mg/mL)"
  ],
  "monitoring": [
   "Liver function tests (ALT, AST, GGT, bilirubin) every 3–6 months",
   "Alkaline phosphatase",
   "Cholestatic symptom improvement (pruritus, jaundice)",
   "Gallstone assessment (if indicated) by imaging"
  ],
  "notes": "Formulary class: Hydrophilic Bile Acid — Hepatoprotective / Choleretic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | ESPGHAN Guidelines"
 },
 {
  "id": "fx-beclomethasone-dipropionate",
  "name": "Beclomethasone Dipropionate",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Twice daily",
    "notes": "Fixed dose — not weight-based. Review and step down at 3–6 months if controlled",
    "unit": "mcg/dose",
    "perKg": false,
    "min": 100,
    "max": 200
   }
  ],
  "indications": [
   "Persistent asthma (maintenance — step 2/3)",
   "Eosinophilic airway inflammation"
  ],
  "contraindications": [
   "Acute severe asthma (not for acute relief)",
   "Known hypersensitivity to beclomethasone"
  ],
  "formulations": [
   "Nebulising solution 50 mcg/mL, 100 mcg/mL"
  ],
  "monitoring": [
   "Growth (long-term use)",
   "Adrenal suppression signs (high prolonged doses)",
   "Oral candidiasis",
   "Spirometry/symptom control"
  ],
  "notes": "Formulary class: Inhaled Corticosteroid (ICS). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | GINA Paediatric Guidelines"
 },
 {
  "id": "fx-colistimethate-sodium",
  "name": "Colistimethate Sodium",
  "genericName": "Colistin (Polymyxin E)",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized (via approved nebuliser)",
    "frequency": "Twice daily",
    "notes": "1 MU = ~33 mg colistin base activity. Standard: 1 MU BID (<12 yr), up to 2 MU BID (≥12 yr). Always pre-treat with SABA 15 min before",
    "unit": "MU/dose",
    "perKg": false,
    "min": 1,
    "max": 2
   }
  ],
  "indications": [
   "Chronic Pseudomonas aeruginosa colonisation in cystic fibrosis",
   "MDR gram-negative pulmonary infections (adjunct)",
   "Acinetobacter pulmonary infection (adjunct)"
  ],
  "contraindications": [
   "Known hypersensitivity to polymyxins",
   "Severe bronchospasm (pre-treat with SABA first)",
   "Myasthenia gravis"
  ],
  "formulations": [
   "Vial 1 MU (reconstitute with 2–4 mL NS immediately before use)",
   "Vial 2 MU"
  ],
  "monitoring": [
   "FEV₁ and lung function (3-monthly)",
   "Sputum culture sensitivity",
   "Renal function (systemic absorption risk)",
   "Bronchospasm monitoring post-inhalation",
   "Audiometry (prolonged use — aminoglycoside co-exposure)"
  ],
  "notes": "Formulary class: Polymyxin Antibiotic (Inhaled). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Nelson's 22e | BNF for Children | CF Foundation Guidelines"
 },
 {
  "id": "fx-dornase-alfa",
  "name": "Dornase Alfa",
  "genericName": "Recombinant Human DNase (rhDNase)",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized (approved jet nebuliser only)",
    "frequency": "Once daily (some patients BID)",
    "notes": "Fixed 2.5 mg dose regardless of weight. Use PARI LC Plus or approved nebuliser. Administer 30–60 min before chest physiotherapy",
    "unit": "mg",
    "perKg": false,
    "value": 2.5
   }
  ],
  "indications": [
   "Cystic fibrosis (daily mucociliary clearance — ≥5 years)",
   "Bronchiectasis with thick secretions (off-label)",
   "Atelectasis due to mucus plugging"
  ],
  "contraindications": [
   "Known hypersensitivity to dornase alfa or Chinese hamster ovary cell proteins",
   "Children <5 years (insufficient evidence for standard use)"
  ],
  "formulations": [
   "Solution 2.5 mg/2.5 mL single-dose ampule (1 mg/mL)"
  ],
  "monitoring": [
   "Spirometry (FEV₁/FVC) at baseline then 3-monthly",
   "Sputum volume/consistency",
   "Respiratory symptoms (dyspnoea, cough)",
   "Voice changes (dysphonia)"
  ],
  "notes": "Formulary class: Mucolytic Enzyme. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | CF Foundation Evidence-Based Guidelines"
 },
 {
  "id": "fx-epinephrine-1-1000",
  "name": "Epinephrine (L-Adrenaline) 1:1000",
  "genericName": "L-Epinephrine / Adrenaline",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Single dose; may repeat every 20 min × 3 (monitor for rebound)",
    "notes": "Use 1:1000 adrenaline (= 1 mg/mL). Dose: 0.5 mL/kg of 1:1000, max 5 mL (= 5 mg). Dilute to 4–6 mL with NS. Observe minimum 2–4 hr post-dose for rebound stridor",
    "maxDose": "5 mL/dose",
    "unit": "mL/kg",
    "perKg": true,
    "value": 0.5,
    "adultMaxDose_num": 5
   }
  ],
  "indications": [
   "Croup (moderate-severe laryngotracheobronchitis)",
   "Post-extubation stridor",
   "Acute bronchiolitis (trial dose)",
   "Anaphylaxis (nebulised adjunct — not first-line, IM preferred)"
  ],
  "contraindications": [
   "Tachyarrhythmia (relative)",
   "Severe hypertension (relative)",
   "Cardiac disease with fixed output (relative)"
  ],
  "formulations": [
   "Adrenaline 1 mg/mL (1:1000) ampoules — dilute in NS to desired volume"
  ],
  "monitoring": [
   "Heart rate (tachycardia expected)",
   "Blood pressure",
   "Oxygen saturation",
   "Stridor reassessment at 30 min and 2–4 hr post-dose (rebound)",
   "Clinical severity score (Westley Croup Score)"
  ],
  "notes": "Formulary class: Sympathomimetic (Alpha + Beta Adrenergic Agonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | PALS 2025"
 },
 {
  "id": "fx-fluticasone-propionate",
  "name": "Fluticasone Propionate",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Twice daily",
    "notes": "Fixed dose — not weight-based. 4–11 yr: 50–100 mcg BID; ≥12 yr: 100–250 mcg BID. Rinse mouth after",
    "unit": "mcg/dose",
    "perKg": false,
    "min": 100,
    "max": 250
   }
  ],
  "indications": [
   "Persistent asthma (maintenance — moderate step therapy)",
   "Eosinophilic airway disease"
  ],
  "contraindications": [
   "Acute bronchospasm/status asthmaticus (not for rescue)",
   "Known hypersensitivity to fluticasone"
  ],
  "formulations": [
   "Nebules 0.5 mg/2 mL (250 mcg/mL)",
   "Nebules 2 mg/2 mL (1 mg/mL)"
  ],
  "monitoring": [
   "Growth (6-monthly in children — high potency ICS)",
   "HPA axis function (high doses)",
   "Bone density (prolonged high-dose use)",
   "Oral candidiasis",
   "Lung function (FEV₁)"
  ],
  "notes": "Formulary class: Inhaled Corticosteroid (ICS). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | GINA 2024"
 },
 {
  "id": "fx-formoterol-fumarate",
  "name": "Formoterol Fumarate",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Twice daily (always with ICS)",
    "notes": "Fixed 20 mcg dose — not weight-based. LABA must ALWAYS be co-administered with an ICS. Never use alone",
    "unit": "mcg/dose",
    "perKg": false,
    "value": 20
   }
  ],
  "indications": [
   "Add-on maintenance therapy for persistent asthma (with ICS — never monotherapy)",
   "Chronic obstructive pulmonary disease (≥18 yr)"
  ],
  "contraindications": [
   "Monotherapy without ICS (black box warning — increased asthma mortality)",
   "Acute asthma/status asthmaticus (not a rescue agent)",
   "Age <5 years (safety not established)",
   "Hypersensitivity to formoterol"
  ],
  "formulations": [
   "Unit-dose vial 20 mcg/2 mL"
  ],
  "monitoring": [
   "Heart rate (tachycardia)",
   "Blood pressure",
   "Serum potassium (hypokalemia risk — especially with systemic steroids/diuretics)",
   "Tremor",
   "Asthma control score (ensure concomitant ICS use)"
  ],
  "notes": "Formulary class: Long-Acting Beta-2 Agonist (LABA). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-levalbuterol",
  "name": "Levalbuterol",
  "genericName": "Levosalbutamol (R-Salbutamol)",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Every 20 min × 3 then every 1–4 hr PRN",
    "notes": "Minimum 1.25 mg dose; max 5 mg. Approximately 2× more potent than racemic salbutamol. Dilute to 3 mL with NS",
    "maxDose": "5 mg/dose",
    "unit": "mg/kg",
    "perKg": true,
    "value": 0.075,
    "adultMaxDose_num": 5
   }
  ],
  "indications": [
   "Acute asthma exacerbation (especially in patients at risk of tachycardia/cardiac arrhythmia)",
   "Bronchospasm",
   "Asthma where racemic salbutamol causes excessive tachycardia"
  ],
  "contraindications": [
   "Hypersensitivity to levalbuterol or salbutamol",
   "Tachyarrhythmia (relative — though levalbuterol has less cardiac effect than racemic salbutamol)"
  ],
  "formulations": [
   "Solution 0.31 mg/3 mL, 0.63 mg/3 mL, 1.25 mg/3 mL unit-dose vials"
  ],
  "monitoring": [
   "Heart rate (less tachycardia than racemic — monitor nonetheless)",
   "SpO₂",
   "Serum potassium (hypokalemia with frequent dosing)",
   "Work of breathing"
  ],
  "notes": "Formulary class: Short-Acting Beta-2 Agonist — Levorotatory Isomer (SABA). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-n-acetylcysteine",
  "name": "N-Acetylcysteine",
  "genericName": "NAC / Acetylcysteine",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "3–4 times daily",
    "notes": "Use 10% or 20% solution. 3–5 mL nebulised TID–QID. ALWAYS pre-treat with salbutamol 15 min before each dose. Use with chest physiotherapy for maximum effect",
    "unit": "mL",
    "perKg": false,
    "min": 3,
    "max": 5
   }
  ],
  "indications": [
   "Thick tenacious secretions — mucus plugging",
   "Atelectasis due to mucus retention",
   "Cystic fibrosis adjunct",
   "Pre-bronchoscopy secretion clearance",
   "Tracheostomy secretion management"
  ],
  "contraindications": [
   "Asthma or reactive airway disease WITHOUT pre-treatment bronchodilator (high risk bronchoconstriction)",
   "Known hypersensitivity to acetylcysteine",
   "Active haemoptysis (relative)"
  ],
  "formulations": [
   "Solution 10% (100 mg/mL)",
   "Solution 20% (200 mg/mL) — may dilute with NS for comfort"
  ],
  "monitoring": [
   "Bronchospasm (vital — always give SABA first)",
   "SpO₂ during nebulisation",
   "Sputum consistency/volume (therapeutic response)",
   "Nausea/vomiting (systemic absorption)",
   "Stomatitis with prolonged use"
  ],
  "notes": "Formulary class: Mucolytic Agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-racemic-epinephrine-2-25",
  "name": "Racemic Epinephrine 2.25%",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Single dose; may repeat every 20 min × 2 (observe 2–4 hr for rebound)",
    "notes": "0.05 mL/kg of 2.25% solution (min 0.25 mL, max 0.5 mL). Dilute to 3 mL with NS. Observe minimum 2–4 hr post dose for rebound stridor. L-Epinephrine 1:1000 preferred where available",
    "maxDose": "0.5 mL",
    "unit": "mL/kg",
    "perKg": true,
    "value": 0.05,
    "adultMaxDose_num": 0.5
   }
  ],
  "indications": [
   "Croup (moderate-severe — where L-epinephrine unavailable)",
   "Post-extubation stridor (primarily US-based practice)",
   "Bronchiolitis (adjunct — limited evidence)"
  ],
  "contraindications": [
   "Tachyarrhythmia",
   "Severe hypertension",
   "Where L-epinephrine (Adrenaline 1:1000) is available and preferred"
  ],
  "formulations": [
   "Racepinephrine 2.25% solution (22.5 mg/mL racemic mixture of D + L isomers)"
  ],
  "monitoring": [
   "Heart rate and rhythm",
   "Blood pressure",
   "SpO₂",
   "Stridor score at 2 and 4 hr post-dose (rebound stridor)",
   "Westley Croup Score"
  ],
  "notes": "Formulary class: Racemic Sympathomimetic (Alpha + Beta Agonist). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | PALS 2025"
 },
 {
  "id": "fx-sodium-cromoglycate",
  "name": "Sodium Cromoglycate",
  "genericName": "Cromolyn Sodium",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "4 times daily (regular maintenance); single dose 15–20 min pre-exercise",
    "notes": "Fixed dose. Full therapeutic effect requires 2–4 weeks of regular use. Not effective for acute bronchospasm",
    "unit": "mg/dose",
    "perKg": false,
    "value": 20
   }
  ],
  "indications": [
   "Prophylaxis of allergen-induced bronchoconstriction",
   "Exercise-induced bronchospasm (prophylaxis — 15–20 min pre-exercise)",
   "Mild persistent asthma (maintenance — step 2, second-line after ICS)"
  ],
  "contraindications": [
   "Acute asthma attack (not for rescue)",
   "Known hypersensitivity to sodium cromoglycate"
  ],
  "formulations": [
   "Nebuliser solution 20 mg/2 mL ampoules"
  ],
  "monitoring": [
   "Asthma symptom control diary",
   "FEV₁/PEF (spirometry at 4–6 weeks for response)",
   "Exercise tolerance (exercise-induced bronchoconstriction)"
  ],
  "notes": "Formulary class: Mast Cell Stabiliser. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Nelson's 22e | Harriet Lane 22e"
 },
 {
  "id": "fx-terbutaline-sulfate",
  "name": "Terbutaline Sulfate",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Every 4–6 hr",
    "notes": "0.1–0.3 mg/kg (max 5 mg per dose). Use 1% solution (10 mg/mL): 0.01–0.03 mL/kg. Dilute to 3 mL with NS. Effect onset 5–15 min; duration 3–6 hr",
    "maxDose": "5 mg/dose",
    "unit": "mg/kg",
    "perKg": true,
    "min": 0.1,
    "max": 0.3,
    "adultMaxDose_num": 5
   }
  ],
  "indications": [
   "Acute asthma (when salbutamol unavailable/ineffective)",
   "Bronchospasm",
   "COPD exacerbation"
  ],
  "contraindications": [
   "Hypersensitivity to terbutaline",
   "Tachyarrhythmia (relative)",
   "Hypertrophic obstructive cardiomyopathy (relative)"
  ],
  "formulations": [
   "Solution 1% (10 mg/mL) for nebulisation — dilute before use",
   "Respirator solution 10 mg/mL"
  ],
  "monitoring": [
   "Heart rate (tachycardia common)",
   "SpO₂",
   "Respiratory rate/work of breathing",
   "Serum potassium (hypokalemia)",
   "Blood pressure"
  ],
  "notes": "Formulary class: Short-Acting Beta-2 Agonist (SABA). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-tobramycin",
  "name": "Tobramycin (Inhaled)",
  "genericName": "TOBI / Tobramycin Inhalation Solution",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized (PARI LC PLUS nebuliser)",
    "frequency": "Twice daily × 28 days ON, then 28 days OFF (alternating cycle)",
    "notes": "Fixed 300 mg dose regardless of weight (≥6 yr). Administer over approximately 15 min. Administer bronchodilator first. Off-cycle allows microbiome recovery and reduces resistance",
    "unit": "mg/dose",
    "perKg": false,
    "value": 300
   }
  ],
  "indications": [
   "Chronic Pseudomonas aeruginosa lung infection in cystic fibrosis (≥6 yr)",
   "Suppressive antibiotic therapy for Pseudomonas in non-CF bronchiectasis (specialist use)"
  ],
  "contraindications": [
   "Age <6 years (insufficient safety data for standard indication)",
   "Known hypersensitivity to tobramycin or aminoglycosides",
   "Renal failure or significant renal impairment (monitor for systemic absorption)",
   "Prior tobramycin-related hearing loss"
  ],
  "formulations": [
   "TOBI 300 mg/5 mL single-use ampoule",
   "TOBI Podhaler 112 mg capsule (for inhalation — DPI form)"
  ],
  "monitoring": [
   "Spirometry (FEV₁) at baseline and 3-monthly — improvement expected within 2 weeks of first cycle",
   "Sputum culture and Pseudomonas MIC",
   "Audiometry (annual — cochlear ototoxicity risk)",
   "Serum trough levels NOT routinely needed for inhaled route",
   "Renal function (if concerns about systemic absorption)"
  ],
  "notes": "Formulary class: Aminoglycoside Antibiotic (Inhaled). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e | CF Foundation Guidelines 2023"
 },
 {
  "id": "fx-aciclovir-iv",
  "name": "Aciclovir (Acyclovir) IV",
  "category": "antiviral",
  "doses": [
   {
    "route": "IV infusion over 60 min",
    "frequency": "Every 8 hr (q8h)",
    "notes": "Neonatal HSV: 20 mg/kg q8h × 14–21 days. HSV encephalitis (>3 mo): 20 mg/kg q8h × 14–21 days. Varicella immunocompromised: 10 mg/kg q8h. Infuse over MINIMUM 60 min to reduce nephrotoxicity risk. Maintain adequate hydration",
    "maxDose": "500 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 20,
    "adultMaxDose_num": 500
   }
  ],
  "indications": [
   "Neonatal HSV (disseminated/CNS/SEM disease)",
   "HSV encephalitis (>3 months)",
   "Severe varicella in immunocompromised",
   "VZV encephalitis/pneumonitis",
   "Herpes zoster (severe/immunocompromised)"
  ],
  "contraindications": [
   "Known anaphylaxis to aciclovir or valaciclovir",
   "Severe dehydration without adequate hydration (crystalluria risk)",
   "Dose adjustment in renal impairment"
  ],
  "formulations": [
   "Vial 250 mg powder for reconstitution",
   "Vial 500 mg powder for reconstitution"
  ],
  "monitoring": [
   "Renal function (BUN, creatinine) at baseline and every 48–72 hr",
   "Hydration status/urine output (crystalluria prevention — ensure UO ≥1 mL/kg/hr)",
   "Neurological status (encephalopathy, tremor — neurotoxicity in renal impairment)",
   "LFTs (mild elevation common)",
   "CBC"
  ],
  "notes": "Formulary class: Antiviral — Nucleoside Analogue. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-amikacin-iv",
  "name": "Amikacin IV",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV infusion over 30–60 min",
    "frequency": "Once daily (extended-interval dosing, q24h)",
    "notes": "Neonates: 15–20 mg/kg q24–48h (gestational age–dependent). Infants/children: 15 mg/kg q24h (extended-interval dosing preferred). Severe infections: 20–22.5 mg/kg q24h. Adjust based on AUC/MIC-guided therapeutic drug monitoring",
    "maxDose": "1500 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15,
    "adultMaxDose_num": 1500
   }
  ],
  "indications": [
   "Gram-negative sepsis (especially gentamicin-resistant or MDR organisms)",
   "Nosocomial pneumonia / VAP (gram-negative)",
   "Urinary tract infection (severe, resistant)",
   "Febrile neutropenia (with beta-lactam, for gram-negative cover)"
  ],
  "contraindications": [
   "Known hypersensitivity to aminoglycosides",
   "Myasthenia gravis (neuromuscular blockade risk)",
   "Pre-existing significant sensorineural hearing loss (relative)"
  ],
  "formulations": [
   "Vial 100 mg/2 mL (50 mg/mL)",
   "Vial 500 mg/2 mL (250 mg/mL) — dilute before use",
   "Vial 1000 mg/4 mL"
  ],
  "monitoring": [
   "Peak and trough serum levels (AUC/MIC-guided TDM: target AUC₂₄ 70–100 mg·h/L for gram-negatives)",
   "Renal function (BUN, creatinine, urine output) — at baseline and every 48–72 hr",
   "Audiometry (cochlear ototoxicity — especially prolonged courses >5–7 days)",
   "Vestibular function (dizziness, ataxia)",
   "Neuromuscular function (weakness)"
  ],
  "notes": "Formulary class: Aminoglycoside Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-benzylpenicillin-iv",
  "name": "Benzylpenicillin (Penicillin G) IV",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV infusion over 15–30 min",
    "frequency": "Divided every 4–6 hr",
    "notes": "Meningococcal/meningitis: 400,000 units/kg/day ÷ q4h. GAS/pneumococcal: 150,000–250,000 units/kg/day ÷ q4–6h. 1 MU = 600 mg benzylpenicillin. Reconstitute in water for injection, dilute in NS",
    "maxDose": "24000000 units/day",
    "unit": "units/kg/day",
    "perKg": true,
    "min": 150000,
    "max": 400000,
    "adultMaxDose_num": 24000000
   }
  ],
  "indications": [
   "Meningococcal disease (N. meningitidis) — first-line",
   "Group A Streptococcal (GAS) infections (including necrotising fasciitis)",
   "Pneumococcal meningitis (penicillin-sensitive strains)",
   "Rheumatic fever treatment/prophylaxis",
   "Congenital syphilis / Treponema pallidum"
  ],
  "contraindications": [
   "Penicillin hypersensitivity (anaphylaxis history)",
   "High-dose in severe renal impairment (electrolyte load — hypernatraemia or hyperkalaemia)"
  ],
  "formulations": [
   "Vial 600 mg (1 MU)",
   "Vial 1200 mg (2 MU)",
   "Vial 3 MU powder for reconstitution"
  ],
  "monitoring": [
   "Serum electrolytes (hypernatraemia/hyperkalaemia — high doses contain significant Na⁺/K⁺ depending on salt)",
   "Renal function",
   "CNS — seizures (rare, high doses in renal impairment)",
   "Hypersensitivity signs (rash, urticaria, anaphylaxis)"
  ],
  "notes": "Formulary class: Natural Penicillin — Beta-Lactam Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-ciprofloxacin-iv",
  "name": "Ciprofloxacin IV",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV infusion over 60 min",
    "frequency": "Every 8–12 hr",
    "notes": "Standard: 10 mg/kg q12h. Severe/CNS infections: 10 mg/kg q8h. Infuse over 60 min minimum. Paediatric use: justified for life-threatening MDR infections or when no alternative",
    "maxDose": "400 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10,
    "adultMaxDose_num": 400
   }
  ],
  "indications": [
   "Gram-negative sepsis (MDR organisms — Pseudomonas, ESBL producers)",
   "Complicated urinary tract infection (upper tract)",
   "Bone/joint infections (gram-negative — osteomyelitis)",
   "Febrile neutropenia (with beta-lactam)",
   "Typhoid fever"
  ],
  "contraindications": [
   "Age <1 year (relative — cartilage toxicity concerns in weight-bearing joints; use only when benefits outweigh risks)",
   "Known hypersensitivity to fluoroquinolones",
   "QTc prolongation / concurrent QTc-prolonging drugs (relative)",
   "Myasthenia gravis (exacerbation risk)"
  ],
  "formulations": [
   "IV solution 200 mg/100 mL (2 mg/mL)",
   "IV solution 400 mg/200 mL (2 mg/mL)"
  ],
  "monitoring": [
   "Renal function and LFTs",
   "Tendon pain (Achilles — stop if pain/swelling)",
   "CNS effects (confusion, seizures — especially with NSAIDs or CNS disease)",
   "QTc interval (ECG at baseline if risk factors)",
   "Photosensitivity precautions",
   "Glucose (dysglycaemia)"
  ],
  "notes": "Formulary class: Fluoroquinolone Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-clindamycin-iv",
  "name": "Clindamycin IV",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV infusion over 10–60 min",
    "frequency": "Divided every 6–8 hr",
    "notes": "Standard: 25–40 mg/kg/day ÷ q6–8h. Severe bone/joint infections: 40 mg/kg/day ÷ q6h. Infuse no faster than 30 mg/min. Dilute in 50–100 mL NS or D5W",
    "maxDose": "4800 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 40,
    "adultMaxDose_num": 4800
   }
  ],
  "indications": [
   "Bone and joint infections (osteomyelitis, septic arthritis — gram-positive)",
   "Necrotising soft tissue infections (adjunct for toxin suppression)",
   "MRSA skin/soft tissue infections",
   "Aspiration pneumonia and lung abscess (anaerobic cover)",
   "Pelvic inflammatory disease"
  ],
  "contraindications": [
   "Known hypersensitivity to clindamycin or lincomycin",
   "History of C. difficile colitis (relative — weigh risk/benefit)"
  ],
  "formulations": [
   "Vial 150 mg/mL concentrate for dilution (2 mL = 300 mg; 4 mL = 600 mg)"
  ],
  "monitoring": [
   "C. difficile-associated diarrhoea (CDAD) — stool for C. difficile toxin if diarrhoea",
   "LFTs (mild elevation common, hepatotoxicity rare)",
   "Clinical response (bone/joint imaging at 4–6 weeks)",
   "Neuromuscular function (rare blockade with aminoglycosides)",
   "Rash"
  ],
  "notes": "Formulary class: Lincosamide Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-famotidine-iv",
  "name": "Famotidine IV",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "IV infusion over 15–30 min",
    "frequency": "Every 8–12 hr",
    "notes": "Children: 0.25–0.5 mg/kg q8–12h (max 40 mg/dose). Neonates: 0.5 mg/kg q24h. Dilute in 5–10 mL NS; infuse over at least 15 min",
    "maxDose": "40 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 0.5,
    "adultMaxDose_num": 40
   }
  ],
  "indications": [
   "Stress ulcer prophylaxis (ICU patients)",
   "Upper GI bleeding (adjunct)",
   "GERD / peptic ulcer disease (when oral route not possible)",
   "Gastric acid hypersecretion (Zollinger-Ellison — adjunct)"
  ],
  "contraindications": [
   "Known hypersensitivity to famotidine or H₂ blockers",
   "Porphyria (relative)",
   "QTc prolongation (use with caution — monitor ECG)"
  ],
  "formulations": [
   "Injection 10 mg/mL (2 mL vial)",
   "Injection 20 mg/2 mL"
  ],
  "monitoring": [
   "Gastric pH (target >4 for stress ulcer prophylaxis)",
   "Renal function (dose adjustment in impairment)",
   "QTc interval (ECG if concurrent QTc-prolonging drugs)",
   "LFTs (rare elevation)",
   "CBC (thrombocytopenia — rare)"
  ],
  "notes": "Formulary class: H₂-Receptor Antagonist (H₂RA). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-maintenance-iv-fluids",
  "name": "Maintenance IV Fluids",
  "genericName": "Holliday-Segar Crystalloid",
  "category": "fluid",
  "doses": [
   {
    "route": "IV infusion",
    "notes": "Holliday-Segar: 4 mL/kg/hr for first 10 kg body weight",
    "unit": "mL/kg/hr",
    "perKg": true,
    "value": 4
   },
   {
    "route": "IV infusion",
    "notes": "Add 2 mL/kg/hr for each kg from 11–20 kg",
    "unit": "mL/kg/hr",
    "perKg": true,
    "value": 2
   },
   {
    "route": "IV infusion",
    "notes": "Add 1 mL/kg/hr for each kg above 20 kg. Preferred fluid: 0.9% NaCl + 5% dextrose ± KCl 20 mmol/L (per electrolytes)",
    "unit": "mL/kg/hr",
    "perKg": true,
    "value": 1
   }
  ],
  "indications": [
   "Maintenance hydration (NPO, inability to tolerate oral intake)",
   "Pre-operative and post-operative fluid maintenance",
   "Empirical maintenance when enteral route unavailable"
  ],
  "contraindications": [
   "Fluid overload states (adjust rate)",
   "Severe hyponatraemia or hypernatraemia (individualise fluid composition)",
   "Diabetic ketoacidosis (use 0.9% NaCl initially per DKA protocol)"
  ],
  "formulations": [
   "0.9% NaCl + 5% Dextrose ± KCl 20 mmol/L (standard paediatric maintenance bag)",
   "0.45% NaCl + 5% Dextrose (neonates — specialist prescription only)",
   "Lactated Ringer's (Hartmann's) — isotonic, suitable for maintenance in many settings"
  ],
  "monitoring": [
   "Daily weight (fluid balance)",
   "Urine output (target ≥1 mL/kg/hr)",
   "Serum electrolytes every 12–24 hr (Na⁺, K⁺, glucose)",
   "Fluid balance chart (input/output)",
   "Clinical signs of over- or under-hydration",
   "Blood glucose (dextrose-containing fluids in neonates)"
  ],
  "notes": "Formulary class: Crystalloid Fluid / Electrolyte Replacement. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e — Holliday-Segar method | Nelson's 22e"
 },
 {
  "id": "fx-mannitol-iv",
  "name": "Mannitol IV",
  "category": "diuretic",
  "doses": [
   {
    "route": "IV infusion over 15–30 min",
    "frequency": "Every 4–6 hr PRN (ICP monitoring guided)",
    "notes": "ICP reduction: 0.25–1 g/kg over 15–30 min (max 1.5 g/kg). Onset 10–20 min, peak 30–60 min, duration 4–6 hr. Use 15–20% mannitol solution. Administer via filter (150 micron) to prevent crystal embolism. Maintain serum osmolality <320 mOsm/kg",
    "maxDose": "100 g/dose",
    "unit": "g/kg",
    "perKg": true,
    "min": 0.25,
    "max": 1,
    "adultMaxDose_num": 100
   }
  ],
  "indications": [
   "Raised intracranial pressure (ICP) — cerebral oedema (traumatic, ischaemic)",
   "Impending cerebral herniation (emergency reduction of ICP)",
   "Acute angle-closure glaucoma (emergency)",
   "Oliguric acute kidney injury (attempt to convert to non-oliguric — limited evidence)"
  ],
  "contraindications": [
   "Serum osmolality >320 mOsm/kg (risk of renal failure)",
   "Anuria (no benefit — crystallises in tubules)",
   "Congestive cardiac failure (fluid shifts may worsen oedema initially)",
   "Active intracranial haemorrhage (relative — rebound ICP on discontinuation)",
   "Hypovolaemia (correct first before mannitol)"
  ],
  "formulations": [
   "Mannitol 20% solution (200 mg/mL — 100 mL, 250 mL, 500 mL bottles)",
   "Mannitol 15% solution (150 mg/mL)",
   "Administer via IV filter — mannitol can crystallise"
  ],
  "monitoring": [
   "Serum osmolality (target <320 mOsm/kg — check every 4–6 hr during treatment; hold if >320)",
   "Serum Na⁺ (mannitol causes transient hyponatraemia then hypernatraemia with diuresis)",
   "Urine output and fluid balance (osmotic diuresis expected — replace losses)",
   "ICP monitoring (neurological observation — GCS, pupils, vital signs)",
   "Renal function (creatinine) — mannitol nephrotoxicity with high doses/pre-existing renal disease"
  ],
  "notes": "Formulary class: Osmotic Diuretic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-metronidazole-iv",
  "name": "Metronidazole IV",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV infusion over 30–60 min",
    "frequency": "Every 6–8 hr",
    "notes": "Standard: 7.5 mg/kg q6–8h (= 30 mg/kg/day, max 2 g/day). Loading dose: 15 mg/kg (max 1000 mg) then 7.5 mg/kg q6–8h (severe anaerobic infections). Infuse over 30–60 min. Avoid disulfiram reaction: no alcohol",
    "maxDose": "500 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 7.5,
    "adultMaxDose_num": 500
   }
  ],
  "indications": [
   "Anaerobic infections (intra-abdominal, pelvic, CNS)",
   "Clostridioides difficile colitis — severe/fulminant (IV when PO/PR not feasible)",
   "Surgical prophylaxis (colonic surgery)",
   "H. pylori eradication (adjunct — prefer PO when possible)",
   "Aspiration pneumonia / lung abscess (anaerobic cover)"
  ],
  "contraindications": [
   "Known hypersensitivity to metronidazole or nitroimidazoles",
   "First trimester of pregnancy (relative — teratogenic in animal models)",
   "Alcohol consumption within 48 hr (disulfiram-like reaction)",
   "Concurrent warfarin (increases INR — monitor closely)"
  ],
  "formulations": [
   "Metronidazole 5 mg/mL solution for infusion (100 mL = 500 mg; 200 mL = 1 g bags — ready to use)"
  ],
  "monitoring": [
   "Peripheral neuropathy symptoms (tingling, paraesthesia — prolonged use >10 days)",
   "Seizures (high doses in patients with CNS pathology)",
   "LFTs (hepatotoxicity — rare but hepatic dosing adjustment needed)",
   "C. difficile response (repeat toxin assay after 5–7 days if used for CDI)",
   "INR if concurrent warfarin (significant interaction)",
   "Nausea/metallic taste (very common)"
  ],
  "notes": "Formulary class: Nitroimidazole Antibiotic / Antiprotozoal. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-n-acetylcysteine-iv",
  "name": "N-Acetylcysteine (NAC) IV",
  "genericName": "Acetylcysteine IV",
  "category": "antidote",
  "doses": [
   {
    "route": "IV infusion — 3-bag regimen",
    "frequency": "Bag 1 over 1 hr → Bag 2 over 4 hr → Bag 3 over 16 hr",
    "notes": "3-BAG REGIMEN (total 300 mg/kg over 21 hr): Bag 1: 150 mg/kg in 3 mL/kg of 5% Dextrose over 1 hr. Bag 2: 50 mg/kg in 7 mL/kg 5% Dextrose over 4 hr. Bag 3: 100 mg/kg in 14 mL/kg 5% Dextrose over 16 hr. Anaphylactoid reactions most common with Bag 1 (rapid infusion) — slow rate or pause briefly; antihistamine if needed",
    "maxDose": "15000 mg total (capped at 110 kg for dosing)",
    "unit": "mg/kg",
    "perKg": true,
    "value": 150,
    "adultMaxDose_num": 15000
   }
  ],
  "indications": [
   "Paracetamol (acetaminophen) overdose — antidote (most important indication)",
   "Acute liver failure (adjunct — mechanism independent of paracetamol)",
   "Prevention of contrast-induced nephropathy (limited evidence, adjunct)",
   "Hepatic veno-occlusive disease (adjunct)"
  ],
  "contraindications": [
   "Known anaphylaxis to acetylcysteine (rare — manage with antihistamine/adrenaline and slow rate, benefits usually outweigh risks in paracetamol OD)",
   "Caution in asthma (may trigger bronchospasm — pre-treat with antihistamine)"
  ],
  "formulations": [
   "NAC 200 mg/mL concentrate (20% solution — 10 mL ampoule = 2000 mg; 25 mL = 5000 mg)"
  ],
  "monitoring": [
   "LFTs (ALT, AST, ALP, bilirubin) at baseline and 4-hourly in acute OD",
   "PT/INR (coagulopathy — marker of hepatic synthetic function)",
   "Serum paracetamol levels (at 4 hr post-ingestion — plot on Rumack-Matthew nomogram)",
   "Renal function (creatinine, UO)",
   "Clinical signs of hepatic encephalopathy",
   "Anaphylactoid reaction signs (flushing, urticaria, bronchospasm, hypotension — monitor closely in first 30 min)"
  ],
  "notes": "Formulary class: Antidote — Glutathione Precursor / Hepatoprotective. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Toxicology Guidelines | RCEM / AACT Practice Guidelines"
 },
 {
  "id": "fx-omeprazole-iv",
  "name": "Omeprazole IV",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "IV infusion over 20–30 min",
    "frequency": "Every 12–24 hr",
    "notes": "Children >1 yr: 0.5–1 mg/kg q12–24h (max 40 mg/dose). Neonates: 0.5 mg/kg q24h. GI bleeding: higher doses (1–3.5 mg/kg/day). Reconstitute 40 mg vial in 10 mL WFI; dilute in 50–100 mL NS; infuse over 20–30 min",
    "maxDose": "40 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1,
    "adultMaxDose_num": 40
   }
  ],
  "indications": [
   "Stress ulcer prophylaxis (ICU — mechanically ventilated patients, coagulopathy)",
   "Upper GI bleeding treatment (acute peptic ulcer, erosive gastritis)",
   "GERD / oesophagitis (when oral route not possible)",
   "Zollinger-Ellison syndrome (hypersecretory state)"
  ],
  "contraindications": [
   "Known hypersensitivity to omeprazole or substituted benzimidazoles",
   "Concurrent atazanavir or nelfinavir (PPIs significantly reduce antiretroviral absorption)",
   "Hypomagnesaemia (prior to correction — PPIs worsen Mg²⁺ depletion)"
  ],
  "formulations": [
   "Vial 40 mg powder for reconstitution"
  ],
  "monitoring": [
   "Gastric pH (target >4 for stress ulcer prophylaxis)",
   "Serum magnesium (hypomagnesaemia with prolonged use >3 months)",
   "LFTs (rare hepatotoxicity)",
   "Drug interactions (CYP2C19 — warfarin, clopidogrel, phenytoin, methotrexate)",
   "C. difficile risk (acid suppression increases susceptibility)",
   "Fundal gland polyps (long-term endoscopic follow-up)"
  ],
  "notes": "Formulary class: Proton Pump Inhibitor (PPI). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 22e | Nelson's 22e"
 },
 {
  "id": "fx-acetazolamide",
  "name": "Acetazolamide",
  "category": "diuretic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "5 mg/kg/dose once daily or every other day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "8–30 mg/kg/24 hr ÷ Q6–8 hr; max. dose: 1000 mg/24 hr IM/",
    "maxDose": "1000 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 8,
    "max": 30
   },
   {
    "route": "IV",
    "frequency": "Every 6 hours",
    "notes": "20–40 mg/kg/24 hr ÷ Q6 hr; max. dose: 1000 mg/24 hr Per-dose amount calculated from 20–40 mg/kg/day divided by 4 (Every 6 hours).",
    "maxDose": "1000 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 10
   },
   {
    "route": "IV",
    "frequency": "Every 6 hours",
    "notes": "20–40 mg/kg/24 hr ÷ Q6 hr; max. dose: 1000 mg/24 hr",
    "maxDose": "1000 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 20,
    "max": 40
   }
  ],
  "indications": [
   "Diuretic",
   "Urine alkalization"
  ],
  "contraindications": [
   "hepatic failure, severe renal failure (GFR <10 mL/min), and hypersensitivity to sulfonamides"
  ],
  "formulations": [
   "Tabs: 125, 250 mg",
   "Oral suspension: 25 mg/mL Capsules (extended release): 500 mg Injection (sodium): 500 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Carbonic anhydrase inhibitor, diuretic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-adapalene-benzoyl-peroxide",
  "name": "Adapalene / Benzoyl Peroxide",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Apply a thin film of cream, gel, or lotion to affected areas of cleansed and dried skin QHS. Limited data in children 7 to ≤ 12 yr Adapalene and benzoyl peroxide (see remarks): Apply a thin film to affected areas of cleansed and dried skin once daily. Continued",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with a history of benzoyl peroxide hypersensitivity reactions"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: topical acne product. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-allopurinol",
  "name": "Allopurinol",
  "category": "other",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 6-12 hours",
    "notes": "Oral: 10 mg/kg/24 hr PO ÷ BID–QID; max. dose: 800 mg/24 hr Injectable: 200 mg/m 2 /24 hr IV ÷ Q6–12 hr; max. dose: 600 mg/24 hr",
    "maxDose": "800 mg/24 hr Injectable: 200 mg/m 2 /24 hr IV ÷ Q6–12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 100, 200, 300 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-almotriptan-malate",
  "name": "Almotriptan Malate",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Daily",
    "notes": "Start with 6.25–12.5 mg PO × 1. If needed in 2 hr, a second dose may be administered. Max. daily dose: 2 doses/24 hr and 25 mg/24 hr",
    "unit": "mg",
    "perKg": false,
    "min": 6.25,
    "max": 12.5
   }
  ],
  "indications": [],
  "contraindications": [
   "Ischemic/vasospastic coronary artery disease, significant underlying cardiovascular disease, cerebrovascular syndromes, peripheral vascular disease, uncontrolled hypertension, or hemiplegic/basilar migraine"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-alprostadil",
  "name": "Alprostadil",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "notes": "Initial: 0.05–0.1 mCg/kg/min. Advance to 0.2 mCg/kg/min if necessary. Maintenance: When increase in PaO 2 is noted, decrease immediately to lowest effective dose. Usual dosage range: 0.01–0.4 mCg/kg/min; doses >0.4 mCg/kg/min not likely to produce additional benefit. To prepare infusion: See inside front cover . For palliation only. Continuous vital sign monitoring essential.",
    "unit": "mcg/kg/min",
    "perKg": true,
    "min": 0.05,
    "max": 0.1
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Continuous vital sign monitoring essential"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-alteplase",
  "name": "Alteplase",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "notes": "0.06 mg/kg/hr; max. dose: 2 mg/hr",
    "maxDose": "2 mg/hr",
    "unit": "mg/kg/hr",
    "perKg": true,
    "value": 0.06
   },
   {
    "route": "Oral",
    "notes": "0.03 mg/kg/hr; max. dose: 2 mg/hr High-dose initial infusion: 0.1–0.5 mg/kg/hr; max. dose: 25 mg/hr Dosage regimens ranging from lower dosages (0.01 mg/kg/hr) to higher dosages (0.1–0.6 mg/kg/hr) have been reported ( Chest 2008;133:887–968S). The length of continuous infusion is variable as patients may respond to longer or shorter courses of therapy. Current use in the pediatric population is lim",
    "maxDose": "2 mg/hr High-dose initial infusion: 0",
    "unit": "mg/kg/hr",
    "perKg": true,
    "min": 0.1,
    "max": 0.5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor fibrinogen, thrombin clotting time, PT, and aPTT when used as a thrombolytic"
  ],
  "notes": "Formulary class: tPA Thrombolytic agent, tissue plasminogen activator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-aluminum-hydroxide",
  "name": "Aluminum Hydroxide",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "320–960 mg (5–15 mL) PO 1–3 hr PC and QHS PRN",
    "unit": "mg",
    "perKg": false,
    "min": 320,
    "max": 960
   },
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "50–150 mg/kg/24 hr ÷ Q4–6 hr PO",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 50,
    "max": 150
   }
  ],
  "indications": [
   "PC and QHS PRN"
  ],
  "contraindications": [
   "PC and QHS PRN"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-aluminum-hydroxide-with-magnesium-hydroxide-simethicone",
  "name": "Aluminum Hydroxide with Magnesium Hydroxide / Simethicone",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Topical",
    "notes": "0.5–1 mL/kg/dose ( max. dose: 20 mL/dose) PO 1–3 hr PC and HS PRN >12 yr and adult: 10–20 mL PO 1–3 hr PC and HS PRN; max. dose: 80 mL/24 hr Chronic antacid use is not recommended for children with GERD. May have laxative effect.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-amantadine-hydrochloride",
  "name": "Amantadine Hydrochloride",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "4–6 mg/kg/24 hr PO ÷ BID with the suggested maximum dosage: Per-dose amount calculated from 4–6 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 2,
    "max": 3
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "4–6 mg/kg/24 hr PO ÷ BID with the suggested maximum dosage:",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 4,
    "max": 6
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "100 mg PO BID x 14 days, then increase to 150 mg PO BID. If needed, may increase dose to 200 mg PO BID only after 3 weeks from the initiation of therapy. Use in influenza A no longer recommended due to high resistance rates. Avoid use of live attenuated influenza vaccine (LAIV) due to potential risk for reduced vaccine efficacy. Preliminary studies in traumatic brain injury suggest improved cognit",
    "unit": "mg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Capsule: 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-amikacin-sulfate",
  "name": "Amikacin Sulfate",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "15–22.5 mg/kg/24 hr ÷ Q8 hr IV/IM; infants and patients requiring higher doses (e.g., cystic fibrosis) may receive initial doses of 30 mg/kg/24 hr ÷ Q8 hr IV/IM Cystic fibrosis (if available, use patient’s previous therapeutic mg/kg dosage): Conventional Q8 hr dosing: 30 mg/kg/24 hr ÷ Q8 hr IV High-dose extended-interval (once daily) dosing (limited data): 30–35 mg/kg/24 hr Q24 hr IV Nontuberculou Per-dose amount calculated from 15–22.5 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 7.5
   },
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "15–22.5 mg/kg/24 hr ÷ Q8 hr IV/IM; infants and patients requiring higher doses (e.g., cystic fibrosis) may receive initial doses of 30 mg/kg/24 hr ÷ Q8 hr IV/IM Cystic fibrosis (if available, use patient’s previous therapeutic mg/kg dosage): Conventional Q8 hr dosing: 30 mg/kg/24 hr ÷ Q8 hr IV High-dose extended-interval (once daily) dosing (limited data): 30–35 mg/kg/24 hr Q24 hr IV Nontuberculou",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 22.5
   },
   {
    "route": "IV",
    "frequency": "Every 24 hours",
    "notes": "15–30 mg/kg/dose Q24 hr IV; max. dose: 1500 mg/24 hr",
    "maxDose": "1500 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 15,
    "max": 30
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, aminoglycoside. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-aminocaproic-acid",
  "name": "Aminocaproic Acid",
  "category": "hematologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "Loading dose: 100–200 mg/kg Maintenance: 50–100 mg/kg/dose Q4–6 hr; max. dose: 24–30 g/24 hr",
    "maxDose": "24–30 g/24 hr",
    "unit": "mg/kg",
    "perKg": true,
    "min": 100,
    "max": 200
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 500, 1000 mg Oral liquid/syrup: 250 mg/mL (240 mL); may contain 0.2% methylparaben and 0.05% propylparaben"
  ],
  "monitoring": [],
  "notes": "Formulary class: Hemostatic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-amitriptyline",
  "name": "Amitriptyline",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Start with 1 mg/kg/24 hr ÷ TID PO for 3 days; then increase to 1.5 mg/kg/24 hr ÷ TID. Dose may be gradually increased to a max. dose of 5 mg/kg/24 hr if needed. Monitor ECG, BP, and heart rate (HR) for doses >3 mg/kg/24 hr. Continued Per-dose amount calculated from 1 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.333
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Start with 1 mg/kg/24 hr ÷ TID PO for 3 days; then increase to 1.5 mg/kg/24 hr ÷ TID. Dose may be gradually increased to a max. dose of 5 mg/kg/24 hr if needed. Monitor ECG, BP, and heart rate (HR) for doses >3 mg/kg/24 hr. Continued",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 1
   },
   {
    "route": "Oral",
    "notes": "Initial: 0.1 mg/kg/dose QHS PO; increase as needed and tolerated over 2–3 wk to 0.5–2 mg/kg/dose QHS. Migraine prophylaxis (limited data):",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 0.25 mg/kg/dose QHS PO; increase as needed and tolerated every 2 wk by 0.25 mg/kg/dose to 1 mg/kg/24 hr. Maximum dose: 100 mg/24 hr. If dosage exceeds 1 mg/kg/24 hr, divide daily dose BID and monitor ECG.",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.25
   }
  ],
  "indications": [
   "Antidepressant"
  ],
  "contraindications": [
   "narrow-angle glaucoma, seizures, severe cardiac disorders, and patients who received MAO inhibitors within 14 days"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor ECG, BP, and heart rate (HR) for doses >3 mg/kg/24 hr",
   "Monitor ECG, BP, CBC at start of therapy and with dose changes"
  ],
  "notes": "Formulary class: Antidepressant, tricyclic (TCA). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-amoxicillin-clavulanic-acid",
  "name": "Amoxicillin-clavulanic Acid",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "30 mg/kg/24 hr ÷ Q12 hr PO (recommended dosage form is 125 mg/5 mL suspension) Per-dose amount calculated from 30 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "30 mg/kg/24 hr ÷ Q12 hr PO (recommended dosage form is 125 mg/5 mL suspension)",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 30
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Standard (non-high) dose amoxicillin regimens: <40 kg: TID dosing (see remarks): 20–40 mg/kg/24 hr ÷ Q8 hr PO BID dosing (see remarks): 25–45 mg/kg/24 hr ÷ Q12 hr PO ≥40 kg: Use adult dosage. High-dose amoxicillin regimens: Per-dose amount calculated from 20–40 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 6.667,
    "max": 13.333
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Standard (non-high) dose amoxicillin regimens: <40 kg: TID dosing (see remarks): 20–40 mg/kg/24 hr ÷ Q8 hr PO BID dosing (see remarks): 25–45 mg/kg/24 hr ÷ Q12 hr PO ≥40 kg: Use adult dosage. High-dose amoxicillin regimens:",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 20,
    "max": 40
   },
   {
    "route": "Oral",
    "frequency": "Every 8-12 hours",
    "notes": "1 amoxicillin:clavulanate dosage form, Augmentin ES-600, or generic oral suspension): 90 mg/kg/24 hr ÷ Q8–12 hr PO; Q8 hr recommended for CAP, orbital cellulitis, and severe infections ≥40 kg: Use adult dosage.",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 90
   }
  ],
  "indications": [],
  "contraindications": [
   "patients with a history of cholestatic jaundice/hepatic dysfunction associated with amoxicillin–clavulanic acid"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, aminopenicillin with β -lactamase inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-amphetamine",
  "name": "Amphetamine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "5 mg once daily or BID; increase by 5 mg/24 hr at weekly intervals until desired response. Incremental dosages may be administered BID–TID with the first dose at awakening and subsequent doses spaced at 4–6 hr intervals. Doses rarely exceed 40 mg/24 hr. Extended-release suspension or extended-release tabs (Dyanavel XR; PO):",
    "unit": "mg",
    "perKg": false,
    "value": 5
   },
   {
    "route": "Oral",
    "notes": "Start at 2.5 or 5 mg/24 hr QAM; increase by 2.5–10 mg/24 hr every 4–7 days until desired response up to a maximum dose of 20 mg/24 hr. Extended-release dispersible tabs (see how-supplied section, earlier; Adzenys XR-ODT; PO): 6–17 yr: 6.3 mg/24 hr QAM; increase by 3.1 or 6.3 mg/24 hr at weekly intervals until desired response. Max. dose: 6–12 yr: 18.8 mg/24 hr; 13–18 yr: 12.5 mg/24 hr.",
    "maxDose": "6–12 yr: 18",
    "unit": "mg/day",
    "perKg": false,
    "min": 2.5,
    "max": 10
   },
   {
    "route": "IV",
    "frequency": "Daily",
    "notes": "10 mg QAM; increase by 10 mg/24 hr at weekly intervals until desired response. Incremental doses may be administered with the first dose at awakening and subsequent doses (5 or 10 mg) spaced at 4–6 hr intervals. Usual daily dosage range: 5–60 mg/24 hr in divided doses. Use with caution in presence of hypertension, cardiovascular disease, and risk for abuse or addiction. Avoid use in known serious",
    "unit": "mg/day",
    "perKg": false,
    "min": 5,
    "max": 60
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Growth), abdominal pain, anxiety, mood swings, and agitation"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-amphotericin-b-lipid-complex",
  "name": "Amphotericin B Lipid Complex",
  "category": "antifungal",
  "doses": [
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Yes Yes No Injection: 5 mg/mL (20 mL); preservative free (Formulated as a 1:1 molar ratio of amphotericin B to lipid complex composed of dimyristoylphosphatidylcholine and dimyristoylphosphatidylglycerol) IV: 5 mg/kg/24 hr once daily Candidiasis: IV: 3–5 mg/kg/24 hr once daily Cryptococcal meningitis: IV: 5 mg/kg/24 hr once daily; use in combination with flucytosine or Per-dose amount calculated from 3–5 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3,
    "max": 5
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Yes Yes No Injection: 5 mg/mL (20 mL); preservative free (Formulated as a 1:1 molar ratio of amphotericin B to lipid complex composed of dimyristoylphosphatidylcholine and dimyristoylphosphatidylglycerol) IV: 5 mg/kg/24 hr once daily Candidiasis: IV: 3–5 mg/kg/24 hr once daily Cryptococcal meningitis: IV: 5 mg/kg/24 hr once daily; use in combination with flucytosine or",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 3,
    "max": 5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor renal, hepatic, electrolyte, and hematologic status closely"
  ],
  "notes": "Formulary class: Abelcet, ABLC Antifungal, polyene. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ampicillin-sulbactam",
  "name": "Ampicillin/sulbactam",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Premature (based on pharmacokinetic data): 100 mg/kg/24 hr ÷ Q12 hr IM/IV Full term: 100 mg/kg/24 hr ÷ Q8 hr IM/IV Per-dose amount calculated from 100 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 50
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Premature (based on pharmacokinetic data): 100 mg/kg/24 hr ÷ Q12 hr IM/IV Full term: 100 mg/kg/24 hr ÷ Q8 hr IM/IV",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 100
   },
   {
    "route": "IV",
    "frequency": "Every 4-6 hours",
    "notes": "Mild/moderate infections: 100–200 mg/kg/24 hr ÷ Q6 hr IM/IV; max. dose: 8 g ampicillin/24 hr Meningitis/severe infections: 200–400 mg/kg/24 hr ÷ Q4–6 hr IM/IV; max. dose: 8 g ampicillin/ 24 hr",
    "maxDose": "8 g ampicillin/24 hr Meningitis/severe infections: 200–400 mg/kg/24 hr ÷ Q4–6 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 100,
    "max": 200
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 1–2 mg/kg/24 hr SQ once daily. May increase dose by increments of 0.5–1 mg/kg/24 hr as needed up to a maximum of 8 mg/kg/24 hr. Once- daily SQ administration is preferred, but the daily dose may be divided BID for the treatment of chronic infantile neurological, cutaneous, and articular syndrome. Juvenile idiopathic arthritis (JIA) (limited data; see remarks): Systemic-onset JIA (child an Per-dose amount calculated from 1–2 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 1–2 mg/kg/24 hr SQ once daily. May increase dose by increments of 0.5–1 mg/kg/24 hr as needed up to a maximum of 8 mg/kg/24 hr. Once- daily SQ administration is preferred, but the daily dose may be divided BID for the treatment of chronic infantile neurological, cutaneous, and articular syndrome. Juvenile idiopathic arthritis (JIA) (limited data; see remarks): Systemic-onset JIA (child an",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 2
   }
  ],
  "indications": [
   "Dosage based on ampicillin component"
  ],
  "contraindications": [
   "Dosage based on ampicillin component"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor hepatic function in patients with hepatic impairment"
  ],
  "notes": "Formulary class: Antibiotic, aminopenicillin with β -lactamase inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-anakinra",
  "name": "Anakinra",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 1–2 mg/kg/24 hr SQ once daily. May increase dose by increments of 0.5–1 mg/kg/24 hr as needed up to a maximum of 8 mg/kg/24 hr. Once- daily SQ administration is preferred, but the daily dose may be divided BID for the treatment of chronic infantile neurological, cutaneous, and articular syndrome. Juvenile idiopathic arthritis (JIA) (limited data; see remarks): Systemic-onset JIA (child an Per-dose amount calculated from 1–2 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 1–2 mg/kg/24 hr SQ once daily. May increase dose by increments of 0.5–1 mg/kg/24 hr as needed up to a maximum of 8 mg/kg/24 hr. Once- daily SQ administration is preferred, but the daily dose may be divided BID for the treatment of chronic infantile neurological, cutaneous, and articular syndrome. Juvenile idiopathic arthritis (JIA) (limited data; see remarks): Systemic-onset JIA (child an",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1 mg/kg/dose (max. dose: 100 mg/dose) SQ once daily. Rheumatoid arthritis (see remarks):",
    "maxDose": "100 mg/dose) SQ once daily",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1
   }
  ],
  "indications": [
   "Rheumatoid arthritis"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-arginine-hydrochloride-injectable-preparation",
  "name": "Arginine Hydrochloride Injectable Preparation",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "notes": "Drug administration: Do not exceed an IV infusion rate of 1 g/kg/hr (4",
    "unit": "g/kg/hr",
    "perKg": true,
    "value": 1
   }
  ],
  "indications": [],
  "contraindications": [
   "renal or hepatic failure"
  ],
  "formulations": [],
  "monitoring": [
   "Acid/base status"
  ],
  "notes": "Formulary class: treatment agent, growth hormone diagnostic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ascorbic-acid",
  "name": "Ascorbic Acid",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "100–300 mg/24 hr ÷ once daily–BID for at least 2 wk",
    "unit": "mg/day",
    "perKg": false,
    "min": 100,
    "max": 300
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Water-soluble vitamin A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-aspirin",
  "name": "Aspirin",
  "category": "hematologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "Analgesic/antipyretic: 10–15 mg/kg/dose PO/PR Q4–6 hr up to total of 60–80 mg/kg/24 hr Max",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "Antiinflammatory: 60–100 mg/kg/24 hr PO ÷ Q6–8 hr Kawasaki disease (see remarks): 80–100 mg/kg/24 hr PO ÷ QID during febrile phase (up to 14 days) until defervescent for 48–72 hr, then decrease to 3–5 mg/kg/24 hr PO QAM",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 60,
    "max": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Nonsteroidal anti-inflammatory agent, antiplatelet agent, analgesic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-atomoxetine",
  "name": "Atomoxetine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "≤ 70 kg (see remarks): Start with approximately 0.5 mg/kg/24 hr PO QAM and increase after a minimum of 3 days to approximately 1.2 mg/kg/24 hr PO ÷ QAM or BID (morning and late afternoon/early evening). Max. daily dose: 1.4 mg/kg/24 hr or 100 mg, whichever is less If used with a strong cytochrome P-450 (CYP) 2D6 inhibitor (e.g., fluoxetine, paroxetine, quinidine) or in patients with reduced CYP2D6 Per-dose amount calculated from 0.5 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.25
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "≤ 70 kg (see remarks): Start with approximately 0.5 mg/kg/24 hr PO QAM and increase after a minimum of 3 days to approximately 1.2 mg/kg/24 hr PO ÷ QAM or BID (morning and late afternoon/early evening). Max. daily dose: 1.4 mg/kg/24 hr or 100 mg, whichever is less If used with a strong cytochrome P-450 (CYP) 2D6 inhibitor (e.g., fluoxetine, paroxetine, quinidine) or in patients with reduced CYP2D6",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": ">70 kg (see remarks): Start with 40 mg PO QAM and increase after a minimum of 3 days to approximately 80 mg/24 hr PO ÷ QAM or BID (morning and late afternoon/early evening). After 2–4 wk, dose may be increased to a max . of 100 mg/24 hr if needed. If used with a strong CYP2D6 inhibitor (e.g., fluoxetine, paroxetine, quinidine) or in patients with reduced CYP2D6 activity: Maintain aforementioned in",
    "unit": "mg",
    "perKg": false,
    "value": 40
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with narrow-angle glaucoma, pheochromocytoma",
   "Severe cardiac disorders"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-atovaquone",
  "name": "Atovaquone",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "30–40 mg/kg/24 hr PO ÷ BID with fatty foods; max. dose: 1500 mg/24 hr. Per-dose amount calculated from 30–40 mg/kg/day divided by 2 (Twice daily).",
    "maxDose": "1500 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 15,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "30–40 mg/kg/24 hr PO ÷ BID with fatty foods; max. dose: 1500 mg/24 hr. • 30–40 mg/kg/24 hr PO once daily; max. dose: 1500 mg/24 hr",
    "maxDose": "1500 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 30,
    "max": 40
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "750 mg/dose PO BID Prophylaxis (1st episode and recurrence):",
    "unit": "mg/dose",
    "perKg": false,
    "value": 750
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "30–40 mg/kg/24 hr PO once daily; max. dose: 1500 mg/24 hr Per-dose amount calculated from 30–40 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "1500 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 30,
    "max": 40
   }
  ],
  "indications": [
   "Toxoplasma gondii for HIV patients"
  ],
  "contraindications": [
   "Treatment",
   "PO once daily Toxoplasma gondii for HIV patients"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antiprotozoal. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-azathioprine",
  "name": "Azathioprine",
  "category": "immunosuppressant",
  "doses": [
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Initial: 3–5 mg/kg/24 hr IV/PO once daily Maintenance: 1–3 mg/kg/24 hr IV/PO once daily Should NOT be given during pregnancy without careful evaluation of risk over benefit. Increased risk for hepatosplenic T-cell lymphoma has been reported in adolescents and young adults. Toxicity: Bone marrow suppression, rash, stomatitis, hepatotoxicity, alopecia, arthralgias, and GI disturbances. Use ¼ – ⅓ dos Per-dose amount calculated from 3–5 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3,
    "max": 5
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Initial: 3–5 mg/kg/24 hr IV/PO once daily Maintenance: 1–3 mg/kg/24 hr IV/PO once daily Should NOT be given during pregnancy without careful evaluation of risk over benefit. Increased risk for hepatosplenic T-cell lymphoma has been reported in adolescents and young adults. Toxicity: Bone marrow suppression, rash, stomatitis, hepatotoxicity, alopecia, arthralgias, and GI disturbances. Use ¼ – ⅓ dos",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 3,
    "max": 5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Oral suspension: 50 mg/mL",
   "Tabs: Imuran and generics: 50 mg (scored) Azasan and generics: 75, 100 mg (scored)"
  ],
  "monitoring": [
   "Monitor CBC, platelets, total bilirubin, alkaline phosphatase, BUN, and creatinine"
  ],
  "notes": "Formulary class: Immunosuppressant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-azelastine",
  "name": "Azelastine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "notes": "Generic: 0.1% (delivers 137 mCg/spray) (200 actuations per 30 mL); contains benzalkonium chloride and EDTA Astepro [OTC ]: 0.15% (delivers 205.5 mCg/spray) (200 actuations per 30 mL); contains benzalkonium chloride and EDTA",
    "unit": "mcg",
    "perKg": false,
    "value": 137
   },
   {
    "route": "Oral",
    "notes": "0.15% (delivers 205.5 mCg/spray) (60 actuations per 11 mL; 120 actuations per 23 mL); contains benzalkonium chloride and EDTA Ophthalmic drops (generics; previously available as Opitvar): 0.05% (0.5 mg/mL) (6 mL); contains benzalkonium chloride Seasonal allergic rhinitis: 0.1% strength:",
    "unit": "mcg",
    "perKg": false,
    "value": 205.5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antihistamine. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-azelastine-and-fluticasone",
  "name": "Azelastine and Fluticasone",
  "category": "steroid",
  "doses": [
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Tablet or oral suspension (mild infection or step-down therapy): 10 mg/kg ( max. dose: 500 mg) PO on day 1, followed by 5 mg/kg/24 hr ( max. dose: 250 mg/24 hr) PO once daily on days 2–5 IV and PO regimen (severe infection): 10 mg/kg/dose ( max. dose: 500 mg/dose) IV once daily for at least 2 days followed by 5 mg/kg/dose ( max. dose: 250 mg/dose) PO once daily to complete a 5-day course Pharyngit",
    "maxDose": "500 mg) PO on day 1",
    "unit": "mg/kg",
    "perKg": true,
    "value": 10
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "10 mg/kg/dose PO/IV once daily × 5 days • 10 mg/kg/dose ( max. dose: 500 mg) PO/IV on day 1, followed by 5 mg/kg/dose ( max. dose: 250 mg) PO/IV once daily on days 2–5 Mycobacterium avium complex in HIV (see https://clinicalinfo.hiv.gov/en for most current recommendations): Prophylaxis for first episode (primary prophylaxis): 20 mg/kg/dose PO Q7 days ( max. dose: 1200 mg/dose); alternatively, 5 mg/kg/24 hr PO once daily ( max. dose: 250 m",
    "maxDose": "500 mg) PO/IV on day 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   }
  ],
  "indications": [
   "Seasonal allergic rhinitis"
  ],
  "contraindications": [],
  "formulations": [
   "Oral suspension: 100 mg/5 mL (15 mL), 200 mg/5 mL (15, 22.5, 30 mL); see remarks Oral powder (sachet): 1 g (3s)"
  ],
  "monitoring": [
   "Monitor growth velocity in children with prolonged use"
  ],
  "notes": "Formulary class: Intranasal antihistamine and corticosteroid combination. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-aztreonam",
  "name": "Aztreonam",
  "category": "respiratory",
  "doses": [
   {
    "route": "IV",
    "notes": "30 mg/kg/dose IV/IM (higher doses may be necessary for meningitis): Gestational age <34 wk:",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 30
   },
   {
    "route": "IV",
    "frequency": "Every 6-8 hours",
    "notes": "90–120 mg/kg/24 hr ÷ Q6–8 hr IV/IM; max. dose: 2 g/dose and 8 g/24 hr. Cystic fibrosis (child and adult): 150–200 mg/kg/24 hr ÷ Q6–8 hr IV/IM ( max. dose: 8 g/24 hr). Alternatively, higher doses have been used at 200–300 mg/kg/24 hr ÷ Q6 hr IV/IM ( max. dose: 12 g/24 hr). Maximum is per dose: 2 g/dose and 8 g/24 hr. Daily total shown — divide by the prescribed frequency.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 90,
    "max": 120
   },
   {
    "route": "Nebulized",
    "frequency": "Three times daily",
    "notes": "75 mg TID (minimum 4 hr between doses) administered in repeated cycles of 28 days on drug followed by 28 days off drug. Administer each dose with the Altera Nebulizer System. Typically indicated in multidrug-resistant aerobic gram-negative infections when β -lactam therapy is contraindicated. Well absorbed when given IM. Use with caution in arginase deficiency. Low cross-allergenicity between aztr",
    "unit": "mg",
    "perKg": false,
    "value": 75
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: and generic intravenous products Antibiotic, monobactam. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-bacitracin-polymyxin-b",
  "name": "Bacitracin / Polymyxin B",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 3-12 hours",
    "notes": "Topical: Apply ointment to affected area once daily–TID. Ophthalmic: Apply 0.25- to 0.5-inch ribbon into the conjunctival sac of the infected eye(s) Q3–12 hr; frequency depends on severity of infection. Administer Q3–4 hr × 7–10 days for mild/moderate infections. Hypersensitivity reactions to bacitracin and/or polymyxin B can occur. Do not use topical ointment for the eyes or for a duration of >7",
    "unit": "mg",
    "perKg": false,
    "value": 20
   }
  ],
  "indications": [
   "BACITRACIN",
   "POLYMYXIN B"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Polysporin Topical and others Antibiotic, topical. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-benzoyl-peroxide",
  "name": "Benzoyl Peroxide",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Cleansers (liquid wash, or bar): Wet affected area prior to application. Apply and wash once daily–BID; rinse thoroughly, and pat dry. Modify dose frequency or concentration to control the amount of drying or peeling. Lotion, cream, or gel: Cleanse skin, and apply small amounts over affected areas once daily initially; increase frequency to BID–TID, if needed. Modify dose frequency or concentratio",
    "unit": "mg",
    "perKg": false,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [
   "known history of hypersensitivity to product’s components (benzoyl peroxide, clindamycin, or erythromycin)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Topical acne product. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-benztropine-mesylate",
  "name": "Benztropine Mesylate",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.02–0.05 mg/kg/dose once daily–BID",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.02,
    "max": 0.05
   },
   {
    "route": "Oral",
    "notes": "0.02 mg/kg/dose ( max. dose: 1 mg) × 1",
    "maxDose": "1 mg) × 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.02
   }
  ],
  "indications": [],
  "contraindications": [
   "Myasthenia gravis, gi/gu obstruction, untreated narrow-angle glaucoma",
   "Peptic ulcer"
  ],
  "formulations": [
   "Injection: 1 mg/mL (2 mL)"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-betamethasone",
  "name": "Betamethasone",
  "category": "steroid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6-12 hours",
    "notes": "0.0175–0.125 mg/kg/24 hr or 0.5–7.5 mg/m 2 /24 hr ÷ Q6–12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.0175,
    "max": 0.125
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Apply to affected areas once daily–BID. BETAMETHASONE continued Max. dose: 14 days and the following specific dosages for maximum amount: Cream, ointment, and gel: 50 g/wk Lotion: 50 mL/wk Use with caution in hypothyroidism, cirrhosis, ulcerative colitis, and history of allergic reactions to corticosteroids. See Chapter 8 for relative steroid potencies and doses based on body surface area. Betamet",
    "maxDose": "14 days and the following specific dosages for maximum amount: Cream",
    "unit": "g",
    "perKg": false,
    "value": 50
   }
  ],
  "indications": [
   "Anti-inflammatory",
   "Valerate and dipropionate forms"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-bismuth-subsalicylate",
  "name": "Bismuth Subsalicylate",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "524 mg (2 tablets or 30 mL of 262 mg/15 mL) Helicobacter pylori gastric infection (as part of a 3- or 4-drug combination therapy; doses not well established for children):",
    "unit": "mg",
    "perKg": false,
    "value": 524
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "8 mg/kg/24 hr PO ÷ BID × 10–14 days, or 262 mg PO QID × 7–14 days has been reported. Per-dose amount calculated from 8 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 4
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "8 mg/kg/24 hr PO ÷ BID × 10–14 days, or 262 mg PO QID × 7–14 days has been reported.",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 8
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-bosentan",
  "name": "Bosentan",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Reduce dosage to 62.5 mg PO BID; or interrupt therapy and monitor aminotransferase levels Q2 wk (if aminotransferase levels return to pretreatment levels, continue with most recent dosage or 62.5 mg PO BID). >5 to ≤ 8 × ULN Reconfirm by another aminotransferase test; if confirmed, stop treatment and monitor aminotransferase at least Q2 wk. Once aminotransferase returns to pretreatment levels, cons • 62.5 mg PO BID >8 × ULN All ages: Discontinue treatment permanently. ULN, Upper limit of normal. Continued",
    "unit": "mg",
    "perKg": false,
    "value": 62.5
   }
  ],
  "indications": [],
  "contraindications": [
   "Women who are or may become pregnant",
   "With concurrent use of cyclosporine (increases bosentan concentrations) or glyburide (increases risk for hepatotoxicity)"
  ],
  "formulations": [
   "Tabs: 62.5, 125 mg Dispersible tabs (to be dissolved in water to make an oral suspension): Tracleer: 32 mg (scored); contains aspartame"
  ],
  "monitoring": [
   "Aminotransferase levels Q2 wk (if aminotransferase levels return to pretreatment levels, continue with most recent dosage or 62",
   "Aminotransferase at least Q2 wk"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-budesonide-and-formoterol",
  "name": "Budesonide and Formoterol",
  "category": "respiratory",
  "doses": [
   {
    "route": "Inhaled",
    "frequency": "Twice daily",
    "notes": "Two inhalations BID of 80 mCg budesonide + 4.5 mCg formoterol; max. dose: 4 inhalations/24 hr • No prior inhaled steroid use: Start with two inhalations BID of 80 mCg budesonide + 4.5 mCg formoterol OR 160 mCg budesonide + 4.5 mCg formoterol, depending on severity Prior low to medium doses of inhaled steroid use: Start with two inhalations BID of 80 mCg budesonide + 4.5 mCg formoterol Prior medium to high doses of inhaled steroid use: Start with two inhalations BID of 160 mCg budesonide + 4.",
    "maxDose": "4 inhalations/24 hr",
    "unit": "mcg",
    "perKg": false,
    "value": 80
   },
   {
    "route": "Inhaled",
    "frequency": "Once daily",
    "notes": "160 mCg budesonide + 4.5 mCg formoterol: 1–2 puffs once daily–BID maintenance PLUS 1–2 puffs PRN rescue up to a combined maintenance and PRN rescue maximum dosage of 12 puffs/ 24 hr or 54 mCg formoterol/24 hr See Budesonide and Formoterol for remarks. Should only be used for patients not adequately controlled on other asthma-controller medications (e.g., low- to medium-dose inhaled corticosteroids",
    "unit": "mcg",
    "perKg": false,
    "value": 160
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: and long-acting β 2 -adrenergic agonist. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-bumetanide",
  "name": "Bumetanide",
  "category": "diuretic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.01–0.05 mg/kg/dose once daily or every other day",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.01,
    "max": 0.05
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.015–0.1 mg/kg/dose once daily–QID; max. dose: 10 mg/24 hr",
    "maxDose": "10 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.015,
    "max": 0.1
   }
  ],
  "indications": [
   "Edema"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 0.5, 1, 2 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-butorphanol",
  "name": "Butorphanol",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 3-4 hours",
    "notes": "0.01–0.02 mg/kg/dose ( max. dose: 2 mg/dose) IV Q3–4 hr PRN. Use of a single dose of 0.03 mg/kg IV has been reported in postoperative patients.",
    "maxDose": "2 mg/dose) IV Q3–4 hr PRN",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.01,
    "max": 0.02
   }
  ],
  "indications": [],
  "contraindications": [
   "patients hypersensitive to benzethonium chloride"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-caffeine-citrate",
  "name": "Caffeine Citrate",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Initial dose of 0.25 mCg/dose PO once daily. May increase daily dosage by 0.25 mCg at 2- to 4-wk intervals. Usual maintenance dosage as follows:",
    "unit": "mcg/dose",
    "perKg": false,
    "value": 0.25
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.02–0.06 mCg/kg/dose PO once daily 1–5 yr: 0.25–0.75 mCg/dose PO once daily",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "min": 0.02,
    "max": 0.06
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.5–2 mCg/dose PO once daily Continued",
    "unit": "mcg/dose",
    "perKg": false,
    "min": 0.5,
    "max": 2
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Serum concentration to prevent toxicity"
  ],
  "notes": "Formulary class: Methylxanthine, respiratory stimulant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-calcitriol",
  "name": "Calcitriol",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Initial dose of 0.25 mCg/dose PO once daily. May increase daily dosage by 0.25 mCg at 2- to 4-wk intervals. Usual maintenance dosage as follows:",
    "unit": "mcg/dose",
    "perKg": false,
    "value": 0.25
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.02–0.06 mCg/kg/dose PO once daily 1–5 yr: 0.25–0.75 mCg/dose PO once daily",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "min": 0.02,
    "max": 0.06
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.5–2 mCg/dose PO once daily Continued",
    "unit": "mcg/dose",
    "perKg": false,
    "min": 0.5,
    "max": 2
   }
  ],
  "indications": [],
  "contraindications": [
   "patients with hypercalcemia or vitamin D toxicity"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor serum calcium and phosphorus, and parathyroid hormone (PTH) in dialysis patients"
  ],
  "notes": "Formulary class: Active form vitamin D, fat soluble. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-calcium-acetate",
  "name": "Calcium Acetate",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "notes": "Start with 667–1000 mg PO with each meal. If needed, dosage may be titrated every 2–4 wk up to the recommended limits from the KDOQI guidelines: Calcium intake as phosphate binders: 1500 mg elemental calcium/24 hr Total calcium intake from all sources: 2000 mg elemental calcium/24 hr",
    "unit": "mg",
    "perKg": false,
    "min": 667,
    "max": 1000
   },
   {
    "route": "Oral",
    "notes": "500, 750, 1000, 1250 mg; may contain aspartame",
    "unit": "mg",
    "perKg": false,
    "value": 1250
   },
   {
    "route": "Oral",
    "notes": "400 mg with 40 mg simethicone Tab [OTC]: 648, 1250, 1500 mg Oral suspension [OTC]: 1250 mg/5 mL (473 mL); may contain parabens",
    "unit": "mg",
    "perKg": false,
    "value": 400
   }
  ],
  "indications": [],
  "contraindications": [
   "ventricular fibrillation"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: elemental Ca Calcium supplement, phosphorus-lowering agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-calcium-carbonate",
  "name": "Calcium Carbonate",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "notes": "500, 750, 1000, 1250 mg; may contain aspartame",
    "unit": "mg",
    "perKg": false,
    "value": 1250
   },
   {
    "route": "Oral",
    "notes": "400 mg with 40 mg simethicone Tab [OTC]: 648, 1250, 1500 mg Oral suspension [OTC]: 1250 mg/5 mL (473 mL); may contain parabens • 400 mg/5 mL with 40 mg simethicone per 5 mL (120 mL) CALCIUM CARBONATE continued Powder [OTC]: 800 mg/2 g (480 g) Each 1 g of salt contains 20 mEq or 10 mmol (400 mg) elemental Ca. Some products may be combined with vitamin D; check package labeling. Hypocalcemia: (Doses expressed in mg of elemental calcium. To convert to mg of salt, divide elemental dose by 0.4.)",
    "unit": "mg",
    "perKg": false,
    "value": 400
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-calcium-citrate",
  "name": "Calcium Citrate",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "50–150 mg/kg/24 hr PO ÷ Q4–6 hr; max. dose: 1 g/24 hr",
    "maxDose": "1 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 50,
    "max": 150
   },
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "45–65 mg/kg/24 hr PO ÷ QID Per-dose amount calculated from 45–65 mg/kg/day divided by 4 (Four times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 11.25,
    "max": 16.25
   },
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "45–65 mg/kg/24 hr PO ÷ QID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 45,
    "max": 65
   }
  ],
  "indications": [
   "Hypocalcemia"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cannabidiol",
  "name": "Cannabidiol",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 48 hours",
    "notes": "Start at 2.5 mg/kg/dose PO BID × 1 wk; dosage may be increased to a maintenance dose of 5 mg/kg/dose PO BID. Dose may be further increased after 1 wk if needed and tolerated at weekly increments of 2.5 mg/kg/dose BID (5 mg/kg/24 hr) up to the max. of 20 mg/kg/24 hr. Those requiring a more rapid titration from 10 mg/kg/24 hr to 20 mg/kg/24 hr may be titrated no more frequently than Q48 hr. Dosage R",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 2.5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor ALT, AST, and total bilirubin at baseline and 1, 3, and 6 mo initially and periodically thereafter"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-carbamide-peroxide",
  "name": "Carbamide Peroxide",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Following the same instructions as aforementioned, instill 5–10 drops into affected ear BID PRN for up to 4 days. Contraindicated if tympanic membrane is perforated; following otic surgery; with ear discharge, drainage, pain, irritation, or rash; or if PE tubes in place. Tip of applicator should not enter ear canal when used as a cerumenolytic. CARBINOXAMINE Karbinal ER, RyVent, and many generics",
    "unit": "mg",
    "perKg": false,
    "value": 4
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate-release dosage forms: 0.2–0.4 mg/kg/24 hr PO ÷ TID–QID; alternative dosing by age ( do not exceed 0.4 mg/kg/24 hr): 2–5 yr: 1–2 mg TID–QID 6–11 yr: 2–4 mg TID–QID Per-dose amount calculated from 0.2–0.4 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.067,
    "max": 0.133
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate-release dosage forms: 0.2–0.4 mg/kg/24 hr PO ÷ TID–QID; alternative dosing by age ( do not exceed 0.4 mg/kg/24 hr): 2–5 yr: 1–2 mg TID–QID 6–11 yr: 2–4 mg TID–QID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.2,
    "max": 0.4
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "4–8 mg TID–QID Extended-release oral suspension (Karbinal ER and generics; approximately 0.2–0.4 mg/ kg/24 hr): 2–3 yr: 3–4 mg Q12 hr 4–5 yr: 3–8 mg Q12 hr 6–11 yr: 6–12 mg Q12 hr",
    "unit": "mg",
    "perKg": false,
    "min": 4,
    "max": 8
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-carbinoxamine",
  "name": "Carbinoxamine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate-release dosage forms: 0.2–0.4 mg/kg/24 hr PO ÷ TID–QID; alternative dosing by age ( do not exceed 0.4 mg/kg/24 hr): 2–5 yr: 1–2 mg TID–QID 6–11 yr: 2–4 mg TID–QID Per-dose amount calculated from 0.2–0.4 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.067,
    "max": 0.133
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate-release dosage forms: 0.2–0.4 mg/kg/24 hr PO ÷ TID–QID; alternative dosing by age ( do not exceed 0.4 mg/kg/24 hr): 2–5 yr: 1–2 mg TID–QID 6–11 yr: 2–4 mg TID–QID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.2,
    "max": 0.4
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "4–8 mg TID–QID Extended-release oral suspension (Karbinal ER and generics; approximately 0.2–0.4 mg/ kg/24 hr): 2–3 yr: 3–4 mg Q12 hr 4–5 yr: 3–8 mg Q12 hr 6–11 yr: 6–12 mg Q12 hr",
    "unit": "mg",
    "perKg": false,
    "min": 4,
    "max": 8
   }
  ],
  "indications": [],
  "contraindications": [
   "acute asthma, with other ethanolamine antihistamines (hypersensitivity), MAO inhibitors (prolongs and intensifies anticholinergic effects), severe hypertension, narrow-angle glaucoma, severe coronary artery disease, and urinary retention"
  ],
  "formulations": [
   "Karbinal ER, RyVent, and many generics Antihistamine C 3 No No No Immediate-release dosage forms: Oral liquid: 4 mg/5 mL (118 mL); may contain propylene glycol"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-carnitine",
  "name": "Carnitine",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8-12 hours",
    "notes": "50–100 mg/kg/24 hr PO ÷ Q8–12 hr; increase slowly as needed and tolerated to max. dose of 3 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 50,
    "max": 100
   },
   {
    "route": "IV",
    "frequency": "Every 4-6 hours",
    "notes": "50–100 mg/kg as loading dose; may follow with 50–100 mg/kg/24 hr IV infusion (for severe cases); maintenance: 50–100 mg/kg/24 hr ÷ Q4–6 hr; increase to max. dose of 300 mg/kg/24 hr if needed",
    "unit": "mg/kg",
    "perKg": true,
    "min": 50,
    "max": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs (Carnitor and generics): 330 mg",
   "Oral solution: 100 mg/mL (118 mL); contains methylparabens and propylparabens; Carnitor SF is a sugar-free product"
  ],
  "monitoring": [],
  "notes": "Formulary class: Nutritional supplement, amino acid. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-carvedilol",
  "name": "Carvedilol",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "<62.5 kg: Start at 0.1 mg/kg/24 hr PO ÷ Q12 hr. Dose may be doubled every 2 wk if needed and tolerated up to 0.8–1 mg/kg/24 hr ÷ Q12 hr. Due to altered pharmacokinetics, divide daily dosage by Q8 hr if child is Per-dose amount calculated from 0.8–1 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.4,
    "max": 0.5
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "<62.5 kg: Start at 0.1 mg/kg/24 hr PO ÷ Q12 hr. Dose may be doubled every 2 wk if needed and tolerated up to 0.8–1 mg/kg/24 hr ÷ Q12 hr. Due to altered pharmacokinetics, divide daily dosage by Q8 hr if child is",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.8,
    "max": 1
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 3.125 mg PO BID. Dose may be doubled every 2 wk if needed and tolerated up to 25 mg BID. 25 mg PO TID may be needed for patients weighing >75 kg.",
    "unit": "mg",
    "perKg": false,
    "value": 3.125
   }
  ],
  "indications": [
   "BID Extended-release capsules",
   "Hypertension"
  ],
  "contraindications": [
   "asthma or related bronchospastic disease, sick sinus syndrome, 2nd- or 3rd-degree heart block, severe bradycardia, cardiogenic shock, decompensated cardiac failure requiring IV inotropic therapy, and severe hepatic impairment (Child-Pugh class C)"
  ],
  "formulations": [
   "Tabs (Coreg and generics): 3.125, 6.25, 12.5, 25 mg Extended-release caps (Coreg CR and generics): 10, 20, 40, 80 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: ( α and β ), antihypertensive. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefadroxil",
  "name": "Cefadroxil",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12-24 hours",
    "notes": "Skin and soft tissue infection, and cystitis: 30 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 2 g/24 hr Group A β -hemolytic streptococci pharyngitis/tonsillitis: 30 mg/kg/24 hr PO ÷ Q12–24 hr; max. dose: 1 g/24 hr",
    "maxDose": "2 g/24 hr Group A β -hemolytic streptococci pharyngitis/tonsillitis: 30 mg/kg/24 hr PO ÷ Q12–24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 30
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "≤ 2000 g: 50 mg/kg/24 hr ÷ Q12 hr >2000 g: 100 mg/kg/24 hr ÷ Q12 hr Postnatal age >7–28 days: ≤ 2000 g: 75 mg/kg/24 hr ÷ Q8 hr >2000 g: 150 mg/kg/24 hr ÷ Q8 hr",
    "unit": "g",
    "perKg": false,
    "value": 2000
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "Mild/moderate infection: 25–100 mg/kg/24 hr ÷ Q6–8 hr; max. dose: 6 g/24 hr Severe infection: 100–150 mg/kg/24 hr ÷ Q6–8 hr ( max. dose: 12 g/24 hr); 150 mg/kg/ 24 hr ÷ Q6–8 hr has been recommended for bone/joint infections",
    "maxDose": "6 g/24 hr Severe infection: 100–150 mg/kg/24 hr ÷ Q6–8 hr ( max",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Oral suspension: 250 mg/5 mL (100 mL), 500 mg/5 mL (75, 100 mL)"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (first generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefazolin",
  "name": "Cefazolin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "≤ 2000 g: 50 mg/kg/24 hr ÷ Q12 hr >2000 g: 100 mg/kg/24 hr ÷ Q12 hr Postnatal age >7–28 days: ≤ 2000 g: 75 mg/kg/24 hr ÷ Q8 hr >2000 g: 150 mg/kg/24 hr ÷ Q8 hr",
    "unit": "g",
    "perKg": false,
    "value": 2000
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "Mild/moderate infection: 25–100 mg/kg/24 hr ÷ Q6–8 hr; max. dose: 6 g/24 hr Severe infection: 100–150 mg/kg/24 hr ÷ Q6–8 hr ( max. dose: 12 g/24 hr); 150 mg/kg/ 24 hr ÷ Q6–8 hr has been recommended for bone/joint infections",
    "maxDose": "6 g/24 hr Severe infection: 100–150 mg/kg/24 hr ÷ Q6–8 hr ( max",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 100
   },
   {
    "route": "Oral",
    "notes": "50 mg/kg ( max. dose: 1 g) 30–60 min before procedure",
    "maxDose": "1 g) 30–60 min before procedure",
    "unit": "mg/kg",
    "perKg": true,
    "value": 50
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (first generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefdinir",
  "name": "Cefdinir",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12-24 hours",
    "notes": "Second-line therapy for otitis media or pharyngitis/tonsillitis (NOT RECOMMENDED for CAP, acute bacterial rhinosinusitis, UTI, uncomplicated skin infections, or penicillin- resistant streptococci): 14 mg/kg/24 hr PO ÷ Q12–24 hr; max. dose: 600 mg/24 hr Second-line therapy for uncomplicated skin infections (first-generation cephalosporin may be more appropriate): 14 mg/kg/24 hr PO ÷ Q12 hr; max. do",
    "maxDose": "600 mg/24 hr Second-line therapy for uncomplicated skin infections (first-generation cephalosporin may be more appropriate): 14 mg/kg/24 hr PO ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 14
   },
   {
    "route": "Oral",
    "frequency": "Every 12-24 hours",
    "notes": "Second-line therapy for bronchitis, sinusitis, pharyngitis/tonsillitis: 600 mg/24 hr PO ÷ Q12–24 hr Second-line therapy for community-acquired pneumonia (CAP), UTI, uncomplicated skin infections (first-generation cephalosporin may be more appropriate): 600 mg/24 hr PO ÷ Q12 hr Use with caution in penicillin-allergic patients or in presence of renal impairment. DO NOT utilize ceftriaxone S. pneumon",
    "unit": "mg/day",
    "perKg": false,
    "value": 600
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Caps: 300 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (third generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefepime",
  "name": "Cefepime",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "<36 wk gestation: 60 mg/kg/24 hr ÷ Q12 hr ≥ 36 wk gestation: 100 mg/kg/24 hr ÷ Q12 hr Meningitis or Pseudomonas infections: <1 kg and 0–14 days old, or 1–2 kg and <0–7 days old: 100 mg/kg/24 hr ÷ Q12 hr <1 kg and >14 days old, or 1–2 kg and Per-dose amount calculated from 60 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 30
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "<36 wk gestation: 60 mg/kg/24 hr ÷ Q12 hr ≥ 36 wk gestation: 100 mg/kg/24 hr ÷ Q12 hr Meningitis or Pseudomonas infections: <1 kg and 0–14 days old, or 1–2 kg and <0–7 days old: 100 mg/kg/24 hr ÷ Q12 hr <1 kg and >14 days old, or 1–2 kg and",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 60
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "150 mg/kg/24 hr ÷ Q8 hr Per-dose amount calculated from 150 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 50
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "150 mg/kg/24 hr ÷ Q8 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 150
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "100 mg/kg/24 hr ÷ Q12 hr; max. dose: 4 g/24 hr Meningitis, fever, and neutropenia, or serious infections: 150 mg/kg/24 hr ÷ Q8 hr; max. dose: 2 g/single dose or 6 g/24 hr Alternative extended infusion for elevated MICs or in serious infections: infuse each dose over 3–4 hours for optimizing the antibiotic exposure time above the MIC. Cystic fibrosis (IV/IM): 150 mg/kg/24 hr ÷ Q8 hr, up to a max. d Per-dose amount calculated from 100 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "4 g/24 hr Meningitis",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 50
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "100 mg/kg/24 hr ÷ Q12 hr; max. dose: 4 g/24 hr Meningitis, fever, and neutropenia, or serious infections: 150 mg/kg/24 hr ÷ Q8 hr; max. dose: 2 g/single dose or 6 g/24 hr Alternative extended infusion for elevated MICs or in serious infections: infuse each dose over 3–4 hours for optimizing the antibiotic exposure time above the MIC. Cystic fibrosis (IV/IM): 150 mg/kg/24 hr ÷ Q8 hr, up to a max. d",
    "maxDose": "4 g/24 hr Meningitis",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (fourth generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefiderocol",
  "name": "Cefiderocol",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "<32 wk gestation: 30 mg/kg/dose IV Q8 hr ≥ 32 wk gestation: 40 mg/kg/dose IV Q8 hr Continued CEFIDEROCOL continued 2–",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 30
   },
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "<32 wk gestation: 40 mg/kg/dose IV Q8 hr ≥ 32 wk gestation: 60 mg/kg/dose IV Q8 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 40
   },
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "<34 kg: 60 mg/kg/dose IV Q8 hr ≥ 34 kg: 2 g IV Q8 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 60
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefixime",
  "name": "Cefixime",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12-24 hours",
    "notes": "8 mg/kg/24 hr PO ÷ Q12–24 hr; max. dose: 400 mg/24 hr Alternative dosing for acute UTI: 16 mg/kg/24 hr PO ÷ Q12 hr on day 1, followed by 8 mg/ kg/24 hr Q24 hr PO × 13 days. Max. dose: 400 mg/24 hr",
    "maxDose": "400 mg/24 hr Alternative dosing for acute UTI: 16 mg/kg/24 hr PO ÷ Q12 hr on day 1",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 8
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (third generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefotaxime",
  "name": "Cefotaxime",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "100 mg/kg/24 hr ÷ Q12 hr Per-dose amount calculated from 100 mg/kg/day divided by 2 (Every 12 hours). • 150 mg/kg/24 hr ÷ Q8 hr ≥ 32 wk gestation: Per-dose amount calculated from 150 mg/kg/day divided by 3 (Every 8 hours). • 100 mg/kg/24 hr ÷ Q12 hr Per-dose amount calculated from 100 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 50
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "100 mg/kg/24 hr ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 100
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "150 mg/kg/24 hr ÷ Q8 hr ≥ 32 wk gestation:",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 150
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (third generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefotetan",
  "name": "Cefotetan",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Mild/moderate infection: 60 mg/kg/24 hr ÷ Q12 hr; max. single dose: 2 g/dose Severe infection: 100 mg/kg/24 hr ÷ Q12 hr; max. single dose: 3 g/dose Intra-abdominal infection: 40–80 mg/kg/24 hr ÷ Q12 hr; max. dose: 6 g/24 hr Continued CEFOTETAN continued Per-dose amount calculated from 40–80 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "6 g/24 hr Continued CEFOTETAN continued",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 20,
    "max": 40
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Mild/moderate infection: 60 mg/kg/24 hr ÷ Q12 hr; max. single dose: 2 g/dose Severe infection: 100 mg/kg/24 hr ÷ Q12 hr; max. single dose: 3 g/dose Intra-abdominal infection: 40–80 mg/kg/24 hr ÷ Q12 hr; max. dose: 6 g/24 hr Continued CEFOTETAN continued",
    "maxDose": "6 g/24 hr Continued CEFOTETAN continued",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 40,
    "max": 80
   },
   {
    "route": "IV",
    "notes": "40 mg/kg/dose ( max. dose: 2 g/dose) IV",
    "maxDose": "2 g/dose)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 40
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (second generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefoxitin",
  "name": "Cefoxitin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "70 mg/kg/24 hr ÷ Q12 hr Per-dose amount calculated from 70 mg/kg/day divided by 2 (Every 12 hours). • 105 mg/kg/24 hr ÷ Q8 hr ≥ 32 wk gestation: 105 mg/kg/24 hr ÷ Q8 hr Per-dose amount calculated from 105 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 35
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "70 mg/kg/24 hr ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 70
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "105 mg/kg/24 hr ÷ Q8 hr ≥ 32 wk gestation: 105 mg/kg/24 hr ÷ Q8 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 105
   },
   {
    "route": "IV",
    "frequency": "Every 6-8 hours",
    "notes": "Mild/moderate infections: 80–100 mg/kg/24 hr ÷ Q6–8 hr Severe infections: 100–160 mg/kg/24 hr ÷ Q4–6 hr PID (child ≥ 45 kg and adolescent): Mild/moderate acute PID : 2 g IM x 1 and probenecid 1 g PO x 1, + doxycycline 100 mg PO Q12 hr and metronidazole 500 mg PO Q12 hr × 14 days Severe acute PID: 2 g IV Q6 hr × 24–48 hr after clinical improvement. Doxycycline 100 mg Q12 hr PO/IV × 14 days is also",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 80,
    "max": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (second generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefpodoxime-proxetil",
  "name": "Cefpodoxime Proxetil",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Otitis media: 10 mg/kg/24 hr PO ÷ Q12 hr × 5–10 days; max. dose: 400 mg/24 hr Pharyngitis/tonsillitis: 10 mg/kg/24 hr PO ÷ Q12 hr × 5–10 days; max. dose: 200 mg/24 hr Acute maxillary sinusitis: 10 mg/kg/24 hr PO ÷ Q12 hr × 10 days; max. dose: 400 mg/24 hr Per-dose amount calculated from 10 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "400 mg/24 hr Pharyngitis/tonsillitis: 10 mg/kg/24 hr PO ÷ Q12 hr × 5–10 days",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Otitis media: 10 mg/kg/24 hr PO ÷ Q12 hr × 5–10 days; max. dose: 400 mg/24 hr Pharyngitis/tonsillitis: 10 mg/kg/24 hr PO ÷ Q12 hr × 5–10 days; max. dose: 200 mg/24 hr Acute maxillary sinusitis: 10 mg/kg/24 hr PO ÷ Q12 hr × 10 days; max. dose: 400 mg/24 hr",
    "maxDose": "400 mg/24 hr Pharyngitis/tonsillitis: 10 mg/kg/24 hr PO ÷ Q12 hr × 5–10 days",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Exacerbation of chronic bronchitis, community-acquired pneumonia, and sinusitis: 400 mg/24 hr PO ÷ Q12 hr × 10 days (14 days for pneumonia) Pharyngitis/tonsillitis: 200 mg/24 hr PO ÷ Q12 hr × 5–10 days Skin/skin structure infection: 800 mg/24 hr PO ÷ Q12 hr × 7–14 days Uncomplicated UTI: 200 mg/24 hr PO ÷ Q12 hr × 5–7 days Use with caution in penicillin-allergic patients or in presence of renal im",
    "unit": "mg/day",
    "perKg": false,
    "value": 400
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "30 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr Per-dose amount calculated from 30 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "30 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr",
    "maxDose": "1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 30
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 100, 200 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (third generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefprozil",
  "name": "Cefprozil",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "30 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr Per-dose amount calculated from 30 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "30 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr",
    "maxDose": "1 g/24 hr Pharyngitis/tonsillitis: 2–12 yr: 15 mg/kg/24 hr PO ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 30
   },
   {
    "route": "Oral",
    "frequency": "Every 24 hours",
    "notes": "500 mg PO Q24 hr Continued CEFPROZIL continued Acute sinusitis:",
    "unit": "mg",
    "perKg": false,
    "value": 500
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "15–30 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr Per-dose amount calculated from 15–30 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "1 g/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 7.5,
    "max": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "15–30 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr",
    "maxDose": "1 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 30
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 250, 500 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (second generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ceftaroline-fosamil",
  "name": "Ceftaroline Fosamil",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "6 mg/kg/dose IV Q8 hr • 6 mg/kg/dose IV Q8 hr 2 mo–",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 6
   },
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "8 mg/kg/dose IV Q8 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 8
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Teflaro Antibiotic, cephalosporin (fifth generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ceftazidime-with-avibactam",
  "name": "Ceftazidime with Avibactam",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "20 mg/kg/dose IV Q8 hr Continued",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 20
   },
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "30 mg/kg/dose IV Q8 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 30
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ceftolozane-with-tazobactam",
  "name": "Ceftolozane with Tazobactam",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "Complicated UTI and complicated intra-abdominal infection: 20 mg/kg/dose IV Q8 hr Severe infections: 40 mg/kg/dose IV Q8 hr • Complicated intra-abdominal infection and complicated UTI (including pyelonephritis): 20 mg/kg/dose ( max. dose: 1 g/dose) IV Q8 hr for 5–14 days for intra-abdominal infection and 7–14 days for UTI Severe infections: 40 mg/kg/dose ( max. dose: 2 g/dose) IV Q8 hr",
    "maxDose": "1 g/dose) IV Q8 hr for 5–14 days for intra-abdominal infection and 7–14 days for UTI Severe infections: 40 mg/kg/dose ( max",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 20
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "For changing renal function and adjust dosage accordingly)"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cefuroxime-cefuroxime-axetil",
  "name": "Cefuroxime (iv, Im)/cefuroxime Axetil (po)",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "100 mg/kg/24 hr ÷ Q12 hr Postnatal age Per-dose amount calculated from 100 mg/kg/day divided by 2 (Every 12 hours). • 100 mg/kg/24 hr ÷ Q12 hr Per-dose amount calculated from 100 mg/kg/day divided by 2 (Every 12 hours). • 150 mg/kg/24 hr ÷ Q8 hr ≥ 1 kg: 150 mg/kg/24 hr ÷ Q8 hr Per-dose amount calculated from 150 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 50
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "100 mg/kg/24 hr ÷ Q12 hr Postnatal age • 100 mg/kg/24 hr ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 100
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "150 mg/kg/24 hr ÷ Q8 hr ≥ 1 kg: 150 mg/kg/24 hr ÷ Q8 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 150
   }
  ],
  "indications": [
   "IM/IV"
  ],
  "contraindications": [
   "L IM/IV"
  ],
  "formulations": [
   "Injection: 0.75, 1.5 g Injectable dosage forms contain 2.4 mEq Na/g drug"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, cephalosporin (second generation). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cetirizine-pseudoephedrine",
  "name": "Cetirizine / Pseudoephedrine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "notes": "Zyrtec-D 12 hr and generics Antihistamine, less sedating B/C 2 Yes Yes No Oral solution or syrup (OTC): 5 mg/5 mL (120, 473 mL); may contain parabens, propylene glycol, or sodium benzoate Tabs (OTC): 5, 10 mg Chewable tabs (OTC): 5, 10 mg Capsule (liquid filled; OTC): 10 mg Dispersible/disintegrating tabs (OTC): 10 mg Injection (Quzyttir) : 10 mg/mL (1 mL); preservative free Ophthalmic solution (Z",
    "unit": "mg",
    "perKg": false,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "2.5 mg PO once daily; dose may be increased for children 12–23 mo to a max. dose of 2.5 mg PO Q12 hr 2–5 yr: Initial dose: 2.5 mg PO once daily; if needed, may increase dose to a max. dose of 5 mg/24 hr once daily or divided BID",
    "unit": "mg",
    "perKg": false,
    "value": 2.5
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "5–10 mg PO once daily Acute urticaria (Quzyttir; IV) :",
    "unit": "mg",
    "perKg": false,
    "min": 5,
    "max": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: and generics Antihistamine, less sedating B/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-intravenous-use",
  "name": "Intravenous USE",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "notes": "Loading dose: 20 mg/kg Maintenance dose (first dose should be given 12 hr after loading dose):",
    "unit": "mg/kg",
    "perKg": true,
    "value": 20
   },
   {
    "route": "Oral",
    "frequency": "Every 24 hours",
    "notes": "25 mg/kg/24 hr Q24 hr Per-dose amount calculated from 25 mg/kg/day divided by 1 (Every 24 hours). • ≤ 2 kg: 25 mg/kg/24 hr Q24 hr >2 kg: 50 mg/kg/24 hr ÷ Q12 hr Per-dose amount calculated from 25 mg/kg/day divided by 1 (Every 24 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 25
   },
   {
    "route": "Oral",
    "frequency": "Every 24 hours",
    "notes": "25 mg/kg/24 hr Q24 hr • ≤ 2 kg: 25 mg/kg/24 hr Q24 hr >2 kg: 50 mg/kg/24 hr ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 25
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-chloramphenicol",
  "name": "Chloramphenicol",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "notes": "Loading dose: 20 mg/kg Maintenance dose (first dose should be given 12 hr after loading dose):",
    "unit": "mg/kg",
    "perKg": true,
    "value": 20
   },
   {
    "route": "Oral",
    "frequency": "Every 24 hours",
    "notes": "25 mg/kg/24 hr Q24 hr Per-dose amount calculated from 25 mg/kg/day divided by 1 (Every 24 hours). • ≤ 2 kg: 25 mg/kg/24 hr Q24 hr >2 kg: 50 mg/kg/24 hr ÷ Q12 hr Per-dose amount calculated from 25 mg/kg/day divided by 1 (Every 24 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 25
   },
   {
    "route": "Oral",
    "frequency": "Every 24 hours",
    "notes": "25 mg/kg/24 hr Q24 hr • ≤ 2 kg: 25 mg/kg/24 hr Q24 hr >2 kg: 50 mg/kg/24 hr ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 25
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "The breast-feeding infant for GI disturbances, adequacy of nursing, and CBC with differential"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-chloroquine-phosphate",
  "name": "Chloroquine Phosphate",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "notes": "5 mg/kg/dose PO every week on the same day of the week; max. dose: 300 mg/dose",
    "maxDose": "300 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "notes": "10 mg/kg/dose ( max. dose: 600 mg/dose) PO × 1; followed by 5 mg/kg/dose ( max. dose: 300 mg/dose) 6, 24, and 48 hr after the initial dose",
    "maxDose": "600 mg/dose) PO × 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [
   "The presence of retinal or visual field changes",
   "Known hypersensitivity to 4-aminoquinoline compounds"
  ],
  "formulations": [
   "Tabs: 250, 500 mg as phosphate (150-, 300-mg base, respectively)"
  ],
  "monitoring": [
   "Monitor CBCs periodically with therapies of prolonged duration"
  ],
  "notes": "Formulary class: Amebicide, antimalarial. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-chlorothiazide",
  "name": "Chlorothiazide",
  "category": "diuretic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "20–40 mg/kg/24 hr ÷ Q12 hr Per-dose amount calculated from 20–40 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "20–40 mg/kg/24 hr ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 20,
    "max": 40
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Start at 5–10 mg/kg/24 hr ÷ Q12 hr; may increase to 20–40 mg/kg/24 hr ÷ Q12 hr if needed Per-dose amount calculated from 5–10 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 2.5,
    "max": 5
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Start at 5–10 mg/kg/24 hr ÷ Q12 hr; may increase to 20–40 mg/kg/24 hr ÷ Q12 hr if needed",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "10–40 mg/kg/24 hr ÷ Q12 hr; maximum PO dose by age: 6 mo– Per-dose amount calculated from 10–40 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "10–40 mg/kg/24 hr ÷ Q12 hr; maximum PO dose by age: 6 mo–",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 40
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Oral suspension: 250 mg/5 mL (237 mL); contains 0.5% alcohol, 0.12% methylparaben, 0.02% propylparaben, and 0.1% benzoic acid  CHLOROTHIAZIDE continued"
  ],
  "monitoring": [],
  "notes": "Formulary class: Thiazide diuretic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-chlorpheniramine-maleate",
  "name": "Chlorpheniramine Maleate",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "0.35 mg/kg/24 hr PO ÷ Q4–6 hr or dose based on age as follows: 2–5 yr: 1 mg/dose PO Q4–6 hr; max. dose: 6 mg/24 hr 6–11 yr: 2 mg/dose PO Q4–6 hr; max. dose: 12 mg/24 hr Maximum is per dose: 6 mg/24 hr 6–11 yr: 2 mg/dose PO Q4–6 hr. Daily total shown — divide by the prescribed frequency.",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.35
   },
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "4 mg/dose Q4–6 hr PO; max. dose: 24 mg/24 hr Sustained release: 12 mg PO Q12 hr Use with caution in asthma.",
    "maxDose": "24 mg/24 hr Sustained release: 12 mg PO Q12 hr Use with caution in asthma",
    "unit": "mg/dose",
    "perKg": false,
    "value": 4
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-chlorpromazine",
  "name": "Chlorpromazine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "2.5–6 mg/kg/24 hr ÷ Q4–6 hr; max. PO dose: 500 mg/24 hr IM/",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 2.5,
    "max": 6
   },
   {
    "route": "IV",
    "frequency": "Every 6-8 hours",
    "notes": "2.5–4 mg/kg/24 hr ÷ Q6–8 hr Max. IM/IV dose:",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 2.5,
    "max": 4
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "0.5–1 mg/kg/dose Q6–8 hr PRN Max. IM/IV/PO dose:",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1
   }
  ],
  "indications": [
   "Antiemetic"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 10, 25, 50, 100, 200 mg Oral liquid concentrate: 30 mg/mL (120 mL), 100 mg/mL (240 mL)"
  ],
  "monitoring": [
   "Monitor BP closely"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cholecalciferol",
  "name": "Cholecalciferol",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "25-OH vitamin D <5 ng/mL: 8000 IU/24 hr × 4 wk, followed by 4000 IU/24 hr × 2 mo; OR 50,000 IU weekly × 4 wk, followed by 50,000 IU twice monthly × 3 mo 25-OH vitamin D 5–15 ng/mL: 4000 IU/24 hr × 12 wk; OR 50,000 IU every other week × 12 wk 25-OH vitamin D 16–30 ng/mL: 2000 IU/24 hr × 3 mo; OR 50,000 IU monthly × 3 mo Maintenance dose (after repletion): 200–1000 IU once daily Biologic potency and",
    "unit": "mg",
    "perKg": false,
    "value": 70
   }
  ],
  "indications": [
   "IU once daily maintenance"
  ],
  "contraindications": [
   "IU once daily maintenance"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor serum Ca 2+ , PO 4 , 25-OH vitamin D (goal level for infant and child: ≥ 20 ng/mL) and alkaline phosphate"
  ],
  "notes": "Formulary class: Vitamin D 3 A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cholestyramine",
  "name": "Cholestyramine",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "240 mg/kg/24 hr PO ÷ TID; doses normally do not exceed 8 g/24 hr (higher doses do not provide additional benefit). Give PO as slurry in water, juice, or milk before meals for better efficacy. Per-dose amount calculated from 240 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 80
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "240 mg/kg/24 hr PO ÷ TID; doses normally do not exceed 8 g/24 hr (higher doses do not provide additional benefit). Give PO as slurry in water, juice, or milk before meals for better efficacy. • 240 mg/kg/24 hr PO ÷ BID–TID; higher doses may cause steatorrhea (dose reduction required). Suggested max. doses:",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 240
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "240 mg/kg/24 hr PO ÷ BID–TID; higher doses may cause steatorrhea (dose reduction required). Suggested max. doses: Per-dose amount calculated from 240 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 120
   },
   {
    "route": "Oral",
    "notes": "8–16 g/24 hr Continued",
    "unit": "g/day",
    "perKg": false,
    "min": 8,
    "max": 16
   }
  ],
  "indications": [
   "Hypercholesterolemia",
   "Pruritus associated with cholestasis"
  ],
  "contraindications": [
   "Pruritus associated with cholestasis"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antilipemic, binding resin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ciclesonide",
  "name": "Ciclesonide",
  "category": "steroid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2 sprays (100 mCg) per nostril once daily; max. dose: 200 mCg/24 hr",
    "maxDose": "200 mCg/24 hr",
    "unit": "mcg",
    "perKg": false,
    "value": 100
   },
   {
    "route": "Inhaled",
    "frequency": "Once daily",
    "notes": "2 sprays (100 mCg) per nostril once daily. Max. dose: 200 mCg/24 hr Oral inhalation (asthma; Alvesco): All daily doses divided BID. Dosage Recommended by Global Initiative for Asthma (GINA) Guidelines Age Low Dose (mCg/24 hr) Medium Dose (mCg/24 hr) High Dose (mCg/24 hr) 6–11 yr 80 >80–160 >160 up to 640 mCg/24 hr ≥ 12 yr and adult 80–160 >160–320 >320 up to 640 mCg/24 hr 2–11 yr (limited data fro",
    "maxDose": "200 mCg/24 hr Oral inhalation (asthma",
    "unit": "mcg",
    "perKg": false,
    "value": 100
   },
   {
    "route": "Inhaled",
    "frequency": "Twice daily",
    "notes": "Prior use with bronchodilator only: 80 mCg/dose BID; max. dose: 320 mCg/24 hr Prior use with inhaled corticosteroid: 80 mCg/dose BID; max. dose: 640 mCg/24 hr CICLESONIDE continued Prior use with oral corticosteroid: 320 mCg/dose BID; max. dose: 640 mCg/24 hr Ciclesonide is a prodrug hydrolyzed to an active metabolite, des-ciclesonide, via esterases in nasal mucosa and lungs; further metabolism vi",
    "maxDose": "320 mCg/24 hr Prior use with inhaled corticosteroid: 80 mCg/dose BID",
    "unit": "mcg/dose",
    "perKg": false,
    "value": 80
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor linear growth of pediatric patients routinely"
  ],
  "notes": "Formulary class: Alvesco, Omnaris Corticosteroid. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cidofovir",
  "name": "Cidofovir",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "notes": "Induction: 5 mg/kg/dose IV once weekly until PCR negative. Administer oral probenecid 1–1.25 g/m 2 /dose (rounded to the nearest 250-mg interval) 3 hr before and 1 hr and 8 hr after each dose of cidofovir. Also give NS via IV at 3 times maintenance fluid concentration 1 hr before and 1 hr after cidofovir, followed by 2 times maintenance fluid concentration for an additional 2 hr. For patients with",
    "unit": "g",
    "perKg": false,
    "min": 1,
    "max": 1.25
   }
  ],
  "indications": [],
  "contraindications": [
   "Hypersensitivity to probenecid or sulfa-containing drugs",
   "Scr >1"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-citrate-mixtures",
  "name": "Citrate Mixtures",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Pharyngitis/tonsillitis, pneumonia, acute maxillary sinusitis, or uncomplicated skin infections: 15 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr (500 mg/24 hr for pharyngitis/tonsillitis) Per-dose amount calculated from 15 mg/kg/day divided by 2 (Every 12 hours).",
    "maxDose": "1 g/24 hr (500 mg/24 hr for pharyngitis/tonsillitis)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 7.5
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Pharyngitis/tonsillitis, pneumonia, acute maxillary sinusitis, or uncomplicated skin infections: 15 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1 g/24 hr (500 mg/24 hr for pharyngitis/tonsillitis)",
    "maxDose": "1 g/24 hr (500 mg/24 hr for pharyngitis/tonsillitis)",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 15
   }
  ],
  "indications": [],
  "contraindications": [
   "Severe renal impairment",
   "Acute dehydration"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-clobazam",
  "name": "Clobazam",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Dosage increments (if needed) should not be more rapid than every 7 days. Weight (kg) Initial Dose Dose at Day 8, if Needed Dose at Day 15, if Needed ≤ 30 kg 5 mg once daily 5 mg BID 10 mg BID ( max. dose ) >30 kg 5 mg BID 10 mg BID 20 mg BID ( max. dose ) Dosage adjustment for mild/moderate hepatic impairment ( • Weight (kg) Initial Dose First Dose Increment, if Needed Second Dose Increment, if Needed Third Dose Increment, if Needed ≤ 30 kg 5 mg once daily × ≥ 14 days 5 mg BID × ≥ 7 days 10 mg BID ( max. dose ) N/A >30 kg 5 mg once daily × ≥ 7 days 5 mg BID × ≥ 7 days 10 mg BID × ≥ 7 days 20 mg BID ( max. dose ) N/A , Not applicable. Seizures (generalized or partial, as monotherapy or adjunctive therapy; l",
    "unit": "mg",
    "perKg": false,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 0.5–1 mg/kg/24 hr ( max. dose: 5 mg/24 hr) PO ÷ BID; if needed and tolerated, slowly increase dosage at 5- to 7-day intervals up to the maximum of 10 mg/24 hr. Continued Per-dose amount calculated from 0.5–1 mg/kg/day divided by 2 (Twice daily).",
    "maxDose": "5 mg/24 hr) PO ÷ BID",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 0.5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 0.5–1 mg/kg/24 hr ( max. dose: 5 mg/24 hr) PO ÷ BID; if needed and tolerated, slowly increase dosage at 5- to 7-day intervals up to the maximum of 10 mg/24 hr. Continued",
    "maxDose": "5 mg/24 hr) PO ÷ BID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.5,
    "max": 1
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-clotrimazole",
  "name": "Clotrimazole",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Apply to affected skin areas BID; × 2 wk for cutaneous candidiasis or tinea cruris, × 2–4 wk for tinea corporis, × 4–8 wk for tinea pedis. Vaginal cream (>12 yr and adult; in addition to intravaginal use, may also apply to external vaginal area BID × 7 days PRN for itching and irritation): 1% cream : 1 applicator dose (5 g) intravaginally QHS × 7–14 days, or 2% cream: 1 applicator dose intravagina",
    "unit": "g",
    "perKg": false,
    "value": 5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: and Gyne-Lotrimin 7 Antifungal, imidazole B/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cortisone-acetate",
  "name": "Cortisone Acetate",
  "category": "steroid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "2.5–10 mg/kg/24 hr PO ÷ Q6–8 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 2.5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "20 mg Q6–8 hr Exercise-induced asthma: 20 mg × 1, 10–15 min prior to and no longer than 1 hr before exercise Nasal:",
    "unit": "mg",
    "perKg": false,
    "value": 20
   },
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "1–2 gtts 4–6 times/24 hr Food allergy/inflammatory bowel disease (taper to lowest effective dose once desired effect is achieved): 2–12 yr: 100 mg PO QID; give 15–20 min AC and QHS; max. dose: 40 mg/kg/24 hr",
    "maxDose": "40 mg/kg/24 hr",
    "unit": "g",
    "perKg": false,
    "min": 1,
    "max": 2
   }
  ],
  "indications": [
   "Anti-inflammatory/immunosuppressive",
   "EDTA Nebulization",
   "Nasal",
   "Ophthalmic"
  ],
  "contraindications": [
   "Anti-inflammatory/immunosuppressive"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Corticosteroid. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cromolyn",
  "name": "Cromolyn",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "20 mg Q6–8 hr Exercise-induced asthma: 20 mg × 1, 10–15 min prior to and no longer than 1 hr before exercise Nasal:",
    "unit": "mg",
    "perKg": false,
    "value": 20
   },
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "1–2 gtts 4–6 times/24 hr Food allergy/inflammatory bowel disease (taper to lowest effective dose once desired effect is achieved): 2–12 yr: 100 mg PO QID; give 15–20 min AC and QHS; max. dose: 40 mg/kg/24 hr",
    "maxDose": "40 mg/kg/24 hr",
    "unit": "g",
    "perKg": false,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "200–400 mg PO QID; give 15–20 min AC and QHS Systemic mastocytosis (taper to lowest effective maintenance dose once desired effect is achieved):",
    "unit": "mg",
    "perKg": false,
    "min": 200,
    "max": 400
   }
  ],
  "indications": [
   "EDTA Nebulization",
   "Nasal",
   "Ophthalmic"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antiallergic agent, mast cell stabilizer. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cyanocobalamin-vitamin-b",
  "name": "Cyanocobalamin/vitamin B",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "notes": "100 mCg/24 hr × 10–15 days followed by 100 mCg once or twice weekly for several months Maintenance: At least 60 mCg/mo",
    "unit": "mcg/day",
    "perKg": false,
    "value": 100
   },
   {
    "route": "Oral",
    "notes": "30–50 mCg/24 hr for at least 14 days to a total dose of 1000–5000 mCg Maintenance: 100 mCg/mo",
    "unit": "mcg/day",
    "perKg": false,
    "min": 30,
    "max": 50
   }
  ],
  "indications": [
   "Pernicious anemia"
  ],
  "contraindications": [
   "Optic nerve atrophy",
   "Cobalt sensitivity"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Vitamin (synthetic), water soluble A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cyclopentolate",
  "name": "Cyclopentolate",
  "category": "ophthalmic",
  "doses": [
   {
    "route": "Oral",
    "notes": "1 drop OU Q5–10 min PRN Used to induce mydriasis. See Cyclopentolate for additional remarks. Onset of action: 15–60 min. Duration of action: 4–12 hr. Apply pressure over the nasolacrimal sac for 2–3 min after administration to minimize systemic absorption. CYCLOSPORINE, CYCLOSPORINE MICROEMULSION, CYCLOSPORINE MODIFIED Sandimmune, Gengraf, Neoral, Restasis, Restasis MultiDose, Verkazia, Vevye, Ceq",
    "unit": "mg",
    "perKg": false,
    "value": 50
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Anticholinergic, mydriatic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cyclopentolate-with-phenylephrine",
  "name": "Cyclopentolate with Phenylephrine",
  "category": "ophthalmic",
  "doses": [
   {
    "route": "Oral",
    "notes": "1 drop OU Q5–10 min PRN Used to induce mydriasis. See Cyclopentolate for additional remarks. Onset of action: 15–60 min. Duration of action: 4–12 hr. Apply pressure over the nasolacrimal sac for 2–3 min after administration to minimize systemic absorption. CYCLOSPORINE, CYCLOSPORINE MICROEMULSION, CYCLOSPORINE MODIFIED Sandimmune, Gengraf, Neoral, Restasis, Restasis MultiDose, Verkazia, Vevye, Ceq",
    "unit": "mg",
    "perKg": false,
    "value": 50
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Cyclomydril Anticholinergic/sympathomimetic, mydriatic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cyclosporine-cyclosporine-microemulsion-cyclosporine-modified",
  "name": "Cyclosporine, Cyclosporine Microemulsion, Cyclosporine Modified",
  "category": "immunosuppressant",
  "doses": [
   {
    "route": "Ophthalmic",
    "notes": "Instill 1 drop onto affected eye(s) Q12 hr. Ophthalmic solution (0.09%; Cequa): ≥18 yr: Instill 1 drop onto affected eye(s) Q12 hr. Severe vernal keratoconjunctivitis: Ophthalmic emulsion: Verkazia (0.1%): ≥4 yr and adult: Instill 1 drop onto affected eye(s) QID until resolution. Restasis and generics (0.05%; limited data in children <14 yr old): ≥5 yr–adult: Instill 1 drop onto affected eye(s) QI",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor trough levels (just prior to a dose at steady state)"
  ],
  "notes": "Formulary class: Immunosuppressant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-cyproheptadine",
  "name": "Cyproheptadine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8-12 hours",
    "notes": "0.25 mg/kg/24 hr or 8 mg/m 2 /24 hr PO ÷ Q8–12 hr, or by age: 2–6 yr: 2 mg PO Q8–12 hr; max. dose: 12 mg/24 hr 7–14 yr: 4 mg PO Q8–12 hr; max. dose: 16 mg/24 hr • 0.25 mg/kg/24 hr PO ÷ Q12 hr up to the following max. dose by age: 2–6 yr: 12 mg/24 hr; 7–14 yr: 16 mg/24 hr;",
    "maxDose": "12 mg/24 hr 7–14 yr: 4 mg PO Q8–12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.25
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "4 mg PO Q8 hr; usual range 12–16 mg/24 hr; max. dose: 0.5 mg/kg/24 hr",
    "maxDose": "0",
    "unit": "mg/day",
    "perKg": false,
    "min": 12,
    "max": 16
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "0.25 mg/kg/24 hr PO ÷ Q12 hr up to the following max. dose by age: 2–6 yr: 12 mg/24 hr; 7–14 yr: 16 mg/24 hr; Per-dose amount calculated from 0.25 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.125
   }
  ],
  "indications": [
   "Antihistaminic uses"
  ],
  "contraindications": [
   "neonates, patients currently on MAO inhibitors, and patients suffering from asthma, glaucoma, or GI/GU obstruction"
  ],
  "formulations": [
   "Tabs: 4 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-dabigatran-etexilate-mesylate",
  "name": "Dabigatran Etexilate Mesylate",
  "category": "hematologic",
  "doses": [
   {
    "route": "Oral",
    "notes": "7–<9 kg: 70 mg Continued",
    "unit": "mg",
    "perKg": false,
    "value": 70
   },
   {
    "route": "Oral",
    "notes": "11–<16 kg: 75 mg 16–<26 kg: 110 mg 26–<41 kg: 150 mg 41–<61 kg: 185 mg 61–<81 kg: 220 mg ≥ 81 kg: 260 mg",
    "unit": "mg",
    "perKg": false,
    "value": 75
   }
  ],
  "indications": [],
  "contraindications": [
   "Mechanical prosthetic heart valves, active bleeding",
   "Prior serious hypersensitivity reactions to dabigatran",
   "Any of its excipients"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Anticoagulant, direct thrombin inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-dapsone",
  "name": "Dapsone",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2 mg/kg/24 hr PO once daily ( max. dose: 100 mg/24 hr) with trimethoprim 15 mg/kg/24 hr PO ÷ TID × 21 days P. jiroveci (formerly carinii ) prophylaxis (first episode and recurrence): Per-dose amount calculated from 2 mg/kg/day divided by 1 (Once daily). • 2 mg/kg/24 hr PO once daily; max. dose: 100 mg/24 hr. Alternative weekly dosing: 4 mg/kg/dose PO Q7 days; max. dose: 200 mg/dose Per-dose amount calculated from 2 mg/kg/day divided by 1 (Once daily). • 2 mg/kg/24 hr ( max. dose: 25 mg/24 hr) PO once daily with pyrimethamine 1 mg/kg/24 hr ( max. 25 mg/dose) PO once daily and leucovorin 5 mg PO Q3 days Per-dose amount calculated from 2 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "100 mg/24 hr) with trimethoprim 15 mg/kg/24 hr PO ÷ TID × 21 days P",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2 mg/kg/24 hr PO once daily ( max. dose: 100 mg/24 hr) with trimethoprim 15 mg/kg/24 hr PO ÷ TID × 21 days P. jiroveci (formerly carinii ) prophylaxis (first episode and recurrence): • 2 mg/kg/24 hr PO once daily; max. dose: 100 mg/24 hr. Alternative weekly dosing: 4 mg/kg/dose PO Q7 days; max. dose: 200 mg/dose • 2 mg/kg/24 hr ( max. dose: 25 mg/24 hr) PO once daily with pyrimethamine 1 mg/kg/24 hr ( max. 25 mg/dose) PO once daily and leucovorin 5 mg PO Q3 days",
    "maxDose": "100 mg/24 hr) with trimethoprim 15 mg/kg/24 hr PO ÷ TID × 21 days P",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 2
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 25, 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, sulfone derivative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-darbepoetin-alfa",
  "name": "Darbepoetin Alfa",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "notes": "Start with 0.45 mCg/kg/dose IV/SC once weekly. • Start with 0.45 mCg/kg/dose IV/SC once weekly, OR 0.75 mCg/kg/ dose IV/SC once every 2 wk.",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "value": 0.45
   },
   {
    "route": "IV",
    "notes": "Start with 2.25 mCg/kg/dose SC once weekly and adjust dose according to the table that follows: Darbepoetin Alfa Dose Adjustment in Anemia Associated With Chemotherapy Response to Dose Dose Adjustment <1 g/dL increase in hemoglobin and remains below 10 g/dL after 6 wk of therapy Increase dose to 4.5 mCg/kg/dose once weekly SC/IV. >1 g/dL increase in hemoglobin in any 2-wk period or when hemoglobin",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "value": 2.25
   }
  ],
  "indications": [],
  "contraindications": [
   "uncontrolled hypertension and patients hypersensitive to albumin/ polysorbate 80 or epoetin alfa"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor hemoglobin, BP, serum chemistries, and reticulocyte count"
  ],
  "notes": "Formulary class: Aranesp Erythropoiesis-stimulating protein. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-deferoxamine-mesylate",
  "name": "Deferoxamine Mesylate",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "notes": "15 mg/kg/hr",
    "unit": "mg/kg/hr",
    "perKg": true,
    "value": 15
   },
   {
    "route": "IM",
    "frequency": "Every 6 hours",
    "notes": "50 mg/kg/dose Q6 hr Max. IV or IM dose: 6 g/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 50
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "20–40 mg/kg/dose over 8–12 hr once daily × 5–7 days per week; usual max. dose: 40 mg/kg/ 24 hr (child) or 60 mg/kg/24 hr (adolescent)",
    "maxDose": "40 mg/kg/ 24 hr (child) or 60 mg/kg/24 hr (adolescent)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 20,
    "max": 40
   }
  ],
  "indications": [],
  "contraindications": [
   "Severe renal disease or anuria"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Chelating agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-dextroamphetamine-amphetamine",
  "name": "Dextroamphetamine / Amphetamine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "10 mg/24 hr ÷ once daily–TID; increase by 10 mg/24 hr at weekly intervals to a max. dose of 60 mg/24 hr Use with caution in presence of hypertension, cardiovascular disease, and renal or hepatic impairment (drug elimination may be decreased). Avoid use in known serious structural cardiac abnormalities, cardiomyopathy, serious heart rhythm abnormalities, coronary artery disease, or other serious ca",
    "unit": "mg/day",
    "perKg": false,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-diazoxide",
  "name": "Diazoxide",
  "category": "endocrine",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 8-12 hours",
    "notes": "Start at 5 mg/kg/24 hr PO ÷ 8-12 hr and gradually titrate if needed; usual range: 3–15 mg/kg/24 hr PO ÷ Q8–12 hr Hypoglycemia should be treated initially with IV glucose; diazoxide should be introduced only if patient is refractory to glucose infusion. Should not be used in patients hypersensitive to thiazides unless benefit outweighs risk. Thiazides may enhance diazoxide’s hyperglycemic effects.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 3,
    "max": 15
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor BP closely for hypotension"
  ],
  "notes": "Formulary class: Antihypoglycemic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tdd-po-iv-im-po-iv-im",
  "name": "TDD PO Iv/im PO Iv/im",
  "category": "fluid",
  "doses": [
   {
    "route": "Topical",
    "notes": "Give maintenance dose ÷ BID ≥ 10 yr: Give maintenance dose once daily",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with ventricular dysrhythmias"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-diltiazem",
  "name": "Diltiazem",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate release: 1.5 ― 2 mg/kg/24 hr PO ÷ TID ― QID; max. dose: 3.5 mg/kg/24 hr; alternative max. dose of 6 mg/kg/24 hr up to 360 mg/24 hr has been recommended Per-dose amount calculated from 2 mg/kg/day divided by 3 (Three times daily).",
    "maxDose": "3",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.667
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate release: 1.5 ― 2 mg/kg/24 hr PO ÷ TID ― QID; max. dose: 3.5 mg/kg/24 hr; alternative max. dose of 6 mg/kg/24 hr up to 360 mg/24 hr has been recommended",
    "maxDose": "3",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 2
   }
  ],
  "indications": [
   "Hypertension"
  ],
  "contraindications": [
   "Acute myocardial infarction (mi) with pulmonary congestion, second- or third-degree heart block",
   "Sick sinus syndrome"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor heart rate with concurrent clonidine use (sinus bradycardia has been reported)"
  ],
  "notes": "Formulary class: Calcium channel blocker, antihypertensive. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-dimenhydrinate",
  "name": "Dimenhydrinate",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 6-8 hours",
    "notes": "1–1.5 mg/kg/dose PO/IM/IV Q6 hr; max. dose : 25 mg/dose; alternative oral dosing by age: 2–5 yr: 12.5–25 mg/dose PO Q6–8 hr PRN with the max. dosage below 6–12 yr: 25–50 mg/dose PO Q6–8 hr PRN with the max. dosage below",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 1.5
   },
   {
    "route": "IV",
    "frequency": "Every 4-6 hours",
    "notes": "50–100 mg/dose PO/IM/IV Q4–6 hr PRN MAX. PO DOSE: 2–5 yr: 75 mg/24 hr 6–12 yr: 150 mg/24 hr",
    "unit": "mg/dose",
    "perKg": false,
    "min": 50,
    "max": 100
   },
   {
    "route": "IM",
    "notes": "400 mg/24 hr MAX. IM DOSE:",
    "unit": "mg/day",
    "perKg": false,
    "value": 400
   }
  ],
  "indications": [
   "IM DOSE"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs (OTC): 50 mg Chewable tabs (OTC): 50 mg; contains 0.75 mg phenylalanine"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antiemetic, antihistamine. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-diphenhydramine",
  "name": "Diphenhydramine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "1–2 mg/kg/dose Q6 hr; usual dose: 5 mg/kg/24 hr ÷ Q6 hr; max. dose: 50 mg/dose and 300 mg/24 hr",
    "maxDose": "50 mg/dose and 300 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "notes": "25–50 mg Topical (cream, gel, stick):",
    "unit": "mg",
    "perKg": false,
    "min": 25,
    "max": 50
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antihistamine. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-docusate",
  "name": "Docusate",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–40 mg/24 hr ÷ once daily–QID 3–6 yr: 20–60 mg/24 hr ÷ once daily–QID 6–12 yr: 40–150 mg/24 hr ÷ once daily–QID",
    "unit": "mg/day",
    "perKg": false,
    "min": 10,
    "max": 40
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "50–400 mg/24 hr ÷ once daily–QID Docusate calcium: 240 mg once daily Rectal (see remarks): 2–",
    "unit": "mg/day",
    "perKg": false,
    "min": 50,
    "max": 400
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "100 mg/5 mL or 283 mg/5 mL PR once daily",
    "unit": "mg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 50 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Stool softener, laxative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-dornase-alfa-dnase",
  "name": "Dornase Alfa/dnase",
  "category": "respiratory",
  "doses": [
   {
    "route": "Nebulized",
    "frequency": "Once daily",
    "notes": "2.5 mg via nebulizer once daily • 2.5 mg via nebulizer once daily. Some patients may benefit from 2.5 mg BID.",
    "unit": "mg",
    "perKg": false,
    "value": 2.5
   }
  ],
  "indications": [
   "Cystic fibrosis"
  ],
  "contraindications": [
   "patients with hypersensitivity to epoetin alfa"
  ],
  "formulations": [
   "Tabs: 20, 50, 75, 100, 150 mg Delayed-release caps (Oracea and generics): 40 mg Delayed-release tabs:"
  ],
  "monitoring": [],
  "notes": "Formulary class: Pulmozyme Inhaled mucolytic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-doxycycline",
  "name": "Doxycycline",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Twice daily",
    "notes": "2.2 mg/kg/dose IV/PO BID; max. dose: 200 mg/24 hr",
    "maxDose": "200 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 2.2
   },
   {
    "route": "IV",
    "frequency": "Twice daily",
    "notes": "100 mg/dose IV/PO BID Malaria prophylaxis (start 1–2 days prior to exposure and continue for 4 wk after leaving endemic area):",
    "unit": "mg/dose",
    "perKg": false,
    "value": 100
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2.2 mg/kg/24 hr PO once daily; max. dose: 100 mg/24 hr and max. duration of 4 mo Per-dose amount calculated from 2.2 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "100 mg/24 hr and max",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 2.2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2.2 mg/kg/24 hr PO once daily; max. dose: 100 mg/24 hr and max. duration of 4 mo",
    "maxDose": "100 mg/24 hr and max",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 2.2
   }
  ],
  "indications": [
   "PO once daily Periodontitis"
  ],
  "contraindications": [
   "PO once daily Periodontitis"
  ],
  "formulations": [
   "Caps: 50, 75, 100, 150 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, tetracycline derivative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-dronabinol",
  "name": "Dronabinol",
  "category": "other",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 2-4 hours",
    "notes": "5 mg/m 2 /dose 1–3 hr prior to chemotherapy, then Q2–4 hr up to a max. dose of 4–6 doses/24 hr; doses may be gradually increased by 2.5 mg/m 2 /dose increments up to a max. dose of 15 mg/m 2 /dose if needed and tolerated. DRONABINOL continued Appetite stimulant:",
    "unit": "mg",
    "perKg": false,
    "value": 5
   }
  ],
  "indications": [
   "Antiemetic",
   "Appetite stimulant"
  ],
  "contraindications": [
   "Patients with history of substance abuse",
   "Mental illness",
   "Allergy to sesame oil (capsules only)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-droperidol",
  "name": "Droperidol",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 6 hours",
    "notes": "0.01–0.015 mg/kg/dose ( max. dose : 1.25 mg/dose; some recommend an initial max. dose of 0.1 mg/kg/dose) IM or IV over 2–5 min. Additional doses should be administered with caution; benefits outweigh the risks. Dosages >0.05 mg/kg/dose are considered excessive with higher risk for adverse events and are no longer recommended. Dosage interval: Antiemetic : Q6 hr PRN Sedation: Repeat dose in 15–30 m",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.01,
    "max": 0.015
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-elexacaftor-tezacaftor-ivacaftor",
  "name": "Elexacaftor/tezacaftor/ivacaftor",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "notes": "Weighing <14 kg: Morning dose: 1 packet (elexacaftor 80 mg + tezacaftor 40 mg + ivacaftor 60 mg each packet) every morning Evening dose: 1 packet (ivacaftor 59.5 mg each packet) every evening Weighing ≥14 kg: Morning dose: 1 packet (elexacaftor 100 mg + tezacaftor 50 mg + ivacaftor 75 mg each packet) every morning Evening dose: 1 packet (ivacaftor 75 mg each packet) every evening",
    "unit": "mg",
    "perKg": false,
    "value": 80
   },
   {
    "route": "Oral",
    "notes": "Morning dose: 2 morning-dose tablets (elexacaftor 50 mg + tezacaftor 25 mg + ivacaftor 37.5 mg each tablet) every morning Evening dose: 1 evening-dose tablet (75 mg ivacaftor) every evening",
    "unit": "mg",
    "perKg": false,
    "value": 50
   },
   {
    "route": "Oral",
    "notes": "Morning dose: 2 morning-dose tablets (elexacaftor 100 mg + tezacaftor 50 mg + ivacaftor 75 mg each tablet) every morning Evening dose: 1 evening-dose tablet (150 mg ivacaftor) every evening Dose Adjustment for Hepatic Impairment Mild (",
    "unit": "mg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Liver function tests Should not be used Evening dose Use regular dosage All ages: No evening dosage Should not be used a Use not recommended unless benefit exceeds risk"
  ],
  "notes": "Formulary class: transmembrane conductance regulator corrector and potentiator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-enalapril-maleate-enalaprilat",
  "name": "Enalapril Maleate (po), Enalaprilat (iv)",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.08 mg/kg/24 hr up to 5 mg/24 hr once daily; increase PRN over 2 wk Max. dose (higher doses have not been evaluated): 0.58 mg/kg/24 hr up to 40 mg/24 hr Per-dose amount calculated from 0.08 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.08
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.08 mg/kg/24 hr up to 5 mg/24 hr once daily; increase PRN over 2 wk Max. dose (higher doses have not been evaluated): 0.58 mg/kg/24 hr up to 40 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.08
   },
   {
    "route": "IV",
    "frequency": "Every 8-24 hours",
    "notes": "0.005–0.01 mg/kg/dose Q8–24 hr; max. dose: 1.25 mg/dose",
    "maxDose": "1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.005,
    "max": 0.01
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Enalapril: Tabs (Vasotec and generics): 2.5, 5, 10, 20 mg (scored) Oral solution (Epaned and generics): 1 mg/mL (150 mL); may contain sodium benzoate",
   "Oral suspension: 0.1, 1 mg/mL Enalaprilat:"
  ],
  "monitoring": [],
  "notes": "Formulary class: Angiotensin-converting enzyme inhibitor, antihypertensive. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-enoxaparin",
  "name": "Enoxaparin",
  "category": "hematologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "1.7 mg/kg/dose SC Q12 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1.7
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "1.3 mg/kg/dose SC Q12 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1.3
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "1 mg/kg/dose SC Q12 hr; alternatively, 1.5 mg/kg/dose SC Q24 hr can be used in adults Dosage adjustment for DVT treatment to achieve target anti–factor Xa low-molecular- weight heparin (LMWH) levels of 0.5–1 units/mL (see the following table): Anti–Factor Xa Level LMWH (units/mL) Hold Next Dose? Dose Change Repeat Anti–Factor Xa Level LMWH? <0.4 No Increase by 25% 4 hr after the second new dose 0.",
    "unit": "units",
    "perKg": false,
    "min": 0.5,
    "max": 1
   }
  ],
  "indications": [],
  "contraindications": [
   "major bleeding, drug-induced thrombocytopenia, and pork hypersensitivity"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Anticoagulant, low-molecular-weight heparin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-epoetin-alfa",
  "name": "Epoetin Alfa",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "notes": "Receiving dialysis: 11 g/dL Not receiving dialysis: 10 g/dL Anemia in cancer (use until chemotherapy is completed; see remarks for dosage reduction and withholding therapy): Initial dose:",
    "unit": "g",
    "perKg": false,
    "value": 11
   }
  ],
  "indications": [
   "IV once weekly",
   "Initial dose"
  ],
  "contraindications": [
   "IV once weekly"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor Hct, BP, clotting times, platelets, BUN, serum creatinine"
  ],
  "notes": "Formulary class: Retacrit, and Erythropoietin Recombinant human erythropoietin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-epoprostenol",
  "name": "Epoprostenol",
  "category": "respiratory",
  "doses": [
   {
    "route": "Inhaled",
    "notes": "20–40 nanograms /kg/min Infant, child, and adolescent: 40 to >150 nanograms /kg/min (average 80 nanograms /kg/min) Downtitration of dosage is required in the presence of high-output state (hyperdynamic right ventricle). Inhalation route (very limited data; use injectable dosage form by diluting with the respective product’s diluent per institutional-specific guidelines): Neonate: 10–50 nanograms /",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [
   "Usual effective dose"
  ],
  "contraindications": [
   "heart failure caused by decreased left ventricular ejection fraction"
  ],
  "formulations": [],
  "monitoring": [
   "For IV line interruptions)"
  ],
  "notes": "Formulary class: prostacyclin Prostaglandin I 2 , vasodilator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ergocalciferol",
  "name": "Ergocalciferol",
  "category": "vitamin",
  "doses": [
   {
    "route": "Topical",
    "notes": "400–600 IU/24 hr PO Continued ERGOCALCIFEROL continued Renal failure (CKD stages 2–5) and 25-OH vitamin D levels <30 ng/mL (monitor serum 25-OH vitamin D and corrected calcium/phosphorus 1 mo after initiation and Q3 mo thereafter): 25-OH vitamin D <5 ng/mL: Child: 8000 IU/24 hr PO × 4 wk, followed by 4000 IU/24 hr PO × 2 mo or 50,000 IU weekly × 4 wk, followed by 50,000 IU twice monthly for 2 mo 2",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [
   "Nutritional rickets",
   "Malabsorption"
  ],
  "contraindications": [
   "Malabsorption",
   "PO Vitamin D–resistant rickets",
   "PO Hypoparathyroidism"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor serum Ca 2+ , PO 4 , 25-OH vitamin D (goal level for infant and child: ≥ 20 ng/mL), and alkaline phosphate"
  ],
  "notes": "Formulary class: Vitamin D 2 A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ertapenem",
  "name": "Ertapenem",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "15 mg/kg/dose IV/IM Q12 hr; max. dose: 1 g/24 hr",
    "maxDose": "1 g/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   },
   {
    "route": "IV",
    "notes": "15 mg/kg ( max. dose: 1 g/dose) IV 1 hr before procedure",
    "maxDose": "1 g/dose) IV 1 hr before procedure",
    "unit": "mg/kg",
    "perKg": true,
    "value": 15
   }
  ],
  "indications": [
   "Surgical prophylaxis"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, carbapenem. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-erythromycin-preparations",
  "name": "Erythromycin Preparations",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "<1.2 kg: 20 mg/kg/24 hr PO ÷ Q12 hr ≥ 1.2 kg: 0–7 days: 20 mg/kg/24 hr PO ÷ Q12 hr Per-dose amount calculated from 20 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "<1.2 kg: 20 mg/kg/24 hr PO ÷ Q12 hr ≥ 1.2 kg: 0–7 days: 20 mg/kg/24 hr PO ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 20
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "1.2–2 kg: 30 mg/kg/24 hr PO ÷ Q8 hr ≥ 2 kg: 30–40 mg/kg/24 hr PO ÷ Q6–8 hr Chlamydial conjunctivitis and pneumonia: 50 mg/kg/24 hr PO ÷ Q6 hr × 14 days; max. dose: 2 g/24 hr",
    "maxDose": "2 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 30,
    "max": 40
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "30–50 mg/kg/24 hr PO ÷ Q6–8 hr; max. dose: 4 g/24 hr Pertussis: 40–50 mg/kg/24 hr PO ÷ Q6 hr × 14 days ( max. dose: 2 g/24 hr); use azithromycin for infants",
    "maxDose": "4 g/24 hr Pertussis: 40–50 mg/kg/24 hr PO ÷ Q6 hr × 14 days ( max",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 30,
    "max": 50
   }
  ],
  "indications": [
   "Parenteral"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 250 mg Erythromycin lactobionate (Erythrocin and generics):"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, macrolide. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-escitalopram",
  "name": "Escitalopram",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 10 mg PO once daily. If needed after 3 wk, dose may be increased to 20 mg once daily. Continued ESCITALOPRAM continued",
    "unit": "mg",
    "perKg": false,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 5, 10, 20 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-esmolol-hcl",
  "name": "Esmolol HCL",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "IV",
    "notes": "Loading dose: 100–500 mCg/kg IV over 1 min Maintenance dose: 25–100 mCg/kg/min IV as infusion",
    "unit": "mcg/kg",
    "perKg": true,
    "min": 100,
    "max": 500
   }
  ],
  "indications": [],
  "contraindications": [
   "sinus bradycardia, >first-degree heart block, and cardiogenic shock or heart failure"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: agent, antihypertensive agent, class II antiarrhythmic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-etanercept",
  "name": "Etanercept",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "notes": "Once-weekly dosing: 0.8 mg/kg/dose (max. dose: 50 mg/dose with max. single injection site dose of 25 mg) SC once weekly Twice-weekly dosing (only for juvenile idiopathic arthritis): 0.4 mg/kg/dose (max. dose: 25 mg/ dose) SC twice weekly administered 72–96 hr apart Plaque psoriasis: • 0.8 mg/kg/dose (max. dose: 50 mg) SC once weekly",
    "maxDose": "50 mg/dose with max",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.8
   }
  ],
  "indications": [
   "SC once weekly",
   "Plaque psoriasis"
  ],
  "contraindications": [
   "serious infections, sepsis, or hypersensitivity to any of medication components"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: factor receptor p75 Fc fusion protein. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ethambutol-hcl",
  "name": "Ethambutol HCL",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "15–25 mg/kg/dose ( max. dose: 1 g/24 hr) PO once daily or 50 mg/kg/dose PO twice weekly ( max. dose: 2.5 g/week) • 15–25 mg/kg/24 hr PO once daily; max. dose: 2.5 g/24 hr Per-dose amount calculated from 15–25 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "1 g/24 hr) PO once daily or 50 mg/kg/dose PO twice weekly ( max",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 15,
    "max": 25
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "40–55 kg: 800 mg PO once daily or 5 times weekly 56–75 kg: 1200 mg PO once daily or 5 times weekly 76–90 kg: 1600 mg PO once daily or 5 times weekly Nontuberculous mycobacterial infection and Mycobacterium avium complex in AIDS (recurrence prophylaxis or treatment; use in combination with other medications):",
    "unit": "mg",
    "perKg": false,
    "value": 800
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "15–25 mg/kg/24 hr PO once daily; max. dose: 2.5 g/24 hr",
    "maxDose": "2",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 25
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 100, 400 mg; 400-mg tabs may be scored"
  ],
  "monitoring": [
   "Monitor uric acid, liver function, heme status, and renal function"
  ],
  "notes": "Formulary class: Antituberculosis drug. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ethosuximide",
  "name": "Ethosuximide",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Initial: 10 mg/kg/24 hr up to 250 mg/24 hr ÷ BID–TID; increase by 5–10 mg/kg/24 hr as needed Q4–7 days Usual maintenance dose: 15–40 mg/kg/24 hr ÷ BID–TID Per-dose amount calculated from 5–10 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 2.5,
    "max": 5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Initial: 10 mg/kg/24 hr up to 250 mg/24 hr ÷ BID–TID; increase by 5–10 mg/kg/24 hr as needed Q4–7 days Usual maintenance dose: 15–40 mg/kg/24 hr ÷ BID–TID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "10 mg/kg/24 hr up to 500 mg/24 hr ÷ BID–TID; increase by 250 mg/24 hr as needed Q4–7 days Usual maintenance dose: 20–40 mg/kg/24 hr ÷ BID–TID ETHOSUXIMIDE continued Max. dose (all ages): The lesser of 60 mg/kg/24 hr or 2 g/24 hr Drug of choice for absence seizures. Use with caution in hepatic and renal disease. Ataxia, anorexia, drowsiness, sleep disturbances, rashes, and blood dyscrasias are rare Per-dose amount calculated from 20–40 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "10 mg/kg/24 hr up to 500 mg/24 hr ÷ BID–TID; increase by 250 mg/24 hr as needed Q4–7 days Usual maintenance dose: 20–40 mg/kg/24 hr ÷ BID–TID ETHOSUXIMIDE continued Max. dose (all ages): The lesser of 60 mg/kg/24 hr or 2 g/24 hr Drug of choice for absence seizures. Use with caution in hepatic and renal disease. Ataxia, anorexia, drowsiness, sleep disturbances, rashes, and blood dyscrasias are rare",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 20,
    "max": 40
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Caps: 250 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-etomidate",
  "name": "Etomidate",
  "category": "sedative",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Herpes zoster: 500 mg PO Q8 hr × 7–10 days; initiate therapy promptly as soon as diagnosis is made (initiation within 48 hr after rash onset is ideal; currently no data for starting treatment >72 hr after rash onset) Genital herpes (first episode): Immunocompetent: 250 mg PO Q8 hr × 7–10 days Immunocompromised: 500 mg PO Q12 hr x 5–10 days Recurrent genital herpes (initiate therapy within 1 day of",
    "unit": "mg",
    "perKg": false,
    "value": 500
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: General anesthetic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-famciclovir",
  "name": "Famciclovir",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Herpes zoster: 500 mg PO Q8 hr × 7–10 days; initiate therapy promptly as soon as diagnosis is made (initiation within 48 hr after rash onset is ideal; currently no data for starting treatment >72 hr after rash onset) Genital herpes (first episode): Immunocompetent: 250 mg PO Q8 hr × 7–10 days Immunocompromised: 500 mg PO Q12 hr x 5–10 days Recurrent genital herpes (initiate therapy within 1 day of",
    "unit": "mg",
    "perKg": false,
    "value": 500
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antiviral. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-felbamate",
  "name": "Felbamate",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Adjunctive therapy: Start at 1200 mg/24 hr PO ÷ TID–QID; increase dosage by 1200 mg/24 hr at weekly intervals up to a max. dose of 3600 mg/day. See remarks for adjusting concurrent anticonvulsants. Monotherapy (as initial therapy): Start at 1200 mg/24 hr PO ÷ TID–QID. Increase dose under close clinical supervision at 600-mg increments Q2 wk to 2400 mg/24 hr. Max. dose: 3600 mg/24 hr. Conversion to",
    "maxDose": "3600 mg/24 hr",
    "unit": "mg/day",
    "perKg": false,
    "value": 1200
   }
  ],
  "indications": [],
  "contraindications": [
   "blood dyscrasias or hepatic dysfunction (prior or current), and hypersensitivity to meprobamate"
  ],
  "formulations": [
   "Tabs: 400, 600 mg"
  ],
  "monitoring": [
   "Monitor liver enzymes, bilirubin, CBC with differential, and platelets at baseline and every 1–2 wk"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fexofenadine-pseudoephedrine",
  "name": "Fexofenadine / Pseudoephedrine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "notes": "Allegra D-12 Hour [OTC], Allegra D-24 Hour [OTC] and generics Antihistamine, less-sedating ± decongestant C 2 Yes No No Tabs [OTC]: 60, 180 mg Tabs, orally disintegrating (",
    "unit": "mg",
    "perKg": false,
    "value": 180
   },
   {
    "route": "Oral",
    "notes": "30 mg; contains phenylalanine Oral suspension [OTC]: 6 mg/mL (120, 240 mL); contains parabens Extended-release tab in combination with pseudoephedrine (PE): Allegra-D 12 Hour and generics [OTC]: 60 mg fexofenadine + 120 mg pseudoephedrine Allegra-D 24 Hour and generics [OTC]: 180 mg fexofenadine + 240 mg pseudoephedrine Fexofenadine: 6 mo–",
    "unit": "mg",
    "perKg": false,
    "value": 30
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "15–30 mg PO BID 2–11 yr: 30 mg PO BID",
    "unit": "mg",
    "perKg": false,
    "min": 15,
    "max": 30
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: and generics Antihistamine, less-sedating ± decongestant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fidaxomicin",
  "name": "Fidaxomicin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "16 mg/kg/dose ( max. dose: 200 mg/dose) BID × 10 days; or alternative fixed dosage by weight: 4–<7 kg: 80 mg BID 7–<9 kg: 120 mg BID 9–<12.5 kg: 160 mg BID ≥ 12.5 kg: 200 mg BID",
    "maxDose": "200 mg/dose) BID × 10 days",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 16
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Oral suspension: 40 mg/mL (136 mL); contains sodium benzoate"
  ],
  "monitoring": [],
  "notes": "Formulary class: Dificid Antibiotic, macrolide. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-filgrastim",
  "name": "Filgrastim",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "IV/SC: 5 mCg/kg/dose once daily × 14 days or until ANC >10,000/mm 3",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "value": 5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor CBC, uric acid, and LFTs"
  ],
  "notes": "Formulary class: Nivestym, Nypozi, Releuko, Zarxio Colony-stimulating factor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-flucytosine",
  "name": "Flucytosine",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "75 mg/kg/24 hr PO ÷ Q8 hr 15–60 days old: 100 mg/kg/24 hr PO ÷ Q6 hr 1–2 kg: Per-dose amount calculated from 75 mg/kg/day divided by 3 (Every 8 hours). • 75 mg/kg/24 hr PO ÷ Q8 hr 8–60 days old: 100 mg/kg/24 hr PO ÷ Q6 hr >2 kg and Per-dose amount calculated from 75 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 25
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "75 mg/kg/24 hr PO ÷ Q8 hr 15–60 days old: 100 mg/kg/24 hr PO ÷ Q6 hr 1–2 kg: • 75 mg/kg/24 hr PO ÷ Q8 hr 8–60 days old: 100 mg/kg/24 hr PO ÷ Q6 hr >2 kg and",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 75
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "100 mg/kg/24 hr PO ÷ Q6 hr Dosages of 75–100 mg/kg/24 hr have been used in neonates (preterm and term) for candidal meningitis. Per-dose amount calculated from 75–100 mg/kg/day divided by 4 (Every 6 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 18.75,
    "max": 25
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "100 mg/kg/24 hr PO ÷ Q6 hr Dosages of 75–100 mg/kg/24 hr have been used in neonates (preterm and term) for candidal meningitis.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 75,
    "max": 100
   }
  ],
  "indications": [],
  "contraindications": [
   "The first trimester of pregnancy"
  ],
  "formulations": [
   "Ancobon, 5-FC, 5-Fluorocytosine, and generics Antifungal agent C 3 Yes Yes No Caps: 250, 500 mg"
  ],
  "monitoring": [
   "Serum concentrations): 50–150 mg/kg/24 hr PO ÷ Q6 hr Monitor CBC, BUN, serum creatinine, alkaline phosphatase, AST, and ALT"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fludrocortisone-acetate",
  "name": "Fludrocortisone Acetate",
  "category": "steroid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.05–0.1 mg/24 hr PO once daily Congenital adrenal hyperplasia: 0.05–0.3 mg/24 hr PO once daily",
    "unit": "mg/day",
    "perKg": false,
    "min": 0.05,
    "max": 0.1
   },
   {
    "route": "IV",
    "notes": "0.01 mg/kg ( max. dose: 0.2 mg) IV over 15 seconds Q1 min PRN up to a max. total cumulative dose of 1 mg. As an alternative for repeat bolus doses, a continuous infusion of 0.005–0.01 mg/kg/hr has been used.",
    "maxDose": "0",
    "unit": "mg/kg/hr",
    "perKg": true,
    "min": 0.005,
    "max": 0.01
   }
  ],
  "indications": [
   "PO once daily"
  ],
  "contraindications": [
   "PO once daily"
  ],
  "formulations": [
   "Tabs: 0.1 mg",
   "Oral suspension: 0.1 mg/mL Infant and child: 0.05–0.1 mg/24 hr PO once daily Congenital adrenal hyperplasia: 0.05–0.3 mg/24 hr"
  ],
  "monitoring": [
   "Monitor BP and serum electrolytes"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-flunisolide",
  "name": "Flunisolide",
  "category": "steroid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Initial: 1 spray (25 mCg) per nostril TID or 2 sprays (50 mCg) per nostril BID; max. dose: 4 sprays (100 mCg) per nostril/24 hr or 200 mCg/24 hr in total",
    "maxDose": "4 sprays (100 mCg) per nostril/24 hr or 200 mCg/24 hr in total",
    "unit": "mcg",
    "perKg": false,
    "value": 25
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Initial: 2 sprays (50 mCg) per nostril BID; if needed in 4–7 days, increase to 2 sprays (50 mCg) per nostril TID; max. dose: 8 sprays (200 mCg) per nostril/24 hr or 400 mCg/24 hr in total Nasal burning and stinging is common. Nasal congestion, sneezing, epistaxis, watery eyes, sore throat, nausea/vomiting, and headaches may also occur.",
    "maxDose": "8 sprays (200 mCg) per nostril/24 hr or 400 mCg/24 hr in total Nasal burning and stinging is common",
    "unit": "mcg",
    "perKg": false,
    "value": 50
   }
  ],
  "indications": [
   "Nasal solution"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Nasalide Corticosteroid. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fluoxetine-hydrochloride",
  "name": "Fluoxetine Hydrochloride",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 5 or 10 mg PO once daily. Usual dose: 10 mg once daily. May increase dose every 1–2 weeks as needed up to a max. dose of 40 mg/24 hr (some patients may require higher doses).",
    "unit": "mg",
    "perKg": false,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 10 or 20 mg PO once daily. May increase increase by 10–20 mg increments every 1–2 weeks as needed up to a max. dose of 60 mg/24 hr. Usual effective dose: 20–40 mg once daily.",
    "unit": "mg",
    "perKg": false,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Lower-weight child: Start at 5 or 10 mg PO once daily. May increase after several weeks. Usual dose range: 20–30 mg/24 hr. There is very minimal experience with doses >20 mg/24 hr and no experience with doses >60 mg/24 hr. Higher-weight child and adolescent: Start at 10 mg PO once daily and increase dose to 20 mg/24 hr after 2 wk. May further increase dose after several weeks. Usual dose range: 20",
    "unit": "mg/day",
    "perKg": false,
    "min": 20,
    "max": 30
   }
  ],
  "indications": [
   "Depression",
   "Obsessive-compulsive disorder"
  ],
  "contraindications": [],
  "formulations": [
   "Oral solution: 20 mg/5 mL (120 mL); may contain alcohol Caps: 10, 20, 40 mg Delayed-release caps: 90 mg"
  ],
  "monitoring": [
   "Monitor for clinical worsening of depression and suicidal ideation/ behavior following the initiation of therapy or after dose changes"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fluticasone-furoate-vilanterol",
  "name": "Fluticasone Furoate + Vilanterol",
  "category": "respiratory",
  "doses": [
   {
    "route": "Inhaled",
    "frequency": "Once daily",
    "notes": "One inhalation of 50 mCg fluticasone furoate + 25 mCg vilanterol once daily",
    "unit": "mcg",
    "perKg": false,
    "value": 50
   },
   {
    "route": "Inhaled",
    "frequency": "Once daily",
    "notes": "One inhalation of 100 mCg fluticasone furoate + 25 mCg vilanterol once daily",
    "unit": "mcg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [
   "Cg vilanterol once daily"
  ],
  "contraindications": [
   "Cg vilanterol once daily"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: and long-acting β 2 -adrenergic agonist. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fluticasone-preparations",
  "name": "Fluticasone Preparations",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Initial 200 mCg/24 hr [2 sprays (100 mCg) per nostril once daily, OR 1 spray (50 mCg) per nostril BID]. Reduce to 1 spray per nostril once daily when symptoms are controlled. Max. dose (4 yr–adult): 2 sprays (100 mCg) per nostril/24 hr FLUTICASONE PREPARATIONS continued Fluticasone furoate (Veramyst): 2–11 yr: 1 spray (27.5 mCg) per nostril once daily. If needed, dose may be increased to 2 sprays",
    "unit": "mcg/day",
    "perKg": false,
    "value": 200
   },
   {
    "route": "Inhaled",
    "frequency": "Once daily",
    "notes": "2 sprays (55 mCg) each nostril once daily. Reduce to 1 spray per nostril once daily when symptoms are controlled. Max. dose (2 yr–adult): 2 sprays (55 mCg) per nostril/24 hr Asthma maintenance therapy (oral inhalation; see remarks): Fluticasone propionate (previously available as Flovent HFA and Diskus): divide all 24-hr doses BID. If desired response is not seen after 2 wk of starting therapy, in",
    "unit": "mcg",
    "perKg": false,
    "value": 55
   },
   {
    "route": "Oral",
    "notes": "88 mCg/24 hr (176 mCg/24 hr) DPI: 100 mCg/24 hr (200 mCg/24 hr) MDI: 88 mCg/24 hr (176 mCg/24 hr) DPI: 100 mCg/24 hr (200 mCg/24 hr) Dose not available",
    "unit": "mcg/day",
    "perKg": false,
    "value": 88
   }
  ],
  "indications": [
   "Ointment"
  ],
  "contraindications": [
   "Ointment"
  ],
  "formulations": [],
  "monitoring": [
   "Closely in hepatic impairment"
  ],
  "notes": "Formulary class: Flonase Sensimist and Arnuity Ellipta Corticosteroid. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fluticasone-propionate-and-salmeterol",
  "name": "Fluticasone Propionate and Salmeterol",
  "category": "respiratory",
  "doses": [
   {
    "route": "Inhaled",
    "frequency": "Twice daily",
    "notes": "Start with one inhalation BID of 100 mCg fluticasone propionate + 50 mCg salmeterol OR 250 mCg fluticasone propionate + 50 mCg salmeterol; max. dose: one inhalation BID of 500 mCg fluticasone propionate + 50 mCg salmeterol Aerosol inhaler (MDI; Advair HFA):",
    "maxDose": "one inhalation BID of 500 mCg fluticasone propionate + 50 mCg salmeterol Aerosol inhaler (MDI",
    "unit": "mcg",
    "perKg": false,
    "value": 100
   },
   {
    "route": "Inhaled",
    "frequency": "Twice daily",
    "notes": "Start with 2 inhalations BID of 45 mCg fluticasone + 21 mCg salmeterol OR 115 mCg fluticasone + 21 mCg salmeterol; max. dose: 2 inhalations BID of 230 mCg fluticasone + 21 mCg salmeterol Breath-activated aerosol powder inhaler (AirDuo Digihaler, AirDuo RespiClick; see remarks):",
    "maxDose": "2 inhalations BID of 230 mCg fluticasone + 21 mCg salmeterol Breath-activated aerosol powder inhaler (AirDuo Digihaler",
    "unit": "mcg",
    "perKg": false,
    "value": 45
   },
   {
    "route": "Inhaled",
    "frequency": "Twice daily",
    "notes": "Start with 1 inhalation BID of 55 mCg fluticasone + 14 mCg salmeterol; max. dose: one inhalation BID of 232 mCg fluticasone propionate + 14 mCg salmeterol With prior inhaled steroid use (see following table and below): Conversion From Other Inhaled Steroids Inhaled Corticosteroid Current Daily Dose Recommended Strength of Fluticasone Propionate + Salmeterol Diskus (DPI) (Advair Diskus) Administere",
    "maxDose": "one inhalation BID of 232 mCg fluticasone propionate + 14 mCg salmeterol With prior inhaled steroid use (see following table and below): Conversion From Other Inhaled Steroids Inhaled Corticosteroid Current Daily Dose Recommended Strength of Fluticasone Propionate + Salmeterol Diskus (DPI) (Advair Diskus) Administered at One Inhalation BID Recommended Strength of Fluticasone Propionate + Salmeterol Aerosol Inhaler (MDI) (Advair HFA) Administered at Two Inhalations BID Beclomethasone dipropionate (Qvar Redihaler) 160 mCg 100 mCg + 50 mCg 45 mCg + 21 mCg 320 mCg 250 mCg + 50 mCg 115 mCg + 21 mCg 640 mCg 500 mCg + 50 mCg 230 mCg + 21 mCg Budesonide ≤400 mCg 100 mCg + 50 mCg 45 mCg + 21 mCg Continued",
    "unit": "mcg",
    "perKg": false,
    "value": 55
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: and long-acting β 2 -adrenergic agonist. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fluvoxamine",
  "name": "Fluvoxamine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 12.5–25 mg PO QHS. Dose may be increased by 25 mg/24 hr Q7–14 days (slower titration at Q2–4 wk may be used for minimizing behavioral side effects). Total daily doses >50 mg/24 hr should be divided BID. Female patients may require lower dosages compared to males. Max. dose:",
    "unit": "mg",
    "perKg": false,
    "min": 12.5,
    "max": 25
   },
   {
    "route": "Oral",
    "notes": "8–11 yr: 200 mg/24 hr; and child 12 yr: 300 mg/24 hr",
    "unit": "mg/day",
    "perKg": false,
    "value": 200
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor for clinical worsening of depression and suicidal ideation/behavior following the initiation of therapy or after dose changes"
  ],
  "notes": "Formulary class: CR Antidepressant, selective serotonin reuptake inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-fomepizole",
  "name": "Fomepizole",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Load: 15 mg/kg/dose × 1 Maintenance: 10 mg/kg/dose Q12 hr × 4 doses, then 15 mg/kg/dose Q12 hr until ethylene glycol or methanol level decreases to <20 mg/dL and the patient is asymptomatic with normal pH",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 4 hours",
    "notes": "Dosing at the beginning of hemodialysis: If <6 hr since last fomepizole dose: DO NOT administer dose If ≥ 6 hr since last fomepizole dose: Administer next scheduled dose upon beginning dialysis Dosing during hemodialysis: Administer Q4 hr or, alternatively, 10–20 mg/kg loading dose, followed by a continuous infusion of 1–1.5 mg/kg/hr Dosing at the time hemodialysis is completed (based on the time",
    "unit": "mg/kg",
    "perKg": true,
    "min": 10,
    "max": 20
   }
  ],
  "indications": [],
  "contraindications": [
   "hypersensitivity to any components or other pyrazole compounds"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: for ethylene glycol or methanol toxicity. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-foscarnet",
  "name": "Foscarnet",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 8-12 hours",
    "notes": "Induction: 180 mg/kg/24 hr ÷ Q8–12 hr in combination with ganciclovir; continue until symptom improvement and convert to maintenance therapy Maintenance: 90–120 mg/kg/dose Q24 hr CMV retinitis (disseminated disease; IV):",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 90,
    "max": 120
   },
   {
    "route": "Oral",
    "frequency": "Every 8-12 hours",
    "notes": "Induction: 180 mg/kg/24 hr ÷ Q8–12 hr × 14–21 days with or without ganciclovir Maintenance: 90–120 mg/kg/24 hr once daily",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 90,
    "max": 120
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "40 mg/kg/dose Q8 hr or 60 mg/kg/dose Q12 hr for up to 3 wk or until lesions heal",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 40
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ganciclovir",
  "name": "Ganciclovir",
  "category": "antiviral",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "12 mg/kg/24 hr IV ÷ Q12 hr with transition to oral valganciclovir to complete a total 6-mo course Per-dose amount calculated from 12 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 6
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "12 mg/kg/24 hr IV ÷ Q12 hr with transition to oral valganciclovir to complete a total 6-mo course",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 12
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Induction therapy (duration 14–21 days): 10 mg/kg/24 hr IV ÷ Q12 hr IV maintenance therapy: 5 mg/kg/dose IV once daily for 7 days/wk or 6 mg/kg/dose IV once daily for 5 days/wk Prevention of CMV in transplant recipients: Per-dose amount calculated from 10 mg/kg/day divided by 2 (Every 12 hours). • Induction therapy (duration 5–7 days): 10 mg/kg/24 hr IV ÷ Q12 hr IV maintenance therapy: 5 mg/kg/dose once daily for 7 days/wk or 6 mg/kg/dose once daily for 5 days/wk for 100–120 days posttransplant Continued Per-dose amount calculated from 10 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Induction therapy (duration 14–21 days): 10 mg/kg/24 hr IV ÷ Q12 hr IV maintenance therapy: 5 mg/kg/dose IV once daily for 7 days/wk or 6 mg/kg/dose IV once daily for 5 days/wk Prevention of CMV in transplant recipients: • Induction therapy (duration 5–7 days): 10 mg/kg/24 hr IV ÷ Q12 hr IV maintenance therapy: 5 mg/kg/dose once daily for 7 days/wk or 6 mg/kg/dose once daily for 5 days/wk for 100–120 days posttransplant Continued",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 10
   }
  ],
  "indications": [
   "Prevention of CMV in transplant recipients"
  ],
  "contraindications": [
   "severe neutropenia (ANC <500/microliter) or severe thrombocytopenia (platelets <25,000/microliter)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-gatifloxacin",
  "name": "Gatifloxacin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 2 hours",
    "notes": "Instill 1 drop to affected eye(s) Q2 hr while awake (up to 8 times/24 hr) for the first day, then 1 drop BID – QID while awake on days 2 – 7 Worsening of conjunctivitis, decreased visual acuity, excessive tear production, and keratitis are common side effects. Conjunctival hemorrhage has been reported. Avoid touching the applicator tip to eye, fingers, or other surfaces, and do not wear contact le",
    "unit": "mg",
    "perKg": false,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, quinolone. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-glucagon-hcl",
  "name": "Glucagon HCL",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral",
    "notes": "0.5 mg/dose (or 0.02–0.03 mg/kg/dose) Q15–20 min PRN",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.02,
    "max": 0.03
   },
   {
    "route": "Oral",
    "notes": "1 mg/dose Q15–20 min PRN Intranasal route (see remarks):",
    "unit": "mg/dose",
    "perKg": false,
    "value": 1
   },
   {
    "route": "Oral",
    "notes": "Actuate 3 mg (1 actuation) intranasally into one nostril × 1. If no response after 15 min, an additional 3-mg dose may be given. β -Blocker or calcium channel blocker overdose (for hypotension that is unresponsive to fluid boluses; limited data):",
    "unit": "mg",
    "perKg": false,
    "value": 3
   }
  ],
  "indications": [],
  "contraindications": [
   "Insulinoma, pheochromocytoma, glucagonoma",
   "History of hypersensitivity to glucagon",
   "Components"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antihypoglycemic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-glycerin",
  "name": "Glycerin",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "Pedia-Lax and generics: 1 g (12s) Generics: 1.2 g (12s, 25s)",
    "unit": "g",
    "perKg": false,
    "value": 1
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "0.004–0.01 mg/kg/dose TID–QID",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.004,
    "max": 0.01
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "0.04–0.1 mg/kg/dose TID–QID Alternative dosage for 3–16-yr-old with chronic severe drooling secondary to neurologic conditions: Start with 0.02 mg/kg/dose TID and titrate in increments of 0.02 mg/kg/dose every 5–7 days as needed and tolerated up to a max. dose of 0.1 mg/kg/dose TID not to exceed 1.5–3 mg/dose Continued",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.04,
    "max": 0.1
   }
  ],
  "indications": [
   "Constipation",
   "IM/IV"
  ],
  "contraindications": [
   "TID–QID"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Osmotic laxative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-granisetron",
  "name": "Granisetron",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "10–20 mCg/kg/dose 15–60 min before chemotherapy; the same dose may be repeated 2–3 times at ≥ 10-min intervals following chemotherapy (within 24 hr after chemotherapy) as a treatment regimen. Max. dose: 3 mg/dose or 9 mg/24 hr. Alternatively, a single 40 mCg/kg/dose 15–60 min before chemotherapy has been used. SC (Sustol, extended release):",
    "maxDose": "3 mg/dose or 9 mg/24 hr",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "40 mCg/kg/dose BID is recommended for moderately or low emetogenic chemotherapy; initiate first dose 1 hr prior to chemotherapy.",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "value": 40
   }
  ],
  "indications": [
   "Radiation-induced nausea and vomiting prevention"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 1 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antiemetic agent, 5-HT 3 antagonist. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-griseofulvin",
  "name": "Griseofulvin",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "20–25 mg/kg/24 hr PO ÷ once daily–BID; give with milk, eggs, fatty foods Per-dose amount calculated from 20–25 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 20,
    "max": 25
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "20–25 mg/kg/24 hr PO ÷ once daily–BID; give with milk, eggs, fatty foods",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 20,
    "max": 25
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–15 mg/kg/24 hr PO ÷ once daily–BID Per-dose amount calculated from 10–15 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 15
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–15 mg/kg/24 hr PO ÷ once daily–BID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 15
   }
  ],
  "indications": [
   "Microsize",
   "Ultramicrosize"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 500 mg",
   "Oral suspension: 125 mg/5 mL (120 mL); contains 0.2% alcohol, parabens, and propylene glycol Ultramicrosize:"
  ],
  "monitoring": [
   "Monitor hematologic, renal, and hepatic function"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-guanfacine",
  "name": "Guanfacine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 24 hours",
    "notes": "≤ 45 kg: Start at 0.5 mg QHS; if needed and tolerated, increase dose every 3–4 days at 0.5 mg/ 24 hr increments by increasing the dosing frequency to BID, TID, QID. Max. dose: 27–40.5 kg: 2 mg/24 hr and 40.5–45 kg: 3 mg/24 hr >45 kg: Start at 1 mg QHS; if needed and tolerated, increase dose every 3–4 days at 1 mg/24 hr increments by increasing the dosing frequency to BID, TID, QID. Max. dose: 4 mg",
    "maxDose": "27–40",
    "unit": "mg",
    "perKg": false,
    "value": 0.5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-haloperidol",
  "name": "Haloperidol",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Initial dose at 0.5 mg/24 hr ÷ BID–TID. If necessary, increase daily dosage by 0.25– 0.5 mg/24 hr Q5–7 days PRN. Benefits are not to be expected for doses beyond 6 mg/24 hr. Usual maintenance doses for specific indications include the following: Agitation: 0.01–0.03 mg/kg/24 hr once daily Psychosis: 0.05–0.15 mg/kg/24 hr ÷ BID–TID Tourette syndrome: 0.05–0.075 mg/kg/24 hr ÷ BID–TID; may increase",
    "unit": "mg/day",
    "perKg": false,
    "min": 0.25,
    "max": 0.5
   },
   {
    "route": "Oral",
    "notes": "0.5–2 mg/dose; max. dose : ≤ 40 kg: 6 mg/24 hr and >40 kg: 15 mg/24 hr",
    "unit": "mg/dose",
    "perKg": false,
    "min": 0.5,
    "max": 2
   },
   {
    "route": "IM",
    "frequency": "Every 4-8 hours",
    "notes": "Acute agitation: 2–5 mg/dose IM as lactate or 1–15 mg/dose PO; repeat in 1 hr PRN; max. dose: ≤ 40 kg: 6 mg/24 hr and >40 kg: 15 mg/24 hr Psychosis: 2–5 mg/dose IM Q4–8 hr PRN OR 1–15 mg/24 hr PO ÷ BID–TID Tourette syndrome: 0.5–2 mg/dose PO BID–TID; 3–5 mg/dose PO BID–TID may be used for severe symptoms.",
    "maxDose": "≤ 40 kg: 6 mg/24 hr and >40 kg: 15 mg/24 hr Psychosis: 2–5 mg/dose IM Q4–8 hr PRN OR 1–15 mg/24 hr PO ÷ BID–TID Tourette syndrome: 0",
    "unit": "mg/dose",
    "perKg": false,
    "min": 2,
    "max": 5
   }
  ],
  "indications": [],
  "contraindications": [
   "severe toxic CNS depression, comas, Parkinson disease, and Lewy body dementia"
  ],
  "formulations": [
   "Tabs: 0.5, 1, 2, 5, 10, 20 mg"
  ],
  "monitoring": [
   "Monitor for encephalopathic syndrome when used in combination with lithium"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-hyaluronidase",
  "name": "Hyaluronidase",
  "category": "antidote",
  "doses": [
   {
    "route": "Topical",
    "notes": "Use 150 U/mL product by administering 5 separate SC or intradermal injections of 0.2 mL (30 U) at borders of extravasation site using a 25- or 26- gauge needle. Alternatively, a diluted 15 U/mL concentration has been used with the same dosing instructions.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [
   "patients with dopamine and α -agonist extravasation and hypersensitivity to the respective product sources (bovine or ovine)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Amphadase, Hylenex, and Vitrase Antidote, extravasation. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-hydralazine-hydrochloride",
  "name": "Hydralazine Hydrochloride",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 4-6 hours",
    "notes": "0.1–0.2 mg/kg/dose IM or IV Q4–6 hr PRN; max. dose: 20 mg/dose. Usual IV/IM dosage range is 0.2–0.6 mg/kg/dose Q4–6 hr.",
    "maxDose": "20 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.2
   },
   {
    "route": "Oral",
    "frequency": "Every 6-12 hours",
    "notes": "Start at 0.75–1 mg/kg/24 hr PO ÷ Q6–12 hr ( max. initial dose: 10 mg/ dose). If necessary, increase dose over 3–4 wk up to a max. dose of 5 mg/kg/24 hr for infants and 7.5 mg/kg/24 hr for children; or 200 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.75,
    "max": 1
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–3 mg/kg/24 hr PO ÷ once daily–BID; max. dose: 37.5 mg/ 24 hr Per-dose amount calculated from 1–3 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "37",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 3
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–3 mg/kg/24 hr PO ÷ once daily–BID; max. dose: 37.5 mg/ 24 hr",
    "maxDose": "37",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 3
   }
  ],
  "indications": [
   "Edema"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 10, 25, 50, 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antihypertensive, vasodilator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-hydrochlorothiazide",
  "name": "Hydrochlorothiazide",
  "category": "diuretic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–3 mg/kg/24 hr PO ÷ once daily–BID; max. dose: 37.5 mg/ 24 hr HYDROCHLOROTHIAZIDE continued Per-dose amount calculated from 1–3 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "37",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 3
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–3 mg/kg/24 hr PO ÷ once daily–BID; max. dose: 37.5 mg/ 24 hr HYDROCHLOROTHIAZIDE continued",
    "maxDose": "37",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 3
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–2 mg/kg/24 hr PO ÷ once daily–BID; max. dose: Per-dose amount calculated from 1–2 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–2 mg/kg/24 hr PO ÷ once daily–BID; max. dose:",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "notes": "37.5 mg/24 hr, child 2–12 yr: 100 mg/24 hr, and adolescent: 200 mg/24 hr",
    "unit": "mg/day",
    "perKg": false,
    "value": 37.5
   }
  ],
  "indications": [
   "Edema"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 12.5, 25, 50 mg Caps: 12.5 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Diuril and Microzide Diuretic, thiazide B/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-hydromorphone-hcl",
  "name": "Hydromorphone HCL",
  "category": "analgesic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 3-6 hours",
    "notes": "0.015 mg/kg/dose Q3–6 hr PRN",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.015
   },
   {
    "route": "Oral",
    "frequency": "Every 3-4 hours",
    "notes": "0.03–0.08 mg/kg/dose Q3–4 hr PRN; max. dose: 5 mg/dose",
    "maxDose": "5 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.03,
    "max": 0.08
   },
   {
    "route": "IV",
    "frequency": "Every 2-4 hours",
    "notes": "0.2–0.6 mg/dose Q2–4 hr PRN HYDROMORPHONE HCL continued IM, SC (not preferred route; absorption is erratic): 0.8–1 mg/dose Q4–6 hr PRN",
    "unit": "mg/dose",
    "perKg": false,
    "min": 0.2,
    "max": 0.6
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 2, 4, 8 mg Extended-release tabs: 8, 12, 16, 32 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-hydroxychloroquine-sulfate",
  "name": "Hydroxychloroquine Sulfate",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "notes": "5 mg/kg/dose PO once weekly; max. dose: 310 mg",
    "maxDose": "310 mg",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Every 24 hours",
    "notes": "10 mg/kg/dose ( max. dose: 620 mg) PO × 1, followed by 5 mg/kg/dose ( max. dose: 310 mg) 6 hr later, then 5 mg/kg/dose ( max. dose: 310 mg) PO Q24 hr × 2 doses, starting 24 hr after the first dose",
    "maxDose": "620 mg) PO × 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "3.1–5 mg/kg/24 hr (base) PO ÷ once daily–BID; max. dose: 310 mg/24 hr Per-dose amount calculated from 3.1–5 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "310 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3.1,
    "max": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "3.1–5 mg/kg/24 hr (base) PO ÷ once daily–BID; max. dose: 310 mg/24 hr",
    "maxDose": "310 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 3.1,
    "max": 5
   }
  ],
  "indications": [
   "Systemic lupus erythematosus"
  ],
  "contraindications": [
   "Psoriasis, porphyria, retinal or visual field changes",
   "4-aminoquinoline hypersensitivity"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-imipenem-and-cilastatin",
  "name": "Imipenem and Cilastatin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "50 mg/kg/24 hr IV ÷ Q12 hr Per-dose amount calculated from 50 mg/kg/day divided by 2 (Every 12 hours). • 75 mg/kg/24 hr IV ÷ Q8 hr Per-dose amount calculated from 75 mg/kg/day divided by 3 (Every 8 hours). • 100 mg/kg/24 hr IV ÷ Q6 hr Per-dose amount calculated from 100 mg/kg/day divided by 4 (Every 6 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 25
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "50 mg/kg/24 hr IV ÷ Q12 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 50
   },
   {
    "route": "IV",
    "frequency": "Every 8 hours",
    "notes": "75 mg/kg/24 hr IV ÷ Q8 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 75
   },
   {
    "route": "IV",
    "frequency": "Every 6 hours",
    "notes": "100 mg/kg/24 hr IV ÷ Q6 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, carbapenem. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-imipramine",
  "name": "Imipramine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Initial: 1.5 mg/kg/24 hr PO ÷ BID–TID; increase by 1 mg/kg/24 hr increments Q3–4 days to a max. dose of 5 mg/kg/24 hr Per-dose amount calculated from 1.5 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.75
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Initial: 1.5 mg/kg/24 hr PO ÷ BID–TID; increase by 1 mg/kg/24 hr increments Q3–4 days to a max. dose of 5 mg/kg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 1.5
   },
   {
    "route": "Oral",
    "notes": "Initial: 10–25 mg PO QHS Increment if needed: 10–25 mg/dose at 1- to 2-wk intervals until max. dose for age or desired effect achieved. Continue × 2–3 mo, then taper slowly. Max. dose: 6–12 yr: The lesser of 2.5 mg/kg/24 hr or 50 mg/24 hr",
    "maxDose": "6–12 yr: The lesser of 2",
    "unit": "mg",
    "perKg": false,
    "min": 10,
    "max": 25
   },
   {
    "route": "Oral",
    "notes": "75 mg/24 hr Continued",
    "unit": "mg/day",
    "perKg": false,
    "value": 75
   }
  ],
  "indications": [],
  "contraindications": [
   "Narrow-angle glaucoma",
   "Patients who used mao inhibitors within 14 days"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor for clinical worsening of depression and suicidal ideation/behavior following the initiation of therapy or after dose changes",
   "Monitor ECG, BP, CBC at start of therapy and with dose changes"
  ],
  "notes": "Formulary class: Antidepressant, tricyclic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-immune-globulin",
  "name": "Immune Globulin",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "notes": "Initial weekly dose (start 1 wk after last IV dose): SC Product Dose Calculation (mg) Dose Calculation (mL) Hizentra Dose (g) = 1.37 × Previous IVIG dose in grams (g) ÷ number of weeks between IVIG doses mL = multiply dose (g) by 5 Cutaquig Dose (g) = 1.30 × Previous IVIG dose in grams (g) ÷ number of weeks between IVIG doses mL = multiply dose (g) by 6 Cuvitru Dose (g) = 1.30 × Previous IVIG dose",
    "unit": "mg",
    "perKg": false,
    "value": 290
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Immune globulins. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-indomethacin",
  "name": "Indomethacin",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate release: Start at 1–2 mg/kg/24 hr PO ÷ TID–QID; max. dose: the lesser of 4 mg/kg/24 hr or 200 mg/24 hr Sustained-release caps ( Per-dose amount calculated from 1–2 mg/kg/day divided by 3 (Three times daily).",
    "maxDose": "the lesser of 4 mg/kg/24 hr or 200 mg/24 hr Sustained-release caps (",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.333,
    "max": 0.667
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Immediate release: Start at 1–2 mg/kg/24 hr PO ÷ TID–QID; max. dose: the lesser of 4 mg/kg/24 hr or 200 mg/24 hr Sustained-release caps (",
    "maxDose": "the lesser of 4 mg/kg/24 hr or 200 mg/24 hr Sustained-release caps (",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 75 mg PO once daily, may increase to 75 mg BID; max. dose: 150 mg/24 hr",
    "maxDose": "150 mg/24 hr",
    "unit": "mg",
    "perKg": false,
    "value": 75
   }
  ],
  "indications": [
   "Anti-inflammatory/rheumatoid arthritis"
  ],
  "contraindications": [
   "Active bleeding, coagulation defects, necrotizing enterocolitis",
   "Renal insufficiency (urine output <0"
  ],
  "formulations": [
   "Caps: 25, 50 mg Sustained-release caps: 75 mg",
   "Oral suspension: 25 mg/5 mL (237 mL); contains 1% alcohol Suppositories: 50 mg (30s)"
  ],
  "monitoring": [
   "Monitor renal and hepatic function before and during use"
  ],
  "notes": "Formulary class: Nonsteroidal anti-inflammatory agent C/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-infliximab",
  "name": "Infliximab",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "notes": "Start at 5 mg/kg/dose IV at 0, 2, and 6 weeks, followed by 5 mg/kg/dose IV Q8 weeks. Dose adjustments may be necessary due to therapeutic drug monitoring (see remarks); patients with weight <30 kg, high BMI, high inflammatory burden, or low albumin may require higher doses (10 mg/kg/dose or maintenance dose dosage interval). IVIG refractory Kawasaki disease (limited data):",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "IV",
    "notes": "5-10 mg/kg/dose IV x 1. Juvenile idiopathic arthritis (refractory to disease-modifying antirheumatic drugs; limited data): • Start at 5–10 mg/kg/dose IV at 0, 2, and 6 weeks, followed by 5–10 mg/kg/dose IV Q8 weeks. Lower dose of 3 mg/kg/dose has been reported to be efficacious but requires further investigation. A retrospective evaluation of 85 patients receiving higher doses of 10–20 mg/kg/dose appeared to be safe but still needs to be studied prospectively for efficacy with additional safety measures. Contraindicated",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Tumor necrosis factor (TNF) blocking agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ipratropium-bromide-albuterol",
  "name": "Ipratropium Bromide / Albuterol",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 2-4 hours",
    "notes": "250–500 mCg/dose Q20 min × 3, then Q2–4 hr PRN",
    "unit": "mcg/dose",
    "perKg": false,
    "min": 250,
    "max": 500
   },
   {
    "route": "Oral",
    "frequency": "Every 2-4 hours",
    "notes": "500 mCg/dose Q20 min × 3, then Q2–4 hr PRN Inhaler:",
    "unit": "mcg/dose",
    "perKg": false,
    "value": 500
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "125–250 mCg/dose Q8 hr",
    "unit": "mcg/dose",
    "perKg": false,
    "min": 125,
    "max": 250
   }
  ],
  "indications": [
   "Nebulized treatments"
  ],
  "contraindications": [
   "Atropine hypersensitivity"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Neb Anticholinergic agent B/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-iron-injectable-preparations",
  "name": "Iron Injectable Preparations",
  "category": "fluid",
  "doses": [
   {
    "route": "IV",
    "notes": "1.5 mg/kg elemental Fe (0.12 mL/kg) IV; max. dose: 125 mg elemental Fe/ dose. Dilute dose in 25 mL NS and infuse over 1 hr.",
    "maxDose": "125 mg elemental Fe/ dose",
    "unit": "mg/kg",
    "perKg": true,
    "value": 1.5
   },
   {
    "route": "Oral",
    "notes": "ESRD on hemodialysis: (limited data from 14 children): 1 mg/kg/dialysis was adequate for correcting ferritin levels, and 0.3 mg/kg/dialysis was successful in maintaining ferritin levels between 193 and 250 mCg/L. Doses were administered during the last hr of each dialysis and are recommended at a frequency of 3 times a week. A 10-mg test dose was administered. Nonrenal iron deficiency, refractory",
    "maxDose": "100 mg/ 24 hr) followed by a maintenance dose of 5–7 mg/kg/dose (max",
    "unit": "mg/kg",
    "perKg": true,
    "min": 5,
    "max": 7
   },
   {
    "route": "IV",
    "notes": "15 mg/kg/dose (max. dose: 750 mg/dose) Q7 days x 2 doses 1048 Part IV Formulary IRON ― INJECTABLE PREPARATIONS continued",
    "maxDose": "750 mg/dose) Q7 days x 2 doses 1048 Part IV Formulary IRON ― INJECTABLE PREPARATIONS continued",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   }
  ],
  "indications": [
   "Iron deficiency anemia"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor vital signs during IV infusion"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-iron-oral-preparations",
  "name": "Iron Oral Preparations",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "3–6 mg elemental Fe/kg/24 hr PO ÷ BID–TID",
    "unit": "mg",
    "perKg": false,
    "min": 3,
    "max": 6
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Give dose below PO ÷ once daily–TID Premature infant: 2 mg elemental Fe/kg/24 hr; max. dose: 15 mg elemental Fe/24 hr Full-term infant: 1–2 mg elemental Fe/kg/24 hr; max. dose: 15 mg elemental Fe/24 hr",
    "maxDose": "15 mg elemental Fe/24 hr Full-term infant: 1–2 mg elemental Fe/kg/24 hr",
    "unit": "mg",
    "perKg": false,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "notes": "2 mg elemental Fe/kg/24 hr; max. dose: 30 mg elemental Fe/24 hr",
    "maxDose": "30 mg elemental Fe/24 hr",
    "unit": "mg",
    "perKg": false,
    "value": 2
   }
  ],
  "indications": [
   "Fe QID Prophylaxis"
  ],
  "contraindications": [
   "BID–TID"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-isoniazid",
  "name": "Isoniazid",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–15 mg/kg ( max. dose: 300 mg) PO once daily or 20–30 mg/kg ( max. dose: 900 mg) per dose three times weekly with rifampin for uncomplicated pulmonary tuberculosis in compliant patients. Additional drugs are necessary in complicated disease.",
    "maxDose": "300 mg) PO once daily or 20–30 mg/kg ( max",
    "unit": "mg/kg",
    "perKg": true,
    "min": 10,
    "max": 15
   }
  ],
  "indications": [],
  "contraindications": [
   "acute liver disease and previous isoniazid-associated hepatitis"
  ],
  "formulations": [
   "Tabs: 100, 300 mg",
   "Syrup: 50 mg/5 mL (473 mL); contains parabens"
  ],
  "monitoring": [],
  "notes": "Formulary class: Laniazid Antituberculous agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-isoproterenol",
  "name": "Isoproterenol",
  "category": "inotrope",
  "doses": [
   {
    "route": "Oral",
    "notes": "0.05–2 mCg/kg/min; start at minimum dose and increase every 5–10 min by 0.1 mCg/kg/min until desired effect or onset of toxicity; max. dose: 2 mCg/kg/min",
    "maxDose": "2 mCg/kg/min",
    "unit": "mcg/kg/min",
    "perKg": true,
    "min": 0.05,
    "max": 2
   }
  ],
  "indications": [
   "IV infusion"
  ],
  "contraindications": [
   "Cg/kg/min"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor heart rate, respiratory rate, and blood pressure"
  ],
  "notes": "Formulary class: Adrenergic agonist. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-isotretinoin",
  "name": "Isotretinoin",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Standard formulation: 0.5–2 mg/kg/24 hr PO ÷ BID × 15–20 wk or until the total cyst count decreases by 70%, whichever comes first. Dosages as low as 0.05 mg/kg/24 hr have been reported to be beneficial. Micronized formulation (Absorica LD): 0.4–0.8 mg/kg/24 hr PO ÷ BID × 15–20 wk or until the total cyst count decreases by 70%, whichever comes first. Dosages as high as 1.6 mg/kg/24 hr ÷ BID have be Per-dose amount calculated from 0.5–2 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 1
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Standard formulation: 0.5–2 mg/kg/24 hr PO ÷ BID × 15–20 wk or until the total cyst count decreases by 70%, whichever comes first. Dosages as low as 0.05 mg/kg/24 hr have been reported to be beneficial. Micronized formulation (Absorica LD): 0.4–0.8 mg/kg/24 hr PO ÷ BID × 15–20 wk or until the total cyst count decreases by 70%, whichever comes first. Dosages as high as 1.6 mg/kg/24 hr ÷ BID have be",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.5,
    "max": 2
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor CBC, ESR, triglycerides, and LFTs"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-isradipine",
  "name": "Isradipine",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 0.05–0.1 mg/kg/dose PO BID–TID (start at 0.05 mg/kg/dose for child <2 yr old). Dose may be increased at 2–4 wk intervals as needed up to a maximum of 0.6 mg/kg/24 hr not to exceed 10 mg/24 hr. Usual daily dose of 0.3–0.4 mg/ kg/24 hr has been reported.",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.05,
    "max": 0.1
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Capsules: 2.5, 5 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Circ Calcium channel blocker, antihypertensive. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-itraconazole",
  "name": "Itraconazole",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "5 mg/kg/24 hr PO once daily × 6 wk Per-dose amount calculated from 5 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "5 mg/kg/24 hr PO once daily × 6 wk",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Every 12-24 hours",
    "notes": "3–5 mg/kg/24 hr PO ÷ once daily–BID; dosages as high as 5–10 mg/ kg/24 hr have been used for Aspergillus prophylaxis in chronic granulomatous disease. Population pharmacokinetic data in pediatric cystic fibrosis and bone marrow transplant patients suggest an oral liquid dosage of 10 mg/kg/24 hr PO ÷ BID or oral capsule dosage of 20 mg/kg/24 hr PO ÷ BID to be more reliable for achieving trough plas Maximum is per dose: 400 mg/24 hr Cryptococcal meningitis: 5 mg/kg/dose PO Q24 hr. Daily total shown — divide by the prescribed frequency.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 3,
    "max": 5
   }
  ],
  "indications": [],
  "contraindications": [
   "CHF and with certain interacting drugs (see below)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ivacaftor",
  "name": "Ivacaftor",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "5.8 mg PO Q12 hr 2–",
    "unit": "mg",
    "perKg": false,
    "value": 5.8
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "13.4 mg PO Q12 hr 4–",
    "unit": "mg",
    "perKg": false,
    "value": 13.4
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "25 mg PO Q12 hr",
    "unit": "mg",
    "perKg": false,
    "value": 25
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Oral granules: 5.8, 13.4, 25, 50, 75 mg (each strength available in packets of 56)"
  ],
  "monitoring": [
   "Baseline AST/ALT and ocular exam"
  ],
  "notes": "Formulary class: fibrosis transmembrane conductance regulator (CFTR) potentiator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ketoconazole",
  "name": "Ketoconazole",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "3.3–6.6 mg/kg/24 hr once daily Per-dose amount calculated from 3.3–6.6 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3.3,
    "max": 6.6
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "3.3–6.6 mg/kg/24 hr once daily",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 3.3,
    "max": 6.6
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 200 mg",
   "Oral suspension: 100 mg/5 mL"
  ],
  "monitoring": [
   "Monitor LFTs in long-term use and adrenal function for patients at risk"
  ],
  "notes": "Formulary class: Antifungal agent, imidazole. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ketorolac",
  "name": "Ketorolac",
  "category": "analgesic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 6-8 hours",
    "notes": "0.5 mg/kg/dose IM/IV Q6–8 hr. Max. dose: 30 mg Q6 hr or 120 mg/24 hr",
    "maxDose": "30 mg Q6 hr or 120 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.5
   },
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "1 mg/kg/dose Q4–6 hr; max. dose: 10 mg/dose and 40 mg/24 hr",
    "maxDose": "10 mg/dose and 40 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1
   },
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "10 mg PRN Q4–6 hr; max. dose: 40 mg/24 hr Ophthalmic (see remarks): Postoperative cataract surgery:",
    "maxDose": "40 mg/24 hr Ophthalmic (see remarks): Postoperative cataract surgery:",
    "unit": "mg",
    "perKg": false,
    "value": 10
   }
  ],
  "indications": [
   "IM/IV"
  ],
  "contraindications": [],
  "formulations": [
   "Injection: 15 mg/mL (1 mL), 30 mg/mL (1, 2 mL); contains 10% alcohol and tromethamine; some preparations may be preservative free"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lacosamide",
  "name": "Lacosamide",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "1 mg/kg/dose BID • Increase by 1 mg/kg/dose BID every 7 days",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1
   },
   {
    "route": "IV",
    "frequency": "Three times daily",
    "notes": "0.66 mg/kg/dose TID",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.66
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Oral solution: Vimpat and generics: 10 mg/mL (200 mL); contains aspartame, parabens, and propylene glycol",
   "Tabs: Vimpat and generics: 50, 100, 150, 200 mg Extended-released caps (Motpoly XR): 100, 150, 200 mg; for Q24 hr dosing"
  ],
  "monitoring": [
   "For suicidal behavior and ideation"
  ],
  "notes": "Formulary class: Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lamivudine",
  "name": "Lamivudine",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2 mg/kg/dose PO BID within 6–12 hr after birth. Increase dose to 4 mg/kg/ dose PO BID at 4 wk of age. Chronic hepatitis B, non-HIV exposed or infected (see remarks): 2–17 yr: 3 mg/kg/dose PO once daily up to a max. dose of 100 mg/dose 18 yr and adult: 100 mg/dose PO once daily See https://clinicalinfo.hiv.gov/en/guidelines for remarks for use in HIV. Oral tablet dosage form is preferred over oral",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 2
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: Epivir and generics: 150, 300 mg LAMIVUDINE continued Generics (previously available as Epivir-HBV): 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: agent, nucleoside analogue reverse transcriptase inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lamotrigine",
  "name": "Lamotrigine",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "WITH enzyme-inducing AEDs (e.g., carbamazepine, phenytoin, phenobarbital, primidone) and WITHOUT valproic acid: Wk 1 and 2: 0.6 mg/kg/24 hr PO ÷ once daily–BID Wk 3 and 4: 1.2 mg/kg/24 hr PO ÷ once daily–BID Usual maintenance dose (>wk 4): Titrate dose to effect PRN by increasing dosage every week by no more than 1.2 mg/kg/24 hr up to a maximum of 15.6 mg/kg/24 hr ÷ TID not to exceed 400 mg/24 hr. Per-dose amount calculated from 0.6 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.6
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "WITH enzyme-inducing AEDs (e.g., carbamazepine, phenytoin, phenobarbital, primidone) and WITHOUT valproic acid: Wk 1 and 2: 0.6 mg/kg/24 hr PO ÷ once daily–BID Wk 3 and 4: 1.2 mg/kg/24 hr PO ÷ once daily–BID Usual maintenance dose (>wk 4): Titrate dose to effect PRN by increasing dosage every week by no more than 1.2 mg/kg/24 hr up to a maximum of 15.6 mg/kg/24 hr ÷ TID not to exceed 400 mg/24 hr.",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.6
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "WITH AEDs other than carbamazepine, phenytoin, phenobarbital, primidone, or valproic acid: Wk 1 and 2: 0.3 mg/kg/24 hr PO ÷ once daily–BID; rounded down to the nearest whole tablet Wk 3 and 4: 0.6 mg/kg/24 hr PO ÷ BID; rounded down to the nearest whole tablet Usual maintenance dose (>wk 4): 4.5–7.5 mg/kg/24 hr PO ÷ BID; titrate to effect. To achieve the usual maintenance dose, increase doses Q1–2 Per-dose amount calculated from 4.5–7.5 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "300 mg/24 hr ÷ BID WITH enzyme-inducing AEDs WITHOUT valproic acid: Wk 1 and 2: 0",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 4.5,
    "max": 7.5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "WITH AEDs other than carbamazepine, phenytoin, phenobarbital, primidone, or valproic acid: Wk 1 and 2: 0.3 mg/kg/24 hr PO ÷ once daily–BID; rounded down to the nearest whole tablet Wk 3 and 4: 0.6 mg/kg/24 hr PO ÷ BID; rounded down to the nearest whole tablet Usual maintenance dose (>wk 4): 4.5–7.5 mg/kg/24 hr PO ÷ BID; titrate to effect. To achieve the usual maintenance dose, increase doses Q1–2",
    "maxDose": "300 mg/24 hr ÷ BID WITH enzyme-inducing AEDs WITHOUT valproic acid: Wk 1 and 2: 0",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 4.5,
    "max": 7.5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "WITH AEDs other than carbamazepine, phenytoin, phenobarbital, primidone, or valproic acid (use immediate-release dosage forms): Wk 1 and 2: 25 mg once daily PO Wk 3 and 4: 50 mg once daily PO Usual maintenance dose (>wk 4): 225–375 mg/24 hr PO ÷ BID; titrate to effect. To achieve the usual maintenance dose, increase doses Q1–2 wk by 50 mg/24 hr as needed. WITH enzyme-inducing AEDs WITHOUT valproic",
    "unit": "mg/day",
    "perKg": false,
    "min": 225,
    "max": 375
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lansoprazole",
  "name": "Lansoprazole",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.5–1.5 mg/kg/24 hr PO ÷ once daily–BID Short-term treatment of GERD and erosive esophagitis, for up to 12 wk (see remarks): Per-dose amount calculated from 0.5–1.5 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1.5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.5–1.5 mg/kg/24 hr PO ÷ once daily–BID Short-term treatment of GERD and erosive esophagitis, for up to 12 wk (see remarks):",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.5,
    "max": 1.5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–2 mg/kg/24 hr PO ÷ once daily–BID Alternative dosing for fixed dosing for Per-dose amount calculated from 1–2 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–2 mg/kg/24 hr PO ÷ once daily–BID Alternative dosing for fixed dosing for",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "15 mg/24 hr PO ÷ once daily–BID",
    "unit": "mg/day",
    "perKg": false,
    "value": 15
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Gastric acid pump inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-letermovir",
  "name": "Letermovir",
  "category": "antiviral",
  "doses": [
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "480 mg IV/PO once daily • 480 mg IV/PO once daily initiated between days 0–7 post-transplantation and continued through day 200 post-transplantation. Contraindicated when used with pimozide, ergot alkaloids (e.g., ergotamine and dihydroergotamine), and pitavastatin/simvastatin due to increased risk for Q–Tc prolongation, ergotism, and myopathy/rhabdomyolysis, respectively. Common side effects include nausea, vomiting, diar",
    "unit": "mg",
    "perKg": false,
    "value": 480
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Injection: 20 mg/mL (12, 24 mL); contains hydroxypropyl betadex, preservative free"
  ],
  "monitoring": [],
  "notes": "Formulary class: Prevymis Antiviral agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-levofloxacin",
  "name": "Levofloxacin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "10 mg/kg/dose IV/PO Q12 hr; max. dose: 500 mg/24 hr • 10 mg/kg/dose IV/PO Q24 hr; max. dose: 750 mg/24 hr Recurrent or persistent acute otitis media (6 mo–",
    "maxDose": "500 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "10 mg/kg/dose PO Q12 hr × 10 days; max. dose: 500 mg/24 hr LEVOFLOXACIN continued Community-acquired pneumonia (IDSA/Pediatric Infectious Disease Society): 6 mo–",
    "maxDose": "500 mg/24 hr LEVOFLOXACIN continued Community-acquired pneumonia (IDSA/Pediatric Infectious Disease Society): 6 mo–",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [
   "Hypersensitivity to other quinolones"
  ],
  "formulations": [
   "Tabs: 250, 500, 750 mg",
   "Oral solution: 25 mg/mL (100, 200, 480 mL)"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, quinolone. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lidocaine-and-prilocaine",
  "name": "Lidocaine and Prilocaine",
  "category": "analgesic",
  "doses": [
   {
    "route": "IM",
    "notes": "<37 wk gestation (limited data): Painful procedures (e.g., IM injections): 0.5 g/site for 60 min ≥ 37 wk gestation and <5 kg: Painful procedures (e.g., IM injections): 1 g/site for 60 min. Max. dose: 1 g for all sites combined with a max. application area of 10 cm 2 and max. application time of 1 hr. Circumcision: 1–2 g and cover with occlusive dressing for 60–90 min. • LIDOCAINE AND PRILOCAINE continued Painful procedures (e.g., IM injections): 1–2 g/site following the recommended maximum doses based on the child’s age and weight: Age and Weight Maximum Total EMLA Dose (g) b Maximum Application Area (cm 2 ) Maximum Application Time (hr) Birth–<3 mo or <5 kg 1 10 1 3–12 mo and >5–10 kg a 2 20 4 1–6 yr and >10 kg 10 100 4 7–12 yr and >20 kg 20 200 4 a If patient i",
    "maxDose": "1 g for all sites combined with a max",
    "unit": "g",
    "perKg": false,
    "min": 1,
    "max": 2
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Topical analgesic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-liraglutide",
  "name": "Liraglutide",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 0.6 mg SC once daily × 1 wk, if needed, increase by 0.6-mg increments on a weekly basis PRN up to a maximum dose of 1.8 mg/ 24 hr. In clinical trials, metformin was also prescribed with some receiving insulin (those receiving insulin had their insulin dose reduced by ~20%). Chronic weight management (adjunctive therapy with diet and exercise): Saxenda (child • Start with 0.6 mg SC once daily × 1 wk, then increase dose by 0.6 mg/24 hr at weekly increments up to the target dose of 3 mg once daily. If unable to tolerate 3 mg once daily, may reduce dose to 2.4 mg once daily (discontinue use if 2.4 mg dose is not tolerated). Pediatric patients who are unable to tolerate the dose escalation may use the lower dose, and the targeted escalation could take up to",
    "unit": "mg",
    "perKg": false,
    "value": 0.6
   }
  ],
  "indications": [],
  "contraindications": [
   "patients with a family history of medullary thyroid carcinoma and in patients with multiple endocrine neoplasia syndrome type 2"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: agent, glucagon-like peptide-1 (GLP-1) receptor agonist. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lisdexamfetamine",
  "name": "Lisdexamfetamine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "notes": "Start with 20–30 mg PO QAM (adult, start at 30 mg). May increase dose by 10–20 mg/24 hr at weekly intervals if needed, up to a max. dose of 70 mg/24 hr. Lower maximum dosages for renal insufficiency include the following: GFR ≥ 30 mL/min/1.73 m 2 : 70 mg/24 hr GFR 15–<30 mL/min/1.73 m 2 : 50 mg/24 hr GFR <15 mL/min/1.73 m 2 or ESRD on hemodialysis: 30 mg/24 hr Binge eating disorder (moderate to se",
    "unit": "mg",
    "perKg": false,
    "min": 20,
    "max": 30
   }
  ],
  "indications": [
   "Attention-deficit/hyperactivity disorder"
  ],
  "contraindications": [
   "amphetamine or sympathomimetic hypersensitivity, symptomatic cardiovascular disease, moderate/severe hypertension, hyperthyroidism, glaucoma, agitated states, drug/alcohol abuse history, and MAO inhibitors (concurrent or use within 14 days)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lisinopril",
  "name": "Lisinopril",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Use 6–17 yr dosing below. 6–17 yr: Start with 0.07–0.1 mg/kg/dose PO once daily; max. initial dose: 5 mg/dose. If needed, titrate dose upward at 1–2 wk intervals to doses up to 0.61 mg/kg/24 hr or 40 mg/24 hr (higher doses have not been evaluated).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.07,
    "max": 0.1
   }
  ],
  "indications": [],
  "contraindications": [
   "hypersensitivity and history of angioedema with other ACE inhibitors and in combination with a neprilysin inhibitor (e.g., sacubitril)"
  ],
  "formulations": [
   "Tabs: 2.5, 5, 10, 20, 30, 40 mg Oral solution (Qbrelis): 1 mg/mL (150 mL); contains sodium benzoate"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lithium",
  "name": "Lithium",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Initial (immediate-release dosage forms): 15–60 mg/kg/24 hr PO ÷ TID–QID. Adjust as needed (weekly) to achieve therapeutic levels. Per-dose amount calculated from 15–60 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Initial (immediate-release dosage forms): 15–60 mg/kg/24 hr PO ÷ TID–QID. Adjust as needed (weekly) to achieve therapeutic levels.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 60
   }
  ],
  "indications": [
   "TID using extended-release tablets)"
  ],
  "contraindications": [
   "TID–QID"
  ],
  "formulations": [
   "Tabs: 300 mg Extended-release tabs: 300 mg (Lithobid and generics), 450 mg Citrate salt:"
  ],
  "monitoring": [
   "Neurologic toxicities because an encephalopathic syndrome followed by irreversible brain damage has been reported"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-loperamide",
  "name": "Loperamide",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "2–5 yr (13–<21 kg): 1 mg PO TID 6–8 yr (21–27 kg): 2 mg PO BID 9–11 yr (>27–43 kg): 2 mg PO TID Max. single dose: 2 mg Follow initial day’s dose with 0.1 mg/kg/dose after each loose stool ( not to exceed the aforementioned initial doses).",
    "unit": "mg",
    "perKg": false,
    "value": 1
   },
   {
    "route": "Oral",
    "notes": "4 mg/dose × 1, followed by 2 mg/dose after each stool up to max. dose of 8 mg/24 hr for 12–<18 yr and 16 mg/24 hr for adult Chronic diarrhea (from intestinal failure, short bowel syndrome, or other noninfectious causes; see remarks):",
    "unit": "mg/dose",
    "perKg": false,
    "value": 4
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "0.08–0.24 mg/kg/24 hr PO ÷ BID–TID; max. dose: 2 mg/dose Per-dose amount calculated from 0.08–0.24 mg/kg/day divided by 2 (Twice daily).",
    "maxDose": "2 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.04,
    "max": 0.12
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "0.08–0.24 mg/kg/24 hr PO ÷ BID–TID; max. dose: 2 mg/dose",
    "maxDose": "2 mg/dose",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.08,
    "max": 0.24
   }
  ],
  "indications": [],
  "contraindications": [
   "Acute dysentery",
   "Acute ulcerative colitis",
   "Bacterial enterocolitis caused by salmonella, shigella, campylobacter",
   "Clostridium difficile"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antidiarrheal. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-loratadine-pseudoephedrine",
  "name": "Loratadine / Pseudoephedrine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10 mg PO once daily. Disintegrating tablet may be dosed at 5 mg PO BID or 10 mg PO once daily. Time-release tabs of loratidine and pseudoephedrine:",
    "unit": "mg",
    "perKg": false,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antihistamine, less sedating ± decongestant B/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-lumacaftor-and-ivacaftor",
  "name": "Lumacaftor and Ivacaftor",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "7–<9 kg: One lumacaftor 75 mg/ivacaftor 94 mg granule packet PO Q12 hr 9–<14 kg: One lumacaftor 100 mg/ivacaftor 125 mg granule packet PO Q12 hr ≥ 14 kg: One lumacaftor 150 mg/ivacaftor 188 mg granule packet PO Q12 hr",
    "unit": "mg",
    "perKg": false,
    "value": 75
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "<14 kg: One lumacaftor 100 mg/ivacaftor 125 mg granule packet PO Q12 hr ≥ 14 kg: One lumacaftor 150 mg/ivacaftor 188 mg granule packet PO Q12 hr • Two lumacaftor 100 mg/ivacaftor 125 mg tablets PO Q12 hr",
    "unit": "mg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "AST/ ALT and ocular exam at baseline"
  ],
  "notes": "Formulary class: conductance regulator (CFTR) corrector and potentiator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-magnesium-citrate",
  "name": "Magnesium Citrate",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "0.5 mL/kg 2–5 yr: 5–15 mL OR 400–1200 mg (1–3 chewable tabs) Continued",
    "unit": "mg",
    "perKg": false,
    "min": 400,
    "max": 1200
   }
  ],
  "indications": [
   "BID Bowel prep"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Magnesium level) and patients receiving digoxin"
  ],
  "notes": "Formulary class: 16.17% Elemental Magnesium Laxative/cathartic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-magnesium-hydroxide",
  "name": "Magnesium Hydroxide",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "0.5 mL/kg 2–5 yr: 5–15 mL OR 400–1200 mg (1–3 chewable tabs) Continued",
    "unit": "mg",
    "perKg": false,
    "min": 400,
    "max": 1200
   },
   {
    "route": "Oral",
    "notes": "30–60 mL OR 2400–4800 mg (6–12 chewable tabs) Antacid:",
    "unit": "mg",
    "perKg": false,
    "min": 2400,
    "max": 4800
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Liquid (400 mg/5 mL): 2.5–5 mL/dose PO once daily–QID Tabs: 400 mg PO once daily–QID",
    "unit": "mg",
    "perKg": false,
    "value": 400
   }
  ],
  "indications": [
   "Antacid"
  ],
  "contraindications": [
   "PO once daily–QID"
  ],
  "formulations": [
   "Tabs: 400 mg PO once daily–QID Adult: Liquid (400 mg/5 mL): 5–15 mL/dose PO once daily–QID Concentrated liquid (800 mg/5 mL): 2.5–7.5 mL/dose PO once daily–QID"
  ],
  "monitoring": [
   "Magnesium level) and patients receiving digoxin"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-magnesium-oxide",
  "name": "Magnesium Oxide",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "5–10 mg/kg/24 hr PO ÷ TID–QID Per-dose amount calculated from 5–10 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1.667,
    "max": 3.333
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "5–10 mg/kg/24 hr PO ÷ TID–QID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "65–130 mg/kg/24 hr PO ÷ QID Per-dose amount calculated from 65–130 mg/kg/day divided by 4 (Four times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 16.25,
    "max": 32.5
   },
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "65–130 mg/kg/24 hr PO ÷ QID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 65,
    "max": 130
   }
  ],
  "indications": [
   "Magnesium supplementation",
   "QID Hypomagnesemia"
  ],
  "contraindications": [
   "TID–QID"
  ],
  "formulations": [],
  "monitoring": [
   "Magnesium level) and patients receiving digoxin"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-mefloquine-hcl",
  "name": "Mefloquine HCL",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "notes": "<10 kg: 5 mg/kg 10–19 kg: 62.5 mg (¼ tablet) 20–30 kg: 125 mg (½ tablet) 31–45 kg: 187.5 mg (¾ tablet) >45 kg: 250 mg (1 tablet)",
    "unit": "mg/kg",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "notes": "15 mg/kg ( max. dose: 750 mg) PO × 1 followed by 10 mg/kg ( max. dose: 500 mg) PO × 1 6–12 hr later",
    "maxDose": "750 mg) PO × 1 followed by 10 mg/kg ( max",
    "unit": "mg/kg",
    "perKg": true,
    "value": 15
   }
  ],
  "indications": [],
  "contraindications": [
   "active or recent history of depression, anxiety disorders, psychosis or schizophrenia, seizures, or hypersensitivity to quinine or quinidine"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor liver enzymes and ocular exams for therapies >1 yr"
  ],
  "notes": "Formulary class: Antimalarial. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-mesalamine",
  "name": "Mesalamine",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Caps (controlled release) and tabs (delayed release): 60–80 mg/kg/24 hr PO ÷ once daily–BID (defined by dosage form used); max. dose: 4.8 g/24 hr Delzicol (mild/moderate ulcerative colitis treatment for 6 wk; ≥ 5–18 yr; see remarks): 17–32 kg: 800 mg PO QAM and 400 mg PO Q afternoon 33–53 kg: 1200 mg PO QAM and 800 mg PO Q afternoon 54–90 kg: 1200 mg PO QAM and Q afternoon Lialda (mild/moderate ul Per-dose amount calculated from 60–80 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "4",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 60,
    "max": 80
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Caps (controlled release) and tabs (delayed release): 60–80 mg/kg/24 hr PO ÷ once daily–BID (defined by dosage form used); max. dose: 4.8 g/24 hr Delzicol (mild/moderate ulcerative colitis treatment for 6 wk; ≥ 5–18 yr; see remarks): 17–32 kg: 800 mg PO QAM and 400 mg PO Q afternoon 33–53 kg: 1200 mg PO QAM and 800 mg PO Q afternoon 54–90 kg: 1200 mg PO QAM and Q afternoon Lialda (mild/moderate ul",
    "maxDose": "4",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 60,
    "max": 80
   }
  ],
  "indications": [],
  "contraindications": [
   "active peptic ulcer disease, severe renal failure, and salicylate hypersensitivity"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: acid, 5-ASA Salicylate, GI anti-inflammatory agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-methadone-hcl",
  "name": "Methadone HCL",
  "category": "analgesic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 4-6 hours",
    "notes": "0.7 mg/kg/24 hr PO, SC, IM, or IV ÷ Q4–6 hr PRN pain; max. dose: 10 mg/dose Maximum is per dose: 10 mg/dose. Daily total shown — divide by the prescribed frequency.",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.7
   }
  ],
  "indications": [
   "Analgesia"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 5, 10 mg Tabs, dispersible (Methadose and generics): 40 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Narcotic, analgesic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-methimazole",
  "name": "Methimazole",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Initial: 0.4–0.7 mg/kg/24 hr or 15–20 mg/m 2 /24 hr PO ÷ Q8 hr Maintenance: 1/3–2/3 of initial dose PO ÷ Q8 hr Max. dose: 30 mg/24 hr Per-dose amount calculated from 0.4–0.7 mg/kg/day divided by 3 (Every 8 hours).",
    "maxDose": "30 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.133,
    "max": 0.233
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Initial: 0.4–0.7 mg/kg/24 hr or 15–20 mg/m 2 /24 hr PO ÷ Q8 hr Maintenance: 1/3–2/3 of initial dose PO ÷ Q8 hr Max. dose: 30 mg/24 hr",
    "maxDose": "30 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.4,
    "max": 0.7
   },
   {
    "route": "IV",
    "notes": "1–2 mg/kg/dose or 25–50 mg/m 2 /dose IV/IO over 5 min. May repeat in 30– 60 min if needed. At high doses, may cause methemoglobinemia. Avoid subcutaneous or intrathecal routes of administration. Use with caution in G6PD deficiency or renal insufficiency (methylene blue concentrations have increased in subjects with renal impairment).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   }
  ],
  "indications": [
   "Hyperthyroidism",
   "Methemoglobinemia"
  ],
  "contraindications": [
   "Hyperthyroidism"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antithyroid agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-methylene-blue",
  "name": "Methylene Blue",
  "category": "antidote",
  "doses": [
   {
    "route": "IV",
    "notes": "1–2 mg/kg/dose or 25–50 mg/m 2 /dose IV/IO over 5 min. May repeat in 30– 60 min if needed. At high doses, may cause methemoglobinemia. Avoid subcutaneous or intrathecal routes of administration. Use with caution in G6PD deficiency or renal insufficiency (methylene blue concentrations have increased in subjects with renal impairment).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   }
  ],
  "indications": [
   "Methemoglobinemia"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antidote, drug-induced methemoglobinemia, and cyanide toxicity. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-methylphenidate-hcl",
  "name": "Methylphenidate HCL",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "notes": "Initial: 0.3 mg/kg/dose (or 2.5–5 mg/dose) given before breakfast and lunch. May increase by 0.1 mg/kg/dose (or 5–10 mg/24 hr) weekly until maintenance dose achieved. May give extra afternoon dose if needed. Maintenance dose range: 0.3–1 mg/kg/24 hr Max. dose: 2 mg/kg/24 hr or 60 mg/24 hr for those weighing ≤ 50 kg and 100 mg/24 hr >50 kg Continued",
    "maxDose": "2 mg/kg/24 hr or 60 mg/24 hr for those weighing ≤ 50 kg and 100 mg/24 hr >50 kg Continued",
    "unit": "mg/dose",
    "perKg": false,
    "min": 2.5,
    "max": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Methylphenidate-naïve patients: Start with 18 mg QAM for children and adolescents and 18–36 mg QAM for adults; dosage may be increased at weekly intervals at 18-mg increments up to the following max. dose: 6–12 yr: 54 mg/24 hr 13–17 yr: 72 mg/24 hr not to exceed 2 mg/kg/24 hr Patients weighing >50 kg: Higher max. dose of 108 mg/24 hr may be used. Patients currently receiving methylphenidate: See f",
    "maxDose": "6–12 yr: 54 mg/24 hr 13–17 yr: 72 mg/24 hr not to exceed 2 mg/kg/24 hr Patients weighing >50 kg: Higher max",
    "unit": "mg",
    "perKg": false,
    "min": 18,
    "max": 36
   },
   {
    "route": "Oral",
    "notes": "lesser of 72 mg/24 hr or 2 mg/kg/24 hr;",
    "unit": "mg/day",
    "perKg": false,
    "value": 72
   }
  ],
  "indications": [],
  "contraindications": [
   "glaucoma, anxiety disorders, motor tics, and Tourette syndrome"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: CNS stimulant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-metolazone",
  "name": "Metolazone",
  "category": "diuretic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Edema: 0.2–0.4 mg/kg/24 hr PO ÷ once daily–BID Per-dose amount calculated from 0.2–0.4 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.2,
    "max": 0.4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Edema: 0.2–0.4 mg/kg/24 hr PO ÷ once daily–BID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.2,
    "max": 0.4
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with anuria, hepatic coma, or hypersensitivity to sulfonamides or thiazides"
  ],
  "formulations": [
   "Tabs: 2.5, 5, 10 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Diuretic, thiazide-like. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-micafungin-sodium",
  "name": "Micafungin Sodium",
  "category": "antifungal",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 24 hours",
    "notes": "<1 kg: 10 mg/kg/dose IV Q24 hr; additional data from another multidose trial in 12 preterm neonates (median birth weight: 775 g, 27 wk gestation) suggest 15 mg/kg/dose IV Q24 hr will provide similar AUC drug exposure of approximately 5 mg/kg/dose in adults ≥ 1 kg: 7–10 mg/kg/dose IV Q24 hr; 10–12 mg/kg/dose IV Q24 hr may be needed for HIV-exposed/ infected neonates Non-CNS or non-ocular involvemen",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 7,
    "max": 10
   },
   {
    "route": "IV",
    "frequency": "Every 24 hours",
    "notes": "2–4 mg/kg/dose IV Q24 hr; max. dose: 100 mg/dose",
    "maxDose": "100 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 2,
    "max": 4
   },
   {
    "route": "IV",
    "frequency": "Every 24 hours",
    "notes": "4 mg/kg/dose IV Q24 hr; max. dose: 150 mg/24 hr",
    "maxDose": "150 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 4
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antifungal, echinocandin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-miconazole",
  "name": "Miconazole",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "7-day regimen: 1 applicator full of 2% cream or 100-mg suppository QHS × 7 days 3-day regimen: 1 applicator full of 4% cream or 200-mg suppository QHS × 3 days 1-day regimen (Monistat 1): 1200-mg suppository × 1 at bedtime or during the day Mild oropharyngeal candidiasis (adolescent/adult): Apply 1 tab (50 mg) to the upper gum once daily × 7–14 days. Use with caution in hypersensitivity to other i",
    "unit": "mg",
    "perKg": false,
    "value": 50
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Oral buccal tab: Oravig Antifungal agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-mineral-oil",
  "name": "Mineral OIL",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "4 mg/kg/dose ( max. dose: 200 mg/dose) IV/PO × 1, then 2 mg/kg/dose IV/PO Q12 hr; max. dose: 200 mg/24 hr",
    "maxDose": "200 mg/dose) IV/PO × 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 4
   }
  ],
  "indications": [
   "Constipation",
   "General infections"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 50, 75, 100 mg Caps: 50, 75, 100 mg Extended"
  ],
  "monitoring": [],
  "notes": "Formulary class: Laxative, lubricant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-minocycline",
  "name": "Minocycline",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "4 mg/kg/dose ( max. dose: 200 mg/dose) IV/PO × 1, then 2 mg/kg/dose IV/PO Q12 hr; max. dose: 200 mg/24 hr",
    "maxDose": "200 mg/dose) IV/PO × 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Immediate-release dosage forms: 50–100 mg PO once daily–BID Extended-release tabs: 45–49 kg: 45 mg PO once daily 50–59 kg: 55 mg PO once daily 60–71 kg: 65 mg PO once daily 72–84 kg: 80 mg PO once daily 85–96 kg: 90 mg PO once daily 97–110 kg: 105 PO once daily 111–125 kg: 115 mg PO once daily 126–136 kg: 135 mg PO once daily Topical foam (Amzeeq; moderate-to-severe acne vulgaris):",
    "unit": "mg",
    "perKg": false,
    "min": 50,
    "max": 100
   }
  ],
  "indications": [
   "General infections",
   "Rosacea"
  ],
  "contraindications": [
   "Rosacea"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, tetracycline derivative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-minoxidil",
  "name": "Minoxidil",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 0.1–0.2 mg/kg/24 hr PO once daily; max. dose: 5 mg/24 hr. Dose may be increased in increments of 0.1–0.2 mg/kg/24 hr at 3-day intervals. Usual effective range: 0.25–1 mg/kg/24 hr PO ÷ once daily–TID; max. dose: 50 mg/24 hr Per-dose amount calculated from 0.1–0.2 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "5 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 0.1–0.2 mg/kg/24 hr PO once daily; max. dose: 5 mg/24 hr. Dose may be increased in increments of 0.1–0.2 mg/kg/24 hr at 3-day intervals. Usual effective range: 0.25–1 mg/kg/24 hr PO ÷ once daily–TID; max. dose: 50 mg/24 hr",
    "maxDose": "5 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.1,
    "max": 0.2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 5 mg PO once daily. Dose may be gradually increased at 3-day intervals. Usual effective range: 10–40 mg/24 hr ÷ once daily–TID; max. dose: 100 mg/24 hr Topical (alopecia; see remarks):",
    "maxDose": "100 mg/24 hr Topical (alopecia",
    "unit": "mg/day",
    "perKg": false,
    "min": 10,
    "max": 40
   }
  ],
  "indications": [
   "Hypertension"
  ],
  "contraindications": [
   "acute MI, dissecting aortic aneurysm, and pheochromocytoma"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antihypertensive agent, hair growth stimulant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-mometasone-furoate-fomoterol-fumarate",
  "name": "Mometasone Furoate / Fomoterol Fumarate",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "50 mCg (1 spray) each nostril once daily (100 mCg/24 hr)",
    "unit": "mcg",
    "perKg": false,
    "value": 50
   },
   {
    "route": "Inhaled",
    "frequency": "Once daily",
    "notes": "100 mCg (2 sprays) each nostril once daily (200 mCg/24 hr) Oral inhalation: Asmanex HFA (aerosol for inhalation): • 2 inhalations (100 mCg) BID of 50 mCg inhaler (200 mCg/24 hr)",
    "unit": "mcg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor linear growth in children; especially with long-term use"
  ],
  "notes": "Formulary class: In combination with fomoterol: Dulera Corticosteroid. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-mupirocin",
  "name": "Mupirocin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Apply small amount TID to affected area × 5–10 days. Topical ointment may be used in infants ≥ 2 mo for impetigo. Intranasal for elimination of nasal colonization of Staphylococcus aureus , including MRSA (in the absence of the nasal ointment dosage form, use ointment dosage form): Infant, child, and adolescent: Apply small amount intranasally to both nostrils BID × 5–10 days.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Ointment: 2% (15, 30 g); contains propylene glycol"
  ],
  "monitoring": [],
  "notes": "Formulary class: Topical antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-mycophenolate",
  "name": "Mycophenolate",
  "category": "immunosuppressant",
  "doses": [
   {
    "route": "IV",
    "frequency": "Twice daily",
    "notes": "Heart and liver transplant (mycophenolate mofetil) : Suspension: Start with 600 mg/m 2 /dose PO BID; if tolerated, may increase to 900 mg/m 2 /dose BID. Max. dose: 3000 mg/24 hr. Tabs or caps: BSA 1.25–<1.5 m 2 : Start with 750 mg PO BID; if tolerated, may increase dose with BID dosage interval up to a maximum of 3000 mg/24 hr. BSA ≥ 1.5 m 2 : Start with 1000 mg PO BID; if tolerated, may increase",
    "maxDose": "3000 mg/24 hr",
    "unit": "mg",
    "perKg": false,
    "value": 600
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "400 mg/m 2 /dose PO BID; max. dose: 720 mg BID; this dosage form not recommended in patients with BSAs <1.19 m 2 . Alternatively, patients with BSAs ≥ 1.19 m 2 may be dosed as follows: Continued",
    "maxDose": "720 mg BID",
    "unit": "mg",
    "perKg": false,
    "value": 400
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 500 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-nafcillin",
  "name": "Nafcillin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "50 mg/kg/24 hr ÷ Q12 hr 15–28 days old: 75 mg/kg/24 hr ÷ Q8 hr 1–2 kg: Per-dose amount calculated from 50 mg/kg/day divided by 2 (Every 12 hours). • 50 mg/kg/24 hr ÷ Q12 hr 8–28 days old: 75 mg/kg/24 hr ÷ Q8 hr >2 kg: Per-dose amount calculated from 50 mg/kg/day divided by 2 (Every 12 hours). • 75 mg/kg/24 hr ÷ Q8 hr 8–28 days old: 100 mg/kg/24 hr ÷ Q6 hr Meningitis: Use twice the above mg/kg/24 hr dose with the same dosage interval. Per-dose amount calculated from 75 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 25
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "50 mg/kg/24 hr ÷ Q12 hr 15–28 days old: 75 mg/kg/24 hr ÷ Q8 hr 1–2 kg: • 50 mg/kg/24 hr ÷ Q12 hr 8–28 days old: 75 mg/kg/24 hr ÷ Q8 hr >2 kg:",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 50
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "75 mg/kg/24 hr ÷ Q8 hr 8–28 days old: 100 mg/kg/24 hr ÷ Q6 hr Meningitis: Use twice the above mg/kg/24 hr dose with the same dosage interval.",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 75
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with known allergy to corn or corn products"
  ],
  "formulations": [
   "Injection: 0.4 mg/mL (1, 10 mL); some pr"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, penicillin (penicillinase resistant). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-naproxen-naproxen-sodium",
  "name": "Naproxen/naproxen Sodium",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Analgesia: 5–10 mg/kg/dose PO Q12 hr; max. dose : 1000 mg/24 hr JIA: 10–15 mg/kg/24 hr PO ÷ Q12 hr; max. dose : 1000 mg/24 hr Ankylosing spondylitis: 15–20 mg/kg/24 hr PO ÷ Q12 hr; max. dose: 1500 mg/24 hr",
    "maxDose": "1500 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 10
   }
  ],
  "indications": [],
  "contraindications": [
   "Treating perioperative pain for coronary artery bypass graft surgery"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-neomycin-sulfate",
  "name": "Neomycin Sulfate",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "50–100 mg/kg/24 hr PO ÷ Q6–8 hr × 5–6 days; max. dose: 12 g/24 hr",
    "maxDose": "12 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 50,
    "max": 100
   },
   {
    "route": "Oral",
    "frequency": "Every 4 hours",
    "notes": "90 mg/kg/24 hr PO ÷ Q4 hr × 2–3 days Per-dose amount calculated from 90 mg/kg/day divided by 6 (Every 4 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 4 hours",
    "notes": "90 mg/kg/24 hr PO ÷ Q4 hr × 2–3 days",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 90
   }
  ],
  "indications": [],
  "contraindications": [
   "Ulcerative bowel disease, intestinal obstruction, or aminoglycoside hypersensitivity"
  ],
  "formulations": [
   "Tabs: 500 mg"
  ],
  "monitoring": [
   "Monitor for nephrotoxicity and ototoxicity"
  ],
  "notes": "Formulary class: ammonium detoxicant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-neomycin-polymyxin-b-ophthalmic-products",
  "name": "Neomycin/polymyxin B Ophthalmic Products",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 3-4 hours",
    "notes": "Apply 0.5-inch ribbon to affected eye(s) Q3–4 hr for acute infections or BID–TID for mild/moderate infections × 7–10 days. Do not dispense >8 g and should not be refilled without further evaluation. Neomycin/Polymyxin B + Dexamethasone (Maxitrol): • Ophthalmic suspension: Instill 1–2 drops into the conjunctival sac of the affected eye(s) 4–6 times per day for mild/moderate infections. For severe infections, administer Q1 hr and taper to discontinuation as inflammation subsides. No more than 20 mL should be prescribed initially and should not be refilled without further evaluation. Ophthalmic ointment: Apply ~0.5-inch ribbon into the conjuncti",
    "unit": "g",
    "perKg": false,
    "value": 8
   }
  ],
  "indications": [
   "Gramicidin",
   "Hydrocortisone"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor intraocular pressure if use is ≥ 10 days"
  ],
  "notes": "Formulary class: and generics Ophthalmic antibiotic ± corticosteroid. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-neomycin-polymyxin-b-bacitracin",
  "name": "Neomycin/polymyxin B/bacitracin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IM",
    "notes": "0.025–0.04 mg/kg IM × 1",
    "unit": "mg/kg",
    "perKg": true,
    "min": 0.025,
    "max": 0.04
   },
   {
    "route": "IV",
    "frequency": "Every 2-4 hours",
    "notes": "0.01–0.04 mg/kg/dose IM/IV/SC Q2–4 hr PRN",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.01,
    "max": 0.04
   }
  ],
  "indications": [
   "Treatment"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Topical antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-nevirapine",
  "name": "Nevirapine",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "HIV diagnosis): 200 mg/m 2 /dose PO BID ≥ 37 weeks’ gestation at birth (dosage based on pharmacokinetic and safety data): Birth–4 wk old: 6 mg/kg/dose PO BID; first dose within 6–12 hr after delivery >4 wk old (use this higher dose only if infant has a confirmed HIV diagnosis): 200 mg/m 2 /dose PO BID See https://clinicalinfo",
    "unit": "mg",
    "perKg": false,
    "value": 200
   }
  ],
  "indications": [],
  "contraindications": [
   "moderate/ severe hepatic impairment (Child-Pugh class B or C) and postexposure (occupational or nonoccupational) prophylactic regimens"
  ],
  "formulations": [
   "Tabs: 200 mg Extended-release tabs: 400 mg"
  ],
  "monitoring": [
   "Monitor liver function tests (obtain transaminases immediately after development of hepatitis signs/symptoms, hypersensitivity reactions, or rash) and complete blood counts"
  ],
  "notes": "Formulary class: NVP Antiviral, nonnucleoside reverse transcriptase inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-niacin-vitamin-b",
  "name": "Niacin/vitamin B",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "50–100 mg/dose TID",
    "unit": "mg/dose",
    "perKg": false,
    "min": 50,
    "max": 100
   }
  ],
  "indications": [],
  "contraindications": [
   "Hepatic dysfunction, active peptic ulcer",
   "Severe hypotension"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Vitamin, water soluble A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-nicardipine",
  "name": "Nicardipine",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "IV",
    "notes": "Hypertension: Continuous IV infusion for severe hypertension: Start at 0.5–1 mCg/kg/min; dose may be increased as needed every 15–30 min up to a max. of 4–5 mCg/kg/min.",
    "unit": "mcg/kg/min",
    "perKg": true,
    "min": 0.5,
    "max": 1
   }
  ],
  "indications": [],
  "contraindications": [
   "advanced aortic stenosis"
  ],
  "formulations": [
   "Caps (immediate release): 20, 30 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Calcium channel blocker, antihypertensive. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-nifedipine",
  "name": "Nifedipine",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12-24 hours",
    "notes": "Chronic hypertension: Sustained-release tabs: Start with 0.2–0.5 mg/kg/24 hr PO (initial max. dose: 30–60 mg/24 hr) ÷ Q12–24 hr. May increase to max. dose: 3 mg/kg/24 hr up to 120 mg/24 hr",
    "maxDose": "30–60 mg/24 hr) ÷ Q12–24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.2,
    "max": 0.5
   }
  ],
  "indications": [],
  "contraindications": [
   "Adults with severe obstructive coronary artery disease or recent mi",
   "In hypertensive emergencies"
  ],
  "formulations": [
   "Caps: 10 mg (0.34 mL), 20 mg (0.45 mL) Sustained-release tabs: (Procardia XL and generics): 30, 60, 90 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Adalat CC Calcium channel blocker, antihypertensive. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-nirsevimab",
  "name": "Nirsevimab",
  "category": "fluid",
  "doses": [
   {
    "route": "IM",
    "notes": "<5 kg: 50 mg IM x 1 ≥ 5 kg: 100 mg IM x 1 Surgery • , 50 mg IM x 1 Second RSV season: Surgery",
    "unit": "mg",
    "perKg": false,
    "value": 50
   },
   {
    "route": "IM",
    "notes": "200 mg x 1 administered as two 100-mg IM injections Surgery",
    "unit": "mg",
    "perKg": false,
    "value": 200
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-nortriptyline-hydrochloride",
  "name": "Nortriptyline Hydrochloride",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "notes": "150 mg/24 hr Nocturnal enuresis (see remarks): 6–7 yr (20–25 kg): 10 mg PO QHS 8–11 yr (26–35 kg): 10–20 mg PO QHS",
    "unit": "mg",
    "perKg": false,
    "min": 10,
    "max": 20
   },
   {
    "route": "IV",
    "notes": "25–35 mg PO QHS See imipramine for contraindications and common side effects. Also contraindicated with linezolid or IV methylene blue due to increased risk for serotonin syndrome. Avoid use in patients with Brugada syndrome. Fewer CNS and anticholinergic side effects than with amitriptyline.",
    "unit": "mg",
    "perKg": false,
    "min": 25,
    "max": 35
   }
  ],
  "indications": [
   "TID–QID"
  ],
  "contraindications": [
   "Depression",
   "TID–QID"
  ],
  "formulations": [
   "Caps: 10, 25, 50, 75 mg; may contain benzyl alcohol, parabens, or EDTA"
  ],
  "monitoring": [
   "Monitor for clinical worsening of depression and suicidal ideation/behavior following the initiation of therapy or after dose changes"
  ],
  "notes": "Formulary class: Antidepressant, tricyclic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-octreotide-acetate",
  "name": "Octreotide Acetate",
  "category": "endocrine",
  "doses": [
   {
    "route": "Subcutaneous",
    "frequency": "Every 12-24 hours",
    "notes": "1–10 mCg/kg/24 hr ÷ Q12–24 hr. Dose may be increased within the recommended range by 0.3 mCg/kg/dose every 3 days as needed. Max. dose: 1500 mCg/24 hr IV continuous infusion: Bolus of 1 mCg/kg/dose followed by 1 mCg/kg/hr; this has been used in diarrhea associated with graft-versus-host disease. Esophageal varices (limited data): Bolus of 1–2 mCg/kg/dose followed by 1–2 mCg/kg/hr. Use was reporte Maximum is per dose: 1500 mCg/24 hr IV continuous infusion: Bolus of 1 mCg/kg/dose followed by 1 mCg/kg/hr. Daily total shown — divide by the prescribed frequency.",
    "unit": "mcg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Somatostatin analog, antisecretory agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ofloxacin",
  "name": "Ofloxacin (otic and Ophthalmic)",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Ophthalmic",
    "notes": "5 drops to affected ear(s) once daily × 7 days ≥ 13 yr–adult: 10 drops to affected ear(s) once daily × 7 days Chronic suppurative otitis media: ≥ 12 yr–adult: 10 drops to affected ear(s) BID × 14 days Acute otitis media with tympanostomy tubes: 1–12 yr: 5 drops to affected ear(s) BID × 10 days Ophthalmic use (>1 yr–adult): Conjunctivitis: 1–2 drops to affected eye(s) 2–4 hr while awake × 2 days, t",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Floxin Otic Antibiotic, quinolone. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-olanzapine",
  "name": "Olanzapine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "notes": "5–10 mg PO Bipolar I disorder (manic or mixed episodes; not first-line therapy):",
    "unit": "mg",
    "perKg": false,
    "min": 5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 1.25 mg PO once daily × 7 days, then increase dose Q7 days PRN as tolerated to a target dose of 10 mg once daily.",
    "unit": "mg",
    "perKg": false,
    "value": 1.25
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 2.5 mg PO once daily × 7 days, then increase dose in 2.5- or 5-mg increments Q7 days to a target dose of 10 mg once daily. Suggested max. dose: 20 mg/24 hr",
    "maxDose": "20 mg/24 hr",
    "unit": "mg",
    "perKg": false,
    "value": 2.5
   }
  ],
  "indications": [
   "Schizophrenia"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antipsychotic, atypical second generation. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-olopatadine",
  "name": "Olopatadine",
  "category": "antihistamine",
  "doses": [
   {
    "route": "Inhaled",
    "notes": "0.1% solution: 1 drop in affected eye(s) BID (spaced 6–8 hr apart) 0.2% or 0.7% solution: 1 drop in affected eye(s) once daily Intranasal use for allergic rhinitis: Patients 6–11 yr: Inhale 1 spray into each nostril BID. Patients ≥ 12 yr and adult: Inhale 2 sprays into each nostril BID. Ocular use: DO NOT use while wearing contact lenses; wait at least 10 min after instilling drops before insertin",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-oseltamivir-phosphate",
  "name": "Oseltamivir Phosphate",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Preterm neonate (limited data): Usual duration of therapy: 5 days Continued OSELTAMIVIR PHOSPHATE continued Postmenstrual age (PMA) neonate <38 wk: 1 mg/kg/dose PO BID PMA 38–40 wk: 1.5 mg/kg/dose PO BID Full-term neonate (PMA >40 wk)–child 1 yr: 3 mg/kg/dose PO BID × 5 days",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Weight (kg) Dosage for 5 Days Volume of Oral Suspension (6 mg/mL) ≤15 30 mg PO BID 5 mL >15–23 45 mg PO BID 7.5 mL >23–40 60 mg PO BID 10 mL >40 75 mg PO BID 12.5 mL",
    "unit": "mg",
    "perKg": false,
    "value": 6
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "75 mg PO BID × 5 days Prophylaxis of influenza (initiate therapy within 2 days of exposure for 10 days; duration may be extended for 6 wk in community outbreaks; see remarks):",
    "unit": "mg",
    "perKg": false,
    "value": 75
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Caps: 30, 45, 75 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antiviral, neuraminidase inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-oxacillin",
  "name": "Oxacillin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "notes": "Usual dose : 25 mg/kg/dose; following the dosage interval below Meningitis or severe infection: 50 mg/kg/dose; following the dosage interval below Gestational age: ≤ 34 wk:",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 25
   },
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "100–200 mg/kg/24 hr ÷ Q4–6 hr ( max. dose: 12 g/24 hr); use 200 mg/kg/24 hr for endocarditis and severe infections and Q4 hr dosing for severe/CNS infections",
    "maxDose": "12 g/24 hr)",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 100,
    "max": 200
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Adjunctive therapy for partial-onset seizures (limited data): Start with 7.5–10 mg/kg/24 hr PO ÷ BID; gradually increase the dose 7.5–10 mg/kg/24 hr every 5–7 days up to a max. dose of 60– 90 mg/kg/24 hr. Daily dosage may be divided TID for improved tolerability and to achieve therapeutic levels. Continued Per-dose amount calculated from 7.5–10 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3.75,
    "max": 5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Adjunctive therapy for partial-onset seizures (limited data): Start with 7.5–10 mg/kg/24 hr PO ÷ BID; gradually increase the dose 7.5–10 mg/kg/24 hr every 5–7 days up to a max. dose of 60– 90 mg/kg/24 hr. Daily dosage may be divided TID for improved tolerability and to achieve therapeutic levels. Continued",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 7.5,
    "max": 10
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 150, 300, 600 mg Extended-release tabs (Oxtellar XR and generics):"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, penicillin (penicillinase resistant). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-oxcarbazepine",
  "name": "Oxcarbazepine",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Adjunctive therapy for partial-onset seizures (limited data): Start with 7.5–10 mg/kg/24 hr PO ÷ BID; gradually increase the dose 7.5–10 mg/kg/24 hr every 5–7 days up to a max. dose of 60– 90 mg/kg/24 hr. Daily dosage may be divided TID for improved tolerability and to achieve therapeutic levels. Continued Per-dose amount calculated from 7.5–10 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3.75,
    "max": 5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Adjunctive therapy for partial-onset seizures (limited data): Start with 7.5–10 mg/kg/24 hr PO ÷ BID; gradually increase the dose 7.5–10 mg/kg/24 hr every 5–7 days up to a max. dose of 60– 90 mg/kg/24 hr. Daily dosage may be divided TID for improved tolerability and to achieve therapeutic levels. Continued",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 7.5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Adjunctive therapy for partial-onset seizures (limited data): Start with 8–10 mg/kg/24 hr PO ÷ BID up to a max. dose of 600 mg/24 hr. For children <20 kg, may consider using a starting dose of 16–20 mg/kg/24 hr PO ÷ BID; gradually increase the dose over a 2–4-wk period and do not exceed 60 mg/kg/24 hr ÷ BID. 4–16 yr (see remarks): Adjunctive therapy for partial-onset seizures: Start with 8–10 mg/k Per-dose amount calculated from 8–10 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 4,
    "max": 5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Adjunctive therapy for partial-onset seizures (limited data): Start with 8–10 mg/kg/24 hr PO ÷ BID up to a max. dose of 600 mg/24 hr. For children <20 kg, may consider using a starting dose of 16–20 mg/kg/24 hr PO ÷ BID; gradually increase the dose over a 2–4-wk period and do not exceed 60 mg/kg/24 hr ÷ BID. 4–16 yr (see remarks): Adjunctive therapy for partial-onset seizures: Start with 8–10 mg/k",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 8,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Adjunctive therapy for partial-onset seizures: Start with 600 mg/24 hr PO ÷ BID. Dose may be increased at weekly intervals, as clinically indicated, by a maximum of 600 mg/ 24 hr. Usual maintenance dose is 1200 mg/24 hr PO ÷ BID. Doses ≥2400 mg/24 hr are generally not well tolerated due to CNS side effects. Conversion to monotherapy for partial-onset seizures: Start with 600 mg/24 hr PO ÷ BID and",
    "unit": "mg/day",
    "perKg": false,
    "value": 600
   }
  ],
  "indications": [
   "PO once daily"
  ],
  "contraindications": [
   "PO once daily"
  ],
  "formulations": [
   "Tabs: 150, 300, 600 mg Extended-release tabs (Oxtellar XR and generics): 150, 300, 600 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-oxybutynin-chloride",
  "name": "Oxybutynin Chloride",
  "category": "other",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Immediate release: 0.2 mg/kg/dose PO BID–TID; max. dose: 15 mg/24 hr",
    "maxDose": "15 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.2
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Immediate release: 5 mg/dose PO BID–TID; max. dose: 20 mg/24 hr Extended release ( • Start with 5 mg/dose PO once daily; if needed, increase as tolerated by 5-mg weekly increments up to a maximum of 20 mg/24 hr.",
    "maxDose": "20 mg/24 hr Extended release (",
    "unit": "mg/dose",
    "perKg": false,
    "value": 5
   }
  ],
  "indications": [
   "Neurogenic/overactive bladder"
  ],
  "contraindications": [
   "glaucoma, GI obstruction, megacolon, myasthenia gravis, severe colitis, hypovolemia, and GU obstruction"
  ],
  "formulations": [
   "Tabs: 2.5, 5 mg Tabs, extended release: 5, 10, 15 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-oxycodone",
  "name": "Oxycodone",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "0.025–0.05 mg/kg/dose PO Q4–6 hr PRN",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.025,
    "max": 0.05
   },
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "0.05–0.15 mg/kg/dose PO Q4–6 hr PRN up to 5 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.05,
    "max": 0.15
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Oral solution: 1 mg/mL (5, 15, 473 mL); contains alcohol Concentrated oral solution: 20 mg/mL (30 mL); may contain saccharin"
  ],
  "monitoring": [],
  "notes": "Formulary class: Narcotic, analgesic B/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-oxymetazoline",
  "name": "Oxymetazoline",
  "category": "respiratory",
  "doses": [
   {
    "route": "Topical",
    "notes": "2–3 sprays or 2–3 drops in each nostril BID (separated by 10–12 hr). Do not exceed 2 doses/24 hr.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [
   "patients on MAO inhibitor therapy"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Nasal decongestant, vasoconstrictor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-palivizumab",
  "name": "Palivizumab",
  "category": "fluid",
  "doses": [
   {
    "route": "IM",
    "notes": "15 mg/kg/dose IM Q monthly just prior to and during the RSV season. Maximum of five doses per RSV season is recommended by the AAP. Therapy should be discontinued if child experiences breakthrough RSV hospitalization. RSV season is typically November through April in the northern hemisphere but may begin earlier or persist later in certain communities. This infection pattern was significantly alte",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 15
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Synagis Monoclonal antibody. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pancrelipase-pancreatic-enzymes",
  "name": "Pancrelipase/pancreatic Enzymes",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Topical",
    "notes": "1000 U lipase/kg/meal Child ≥4 yr and adult: 500 U lipase/kg/meal Max. dose (child–adult): 2500 U lipase/kg/meal, or 10,000 U lipase/kg/24 hr, or 4000 U lipase/g fat/24 hr 1152 Part IV Formulary PANCRELIPASE/PANCREATIC ENZYMES continued Total daily dose should include approximately three meals and two to three snacks per day. Snack doses are approximately half of meal doses, depending on the amoun",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Pertzye Viokace and Zenpep Pancreatic enzyme. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-paromomycin-sulfate",
  "name": "Paromomycin Sulfate",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "25–35 mg/kg/24 hr PO ÷ Q8 hr × 5–10 days (usually 7 days) Cryptosporidiosis in immunocompromised or nutritionally deficient (limited efficacy data for infants and children with HIV): Per-dose amount calculated from 25–35 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 8.333,
    "max": 11.667
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "25–35 mg/kg/24 hr PO ÷ Q8 hr × 5–10 days (usually 7 days) Cryptosporidiosis in immunocompromised or nutritionally deficient (limited efficacy data for infants and children with HIV): • 25–35 mg/kg/24 hr PO ÷ BID–QID for 14 days with or without azithromycin; max. dose : use adult dosage of 500 mg QID.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 35
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "25–35 mg/kg/24 hr PO ÷ BID–QID for 14 days with or without azithromycin; max. dose : use adult dosage of 500 mg QID. Per-dose amount calculated from 25–35 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 12.5,
    "max": 17.5
   }
  ],
  "indications": [
   "Giardia lamblia infection"
  ],
  "contraindications": [
   "Intestinal obstruction"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Amebicide, antibiotic (aminoglycoside). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-paroxetine",
  "name": "Paroxetine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Depression: Well-controlled clinical trials have failed to demonstrate efficacy in children. The FDA recommends paroxetine NOT be used for this indication. Use should be reserved for refractory cases. Obsessive-compulsive disorder (limited data, based on a 10-wk randomized controlled trial in 207 children 7–17 yr; mean age 11.1 + 3.03 yr): Start with 10 mg PO once daily. If needed, adjust upward b",
    "unit": "mg",
    "perKg": false,
    "value": 10
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients taking monoamine oxidase inhibitors (maois)",
   "Within 14 days of discontinuing maois",
   "Patients taking linezolid, methylene blue, pimozide, or thioridazine"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor for clinical worsening of depression and suicidal ideation/behavior following the initiation of therapy or after dose changes"
  ],
  "notes": "Formulary class: Antidepressant, selective serotonin reuptake inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-penicillin-g-preparations-aqueous-potassium-and-sodium",
  "name": "Penicillin G Preparations—aqueous Potassium and Sodium",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "100,000–200,000 units/kg/24 hr ÷ Q12 hr 8–28 days old: 150,000–300,000 units/kg/24 hr ÷ Q8 hr >34 weeks gestation: Per-dose amount calculated from 0 units/kg/day divided by 2 (Every 12 hours). • General dosing: 100,000 units/kg/24 hr ÷ Q12 hr Meningitis and severe infection: 300,000 units/kg/24 hr ÷ Q8 hr 8–28 days old: General dosing: 150,000 units/kg/24 hr ÷ Q8 hr Meningitis and severe infection: 400,000 units/kg/24 hr ÷ Q6 hr Group B streptococcal meningitis: Per-dose amount calculated from 0 units/kg/day divided by 2 (Every 12 hours).",
    "unit": "units/kg/dose",
    "perKg": true,
    "value": 0
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "100,000–200,000 units/kg/24 hr ÷ Q12 hr 8–28 days old: 150,000–300,000 units/kg/24 hr ÷ Q8 hr >34 weeks gestation: • General dosing: 100,000 units/kg/24 hr ÷ Q12 hr Meningitis and severe infection: 300,000 units/kg/24 hr ÷ Q8 hr 8–28 days old: General dosing: 150,000 units/kg/24 hr ÷ Q8 hr Meningitis and severe infection: 400,000 units/kg/24 hr ÷ Q6 hr Group B streptococcal meningitis: • 450,000 units/kg/24 hr ÷ Q8 hr 8–28 days old: 500,000 units/kg/24 hr ÷ Q4–6 hr PENICILLIN G PREPARATIONS—AQUEOUS POTASSIUM AND SODIUM continued Congenital syphilis (total of 10 days of therapy; if >1 day of therapy is missed, restart the entire course):",
    "unit": "units/kg/day",
    "perKg": true,
    "value": 0
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, aqueous penicillin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-penicillin-g-preparations-benzathine",
  "name": "Penicillin G Preparations—benzathine",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IM",
    "notes": "25,000–50,000 units/kg/dose IM × 1. Max. dose: 1.2 million units/dose OR:",
    "maxDose": "1",
    "unit": "units/kg/dose",
    "perKg": true,
    "value": 0
   },
   {
    "route": "IM",
    "notes": "600,000 units/dose IM × 1 ≥ 27 kg and adult: 1.2 million units/dose IM × 1 Continued • 600,000 units/dose IM Q3–4 wk",
    "unit": "units/dose",
    "perKg": false,
    "value": 0
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Extencilline, Lentocilin Antibiotic, penicillin (very-long-acting IM). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-penicillin-g-preparations-penicillin-g-benzathine-and-penicillin-g-procaine",
  "name": "Penicillin G Preparations—penicillin G Benzathine and Penicillin G Procaine",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IM",
    "notes": "<14 kg: 600,000 units/dose IM × 1 14–<27 kg: 900,000–1,200,000 units/dose IM × 1 • Bicillin C-R: 2,400,000 units/dose IM × 1 Bicillin C-R 900/300: 1,200,000 units/dose IM × 1 Pneumococcal infection (non-CNS): Dosed Q2–3 days until afebrile for 48 hr (see remarks) PENICILLIN G PREPARATIONS—PENICILLIN G BENZATHINE AND PENICILLIN G PROCAINE continued • Bicillin C-R: 600,000 units/dose IM Bicillin C-R 900/300: 1,200,000 units/dose IM Adult (Bicillin C-R or Bicillin C-R 900/300): 1,200,000 units/dose IM This preparation provides early peak levels in addition to prolonged levels of penicillin in the blood. Do not use this product to treat syphilis; treatment failure can occur. Use with caution in renal failure, asthma, significant allergies, glucos",
    "unit": "units/dose",
    "perKg": false,
    "value": 0
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: C-R 900/300 Antibiotic, penicillin (very-long-acting IM). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-penicillin-v-potassium",
  "name": "Penicillin V Potassium",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "25–75 mg/kg/24 hr PO ÷ Q6–8 hr; max. dose: 2 g/24 hr",
    "maxDose": "2 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 75
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "250 mg PO BID–TID × 10 days",
    "unit": "mg",
    "perKg": false,
    "value": 250
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "500 mg PO BID–TID × 10 days Rheumatic fever prophylaxis, and pneumococcal prophylaxis for sickle cell disease and functional or anatomic asplenia (regardless of immunization status): 2 mo–",
    "unit": "mg",
    "perKg": false,
    "value": 500
   }
  ],
  "indications": [
   "Recurrent rheumatic fever prophylaxis"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 250, 500 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, penicillin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pentamidine-isethionate",
  "name": "Pentamidine Isethionate",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "notes": "9 mg/kg ( max. dose: 300 mg/dose) Q month",
    "maxDose": "300 mg/dose) Q month",
    "unit": "mg/kg",
    "perKg": true,
    "value": 9
   },
   {
    "route": "Oral",
    "frequency": "Daily",
    "notes": "300 mg Q month Use with caution in ventricular tachycardia, Stevens-Johnson syndrome, and daily doses >21 days.",
    "unit": "mg",
    "perKg": false,
    "value": 300
   },
   {
    "route": "IM",
    "notes": "2–6 mg/kg/dose. Max. dose: 100 mg",
    "maxDose": "100 mg",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 2,
    "max": 6
   }
  ],
  "indications": [
   "Hypnotic/preoperative sedation"
  ],
  "contraindications": [
   "Hypnotic/preoperative sedation"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-permethrin",
  "name": "Permethrin",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Head lice: Saturate hair and scalp and apply behind the ears and at the base of the neck with 1% cream rinse/lotion after shampooing, rinsing, and towel drying hair. Leave on for 10 min, then rinse. May repeat in 7 days. May be used for lice in other areas of the body (e.g., pubic lice) in same fashion. If the 1% cream rinse is resistant, the 5% cream may be used after shampooing, rinsing, and tow",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Scabicidal agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-phenazopyridine-hcl",
  "name": "Phenazopyridine HCL",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "12 mg/kg/24 hr PO ÷ TID until symptoms of lower urinary tract irritation are controlled or for 2 days. Max. dose: 200 mg/dose Per-dose amount calculated from 12 mg/kg/day divided by 3 (Three times daily).",
    "maxDose": "200 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 4
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "12 mg/kg/24 hr PO ÷ TID until symptoms of lower urinary tract irritation are controlled or for 2 days. Max. dose: 200 mg/dose",
    "maxDose": "200 mg/dose",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 12
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "190–200 mg PO TID until symptoms are controlled or for 2 days",
    "unit": "mg",
    "perKg": false,
    "min": 190,
    "max": 200
   },
   {
    "route": "IV",
    "notes": "15–20 mg/kg/dose ( max. loading dose: 1000 mg) in a single or divided dose. May give additional 5 mg/kg doses Q20 min to a max. total of 30 mg/kg Seizures maintenance therapy (PO/IV): Monitor levels.",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 15,
    "max": 20
   }
  ],
  "indications": [
   "Loading dose, IV"
  ],
  "contraindications": [
   "porphyria, severe respiratory disease with dyspnea, or obstruction"
  ],
  "formulations": [
   "Tabs: 95 mg [OTC] (12s, 30s), 99.5 mg [OTC] (24s, 72s), 100 mg, 200 mg",
   "Tabs: 15, 16.2, 30, 32.4, 60, 64.8, 97.2, 100 mg Oral elixir or solution: 20 mg/5 mL (15, 473 mL); may contain 15% alcohol"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-phentolamine-mesylate",
  "name": "Phentolamine Mesylate",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "notes": "0.1–0.2 mg/kg/dose or 5 mg Diagnosis of pheochromocytoma:",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.2
   },
   {
    "route": "IV",
    "notes": "1 mg",
    "unit": "mg",
    "perKg": false,
    "value": 1
   },
   {
    "route": "IM",
    "notes": "3 mg",
    "unit": "mg",
    "perKg": false,
    "value": 3
   }
  ],
  "indications": [
   "Diagnosis of pheochromocytoma",
   "IM/IV"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor for hypotension (blood pressure) Q15 min × 4 then Q1 hr × 2"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-phenylephrine-hcl",
  "name": "Phenylephrine HCL",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "notes": "2.5 mg/5 mL (118 mL); contains EDTA and sodium benzoate Hypotension: To prepare infusion: See inside front cover .",
    "unit": "mg",
    "perKg": false,
    "value": 2.5
   },
   {
    "route": "IV",
    "notes": "IV bolus: 5–20 mCg/kg/dose ( initial max. dose: 500 mCg/dose, subsequent max. dose: 1000 mCg/ dose) Q10–15 min PRN IV drip: Start at 0.1–0.5 mCg/kg/min; titrate to effect. IM/",
    "maxDose": "500 mCg/dose",
    "unit": "mcg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 20
   },
   {
    "route": "Subcutaneous",
    "frequency": "Every 1-2 hours",
    "notes": "0.1 mg/kg/dose Q1–2 hr PRN; max. dose: 5 mg",
    "maxDose": "5 mg",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.1
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-phosphorus-supplements",
  "name": "Phosphorus Supplements",
  "category": "vitamin",
  "doses": [
   {
    "route": "IV",
    "notes": "0.5–1.5 mM/kg (or 15–45 mg/kg) over 24 hr",
    "unit": "mg/kg",
    "perKg": true,
    "min": 15,
    "max": 45
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "30–90 mg/kg/24 hr (or 1–3 mM/kg/24 hr) ÷ TID–QID Per-dose amount calculated from 30–90 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 30
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "30–90 mg/kg/24 hr (or 1–3 mM/kg/24 hr) ÷ TID–QID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 30,
    "max": 90
   }
  ],
  "indications": [
   "Maintenance/replacement"
  ],
  "contraindications": [
   "TID–QID"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Electrolyte supplement. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-physostigmine-salicylate",
  "name": "Physostigmine Salicylate",
  "category": "antidote",
  "doses": [
   {
    "route": "IV",
    "notes": "0.02 mg/kg/dose ( max. dose: 0.5 mg/dose) IM or IV (administered no >0.5 mg/min); dose may be repeated every 5–10 min if no response or return of anticholinergic symptoms up to a max. total of 2 mg",
    "maxDose": "0",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.02
   }
  ],
  "indications": [],
  "contraindications": [
   "asthma, gangrene, diabetes, cardiovascular disease, gastrointestinal (GI) or genitourinary tract obstruction, any vagotonic state, and patients receiving choline esters or depolarizing neuromuscular blocking agents (e.g., decamethonium, succinylcholine)"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor INR Q24 hr until INR <4",
   "Monitor INR Q12 hr and give PO vitamin K (dose may be repeated Q12–24 hr PRN): <40 kg: 0.06 mg/kg PO × 1 ≥ 40 kg: 5–10 mg PO × 1"
  ],
  "notes": "Formulary class: Cholinergic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pilocarpine-hcl",
  "name": "Pilocarpine HCL",
  "category": "ophthalmic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Instill 1 drop of the 1% solution into each affected eye(s) TID. Child ≥ 2 yr, adolescent, and adult: Instill 1–2 drop(s) in each affected eye up to 4 times a day; concentration and dosage frequency are dependent on the degree of elevated pressure and miotic response. Xerostomia:",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [
   "Xerostomia"
  ],
  "contraindications": [
   "Acute iritis or anterior chamber inflammation",
   "Uncontrolled asthma"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pimecrolimus",
  "name": "Pimecrolimus",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Apply a thin layer to affected area BID and rub in gently and completely. Reevaluate patient in 6 wk if lesions are not healed. Do not use in children <2 yr (higher rate of upper respiratory infections), in immunocompromised patients, or with occlusive dressings (promotes systemic absorption). Avoid use on malignant or premalignant skin conditions as rare cases of lymphoma and skin malignancy have",
    "unit": "g",
    "perKg": false,
    "value": 2
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-polyethylene-glycol-electrolyte-solution",
  "name": "Polyethylene Glycol—electrolyte Solution",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "1.5 g/kg/24 hr ( max. dose: 100 g/24 hr) × 4 days Constipation (using MiraLax or equivalent product):",
    "maxDose": "100 g/24 hr) × 4 days Constipation (using MiraLax or equivalent product):",
    "unit": "g/kg/day",
    "perKg": true,
    "value": 1.5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "A mean effective dose of 0.84 g/kg/24 hr PO ÷ BID for 8 wk (range: 0.25–1.42 g/kg/24 hr) was used to yield 2 soft stools per day. Do not exceed 17 g/24 hr. If patient >20 kg, use adult dose. Per-dose amount calculated from 0.25–1.42 g/kg/day divided by 2 (Twice daily).",
    "unit": "g/kg/dose",
    "perKg": true,
    "min": 0.125,
    "max": 0.71
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "A mean effective dose of 0.84 g/kg/24 hr PO ÷ BID for 8 wk (range: 0.25–1.42 g/kg/24 hr) was used to yield 2 soft stools per day. Do not exceed 17 g/24 hr. If patient >20 kg, use adult dose.",
    "unit": "g/kg/day",
    "perKg": true,
    "min": 0.25,
    "max": 1.42
   },
   {
    "route": "Oral",
    "notes": "1–1.5 g/kg/24 hr ( max. dose: 100 g/24 hr) PO × 3–6 days. Following disimpaction, give a maintenance dose of 0.4–1 g/kg/24 hr for ≥ 2 mo followed by a gradual decrease in dose. POLYETHYLENE GLYCOL—ELECTROLYTE SOLUTION continued",
    "maxDose": "100 g/24 hr) PO × 3–6 days",
    "unit": "g/kg/day",
    "perKg": true,
    "min": 1,
    "max": 1.5
   }
  ],
  "indications": [
   "L/kg/hr until rectal effluent is clear"
  ],
  "contraindications": [
   "Polyethylene glycol hypersensitivity"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor electrolytes, blood urea nitrogen, serum glucose, and urine osmolality with prolonged administration"
  ],
  "notes": "Formulary class: including generics Bowel evacuant, osmotic laxative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-polymyxin-b-sulfate-and-trimethoprim-sulfate",
  "name": "Polymyxin B Sulfate and Trimethoprim Sulfate",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Instill 1 drop in the affected eye(s) Q3 hr ( max. of 6 doses/24 hr) × 7–10 days. A reduced dosage of 1 drop QID x 5–7 days has been used in children and adolescents with acute conjunctivitis. Active against susceptible strains of Staphylococcus aureus , Staphylococcus epidermidis , Streptococcus pneumoniae , Streptococcus viridans , Haemophilus influenzae , and Pseudomonas aeruginosa. Not indicat",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Solution Topical antibiotic (ophthalmic preparations listed). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-polymyxin-b-sulfate-neomycin-sulfate-hydrocortisone-otic",
  "name": "Polymyxin B Sulfate, Neomycin Sulfate, Hydrocortisone Otic",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Topical",
    "notes": "3 drops TID–QID × 7–10 days. If preferred, a cotton wick may be saturated and inserted into ear canal. Moisten wick with antibiotic every 4 hr and replace the wick Q24 hr.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with active varicella",
   "Herpes simplex",
   "In cases with perforated eardrum (possible ototoxicity)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Otic Topical otic antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-posaconazole",
  "name": "Posaconazole",
  "category": "antifungal",
  "doses": [
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "<34 kg: 4.5–6 mg/kg/dose PO QID; max. dose: 800 mg/24 hr ≥34 kg: 200 mg PO QID IV (very limited data from two series comprising 12 bone marrow transplant patients and 2 hematology/oncology patients): Chlid 1.5–11 yr: 6–10 mg/kg/dose IV BID x 1 day, followed by 6–10 mg/kg/dose IV once daily; max. dose: 300 mg/dose Prophylaxis for invasive Aspergillus and Candida in severely immunocompromised (e.g.,",
    "maxDose": "800 mg/24 hr ≥34 kg: 200 mg PO QID IV (very limited data from two series comprising 12 bone marrow transplant patients and 2 hematology/oncology patients): Chlid 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 4.5,
    "max": 6
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–<12 kg: 90 mg (3 mL) PO BID × 1 day, followed by 90 mg PO once daily 12–<17 kg: 120 mg (4 mL) PO BID × 1 day, followed by 120 mg PO once daily 17–<21 kg: 150 mg (5 mL) PO BID × 1 day, followed by 150 mg PO once daily 21–<26 kg: 180 mg (6 mL) PO BID × 1 day, followed by 180 mg PO once daily 26–<36 kg: 210 mg (7 mL) PO BID × 1 day, followed by 210 mg PO once daily 36–40 kg: 240 mg (8 mL) PO BID ×",
    "unit": "mg",
    "perKg": false,
    "value": 90
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "300 mg PO BID × 1 day, followed by 300 mg PO once daily Immediate-release oral suspension:",
    "unit": "mg",
    "perKg": false,
    "value": 300
   }
  ],
  "indications": [
   "IV once daily"
  ],
  "contraindications": [
   "IV once daily"
  ],
  "formulations": [
   "Noxafil, Noxafil PowderMix, and generics Antifungal agent C 3 Yes Yes No Delayed-release tabs: 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-potassium-iodide",
  "name": "Potassium Iodide",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "50–250 mg (about 1–5 drops of SSKI) PO TID",
    "unit": "mg",
    "perKg": false,
    "min": 50,
    "max": 250
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "50 mg PO TID. Dose may be gradually increased as tolerated to the max. dose of the lesser of 50 mg/kg/dose or 2000–2500 mg PO TID.",
    "unit": "mg",
    "perKg": false,
    "min": 2000,
    "max": 2500
   }
  ],
  "indications": [
   "SSKI) PO TID",
   "PO once daily Thyrotoxicosis"
  ],
  "contraindications": [
   "pregnancy, hyperkalemia, iodine-induced goiter, and hypothyroidism"
  ],
  "formulations": [
   "Tabs: Iosat [OTC]: 65 mg (50 mg iodine), 130 mg ThyroSafe [OTC]: 65 mg"
  ],
  "monitoring": [
   "Monitor thyroid function tests"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-potassium-supplements",
  "name": "Potassium Supplements",
  "category": "vitamin",
  "doses": [
   {
    "route": "Topical",
    "notes": "1–4 mEq/kg/24 hr ÷ BID–QID. Monitor serum potassium.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Potassium chloride (40 mEq K = 3 g KCl): Sustained-release caps: 8, 10 mEq Sustained-release tabs: 8, 10, 15, 20 mEq"
  ],
  "monitoring": [
   "Monitor serum potassium"
  ],
  "notes": "Formulary class: Electrolyte. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pralidoxime-chloride-atropine",
  "name": "Pralidoxime Chloride Atropine",
  "category": "antidote",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 10-12 hours",
    "notes": "IV intermittent: 20–50 mg/kg/dose ( max. dose: 2000 mg) IV × 1. May repeat in 1–2 hr if muscle weakness is not relieved, then at Q10–12 hr PRN if cholinergic signs reappear. IV continuous infusion: Loading dose of 20–50 mg/kg/dose ( max. dose: 2000 mg) IV over 15–30 min followed by 10–20 mg/kg/hr ( max. dose: 500 mg/hr) IM (use when IV route not feasible): <40 kg: 15 mg/kg/dose IM × 1. May repeat",
    "maxDose": "2000 mg) IV × 1",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 20,
    "max": 50
   }
  ],
  "indications": [
   "Organophosphate poisoning"
  ],
  "contraindications": [
   "poisonings due to phosphorus, inorganic phosphates, or organic phosphates without anticholinesterase activity"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: with atropine: ATNAA Antidote, organophosphate poisoning. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-primaquine-phosphate",
  "name": "Primaquine Phosphate",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.5 mg/kg/dose ( max. dose: 30 mg/dose) PO once daily × 14 days • 0.5 mg/kg/dose PO once daily; max. dose: 30 mg/24 hr",
    "maxDose": "30 mg/dose) PO once daily × 14 days",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.3 mg/kg/dose ( max. dose: 30 mg/dose) PO once daily × 21 days",
    "maxDose": "30 mg/dose) PO once daily × 21 days",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.3
   }
  ],
  "indications": [],
  "contraindications": [
   "Granulocytopenia (e"
  ],
  "formulations": [
   "Tabs: 26.3 mg (15 mg base)"
  ],
  "monitoring": [
   "Monitor electrocardiogram for Q–Tc prolongation in patients with cardiac disease, history of arrhythmias, uncorrected hypokalemia and/or hypomagnesemia, bradycardia, and receiving concomitant Q–Tc prolonging medications"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-primidone",
  "name": "Primidone",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "12–20 mg/kg/24 hr PO ÷ BID–QID; initiate therapy at the lower dosage range and titrate upward. Per-dose amount calculated from 12–20 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 6,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "12–20 mg/kg/24 hr PO ÷ BID–QID; initiate therapy at the lower dosage range and titrate upward.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 12,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Day of Therapy <8 Yr ≥ 8 Yr and Adult Days 1–3 50 mg PO QHS 100–125 mg PO QHS Days 4–6 50 mg PO BID 100–125 mg PO BID Days 7–9 100 mg PO BID 100–125 mg PO TID Day 10 and thereafter 125–250 mg PO TID or 10–25 mg/kg/ 24 hr PO ÷ TID–QID 250 mg PO TID–QID; max. dose: 2 g/24 hr Use with caution in renal or hepatic disease and pulmonary insufficiency. Primidone is metabolized to phenobarbital and has th",
    "maxDose": "2 g/24 hr Use with caution in renal or hepatic disease and pulmonary insufficiency",
    "unit": "mg",
    "perKg": false,
    "min": 100,
    "max": 125
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor for suicidal behavior or ideation",
   "Monitor both primidone and phenobarbital levels"
  ],
  "notes": "Formulary class: Anticonvulsant, barbiturate. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-probenecid",
  "name": "Probenecid",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Four times daily",
    "notes": "25 mg/kg PO × 1, then 40 mg/kg/24 hr PO ÷ QID; max. single dose: 500 mg/dose. Use adult dose if >50 kg.",
    "unit": "mg/kg",
    "perKg": true,
    "value": 25
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "PO or PR: 0.4 mg/kg/24 hr ÷ TID–QID PRN ( max. dose: 10 mg/dose) or alternative dosing by weight: 9–13 kg: 2.5 mg once daily–BID PRN; max. dose: 7.5 mg/24 hr >13–18 kg: 2.5 mg BID–TID PRN; max. dose: 10 mg/24 hr >18–39 kg: 2.5 mg TID or 5 mg BID PRN; max. dose: 15 mg/24 hr >39 kg: Use adult dose. Per-dose amount calculated from 0.4 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "10 mg/dose) or alternative dosing by weight: 9–13 kg: 2",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "PO or PR: 0.4 mg/kg/24 hr ÷ TID–QID PRN ( max. dose: 10 mg/dose) or alternative dosing by weight: 9–13 kg: 2.5 mg once daily–BID PRN; max. dose: 7.5 mg/24 hr >13–18 kg: 2.5 mg BID–TID PRN; max. dose: 10 mg/24 hr >18–39 kg: 2.5 mg TID or 5 mg BID PRN; max. dose: 15 mg/24 hr >39 kg: Use adult dose.",
    "maxDose": "10 mg/dose) or alternative dosing by weight: 9–13 kg: 2",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.4
   },
   {
    "route": "IM",
    "frequency": "Twice daily",
    "notes": "0.1–0.15 mg/kg/dose BID–TID PRN; max. dose: 10 mg/single dose or 40 mg/24 hr",
    "maxDose": "10 mg/single dose or 40 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.15
   }
  ],
  "indications": [
   "PO QID Hyperuricemia with gout",
   "Antiemetic doses"
  ],
  "contraindications": [
   "children <2 yr and patients with renal insufficiency"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Penicillin therapy adjuvant, uric acid–lowering agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-prochlorperazine",
  "name": "Prochlorperazine",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "PO or PR: 0.4 mg/kg/24 hr ÷ TID–QID PRN ( max. dose: 10 mg/dose) or alternative dosing by weight: 9–13 kg: 2.5 mg once daily–BID PRN; max. dose: 7.5 mg/24 hr >13–18 kg: 2.5 mg BID–TID PRN; max. dose: 10 mg/24 hr >18–39 kg: 2.5 mg TID or 5 mg BID PRN; max. dose: 15 mg/24 hr >39 kg: Use adult dose. Per-dose amount calculated from 0.4 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "10 mg/dose) or alternative dosing by weight: 9–13 kg: 2",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "PO or PR: 0.4 mg/kg/24 hr ÷ TID–QID PRN ( max. dose: 10 mg/dose) or alternative dosing by weight: 9–13 kg: 2.5 mg once daily–BID PRN; max. dose: 7.5 mg/24 hr >13–18 kg: 2.5 mg BID–TID PRN; max. dose: 10 mg/24 hr >18–39 kg: 2.5 mg TID or 5 mg BID PRN; max. dose: 15 mg/24 hr >39 kg: Use adult dose.",
    "maxDose": "10 mg/dose) or alternative dosing by weight: 9–13 kg: 2",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.4
   },
   {
    "route": "IM",
    "frequency": "Twice daily",
    "notes": "0.1–0.15 mg/kg/dose BID–TID PRN; max. dose: 10 mg/single dose or 40 mg/24 hr",
    "maxDose": "10 mg/single dose or 40 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.15
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start with 2.5 mg BID–TID with a max. first-day dose of 10 mg/24 hr. Dose may be increased as needed to 20 mg/24 hr for children 2–5 yr and 25 mg/24 hr for 6–12 yr.",
    "unit": "mg",
    "perKg": false,
    "value": 2.5
   }
  ],
  "indications": [
   "PO immediately",
   "Antiemetic doses",
   "Psychoses",
   "PO immediately Intractable migraines"
  ],
  "contraindications": [
   "PO immediately"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antiemetic, phenothiazine derivative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-propylthiouracil",
  "name": "Propylthiouracil",
  "category": "endocrine",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "5–10 mg/kg/24 hr PO ÷ Q8 hr PROPYLTHIOURACIL continued Per-dose amount calculated from 5–10 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1.667,
    "max": 3.333
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "5–10 mg/kg/24 hr PO ÷ Q8 hr PROPYLTHIOURACIL continued",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Initial: 5–7 mg/kg/24 hr PO ÷ Q8 hr, OR by age: 6–10 yr: 50–150 mg/24 hr PO ÷ Q8 hr Per-dose amount calculated from 5–7 mg/kg/day divided by 3 (Every 8 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1.667,
    "max": 2.333
   },
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Initial: 5–7 mg/kg/24 hr PO ÷ Q8 hr, OR by age: 6–10 yr: 50–150 mg/24 hr PO ÷ Q8 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 5,
    "max": 7
   },
   {
    "route": "Oral",
    "frequency": "Every 8-12 hours",
    "notes": "150–300 mg/24 hr PO ÷ Q8 hr Maintenance: Generally begins after 2 mo. Usually 1/3–2/3 the initial dose in divided doses (Q8–12 hr) when the patient is euthyroid",
    "unit": "mg/day",
    "perKg": false,
    "min": 150,
    "max": 300
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 50 mg"
  ],
  "monitoring": [
   "Monitor thyroid function"
  ],
  "notes": "Formulary class: Antithyroid agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pseudoephedrine",
  "name": "Pseudoephedrine",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "notes": "30, 60 mg Extended-release tab (OTC): Sudafed 12 Hour and generics: 120 mg Sudafed 24 Hour: 240 mg Oral liquid:",
    "unit": "mg",
    "perKg": false,
    "value": 60
   },
   {
    "route": "Oral",
    "notes": "15 mg/5 mL (120 mL); alcohol and sugar free; contains edetate disodium (EDTA), polyethylene glycol, and sodium benzoate Purchases of over-the-counter (OTC) products are limited to behind-the–pharmacy counter sales with monthly sale limits due to the methamphetamine epidemic.",
    "unit": "mg",
    "perKg": false,
    "value": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "4 mg/kg/24 hr PO ÷ Q6 hr or by age: Per-dose amount calculated from 4 mg/kg/day divided by 4 (Every 6 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "4 mg/kg/24 hr PO ÷ Q6 hr or by age:",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 4
   }
  ],
  "indications": [
   "Oral liquid"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Sympathomimetic, nasal decongestant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-psyllium",
  "name": "Psyllium",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1.25–2.5 g/dose PO once daily–TID; max. dose: 7.5 g/24 hr 6–11 yr: 2.5–3.75 g/dose PO once daily–TID; max. dose: 15 g/24 hr",
    "maxDose": "7",
    "unit": "g/dose",
    "perKg": false,
    "min": 1.25,
    "max": 2.5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2.5–7.5 g/dose PO once daily–TID; max. dose: 30 g/24 hr",
    "maxDose": "30 g/24 hr",
    "unit": "g/dose",
    "perKg": false,
    "min": 2.5,
    "max": 7.5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Ascaris (roundworm) and Trichostrongylus : 11 mg/kg/dose PO × 1 Enterobius (pinworm): 11 mg/kg/dose PO × 1. Repeat same dose 2 wk later. Hookworm or eosinophilic enterocolitis: 11 mg/kg/dose PO once daily × 3 days Moniliformis : 11 mg/kg/dose PO Q2 wk × 3 doses Max. dose (all indications): 1 g/dose Use with caution in liver dysfunction. Do not use in combination with piperazine because of antagoni",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 11
   }
  ],
  "indications": [],
  "contraindications": [
   "Cases of fecal impaction or gastrointestinal obstruction"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Bulk-forming laxative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pyrantel-pamoate",
  "name": "Pyrantel Pamoate",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Ascaris (roundworm) and Trichostrongylus : 11 mg/kg/dose PO × 1 Enterobius (pinworm): 11 mg/kg/dose PO × 1. Repeat same dose 2 wk later. Hookworm or eosinophilic enterocolitis: 11 mg/kg/dose PO once daily × 3 days Moniliformis : 11 mg/kg/dose PO Q2 wk × 3 doses Max. dose (all indications): 1 g/dose Use with caution in liver dysfunction. Do not use in combination with piperazine because of antagoni",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 11
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Anthelmintic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pyrazinamide",
  "name": "Pyrazinamide",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "<40 kg: Daily dose regimen: 30–40 mg/kg/24 hr PO once daily; max. dose: 2 g/24 hr Twice-weekly dose regimen: 50 mg/kg/dose PO 2× per week; max. dose: 2 g/dose ≥ 40 kg: Use adult dosage below. Per-dose amount calculated from 30–40 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "2 g/24 hr Twice-weekly dose regimen: 50 mg/kg/dose PO 2× per week",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 30,
    "max": 40
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "<40 kg: Daily dose regimen: 30–40 mg/kg/24 hr PO once daily; max. dose: 2 g/24 hr Twice-weekly dose regimen: 50 mg/kg/dose PO 2× per week; max. dose: 2 g/dose ≥ 40 kg: Use adult dosage below.",
    "maxDose": "2 g/24 hr Twice-weekly dose regimen: 50 mg/kg/dose PO 2× per week",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 30,
    "max": 40
   }
  ],
  "indications": [],
  "contraindications": [
   "severe hepatic damage and acute gout"
  ],
  "formulations": [
   "Tabs: 500 mg",
   "Oral suspension: 100 mg/mL In combination with isoniazid and rifampin (Rifater):"
  ],
  "monitoring": [
   "Monitor liver function tests (baseline and periodic) and serum uric acid"
  ],
  "notes": "Formulary class: Antituberculous agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pyrethrins-with-piperonyl-butoxide",
  "name": "Pyrethrins with Piperonyl Butoxide",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Apply to dry hair or affected body area for 10 min, then wash thoroughly and comb with fine-tooth comb or nit-removing comb; repeat in 7–10 days. PYRETHRINS WITH PIPERONYL BUTOXIDE continued",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [
   "Ragweed hypersensitivity",
   "Drug is derived from the chrysanthemum flowers"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Plus, RID, and many others Pediculicide. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pyridostigmine-bromide",
  "name": "Pyridostigmine Bromide",
  "category": "other",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4 hours",
    "notes": "1 mg/kg/dose Q4 hr; max. dose: 7 mg/kg/24 hr IM/",
    "maxDose": "7 mg/kg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1
   },
   {
    "route": "IV",
    "frequency": "Every 4-6 hours",
    "notes": "0.05–0.15 mg/kg/dose Q4–6 hr; max. single IM/IV dose: 10 mg",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.05,
    "max": 0.15
   },
   {
    "route": "Oral",
    "notes": "7 mg/kg/24 hr in 5–6 divided doses IM/",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 7
   }
  ],
  "indications": [
   "Myasthenia gravis"
  ],
  "contraindications": [
   "Mechanical intestinal or urinary obstruction"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Cholinergic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-pyrimethamine",
  "name": "Pyrimethamine",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Load: 2 mg/kg/24 hr PO ÷ BID ( max. dose: 100 mg/24 hr) with the following duration: Non–HIV exposed/positive: 2 days HIV exposed/positive: 3 days Maintenance: Non–HIV exposed/positive: 1 mg/kg/24 hr PO once daily ( max. dose: 25–50 mg/24 hr) × 6 mo, followed by 1 mg/kg/dose ( max. dose: 25–50 mg/24 hr) 3 times per week to complete a total 12 mo of therapy PYRIMETHAMINE continued HIV exposed/posit",
    "maxDose": "100 mg/24 hr) with the following duration: Non–HIV exposed/positive: 2 days HIV exposed/positive: 3 days Maintenance: Non–HIV exposed/positive: 1 mg/kg/24 hr PO once daily ( max",
    "unit": "mg/day",
    "perKg": false,
    "min": 25,
    "max": 50
   }
  ],
  "indications": [],
  "contraindications": [
   "megaloblastic anemia secondary to folate deficiency"
  ],
  "formulations": [
   "Tabs: 25 mg; scored tablet (see remarks for outpatient prescription process)"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antiparasitic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-quetiapine",
  "name": "Quetiapine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "25 mg BID Day 2: 50 mg BID Day 3: 100 mg BID Day 4: 150 mg BID Day 5: 200 mg BID ≥ Day 6: If needed, additional increases should be ≤ 100 mg/24 hr up to 600 mg/24 hr. Total daily doses may be divided TID based on response and tolerability 400–600 mg/24 hr 600 mg/24 hr Continued",
    "unit": "mg/day",
    "perKg": false,
    "min": 400,
    "max": 600
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "50 mg QHS Day 2: 100 mg QHS Day 3–5: Increase by 100 mg/24 hr increments each day until 400 mg once daily is achieved on day 5 400–600 mg once daily 600 mg/24 hr Adult (monotherapy or in combination with lithium or divalproex) Day 1: 300 mg QHS Day 2: 600 mg QHS Day 3: Adjust dose to 400–800 mg once daily based on efficacy and tolerance 400–800 mg once daily 800 mg/24 hr (some may require 1200 mg/",
    "unit": "mg",
    "perKg": false,
    "min": 400,
    "max": 600
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antipsychotic, second generation. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-quinidine",
  "name": "Quinidine",
  "category": "antiparasitic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "15–60 mg/kg/24 hr PO ÷ Q6 hr; max. dose: 2400 mg/24 hr Per-dose amount calculated from 15–60 mg/kg/day divided by 4 (Every 6 hours).",
    "maxDose": "2400 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3.75,
    "max": 15
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "15–60 mg/kg/24 hr PO ÷ Q6 hr; max. dose: 2400 mg/24 hr",
    "maxDose": "2400 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 60
   },
   {
    "route": "IV",
    "notes": "Loading dose: 10 mg/kg/dose IV ( max. dose: 600 mg) over 1–2 hr followed by maintenance dose. Omit or decrease load if patient has received quinine or mefloquine. QUINIDINE continued Maintenance dose: 0.02 mg/kg/min IV as continuous infusion until oral therapy can be initiated. If more than 48 hr of IV therapy is required, reduce dose by 30%–50%. Test dose is given to assess for idiosyncratic reac",
    "maxDose": "600 mg) over 1–2 hr followed by maintenance dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 10
   }
  ],
  "indications": [
   "Malaria"
  ],
  "contraindications": [],
  "formulations": [
   "As gluconate (62% quinidine): Slow-release tabs: 324 mg As sulfate (83% quinidine):",
   "Tabs: 200, 300 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Class IA antiarrhythmic, antimalarial agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-raltegravir",
  "name": "Raltegravir",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1.5 mg/kg/dose PO once daily or by the following weight categories: 2–<3 kg: 4 mg PO once daily 3–<4 kg: 5 mg PO once daily 4–<5 kg: 7 mg PO once daily 1–4 weeks old: 3 mg/kg/dose PO BID or by the following weight categories: 2–<3 kg: 8 mg PO BID 3–<4 kg: 10 mg PO BID 4–<5 kg: 15 mg PO BID 4–6 weeks old: 6 mg/kg/dose PO BID or by the following weight categories: 3–<4 kg: 25 mg PO BID 4–<6 kg: 30 m",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1.5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Isentress HD Antiretroviral agent, integrase inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ribavirin",
  "name": "Ribavirin",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "<47 kg: 15 mg/kg/24 hr PO ÷ BID 47–49 kg: 600 mg/24 hr PO ÷ BID 50–65 kg: 800 mg/24 hr PO ÷ BID 66–80 kg: 1000 mg/24 hr PO ÷ BID >80 kg: 1200 mg/24 hr PO ÷ BID Duration of therapy: Genotype 2: 12 wk Genotype 3: 24 wk Per-dose amount calculated from 15 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 7.5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "<47 kg: 15 mg/kg/24 hr PO ÷ BID 47–49 kg: 600 mg/24 hr PO ÷ BID 50–65 kg: 800 mg/24 hr PO ÷ BID 66–80 kg: 1000 mg/24 hr PO ÷ BID >80 kg: 1200 mg/24 hr PO ÷ BID Duration of therapy: Genotype 2: 12 wk Genotype 3: 24 wk",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 15
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "12 mg/kg/dose PO once daily; may further reduce to 8 mg/kg/dose PO once daily • 12 mg/kg/dose PO once daily; may further reduce to 8 mg/kg/dose PO once daily (monitor weekly)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 12
   }
  ],
  "indications": [
   "PO once daily"
  ],
  "contraindications": [
   "PO once daily"
  ],
  "formulations": [
   "Oral: Generics; previously available as Rebetol Inhalation: Virazole and generics Antiviral agent X 3 Yes Yes No Oral caps: 200 mg"
  ],
  "monitoring": [
   "Weekly) Adult: 600 mg PO once daily (capsules or solution) or 200 mg PO QAM and 400 mg PO QPM (tablets) Hgb <12 g/dL after 4 weeks of reduced dose: Discontinue therapy permanently"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-riboflavin",
  "name": "Riboflavin",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2.5–10 mg/24 hr PO ÷ once daily–BID",
    "unit": "mg/day",
    "perKg": false,
    "min": 2.5,
    "max": 10
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "200–400 mg PO once daily Hypersensitivity may occur. Administer with food. Causes yellow to orange discoloration of urine. For multivitamin information, see Chapter 21 . Pregnancy category changes to “C” if used in doses above the RDA. 1202 Part IV Formulary",
    "unit": "mg",
    "perKg": false,
    "min": 200,
    "max": 400
   }
  ],
  "indications": [
   "Riboflavin deficiency"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Water-soluble vitamin A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-rifabutin",
  "name": "Rifabutin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "300 mg PO once daily; doses may be administered as 150 mg PO BID if gastrointestinal (GI) upset occurs MAC secondary prophylaxis for recurrence of opportunistic disease in HIV (in combination with ethambutol and a macrolide antibiotic [clarithromycin or azithromycin]):",
    "unit": "mg",
    "perKg": false,
    "value": 300
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "5 mg/kg/24 hr PO once daily; max. dose: 300 mg/24 hr Per-dose amount calculated from 5 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "300 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "5 mg/kg/24 hr PO once daily; max. dose: 300 mg/24 hr",
    "maxDose": "300 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–20 mg/kg/24 hr PO once daily; max. dose: 300 mg/24 hr as part of a multidrug regimen for severe disease Per-dose amount calculated from 10–20 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "300 mg/24 hr as part of a multidrug regimen for severe disease",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–20 mg/kg/24 hr PO once daily; max. dose: 300 mg/24 hr as part of a multidrug regimen for severe disease",
    "maxDose": "300 mg/24 hr as part of a multidrug regimen for severe disease",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 20
   }
  ],
  "indications": [
   "PO BID if GI upset occurs MAC treatment"
  ],
  "contraindications": [
   "patients being treated with cabotegravir/rilpivirine due to significant cytochrome P-450 (CYP) 3A enzyme induction (see below for additional drug interactions)"
  ],
  "formulations": [
   "Caps: 150 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antituberculous agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-rifaximin",
  "name": "Rifaximin",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "200 mg PO TID × 7–14 days",
    "unit": "mg",
    "perKg": false,
    "value": 200
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "200–550 mg PO TID × 7–14 days",
    "unit": "mg",
    "perKg": false,
    "min": 200,
    "max": 550
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "10–30 mg/kg/24 hr PO ÷ TID; max. dose: 1200 mg/24 hr Per-dose amount calculated from 10–30 mg/kg/day divided by 3 (Three times daily).",
    "maxDose": "1200 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3.333,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "10–30 mg/kg/24 hr PO ÷ TID; max. dose: 1200 mg/24 hr",
    "maxDose": "1200 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 30
   }
  ],
  "indications": [
   "Irritable bowel syndrome with diarrhea"
  ],
  "contraindications": [],
  "formulations": [
   "Tabs: 200, 550 mg; may contain edetate disodium"
  ],
  "monitoring": [],
  "notes": "Formulary class: Xifaxan Antibiotic, rifamycin derivative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-rimantadine",
  "name": "Rimantadine",
  "category": "antiviral",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–9 yr: 5 mg/kg/24 hr PO ÷ once daily–BID; max. dose: 150 mg/24 hr Per-dose amount calculated from 5 mg/kg/day divided by 1 (Once daily).",
    "maxDose": "150 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1–9 yr: 5 mg/kg/24 hr PO ÷ once daily–BID; max. dose: 150 mg/24 hr • <40 kg: 5 mg/kg/24 hr PO ÷ BID; max. dose: 150 mg/24 hr ≥ 40 kg: 100 mg per dose PO BID",
    "maxDose": "150 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "<40 kg: 5 mg/kg/24 hr PO ÷ BID; max. dose: 150 mg/24 hr ≥ 40 kg: 100 mg per dose PO BID Per-dose amount calculated from 5 mg/kg/day divided by 2 (Twice daily).",
    "maxDose": "150 mg/24 hr ≥ 40 kg: 100 mg per dose PO BID",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 2.5
   }
  ],
  "indications": [
   "PO BID"
  ],
  "contraindications": [
   "amantadine hypersensitivity"
  ],
  "formulations": [
   "Tabs: 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-risperidone",
  "name": "Risperidone",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 0.5 mg/24 hr PO once daily (every morning [QAM] or QHS). If needed, increase dose at intervals ≥ 24 hr in increments of 0.5 or 1 mg/24 hr, as tolerated, up to a recommended dose of 2.5 mg/24 hr. Although efficacy has been demonstrated between 0.5 and 6 mg/24 hr, no additional benefit was seen above 2.5 mg/ 24 hr. Higher doses were associated with more adverse effects.",
    "unit": "mg/day",
    "perKg": false,
    "value": 0.5
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-rivaroxaban",
  "name": "Rivaroxaban",
  "category": "hematologic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Prevention and treatment dosages are similar. Initiate therapy after a minimum of 5 days of initial intravenous anticoagulation therapy. Neonates and infants <6 months old should have had at least 10 days of oral feedings. Use only the oral suspension dosage form for patients <30 kg and either oral suspension or tablets for patients >30 kg (2.5-mg tablet not recommended in children due to incomple",
    "unit": "mg",
    "perKg": false,
    "value": 0.8
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "Use only the oral suspension dosage form for patients <50 kg and either oral suspension or tablets for patients ≥50 kg (2.5-mg tablet not recommended in children due to incomplete pharmacokinetic/pharmacodynamic and clinical data). Doses may be administered with or without food. 7–7.9 kg: 1.1 mg PO Q12 hr 8–9.9 kg: 1.6 mg PO Q12 hr 10–11.9 kg: 1.7 mg PO Q12 hr 12–19.9 kg: 2 mg PO Q12 hr 20–29.9 kg",
    "unit": "mg",
    "perKg": false,
    "value": 1.1
   }
  ],
  "indications": [
   "Fontan procedure"
  ],
  "contraindications": [
   "Active pathological bleeding",
   "Severe hypersensitivity to rivaroxaban",
   "Its excipients"
  ],
  "formulations": [
   "Tabs: Xarelto: 2.5, 10, 15, 20 mg Xarelto Starter Pack: 15 mg (42 tabs) and 20 mg (9 tabs); provides 30 days of therapy Generic: 2.5 mg"
  ],
  "monitoring": [
   "Monitor patient weight regularly (especially those <12 kg) and review dosage level regularly to maintain a therapeutic dose"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-rizatriptan-benzoate",
  "name": "Rizatriptan Benzoate",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Daily",
    "notes": "<40 kg: 5 mg PO × 1 ≥ 40 kg: 10 mg PO × 1 ≥ 18 yr and adult (safety in an average of >4 headaches in a 30-day period has not been established; see remarks): 5–10 mg PO × 1. If needed in 2 hr, a second dose may be administered. Max. daily dose: 30 mg/24 hr Dosage adjustment if receiving propranolol:",
    "unit": "mg",
    "perKg": false,
    "min": 5,
    "max": 10
   },
   {
    "route": "Oral",
    "notes": "<40 kg: DO NOT USE ≥ 40 kg: 5 mg PO × 1; max. dose: 5 mg/24-hr period • 5 mg PO up to a maximum of three doses at 2-hr intervals; max. dose: 15 mg/ 24-hr period",
    "maxDose": "5 mg/24-hr period",
    "unit": "mg",
    "perKg": false,
    "value": 5
   }
  ],
  "indications": [
   "Dosage adjustment if receiving propranolol"
  ],
  "contraindications": [
   "Hemiplegic or basilar migraine, coronary artery vasospasm, uncontrolled hypertension, ischemic bowel or coronary artery disease, peripheral vascular disease, history of stroke or transient ischemic attack",
   "Current or recent use (within 2 weeks) of a monoamine oxidase inhibitor"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-rufinamide",
  "name": "Rufinamide",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every other day",
    "notes": "Start at 10 mg/kg/24 hr PO ÷ BID, then increase dose by ~10 mg/kg/24 hr every other day up to the maximum targeted dose of 45 mg/kg/24 hr ÷ BID not to exceed 3200 mg/24 hr.",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 10
   },
   {
    "route": "Oral",
    "frequency": "Every other day",
    "notes": "Start at 400–800 mg/24 hr PO ÷ BID, then increase dose by 400– 800 mg/24 hr every other day up to the maximum targeted dose of 3200 mg/24 hr ÷ BID. Use with concurrent valproate therapy: Use lower initial dosages; <10 mg/kg/24 hr for child 1–<17 yr and <400 mg/24 hr for ≥ 17 yr and adult. Continued",
    "unit": "mg/day",
    "perKg": false,
    "min": 400,
    "max": 800
   }
  ],
  "indications": [],
  "contraindications": [
   "Familial short qt syndrome"
  ],
  "formulations": [
   "Tabs: 200, 400 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-salmeterol",
  "name": "Salmeterol",
  "category": "respiratory",
  "doses": [
   {
    "route": "Inhaled",
    "frequency": "Every 12 hours",
    "notes": "1 inhalation (50 mCg) Q12 hr; max. dose: 1 inhalation Q12 hr Prevention of exercise-induced bronchospasm (see remarks):",
    "maxDose": "1 inhalation Q12 hr Prevention of exercise-induced bronchospasm (see remarks):",
    "unit": "mcg",
    "perKg": false,
    "value": 50
   }
  ],
  "indications": [],
  "contraindications": [
   "milk allergies",
   "contains milk proteins"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: β 2 -adrenergic agonist (long acting). Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-scopolamine-hydrobromide",
  "name": "Scopolamine Hydrobromide",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Topical",
    "notes": "Start with ¼ patch Q3 days x 1 week, if needed and tolerated, increase dose by ¼ patch every 7 days up to a maximum of 1 patch Q3 days. When administering new patch Q3 days, remove old patch and place new patch behind the other ear. Prevention of postoperative nausea and vomiting (apply patch behind the ear, the evening before surgery and remove patch the morning of the first postoperative day; li",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [
   "closed-angle glaucoma and hypersensitivity to belladonna alkaloids"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-selenium-sulfide",
  "name": "Selenium Sulfide",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Seborrhea/dandruff: Lotion: Massage 5–10 mL into wet scalp and leave on scalp for 2–3 min. Rinse thoroughly and repeat. Use 2 applications twice weekly for 2 wk for control; may be followed by a less frequent maintenance application of once every 1–4 wk. Shampoo: Massage shampoo into wet scalp, then rinse thoroughly. Shampoo at least twice weekly for 2 wk; may be followed by less frequent maintena",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Topical antiseborrheic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-senna-sennosides",
  "name": "Senna/sennosides",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "Oral: 10–20 mg/kg/dose PO QHS ( max. dose: as shown below) or dosage by age:",
    "maxDose": "as shown below) or dosage by age:",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "notes": "55–109 mg PO QHS to max. dose: 218 mg/24 hr 2–5 yr: 109–218 mg PO QHS to max. dose: 436 mg/24 hr 5–15 yr: 218–436 mg PO QHS to max. dose: 872 mg/24 hr",
    "maxDose": "218 mg/24 hr 2–5 yr: 109–218 mg PO QHS to max",
    "unit": "mg",
    "perKg": false,
    "min": 55,
    "max": 109
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2.2–4.4 mg (1.25–2.5 mL) PO QHS to max. dose: 8.8 mg/24 hr 2–5 yr: 4.4–6.6 mg (2.5–3.75 mL) PO QHS to max. dose: 6.6 mg BID 6–12 yr: 8.8–13.2 mg (5–7.5 mL) PO QHS to max. dose: 13.2 mg BID Tabs or chewable tabs (8.6 mg): 2–5 yr : 4.3 mg PO QHS to max. dose: 8.6 mg BID 6–12 yr: 8.6 mg PO QHS to max. dose: 17.2 mg BID Chewable tabs (Genexa Kids Senna Laxative; 3 mg): 2–5 yr: 3 mg PO once daily or BI",
    "maxDose": "8",
    "unit": "mg",
    "perKg": false,
    "min": 2.2,
    "max": 4.4
   }
  ],
  "indications": [
   "Dosing based on mg senna",
   "BID Dosing based on mg sennosides"
  ],
  "contraindications": [
   "Dosing based on mg senna"
  ],
  "formulations": [
   "Based on mg of senna (all products are OTC): Oral syrup: 176 mg/5 mL, 218 mg/5 mL (60 mL, 240 mL); may contain parabens and propylene glycol",
   "Syrup: 436–654 mg PO QHS to max. dose: 654 mg (15 mL) BID",
   "Tabs: 374 mg PO QHS to max. dose: 748 mg BID Dosing based on mg sennosides: Child ≤ 12 yr:",
   "Syrup: 17.6–26.4 mg (10–15 mL) PO"
  ],
  "monitoring": [],
  "notes": "Formulary class: Laxative, and many others Laxative, stimulant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-silver-sulfadiazine",
  "name": "Silver Sulfadiazine",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Oral",
    "notes": "40 mg/0.6 mL (15, 30 mL); may contain sodium benzoate and polyethylene glycol Caps (Phazyme, Gas-X, and generics): 125, 180, 250 mg Chewable tabs: 80, 125 mg • 40 mg; contains 400 mg calcium carbonate Strip, orally disintegrating (Gas-X): 40 mg (16s), 62.5 mg (18s); contains alcohol",
    "unit": "mg",
    "perKg": false,
    "value": 40
   },
   {
    "route": "Oral",
    "notes": "20 mg PO QPC and QHS PRN; max. dose: 240 mg/24 hr 2–12 yr: 40 mg PO QPC and QHS PRN; max. dose: 480 mg/24 hr",
    "maxDose": "240 mg/24 hr 2–12 yr: 40 mg PO QPC and QHS PRN",
    "unit": "mg",
    "perKg": false,
    "value": 20
   }
  ],
  "indications": [
   "Burns"
  ],
  "contraindications": [
   "premature infants and infants up to 2 mo of age due to concerns of kernicterus",
   "also contraindicated in pregnancy (approaching term)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-simethicone",
  "name": "Simethicone",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "notes": "40 mg/0.6 mL (15, 30 mL); may contain sodium benzoate and polyethylene glycol Caps (Phazyme, Gas-X, and generics): 125, 180, 250 mg Chewable tabs: 80, 125 mg • 40 mg; contains 400 mg calcium carbonate Strip, orally disintegrating (Gas-X): 40 mg (16s), 62.5 mg (18s); contains alcohol",
    "unit": "mg",
    "perKg": false,
    "value": 40
   },
   {
    "route": "Oral",
    "notes": "20 mg PO QPC and QHS PRN; max. dose: 240 mg/24 hr 2–12 yr: 40 mg PO QPC and QHS PRN; max. dose: 480 mg/24 hr",
    "maxDose": "240 mg/24 hr 2–12 yr: 40 mg PO QPC and QHS PRN",
    "unit": "mg",
    "perKg": false,
    "value": 20
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antiflatulent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sirolimus",
  "name": "Sirolimus",
  "category": "immunosuppressant",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "conversion from tacrolimus with stable graft function for a minimum of 3 months after transplantation (use of oral solution is preferred; tablet and oral solution dosage forms are NOT bioequivalent; see remarks): 5 mg/m 2 /dose PO x 1, followed by 3 mg/m 2 /24 hr PO ÷ Q12 hr on the next day. Adjust dose to achieve desired trough blood level. Adult (use of oral solution is preferred; tablet and ora",
    "unit": "mg",
    "perKg": false,
    "value": 5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Reassess therapy if no improvement within 12 wk of use Hyftor (see remarks): Apply topical gel to affected area of the face BID (QAM and QHS) with the following maximum daily doses: 6–11 yr : 600 mg (2 cm)/24 hr",
    "unit": "mg",
    "perKg": false,
    "value": 600
   },
   {
    "route": "Oral",
    "notes": "800 mg (2.5 cm)/24 hr Increased susceptibility to infection and development of lymphoma may result from immunosuppression. Fatal bronchial anastomotic dehiscence has been reported in lung transplantation. Excess mortality, graft loss, and hepatic artery thrombosis have been reported in liver transplantation when used with tacrolimus. Patients with the greatest amount of urinary protein excretion p",
    "unit": "mg",
    "perKg": false,
    "value": 800
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 0.5, 1, 2 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sodium-chloride-inhaled-preparations",
  "name": "Sodium Chloride—inhaled Preparations",
  "category": "respiratory",
  "doses": [
   {
    "route": "Topical",
    "notes": "Spray/Mist: 2–6 sprays into each nostril Q2 hr PRN Drops: 2–6 drops into each nostril Q2 hr PRN Cystic fibrosis (pretreatment with albuterol is recommended to prevent bronchospasms; see remarks): ≥ 2 yr and adult: Nebulize 4 mL of 7% solution once or twice daily. If patient is unable to tolerate the 7% strength, lower strengths of 3%, 3.5%, or 5% may be used. Acute viral bronchiolitis (for hospita",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Electrolyte, inhalation. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sodium-phosphate",
  "name": "Sodium Phosphate",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 2-6 hours",
    "notes": "1 g/kg per dose ( max. dose: 15 g per dose) Q6 hr PR: 1 g/kg per dose Q2–6 hr; max. dose: 30–50 g per dose. Dosing by practical exchange (1 mEq K per 1 g resin) has been recommended for infants and smaller children. Continued",
    "maxDose": "15 g per dose) Q6 hr PR: 1 g/kg per dose Q2–6 hr",
    "unit": "g",
    "perKg": false,
    "min": 30,
    "max": 50
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with severe renal failure, megacolon, bowel obstruction",
   "Congestive heart failure (chf)"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Laxative, enema. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sodium-polystyrene-sulfonate",
  "name": "Sodium Polystyrene Sulfonate",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 2-6 hours",
    "notes": "1 g/kg per dose ( max. dose: 15 g per dose) Q6 hr PR: 1 g/kg per dose Q2–6 hr; max. dose: 30–50 g per dose. Dosing by practical exchange (1 mEq K per 1 g resin) has been recommended for infants and smaller children. Continued",
    "maxDose": "15 g per dose) Q6 hr PR: 1 g/kg per dose Q2–6 hr",
    "unit": "g",
    "perKg": false,
    "min": 30,
    "max": 50
   }
  ],
  "indications": [],
  "contraindications": [
   "obstructive bowel disease, in neonates with reduced gut motility, and for oral administration in neonates"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Potassium-removing resin. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-streptomycin-sulfate",
  "name": "Streptomycin Sulfate",
  "category": "antibiotic",
  "doses": [
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Daily therapy: 20–40 mg/kg/24 hr IM/IV once daily Max. daily dose: 1 g/24 hr Twice-weekly therapy (under direct observation): 25–30 mg/kg/dose IM/IV twice weekly Max. daily dose: 1 g/24 hr Per-dose amount calculated from 20–40 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 20,
    "max": 40
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Daily therapy: 20–40 mg/kg/24 hr IM/IV once daily Max. daily dose: 1 g/24 hr Twice-weekly therapy (under direct observation): 25–30 mg/kg/dose IM/IV twice weekly Max. daily dose: 1 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 20,
    "max": 40
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Daily therapy: 15–20 mg/kg/24 hr IM/IV once daily; max. daily dose: 1 g/24 hr Twice-weekly therapy (under direct observation): 15 mg/kg/dose IM/IV twice weekly; max. daily dose: 1 g/24 hr Brucellosis, tularemia, plague, and rat bite fever: See latest edition of the Red Book. Contraindicated with aminoglycoside and sulfite hypersensitivity. Use with caution in preexisting vertigo, tinnitus, hearing Per-dose amount calculated from 15–20 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 15,
    "max": 20
   },
   {
    "route": "IV",
    "frequency": "Once daily",
    "notes": "Daily therapy: 15–20 mg/kg/24 hr IM/IV once daily; max. daily dose: 1 g/24 hr Twice-weekly therapy (under direct observation): 15 mg/kg/dose IM/IV twice weekly; max. daily dose: 1 g/24 hr Brucellosis, tularemia, plague, and rat bite fever: See latest edition of the Red Book. Contraindicated with aminoglycoside and sulfite hypersensitivity. Use with caution in preexisting vertigo, tinnitus, hearing",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 20
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor levels"
  ],
  "notes": "Formulary class: Antibiotic, aminoglycoside, antituberculous agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-succimer",
  "name": "Succimer",
  "category": "antidote",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 8 hours",
    "notes": "Yes Yes No Cap: 100 mg Lead chelation, child: 10 mg/kg/dose (or 350 mg/m 2 /dose) PO Q8 hr × 5 days, then 10 mg/kg/dose (or 350 mg/ m 2 /dose) PO Q12 hr × 14 days",
    "unit": "mg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Injection: Anectine, Quelicin, and g"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sucralfate",
  "name": "Sucralfate",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "Duodenal or gastric ulcer (limited data): 40–80 mg/kg/24 hr PO ÷ Q6 hr; max. dose: 1000 mg/dose Stomatitis (limited data): 5–10 mL (500–1000 mg of suspension), swish and spit or swish and swallow QID Per-dose amount calculated from 40–80 mg/kg/day divided by 4 (Every 6 hours).",
    "maxDose": "1000 mg/dose Stomatitis (limited data): 5–10 mL (500–1000 mg of suspension)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "Duodenal or gastric ulcer (limited data): 40–80 mg/kg/24 hr PO ÷ Q6 hr; max. dose: 1000 mg/dose Stomatitis (limited data): 5–10 mL (500–1000 mg of suspension), swish and spit or swish and swallow QID",
    "maxDose": "1000 mg/dose Stomatitis (limited data): 5–10 mL (500–1000 mg of suspension)",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 40,
    "max": 80
   },
   {
    "route": "IV",
    "notes": "2 or 4 mg/kg/dose IV once over 10 sec; some suggest administering over slow intravenous push to reduce risk for bradycardia or asystole Reversal of rocuronium- or vecuronium-induced neuromuscular blockade (see remarks):",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 4
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 1 g"
  ],
  "monitoring": [],
  "notes": "Formulary class: Oral antiulcer agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sulfacetamide-sodium-ophthalmic",
  "name": "Sulfacetamide Sodium Ophthalmic",
  "category": "ophthalmic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Ointment: Apply 0.5-in ribbon into the lower conjunctival sac Q3–4 hr and QHS initially and reduce the dosing frequency with adequate response. Drops: 1–2 drops to affected eye(s) Q2–3 hr initially, and reduce the dosing frequency with adequate response. Hypersensitivity reactions between different sulfonamides can occur regardless of route of administration.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sulfadiazine",
  "name": "Sulfadiazine",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "75 mg/kg/dose or 2000 mg/m 2 /dose PO × 1, followed by 150 mg/kg/24 hr or 4000 mg/m 2 /24 hr ÷ Q4–6 hr ( max. dose: 6000 mg/24 hr)",
    "maxDose": "6000 mg/24 hr)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 75
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "100 mg/kg/24 hr PO ÷ BID × 12 mo Acquired toxoplasmosis (administer with pyrimethamine and folinic acid; see Pyrimethamine for dosage information): Per-dose amount calculated from 100 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 50
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "100 mg/kg/24 hr PO ÷ BID × 12 mo Acquired toxoplasmosis (administer with pyrimethamine and folinic acid; see Pyrimethamine for dosage information):",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 100
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "100–200 mg/kg/24 hr PO ÷ Q6 hr for at least 4–6 wk; max. dose: 6000 mg/24 hr Per-dose amount calculated from 100–200 mg/kg/day divided by 4 (Every 6 hours).",
    "maxDose": "6000 mg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 25,
    "max": 50
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "100–200 mg/kg/24 hr PO ÷ Q6 hr for at least 4–6 wk; max. dose: 6000 mg/24 hr",
    "maxDose": "6000 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 100,
    "max": 200
   }
  ],
  "indications": [],
  "contraindications": [
   "porphyria and hypersensitivity to sulfonamides"
  ],
  "formulations": [
   "Tabs: 500 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sulfamethoxazole-and-trimethoprim",
  "name": "Sulfamethoxazole and Trimethoprim",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "8–12 mg/kg/24 hr ÷ BID; max. dose: 160 mg/dose Per-dose amount calculated from 8–12 mg/kg/day divided by 2 (Twice daily).",
    "maxDose": "160 mg/dose",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 4,
    "max": 6
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "8–12 mg/kg/24 hr ÷ BID; max. dose: 160 mg/dose",
    "maxDose": "160 mg/dose",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 8,
    "max": 12
   },
   {
    "route": "Oral",
    "frequency": "Every 6-8 hours",
    "notes": "20 mg/kg/24 hr ÷ Q6–8 hr Urinary tract infection (UTI) prophylaxis:",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 20
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2–4 mg/kg/24 hr PO once daily Pneumocystis jiroveci (carinii) pneumonia (PCP): Treatment ( Per-dose amount calculated from 2–4 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 2,
    "max": 4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2–4 mg/kg/24 hr PO once daily Pneumocystis jiroveci (carinii) pneumonia (PCP): Treatment (",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 2,
    "max": 4
   }
  ],
  "indications": [
   "Minor/moderate infections"
  ],
  "contraindications": [
   "patients with sulfonamide or trimethoprim hypersensitivity, in those with megaloblastic anemia due to folate deficiency, and in those who are taking dofetilide"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic, sulfonamide derivative. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sulfasalazine",
  "name": "Sulfasalazine",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "Initial dosing: Mild: 40–50 mg/kg/24 hr PO ÷ Q6 hr Moderate/severe: 50–75 mg/kg/24 hr PO ÷ Q4–6 hr Max. initial dose: 4 g/24 hr Maintenance: 30–70 mg/kg/24 hr PO ÷ Q4–8 hr; max. dose: 4 g/24 hr",
    "maxDose": "4 g/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 40,
    "max": 50
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start with 10 mg/kg/24 hr PO ÷ BID and increase by 10 mg/kg/24 hr Q7 days until planned maintenance dose is achieved. Usual maintenance dose is 30–50 mg/ kg/24 hr PO ÷ BID up to a max. of 2 g/24 hr.",
    "unit": "mg",
    "perKg": false,
    "min": 30,
    "max": 50
   }
  ],
  "indications": [
   "Inflammatory bowel disease",
   "Juvenile idiopathic arthritis"
  ],
  "contraindications": [
   "sulfa or salicylate hypersensitivity, porphyria, and gastrointestinal (GI) or genitourinary (GU) obstruction"
  ],
  "formulations": [
   "Tabs (Azulfidine and generics): 500 mg Delayed-release tabs (Azulfidine EN-tabs and generics): 500 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Anti-inflammatory agent B/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-sumatriptan-succinate",
  "name": "Sumatriptan Succinate",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 2 hours",
    "notes": "25, 50, or 100 mg as soon as possible after onset of headache. If no relief in 2 hr, give 25–100 mg Q2 hr up to a daily max. of 200 mg. Safety of treating more than four headaches in a 30-day period has not been established. Max. single dose: 100 mg/dose Max. daily dose: 200 mg/24 hr (with exclusive PO dosing or with an initial SC dose and subsequent PO dosing)",
    "unit": "mg",
    "perKg": false,
    "min": 25,
    "max": 100
   },
   {
    "route": "Subcutaneous",
    "frequency": "Daily",
    "notes": "3, 4, or 6 mg × 1 as soon as possible after onset of headache. If no response, may give an additional dose 1 hr later; max. daily dose: 12 mg/24 hr. Use lower subsequent dose if side effects occur. Nasal (safety of treating more than four headaches in a 30-day period has not been established): Nasal spray (Tosymra and generics): 5, 10, or 20 mg per dose into one nostril or divided into each nostr",
    "unit": "mg",
    "perKg": false,
    "value": 6
   },
   {
    "route": "Oral",
    "notes": "1 tablet (85 mg sumatriptan + 500 mg naproxen sodium) after the onset of headache × 1; max. dose: 1 tab/24 hr. Safety of treating more than two headaches in a 30-day period has not been established. Continued",
    "maxDose": "1 tab/24 hr",
    "unit": "mg",
    "perKg": false,
    "value": 85
   }
  ],
  "indications": [
   "Treximet and generics"
  ],
  "contraindications": [],
  "formulations": [
   "Injection, for subcutaneous use: Zembrace SymTouch : 3 mg/0.5 mL (0.5 mL) Imitrex STAT dose, and generics: 4 mg/0.5 mL (0.5 mL), 6 mg/0.5 mL (0.5 mL)",
   "Tabs: 25, 50, 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: generics Antimigraine agent, selective serotonin agonist. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tacrolimus",
  "name": "Tacrolimus",
  "category": "immunosuppressant",
  "doses": [
   {
    "route": "IV",
    "notes": "0.03–0.05 mg/kg/24 hr by continuous infusion",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.03,
    "max": 0.05
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "0.15–0.2 mg/kg/24 hr ÷ Q12 hr Renal transplantation: IV (limited data): 0.06 mg/kg/24 hr by continuous infusion Per-dose amount calculated from 0.15–0.2 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.075,
    "max": 0.1
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "0.15–0.2 mg/kg/24 hr ÷ Q12 hr Renal transplantation: IV (limited data): 0.06 mg/kg/24 hr by continuous infusion",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.15,
    "max": 0.2
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "0.2–0.3 mg/kg/24 hr ÷ Q12 hr Astagraf XL (in combination with other immunosuppressants): 0.15–0.3 mg/kg/24 hr PO Q24 hr; initial dose and post-reperfusion times vary with or without basiliximab induction Cardiac transplantation: IV (limited data): 0.01–0.03 mg/kg/24 hr by continuous infusion Per-dose amount calculated from 0.2–0.3 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1,
    "max": 0.15
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "0.2–0.3 mg/kg/24 hr ÷ Q12 hr Astagraf XL (in combination with other immunosuppressants): 0.15–0.3 mg/kg/24 hr PO Q24 hr; initial dose and post-reperfusion times vary with or without basiliximab induction Cardiac transplantation: IV (limited data): 0.01–0.03 mg/kg/24 hr by continuous infusion",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.2,
    "max": 0.3
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients allergic to polyoxyl 60 hydrogenated castor oil (cremophor)"
  ],
  "formulations": [],
  "monitoring": [
   "Monitor trough levels (just prior to a dose at steady state)"
  ],
  "notes": "Formulary class: Immunosuppressant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tazarotene",
  "name": "Tazarotene",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Oral",
    "notes": "Apply a small amount of 0.1% strength dosage forms to affected areas QHS. Use thin film (2 mg/cm 2 ) of cream or gel dosage form and small amount of foam dosage form. Psoriasis: • Apply a small amount of 0.05% gel (2 mg/cm 2 ) to affected areas QHS initially. If needed and tolerated, increase to 0.1% gel QHS. The cream dosage form may also be used the same way as the gel, but it is currently labeled for use in adults ( ≥ 18 yr).",
    "unit": "mg",
    "perKg": false,
    "value": 2
   }
  ],
  "indications": [],
  "contraindications": [
   "pregnancy"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-terbinafine",
  "name": "Terbinafine",
  "category": "antifungal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "4–6 mg/kg/dose PO once daily (max. dose: 250 mg), OR by the following once-daily dosages by weight category: 10–20 kg: 62.5 mg 21–40 kg: 125 mg >40 kg: 250 mg Duration of therapy: Trichophyton tonsurans: 4–6 wk; Microsprum canis: 8–12 wk",
    "maxDose": "250 mg)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 4,
    "max": 6
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "PO once daily by weight category: 10–20 kg: 62.5 mg 21–40 kg: 125 mg >40 kg: 250 mg",
    "unit": "mg",
    "perKg": false,
    "value": 62.5
   }
  ],
  "indications": [
   "Onychomycosis"
  ],
  "contraindications": [
   "Chronic or acute liver disease"
  ],
  "formulations": [
   "Tabs: 250 mg"
  ],
  "monitoring": [
   "Monitor aspartate aminotransferase/alanine aminotransferase (AST/ALT) at baseline and repeat with complete blood count (CBC) if therapy is >6 wk"
  ],
  "notes": "Formulary class: Antifungal. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tetracycline-hcl",
  "name": "Tetracycline HCL",
  "category": "antibiotic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "25–50 mg/kg/24 hr PO ÷ Q6 hr; max. dose: 2 g/24 hr Acne: 500 mg PO BID Per-dose amount calculated from 25–50 mg/kg/day divided by 4 (Every 6 hours).",
    "maxDose": "2 g/24 hr Acne: 500 mg PO BID",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 6.25,
    "max": 12.5
   },
   {
    "route": "Oral",
    "frequency": "Every 6 hours",
    "notes": "25–50 mg/kg/24 hr PO ÷ Q6 hr; max. dose: 2 g/24 hr Acne: 500 mg PO BID",
    "maxDose": "2 g/24 hr Acne: 500 mg PO BID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 25,
    "max": 50
   }
  ],
  "indications": [
   "PO BID"
  ],
  "contraindications": [
   "PO BID"
  ],
  "formulations": [
   "Caps: 250, 500 mg",
   "Oral suspension: 25 mg/mL Do not use in children <8 yr. Child ≥ 8 yr: 25–50 mg/kg/24 hr PO ÷ Q6 hr; max. dose: 2 g/24 hr Acne: 500 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antibiotic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tezacaftor-and-ivacaftor",
  "name": "Tezacaftor and Ivacaftor",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "notes": "<30 kg: One tablet of tezacaftor 50 mg/ivacaftor 75 mg PO QAM and one tablet of ivacaftor 75 mg PO every evening administered ~12 hr apart ≥ 30 kg: One tablet of tezacaftor 100 mg/ivacaftor 150 mg PO QAM and one tablet of ivacaftor 150 mg PO every evening administered ~12 hr apart • All patients Class A No adjustment No adjustment No adjustment Class B One tablet of tezacaftor 50 mg/ivacaftor 75 mg PO QAM One tablet of tezacaftor 100 mg/ivacaftor 150 mg PO QAM No ivacaftor Class C One tablet of tezacaftor 50 mg/ivacaftor 75 mg PO QAM or less frequently One tablet of tezacaftor 100 mg/ivacaftor 150 mg PO QAM or less frequently No ivacaftor Dosage modification with cytochrome P",
    "unit": "mg",
    "perKg": false,
    "value": 50
   },
   {
    "route": "Oral",
    "notes": "One tablet of tezacaftor 100 mg/ivacaftor 150 mg PO QAM and one tablet of ivacaftor 150 mg PO every evening administered ~12 hr apart Dosage Modification With Hepatic Impairment",
    "unit": "mg",
    "perKg": false,
    "value": 100
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Baseline aspartate aminotransferase/ alanine aminotransferase (AST/ALT) and baseline ocular exam"
  ],
  "notes": "Formulary class: conductance regulator (CFTR) corrector and potentiator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-theophylline",
  "name": "Theophylline",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "1 mg/kg/dose PO Q12 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "1.5 mg/kg/dose PO Q12 hr Full-term up to 1 yr old: Total daily dose (mg) = [(0.2 × age in weeks) + 5] × (kg body weight)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 1.5
   },
   {
    "route": "Oral",
    "frequency": "Every 4-6 hours",
    "notes": "Divide daily dose Q6 hr Maintenance, child >1 yr and adult without risk factors for altered clearance (see remarks): <45 kg: Begin therapy at 12–14 mg/kg/24 hr ÷ Q4–6 hr up to max. dose of 300 mg/24 hr. If needed based on serum levels, gradually increase to 16–20 mg/kg/24 hr ÷ Q4–6 hr. Max. dose: 600 mg/24 hr ≥ 45 kg: Begin therapy with 300 mg/24 hr ÷ Q6–8 hr. If needed based on serum levels, grad",
    "maxDose": "600 mg/24 hr ≥ 45 kg: Begin therapy with 300 mg/24 hr ÷ Q6–8 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 12,
    "max": 14
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Bronchodilator, methylxanthine. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-thioridazine",
  "name": "Thioridazine",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start with 0.5 mg/kg/24 hr PO ÷ BID–TID ( initial max.: 50 mg/ dose); dosage range: 0.5–3 mg/kg/24 hr PO ÷ BID–TID. Max. dose: 3 mg/kg/24 hr Per-dose amount calculated from 0.5–3 mg/kg/day divided by 2 (Twice daily).",
    "maxDose": "3 mg/kg/24 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 1.5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start with 0.5 mg/kg/24 hr PO ÷ BID–TID ( initial max.: 50 mg/ dose); dosage range: 0.5–3 mg/kg/24 hr PO ÷ BID–TID. Max. dose: 3 mg/kg/24 hr",
    "maxDose": "3 mg/kg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.5,
    "max": 3
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 4 mg PO once daily × 7 days. If needed, increase dose to 8 mg/ 24 hr PO ÷ BID. Dosage may be increased further by 4–8 mg/24 hr at weekly intervals (daily doses may be divided BID–QID) until a clinical response is achieved or up to specified max. dose. Max. dose: 12–18 yr: 32 mg/24 hr",
    "maxDose": "12–18 yr: 32 mg/24 hr",
    "unit": "mg/day",
    "perKg": false,
    "min": 4,
    "max": 8
   }
  ],
  "indications": [
   "Refractory schizophrenia"
  ],
  "contraindications": [
   "severe central nervous system depression, brain damage, narrow-angle glaucoma, blood dyscrasias, and severe liver or cardiovascular disease"
  ],
  "formulations": [],
  "monitoring": [
   "ECG and avoid drugs that can widen Q–Tc interval"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tiagabine",
  "name": "Tiagabine",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 4 mg PO once daily × 7 days. If needed, increase dose to 8 mg/ 24 hr PO ÷ BID. Dosage may be increased further by 4–8 mg/24 hr at weekly intervals (daily doses may be divided BID–QID) until a clinical response is achieved or up to specified max. dose. Max. dose: 12–18 yr: 32 mg/24 hr",
    "maxDose": "12–18 yr: 32 mg/24 hr",
    "unit": "mg/day",
    "perKg": false,
    "min": 4,
    "max": 8
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Initial dose of 0.25 mg/kg/24 hr PO ÷ TID × 4 wk. Dosage was increased at 4-wk intervals to 0.5, 1, and 1.5 mg/kg/24 hr until an effective and well-tolerated dose was established. Criteria for dose increase required tolerance of the current dosage level and <50% reduction in seizures. Patients receiving enzyme-inducing AEDs received a max. daily dose of 0.73 ± 0.44 mg/kg/24 hr, and patients receiv Per-dose amount calculated from 0.25 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.083
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "Initial dose of 0.25 mg/kg/24 hr PO ÷ TID × 4 wk. Dosage was increased at 4-wk intervals to 0.5, 1, and 1.5 mg/kg/24 hr until an effective and well-tolerated dose was established. Criteria for dose increase required tolerance of the current dosage level and <50% reduction in seizures. Patients receiving enzyme-inducing AEDs received a max. daily dose of 0.73 ± 0.44 mg/kg/24 hr, and patients receiv",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.25
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 2, 4, 12, 16 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tiotropium",
  "name": "Tiotropium",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Spiriva Respimat: Inhale two 1.25-mCg actuations once daily; max. dose : 2.5 mCg/24 hr",
    "unit": "mcg/day",
    "perKg": false,
    "value": 2.5
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients with ipratropium hypersensitivity reactions (e"
  ],
  "formulations": [],
  "monitoring": [
   "For anticholinergic side effects in patients with moderate/severe renal impairment (estimated glomerular filtration rate [eGFR] <60 mL/min)"
  ],
  "notes": "Formulary class: Respimat, and generic Anticholinergic agent, long-acting. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tolnaftate",
  "name": "Tolnaftate",
  "category": "antifungal",
  "doses": [
   {
    "route": "Topical",
    "notes": "Topical for tinea pedis, tinea corporis, and tinea cruris: Apply 1–3 drops of solution, or small amount of liquid, cream, or powder to affected and surrounding areas BID for 2–4 wk (4 wk for tinea pedis).",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antifungal agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-trazodone",
  "name": "Trazodone",
  "category": "psychiatric",
  "doses": [
   {
    "route": "Oral",
    "notes": "Start at 1–2 mg/kg/dose ( max. dose: 25 mg) PO QHS. If needed, increase by 12.5–25 mg Q2 wk up to 3 mg/kg/dose QHS, not to exceed a max. of 100 mg/24 hr. 3–5 yr: Start at 1–2 mg/kg/dose ( max. dose: 50 mg) PO QHS. If needed, increase by 12.5–25 mg Q2 wk up to 3 mg/kg/dose QHS, not to exceed a max. of 150 mg/24 hr.",
    "maxDose": "25 mg) PO QHS",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "25–50 mg PO QHS; if needed, increase by 12.5–25 mg Q2 wk up to a max. of 200 mg/24 hr. Daily dose may be divided BID–TID when used for palliative care. Use with caution in preexisting cardiac disease, in initial recovery phase of myocardial infarction, in patients receiving antihypertensive medications, in renal and hepatic impairment (has not been evaluated), and with electroconvulsive therapy. C",
    "unit": "mg",
    "perKg": false,
    "min": 25,
    "max": 50
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 50, 100, 150, 300 mg Oral solution (Raldesy): 10 mg/mL (150, 300 mL); contains ethylenediaminetetra-acetic acid (EDTA) and sodium benzoate"
  ],
  "monitoring": [
   "Monitor for clinical worsening of depression and suicidal ideation/behavior following the initiation of therapy or after dose changes"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-treprostinil",
  "name": "Treprostinil",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Inhaled",
    "frequency": "Every 6 hours",
    "notes": "1–9 patient-activated breaths (6–54 mCg) Q6 hr. In a retrospective report, 29 children with PAH receiving background therapy initially received 3 breaths (18 mCg) via oral inhalation QID and titrated doses weekly as tolerated to a maximum of 9 breaths (54 mCg) QID for ≥ 6 wk. Nineteen of 29 children had World Health Organization functional class improvement (significant improvements in exercise to",
    "unit": "mcg",
    "perKg": false,
    "min": 6,
    "max": 54
   }
  ],
  "indications": [
   "IV/SC infusion",
   "Inhalation"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Prostaglandin I 2 analogue, vasodilator. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-tretinoin-topical-preparations",
  "name": "Tretinoin—topical Preparations",
  "category": "dermatologic",
  "doses": [
   {
    "route": "Topical",
    "notes": "Gently wash face with a mild soap, pat the skin dry, and wait 20–30 min before use. Initiate therapy with lower strengths (0.02% or 0.025% cream, or 0.01% gel) and apply a small pea-size amount to the affected areas of the face QHS or on alternate days. See remarks. Altralin gel 0.05% (Child ≥10 yr): Apply a thin layer of gel to affected areas QHS after thoroughly cleaning the skin. Altreno lotion",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [
   "Topical for acne",
   "In combination with clindamycin",
   "In combination with benzoyl peroxide"
  ],
  "contraindications": [
   "sunburns"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Retinoic acid derivative, topical acne product. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-trimethobenzamide-hcl",
  "name": "Trimethobenzamide HCL",
  "category": "fluid",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "15–20 mg/kg/24 hr ÷ TID–QID PRN Alternative dosing: <13.6 kg: 100 mg TID–QID PRN 13.6–40 kg: 100–200 mg/dose TID–QID PRN >40 kg: 300 mg/dose TID–QID PRN Per-dose amount calculated from 15–20 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 6.667
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "15–20 mg/kg/24 hr ÷ TID–QID PRN Alternative dosing: <13.6 kg: 100 mg TID–QID PRN 13.6–40 kg: 100–200 mg/dose TID–QID PRN >40 kg: 300 mg/dose TID–QID PRN",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 20
   }
  ],
  "indications": [
   "QID PRN"
  ],
  "contraindications": [
   "TID–QID PRN"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-note",
  "name": "Note",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "1 spray in each nostril once daily (110 mCg/24 hr; starting and max. dose ) • Start with 1 spray in each nostril once daily (110 mCg/24 hr). If no benefit in 1 wk, dose may be increased to the max. dose of 2 sprays in each nostril once daily (220 mCg/24 hr). Decrease dose back to 1 spray in each nostril when symptoms are controlled.",
    "unit": "mcg/day",
    "perKg": false,
    "value": 110
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "2 sprays in each nostril once daily (220 mCg/24 hr; starting and max. dose ). Decrease dose to 1 spray in each nostril (110 mCg/24 hr) when symptoms are controlled. Topical cream or ointment:",
    "unit": "mcg/day",
    "perKg": false,
    "value": 220
   }
  ],
  "indications": [
   "Anti-inflammatory and allergic condition"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-triamterene",
  "name": "Triamterene",
  "category": "diuretic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "1–2 mg/kg/24 hr PO ÷ BID. May increase up to a max. of 3–4 mg/kg/ 24 hr up to 300 mg/24 hr Per-dose amount calculated from 1–2 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "1–2 mg/kg/24 hr PO ÷ BID. May increase up to a max. of 3–4 mg/kg/ 24 hr up to 300 mg/24 hr",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 2
   }
  ],
  "indications": [
   "Hypertension"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Monitor serum electrolytes"
  ],
  "notes": "Formulary class: Diuretic, potassium sparing. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-trifluridine",
  "name": "Trifluridine",
  "category": "antiviral",
  "doses": [
   {
    "route": "Topical",
    "notes": "Instill 1 drop into affected eye(s) Q2 hr while awake up to a maximum of 9 drops/24 hr. Reduce dose when there is re-epithelialization of the corneal ulcer to 1 drop Q4 hr ( minimum 5 drops/24 hr) × 7 days. If improvement does not occur in 7–14 days, consider alternative therapy. DO NOT EXCEED 21 days of treatment.",
    "unit": "application",
    "perKg": false
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Antiviral, ophthalmic. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-ursodiol",
  "name": "Ursodiol",
  "category": "gastrointestinal",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "10–20 mg/kg/24 hr PO ÷ BID–TID; higher doses of 20–36 mg/kg/24 hr have been reported in neonates and infants receiving the Kasai procedure Pruritus from cholestasis: Per-dose amount calculated from 10–20 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "10–20 mg/kg/24 hr PO ÷ BID–TID; higher doses of 20–36 mg/kg/24 hr have been reported in neonates and infants receiving the Kasai procedure Pruritus from cholestasis:",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 20
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "15–30 mg/kg/24 hr PO ÷ once daily–BID Total parenteral nutrition–induced cholestasis: Per-dose amount calculated from 15–30 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 15,
    "max": 30
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "15–30 mg/kg/24 hr PO ÷ once daily–BID Total parenteral nutrition–induced cholestasis:",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 15,
    "max": 30
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "10–30 mg/kg/24 hr PO ÷ TID Per-dose amount calculated from 10–30 mg/kg/day divided by 3 (Three times daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 3.333,
    "max": 10
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "10–30 mg/kg/24 hr PO ÷ TID",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 30
   }
  ],
  "indications": [
   "Biliary atresia",
   "TID Gallstone dissolution"
  ],
  "contraindications": [
   "Calcified cholesterol stones, radiopaque stones, bile pigment stones, or stones >20 mm in diameter"
  ],
  "formulations": [
   "Oral suspension: 20, 25, 50, 60 mg/mL Caps: Generics: 200, 300, 400 mg Reltone: 200, 400 mg"
  ],
  "monitoring": [
   "Monitor liver function tests every month for the first 3 months after initiating therapy and every 6 months thereafter"
  ],
  "notes": "Formulary class: Gallstone solubilizing agent, cholelitholytic agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-valacyclovir",
  "name": "Valacyclovir",
  "category": "antiviral",
  "doses": [
   {
    "route": "IV",
    "frequency": "Three times daily",
    "notes": "Recommended dosages based on steady-state pharmacokinetic data in immunocompromised children. Efficacy data are incomplete. To mimic an IV acyclovir regimen of 250 mg/m 2 /dose or 10 mg/kg/dose TID: 30 mg/kg/dose PO TID OR alternatively by weight: 4–12 kg: 250 mg PO TID 13–21 kg: 500 mg PO TID 22–29 kg: 750 mg PO TID ≥ 30 kg: 1000 mg PO TID To mimic a PO acyclovir regimen of 20 mg/kg/dose 4 or 5 t",
    "unit": "mg",
    "perKg": false,
    "value": 250
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "20 mg/kg/dose PO TID × 5 days; max. dose: 1 g/dose TID; lengthier duration of therapy may be needed for immunocompromised patients Herpes simplex virus (HSV) genital herpes (immunocompetent): • Initial episode: 20 mg/kg/dose PO Q12 hr ( max. dose: 1000 mg/dose) × 7–10 days or longer if lesions are not completely healed Recurrent episodes: 20 mg/kg/dose PO Q12 hr ( max. dose: 1000 mg/dose) × 5–10 days; most effective when therapy is initiated within 1 day of lesion appearance Suppressive therapy: 20 mg/kg/dose PO Q24 hr ( max. dose: 1000 mg/dose) VALACYCLOVIR continued",
    "maxDose": "1 g/dose TID",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 20
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs/caplets: 500, 1000 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Antiviral agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-valganciclovir",
  "name": "Valganciclovir",
  "category": "antiviral",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Symptomatic congenital cytomegalovirus (CMV) (from pharmacokinetic [PK] data in 8 infants 4–90 days old [mean: 20 days] and 24 neonates 8–34 days old): 16 mg/kg/dose PO Q12 hr produced levels similar to IV ganciclovir 6 mg/kg/dose BID. A comparison of 6 weeks vs. 6 months of therapy in 96 neonates (>32 wk gestation and ≥ 1.8 kg) showed modest improvement in long-term hearing and developmental outc",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 16
   },
   {
    "route": "Oral",
    "frequency": "Every 12 hours",
    "notes": "CMV treatment for mild/moderate infection for solid organ transplant recipients (see remarks): Q12 hr PO dosage calculated with the following equation: mg dose (max. dose: 900 mg) = 7 × body surface area (BSA) × CrCl. BSA is determined by the Mosteller equation and CrCl is determined by a modified Schwartz equation (max. value: 150 mL/min/1.73 m 2 ). Mosteller BSA (m 2 ) equation: square root of [ • CMV retinitis: Induction therapy: 900 mg PO BID × 14–21 days with food Maintenance therapy: 900 mg PO once daily with food for a minimum of 3–6 mo CMV treatment of mild/moderate infection in solid organ transplant recipients: 900 mg PO BID for a minimum of 2 wk until symptoms resolve and until 1 or 2 consecutive weekly CMV viral loads are undetectable or below a test-specific threshold level CMV p",
    "maxDose": "900 mg) = 7 × body surface area (BSA) × CrCl",
    "unit": "mg",
    "perKg": false,
    "value": 900
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 450 mg",
   "Oral solution: 50 mg/mL (88 mL); contains saccharin and sodium benzoate"
  ],
  "monitoring": [
   "Monitor complete blood count (CBC) with differential, platelets, and serum creatinine at baseline and periodically during therapy"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-valproic-acid-valproate-sodium",
  "name": "Valproic Acid/valproate Sodium",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 10–15 mg/kg/24 hr PO ÷ BID ( max. initial dose: 250 mg/dose). If needed, increase dose over 4–6 wk to 40–45 mg/kg/24 hr PO ÷ BID up to a maximum of 1000 mg/24 hr. Alternative dosing for adolescent ≥ 17 yr is 250 mg PO BID initially titrated up to a maximum of 1000 mg/24 hr. Per-dose amount calculated from 10–15 mg/kg/day divided by 2 (Twice daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 5,
    "max": 7.5
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start at 10–15 mg/kg/24 hr PO ÷ BID ( max. initial dose: 250 mg/dose). If needed, increase dose over 4–6 wk to 40–45 mg/kg/24 hr PO ÷ BID up to a maximum of 1000 mg/24 hr. Alternative dosing for adolescent ≥ 17 yr is 250 mg PO BID initially titrated up to a maximum of 1000 mg/24 hr.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 10,
    "max": 15
   }
  ],
  "indications": [
   "Migraine prophylaxis"
  ],
  "contraindications": [
   "Mitochondrial disorders with mutations in DNA polymerase gamma (e.g., Alpers-Huttenlocher syndrome)",
   "Children <2 yr suspected of mitochondrial disorder"
  ],
  "formulations": [
   "VALPROIC ACID: Caps: 250 mg",
   "Oral solution: 250 mg/5 mL (473 mL); may contain parabens VALPROATE SODIUM:"
  ],
  "monitoring": [
   "Monitor complete blood count (CBC) and liver function tests (LFTs) prior to and during therapy"
  ],
  "notes": "Formulary class: (IV) Depakote: See Divalproex Sodium Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-valsartan",
  "name": "Valsartan",
  "category": "cardiovascular",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 1 mg/kg/dose PO once daily; if needed, increase dose every 2 weeks up to a maximum of 4 mg/kg/24 hr. Usual range: 0.25–4 mg/kg/dose once daily",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.25,
    "max": 4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 1 or 2 mg/kg/dose PO once daily ( max. dose: 40 mg/24 hr). Usual dosage range: 1–4 mg/kg/dose once daily; max. dose: 4 mg/kg/24 hr up to 160 mg/24 hr Adolescent",
    "maxDose": "40 mg/24 hr)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 1,
    "max": 4
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start at 80 or 160 mg PO once daily; usual dosage range is 80–320 mg once daily. Max. dose: 320 mg/24 hr VALSARTAN continued Contraindicated with aliskiren use in patients with diabetes. Discontinue use immediately when pregnancy is detected . Use with caution in renal (CrCl <30 mL/min) and liver insufficiency, heart failure, post myocardial infarction, renal artery stenosis, renal function change",
    "maxDose": "320 mg/24 hr VALSARTAN continued Contraindicated with aliskiren use in patients with diabetes",
    "unit": "mg",
    "perKg": false,
    "min": 80,
    "max": 320
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 40, 80, 160, 320 mg",
   "Oral solution: 4 mg/mL (120, 473 mL); may contain parabens and propylene glycol"
  ],
  "monitoring": [
   "Lithium levels closely"
  ],
  "notes": "Formulary class: Angiotensin II receptor blocker, antihypertensive agent. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-vanzacaftor-tezacaftor-deutivacaftor",
  "name": "Vanzacaftor Tezacaftor Deutivacaftor",
  "category": "respiratory",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "≤ 40 kg: vanzacaftor 12 mg/tezacaftor 60 mg/deutivacaftor 150 mg PO once daily by administering 3 tablets of the vanzacaftor 4 mg/tezacaftor 20 mg/deutivacaftor 50 mg tablet strength Continued",
    "unit": "mg",
    "perKg": false,
    "value": 12
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "vanzacaftor 20 mg/tezacaftor 100 mg/deutivacaftor 250 mg PO once daily by administering 2 tablets of the vanzacaftor 10 mg/tezacaftor 50 mg/deutivacaftor 125 mg tablet strength Dosage modification when used with moderate or strong cytochrome P-450 (CYP) 3A4 inhibitors: Age Weight Moderate CYP3A4 Inhibitor (e.g., fluconazole, erythromycin) Strong CYP3A4 Inhibitor (e.g., ketoconazole, itraconazole,",
    "unit": "mg",
    "perKg": false,
    "value": 20
   }
  ],
  "indications": [
   "Usual dosage"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-varicella-zoster-immune-globulin",
  "name": "Varicella-zoster Immune Globulin (human)",
  "category": "fluid",
  "doses": [
   {
    "route": "IM",
    "notes": "Dose should be given within 48 hr of varicella exposure and no later than 96 hr postexposure. IM administration: <2 kg: 62.5 Units 2.1–10 kg: 125 Units 10.1–20 kg: 250 Units 20.1–30 kg: 375 Units 30.1–40 kg: 500 Units >40 kg: 625 Units Max. dose: 625 Units/dose If patient is high risk and re-exposed to varicella for more than 3 weeks after a prior dose, another full dose may be given.",
    "maxDose": "625 Units/dose If patient is high risk and re-exposed to varicella for more than 3 weeks after a prior dose",
    "unit": "units",
    "perKg": false,
    "value": 62.5
   }
  ],
  "indications": [],
  "contraindications": [
   "severe thrombocytopenia due to IM injection, IgA deficiency (anaphylactic reactions may occur), and known immunity to varicella-zoster virus"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: VariZig, VZIG Hyperimmune globulin, varicella-zoster. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-vigabatrin",
  "name": "Vigabatrin",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "If needed and tolerated, increase starting dose at weekly intervals to the recommended maintenance dose. Weight (kg) Starting Daily Dose (mg/24 hr ÷ BID) Recommended Daily Maintenance Dose (mg/24 hr ÷ BID) 10–15 350 1050 >15–20 450 1300 >20–25 500 1500 >25–60 500 2000 Adolescent (≥17 yr) and adult (see remarks for discontinuation of therapy): Start at 500 mg PO BID; if needed and tolerated, increa",
    "maxDose": "6000 mg/24 hr",
    "unit": "mg",
    "perKg": false,
    "value": 500
   },
   {
    "route": "Oral",
    "notes": "Decrease by 25–50 mg/kg every 3–4 days.",
    "unit": "mg/kg",
    "perKg": true,
    "min": 25,
    "max": 50
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Anticonvulsant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-vitamin-e-tocopherol",
  "name": "Vitamin E/ -tocopherol",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "10–50 IU/kg/24 hr Cystic fibrosis supplementation (use water-miscible form; usually dosed in cystic fibrosis– specific multivitamins): 5–10 IU/kg/24 hr PO once daily; max. dose: 400 IU/24 hr Adverse reactions include gastrointestinal distress, rash, headache, gonadal dysfunction, decreased serum thyroxine and triiodothyronine, and blurred vision. Necrotizing enterocolitis has been associated with",
    "maxDose": "400 IU/24 hr Adverse reactions include gastrointestinal distress",
    "unit": "mg",
    "perKg": false,
    "min": 6,
    "max": 14
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [],
  "monitoring": [
   "Levels closely and use water-miscible form (especially with malabsorption)"
  ],
  "notes": "Formulary class: Vitamin, fat soluble A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-voriconazole",
  "name": "Voriconazole",
  "category": "antifungal",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Start with 9 mg/kg/dose IV/PO Q12 hr; monitor levels and adjust dose. Median dose of 31.5 mg/kg/24 hr ÷ 12 hr (range: 12–71 mg/kg/24 hr) has been reported to achieve target trough levels. Per-dose amount calculated from 12–71 mg/kg/day divided by 2 (Every 12 hours).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 6,
    "max": 35.5
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Start with 9 mg/kg/dose IV/PO Q12 hr; monitor levels and adjust dose. Median dose of 31.5 mg/kg/24 hr ÷ 12 hr (range: 12–71 mg/kg/24 hr) has been reported to achieve target trough levels.",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 12,
    "max": 71
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "Invasive aspergillosis, candidemia (nonneutropenic), other deep tissue Candida infections, or other rare molds (e.g., Scedosporium and Fusarium ): Loading dose: 9 mg/kg/dose IV Q12 hr × 2 followed by maintenance dose Maintenance dose: 8 mg/kg/dose IV Q12 hr and convert to the oral suspension dosage form after significant clinical improvement at a dose of 9 mg/kg/dose PO Q12 hr ( max. dose: 350 mg",
    "maxDose": "350 mg Q12 hr)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 9
   },
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "4 mg/kg/dose Q12 hr",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 4
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Tabs: 50, 200 mg; contains povidone",
   "Oral suspension: 40 mg/mL (75 mL); may contain sodium benzoate"
  ],
  "monitoring": [
   "Monitor trough level and adjust dose accordingly"
  ],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-warfarin",
  "name": "Warfarin",
  "category": "hematologic",
  "doses": [
   {
    "route": "Oral",
    "notes": "To achieve an international normalized ratio (INR) between 2 and 3.5 directed by specific indication Loading dose on day 1: Baseline INR ≤ 1.3: 0.2 mg/kg/dose PO; max. dose: 7.5 mg/dose Liver dysfunction, baseline INR >1.3, cardiopulmonary bypass within previous 10 days, NPO status/poor nutrition, receiving broad-spectrum antibiotics, receiving medications that significantly inhibit cytochrome P-4",
    "maxDose": "7",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.05,
    "max": 0.1
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.33 mg/kg/24 hr PO once daily Per-dose amount calculated from 0.33 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "value": 0.33
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.33 mg/kg/24 hr PO once daily",
    "unit": "mg/kg/day",
    "perKg": true,
    "value": 0.33
   },
   {
    "route": "Oral",
    "notes": "645–687 and Blood 1999;94[9]:3007–3014 for additional information.) Lower doses should be considered for patients with pharmacogenetic variations in CYP2C9 (e.g., *2 and *3 alleles) and VKORC1 (e.g., 1639G>A allele) enzymes, especially in those with European ancestry. Elderly and/or debilitated patients and patients with a potential to exhibit greater than expected PT/INR response to warfarin shou",
    "unit": "g",
    "perKg": false,
    "value": 1639
   }
  ],
  "indications": [],
  "contraindications": [
   "Severe liver or kidney disease, uncontrolled bleeding, gastrointestinal ulcers",
   "Malignant hypertension"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Anticoagulant. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-zidovudine",
  "name": "Zidovudine",
  "category": "antiviral",
  "doses": [
   {
    "route": "IV",
    "frequency": "Every 12 hours",
    "notes": "//clinicalinfo.hiv.gov/en/ guidelines) for duration of use, as it will depend on the specific clinical situation: Gestational Age (wk) Oral (PO) Dosage Intravenous (IV) Dosage a <30 Birth to 4 wk of age: 2 mg/ kg/dose Q12 hr 4 to 8–10 wk of age: 3 mg/ kg/dose Q12 hr >8–10 wk of age b : 12 mg/ kg/dose Q12 hr Birth to 4 wk of age: 1.5 mg/kg/dose Q12 hr 4 to 8–10 wk of age: 2.25 mg/kg/dose Q12 hr >8–",
    "unit": "mg",
    "perKg": false,
    "value": 2
   }
  ],
  "indications": [],
  "contraindications": [],
  "formulations": [
   "Caps: 100 mg",
   "Tabs: 300 mg Oral syrup: 50 mg/5 mL (240 mL); contains 0.2% sodium benzoate"
  ],
  "monitoring": [],
  "notes": "Formulary class: agent, nucleoside analogue reverse transcriptase inhibitor. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-zinc-salts-systemic",
  "name": "Zinc Salts, Systemic",
  "category": "vitamin",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "0.5–2 mg elemental Zn/kg/24 hr PO ÷ once daily–TID",
    "unit": "mg",
    "perKg": false,
    "min": 0.5,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "75 mg elemental Zn/24 hr PO ÷ TID",
    "unit": "mg",
    "perKg": false,
    "value": 75
   },
   {
    "route": "Oral",
    "frequency": "Three times daily",
    "notes": "75–150 mg elemental Zn /24 hr PO ÷ TID U.S. Recommended Daily Allowance (US RDA): See Chapter 21 . For supplementation in parenteral nutrition, see Chapter 21 . Nausea, vomiting, gastrointestinal (GI) disturbances, leukopenia, and diaphoresis may occur. Gastric ulcers, hypotension, and tachycardia may occur at high doses. Copper deficiency (zinc sulfate and chloride) and gastric ulcer (zinc sulfat",
    "unit": "mg",
    "perKg": false,
    "min": 75,
    "max": 150
   }
  ],
  "indications": [
   "PO TID Wilson disease"
  ],
  "contraindications": [],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Trace mineral A/. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-zolmitriptan",
  "name": "Zolmitriptan",
  "category": "analgesic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Daily",
    "notes": "Start with 2.5 mg inhaled into a single nostril × 1. If needed in 2 hr, a second dose may be administered. Dose may be increased to a maximum single dose of 5 mg if needed. Max. daily dose: 10 mg/24 hr Patients receiving concurrent cimetidine: Limit maximum doses to 2.5 mg as the max. single dose and do not exceed 5 mg in any 24-hr period. Oral (use not recommended in children; safety and efficacy",
    "unit": "mg",
    "perKg": false,
    "value": 2.5
   }
  ],
  "indications": [],
  "contraindications": [
   "ischemic bowel disease",
   "ischemic coronary artery disease",
   "uncontrolled hypertension",
   "peripheral vascular disease"
  ],
  "formulations": [],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-zonisamide",
  "name": "Zonisamide",
  "category": "antiepileptic",
  "doses": [
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start with 1–2 mg/kg/24 hr PO ÷ BID. Increase dosage by 0.5–1 mg/kg/24 hr Q2 wk to the usual dosage range of 5–8 mg/kg/24 hr PO ÷ BID. 5– Per-dose amount calculated from 1–2 mg/kg/day divided by 2 (Twice daily). • Start with 0.5–1 mg/kg/24 hr PO ÷ once daily–BID. Increase dosage by 0.5–1 mg/kg/24 hr ÷ BID Q2 wk to the usual dosage range of 5–8 mg/kg/24 hr PO ÷ once daily–BID. Suggested maximum dose: 12 mg/kg/24 hr or 500 mg/24 hr, whichever is less Infantile spasms (regimen that was effective in a small study from Japan; additional studies needed): Start with 2–4 mg/kg/24 hr PO ÷ BID. Then increase by 2–5 m Per-dose amount calculated from 0.5–1 mg/kg/day divided by 1 (Once daily).",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.5,
    "max": 1
   },
   {
    "route": "Oral",
    "frequency": "Twice daily",
    "notes": "Start with 1–2 mg/kg/24 hr PO ÷ BID. Increase dosage by 0.5–1 mg/kg/24 hr Q2 wk to the usual dosage range of 5–8 mg/kg/24 hr PO ÷ BID. 5–",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 1,
    "max": 2
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Start with 0.5–1 mg/kg/24 hr PO ÷ once daily–BID. Increase dosage by 0.5–1 mg/kg/24 hr ÷ BID Q2 wk to the usual dosage range of 5–8 mg/kg/24 hr PO ÷ once daily–BID. Suggested maximum dose: 12 mg/kg/24 hr or 500 mg/24 hr, whichever is less Infantile spasms (regimen that was effective in a small study from Japan; additional studies needed): Start with 2–4 mg/kg/24 hr PO ÷ BID. Then increase by 2–5 m",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.5,
    "max": 1
   },
   {
    "route": "Oral",
    "frequency": "Once daily",
    "notes": "Adjunctive therapy for partial seizures: 100 mg PO once daily × 2 wk. Dose may be increased to 200 mg PO once daily × 2 wk. Additional dosage increments of 100 mg/24 hr can be made at 2-wk intervals to allow attainment of steady-state levels. Effective doses have ranged from 100 mg to 600 mg/24 hr ÷ once daily–BID (BID dosing may provide better efficacy). No additional benefit has been shown for d",
    "unit": "mg",
    "perKg": false,
    "min": 20,
    "max": 30
   }
  ],
  "indications": [],
  "contraindications": [
   "Patients allergic to sulfonamides (may result in stevens-johnson syndrome or toxic epidermal necrolysis)"
  ],
  "formulations": [
   "Zonegran, Zonisade, and generics Anticonvulsant C 3 Yes Yes No Caps: Zonegran: 25, 100 mg Generics: 25, 50, 100 mg"
  ],
  "monitoring": [],
  "notes": "Formulary class: Refer to Harriet Lane 24th ed. monograph. Full monograph (metabolism, excretion, adverse reactions) is in the Formulary section.",
  "reference": "Harriet Lane 24th ed."
 },
 {
  "id": "fx-baclofen",
  "name": "Baclofen",
  "category": "other",
  "doses": [
   {
    "route": "Oral, divided QID",
    "frequency": "Every 6 hours",
    "notes": "Per-dose amount calculated from the maintenance range 0.75–2 mg/kg/day divided by 4 (Every 6 hours). START much lower: ~0.3 mg/kg/day in 2–4 divided doses, titrated up at ~weekly intervals. Daily caps: max 40 mg/day if < 8 years, max 60 mg/day if 8 years or older. Do NOT stop abruptly — taper (withdrawal seizures/hyperthermia).",
    "maxDose": "Daily cap 40 mg/day (<8 y) / 60 mg/day (≥8 y)",
    "unit": "mg/kg/dose",
    "perKg": true,
    "min": 0.1875,
    "max": 0.5
   },
   {
    "route": "Oral, divided QID",
    "frequency": "Every 6 hours",
    "notes": "Maintenance daily range. Start ~0.3 mg/kg/day and titrate weekly to effect. Max 2 mg/kg/day; absolute caps 40 mg/day (<8 years) and 60 mg/day (8 years and older). Reduce dose in renal impairment.",
    "maxDose": "Max 60 mg/day",
    "unit": "mg/kg/day",
    "perKg": true,
    "min": 0.75,
    "max": 2,
    "adultMaxDose_num": 60
   }
  ],
  "indications": [
   "Spasticity of cerebral origin (e.g. cerebral palsy)",
   "Spasticity from spinal cord lesions"
  ],
  "contraindications": [
   "Hypersensitivity to baclofen",
   "Caution: renal impairment, seizure disorder"
  ],
  "formulations": [
   "10 mg tablet",
   "5 mg/5 mL oral solution (1 mg/mL)"
  ],
  "monitoring": [
   "Sedation / level of consciousness",
   "Muscle tone and function",
   "Withdrawal signs if doses missed"
  ],
  "notes": "Added 2026-11-01 in mg (oral dosing) on the clinical lead's decision — the formulary monograph's mcg/day figure was intrathecal-style data and is NOT used here. Full monograph is in the Formulary section.",
  "reference": "Harriet Lane | Baclofen SmPC (paediatric dosing)"
 }
];
