import { useEffect } from "react";

interface KeyboardShortcuts {
  onSearchToggle?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onSearchToggle, onEscape }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onSearchToggle?.();
      }
      
      // Escape key
      if (event.key === 'Escape') {
        onEscape?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearchToggle, onEscape]);
}