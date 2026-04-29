import React from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import type { Toast as ToastType } from "../types/student";

interface Props {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
  error: <XCircle size={16} className="text-red-400    shrink-0" />,
  info: <Info size={16} className="text-blue-400   shrink-0" />,
};

const borders = {
  success: "border-emerald-500/40",
  error: "border-red-500/40",
  info: "border-blue-500/40",
};

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`
          pointer-events-auto flex items-center gap-3 min-w-[280px] max-w-xs
          bg-obsidian-800 border ${borders[t.type]} rounded-xl px-4 py-3
          shadow-2xl shadow-black/60 animate-toast-in
        `}
      >
        {icons[t.type]}
        <p className="flex-1 text-sm text-slate-200 font-body leading-snug">
          {t.message}
        </p>
        <button
          onClick={() => onDismiss(t.id)}
          title="enf"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);
