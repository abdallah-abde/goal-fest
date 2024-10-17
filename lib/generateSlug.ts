export function generateSlug(baseName: string): string {
  const randomNumber = Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000

  return `${baseName}-${randomNumber}`;
}
