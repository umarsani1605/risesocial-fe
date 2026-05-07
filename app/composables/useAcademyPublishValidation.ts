import type { Academy } from '@/types'

interface BasicForm {
  title: string
  description: string
  duration: string
  format: string
  category: string
}

export function useAcademyPublishValidation(academySlug: string) {
  const { api } = useApi()
  const toast = useToast()

  const isValidating = ref(false)
  const validationErrors = ref<string[]>([])
  const isValidationModalOpen = ref(false)

  async function validateForPublish(form: BasicForm): Promise<boolean> {
    isValidating.value = true
    try {
      const fresh = await api<ApiResponse<Academy>>(`/admin/academies/${academySlug}`)
      const d = fresh.data

      const errors: string[] = []
      const requiredFields = [form.title, form.description, form.duration, form.format, form.category]
      if (requiredFields.some((f) => !f?.trim())) {
        errors.push('Basic information (title, description, duration, format, category) must be complete')
      }
      if (!d.pricing?.length) errors.push('At least 1 pricing package is required')
      if ((d.features?.length ?? 0) < 2) errors.push('At least 2 featured benefits are required')
      if (!d.instructors?.length) errors.push('At least 1 instructor is required')
      if (!d.testimonials?.length) errors.push('At least 1 testimonial is required')
      if (!d.faqs?.length) errors.push('At least 1 FAQ is required')
      if (!d.themes?.length) errors.push('At least 1 syllabus theme is required')
      const totalTopics = d.themes?.reduce((sum, t) => sum + (t.topics?.length ?? 0), 0) ?? 0
      if (totalTopics < 1) errors.push('At least 1 topic is required')

      if (errors.length > 0) {
        validationErrors.value = errors
        isValidationModalOpen.value = true
        return false
      }
      return true
    } catch {
      toast.add({ title: 'Failed to validate academy data', color: 'error' })
      return false
    } finally {
      isValidating.value = false
    }
  }

  return { isValidating, validationErrors, isValidationModalOpen, validateForPublish }
}
