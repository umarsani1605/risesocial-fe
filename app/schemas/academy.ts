import { z } from 'zod'

const orderField = z.coerce.number().int('Order must be a whole number').nonnegative('Order cannot be negative').optional()

export const academyFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.string().min(1, 'Duration is required'),
  format: z.string().min(1, 'Format is required'),
  category: z.string().min(1, 'Category is required'),
  pixel_id: z.string().optional(),
})

export const pricingFormSchema = z.object({
  name: z.string().min(1, 'Package name is required'),
  original_price: z.coerce.number().int('Price must be a whole number').min(1, 'Original price is required'),
  discount_price: z.coerce.number().int('Price must be a whole number').nonnegative('Price cannot be negative').optional(),
  order: orderField,
})

export const featureFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  order: orderField,
})

export const instructorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  description: z.string().optional(),
  order: orderField,
})

export const testimonialFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  comment: z.string().min(1, 'Comment is required'),
  order: orderField,
})

export const faqFormSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  order: orderField,
})

export const themeFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  order: orderField,
})

export const topicFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  order: orderField,
})
