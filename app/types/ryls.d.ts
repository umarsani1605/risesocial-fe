type RylsPaymentType = 'PAYPAL' | 'MIDTRANS'

interface RylsAnalyticsSummary {
  submitted: number
  drafts: number
}

interface RylsAnalyticsTrendPoint {
  date: string
  count: number
}

interface RylsAnalyticsDemographics {
  byNationality: Array<{ name: string; count: number }>
  byDiscoverSource: Array<{ name: string; count: number }>
  byGender: Array<{ name: string; count: number }>
  byAgeRange: Array<{ name: string; count: number }>
  byScholarshipType: Array<{ name: string; count: number }>
}

interface RylsPayment {
  id: number
  paid_at: string | null
  amount: number
  status: string
  type: string
  payment_proof: { id: number; original_name: string; file_path: string } | null
}

interface RylsRegistration {
  id: number
  full_name: string
  email: string
  residence: string
  nationality: string
  second_nationality: string | null
  whatsapp: string
  institution: string
  date_of_birth: string
  gender: string
  discover_source: string
  discover_other_text: string | null
  scholarship_type: string
  created_at: string
  payments: RylsPayment[]
  fully_funded_submission: {
    essay_topic: string | null
    essay_description: string | null
  } | null
}

interface RylsListResponse {
  registrations: RylsRegistration[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

interface RylsDraft {
  id: number
  email: string
  resume_token: string
  current_step: number
  form_data: { step1?: { fullName?: string; scholarshipType?: string }; [key: string]: unknown }
  scholarship_type: string | null
  expires_at: string
  updated_at: string
}
