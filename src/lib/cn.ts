type ClassValue = string | false | null | undefined;

/** Minimal class joiner — the prototype has no conditional-class conflicts to resolve. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
