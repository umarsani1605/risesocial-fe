export type AcademyStatus = 'Active' | 'Archived'
export type CohortStatus = 'Completed' | 'On Going' | 'Not Started'
export type PaymentStatus = 'Paid' | 'Pending' | 'Expired'

export interface AdminAcademy {
  id: number
  title: string
  category: string
  duration: string
  format: string
  status: AcademyStatus
}

export interface AdminCohort {
  id: number
  academy_id: number
  academy: { id: number; title: string; slug: string } | null
  name: string
  description: string | null
  status: string
  start_date: string | null
  end_date: string | null
}

export interface AdminPayment {
  id: number
  invoiceNo: string
  studentName: string
  academy: string
  status: PaymentStatus
  createdAt: string
}


export interface RylsPayment {
  id: number
  paid_at: string | null
  amount: number
  status: string
  type: string
  payment_proof: { id: number; original_name: string; file_path: string } | null
}

export interface RylsRegistration {
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

export interface AcademyPricing {
  id: number
  name: string
  original_price: number
  discount_price: number
}

export interface AcademyTopic {
  id: number
  title: string
  description: string
  subtopics: Array<{ id: number; title: string }>
}

export interface AcademyPersonDetail {
  id: number
  name: string
  email: string
  phone: string
  avatar: string | null
}

export interface AcademyDetail {
  id: number
  title: string
  category: string
  duration: string
  format: string
  status: AcademyStatus
  description: string
  image: string | null
  certificate: boolean
  portfolio: boolean
  pricing: AcademyPricing[]
  topics: AcademyTopic[]
  cohorts: Array<{
    id: number
    name: string
    description: string
    students_count: number
    status: CohortStatus
  }>
  students: AcademyPersonDetail[]
  mentors: AcademyPersonDetail[]
}

// ──────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────

const adminAcademies: AdminAcademy[] = [
  { id: 1, title: 'Academy Title', category: 'ESG', duration: '1 month', format: 'Online Live Class', status: 'Active' },
  { id: 2, title: 'Academy Title', category: 'Sustainability', duration: '1 month', format: 'Online Live Class', status: 'Active' },
  { id: 3, title: 'Academy Title', category: 'Carbon Reduction', duration: '1 month', format: 'Online Live Class', status: 'Archived' },
  { id: 4, title: 'Academy Title', category: 'Sustainability', duration: '3 months', format: 'Online Live Class', status: 'Active' },
  { id: 5, title: 'Academy Title', category: 'Carbon Reduction', duration: '3 months', format: 'Online Live Class', status: 'Archived' },
  { id: 6, title: 'Carbon Accounting Mini Academy', category: 'Carbon Accounting', duration: '2 months', format: 'Online Live Class', status: 'Active' },
  { id: 7, title: 'ESG Academy', category: 'ESG', duration: '3 months', format: 'Online Live Class', status: 'Active' },
  { id: 8, title: 'Sustainable Finance Academy', category: 'Sustainability', duration: '3 months', format: 'Online Live Class', status: 'Active' },
  { id: 9, title: 'LCA Mini Academy', category: 'Carbon Reduction', duration: '1 month', format: 'Online Live Class', status: 'Archived' },
  { id: 10, title: 'Green Business Academy', category: 'ESG', duration: '2 months', format: 'Online Live Class', status: 'Active' }
]

const adminCohorts: AdminCohort[] = [
  { id: 1, academy_id: 1, academy: { id: 1, title: 'Carbon Accounting', slug: 'carbon-accounting' }, name: 'Batch 1', description: 'November 2025', status: 'Completed', start_date: null, end_date: null },
  { id: 2, academy_id: 1, academy: { id: 1, title: 'Carbon Accounting', slug: 'carbon-accounting' }, name: 'Batch 2', description: null, status: 'On Going', start_date: null, end_date: null },
  { id: 3, academy_id: 2, academy: { id: 2, title: 'ESG Academy', slug: 'esg-academy' }, name: 'Summer Class', description: 'Summer Class', status: 'Not Started', start_date: null, end_date: null },
  { id: 4, academy_id: 3, academy: { id: 3, title: 'LCA Mini Academy', slug: 'lca-mini-academy' }, name: 'Batch 1', description: 'April 2026', status: 'Completed', start_date: null, end_date: null },
  { id: 5, academy_id: 3, academy: { id: 3, title: 'LCA Mini Academy', slug: 'lca-mini-academy' }, name: 'Batch 2', description: null, status: 'On Going', start_date: null, end_date: null },
  { id: 6, academy_id: 4, academy: { id: 4, title: 'Sustainable Finance Academy', slug: 'sustainable-finance-academy' }, name: 'Batch 1', description: 'February 2026', status: 'On Going', start_date: null, end_date: null },
  { id: 7, academy_id: 5, academy: { id: 5, title: 'Green Business Academy', slug: 'green-business-academy' }, name: 'Batch 1', description: 'March 2026', status: 'Not Started', start_date: null, end_date: null },
  { id: 8, academy_id: 1, academy: { id: 1, title: 'Carbon Accounting', slug: 'carbon-accounting' }, name: 'Batch 3', description: 'January 2026', status: 'Completed', start_date: null, end_date: null }
]

const adminPayments: AdminPayment[] = [
  { id: 1, invoiceNo: 'R0001', studentName: 'John Doe', academy: 'Carbon Accounting', status: 'Paid', createdAt: '8 Januari 2026 16.30' },
  { id: 2, invoiceNo: 'R0002', studentName: 'John Doe', academy: 'ESG (Environmental, Social, and Governance)', status: 'Paid', createdAt: '8 Januari 2026 16.30' },
  { id: 3, invoiceNo: 'R0003', studentName: 'John Doe', academy: 'LCA (Life Cycle Assessment)', status: 'Pending', createdAt: '8 Januari 2026 16.30' },
  { id: 4, invoiceNo: 'R0004', studentName: 'John Doe', academy: 'Carbon Accounting', status: 'Pending', createdAt: '8 Januari 2026 16.30' },
  { id: 5, invoiceNo: 'R0005', studentName: 'John Doe', academy: 'Carbon Accounting', status: 'Expired', createdAt: '8 Januari 2026 16.30' },
  { id: 6, invoiceNo: 'R0006', studentName: 'Jane Smith', academy: 'ESG (Environmental, Social, and Governance)', status: 'Paid', createdAt: '9 Januari 2026 10.15' },
  { id: 7, invoiceNo: 'R0007', studentName: 'Budi Santoso', academy: 'Sustainable Finance', status: 'Paid', createdAt: '10 Januari 2026 08.00' },
  { id: 8, invoiceNo: 'R0008', studentName: 'Siti Rahayu', academy: 'Carbon Accounting', status: 'Pending', createdAt: '10 Januari 2026 14.30' },
  { id: 9, invoiceNo: 'R0009', studentName: 'Ahmad Fauzi', academy: 'LCA (Life Cycle Assessment)', status: 'Paid', createdAt: '11 Januari 2026 09.45' },
  { id: 10, invoiceNo: 'R0010', studentName: 'Dewi Kusuma', academy: 'ESG (Environmental, Social, and Governance)', status: 'Expired', createdAt: '12 Januari 2026 11.00' },
  { id: 11, invoiceNo: 'R0011', studentName: 'Reza Pratama', academy: 'Sustainable Finance', status: 'Paid', createdAt: '12 Januari 2026 15.20' },
  { id: 12, invoiceNo: 'R0012', studentName: 'Andi Wijaya', academy: 'Carbon Accounting', status: 'Paid', createdAt: '13 Januari 2026 13.00' },
  { id: 13, invoiceNo: 'R0013', studentName: 'Maya Sari', academy: 'LCA (Life Cycle Assessment)', status: 'Pending', createdAt: '14 Januari 2026 10.30' },
  { id: 14, invoiceNo: 'R0014', studentName: 'Kevin Hartanto', academy: 'ESG (Environmental, Social, and Governance)', status: 'Paid', createdAt: '14 Januari 2026 16.00' },
  { id: 15, invoiceNo: 'R0015', studentName: 'Lisa Andini', academy: 'Sustainable Finance', status: 'Expired', createdAt: '15 Januari 2026 09.00' },
  { id: 16, invoiceNo: 'R0016', studentName: 'Farhan Ibrahim', academy: 'Carbon Accounting', status: 'Paid', createdAt: '15 Januari 2026 14.45' },
  { id: 17, invoiceNo: 'R0017', studentName: 'Putri Rahayu', academy: 'LCA (Life Cycle Assessment)', status: 'Paid', createdAt: '16 Januari 2026 11.30' },
  { id: 18, invoiceNo: 'R0018', studentName: 'Dina Permata', academy: 'ESG (Environmental, Social, and Governance)', status: 'Pending', createdAt: '17 Januari 2026 08.15' },
  { id: 19, invoiceNo: 'R0019', studentName: 'Rizky Pratama', academy: 'Carbon Accounting', status: 'Paid', createdAt: '17 Januari 2026 14.00' },
  { id: 20, invoiceNo: 'R0020', studentName: 'Nadia Cahyani', academy: 'Sustainable Finance', status: 'Paid', createdAt: '18 Januari 2026 09.30' }
]

const adminUsers: AdminUser[] = [
  { id: 56, username: 'adistysalsabilacandra', first_name: 'adisty', last_name: 'salsabila candra', email: 'adistysalsabilacandra@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-29T04:13:42.886Z' },
  { id: 50, username: 'alyssavallejos', first_name: 'Alyssa', last_name: 'Vallejos', email: 'alyssavallejos1004@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-24T08:48:53.886Z' },
  { id: 51, username: 'christianjuliuswijaya', first_name: 'Christian Julius', last_name: 'Wijaya', email: 'christian_wijaya@ukwms.ac.id', phone: null, avatar: null, role: 'USER', created_at: '2025-09-25T07:07:50.886Z' },
  { id: 58, username: 'krisnaramadhan', first_name: 'Krisna', last_name: 'Ramadhan', email: 'krisna.rmdhn111@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-29T09:33:28.886Z' },
  { id: 54, username: 'lukmaniarramadhani', first_name: 'LUKMANIAR', last_name: 'RAMADHANI', email: 'lukmaniarramadani@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-28T05:37:37.886Z' },
  { id: 52, username: 'muhammadsheraz', first_name: 'Muhammad', last_name: 'Sheraz', email: 'muhammadsheraz@ipe.ac.cn', phone: null, avatar: null, role: 'USER', created_at: '2025-09-27T11:24:16.886Z' },
  { id: 53, username: 'nadyaramadani', first_name: 'Nadya', last_name: 'Ramadani', email: 'nadyanisfi0710@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-27T13:45:12.886Z' },
  { id: 59, username: 'pechsovan', first_name: 'Pech', last_name: 'Sovan', email: 'pech.sovan.arc@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-29T09:54:04.886Z' },
  { id: 55, username: 'rafirajibsa', first_name: 'Rafi', last_name: 'Rajibsa', email: 'rafirajibsa@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-28T11:29:20.886Z' },
  { id: 57, username: 'zahrazulfiaananta', first_name: 'Zahra', last_name: 'Zulfia Ananta', email: 'zahrazulfiaaya@gmail.com', phone: null, avatar: null, role: 'USER', created_at: '2025-09-29T09:22:00.886Z' }
]

const rylsRegistrations: RylsRegistration[] = [
  {
    id: 339, full_name: 'Zara Usman', email: 'usmanzara@yahoo.com', residence: 'Toronto and Canada', nationality: 'Canada', second_nationality: null, whatsapp: '16474107945', institution: 'Morningstar', date_of_birth: '1993-11-25T00:00:00.000Z', gender: 'FEMALE', discover_source: 'FRIENDS', discover_other_text: null, scholarship_type: 'FULLY_FUNDED', created_at: '2025-09-30T18:57:07.627Z',
    payments: [{ id: 1392, paid_at: '2025-09-30T18:57:00.415Z', amount: 249840, status: 'PAID', type: 'PAYPAL', payment_proof: { id: 330, original_name: 'Photo.pdf', file_path: '/uploads/documents/payment_proof_1.pdf' } }],
    fully_funded_submission: { essay_topic: null, essay_description: null }
  },
  {
    id: 338, full_name: 'Daria Onokhova', email: 'dariaonokhova@gmail.com', residence: 'Moscow, Russian Federation', nationality: 'russian', second_nationality: 'ukranian', whatsapp: '+79992777270', institution: 'Owner of Startup', date_of_birth: '1991-02-02T00:00:00.000Z', gender: 'FEMALE', discover_source: 'OTHER_INSTAGRAM', discover_other_text: null, scholarship_type: 'FULLY_FUNDED', created_at: '2025-09-30T18:36:44.385Z',
    payments: [{ id: 1391, paid_at: '2025-09-30T18:36:00.000Z', amount: 249840, status: 'PAID', type: 'PAYPAL', payment_proof: { id: 329, original_name: 'receipt.pdf', file_path: '/uploads/documents/payment_proof_2.pdf' } }],
    fully_funded_submission: { essay_topic: null, essay_description: null }
  },
  {
    id: 337, full_name: 'Asila Tokhirova', email: 'asila.tokhir@gmail.com', residence: 'Tashkent, Uzbekistan', nationality: 'Uzbek', second_nationality: null, whatsapp: '+998903745541', institution: 'American University in Central Asia', date_of_birth: '2005-03-07T00:00:00.000Z', gender: 'FEMALE', discover_source: 'SOCIAL_MEDIA', discover_other_text: null, scholarship_type: 'FULLY_FUNDED', created_at: '2025-09-30T17:20:00.000Z',
    payments: [{ id: 1390, paid_at: '2025-09-30T17:20:00.000Z', amount: 249840, status: 'PAID', type: 'PAYPAL', payment_proof: null }],
    fully_funded_submission: { essay_topic: 'Youth and Climate Action', essay_description: 'My essay on youth climate leadership.' }
  },
  {
    id: 336, full_name: 'Thi Minh Anh Nguyen', email: 'ngminhanh2910@gmail.com', residence: 'Hanoi', nationality: 'Vietnamese', second_nationality: null, whatsapp: '+84372315198', institution: 'National Economics University', date_of_birth: '2004-10-29T00:00:00.000Z', gender: 'FEMALE', discover_source: 'LINKEDIN', discover_other_text: null, scholarship_type: 'SELF_FUNDED', created_at: '2025-09-30T16:00:00.000Z',
    payments: [{ id: 1389, paid_at: '2025-09-30T16:00:00.000Z', amount: 749840, status: 'PAID', type: 'BANK_TRANSFER', payment_proof: { id: 328, original_name: 'transfer_proof.jpg', file_path: '/uploads/documents/payment_proof_3.jpg' } }],
    fully_funded_submission: null
  },
  {
    id: 335, full_name: 'Regia Rizki Pratama', email: 'regiarizikipratama715@gmail.com', residence: 'Surabaya, Indonesia', nationality: 'Indonesia', second_nationality: null, whatsapp: '+6283821502988', institution: 'UPN "Veteran" Jawa Timur', date_of_birth: '2005-01-07T00:00:00.000Z', gender: 'MALE', discover_source: 'FRIENDS', discover_other_text: null, scholarship_type: 'FULLY_FUNDED', created_at: '2025-09-30T14:30:00.000Z',
    payments: [{ id: 1388, paid_at: '2025-09-30T14:30:00.000Z', amount: 249840, status: 'PAID', type: 'PAYPAL', payment_proof: { id: 327, original_name: 'paypal_confirm.pdf', file_path: '/uploads/documents/payment_proof_4.pdf' } }],
    fully_funded_submission: { essay_topic: 'Sustainable Development Goals', essay_description: null }
  },
  {
    id: 334, full_name: 'Defin Allevia Yumnanisha', email: 'definalevia@gmail.com', residence: 'Depok, Indonesia', nationality: 'Indonesia', second_nationality: null, whatsapp: '+6281297104975', institution: 'Universitas Indonesia', date_of_birth: '2002-07-25T00:00:00.000Z', gender: 'FEMALE', discover_source: 'OTHER_INSTAGRAM', discover_other_text: null, scholarship_type: 'FULLY_FUNDED', created_at: '2025-09-30T13:15:00.000Z',
    payments: [{ id: 1387, paid_at: '2025-09-30T13:15:00.000Z', amount: 249840, status: 'PAID', type: 'PAYPAL', payment_proof: null }],
    fully_funded_submission: { essay_topic: null, essay_description: null }
  },
  {
    id: 333, full_name: 'Siti Nur Aisyah', email: 'aisyahcooking15@gmail.com', residence: 'Makassar', nationality: 'Indonesia', second_nationality: null, whatsapp: '+6289525411965', institution: 'Self Employed', date_of_birth: '2000-03-15T00:00:00.000Z', gender: 'FEMALE', discover_source: 'SOCIAL_MEDIA', discover_other_text: null, scholarship_type: 'SELF_FUNDED', created_at: '2025-09-30T12:00:00.000Z',
    payments: [{ id: 1386, paid_at: null, amount: 749840, status: 'PENDING', type: 'BANK_TRANSFER', payment_proof: null }],
    fully_funded_submission: null
  },
  {
    id: 332, full_name: 'MUH. KHADAFI KASIM', email: 'khadaficonnect@gmail.com', residence: 'Makassar', nationality: 'Indonesia', second_nationality: null, whatsapp: '+6281340643550', institution: 'Dimple Bisnis', date_of_birth: '2000-12-15T00:00:00.000Z', gender: 'MALE', discover_source: 'FRIENDS', discover_other_text: null, scholarship_type: 'FULLY_FUNDED', created_at: '2025-09-30T11:00:00.000Z',
    payments: [{ id: 1385, paid_at: '2025-09-30T11:00:00.000Z', amount: 249840, status: 'PAID', type: 'PAYPAL', payment_proof: { id: 325, original_name: 'proof.pdf', file_path: '/uploads/documents/payment_proof_5.pdf' } }],
    fully_funded_submission: { essay_topic: 'Leadership for Change', essay_description: 'Essay about youth leadership.' }
  },
  {
    id: 331, full_name: 'Ogilvy Galang Rizki', email: 'ogilvy111@gmail.com', residence: 'Yogyakarta, Indonesia', nationality: 'Indonesia', second_nationality: null, whatsapp: '082299911646', institution: 'Gadjah Mada University', date_of_birth: '2001-08-21T00:00:00.000Z', gender: 'MALE', discover_source: 'LINKEDIN', discover_other_text: null, scholarship_type: 'SELF_FUNDED', created_at: '2025-09-30T10:00:00.000Z',
    payments: [{ id: 1384, paid_at: '2025-09-30T10:00:00.000Z', amount: 749840, status: 'PAID', type: 'BANK_TRANSFER', payment_proof: { id: 324, original_name: 'bank_receipt.jpg', file_path: '/uploads/documents/payment_proof_6.jpg' } }],
    fully_funded_submission: null
  },
  {
    id: 330, full_name: 'Rabina Abdrakhmanova', email: 'rabina.abdrakhmanova@gmail.com', residence: 'Astana, Kazakhstan', nationality: 'Kazakhstan', second_nationality: null, whatsapp: '+77015171588', institution: 'Ecole Polytechnique', date_of_birth: '2000-02-09T00:00:00.000Z', gender: 'FEMALE', discover_source: 'SOCIAL_MEDIA', discover_other_text: null, scholarship_type: 'FULLY_FUNDED', created_at: '2025-09-30T09:00:00.000Z',
    payments: [{ id: 1383, paid_at: '2025-09-30T09:00:00.000Z', amount: 249840, status: 'PAID', type: 'PAYPAL', payment_proof: { id: 323, original_name: 'paypal.pdf', file_path: '/uploads/documents/payment_proof_7.pdf' } }],
    fully_funded_submission: { essay_topic: null, essay_description: null }
  }
]

// ──────────────────────────────────────────────
// Composable
// ──────────────────────────────────────────────

export const useMockAdminData = () => {
  const getAcademies = (filters?: { search?: string; category?: string; status?: string }) => {
    let result = [...adminAcademies]
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      result = result.filter(a => a.title.toLowerCase().includes(s) || a.category.toLowerCase().includes(s))
    }
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(a => a.category === filters.category)
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status)
    }
    return result
  }

  const getCohorts = (filters?: { search?: string; academy?: string; status?: string }) => {
    let result = [...adminCohorts]
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      result = result.filter(c => c.academy?.title.toLowerCase().includes(s) || c.name.toLowerCase().includes(s))
    }
    if (filters?.academy && filters.academy !== 'all') {
      result = result.filter(c => String(c.academy?.id) === filters.academy)
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status)
    }
    return result
  }

  const getPayments = (filters?: { search?: string; academy?: string; status?: string }) => {
    let result = [...adminPayments]
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      result = result.filter(p =>
        p.invoiceNo.toLowerCase().includes(s) ||
        p.studentName.toLowerCase().includes(s) ||
        p.academy.toLowerCase().includes(s)
      )
    }
    if (filters?.academy && filters.academy !== 'all') {
      result = result.filter(p => p.academy === filters.academy)
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status)
    }
    return result
  }

  const getUsers = (filters?: { search?: string }) => {
    let result = [...adminUsers]
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      result = result.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
      )
    }
    return result
  }

  const getUserById = (id: number) => adminUsers.find(u => u.id === id) ?? null

  const academyDetailBase: AcademyDetail = {
    id: 1,
    title: 'Carbon Accounting',
    category: 'INTAKE: 24 January 2026',
    duration: '1 Month',
    format: 'Online Live Classes',
    status: 'Active',
    description: 'The Carbon Accounting Mini Academy is an intensive, hands-on program designed to equip you with carbon accounting skills to drive meaningful environmental impact in your organization.',
    image: null,
    certificate: true,
    portfolio: true,
    pricing: [
      { id: 1, name: 'Pricing 1', original_price: 2000000, discount_price: 1000000 },
      { id: 2, name: 'Pricing 2', original_price: 3000000, discount_price: 1500000 }
    ],
    topics: [
      {
        id: 1, title: 'Theme 1: ESG Fundamentals',
        description: 'Exploring ESG concepts, international standards, and reporting frameworks',
        subtopics: [
          { id: 1, title: '1. Perkenalan ESG' },
          { id: 2, title: '2. Lingkungan (Environmental)' },
          { id: 3, title: '3. Sosial (Social)' },
          { id: 4, title: '4. Tata Kelola (Governance)' }
        ]
      },
      {
        id: 2, title: 'Theme 2: ESG Implementation in Business',
        description: 'Understanding ESG planning, implementation, and business integration',
        subtopics: []
      },
      {
        id: 3, title: 'Theme 3: ESG Report Preparation',
        description: 'Understanding ESG planning, implementation, and reporting standards',
        subtopics: []
      }
    ],
    cohorts: [
      { id: 1, name: 'Batch 1', description: 'November 2025', students_count: 3, status: 'Completed' },
      { id: 2, name: 'Batch 2', description: 'January–February 2026', students_count: 5, status: 'On Going' },
      { id: 3, name: 'Batch 3', description: 'Summer Class', students_count: 12, status: 'Not Started' }
    ],
    students: [
      { id: 1, name: 'John Doe', email: 'user1@gmail.com', phone: '08123456789', avatar: null },
      { id: 2, name: 'John Doe', email: 'user2@gmail.com', phone: '08123456789', avatar: null },
      { id: 3, name: 'John Doe', email: 'user3@gmail.com', phone: '08123456789', avatar: null }
    ],
    mentors: [
      { id: 1, name: 'John Doe', email: 'user1@gmail.com', phone: '08123456789', avatar: null },
      { id: 2, name: 'John Doe', email: 'user2@gmail.com', phone: '08123456789', avatar: null },
      { id: 3, name: 'John Doe', email: 'user3@gmail.com', phone: '08123456789', avatar: null }
    ]
  }

  const getAcademyById = (id: number): AcademyDetail => {
    const base = adminAcademies.find(a => a.id === id)
    return {
      ...academyDetailBase,
      ...(base ? { title: base.title, category: base.category, duration: base.duration, format: base.format, status: base.status } : {}),
      id
    }
  }

  const getRylsRegistrations = (filters?: { scholarship_type?: string; gender?: string; nationality?: string; payment_type?: string; search?: string }) => {
    let result = [...rylsRegistrations]
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      result = result.filter(r =>
        r.full_name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        r.whatsapp?.includes(s) ||
        r.institution?.toLowerCase().includes(s)
      )
    }
    if (filters?.scholarship_type && filters.scholarship_type !== 'all') {
      result = result.filter(r => r.scholarship_type === filters.scholarship_type)
    }
    if (filters?.gender && filters.gender !== 'all') {
      result = result.filter(r => r.gender === filters.gender)
    }
    if (filters?.nationality && filters.nationality !== 'all') {
      result = result.filter(r => r.nationality.toLowerCase() === filters.nationality!.toLowerCase())
    }
    if (filters?.payment_type && filters.payment_type !== 'all') {
      result = result.filter(r => r.payments.some(p => p.type === filters.payment_type))
    }
    return result
  }

  const getSummaryStats = () => ({
    totalAcademies: adminAcademies.filter(a => a.status === 'Active').length,
    totalCohorts: adminCohorts.length,
    totalStudents: adminUsers.length,
    totalPayments: adminPayments.filter(p => p.status === 'Paid').length,
    pendingPayments: adminPayments.filter(p => p.status === 'Pending').length
  })

  const academyOptions = [
    { label: 'All Academy', value: 'all' },
    ...Array.from(new Set(adminCohorts.map(c => c.academy))).map(a => ({ label: a, value: a }))
  ]

  const categoryOptions = [
    { label: 'All Category', value: 'all' },
    ...Array.from(new Set(adminAcademies.map(a => a.category))).map(c => ({ label: c, value: c }))
  ]

  const rylsNationalityOptions = [
    { label: 'All Nationalities', value: 'all' },
    ...Array.from(new Set(rylsRegistrations.map(r => r.nationality))).map(n => ({ label: n, value: n }))
  ]

  return {
    adminAcademies,
    adminCohorts,
    adminPayments,
    adminUsers,
    rylsRegistrations,
    getAcademies,
    getAcademyById,
    getCohorts,
    getPayments,
    getUsers,
    getUserById,
    getRylsRegistrations,
    getSummaryStats,
    academyOptions,
    categoryOptions,
    rylsNationalityOptions
  }
}
