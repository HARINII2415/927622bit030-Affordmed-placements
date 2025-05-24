import React, { useState } from 'react';
import { BarChart3, ActivitySquare, Moon, Sun } from 'lucide-react';
import Header from './components/Header';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

function App() {
  const [activeTab, setActiveTab] = useState<'stocks' | 'correlation'>('stocks');
  const [timeInterval, setTimeInterval] = useState<number>(30);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => setActiveTab('stocks')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === 'stocks'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span>Stock Charts</span>
            </button>
            <button
              onClick={() => setActiveTab('correlation')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === 'correlation'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <ActivitySquare className="w-4 h-4 mr-2" />
              <span>Correlation</span>
            </button>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="timeInterval">
                Time Interval (minutes)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="timeInterval"
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={timeInterval}
                  onChange={(e) => setTimeInterval(parseInt(e.target.value))}
                  className="w-40 accent-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{timeInterval}</span>
              </div>
            </div>
          </div>
        </div>
        
        {activeTab === 'stocks' ? (
          <StockPage timeInterval={timeInterval} />
        ) : (
          <CorrelationPage timeInterval={timeInterval} />
        )}
      </main>
    </div>
  );
}

export default App;