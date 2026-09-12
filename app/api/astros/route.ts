import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://api.open-notify.org/astros.json", { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    throw new Error(String(res.status));
  } catch {
    // fallback
    return NextResponse.json({
      number: 10,
      people: [
        { name: "Oleg Kononenko", craft: "ISS" },
        { name: "Nikolai Chub", craft: "ISS" },
        { name: "Tracy Caldwell Dyson", craft: "ISS" },
        { name: "Matthew Dominick", craft: "ISS" },
        { name: "Michael Barratt", craft: "ISS" },
        { name: "Jeanette Epps", craft: "ISS" },
        { name: "Alexander Grebenkin", craft: "ISS" },
        { name: "Butch Wilmore", craft: "ISS" },
        { name: "Sunita Williams", craft: "ISS" },
        { name: "Li Guangsu", craft: "Tiangong" },
      ],
    });
  }
}
