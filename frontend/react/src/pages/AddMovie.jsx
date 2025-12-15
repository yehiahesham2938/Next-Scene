import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    releaseYear: '2025',
    runtime: '120',
    genre: '',
    rating: '',
    poster: '',
    trailerUrl: '',
    description: '',
    cast: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e) => {
    setFormData(prev => ({ ...prev, rating: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterFile(file);
      setFileName(file.name);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, poster: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setPosterFile(file);
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, poster: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.director || !formData.releaseYear || !formData.genre || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.description.length < 50) {
      alert('Description must be at least 50 characters');
      return;
    }

    try {
      const movieData = {
        title: formData.title,
        director: formData.director,
        releaseYear: formData.releaseYear,
        runtime: formData.runtime ? parseInt(formData.runtime) : null,
        genre: formData.genre,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        poster: formData.poster,
        trailerUrl: formData.trailerUrl,
        description: formData.description,
        cast: formData.cast ? formData.cast.split(',').map(c => c.trim()) : []
      };

      await adminAPI.addMovie(movieData);
      alert('Movie added successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-sm text-gray-500 mb-4">
              <button onClick={() => navigate('/admin')} className="hover:text-gray-700">
                Admin Dashboard
              </button>
              <span className="mx-2">{'>'}</span>
              <span className="text-gray-700">Add Movie</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Movie</h1>
            <p className="text-gray-600 mb-8">Fill in the details below to add a new movie to the database.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Movie Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter movie title"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Director <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleInputChange}
                      placeholder="Enter director name"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Release Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="releaseYear"
                        value={formData.releaseYear}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Runtime (minutes)
                      </label>
                      <input
                        type="text"
                        name="runtime"
                        value={formData.runtime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genre <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                        required
                      >
                        <option value="">Select a genre</option>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Horror">Horror</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Romance">Romance</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Animation">Animation</option>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1 mb-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <label key={star} className="cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            value={star}
                            checked={formData.rating === star.toString()}
                            onChange={handleRatingChange}
                            className="hidden"
                          />
                          <i
                            className={`fa-solid fa-star text-2xl ${
                              formData.rating && parseInt(formData.rating) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          ></i>
                        </label>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs">Click to rate the movie</p>
                  </div>
                </div>
              </section>

              {/* Media */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Media</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Movie Poster</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="poster-input"
                    />
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('poster-input').click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-600 mb-2">Drag and drop an image here, or click to browse</p>
                        <button
                          type="button"
                          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                        >
                          Choose File
                        </button>
                        {fileName && (
                          <p className="mt-2 text-sm text-gray-500">Selected: {fileName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trailer URL</label>
                    <input
                      type="url"
                      name="trailerUrl"
                      value={formData.trailerUrl}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <p className="text-gray-500 text-xs mt-1">YouTube or Vimeo URL preferred</p>
                  </div>
                </div>
              </section>

              {/* Description */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Short summary <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">
                        {formData.description.length}/500
                      </span>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Enter movie summary..."
                      maxLength="500"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">Minimum 50 characters required</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Cast</label>
                    <input
                      type="text"
                      name="cast"
                      value={formData.cast}
                      onChange={handleInputChange}
                      placeholder="Actor 1, Actor 2, Actor 3..."
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <p className="text-gray-500 text-xs mt-1">Separate multiple actors with commas</p>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i>
                  Add Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddMovie;
