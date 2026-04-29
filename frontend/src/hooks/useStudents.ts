import { useState, useEffect, useCallback } from 'react'
import type { Student, StudentPayload, Toast } from '../types/student'
import * as svc from '../services/studentService'

/** Generates a short unique id for toast notifications. */
const uid = () => Math.random().toString(36).slice(2, 9)

export function useStudents() {
  const [students,  setStudents]  = useState<Student[]>([])
  const [loading,   setLoading]   = useState(true)
  const [toasts,    setToasts]    = useState<Toast[]>([])

  // ── Toast helpers ─────────────────────────────────────────────────────────

  const pushToast = useCallback((type: Toast['type'], message: string) => {
    const id = uid()
    setToasts(prev => [...prev, { id, type, message }])
    // Auto-dismiss after 3.5 s
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Fetch all ─────────────────────────────────────────────────────────────

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      const data = await svc.getStudents()
      setStudents(data)
    } catch {
      pushToast('error', 'Failed to load students. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [pushToast])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  // ── Create ────────────────────────────────────────────────────────────────

  const addStudent = useCallback(async (payload: StudentPayload) => {
    const created = await svc.createStudent(payload)
    setStudents(prev => [...prev, created])
    pushToast('success', `${created.name} enrolled successfully.`)
    return created
  }, [pushToast])

  // ── Update ────────────────────────────────────────────────────────────────

  const editStudent = useCallback(async (id: number, payload: StudentPayload) => {
    const updated = await svc.updateStudent(id, payload)
    setStudents(prev => prev.map(s => s.id === id ? updated : s))
    pushToast('success', `${updated.name}'s record updated.`)
    return updated
  }, [pushToast])

  // ── Delete ────────────────────────────────────────────────────────────────

  const removeStudent = useCallback(async (id: number) => {
    const target = students.find(s => s.id === id)
    await svc.deleteStudent(id)
    setStudents(prev => prev.filter(s => s.id !== id))
    pushToast('success', `${target?.name ?? 'Student'} removed.`)
  }, [students, pushToast])

  return {
    students,
    loading,
    toasts,
    addStudent,
    editStudent,
    removeStudent,
    dismissToast,
    refresh: fetchStudents,
  }
}
