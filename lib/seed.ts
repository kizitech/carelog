// lib/seed.ts
import type { Patient, Report } from "@/types";

const now = Date.now();
const day = 86_400_000;
const hour = 3_600_000;

export const SEED_PATIENTS: Patient[] = [
  {
    id: "p1", name: "Margaret Owusu", dob: "1968-03-14",
    department: "General Ward", admittedDate: "2025-04-01",
    currentCondition: "Stable", assignedTo: ["u1", "u2"],
    ward: "Ward 4B", notes: "Type 2 diabetic. Mild hypertension. Responsive to standard care.",
  },
  {
    id: "p2", name: "James Adekunle", dob: "1975-11-02",
    department: "ICU", admittedDate: "2025-04-02",
    currentCondition: "Critical", assignedTo: ["u2"],
    ward: "ICU Bay 2", notes: "Septic shock secondary to urosepsis. On vasopressors.",
  },
  {
    id: "p3", name: "Blessing Nwachukwu", dob: "2012-07-19",
    department: "Pediatrics", admittedDate: "2025-04-03",
    currentCondition: "Improving", assignedTo: ["u3"],
    ward: "Peds Ward A", notes: "Viral fever, resolving. Appetite improving.",
  },
  {
    id: "p4", name: "Emmanuel Eze", dob: "1990-05-28",
    department: "Surgery", admittedDate: "2025-04-03",
    currentCondition: "Stable", assignedTo: ["u1"],
    ward: "Surgical Ward 2", notes: "Post-op appendicectomy Day 2. Wound clean.",
  },
  {
    id: "p5", name: "Grace Akpan", dob: "1993-09-10",
    department: "Emergency", admittedDate: "2025-04-01",
    currentCondition: "Serious", assignedTo: ["u2"],
    ward: "Emergency Bay 1", notes: "Severe pre-eclampsia 36 weeks. Seizure history.",
  },
  {
    id: "p6", name: "Samuel Okonkwo", dob: "1985-01-22",
    department: "General Ward", admittedDate: "2025-04-03",
    currentCondition: "Stable", assignedTo: ["u1", "u3"],
    ward: "Ward 3A", notes: "Asthma exacerbation, significantly improved.",
  },
  {
    id: "p7", name: "Aisha Bello", dob: "1955-06-30",
    department: "ICU", admittedDate: "2025-04-04",
    currentCondition: "Serious", assignedTo: ["u2"],
    ward: "ICU Bay 5", notes: "COPD exacerbation, BiPAP support.",
  },
  {
    id: "p8", name: "Chidi Obi", dob: "2001-12-05",
    department: "Surgery", admittedDate: "2025-04-05",
    currentCondition: "Improving", assignedTo: ["u1"],
    ward: "Surgical Ward 1", notes: "Laparoscopic cholecystectomy. Day 1 post-op.",
  },
];

