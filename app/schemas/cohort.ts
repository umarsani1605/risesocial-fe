import { z } from 'zod'
import type { CalendarDate, Time } from '@internationalized/date'

// For CohortModal (academy_id passed as prop, not a form field)
export const cohortCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
})

// For cohorts/index.vue create form (academy_id is a select field)
export const cohortCreatePageSchema = z.object({
  academy_id: z.number({ error: 'Academy is required' }).int().positive(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
})

export const cohortEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
})

export const moduleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  sessionDate: z.custom<CalendarDate>((val) => val !== null && val !== undefined, { error: 'Session Date is required' }),
  sessionStartTime: z.custom<Time>((val) => val !== null && val !== undefined, { error: 'Session time is required' }),
  sessionEndTime: z.custom<Time>().optional().nullable(),
  meetingLink: z.string().min(1, 'Meeting Link is required').url('Invalid URL'),
  attendanceLink: z.string().min(1, 'Attendance Link is required').url('Invalid URL'),
  assignmentTitle: z.string().optional(),
  assignmentLink: z.string().url('Invalid URL').or(z.literal('')).optional(),
  assignmentDeadlineDate: z.custom<CalendarDate>().optional().nullable(),
  assignmentDeadlineTime: z.custom<Time>().optional().nullable(),
  isPublished: z.boolean().optional(),
})

export const inviteStudentSchema = z.object({
  email: z.string().min(1, 'Email is required'),
})

export const mentorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  jobTitle: z.string().optional(),
})

const gradeField = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number({ error: 'Must be a number' }).min(0, 'Min 0').max(10, 'Max 10').optional()
)

export const generateCertificateSchema = z.object({
  assignments: gradeField,
  case_study: gradeField,
  final_test: gradeField,
  final_score: gradeField,
})
