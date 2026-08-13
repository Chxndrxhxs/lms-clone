import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 border border-neutral-200 bg-white px-4 py-3 shadow-2xl">
      <div className="flex h-6 w-6 items-center justify-center bg-green-50 text-green-600">
        <Check size={14} />
      </div>
      <p className="text-sm font-medium text-neutral-900">{message}</p>
    </div>
  );
}
