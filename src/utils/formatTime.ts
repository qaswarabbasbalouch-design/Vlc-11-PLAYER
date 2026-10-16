export function formatTime(seconds: number, forceHours = true): string {
  if (isNaN(seconds) || seconds < 0) {
    return forceHours ? '00:00:00' : '00:00';
  }

  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0 || forceHours) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatTimeRemaining(current: number, total: number): string {
  if (isNaN(total) || total <= 0) return '-00:00:00';
  const remaining = Math.max(0, total - current);
  return `-${formatTime(remaining, true)}`;
}
