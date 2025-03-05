// app/movie/[id]/page.tsx
'use client';

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faFilm } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from 'next/image';
import { Footer } from "@/app/components/Footer";

interface Genre {
  id: number;
  name: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: Genre[];
  runtime: number;
  production_countries: ProductionCountry[];
  original_language: string;
  tagline: string; 
  budget: number;
  revenue: number;
  status: string;
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

const languageMap: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  zh: "Chinese",
  ko: "Korean",
  ar: "Arabic",
  hi: "Hindi",
};

export default function MovieDetail() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("No movie ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching movie details for ID:", id);
        console.log("Requesting URL:", `/api/movies/${id}`);
        
        const response = await fetch(`/api/movies/${id}`);
        
        console.log("Response status:", response.status);
        console.log("Response URL:", response.url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Movie not found (404)");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Received non-JSON response:", text);
          throw new Error("Received non-JSON response from API");
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (data.error) {
          throw new Error(data.error);
        }
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <p>Loading movie details...</p>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Movie not found!
        </div>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const languageName = languageMap[movie.original_language] || movie.original_language;
  const countries = movie.production_countries
    .map((country) => country.name)
    .join(", ");
  const mainStars = movie.credits.cast.slice(0, 5);
  const director = movie.credits.crew.find(
    (person) => person.job === "Director"
  );

  return (
    <div className="movie-detail-page">
      {/* Backdrop Image */}
      {movie && movie.backdrop_path && (
        <div className="backdrop-wrapper">
          <div 
            className="backdrop-image"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1
            }}
          />
        </div>
      )}

      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              className="navbar-brand text-white"
              style={{
                fontWeight: "700",
                fontSize: "2.25rem",
              }}
            >
              <FontAwesomeIcon
                icon={faFilm}
                style={{
                  color: "#F7931A",
                  fontSize: "2.25rem",
                  padding: "0px 5px",
                }}
              />
              Movies App
            </span>
          </Link>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row movie-content">
          <div className="col-md-4">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={400}
              height={650}
              className="img-fluid rounded shadow"
              priority={true}
            />
          </div>
          <div className="col-md-8">
            <div className="movie-details custom-dark bg-opacity-75 p-4 rounded">
              <h1 className="text-white">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-light fst-italic mb-3">{movie.tagline}</p>
              )}
              <div className="badge bg-warning me-2 mb-2">
                  {movie.vote_average.toFixed(1)}
                  <FontAwesomeIcon
                    className="ms-1"
                    icon={faStar}
                  />
              </div>
              <div className="text-light">{movie.release_date} • {movie.runtime} min</div>
        
              <br />
              <p className="text-light">{movie.overview}</p>
              
                <div className="mb-3">
                <strong className="text-light">Genres:</strong>{" "}
                <span className="text-light">{movie.genres.map((genre) => genre.name).join(", ")}</span>
                </div>

                <div className="mb-3">
                <strong className="text-light">Language:</strong>{" "}
                <span className="text-light">{languageName}</span>
                </div>
              
              <div className="mb-3">
                <strong className="text-light">Production Countries:</strong>{" "}
                <span className="text-light">{countries || "N/A"}</span>
              </div>
              
              <div className="mb-3">
                <strong className="text-light">Director:</strong>{" "}
                <span className="text-light">{director ? director.name : "N/A"}</span>
              </div>
              
              <div>
                <strong className="text-light">Main Stars:</strong>{" "}
                <span className="text-light">
                  {mainStars.length > 0
                    ? mainStars.map((star) => star.name).join(", ")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}