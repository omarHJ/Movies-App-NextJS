"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilm, 
  faMagnifyingGlass, 
  faChevronLeft, 
  faChevronRight 
} from "@fortawesome/free-solid-svg-icons";
import { Footer } from "./components/Footer";
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const toggleSearchVisibility = () => {
    setSearchVisible(!searchVisible);
  };
  
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
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
          // Set the first movie as the featured movie if there's no featured movie yet
          if (!featuredMovie && data.results.length > 0) {
            setFeaturedMovie(data.results[0]);
          }
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
      <div className="movie-app">
        {featuredMovie && (
          <div className="featured-movie">
            <div 
              className="backdrop-image" 
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
              }}
            >
              <div className="navbar-container">
                <nav className="navbar navbar-expand-lg navbar-dark">
                  <div className="container-fluid align-items-center">
                    <a
                      className="navbar-brand text-white"
                      style={{
                        fontWeight: "700",
                        fontSize: "2.25rem",
                        top:"0",
                        left:"0", 
                        display:"absolute",
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
                      style={{ backgroundColor: "transparent" }}
                    >
                      <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Search for a movie..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white" }}
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
              </div>
              <div className="featured-content-wrapper">
                <div className="container featured-content">
                  <h1 className="movie-title">{featuredMovie.title}</h1>
                  <p className="movie-overview">{featuredMovie.overview?.substring(0, 150)}...</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(featuredMovie.vote_average / 2) ? "star active" : "star"}>★</span>
                    ))}
                    <span className="vote-count">{featuredMovie.vote_average.toFixed(1)}</span>
                  </div>
                  <Link
                    href={`movie/${featuredMovie.id}`}
                    className="btn explore-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="slider-section">          
          <div className="container">
            <div className="slider-container">
              <button className="slider-arrow left" onClick={scrollLeft}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              
              <div className="movie-slider" ref={sliderRef}>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-danger">Error: {error}</p>
                ) : movies.length === 0 ? (
                  <p>No movies found. Try a different search!</p>
                ) : (
                  movies.map((movie) => (
                    <div 
                      key={movie.id} 
                      className="movie-slide"
                      onMouseEnter={() => setFeaturedMovie(movie)}
                    >
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <h5 className="movie-title-small">{movie.title}</h5>
                    </div>
                  ))
                )}
              </div>
              
              <button className="slider-arrow right" onClick={scrollRight}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        body {
          background-color: #000;
          color: white;
          margin: 0;
          padding: 0;
        }

        .navbar-container {
          display: absolute;
        }
        
        .navbar {
          background-color: transparent !important;
          width: 100%;
          padding-bottom: 2rem;
        }
        
        .featured-movie {
          width: 100%;
          height: 85vh;
          position: relative;
          margin-bottom: -120px; /* Creates overlap with slider */
        }
        
        .backdrop-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }
        
        .featured-content-wrapper {
          flex: 1;
          display: flex;
          align-items: flex-end;
          padding-bottom: 200px;
        }
        
        .featured-content {
          padding: 0 3rem;
        }
        
        .movie-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }
        
        .movie-overview {
          max-width: 50%;
          margin-bottom: 2rem;
          color: white;
          font-size: 1.1rem;
        }
        
        .rating {
          margin-bottom: 2rem;
        }
        
        .star {
          color: #777;
          font-size: 1.2rem;
        }
        
        .star.active {
          color: #F7931A;
        }
        
        .vote-count {
          margin-left: 10px;
          color: #ccc;
        }
        
        .explore-btn {
          background-color: #F7931A;
          color: white;
          padding: 0.5rem 2rem;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .slider-section {
          margin-top: 3.5rem;
          position: relative;
          z-index: 2;
        }

        .slider-container {
          position: relative;
          padding: 40px 50px 30px;
          margin-bottom: 3rem;
          background-color: rgba(0, 0, 0, 0.8);
          border-radius: 16px 16px 0 0;
        }
        
        .movie-slider {
          display: flex;
          overflow-x: scroll;
          scroll-behavior: smooth;
          -ms-overflow-style: none;
          scrollbar-width: none;
          gap: 15px;
          padding: 10px 0;
        }
        
        .movie-slider::-webkit-scrollbar {
          display: none;
        }
        
        .movie-slide {
          min-width: 180px;
          cursor: pointer;
          transition: transform 0.3s;
        }
        
        .movie-slide:hover {
          transform: scale(1.05);
        }
        
        .movie-poster {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .movie-title-small {
          font-size: 0.9rem;
          margin-top: 8px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(0,0,0,0.7);
          border: 1px solid #F7931A;
          color: #F7931A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }
        
        .slider-arrow.left {
          left: 5px;
        }
        
        .slider-arrow.right {
          right: 5px;
        }
      `}</style>
    </>
  );
}