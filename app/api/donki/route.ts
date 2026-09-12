import { NextRequest, NextResponse } from "next/server";
import { getNasaKey } from "@/lib/env";

// NASA DONKI — Space Weather Database (CME, GST, IPS, FLR, SEP, MPC, RBE, HSS, WSA)
// Docs: https://api.nasa.gov/#donki  + https://ccmc.gsfc.nasa.gov/donki/
const DONKI_BASE = "https://api.nasa.gov/DONKI";

const KINDS: Record<string, string> = {
  cme: "CME",
  gst: "GST",
  ips: "IPS",
  flr: "FLR",
  sep: "SEP",
  mpc: "MPC",
  rbe: "RBE",
  hss: "HSS",
  wsa: "WSAEnlilSimulations",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kindRaw = (searchParams.get("kind") || "cme").toLowerCase();
  const kind = KINDS[kindRaw] || "CME";
  const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const endDate = searchParams.get("endDate") || new Date().toISOString().slice(0, 10);
  const apiKey = getNasaKey();

  const url = `${DONKI_BASE}/${kind}?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ error: "Rate limited (DEMO_KEY). Add a NASA_API_KEY to raise the quota.", demo: true }, { status: 429 });
      }
      const txt = await res.text();
      return NextResponse.json({ error: `DONKI ${res.status}: ${txt.slice(0, 400)}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ kind: kindRaw, kindResolved: kind, startDate, endDate, count: Array.isArray(data) ? data.length : 0, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DONKI error" }, { status: 500 });
  }
}
