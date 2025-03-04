"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import MovieCard from "./components/MovieCard";
import { Footer } from "./components/Footer";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const toggleSearchVisibility = () => {
    setSearchVisible(!searchVisible);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      const url = searchQuery
        ? `/api/movies?query=${encodeURIComponent(searchQuery)}`
        : `/api/movies`;

      try {
        console.log("Fetching from URL:", url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Received non-JSON response:", text);
          throw new Error("Received non-JSON response from API");
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.results) {
          setMovies(data.results);
        } else {
          throw new Error(data.error || "No results found in API response");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery]);

  return (
    <>
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container-fluid align-items-center">
          <a
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
          </a>

          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-white d-lg-none search-icon"
            onClick={toggleSearchVisibility}
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
          />

          <div
            className={`search-container ${
              searchVisible ? "d-block d-lg-flex m-auto" : "d-none d-lg-flex"
            }`}
            id="navbarSearch"
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search for a movie..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </nav>

      <h2 className="p-3" style={{ display: searchQuery ? "none" : "block" }}>
        Popular Movies
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      <div className="container mt-3">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {movies.length === 0 && !loading && !error ? (
            <p>No movies found. Try a different search!</p>
          ) : (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}