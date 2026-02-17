export type Patient = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  address: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  phone: string | null;
  status: string;
  consultations_today: number;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  patient_id: string;
  team_member_id: string | null;
  appointment_date: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Treatment = {
  id: string;
  patient_id: string;
  team_member_id: string | null;
  appointment_id: string | null;
  description: string;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type AIAnalysis = {
  id: string;
  patient_id: string;
  analysis_type: string;
  result: string;
  severity: string;
  analyzed_at: string;
  created_at: string;
};

export type FinancialRecord = {
  id: string;
  record_type: string;
  amount: number;
  description: string;
  record_date: string;
  patient_id: string | null;
  appointment_id: string | null;
  created_at: string;
};
