import axios from 'axios'
import type { Student, StudentPayload, ApiResponse } from '../types/student'

/** Base URL — Vite proxy forwards /students → http://localhost:8080/students */
const BASE = '/students'

const http = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

/** Unwrap the ApiResponse envelope and return just the data. */
const unwrap = <T>(res: { data: ApiResponse<T> }): T => res.data.data

// ── CRUD helpers ─────────────────────────────────────────────────────────────

/** Fetch all students. */
export const getStudents = (): Promise<Student[]> =>
  http.get<ApiResponse<Student[]>>(BASE).then(unwrap)

/** Fetch a single student by id. */
export const getStudent = (id: number): Promise<Student> =>
  http.get<ApiResponse<Student>>(`${BASE}/${id}`).then(unwrap)

/** Create a new student. */
export const createStudent = (payload: StudentPayload): Promise<Student> =>
  http.post<ApiResponse<Student>>(BASE, payload).then(unwrap)

/** Update an existing student. */
export const updateStudent = (id: number, payload: StudentPayload): Promise<Student> =>
  http.put<ApiResponse<Student>>(`${BASE}/${id}`, payload).then(unwrap)

/** Delete a student by id. */
export const deleteStudent = (id: number): Promise<void> =>
  http.delete(`${BASE}/${id}`).then(() => undefined)
