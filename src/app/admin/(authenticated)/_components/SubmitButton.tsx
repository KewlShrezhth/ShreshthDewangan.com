"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingLabel,
  savedLabel = "Saved",
  formAction,
  className,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  savedLabel?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const [justCompleted, setJustCompleted] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      setJustCompleted(true);
      const timer = setTimeout(() => setJustCompleted(false), 1800);
      return () => clearTimeout(timer);
    }
    wasPending.current = pending;
  }, [pending]);

  return (
    <button type="submit" formAction={formAction} disabled={pending} className={className}>
      {pending ? pendingLabel : justCompleted ? `${savedLabel} ✓` : children}
    </button>
  );
}
