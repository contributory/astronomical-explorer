// Server-only helper — do not import into client components
export function getNasaKey(): string {
  const k = process.env.NASA_API_KEY?.trim();
  return k && k.length > 0 ? k : "DEMO_KEY";
}

export function isDemoKey(k: string) {
  return !k || k === "DEMO_KEY";
}
