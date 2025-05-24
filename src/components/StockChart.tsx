import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { StockPricePoint } from '../services/stockApi';

interface StockChartProps {
  data: StockPricePoint[];
  averagePrice: number;
  symbol: string;
  loading: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ data, averagePrice, symbol, loading }) => {
  const [hoveredPoint, setHoveredPoint] = useState<StockPricePoint | null>(null);
  
  // Format the timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return format(parseISO(timestamp), 'HH:mm');
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      setHoveredPoint(data);
      
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-700 rounded-lg shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(parseISO(data.timestamp), 'MMM dd, yyyy HH:mm:ss')}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${data.price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {data.price > averagePrice 
              ? `${((data.price - averagePrice) / averagePrice * 100).toFixed(2)}% above average`
              : `${((averagePrice - data.price) / averagePrice * 100).toFixed(2)}% below average`
            }
          </p>
        </div>
      );
    }
    
    setHoveredPoint(null);
    return null;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 mb-3"></div>
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Calculate min and max values for Y axis with some padding
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{symbol} Price Chart</h3>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Price</span>
          <div className="w-3 h-3 rounded-full bg-green-500 mx-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Average: ${averagePrice}</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp} 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af" 
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af" 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              y={averagePrice} 
              stroke="#10b981" 
              strokeDasharray="3 3" 
              label={{ 
                value: `Avg: $${averagePrice}`, 
                position: 'insideBottomRight',
                fill: '#10b981',
                fontSize: 12
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} 
              dot={false}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {hoveredPoint && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg transition-all duration-200">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {format(parseISO(hoveredPoint.timestamp), 'HH:mm:ss')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
              <p className="font-medium text-gray-900 dark:text-white">
                ${hoveredPoint.price.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">vs Average</p>
              <p className={`font-medium ${hoveredPoint.price > averagePrice 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'}`}>
                {hoveredPoint.price > averagePrice ? '+' : ''}
                ${(hoveredPoint.price - averagePrice).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">% Difference</p>
              <p className={`font-medium ${hoveredPoint.price > averagePrice 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'}`}>
                {hoveredPoint.price > averagePrice ? '+' : ''}
                {((hoveredPoint.price - averagePrice) / averagePrice * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;