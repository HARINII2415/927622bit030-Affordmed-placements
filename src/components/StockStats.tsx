import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { StockData } from '../services/stockApi';

interface StockStatsProps {
  stock: StockData | null;
  averagePrice: number;
  standardDeviation: number;
  loading: boolean;
  timeInterval: number;
}

const StockStats: React.FC<StockStatsProps> = ({ 
  stock, 
  averagePrice, 
  standardDeviation,
  loading,
  timeInterval
}) => {
  if (loading || !stock) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Format market cap for display
  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  // Calculate volatility as standard deviation / average price * 100
  const volatility = (standardDeviation / averagePrice) * 100;

  // Compare current price to average
  const priceDiff = stock.price - averagePrice;
  const priceDiffPercent = (priceDiff / averagePrice) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {stock.name} ({stock.symbol}) Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <BarChart3 className="w-4 h-4 mr-1" />
            <span className="text-xs">Average Price</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">${averagePrice.toFixed(2)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Last {timeInterval} min</p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            {priceDiff >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
            )}
            <span className="text-xs">vs Average</span>
          </div>
          <p className={`text-lg font-semibold ${
            priceDiff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {priceDiff >= 0 ? '+' : ''}{priceDiff.toFixed(2)} ({priceDiffPercent.toFixed(2)}%)
          </p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-xs">Standard Deviation</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">${standardDeviation.toFixed(2)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Volatility: {volatility.toFixed(2)}%</p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <span className="text-xs">Market Cap</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatMarketCap(stock.marketCap)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Volume: {(stock.volume / 1000000).toFixed(1)}M</p>
        </div>
      </div>
    </div>
  );
};

export default StockStats;