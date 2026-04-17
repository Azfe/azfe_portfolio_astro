export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(start: string, end: string | null, isCurrent: boolean): string {
  const startFmt = formatDate(start);
  if (isCurrent || !end) return `${startFmt} — presente`;
  return `${startFmt} — ${formatDate(end)}`;
}
