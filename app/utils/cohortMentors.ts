interface CohortMentorFormState {
  name: string
  jobTitle: string
}

export function buildCohortMentorFormData(
  form: CohortMentorFormState,
  avatarFile: File | null = null,
  removeAvatar = false,
) {
  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('job_title', form.jobTitle)

  if (avatarFile) {
    formData.append('image', avatarFile)
  }
  else if (removeAvatar) {
    formData.append('avatar', '')
  }

  return formData
}
