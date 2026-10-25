import { useEffect, type RefObject } from "react";

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

// Moves focus into a modal on open, keeps Tab inside it, and restores focus to the opener on close.
export function useModalFocus(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  initialRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open) return;
    const saved = document.activeElement as HTMLElement | null;
    initialRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (!dialogRef.current?.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (saved?.isConnected) saved.focus();
    };
  }, [open, dialogRef, initialRef]);
}
