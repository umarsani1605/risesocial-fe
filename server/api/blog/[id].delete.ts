export default eventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  // In real app, delete from database
  console.log('Deleted blog post with id:', id)

  return {
    success: true
  }
})
