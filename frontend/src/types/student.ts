/** Mirrors the Spring Boot Student entity. */
export interface Student {
  id:     number
  name:   string
  email:  string
  course: string
}

/** Payload used for create / update requests (no id). */
export type StudentPayload = Omit<Student, 'id'>

/** Shape of the ApiResponse<T> envelope returned by Spring Boot. */
export interface ApiResponse<T> {
  status:    number
  message:   string
  data:      T
  timestamp: string
}

/** Toast notification variants. */
export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id:      string
  type:    ToastType
  message: string
}
