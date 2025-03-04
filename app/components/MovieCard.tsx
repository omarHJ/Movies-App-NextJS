// app/components/MovieCard.tsx
// First, let's create a separate MovieCard component for better organization
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="col">
      <div className="card h-100 m-2">
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={500}
        height={750}
        className="img-fluid"
        priority={true} // Since this is the main image on the detail page
      />
        <div className="card-body">
          <h5 className="card-title">{movie.title}</h5>
          <Link
            href={`/movie/${movie.id}`}
            className="btn btn-warning float-end mt-4"
          >
            View Details
          </Link>
        </div>
        <div className="card-footer text-muted fw-bold">
          <span>{movie.release_date.slice(0, 4)}</span>
          <span className="float-end">
            {movie.vote_average.toFixed(1)}
            <FontAwesomeIcon
              className="ms-1"
              icon={faStar}
              style={{ color: "#F7931A" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;