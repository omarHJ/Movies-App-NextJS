// app/api/movies/route.ts
import { NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY;
const API_URL_POPULAR = process.env.API_URL_POPULAR;
const API_URL_SEARCH = process.env.API_URL_SEARCH;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!API_KEY || !API_URL_POPULAR || !API_URL_SEARCH) {
    return NextResponse.json(
      { error: 'Missing required environment variables' },
      { status: 500 }
    );
  }

  const apiUrl = query
    ? `${API_URL_SEARCH}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    : `${API_URL_POPULAR}?api_key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}