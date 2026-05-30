import { z } from 'zod'

const optionalEmail = z.email('Enter a valid email').or(z.literal(''))

const optionalUrl = z.url('Enter a valid URL').or(z.literal(''))

export const websiteContactSchema = z.object({
  phone: z.string().trim().max(50, 'Phone number is too long'),
  email: optionalEmail,
  address: z.string().trim().max(300, 'Address is too long')
})

export const websiteSocialMediaSchema = z.object({
  instagram: optionalUrl,
  facebook: optionalUrl,
  linkedin: optionalUrl,
  tiktok: optionalUrl
})

/** Combined schema for the single Website Settings form. */
export const websiteSettingsSchema = websiteContactSchema.extend(websiteSocialMediaSchema.shape)

export type WebsiteContactValues = z.infer<typeof websiteContactSchema>
export type WebsiteSocialMediaValues = z.infer<typeof websiteSocialMediaSchema>
export type WebsiteSettingsValues = z.infer<typeof websiteSettingsSchema>

export const WEBSITE_CONTACT_KEY = 'website_contact'
export const WEBSITE_SOCIAL_MEDIA_KEY = 'website_social_media'

export const EMPTY_WEBSITE_CONTACT: WebsiteContactValues = {
  phone: '',
  email: '',
  address: ''
}

export const EMPTY_WEBSITE_SOCIAL_MEDIA: WebsiteSocialMediaValues = {
  instagram: '',
  facebook: '',
  linkedin: '',
  tiktok: ''
}
