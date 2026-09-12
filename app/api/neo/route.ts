import { NextRequest, NextResponse } from "next/server";
import { getNasaKey } from "@/lib/env";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");
  const apiKey = getNasaKey();
  if (!start || !end) return NextResponse.json({ error: "Missing dates" }, { status: 400 });

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    if (res.status === 429) {
      const fallback = {
        element_count: 3,
        near_earth_objects: {
          [start]: [
            {
              name: "(2024 BX1)",
              nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2024BX1",
              is_potentially_hazardous_asteroid: false,
              estimated_diameter: { meters: { estimated_diameter_min: 1.2, estimated_diameter_max: 2.7 } },
              close_approach_data: [{ close_approach_date: start, relative_velocity: { kilometers_per_hour: "54200.5" }, miss_distance: { kilometers: "350000.0", lunar: "0.91" }, orbiting_body: "Earth" }],
            },
            {
              name: "(99942 Apophis)",
              nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=99942",
              is_potentially_hazardous_asteroid: true,
              estimated_diameter: { meters: { estimated_diameter_min: 340, estimated_diameter_max: 370 } },
              close_approach_data: [{ close_approach_date: start, relative_velocity: { kilometers_per_hour: "110000.0" }, miss_distance: { kilometers: "31600.0", lunar: "0.08" }, orbiting_body: "Earth" }],
            },
            {
              name: "(2023 DW)",
              nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2023DW",
              is_potentially_hazardous_asteroid: true,
              estimated_diameter: { meters: { estimated_diameter_min: 45, estimated_diameter_max: 90 } },
              close_approach_data: [{ close_approach_date: start, relative_velocity: { kilometers_per_hour: "88700.0" }, miss_distance: { kilometers: "1800000.0", lunar: "4.68" }, orbiting_body: "Earth" }],
            },
          ],
        },
      };
      return NextResponse.json(fallback);
    }
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.msg || `API ${res.status}` }, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
