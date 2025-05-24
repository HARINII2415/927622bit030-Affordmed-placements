import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockData } from '../services/stockApi';

interface StockListProps {
  stocks: StockData[];
  loading: boolean;
  onSelectStock: (symbol: string) => void;
  selectedStock: string;
}

const StockList: React.FC<StockListProps> = ({ 
  stocks, 
  loading, 
  onSelectStock,
  selectedStock
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Stock List</h3>
        </div>
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow transition-all duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Stock List</h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {stocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => onSelectStock(stock.symbol)}
            className={`w-full flex items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-700 ${
              selectedStock === stock.symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-100 dark:bg-slate-700 flex items-center justify-center mr-3">
                <span className="font-bold text-sm text-blue-500">{stock.symbol}</span>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{stock.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vol: {(stock.volume / 1000000).toFixed(1)}M</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
              <div className={`flex items-center text-xs ${
                stock.change >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                <span>
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockList;