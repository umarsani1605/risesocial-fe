import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('academy cohort modal reuse', () => {
  it('reuses the shared cohort create modal in academy edit', () => {
    const sectionCohortsSource = readFileSync(
      resolve('app/components/admin/academy/SectionCohorts.vue'),
      'utf8'
    )
    const academyEditPageSource = readFileSync(
      resolve('app/pages/admin/academies/[slug]/edit.vue'),
      'utf8'
    )

    expect(sectionCohortsSource).toContain('<AdminCohortCreateModal')
    expect(sectionCohortsSource).not.toContain('<AdminAcademyCohortModal')
    expect(sectionCohortsSource).toContain('copy_from_academy')
    expect(sectionCohortsSource).toContain('academyTitle: string')
    expect(sectionCohortsSource).toContain('label: props.academyTitle')
    expect(academyEditPageSource).toContain(':academy-title="source.title"')
  })

  it('supports academy-scoped mode without losing copy syllabus behavior', () => {
    const createModalSource = readFileSync(
      resolve('app/components/admin/cohort/CreateModal.vue'),
      'utf8'
    )

    expect(createModalSource).toContain('fixedAcademyId?: number')
    expect(createModalSource).toContain(':disabled="!!fixedAcademyId"')
    expect(createModalSource).toContain('Copy syllabus and mentors')
  })
})
