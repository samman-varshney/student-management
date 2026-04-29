import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { Student } from "../types/student";

interface Props {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const ConfirmModal: React.FC<Props> = ({
  open,
  student,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleConfirm = async () => {
    if (!student) return;
    setDeleting(true);
    try {
      await onConfirm(student.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  if (!open || !student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      <div
        className="relative z-10 w-full max-w-sm bg-obsidian-800 border border-obsidian-600
                      rounded-xl shadow-2xl animate-scale-in overflow-hidden"
      >
        {/* Red accent bar */}
        <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20
                            flex items-center justify-center"
            >
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <button
              onClick={onClose}
              title="Close modal"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500
                         hover:text-slate-200 hover:bg-obsidian-600 transition-all"
            >
              <X size={15} />
            </button>
          </div>

          <h2 className="font-display text-base font-700 text-slate-100 mb-1">
            Delete Student
          </h2>
          <p className="text-sm text-slate-400 font-body leading-relaxed">
            This will permanently remove{" "}
            <span className="text-slate-200 font-semibold">{student.name}</span>{" "}
            from the system. This action cannot be undone.
          </p>

          <div className="mt-5 p-3 rounded-lg bg-obsidian-700 border border-obsidian-600 text-xs font-mono text-slate-400">
            <span className="text-amber-500">id:</span> {student.id}{" "}
            &nbsp;|&nbsp;
            <span className="text-amber-500">email:</span> {student.email}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 justify-center"
            >
              Keep
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                         bg-red-500 hover:bg-red-400 text-white font-body font-semibold text-sm
                         transition-all duration-200 disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
