import { z } from 'zod'

// Admin: Create User — semua field required
export const userCreateSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Admin: Edit User — name/password optional; email required (selalu pre-filled)
export const userEditSchema = z
  .object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.email('Invalid email address'),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.password || data.password.length >= 6,
    { message: 'Password must be at least 6 characters', path: ['password'] }
  )
  .refine(
    (data) => !data.password || data.password === data.confirmPassword,
    { message: 'Passwords do not match', path: ['confirmPassword'] }
  )

// Dashboard: Account Settings — all optional, email validates format
export const userAccountSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  last_education: z.string().optional(),
  current_job: z.string().optional(),
  current_company: z.string().optional(),
})

// Dashboard: Security — password + repeat required, min 6 (sesuai backend)
export const userPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    repeatPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  })
