import React, { useEffect, useState } from "react";
import { X, User, Mail, BookOpen, Loader2 } from "lucide-react";
import type { Student, StudentPayload } from "../types/student";

interface Props {
  open: boolean;
  student?: Student | null; // null = create mode, defined = edit mode
  onClose: () => void;
  onSubmit: (payload: StudentPayload) => Promise<void>;
}

const EMPTY: StudentPayload = { name: "", email: "", course: "" };

export const StudentModal: React.FC<Props> = ({
  open,
  student,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<StudentPayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<StudentPayload>>({});

  const isEdit = Boolean(student);

  // Sync form when modal opens / student changes
  useEffect(() => {
    if (open) {
      setForm(
        student
          ? { name: student.name, email: student.email, course: student.course }
          : EMPTY,
      );
      setErrors({});
    }
  }, [open, student]);

  // Trap Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validate = (): boolean => {
    const errs: Partial<StudentPayload> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email.";
    if (!form.course.trim()) errs.course = "Course is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Something went wrong.";
      setErrors({ email: msg });
    } finally {
      setSaving(false);
    }
  };

  const field = (
    id: keyof StudentPayload,
    label: string,
    icon: React.ReactNode,
    type = "text",
    placeholder = "",
  ) => (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-display font-600 uppercase tracking-widest text-slate-400"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={(e) => {
            setForm((p) => ({ ...p, [id]: e.target.value }));
            setErrors((p) => ({ ...p, [id]: undefined }));
          }}
          placeholder={placeholder}
          className="input-field pl-10"
          autoComplete="off"
        />
      </div>
      {errors[id] && (
        <p className="text-xs text-red-400 mt-0.5">{errors[id]}</p>
      )}
    </div>
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Amber accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-t-xl" />

        <div className="bg-obsidian-800 border border-obsidian-600 border-t-0 rounded-b-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-obsidian-600">
            <div>
              <h2 className="font-display text-lg font-700 text-slate-100">
                {isEdit ? "Edit Student" : "Enroll Student"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-body">
                {isEdit
                  ? `Updating record #${student!.id}`
                  : "Add a new student to the system"}
              </p>
            </div>
            <button
              onClick={onClose}
              title="close"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500
                         hover:text-slate-200 hover:bg-obsidian-600 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-5 flex flex-col gap-4"
          >
            {field(
              "name",
              "Full Name",
              <User size={14} />,
              "text",
              "e.g. Alice Johnson",
            )}
            {field(
              "email",
              "Email",
              <Mail size={14} />,
              "email",
              "e.g. alice@example.com",
            )}
            {field(
              "course",
              "Course",
              <BookOpen size={14} />,
              "text",
              "e.g. Computer Science",
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 justify-center"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving…
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Enroll Student"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
