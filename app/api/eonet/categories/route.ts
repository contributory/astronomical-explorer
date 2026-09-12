import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://eonet.gsfc.nasa.gov/api/v3/categories", { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message, categories: [] }, { status: 500 });
  }
}