export const SEED_REPORTS: Report[] = [
  {
    id: "r1", staffId: "u1", staffName: "Nurse Ada Obi",
    department: "General Ward", shift: "Morning", date: "2025-04-04",
    timestamp: now - day * 2 + hour * 9, trashed: false,
    notes: "Quiet morning shift. All patients stable.",
    patients: [
      {
        patientId: "p1", patientName: "Margaret Owusu",
        conditionBefore: "Improving", conditionAfter: "Stable",
        observations: "Patient alert and oriented. Vitals stable. BP 128/82.",
        treatment: "Continued Metformin and Amlodipine. IV line removed.",
        medication: true, medNotes: "Metformin 500mg BD, Amlodipine 5mg OD",
        injuries: "", educationGiven: "Dietary advice for diabetes management.",
        notes: "Patient requests discharge tomorrow.", timestamp: now - day * 2 + hour * 9,
      },
      {
        patientId: "p6", patientName: "Samuel Okonkwo",
        conditionBefore: "Serious", conditionAfter: "Improving",
        observations: "Wheeze significantly reduced. SpO2 98% on room air.",
        treatment: "Salbutamol nebuliser Q4H, Prednisolone continued.",
        medication: true, medNotes: "Salbutamol 2.5mg Q4H, Prednisolone 40mg OD",
        injuries: "", educationGiven: "Inhaler technique demonstrated.",
        notes: "Considering step-down to Q6H.", timestamp: now - day * 2 + hour * 9 + 30 * 60000,
      },
    ],
  },
  {
    id: "r2", staffId: "u2", staffName: "Dr. Kwame Asante",
    department: "ICU", shift: "Night", date: "2025-04-04",
    timestamp: now - day * 2 + hour * 2, trashed: false,
    notes: "Challenging night. Two patients requiring close monitoring.",
    patients: [
      {
        patientId: "p2", patientName: "James Adekunle",
        conditionBefore: "Critical", conditionAfter: "Critical",
        observations: "MAP fluctuating 58-72. UO 0.4ml/kg/h. SOFA score 12.",
        treatment: "Norepinephrine uptitrated to 0.3mcg/kg/min. Fluid challenge given.",
        medication: true, medNotes: "Norepinephrine 0.3mcg/kg/min, Pip-Taz 4.5g Q8H, Insulin sliding scale",
        injuries: "", educationGiven: "",
        notes: "BP dropped to 80/50 at 02:30 - responded to 500ml NS bolus.", timestamp: now - day * 2 + hour * 2,
      },
      {
        patientId: "p5", patientName: "Grace Akpan",
        conditionBefore: "Critical", conditionAfter: "Serious",
        observations: "BP 170/105. Proteinuria 3+. CTG reactive at 03:00.",
        treatment: "MgSO4 infusion continued. Labetalol IV for BP.",
        medication: true, medNotes: "MgSO4 1g/h, Labetalol 20mg IV PRN",
        injuries: "", educationGiven: "Management plan explained to patient and spouse.",
        notes: "Seizure at 01:15 managed with Diazepam. Neuro consult requested.", timestamp: now - day * 2 + hour * 2 + 45 * 60000,
      },
    ],
  },
  {
    id: "r3", staffId: "u3", staffName: "Nurse Fatima Hassan",
    department: "Pediatrics", shift: "Afternoon", date: "2025-04-05",
    timestamp: now - day + hour * 14, trashed: false,
    notes: "Good shift. Paeds ward settled well.",
    patients: [
      {
        patientId: "p3", patientName: "Blessing Nwachukwu",
        conditionBefore: "Serious", conditionAfter: "Improving",
        observations: "Temperature 37.2C. Eating small amounts. Playing with toys.",
        treatment: "Oral rehydration encouraged. Paracetamol PRN only.",
        medication: false, medNotes: "", injuries: "",
        educationGiven: "Hygiene education given to mother. Fever management at home.",
        notes: "Likely ready for discharge tomorrow if apyrexial.", timestamp: now - day + hour * 14,
      },
    ],
  },
  {
    id: "r4", staffId: "u1", staffName: "Nurse Ada Obi",
    department: "Surgery", shift: "Morning", date: "2025-04-05",
    timestamp: now - hour * 6, trashed: false,
    notes: "Routine post-op monitoring. All wounds clean.",
    patients: [
      {
        patientId: "p4", patientName: "Emmanuel Eze",
        conditionBefore: "Stable", conditionAfter: "Stable",
        observations: "Wound clean and dry. Tolerating oral diet. Pain 2/10.",
        treatment: "Wound dressing changed. Mobilised with physio.",
        medication: true, medNotes: "Paracetamol 1g TID, Tramadol 50mg PRN, Enoxaparin 40mg SC OD",
        injuries: "", educationGiven: "Wound care and signs of infection explained.",
        notes: "Discharge planned tomorrow. Transport confirmed.", timestamp: now - hour * 6,
      },
      {
        patientId: "p8", patientName: "Chidi Obi",
        conditionBefore: "Stable", conditionAfter: "Improving",
        observations: "Tolerating sips. Wound sites clean. Minimal pain.",
        treatment: "Early mobilisation encouraged. Analgesia adjusted.",
        medication: true, medNotes: "Paracetamol 1g QID, Ibuprofen 400mg TID",
        injuries: "", educationGiven: "Post-laparoscopic care and lifting restrictions.",
        notes: "Patient anxious about discharge. Social worker referral made.", timestamp: now - hour * 6 + 25 * 60000,
      },
    ],
  },
];
