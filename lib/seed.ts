// lib/seed.ts
import type { Report } from "@/types";

const now = Date.now();
const day = 86_400_000;
const hour = 3_600_000;

export const SEED_REPORTS: Report[] = [
  {
    id: "r1",
    patientName: "Margaret Owusu",
    conditionOnArrival: "Improving",
    condition: "Stable",
    medication: true,
    medNotes: "Metformin 500 mg twice daily, Amlodipine 5 mg once daily",
    incidents: "",
    tasksNext: "Blood pressure check at 08:00. Review glucose log.",
    notes: "Patient is cooperative and responding well to treatment.",
    staffName: "Nurse Ada Obi",
    department: "General Ward",
    date: "2025-04-04",
    timestamp: now - day * 2 + hour * 7,
    trashed: false,
  },
  {
    id: "r2",
    patientName: "James Adekunle",
    conditionOnArrival: "Critical",
    condition: "Critical",
    medication: true,
    medNotes:
      "Insulin drip 0.1 U/kg/h, Norepinephrine 0.2 mcg/kg/min, Piperacillin-Tazobactam 4.5 g IV Q8H",
    incidents:
      "BP dropped to 80/50 at 02:30 — fluid bolus given, stabilised within 20 min. Repeat ABG ordered.",
    tasksNext:
      "Reassess every 2 h. Notify Dr. Mensah if MAP < 65. Await culture results.",
    notes: "Septic shock secondary to urosepsis. ICU day 3.",
    staffName: "Dr. Kwame Asante",
    department: "ICU",
    date: "2025-04-04",
    timestamp: now - day * 2 + hour * 14,
    trashed: false,
  },
  {
    id: "r3",
    patientName: "Blessing Nwachukwu",
    conditionOnArrival: "Serious",
    condition: "Improving",
    medication: false,
    medNotes: "",
    incidents: "",
    tasksNext:
      "Encourage oral fluids. Supervised ambulation x2 today. Dietitian review.",
    notes: "Fever resolved overnight. Appetite returning. Mood improved.",
    staffName: "Nurse Fatima Hassan",
    department: "Pediatrics",
    date: "2025-04-05",
    timestamp: now - day + hour * 3,
    trashed: false,
  },
  {
    id: "r4",
    patientName: "Emmanuel Eze",
    conditionOnArrival: "Stable",
    condition: "Stable",
    medication: true,
    medNotes: "Paracetamol 1 g TID, Tramadol 50 mg PRN, Enoxaparin 40 mg SC OD",
    incidents: "",
    tasksNext:
      "Wound dressing at 09:00. Physio at 11:00. Discharge planning — confirm transport.",
    notes: "Post-op Day 2 appendicectomy. Wound clean and dry. Pain well controlled.",
    staffName: "Nurse Ada Obi",
    department: "Surgery",
    date: "2025-04-05",
    timestamp: now - hour * 5,
    trashed: false,
  },
  {
    id: "r5",
    patientName: "Grace Akpan",
    conditionOnArrival: "Critical",
    condition: "Serious",
    medication: true,
    medNotes:
      "Labetalol IV 20 mg bolus, Hydralazine 5 mg IV PRN, MgSO4 4 g loading then 1 g/h infusion, Furosemide 40 mg IV",
    incidents:
      "Tonic-clonic seizure episode at 01:15 (duration ~2 min) — managed with IV Diazepam 5 mg. BP spiked to 190/120.",
    tasksNext:
      "Neurology consult at 08:00. Urgent MRI brain. CTG monitoring every 30 min. Ophthalmology review.",
    notes: "Severe pre-eclampsia / eclampsia at 36 weeks gestation. Closely monitored.",
    staffName: "Dr. Kwame Asante",
    department: "Emergency",
    date: "2025-04-03",
    timestamp: now - day * 3 + hour * 2,
    trashed: false,
  },
  {
    id: "r6",
    patientName: "Samuel Okonkwo",
    conditionOnArrival: "Improving",
    condition: "Stable",
    medication: true,
    medNotes: "Salbutamol nebuliser Q4H, Prednisolone 40 mg OD, Montelukast 10 mg nocte",
    incidents: "",
    tasksNext: "Peak flow before morning medications. Inhaler technique education session.",
    notes: "Admitted 2 days ago for severe asthma exacerbation. Significantly improved.",
    staffName: "Nurse Fatima Hassan",
    department: "General Ward",
    date: "2025-04-05",
    timestamp: now - hour * 2,
    trashed: false,
  },
];
