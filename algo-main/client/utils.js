// utils/dateFormatter.js
export function formatKiteDate(date) {
  // Ensure input is a Date object
  if (!(date instanceof Date)) throw new Error("Input must be a Date object");

  // Get individual components
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  // Return format: "YYYY-MM-DD+HH:mm:ss" (+ instead of space)
  return `${yyyy}-${mm}-${dd}+${hh}:${min}:${ss}`;
}