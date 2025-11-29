import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ThemeToggle from './components/ThemeToggle'
import { useTheme } from './context/ThemeContext'

function App() {
  const [count, setCount] = useState(0)
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center transition-colors">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="h-16 w-16 hover:animate-spin transition-transform" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="h-16 w-16 hover:animate-spin transition-transform" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 transition-colors">Vite + React</h1>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 transition-colors">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors">
            Edit <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
          ✨ Tailwind CSS + Dark Mode working! Current theme: <strong>{theme}</strong>
        </p>
      </div>
    </div>
  )
}

export default App

