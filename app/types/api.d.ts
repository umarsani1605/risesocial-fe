interface ApiResponse<T = unknown> {
  success: true
  message: string
  data: T
}

interface PaginatedResponse<T = unknown> {
  success: true
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface ApiError {
  success: false
  message: string
  statusCode: number
  code?: string
}
