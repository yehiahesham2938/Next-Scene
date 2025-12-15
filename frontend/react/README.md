# Next-Scene React App

This is the React version of the Next-Scene movie discovery platform, converted from the original HTML/JavaScript implementation.

## Features

- 🎬 Browse and search thousands of movies
- 📝 Personal watchlist management
- 📊 Dashboard with viewing analytics
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🔐 User authentication
- 👑 Admin dashboard for administrators

## Tech Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:4000`

### Installation

1. Navigate to the react folder:
```bash
cd frontend/react
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React Context providers
├── layouts/         # Layout components
├── pages/           # Page components
├── services/        # API services
├── utils/           # Utility functions
├── App.jsx          # Main app component with routing
└── main.jsx         # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:4000
```

## License

This project is part of the Next-Scene platform.
