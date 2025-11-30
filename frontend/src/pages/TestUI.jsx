import { useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  InputField,
  SelectDropdown,
  PageContainer,
  SectionHeader,
  MovieCard,
  ThemeToggle,
} from '../components';

const TestUI = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const genreOptions = [
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'horror', label: 'Horror' },
    { value: 'scifi', label: 'Sci-Fi' },
  ];

  const sampleMovies = [
    { id: 1, title: 'The Dark Knight', year: 2008, rating: 9.0, poster: null },
    { id: 2, title: 'Inception', year: 2010, rating: 8.8, poster: null },
    { id: 3, title: 'Interstellar', year: 2014, rating: 8.6, poster: null },
    { id: 4, title: 'The Matrix', year: 1999, rating: 8.7, poster: null },
  ];

  const handleMovieClick = (title) => {
    alert(`Clicked on: ${title}`);
  };

  return (
    <PageContainer>
      {/* Theme Toggle */}
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>

      {/* Header Section */}
      <SectionHeader
        title="UI Components Test Page"
        subtitle="Testing all reusable components with different configurations"
        align="center"
      />

      {/* Buttons Section */}
      <div className="mb-12">
        <SectionHeader title="Buttons" subtitle="Primary and Secondary button variants" />
        <div className="flex flex-wrap gap-4">
          <PrimaryButton onClick={() => alert('Primary clicked!')}>
            Primary Button
          </PrimaryButton>
          <SecondaryButton onClick={() => alert('Secondary clicked!')}>
            Secondary Button
          </SecondaryButton>
          <PrimaryButton disabled>Disabled Primary</PrimaryButton>
          <SecondaryButton disabled>Disabled Secondary</SecondaryButton>
        </div>
      </div>

      {/* Input Fields Section */}
      <div className="mb-12">
        <SectionHeader title="Input Fields" subtitle="Text inputs with labels and icons" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <InputField
            label="Email Address"
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your email"
            required
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
          />
          <InputField
            label="Search Movies"
            type="text"
            placeholder="Search..."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter password"
            required
          />
          <InputField
            label="With Error"
            type="text"
            placeholder="This field has an error"
            error="This field is required"
          />
        </div>
      </div>

      {/* Select Dropdown Section */}
      <div className="mb-12">
        <SectionHeader title="Select Dropdowns" subtitle="Dropdown menus for selections" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <SelectDropdown
            label="Favorite Genre"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            options={genreOptions}
            placeholder="Choose a genre"
            required
          />
          <SelectDropdown
            label="With Error"
            value=""
            onChange={() => {}}
            options={genreOptions}
            error="Please select an option"
          />
        </div>
      </div>

      {/* Movie Cards Section */}
      <div className="mb-12">
        <SectionHeader
          title="Movie Cards"
          subtitle="Displaying movie information in card format"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              poster={movie.poster}
              onClick={() => handleMovieClick(movie.title)}
            />
          ))}
        </div>
      </div>

      {/* Combined Example */}
      <div className="mb-12">
        <SectionHeader
          title="Combined Example"
          subtitle="A real-world form using multiple components"
          align="center"
        />
        <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <InputField
              label="Movie Title"
              type="text"
              placeholder="Enter movie title"
              required
            />
            <SelectDropdown
              label="Genre"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={genreOptions}
              required
            />
            <InputField
              label="Release Year"
              type="number"
              placeholder="2024"
              required
            />
            <div className="flex gap-4 pt-4">
              <PrimaryButton type="submit" className="flex-1">
                Submit
              </PrimaryButton>
              <SecondaryButton type="button" className="flex-1">
                Cancel
              </SecondaryButton>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default TestUI;
