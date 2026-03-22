import { z } from 'zod'

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE'] as const

export const jobCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  employment_type: z.enum(JOB_TYPES, { error: 'Job type is required' }),
  seniority_level: z.string().optional(),
  is_remote: z.boolean().optional(),
  valid_until: z.string().optional(),
  external_url: z.string().optional(),
})

export const jobEditSchema = jobCreateSchema.extend({
  status: z.enum(['active', 'inactive']).optional(),
})
