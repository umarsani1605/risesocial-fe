import { z } from 'zod'

// For CohortModal (academy_id passed as prop, not a form field)
export const cohortCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

// For cohorts/index.vue create form (academy_id is a select field)
export const cohortCreatePageSchema = z.object({
  academy_id: z.number({ error: 'Academy is required' }).int().positive(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

export const cohortEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['not_started', 'on_going', 'completed', 'cancelled']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  max_students: z.number().optional(),
})

export const moduleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  sessionDate: z.string().optional(),
  meetingLink: z.string().url('Invalid URL').or(z.literal('')).optional(),
  attendanceLink: z.string().url('Invalid URL').or(z.literal('')).optional(),
  assignmentLink: z.string().url('Invalid URL').or(z.literal('')).optional(),
  isPublished: z.boolean().optional(),
})

export const inviteStudentSchema = z.object({
  email: z.string().min(1, 'Email is required'),
})

export const mentorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  jobTitle: z.string().optional(),
})
