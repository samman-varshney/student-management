import React, { useMemo, useState } from 'react'
import {
  GraduationCap, Plus, Search, RefreshCw, Loader2,
  Users, BookOpen, TrendingUp,
} from 'lucide-react'
import { useStudents }    from './hooks/useStudents'
import { StudentTable }   from './components/StudentTable'
import { StudentModal }   from './components/StudentModal'
import { ConfirmModal }   from './components/ConfirmModal'
import { ToastContainer } from './components/Toast'
import type { Student, StudentPayload } from './types/student'

type SortKey = keyof Student
type SortDir = 'asc' | 'desc'

export default function App() {
  const { students, loading, toasts, addStudent, editStudent, removeStudent, dismissToast, refresh } = useStudents()

  // ── Modal state ───────────────────────────────────────────────────────────
  const [formOpen,    setFormOpen]    = useState(false)
  const [editTarget,  setEditTarget]  = useState<Student | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)

  // ── Search & Sort ─────────────────────────────────────────────────────────
  const [query,   setQuery]   = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return students
      .filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const av = String(a[sortKey]).toLowerCase()
        const bv = String(b[sortKey]).toLowerCase()
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [students, query, sortKey, sortDir])

  // ── Stats ─────────────────────────────────────────────────────────────────
  const uniqueCourses = useMemo(() =>
    new Set(students.map(s => s.course)).size,
  [students])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => { setEditTarget(null); setFormOpen(true) }
  const openEdit   = (s: Student) => { setEditTarget(s); setFormOpen(true) }

  const handleSubmit = async (payload: StudentPayload) => {
    if (editTarget) await editStudent(editTarget.id, payload)
    else            await addStudent(payload)
  }

  return (
    <div className="noise-bg min-h-screen bg-obsidian-950 font-body relative">
      {/* ── Ambient glow ───────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2
                      w-[600px] h-[300px] opacity-20 blur-3xl rounded-full z-0"
           style={{ background: 'radial-gradient(ellipse at center, #f59e0b 0%, transparent 70%)' }}
      />

      {/* ── Layout wrapper ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30
                              flex items-center justify-center animate-pulse-amber">
                <GraduationCap size={20} className="text-amber-400" />
              </div>
              <span className="font-display text-xs font-600 uppercase tracking-[0.2em]
                               text-amber-500">
                Student Management
              </span>
            </div>
            <h1 className="font-display text-3xl font-800 text-slate-100 leading-tight">
              Student Registry
            </h1>
            <p className="text-sm text-slate-500 font-body mt-1">
              Manage enrolled students · Spring Boot + PostgreSQL
            </p>
          </div>

          {/* CTA */}
          <button onClick={openCreate} className="btn-primary shrink-0">
            <Plus size={16} />
            Enroll Student
          </button>
        </header>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Users      size={18} className="text-amber-400"   />, label: 'Total Students', value: students.length,  color: 'amber'   },
            { icon: <BookOpen   size={18} className="text-blue-400"    />, label: 'Courses',        value: uniqueCourses,    color: 'blue'     },
            { icon: <TrendingUp size={18} className="text-emerald-400" />, label: 'Search Results', value: filtered.length,  color: 'emerald' },
          ].map(card => (
            <div
              key={card.label}
              className="bg-obsidian-800 border border-obsidian-600 rounded-xl p-4
                         flex items-center gap-4 hover:border-obsidian-500 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                              bg-${card.color}-500/10 border border-${card.color}-500/20 shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="font-display text-2xl font-700 text-slate-100 leading-none">
                  {loading ? '—' : card.value}
                </p>
                <p className="text-xs text-slate-500 font-body mt-0.5">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main card ───────────────────────────────────────────────────── */}
        <div className="bg-obsidian-800 border border-obsidian-600 rounded-2xl
                        shadow-2xl shadow-black/40 overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3
                          px-5 py-4 border-b border-obsidian-600">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, email or course…"
                className="input-field pl-9 py-2 text-sm w-full"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={loading}
              title="Refresh"
              className="btn-ghost shrink-0 px-3 py-2"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Table / Loader */}
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
              <Loader2 size={20} className="animate-spin text-amber-500" />
              <span className="text-sm font-body">Loading students…</span>
            </div>
          ) : (
            <StudentTable
              students={filtered}
              onEdit={openEdit}
              onDelete={s => setDeleteTarget(s)}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          )}

          {/* Footer row count */}
          {!loading && (
            <div className="px-5 py-3 border-t border-obsidian-600 flex items-center justify-between">
              <p className="text-xs text-slate-600 font-body font-mono">
                {filtered.length} of {students.length} record{students.length !== 1 ? 's' : ''}
                {query && <span className="text-amber-600"> · filtered</span>}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-slate-500 hover:text-amber-400 transition-colors font-body"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-700 font-body">
            Spring Boot · JDBC · PostgreSQL · React · TypeScript · Tailwind CSS
          </p>
        </footer>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <StudentModal
        open={formOpen}
        student={editTarget}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        open={!!deleteTarget}
        student={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={removeStudent}
      />

      {/* ── Toasts ──────────────────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
