import fetch from "node-fetch";
import { MongoClient } from "mongodb";

const OMDB_API_KEY = "8ac08f44";

// --------------------------------------
// DB connection
// --------------------------------------
const DEFAULT_URI =
  "mongodb+srv://yehiahesham:XufK5QFWV1PikUsm@next-scene.i8icl8s.mongodb.net/Next-Scene?appName=Next-Scene&retryWrites=true&w=majority";

const client = new MongoClient(DEFAULT_URI);

// ---------------------------------------
// 50 movies
// ---------------------------------------
const titles = [
  "Oppenheimer", "Barbie", "Avatar: The Way of Water", "The Dark Knight",
  "Inception", "The Shawshank Redemption", "The Godfather",
  "Pulp Fiction", "Interstellar", "Fight Club", "Dune: Part Two",
  "Joker", "Avengers: Endgame", "Spider-Man: No Way Home", "Tenet",
  "The Matrix", "The Lord of the Rings: The Fellowship of the Ring",
  "The Lord of the Rings: The Return of the King",
  "The Lord of the Rings: The Two Towers",
  "Gladiator", "The Green Mile", "Forrest Gump", "The Social Network",
  "Whiplash", "La La Land", "Mad Max: Fury Road", "Parasite",
  "Saving Private Ryan", "The Prestige", "The Wolf of Wall Street",
  "Shutter Island", "The Revenant", "Django Unchained",
  "The Batman", "Black Panther", "Deadpool", "Logan",
  "Inside Out", "Finding Nemo", "Toy Story", "The Lion King",
  "Up", "Coco", "WALL·E", "Soul", "Frozen", "Moana",
  "Memento", "American Psycho"
]; 

// ------------------------------
// Fetch movies
// ------------------------------
async function fetchMovie(title) {
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
    title
  )}&plot=full&r=json`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === "False") {
    console.log(`❌ Not found: ${title}`);
    return null;
  }

  return {
    title: data.Title,
    director: data.Director,
    releaseYear: data.Year,
    runtime: data.Runtime !== "N/A" ? parseInt(data.Runtime) : null,
    genre: data.Genre?.split(",")[0]?.trim() ?? "",
    rating: data.imdbRating !== "N/A" ? parseFloat(data.imdbRating) : null,
    poster: data.Poster,
    trailerUrl: "", // OMDb does not provide trailers
    description: data.Plot,
    mainCast: data.Actors,
    source: "OMDb",
    createdAt: new Date()
  };
}

// ------------------------------
// MAIN FUNCTION
// ------------------------------
async function run() {
  if (!OMDB_API_KEY || OMDB_API_KEY.includes("REPLACE")) {
    console.log("❌ Please set your OMDB API key first.");
    process.exit(1);
  }
  
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("Next-Scene");
    const moviesCollection = db.collection("movies");

    const insertedMovies = [];

    for (const title of titles) {
      console.log(`📀 Fetching: ${title}`);
      const movie = await fetchMovie(title);

      if (movie) {
        await moviesCollection.insertOne(movie);
        console.log(`✔ Inserted: ${movie.title}`);
        insertedMovies.push(movie.title);
      }

      await new Promise((r) => setTimeout(r, 500));
    }

    console.log("\n🎉 DONE!");
    console.log("Movies inserted:", insertedMovies.length);
    console.log(insertedMovies);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();
