export interface AIRequest {
  departure: string;
  destination: string;
  people: number;
  days: number;
  time: string;
  money: string;
  transportation?: string;
  travelStyle?: string;
  interests?: string[];
  accommodation?: string;
}

export async function generateTrip(input: AIRequest, token?: string) {
  const res = await fetch(
    "https://aitripsystem-api.onrender.com/api/v1/ai_recs/generate-trip",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Lỗi API: ${res.status} - ${msg}`);
  }

  const data = await res.json();
  return data;
}
