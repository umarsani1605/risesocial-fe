import type { AcademyTheme, AcademyTopic } from '@/types'

type ThemeLike = Pick<AcademyTheme, 'topics'>

export interface AdaptiveSyllabusItem {
  id: number
  order: number
  title: string
  description: string
  hasSubtopics: boolean
  subtopics: AcademyTopic[]
}

export function themeHasSubtopics(theme?: ThemeLike | null): boolean {
  return (theme?.topics?.length ?? 0) > 0
}

export function buildAdaptiveSyllabusItems(themes: AcademyTheme[]): AdaptiveSyllabusItem[] {
  return themes.map((theme) => ({
    id: theme.id,
    order: theme.order,
    title: theme.title,
    description: theme.description,
    hasSubtopics: themeHasSubtopics(theme),
    subtopics: theme.topics ?? []
  }))
}
