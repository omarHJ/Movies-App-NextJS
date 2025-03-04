import { NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY;
const API_URL_MOVIE = 'https://api.themoviedb.org/3/movie';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Change to Promise
) {
  // Resolve the params promise
  const params = await context.params;

  if (!API_KEY) {
    console.error('API Route: Missing API key');
    return NextResponse.json(
      { error: 'Missing API key' },
      { status: 500 }
    );
  }

  if (!params.id) {
    console.error('API Route: Missing movie ID');
    return NextResponse.json(
      { error: 'Missing movie ID' },
      { status: 400 }
    );
  }

  const movieId = params.id;
  const apiUrl = `${API_URL_MOVIE}/${movieId}?api_key=${API_KEY}&append_to_response=credits`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Movie not found in TMDB' },
          { status: 404 }
        );
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}