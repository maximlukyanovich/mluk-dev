/** A position as the page prints it: `1` → "01". */
export const twoDigits = (n: number) => String(n).padStart(2, "0");
