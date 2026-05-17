import { z } from 'zod'

// Backend Fastify enforces min 6 on password — keep frontend in sync.
export const PASSWORD_MIN_LENGTH = 6 as const

const passwordMinMessage = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`

// Admin: Create User — semua field required
export const userCreateSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(PASSWORD_MIN_LENGTH, passwordMinMessage),
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
    role: z.enum(['user', 'admin'], { error: 'Role must be user or admin' }).optional(),
  })
  .refine(
    (data) => !data.password || data.password.length >= PASSWORD_MIN_LENGTH,
    { message: passwordMinMessage, path: ['password'] }
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

// Payment Checkout: customer info form (sent to Midtrans as customer_details)
export const paymentCustomerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  email: z.email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
})
export type PaymentCustomer = z.infer<typeof paymentCustomerSchema>

// Dashboard: Security — password + repeat required
export const userPasswordSchema = z
  .object({
    password: z.string().min(PASSWORD_MIN_LENGTH, passwordMinMessage),
    repeatPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  })
