import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  SectionHeader,
  MovieCard,
  InputField,
  SelectDropdown,
  PrimaryButton,
} from '../components';
import { movies } from '../utils/movieData';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  const genreOptions = [
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'horror', label: 'Horror' },
    { value: 'scifi', label: 'Sci-Fi' },
    { value: 'thriller', label: 'Thriller' },
  ];

  const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
  ];

  // Filter movies based on search criteria
  const searchResults = useMemo(() => {
    let filtered = movies;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (genre) {
      filtered = filtered.filter((movie) =>
        movie.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    // Filter by year
    if (year) {
      filtered = filtered.filter((movie) => movie.year === parseInt(year));
    }

    return filtered;
  }, [searchQuery, genre, year]);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <PageContainer className="pb-20 md:pb-8">
      <SectionHeader
        title="Search Movies"
        subtitle="Find your favorite movies by title, genre, or year"
      />

      {/* Search Form */}
      <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <SelectDropdown
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              options={genreOptions}
              placeholder="All Genres"
            />
            <SelectDropdown
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={yearOptions}
              placeholder="All Years"
            />
          </div>
          <div className="flex justify-end">
            <PrimaryButton type="submit">
              Search Movies
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-white">{searchResults.length}</span> results for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {searchResults.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            year={movie.year}
            rating={movie.rating}
            onClick={() => handleMovieClick(movie.id)}
          />
        ))}
      </div>

      {searchResults.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No movies found. Try a different search term.
          </p>
        </div>
      )}
    </PageContainer>
  );
};

export default Search;
