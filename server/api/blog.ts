import type { BlogManagementPost } from '~/types'

// Mock blog posts data
const blogPosts: BlogManagementPost[] = [{
  id: 1,
  title: 'Getting Started with Nuxt 4',
  slug: 'getting-started-with-nuxt-4',
  author: 'John Doe',
  status: 'published',
  content: '# Getting Started with Nuxt 4\n\nNuxt 4 brings exciting new features...',
  createdAt: new Date('2024-01-15').toISOString(),
  updatedAt: new Date('2024-01-15').toISOString()
}, {
  id: 2,
  title: 'Building Modern UIs with Nuxt UI',
  slug: 'building-modern-uis-with-nuxt-ui',
  author: 'Jane Smith',
  status: 'published',
  content: '# Building Modern UIs\n\nNuxt UI provides beautiful components...',
  createdAt: new Date('2024-01-20').toISOString(),
  updatedAt: new Date('2024-01-20').toISOString()
}, {
  id: 3,
  title: 'Advanced TypeScript Tips',
  slug: 'advanced-typescript-tips',
  author: 'John Doe',
  status: 'draft',
  content: '# TypeScript Tips\n\nHere are some advanced TypeScript techniques...',
  createdAt: new Date('2024-01-25').toISOString(),
  updatedAt: new Date('2024-01-25').toISOString()
}]

export default eventHandler(async () => {
  return blogPosts
})
