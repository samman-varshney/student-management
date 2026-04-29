import React from 'react'
import { Pencil, Trash2, GraduationCap, ChevronUp, ChevronDown } from 'lucide-react'
import type { Student } from '../types/student'

interface Props {
  students:  Student[]
  onEdit:    (s: Student) => void
  onDelete:  (s: Student) => void
  sortKey:   keyof Student
  sortDir:   'asc' | 'desc'
  onSort:    (key: keyof Student) => void
}

const COLS: { key: keyof Student; label: string; width: string }[] = [
  { key: 'id',     label: '#',      width: 'w-16'   },
  { key: 'name',   label: 'Name',   width: 'flex-1' },
  { key: 'email',  label: 'Email',  width: 'flex-1' },
  { key: 'course', label: 'Course', width: 'w-56'   },
]

const courseColors: Record<string, string> = {
  'Computer Science': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'Data Science':     'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'Mathematics':      'bg-green-500/10 text-green-300 border-green-500/20',
  'Physics':          'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'Chemistry':        'bg-pink-500/10 text-pink-300 border-pink-500/20',
}
const defaultBadge = 'bg-obsidian-600 text-slate-300 border-obsidian-500'

const getBadgeClass = (course: string) =>
  courseColors[course] ?? defaultBadge

// Deterministic avatar color from name
const avatarHue = (name: string) => {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360
  return h
}

export const StudentTable: React.FC<Props> = ({
  students, onEdit, onDelete, sortKey, sortDir, onSort,
}) => {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-obsidian-700 border border-obsidian-600
                        flex items-center justify-center mb-4">
          <GraduationCap size={28} className="text-amber-500" />
        </div>
        <p className="font-display text-base font-600 text-slate-300">No students enrolled yet</p>
        <p className="text-sm text-slate-500 mt-1 font-body">Click "Enroll Student" to add one</p>
      </div>
    )
  }

  const SortIcon = ({ col }: { col: keyof Student }) => {
    if (col !== sortKey) return <ChevronUp size={12} className="text-slate-600" />
    return sortDir === 'asc'
      ? <ChevronUp   size={12} className="text-amber-400" />
      : <ChevronDown size={12} className="text-amber-400" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b border-obsidian-600">
            {COLS.map(col => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                className={`
                  ${col.width} text-left px-4 py-3 cursor-pointer select-none
                  font-display text-[11px] font-600 uppercase tracking-widest
                  text-slate-500 hover:text-slate-300 transition-colors group
                `}
              >
                <span className="flex items-center gap-1.5">
                  {col.label}
                  <SortIcon col={col.key} />
                </span>
              </th>
            ))}
            <th className="w-24 text-right px-4 py-3 font-display text-[11px] font-600
                           uppercase tracking-widest text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {students.map((s, i) => {
            const hue = avatarHue(s.name)
            return (
              <tr key={s.id} className="table-row animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                {/* ID */}
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs text-slate-500">#{s.id}</span>
                </td>

                {/* Name + Avatar */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center
                                 text-xs font-display font-700 shrink-0"
                      style={{
                        background: `hsl(${hue}, 60%, 25%)`,
                        color:      `hsl(${hue}, 80%, 70%)`,
                        border:     `1.5px solid hsl(${hue}, 60%, 35%)`,
                      }}
                    >
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-body text-sm text-slate-200 font-medium">{s.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs text-slate-400">{s.email}</span>
                </td>

                {/* Course badge */}
                <td className="px-4 py-3.5">
                  <span className={`
                    inline-block px-2.5 py-1 rounded-md border text-xs font-body font-medium
                    ${getBadgeClass(s.course)}
                  `}>
                    {s.course}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(s)}
                      title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10
                                 transition-all duration-150"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      title="Delete"
                      className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-slate-500 hover:text-red-400 hover:bg-red-500/10
                                 transition-all duration-150"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
