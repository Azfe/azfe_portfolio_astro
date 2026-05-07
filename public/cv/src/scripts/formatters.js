export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(start, end, isCurrent) {
  const startFmt = formatDate(start);
  if (isCurrent || !end) return `${startFmt} — presente`;
  return `${startFmt} — ${formatDate(end)}`;
}

export function formatDuration(months) {
  if (months <= 0) return "menos de 1 mes";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const y = years > 0 ? `${years} ${years === 1 ? "año" : "años"}` : "";
  const m = rem > 0 ? `${rem} ${rem === 1 ? "mes" : "meses"}` : "";
  return [y, m].filter(Boolean).join(" ");
}
