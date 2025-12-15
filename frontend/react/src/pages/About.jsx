const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">About Next-Scene</h1>

      <div className="space-y-6 text-gray-600 dark:text-gray-400">
        <p className="text-lg">
          Next-Scene is your ultimate destination for discovering and managing your movie watching experience.
        </p>

        <p>
          We believe that everyone deserves a personalized movie discovery platform that helps them find
          their next favorite film. Whether you're a casual moviegoer or a cinephile, Next-Scene provides
          the tools you need to explore, organize, and track your movie journey.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Our Mission</h2>
        <p>
          To make movie discovery simple, enjoyable, and personalized for everyone. We combine powerful
          search capabilities with intuitive watchlist management to create the perfect movie companion.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Smart search across thousands of movies</li>
          <li>Personal watchlist management</li>
          <li>Track your viewing history</li>
          <li>Get insights with analytics dashboard</li>
          <li>Dark mode support</li>
          <li>Responsive design for all devices</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Team</h2>
        <p>
          Built with passion by a team of movie enthusiasts and developers who love great cinema
          and great user experiences.
        </p>
      </div>
    </div>
  );
};

export default About;
