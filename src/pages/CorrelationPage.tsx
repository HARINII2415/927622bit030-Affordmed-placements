import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCorrelationMatrix, 
  getStockHistory, 
  calculateAveragePrice, 
  calculateStandardDeviation,
  STOCK_SYMBOLS
} from '../services/stockApi';
import CorrelationHeatmap from '../components/CorrelationHeatmap';

interface CorrelationPageProps {
  timeInterval: number;
}

const CorrelationPage: React.FC<CorrelationPageProps> = ({ timeInterval }) => {
  const [correlationData, setCorrelationData] = useState<{ symbols: string[], data: number[][] }>({
    symbols: [],
    data: []
  });
  const [stockAverages, setStockAverages] = useState<Record<string, number>>({});
  const [stockStdDevs, setStockStdDevs] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCorrelationData = async () => {
      setLoading(true);
      try {
        // Get correlation matrix
        const matrix = await getCorrelationMatrix(timeInterval);
        setCorrelationData(matrix);
        
        // Calculate averages and standard deviations for each stock
        const averages: Record<string, number> = {};
        const stdDevs: Record<string, number> = {};
        
        for (const symbol of STOCK_SYMBOLS) {
          const history = await getStockHistory(symbol, timeInterval);
          averages[symbol] = calculateAveragePrice(history);
          stdDevs[symbol] = calculateStandardDeviation(history);
        }
        
        setStockAverages(averages);
        setStockStdDevs(stdDevs);
      } catch (error) {
        console.error('Failed to fetch correlation data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCorrelationData();
  }, [timeInterval]);
  
  // We don't have react-router set up, so we'll create a simple navigation function
  const handleSelectStock = (symbol: string) => {
    // Since we don't have actual navigation in this demo, we can use the browser's history API
    window.history.pushState({}, '', `?stock=${symbol}`);
    // Or alternatively, we can pass this up to the parent component to change the view
    // For demo purposes, we'll just log it
    console.log(`Selected stock: ${symbol}`);
  };
  
  return (
    <div>
      <CorrelationHeatmap 
        correlationData={correlationData}
        onSelectStock={handleSelectStock}
        averages={stockAverages}
        standardDeviations={stockStdDevs}
        loading={loading}
      />
      
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Understanding Stock Correlations
        </h3>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            The heatmap above shows the correlation between stock price movements over the past {timeInterval} minutes.
            Correlation values range from -1 to 1:
          </p>
          
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <span className="inline-block w-4 h-4 bg-green-600 rounded-sm mr-2"></span>
              <strong>Strong positive correlation (0.7 to 1.0):</strong> Stocks move in the same direction
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-green-400 rounded-sm mr-2"></span>
              <strong>Moderate positive correlation (0.3 to 0.7):</strong> Stocks tend to move in the same direction
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded-sm mr-2"></span>
              <strong>Little to no correlation (-0.3 to 0.3):</strong> No consistent relationship
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-orange-400 rounded-sm mr-2"></span>
              <strong>Moderate negative correlation (-0.7 to -0.3):</strong> Stocks tend to move in opposite directions
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-red-600 rounded-sm mr-2"></span>
              <strong>Strong negative correlation (-1.0 to -0.7):</strong> Stocks move in opposite directions
            </li>
          </ul>
          
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            Hover over or click on the stock symbols to see their average price and standard deviation over this time period.
            This information can help you identify potential diversification opportunities in your portfolio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorrelationPage;