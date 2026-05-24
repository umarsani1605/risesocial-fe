import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildAdaptiveSyllabusItems, themeHasSubtopics } from '../../app/utils/academySyllabus'

describe('academy syllabus adaptive mode', () => {
  it('detects whether a top-level topic has subtopics', () => {
    expect(themeHasSubtopics({ topics: [{ id: 1 }] })).toBe(true)
    expect(themeHasSubtopics({ topics: [] })).toBe(false)
    expect(themeHasSubtopics()).toBe(false)
  })

  it('builds per-topic adaptive items for public rendering', () => {
    const items = buildAdaptiveSyllabusItems([
      {
        id: 1,
        order: 1,
        title: 'Topic Only',
        description: 'Standalone topic',
        topics: []
      },
      {
        id: 2,
        order: 2,
        title: 'Topic With Subtopics',
        description: 'Parent topic',
        topics: [{ id: 21, order: 1, title: 'Child', description: 'Child description' }]
      }
    ] as any)

    expect(items).toEqual([
      expect.objectContaining({ id: 1, hasSubtopics: false }),
      expect.objectContaining({ id: 2, hasSubtopics: true })
    ])
  })

  it('uses Topic/Subtopic copy and topic-only validation in the touched academy surfaces', () => {
    const sectionSyllabusSource = readFileSync(resolve('app/components/admin/academy/SectionSyllabus.vue'), 'utf8')
    const themeModalSource = readFileSync(resolve('app/components/admin/academy/ThemeModal.vue'), 'utf8')
    const topicModalSource = readFileSync(resolve('app/components/admin/academy/TopicModal.vue'), 'utf8')
    const publishValidationSource = readFileSync(resolve('app/composables/useAcademyPublishValidation.ts'), 'utf8')
    const publicAcademySource = readFileSync(resolve('app/pages/academy/[slug]/index.vue'), 'utf8')

    expect(sectionSyllabusSource).toContain('Add Topic')
    expect(sectionSyllabusSource).toContain('Add Subtopic')
    expect(sectionSyllabusSource).toContain('No topics added yet. Click + Add Topic to get started.')
    expect(themeModalSource).toContain("item ? 'Edit Topic' : 'Add Topic'")
    expect(topicModalSource).toContain("item ? 'Edit Subtopic' : 'Add Subtopic'")
    expect(topicModalSource).toContain('placeholder="Select topic"')
    expect(publishValidationSource).toContain('At least 1 syllabus topic is required')
    expect(publishValidationSource).not.toContain('At least 1 topic is required')
    expect(publicAcademySource).toContain('buildAdaptiveSyllabusItems')
  })

  it('keeps a newly created top-level topic collapsed by default', () => {
    const sectionSyllabusSource = readFileSync(resolve('app/components/admin/academy/SectionSyllabus.vue'), 'utf8')

    expect(sectionSyllabusSource).not.toContain('expandedThemes.add(newThemeId)')
  })
})
