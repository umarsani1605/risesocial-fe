import { describe, expect, it } from 'vitest'
import { buildCohortMentorFormData } from '../../app/utils/cohortMentors'

describe('buildCohortMentorFormData', () => {
  it('maps the frontend mentor form into the backend field names', () => {
    const formData = buildCohortMentorFormData({
      name: 'Jane Mentor',
      jobTitle: 'Senior Consultant',
    })

    expect(formData.get('name')).toBe('Jane Mentor')
    expect(formData.get('job_title')).toBe('Senior Consultant')
    expect(formData.get('avatar')).toBeNull()
    expect(formData.get('image')).toBeNull()
  })

  it('includes the uploaded avatar file when present', () => {
    const file = new File(['avatar'], 'mentor.png', { type: 'image/png' })
    const formData = buildCohortMentorFormData(
      {
        name: 'Jane Mentor',
        jobTitle: 'Senior Consultant',
      },
      file,
    )

    expect(formData.get('image')).toBe(file)
  })

  it('sends an empty avatar field when the existing avatar is removed', () => {
    const formData = buildCohortMentorFormData(
      {
        name: 'Jane Mentor',
        jobTitle: '',
      },
      null,
      true,
    )

    expect(formData.get('avatar')).toBe('')
  })
})
