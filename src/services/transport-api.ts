// 瑞士公交 API — transport.opendata.ch
interface LocationResult {
  id: string;
  name: string;
  score?: number;
  coordinate: {
    type: string;
    x: number;
    y: number;
  };
}

interface Connection {
  from: {
    station: { id: string; name: string };
    departure: string;
    platform?: string;
  };
  to: {
    station: { id: string; name: string };
    arrival: string;
    platform?: string;
  };
  duration: string;
  transfers: number;
  products: string[];
}

const BASE_URL = 'https://transport.opendata.ch/v1';

export async function searchLocations(query: string): Promise<LocationResult[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/locations?query=${encodeURIComponent(query)}&type=station`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.stations || [];
  } catch {
    return [];
  }
}

export async function searchConnections(
  from: string,
  to: string
): Promise<Connection[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/connections?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&limit=3`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.connections || [];
  } catch {
    return [];
  }
}

// 瑞士主要火车站位置列表（用于快速搜索）
export const MAJOR_STATIONS = [
  'Zürich HB',
  'Bern',
  'Basel SBB',
  'Luzern',
  'Lausanne',
  'Genève',
  'Winterthur',
  'St. Gallen',
  'Lugano',
  'Interlaken Ost',
  'Zermatt',
  'Chur',
];
