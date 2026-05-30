import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const appConfigSource = readFileSync(
  resolve(import.meta.dirname, '../../app/app.config.ts'),
  'utf8'
)

describe('form field theme', () => {
  it('keeps admin form controls on a white background globally', () => {
    expect(appConfigSource).toContain("input: {")
    expect(appConfigSource).toContain("inputTags: {")
    expect(appConfigSource).toContain("select: {")
    expect(appConfigSource).toContain("selectMenu: {")

    expect(appConfigSource).toContain('!bg-white')
  })
})
