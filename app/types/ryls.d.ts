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

interface RylsPaymentTransaction {
  id: number
  transaction_code: string
  amount: number
  status: string
  provider: string
  payment_method: string | null
  paid_at: string | null
  midtrans_data: {
    midtrans_order_id: string
    transaction_status: string | null
    payment_type: string | null
  } | null
}

interface RylsPayment {
  id: number
  paid_at: string | null
  amount: number
  status: string
  payment_method: string
  payment_proof: { id: number; original_name: string; file_path: string } | null
  transaction: RylsPaymentTransaction | null
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
  form_data: {
    step1?: {
      fullName?: string
      scholarshipType?: string
      whatsapp?: string
      gender?: string
      dateOfBirth?: string
      residence?: string
      nationality?: string
      secondNationality?: string
      institution?: string
      discoverSource?: string
      discoverOtherText?: string
    }
    [key: string]: unknown
  }
  scholarship_type: string | null
  updated_at: string
}
