import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('dashboard academy page tabs source', () => {
  it('uses the all-open state to switch the expand all button label', () => {
    const tabsSource = readFileSync(resolve('app/components/dashboard/academy/TabModules.vue'), 'utf8')
    const pageSource = readFileSync(resolve('app/pages/dashboard/academy/[id].vue'), 'utf8')

    expect(tabsSource).toContain('const isAllOpen = computed(')
    expect(tabsSource).toContain('if (isAllOpen.value) {')
    expect(tabsSource).toContain('isAllOpen: () => isAllOpen.value')

    expect(pageSource).toContain('isAllOpen: () => boolean')
    expect(pageSource).toContain('const isModulesAllOpen = computed(() => tabModulesRef.value?.isAllOpen() ?? false)')
    expect(pageSource).toContain(":label=\"isModulesAllOpen ? 'Collapse All' : 'Expand All'\"")
  })
})
