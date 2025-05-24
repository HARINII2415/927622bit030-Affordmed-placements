import React, { useState, useEffect } from 'react';
import { 
  getStocks, 
  getStockHistory, 
  calculateAveragePrice, 
  calculateStandardDeviation,
  StockData, 
  StockPricePoint 
} from '../services/stockApi';
import StockList from '../components/StockList';
import StockChart from '../components/StockChart';
import StockStats from '../components/StockStats';

interface StockPageProps {
  timeInterval: number;
}

const StockPage: React.FC<StockPageProps> = ({ timeInterval }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [priceHistory, setPriceHistory] = useState<StockPricePoint[]>([]);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [standardDeviation, setStandardDeviation] = useState<number>(0);
  const [loadingStocks, setLoadingStocks] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  
  // Fetch all stocks on initial load
  useEffect(() => {
    const fetchStocks = async () => {
      setLoadingStocks(true);
      try {
        const data = await getStocks();
        setStocks(data);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setLoadingStocks(false);
      }
    };
    
    fetchStocks();
    
    // Refresh stock data every 10 seconds
    const intervalId = setInterval(fetchStocks, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Fetch price history when selected stock or time interval changes
  useEffect(() => {
    const fetchStockHistory = async () => {
      setLoadingHistory(true);
      try {
        const data = await getStockHistory(selectedStock, timeInterval);
        setPriceHistory(data);
        
        // Calculate statistics
        const avg = calculateAveragePrice(data);
        const stdDev = calculateStandardDeviation(data);
        setAveragePrice(avg);
        setStandardDeviation(stdDev);
      } catch (error) {
        console.error('Failed to fetch stock history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    
    fetchStockHistory();
  }, [selectedStock, timeInterval]);
  
  // Find the currently selected stock data
  const currentStock = stocks.find(stock => stock.symbol === selectedStock) || null;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <StockChart 
          data={priceHistory} 
          averagePrice={averagePrice} 
          symbol={selectedStock} 
          loading={loadingHistory} 
        />
        
        <StockStats 
          stock={currentStock} 
          averagePrice={averagePrice} 
          standardDeviation={standardDeviation}
          loading={loadingStocks || loadingHistory}
          timeInterval={timeInterval}
        />
      </div>
      
      <div>
        <StockList 
          stocks={stocks} 
          loading={loadingStocks} 
          onSelectStock={setSelectedStock}
          selectedStock={selectedStock}
        />
      </div>
    </div>
  );
};

export default StockPage;