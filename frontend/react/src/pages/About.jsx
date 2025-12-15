const About = () => {
  const teamMembers = [
    {
      name: 'Yehia Hesham',
      role: 'Team Lead & Full-Stack Developer',
      id: '202202135',
      image: '/img/team/yehia.jpeg',
      borderColor: 'border-blue-500',
      roleColor: 'text-blue-600',
      description: 'Team Leadership & Full-Stack Development'
    },
    {
      name: 'Seif Amr',
      role: 'Full-Stack Developer',
      id: '202201510',
      image: '/img/team/seif.jpeg',
      borderColor: 'border-green-500',
      roleColor: 'text-green-600',
      description: 'Full-Stack Development'
    },
    {
      name: 'Ahmed Sameh',
      role: 'Full-Stack Developer',
      id: '202202151',
      image: '/img/team/ahmed-sameh.jpeg',
      borderColor: 'border-purple-500',
      roleColor: 'text-purple-600',
      description: 'Full-Stack Development'
    },
    {
      name: 'Ahmed Wael',
      role: 'Full-Stack Developer',
      id: '202201415',
      image: '/img/team/ahmed-wael.jpg',
      borderColor: 'border-orange-500',
      roleColor: 'text-orange-600',
      description: 'Full-Stack Development'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 mt-16 sm:mt-0">
        {/* Project Overview Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-solid fa-clapperboard text-gray-900 dark:text-white text-3xl"></i>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Project</h2>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                <strong>Next Scene</strong> is a modern web application prototype designed for efficient movie discovery and watchlist management. Our platform empowers users to explore trending films, view essential details, and organize their personal list of films to watch.
              </p>

              <p className="text-lg leading-relaxed">
                Built with cutting-edge web technologies, Next Scene combines beautiful design with powerful functionality to create an intuitive movie discovery experience. Whether you're searching for your next favorite film or managing your watchlist, Next Scene makes it simple and enjoyable.
              </p>

              {/* Key Features */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mt-6 transition-colors">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-600 mt-1"></i>
                    <span>Browse trending movies and latest releases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-600 mt-1"></i>
                    <span>View detailed movie information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-600 mt-1"></i>
                    <span>Create and manage personal watchlists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-600 mt-1"></i>
                    <span>Smart search functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-600 mt-1"></i>
                    <span>User-friendly interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-600 mt-1"></i>
                    <span>Responsive design for all devices</span>
                  </li>
                </ul>
              </div>

              {/* Technology Stack */}
              <div className="bg-gray-900 dark:bg-gray-700 text-white rounded-lg p-6 mt-6 transition-colors">
                <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gray-800 dark:bg-gray-600 px-4 py-2 rounded text-sm">HTML5</span>
                  <span className="bg-gray-800 dark:bg-gray-600 px-4 py-2 rounded text-sm">Tailwind CSS</span>
                  <span className="bg-gray-800 dark:bg-gray-600 px-4 py-2 rounded text-sm">JavaScript</span>
                  <span className="bg-gray-800 dark:bg-gray-600 px-4 py-2 rounded text-sm">React</span>
                  <span className="bg-gray-800 dark:bg-gray-600 px-4 py-2 rounded text-sm">Node.js</span>
                  <span className="bg-gray-800 dark:bg-gray-600 px-4 py-2 rounded text-sm">Vite</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">The talented developers behind Next Scene</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center hover:shadow-xl transition duration-300">
                <div className="w-40 h-40 mx-auto mb-6 overflow-hidden rounded-full">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={`w-full h-full object-cover object-top scale-200 shadow-lg border-4 ${member.borderColor} rounded-full`}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="40" fill="%23666"%3E' + member.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                <p className={`text-sm font-medium ${member.roleColor} mb-2`}>{member.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">ID: {member.id}</p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{member.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Team Values */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <i className="fa-solid fa-lightbulb text-yellow-500 text-3xl mb-3"></i>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Innovation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Constantly pushing boundaries with creative solutions</p>
              </div>
              <div className="text-center">
                <i className="fa-solid fa-users text-blue-500 text-3xl mb-3"></i>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Collaboration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Working together to achieve excellence</p>
              </div>
              <div className="text-center">
                <i className="fa-solid fa-star text-purple-500 text-3xl mb-3"></i>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quality</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Committed to delivering the best user experience</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
