import type { BlogManagementPost } from '~/types'

export default eventHandler(async (event) => {
  const body = await readBody(event)

  // Generate new ID (in real app, this would be from database)
  const newId = Math.floor(Math.random() * 10000)

  const newPost: BlogManagementPost = {
    id: newId,
    title: body.title,
    slug: body.slug,
    author: 'Current User', // In real app, get from auth
    status: body.status || 'draft',
    content: body.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return newPost
})
