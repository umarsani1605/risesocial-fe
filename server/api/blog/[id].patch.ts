import type { BlogManagementPost } from '~/types'

export default eventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  // In real app, update in database
  const updatedPost: BlogManagementPost = {
    id,
    title: body.title,
    slug: body.slug,
    author: 'Current User',
    status: body.status,
    content: body.content,
    createdAt: new Date().toISOString(), // In real app, keep original
    updatedAt: new Date().toISOString()
  }

  console.log('Updated blog post:', updatedPost)

  return updatedPost
})
