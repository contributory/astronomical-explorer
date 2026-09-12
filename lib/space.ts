// Shared planet config + solar system calculation (replaces astropy with JS approximation)
export const PLANET_COLORS: Record<string, string> = {
  Sun: "#FFD700",
  Mercury: "#B5A8A6",
  Venus: "#E3BB76",
  Earth: "#2B82C5",
  Mars: "#E27B58",
  Jupiter: "#C88B3A",
  Saturn: "#E4D191",
  Uranus: "#65C2D0",
  Neptune: "#4B70DD",
};

export const ORBIT_DISTANCES: Record<string, number> = {
  Mercury: 0.387,
  Venus: 0.723,
  Earth: 1.0,
  Mars: 1.524,
  Jupiter: 5.204,
  Saturn: 9.582,
  Uranus: 19.201,
  Neptune: 30.047,
};

export type PlanetPos = {
  name: string;
  planet: string;
  x: number; y: number; z: number;
  size: number; color: string; distance: number;
};

export function calculatePlanetPositions(dateStr: string): PlanetPos[] {
  const t = new Date(dateStr);
  const jd = t.getTime() / 86400000 + 2440587.5; // approx JD
  const positions: PlanetPos[] = [
    { name: "Sun", planet: "Sun", x: 0, y: 0, z: 0, size: 22, color: PLANET_COLORS["Sun"], distance: 0 },
  ];
  let idx = 0;
  for (const [p, r] of Object.entries(ORBIT_DISTANCES)) {
    const period = Math.pow(r, 1.5); // years
    const anomaly = (jd / (365.25 * period)) * 2 * Math.PI;
    const x = Number((r * Math.cos(anomaly)).toFixed(3));
    const y = Number((r * Math.sin(anomaly)).toFixed(3));
    const z = Number((0.05 * r * Math.sin(anomaly * 2)).toFixed(3));
    positions.push({
      name: p, planet: p, x, y, z,
      size: Math.max(7, Math.round(15 / Math.pow(idx + 1, 0.28))),
      color: PLANET_COLORS[p] ?? "#FFFFFF",
      distance: r,
    });
    idx++;
  }
  return positions;
}
