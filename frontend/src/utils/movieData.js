// Sample movie data
export const movies = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    duration: '2h 28min',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: null,
  },
  {
    id: 2,
    title: 'Interstellar',
    year: 2014,
    rating: 8.6,
    duration: '2h 49min',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster: null,
  },
  {
    id: 3,
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    duration: '2h 32min',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster: null,
  },
  {
    id: 4,
    title: 'The Matrix',
    year: 1999,
    rating: 8.7,
    duration: '2h 16min',
    genres: ['Action', 'Sci-Fi'],
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
    plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    poster: null,
  },
  {
    id: 5,
    title: 'Pulp Fiction',
    year: 1994,
    rating: 8.9,
    duration: '2h 34min',
    genres: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'],
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    poster: null,
  },
  {
    id: 6,
    title: 'Fight Club',
    year: 1999,
    rating: 8.8,
    duration: '2h 19min',
    genres: ['Drama'],
    director: 'David Fincher',
    cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter', 'Meat Loaf'],
    plot: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    poster: null,
  },
  {
    id: 7,
    title: 'Forrest Gump',
    year: 1994,
    rating: 8.8,
    duration: '2h 22min',
    genres: ['Drama', 'Romance'],
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise', 'Sally Field'],
    plot: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
    poster: null,
  },
  {
    id: 8,
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    duration: '2h 22min',
    genres: ['Drama'],
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'],
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster: null,
  },
  {
    id: 9,
    title: 'The Godfather',
    year: 1972,
    rating: 9.2,
    duration: '2h 55min',
    genres: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan', 'Diane Keaton'],
    plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    poster: null,
  },
  {
    id: 10,
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
    rating: 9.0,
    duration: '3h 21min',
    genres: ['Action', 'Adventure', 'Drama'],
    director: 'Peter Jackson',
    cast: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen', 'Orlando Bloom'],
    plot: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
    poster: null,
  },
  {
    id: 11,
    title: 'Goodfellas',
    year: 1990,
    rating: 8.7,
    duration: '2h 26min',
    genres: ['Biography', 'Crime', 'Drama'],
    director: 'Martin Scorsese',
    cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci', 'Lorraine Bracco'],
    plot: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife and his partners in crime.',
    poster: null,
  },
  {
    id: 12,
    title: 'Schindler\'s List',
    year: 1993,
    rating: 9.0,
    duration: '3h 15min',
    genres: ['Biography', 'Drama', 'History'],
    director: 'Steven Spielberg',
    cast: ['Liam Neeson', 'Ralph Fiennes', 'Ben Kingsley', 'Caroline Goodall'],
    plot: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.',
    poster: null,
  },
  {
    id: 13,
    title: 'The Silence of the Lambs',
    year: 1991,
    rating: 8.6,
    duration: '1h 58min',
    genres: ['Crime', 'Drama', 'Thriller'],
    director: 'Jonathan Demme',
    cast: ['Jodie Foster', 'Anthony Hopkins', 'Lawrence A. Bonney', 'Kasi Lemmons'],
    plot: 'A young F.B.I. cadet must receive the help of an incarcerated cannibal killer to catch another serial killer.',
    poster: null,
  },
  {
    id: 14,
    title: 'Saving Private Ryan',
    year: 1998,
    rating: 8.6,
    duration: '2h 49min',
    genres: ['Drama', 'War'],
    director: 'Steven Spielberg',
    cast: ['Tom Hanks', 'Matt Damon', 'Tom Sizemore', 'Edward Burns'],
    plot: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
    poster: null,
  },
  {
    id: 15,
    title: 'The Green Mile',
    year: 1999,
    rating: 8.6,
    duration: '3h 9min',
    genres: ['Crime', 'Drama', 'Fantasy'],
    director: 'Frank Darabont',
    cast: ['Tom Hanks', 'Michael Clarke Duncan', 'David Morse', 'Bonnie Hunt'],
    plot: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
    poster: null,
  },
  {
    id: 16,
    title: 'Parasite',
    year: 2019,
    rating: 8.5,
    duration: '2h 12min',
    genres: ['Comedy', 'Drama', 'Thriller'],
    director: 'Bong Joon Ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    poster: null,
  },
];

// Get movies by genre
export const getMoviesByGenre = (genre) => {
  if (!genre) return movies;
  return movies.filter((movie) => 
    movie.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
  );
};

// Get movies by year
export const getMoviesByYear = (year) => {
  if (!year) return movies;
  return movies.filter((movie) => movie.year === parseInt(year));
};

// Search movies by title
export const searchMovies = (query) => {
  if (!query) return movies;
  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
};

// Get movie by ID
export const getMovieById = (id) => {
  return movies.find((movie) => movie.id === parseInt(id));
};

// Get trending movies (top rated)
export const getTrendingMovies = (limit = 4) => {
  return [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Get popular movies (sorted by year, newest first)
export const getPopularMovies = (limit = 4) => {
  return [...movies]
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
};
