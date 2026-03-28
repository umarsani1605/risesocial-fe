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
